# SG
Поисковые подсказоньки

## Простой пример
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
 
 <script>
  var suggests = SG({
   // field, which will be inserted ыгппуыешщт
   field: "#query-input",
   // container for suggests
   cont: "#sg-items",
   // template per suggestion
   item: "<li><%= itemData.textMarked %></li>"
  });
 </script>
</body>
</html>
```

All done!

## Static properties
 * __Event__ - класс событий
 * __evt__ - содержит в себе все идентификаторы событий, на которые можно подписаться
 * __utils__ - полезные утилиты
 * __opts__ - глобальные настройки саджестов
 
### Event

### evt

### utils

### opts


## Static methods
### setup
устанавливает глобальные настройки саджестов

### $
alias `SG.utils.$`

### $$
alias `SG.utils.$$`


## Instance properties
 * __cont__ - DOMNode блока саджестов
 * __list__ - DOMNode блока с самими саджестами, если не был указан в опциях, то совпадает с `cont`
 * __field__ - DOMNode игпута, к которому привязан саджест
 * __form__ - DOMNode формы, содержащей инпут
 

## Instance methods
### enable
```
instance.enable()
```
Включает саджесты


### disable
```
instance.disable()
```
Отключает саджесты

### isDisabled
```
instance.isDisable()
```
Возвращает `true`, если саджесты отключены, иначе `false`

### open
```
instance.open()
```
Открывает саджесты, с последним значением инпута.

### close
```
instance.close()
```
Закрывает саджесты

### isClosed
```
instance.isClosed()
```
Возвращает `true`, если саджесты закрыты, иначе `false`

### destroy
```
instance.destroy()
```
Уничтожает экземпляр, вместе с событиями.

### show
```
instance.show( value )
```
 * __value__ - String
Показывает саджест по запросу `value`

### flushCache
```
instance.flushCache()
```
Очищает кэш

### focus
```
instance.focus( index )
```
 * __index__ - Number
Ставит фокус на определенный саджест по переданному `index`.

### moveFocus
```
instance.moveFocus( step )
```
 * __step__ - Number
Сдвигает фокус. Если `step` отрицательный, то сдвигает вверх. 

### select
```
instance.select( index )
```
 * __index__ - Number
Выбрать конкретный саджест по индексу.

### on
```
instance.on( event, callback )
```
 * __event__ - String
 * __callback__ - Function
 
Подписаться на событие

```javascript
instance.on( SG.evt.close, function( suggestValue ) {
    // do something
});
```

### off
```
instance.off( event, callback )
```
 * __event__ - String
 * __callback__ - Function

Отписаться от события

```javascript
instance.on( SG.evt.close, function( suggestValue ) {
	// do something
	instance.off( SG.evt.close, arguments.callee );
});
```

### opts
```
1) instance.opts( option[, value] )
2) instance.opts( option )
3) instance.opts()
```
 * __option__ - String|Object
 * __value__ - Mixed

1) Устанавливает опции. Может быть передан один лишь Object `option` с перечисленными опциями,
или могут быть переданы оба параметра: `option`, `value`;
причем, если у опции глубокая вложенность, то можно обратиться через точку, например `instance.opts("url.port", 80)`.
2) Получить значение отдельной опции передав параметром ее имя, например `instance.opts("ajax.dataType")`
3) Получает все опции экземпляра

### getState
```
instance.getState()
```
Возвращает Object с текущим состоянием саджестов. Доступные свойства объекта:
 * __current__ - текущее считанное значение из инпута
 * __recent__ - последнее считанное значение из инпута, может совпадать с `current`
 * __previous__ - предыдущее значение инпута
 * __value__ - запрос, по которому были запрошены саджесты
 * __data__ - данные саджестов
 * __fullData__ - полные полученные данные по запросу
 * __focused__ - индекс выделенного саджеста
 * __method__ - метод выбора саджеста: `mouse` или `keyboard`
 * __selected__ - индекс выбранного саджеста
 * __result__ - текст выбранного саджеста, который будет подставлен в инпут
 * __itemData__ - данные выбранного саджеста
 * __hovered__ - индекс подсвеченного саджеста
 * __items__ - элементы саджестов




## Конструктор
Все экземпляры саджестов создаются только одним способом:
```javascript
SG( options );
```
__or__ 
```javascript
new SG( options );
```

### Опции
#### field
Selector|DOMNode инпут, к которому следует привязать саджесты
#### cont
Selector|DOMNode главный блок, который будет прятаться/показываться default: `"#sg, .sg"`
#### list
Selector|DOMNode блок, где будут рисоваться саджесты. Если не указан, то будет использоваться `cont`
#### enabled
Boolean указывает, будет ли включен саджест при создании экземпляра. Если `false`, то для включения нужно будет вызвать метод `instance.enable()`. default: `true`
#### correction
Boolean Если `true`, то будет включена автокоррекция блока `cont` относительно `field`, причем корректироваться будет только в случае, если у блока указан стиль `position: absolute|relative|fixed`. default: `true`
#### shiftX
Integer величина в пикселях, на которую следует скорректировать по горизонтали `cont` относительно 'field'. default: `0`
#### shiftY
Integer величина в пикселях, на которую следует скорректировать по вертикали `cont` относительно 'field'. default: `0`
#### switcher
String класс, которые будет добавляться/удаляться, когда `cont` будет показан/убран. Если не указан, то у `cont` будет стираться и добавляться стиль 'display: none'  
#### delay
Integer интервал, через которые будет проверяться `field` на наличие изменений в значении default: `250`
#### valMin
Integer минимальное кол-во символов для срабатывания саджестов default: `1`
#### valMax
Integer максимальное кол-во символов для срабатывания саджестов default: `255`
#### valFilter
RegExp|Function фильтр, при положительном срабатывании которого будет срабатывать саджест default: `/(?:\S)/`
#### url
String|Object url, по которому будет запрашиваться саджест. default: `"http://suggests.go.mail.ru/sg_u?q={query}"`
пример (обе записи идентичны):
```
SG({
    url: "http://suggests.go.mail.ru/sg_u?q={query}"
})
```
```
SG({
    url: {
        scheme: 'http',
        authority: 'suggests.go.mail.ru',
        path: "sg_u",
        query: {
            q: '{query}'
        }
    }
})
```

#### ajax
##### dataType
String `text|html|xml|json|jsonp` тип получаемых данных. В зависимости от значенния может выбираться разный способ создания запроса. default: `"text"`
##### method
String `POST|GET` метод отправки запроса default: `"GET"`
##### data
Object параметры добавляемые запрашиваемуму url
##### contentType
String default: `"application/x-www-form-urlencoded; charset=utf-8"`
##### xhrFields
Object поля добавляемые в xhr объект при создании запроса. по умолчанию `withCredentials: false`
##### jsonp
String имя параметра в запросе для передачи имени колбэка при `jsonp` запросах. default: `"callback"`
##### jsonpCallback
String|Function имя колбэка. default: `function() {return "{EXPANDO}_{REQUEST_ID}"}`
##### scriptCharset
String кодировка в которую следует перевести ответ при `jsonp` запросах. default: `"utf-8"`
##### timeout
Integer таймаут запроса, по истечении которого будет принудительно вызван `abort()`, default: `5000`
##### stackSize
Integer максимальное одновременное кол-во запросов. default: `2`


#### callbackParam
deprecated, use `ajax.jsonp`
#### reqTimeout
deprecated, use `ajax.timeout`
#### reqMax
deprecated, use `ajax.stackSize`
#### reqDataType
deprecated, use `ajax.dataType`
#### reqData
deprecated, use `ajax.data` 
#### scriptCharset
deprecated, use `ajax.scriptCharset`
#### dataFilter
Function фильтр данных пришедших по запросу 
#### dataGet
Function функция извлекающая данные для элементов саджеста default: `function( data ){return data && data.items ? data.items : [];}`
#### cch
Boolean Если `true`, то включает кэширование данных по конкретному запросу. default: `true`
#### cchLimit
Integer кол-во хранимых запросов-данных. default: `128`
#### max
Integer максимальное кол-во выводимых саджестов. default: `10`
#### min
Integer минимальное кол-во выводимых саджестов. default: `0`
#### autoSubmit
Boolean Если `true`, то будет выполняться `submit()` формы сразу после выбора конкретного саджеста. default: `true`
#### hover
String класс добавляемый элементу саджеста при выборе. default: `"sg__item_hover"`  
#### item
String|Function|DOMNode шаблон или фукнция для генерации html каждого конкретного саджеста. default: `<div class="sg__item"><%= itemData.textMarked %></div>'`
#### result
Function функция, которая извлекает запрос из данных каждого конкретного саджеста. default: `function( itemData ) {return itemData.text;}`
#### select
Function hook-функция, которая должна быть вызвана при выборе саджеста. С помощью этой опции можно предовратить выбор саджеста, достаточно вернуть `false` в функции. 
#### keynavDelay
Integer задержка при выборе саджеста с клавиатуры. default: `150`
#### preview
Boolean если `true`, то подставляет запрос выделенного саджеста в `field`. Работает только если выбирать саджест с клавиатуры. default: `true`

