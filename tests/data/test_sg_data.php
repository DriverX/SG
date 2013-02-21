<?php
header("Content-Type: text/plain; charset=utf-8");

$data = array(
        "foobar2000",
        "foobar2000 скачать rus",
        "foobar2000 русский",
        "foobar2000 скачать",
        "foobar2000 rus скачать",
        "foobar2000 1.2.2",
        "foobar2000 скачать бесплатно",
        "foobar2000 darkone сборка",
        "foobar2000 русификатор",
        "harry potter 2",
        "harry potter 1",
        "harry potter 8",
        "harry potter 7",
        "harry potter 6",
        "harry potter 5",
        "harry potter film",
        "harry potter and the deathly hallows",
        "harry potter 3",
        "metallica",
        "metal war online",
        "metalist",
        "metallist",
        "metallica fuel",
        "metal gear solid",
        "metallica one",
        "metallica battery",
        "metallica the unforgiven",
        "moscow fm",
        "moscow times",
        "moscow.gks.ru",
        "moscow.megafon.ru",
        "moscowfive.ru",
        "moscow five",
        "moscow open 2013",
        "moscow city",
        "moscow calling",
        "new yorker",
        "new york times",
        "new york city",
        "new yorker каталог",
        "new yorker официальный сайт",
        "new yorker каталог одежды",
        "new york dance studio",
        "new yorker интернет каталог",
        "new yorker магазин",
        "как похудеть",
        "как похудеть за 3 дня",
        "как правильно заниматься этим",
        "как бросить курить",
        "как",
        "как достать соседа",
        "как сделать скрин",
        "как приготовить кролика",
        "какой сегодня праздник",
        "как собрать кубик рубик",
        "ses.lviv.ua",
        "ex.ua",
        "selgros",
        "explay",
        "seetv.tv",
        "skyexpress",
        "seozavr",
        "netbynet",
        "sat24 com",
        "seasonvar",
        "москва фм",
        "москва",
        "москва третий рим",
        "москва 24",
        "москва слезам не верит",
        "москва погода",
        "москва сити",
        "москва 2017",
        "москва википедия",
        "москва шахматная",
        "world of tanks",
        "worldoftanks",
        "world of warplanes",
        "world of warcraft",
        "world of dragons",
        "world of tanks играть",
        "worldoftanks.com",
        "world of",
        "world of warships",
        "пиво",
        "пиво белый медведь",
        "пивоварня",
        "пиво картинки",
        "пиворама",
        "пиво со сметаной",
        "пиво на дом",
        "пиво бад",
        "пиво козел",
        "пиво хайнекен",
        "почему",
        "почемучка",
        "почему не работает вконтакте",
        "почему я такая дура",
        "почему у парней утром стоит",
        "почему путин краб",
        "почему нельзя дарить часы",
        "почему не работает контакт",
        "почему затянулась посевная",
        "почему у таксиста плохой день"
	);

// Shuffle shuffle shuffle
shuffle($data);

$query = NULL;
if(isset($_GET["query"])) {
    $query = $_GET["query"];
}
$response = array($query, array_slice($data, 0, 10));


$headers = array();
foreach ($_SERVER as $key => $value) {
    if (strpos($key, 'HTTP_') === 0) {
        $headers[str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))))] = $value;
    }
}

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
}



if($callback) {
    echo ';window['.json_encode($callback).'](';
}
echo json_encode($response);
if($callback) {
    echo ');';
}

?>
