const peopleRouter = require('express').Router()

//const db = require("./db");
const Person = require('../models/person')

peopleRouter.get('/', (req, res) => {
  Person.find({}).then(persons => {
    const people = persons.map(p => p.toJSON())
    res.json(people)
  })
})

peopleRouter.get('/:id', (req, res, next) => {
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

peopleRouter.post('/', (req, res, next) => {
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

peopleRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndRemove(id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

peopleRouter.put('/:id', (req, res, next) => {
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

module.exports = peopleRouter
