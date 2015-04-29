var express = require('express');
var router = express.Router();
var author = require('../controllers/author');
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

router.get('/author' , author.author);
router.get('/quizes/question',quizController.question);
router.get('/quizes/answer',quizController.answer);
	
module.exports = router;
