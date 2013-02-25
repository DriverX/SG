# SG
Поисковые подсказоньки

## Сборка
Для сборки используется [grunt](http://gruntjs.com) v0.4.
```
git clone https://github.com/DriverX/SG.git
cd SG
npm install grunt
npm install grunt-contrib-concat
npm install grunt-text-replace
npm install grunt-closure-tools
grunt
ls -l sg*
```

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
 
## SG.Event
`SG.Event` предоставляет простой интерфейс для работы с событиями. Поддерживает как DOMEvent, так и кастомные события, как на DOMNode, так и на любой произвольном объекте.

### Event.add
```
SG.Event.add( elem, event, callback )
```
 * __elem__ - DOMNode|Object объект к которому привязывается обработчик на событие `event`
 * __event__ - String событие. Возможно указание нескольких событий, достаточно разделить их пробелом, например `"focus blur"`
 * __callback__ - Function

Метод добавления обработчиков событий
```javascript
var elem = document.getElementById("some_link"),
	i = 0;
SG.Event.add( elem, "click", function( event ) {
	i++;
	this.innerHTML = "i = " + i;
	
	event.preventDefault();
});
```

### Event.rm
```
1) SG.Event.rm( elem )
2) SG.Event.rm( elem, event )
2) SG.Event.rm( elem, event, callback )
```
 * __elem__ - DOMNode|Object объект, с которого удаляется обработчик события
 * __event__ - String событие. Возможно указание нескольких событий, достаточно разделить их пробелом, например `"focus blur"`
 * __callback__ - Function

1) Удаляет с объекта все обработчики со всех событий
2) Удаляет все обработчики только с указанных событий
3) Удаляет только определенный обработчик с определенного события

### Event.fire
```
SG.Event.fire( elem, event[, extra] )
```
 * __elem__ - DOMNode|Object
 * __event__ - String
 * __extra__ - Array

Возбуждает событие `event` у элемента `elem`, с дополнительными параметрами `extra` обработчику, если были переданы

## SG.evt
Содержит в себе все возможные события в саджестах
 * __open__ - 
 * __openEnd__ - 
 * __close__ - 
 * __closeEnd__ - 
 * __enable__ - 
 * __enableEnd__ - 
 * __disable__ - 
 * __disableEnd__ - 
 * __destroy__ - 
 * __destroyEnd__ - 
 * __blockRequest__ - 
 * __successRequest__ - 
 * __completeRequest__ - 
 * __stopRequest__ - 
 * __errorRequest__ - 
 * __startRequest__ - 
 * __sendRequest__ - 
 * __passFilter__ - 
 * __failFilter__ - 
 * __rejectData__ - 
 * __acceptData__ - 
 * __render__ - 
 * __renderEnd__ - 
 * __focus__ - 
 * __focusEnd__ - 
 * __select__ - 
 * __selectEnd__ - 
 * __valueChange__ - 
 * __flushCache__ - 
 * __flushCacheEnd__ - 
 * __setCache__ - 
 * __setCacheEnd__ - 
 * __getCache__ - 
 * __getCacheEnd__ - 

## SG.utils
### SG.utils.isArr
```
SG.utils.isArr( some_var )
```
Возвращает `true` если `some_var` - Array

### SG.utils.isFn
```
SG.utils.isFn( some_var )
```
Возвращает `true` если `some_var` - Function

### SG.utils.isObj
```
SG.utils.isObj( some_var )
```
Возвращает `true` если `some_var` - Plain Object (`{}`)

### SG.utils.isWin
```
SG.utils.isWin( some_var )
```
Возвращает `true` если `some_var` - Window

### SG.utils.bind
```
SG.utils.bind( fn, context[, arg1[, ...[, argN]]])
```
 * __fn__ - Function - функция, к которой привязывается контекст
 * __context__ - Object|Null - привязываемый контекст
 * __argN__ - Mixed параметры, которые будут переданы `fn` при вызове
 
Биндит контекст к функции 

### SG.utils.ext
```
1) SG.utils.ext( obj, extObj[, extObj1[, ...[, extObjN]]] )
2) SG.utils.ext( true, obj, extObj[, extObj1[, ...[, extObjN]]] )
```
Аналогичная с jQuery.extend

### SG.utils.copy
```
SG.utils.ext( obj )
```
 * __obj__ - Object|Array

Копирует объект или массив и возвращает копию

### SG.utils.trim
```
SG.utils.trim( str )
```
 * __str__ - String

Отрезает пробельные символы с начала и конца строки

### SG.utils.arrEach
```
SG.utils.arrEach( arr, iter_fn( value, key ) )
```
alias `Array.forEach`

### SG.utils.objEach
```
SG.utils.objEach( obj, iter_fn( value, key ) )
```
как `SG.utils.arrEach`, но для объектов

### SG.utils.each
```
SG.utils.each( obj, iter_fn( value, key ) )
```
 * __obj__ - Array|Object


### SG.utils.map
alias `Array.map`

### SG.utils.indexOf
alias `Array.indexOf`

### SG.utils.format
```
SG.utils.format( str, replace )
```
 * __str__ - String строка, в которой будет произведен поиск и замена
 * __replace__ - Object объект с заменани, например `{foo: "bar"}`

Поиск и замена в `str` конструкций вида `{some_macros}` на значение ключен из `replace`
```javascript
SG.utils.format( "Hello, {name}! Nice {time}!", {
    name: "World",
    daytime: "day"
})
// Hello, World! Nice day!
```

### SG.utils.objFormat
```
SG.utils.objFormat( obj, replace )
```
 * __str__ - Object объект, в свойствах которого будет произведен поиск и замена. Причем обрабатываются и вложенные объекты.
 * __replace__ - Object объект с заменани, например `{foo: "bar"}`

Поиск и замена в `obj` конструкций вида `{some_macros}` на значение ключей из `replace`
```javascript
SG.utils.objFormat({
    foo: "Hello, {name}!",
    bar: "Goodbye, {name} and good {daytime}!"
}, {
    name: "World",
    daytime: "night"
})
// {foo: "Hello, World!", bar: "Goodbye, World and good night!"}
```

### SG.utils.walker
```
1) SG.utils.walker( obj, route )
2) SG.utils.walker( obj, route, value )
```
 * __obj__ - Object
 * __route__ - String путь до свойства
 * __value__ - Mixed устанавливаемое значение

Идет по объекту `obj` с помощью дескриптора `route`, который в свой очередь представляет из себя запись обращения к свойствах объекта, например `foo.bar.bar` 

1) Получает значение свойства. Если св-во не было найдено, то возвращает `null`

2) Устанавливает значение св-ва. Если объекта по пути не было, то он будет создан.

### SG.utils.from
```
SG.utils.from( some )
```
 * __some__ - Mixed

Создает массив из одного элемента, если `some` не был Array, или пустой, если `some === null || some === undefined`. Иначе возвращает `some` нетронутым

### SG.utils.mkarr
```
SG.utils.mkarr( arrlike )
```
 * __arrlike__ - Array|ArrayLike

Создает Array из `arrlike`, если `arrlike` уже был Array, то вернеться его копия

### SG.utils.prm
```
SG.utils.prm( params )
```
 * __params__ - Object

Сериализует `params` в querystring

### SG.utils.aprm
```
SG.utils.aprm( url, params )
```
 * __url__ - String
 * __params__ - Object|String

Добавляет к `url` параметры `params`

### SG.utils.url
```
SG.utils.url( parts )
```
 * __parts__ - Object

Создает URL из `parts`.
```javascript
SG.utils.url({
    scheme: "http",
    authority: "site.com",
    path: "path",
    query: "foo=bar" // or {foo: "bar"}
    fragment: "fragment"
});
// http://site.com/path?foo=bar#fragment
```

### SG.utils.css
```
1) SG.utils.css( elem, cssProp )
2) SG.utils.css( elem, cssProp, cssValue ) 
```
 * __elem__ - DOMNode
 * __cssProp__ - String
 * __cssValue__ - String|Number

Получает или устанавливает css св-во `cssProp` элемента `elem`

1) получает значение css св-ва `cssProp`

2) устанавливает значение `cssProp: cssValue`


### SG.utils.addCls
```
SG.utils.addCls( elem, classname )
```
 * __elem__ - DOMNode
 * __classname__ - String

Добавляет элементу класс `classname`.

### SG.utils.rmCls
```
SG.utils.rmCls( elem[, classname] )
```
 * __elem__ - DOMNode
 * __classname__ - String

Удаляет у элемента класс `classname`, если `classname` не был передан, то будут удалены все классы.

### SG.utils.hasCls
```
SG.utils.hasCls( elem, classname )
```
 * __elem__ - DOMNode
 * __classname__ - String

Проверяет, есть ли класс `classname` у элемента `elem`. Возвращает `true`, если был найден.

### SG.utils.cres
```
SG.utils.cres( html )
```
 * __html__ - String html

Создает DOM-структуру по переданному html коду и возвращает созданные элементы в массиве.

### SG.utils.cre
```
1) SG.utils.cre( nodeName )
2) SG.utils.cre( html )
```
 * __nodeName__, __html__ - String

Создает DOM по переданному html-коду, или DOMNode по имени элемента

### SG.utils.rme
```
SG.utils.rme( elem )
```
 * __elem__ - DOMNode

Удаляет `elem` из DOM

### SG.utils.empty
```
SG.utils.empty( elem )
```
 * __elem__ - DOMNode

Очищает `elem`

### SG.utils.attr
```
1) SG.utils.attr( elem, attr )
2) SG.utils.attr( elem, attr, value )
```
 * __elem__ - DOMNode
 * __attr__ - String
 * __value__ - String|Number

Получает или устанавливает аттрибут у `elem`

### SG.utils.hasFocus
```
SG.utils.hasFocus( elem )
```
 * __elem__ - DOMNode 

Возвращает `true`, если на элемент установлен focus

### SG.utils.contains
```
SG.utils.contains( parent, child )
```
 * __parent__ - DOMNode
 * __child__ - DOMNode

Возвращает `true`, если `child` был найден в `parent` 

### SG.utils.parseXML
```
SG.utils.parseXML( xmlstring )
```
 * __xmlstring__ - String

### SG.utils.parseJSON
```
SG.utils.parseJSON( jsonstring )
```
 * __jsonstring__ - String

### SG.utils.tmpl
```
1) SG.utils.tmpl( template )
2) SG.utils.tmpl( template, data )
```
 * __template__ - String|CSSSelector|DOMNode
 * __data__ - Object

based on [John Resig - JavaScript Micro-Templating](http://ejohn.org/blog/javascript-micro-templating/)

### SG.utils.$
```
SG.utils.$( selector[, root])
```
 * __selector__ - DOMNode|String
 * __root__ - DOMNode|String

Ищет элемент по css-селектору `selector`, в `root`, если был передан, иначе в `document`

### SG.utils.$$
```
SG.utils.$$( selector[, root])
```
 * __selector__ - DOMNode|String
 * __root__ - DOMNode|String

Ищет элементы по css-селектору `selector`, в `root`, если был передан, иначе в `document`, и возвращает Array

SG.utils.$ и SG.utils.$$ использует модифицированную библиотеку поиска элементов по css-селектору [yass](http://yass.webo.in/)


### SG.utils.Event
alias SG.Event


## Static methods
### SG.setup
```javascript
SG.setup({
    ajax: {
        dataType: "json"
    }
}); 
```
устанавливает глобальные настройки саджестов

### SG.tmpl
alias `SG.utils.tmpl`

### SG.$
alias `SG.utils.$`

### SG.$$
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
```javascript
SG( options );
```
__or__ 
```javascript
new SG( options );
```

## Опции
### field
Selector|DOMNode инпут, к которому следует привязать саджесты
### cont
Selector|DOMNode главный блок, который будет прятаться/показываться default: `"#sg, .sg"`
### list
Selector|DOMNode блок, где будут рисоваться саджесты. Если не указан, то будет использоваться `cont`
### enabled
Boolean указывает, будет ли включен саджест при создании экземпляра. Если `false`, то для включения нужно будет вызвать метод `instance.enable()`. default: `true`
### correction
Boolean Если `true`, то будет включена автокоррекция блока `cont` относительно `field`, причем корректироваться будет только в случае, если у блока указан стиль `position: absolute|relative|fixed`. default: `true`
### shiftX
Integer величина в пикселях, на которую следует скорректировать по горизонтали `cont` относительно 'field'. default: `0`
### shiftY
Integer величина в пикселях, на которую следует скорректировать по вертикали `cont` относительно 'field'. default: `0`
### switcher
String класс, который будет добавляться/удаляться, когда `cont` будет показан/убран. Если не указан, то у `cont` будет стираться и добавляться стиль 'display: none'  
### delay
Integer интервал, через которые будет проверяться `field` на наличие изменений в значении default: `250`
### valMin
Integer минимальное кол-во символов для срабатывания саджестов default: `1`
### valMax
Integer максимальное кол-во символов для срабатывания саджестов default: `255`
### valFilter
RegExp|Function фильтр, при положительном срабатывании которого будет срабатывать саджест default: `/(?:\S)/`
### url
String|Object url, по которому будет запрашиваться саджест. default: `"http://suggests.go.mail.ru/sg_u?q={query}"`

обе записи идентичны:
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

### ajax
 * __dataType__ - String `text|html|xml|json|jsonp` тип получаемых данных. В зависимости от значенния может выбираться разный способ создания запроса. default: `"jsonp"`
 * __method__ - String `POST|GET` метод отправки запроса default: `"GET"`
 * __data__ - Object параметры добавляемые запрашиваемуму url
 * __contentType__ - String default: `"application/x-www-form-urlencoded; charset=utf-8"`
 * __xhrFields__ - Object поля добавляемые в xhr объект при создании запроса. по умолчанию `withCredentials: false`
 * __jsonp__ - String имя параметра в запросе для передачи имени колбэка при `jsonp` запросах. default: `"callback"`
 * __jsonpCallback__ - String|Function имя колбэка, если используется `jsonp`. default: `function() {return "{EXPANDO}_{REQUEST_ID}"}`
 * __scriptCharset__ - String кодировка в которую следует перевести ответ при `jsonp` запросах. default: `"utf-8"`
 * __timeout__ - Integer таймаут запроса, по истечении которого будет принудительно вызван `abort()`, default: `5000`
 * __stackSize__ - Integer максимальное одновременное кол-во запросов. default: `2`


### callbackParam
deprecated, use `ajax.jsonp`
### reqTimeout
deprecated, use `ajax.timeout`
### reqMax
deprecated, use `ajax.stackSize`
### reqDataType
deprecated, use `ajax.dataType`
### reqData
deprecated, use `ajax.data` 
### scriptCharset
deprecated, use `ajax.scriptCharset`
### dataFilter
Function фильтр данных пришедших по запросу 
### dataGet
Function функция извлекающая данные для элементов саджеста default: `function( data ){return data && data.items ? data.items : [];}`
### cch
Boolean Если `true`, то включает кэширование данных по конкретному запросу. default: `true`
### cchLimit
Integer кол-во хранимых запросов-данных. default: `128`
### max
Integer максимальное кол-во выводимых саджестов. default: `10`
### min
Integer минимальное кол-во выводимых саджестов. default: `0`
### autoSubmit
Boolean Если `true`, то будет выполняться `submit()` формы сразу после выбора конкретного саджеста. default: `true`
### hover
String класс добавляемый элементу саджеста при выборе. default: `"sg__item_hover"`  
### item
String|Function|DOMNode шаблон или фукнция для генерации html каждого конкретного саджеста. default: `<div class="sg__item"><%= itemData.textMarked %></div>'`
### result
Function функция, которая извлекает запрос из данных каждого конкретного саджеста. default: `function( itemData ) {return itemData.text;}`
### select
Function hook-функция, которая должна быть вызвана при выборе саджеста. С помощью этой опции можно предовратить выбор саджеста, достаточно вернуть `false` в функции. 
### keynavDelay
Integer задержка при выборе саджеста с клавиатуры. default: `150`
### preview
Boolean если `true`, то подставляет запрос выделенного саджеста в `field`. Работает только если выбирать саджест с клавиатуры. default: `true`

### on{SG.evt.*}
Помогает привязаться к событие сразу из конфига
```javascript
var instance = SG({
    field: "#foo",
    onEnable: function() { // same instance.on(SG.evt.enable, function() {}) 
    	// do something
    },
    onDisable: function() { // same instance.on(SG.evt.disable, function() {})
    	// do something
    }
});


