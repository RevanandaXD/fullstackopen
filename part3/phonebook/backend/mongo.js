const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://revanandaislamipasha_db_user:${password}@phonebook.i8hfq7v.mongodb.net/?appName=Phonebook`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((persons) => {
      console.log(`${persons.name} ${persons.number}`)
    })
    mongoose.connection.close()
  })
} else {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number,
  })

  if (!person.name) {
    throw new Error('insert your name')
  }

  if (!person.number) {
    throw new Error('insert your number')
  }

  person.save().then(() => {
    console.log(
      `added ${process.argv[3]} number ${process.argv[4]} to phonebook`,
    )
    mongoose.connection.close()
  })
}
