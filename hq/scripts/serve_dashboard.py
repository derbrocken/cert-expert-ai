#!/usr/bin/env python3
"""Lokaler HQ-Dashboard-Server (HTML + API für Pins und Abhaken)."""

from __future__ import annotations

import json
import mimetypes
import subprocess
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

HQ = Path(__file__).resolve().parents[1]
REPO = HQ.parent
HTML_DIR = HQ / "00_Dashboard" / "html"
SCRIPTS = HQ / "scripts"
sys.path.insert(0, str(SCRIPTS))

import finance_store  # noqa: E402
import income_store  # noqa: E402
import live_messung_store  # noqa: E402
import pins_store  # noqa: E402

# build_dashboard nach Pfad laden
import importlib.util

_bd_spec = importlib.util.spec_from_file_location(
    "build_dashboard", SCRIPTS / "build_dashboard_html.py"
)
bd = importlib.util.module_from_spec(_bd_spec)
sys.modules["build_dashboard"] = bd
assert _bd_spec.loader
_bd_spec.loader.exec_module(bd)


def rebuild() -> None:
    subprocess.run(
        [sys.executable, str(SCRIPTS / "build_dashboard_html.py")],
        cwd=str(REPO),
        check=True,
    )


def _load_dashboard_payload() -> dict:
    data_path = HTML_DIR / "dashboard_data.json"
    if not data_path.is_file():
        rebuild()
    return json.loads(data_path.read_text(encoding="utf-8"))


def _find_backlog_section(payload: dict, section_id: str) -> dict | None:
    for sec in payload.get("backlog", {}).get("sections", []):
        if sec.get("id") == section_id:
            return sec
    return None


class DashboardHandler(BaseHTTPRequestHandler):
    server_version = "HQDashboard/1.0"

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def _send_json(self, data: object, status: int = 200) -> None:
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b"{}"
        return json.loads(raw.decode("utf-8") or "{}")

    def _serve_file(self, path: Path, content_type: str) -> None:
        if not path.is_file():
            self.send_error(404)
            return
        data = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/api/data":
            data_path = HTML_DIR / "dashboard_data.json"
            if not data_path.is_file():
                rebuild()
            payload = json.loads(data_path.read_text(encoding="utf-8"))
            payload["finance"] = finance_store.load_business_costs()
            payload["finance_income"] = income_store.load_business_income()
            self._send_json(payload)
            return
        if path == "/api/finance":
            self._send_json(finance_store.load_business_costs())
            return
        if path == "/api/finance/income":
            self._send_json(income_store.load_business_income())
            return
        if path in ("", "/"):
            path = "/index.html"
        rel = path.lstrip("/")
        file_path = (HTML_DIR / rel).resolve()
        if not str(file_path).startswith(str(HTML_DIR.resolve())):
            self.send_error(403)
            return
        if file_path.suffix == ".css":
            self._serve_file(file_path, "text/css; charset=utf-8")
        elif file_path.suffix == ".js":
            self._serve_file(file_path, "application/javascript; charset=utf-8")
        elif file_path.suffix == ".html":
            self._serve_file(file_path, "text/html; charset=utf-8")
        else:
            mime, _ = mimetypes.guess_type(str(file_path))
            if mime and file_path.is_file():
                self._serve_file(file_path, mime)
            else:
                self.send_error(404)

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        body = self._read_json()
        try:
            if path == "/api/rebuild":
                rebuild()
                self._send_json({"ok": True})
                return

            if path == "/api/check":
                item_id = str(body.get("id", ""))
                done = bool(body.get("done", True))
                if not item_id:
                    self._send_json({"ok": False, "error": "id fehlt"}, 400)
                    return
                if done:
                    bd._mark_todo_done_by_short_id(item_id)
                    bd._set_dashboard_checkbox_mirrors(item_id, True)
                else:
                    bd._mark_todo_open_by_short_id(item_id)
                    bd._set_dashboard_checkbox_mirrors(item_id, False)
                rebuild()
                self._send_json({"ok": True})
                return

            if path == "/api/add-task":
                slug = str(body.get("slug", "")).strip()
                aufgabe = str(body.get("aufgabe", "")).strip()
                if not slug or not aufgabe:
                    self._send_json(
                        {"ok": False, "error": "slug und aufgabe erforderlich"},
                        400,
                    )
                    return
                try:
                    result = bd.add_customer_todo(
                        slug,
                        aufgabe,
                        frist=str(body.get("frist", "") or ""),
                        kategorie=str(
                            body.get("kategorie", "Intern / Allgemein")
                        ),
                        prioritaet=str(body.get("prioritaet", "normal")),
                        add_to_overview=bool(body.get("add_to_overview", True)),
                    )
                except FileNotFoundError as e:
                    self._send_json({"ok": False, "error": str(e)}, 404)
                    return
                except ValueError as e:
                    self._send_json({"ok": False, "error": str(e)}, 400)
                    return
                rebuild()
                self._send_json({"ok": True, **result})
                return

            if path == "/api/toggle-overview":
                item_id = str(body.get("id", ""))
                if not item_id:
                    self._send_json({"ok": False, "error": "id fehlt"}, 400)
                    return
                on = body.get("on")
                if on is not None:
                    pins_store.toggle_selected(item_id, on=bool(on))
                else:
                    pins_store.toggle_selected(item_id)
                rebuild()
                self._send_json({"ok": True})
                return

            if path == "/api/set-frist":
                item_id = str(body.get("id", ""))
                frist = str(body.get("frist", "")).strip()
                if not item_id or not frist:
                    self._send_json({"ok": False, "error": "id oder frist fehlt"}, 400)
                    return
                if item_id.startswith("bk-"):
                    self._send_json(
                        {"ok": False, "error": "Frist nur in ToDos.md — nicht im Pflege-Backlog"},
                        400,
                    )
                    return
                if not bd._set_todo_frist_by_short_id(item_id, frist):
                    self._send_json({"ok": False, "error": "To-do nicht gefunden"}, 404)
                    return
                rebuild()
                self._send_json({"ok": True})
                return

            if path == "/api/finance/add":
                posten = str(body.get("posten", "")).strip()
                anbieter = str(body.get("anbieter", "")).strip()
                amount = str(body.get("amount", "")).strip()
                note = str(body.get("note", "")).strip()
                if not posten or not amount:
                    self._send_json(
                        {"ok": False, "error": "posten und amount erforderlich"},
                        400,
                    )
                    return
                try:
                    payload = finance_store.add_business_cost(
                        posten,
                        anbieter,
                        amount,
                        note,
                        str(body.get("kategorie", "")),
                    )
                except ValueError as e:
                    self._send_json({"ok": False, "error": str(e)}, 400)
                    return
                self._send_json({"ok": True, **payload})
                return

            if path == "/api/finance/save-all":
                rows = body.get("items")
                if not isinstance(rows, list) or not rows:
                    self._send_json(
                        {"ok": False, "error": "items (Liste) erforderlich"},
                        400,
                    )
                    return
                try:
                    payload = finance_store.save_all_items(rows)
                except ValueError as e:
                    self._send_json({"ok": False, "error": str(e)}, 400)
                    return
                self._send_json({"ok": True, **payload})
                return

            if path == "/api/finance/update":
                item_id = str(body.get("id", "")).strip()
                posten = str(body.get("posten", "")).strip()
                anbieter = str(body.get("anbieter", "")).strip()
                amount = str(body.get("amount", "")).strip()
                note = str(body.get("note", "")).strip()
                if not item_id or not posten or not amount:
                    self._send_json(
                        {
                            "ok": False,
                            "error": "id, posten und amount erforderlich",
                        },
                        400,
                    )
                    return
                try:
                    payload = finance_store.update_business_cost(
                        item_id, posten, anbieter, amount, note
                    )
                except ValueError as e:
                    self._send_json({"ok": False, "error": str(e)}, 400)
                    return
                self._send_json({"ok": True, **payload})
                return

            if path == "/api/finance/income/add":
                kunde = str(body.get("kunde", "")).strip()
                amount = str(body.get("amount", "")).strip()
                status = str(body.get("status", "Offen")).strip()
                hq_ref = str(body.get("hq_ref", "")).strip()
                is_estimate = bool(body.get("is_estimate"))
                if not kunde or not amount:
                    self._send_json(
                        {"ok": False, "error": "kunde und amount erforderlich"},
                        400,
                    )
                    return
                try:
                    payload = income_store.add_business_income(
                        kunde, amount, status, hq_ref, is_estimate
                    )
                except ValueError as e:
                    self._send_json({"ok": False, "error": str(e)}, 400)
                    return
                self._send_json({"ok": True, **payload})
                return

            if path == "/api/finance/income/save-all":
                rows = body.get("items")
                if not isinstance(rows, list) or not rows:
                    self._send_json(
                        {"ok": False, "error": "items (Liste) erforderlich"},
                        400,
                    )
                    return
                try:
                    payload = income_store.save_all_items(rows)
                except ValueError as e:
                    self._send_json({"ok": False, "error": str(e)}, 400)
                    return
                self._send_json({"ok": True, **payload})
                return

            if path == "/api/live-messung":
                slug = str(body.get("slug", "")).strip()
                if not slug:
                    self._send_json({"ok": False, "error": "slug fehlt"}, 400)
                    return
                try:
                    record = live_messung_store.update_fields(slug, body)
                except FileNotFoundError:
                    self._send_json({"ok": False, "error": "Kunde nicht gefunden"}, 404)
                    return
                except ValueError as e:
                    self._send_json({"ok": False, "error": str(e)}, 400)
                    return
                rebuild()
                self._send_json({"ok": True, "record": record})
                return

            if path == "/api/overview-section":
                section_id = str(body.get("section_id", ""))
                select = bool(body.get("select", True))
                payload = _load_dashboard_payload()
                sec = _find_backlog_section(payload, section_id)
                if not sec:
                    self._send_json({"ok": False, "error": "Abschnitt nicht gefunden"}, 404)
                    return
                ids = [t["id"] for t in sec.get("items", []) if not t.get("done")]
                pins_store.toggle_section(ids, select=select)
                rebuild()
                self._send_json({"ok": True, "count": len(ids)})
                return

            self._send_json({"ok": False, "error": "unbekannter Pfad"}, 404)
        except subprocess.CalledProcessError as e:
            self._send_json({"ok": False, "error": f"Build fehlgeschlagen: {e}"}, 500)
        except Exception as e:
            self._send_json({"ok": False, "error": str(e)}, 500)


def main() -> None:
    port = 8765
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    HTML_DIR.mkdir(parents=True, exist_ok=True)
    if not (HTML_DIR / "dashboard_data.json").is_file():
        print("Erstelle dashboard_data.json …")
        rebuild()
    server = ThreadingHTTPServer(("127.0.0.1", port), DashboardHandler)
    url = f"http://127.0.0.1:{port}/"
    print(f"HQ Dashboard: {url}")
    print("Beenden: Ctrl+C")
    server.serve_forever()


if __name__ == "__main__":
    main()
