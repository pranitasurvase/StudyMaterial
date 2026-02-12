"""
Import Modern India questions from JSON file to database
"""
import json
from pathlib import Path
from app.db.session import SessionLocal
from app.models.question import Subject, Question

def import_questions():
    db = SessionLocal()
    
    try:
        # Get Modern History subject
        subject = db.query(Subject).filter(Subject.slug == "modern-history").first()
        if not subject:
            print("✗ Subject 'modern-history' not found. Run init_db.py first!")
            return
        
        print(f"📚 Importing questions for: {subject.name}")
        
        # Read JSON file
        json_file = Path("../frontend/modern-india.json")
        if not json_file.exists():
            print(f"✗ File not found: {json_file}")
            return
        
        with open(json_file, 'r', encoding='utf-8') as f:
            questions_data = json.load(f)
        
        print(f"Found {len(questions_data)} questions in JSON file")
        
        # Clear existing questions for this subject (optional)
        existing_count = db.query(Question).filter(Question.subject_id == subject.id).count()
        if existing_count > 0:
            response = input(f"⚠️  Found {existing_count} existing questions. Delete them? (y/n): ")
            if response.lower() == 'y':
                db.query(Question).filter(Question.subject_id == subject.id).delete()
                db.commit()
                print(f"✓ Deleted {existing_count} existing questions")
        
        # Import questions
        imported = 0
        for q_data in questions_data:
            try:
                # Handle both string and object formats for question text
                question_text = q_data.get('question', '')
                question_text_en = None
                question_text_mr = None
                
                if isinstance(question_text, dict):
                    question_text_en = question_text.get('en', '')
                    question_text_mr = question_text.get('mr', '')
                    question_text = question_text_en  # Use English as primary
                
                # Handle options
                options = q_data.get('options', [])
                options_en = None
                options_mr = None
                
                if isinstance(options, dict):
                    options_en = options.get('en', [])
                    options_mr = options.get('mr', [])
                    options = options_en  # Use English as primary
                
                # Handle explanation
                explanation = q_data.get('explanation', '')
                explanation_en = None
                explanation_mr = None
                
                if isinstance(explanation, dict):
                    explanation_en = explanation.get('en', '')
                    explanation_mr = explanation.get('mr', '')
                    explanation = explanation_en
                
                question = Question(
                    subject_id=subject.id,
                    question=question_text_en or question_text,
                    question_mr=question_text_mr,
                    options=options_en or options,
                    options_mr=options_mr,
                    correct_answer=q_data.get('correctAnswer', 0),
                    explanation=explanation_en or explanation,
                    explanation_mr=explanation_mr,
                    difficulty=q_data.get('difficulty', 'medium').lower(),
                    is_bilingual=bool(question_text_mr or options_mr or explanation_mr),
                    is_active=True
                )
                db.add(question)
                imported += 1
                
                if imported % 5 == 0:
                    print(f"  Imported {imported} questions...")
                    db.commit()  # Commit in batches
                    
            except Exception as e:
                print(f"✗ Error importing question {q_data.get('id', '?')}: {e}")
                continue
        
        db.commit()
        print(f"\n✅ Successfully imported {imported} questions!")
        
        # Verify
        total = db.query(Question).filter(Question.subject_id == subject.id).count()
        print(f"📊 Total questions in database for {subject.name}: {total}")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("="*60)
    print("Modern India Questions Import Script (from JSON)")
    print("="*60)
    import_questions()
