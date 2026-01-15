const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

const data = fs.readFileSync('data/card.json');
const cards = JSON.parse(data).cards;

//root
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to my card API',
    endpoints: {
      cards: '/cards',
      users: '/users',
      auth: '/auth',
      createCard: "/cards/create",
      updateCard: "/cards/update/:id",
      deleteCard: "/cards/delete/:id",
      cardCount: "/cards/count",
      randomCard: "/cards/random",
    }
   })
})
//CARDS

//cards
app.get('/cards', (req, res) => {
  res.json(cards);
})
//cardcount
app.get('/cards/count', (req, res) => {
  res.json(cards.length);
})
//random card
app.get('/cards/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * cards.length);
  res.json(cards[randomIndex]);
})

// create
  app.get('/cards/create', (req, res) => {
    res.send(`
      <h2>Create Card</h2>
      <form method="POST" action="/cards/create">
        <input name="token" placeholder="JWT Token" required /><br><br>
        <input name="id" placeholder="ID" required /><br>
        <input name="name" placeholder="Name" required /><br>
        <input name="type" placeholder="Type" required /><br>
        <input name="rarity" placeholder="Rarity" required /><br>
        <input name="set" placeholder="Set" required /><br><br>
        <button type="submit">Create</button>
      </form>
    `);
  });

// delete
app.get('/cards/delete/:id', (req, res) => {
  const { id } = req.params;
  cards = cards.filter(card => card.id !== id);
  res.send(`Card with ID ${id} deleted`);
});
// update
app.get('/cards/update/:id', (req, res) => {
  const { id } = req.params;
  const card = cards.find(card => card.id === id);
  if (!card) {
    return res.status(404).send(`Card with ID ${id} not found`);
  }
  res.send(`
    <h2>Update Card</h2>
    <form method="POST" action="/cards/update/${id}">
      <input name="token" placeholder="JWT Token" required /><br><br>
      <input name="id" value="${card.id}" required /><br>
      <input name="name" value="${card.name}" required /><br>
      <input name="type" value="${card.type}" required /><br>
      <input name="rarity" value="${card.rarity}" required /><br>
      <input name="set" value="${card.set}" required /><br><br>
      <button type="submit">Update</button>
    </form>
  `);
});

//USERS

//auth

//users

app.listen(port, () => {
  console.log(`Card API listening at http://localhost:${port}`)
})
