from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.db.session import get_db

router = APIRouter()

@router.get("/")
def get_syllabus(exam_type: str = "prelims", db: Session = Depends(get_db)):
    """Get syllabus data for MPSC exam"""
    # TODO: Fetch from database
    # Mock data for now
    
    syllabus_data = {
        "prelims": {
            "General Studies": {
                "History": [
                    {
                        "id": 1,
                        "title": "Ancient India",
                        "topics": ["Indus Valley Civilization", "Vedic Period", "Mauryan Empire", "Gupta Period"],
                        "completed": 2,
                        "total": 4,
                        "difficulty": "Medium",
                        "pyqCount": 15
                    },
                    {
                        "id": 2,
                        "title": "Medieval India",
                        "topics": ["Delhi Sultanate", "Mughal Empire", "Maratha Empire", "Regional Kingdoms"],
                        "completed": 1,
                        "total": 4,
                        "difficulty": "Medium",
                        "pyqCount": 12
                    }
                ],
                "Geography": [
                    {
                        "id": 4,
                        "title": "Physical Geography",
                        "topics": ["Earth Structure", "Climate", "Natural Resources", "Disasters"],
                        "completed": 3,
                        "total": 4,
                        "difficulty": "Medium",
                        "pyqCount": 18
                    }
                ]
            }
        }
    }
    
    return syllabus_data.get(exam_type, {})

@router.get("/topics/{topic_id}")
def get_topic_details(topic_id: int, db: Session = Depends(get_db)):
    """Get detailed information about a specific topic"""
    # TODO: Fetch from database
    return {
        "id": topic_id,
        "title": "Ancient India",
        "description": "Study of ancient Indian history and civilization",
        "resources": [],
        "progress": 50
    }
