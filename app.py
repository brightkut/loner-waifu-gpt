import os
import time
import asyncio
from io import BytesIO

import torch
from TTS.api import TTS
import edge_tts
from flask import Flask, request , jsonify
from typing import List

from flask_cors import CORS
from pydantic import BaseModel
from pydub import AudioSegment


app = Flask(__name__)
CORS(app)
class GenReq(BaseModel):
    data: List[str]


type_tts = "coqui"

if type_tts == "coqui":
    device = "cuda" if torch.cuda.is_available() else "cpu"
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)

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
        print(e)
        return None
    return temp_file

async def synthesize(text , filename):
    for file in os.listdir("./public/audio"):
        os.remove("./public/audio/"+ file)
    t = time.strftime("%Y%m%d-%H%M%S")
    temp_file = f"./public/audio/{filename}-{t}.wav"
    path_out = await call_generate(text, temp_file, tts=tts)

    final_file = f"./public/audio/output.wav"
    return final_file

async def call_generate(text , temp_file, tts=None):
    if tts == "edge":
        await synth_audio_edge(text , temp_file)
    else:
        tts.tts_to_file(text=text, speaker_wav="public/voice/voice.wav", language="en", file_path="public/audio/output.wav")

@app.route("/tts", methods=["POST"])
def genSpeech():
    req_json = request.get_json()
    req = GenReq(**req_json)
    sentence = " ".join(req.data)
    name_wav = asyncio.run(synthesize(sentence, "out"))  # Run async code
    return jsonify({"path": name_wav})




if __name__ == '__main__':
    app.run(debug=True)