module.exports.validateString = (notEmpty, maxLength) => {
  const validators = {}
  if (notEmpty) {
    validators.notEmpty = {
      msg: global.i18n.__('errors.validation.field_required')
    }
    validators.notNull = {
      msg: global.i18n.__('errors.validation.field_required')
    }
  }
  if (maxLength) {
    validators.len = {
      args: [0, maxLength],
        msg: global.i18n.__('errors.validation.field_max_len', maxLength)
    }
  }
  return validators
}
