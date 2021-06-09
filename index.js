const express=require('express');
const app=express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 4000;
const route=require('./route/route');
const con=require('./model/model');
const jwt = require('jsonwebtoken');

const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");



var http = require('http').createServer(app);
app.set('port',process.env.PORT || 4000)

const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:19000",
  },
});




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/',route);

app.get('/bonjour',(req,res)=>{
  res.json({message:'bonjour'});
}); 





io.use((socket, next) => {
  const email = socket.handshake.auth.email;
  const type = socket.handshake.auth.type;
  if (email) {
    
    
  var sql = 'SELECT * FROM activeRoom WHERE email = ?';
  con.query(sql, [email], function (err, result) {
    if (err) throw console.log("error syntaxe email");
  else{
  
    
    if(result.length===0){
     
      
      socket.userID = randomId();
      socket.email = email;
      socket.type = type;
    
      const id=socket.userID;
      var sql = "INSERT INTO activeRoom (ID_USER, email,connected,type) VALUES ?";
      const values=[[id,email,0,type]];
      con.query(sql,[values], function (err, result) { 
        if (err) throw console.log("error syntaxe insert");
        console.log("1 record inserted");
      });



      next(); 
    }
    else {
    
      
      socket.userID = result[0].ID_USER;
      socket.email = result[0].email;
      socket.type = type;
      return next();
      
    }
    
  } 
  
  })

   
  }
 
   else{
    return next(new Error("invalid email"));
  }
 
})

 

 

io.on('connection', function (socket) {


 
  var connectionSocketUser="UPDATE activeRoom SET  connected=?  WHERE email=?";
    
  con.query(connectionSocketUser, [1,socket.email], function (err, result) {
    if (err) throw console.log("error syntaxe update");
    console.log('1 record updated',socket.userID);
      
   });

    
   socket.emit("session", {
    userID: socket.userID,
  });

  socket.join(socket.userID);

  socket.on("private message", (data) => {

    var token = jwt.sign({ email: data.userInfo.to.email }, 'PROPOSER_TOKEN_SECRET', {
      expiresIn: '300s' // 5 min
    });
    
    socket.to(data.userInfo.to.ID_USER).to(socket.userID).emit("private message", {info:data.userInfo,tokenInfo:token,socketUserId:socket.userID});
    console.log('user infos demande',data.userInfo.to.ID_USER);
    console.log('to',data.userInfo.to);
    console.log('email to :',data.userInfo.to.email);
    console.log('colis',data.userInfo);
    console.log('colis',data.userInfo.colisInfos);
    

  });

  socket.on("private Accepter", (data) => {

    
    console.log('user infos demande accepter',data.userInfo.socketId_P);
    socket.to(data.userInfo.socketId_P).to(socket.userID).emit("private accepteDemande", {info:data.userInfo});
  

  });

  socket.on("private Refuser", (data) => {

    
    console.log('user infos demande refuser',data.userInfo.socketId_P);
    socket.to(data.userInfo.socketId_P).to(socket.userID).emit("private refuseDemande", {info:data.userInfo});
  

  });
  

  socket.on("private AnnulerClient", (data) => {

    
    console.log('private AnnulerClient',data.userInfo);
    /*socket.to(data.userInfo.socketId_P).to(socket.userID).emit("private AnnulerClientDemande", {info:data.userInfo});*/
  

  });

  socket.on("private AnnulerLivreur", (data) => {

    
    console.log('private AnnulerLivreur',data.userInfo);
    socket.to(data.userInfo.socketId_P).to(socket.userID).emit("private AnnulerLivreurDemande", {info:data.userInfo});
  

  });

  const userConnected={
    ID_USER: socket.userID,
    email: socket.email,
    connected: 1,
    type:socket.type
  };

  socket.broadcast.emit("userConnected", {
   user:userConnected
  });

  
  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("userDisconnected", {userID:socket.userID});
      // update the connection status of the session
      var connectionSocketUser="UPDATE activeRoom SET  connected=?  WHERE email=?";
    
      con.query(connectionSocketUser, [0,socket.email], function (err, result) {
        if (err) throw console.log("error syntaxe update disconnected");
        console.log('1 record updated disconnected:',socket.userID);
          
      });
    }
  });




 });







http.listen(port,()=>{
    console.log(`server listen at port ${port}`);
})