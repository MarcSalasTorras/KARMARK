const {validate} = require('karmark-utils')
const {models: {Program, User}} = require('karmark-data')

/** Delete a user program on the DB 
 *
 * @param {string} id id of the program
 * @param {string} author id of the author of the program
 */
module.exports = (author, id) => {
    validate.string(author, 'author')
    validate.string(id, 'id')

    return User.findByIdAndUpdate( author, {$pull: { programs: id }})
        .then(() => Program.deleteOne({_id: id}))
        .then(() => {})

}