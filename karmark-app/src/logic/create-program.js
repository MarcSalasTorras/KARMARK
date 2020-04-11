import {validate } from 'karmark-utils'
import {NotAllowedError} from 'karmark-errors'
import context from './context'

const API_URL = process.env.REACT_APP_API_URL

/** Creates a new program on the DB with the given data
 *
 * @param {string} name name of the program you want to save
 * @param {array} code array of istructions of the program
 */
export default (function (name, code) {
    validate.string(name, 'name')
    validate.type(code, 'code', Array)

    return (async () => {
        const response = await fetch(`${API_URL}/users/programs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            },
            body: JSON.stringify({name, code})
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


}).bind(context)