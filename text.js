
var val = {};
function InterpretarLinea(Linea){
	switch (Linea[0]) {
		case '1':
			break;
		case '2':
			val.NumeroDoc = Linea.substr(31,15);
			val.Fecha = Linea.substr(22,6);
			val.codigodeagente = Linea.substr(27,4);
			break;
		case '4':
			val.tasa = Linea.substr(108,11);
			val.kitCombustible = Linea.substr(119,11);
			val.ivatarifaneta = Linea.substr(130,11);
			val.total = Linea.substr(141,11);
			val.tarifaneta = Linea.substr(86,11);
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
		default:
	}
}

window.onload = function() {
		var fileInput = document.getElementById('fileInput');
		var fileDisplayArea = $('#fileDisplayArea');

		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			var textType = /.CMAS$/;

			if (file.name.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					Lineas= reader.result.split('\n');
					for(i in Lineas ){
						InterpretarLinea(Lineas[i]);
						if(Lineas[i][0]=='K')
							break;
					}
					for(i in val ){
						fileDisplayArea.append('<li>'+i+":"+val[i]+ '</li>')
					}
				}
				reader.readAsText(file);
			} else {
				fileDisplayArea.innerText = "Debe ingresar un archivo tipo CMAS";
			}
		});
}
