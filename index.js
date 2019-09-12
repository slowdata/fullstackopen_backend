require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

//const db = require("./db");
const Person = require('./models/person')

morgan.token('body', (req, res) => req.body && JSON.stringify(req.body))

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    const people = persons.map(p => p.toJSON())
    res.json(people)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  if (!req.body.name) return res.status(400).send({ error: 'content missing' })

  const person = new Person({
    name: req.body.name,
    date: new Date(),
    number: req.body.number
  })

  person
    .save()
    .then(savedNote => res.json(savedNote.toJSON()))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndRemove(id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body

  const person = {
    number: body.number
  }

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => {
      if (!updatedPerson) res.status(404).end()
      else res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

// Error handling
const unknownEndPoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndPoint)

const errorHandler = (error, req, res, next) => {
  console.log('>>', error.message)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)
// End of error handling

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`)
})
