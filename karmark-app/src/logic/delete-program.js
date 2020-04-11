import { validate } from 'karmark-utils'
import { ContentError } from 'karmark-errors'
import context from './context'

const API_URL = process.env.REACT_APP_API_URL

/** Delete a user program on the DB 
 *
 * @param {string} id id of the program
 */
export default (function (id) {
    validate.string(id, 'id')

    return (async () => {
        const response = await fetch(`${API_URL}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            },
            body: JSON.stringify({id})
        })
        
        const { status } = response
        if (status === 201) {

            return
        }
        if (status >= 400 && status < 500) {
            const { error } = await response.json()

            if (status === 406) {
                throw new ContentError(error)
            }

            throw new Error(error)
        }

        throw new Error('server error')
    })()
}.bind(context))