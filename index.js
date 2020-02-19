'use strict'

const express = require('express');
const bodyParser = require('body-parser');
var request = require('request');
const app = express();
const https = require('https');
var encoding = require("encoding");

app.set('port', (process.env.PORT || 5000)) 
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

var Token = process.env.TOKEN;
var WebDF = process.env.WebDF;
var WebAbdul = process.env.WebAbdul;
var access_token = 'Bearer {'+Token+'}'

const myLiffId = process.env.MY_LIFF_ID;

app.use(express.static('public'));



//app.get('/', (req, res) => {
 // res.end("ok")
    //console.log('--------'+JSON.stringify(req.body));
//})

app.get('/test', (req, res) => {
  res.end("ok")
    //console.log('--------'+JSON.stringify(req.body));
})

app.get('/json', (req, res) => {
    
    
    var text = {
        "a" : "1",
        "b" : "2"
        
    }
  res.end(text)
    //console.log('--------'+JSON.stringify(req.body));
})



app.post('/webhook', (req, res) => {
    
   console.log('++++'+JSON.stringify(req.body.events));
    
    var sende_r = req.body.events[0].source.userId
    var reToken = req.body.events[0].replyToken

var data = req.body; 

//console.log('-++++'+JSON.stringify(req.headers)) 
 
if (req.body.events[0].type == "message") {
    if (req.body.events[0].message.type == "text") {
     
     var tex_t = req.body.events[0].message.text
     console.log("---0---");
    console.log(tex_t);
   //     if(tex_t == "ส่งผลวิ่ง"){
   //     postToAbdul(req);    
   //     }else{
   //  postToDialogflow(req);
   //     }
    postToAbdul(req);
        
      }else if(req.body.events[0].message.type == "image"){
        
        var msg = JSON.stringify(req.body);
        console.log("--postToAdbul--");
        
        //reply(reToken, msg); 
        postToAbdul(req);
      
    } else {
        var msg = JSON.stringify(req.body);
        //console.log("----");
        
        reply(reToken, msg); 
      }


  }else if (req.body.events[0].type == "postback") {      
     var postback = req.body.events[0].postback.data
    
 var contents = postback.split('-');

     var img = contents[0]
     var iduser = contents[1]
    console.log("++++postback+++++"+postback);
    console.log("--img--" + img);
    console.log("--iduser--" + iduser);
   
 }
    
    
    


})
//////////////////////////////////////////////////




function reply(reToken,msg) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': access_token
    }
    let body = JSON.stringify({
        replyToken: reToken,
        messages: [{
            type: 'text',
            text: msg
        }]
    })
    request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: body
    }
)}



//////////////////


const postToDialogflow = req => {
  req.headers.host = "bots.dialogflow.com";
  return request({
    method: "POST",
    uri: WebDF ,
    headers: req.headers,
    body: JSON.stringify(req.body)
     });
};


////////////////

const postToAbdul = req => {
    
  req.headers.host = "abdul.in.th";
  return request({
    method: "POST",
    uri: WebAbdul ,
    headers: req.headers,
    body: JSON.stringify(req.body)
    
  });
 console.log(req.body);
};
