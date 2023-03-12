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
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

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
    /*
      if (searchName(body.name)){
        return response.status(400).json({ 
            error: 'name already exists ' 
          })
      }
    */
    const person = new Person ({
      id: generateId(),
      name: body.name,
      number: body.number,
    })
    person.save().then(result => {
      response.json(result)
      console.log(`added ${body.name} number ${body.number}`)
    })
  })

const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//app.get('/info', (request, response) => {
//    const count = persons.length;
//    response.send(`<div><p>Phonebook has info for ${count} people</p><p>${new Date()}</p></div>`)
//  })

//app.get('/api/persons/:id', (request, response) => {
//    const id = Number(request.params.id)
//    const person = persons.find(person => person.id === id)
 //   if (person) {    
 //       response.json(person)  
 //   } else {    
 //       response.status(404).end()  
 //   }
//})

//app.delete('/api/persons/:id', (request, response) => {
 //   const id = Number(request.params.id)
 //   persons = persons.filter(person => person.id !== id)
 //   response.status(204).end()
//})



