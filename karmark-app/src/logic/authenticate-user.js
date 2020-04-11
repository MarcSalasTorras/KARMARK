import { validate } from 'karmark-utils'
import { NotAllowedError } from 'karmark-errors'
import context from './context'

//const { env: { REACT_APP_API_URL: API_URL } } = process

const API_URL = process.env.REACT_APP_API_URL

/** Athenticate the user
 *
 * @param {string} username username of the user, will be used to login in the application
 * @param {string} password password used for sign in
 */
export default (function (username, password) {
    validate.string(username, 'username')
    validate.string(password, 'password')

    return (async () => {
        const response = await fetch(`${API_URL}/users/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })

        const { status } = response

        if (status === 200) {
            const { token } = await response.json()
            
            this.token = token

            return
        }

        if (status >= 400 && status < 500) {
            const { error } = await response.json()
            
            if (status === 401) {
                throw new NotAllowedError(error)
            }

            throw new Error(error)
        }

        throw new Error('server error')
    })()
}).bind(context)
