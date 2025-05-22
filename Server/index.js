const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('./dbConnection')
const cors = require('cors')
const { exec } = require('child_process');

const PORT = 4058

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(`${__dirname}/upload`))
app.use(cors())
app.post('/predict', (req, res) => {
    const inputData = req.body;

    // Validate input data
    if (!inputData || Object.keys(inputData).length === 0) {
        return res.status(400).json({ error: 'Invalid or empty input data' });
    }

    // Ensure all required fields are present
    const requiredFields = ['recency', 'frequency', 'monetary', 'time'];
    const missingFields = requiredFields.filter(field => !(field in inputData));
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
    }

    // Log input data for debugging
    console.log('Received input:', inputData);
    const jsonInput = JSON.stringify(inputData);
    console.log('Sending to Python:', jsonInput);

    // Run Python script using child_process
    const pythonPath = 'C:\\Users\\santhosh rajan\\AppData\\Local\\Programs\\Python\\Python311\\python.exe';
    const escapedJsonInput = jsonInput.replace(/"/g, '\\"');
    const command = `"${pythonPath}" predict.py "${escapedJsonInput}"`;
    console.log('Executing command:', command);
    exec(command, { timeout: 30000, cwd: __dirname }, (err, stdout, stderr) => {
        if (err) {
            console.error('Exec error:', err);
            console.error('Python stderr:', stderr);
            return res.status(500).json({ error: 'Prediction failed', details: err.message, stderr });
        }
        try {
            console.log('Python stdout:', stdout);
            const lines = stdout.trim().split('\n');
            const jsonLine = lines.find(line => line.startsWith('{') && line.endsWith('}'));
            if (!jsonLine) {
                throw new Error('No valid JSON output found');
            }
            const result = JSON.parse(jsonLine);
            console.log('Parsed result:', result);
            res.json({ data: result });
        } catch (parseErr) {
            console.error('Parse error:', parseErr);
            console.error('Raw output:', stdout);
            res.status(500).json({ error: 'Failed to parse prediction result', details: parseErr.message, rawOutput: stdout });
        }
    });
});

const route = require('./routes')
app.use('/', route)

app.listen(PORT, () => {
    console.log(`Server created successfully at ${PORT}`);
})


