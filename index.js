const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('build'))


let persons = [
    {
        name: 'Alejandro',
        number: 53042324,
        id: 0
    },
    {
        name: 'Yan',
        number: 58234225,
        id: 1
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }

})

const generateId = () => {
    const maxId = persons.length > 0 
        ? Math.max(...persons.map(person=>person.id))
        : 0
    return maxId + 1
}

app.post('/api/persons/', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(404).json({"error": "content missing"})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`) )