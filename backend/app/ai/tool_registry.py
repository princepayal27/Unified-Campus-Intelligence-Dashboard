# backend/app/ai/tool_registry.py

"""
OpenAI-compatible tool/function definitions for all MCP servers.

Each entry follows the OpenAI "tools" schema:
{
    "type": "function",
    "function": {
        "name": ...,
        "description": ...,
        "parameters": { JSON Schema }
    }
}

These definitions are passed to the OpenAI Chat Completions API and
drive the model's tool-selection behavior. tool_executor.py maps each
tool name back to the corresponding MCP server call.
"""

TOOLS: list[dict] = [
    # ------------------------------------------------------------------ #
    # Library MCP
    # ------------------------------------------------------------------ #
    {
        "type": "function",
        "function": {
            "name": "search_book",
            "description": (
                "Search the library catalog for books by title or author. "
                "Use this when the user asks about finding a specific book "
                "or books on a topic."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search term to match against book title or author.",
                    }
                },
                "required": ["query"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "check_availability",
            "description": (
                "Check whether a specific library book is currently available "
                "for checkout, given its book ID."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "book_id": {
                        "type": "string",
                        "description": "Unique identifier of the book, e.g. 'BOOK003'.",
                    }
                },
                "required": ["book_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_due_dates",
            "description": (
                "Get the list of currently borrowed/unavailable library books "
                "along with their due dates. Use this when the user asks about "
                "books they have due or overdue."
            ),
            "parameters": {
                "type": "object",
                "properties": {},
            },
        },
    },
    # ------------------------------------------------------------------ #
    # Events MCP
    # ------------------------------------------------------------------ #
    {
        "type": "function",
        "function": {
            "name": "get_upcoming_events",
            "description": (
                "Get the next 10 upcoming campus events, sorted by nearest "
                "date first. Use this when the user asks what's happening on "
                "campus soon, without a specific search term."
            ),
            "parameters": {
                "type": "object",
                "properties": {},
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "search_events",
            "description": (
                "Search campus events by title, category, or organizer. Use "
                "this when the user is looking for a specific kind of event, "
                "e.g. 'AI workshops', 'cultural events', or events run by a "
                "particular club."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search term to match against event title, category, or organizer.",
                    }
                },
                "required": ["query"],
            },
        },
    },
    # ------------------------------------------------------------------ #
    # Cafeteria MCP
    # ------------------------------------------------------------------ #
    {
        "type": "function",
        "function": {
            "name": "get_full_menu",
            "description": (
                "Get today's complete cafeteria menu, including breakfast, "
                "lunch, and dinner. Use this when the user asks generally "
                "about today's menu or food options."
            ),
            "parameters": {
                "type": "object",
                "properties": {},
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_menu_by_type",
            "description": (
                "Get today's cafeteria menu for a specific meal: breakfast, "
                "lunch, or dinner. Use this when the user asks about a "
                "specific meal."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "meal_type": {
                        "type": "string",
                        "enum": ["breakfast", "lunch", "dinner"],
                        "description": "Which meal to get the menu for.",
                    }
                },
                "required": ["meal_type"],
            },
        },
    },
    # ------------------------------------------------------------------ #
    # Academics MCP
    # ------------------------------------------------------------------ #
    {
        "type": "function",
        "function": {
            "name": "search_academic_handbook",
            "description": (
                "Semantically search the academic handbook for policy "
                "information such as attendance requirements, grading "
                "system, exam rules, credit requirements, leave policy, "
                "and disciplinary rules. Use this for any question about "
                "academic rules or policies."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The user's natural language policy question.",
                    }
                },
                "required": ["query"],
            },
        },
    },
]