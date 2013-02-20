<?php

$headers = array();
foreach ($_SERVER as $key => $value) {
    if (strpos($key, 'HTTP_') === 0) {
        $headers[str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))))] = $value;
    }
}

header('X-Test: OK');


$callback = NULL;
if(isset($_GET["callback"])) {
    $callback = $_GET["callback"];
}

if($callback) {
    echo ';window['.json_encode($callback).'](';
}
echo json_encode($headers);
if($callback) {
    echo ');';
}

?>
