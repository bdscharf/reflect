var express = require('express');
var router = express.Router();

router.get("/", (req, res, next) => {
	res.render('login');
});

router.post("/", (req, res, next) => {
	console.log(res.items);
});

module.exports = router;
