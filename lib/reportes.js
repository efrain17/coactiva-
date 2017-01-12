const bdserver = require('./bdsqlServer')
const bdpostgres = require('./bdPostgres')

module.exports = {
   reportearVarios: function (idcatastrales, request) {
     return new Promise((resolve, reject)=> {
        forEachAll(idcatastrales,(idcatastro, allresult, next)=> {
          let detalleTitulares
          bdserver.deudasTitular(idcatastro, request)
            .then(dataDeudas =>{
              detalleTitulares = { 'nombres': String,'cedula': String,'valor': String,'Carteras': [] }
              detalleTitulares.Carteras = dataDeudas
              return bdserver.datosTitular(idcatastro, request) })
            .then(dataTitular=> {
                detalleTitulares.nombres = dataTitular[0].nombreapellido
                detalleTitulares.cedula = dataTitular[0].cedula
                detalleTitulares.valor = dataTitular[0].valor
                allresult.Titulares.push(detalleTitulares)
                next()  })
            .catch(err => console.log(err.message) )     
        },
        (allresult) => {console.log('Enviando a renderizar report'),resolve(allresult)},
        true
        );
    })
  }, 

ordenarVarios: function (idcatastrales, request, pool) {
return new Promise ((resolve, reject)=>{
 forEachAll(idcatastrales,(idcatastro, allresult, next)=> {
        let dataSqlServer
        bdserver.ordenarPago(idcatastro, request) 
      .then(dataSqlServe=>  { dataSqlServer=dataSqlServe
          return bdpostgres.ingresarOrden(dataSqlServer, pool)
        })
      .then(data=> bdpostgres.igresarOrdenDetalle(dataSqlServer, pool))
      .then (data=>  next())
      .catch(err=> reject(err)) 
      },
        (allresult) => {console.log('Varias ordenes Guardadas'),resolve("ok")},
        true
        );
    })
  }

}

function forEachAll(data, each, finish, sync) {
    var n = -1, result = {'Titulares':[] }
    var next = sync ?
        function () {
            if (++n < data.length) { each(data[n], result, next); }
            else if (finish)       { finish(result); }
        } :
        (function () {
            function completed() {
                if (++n >= data.length && finish) { finish(result); }
            }
            for (var i = 0; i < data.length; i++) { each(data[i], result, completed); }
            return completed;
        }());
    next();
}



