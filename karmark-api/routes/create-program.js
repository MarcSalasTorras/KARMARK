const { createProgram } = require('../logic')
const { NotFoundError, ContentError } = require('karmark-errors')

module.exports = (req, res) => {
    const { body: { name, code }, payload: { sub: id } } = req

    try {
        console.log(name +' ' + code + ' ' + id)
        createProgram({name, author: id, code})
            .then(() => res.status(201).end())

            .catch(error => {
                let status = 400

                if (error instanceof NotFoundError)
                    status = 401

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