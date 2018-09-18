var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp',['users']);
var ObjectId = mongojs.ObjectId;

var app = express();

// var logger = function(req, res, next){
// 	console.log("Loggin.....");
// 	next()
// }

// app.use(logger);


// view engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'))


//body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static Path
app.use(express.static(path.join(__dirname, 'public')));

//global vars
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
});

//express validator middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;

		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}
		return{
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

// var users = [
// 	{
// 		id: 1,
// 		nama_depan: 'Kuroki',
// 		nama_belakang: 'Akito',
// 		email: 'akito@gmail.com'
// 	},
// 	{
// 		id: 2,
// 		nama_depan: 'Yuki',
// 		nama_belakang: 'Hime',
// 		email: 'yuki@gmail.com'
// 	},
// 	{
// 		id: 3,
// 		nama_depan: 'Jhon',
// 		nama_belakang: 'Shield',
// 		email: 'shield@gmail.com'
// 	},
// 	{
// 		id: 5,
// 		nama_depan: 'Yuang',
// 		nama_belakang: 'Lee',
// 		email: 'ylee@gmail.com'
// 	}
// ]

app.get('/', function(req, res){
	db.users.find(function(err, docs){
		// console.log(docs);
		res.render('index', {
			title: 'Customers',
			users: docs
		});
	})
});

app.post('/users/add', function(req, res){
	
	req.checkBody('nama_depan', 'First name is required').notEmpty();
	req.checkBody('nama_belakang', 'Last name is required').notEmpty();
	req.checkBody('email', 'Email name is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('index', {
			title: 'Customers',
			users: users,
			errors: errors
		});
	} else{
		var newUsers = {
			nama_depan: req.body.nama_depan,
			nama_belakang: req.body.nama_belakang,
			nama_email: req.body.email
		}
		
		db.users.insert(newUsers, function(err, respone){
			if(err){
				console.log(err);
			}
			res.redirect('/');
		});
	}	
});

app.delete('/users/delete/:id', function(req, res){
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
		if(err){
			console.log(err);
		}
		res.redirect('/');
	});
});

app.listen(3000,function(){
	console.log('server started on port 3000.....');
})