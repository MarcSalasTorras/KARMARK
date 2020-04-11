const {validate} = require('karmark-utils')
const {models: {User}} = require('karmark-data')
const {NotFoundError} = require('karmark-errors')

/** Retrieve all the user data
 *
 * @param {string} id id of the user
 */
module.exports = (id) =>{
    validate.string(id, 'id')

    return User.findById(id)
        .lean()
        .then(user =>{
            if (!user) throw new NotFoundError (`user with id ${id} not found`)
            
            user.id = user._id.toString()

            delete user._id

            user.programs.forEach(program => {
                program = program.toString()
            })

            user.retrieved = new Date

             return user
             
        })
        .then(({name, surname, username, programs}) => {

            return {name, surname, username, programs}
        })
}