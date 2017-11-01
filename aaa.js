var express = require('express');
var app = express();

app.listen(3999, function(){
	console.log('浏览器输入：http://localhost:3999');
});

app.get('/', function(req, res){
	console.log(req.query);
	test(5, function(v){
		res.send({v});
	});
	
	res.send({result_code:'00'});
});

var test = function(a, b, c){
	console.log(typeof(b));
	if(typeof(b) == 'function'){
		c = b;
		b = 'd';
	}
	console.log(typeof(b));
	c(a);
}

app.post('/aaa/authentication/gfwkSpecialPlan', function (req, res) {
	console.log(req);
	res.send({"result_code": "00"});
});