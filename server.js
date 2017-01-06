const http = require('http')
const path = require('path')
const express = require('express')
const port = process.env.PORT || 9000
const sql = require('mssql');
const pg = require('pg')
const bdpostgres = require('./lib/bdPostgres')
const bdserver = require('./lib/bdsqlServer')
const requestReport = require('request')

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

pool.on('error', (err, client) => {
  console.error('idle client error', err.message, err.stack)
})

var request = new sql.Request(connectionSql);

connectionSql.connect( (err) => {
  	if(err) return err, console.log(err)
  	console.log("conectado Sql server")	
})

app.use('/', express.static(__dirname + '/dist'));
app.all('/ag/*',  (req, res) => { //enrutador de angular  
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
        if(dataPostgres.length > 0){ // si ibtiene algo de la segunda consulta
          let datafilter = dataServer.filter(dataMap => {
            let dataReturn = dataPostgres.find(data =>  data.codigocatastral ==dataMap.codigocatastral && data.anomax==dataMap.anomax)
            if (!dataReturn) return dataMap
          })
          console.log(datafilter.length)
          res.json(datafilter)
        }
        else res.json(dataServer)
      })
    })
})

app.get('/api/deudoresOrdenPagodb', (req,res) => {
    bdpostgres.todosOrdenes(pool, (err, data) => {
      if(err) return res.json(err)
        res.json(data)
    })
})

app.get('/api/deudoresOrdenVencidos', (req,res) => {
    bdpostgres.todosOrdenesVencidos(pool, (err, data) => {
      if(err) return res.json(err)
        res.json(data)
    })
})

app.get('/api/deudoresAutoPagoHabil', (req,res) => {
    bdpostgres.todosAutoPagoHabil(pool, (err, data) => {
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
    bdserver.ordenarPago(id, request, (err, dataSqlServer) => {
      if(err) return res.json(err)
      bdpostgres.ingresarOrden(dataSqlServer, pool, (err, data)=>{
        if(err) return res.json(err)
          bdpostgres.igresarOrdenDetalle(dataSqlServer, pool, (err, data)=>{
            if(err) return res.json(err)
            res.json(data)
          })
      })
    }) 
})

app.get('/api/repetirOrdenarPago/:id', (req, res) =>{
    let id = req.params.id
    bdserver.ordenarPago(id, request, (err, dataSqlServer) => {
      if(err) return res.json(err)
        bdpostgres.igresarOrdenDetalle(dataSqlServer, pool, (err, data)=>{
          if(err) return res.json(err)
          res.json(data)
        })
    }) 
})
//reporteGeneral?idcatastral=130950010110001000&shortid=Hynrwk5rg
app.get('/api/reporteGeneral', (req, res) =>{
    var myobject = {'Carteras':[],'Titulares': [] }
    var data={ template: { "shortid": req.query.shortid }, data: {}, option: { preview: true } }

    bdserver.deudasTitular(req.query.idcatastral, request, (err, dataDeudas) => {
        if(err) return res.json(err)
        bdserver.datosTitular(req.query.idcatastral, request, (err, dataTitular) => {
        if(err) return res.json(err)
        myobject.Carteras = dataDeudas
        myobject.Titulares.push(dataTitular[0])
        data.data = myobject
        console.log(data)
        var options = { uri:"http://localhost:5488/api/report", method:'POST', json:data }
        requestReport(options).pipe(res)
      })     
    })
})


server.listen(port, () => console.log(`Listening on port ${port}`))

