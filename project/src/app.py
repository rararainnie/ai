# from flask import Flask, jsonify
# from flask_cors import CORS
# from tensorflow.keras.models import load_model

# app = Flask(__name__)
# CORS(app) 

# @app.route("/descriptionAI", methods='GET')
# def des():
#     return jsonify({"members": ["isus", "nahee"]})  

# @app.route("/predict", methods='POST')
# def predict():
#     return jsonify({"members": ["isus", "nahee"]})  

# if __name__ == "__main__":
#     app.run(debug=True)


from flask import Flask, jsonify, request
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app)

# Load the model once when the server starts
model = load_model('./models/model_9.h5')

@app.route("/descriptionAI", methods=['GET'])
def des():
    return jsonify({"members": ["isus", "nahee"]})

@app.route("/predict", methods=['POST'])
def predict():
    # รับข้อมูลจากคำขอ
    data = request.get_json()
    image_data = data.get('image')

    if image_data:
        # แปลงข้อมูล base64 กลับเป็นรูปภาพ
        image = Image.open(io.BytesIO(base64.b64decode(image_data)))
        image = image.resize((224, 224))  # ปรับขนาดภาพให้เหมาะกับโมเดล

        # แปลงภาพเป็น array และปรับแต่งให้ตรงกับ input ของโมเดล
        img_array = np.array(image) / 255.0  # Normalization
        img_array = np.expand_dims(img_array, axis=0)  # เพิ่มมิติให้ตรงกับ input ของโมเดล

        # สร้างข้อมูล input อื่น ๆ ที่โมเดลต้องการ
        input_1 = np.zeros((1, 2048))  # ตัวอย่างการสร้างข้อมูลที่จำเป็น
        input_2 = np.zeros((1, 32))    # ตัวอย่างการสร้างข้อมูลที่จำเป็น

        # รวมข้อมูลทั้งหมด
        inputs = [input_1, input_2]

        # ทำการพยากรณ์
        prediction = model.predict(inputs)

        # ส่งผลลัพธ์กลับไป
        return jsonify({"prediction": prediction.tolist()})
    else:
        return jsonify({"error": "No image provided"}), 400


if __name__ == "__main__":
    app.run(debug=True)
