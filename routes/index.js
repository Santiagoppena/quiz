var express = require('express');
var router = express.Router();
var author = require('../controllers/author');
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load); //autoload :quizId

router.get('/quizes', quizController.index);
router.get('/author' , author.author);
router.get('/quizes/:quizId(\\d+)',quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',quizController.answer);
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);
	
module.exports = router;
