# <think> Okay, the user said "Hello". I need to respond appropriately. Let me start by acknowledging their greeting. Maybe say "Hello!" to keep it friendly. Then offer assistance. I should ask how I can help them today. Keep the tone cheerful and welcoming. Make sure it's concise but polite. Let me check for any possible misunderstandings. No, it's straightforward. Just a simple response to greet them and ask how I can assist. </think> Hello! How can I assist you today? 😊
import os

import torch
from TTS.api import TTS
import re
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# FastAPI app setup
app = FastAPI()

# Enable CORS (Allow all origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model
class GenReq(BaseModel):
    data: str

device = "cuda" if torch.cuda.is_available() else "cpu"
def remove_emojis(text: str) -> str:
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F1E0-\U0001F1FF"  # flags (iOS)
        "\U00002700-\U000027BF"  # dingbats
        "\U000024C2-\U0001F251"  # enclosed characters
        "\U0001F900-\U0001F9FF"  # Supplemental Symbols and Pictographs
        "\U0001FA70-\U0001FAFF"  # Symbols and Pictographs Extended-A
        "\U00002600-\U000026FF"  # Misc symbols
        "]+",
        flags=re.UNICODE,
    )
    return emoji_pattern.sub("", text)

def gen_sound(text):
    clean_text = remove_emojis(text)
    tts = TTS(model_name="tts_models/en/ljspeech/fast_pitch").to(device)
    tts.tts_to_file(text=clean_text, file_path="public/audio/sound.wav")
    return "gen success"

@app.post("/tts")
async def gen_speech(req: GenReq):
    return {"response": gen_sound(req.data)}
@app.delete("/audio")
async def delete_audio():
    if os.path.exists("public/audio/sound.wav"):
        os.remove("public/audio/sound.wav")
        return {"status": "deleted"}
    else:
        return {"error": "File not found"}