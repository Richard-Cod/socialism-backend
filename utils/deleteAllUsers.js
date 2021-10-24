const User = require("../models/User")

// /* Supprimer touts les utilisateur */
function deleteAll() {
    return User.deleteMany({})
    .then(result => result)
    .catch(err => {
        console.error(err)
    })
  }

  module.exports = deleteAll