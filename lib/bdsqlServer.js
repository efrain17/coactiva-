var deudorSelecAgrupado=`SELECT  codigocatastral
    , nombres
    , SUM (ValorEmitido) AS valor
    , MIN (Año) As ano
    , MAX (Estado) as estado
    , MAX (Direccion) as direccion
  	FROM [bdPredios].[dbo].[tCarteraUrbano] WHERE ([Estado] = 'Emitido' OR [Estado] = 'E') and CodigoCatastral = '`
var deudorSeleccionado=`SELECT  CodigoCatastral as codigocatastral
	,Nombres as nombres,ValorEmitido as valor, Año as ano, Estado as estado, Direccion as direccion
	FROM [bdPredios].[dbo].[tCarteraUrbano] 
	WHERE (Estado = 'Emitido' OR [Estado] = 'E') and CodigoCatastral = '`
var todosDeudores=`SELECT  codigocatastral
	,nombres
	, SUM (ValorEmitido) AS valor
	, MIN (Año) As ano
	, MAX (estado) as estado 
	, MAX (direccion) as direccion
	FROM [bdPredios].[dbo].[tCarteraUrbano] WHERE (estado = 'Emitido' OR estado = 'E') 
	GROUP BY codigocatastral,nombres
	ORDER BY nombres, ano `
var DeudoresPaginado1=`SELECT codigocatastral
	,nombres
	, SUM (ValorEmitido) AS valor
	, MIN (Año) As ano
	, MAX (Estado) as estado
	, MAX (Direccion) as direccion
	FROM [bdPredios].[dbo].[tCarteraUrbano] WHERE ([Estado] = 'Emitido' OR [Estado] = 'E') 
	GROUP BY CodigoCatastral,Nombres
	ORDER BY Nombres, ano 
	OFFSET `
var DeudoresPaginado2=` ROWS FETCH NEXT 15 ROWS ONLY `

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
		consultar(request,deudorSeleccionado+id+"' ORDER BY Ano",callback)
	},

	todosDeudores: function (request,callback){
		consultar(request,todosDeudores,callback)
	},

	deudoresPaginacion: function (id,request,callback){
		consultar(request,DeudoresPaginado1+id * 15+DeudoresPaginado2,callback)
	}

}