const {validate} = require('karmark-utils')
const {models: {Program, User}} = require('karmark-data')
const {NotFoundError} = require('karmark-errors')

/** Creates a new program on the DB with the given data
 *
 * @param {string} name name of the program you want to save
 * @param {string} author id of the author of the program
 * @param {array} code array of istructions of the program
 */
module.exports = ({name, author, code}) => {
    validate.string(name, 'name')
    validate.string(author, 'author')
    validate.type(code, 'code', Array)

    return User.findById(author)
    .then (user => {
        if (!user) throw new NotFoundError(`user with id ${author} not found`)
        
        const program = new Program({name, created: new Date, author, code})

        user.programs.push(program)  

        return Promise.all([user.save(), program.save()])
    })
}