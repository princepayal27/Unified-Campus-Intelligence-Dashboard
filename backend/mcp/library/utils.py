# backend/mcp/library/utils.py

"""
Utility functions for the Library MCP server.
Handles JSON file I/O and basic validation helpers.
"""

import json
from pathlib import Path
from typing import Any

# Path to the mock data file, resolved relative to this module's location
# so it works regardless of the working directory the server is launched from.
DATA_FILE = Path(__file__).parent / "data" / "books.json"


def read_json_file(path: Path) -> list[dict[str, Any]]:
    """
    Read and parse a JSON file containing a list of records.

    Raises:
        FileNotFoundError: if the file does not exist.
        ValueError: if the file content is not valid JSON or not a list.
    """
    if not path.exists():
        raise FileNotFoundError(f"Data file not found: {path}")

    with open(path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as exc:
            raise ValueError(f"Invalid JSON in {path}: {exc}") from exc

    if not isinstance(data, list):
        raise ValueError(f"Expected a JSON array in {path}, got {type(data).__name__}")

    return data


def normalize_text(value: str) -> str:
    """Lowercase and strip whitespace for case-insensitive comparisons."""
    return value.strip().lower()


def is_non_empty_string(value: Any) -> bool:
    """Validation helper: True if value is a non-empty string."""
    return isinstance(value, str) and len(value.strip()) > 0