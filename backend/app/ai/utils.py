# backend/app/ai/utils.py

"""
Shared utility helpers for the AI orchestration layer.
"""

import json
from typing import Any


def safe_json_dumps(data: Any) -> str:
    """
    Serialize a Python object to a JSON string, falling back to a
    string representation if the object isn't JSON-serializable.

    Used when sending tool results back to the OpenAI API, which
    requires tool message content to be a string.
    """
    try:
        return json.dumps(data, default=str)
    except (TypeError, ValueError):
        return str(data)


def truncate_for_log(text: str, max_len: int = 300) -> str:
    """Truncate long strings for clean log output."""
    if len(text) <= max_len:
        return text
    return text[:max_len] + "...(truncated)"