const express = require('express')
const app = express()
const port = 3000

//root
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to my card API',
    endpoints: {
      cards: '/cards',
      users: '/users',
      auth: '/auth',
      createCard: "/cards/create",
      updateCard: "/cards/:id",
      deleteCard: "/cards/:id",
      cardCount: "/cards/count",
      randomCard: "/cards/random",
    }
   })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
