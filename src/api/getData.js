/* eslint-disable */
const express = require('express');

const axios = require('axios');

const error = require('../error');

const route2 = require('./route2');
const { getData  , getDataAuth ,getDataID,getData2} = require('../module/medData');



const router = express.Router();

const cash = {};


class searchClass{
  constructor(data){
    this.name = data.name;
    this.matched_text = data.matched_text;
    this.medius_id = data.medius_id
  }
}


router.get('/',getData ,getDataID);


router.get('/id',getData2);

router.get('/history',getDataAuth);


router.use('/route2', route2);

router.use(error.notFound);
router.use(error.errorHandler);

module.exports = router;
/* eslint-disable */