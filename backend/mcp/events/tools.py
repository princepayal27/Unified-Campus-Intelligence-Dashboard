from services import get_upcoming_events, search_events

tools = [
    {"type": "function", "function": {"name": "get_upcoming_events", "description": "Get the next 10 upcoming campus events sorted by date", "parameters": {"type": "object", "properties": {}}}},
    {"type": "function", "function": {"name": "search_events", "description": "Search campus events by title, category, or organizer", "parameters": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}}},
]