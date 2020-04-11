import {NotFoundError} from 'karmark-errors'
import context from './context'

const API_URL = process.env.REACT_APP_API_URL

/** Retrieve all the user's programs
 *
 */
export default (function () {
    return (async () => {
        const response = await fetch(`${API_URL}/programs`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        })

        const { status } = response
        if (status === 200) {
            
            const programs = await response.json()

            return programs

        }

        if (status >= 400 && status < 500) {
            const { error } = await response.json()

            if (status === 401) {
                throw new NotFoundError(error)
            }

            throw new Error(error)
        }

        throw new Error('server error')
    })()
}).bind(context)