<?php


$code = NULL;
if(isset($_GET["code"])) {
    $code = (int) $_GET["code"];
}

if($code) {
    http_response_code($code);
}

echo "code=".http_response_code();

?>
