var queryinsertOrden="insert into orden_cobro (codigo_catastral,nombres,estado,valor,ano,direccion) values ('"

function ejecutarQuery(myPool, myquerry, callback){
  myPool.connect(function(err, client, done) {
      if(err) return callback(err), console.error('error fetching client from pool', err);
      client.query(myquerry, function(err, result) {
        done();
        if(err) return callback(err), console.log("bd2: "+err)
        callback(null, recordset)
      });
  });
}

module.exports = { 

  ingresarOrden:  function (dt, myPool, callback){
      ejecutarQuery (myPool, queryinsertOrden+dt[0].CodigoCatastral+"','"+dt[0].Nombres+"','"+dt[0].Estado+"','"+dt[0].Valor+"','"+dt[0].Ano+"','"+dt[0].Direccion+"')",callback)
  }

}