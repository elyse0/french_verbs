var express = require('express');
var router = express.Router();

// GET /api - Show REST API table
router.get('/', function(req, res) {

    res.render('api');
});

module.exports = router;