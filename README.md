# Loner Waifu GPT

This is AI Chat that you can interact by sending the input via the message
and AI model will reply the message back to you via the speech.

 ## Highlevel Flow
```
                         +-------------------+
                         |   Ollama Server   |
                         +-------------------+
                                  ▲
                                  |  (Streaming Text Response)
                                  |
+-------------------+   1. Sends  |
|   Frontend (React)| ----------> |
|                   |             |
+-------------------+             |
        |                         |
        | 2. Sends text to        |
        | Python TTS Service      |
        v                         |
+-----------------------+         |
|   Python TTS Service  |         |
+-----------------------+         |
        |                         |
        | 3. Returns audio path   |
        v                         |
+-----------------------+         |
|  Audio File (WAV/MP3) |         |
+-----------------------+         |
        |                         |
        v                         |
  4. Frontend plays audio         |
                                  |
```

## Installation
### Frontend 
1. Install Node version >= 20
2. Running `npm i` to install all dependencies

### Python TTS service
1. Running this command to create virtual env for python `python3 -m venv myenv`
2. Install Python version `3.10`
3. Install library using `pip3 install -r requirement.txt`
4. Install [Pytorch](https://pytorch.org/get-started/locally/) or using 
```sh
pip3 install torch==2.4.0 torchvision==0.19.0 torchaudio==2.4.0 
```
5. Install transformer
```sh
 pip3 install transformers==4.39.3
```
6. Install ffmpeg `brew install ffmpeg`

## Running Local
1. Run Ollama first in your local machine
2. Run `npm run dev` to start FE
3. Run `uvicorn main:app --reload` to start TTS service

## Video Sample
[Sample](https://raw.githubusercontent.com/brightkut/loner-waifu-gpt/master/public/sample/sample.mov)

## Library related
[Pytorch](https://pytorch.org/get-started/locally/)

[Live2D](https://github.com/RaSan147/pixi-live2d-display)

[Text to Speech (TTS)](https://github.com/coqui-ai/TTS)

[Model](https://sekai.best/)