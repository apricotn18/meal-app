var express = require('express');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var router = express.Router();
var OpenAI = require('openai');
var markdown = require('markdown-it')();
var typeOfMeal = {
  breakfast: '朝ごはん',
  lunch: '昼ごはん',
  dinner: '夜ごはん'
};
var defaultType = 'breakfast';

// dotenv
dotenv.config();

// bodyParser
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// openai
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async(req, res, next) => {
  var type = req.body.type || defaultType;
  try {
    var result = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      store: true,
      messages: [{role: 'user', content: 'おすすめの' + typeOfMeal[type] + 'を1つ'}],
    });
    res.render('index', {
      typeOfMeal,
      type,
      text: markdown.render(result.choices[0].message.content),
    });
  } catch (err) {
    res.render('index', {
      typeOfMeal,
      type,
      text: 'エラーが発生しました。再読み込みしてください',
    });
  }
});

router.get('/', async(req, res, next) => {
  var type = defaultType;
  try {
    var result = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      store: true,
      messages: [{role: 'user', content: 'おすすめの' + typeOfMeal[type] + 'を1つ'}],
    });
    res.render('index', {
      typeOfMeal,
      type,
      text: markdown.render(result.choices[0].message.content),
    });
  } catch (err) {
    res.render('index', {
      typeOfMeal,
      type,
      text: 'エラーが発生しました。再読み込みしてください',
    });
  }
});

module.exports = router;
