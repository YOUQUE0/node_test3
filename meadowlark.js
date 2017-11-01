var fortune = require('./lib/fortune.js');
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

// 禁用服务器头信息
app.disable('x-powered-by');

// 设置handlebars视图引擎
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// 启用视图缓存
//app.set('view cache', true);

app.set('port', process.env.PORT || 3000);

app.use(function (req, res, next) {
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

if (app.thing == null) console.log('bleat!');

app.get('/', function(req, res){
	res.render('home');
});

app.get('/about', function(req, res){	
	res.render('about', {fortune: fortune.getFortune(), pageTestScript: '/qa/tests-about.js'});
});

app.get('/tours/hood-river', function (req, res) {
	res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function (req, res) {
	res.render('tours/request-group-rate');
});

// roleType
app.post('/gfwkkpds/getUserRoleTypesInPlan', function(req, res){
	res.send({"result_code":"00","user_role_types":["03","02","03","04"]});
});

// 专项计划状态和基础资产类型
app.post('/gfwkkpds/getSpecialPlanTypeAndStatus', function(req, res){
	res.send({"result_code":"00","special_plan_base_info":{"asset_type":"0301","status":"60"}});
});

// 鉴权
app.post('/aaa/authentication/gfwkSpecialPlanDetailInfo', function(req, res){
	res.send({'result_code':'00'});
});

// 获取在所有计划的角色
app.post('/gfwkkpds/getUserRoleTypes', function(req, res){
	res.send({"result_code":"00","user_role_types":["03","02","03","04"]});
});

// 浏览器发送信息
app.get('/headers', function (req, res) {
	res.set('Content-Type', 'text/plain');
	var s = '';
	for (var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
	res.send(s);
});

// req包含的信息
app.get('/request', function (req, res) {
	var arr = {
		params: req.params,
		param: req.param('a'),
		query: req.query,
		body: req.body,
		route: req.route,
		cookies: req.cookies,
		singedCookies: req.singedCookies,
		headers: req.headers,
		accepts: req.accepts(['application/json', 'text/plain']),
		ip: req.ip,
		path: req.path,
		host: req.host,
		xhr: req.xhr,
		protocol: req.protocol,
		secure:req.secure,
		url: req.url,
		originalUrl: req.originalUrl,
		acceptedLanguages: req.acceptedLanguages
	};
	res.send(arr);
});

app.get('/error', function (req, res) {
	res.status(500).render('500');
});

app.get('/greeting', function (req, res) {
	res.render('about', {
		message: 'welcome',
		style: req.query.style,
		userid: req.cookie,
		username: req.session
	});
});

app.get('/no-layout', function (req, res) {
	res,render('no-layout', {layout: null});
});

app.get('/custom-layout', function (req, res) {
	res.sender('custom-layout', {layout: 'custom'});
});

app.get('/test', function (req, res) {
	res.type('text/plain');
	res.send('this is a test');
});

// 基本表单提交，重定向
app.post('/process-contact', function (req, res) {
	//console.log('Received contact from ' + req.body.name + '<' + req.body.email + '>');
	console.log(req.body);
	res.redirect(303, '/test');
});

// 更加强大的表单处理
app.post('/process-contact1', function (req, res) {
	//console.log('Received contact from ' + req.body.name + '<' + req.body.email + '>');
	try {
		return res.xhr ? res.render({success: true}) : res.redirect(303, '/test');
	}
	catch (ex) {
		return res.xhr ? res.json({error: 'Database error.'}) : res.redirect(303, '/database-error');
	}
});

var tours = [
	{id: 0, name: 'Hood River', price: 99.99},
	{id: 1,name: 'Oregon Coast', price: 149.95}
];

// get节点,返回json,xml,text
app.get('/api/tours', function (req, res) {	
	var tourXml = '<?xml version="1.0"?><tours>' + tours.map(function (p) {
		return '<tour price="' + p.price + '" id="' + p.id + '">' + p.name + '</tour>';
	}).join('') + '</tours>';
	var toursText = tours.map(function (p) {
		return p.id + ': ' + p.name + ' (' + p.price + ')';		
	}).join('\n');
	res.format({
		'application/json': function () {			
			res.json(tours);
		},
		'applicaton/xml': function () {
			res.type('application/xml');
			res.send(toursXml);
		},
		'text/xml': function () {
			res.type('text/xml');
			res.send(toursXml);
		},
		'text/plain': function () {
			res.type('text/plain');
			res.send(toursXml);
		}
	});
});

// put节点
app.put('/api/tour/:id', function (req, res) {
	var p = tours.some(function (p) {
		return p.id == req.params.id;
	});
	if (p) {
		if (req.query.name) {
			p.name = req.query.name;
		}
		if (req.query.price) {
			p.price = req.query.price;
		}
		res.json({success: true});
	}
	else {
		res.json({error: 'No such tour exists.'});
	}
});

// DEL节点
app.del('/api/tour/:id', function (req, res) {
	var i;
	for (var i = tours.length -1; i >= 0; i--) {
		if (tours[i].id == req.params.id) {
			break;
		}
		if (i >= 0) {
			tours.splice(i, 1);
			res.json({success: true});
		}
		else {
			res.json({error: 'No such tour exists.'});
		}
	}
});

// 定制404页面
app.use(function(req, res){	
	res.status(404);
	res.render('404');
});

// 定制500页面
app.use(function(err, req, res, next){
	console.error(err.stack);
	//res.type('text/plain');
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port') + ';press Ctrl-C to terminate');
});

