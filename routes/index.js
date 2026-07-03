var express = require('express');
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

// openai
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function resolveType(rawType) {
  return typeOfMeal[rawType] ? rawType : defaultType;
}

async function renderMealRecommendation(req, res, type) {
  try {
    var result = await openai.responses.create({
      model: 'gpt-5.4-mini',
      store: true,
      input: 'おすすめの' + typeOfMeal[type] + 'を1つ',
    });
    res.render('index', {
      typeOfMeal,
      type,
      text: markdown.render(result.output_text),
    });
  } catch (err) {
    console.error(err);
    res.render('index', {
      typeOfMeal,
      type,
      text: 'エラーが発生しました。再読み込みしてください',
    });
  }
}

router.post('/', async(req, res, next) => {
  await renderMealRecommendation(req, res, resolveType(req.body.type));
});

router.get('/', async(req, res, next) => {
  await renderMealRecommendation(req, res, defaultType);
});

module.exports = router;
