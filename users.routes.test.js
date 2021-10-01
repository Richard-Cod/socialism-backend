// Appel des modules
const request = require('supertest')
const User = require("./models/User")
const messages = require('./messages')

const server = require('./index')

const url = '/api/users'

/* Supprimer touts les utilisateur */
function deleteAll() {
    return User.deleteMany({})
    .then(result => result)
    .catch(err => {
        console.error(err)
    })
  }


  describe('Route Users', () => {
    beforeAll(() => {
        deleteAll()
      })


      test('#1 - GET / - Without data return 202', async () => {

        const response = await request(server).get(url)          // Exécution de la requète
        console.log(response.body)
        expect(response).toBeDefined()                           // Attend une réponse définit
        expect(response.statusCode).toBe(200)                    // Code HTTP 202 attendu
        // expect(response.body.message).toBe(message.user.nothing) // Message attendu
      })


    //   test('#2 - POST / - Empty form return 400', async () => {
    //     const response = await request(server).post(url)        // Exécution de la requète
    //     expect(response).toBeDefined()                          // Attend une réponse définit
    //     expect(response.statusCode).toBe(400)                   // Code HTTP 400 attendu
    //     expect(response.body.message).toBe(message.emptyFields) // Message attendu
    //   })





})