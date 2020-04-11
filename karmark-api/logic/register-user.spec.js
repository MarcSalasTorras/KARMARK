require('dotenv').config()

const { expect } = require('chai')
const { random } = Math
const { mongoose, models: { User } } = require('karmark-data')
const { ContentError, NotAllowedError } = require('karmark-errors')
const { registerUser } = require('./')
const bcrypt = require('bcryptjs')

const { env: { TEST_MONGODB_URL } } = process;

describe('registerUser', () => {
    let name, surname, username, password

    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )
    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`
    })

    it('should succed on correct user data', async () => {
        const result = await registerUser(name, surname, username, password)

        expect(result).to.not.exist
        expect(result).to.be.undefined

        return User.findOne({ username })

            .then(user => {
                
                expect(user).to.exist
                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.username).to.equal(username)
                expect(user.created).to.be.instanceOf(Date)
           

                return bcrypt.compare(password, user.password)
            })
            .then(validPassword => expect(validPassword).to.be.true)
    })
    it('should throw a ContenrError if one parameter is empty', () => {
        _name = ''
        expect(() => registerUser(_name, surname, username, password)).to.throw(ContentError, (`name is empty`))
        _surname = ''
        expect(() => registerUser(name, _surname, username, password)).to.throw(ContentError, (`surname is empty`))
        _username = ''
        expect(() => registerUser(name, surname, _username, password)).to.throw(ContentError, (`username is empty`))
        _password = ''
        expect(() => registerUser(name, surname, username, _password)).to.throw(ContentError, (`password is empty`))
    })
    it('should throw a NotAllowedError if the user already exist', async () => {
        const user = await registerUser(name, surname, username, password)
            .then(async () => {
               const _user = await registerUser(name, surname, username, password)
                    .then(() => console.log('should not reach this point'))
                    .catch((error) => {
                        expect(error).to.exist
                        expect(error).to.be.instanceOf(NotAllowedError)
                        expect(error.message).to.equal(`user with username ${username} already exists`)
                        
                    })
            })
    })
    after(() => Promise.all([User.deleteMany()]).then(() => mongoose.disconnect()))
})