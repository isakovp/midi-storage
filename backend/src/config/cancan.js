const User = require('./../models/user')
const File = require('./../models/file')
const CanCan = require('cancan')
const cancan = new CanCan()

module.exports = () => {
    cancan.allow(User, 'view', File, (user, file) =>{
      if (user.role === 'admin' || user.role === 'moderator') {
        return true
      } else {
        return file.status === 'moderated' || file.createdById === user.id
      }
    })

    cancan.allow(User, ['edit', 'delete'], File, (user, file) =>{
      if (user.role === 'admin' || user.role === 'moderator') {
        return true
      } else {
        return file.createdById === user.id
      }
    })
    return cancan
}
