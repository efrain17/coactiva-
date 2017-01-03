const http = require('http')
const path = require('path')
const express = require('express')
const port = process.env.PORT || 9000
const sql = require('mssql');
const pg = require('pg')
const bdpostgres = require('./lib/bdPostgres')
const bdserver = require('./lib/bdsqlServer')

////////////////////////////////////////
const app = express()
const server = http.createServer(app)
///////////////////////////////////////

var connectionSql = new sql.Connection({
    user: 'efrain',
    password: '123456',
    server: 'localhost',
    database: 'bdPredios'
});

var connectionPostgres = {
    user: 'efrain', 
    database: 'coactiva', 
    password: '123456', 
    host: 'localhost',  
    port: 5432,  
    max: 10, // max number of clients in the pool 
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
};

var pool = new pg.Pool(connectionPostgres)

pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack)
})

var request = new sql.Request(connectionSql);

connectionSql.connect(function(err) {
  	if(err) return err, console.log(err)
  	console.log("conectado")	
})

app.use('/', express.static(__dirname + '/dist'));
//enrutador de angular  
app.all('/ag/*',  (req, res) => {
  res.status(200).sendFile(
    path.join(__dirname, '/dist/index.html')); 
});


//mis servicios 
app.get('/api/deudores/:id', (req, res) => {
  	let id = req.params.id
    bdserver.deudoresPaginacion(id, request, (err, data) => {
      if(err) return res.json(err)
      res.json(data) }) 
})

app.get('/api/deudores', (req, res) => {
    bdserver.todosDeudores(request, (err, data) => {
      if(err) return res.json(err)
      res.json(data) })
})

app.get('/api/deudoresFiltrados', (req, res) => {
    bdserver.todosDeudores(request, (err, dataServer) => {
      if(err) return res.json(err)
      bdpostgres.todosOrdenesId(pool, (err,dataPostgres) =>{
        if(err) return res.json(err)
        if(!dataPostgres){ // si ibtiene algo de la segunda consulta
          var datafilter = dataServer.filter(dataMap => {
          let dataReturn = dataPostgres.filter(data=>data.codigocatastral!==dataMap.codigocatastral)[0]
          if (dataReturn) return dataMap;})
          res.json(datafilter)
        }
        else res.json(dataServer)
      })
    })
})

app.get('/api/deudoresOrdenPago', (req, res) => {
    bdserver.todosDeudores(request, (err, dataServer) => {
      if(err) return res.json(err)
      bdpostgres.todosOrdenesId(pool, (err,dataPostgres) => {
        if(err) return res.json(err)
        var datafilter = dataServer.filter(dataMap => {
          let dataReturn = dataPostgres.filter(data=>data.codigoCatastral===dataMap.codigoCatastral)[0]
          if (dataReturn) return dataMap;
        })
      res.json(datafilter)
      })
    })
})

app.get('/api/deudoresOrdenPagodb', (req,res) => {
    bdpostgres.todosOrdenes(pool, (err, data) => {
      if(err) return res.json(err)
        res.json(data)
    })
})

app.get('/api/deudas/:id', (req, res) => {
    let id = req.params.id
    bdserver.deudasTitular(id, request, (err, data) => {
      if(err) return res.json(err)
      res.json(data) })  
})

app.get('/api/ordenarPago/:id', (req, res) =>{
    let id = req.params.id
    bdserver.ordenarPago(id, request, (err, data) => {
      if(err) return res.json(err)
      bdpostgres.ingresarOrden(data, pool, (err,data)=>{
        if(err) return res.json(err)
          console.log("inserto orden")
          res.json(data) })
    }) 
})


server.listen(port, () => console.log(`Listening on port ${port}`))
