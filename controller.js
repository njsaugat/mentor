const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.postLogin = async (req, res) => {
  let { userId, username, password } = req.body;
  console.log(userId);
  userId = parseInt(userId);
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
