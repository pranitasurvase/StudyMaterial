"""
Migrate existing questions from JS files to PostgreSQL database
This script will read your existing question files and import them into the database
"""
import sys
import json
from pathlib import Path
from app.db.session import SessionLocal
from app.models.question import Subject, Question

# Sample data structure - you'll need to adapt this based on your actual JS files
# This is just a template showing how to import

def migrate_questions():
    db = SessionLocal()
    
    try:
        # Example: Import Modern India questions
        # You'll need to manually convert your JS files to JSON or Python dicts
        
        # Get subject
        subject = db.query(Subject).filter(Subject.slug == "modern-history").first()
        if not subject:
            print("✗ Subject 'modern-history' not found. Run init_db.py first!")
            return
        
        # Example questions (replace with your actual data)
        sample_questions = [
            {
                "question": "When did the Indian National Congress hold its first session?",
                "question_mr": "भारतीय राष्ट्रीय काँग्रेसचे पहिले अधिवेशन कधी झाले?",
                "options": ["1885", "1886", "1887", "1888"],
                "options_mr": ["१८८५", "१८८६", "१८८७", "१८८८"],
                "correct_answer": 0,
                "explanation": "The first session of the Indian National Congress was held in Bombay in December 1885.",
                "explanation_mr": "भारतीय राष्ट्रीय काँग्रेसचे पहिले अधिवेशन डिसेंबर १८८५ मध्ये बॉम्बे येथे झाले.",
                "difficulty": "easy",
                "is_bilingual": True
            }
        ]
        
        print(f"Importing questions for {subject.name}...")
        
        for q_data in sample_questions:
            question = Question(
                subject_id=subject.id,
                question=q_data["question"],
                question_mr=q_data.get("question_mr"),
                options=q_data["options"],
                options_mr=q_data.get("options_mr"),
                correct_answer=q_data["correct_answer"],
                explanation=q_data.get("explanation"),
                explanation_mr=q_data.get("explanation_mr"),
                difficulty=q_data.get("difficulty", "medium"),
                is_bilingual=q_data.get("is_bilingual", False),
                is_active=True
            )
            db.add(question)
        
        db.commit()
        print(f"✓ Imported {len(sample_questions)} questions successfully")
        
        print("\n" + "="*60)
        print("IMPORTANT: This is a template script!")
        print("You need to:")
        print("1. Convert your JS question files to Python dicts or JSON")
        print("2. Update this script with your actual question data")
        print("3. Run this script for each subject")
        print("="*60)
        
    except Exception as e:
        print(f"✗ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    migrate_questions()
