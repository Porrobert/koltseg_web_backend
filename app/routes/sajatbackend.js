const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  var connection
  function kapcsolat(){
    var mysql = require('mysql')

    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'koltsegvetes_pr'
    })
    
    connection.connect()
    
  }
  
  
  app.get('/film', (req, res) => {

    kapcsolat()
      connection.query('SELECT * from film', function (err, rows, fields) {
        if (err) throw err
      
        console.log(rows)
        res.send(rows)
      })
      
      connection.end()
   })
   
   app.post('/kereses', (req, res) => {
  
    kapcsolat()
    let kereso='SELECT * FROM kiadas WHERE kiadas_nev LIKE "%'+req.body.bevitel1+'%"'
    connection.query( kereso, (err, rows, fields) => {
      if (err) 
          console.log( err)
        else{
        res.send(rows)}
        
      })
    
    connection.end()
  })

   app.get('/kiadas', (req, res) => {
    
    kapcsolat()
    
    connection.query('SELECT* FROM kiadas INNER JOIN koltsegfajta ON kiadas.kiadas_koltsegfajta=koltsegfajta.fajta_id ', function (err, rows, fields) {
      if (err) throw err
    
      console.log(rows)
      res.send(rows)
    })
    connection.end()
  })


app.get('/koltsegfajta', (req, res) => {  

  kapcsolat()
    
    connection.query('SELECT * from koltsegfajta', function (err, rows, fields) {
      if (err) throw err
    
      console.log(rows)
      res.send(rows)
    })
    connection.end()
  })


app.get('/osszegfajta', (req, res) => {  

  kapcsolat()
    
    connection.query('SELECT SUM(kiadas_ar) as szereles FROM kiadas WHERE kiadas_nev="Szerelés"', function (err, rows, fields) {
      if (err) throw err
    
      console.log(rows)
      res.send(rows)
    })
    connection.end()
  })



app.get('/rendszerezes', (req, res) => {  

  kapcsolat()
    
    connection.query(`SELECT fajta_id, koltsegfajta.fajta_kep, koltsegfajta.fajta_nev, SUM(kiadas.kiadas_ar) as osszeg
    FROM koltsegfajta
    INNER JOIN kiadas
    ON koltsegfajta.fajta_id=kiadas.kiadas_koltsegfajta
    GROUP By koltsegfajta.fajta_nev`, function (err, rows, fields) {
      if (err) throw err
    
      console.log(rows)
      res.send(rows)
    })
    connection.end()
  })

app.get('/osszegzes', (req, res) => {  

    kapcsolat()
      
      connection.query('SELECT SUM(kiadas_ar) as osszeg FROM kiadas', function (err, rows, fields) {
        if (err) throw err
      
        console.log(rows)
        res.send(rows)
      })
      connection.end()
    })


app.post('/felvitel', (req, res) => {
  
  kapcsolat()
  
  connection.query("INSERT INTO kiadas  VALUES (NULL, "+req.body.bevitel1+", "+req.body.bevitel2+", '"+req.body.bevitel3+"','"+req.body.bevitel4+"')", (err, rows, fields) => {
    if (err) 
        console.log( err)
      else{
      console.log("Sikeres felvitel!")
      res.send("Sikeres felvitel!")}
      
    })
  
  connection.end()
})
/*app.post('/felvitel2', (req, res) => {

  var mysql = require('mysql')
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'koltsegvetes_pr'
  })
  
  connection.connect()
  
  connection.query("INSERT INTO bevetel  VALUES (NULL, "+req.body.bevitel1+", "+req.body.bevitel2+", '"+req.body.bevitel3+"')", function (err, rows, fields) {
    if (err) 
      console.log( err)
    else{
    console.log("Sikeres felvitel!")
    res.send("Sikeres felvitel!")}
    
  })
  
  connection.end()

  
})*/

app.delete('/torles', (req, res) => {
  
  kapcsolat()
  
  connection.query("DELETE FROM kiadas WHERE kiadas.kiadas_id = "+req.body.bevitel1, (err, rows, fields) => {
    if (err) 
        console.log( err)
      else{
      console.log("Sikeres törlés!")
      res.send("Sikeres törlés!")}
      
    })
      })


      
app.delete('/torles2', (req, res) => {
  
  kapcsolat()
  
  connection.query("DELETE FROM kiadas WHERE kiadas_koltsegfajta = "+req.body.bevitel1, (err, rows, fields) => {
    if (err) 
        console.log( err)
      else{
     
       //koltsegfajta torles
      connection.query("DELETE FROM koltsegfajta WHERE fajta_id = "+req.body.bevitel1, (err, rows, fields) => {
      if (err) 
      console.log( err)
      else{
      console.log("Sikeres törlés!")
      res.send("Sikeres törlés!")}
    
  })
  
    
    }
      



    })
      })

app.get('/osszegzes', (req, res) => {  

  kapcsolat()
          
  connection.query('SELECT SUM(kiadas_ar) as osszeg FROM kiadas', function (err, rows, fields) {
    if (err) throw err
          
      console.log(rows)
      res.send(rows)
          })
          connection.end()
        })
        app.get('/fajta', (req, res) => {
          const mysql = require('mysql')
          const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'koltsegvetes_pr'
          })
          
          connection.connect()
          
          connection.query('SELECT * from fajta', (err, rows, fields) => {
            if (err) throw err
          
            res.send(rows)
          })
          
          connection.end()
        })
      
        app.get('/bevetel', (req, res) => {
          const mysql = require('mysql')
          const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'koltsegvetes_pr'
          })
          
          connection.connect()
          
          connection.query('SELECT * from bevetel', (err, rows, fields) => {
            if (err) throw err
          
            res.send(rows)
          })
          
          connection.end()
        })

        app.get('/bevetelfizetes', (req, res) => {
          const mysql = require('mysql')
          const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'koltsegvetes_pr'
          })
          
          connection.connect()
          
          connection.query('SELECT SUM(bevetel_osszeg) as osszeg2 FROM bevetel', (err, rows, fields) => {
            if (err) throw err
          
            res.send(rows)
          })
          
          connection.end()
        })
      
      
        app.delete('/fajtatorles', (req, res) => {
          const mysql = require('mysql')
          const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'koltsegvetes_pr'
          })
          
          connection.connect()
          connection.query('delete from fajta where fajta_id= '+req.body.bevitel1, (err, rows, fields) => {
            if (err) console.log(err)
          else
          res.send("Sikerült a törlés")
          })
          connection.end()
        })
      
        app.delete('/beveteltorles', (req, res) => {
          const mysql = require('mysql')
          const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'koltsegvetes_pr'
          })
          
          connection.connect()
          connection.query('delete from bevetel where bevetel_id= '+req.body.bevitel1, (err, rows, fields) => {
            if (err) console.log(err)
          else
          res.send("Sikerült a törlés")
          })
          connection.end()
        })

};
