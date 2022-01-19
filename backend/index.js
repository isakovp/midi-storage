const express = require('express')
const cors = require('cors')
const faker = require('faker')
const jwt = require('jsonwebtoken')
const config = require('./config')
const e = require('express')

const app = express()

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ],
}
app.use(cors(corsOpts))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '')
  if (!token) {
    return res.status(403).send({
      auth: false,
      message: 'No token provided.'
    })
  }

  jwt.verify(token, config.secret, {}, (err, decoded) => {
    if (err) {
      return res.status(403).send({
        auth: false,
        message: 'Invalid token.'
      })
    }

    if (decoded.id !== 'isakovp@gmail.com') {
      return res.status(403).send({
        auth: false,
        message: 'Invalid token.'
      })
    }

    req.user = decoded
    next()
  })
}

app.route('/authenticate').post((req, res) => {
  const username = req.body.params.username
  const password = req.body.params.password

  if (username && username.toLowerCase() === 'isakovp@gmail.com' && password && password === '111111') {
    const token = jwt.sign({ id: username }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    })
    return res
      .status(200)
      .send({
        auth: true,
        token
      })
  } else {
    setTimeout(() => {
      return res
        .status(401)
        .send({
          auth: false,
          token: null
        })
    }, 2000)
  }
})

app.route('/me').get(verifyToken, (req, res) => {
  return res
    .status(200)
    .send({
      name: 'Pavel Isakov',
      email: 'isakovp@gmail.com'
    })
})

let files = []
for (let i = 0; i < 1253; i++) {
  files.push({
    id: i + 1,
    name: faker.name.findName(),
    description: faker.lorem.paragraph(),
    views: Math.round(Math.random() * 5000),
    favorites: Math.round(Math.random() * 2000),
    created_at: faker.date.past(1),
    url: faker.random.arrayElement(['/1.mid', '/2.mid'])
  })
}
files = files.sort((a, b) => {
  return b.views - a.views
})

app.route('/files').get(verifyToken, (req, res) => {
  let page = Math.abs(req.query.page || 0)
  let limit = Math.abs(req.query.limit || 10)
  let nasNext = (page * limit) + limit < files.length
  let filter = req.query.filter
  let filterFunc = null
  if (filter === 'top') {
    filterFunc = (a, b) => {
      return b.views - a.views
    }
  } else if (filter === 'favs') {
    filterFunc = (a, b) => {
      return b.favorites - a.favorites
    }
  } else {
    filterFunc = (a, b) => {
      return b.created_at - a.created_at
    }
  }

  return res
    .status(200)
    .send({
      files: files.sort(filterFunc).slice(page * limit, (page * limit) + limit),
      meta: {
        count: files.length,
        page: page,
        nasNext: nasNext,
        limit: limit
      }
    })
})

app.route('/files/:id').get(verifyToken, (req, res) => {
  const id = Math.abs(req.params.id)
  const file = files.find((f) => {
    return f.id === id
  })
  if (file) {
    file.views += 1
    return res
      .status(200)
      .send(file)
  } else {
    return res
      .status(404)
      .send()
  }
})

app.route('*').get((req, res) => {
  return res
    .status(404)
    .send(null)
})

app.listen(3001, () =>
  console.log(`Server listens`)
)
