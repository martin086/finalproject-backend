import userModel from '../src/models/MongoDB/userModel.js';
import { connectionTestMongoose } from '../src/index.js';
import chai from "chai";

//await connectionTestMongoose()

const expect = chai.expect


describe("Test con chai para users", () => {

    before(function () {
        console.log("Arrancando test con chai")
    })

    beforeEach(function () {
        this.timeout(5000)
    })

    it('Consultar todos los usuarios de mi BDD con Chai', async function () {
        const users = await userModel.find()
        //expect(users).deep.equal([])
        expect(Array.isArray(users)).not.to.be.ok //!() Revisa si es V o F
        //expect(users).to.be.deep.equal([]) //Revisa si el array es vacio
    })
})