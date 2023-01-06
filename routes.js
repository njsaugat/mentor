// import { checkLogin, postCash } from './controller';
const express = require('express');
const router = express.Router();

const { postLogin, postCash } = require('./controller');

router.post('/login', postLogin);

router.post('/deduct-cash', postCash);

module.exports = router;
