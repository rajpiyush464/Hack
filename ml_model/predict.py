import os, pickle, sys, json

# Base directory = folder where predict.py is located
base_dir = os.path.dirname(__file__)

with open(os.path.join(base_dir, "ev_predictive_maintenance_model.pkl"), "rb") as f:
    model = pickle.load(f)

with open(os.path.join(base_dir, "feature_columns.pkl"), "rb") as f:
    feature_columns = pickle.load(f)

with open(os.path.join(base_dir, "label_encoders.pkl"), "rb") as f:
    label_encoders = pickle.load(f)

# Read JSON payload from Node.js
payload = json.loads(sys.stdin.read())

# Encode categorical fields
for col, encoder in label_encoders.items():
    if col in payload:
        payload[col] = encoder.transform([payload[col]])[0]

# Arrange features in correct order
features = [payload.get(col, 0) for col in feature_columns]

# Predict probability
prob = model.predict_proba([features])[0][1]

print(json.dumps({"probability": float(prob)}))
