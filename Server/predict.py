import joblib
import pandas as pd
import sys
import json

try:
    print("Starting predict.py")
    # Load the model
    print("Loading best_model_with_smote.pkl")
    model = joblib.load('best_model_with_smote.pkl')

    # Read input data from command line
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No input data provided'}))
        sys.exit(1)

    print("Raw input args:", sys.argv[1])
    try:
        input_data = json.loads(sys.argv[1])
    except json.JSONDecodeError as e:
        print(json.dumps({'error': f'Invalid JSON input: {str(e)}'}))
        sys.exit(1)
    print("Parsed input:", input_data)

    # Validate required fields
    required_fields = ['recency', 'frequency', 'monetary', 'time']
    missing_fields = [field for field in required_fields if field not in input_data]
    if missing_fields:
        print(json.dumps({'error': f'Missing fields: {", ".join(missing_fields)}'}))
        sys.exit(1)

    # Prepare input for the model
    print("Preparing DataFrame")
    data = pd.DataFrame({
        'Recency (months)': [int(input_data['recency'])],
        'Frequency (times)': [int(input_data['frequency'])],
        'Monetary (c.c. blood)': [int(input_data['monetary'])],
        'Time (months)': [int(input_data['time'])]
    })

    expected_columns = ['Recency (months)', 'Frequency (times)', 'Monetary (c.c. blood)', 'Time (months)']
    for col in expected_columns:
        if col not in data.columns:
            data[col] = 0
    data = data[expected_columns]
    print("DataFrame prepared:", data.to_dict())

    # Make prediction
    print("Making prediction")
    prediction = model.predict(data)[0]
    probability = model.predict_proba(data)[0][1]  # Probability of class 1
    print("Prediction complete:", prediction, probability)

    # Prepare output
    result = {
        'class': int(prediction),
        'probability': float(probability)
    }

    # Add explanation for non-donation (class: 0)
    if prediction == 0:
        # Define thresholds for "unfavorable" values
        thresholds = {
            'recency': 12,  # Months since last donation (high is bad)
            'frequency': 3,  # Number of donations (low is bad)
            'monetary': 1000,  # Total blood donated (low is bad)
            'time': 24  # Total time since first donation (low is bad)
        }

        # Calculate deviations from thresholds
        deviations = [
            (input_data['recency'] / thresholds['recency'], 'high recency', f"{input_data['recency']} months since last donation"),
            ((thresholds['frequency'] / input_data['frequency']) if input_data['frequency'] > 0 else float('inf'), 'low frequency', f"only {input_data['frequency']} donations"),
            ((thresholds['monetary'] / input_data['monetary']) if input_data['monetary'] > 0 else float('inf'), 'low monetary contribution', f"only {input_data['monetary']} c.c. of blood donated"),
            ((thresholds['time'] / input_data['time']) if input_data['time'] > 0 else float('inf'), 'short donation history', f"only {input_data['time']} months since first donation")
        ]

        # Find the feature with the largest deviation
        max_deviation = max(deviations, key=lambda x: x[0])
        reason, detail = max_deviation[1], max_deviation[2]
        result['message'] = f"Donation is unlikely due to {reason} ({detail})."

    # Output result
    print(json.dumps(result))

except Exception as e:
    print(json.dumps({'error': str(e)}))
    sys.exit(1)