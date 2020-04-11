const { retrieveUserPrograms } = require('../logic')
const { NotFoundError, ContentError } = require('karmark-errors')

module.exports = (req, res) => {
    const { payload: { sub: id } } = req

    try {
        retrieveUserPrograms(id)
            .then((programs) => res.status(200).json(programs))
            .catch((error) => {
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