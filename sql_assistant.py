from anthropic import Anthropic
from dotenv import load_dotenv
import os

load_dotenv()
client = Anthropic()

def ask_claude(system_prompt, user_message):
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4000,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}]
    )
    return message.content[0].text

def get_query():
    print("\nOptions to enter your SQL query:")
    print("  A) Type/paste query manually (press Enter twice when done)")
    print("  B) Load from a file (save your SQL in query.sql first)")
    method = input("\nChoose A or B: ").strip().upper()

    if method == "B":
        filename = input("Enter filename (default: query.sql): ").strip()
        if filename == "":
            filename = "query.sql"
        if os.path.exists(filename):
            with open(filename, "r") as f:
                query = f.read()
            print(f"\n--- Loaded query from {filename} ---\n")
            print(query)
            return query
        else:
            print(f"File '{filename}' not found. Switching to manual input.")

    print("\nPaste your SQL query (press Enter twice when done):\n")
    lines = []
    empty_count = 0
    while True:
        line = input()
        if line == "":
            empty_count += 1
            if empty_count >= 1:
                break
        else:
            empty_count = 0
            lines.append(line)
    return "\n".join(lines)

def show_menu():
    print("\n=== SQL Assistant ===")
    print("1. Explain a query")
    print("2. Optimize a query")
    print("3. Find errors in a query")
    print("4. Generate a query from plain English")
    print("5. Exit")

while True:
    show_menu()
    choice = input("\nChoose an option (1-5): ").strip()

    if choice == "1":
        query = get_query()
        print("\n--- Explanation ---\n")
        print(ask_claude(
            "You are a SQL expert. Explain SQL queries in simple plain English. Break down each clause clearly. Do not repeat any menu options or unrelated content.",
            f"Explain this SQL query:\n{query}"
        ))
        input("\nPress Enter to go back to menu...")

    elif choice == "2":
        query = get_query()
        print("\n--- Optimized Query ---\n")
        print(ask_claude(
            "You are a SQL performance expert. Only respond with: 1) A brief bullet point list of optimizations made, 2) The rewritten optimized query. Do not add any other explanation or repeat any menu options.",
            f"Optimize this SQL query:\n{query}"
        ))
        input("\nPress Enter to go back to menu...")

    elif choice == "3":
        query = get_query()
        print("\n--- Error Analysis ---\n")
        print(ask_claude(
            "You are a SQL debugger. Find syntax errors, logical errors, and potential issues. Only respond with the list of issues found and the corrected query. Do not repeat any menu options.",
            f"Find errors in this SQL query:\n{query}"
        ))
        input("\nPress Enter to go back to menu...")

    elif choice == "4":
        desc = input("\nDescribe what you want the query to do:\n> ")
        print("\n--- Generated Query ---\n")
        print(ask_claude(
            "You are a SQL expert. Write clean, efficient SQL queries based on descriptions. Only respond with a brief explanation and the SQL query. Do not repeat any menu options.",
            f"Write a SQL query that: {desc}"
        ))
        input("\nPress Enter to go back to menu...")

    elif choice == "5":
        print("\nGoodbye!")
        break

    else:
        print("\nInvalid choice, please enter a number between 1 and 5.")