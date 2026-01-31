from flask import Flask, send_from_directory

app = Flask(__name__)

@app.get("/")
def index():
    return send_from_directory(".", "typing-hands-3d.html")

@app.get("/<path:path>")
def static_files(path: str):
    return send_from_directory(".", path)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)