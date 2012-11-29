# SG
Поисковые подсказоньки

## Простой пример
html:
```html
<!doctype html>
<html>
<head>
 <meta charset="utf-8">
 
 <!-- load SG library -->
 <script src="sg.js"></script>
</head>
<body>
 <!-- search form with suggests -->
 <form action="http://go.mail.ru/search">
  <input id="query-input" name="q">
  <input type="submit" value="Search">
 </form>
 
 <!-- main suggests container -->
 <ul id="sg-items" style="display: none;"></ul>
 
</body>
</html>
```

javascript:
```javascript
var suggests = SG({
 // field, which will be inserted ыгппуыешщт
 field: "#query-input",
 // container for suggests
 cont: "#sg-items",
 // template per suggestion
 item: "<li><%= itemData.textMarked %></li>"
});
```

All done!

## Конструктор
Все экземпляры саджестов создаются только одним способом:
```
SG( options );

or

new SG( options );
```

### Опции
 * __field__ -
 * __cont__ - default: "#sg, .sg"
 * __list__ - 
 * __enabled__ - default: true
 * __correction__ - default: true
 * __shiftX__ - default: 0
 * __shiftY__ - default: 0
 * __switcher__ - default: 
 * __switchChecker__ - default: 
 * __delay__ - default: 250
 * __valMin__ - default: 1
 * __valMax__ - default: 255
 * __valFilter__ - default: /(?:\S)/
 * __url__ - default: "http://suggests.go.mail.ru/sg_u?q={query}"
 * __callbackParam__ - default: "callback"
 * __reqTimeout__ - default: 5000
 * __reqMax__ - default: 2,
 * __reqDataType__ - default: "jsonp"
 * __reqData__ - default: 
 * __scriptCharset__ - default: "utf-8",
 * __ajax__ - 
 * __dataFilter__ - default: 
 * __dataGet__ - default: function( data ){return data && data.items ? data.items : [];},
 * __cch__ - default: true,
 * __cchLimit__ - default: 128,
 * __max__ - default: 10,
 * __min__ - default: 0,
 * __autoSubmit__ - default: true,
 * __hover__ - default: "sg__item_hover"
 * __itemExtraData__ - default:  
 * __item__ - default: '<div class="sg__item"><%= itemData.textMarked %></div>',
 * __result__ - default: function( itemData ) {return itemData.text;},
 * __select__ - default: 
 * __keynavDelay__ - default: 150,
 * __preview__ - default: true,
 * __debug__ - default: false
