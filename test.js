const bcrypt = require('bcrypt');
const saltRounds = 10;

const password = "testPassword"

const hashPassword = async () => {
   const hash = await bcrypt.hash(password, saltRounds)
   return hash
}

hashPassword()

const main = async () => {
    const t = await hashPassword()
    console.log(t)

    const test = bcrypt.compareSync("testPassword", "$2b$10$fshkecmby6qwrgj4sgg6quianl8pzyoeqp19y3nj6hu6r6sdbzlq2");
    console.log(test)

}

main()