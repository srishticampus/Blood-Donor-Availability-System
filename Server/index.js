const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('./dbConnection')
const cors = require('cors')
const PORT = 4058

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(`${__dirname}/upload`))
app.use(cors())

const route = require('./routes')
app.use('/blood_donor_api', route)

app.listen(PORT, () => {
    console.log(`Server created successfully at ${PORT}`);
})


