const {ContentError} = require('karmark-errors')

module.exports = {
    string(target, name, empty = true){
        this.type(target, name, String)
        if (empty && !target.trim()) throw new ContentError(`${name} is empty`)
    },
    type(target, name, type){
        if(type === String || type === Number || type === Boolean){
            type = type.name.toLowerCase()

            if (typeof target !== type ) throw new TypeError(`${name} ${target} is not a ${type}`)

        }else if(!(target instanceof type)) throw new TypeError(`${name} ${target} is not a ${type.name}`)
    },
    jwt(token){
        this.type(token, 'token', String)

        const parts = token.split('.')

        if (parts.length !==3) throw new ContentError('invalid token')

        const [header, payload, signature] = parts

        if (!header.trim().length || !payload.trim().length || signature.trim().length) throw new ContentError('invalid token')
    }
}