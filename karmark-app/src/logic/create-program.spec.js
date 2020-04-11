const { random } = Math
const { mongoose, models: { User, Program } } = require('karmark-data')
const { createProgram } = require('./index')
const { ContentError, NotAllowedError } = require('karmark-errors')
const jwt = require('jsonwebtoken')
import context from './context'


const { env: {
    REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL,
    REACT_APP_TEST_JWT_SECRET: TEST_JWT_SECRET
} } = process

describe('createProgram', () => {
    let name, surname, username, password, programName, code, _id

    beforeAll( async () =>{
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        
        await(() => User.deleteMany())
            
        await(() => Program.deleteMany())

    })
    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`
        programName = `programeName-${random()}`
        code = ['up','down','right','left']
    })

    describe('when user is registered', () => {
        beforeEach(() =>
            User.create({ name, surname, username, password })
                .then(({ id }) => context.token = jwt.sign({ sub: id }, TEST_JWT_SECRET))
        )

        it('should succeed on correct arguments', async () =>{
            const response = await createProgram(programName, code)

            expect(response).toBeUndefined()

            const program = await Program.findOne({name: programName})

            expect(program).toBeDefined()
            expect(program.name).toBe(programName)
            program.code.forEach( (instruction, i) => {
                expect(instruction).toBe(code[i])
            })

        })
        
        it('should fail on empty values', () =>{
            try {
                let _name = ''
                createProgram(_name, code)

            } catch (error) {
                const {message} = error

                expect(error).toBeDefined()
                expect(error).toBeInstanceOf(ContentError)
                expect(message).toBe('name is empty')

            }
        })

        it('should fail on no string name', () => {
            let _name = 4
            try {
                createProgram(_name, code)
            } catch (error) {
                expect(error).toBeInstanceOf(TypeError)
                expect(error.message).toBe(`name ${_name} is not a string`)              
            }
            _name = true
            try {
                createProgram(_name, code)
            } catch (error) {
                expect(error).toBeInstanceOf(TypeError)
                expect(error.message).toBe(`name ${_name} is not a string`)              
            }
            _name = []
            try {
                createProgram(_name, code)
            } catch (error) {
                expect(error).toBeInstanceOf(TypeError)
                expect(error.message).toBe(`name ${_name} is not a string`)              
            }
            _name = {}
            try {
                createProgram(_name, code)
            } catch (error) {
                expect(error).toBeInstanceOf(TypeError)
                expect(error.message).toBe(`name ${_name} is not a string`)              
            }
        })

        it('should fail on no array code', () => {
            let _code = 4
            try {
                createProgram(name, _code)
            } catch (error) {
                expect(error).toBeInstanceOf(TypeError)
                expect(error.message).toBe(`code ${_code} is not a Array`)              
            }
            _code = true
            try {
                createProgram(name, _code)
            } catch (error) {
                expect(error).toBeInstanceOf(TypeError)
                expect(error.message).toBe(`code ${_code} is not a Array`)              
            }
            _code = 'test'
            try {
                createProgram(name, _code)
            } catch (error) {
                expect(error).toBeInstanceOf(TypeError)
                expect(error.message).toBe(`code ${_code} is not a Array`)              
            }
            _code = {}
            try {
                createProgram(name, _code)
            } catch (error) {
                expect(error).toBeInstanceOf(TypeError)
                expect(error.message).toBe(`code ${_code} is not a Array`)              
            }
        })

        it('should fail if program Name already exist', async () =>{
            await Program.create({ name: programName, created: new Date, author: _id, code })
            try {
                await createProgram( programName, code )
                
            } catch (error) {
                expect(error).to.exist
                expect(error).to.be.instanceOf(NotAllowedError)
                expect(error.message).to.equal(`program wit name ${programName} already exist`)
                
            }
                
        })
    })

    afterAll(() => Promise.all([User.deleteMany(), Program.deleteMany()]).then(() => mongoose.disconnect()))

})