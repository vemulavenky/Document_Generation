
import os
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from app.routes import setup_routes
from app.utils.life_cycle_handler import setup_event_handlers
from app.utils.middlewares import setup_middlewares

app = FastAPI(title="File Number Generator")

setup_routes(app)
setup_middlewares(app)
setup_event_handlers(app)
 
project_root = os.path.dirname(os.path.abspath(__file__))
frontend_path = os.path.join(project_root, "../frontend")

app.mount("/frontend", StaticFiles(directory=frontend_path, html=True), name="frontend")

@app.get("/", response_class=RedirectResponse)
async def root():
    return RedirectResponse(url="/frontend/index.html")
