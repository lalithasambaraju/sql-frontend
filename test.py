from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()
client = Anthropic()

msg = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=100,
    messages=[{"role": "user", "content": "Say hello!"}]
)
print(msg.content[0].text)