from flask import Flask, request, jsonify
from flask_cors import CORS
from anthropic import Anthropic
from dotenv import load_dotenv
import os

load_dotenv()
client = Anthropic()
app = Flask(__name__)
CORS(app, origins=["https://sql-frontend-theta.vercel.app"])

SYSTEM_PROMPTS = {
    "explain": "You are a SQL expert. Explain SQL queries in simple plain English. Break down each clause clearly. Do not repeat any menu options or unrelated content.",
    "optimize": "You are a SQL performance expert. Only respond with: 1) A brief bullet point list of optimizations made, 2) The rewritten optimized query. Do not add any other explanation.",
    "errors": "You are a SQL debugger. Find syntax errors, logical errors, and potential issues. Only respond with the list of issues found and the corrected query.",
    "generate": "You are a SQL expert. Write clean, efficient SQL queries based on descriptions. Only respond with a brief explanation and the SQL query."
}

PROMPTS = {
    "explain": "Explain this SQL query:\n",
    "optimize": "Optimize this SQL query:\n",
    "errors": "Find errors in this SQL query:\n",
    "generate": "Write a SQL query that: "
}

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "SQL Assistant API is running"})

@app.route("/debug", methods=["GET"])
def debug():
    key = os.getenv("ANTHROPIC_API_KEY")
    if key:
        return jsonify({"status": "key found", "starts_with": key[:12]})
    else:
        return jsonify({"status": "key NOT found"})

@app.route("/api/sql", methods=["POST"])
def sql_assistant():
    data = request.json
    action = data.get("action")
    query = data.get("query", "")

    if not action or not query:
        return jsonify({"error": "Missing action or query"}), 400

    if action not in SYSTEM_PROMPTS:
        return jsonify({"error": "Invalid action"}), 400

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4000,
        system=SYSTEM_PROMPTS[action],
        messages=[{"role": "user", "content": PROMPTS[action] + query}]
    )

    return jsonify({"result": message.content[0].text})

if __name__ == "__main__":
    app.run(debug=True, port=5000)