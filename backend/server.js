const express = require('express')
const app = express()
const port = 443



//routing
app.get('/api/hello', (req, res) => res.send('Hello World!'))




app.listen(port, () => console.log(`Listening on port: ${port}`))