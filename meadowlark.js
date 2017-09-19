var fortune = require('./lib/fortune.js');
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

// 设置handlebars视图引擎
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3009);


app.get('/', function(req, res){
	res.render('home');
});

app.get('/about', function(req, res){	
	res.render('about', {fortune: fortune.getFortune()});
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

