const {random} = Math
const {mongoose, models: {User}} = require('karmark-data')
const {registerUser} = require('./index')
const {ContentError, NotAllowedError} = require('karmark-errors')
const bcrypt = require('bcryptjs')

const {env: {REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL}} = process

describe('registerUser', () => {
    let name, surname, username, password

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})

        await User.deleteMany()
    })

    beforeEach(() =>{
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`
    })

    it('should succeed on correct user data', async () => {
        const result = await registerUser(name, surname, username, password)

        expect(result).toBeUndefined()

        const user = await User.findOne({ username })

        expect(user).toBeDefined()
        expect(typeof user.id).toBe('string')
        expect(user.name).toBe(name)
        expect(user.surname).toBe(surname)
        expect(user.username).toBe(username)
        expect(user.created).toBeInstanceOf(Date)

        const validPassword = await bcrypt.compare(password, user.password)

        expect(validPassword).toBeTruthy()

    })

    it('should fail on empty parameter', () =>{
        try {
            let _name = ''
            registerUser(_name, surname, username, password)
        } catch (error) {
            expect(error).toBeInstanceOf(ContentError)
            expect(error.message).toBe('name is empty')
        }
        try {
            let _surname = ''
            registerUser(name, _surname, username, password)
        } catch (error) {
            expect(error).toBeInstanceOf(ContentError)
            expect(error.message).toBe('surname is empty')
        }
        try {
            let _username = ''
            registerUser(name, surname, _username, password)
        } catch (error) {
            expect(error).toBeInstanceOf(ContentError)
            expect(error.message).toBe('username is empty')
        }
        try {
            let _password = ''
            registerUser(name, surname, username, _password)
        } catch (error) {
            expect(error).toBeInstanceOf(ContentError)
            expect(error.message).toBe('password is empty')
        }

    })

    it('should fail on non string name', () => {
        try {
            name = 4
            registerUser(name, surname, username, password)

        } catch (error) {
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toBe(`name ${name} is not a string`)
        }
        try {
            name = true
            registerUser(name, surname, username, password)

        } catch (error) {
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toBe(`name ${name} is not a string`)
        }
        try {
            name = []
            registerUser(name, surname, username, password)

        } catch (error) {
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toBe(`name ${name} is not a string`)
        }
        try {
            name = {}
            registerUser(name, surname, username, password)

        } catch (error) {
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toBe(`name ${name} is not a string`)
        }
    })

    it('should fail on non string surname', () => {
        try {
            surname = 4
            registerUser(name, surname, username, password)

        } catch (error) {
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toBe(`surname ${surname} is not a string`)
        }
        try {
            surname = true
            registerUser(name, surname, username, password)

        } catch (error) {
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toBe(`surname ${surname} is not a string`)
        }
        try {
            surname = []
            registerUser(name, surname, username, password)

        } catch (error) {
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toBe(`surname ${surname} is not a string`)
        }
        try {
            surname = {}
            registerUser(name, surname, username, password)

        } catch (error) {
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toBe(`surname ${surname} is not a string`)
        }
    })

    it('should fail on non string surname', () => {
        try {
            username = 4
            registerUser(name, surname, username, password)

        } catch (error) {
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toBe(`username ${username} is not a string`)
        }
        try {
            username = true
            registerUser(name, surname, username, password)

        } catch (error) {
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toBe(`username ${username} is not a string`)
        }
        try {
            username = []
            registerUser(name, surname, username, password)

        } catch (error) {
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toBe(`username ${username} is not a string`)
        }
        try {
            username = {}
            registerUser(name, surname, username, password)

        } catch (error) {
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toBe(`username ${username} is not a string`)
        }
    })

    it('should fail on non string surname', () => {
        try {
            password = 4
            registerUser(name, surname, username, password)

        } catch (error) {
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toBe(`password ${password} is not a string`)
        }
        try {
            password = true
            registerUser(name, surname, username, password)

        } catch (error) {
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toBe(`password ${password} is not a string`)
        }
        try {
            password = []
            registerUser(name, surname, username, password)

        } catch (error) {
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toBe(`password ${password} is not a string`)
        }
        try {
            password = {}
            registerUser(name, surname, username, password)

        } catch (error) {
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toBe(`password ${password} is not a string`)
        }
    })

    it('should fail on already existing username', async () => {
        await User.create({name, surname, username, password, created: new Date})

        try {
            await registerUser(name, surname, username, password)

        } catch (error) {
            expect(error).toBeInstanceOf(NotAllowedError)
            expect(error.message).toBe(`user with username ${username} already exists`)
        }
    })

    afterAll(async () => {
        await User.deleteMany()
        await mongoose.disconnect()
    })
})