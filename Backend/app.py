from flask import Flask, request, jsonify 
from flask_cors import CORS 
import joblib 
import pandas as pd

app = Flask(__name__) 
CORS(app, resources={r"/*": {"origins": "*"}})

# Load model
model = joblib.load("boston_model.pkl")

features_list = ["CRIM","ZN","INDUS","CHAS","NOX","RM","AGE","DIS","RAD","TAX","PTRATIO","B","LSTAT"]

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        input_features = [float(data[f]) for f in features_list]
        df = pd.DataFrame([input_features], columns=features_list)
        prediction = model.predict(df)[0]

        return jsonify({"price": round(float(prediction), 2)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)


@app.route("/areas", methods=["GET"])
def areas():
    try:
        df = pd.read_csv("data/boston.csv")
        unique_rads = sorted([int(r) for r in df['RAD'].dropna().unique()])
        return jsonify({"rads": unique_rads})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/area/<int:rad>", methods=["GET"])
def area_stats(rad):
    try:
        df = pd.read_csv("data/boston.csv")
        area_df = df[df['RAD'] == rad]
        if area_df.empty:
            return jsonify({"error": "No data for this RAD"}), 404

        prices = area_df['MEDV'].dropna().astype(float)
        stats = {
            "count": int(prices.count()),
            "mean": float(prices.mean()),
            "median": float(prices.median()),
            "std": float(prices.std()),
            "sample": prices.head(5).tolist()
        }
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
