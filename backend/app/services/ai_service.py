"""
AI Service for generating question answers and explanations
Uses Groq API (free and fast) - OPTIONAL
"""
import os
import json

# Groq is optional - app will work without it
try:
    from groq import Groq
    client = None
    api_key = os.getenv("GROQ_API_KEY", "")
    if api_key:
        client = Groq(api_key=api_key)
except ImportError:
    client = None
    print("Groq not installed. AI features will be disabled.")
except Exception as e:
    client = None
    print(f"Warning: Groq client initialization failed: {e}")

def generate_answer_and_explanation(question: str, options: list) -> dict:
    """
    Generate correct answer and detailed explanation for a question
    Returns: {
        "correct_answer": 0-3,
        "explanation_en": "...",
        "explanation_mr": "..."
    }
    """
    if not client:
        return {
            "correct_answer": 0,
            "explanation_en": "AI service not configured. Please add GROQ_API_KEY to .env file.",
            "explanation_mr": "AI सेवा कॉन्फ़िगर नहीं है।"
        }
    
    try:
        # Format options
        options_text = "\n".join([f"{chr(65+i)}. {opt}" for i, opt in enumerate(options)])
        
        prompt = f"""You are an expert on Indian history and MPSC exam preparation.

Question: {question}

Options:
{options_text}

Please provide:
1. The correct answer (A, B, C, or D)
2. A detailed explanation in English (2-3 sentences)
3. The same explanation in Marathi

Format your response as JSON:
{{
    "correct_answer": "A",
    "explanation_en": "Your detailed English explanation here",
    "explanation_mr": "तुमचे तपशीलवार मराठी स्पष्टीकरण येथे"
}}

Important: Make sure the Marathi translation is accurate and uses proper Devanagari script."""

        response = client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an expert on Indian history and MPSC exams. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=500
        )
        
        result_text = response.choices[0].message.content.strip()
        
        # Try to extract JSON from response
        if "```json" in result_text:
            result_text = result_text.split("```json")[1].split("```")[0].strip()
        elif "```" in result_text:
            result_text = result_text.split("```")[1].split("```")[0].strip()
        
        result = json.loads(result_text)
        
        # Convert letter to index
        answer_letter = result.get("correct_answer", "A").upper()
        answer_index = ord(answer_letter) - ord('A')
        
        return {
            "correct_answer": answer_index,
            "explanation_en": result.get("explanation_en", ""),
            "explanation_mr": result.get("explanation_mr", "")
        }
        
    except Exception as e:
        print(f"Error generating answer: {e}")
        return {
            "correct_answer": 0,
            "explanation_en": f"Error generating explanation: {str(e)}",
            "explanation_mr": "स्पष्टीकरण तयार करताना त्रुटी"
        }

def generate_bulk_answers(questions: list) -> list:
    """
    Generate answers for multiple questions
    """
    results = []
    for q in questions:
        result = generate_answer_and_explanation(q["question"], q["options"])
        results.append({
            **q,
            **result
        })
    return results
