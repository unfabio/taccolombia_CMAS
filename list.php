<?php 
echo "hola";

$directorio = "./disony/";
$ficheros  = scandir($directorio, 1);
$cmas = array();


foreach ($ficheros as $valor) {
if (preg_match("/\.CMAS\.zip$/i", $valor)) {
    $cmas[] = $valor;

}}
echo json_encode($cmas);