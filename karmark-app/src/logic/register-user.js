import { validate } from 'karmark-utils'
import { NotAllowedError } from 'karmark-errors'

const API_URL = process.env.REACT_APP_API_URL

/** Creates a new user on the DB with the given data
 *
 * @param {string} name first name of the user
 * @param {string} surname second name or surname of the user
 * @param {string} username username of the user, will be used to login in the application
 * @param {string} password password used for sign in
 */

export default function (name, surname, username, password) {
    validate.string(name, 'name')
    validate.string(surname, 'surname')
    validate.string(username, 'username')
    validate.string(password, 'password')

    return (async () => {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, surname, username, password })
        })

        const { status } = response

        if (status === 201) return

        if (status >= 400 && status < 500) {
            const { error } = await response.json()
            
            switch (status) {
                case 409:
                    throw new NotAllowedError(error)
                    

            }
            throw new Error(error)

        }
        throw new Error('server error')
    })()
}
