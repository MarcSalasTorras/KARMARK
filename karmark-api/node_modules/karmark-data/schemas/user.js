const {Schema, Types: {ObjectId}} = require ('mongoose')

module.exports = new Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    created: { type: Date, required: true, default: Date.now },
    athenticate: {type: Date},
    retrieved: {type: Date},
    programs: {
        type: [{ type: ObjectId, ref: 'Program'}]
    }
})