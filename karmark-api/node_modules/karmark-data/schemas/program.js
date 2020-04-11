const {Schema, Types: {ObjectId}} = require ('mongoose')

module.exports = new Schema({
    name: {type: String, required: true},
    created: {type: Date, required: true, default: Date.now},
    author: { type: ObjectId, ref: 'User'},
    code: {type: Array, required: true}
})