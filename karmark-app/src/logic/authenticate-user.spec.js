const { random } = Math
const { mongoose, models: { User } } = require('karmark-data')
const { authenticateUser } = require('./index')
const { ContentError, NotAllowedError } = require('karmark-errors')
const bcrypt = require('bcryptjs')
import context from './context'

const { env: { REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL } } = process

describe('authenticateUser', () => {
    let name, surname, username, password, _id

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

        await User.deleteMany()
    })

    beforeEach(async () => {  
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`
    })
    describe('when user already exists', () => {
        let _id

        beforeEach(async () => {
            const _password = await bcrypt.hash(password, 10)

            await User.create({ name, surname, username, password: _password })
                .then(user => _id = user.id)
        })

        it('should succeed on correct credentials', () =>
            authenticateUser(username, password)
                .then(() => {
                    const { token } = context

                    expect(typeof token).toBe('string')
                    expect(token.length).toBeGreaterThan(0)

                    const { sub } = JSON.parse(atob(token.split('.')[1]))

                    expect(sub).toBe(_id)
                })
        )


        it('should fail on empty parameter', () => {
            try {
                let _username = ''
                authenticateUser(_username, password)
            } catch (error) {
                expect(error).toBeInstanceOf(ContentError)
                expect(error.message).toBe('username is empty') 
            }
            try {
                let _password = ''
                authenticateUser(username, _password)
            } catch (error) {
                expect(error).toBeInstanceOf(ContentError)
                expect(error.message).toBe('password is empty') 
            }
        })

        it('should fail on non string username', () => {
            try {
                username = 4
                authenticateUser(username, password)

            } catch (error) {
                expect(error).toBeInstanceOf(TypeError)
                expect(error.message).toBe(`username ${username} is not a string`)
            }
            try {
                username = true
                authenticateUser(username, password)

            } catch (error) {
                expect(error).toBeInstanceOf(TypeError)
                expect(error.message).toBe(`username ${username} is not a string`)
            }
            try {
                username = []
                authenticateUser(username, password)

            } catch (error) {
                expect(error).toBeInstanceOf(TypeError)
                expect(error.message).toBe(`username ${username} is not a string`)
            }
            try {
                username = {}
                authenticateUser(username, password)

            } catch (error) {
                expect(error).toBeInstanceOf(TypeError)
                expect(error.message).toBe(`username ${username} is not a string`)
            }
        })

        it('should fail on empty parameter', () => {
            try {
                let _username = ''
                authenticateUser(_username, password)
            } catch (error) {
                expect(error).toBeInstanceOf(ContentError)
                expect(error.message).toBe('username is empty') 
            }
            try {
                let _password = ''
                authenticateUser(username, _password)
            } catch (error) {
                expect(error).toBeInstanceOf(ContentError)
                expect(error.message).toBe('password is empty') 
            }
        })

        it('should fail on non string username', () => {
            try {
                password = 4
                authenticateUser(username, password)

            } catch (error) {
                expect(error).toBeInstanceOf(TypeError)
                expect(error.message).toBe(`password ${password} is not a string`)
            }
            try {
                password = true
                authenticateUser(username, password)

            } catch (error) {
                expect(error).toBeInstanceOf(TypeError)
                expect(error.message).toBe(`password ${password} is not a string`)
            }
            try {
                password = []
                authenticateUser(username, password)

            } catch (error) {
                expect(error).toBeInstanceOf(TypeError)
                expect(error.message).toBe(`password ${password} is not a string`)
            }
            try {
                password = {}
                authenticateUser(username, password)

            } catch (error) {
                expect(error).toBeInstanceOf(TypeError)
                expect(error.message).toBe(`password ${password} is not a string`)
            }
        })

        it('should fail on wrong password', async () => {
            try {
               await authenticateUser(username, `${password}-wrong`)
                
            } catch (error) {

                expect(error).toBeDefined()
                expect(error).toBeInstanceOf(NotAllowedError)
                expect(error.message).toBe('wrong credentials')
                
            }
        })
    })
    describe('when user does not exist', () => {
        it('should fail on non existing user', async () => {
            try {
               await authenticateUser(username, password)
                
            } catch (error) {

                expect(error).toBeDefined()
                expect(error).toBeInstanceOf(NotAllowedError)
                expect(error.message).toBe('wrong credentials')
                
            }
        })
    })
    


    afterAll(() => User.deleteMany().then(() => mongoose.disconnect()))
})