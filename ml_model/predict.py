import os
import sys
import json
import pickle
import traceback

# --------------------------------------------------
# Load Model
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE_DIR, "ev_predictive_maintenance_model.pkl"), "rb") as f:
    model = pickle.load(f)

with open(os.path.join(BASE_DIR, "feature_columns.pkl"), "rb") as f:
    feature_columns = pickle.load(f)

# --------------------------------------------------
# Read Payload
# --------------------------------------------------

try:
    raw = sys.stdin.read()

    if not raw.strip():
        raise ValueError("Empty payload received.")

    payload = json.loads(raw)

except Exception as e:
    print(json.dumps({
        "error": f"Invalid JSON payload: {str(e)}"
    }))
    sys.exit(1)

# --------------------------------------------------
# Metadata Section
# --------------------------------------------------

metadata = payload.get("metadata", {})

# --------------------------------------------------
# Build Feature Vector
# --------------------------------------------------

features = []
missing_features = []

for feature in feature_columns:

    value = metadata.get(feature)

    if value is None:
        missing_features.append(feature)
        value = 0

    features.append(value)

# --------------------------------------------------
# Debug Logging
# (stderr so Node.js doesn't try to parse it)
# --------------------------------------------------

print("\n========== MODEL INPUT ==========", file=sys.stderr)

for name, value in zip(feature_columns, features):
    print(f"{name:35} : {value}", file=sys.stderr)

if missing_features:
    print("\nMissing Features:", file=sys.stderr)
    print(missing_features, file=sys.stderr)

print("=================================\n", file=sys.stderr)

# --------------------------------------------------
# Prediction
# --------------------------------------------------

try:

    probability = float(model.predict_proba([features])[0][1])

    result = {
        "probability": probability
    }

    print(json.dumps(result))

except Exception:

    print(json.dumps({
        "error": traceback.format_exc()
    }))