const {validate} = require('karmark-utils')
const {models: {User}} = require('karmark-data')
const {NotFoundError} = require('karmark-errors')

/** Retrieve all the user's programs
 *
 * @param {string} id id of the user
 */
module.exports = (id)  => {
    validate.string(id, 'id')

    return User.findById(id).populate('programs')
        .then(user =>{

            if (!user) throw new NotFoundError(`user not found`)
           
            user.id = user._id.toString()

            delete user._id

            const programs = user.programs.map(program => {
                
                let _program = {
                    code: program.code,
                    id: program._id.toString(),
                    name: program.name,
                    created: program.created,
                    author: program.author.toString()
                }

                console.log(_program)
                return _program 
            })

            return programs
        })

}