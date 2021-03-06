var express = require('express');
var router = express.Router();
// var md5 = require("md5");
var UserModel = require("../model/UserModel");
var GoodsModel = require("../model/GoodsModel");
var multiparty = require('multiparty');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.get("/shoplist",function(req,res){
	res.render("shoplist",{})
})
router.post("/shoptab",function(req,res){
	var form = new multiparty.Form();

	form.parse(req, function(err, body, files){
		var goods_name = body.goods_name[0];
		var market_price = body.market_price[0];
		var goods_sn = body.goods_sn[0];
		var sell_count = body.sell_count[0];
		

		var gm = new GoodsModel();
		gm.goods_name = goods_name;
		gm.market_price = market_price;
		gm.goods_sn = goods_sn;
		gm.sell_count=sell_count;
		gm.save(function(err){
			if(!err) {
				res.send("商品保存成功");
			} else {
				res.send("商品保存失败");
			}
		})
	})
})
router.get("/shopAdd",function(req,res){
	res.render("shopAdd",{})
	
})
router.get("/api/goods_del",function(req,res){
	GoodsModel.findByIdAndRemove({_id:req.query.gid},function(err){
		var result={
 			status : 1,
 			message: "商品删除成功"
 		}
 		if (err) {
 			result.status = -119;
 			result.message = "商品删除失败";
 		}
 		res.send(result);
	})
	
});
router.get("/shoptab",function(req,res){
	var pageNo = parseInt(req.query.pageNo ||1);
	var count = parseInt(req.query.count || 2);
	var query = GoodsModel.find({}).skip((pageNo-1)*count).limit(count).sort({data:-1})
	query.exec(function(err,docs){
		if(err){
			console.log(err);
		}else{
			GoodsModel.find({},function(err,results){
			res.render("shoptab", {list: docs, num:results.length,pageNo:pageNo,count:count});	
			})
		}
		
	})
});

router.post("/api/login",function(req,res){
	var username = req.body.username;
	var psw =req.body.psw;
	var result={
		status:1,
		message:"登陆成功"
	}
	UserModel.find({username: username, psw: psw}, function(err, docs){
		if(!err && docs.length > 0) {
			console.log("登录成功");
			res.send(result);
		} else {
			console.log("登录失败，请检查您的用户名或者密码");
			result.status = -109;
			result.message = "登录失败，请检查您的用户名或者密码"
			res.send(result);
		}
	})
})
module.exports = router;
