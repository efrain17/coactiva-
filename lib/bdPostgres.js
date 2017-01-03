var queryinsertOrden="insert into orden_cobro (codigocatastral,nombres,estado,valor,ano,anomax,direccion) values ('"

function ejecutarQuery(myPool, myquerry, callback){
  myPool.connect(function(err, client, done) {
      if(err) return callback(err), console.error('error fetching client from pool', err);
      client.query(myquerry, function(err, result) {
        done();
        if(err) return callback(err), console.log("bd2: "+err)
        callback(null, result.rows)
      });
  });
}

module.exports = { 

  ingresarOrden:  function (dt, myPool, callback){
      ejecutarQuery (myPool, queryinsertOrden+dt[0].codigocatastral+"','"+dt[0].nombres+"','"+dt[0].estado+"','"+dt[0].valor+"','"+dt[0].ano+"','"+dt[0].anomax+"','"+dt[0].direccion+"')",callback)
  },

  todosOrdenesId: function (myPool, callback){
      ejecutarQuery (myPool, "select codigocatastral, anomax from orden_cobro", callback)
  }, 
  todosOrdenes: function (myPool, callback){
      ejecutarQuery (myPool, "select * from orden_cobro", callback)
  }

}