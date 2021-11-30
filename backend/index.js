const express = require('express'),
    app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.route('/').get((req, res) => {
    return res
        .status(200)
        .send({ message: 'User not found.' })
})

app.route('*').get((req, res) => {
    return res
        .status(404)
        .send(null)
})

app.listen(3001, () =>
    console.log(`Server listens`)
)
