var express = require('express');
var User = require('./app/models/user')
var app = express();
var apiRoutes = express.Router();
var jwt = require('jsonwebtoken');
var config = require('./config')

app.set('superSecret',config.secret);

//creating new user
apiRoutes.post('/create', (req, res)=> {

  // create a sample user
  var email =  req.body.email;
  var password = req.body.password;

 // console.log(req);
 console.log(req.body);

  if(email && password ){
    var newUser = new User({
      email: email,
      password: password,
      admin: true
   });


   newUser.save((err)=> {
    if (err) throw err;

    console.log('User saved successfully');

    res.json({
      success: true,
      id     : newUser._id,
     });

  });

  } else {

    res.json({success:false,message:'Invalid request'});

  }

});


apiRoutes.post('/authenticate',function(req,res){

    var email     = req.body.email;
    var password = req.body.password;

      User.findOne({
        email:req.body.email
      },(err,user)=>{

        if(err) throw err;

        if(!user){
          res.json({success:false,message:'Incorrect User or Password'});
        }
        else if(user){
          if(user.password != req.body.password){
            res.json({success:false,message:'Incorrect Username or Password'});
          }
          else{
            var token = jwt.sign(user,config.secret,{
               expiresIn:60*60*24
            });

            res.json({
              success:"true",
              message:"Enjoy your token for 1 day",
              token  :token
            });
          }
        }
      });

});

apiRoutes.get('/',function(req,res){
  res.json({message:'Welcome to the coolest api !'});
});


//creating middleware it will run before all the routes
apiRoutes.use((req,res,next)=>{

  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if(token)
  {
    jwt.verify(token, app.get('superSecret'),(err,decoded)=>{

      if(err){

        return res.json({
          success : false,
          message : 'Failed to authenticate token.'
        });
      } else {
        //save to request for use in ither routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    return res.status(403).send({
      success : false ,
      message : 'No token provided'
    });
  }
});

apiRoutes.get('/users',function(req,res){
  User.find({},(err,users)=>{
    res.json(users);
  });
});




module.exports = apiRoutes;
