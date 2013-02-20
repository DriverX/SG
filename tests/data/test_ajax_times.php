<?php
header("Content-Type: text/plain; charset=utf-8");

$callback = NULL;
if(isset($_GET["callback"])) {
    $callback = $_GET["callback"];
}

$sleep = NULL;
if(isset($_GET["sleep"])) {
    $sleep = (int) $_GET["sleep"];
}

if($sleep && $sleep > 0 && $sleep < 30000) {
    $usleep = $sleep * 1000;

    usleep($usleep);
} else {
    $sleep = -1;
}

if($callback) {
    echo ';window['.json_encode($callback).'](';
}
echo '{"sleep": '.($sleep).'}';
if($callback) {
    echo ');';
}

?>
