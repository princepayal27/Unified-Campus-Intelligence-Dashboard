# backend/mcp/events/services.py

"""
Business logic for the Events MCP server.

These functions are written as standalone, importable "tools" so they can
be registered directly with an AI orchestrator (e.g. OpenAI tool calling)
in addition to being used by the FastAPI routes.

Currently backed by a local JSON file (data/events.json). Swapping to a
real database later only requires changing load_events(); all other
functions operate on the in-memory list of Event objects.
"""

from schemas import Event
from utils import DATA_FILE, read_json_file, normalize_text, is_upcoming, parse_event_date

MAX_UPCOMING_EVENTS = 10


def load_events() -> list[Event]:
    """
    Load and validate all events from the mock data source.

    Returns:
        A list of validated Event models.

    Raises:
        FileNotFoundError: if the data file is missing.
        ValueError: if the data file is malformed or fails validation.
    """
    raw_records = read_json_file(DATA_FILE)

    try:
        return [Event(**record) for record in raw_records]
    except Exception as exc:
        raise ValueError(f"Invalid event record in {DATA_FILE}: {exc}") from exc


def get_upcoming_events() -> list[Event]:
    """
    Tool: get_upcoming_events()

    Filter out events whose date has already passed, sort the remaining
    events by date ascending, and return at most the next 10.

    Returns:
        List of up to MAX_UPCOMING_EVENTS Event models, soonest first.
    """
    events = load_events()

    upcoming = [event for event in events if is_upcoming(event.date)]
    upcoming.sort(key=lambda event: parse_event_date(event.date))

    return upcoming[:MAX_UPCOMING_EVENTS]


def search_events(query: str) -> list[Event]:
    """
    Tool: search_events(query)

    Search events by title, category, or organizer, case-insensitive,
    with partial matching.

    Args:
        query: search string to match against title/category/organizer.

    Returns:
        List of matching Event models. Empty list if no matches or
        if the query is empty/whitespace.
    """
    if not query or not query.strip():
        return []

    normalized_query = normalize_text(query)
    events = load_events()

    return [
        event
        for event in events
        if normalized_query in normalize_text(event.title)
        or normalized_query in normalize_text(event.category)
        or normalized_query in normalize_text(event.organizer)
    ]