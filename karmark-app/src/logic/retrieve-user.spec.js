const { random } = Math
const { retrieveUser } = require('.')
const { mongoose, models: { User } } = require('karmark-data')
const jwt = require('jsonwebtoken')
import context from './context'

const { env: {
    REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL,
    REACT_APP_TEST_JWT_SECRET: TEST_JWT_SECRET
} } = process

describe('retrieveUser', () => {
    beforeAll(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

    let name, surname, username, password, users

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`
    })

    describe('when user already exists', () => {
        beforeEach(() =>
            User.create({ name, surname, username, password })
                .then(({ id }) => context.token = jwt.sign({ sub: id }, TEST_JWT_SECRET))
        )

        it('should succeed on correct and valid and right data', async () =>{
            const user = await retrieveUser()

                expect(user).toBeDefined()
                expect(user.name).toBe(name)
                expect(user.surname).toBe(surname)
                expect(user.username).toBe(username)
                expect(user.password).toBeUndefined()

        })
    })

    describe('when user does not exist', () => {
        
        it('it should fail with no token', async () =>{
            try {
                await retrieveUser()
    
            } catch (error) {
    
                expect(error).toBeDefined()
                expect(error).toBeInstanceOf(NotFoundError)
                expect(error.message).toBe('jwt malformed')
                
            }
        })
    })

    afterAll(() => User.deleteMany().then(() => mongoose.disconnect()))
})