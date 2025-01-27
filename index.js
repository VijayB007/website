const express=require('express');
const path = require('path')
const pool = require('D:/Project First/db.js');
const bodyParser=require('body-parser')


// var dotenv=require('dotenv');

// dotenv.config();

port= 9000;
// port =3000;
const app= express();
const hbs= require('hbs');

app.set('view engine', hbs)

app.set('views',path.join('D:/Project First','views'));







app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));

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

 
 
 app.get('/aboutUS',(req,res)=>{
   res.render(path.join('D:/Project First/views','aboutus.hbs'))

 })

 app.get('/login',(req,res)=>{
   res.render(path.join('D:/Project First/views','login.hbs'))

 })

 app.post('/login',(req,res)=>{
  const {username,password} =req.body;
  console.log('username',username);
   console.log('pass',password);

    pool.query('SELECT count(*)FROM users WHERE username=$1 AND password=$2',[username,password],(error,results)=>{
       if(error) throw error;
       responcedata=results.rows;
       console.log("responcedata",responcedata);
       console.log("count",responcedata[0].count)
       if(responcedata[0].count==1){
         data={
           username:username
         }
         res.render(path.join('D:/Project First/views','dashboard.hbs'),{data:data})
       }else{
         data ={
           errormessage:"username or pass wrong"
       }
         res.render(path.join('D:/Project First/views','login.hbs'),{data:data})

       }

 })
 })


app.listen(port,()=>{
console.log(`server starts at ${port}`);
}
)
