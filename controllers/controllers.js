const con=require('../model/model');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');



exports.InterfaceAllUser=function(req, res) {
    
    res.json({message:'all user'});
};

exports.InterfaceProfileUser=function(req,res){
    res.json({message:'Interface user'});
}

exports.InterfaceProfileLivreur=function(req,res){
    res.json({message:'Interface livreur'})
}

exports.InterfaceProfileAdmin=function(req,res){
    res.json({message:'Interface Admin'})
}

exports.InterfaceValidatedUser=function(req,res){
    var email = req.params.email;
    const active=1;
var sql = 'SELECT * FROM users WHERE email = ?';
con.query(sql, [email], function (err, result) {
  if (err) res.status(400).json({message:'error email'});
  var activeUser="UPDATE users SET active=?  WHERE email=?";
    
  con.query(activeUser, [active,email], function (err, result) {
    if (err) res.status(400).json({message:'error update'});
    console.log(result);
      res.status(200).json({message:'actived successfull'});
   });
})
}


exports.InterfaceSignUp=function(req,res){


  var email = req.body.email;
  
  
var sql = 'SELECT * FROM users WHERE email = ? ';


  con.query(sql, [email], function (err, result) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
  }
  else{
  
    
    if(result.length===0){
      
      bcrypt.hash(req.body.mot_de_passe,10)
     .then(hash =>{
        const email=req.body.email;
        var sql = "INSERT INTO users (nom, tel, email, type, mot_de_passe, active) VALUES ?";
        const values=[[req.body.nom,req.body.tel,email,req.body.type,hash,0]];
    con.query(sql,[values], function (err, result) {
      if (err) throw res.status(400).json({message:'error message'});
      console.log("1 record inserted");
      console.log("Number of records inserted: " + result.affectedRows);
      res.status(200).json({messageSuccess:'successfull'})
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'kaireismail54@gmail.com',
          pass: 'Abdi5414'
        }
      });

      let link = "http://192.168.1.15:4000/api/validated/"+email;
    
      var mailOptions = {
        from: 'kaireismail54@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js',
        html: "<h1>Welcome</h1><p>Bienvenue sur l'application livroo </br> <a href='"+link+"'>link</a>!</p>"
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
            console.log(mailOptions.html)
          console.log('Email sent: ' + info.response);
        }
      });

    });

     })
     .catch(error => res.status(500).json({ error }));


    }
    else {
        
      res.status(200).json({messageError:'email existe déja'});

      } 

    }
    
})



    



}






exports.InterfaceLogin=function(req,res){

  var email = req.body.email;
  
  
var sql = 'SELECT * FROM users WHERE email = ? ';


  con.query(sql, [email], function (err, result) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
  }
  else{
  
    
    if(result.length===0){
      res.status(200).json({message:'email ou mot de passe erreur'})
    }
    else {
      
      
      bcrypt.compare(req.body.mot_de_passe,result[0].mot_de_passe)
      .then(valid =>{
         if(!valid){
          return res.status(401).json({ message: 'email ou mot de passe erreur' });
         }

         var token = jwt.sign({ email: result[0].email }, 'RANDOM_TOKEN_SECRET', {
          expiresIn: '24h' // 24 hours
        });
        return res.status(200).send({
       
          nom:result[0].nom,
          tel:result[0].tel,
          email:result[0].email,
          type:result[0].type,
          accessToken: token
    
          });
   
      })
      .catch(error => res.status(500).json({ error }));


     /* bcrypt.compare(req.body.mot_de_passe, result[0].mot_de_passe, (err, hash) => {
        if (hash) {
          var token = jwt.sign({ email: result[0].email }, 'RANDOM_TOKEN_SECRET', {
            expiresIn: '59s' // 24 hours
          });
          return res.status(200).send({
         
            email:result[0].email,
            mot_de_passe:result[0].mot_de_passe,
            accessToken: token
      
            });
        } else {
          return res.status(200).json({ message: 'email ou mot de passe erreur' });
        }
      });*/
        
  
      } 

    }
    
})


}







exports.InterfaceTestSignUp=function(req,res){

 
  var email = req.body.email;
  var mot_de_passe= req.body.mot_de_passe;
  
var sql = 'SELECT * FROM users WHERE email = ?';
con.query(sql, [email], function (err, result) {
  if (err) {
    console.log(err);
    res.sendStatus(500);
    return;
}
else{

  
  if(result.length===0){
   
    res.status(200).json({email:req.body.email});
  }
  else {
    
    var token = jwt.sign({ email: result[0].email }, 'RANDOM_TOKEN_SECRET', {
      expiresIn: '1s' // 24 hours
    });
    res.status(200).send({
      
    email:result[0].email,
    mot_de_passe:result[0].mot_de_passe,
    accessToken: token
      
  });
    
  }
  
} 

})



  
}


exports.InterfaceTestSignIn=function(req,res){

  var username = req.body.username;
  var password = req.body.password;
  
var sql = 'SELECT * FROM test WHERE username = ? and password = ?';
con.query(sql, [username,password], function (err, result) {
  if (err) {
    console.log(err);
    res.sendStatus(500);
    return;
}
else{

  
  if(result.length===0){
    res.status(200).json({message:result})
  }
  else {
    
    var token = jwt.sign({ username: result[0].username }, 'RANDOM_TOKEN_SECRET', {
      expiresIn: '1s' // 24 hours
    });
    res.status(200).send({
      
    username:result[0].username,
    password:result[0].password,
    accessToken: token
      
  });
    
  }
  
}


  

})
  
}



exports.InterfaceAllUsersConnected=function(req,res){
    
  var sql = 'SELECT * FROM activeRoom ';
  con.query(sql, function (err, result) {
    if (err) throw console.log("error syntaxe select all users database");
     if(result.length > 0){


      res.status(200).send({
        users:result
      });


     }
    
    

  });

}



exports.InterfaceNomUserConnected=function(req,res){
    
  var nom = req.body.nom;
  var email = req.body.email;

  var sql = 'UPDATE users SET  nom=?  WHERE email=?';
  con.query(sql, [nom,email], function (err, result) {
    if (err) throw console.log("error syntaxe update nom user");
    console.log('1 record updated nom user');
    res.status(200).send({
      user:'success update nom user'
    });
    

  });

}






exports.InterfaceNumeroTelUserConnected=function(req,res){
    
  var tel = req.body.tel;
  var email = req.body.email;

  var sql = 'UPDATE users SET  tel=?  WHERE email=?';
  con.query(sql, [tel,email], function (err, result) {
    if (err) throw console.log("error syntaxe update nom user");
    console.log('1 record updated tel user');
    res.status(200).send({
      user:'success update tel user'
    });
    

  });

}


exports.InterfaceSupprimerColisInfos=function(req,res){

  var emailA=req.body.emailA;
  
 var sql='DELETE FROM colis where utilisateur_A=?';
 con.query(sql,[emailA], function (err, result) {
  if (err) throw console.log("error syntaxe delete colis database");
  console.log('delete colis info');
  


    res.status(200).send({
      users:'success delete colis'
    });


   
  
});




}



exports.InterfaceafficherColisInfos=function(req,res){

  var sql = 'SELECT * FROM colis';
  con.query(sql, function (err, result) {
    if (err) throw console.log("error syntaxe select all colis database");
     if(result.length > 0){


      res.status(200).send({
        users:result
      });


     }
    
  });


}


exports.InterfaceAjouterColisInfo=function(req,res){

  var emailP=req.body.emailP;
  var emailA=req.body.emailA;
  var poids=req.body.poids;
  var adresse=req.body.adresse;
  var nature=req.body.nature;
  var etat=req.body.etat;
  var nom=req.body.nom;
  var token=req.body.tokens;
  var socketId_P=req.body.socketId_P;
  var socketId_A=req.body.socketId_A;


  

  var sql = "INSERT INTO colis (utilisateur_P, utilisateur_A, nom, poids, nature, adresse, etat, token, socketId_P, socketId_A) VALUES ?";
  const values=[[emailP,emailA,nom,poids,nature,adresse,etat,token,socketId_P,socketId_A]];
con.query(sql,[values], function (err, result) {
if (err) throw res.status(400).json({message:'error sql ajouter cool'});
console.log('insert record colis infos');

res.status(200).json({messageSuccess:'successfull'});

});




}





exports.InterfaceNomUtilisateurAccepter=function(req,res){

  var email=req.body.email;
  console.log('email :',email);
  var sql = 'SELECT * FROM users WHERE email = ?';
  con.query(sql, [email], function (err, result) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
  }
  
  else{

    if(result.length > 0){


      res.status(200).send({
        users:result
      });
      console.log('result else data nom',result);

     }
     console.log('result data nom',result);
  }

  })

}










