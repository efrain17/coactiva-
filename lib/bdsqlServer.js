function consultar (request,query, callback){
	request.query(query, (err, recordset)=> {
		if (err) return callback(err),console.log("bd1: "+err)
		callback(null, recordset)
	}); 
}

module.exports = {
	ordenarPago: function (id, request, callback){
		consultar(request, deudorSelecAgrupado+id+"' GROUP BY CodigoCatastral,Nombres",callback)
	},

	deudasTitular: function (id,request,callback){
		console.log(id)
		consultar(request,deudorSeleccionado+id+"' ORDER BY Ano",callback)
	},
	datosTitular: function (id,request,callback){
		consultar(request,datosTitularSelect+id+"' group by nombres, Identificacion,codigocatastral",callback)
	},

	todosDeudores: function (request,callback){
		consultar(request,todosDeudores,callback)
	},

	deudoresPaginacion: function (id,request,callback){
		consultar(request,DeudoresPaginado1+id * 15+DeudoresPaginado2,callback)
	}

}

var datosTitularSelect=`SELECT 
    REPLACE(nombres,'/','') as nombreapellido, 
    REPLACE(identificacion,'/','') as cedula
	FROM [bdPredios].[dbo].[tCarteraUrbano] 
	WHERE  codigocatastral = '`

var deudorSelecAgrupado=`SELECT  codigocatastral
    , nombres
    , SUM (ValorEmitido) AS valor
    , MIN (Año) As ano
    , MAX (Año) As anomax
    , MAX (Estado) as estado
    , MAX (Direccion) as direccion
  	FROM [bdPredios].[dbo].[tCarteraUrbano]
  	WHERE ([Estado] = 'Emitido' OR [Estado] = 'E') and CodigoCatastral = '`

var deudorSeleccionado=`SELECT 
    CodigoCatastral as codigocatastral,
	Nombres as nombres,ValorEmitido as valor, 
	Año as ano, 
	Estado as estado, 
	Direccion as direccion
	FROM [bdPredios].[dbo].[tCarteraUrbano] 
	WHERE (Estado = 'Emitido' OR [Estado] = 'E') and CodigoCatastral = '`

var todosDeudores=`SELECT  codigocatastral
	,nombres
	, SUM (ValorEmitido) AS valor
	, MIN (Año) As ano
    , MAX (Año) As anomax
	, MAX (estado) as estado 
	, MAX (direccion) as direccion
	FROM [bdPredios].[dbo].[tCarteraUrbano]
	WHERE (estado = 'Emitido' OR estado = 'E')
	GROUP BY codigocatastral,nombres
	ORDER BY nombres, ano `

var DeudoresPaginado1=`SELECT codigocatastral
	,nombres
	, SUM (ValorEmitido) AS valor
	, MIN (Año) As ano
	, MAX (Año) As anomax
	, MAX (Estado) as estado
	, MAX (Direccion) as direccion
	FROM [bdPredios].[dbo].[tCarteraUrbano] 
	WHERE ([Estado] = 'Emitido' OR [Estado] = 'E') 
	GROUP BY CodigoCatastral,Nombres
	ORDER BY Nombres, ano 
	OFFSET `
var DeudoresPaginado2=` ROWS FETCH NEXT 15 ROWS ONLY `