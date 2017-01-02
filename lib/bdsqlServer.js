var deudorSelecAgrupado=`SELECT  [CodigoCatastral]
    ,[Nombres]
    , SUM (ValorEmitido) AS Valor
    , MIN (Año) As Ano
    , MAX (Estado) as Estado
    , MAX (Direccion) as Direccion
  	FROM [bdPredios].[dbo].[tCarteraUrbano] WHERE ([Estado] = 'Emitido' OR [Estado] = 'E') and CodigoCatastral = '`
var deudorSeleccionado=`SELECT  CodigoCatastral
	,Nombres,ValorEmitido, Año as Ano, Estado, Direccion
	FROM [bdPredios].[dbo].[tCarteraUrbano] 
	WHERE (Estado = 'Emitido' OR [Estado] = 'E') and CodigoCatastral = '`
var todosDeudores=`SELECT  [CodigoCatastral]
	,[Nombres]
	, SUM (ValorEmitido) AS Valor
	, MIN (Año) As Ano
	, MAX (Estado) as Estado
	, MAX (Direccion) as Direccion
	FROM [bdPredios].[dbo].[tCarteraUrbano] WHERE ([Estado] = 'Emitido' OR [Estado] = 'E') 
	GROUP BY CodigoCatastral,Nombres
	ORDER BY Nombres, Ano `
var DeudoresPaginado1=`SELECT  [CodigoCatastral]
	,[Nombres]
	, SUM (ValorEmitido) AS Valor
	, MIN (Año) As Ano
	, MAX (Estado) as Estado
	, MAX (Direccion) as Direccion
	FROM [bdPredios].[dbo].[tCarteraUrbano] WHERE ([Estado] = 'Emitido' OR [Estado] = 'E') 
	GROUP BY CodigoCatastral,Nombres
	ORDER BY Nombres, Ano 
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