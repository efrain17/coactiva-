
function ejecutarQuery(myPool, myquerry){
return new Promise((resolve, reject)=>{
    myPool.connect(function(err, client, done) {
        if(err) return reject(err), console.error('error fetching client from pool', err);
        client.query(myquerry, function(err, result) {
        done();
        if(err) return reject(err), console.log("bd2: "+err)
        resolve(result.rows)
        });
    });
})
}

module.exports = { 

  ingresarOrden:  function (data, myPool){
      return ejecutarQuery (myPool, queryinsertOrden+data[0].codigocatastral+"','"+data[0].nombres+"','"+data[0].estado+"','"+data[0].valor+"','"+data[0].ano+"','"+data[0].anomax+"','"+data[0].direccion+"')")
  },

  igresarOrdenDetalle: function (data, myPool){
    return ejecutarQuery(myPool, queryinsertarDetalleOrden+data[0].codigocatastral+"','"+data[0].ano+"','"+data[0].anomax+"','"+ new Date().toJSON().slice(0,10)+"')" )
  },

  igresarAutoPago: function (data, myPool){
    return ejecutarQuery(myPool, queryinsertarAutoPago+data[0].codigocatastral+"','"+data[0].ano+"','"+data[0].anomax+"','"+ new Date().toJSON().slice(0,10)+"')" )
  }, 

  todosOrdenesId: function (myPool){
    return ejecutarQuery (myPool, "select codigocatastral, anomax from orden_cobro")
  }, 

  todosOrdenes: function (myPool){
    return ejecutarQuery (myPool, queryOrdenesEmitidas)
  },

  todosOrdenesVencidos: function (myPool){
    return ejecutarQuery (myPool, queryOrdenesVencidas)
  },

  todosAutoPagoHabil: function (myPool){
    return ejecutarQuery (myPool, queryAutoPagoHabil)
  }


}


// hacer las vistas procedimientos almacenads 
var queryinsertOrden = "insert into orden_cobro (codigocatastral,nombres,estado,valor,ano,anomax,direccion) values ('"
var queryinsertarDetalleOrden = "insert into detalle_ordenes_cobros (codigocatastral,ano,anomax,fechaingreso) values ('"
var queryinsertarAutoPago = "insert into auto_pago (codigocatastral,ano,anomax,fechaingreso) values ('"
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
