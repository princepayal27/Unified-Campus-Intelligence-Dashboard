# backend/mcp/academics/utils.py

"""
Utility functions for the Academic Handbook Semantic Search MCP server.
Handles JSON file I/O, text preprocessing, and chunk validation.
"""

import json
from pathlib import Path
from typing import Any

# Path to the handbook chunk data, resolved relative to this module's
# location so it works regardless of the working directory the server
# is launched from.
DATA_FILE = Path(__file__).parent / "data" / "academic_handbook_chunks.json"

# Path to the structured academics dashboard data (attendance, classes, assignments).
DASHBOARD_DATA_FILE = Path(__file__).parent / "data" / "academics_data.json"


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


def read_json_object(path: Path) -> dict[str, Any]:
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


def preprocess_text(text: str) -> str:
    """
    Basic text normalization applied before embedding.

    Collapses extra whitespace and strips leading/trailing spaces so
    embeddings are not affected by formatting noise.
    """
    return " ".join(text.split()).strip()


def validate_chunk(record: dict[str, Any]) -> bool:
    """
    Validate that a raw chunk record has the required non-empty fields.

    Returns:
        True if the record looks like a valid handbook chunk.
    """
    required_fields = ("id", "section", "content")

    for field in required_fields:
        value = record.get(field)
        if not isinstance(value, str) or not value.strip():
            return False

    return True


def is_blank_query(query: str) -> bool:
    """Return True if the query is empty or whitespace-only."""
    return not query or not query.strip()