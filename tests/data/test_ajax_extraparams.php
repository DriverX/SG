<?php

header("Content-Type: text/plain; charset=utf-8");

$callback = NULL;
if(isset($_GET["callback"])) {
    $callback = $_GET["callback"];
}

if($callback) {
    echo ';window['.json_encode($callback).'](';
}

echo json_encode(array(
    "POST" => $_POST,
    "GET" => $_GET
));

if($callback) {
    echo ');';
}

?>
