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

// groq (openai互換API)
var openai = new OpenAI({
  apiKey: process.env.GROQ_TOKEN,
  baseURL: 'https://api.groq.com/openai/v1',
});
var SYSTEM_PROMPT = process.env.SYSTEM_PROMPT;

function resolveType(rawType) {
  return typeOfMeal[rawType] ? rawType : defaultType;
}

async function renderMealRecommendation(req, res, type) {
  try {
    var result = await openai.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        ...(SYSTEM_PROMPT ? [{ role: 'system', content: SYSTEM_PROMPT }] : []),
        { role: 'user', content: 'おすすめの' + typeOfMeal[type] + 'を1つ' },
      ],
    });
    res.render('index', {
      typeOfMeal,
      type,
      text: markdown.render(result.choices[0]?.message.content ?? ''),
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
