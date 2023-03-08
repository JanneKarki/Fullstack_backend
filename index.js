const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.static('./backend/build'))
app.use(express.json())
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


const cors = require('cors')

app.use(cors())
morgan.token('req-body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body', {
  
}))

const generateId = () => {
    const id = Math.floor(Math.random() * 100000);
    return id + 1
}

function searchName(name) {
    for (let i = 0; i < persons.length; i++) { 
        const person = persons[i];
        if (person.name === name) {
            return true;
        } 
    }
    return false;
}

  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }
    if (searchName(body.name)){
        return response.status(400).json({ 
            error: 'name already exists ' 
          })
    }
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(persons)
  })


app.get('/api/persons', (request, response) => {
    response.json(persons)

  })

app.get('/info', (request, response) => {
    const count = persons.length;
    response.send(`<div><p>Phonebook has info for ${count} people</p><p>${new Date()}</p></div>`)
  })

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {    
        response.json(person)  
    } else {    
        response.status(404).end()  
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})


const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})