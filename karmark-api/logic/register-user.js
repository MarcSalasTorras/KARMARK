const { validate } = require('karmark-utils')
const { models: { User } } = require('karmark-data')
const { NotAllowedError } = require('karmark-errors')
const bcrypt = require('bcryptjs')

/** Creates a new user on the DB with the given data
 *
 * @param {string} name first name of the user
 * @param {string} surname second name or surname of the user
 * @param {string} username username of the user, will be used to login in the application
 * @param {string} password password used for sign in
 */
module.exports = (name, surname, username, password) => {
    validate.string(name, 'name')
    validate.string(surname, 'surname')
    validate.string(username, 'username')
    validate.string(password, 'password')

    return User.findOne({ username })
        .then(user => {
            if (user) throw new NotAllowedError(`user with username ${username} already exists`)

            return bcrypt.hash(password, 10)
        })
        .then(password => {
            user = new User({ name, surname, username, password, created: new Date })

            return user.save()
        })
        .then(() => { })
}
