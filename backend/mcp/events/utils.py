# backend/mcp/events/utils.py

"""
Utility functions for the Events MCP server.
Handles JSON file I/O, date parsing, and validation helpers.
"""

import json
from datetime import date, datetime
from pathlib import Path
from typing import Any

# Path to the mock data file, resolved relative to this module's location
# so it works regardless of the working directory the server is launched from.
DATA_FILE = Path(__file__).parent / "data" / "events.json"

DATE_FORMAT = "%Y-%m-%d"


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


def parse_event_date(date_str: str) -> date:
    """
    Parse an event date string (YYYY-MM-DD) into a date object.

    Raises:
        ValueError: if the date string is malformed.
    """
    try:
        return datetime.strptime(date_str, DATE_FORMAT).date()
    except ValueError as exc:
        raise ValueError(f"Invalid date format '{date_str}', expected {DATE_FORMAT}") from exc


def is_upcoming(event_date_str: str, reference_date: date | None = None) -> bool:
    """
    Determine whether an event date is today or in the future.

    Args:
        event_date_str: event date as a string (YYYY-MM-DD).
        reference_date: date to compare against (defaults to today).

    Returns:
        True if the event date is >= reference_date, False otherwise.
        Returns False if the date string is malformed (treated as invalid/expired).
    """
    reference = reference_date or date.today()

    try:
        event_date = parse_event_date(event_date_str)
    except ValueError:
        return False

    return event_date >= reference