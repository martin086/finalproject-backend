
import userModel from '../src/models/MongoDB/userModel.js';
import Assert from 'assert';
import { connectionTestMongoose } from '../src/index.js';

const assert = Assert.strict

// await connectionTestMongoose()

describe('Test de consulta a todos los usuarios', () => {
    //Previo a arrancar todos los tests
    before(function() {
        console.log("Arrancando test")
    })
    //Previo a arrancar un test
    beforeEach(function() {
        this.timeout(5000); //2000ms por defecto
    })

    it('Test para obtener todos los usuarios de mi BDD', async function() {
        //Contexto propio del test (scope propio)
        const users = await userModel.find()
        console.log(users)
        assert.strictEqual(Array.isArray(users), true) //Que sea igual a un array
    });
    
    it("Test para crear un usuario en mi BDD", async function () {
        //Para este tipo de test se consulta a una BDD para Testing

        const newUser = {
            first_name: "Pepe",
            last_name: "Argento",
            email: "pepe@argento.com",
            password: "1234"
        }
        const resultado = await userModel.create(newUser)

        assert.ok(resultado._id) //resultado._id -> id || error o undefined o null

    })

    it("Eliminar usuario generado", async function () {
        const email = "pepe@argento.com"

        const user = await userModel.findOneAndDelete({ email: email })
        console.log(user)
        assert.strictEqual(typeof user, 'object')
    })



});
