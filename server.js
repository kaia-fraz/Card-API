const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./middleware/auth');
require("dotenv").config();


app.use(express.urlencoded({ extended: true }));

const cardData = fs.readFileSync('data/card.json');
const cards = JSON.parse(cardData).cards;

const userData = fs.readFileSync('data/user.json');
const users = JSON.parse(userData).users;

const JWT_SECRET = process.env.JWT_SECRET;

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

//ENDPOINTS

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
  
  app.post('/cards/create', authenticateToken, (req, res) => {
    const { id, name, type, rarity, set } = req.body;

    const newCard = { id, name, type, rarity, set };
    cards.push(newCard);

    // Save to card.json file
    const updatedCardData = { cards: cards };
    fs.writeFileSync('data/card.json', JSON.stringify(updatedCardData, null, 4));

    res.send(`
      <h2>Card Created Successfully!</h2>
      <p><strong>Authenticated User:</strong> ${req.user.username}</p>
      <pre>${JSON.stringify(newCard, null, 2)}</pre>
      <a href="/cards">View all cards</a>
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
    return res.status(404).send(`Card with ID: ${id} not found`);
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

//auth
app.get('/auth', (req, res) => {
  res.send(`
    <h2>Authenticate</h2>
    <form method="POST" action="/auth">
      <input name="username" placeholder="Username" required /><br>
      <input name="password" type="password" placeholder="Password" required /><br>
      <button type="submit">Login</button>
    </form>
  `);
});
app.post("/auth", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.send("Missing username or password");
  }
  
  const token = jwt.sign(
    { username: username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  const newUser = {
    id: String(Date.now()),
    username,
    password,
    token
  };

  users.push(newUser);

  const updatedData = { users: users };
  fs.writeFileSync('data/user.json', JSON.stringify(updatedData, null, 4));

  res.send(`
    <h2>Token Generated</h2>
    <p><strong>Username:</strong> ${username}</p>
    <p><strong>User saved to database!</strong></p>
    <textarea rows="6" cols="80">${token}</textarea>
    <p>Use this token in the Authorization header:</p>
    <pre>Authorization: Bearer ${token}</pre>
  `);
});

//users
app.get('/users', (req, res) => {
  res.json(users);
});

app.listen(port, () => {
  console.log(`Card API listening at http://localhost:${port}`)
})
