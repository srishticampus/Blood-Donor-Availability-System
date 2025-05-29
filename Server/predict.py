import joblib
import pandas as pd
import sys
import json
import os
from pathlib import Path

try:
    # Configure logging
    print("Starting predict.py")
    
    # 1. Model Loading with Path Handling
    model_path = Path(__file__).parent / 'best_model_with_smote.pkl'
    print(f"Loading model from: {model_path}")
    
    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found at {model_path}")
    
    model = joblib.load(model_path)
    print("Model loaded successfully")

    # 2. Input Validation
    if len(sys.argv) < 2:
        raise ValueError("No input data provided")
    
    print(f"Raw input args: {sys.argv[1]}")
    
    try:
        input_data = json.loads(sys.argv[1])
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON input: {str(e)}")
    
    print(f"Parsed input: {input_data}")

    # 3. Field Validation
    required_fields = {'recency', 'frequency', 'monetary', 'time'}
    missing_fields = required_fields - set(input_data.keys())
    
    if missing_fields:
        raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

    # 4. Data Preparation with Validation
    def validate_int_field(value, field_name):
        try:
            return int(value)
        except (ValueError, TypeError):
            raise ValueError(f"Invalid value for {field_name}: must be integer")

    data = pd.DataFrame({
        'Recency (months)': [validate_int_field(input_data['recency'], 'recency')],
        'Frequency (times)': [validate_int_field(input_data['frequency'], 'frequency')],
        'Monetary (c.c. blood)': [validate_int_field(input_data['monetary'], 'monetary')],
        'Time (months)': [validate_int_field(input_data['time'], 'time')]
    })

    # 5. Prediction
    print("Making prediction...")
    prediction = model.predict(data)[0]
    probabilities = model.predict_proba(data)[0]
    probability = probabilities[1]  # Probability of class 1
    
    print(f"Prediction complete - Class: {prediction}, Probability: {probability:.2f}")

    # 6. Result Preparation
    result = {
        'class': int(prediction),
        'probability': float(probability),
        'probabilities': [float(p) for p in probabilities]  # Added full probabilities
    }

    # 7. Explanation for negative prediction
    if prediction == 0:
        thresholds = {
            'recency': (12, "high recency", "months since last donation"),
            'frequency': (3, "low frequency", "donations"),
            'monetary': (1000, "low monetary contribution", "c.c. of blood donated"),
            'time': (24, "short donation history", "months since first donation")
        }

        deviation_scores = []
        for field, (threshold, reason, unit) in thresholds.items():
            value = input_data[field]
            if field == 'recency':
                score = value / threshold  # Higher is worse
            else:
                score = threshold / max(value, 0.001)  # Avoid division by zero
            
            deviation_scores.append((
                score,
                reason,
                f"{value} {unit}"
            ))

        max_score, reason, detail = max(deviation_scores, key=lambda x: x[0])
        result['reason'] = reason
        result['details'] = detail
        result['message'] = f"Donation unlikely due to {reason} ({detail})"

    # 8. Output
    print(json.dumps(result, indent=2))
    sys.exit(0)

except Exception as e:
    error_result = {
        'error': str(e),
        'type': type(e).__name__,
        'success': False
    }
    print(json.dumps(error_result, indent=2))
    sys.exit(1)