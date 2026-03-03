@app.route("/debug", methods=["GET"])
def debug():
    import os
    key = os.getenv("ANTHROPIC_API_KEY")
    if key:
        return jsonify({"status": "key found", "starts_with": key[:12]})
    else:
        return jsonify({"status": "key NOT found"})