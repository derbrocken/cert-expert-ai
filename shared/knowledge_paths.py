"""
shared/knowledge_paths.py — Single source of truth for knowledge layer paths.

Blueprint loader and context builder resolve modules only through these paths.
Do not hardcode legacy folder numbers (5_products, 6_blueprint, etc.) elsewhere.
"""

from __future__ import annotations

from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
KNOWLEDGE_ROOT = PROJECT_ROOT / "knowledge"
BLUEPRINTS_DIR = KNOWLEDGE_ROOT / "7_blueprint"
PROMPTS_DIR = PROJECT_ROOT / "prompts"

# Logical context_modules category → physical directory under knowledge/
KNOWLEDGE_CATEGORY_DIRS: dict[str, Path] = {
    "standards": KNOWLEDGE_ROOT / "2_regulations",
    "sdls": KNOWLEDGE_ROOT / "3_sdls",
    "products": KNOWLEDGE_ROOT / "6_products",
    "rules": KNOWLEDGE_ROOT / "10_rules",
    "guides": KNOWLEDGE_ROOT / "8_guides",
    "examples": KNOWLEDGE_ROOT / "11_examples",
    "prompts": PROMPTS_DIR,
}
