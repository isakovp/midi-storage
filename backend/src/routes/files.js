const os = require('os')
const fs = require('fs')
const { execSync } = require('child_process')
const express = require('express')
const multer = require('multer')

const router = express.Router()
const { renderValidationErrors } = require('./common')
const File = require('../models/file')
const User = require('../models/user')
const { can } = require('../config/cancan')()
const { Op, ValidationError } = require('sequelize')

const FILTERS_MAP = {
  top: 'views',
  favs: 'favorites',
  newest: 'createdAt'
}

// File storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir())
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').slice(-1)[0])
  }
})
const upload = multer({ storage })


// Files index
router.get('/', User.verifyToken, async (req, res) => {
  const page = Math.abs(req.query.page || 0)
  const limit = Math.abs(req.query.limit || 10)

  const query = req.query.query
  let where
  if (query) {
    where = {
      name: { [Op.iLike]: `%${query.toLowerCase()}%` }
    }
  }
  const filter = req.query.filter
  const order = FILTERS_MAP[filter] || 'createdAt'
  const { count, rows } = await File.scope({ method: ['forUser', req.user.id] }).findAndCountAll({
    where,
    offset: page * limit,
    order: [
      [order, 'DESC'],
      ['name', 'ASC']
    ],
    limit,
    include: 'createdBy'
  })
  const nasNext = (page * limit) + limit < count

  return res
    .status(200)
    .send({
      files: File.serialize(rows),
      meta: {
        count: count,
        page,
        nasNext,
        limit
      }
    })
})

// File create
router.post('/', User.verifyToken, upload.single('file'), async (req, res) => {
  const upload = multer().single('file')
  const body = req.body
  let newFile
  upload(req, res, async () => {
    try {
      newFile = await File.build({
        name: body.name,
        description: body.description,
        filename: req.file ? req.file.filename : null,
        createdById: req.user.id
      }, {
        include: {
          association: File.createdBy
        }
      })

      const midiFileName = os.tmpdir() + '/' + newFile.filename
      try {
        const result = execSync('midi2abc -f ' + midiFileName + ` -title "${newFile.name}"`)
        newFile.abc = result.toString()
      } catch (error) {
        return res
          .status(500)
          .end()
      } finally {
        fs.rmSync(midiFileName)
      }

      await newFile.save()
      return res
        .status(200)
        .send(newFile.serialize())
    } catch (ex) {
      if (ex instanceof ValidationError) {
        return renderValidationErrors(ex, res)
      } else {
        throw ex
      }
    }
  })
})

// File show
router.get('/:id', User.verifyToken, async (req, res) => {
  const file = await File.findByPk(req.params.id, {
    include: 'createdBy'
  })
  if (file) {
    if (can(req.user, 'view', file)) {
      await file.increment('views', { by: 1 })

      return res
        .status(200)
        .send(file.serialize())
    } else {
      return res
        .status(404)
        .send()
    }
  } else {
    return res
      .status(404)
      .send()
  }
})

module.exports = router
