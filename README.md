# CareerGuide.ai 🧠

An AI-powered career path recommender that helps users discover suitable career paths based on their skills, interests, and goals using Natural Language Processing and Machine Learning.

## Features

- 🤖 AI-powered career recommendations using NLP
- 📊 Smart matching based on skills, interests, and goals
- 🎯 Domain and career level filtering
- 📚 Curated learning resources for each career path
- 📑 Downloadable PDF reports
- ⭐ Career bookmarking functionality

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/careerguide-ai.git
cd careerguide-ai
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

3. Install the required packages:
```bash
pip install -r requirements.txt
```

## Running the Application

1. Start the Streamlit app:
```bash
streamlit run app.py
```

2. Open your web browser and navigate to the URL shown in the terminal (typically http://localhost:8501)

## Usage

1. Enter your interests, skills, and goals in the text area
2. (Optional) Use the sidebar filters to narrow down recommendations by domain and career level
3. Click "Get Career Recommendations" to see your personalized career paths
4. Bookmark interesting careers using the star button
5. Download a PDF report of your recommendations

## Project Structure

```
careerguide-ai/
│
├── app.py                  # Main Streamlit application
├── career_data.json        # Career profiles database
├── model_utils.py          # NLP and similarity calculation logic
├── requirements.txt        # Python dependencies
└── README.md              # Project documentation
```

## Technologies Used

- Streamlit: Web application framework
- SentenceTransformer: NLP for text embeddings
- scikit-learn: Similarity calculations
- reportlab: PDF generation
- Python 3.8+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 