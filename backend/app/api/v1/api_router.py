from fastapi import APIRouter
from app.api.v1.routes import auth, user, analyze, syllabus
from app.api.v1.endpoints import questions

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(user.router, prefix="/users", tags=["Users"])
api_router.include_router(analyze.router, prefix="/analyze", tags=["Content Analysis"])
api_router.include_router(syllabus.router, prefix="/syllabus", tags=["Syllabus"])
api_router.include_router(questions.router, prefix="/questions", tags=["Questions"])
