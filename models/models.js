var path = require('path');
// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;
// Cargar Modelo ORM
var Sequelize = require('sequelize');
// Usar BBDD SQLite:
var sequelize = new Sequelize(DB_name, user, pwd,
{ dialect: protocol,
protocol: protocol,
port: port,
host: host,
storage: storage, // solo SQLite (.env)
omitNull: true // solo Postgres
}
);
// Importar la definicion de la tabla Quiz en quiz.js
var quiz_path=path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);
var Favourites = sequelize.import(path.join(__dirname,'favourites'));

// Importar definicion de la tabla User
var user_path = path.join(__dirname, 'user');
var User = sequelize.import(user_path);

Comment.belongsTo(Quiz); // Los comentarios pertenecen a Quiz
Quiz.hasMany(Comment); // Un quiz puede tener muchos comentarios

//los quizes pertenecen a un usuario registrado
Quiz.belongsTo(User);
User.hasMany(Quiz);

User.belongsToMany(Quiz, {through: 'Favourites'});
Quiz.belongsToMany(User, {through: 'Favourites'});

//exportar tablas
exports.Quiz = Quiz; // exportar definición de tabla Quiz
exports.Comment = Comment; // exportar definición de tabla Comment
exports.User = User;
exports.Favourites = Favourites;

//sequelize.sync() inicializa tabla de preguntas DB.
sequelize.sync().then(function() {
// then(..) ejecuta el manejador una vez creada la tabla
User.count().then(function (count){
if(count === 0) { // la tabla se inicializa solo si está vacía
User.bulkCreate(
[ {username: 'admin', password: '1234', isAdmin: true},
{username: 'pepe', password: '5678'} // el valor por defecto de isAdmin es 'false'
]
).then(function(){
console.log('Base de datos (tabla user) inicializada');
Quiz.count().then(function (count){
if(count === 0) { // la tabla se inicializa solo si está vacía
Quiz.bulkCreate(
[ {pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 2}, // estos quizes pertenecen al usuario pepe (2)
{pregunta: 'Capital de Portugal', respuesta: 'Lisboa', UserId: 2}
]
).then(function(){
 Favourites.count().then(function(count) {
 if(count === 0) { //si la tabla está vacía se inicializa
 Favourites.bulkCreate([ {UserId: 1, QuizId: 3}])
 .then(function(){console.log('Tablas inicializadas')});
 }
 });
 });
 }
 });
 });
 }
 });
});
