/* eslint-disable */
const express = require('express');

const axios = require('axios');

const mongoose = require('mongoose');

const error = require('../error');


const cash = {};
const Data = {};

const {MongoClient} = require('mongodb');
const schema = require('../module/schema')

let uri = 'mongodb+srv://team:team@cluster0.nhmzryi.mongodb.net/?retryWrites=true&w=majority'; 

mongoose.connect(uri ,{ useUnifiedTopology: true });


const router = express.Router();
 
class searchClass{
  constructor(data){
    this.name = data.name;
    this.matched_text = data.matched_text;
    this.medius_id = data.medius_id
  }
}

async function getData(req, res, next){
    
    let flag = false;
    let testFlag = false;
    let IDX;
    if(req.query.userEmail){
        const USER = mongoose.model('Model', schema, req.query.userEmail);
        USER.find({ user_email: req.query.userEmail}, function (err, docs) {
            if (err){
                res.json({
                    Data: "No user"
                   });
            }
            else{
                docs.forEach((element,index) => {
                    if(element.med_name.includes(req.query.query.toLowerCase()))
                    testFlag = true;
                    IDX = index;
                });
                if(testFlag){
                    res.json({
                        Data: docs[IDX]
                       });
                }else{
                    const options = {
                        method: 'GET',
                        url: 'https://medius-disease-medication.p.rapidapi.com/api/v2/disease-search',
                        params: {query: `${req.query.query}`},
                        headers: {
                          'X-RapidAPI-Key': '8d8d06962cmsh7dee8f3754f1715p1d48f1jsnaca4342b14f8',
                          'X-RapidAPI-Host': 'medius-disease-medication.p.rapidapi.com'
                        }
                      };
                       axios.request(options)
                        .then((response) => {
                            flag = false
                            for (let index = 0; index < response.data.length; index++) {
                                if(response.data[index].medius_id){
                                    cash[req.query.query.toLowerCase()] = response.data[index];
                                    flag =true;
                                }
                                break;         
                            }
                            if(flag){   
                              next()
                            }
                            else{
                            res.json({
                                    message: 'Sory, we can not find an Valid Value for this search'
                                   });
                            }
                        })
                    .catch((error)=>{
                      res.json({
                        message: error
                       });
                    });

                }

            }
        });
    }else {

    if(cash[req.query.query.toLowerCase()] === undefined){
        console.log(req.query.query)
        const options = {
            method: 'GET',
            url: 'https://medius-disease-medication.p.rapidapi.com/api/v2/disease-search',
            params: {query: `${req.query.query}`},
            headers: {
              'X-RapidAPI-Key': '8d8d06962cmsh7dee8f3754f1715p1d48f1jsnaca4342b14f8',
              'X-RapidAPI-Host': 'medius-disease-medication.p.rapidapi.com'
            }
          };
      //console.log(options)
      axios.request(options)
        .then((response) => {
            flag =false
      
            for (let index = 0; index < response.data.length; index++) {
                if(response.data[index].medius_id){
                    console.log(response.data[index].medius_id)
                    cash[req.query.query.toLowerCase()] = response.data[index];
                    flag =true;
                    break;         
                }
            }
            if(flag){   
              next()
            }
            else{
            res.json({
                    message: 'Sory, we can not find an Valid Value for this search here'
                   });
            }
        })
    .catch((error)=>{
      res.json({
        message: 'there is an Error happend Here 2'
       });
    });
    }else{
        next()
    }
    }

}
 async function getDataID(req, res, next) {
let tempObj = {};
let tempData = [];
const options = {
method: 'GET',
  url: `https://medius-disease-medication.p.rapidapi.com/api/v2/disease-medications/${cash[req.query.query.toLowerCase()].medius_id}`,
  params: {country: 'IN'},
    headers: {
      'X-RapidAPI-Key': '8d8d06962cmsh7dee8f3754f1715p1d48f1jsnaca4342b14f8',
      'X-RapidAPI-Host': 'medius-disease-medication.p.rapidapi.com'
    }
  };

 await axios.request(options).then(async function (response) {


    for (let index = 0; index <Math.min(response.data.medications.length , 3); index++) {

        let tempValue = `https://thumbs.dreamstime.com/b/no-image-available-icon-photo-camera-flat-vector-illustration-132483141.jpg`;
        console.log('before axios')
         await axios.get(`https://api.unsplash.com/search/photos?page=1&query=${response.data.medications[index].name}&client_id=XB2Wty0BusZYwQyWD9CW8mErcWuEAya3C50vYjJdQps`)
        .then(value=>{
            //console.log(value.data.results[0].urls.small)
            console.log('done')
            tempValue=value.data.results[0].urls.small;
             console.log('inside axios')

        }).catch(err=>{
            tempValue = `https://thumbs.dreamstime.com/b/no-image-available-icon-photo-camera-flat-vector-illustration-132483141.jpg`;
        })

        console.log('after Axiso')
        tempObj = {
            medication_Name :  response.data.medications[index].name,
            medication_Dosage : response.data.medications[index].dosage,
            medication_route : response.data.medications[index].route,
            medication_img : tempValue
        }
        tempData.push(tempObj);
        
    }

    // Just 5 Minutes 

    if(req.query.userEmail){
    const USER = mongoose.model('Model', schema, req.query.userEmail);
    const newUser = new USER({
        user_email: req.query.userEmail,
        Name: cash[req.query.query.toLowerCase()].name,
        medication: tempData
    });
    newUser.save().then(v =>{
        console.log('done')
    }).catch(err=>{
        console.log(err)
    })
    }
	res.json({
        Name : cash[req.query.query.toLowerCase()].name,
        medication : tempData
    })
}).catch(function (error) {
	res.json({
        message : "someting went wrong "
    })
});

}


function getDataAuth(req,res){

   // console.log(req.query)
   
   if(req.query.userEmail){

       const USER = mongoose.model('Model', schema, req.query.userEmail);
        USER.find({ user_email: req.query.userEmail}, function (err, docs) {
            if (err){
                console.log(err);
            }
            else{
                res.json({
                    data: docs
                   })
            }
        });


   }else{
    res.json({
        message: 'there is no User with this Email '
       })
   }
    

   
    }
    function getData2(req,res){

        
        const options = {
            method: 'GET',
            url: 'https://medius-disease-medication.p.rapidapi.com/api/v2/disease-search',
            params: {query: 'headache'},
            headers: {
              'X-RapidAPI-Key': '8d8d06962cmsh7dee8f3754f1715p1d48f1jsnaca4342b14f8',
              'X-RapidAPI-Host': 'medius-disease-medication.p.rapidapi.com'
            }
          };
          
          axios.request(options).then(function (response) {
              console.log(response.data);
          }).catch(function (error) {
              console.error(error);
          });


    res.json({
        message : 'heelo '
    })
    }
     





router.use(error.notFound);
router.use(error.errorHandler);

module.exports = {
    getData,
    getDataAuth,
    getDataID,
    getData2
  };