require('dotenv').config()

const { expect } = require('chai')
const { random } = Math
const { mongoose, models: { User } } = require('karmark-data')
const { ContentError, NotFoundError } = require('karmark-errors')
const { retrieveUser } = require('./')
const bcrypt = require('bcryptjs')

const { env: { TEST_MONGODB_URL } } = process

describe('retrieveUser', () => {
    let name, surname, username, password, _id

    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany)
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
    it('should return userData with correct id', async () =>{
        const userData = await retrieveUser(_id)
        expect(userData).to.exist
        expect(userData.name).to.equal(name)
        expect(userData.surname).to.equal(surname)
        expect(userData.username).to.equal(username)
        expect(userData.programs).to.instanceOf(Array)
    })
    it('should fail on not sring id', async () => {
        let _id = 5
        await expect(()=> retrieveUser(_id)).to.throw(TypeError, (`id ${_id} is not a string`))
        
        _id = true
        await expect(()=> retrieveUser(_id)).to.throw(TypeError, (`id ${_id} is not a string`))
        
        _id = []
        await expect(()=> retrieveUser(_id)).to.throw(TypeError, (`id ${_id} is not a string`))
        
        _id = {}
        await expect(()=> retrieveUser(_id)).to.throw(TypeError, (`id ${_id} is not a string`))
    })
    it('should fail on empty id', async () => {
        let _id = ''
        await expect(() => retrieveUser(_id)).to.throw(ContentError, ('id is empty'))
    })
    it('should fail on incorrect id', async () => {
        let _id = '5e676668ab8a3d09d423bb1b'
        const userData = await retrieveUser(_id)
            .then(() => console.log('should not reach this point'))
            .catch((error) =>{
                expect(error).to.exist
                expect(error).to.be.instanceOf(NotFoundError)
                expect(error.message).to.equal('user with id 5e676668ab8a3d09d423bb1b not found')
            })
    })
    after(() => Promise.all([User.deleteMany()]).then(() => mongoose.disconnect()))

})