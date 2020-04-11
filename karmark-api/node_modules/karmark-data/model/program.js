const mongoose = require('mongoose')
const { program } = require('../schemas')

module.exports = mongoose.model('Program', program)