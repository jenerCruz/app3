import sys
from transformers import pipeline

# Cambia el modelo aquí según lo que quieras probar
generator = pipeline("text-generation", model="meta-llama/Llama-3.1-8B-Instruct")

def run_agent(prompt):
    return generator(prompt, max_length=100)[0]["generated_text"]

if __name__ == "__main__":
    user_input = sys.argv[1] if len(sys.argv) > 1 else ""
    print(run_agent(user_input))