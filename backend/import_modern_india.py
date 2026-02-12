"""
Import Modern India questions from frontend JS file to database
"""
import sys
import json
import re
from pathlib import Path
from app.db.session import SessionLocal
from app.models.question import Subject, Question

def parse_js_questions():
    """Parse the modern-india.js file and extract questions"""
    js_file = Path("../frontend/src/data/mcqs/modern-india.js")
    
    if not js_file.exists():
        print(f"✗ File not found: {js_file}")
        return []
    
    content = js_file.read_text(encoding='utf-8')
    
    # Extract the array content between [ and ]
    # This is a simple parser - might need adjustment based on exact format
    match = re.search(r'export\s+const\s+modernIndiaMCQs\s*=\s*(\[[\s\S]*\])', content)
    if not match:
        print("✗ Could not find question array in JS file")
        return []
    
    array_str = match.group(1)
    
    # Convert JS object notation to JSON
    # Replace single quotes with double quotes
    array_str = array_str.replace("'", '"')
    # Handle trailing commas
    array_str = re.sub(r',(\s*[}\]])', r'\1', array_str)
    
    try:
        questions = json.loads(array_str)
        return questions
    except json.JSONDecodeError as e:
        print(f"✗ Error parsing JSON: {e}")
        print("Trying alternative parsing method...")
        
        # Alternative: Use eval (less safe but works for simple cases)
        try:
            # Read file again and use exec
            exec_globals = {}
            exec(f"questions = {array_str}", exec_globals)
            return exec_globals.get('questions', [])
        except Exception as e2:
            print(f"✗ Alternative parsing also failed: {e2}")
            return []

def import_questions():
    db = SessionLocal()
    
    try:
        # Get Modern History subject
        subject = db.query(Subject).filter(Subject.slug == "modern-history").first()
        if not subject:
            print("✗ Subject 'modern-history' not found. Run init_db.py first!")
            return
        
        print(f"📚 Importing questions for: {subject.name}")
        
        # Parse questions from JS file
        questions_data = parse_js_questions()
        
        if not questions_data:
            print("✗ No questions found to import")
            return
        
        print(f"Found {len(questions_data)} questions in JS file")
        
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
                    difficulty=q_data.get('difficulty', 'medium'),
                    is_bilingual=bool(question_text_mr or options_mr or explanation_mr),
                    is_active=True
                )
                db.add(question)
                imported += 1
                
                if imported % 50 == 0:
                    print(f"  Imported {imported} questions...")
                    
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
    print("Modern India Questions Import Script")
    print("="*60)
    import_questions()
