require('dotenv').config()

const {expect} = require('chai')
const {random} = Math
const {mongoose, models:{User, Program}} = require('karmark-data')
const {ContentError, NotFoundError} = require('karmark-errors')
const {retrieveUserPrograms} = require('./')
const bcrypt = require('bcryptjs')

const {env: {TEST_MONGODB_URL}} = process

describe('retrieveUserPrograms', () => {
    let name, surname, username, programName, code, _id, userId
    before(() =>{
        mongoose.connect(TEST_MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
            .then(() => User.deleteMAny)
            .then(() => User.deleteMAny)
    })
    beforeEach(() => {
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
        .then(({id}) =>{
            return User.findByIdAndUpdate({_id: userId}, {programs: id})
        })
    })
    it('should return all the programs with correct id', async () =>{
        const results = await retrieveUserPrograms(userId)
        expect(results).to.exist 
        expect(results[0].name).to.equal(programName)
        expect(results[0].code[0]).to.equal(code[0])
        expect(results[0].code[1]).to.equal(code[1])
        expect(results[0].code[2]).to.equal(code[2])
        expect(results[0].code[3]).to.equal(code[3])
    })
    it('should fail on non string Id', async () => {
        let userId = 5
        await expect(()=> retrieveUserPrograms(userId)).to.throw(TypeError, (`id ${userId} is not a string`))

        userId = true
        await expect(()=> retrieveUserPrograms(userId)).to.throw(TypeError, (`id ${userId} is not a string`))

        userId = []
        await expect(()=> retrieveUserPrograms(userId)).to.throw(TypeError, (`id ${userId} is not a string`))

        userId = {}
        await expect(()=> retrieveUserPrograms(userId)).to.throw(TypeError, (`id ${userId} is not a string`))


    })
    it('should fail on non string Id', async () => {
        let userId = ''
        await expect(()=> retrieveUserPrograms(userId)).to.throw(ContentError, (`id is empty`))

    })
    it('should fail if user is not found', async () =>{
        let userId = '5e68968814ebe850785fdae8'
        await retrieveUserPrograms(userId)
            .then(() => console.log('should not reach this point'))
            .catch((error) => {
                expect(error).to.exist
                expect(error).to.be.instanceOf(NotFoundError)
                expect(error.message).to.equal('user not found')
            })
    })

    after(() => Promise.all([User.deleteMany(), Program.deleteMany()]).then(() => mongoose.disconnect()))

})