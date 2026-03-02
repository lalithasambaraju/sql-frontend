from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()
client = Anthropic()

def explain_sql(query):
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        system="You are a SQL expert. Explain SQL queries in simple plain English. Break down each part clearly.",
        messages=[
            {"role": "user", "content": f"Explain this SQL query:\n\n{query}"}
        ]
    )
    return message.content[0].text

print("=== SQL Query Explainer ===")
print("Paste your SQL query below and press Enter twice:\n")

lines = []
while True:
    line = input()
    if line == "":
        break
    lines.append(line)

query = "\n".join(lines)
print("\n--- Explanation ---\n")
print(explain_sql(query))