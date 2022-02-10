const fs = require('fs')
const bcrypt = require('bcryptjs')
require('./src/localization')()
const User = require('./src/models/user')
const File = require('./src/models/File')

const setup = async () => {
  await User.sync({ force: true })
  await File.sync({ force: true })

  const password = '111111'
  const passwordEncrypted = bcrypt.hashSync(password)
  const user = await User.create({ email: 'isakovp@gmail.com', name: 'Pavel Isakov', password: passwordEncrypted })
  console.log("Created user with username:", user.email, "password:", password)

  fs.rmdirSync('./uploads', { recursive: true })
  fs.mkdirSync('./uploads')
  return null
}

setup()
