import context from './context'

/** Delete the token from sesion storage
 *
 */
export default (function () {
    delete sessionStorage.token
}).bind(context)