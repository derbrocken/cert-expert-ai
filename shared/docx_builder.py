"""
shared/docx_builder.py — Python subprocess bridge to the Node.js rendering layer.

Responsibilities:
- Load company data from inputs/company_data.json (or accept it directly)
- Merge company placeholders + bot placeholders + auto-injected currentDate
- Resolve template path from bot_output["document_type"]
- Write a temporary context JSON consumed by shared/renderer/render.js
- Call render.js via subprocess and parse its stdout JSON
- Raise DocxRenderError with diagnostics on any failure
- Clean up the temp context file reliably

Usage (from a bot):
    from shared.docx_builder import render_docx, DocxRenderError

    try:
        render_docx(bot_output=final_output, output_path="outputs/doc.docx")
    except DocxRenderError as e:
        print(f"Rendering failed: {e}")
"""

import json
import shutil
import subprocess
import uuid
from datetime import datetime
from pathlib import Path

# ── Paths resolved relative to this file ────────────────────────────────────
_MODULE_DIR = Path(__file__).parent
_PROJECT_ROOT = _MODULE_DIR.parent
_RENDERER = _MODULE_DIR / "renderer" / "render.js"
_DEFAULT_COMPANY_DATA = _PROJECT_ROOT / "inputs" / "company_data.json"
_DEFAULT_LOGO = _PROJECT_ROOT / "assets" / "cert_expert_logo.png"

RENDER_TIMEOUT = 30  # seconds


# ── Exception ────────────────────────────────────────────────────────────────

class DocxRenderError(RuntimeError):
    """Raised when the Node.js renderer returns an error or fails to run."""
    pass


# ── Node.js availability check (once at import time) ────────────────────────

def _check_node() -> None:
    if shutil.which("node") is None:
        raise RuntimeError(
            "Node.js not found. The DOCX rendering layer requires Node.js. "
            "Install from https://nodejs.org/ and ensure 'node' is in PATH."
        )


_check_node()


# ── Internal helpers ─────────────────────────────────────────────────────────

def _load_company_data(path: Path) -> dict:
    if not path.exists():
        raise FileNotFoundError(
            f"Company data file not found: {path}\n"
            f"Create inputs/company_data.json with Layer 1 placeholder values. "
            f"See docs/PLACEHOLDER_REGISTRY.md for required fields."
        )
    with open(path, encoding="utf-8") as f:
        raw = json.load(f)
    # Strip internal config keys (underscore-prefixed comments and LogoPath).
    # These are not DOCX placeholders and must not reach the renderer's
    # placeholder dict.
    return {k: v for k, v in raw.items() if not k.startswith("_")}


def _merge_placeholders(
    company_data: dict,
    bot_placeholders: dict,
) -> dict:
    """
    Merge placeholder layers with defined precedence:
      1. Company data (Layer 1) — lowest precedence
      2. Bot content (Layer 3) — overrides company data on any key clash
      3. currentDate — always overridden at render time, never caller-controlled

    Returns a flat dict ready to be passed to render.js.
    """
    merged = {}
    merged.update(company_data)
    merged.update(bot_placeholders)
    merged["currentDate"] = datetime.now().strftime("%B %-d, %Y")
    return merged


def _resolve_template(document_type: str) -> Path:
    template_path = _PROJECT_ROOT / "templates" / f"{document_type}.docx"
    return template_path


def _write_context(
    template_path: Path,
    output_path: str,
    logo_path: Path | None,
    placeholders: dict,
) -> Path:
    context = {
        "template": str(template_path),
        "output": output_path,
        "logo": str(logo_path) if logo_path and logo_path.exists() else None,
        "placeholders": placeholders,
    }

    temp_name = f"_context_{uuid.uuid4().hex}.json"
    temp_path = _MODULE_DIR / "renderer" / temp_name
    temp_path.write_text(
        json.dumps(context, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return temp_path


def _call_renderer(temp_path: Path) -> dict:
    """
    Invoke render.js as a subprocess and return its parsed stdout JSON.
    Raises DocxRenderError for timeout, empty output, or non-JSON output.
    """
    try:
        result = subprocess.run(
            ["node", str(_RENDERER), str(temp_path)],
            capture_output=True,
            text=True,
            timeout=RENDER_TIMEOUT,
            cwd=str(_PROJECT_ROOT),
        )
    except subprocess.TimeoutExpired:
        raise DocxRenderError(
            f"DOCX renderer timed out after {RENDER_TIMEOUT}s. "
            f"Template may be malformed or system resources are insufficient."
        )

    stdout = result.stdout.strip()
    stderr = result.stderr.strip()

    if not stdout:
        detail = f"stderr: {stderr}" if stderr else "no output on stdout or stderr"
        raise DocxRenderError(
            f"Renderer produced no output (exit code {result.returncode}). {detail}"
        )

    try:
        response = json.loads(stdout)
    except json.JSONDecodeError:
        raise DocxRenderError(
            f"Renderer output was not valid JSON (exit code {result.returncode}). "
            f"stdout: {stdout[:300]}"
        )

    if not response.get("success"):
        error_msg = response.get("error", "Unknown rendering error")
        raise DocxRenderError(
            f"Renderer failed (exit code {result.returncode}): {error_msg}"
        )

    return response


# ── Public API ───────────────────────────────────────────────────────────────

def render_docx(
    bot_output: dict,
    output_path: str,
    company_data: dict | None = None,
    logo_path: Path | str | None = _DEFAULT_LOGO,
) -> None:
    """
    Render a final DOCX document from bot output using the Node.js rendering layer.

    The function:
      1. Loads company data from inputs/company_data.json if not provided directly.
      2. Merges company placeholders + bot placeholders + auto-injected currentDate.
      3. Resolves the DOCX template from bot_output["document_type"].
      4. Writes a temporary context JSON for render.js.
      5. Calls render.js via subprocess.
      6. Parses the stdout JSON result.
      7. Raises DocxRenderError on any failure.
      8. Cleans up the temp context file in all cases.

    Args:
        bot_output:    Full enriched dict from quality_checker.check().
                       Must contain "document_type" and "placeholders".
        output_path:   Destination path for the rendered DOCX file.
        company_data:  Optional Layer 1 placeholder dict. If None, loaded from
                       inputs/company_data.json automatically.
        logo_path:     Path to the company logo image. Defaults to
                       assets/cert_expert_logo.png. Pass None to suppress logo.

    Raises:
        DocxRenderError: If rendering fails for any reason.
        FileNotFoundError: If inputs/company_data.json is missing and no
                           company_data dict was provided.
    """
    document_type = bot_output.get("document_type", "")
    if not document_type:
        raise DocxRenderError(
            "bot_output is missing 'document_type'. "
            "Cannot resolve template path without it."
        )

    if company_data is None:
        company_data = _load_company_data(_DEFAULT_COMPANY_DATA)

    # Extract LogoPath from company_data before building the placeholder dict.
    # LogoPath is a renderer config field, not a DOCX placeholder.
    # It is used only when no explicit logo_path argument was passed.
    company_logo_path_str = company_data.pop("LogoPath", None)
    if logo_path is _DEFAULT_LOGO and company_logo_path_str:
        logo_path = _PROJECT_ROOT / company_logo_path_str

    bot_placeholders = bot_output.get("placeholders", {})
    merged = _merge_placeholders(company_data, bot_placeholders)

    template_path = _resolve_template(document_type)

    if isinstance(logo_path, str):
        logo_path = Path(logo_path)

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    temp_path = _write_context(template_path, output_path, logo_path, merged)

    try:
        response = _call_renderer(temp_path)
        rendered_output = response.get("output", output_path)
        print(f"[docx_builder] DOCX gerendert: {rendered_output}")
    finally:
        try:
            temp_path.unlink(missing_ok=True)
        except Exception:
            pass
