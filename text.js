
var val = {},data,csv;

var datos=[
  "NumeroDoc",
  "Fecha",
  "codigodeagente",
  "Ruta",
  "CentroDeCosto",
  "total",
  "tarifaneta",
  "Tarifa Administrativa (6A+6T)",//TarifaAdministrativa(6A+6T)
  "TasaAeroPortuaria(CO)",//TasaAeroPortuaria(CO)
  "kit Combustible (YQ)",// kit Combustible
  "IVA (YS)",// IVA
  "Penalidad (OD)",// Penalidad
];

function InterpretarLinea(Linea){
	switch (Linea[0]) {
		case '1':
			break;
		case '2':
			val = {};
			val.NumeroDoc = Linea.substr(31,15);
			var day = Linea.substr(26,2);
			var month = Linea.substr(24,2);
			var year = Linea.substr(22,2);
			val.Fecha = day+'/' + month + '/20' +year;
			val.codigodeagente = Linea.substr(7,8);// le cambie
			break;
		case '4':
			val.Ruta = Linea.substr(20,7);
			val.CentroDeCosto=CentroDeCosto[val.Ruta];
			val.total = Linea.substr(144,8);//le quite el COP
			val.tarifaneta = Linea.substr(89,8);// le quite el COP
			break;
		case '5':
            var TaxFeeType,TaxFeeAmount;
            val["Tarifa Administrativa (6A+6T)"]=0;
            for(var f=29;f<137;f+=19 ){
                TaxFeeType = Linea.substr(f,8).trim();
    			TaxFeeAmount = parseInt(Linea.substr(f+8,11));
                switch (TaxFeeType) {
                    case "6A"://TarifaAdministrativa(6A+6T)
                    val["Tarifa Administrativa (6A+6T)"]+=TaxFeeAmount;
                    break;
                    case "6T":
                    val["Tarifa Administrativa (6A+6T)"]=TaxFeeAmount;
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
                }

                if(!(TaxFeeType in datos)){
                    console.log("Valor TaxFeeType [" + TaxFeeType+"] no reconocido");
                }
            }

			/*
			val.TaxFeeType5 = Linea.substr(29,8);
			val.TaxFeeAmount6 = Linea.substr(37,11);
			val.TaxFeeType7 = Linea.substr(48,8);
			val.TaxFeeAmount8 = Linea.substr(56,11);
			val.TaxFeeType9 = Linea.substr(67,8);
			val.TaxFeeAmount10 = Linea.substr(75,11);
			val.TaxFeeType15 = Linea.substr(113,8);
			val.TaxFeeAmount16 = Linea.substr(121,11);
			val.TaxFeeType17 = Linea.substr(132,8);
			val.TaxFeeAmount18 = Linea.substr(140,11);
			val.TaxFeeType19 = Linea.substr(151,8);
			val.TaxFeeAmount20 = Linea.substr(159,11);
            */
			break;
		case 'K':
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
