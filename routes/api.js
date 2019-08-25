const express           = require('express');
const router            = express.Router();
const ApiController     = require('./../controller/ApiController');

router.get('/prediction', function(req, res) {
    ApiController.fetchMonthRecords(function(response){
        res.send(response);
    });
});

router.get('/statics', function(req, res){
    ApiController.fetchMonthRecordsStadistics(function(response){
        res.send(response);
    });
});

module.exports = router;