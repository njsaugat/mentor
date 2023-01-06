const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const PORT = 5000;

const { PrismaClient } = require('@prisma/client');

// const { router } = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());

const prisma = new PrismaClient();
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.post('/login', async (req, res) => {
  console.log(req.body);
  //   console.log(req);
  let { userId, username, password } = req.body;
  console.log(userId);
  console.log(password);
  userId = parseInt(userId);
  const user = await prisma.user.findUnique({ where: { userId: userId } });
  if (password === user.password) {
    req.session.user = user;
    console.log('session id for this user is ' + req.sessionID);
    res.send('session created');
  }
});

app.get('/login', (req, res) => {
  res.send('hello world');
});

// app.get('/deduct-cash', (req, res) => {});

app.post('/deduct-cash', async (req, res) => {
  const { cashAmount } = req.body;
  if (req.session.user) {
    try {
      const userCash = await prisma.user.find({ id: req.session.user.id }); //user having same id will queried
      userCash -= cashAmount;
      await prisma.user.update({
        where: { id: req.session.id },
        data: { userCash: userCash },
      });

      res.send('Transaction successful');
    } catch {
      res.send('transaction unsucessful');
    }
  }
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
