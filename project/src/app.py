import os
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from PIL import Image
import io
import base64
from keras.applications.efficientnet import preprocess_input
from keras.preprocessing.text import Tokenizer
from keras.applications import EfficientNetB7

app = Flask(__name__)
CORS(app)

# Load EfficientNetB7 model pre-trained on ImageNet
modelEfficientNetB7 = EfficientNetB7(weights='imagenet')
modelEfficientNetB7 = Model(inputs=modelEfficientNetB7.inputs, outputs=modelEfficientNetB7.layers[-2].output)
model = load_model('./models/EfficientNetB7_30k_model.h5')  # Path to your saved model

# Define the path to the base directory
BASE_DIR = './models'

with open(os.path.join(BASE_DIR, 'captions.txt'), 'r') as f:
    next(f)
    captions_doc = f.read()

# create mapping of image to captions
mapping = {}
# process lines
for line in captions_doc.split('\n'):
    # split the line by comma(,)
    tokens = line.split(',')
    if len(line) < 2:
        continue
    image_id, caption = tokens[0], tokens[1:]
    # remove extension from image ID
    image_id = image_id.split('.')[0]
    # convert caption list to string
    caption = " ".join(caption)
    # create list if needed
    if image_id not in mapping:
        mapping[image_id] = []
    # store the caption
    mapping[image_id].append(caption)

def clean(mapping):
    for key, captions in mapping.items():
        for i in range(len(captions)):
            # take one caption at a time
            caption = captions[i]

            # == preprocessing steps ==
            # convert to lowercase
            caption = caption.lower()
            # delete digits, special chars, etc., 
            caption = caption.replace('[^A-Za-z]', '')
            # delete additional spaces
            caption = caption.replace('\s+', ' ')
            # add start and end tags to the caption
            caption = 'startseq ' + " ".join([word for word in caption.split() if len(word)>1]) + ' endseq'
            captions[i] = caption

# preprocess the text
clean(mapping)

all_captions = []
for key in mapping:
    for caption in mapping[key]:
        all_captions.append(caption)

# tokenize the text
tokenizer = Tokenizer()
tokenizer.fit_on_texts(all_captions)

# get maximum length of the caption available
max_length = max(len(caption.split()) for caption in all_captions)
max_length

# Helper functions
def get_feature(image_name):
    """Extract features from the image using EfficientNetB7."""
    directory = os.path.join(BASE_DIR, 'TestImages')
    img_path = os.path.join(directory, image_name + '.jpg')
    
    # Load and preprocess image
    image = Image.open(img_path).resize((600, 600))
    image = np.array(image)
    image = image.reshape((1, image.shape[0], image.shape[1], image.shape[2]))
    image = preprocess_input(image)
    
    # Extract features
    feature = modelEfficientNetB7.predict(image, verbose=0)
    return feature

def idx_to_word(integer, tokenizer):
    """Map integer index to the corresponding word from the tokenizer."""
    for word, index in tokenizer.word_index.items():
        if index == integer:
            return word
    return None

def predict_caption(model, image, tokenizer, max_length):
    """Generate a caption for the given image."""
    in_text = 'startseq'
    for i in range(max_length):
        sequence = tokenizer.texts_to_sequences([in_text])[0]
        sequence = pad_sequences([sequence], max_length, padding='post')
        yhat = model.predict([image, sequence], verbose=0)
        yhat = np.argmax(yhat)
        word = idx_to_word(yhat, tokenizer)
        if word is None:
            break
        in_text += " " + word
        if word == 'endseq':
            break

    # Remove 'startseq' and 'endseq' tags from the caption
    caption = in_text.replace('startseq ', '').replace(' endseq', '')
    return caption

@app.route("/predict", methods=['POST'])
def predict():
    data = request.get_json()
    image_data = data.get('image')

    if image_data:
        try:
            # Convert base64 to image
            image = Image.open(io.BytesIO(base64.b64decode(image_data)))
            image = image.resize((600, 600))
            image = np.array(image)
            
            # Extract features from the image
            feature = modelEfficientNetB7.predict(np.expand_dims(image, axis=0))

            # Generate caption for the image
            caption = predict_caption(model, feature, tokenizer, max_length)
            print(caption)  # Debugging output

            # Return JSON response with the caption
            return jsonify({"caption": caption})

        except Exception as e:
            # Handle any errors that occur during processing
            print(f"Error: {str(e)}")
            return jsonify({"error": "Error processing image"}), 500

    else:
        return jsonify({"error": "No image provided"}), 400

if __name__ == "__main__":
    app.run(debug=True)
