const { Model } = require('sequelize')

class BaseModel extends Model {
  static transaction() {
    return this.sequelize.transaction()
  }

}

module.exports = BaseModel
