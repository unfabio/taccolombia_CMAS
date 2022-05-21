<?php
# Si no entiendes el código, primero mira a login.php

# Iniciar sesión para usar $_SESSION
session_start();
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <title>CONVERSOR CMAS</title>

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2014-11-29/FileSaver.min.js"></script>
  <script type="text/javascript" src="files/zip.min.js"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
  <link rel="stylesheet" href="files/style.css" />
</head>

<body>
  <div id="page-wrapper">
    <h1>CONVERSOR CMAS</h1>
    <?php if (empty($_SESSION["usuario"])) { ?>
      Seleciones un archivo:
      <input type="file" id="fileInput" class="btn btn-primary" multiple="multiple" accept=".zip, .CMAS" />
      <button type="button" class="btn btn-success vertabla">
        Ver Tabla
      </button>
      <button type="button" class="btn btn-info descargar">Descargar</button>
      <input type="text" name="datefilter" value="" />
  </div>
  <div class="panel panel-default">
    <!-- Default panel contents -->
    <div class="panel-heading">Formato salida</div>

    <!-- Table -->
    <table class="table table-striped table-bordered" id="fileDisplayArea"></table>
  </div>
<?php } else { ?>
  <form action="login.php" method="post">

    <input name="usuario" type="text" placeholder="Escribe tu nombre de usuario" />
    <br /><br />
    <input name="palabra_secreta" type="password" placeholder="Contraseña" />
    <br /><br />
    <!--Lo siguiente envía el formulario-->
    <input type="submit" value="Iniciar sesión" />
  </form>
<?php } ?>


<div>

</div>

<script src="files/Agencias.js"></script>
<script src="files/centros_de_costo.js"></script>
<script src="files/text.js"></script>
</body>

</html>