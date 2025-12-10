import sys
from transformers import pipeline

# Puedes cambiar el modelo por Phi-2, Mistral, GPT4All, etc.
generator = pipeline("text-generation", model="microsoft/phi-2")

def run_agent(prompt):
    return generator(prompt, max_length=100)[0]["generated_text"]

    if __name__ == "__main__":
        user_input = sys.argv[1] if len(sys.argv) > 1 else ""
            print(run_agent(user_input))