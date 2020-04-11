const { random } = Math
const { mongoose, models: { User, Program } } = require('karmark-data')
import { retrievePrograms } from './index'
import { NotFoundError } from 'karmark-errors'
const jwt = require('jsonwebtoken')
import context from './context'

const { env: {
    REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL,
    REACT_APP_TEST_JWT_SECRET: TEST_JWT_SECRET
} } = process

describe('retrievePrograms', () => {
    let name, surname, username, password, programName, code, _id
    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

        await User.deleteMany()

        await Program.deleteMany()

    })
    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`
        programName = `programeName-${random()}`
        code = ['up', 'down', 'right', 'left']
    })

    describe('when user has programs', () => {
        beforeEach(() =>
            User.create({ name, surname, username, password })
                .then(({ id }) =>{
                    _id = id
                    context.token = jwt.sign({ sub: id }, TEST_JWT_SECRET)
                })
                .then(() => Program.create({ name: programName, created: new Date, author: _id, code }))
                .then(({id}) =>{
                    return User.findByIdAndUpdate({_id}, {programs: id})
                })
        )

        it('should retrieve the program on correct credentials', async () =>{
            const programs = await retrievePrograms()

            expect(programs).toBeDefined()
            expect(programs[0].name).toBe(programName)
            programs[0].code.forEach( (instruction, i) => {
                expect(instruction).toBe(code[i])
            } )
        })


    })

    describe('when user does not exist', () => {
        it('it should fail with no token', async () => {
            try {
                await retrievePrograms()
    
            } catch (error) {
    
                expect(error).toBeDefined()
                expect(error).toBeInstanceOf(NotFoundError)
                expect(error.message).toBe('jwt malformed')
                
            }
        })
    })
})