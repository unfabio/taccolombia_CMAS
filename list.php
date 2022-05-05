<?php

$directorio = "./disony/";
$ficheros  = scandir($directorio, 1);
$cmas = array();

foreach ($ficheros as $valor) {
    if (preg_match("/\d{6}\.CMAS\.zip$/i", $valor)) {
        $cmas[] = $valor;
    }
}
echo "<pre>" . json_encode($cmas, JSON_PRETTY_PRINT) . "</pre>";
