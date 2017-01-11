const bdserver = require('./bdsqlServer')

module.exports = {
   reportearVarios: function (idcatastrales, request) {
     
     return new Promise((resolve, reject)=> {
        forEachAll(idcatastrales,(idcatastro, allresult, next)=> {
          bdserver.deudasTitular(idcatastro, request, (err, dataDeudas) => {
            if(err) return reject(err)
              let detalleTitulares = { 'nombres': String,'cedula': String,'Carteras': [] }
              detalleTitulares.Carteras = dataDeudas
            bdserver.datosTitular(idcatastro, request, (err, dataTitular) => {
              if(err) return reject(err)
              detalleTitulares.nombres = dataTitular[0].nombreapellido
              detalleTitulares.cedula = dataTitular[0].cedula
              allresult.Titulares.push(detalleTitulares)
              next()
            })     
          }); 
        },
        (allresult) => {
            console.log('COMPLETED')
            resolve(allresult)
        },
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



