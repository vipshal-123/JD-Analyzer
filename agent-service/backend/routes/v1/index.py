from fastapi import APIRouter

from backend.routes.v1.agent import router as agent_router

router = APIRouter()

router.include_router(prefix="/agent", router=agent_router)