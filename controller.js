const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.find({ username: username });
  if (password === user.password) {
    //verifying the credentials
    req.session = username;
  }
};

exports.postCash = async (req, res) => {
  const { cashAmount } = req.body;
  if (req.session.user) {
    //valid user
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
};