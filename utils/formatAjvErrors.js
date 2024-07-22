function formatAjvErrors(errors) {
  return errors.map(err => {
    if (!err.instancePath) return err.message
    return `${err.instancePath} ${err.message}`
  }).join(", ")
}

module.exports = formatAjvErrors