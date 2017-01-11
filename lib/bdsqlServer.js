function consultar (request,query){
	return new Promise((resolve, reject)=> {
		request.query(query, (err, recordset)=> {
			if (err) return reject(err),console.log("bd1: "+err)
			resolve(recordset)
		})
	})	
}

module.exports = {
	ordenarPago: function (id, request){
		return consultar(request, deudorSelecAgrupado+id+"' GROUP BY CodigoCatastral,Nombres")
	},

	deudasTitular: function (id,request){
		return consultar(request,deudorSeleccionado+id+"' ORDER BY Ano")
	},
	datosTitular: function (id,request){
		return consultar(request,datosTitularSelect+id+"' group by nombres, Identificacion,codigocatastral")
	},

	todosDeudores: function (request){
		return consultar(request,todosDeudores)
	},

	deudoresPaginacion: function (id,request){
		return consultar(request,DeudoresPaginado1+id * 15+DeudoresPaginado2)
	}

}

var datosTitularSelect=`SELECT 
    REPLACE(nombres,'/','') as nombreapellido, 
    REPLACE(identificacion,'/','') as cedula,
	SUM (ValorEmitido) as valor
	FROM [bdPredios].[dbo].[tCarteraUrbano] 
	WHERE ([Estado] = 'Emitido' OR [Estado] = 'E') and codigocatastral = '`

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