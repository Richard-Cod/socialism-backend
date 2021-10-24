const request = require('supertest')
const Post = require("../../models/Post")
const User = require('../../models/User')
const deleteAllUsers = require('../../utils/deleteAllUsers')
const getJwt = require('../../utils/getJwt')

const url = '/api/posts'

function deleteAllPosts() {
  return Post.deleteMany({})
  .then(result => result)
  .catch(err => {
      console.error(err)
  })
}

const getUser = () => {
  return User.create({email : "test@gmail.com" , password : "password" , fullName : "test"})
}

describe('Route Posts', () => {
let server ; 
let post1;
let token;
let user;

  beforeEach( () => {

    deleteAllPosts()
    deleteAllUsers()

      server = require('../../index')
      post1 = {title : 'title1' , content : "content1"}
      user = {email : "test@gmail.com" , password : "password"}
      token = getJwt(user)
       

    })

    afterEach(() => {
      deleteAllUsers()
        server.close()

      })

      afterAll(() => {
        deleteAllUsers()
        deleteAllPosts()
      })


      const exec = async (url ,statusCode , type = "post") => {
        const response = await request(server)[type](url ,
        ).send(post1).set("token" , token)
  
        expect(response).toBeDefined()       
        expect(response.statusCode).toBe(statusCode)  
        return response
      }


  test('#1 - POST / - should return 401 when no token in the req', async () => {
    token = null
      await exec(`${url}/create` , 401)
  })

  test('#1 - POST / - should return 500 when no title in the req', async () => {
    post1.title = null
    await exec(`${url}/create` , 500)
})

test('#1 - POST / - should create post and return 201', async () => {
  const user = await getUser()
  token = getJwt(user)
  await exec(`${url}/create` , 201)
})


test('#2 - PUT / - should return 401 when no token in the req on update', async () => {
  token = null
    await exec(`${url}/6156fb69e65263e018a881f9` , 401 , "put")
})

test('#2 - PUT / - should return 500 when id is not correct', async () => {
    await exec(`${url}/6156fb69e65263e018a881f` , 500 , "put")
})

test('#2 - PUT / - should not update post when not exists', async () => {
  await exec(`${url}/6156fb69e65263e018a881f9` , 404 ,"put")
})

test('#2 - PUT / - should update post ', async () => {
  const user = await getUser()

  const post = await Post.create({...post1 ,createdBy : user._id})
  
  await exec(`${url}/${post._id}` , 200 ,"put")
})


test('3# - DELETE / - should return 401 when no token in the req on delete', async () => {
  token = null
    await exec(`${url}/6156fb69e65263e018a881f9` , 401 , "delete")
})

test('#3 - DELETE / - should not delete post when not exists', async () => {
  await exec(`${url}/6156fb69e65263e018a881f9` , 404 ,"delete")
})


test('#3 - DELETE / - should not delete post when id is not correct', async () => {
  await exec(`${url}/6156fb69e65263e018a881f` , 500 ,"delete")
})


test('3# - DELETE / - should delete post ', async () => {
  const user = await getUser()
  const post = await Post.create({...post1 ,createdBy : user._id})
  await exec(`${url}/${post._id}` , 200 ,"delete")
})



})