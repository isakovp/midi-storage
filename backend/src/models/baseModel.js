const { Model } = require('sequelize')
const Serializer = require('sequelize-to-json')

class BaseModel extends Model {
  static build (record = null, options = null) {
    const result = super.build(record, options)
    result.model = this
    result.serializerScheme = this.serializerScheme
    return result
  }

  static transaction () {
    return this.sequelize.transaction()
  }

  static serialize (file) {
    if (Array.isArray(file)) {
      return Serializer.serializeMany(file, this, this.serializerScheme)
    } else {
      throw new Error("Use model.serialize() method for serialize one object")
    }
  }

  serialize () {
    const serializer = new Serializer(this.model, this.serializerScheme)
    return serializer.serialize(this)
  }

}

module.exports = BaseModel
