const {deleteUserProgram} = require('../logic')
const {ContentError} = require('karmark-errors')

module.exports = (req, res) => {
    const {body: {id: programId}, payload: { sub: id}} = req

    try {
        deleteUserProgram(id, programId)
        .then(() => res.status(201).end())
        .catch((error) => {
            const { message } = error

            res
            .status(status)
            .json({
                error: message
            })
        })
    } catch (error) {
        let status = 400

        if (error instanceof TypeError || error instanceof ContentError)
            status = 406

        const { message } = error

        res
            .status(status)
            .json({
                error: message
            })

    }
}