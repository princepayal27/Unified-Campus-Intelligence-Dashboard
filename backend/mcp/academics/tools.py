from services import semantic_search

tools = [
    {"type": "function", "function": {"name": "search_academic_handbook", "description": "Semantically search the academic handbook for policy info (attendance, grading, exams, credits, etc.)", "parameters": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}}},
]