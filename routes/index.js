var express = require('express');
var router = express.Router();
var multer = require('multer');
var author = require('../controllers/author');
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');
var statisticsController = require('../controllers/statistics_controller');
var favoritosController = require('../controllers/favourites_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz',errors:[] });
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load); //autoload :quizId
router.param('commentId', commentController.load); // autoload :commentId
router.param('userId', userController.load);
// Definición de rutas de sesion
router.get('/login',sessionController.auto_logout, sessionController.new);
router.post('/login', sessionController.auto_logout,sessionController.create);
router.get('/logout',sessionController.auto_logout, sessionController.destroy);

// Definición de rutas de cuenta
router.get('/user',sessionController.auto_logout, userController.new); // formulario sign un
router.post('/user',sessionController.auto_logout, userController.create); // registrar usuario
router.get('/user/:userId(\\d+)/edit', sessionController.loginRequired,sessionController.auto_logout, userController.ownershipRequired, userController.edit); // editar información de cuenta
router.put('/user/:userId(\\d+)', sessionController.loginRequired,sessionController.auto_logout, userController.ownershipRequired, userController.update); // actualizar información de cuenta
router.delete('/user/:userId(\\d+)', sessionController.loginRequired,sessionController.auto_logout, userController.ownershipRequired, userController.destroy); // borrar cuenta
router.get('/user/:userId(\\d+)/quizes',sessionController.auto_logout, quizController.index); // ver las preguntas de un usuario

router.get('/quizes', sessionController.auto_logout,quizController.index);
router.get('/author' , sessionController.auto_logout,author.author);
router.get('/quizes/:quizId(\\d+)',sessionController.auto_logout,quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',sessionController.auto_logout,quizController.answer);
router.get('/quizes/new',sessionController.auto_logout, sessionController.loginRequired, quizController.new);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired,sessionController.auto_logout, quizController.ownershipRequired ,quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired,sessionController.auto_logout, userController.ownershipRequired, multer({ dest: './public/media/'}), quizController.update);
router.post('/quizes/create', sessionController.loginRequired,sessionController.auto_logout, multer({ dest: './public/media/'}), quizController.create);

router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, sessionController.auto_logout,quizController.ownershipRequired ,quizController.destroy);


// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', sessionController.auto_logout,commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', sessionController.auto_logout,commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.auto_logout, sessionController.loginRequired, commentController.ownershipRequired ,commentController.publish);
router.get('/quizes/statistics', sessionController.auto_logout, statisticsController.statistics);
module.exports = router;



//Favoritos
router.put('/user/:userId(\\d+)/favourites/:quizId(\\d+)', sessionController.auto_logout, sessionController.loginRequired, favoritosController.update );
router.delete('/user/:userId(\\d+)/favourites/:quizId(\\d+)', sessionController.auto_logout, sessionController.loginRequired, favoritosController.destroy );
router.get('/user/:userId(\\d+)/favourites', sessionController.auto_logout, sessionController.loginRequired, favoritosController.show );



