/*
function $(a) {
  console.log(a);
}
let window = window | {};
*/
var val = {},
  data = [],
  csv = "";

var datos = [
  "NumeroDoc",
  "Tipo de Transaccion",
  "Naturaleza",
  "Fecha",
  "codigodeagente",
  "Agencia",
  "Forma de Pago",
  "Ruta",
  "CentroDeCosto",
  "Tarifa Neta",
  "BAGGAGE EXCESS",
  "Tarifa Administrativa (6A+6T)", //TarifaAdministrativa(6A+6T)
  "TasaAeroPortuaria(CO)", //TasaAeroPortuaria(CO)
  "kit Combustible (YQ)", // kit Combustible
  "IVA (YS)", // IVA
  "Penalidad (OD)", // Penalidad
  "total",
];
var signo = 1;

function InterpretarLinea(Linea) {
  switch (Linea[0]) {
    case "1":
      break;
    case "2":
      val = {};
      val.NumeroDoc = Linea.substr(31, 15);
      val["Tipo de Transaccion"] = Linea.substr(47, 4);
      if (val["Tipo de Transaccion"] == "RFND") {
        val["Naturaleza"] = "D";
        signo = -1;
      } else {
        val["Naturaleza"] = "C";
        signo = 1;
      }
      var day = Linea.substr(26, 2);
      var month = Linea.substr(24, 2);
      var year = Linea.substr(22, 2);
      val.Fecha = day + "/" + month + "/20" + year;
      break;
    case "4":
      val.Ruta = Linea.substr(20, 7);
      val.CentroDeCosto = CentroDeCosto[val.Ruta];
      var tarifa = signo * parseInt(Linea.substr(100, 8));
      val["Tarifa Neta"] = tarifa;
      break;
    case "5":
      var TaxFeeType, TaxFeeAmount;
      val["Tarifa Administrativa (6A+6T)"] = 0;
      val.total = signo * parseInt(Linea.substr(86, 11)); //le quite el COP
      var pos = [29, 48, 67, 113, 132];
      for (var posi in pos) {
        var f = pos[posi];
        TaxFeeType = Linea.substr(f, 8).trim();
        TaxFeeAmount = signo * parseInt(Linea.substr(f + 8, 11));
        switch (TaxFeeType) {
          case "6A": //TarifaAdministrativa(6A+6T)
            val["Tarifa Administrativa (6A+6T)"] += TaxFeeAmount;
            break;
          case "6T":
            val["Tarifa Administrativa (6A+6T)"] += TaxFeeAmount;
            break;
          case "CO": //TasaAeroPortuaria(CO)
            val["TasaAeroPortuaria(CO)"] = TaxFeeAmount;
            break;
          case "YQ": // kit Combustible
            val["kit Combustible (YQ)"] = TaxFeeAmount;
            break;
          case "YS": // IVA
            val["IVA (YS)"] = TaxFeeAmount;
            break;
          case "OD": // Penalidad
            val["Penalidad (OD)"] = TaxFeeAmount;
            break;
          default:
        }
      }
      break;
    case "6":
      break;
    case "8":
      val["Forma de Pago"] = Linea.substr(49, 2);
      break;
    case "G":
      if (Linea.substr(69, 14) == "BAGGAGE EXCESS") {
        val["BAGGAGE EXCESS"] = parseInt(Linea.substr(9, 11));
      }
      break;
    case "K":
      val["codigodeagente"] = Linea.substr(128, 9); // le cambie

      if (/006T/.test(val["codigodeagente"])) {
        val["Agencia"] = "TAC";
      } else {
        val["Agencia"] = AGENCIA[val["codigodeagente"].substr(0, 7)];
      }
      data.push(val);
      break;
    default:
  }
}

var fileDisplayArea = $("#fileDisplayArea");
let url = "/disony/CO.006T.CRS.P.220409.CMAS.zip";
let blob;
window.onload = function () {
  var fileInput = document.getElementById("fileInput");

  fileInput.addEventListener("change", Generar);

  async function getfile(url) {
    blob = await fetch(url).then((r) => r.blob());
    const reader = new zip.ZipReader(new zip.BlobReader(blob));
    // get all entries from the zip
    const entries = await reader.getEntries();
    if (entries.length && entries[0].filename.match(/.CMAS$/)) {
      // get first entry content as text by using a TextWriter
      const text = await entries[0].getData(new zip.TextWriter());
      // text contains the entry data as a String
      Leer(text);
    }
    // close the ZipReader
    await reader.close();
  }

  $(".vertabla").on("click", function () {
    PrintTabla(true);
  });

  $(".descargar").on("click", function () {
    // Save Dialog
    fname = "CMAS"; //fileInput.files[0].name;
    fname = fname + ".csv";
    var blob = new Blob([csv], { type: "application/csv;charset=utf-8" });
    saveAs(blob, fname);
  });
};
async function Generar() {
  data = [];
  for (var f = 0; fileInput.files.length > f; f++) {
    var file = fileInput.files[f];
    if (file.name.match(/.CMAS$/)) {
      var reader = new FileReader();
      reader.onload = function (e) {
        Leer(this.result);
      };
      reader.readAsText(file);
    } else if (file.name.match(/.zip$/)) {
      const reader = new zip.ZipReader(new zip.BlobReader(file));
      // get all entries from the zip
      const entries = await reader.getEntries();
      if (entries.length && entries[0].filename.match(/.CMAS$/)) {
        // get first entry content as text by using a TextWriter
        const text = await entries[0].getData(new zip.TextWriter());
        // text contains the entry data as a String
        Leer(text);
      }
      // close the ZipReader
      await reader.close();
    } else {
      fileDisplayArea.innerText = "Debe ingresar un archivo tipo CMAS";
    }
  }
}
function Leer(txt) {
  Lineas = txt.split(/\n|\r/);
  for (i in Lineas) {
    InterpretarLinea(Lineas[i]);
  }
  PrintTabla();
}

function PrintTabla(ver) {
  csv = "";
  fileDisplayArea.html("");
  if (ver) {
    var $thead = $("<thead>");
    fileDisplayArea.append($thead);
    var $tr = $("<tr>");
    $thead.append($tr);
  }
  for (i in datos) {
    csv += datos[i] + ";";
    if (ver) {
      $tr.append("<th>" + datos[i] + "</th>");
    }
  }

  csv += "\n";
  if (ver) {
    var $tbody = $("<tbody>");
    fileDisplayArea.append($tbody);
  }
  for (d in data) {
    if (ver) {
      var $tr = $("<tr>");
      $tbody.append($tr);
    }
    for (i in datos) {
      valor = data[d][datos[i]] || 0;
      csv += valor + ";";
      if (ver) {
        $tr.append("<td>" + valor + "</td>");
      }
    }
    csv += "\n";
  }
}
$(function () {
  $('input[name="datefilter"]').daterangepicker({
    autoUpdateInput: false,
    locale: {
      cancelLabel: "Clear",
    },
  });

  $('input[name="datefilter"]').on(
    "apply.daterangepicker",
    function (ev, picker) {
      let url =
        "./disony/CO.006T.CRS.P." +
        picker.startDate.format("YYMMDD") +
        ".CMAS.zip";
      getfile(url);
      $(this).val(
        picker.startDate.format("MM/DD/YYYY") +
          " - " +
          picker.endDate.format("MM/DD/YYYY")
      );
    }
  );

  $('input[name="datefilter"]').on(
    "cancel.daterangepicker",
    function (ev, picker) {
      $(this).val("");
    }
  );
});
