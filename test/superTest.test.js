import chai from "chai";
import supertest from "supertest";
import { connectionTestMongoose } from '../src/index.js';

const expect = chai.expect

const requester = supertest('http://localhost:8080') //Config inicial de la ruta para testear

//Conexión a BDD Testing
//await connectionTestMongoose()

describe('Test de la app Ecommerce', () => {
    //Test de Session
    describe('Testing de ruta session', () => {
        let cookie = ""
        it("Ruta: api/session/register con el metodo POST", async function () {
            const newUser = {
                first_name: "Carlos",
                last_name: "Tevez",
                email: "carlos@tevez.com",
                password: "1@rt@ttr@114"
            }
    
            const { _body } = await requester.post('/api/session/register').send(newUser)
    
            expect(_body.payload).to.be.ok //Analizar si el status es 200
    
        })
    
        it("Ruta: api/session/login con el metodo POST", async function () {
            const newUser = {
                email: "carlos@tevez.com",
                password: "1@rt@ttr@114"
            }
    
            const result = await requester.post('/api/session/login').send(newUser)
            'nombreCookie="valor"'
            const cookieResult = result.headers['set-cookie'][0]
    
            expect(cookieResult).to.be.ok //Verificar existencia de cookie
    
            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1],
            }
    
            expect(cookie.name).to.be.ok.and.equal('coderCookie') //Verificacion de nombre cookie
            expect(cookie.value).to.be.ok //Verificion de valor correcto
    
        })
    
        it("Ruta: api/session/current con el metodo GET", async function () {
            //.set() setear valores como si tratara de las cookies del navegador
            const { _body } = await requester.get('/api/session/current').set('Cookie', [`${cookie.name}=${cookie.value}`])
    
            console.log(_body.payload)
    
            expect(_body.payload.email).to.be.equal("carlos@tevez.com")
        })
    
    });
    
    //Test de Products y Carts
    describe('Testing de products y carts', () => {
        let testProductA = { id: '641611240f61fb679b68d007', price: 100000.00 }
        let testProductB = { id: '641611240f61fb679b68d008', price: 150000.00 }

        let testSessionToken
        let testCartID

        let testAdminData = {
            email: 'adminCoder@coder.com',
            password: 'admincoder123'
        }
        let testUserData = {
            email: 'martinsuarezdev@gmail.com',
            password: 'testpass'
        }
        
        it('register a test user', async () => {
            const response = await requester.post('/api/session/register')
            .send({
                first_name: 'TestUser',
                last_name: 'userdev',
                email: testUserData.email,
                password: testUserData.password,
            })

            expect(response.status).to.equal(201)
        })

    
        it('login with new test user and get its session cookie', async () => {
            const response = await requester.post('/api/session/login')
            .send(testUserData)

            testSessionToken = response.headers['set-cookie'][0].split(';')

            expect(testSessionToken).to.not.be.empty
        })

        it('get test user data (including associated cart id)', async () => {
            const response = await requester.get('/api/session/current')
            .set('Cookie', testSessionToken)

            testCartID = response.body.cart_id

            expect(response.body).to.have.property('cart_id')
        })

        it('add testproductA to the test user cart', async () => {
            let response = await requester.post(`/api/carts/${testCartID}/products/${testProductA.id}`)
            .set('Cookie', testSessionToken)

            expect(response.status).to.equal(201)
        })

        it('remove the added product', async () => {
            let response = await requester.delete(`/api/carts/${testCartID}/products/${testProductA.id}`)
            .set('Cookie', testSessionToken)

            expect(response.status).to.equal(200)

        })

    });

});




