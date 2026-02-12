from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class SubjectBase(BaseModel):
    name: str
    name_mr: Optional[str] = None
    slug: str
    icon: Optional[str] = None

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    name_mr: Optional[str] = None
    slug: Optional[str] = None
    icon: Optional[str] = None

class Subject(SubjectBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class QuestionBase(BaseModel):
    subject_id: int
    question: str
    question_mr: Optional[str] = None
    options: List[str]
    options_mr: Optional[List[str]] = None
    correct_answer: int = Field(..., ge=0, le=3)
    explanation: Optional[str] = None
    explanation_mr: Optional[str] = None
    difficulty: Optional[str] = "medium"
    is_bilingual: Optional[bool] = False
    is_active: Optional[bool] = True

class QuestionCreate(QuestionBase):
    pass

class QuestionUpdate(BaseModel):
    subject_id: Optional[int] = None
    question: Optional[str] = None
    question_mr: Optional[str] = None
    options: Optional[List[str]] = None
    options_mr: Optional[List[str]] = None
    correct_answer: Optional[int] = None
    explanation: Optional[str] = None
    explanation_mr: Optional[str] = None
    difficulty: Optional[str] = None
    is_bilingual: Optional[bool] = None
    is_active: Optional[bool] = None

class Question(QuestionBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    subject: Optional[Subject] = None
    
    class Config:
        from_attributes = True

class QuestionList(BaseModel):
    total: int
    questions: List[Question]
