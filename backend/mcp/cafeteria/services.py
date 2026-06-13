# backend/mcp/cafeteria/services.py

"""
Business logic for the Cafeteria MCP server.

These functions are written as standalone, importable "tools" so they can
be registered directly with an AI orchestrator (e.g. OpenAI tool calling)
in addition to being used by the FastAPI routes.

Currently backed by a local JSON file (data/menu.json). Swapping to a
real database later only requires changing load_menu(); all other
functions operate on the in-memory Menu object.
"""

from schemas import Menu
from utils import DATA_FILE, read_json_file, normalize_meal_type, is_valid_meal_type, VALID_MEAL_TYPES


def load_menu() -> Menu:
    """
    Load and validate today's menu from the mock data source.

    Returns:
        A validated Menu model.

    Raises:
        FileNotFoundError: if the data file is missing.
        ValueError: if the data file is malformed or fails validation.
    """
    raw_record = read_json_file(DATA_FILE)

    try:
        return Menu(**raw_record)
    except Exception as exc:
        raise ValueError(f"Invalid menu record in {DATA_FILE}: {exc}") from exc


def get_full_menu() -> Menu:
    """
    Tool: get_full_menu()

    Return the full menu object for the current day.

    Returns:
        The Menu model loaded from the data source.
    """
    return load_menu()


def get_menu_by_type(meal_type: str) -> list[str]:
    """
    Tool: get_menu_by_type(meal_type)

    Return the list of items for a specific meal type.

    Args:
        meal_type: one of "breakfast", "lunch", "dinner" (case-insensitive).

    Returns:
        List of food item names for the requested meal.

    Raises:
        ValueError: if meal_type is not one of the allowed values.
    """
    if not is_valid_meal_type(meal_type):
        allowed = ", ".join(sorted(VALID_MEAL_TYPES))
        raise ValueError(f"Invalid meal type '{meal_type}'. Must be one of: {allowed}")

    menu = load_menu()
    normalized = normalize_meal_type(meal_type)

    return getattr(menu, normalized)