from flask import Flask, render_template, request, jsonify
from deep_translator import GoogleTranslator

app = Flask(__name__)

# Get supported languages
translator_instance = GoogleTranslator(source="auto", target="english")
LANGUAGES = translator_instance.get_supported_languages(as_dict=True)

@app.route('/', methods=['GET', 'POST'])
def index():
    translated = ''
    if request.method == 'POST':
        src = request.form['src_lang']
        dest = request.form['dest_lang']
        text = request.form['text']
        if text:
            translated = GoogleTranslator(source=src, target=dest).translate(text)
    return render_template('index.html', languages=LANGUAGES, translated=translated)

def split_text(text, max_length=5000):
    return [text[i:i+max_length] for i in range(0, len(text), max_length)]

@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.get_json(force=True)
        src = data.get('src')
        dest = data.get('dest')
        text = data.get('text', '')
        if not text or not src or not dest:
            return jsonify({'translation': '', 'error': 'Missing required fields.'}), 400
        chunks = split_text(text)
        translated_chunks = [GoogleTranslator(source=src, target=dest).translate(chunk) for chunk in chunks]
        translated = ''.join(translated_chunks)
        return jsonify({'translation': translated})
    except Exception as e:
        # Print error to console for debugging
        print('Translation error:', e)
        return jsonify({'translation': '', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
