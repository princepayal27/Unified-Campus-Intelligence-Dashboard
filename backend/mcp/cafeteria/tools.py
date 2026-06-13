from services import get_full_menu, get_menu_by_type

tools = [
    {"type": "function", "function": {"name": "get_full_menu", "description": "Get today's complete cafeteria menu (breakfast, lunch, dinner)", "parameters": {"type": "object", "properties": {}}}},
    {"type": "function", "function": {"name": "get_menu_by_type", "description": "Get menu items for a specific meal: breakfast, lunch, or dinner", "parameters": {"type": "object", "properties": {"meal_type": {"type": "string", "enum": ["breakfast", "lunch", "dinner"]}}, "required": ["meal_type"]}}},
]