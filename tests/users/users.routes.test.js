// Appel des modules
const request = require('supertest')
const User = require("../../models/User")
const messages = require('../../messages')
const getJwt = require('../../utils/getJwt');
const deleteAllUsers = require('../../utils/deleteAllUsers');
const bcrypt = require('bcrypt');
const { mongo } = require('mongoose');

const url = '/api/users'
const defaultUser = {email : "test@gmail.com" , 
                  password : "password" , fullName : "test" }

  describe('Route Users', () => {
    let server;
    let token;
    let user1;

    const exec = async (url ,statusCode , type = "post") => {
      const response = await request(server)[type](url ,
      ).send(user1).set("token" , token)

      expect(response).toBeDefined()       
      expect(response.statusCode).toBe(statusCode)  
      return response
    }

    beforeEach(() => {
      deleteAllUsers()
        user1 = {...defaultUser}
        token = getJwt(defaultUser);
        server = require('../../index')
      })
    
      afterEach(() => {
         server.close()
      })

      afterAll(() => {
        deleteAllUsers()
      })

      test('#1 - POST / - should create user', async () => {
        const response = await exec(`${url}/create`,201)
        expect(response.body.user.email).toBe(user1.email)                         
      })

      test('#1 - POST / - should not create user because no email sent', async () => {
        user1.email = undefined
         await exec(`${url}/create`,400)
      })

      test('#2 - get / - should  not find user because no token', async () => {
        token = null;
        const response = await exec(`${url}/6156fb69e65263e018a881f9`,401 , "get")
        expect(response.body.message).toBe("UNAUTHORIZED") 
      })

      test('#2 - get / - should not find user because he does not exist', async () => {
        const response = await exec(`${url}/6156fb69e65263e018a881f9`,404 , "get")
        expect(response.body.message).toBe("User not found id")    
      })

      test('#2 - get / - should not find user because id is not correct', async () => {
         await exec(`${url}/615c510b367996cc874a46a`,400 , "get")
      })

      test('#3 - get / - should find user', async () => {
        const r = await request(server).post(`${url}/create`).send(user1)
        await exec(`${url}/${r.body.user._id}`,200 , "get")
      })

      
      test('#3 - Delete / - should  not find user to delete because no token', async () => {
        token = null
        const response = await exec(`${url}/6156fb69e65263e018a881f9`,401 , "delete")
        expect(response.body.message).toBe("UNAUTHORIZED") 
      })


      test('#3 - Delete / - should not delete user because user not found', async () => {
        const response = await exec(`${url}/6156fb69e65263e018a881f9`,404 , "delete")
        expect(response.body.message).toBe("User not found")    
      })

      test('#3 - Delete / - should delete user', async () => {
        const r = await request(server).post(`${url}/create`).send(user1)
        const response = await exec(`${url}/${r.body.user._id}`,200 , "delete")
        expect(response.body.message).toBe("User successfuly deleted")    
      })


      test('#4 - POST / - Should not log in because user not found ', async () => {
        const response = await exec(`${url}/login`,404)
        expect(response.body.message).toBe("User not found mail") 
      })

      test('#4 - POST / - Should not log in because password wrong ', async () => {
        await User.create(user1)

        user1.password = "otherpass"
        const response = await exec(`${url}/login`,404)
        expect(response.body.message).toBe("Incorrect password") 
      })


      test('#4 - POST / - Should log in ', async () => {
        const hash = await bcrypt.hash(user1.password, 10)
        await User.create({email : user1.email , password : hash , fullName : user1.email})

        const response = await exec(`${url}/login`,200)
        expect(response.body.user.email).toBe(user1.email) 
      })


      test('#5 - POST / - Should  not  send verify email because no token', async () => {
        token = null
        const response = await exec(`${url}/verifyEmail/send`,401 )
      })

      test('#5 - POST / - Should send verify email because', async () => {
        const user = await User.create(user1)
        token = getJwt(user);
        const response = await exec(`${url}/verifyEmail/send`,200 )
      })

      test('#5 - Post / - Should not send verify email because mail already verified', async () => {
        const user = await User.create({verifiedEmail : true ,...user1})
        token = getJwt(user);
        const response = await exec(`${url}/verifyEmail/send`,400 )
        expect(response.body.message).toBe("Mail already verified") 
      })


      

      test('#6 - Post / - Should not verify email because no token', async () => {
        token = null
        const response = await exec(`${url}/verifyEmail/verify`,401 )
      })

    
      test('#6 - Post / - Should not verify email because code is bad', async () => {
        const user = await User.create(user1)
        token = getJwt(user);

        const code = mongo.ObjectId()
        user.emailVerificationCode = code
        await user.save()

        user1 = {...user1 , code : "badcode"}
        const response = await exec(`${url}/verifyEmail/verify`,400 )
        expect(response.body.message).toBe("user with this code not found") 

        const searchUser = await User.findById(user._id)
        expect(searchUser.verifiedEmail).toBe(false)

        
      })

      test('#6 - Post / - Should verify email', async () => {
        const user = await User.create(user1)
        token = getJwt(user);

        const code = mongo.ObjectId()
        user.emailVerificationCode = code
        await user.save()

        user1 = {...user1 , code}
        const response = await exec(`${url}/verifyEmail/verify`,200 )

        const searchUser = await User.findById(user._id)
        console.log("search user" , searchUser)
        expect(searchUser.verifiedEmail).toBe(true)
      })


      test('#7 - Get / - Should get all users', async () => {
        await exec(`${url}`,200 , 'get' )
      })









})