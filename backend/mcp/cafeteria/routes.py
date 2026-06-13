# backend/mcp/cafeteria/routes.py

"""
API routes for the Cafeteria MCP server.

Each route is a thin wrapper around the corresponding service/tool
function defined in services.py, translating results into the
Pydantic response models defined in schemas.py.
"""

from fastapi import APIRouter, HTTPException

from schemas import Menu, MealResponse
from services import get_full_menu, get_menu_by_type
from utils import normalize_meal_type

router = APIRouter()


@router.get("/menu", response_model=Menu)
def get_menu_route() -> Menu:
    """
    Return the full cafeteria menu for the current day.

    Example:
        GET /cafeteria/menu
    """
    return get_full_menu()


@router.get("/menu/{meal_type}", response_model=MealResponse)
def get_menu_by_type_route(meal_type: str) -> MealResponse:
    """
    Return the menu items for a specific meal type.

    Allowed meal types: breakfast, lunch, dinner (case-insensitive).
    Returns 400 if an invalid meal type is provided.

    Example:
        GET /cafeteria/menu/lunch
    """
    try:
        items = get_menu_by_type(meal_type)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return MealResponse(meal_type=normalize_meal_type(meal_type), items=items)