from typing import Any, Dict
import re

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_text(text: str) -> str:
    """Sanitize text input"""
    return text.strip()

def format_response(data: Any, message: str = "Success") -> Dict:
    """Format API response"""
    return {
        "success": True,
        "message": message,
        "data": data
    }

def format_error(message: str, details: Any = None) -> Dict:
    """Format error response"""
    response = {
        "success": False,
        "message": message
    }
    if details:
        response["details"] = details
    return response
