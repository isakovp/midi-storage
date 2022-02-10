const express = require('express')
const multer = require('multer')
const router = express.Router()
const File = require('../models/file')
const User = require('../models/user')
const Serializer = require('sequelize-to-json')
const { ValidationError } = require('sequelize')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, global.appRoot + '/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').slice(-1)[0])
  }
})
const upload = multer({ storage: storage })

router.get('/', User.verifyToken, async (req, res) => {
  const page = Math.abs(req.query.page || 0)
  const limit = Math.abs(req.query.limit || 10)

  const result = await File.findAll({
    offset: page * limit,
    limit,
    include: 'createdBy'
  })
  const count = await File.count()
  const nasNext = (page * limit) + limit < count
  const filter = req.query.filter
  let filterFunc
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
      return b.createdAt - a.createdAt
    }
  }

  return res
    .status(200)
    .send({
      files: Serializer.serializeMany(result.sort(filterFunc), File, File.serializerScheme),
      meta: {
        count: count,
        page,
        nasNext,
        limit
      }
    })
})

router.post('/', User.verifyToken, upload.single('file'), async (req, res) => {
  const upload = multer().single('file')
  const body = req.body
  upload(req, res, async () => {
    try {
      const newFile = await File.create({
        name: body.name,
        description: body.description,
        filename: req.file ? req.file.filename : null,
        createdById: req.user.id
      }, {
        include: {
          association: File.createdBy
        }
      })
      const serializer = new Serializer(File, File.serializerScheme)
      return res
        .status(200)
        .send(serializer.serialize(newFile))
    } catch (ex) {
      if (ex instanceof ValidationError) {
        const response = {}
        ex.errors.forEach((error) => {
          response[error.path] = ex.get(error.path).map(m => m.message)
        })
        return res
          .status(422)
          .send(response)
      } else {
        throw ex
      }
    }
  })
})

router.get('/:id', User.verifyToken, async (req, res) => {
  const file = await File.findByPk(req.params.id, {
    include: 'createdBy'
  })
  if (file) {
    // await file.increment('views', { by: 1 });
    const serializer = new Serializer(File, File.serializerScheme)
    return res
      .status(200)
      .send(serializer.serialize(file))
  } else {
    return res
      .status(404)
      .send()
  }
})

module.exports = router
