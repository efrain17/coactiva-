
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

  ingresarOrden:  function (data, myPool, callback){
      ejecutarQuery (myPool, queryinsertOrden+data[0].codigocatastral+"','"+data[0].nombres+"','"+data[0].estado+"','"+data[0].valor+"','"+data[0].ano+"','"+data[0].anomax+"','"+data[0].direccion+"')",callback)
  },

  igresarOrdenDetalle: function (data, myPool, callback){
    ejecutarQuery(myPool, queryinsertarDetalleOrden+data[0].codigocatastral+"','"+data[0].ano+"','"+data[0].anomax+"','"+ new Date().toJSON().slice(0,10)+"')", callback )
  }, 

  todosOrdenesId: function (myPool, callback){
      ejecutarQuery (myPool, "select codigocatastral, anomax from orden_cobro", callback)
  }, 

  todosOrdenes: function (myPool, callback){
      ejecutarQuery (myPool, queryOrdenesEmitidas, callback)
  },

  todosOrdenesVencidos: function (myPool, callback){
      ejecutarQuery (myPool, queryOrdenesVencidas, callback)
  },

  todosAutoPagoHabil: function (myPool, callback){
      ejecutarQuery (myPool, queryAutoPagoHabil, callback)
  }


}


// hacer las vistas procedimientos almacenads 
var queryinsertOrden = "insert into orden_cobro (codigocatastral,nombres,estado,valor,ano,anomax,direccion) values ('"
var queryinsertarDetalleOrden = "insert into detalle_ordenes_cobros (codigocatastral,ano,anomax,fechaingreso) values ('"
var queryOrdenesEmitidas = `select orden_cobro.codigocatastral as codigocatastral,
    max(orden_cobro.nombres) as nombres,
    max(orden_cobro.estado) as estado,
    max(orden_cobro.valor) as valor,
    max(orden_cobro.ano) as ano,
    max(orden_cobro.direccion) as direccion,
    max(detalle_ordenes_cobros.fechaingreso) as fecha_ingreso, 
    CAST(  max(detalle_ordenes_cobros.fechaingreso) AS DATE) + CAST('3 days' AS INTERVAL) as fecha_vencimiento
    from orden_cobro inner join detalle_ordenes_cobros
    on detalle_ordenes_cobros.codigocatastral=orden_cobro.codigocatastral and 
    detalle_ordenes_cobros.anomax=orden_cobro.anomax 
    group by orden_cobro.codigocatastral,orden_cobro.anomax
    having count(id_ordenes) < 3 and
    CAST(  max(detalle_ordenes_cobros.fechaingreso) AS DATE) + CAST('3 days' AS INTERVAL) >= current_date`

var queryOrdenesVencidas = `select orden_cobro.codigocatastral as codigocatastral,
    max(orden_cobro.nombres) as nombres,
    max(orden_cobro.estado) as estado,
    max(orden_cobro.valor) as valor,
    max(orden_cobro.ano) as ano,
    max(orden_cobro.direccion) as direccion,
    max(detalle_ordenes_cobros.fechaingreso) as fecha_ingreso, 
    CAST(  max(detalle_ordenes_cobros.fechaingreso) AS DATE) + CAST('3 days' AS INTERVAL) as fecha_vencimiento
    from orden_cobro inner join detalle_ordenes_cobros
    on detalle_ordenes_cobros.codigocatastral=orden_cobro.codigocatastral and 
    detalle_ordenes_cobros.anomax=orden_cobro.anomax 
    group by orden_cobro.codigocatastral,orden_cobro.anomax
    having 
    CAST(  max(detalle_ordenes_cobros.fechaingreso) AS DATE) + CAST('3 days' AS INTERVAL) < current_date`
var queryAutoPagoHabil = `select orden_cobro.codigocatastral as codigocatastral,
    max(orden_cobro.nombres) as nombres,
    max(orden_cobro.estado) as estado,
    max(orden_cobro.valor) as valor,
    max(orden_cobro.ano) as ano,
    max(orden_cobro.direccion) as direccion,
    max(detalle_ordenes_cobros.fechaingreso) as fecha_ingreso, 
    CAST(  max(detalle_ordenes_cobros.fechaingreso) AS DATE) + CAST('3 days' AS INTERVAL) as fecha_vencimiento
    from orden_cobro inner join detalle_ordenes_cobros
    on detalle_ordenes_cobros.codigocatastral=orden_cobro.codigocatastral and 
    detalle_ordenes_cobros.anomax=orden_cobro.anomax 
    group by orden_cobro.codigocatastral,orden_cobro.anomax
    having count(id_ordenes) >= 3 `
