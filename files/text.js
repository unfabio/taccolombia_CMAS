
var val = {},data,csv;

var datos=[
  "NumeroDoc",
  "Tipo de Transaccion",
  "Naturaleza",
  "Fecha",
  "codigodeagente",
  "Agencia",
  "Ruta",
  "CentroDeCosto",
  "Tarifa Neta",
  "Micelaneos(Exage)",
  "Tarifa Administrativa (6A+6T)",//TarifaAdministrativa(6A+6T)
  "TasaAeroPortuaria(CO)",//TasaAeroPortuaria(CO)
  "kit Combustible (YQ)",// kit Combustible
  "IVA (YS)",// IVA
  "Penalidad (OD)",// Penalidad
  "total",
];
var signo = 1;
function InterpretarLinea(Linea){
	switch (Linea[0]) {
		case '1':
			break;
		case '2':
			val = {};
			val.NumeroDoc = Linea.substr(31,15);
            val["Tipo de Transaccion"] = Linea.substr(47,4);
            if(val["Tipo de Transaccion"] == "RFND"){
                val["Naturaleza"]="D";
                signo=-1;
            }else{
                val["Naturaleza"]="C";
                signo = 1;
            }
			var day = Linea.substr(26,2);
			var month = Linea.substr(24,2);
			var year = Linea.substr(22,2);
			val.Fecha = day+'/' + month + '/20' +year;
			break;
		case '4':
			val.Ruta = Linea.substr(20,7);
			val.CentroDeCosto=CentroDeCosto[val.Ruta];
            var tarifa= signo * parseInt(Linea.substr(100,8));
            if(/^MP/.test(val["Tipo de Transaccion"])){
				val["Micelaneos(Exage)"] = tarifa;
            }else{
                val["Tarifa Neta"] = tarifa;
            }
			break;
		case '5':
            var TaxFeeType,TaxFeeAmount;
            val["Tarifa Administrativa (6A+6T)"]=0;
           val.total = signo *parseInt(Linea.substr(86,11));//le quite el COP
            var pos=[29,48,67,113,132];
            for(var posi in pos ){
                var f=pos[posi];
                TaxFeeType = Linea.substr(f,8).trim();
    			TaxFeeAmount = signo * parseInt(Linea.substr(f+8,11));
                switch (TaxFeeType) {
                    case "6A"://TarifaAdministrativa(6A+6T)
                    val["Tarifa Administrativa (6A+6T)"]+=TaxFeeAmount;
                    break;
                    case "6T":
                    val["Tarifa Administrativa (6A+6T)"]+=TaxFeeAmount;
                    break;
                    case "CO"://TasaAeroPortuaria(CO)
                    val["TasaAeroPortuaria(CO)"]=TaxFeeAmount;
                    break;
                    case "YQ":// kit Combustible
                    val["kit Combustible (YQ)"]=TaxFeeAmount;
                    break;
                    case "YS":// IVA
                    val["IVA (YS)"]=TaxFeeAmount;
                    break;
                    case "OD":// Penalidad
                    val["Penalidad (OD)"]=TaxFeeAmount;
                    break;
                    default:
                }
            }
			break;
        case '6':

        break;
		case 'K':
            val['codigodeagente'] = Linea.substr(128,7);// le cambie

            if(/006T/.test(val['codigodeagente'])){
                val['Agencia'] = "TAC";
            }else{
                val['Agencia'] = AGENCIA[val['codigodeagente']];
            }

			data.push(val);
			break;
		default:
	}
}

var fileDisplayArea = $('#fileDisplayArea');

window.onload = function() {
		var fileInput = document.getElementById('fileInput');

		fileInput.addEventListener('change', Generar );
		function Generar() {
			data=[];
			var textType = /.CMAS$/;
			for(var f=0; fileInput.files.length>f;f++ ){
				var file = fileInput.files[f];
				if (file.name.match(textType)) {
					var reader = new FileReader();
					reader.onload = function(e) {
						Lineas= this.result.split('\n');
						for(i in Lineas ){
							InterpretarLinea(Lineas[i]);
						}
						PrintTabla();
					}
					reader.readAsText(file);
				} else {
					fileDisplayArea.innerText = "Debe ingresar un archivo tipo CMAS";
				}
			}

		};

		function PrintTabla(ver){
			csv="";
			fileDisplayArea.html("");
			if(ver){
				var $thead = $('<thead>');
				fileDisplayArea.append($thead);
				var $tr = $('<tr>');
				$thead.append($tr);
			}
			for(i in datos ){
				csv+=datos[i] +";";
				if(ver){
					$tr.append('<th>'+datos[i]+ '</th>');
				}
			}

			csv+="\n";
			if(ver){
				var $tbody = $('<tbody>');
				fileDisplayArea.append($tbody);
			}
			for(d in data ){
				if(ver){
					var $tr = $('<tr>');
					$tbody.append($tr);
				}
				for(i in datos ){
					valor = data[d][datos[i]] || 0;
					csv+=valor+";";
					if(ver){
						$tr.append('<td>'+valor+ '</td>');
					}
				}
				csv+="\n";
			}
		}

		$('.vertabla').on( "click", function () {PrintTabla(true)});

		$('.descargar').on( "click", function () {
		  // Save Dialog
		  fname = fileInput.files[0].name;
		  fname = fname + ".csv";
		  var blob = new Blob([csv], {type: 'application/csv;charset=utf-8'});
		  saveAs(blob, fname);
	  });
}
