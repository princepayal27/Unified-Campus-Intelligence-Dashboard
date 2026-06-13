# backend/mcp/cafeteria/schemas.py

"""
Pydantic models for the Cafeteria MCP server.
Defines request/response shapes used across routes and services.
"""

from pydantic import BaseModel


class Menu(BaseModel):
    """Represents the full cafeteria menu for a given day."""

    date: str
    breakfast: list[str]
    lunch: list[str]
    dinner: list[str]


class MealResponse(BaseModel):
    """Response model for the meal-type-specific endpoint."""

    meal_type: str
    items: list[str]