require('dotenv').config()

const express = require('express')
const path = require('path')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, 'dist')))

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
)

const PORT = process.env.PORT || 13710 // not automatic due to free server limitations

const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: 'unknown endpoint',
  })
}
const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  switch (error.name) {
    case 'CastError':
      return res.status(400).send({
        message: error.message,
      })
    case 'ValidationError':
      return res.status(400).send({
        message: error.message,
      })
    default:
  }
  next(error)
}

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((result) => {
      res.json(result)
    })
    .catch(next)
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then((result) => {
      result ? res.json(result) : res.status(404).end()
    })
    .catch(next)
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name)
    return res.status(400).json({
      error: 'Missing name',
    })

  if (!number)
    return res.status(400).json({
      error: 'Missing number',
    })

  Person.findOne({ name })
    .then((result) => {
      if (result) {
        return res.status(409).json({
          error: 'Username Already Exists',
        })
      }

      const newPerson = new Person({
        name,
        number,
      })

      newPerson
        .save()
        .then((result) => {
          res.status(201).json({
            success: true,
            message: 'berhasil ditambahkan',
            data: result,
          })
        })
        .catch(next)
    })
    .catch(next)
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const { name, number } = req.body
  Person.findById(id)
    .then((result) => {
      if (result) {
        ((result.name = name), (result.number = number))
        result
          .save()
          .then((updatePerson) => {
            res.status(200).json({
              success: true,
              message: 'berhasil terupdate',
              data: updatePerson,
            })
          })
          .catch(next)
      } else {
        res.status(404).end()
      }
    })
    .catch(next)
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then((result) => {
      result ? res.json(result) : res.status(204).end()
    })
    .catch(next)
})

app.get('/api/info', (req, res, next) => {
  Person.estimatedDocumentCount()
    .then((result) => {
      const date = new Date()
      res.send(
        `
        <p>Phonebook has info for ${result} people</p>
        <p>${date}</p>
      `,
      )
    })
    .catch(next)
})

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`your app running on ${PORT}`)
})
