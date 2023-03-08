from __future__ import division, print_function
import os
import numpy as np

# Keras
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Flask utils
from flask import Flask, jsonify, request, render_template
from werkzeug.utils import secure_filename

os.environ["CUDA_VISIBLE_DEVICES"]="-1"
# Define a flask app
app = Flask(__name__)

MODEL_PATH = 'models/model.h5'

#Load your trained model
model = load_model(MODEL_PATH)
print('Model loaded. Start serving...')

#print(model.summary())

def model_predict(img_path, model):
    img = image.load_img(img_path, target_size=(64,64)) #>>>>>>>>same as in the training phase <<<<<<<<<
    # Preprocessing the image
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = img.astype('float32')/255
    preds = model.predict(img)
    pred = np.argmax(preds,axis = 1)
    return pred


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/predict', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # Get the file from post request
        f = request.files['file']
        # Save the file to ./uploads
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'uploads', secure_filename(f.filename))
        f.save(file_path)

        # Make prediction
        pred = model_predict(file_path, model)
        os.remove(file_path)#removes file from the server after prediction has been returned

        if pred[0] == 0:
                 return {
         "result" : 0,
         "status" : 200
            }
        elif pred[0] == 1:
                return {
         "result" : 1,
         "status" : 200
            }
        else : return {
          "result" : -1,
          "status" : 403,
        }

if __name__ == '__main__':
        app.run(debug=True, host="localhost", port=8080)
