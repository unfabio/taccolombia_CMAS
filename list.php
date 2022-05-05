<?php

$directorio = "./disony/";
$ficheros  = scandir($directorio, 1);
$cmas = array();

foreach ($ficheros as $valor) {
    if (preg_match("/CO\.006T\.\w{3}\.P\.(\d{2})(\d{2})(\d{2})\.CMAS\.zip$/i", $valor, $matches)) {
        $cmas[]  =  $valor;
        //$cmas[]  =  mktime(0, 0, 0, $matches[2], $matches[3], $matches[1]);
    }
}
sort($cmas);
echo "<pre>" . json_encode($cmas, JSON_PRETTY_PRINT) . "</pre>";
