const fs = require('fs')
const bcrypt = require('bcryptjs')
require('./src/localization')()
const User = require('./src/models/user')
const File = require('./src/models/File')

const prepareDB = async (args, transaction) => {
  console.log(args)

  const force = args.indexOf('--force') !== -1

  await User.sequelize.sync({
    force,
    transaction
  })

  let count = await User.count({ transaction })

  if (count === 0) {
    const password = '111111'
    const passwordEncrypted = bcrypt.hashSync(password)
    const user = await User.create({
      email: 'isakovp@gmail.com',
      name: 'Pavel Isakov',
      password: passwordEncrypted
    }, { transaction })
    console.log('Created user with username:', user.email, 'password:', password)
  }

  count = await File.count({ transaction })
  if (count === 0) {
    fs.rmdirSync('./uploads', { recursive: true })
    fs.mkdirSync('./uploads')
  }
}

const setup = async () => {
  const tr = await File.transaction()
  try {
    // eslint-disable-next-line no-undef
    await prepareDB(process.argv.slice(2), tr)
    await tr.commit()
  } catch (error) {
    await tr.rollback()
  }
}

setup()

