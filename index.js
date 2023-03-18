require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.static('./backend/build'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body', {}
))
morgan.token('req-body', (req) => JSON.stringify(req.body))

const generateId = () => {
  const id = Math.floor(Math.random() * 100000);
  return id
}

/*
function searchName(name) {
    Person.find({ name: name }).then(person => {
      console.log(person)
        if (person.name === name) {
            return true;
        } 
        return false;
    })
}
*/

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
       
    const person = new Person ({
      id: generateId(),
      name: body.name,
      number: body.number,
    })
    person.save().then(result => {
      console.log(`result = ${result}`)
      if(result) {
        response.json(result);
        console.log(`added ${body.name} number ${body.number}`);
      }
    })
    .catch(error => next(error))
  })



app.get('/info', (request, response) => {
  (async () => {
    const count = await Person.countDocuments();
    response.send(`<div><p>Phonebook has info for ${count} people</p><p>${new Date()}</p></div>`);
  })();
  })

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
      if (person) {    
        response.json(person)  
      } else {    
        response.status(404).end()  
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { id, name, number } = request.body
  console.log(`${id} ${name}`)
  
  Person.findByIdAndUpdate(
    request.params.id,
    {name, number },
    { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})