<?php

$callback = NULL;
if(isset($_GET["callback"])) {
    $callback = $_GET["callback"];
}

if($callback) {
    echo ';window['.json_encode($callback).'](';
}
echo '{"foo": "bar"}';
if($callback) {
    echo ');';
}

?>
