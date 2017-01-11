const http = require('http')
const path = require('path')
const express = require('express')
const port = process.env.PORT || 9000
const sql = require('mssql');
const pg = require('pg')
const bdpostgres = require('./lib/bdPostgres')
const bdserver = require('./lib/bdsqlServer')
const requestReport = require('request')
const reportLib = require('./lib/reportes')
const bodyParser = require('body-parser');

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
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

//mis servicios 
app.get('/api/deudores/:id', (req, res) => {
  	let id = req.params.id
    bdserver.deudoresPaginacion(id, request)
      .then(data=> res.json(data))
      .catch(err=> res.json(err)) 
})

app.get('/api/deudores', (req, res) => {
    bdserver.todosDeudores(request)
      .then(data=> res.json(data))
      .catch(err=> res.json(err)) 
})

app.get('/api/deudoresFiltrados', (req, res) => {
   let dataServer
    bdserver.todosDeudores(request)
      .then(dataServeConsult=> { dataServer=dataServeConsult
        return bdpostgres.todosOrdenesId(pool) })
      .then(dataPostgres=> {
        if(dataPostgres.length > 0){ 
          let datafilter = dataServer.filter(dataMap => {
            let dataReturn = dataPostgres.find(data =>  data.codigocatastral ==dataMap.codigocatastral && data.anomax==dataMap.anomax)
            if (!dataReturn) return dataMap
          })
          console.log(datafilter.length)
          res.json(datafilter)
        }
        else res.json(dataServer) })
       .catch(err=> res.json(err) )
})

app.get('/api/deudoresOrdenPagodb', (req,res) => {
    bdpostgres.todosOrdenes(pool)
      .then(data=> res.json(data))
      .catch(err=> res.json(err)) 
})

app.get('/api/deudoresOrdenVencidos', (req,res) => {
    bdpostgres.todosOrdenesVencidos(pool)
      .then(data=> res.json(data))
      .catch(err=> res.json(err)) 
})

app.get('/api/deudoresAutoPagoHabil', (req,res) => {
    bdpostgres.todosAutoPagoHabil(pool)
      .then(data=> res.json(data))
      .catch(err=> res.json(err))  
})

app.get('/api/deudas/:id', (req, res) => {
    let id = req.params.id
    bdserver.deudasTitular(id, request)
      .then(data=> res.json(data))
      .catch(err=> res.json(err))  
})

app.get('/api/ordenarPago/:id', (req, res) =>{
    let id = req.params.id,dataSqlServer
    bdserver.ordenarPago(id, request) 
      .then(dataSqlServe=>  { bdpostgres.ingresarOrden(dataSqlServer, pool)
        dataSqlServer=dataSqlServeda })
      .then(data=> bdpostgres.igresarOrdenDetalle(dataSqlServer, pool) )
      .then (data=> res.json(data))
      .catch(err=> res.json(err))          
})

app.get('/api/repetirOrdenarPago/:id', (req, res) =>{
    let id = req.params.id
    bdserver.ordenarPago(id, request)
      .then(dataSqlServer=> bdpostgres.igresarOrdenDetalle(dataSqlServer, pool) )
      .then(data => res.json(data))
      .catch(err =>res.json(err.message))      
})
//reporteGeneral?idcatastral=130950010110001000&shortid=Hynrwk5rg
app.get('/api/reporteGeneral', (req, res) =>{
    let objectReporte = {'Carteras':[],'Titulares': [] }
    let data={ template: { "shortid": req.query.shortid }, data: {}, option: { preview: true } }
    bdserver.deudasTitular(req.query.idcatastral, request)
      .then(dataDeudas=> {
        objectReporte.Carteras = dataDeudas
        return bdserver.datosTitular(req.query.idcatastral, request) })
      .then(dataTitular=> {
        objectReporte.Titulares.push(dataTitular[0])
        data.data = objectReporte
        let options = { uri:"http://localhost:5488/api/report", method:'POST', json:data }
        requestReport(options).pipe(res) })
      .catch(err => console.log(err.message))       
})

app.post('/api/reporteVarios', (req, res)=> {
    let idcatastrales = req.body;
    console.log("TITULARES ENVIADOS")
    reportLib.reportearVarios(idcatastrales, request)
    .then ( titulares => {
            let data={ template: { "shortid": "HkSpPiRSe" }, data: {}, option: { preview: true } }
            data.data = titulares
            let options = { uri:"http://localhost:5488/api/report", method:'POST', json:data }
            requestReport(options).pipe(res) })
    .catch(err => console.log(err.message))  
})

app.post('/api/ordenarPagoVarios', (req, res) =>{
    let idcatastrales = req.body;
             
})

app.post('/api/users', function(req, res) {
    var user_id = req.body.id;
    var token = req.body.token;
    var geo = req.body.geo;
    res.send(user_id[0] + ' ' + token + ' ' + geo);
});


server.listen(port, () => console.log(`Listening on port ${port}`))

