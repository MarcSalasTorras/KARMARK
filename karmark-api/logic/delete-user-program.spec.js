require('dotenv').config()

const {expect} = require('chai')
const {random} = Math
const {mongoose, models:{User, Program}} = require('karmark-data')
const {deleteUserProgram} = require('./')
const bcrypt = require('bcryptjs')

const{ env: {TEST_MONGODB_URL}} = process

describe('deleteUserProgram', () =>{
    let name, surname, username, programName, code, _id, userId

    before(() => {
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => User.deleteMany())
        .then(() => Program.deleteMany())
    })
    beforeEach(() =>{
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`
        programName = `programName-${random()}`
        code = ["up","down","left","right"]

        return bcrypt.hash(password, 10)
        .then((password) => User.create({ name, surname, username, password, created: new Date }))
        .then((user) => userId = user.id)
        .then((userId) => Program.create({name: programName, created: new Date, author: userId, code}))
        .then((program) =>{
            return _id = program.id

        } )
    })
    it('should succed on correct arguments', async () =>{
        const result = await deleteUserProgram(userId, _id)
        expect(result).to.be.undefined
    })
    it('shpuld fail on non string author', async() => {
        userId = 4
        await expect(() => deleteUserProgram(userId, _id)).to.throw(TypeError, (`author ${userId} is not a string`))

        userId = true
        await expect(() => deleteUserProgram(userId, _id)).to.throw(TypeError, (`author ${userId} is not a string`))

        userId = []
        await expect(() => deleteUserProgram(userId, _id)).to.throw(TypeError, (`author ${userId} is not a string`))

        userId = {}
        await expect(() => deleteUserProgram(userId, _id)).to.throw(TypeError, (`author ${userId} is not a string`))
    })
    it('shpuld fail on non string id', async() => {
        _id = 4
        await expect(() => deleteUserProgram(userId, _id)).to.throw(TypeError, (`id ${_id} is not a string`))

        _id = true
        await expect(() => deleteUserProgram(userId, _id)).to.throw(TypeError, (`id ${_id} is not a string`))

        _id = []
        await expect(() => deleteUserProgram(userId, _id)).to.throw(TypeError, (`id ${_id} is not a string`))

        _id = {}
        await expect(() => deleteUserProgram(userId, _id)).to.throw(TypeError, (`id ${_id} is not a string`))
    })
    after(() => Promise.all([User.deleteMany(), Program.deleteMany()]).then(() => mongoose.disconnect()))

})