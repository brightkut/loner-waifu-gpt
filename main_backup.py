import os
import time
import asyncio
from io import BytesIO
from typing import List

import torch
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pydub import AudioSegment
from TTS.api import TTS
import edge_tts

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
    data: List[str]

# TTS setup
type_tts = "coqui"
if type_tts == "coqui":
    device = "cuda" if torch.cuda.is_available() else "cpu"
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)

# Text splitting utility
def split_text(text: str, max_chars=300):
    sentences = text.split('. ')
    chunks = []
    current = ""
    for sentence in sentences:
        if len(current) + len(sentence) < max_chars:
            current += sentence + ". "
        else:
            chunks.append(current.strip())
            current = sentence + ". "
    if current:
        chunks.append(current.strip())
    return chunks

# Edge TTS handler
async def synth_audio_edge(TEXT, temp_file):
    VOICE = "en-US-EmilyNeural"
    communicate = edge_tts.Communicate(TEXT, VOICE, rate="+10%")
    byte_array = bytearray()

    try:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                byte_array.extend(chunk["data"])
        audio_data = BytesIO(byte_array)
        audio_segment = AudioSegment.from_file(audio_data)
        audio_segment.export(temp_file, format="wav")
    except Exception as e:
        print(f"[Edge TTS Error] {e}")
        return None
    return temp_file

# Main synthesis logic
async def call_generate(text, temp_file, tts=None):
    if tts == "edge":
        return await synth_audio_edge(text, temp_file)

    chunks = split_text(text)
    combined = AudioSegment.empty()

    for i, chunk in enumerate(chunks):
        chunk_path = f"./public/audio/chunk_{i}.wav"
        tts.tts_to_file(
            text=chunk,
            speaker_wav="public/voice/voice.wav",
            language="en",
            file_path=chunk_path
        )
        combined += AudioSegment.from_file(chunk_path)

    final_output = "public/audio/output.wav"
    combined.export(final_output, format="wav")
    return final_output

# Synth entry point
async def synthesize(text, filename):
    os.makedirs("./public/audio", exist_ok=True)

    t = time.strftime("%Y%m%d-%H%M%S")
    temp_file = f"./public/audio/{filename}-{t}.wav"
    path_out = await call_generate(text, temp_file, tts=tts)
    return path_out

# Route
@app.post("/tts")
async def gen_speech(req: GenReq):
    sentence = " ".join(req.data)
    name_wav = await synthesize(sentence, "out")
    return {"path": name_wav}
