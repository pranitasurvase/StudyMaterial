from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Subject(Base):
    __tablename__ = "subjects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    name_mr = Column(String(100))  # Marathi name
    slug = Column(String(100), unique=True, nullable=False)
    icon = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    questions = relationship("Question", back_populates="subject")

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    question = Column(Text, nullable=False)
    question_mr = Column(Text)  # Marathi question
    options = Column(JSON, nullable=False)  # Array of options
    options_mr = Column(JSON)  # Marathi options
    correct_answer = Column(Integer, nullable=False)  # Index of correct option
    explanation = Column(Text)
    explanation_mr = Column(Text)  # Marathi explanation
    difficulty = Column(String(20), default="medium")  # easy, medium, hard
    is_bilingual = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    subject = relationship("Subject", back_populates="questions")
