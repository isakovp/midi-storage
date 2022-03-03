module.exports = {
  renderValidationErrors(ex, res) {
    const response = {}
    ex.errors.forEach((error) => {
      response[error.path] = ex.get(error.path).map(m => m.message)
    })
    return res
      .status(422)
      .send(response)
  }
}
