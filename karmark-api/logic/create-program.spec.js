require('dotenv').config()

const { expect } = require('chai')
const { random } = Math
const { mongoose, models: { Program, User } } = require('karmark-data')
const { ContentError, NotAllowedError } = require('karmark-errors')
const { createProgram } = require('./')
const bcrypt = require('bcryptjs')

const { env: { TEST_MONGODB_URL } } = process

describe('createProgram', () => {
    let name, surname, username, password, programName, code, _id

    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => User.deleteMany())
        .then(() => Program.deleteMany())
    )
    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`
        programName = `programName-${random()}`
        code = ["up","down","left","right"]

        return bcrypt.hash(password, 10)
            .then((password) => User.create({ name, surname, username, password, created: new Date }))
            .then((user) => _id = user.id)
    })
    it('should succeed on correct arguments', async () => {
        const result = await createProgram({ name: programName, created: new Date, author: _id, code })
        expect(result).to.exist

        return Program.findOne({ name: programName })

            .then(program => {

                expect(program).to.exist
                expect(program.name).to.equal(programName)
                expect(program.code[0]).to.equal(code[0])
                expect(program.code[1]).to.equal(code[1])
                expect(program.code[2]).to.equal(code[2])
                expect(program.code[3]).to.equal(code[3])
            })
    })
    it('should file on non string name', async () => {
        let programName = 4
        await expect(() => createProgram({ name: programName, created: new Date, author: _id, code })).to.throw(TypeError, (`name ${programName} is not a string`))

        programName = true
        await expect(() => createProgram({ name: programName, created: new Date, author: _id, code })).to.throw(TypeError, (`name ${programName} is not a string`))

        programName = []
        await expect(() => createProgram({ name: programName, created: new Date, author: _id, code })).to.throw(TypeError, (`name ${programName} is not a string`))

        programName = {}
        await expect(() => createProgram({ name: programName, created: new Date, author: _id, code })).to.throw(TypeError, (`name ${programName} is not a string`))

    })
    it('should file on non string id', async () => {
        let _id = 4
        await expect(() => createProgram({ name: programName, created: new Date, author: _id, code })).to.throw(TypeError, (`author ${_id} is not a string`))

        _id = true
        await expect(() => createProgram({ name: programName, created: new Date, author: _id, code })).to.throw(TypeError, (`author ${_id} is not a string`))

        _id = []
        await expect(() => createProgram({ name: programName, created: new Date, author: _id, code })).to.throw(TypeError, (`author ${_id} is not a string`))

        _id = {}
        await expect(() => createProgram({ name: programName, created: new Date, author: _id, code })).to.throw(TypeError, (`author ${_id} is not a string`))

    })
    it('should file on non Array code', async () => {
        let code = 4
        await expect(() => createProgram({ name: programName, created: new Date, author: _id, code })).to.throw(TypeError, (`code ${code} is not a Array`))

        code = true
        await expect(() => createProgram({ name: programName, created: new Date, author: _id, code })).to.throw(TypeError, (`code ${code} is not a Array`))

        code = {}
        await expect(() => createProgram({ name: programName, created: new Date, author: _id, code })).to.throw(TypeError, (`code ${code} is not a Array`))

        code = 'spec'
        await expect(() => createProgram({ name: programName, created: new Date, author: _id, code })).to.throw(TypeError, (`code ${code} is not a Array`))

    })
    it('should file on empty name', async () => {
        let programName = ''
        await expect(() => createProgram({ name: programName, created: new Date, author: _id, code })).to.throw(ContentError, ('name is empty'))

    })
    it('should file on empty author', async () => {
        let _id = ''
        await expect(() => createProgram({ name: programName, created: new Date, author: _id, code })).to.throw(ContentError, ('author is empty'))

    })
    it('should fail if program Name already exist', async () =>{
        await Program.create({ name: programName, created: new Date, author: _id, code })

        await createProgram({ name: programName, created: new Date, author: _id, code })
                
            .catch((error) => {
                
                expect(error).to.exist
                expect(error).to.be.instanceOf(NotAllowedError)
                expect(error.message).to.equal(`program wit name ${programName} already exist`)
            })
    })
    after(() => Promise.all([User.deleteMany(), Program.deleteMany()]).then(() => mongoose.disconnect()))

})