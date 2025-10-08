# Vercel Serverless Entry Point for Muslim Companion Backend
from backend.app import app

# Vercel serverless handler
def handler(request, response):
    return app(request, response)

# For Vercel deployment
if __name__ == "__main__":
    app.run(debug=False)