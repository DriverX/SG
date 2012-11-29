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
