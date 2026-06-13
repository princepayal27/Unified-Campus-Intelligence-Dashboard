from services import search_books, check_book_availability, get_due_books

tools = [
    {"type": "function", "function": {"name": "search_book", "description": "Search library books by title or author", "parameters": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}}},
    {"type": "function", "function": {"name": "check_availability", "description": "Check if a book is available by ID", "parameters": {"type": "object", "properties": {"book_id": {"type": "string"}}, "required": ["book_id"]}}},
    {"type": "function", "function": {"name": "get_due_dates", "description": "Get all currently borrowed books and due dates", "parameters": {"type": "object", "properties": {}}}},
]