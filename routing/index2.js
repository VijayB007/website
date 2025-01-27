const express=require('express');
const path = require('path')
const pool = require('D:/Project First/db.js');
const bodyParser=require('body-parser')

const jwt = require('jsonwebtoken')




const app= express();
const hbs= require('hbs');

app.set('view engine', hbs)

app.set('views',path.join('D:/Project First','views'));


port = 5000;
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));



const SECRET_KEY="vijayyyyy"




function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      login: false,
      message: "No token provided",
    });
  }

  const tokenWithoutPrefix = token.split(" ")[1];

  try {
    const decodedToken = jwt.verify(tokenWithoutPrefix, "secertkey");
    req.username = decodedToken.username;
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(401).json({
      login: false,
      message: "Invalid token",
    });
  }
}



app.get('/',(req,res)=>{
   res.render(path.join('D:/Project First/views','intro.hbs'))
})


app.get('/getproducts' , (req,res)=>{
       
   pool.query("SELECT * FROM products",(error,results)=>{

       console.log('getting data')
           if(error)throw error;
            res.status(200).json(results.rows);
         
         
           
       })
})

app.get('/products', async (req, res) => {
   try {
     const client = await pool.connect();
     const result = await client.query('SELECT * FROM products');
     const products = result.rows;
     client.release();
     res.render('D:/Project First/views/productdetails.hbs', { products }); // Render the 'products.hbs' template with the products data
   } catch (err) {
     console.error('Error fetching products', err);
     res.status(500).send('Internal server error');
   }
 });

 app.get('/home',(req,res)=>{
   res.render(path.join('D:/Project First/views','intro.hbs'))

 })

 
 
 app.get('/aboutUS',verifyToken,(req,res)=>{

   res.render(path.join('D:/Project First/views','aboutus.hbs'))

 })

 app.get('/login',(req,res)=>{
   res.render(path.join('D:/Project First/views','login.hbs'))

 })



 app.post('/login',(req,res)=>{

  const {username,password} =req.body;

  console.log('username',username);
   console.log('pass',password);

    pool.query('SELECT count(*) FROM users WHERE username=$1 AND password=$2',[username,password],(error,results)=>{
       if(error) throw error;
       responcedata=results.rows;
       console.log("responcedata",responcedata);
       console.log("count",responcedata[0].count)
       if(responcedata[0].count==1){


         data={
           username:username
         }

         let jwt_token= jwt.sign({username:username } ,SECRET_KEY,{expiresIn:"1h"})//creating jwt token 
         console.log(jwt_token);
         
         data={
          username:username,
          jwt_token:jwt_token,

         }
        
        
         const  decodedToken= jwt.verify(jwt_token,SECRET_KEY);

         console.log(decodedToken);
          
        //  const decodedToken = jwt.verify(tokenWithoutPrefix, SECRET_KEY);  //verify token

        //  console.log(decodedToken);


        //  res.render(path.join('D:/Project First/views','dashboard.hbs'),{data:data})
        res.status(200).send(data)
       }else{
         data = {
           errormessage:"username or pass wrong"
        }
         res.render(path.join('D:/Project First/views','login.hbs'),{data:data})

       }

 })
 })

app.listen(port, ()=>{
   console.log(`server starts at http//localhost:${port}`);
})
