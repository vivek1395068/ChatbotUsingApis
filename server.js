const express= require("express");
const app= express();
const path = require("path");
const bodyParser=require("body-parser");
const enableWS=require("express-ws");
enableWS(app);


const mongojs = require('mongojs');
//var url = "mongodb://vivek1395068@gmail.com:Vivek108#@ds153974.mlab.com:53974/react-chatbot";
var db=mongojs("mongodb://vivek108:SSvv1234##@ds153974.mlab.com:53974/react-chatbot",["users"])
var chatObj={};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static(path.join(__dirname,"client/build")));

app.get("/getDataFromDb",(req,res,next)=>{
    db.users.find((err,users)=>{
        if(err){
            res.send(err);
        }
        res.json(users)
    })
});

/* app.get('/countdown', function(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })
    countdown(res, 10)
  })
  
  function countdown(res, count) {
    res.write("data: " + count + "\n\n")
    if (count)
      setTimeout(() => countdown(res, count-1), 1000)
    else
      res.end()
  }; */

app.ws('/echo', (ws, req) => {
    //console.log(req)
    ws.on('message', msg => {
        ws.send(msg)
    })

    ws.on('close', () => {
        console.log('WebSocket was closed')
    })
})

app.get("/fetchAllUsers",(req,res,next)=>{
    db.users.find((err,users)=>{
        if(err){
            res.send(err)
        }
        res.json(users);
    })
})

app.put("/getChat",(req,res,next)=>{
    var resObj=req.body;

    //console.log(resObj)
    if(chatObj[resObj.sourceUser+resObj.targetUser]){
        chatObj[resObj.sourceUser+resObj.targetUser].chatstatement+="<p style='justify-self: left'>"+resObj.chatstatement+"</p>"
        chatObj[resObj.targetUser+resObj.sourceUser].chatstatement+="<p style='justify-self: right'>"+resObj.chatstatement+"</p>"
    }else{

        chatObj[resObj.sourceUser+resObj.targetUser]={...resObj}
        chatObj[resObj.targetUser+resObj.sourceUser]={...resObj};
        chatObj[resObj.sourceUser+resObj.targetUser].chatstatement="<p style='justify-self: left'>"+resObj.chatstatement+"</p>"
        chatObj[resObj.targetUser+resObj.sourceUser].chatstatement="<p style='justify-self: right'>"+resObj.chatstatement+"</p>"
    }
    
    res.json({
        status:"Messsage sent successfully"
    })

});

app.post("/fetchChat",(req,res,next)=>{
    //console.log(req.body.reqchat);
    //console.log(chatObj);
    if(chatObj[req.body.reqchat])
    {
        res.json(chatObj[req.body.reqchat]);
    }
    else{
        res.json({
            chatstatement:""
        })
    }
})

app.post("/loginUser",(req,res,next)=>{
    var request=req.body;
    if(request.type==="signin"){
        db.users.find({"_username":req.body.username},(err,user)=>{
            if(err){
                res.send(err);
            }
            var userDetails={};
            if(user[0]._username===request.username && request.password===user[0]._password){
                userDetails.username=request.username;
                userDetails.logInState=true;
                userDetails.id=user[0]._id
                res.json(userDetails)
            }else{
                userDetails.username="unauthorized user";
                userDetails.logInState=false;
                res.json(userDetails)
            }
        })
    }else if(request.type==="signup"){
        db.users.find({"_username":req.body.username},(err,user)=>{
            if(err){
                res.send(err);
            }
            var userDetails={};
            console.log(user);
            if(user[0]){
                userDetails.inserted=false;
                userDetails.insertDetails="user already exist";
                res.json(userDetails)
            }else if(request.passcode==="12345678"){
                db.users.find((err,users)=>{
                    if(err){
                        res.send(err);
                    }
                    var id="000"+(users.length+1)
                    db.users.insert({
                        _username:request.username,
                        _id:id,
                        _password:request.password,
                        _passcode:"12345678"
                    });
                    userDetails.inserted=true
                    userDetails.username=request.username;
                    userDetails.logInState=true;
                    userDetails.id=id
                    res.json(userDetails);
                })
            }else{
                userDetails.inserted=false;
                userDetails.insertDetails="invalid Passcode";
                res.json(userDetails);
            }
        })
    }
});

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"client/build/index.html"))
});

app.listen((process.env.PORT || 8081) , (req,res)=>{
    console.log("listening on "+(process.env.PORT || 8081))
})