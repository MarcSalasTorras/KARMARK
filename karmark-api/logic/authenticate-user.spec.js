require('dotenv').config()

const { expect } = require('chai')
const { random } = Math
const { mongoose, models: { User } } = require('karmark-data')
const { ContentError, NotAllowedError } = require('karmark-errors')
const { authenticateUser } = require('./')
const bcrypt = require('bcryptjs')

const { env: { TEST_MONGODB_URL } } = process

describe('authenticateUser', () => {
    let username, password, _id

    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )
    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`

        return bcrypt.hash(password, 10)
            .then((password) => User.create({ name, surname, username, password, created: new Date }))
            .then((user) => _id = user.id)
    })
    it('should succed on correct username and password', async () => {
        const id = await authenticateUser(username, password)
        expect(id).to.exist
        expect(id).to.be.a('string')
        expect(id).to.equal(_id)
    })
    it('should fail on non string username', async () => {
        let _username = 5
        await expect(() =>authenticateUser(_username, password)).to.throw(TypeError, (`username ${_username} is not a string`))
        _username = true
        await expect(() =>authenticateUser(_username, password)).to.throw(TypeError, (`username ${_username} is not a string`))
        _username = []
        await expect(() =>authenticateUser(_username, password)).to.throw(TypeError, (`username ${_username} is not a string`))
        _username = {}
        await expect(() =>authenticateUser(_username, password)).to.throw(TypeError, (`username ${_username} is not a string`))
    })
    it('should fail on non string password', async () => {
        let _password = 5
        await expect(() =>authenticateUser(username, _password)).to.throw(TypeError, (`password ${_password} is not a string`))
        _password = true
        await expect(() =>authenticateUser(username, _password)).to.throw(TypeError, (`password ${_password} is not a string`))
        _password = []
        await expect(() =>authenticateUser(username, _password)).to.throw(TypeError, (`password ${_password} is not a string`))
        _password = {}
        await expect(() =>authenticateUser(username, _password)).to.throw(TypeError, (`password ${_password} is not a string`))
    })
    it('should fail on empty username', async () =>{
        const _username = ''
        await expect(() =>authenticateUser(_username, password)).to.throw(ContentError, ('username is empty'))
    })
    it('should fail on empty password', async () =>{
        const _password = ''
        await expect(() =>authenticateUser(username, _password)).to.throw(ContentError, ('password is empty'))
    })
    it('should fail on incorrect username', async () => {
        const _username = 'wrongUser'
        await authenticateUser(_username, password)
            .then (() => console.log('should not reach this point'))
            .catch((error) => {
                expect(error).to.exist
                expect(error).to.be.instanceOf(NotAllowedError)
                expect(error.message).to.equal(`wrong credentials`)
            })
    } )
    it('should fail on incorrect password', async () => {
        const _password = 'wrongPassword'
        await authenticateUser(username, _password)
            .then (() => console.log('should not reach this point'))
            .catch((error) => {
                expect(error).to.exist
                expect(error).to.be.instanceOf(NotAllowedError)
                expect(error.message).to.equal(`wrong credentials`)
            })
    } )

    after(() => Promise.all([User.deleteMany()]).then(() => mongoose.disconnect()))

})