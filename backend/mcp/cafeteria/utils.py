# backend/mcp/cafeteria/utils.py

"""
Utility functions for the Cafeteria MCP server.
Handles JSON file I/O and validation helpers.
"""

import json
from pathlib import Path
from typing import Any

# Path to the mock data file, resolved relative to this module's location
# so it works regardless of the working directory the server is launched from.
DATA_FILE = Path(__file__).parent / "data" / "menu.json"

# Meal types accepted by the /menu/{meal_type} endpoint.
VALID_MEAL_TYPES = {"breakfast", "lunch", "dinner"}


def read_json_file(path: Path) -> dict[str, Any]:
    """
    Read and parse a JSON file containing a single object.

    Raises:
        FileNotFoundError: if the file does not exist.
        ValueError: if the file content is not valid JSON or not an object.
    """
    if not path.exists():
        raise FileNotFoundError(f"Data file not found: {path}")

    with open(path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as exc:
            raise ValueError(f"Invalid JSON in {path}: {exc}") from exc

    if not isinstance(data, dict):
        raise ValueError(f"Expected a JSON object in {path}, got {type(data).__name__}")

    return data


def normalize_meal_type(meal_type: str) -> str:
    """Lowercase and strip whitespace for case-insensitive meal type comparisons."""
    return meal_type.strip().lower()


def is_valid_meal_type(meal_type: str) -> bool:
    """Return True if the (normalized) meal type is one of the allowed values."""
    return normalize_meal_type(meal_type) in VALID_MEAL_TYPES