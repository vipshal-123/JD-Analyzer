from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
import logging

load_dotenv("local.env")
logger = logging.getLogger(__name__)

class GeminiClient:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    
    def analyze_text(self, prompt: str, text: str) -> str:
        try:
            full_prompt = f"{prompt}\n\nText to analyze:\n{text}" if text else prompt
            
            print(f"Sending to Gemini - Prompt length: {len(full_prompt)}")
            
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    thinking_config=types.ThinkingConfig(thinking_budget=0),
                    temperature=0.1, 
                    max_output_tokens=4096
                )
            )
            
            if not response or not response.text:
                raise Exception("Empty response from Gemini API")
            
            logger.info(f"Gemini response length: {len(response.text)}")
            result = response.text
            print(f"Gemini response length: {len(result)}")
            
            return result
            
        except Exception as e:
            print(f"Gemini API error: {e}")
            raise Exception(f"GEMINI_API_ERROR: {e}")
