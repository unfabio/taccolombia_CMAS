
var val = {},data,csv;
function InterpretarLinea(Linea){
	switch (Linea[0]) {
		case '1':
			break;
		case '2':
			val = {};
			val.NumeroDoc = Linea.substr(31,15);
			val.Fecha = Linea.substr(22,6);
			val.codigodeagente = Linea.substr(7,8);// le cambie
			break;
		case '4':
			val.tasa = Linea.substr(121,7);//le cambie
			val.kitCombustible = Linea.substr(110,7);//le cambie
			val.tasaadministrativa = Linea.substr(132,7);// le cambie
			val.total = Linea.substr(144,8);//le quite el COP
			val.tarifaneta = Linea.substr(89,8);// le quite el COP
			break;
		case '5':
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
			break;
		case 'K':
			data.push(val);
			break;
		default:
	}
}



window.onload = function() {
		var fileInput = document.getElementById('fileInput');
		var fileDisplayArea = $('#fileDisplayArea');

		fileInput.addEventListener('change', Generar );
		function Generar() {
			csv="";
			data=[];
			fileDisplayArea.html("");
			var file = fileInput.files[0];
			var textType = /.CMAS$/;

			if (file.name.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					Lineas= reader.result.split('\n');
					for(i in Lineas ){
						InterpretarLinea(Lineas[i]);
					}

					var $thead = $('<thead>');
					fileDisplayArea.append($thead);

					var $tr = $('<tr>');
					$thead.append($tr);
					for(i in data[0] ){
						csv+=i +";";
						$tr.append('<th>'+i+ '</th>');
					}

					csv+="\n";

					var $tbody = $('<tbody>');
					fileDisplayArea.append($tbody);

					for(d in data ){
						var $tr = $('<tr>');
						$tbody.append($tr);
						for(i in data[d] ){
							csv+=data[d][i] +";";
							$tr.append('<td>'+data[d][i]+ '</td>');
						}
						csv+="\n";
					}
				}
				reader.readAsText(file);
			} else {
				fileDisplayArea.innerText = "Debe ingresar un archivo tipo CMAS";
			}
		};
		$('.generar').on( "click", Generar);

		$('.descargar').on( "click", function () {
		  // Save Dialog
		  fname = fileInput.files[0].name;
		  fname = fname + ".csv";
		  var blob = new Blob([csv], {type: 'application/csv;charset=utf-8'});
		  saveAs(blob, fname);
	  });
}
