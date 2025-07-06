from flask import Flask, render_template,request,redirect,send_from_directory,url_for
import numpy as np
import json
import uuid
import tensorflow as tf

app = Flask(__name__)
model = tf.keras.models.load_model("models/Plant_Desese_Detection.keras")
label = [
 'Apple Scab',
 'Apple Black Rot',
 'Cedar Apple Rust',
 'Apple Leaf Is Healthy',
 'Background Without Leaves',
 'Blueberry Leaf Is Healthy',
 'Cherry Powdery Mildew',
 'Cherry healthy',
 'Corn Cercospora Leaf Spot Gray Leaf Spot',
 'Corn Common Rust',
 'Corn Northern Leaf Blight',
 'Corn Leaf Is Healthy',
 'Grape Black Rot',
 'Grape Esca (Black Measles)',
 'Grape Leaf Blight (Isariopsis Leaf Spot)',
 'Grape healthy',
 'range Haunglongbing (Citrus Greening)',
 'Peach Bacterial Spot',
 'peach Leaf Is Healthy',
 'Pepper Bell Bacterial Spot',
 'Pepper Bell Leaf Is Healthy',
 'Potato Early Blight',
 'Potato Late Blight',
 'Potato Leaf Is Healthy',
 'Raspberry Leaf Is Healthy',
 'Soybean Healthy',
 'Squash Powdery Mildew',
 'Strawberry Leaf Scorch',
 'Strawberry Healthy',
 'Tomato Bacterial Spot',
 'Tomato Early Blight',
 'Tomato Late Blight',
 'Tomato Leaf Mold',
 'Tomato Septoria Leaf Spot',
 'Tomato Spider Mites Two-Spotted Spider Mite',
 'Tomato Target Spot',
 'Tomato Yellow Leaf Curl Virus',
 'Tomato Tomato Mosaic Virus',
 'Tomato Healthy']

with open("plant_disease.json",'r') as file:
    plant_disease = json.load(file)

# print(plant_disease[4])

@app.route('/uploadimages/<path:filename>')
def uploaded_images(filename):
    return send_from_directory('./uploadimages', filename)

@app.route('/',methods = ['GET'])
def home():
    return render_template('home.html')

def extract_features(image):
    image = tf.keras.utils.load_img(image,target_size=(160,160))
    feature = tf.keras.utils.img_to_array(image)
    feature = np.array([feature])
    return feature

def model_predict(image):
    img = extract_features(image)
    prediction = model.predict(img)
    # print(prediction)
    prediction_label = plant_disease[prediction.argmax()]
    return prediction_label

@app.route('/upload/',methods = ['POST','GET'])
def uploadimage():
    if request.method == "POST":
        image = request.files['img']
        temp_name = f"uploadimages/temp_{uuid.uuid4().hex}"
        image.save(f'{temp_name}_{image.filename}')
        print(f'{temp_name}_{image.filename}')
        prediction = model_predict(f'./{temp_name}_{image.filename}')
        return render_template('home.html',result=True,imagepath = f'/{temp_name}_{image.filename}', prediction = prediction )
    
    else:
        return redirect('/')
        
    
if __name__ == "__main__":
    app.run(debug=True)