from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.question import Question, Subject
from app.schemas.question import (
    QuestionCreate, QuestionUpdate, Question as QuestionSchema,
    QuestionList, Subject as SubjectSchema, SubjectCreate, SubjectUpdate
)
from app.services.ai_service import generate_answer_and_explanation, generate_bulk_answers
from pydantic import BaseModel

router = APIRouter()

# Pydantic models for AI endpoints
class QuestionForAI(BaseModel):
    question: str
    options: List[str]

class BulkQuestionForAI(BaseModel):
    questions: List[QuestionForAI]

# AI endpoint for single question
@router.post("/ai/generate-answer")
def generate_answer(question_data: QuestionForAI):
    """Generate correct answer and explanation using AI"""
    try:
        result = generate_answer_and_explanation(
            question_data.question,
            question_data.options
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# AI endpoint for bulk questions
@router.post("/ai/generate-bulk-answers")
def generate_bulk(data: BulkQuestionForAI):
    """Generate answers for multiple questions using AI"""
    try:
        questions_list = [
            {"question": q.question, "options": q.options}
            for q in data.questions
        ]
        results = generate_bulk_answers(questions_list)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Subject endpoints
@router.get("/subjects", response_model=List[SubjectSchema])
def get_subjects(db: Session = Depends(get_db)):
    subjects = db.query(Subject).all()
    return subjects

@router.post("/subjects", response_model=SubjectSchema)
def create_subject(subject: SubjectCreate, db: Session = Depends(get_db)):
    db_subject = Subject(**subject.dict())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.put("/subjects/{subject_id}", response_model=SubjectSchema)
def update_subject(subject_id: int, subject: SubjectUpdate, db: Session = Depends(get_db)):
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    for key, value in subject.dict(exclude_unset=True).items():
        setattr(db_subject, key, value)
    
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.delete("/subjects/{subject_id}")
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    db.delete(db_subject)
    db.commit()
    return {"message": "Subject deleted successfully"}

# Question endpoints
@router.get("/questions", response_model=QuestionList)
def get_questions(
    subject_id: Optional[int] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(10000, ge=1, le=10000),  # Increased to 10000
    db: Session = Depends(get_db)
):
    query = db.query(Question).filter(Question.is_active == True)
    
    if subject_id:
        query = query.filter(Question.subject_id == subject_id)
    
    total = query.count()
    questions = query.offset(skip).limit(limit).all()
    
    return {"total": total, "questions": questions}

@router.get("/questions/{question_id}", response_model=QuestionSchema)
def get_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.post("/questions", response_model=QuestionSchema)
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    # Verify subject exists
    subject = db.query(Subject).filter(Subject.id == question.subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # Check for duplicate question (exact match)
    existing_question = db.query(Question).filter(
        Question.question == question.question,
        Question.subject_id == question.subject_id,
        Question.is_active == True
    ).first()
    
    if existing_question:
        raise HTTPException(
            status_code=409, 
            detail=f"Duplicate question found! Question already exists with ID: {existing_question.id}"
        )
    
    db_question = Question(**question.dict())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.put("/questions/{question_id}", response_model=QuestionSchema)
def update_question(question_id: int, question: QuestionUpdate, db: Session = Depends(get_db)):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    for key, value in question.dict(exclude_unset=True).items():
        setattr(db_question, key, value)
    
    db.commit()
    db.refresh(db_question)
    return db_question

@router.delete("/questions/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db)):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # Soft delete
    db_question.is_active = False
    db.commit()
    return {"message": "Question deleted successfully"}
