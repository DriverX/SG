module("SG.utils");


test("hasOwn", function() {
  var obj1 = {"foo": "bar"};
  ok(SG.utils.hasOwn(obj1, "foo"));
  ok(!!obj1.hasOwnProperty);
  ok(!SG.utils.hasOwn(obj1, "hasOwnProperty"));
  
  obj1.hasOwnProperty = Object.prototype.hasOwnProperty;
  ok(SG.utils.hasOwn(obj1, "hasOwnProperty"));  
});


test("isArr", function() {
  var arr1 = ["foo"];
  var arr2 = Array();
  var likearr = {0: "bar", length: 1};

  ok(SG.utils.isArr(arr1));
  ok(SG.utils.isArr(arr2));
  ok(!SG.utils.isArr(likearr));
});


test("isFn", function() {
  var fn1 = function() {};
  var fn2 = Object.prototype.hasOwnProperty;
  var fn3 = new Function("return true;");

  ok( SG.utils.isFn( fn1 ) );
  ok( SG.utils.isFn( fn2 ) );
  ok( SG.utils.isFn( fn3 ) );
});


if( typeof window !== "undefined" ) {
  test("isWin", function() {
    var obj = {setTimeout: function() {}};
    
    ok( !SG.utils.isWin( obj ) );
    ok( SG.utils.isWin( window ) );
  });
}


test("isObj", function() {
  var plainObj = {};
  var DOMObj = $("#qunit-fixture").get(0);
  var fn = function() {};
  var arr = [];
  var obj = Object;
  var fakeDOM = {nodeType: 3};

  ok( SG.utils.isObj( plainObj ) );
  ok( !SG.utils.isObj( DOMObj ) );
  ok( !SG.utils.isObj( fn ) );
  ok( !SG.utils.isObj( arr ) );
  ok( !SG.utils.isObj( obj ) );
  ok( !SG.utils.isObj( fakeDOM ) );
  
  if( typeof window !== "undefined" ) {
    ok( !SG.utils.isObj( window ) );
  }

  if( Object.create ) {
    ok(SG.utils.isObj( Object.create( null ) ) );
    ok(SG.utils.isObj( Object.create( Object.prototype ) ) );
  }
});


test("bind", function() {
  var fn1 = function() {return this.foo;};
  var fn2 = function() {return this.foo + arguments[1] + arguments[2];};
  var fn3 = function() {return true;};

  equal( SG.utils.bind(fn1, {"foo": "bar"})(), "bar" );
  equal( SG.utils.bind(fn2, {"foo": "bar"}, "baz", "qux")(42), "barqux42" );
  ok( SG.utils.bind(fn3, $("#qunit-fixture").get(0)) );
  
});


test("ext", function() {
  var src = SG.utils.ext(
      {"foo": "bar"},
      {"baz": "qux"}
    );

  deepEqual(
    src,
    {"foo": "bar", "baz": "qux"}
  );

  deepEqual(
    SG.utils.ext( src, {"baz": 42, "qux": "new"}),
    {"foo": "bar", "baz": 42, "qux": "new"}
  );
  
  deepEqual(
    src,
    {"foo": "bar", "baz": 42, "qux": "new"}
  );
  
  src.qux = ["one",,"three"];
  SG.utils.ext( true, src, {"qux": [,"two",,{}]} );

  deepEqual(
    src,
    {"foo": "bar", "baz": 42, "qux": ["one", "two", "three", {}]}
  );

  deepEqual(
    SG.utils.ext( true, src, {"qux": [,,,{"inner": 1}]}).qux,
    ["one", "two", "three", {"inner": 1}]
  );

  var fn = function() {};
  deepEqual(
    SG.utils.ext( true, src, {"qux": fn}).qux,
    fn
  );

  deepEqual( SG.utils.ext(true, null, {"foo": "qux"}), {"foo": "qux"} );
});


test("copy", function() {
  var arr = ["foo", "bar", {"baz": "qux"}];
  var obj = {"foo": "bar", "baz": ["qux"]};

  var copyArr = SG.utils.copy( arr );
  deepEqual( copyArr, arr );
  
  arr[0] = "fooo";
  arr[2].baz = "quxx";
  notEqual( copyArr[0], arr[0] );
  notEqual( copyArr[2].baz, arr[2].baz );

  var copyObj = SG.utils.copy( obj );
  deepEqual( copyObj, obj );

  obj.foo = "barr";
  obj.baz[0] = "quxx";
  notEqual( copyObj.foo, obj.foo );
  notEqual( copyObj.baz[0], obj.baz[0] );

  deepEqual( SG.utils.copy( null ), {} );
});


test("trim", function() {
  equal( SG.utils.trim( " foo bar " ), "foo bar" );
  equal( SG.utils.trim( "   foo bar  \n\t\r\n" ), "foo bar" );
  equal( SG.utils.trim( null ), "null" );
  equal( SG.utils.trim( undefined ), "undefined" );
  equal( SG.utils.trim( 123 ), "123" );
});


test("arrEach", function() {
  var arr1 = ["foo", "bar", , "baz"];
  
  SG.utils.arrEach( arr1, function( value, index ) {
    switch( index ) {
      case 0:
        equal( value, "foo" );
        break;
      case 1:
        equal( value, "bar" );
        break;
      case 3:
        equal( value, "baz" );
        break;
      default:
        throw "index out";
        break;
    }
  });
});


test("objEach", function() {
  var obj1 = {"foo": "bar", "baz": "qux", "ror": 42};
  
  SG.utils.objEach( obj1, function( value, index ) {
    switch( index ) {
      case "foo":
        equal( value, "bar" );
        break;
      case "baz":
        equal( value, "qux" );
        break;
      case "ror":
        equal( value, 42 );
        break;
      default:
        throw "index out";
        break;
    }
  });
});


test("each", function() {
  ok(true);
});


test("map", function() {
  var arr1 = ["foo", "bar", , "baz"];

  deepEqual(
    SG.utils.map( arr1, function( value, index ) {
      return "_" + value + index;
    }),
    ["_foo0", "_bar1", , "_baz3"]
  );
});


test("indexOf", function() {
  var arr1 = ["foo", "bar", , "baz", "foo", "qux"];

  equal( SG.utils.indexOf( arr1, "foo" ), 0 );
  equal( SG.utils.indexOf( arr1, "foo", 4 ), 4 );
  equal( SG.utils.indexOf( arr1, "qux" ), 5 );
  equal( SG.utils.indexOf( arr1, "foooooo" ), -1 );
});


test("format", function() {
  equal( SG.utils.format("Hello, {name}!", {name: "DriverX"}), "Hello, DriverX!" );
  equal(
    SG.utils.format("Good {daytime}, {name}!", {name: "DriverX"}),
    "Good , DriverX!"
  );
  equal( SG.utils.format(), null );
  equal( SG.utils.format("Hello, {name}!"), "Hello, {name}!" );
});


test("objFormat", function() {
  
  deepEqual(
    SG.utils.objFormat({
      "title": "Hello, {username}!",
      "desc": "{daytime} we all dead!",
      "msg": {
        "darth vader": "{vader}",
        "luke skywalker": "{luke}"
      }
    }, {
      "username": "DriverX",
      "daytime": "Tonight",
      "vader": "No, I am your father",
      "luke": "Nooooooooooo!!!"
    }),
    {
      "title": "Hello, DriverX!",
      "desc": "Tonight we all dead!",
      "msg": {
        "darth vader": "No, I am your father",
        "luke skywalker": "Nooooooooooo!!!"
      }
    }
  );

});


test("walker", function() {
  var obj1 = {
      "foo": {
        "bar": {
          "baz": "hello"
        }
      },
      "qux": true
    };

  // get
  equal( SG.utils.walker( obj1, "foo.bar.baz" ), "hello" );
  equal( SG.utils.walker( obj1, "qux" ), true );
  equal( SG.utils.walker( obj1, "foo.not_exists" ), null );

  // set
  equal( SG.utils.walker( obj1, "foo.bar.baz", "goodbay" ), "hello" );
  equal( obj1.foo.bar.baz, "goodbay" );

  equal( SG.utils.walker( obj1, "foo.new_prop", false ), undefined );
  equal( obj1.foo.new_prop, false );

  equal( SG.utils.walker( obj1, "foo.bar.baz.replace.bla", "alb" ), undefined );
  equal( obj1.foo.bar.baz.replace.bla, "alb" );
});


test("resc", function() {
  equal(
    SG.utils.resc("\\[]{}()^$?+*.-"),
    "\\\\\\[\\]\\{\\}\\(\\)\\^\\$\\?\\+\\*\\.\\-"
  );
});


test("from", function() {
  deepEqual( SG.utils.from(true), [true] );
  
  var arr1 = [1,2]
  equal( SG.utils.from( arr1 ), arr1 );
  
  deepEqual( SG.utils.from({foo: "bar"}), [{foo: "bar"}] );
  deepEqual( SG.utils.from({length: 5}), [{length: 5}] );
  deepEqual( SG.utils.from(), [] );
  deepEqual( SG.utils.from(null), [] );

  var fn = function() {};
  deepEqual( SG.utils.from( fn ), [ fn ] );
});


test("mkarr", function() {
  var arr = [1,2,,3];
  var arrlike = {
      0: 1,
      1: 2,
      3: 3,
      length: 4
    };
  
  deepEqual( SG.utils.mkarr( arr ), [1,2,,3] );
  deepEqual( SG.utils.mkarr( arrlike ), [1,2,,3] );
  deepEqual( SG.utils.mkarr( "abcd" ), ["a","b","c","d"] );
  deepEqual( SG.utils.mkarr( 123 ), [] );
  deepEqual( SG.utils.mkarr(), [] );

  var $nodes = $("<span>1</span><span>2</span><span>3</span>"),
    nodes = $("#qunit-fixture").append( $nodes ).get(0).getElementsByTagName("span");
  
  equal( SG.utils.mkarr( nodes ).length, 3 );
  
  $nodes = nodes = null;
});


test("prm", function() {

  equal(
    SG.utils.prm({"foo": "bar", "baz": "qux"}),
    "foo=bar&baz=qux"
  );
  equal(
    SG.utils.prm({"foo": true, "bar": null, "baz": undefined}),
    "foo=true&bar=null&baz=undefined"
  );
  equal(
    SG.utils.prm(),
    ""
  );
  equal(
    SG.utils.prm({"foo": "bar", "baz": function() {return "qux";}}),
    "foo=bar&baz=qux"
  );
  equal(
    SG.utils.prm({"пиво": "пенное"}),
    "%D0%BF%D0%B8%D0%B2%D0%BE=%D0%BF%D0%B5%D0%BD%D0%BD%D0%BE%D0%B5"
  );
});


test("aprm", function() {
  equal( SG.utils.aprm("/", "foo=bar"), "/?foo=bar" );
  equal( SG.utils.aprm("/?foo=bar", "baz=qux"), "/?foo=bar&baz=qux" );
  equal( SG.utils.aprm("/?", "foo=bar"), "/?foo=bar" );
  equal( SG.utils.aprm("/?baz", "foo=bar"), "/?baz&foo=bar" );
  equal( SG.utils.aprm("/", {"foo": "bar"}), "/?foo=bar" );
  equal( SG.utils.aprm("", "foo=bar"), "?foo=bar" );
  equal( SG.utils.aprm(null, "foo=bar"), "null?foo=bar" );
  equal( SG.utils.aprm(undefined, "foo=bar"), "undefined?foo=bar" );
  equal( SG.utils.aprm("/"), "/" );
});


test("url", function() {
  var obj = {
      scheme: "http",
      authority: "test.com",
      path: "test",
      query: {
        foo: "bar",
        baz: "qux"
      },
      fragment: {
        key: "value"
      }
    },
    cobj = SG.utils.copy( obj );
  
  equal(
    SG.utils.url( obj ),
    "http://test.com/test?foo=bar&baz=qux#key=value"
  );

  delete obj.scheme;
  equal(
    SG.utils.url( obj ),
    "//test.com/test?foo=bar&baz=qux#key=value"
  );
  
  delete obj.authority;
  equal(
    SG.utils.url( obj ),
    "/test?foo=bar&baz=qux#key=value"
  );

  delete obj.path;
  equal(
    SG.utils.url( obj ),
    "?foo=bar&baz=qux#key=value"
  );

  delete obj.query;
  equal(
    SG.utils.url( obj ),
    "#key=value"
  );
  
  delete obj.fragment;
  equal(
    SG.utils.url( obj ),
    ""
  );
  
  obj.scheme = cobj.scheme;
  equal(
    SG.utils.url( obj ),
    ""
  );
  
  obj.authority = cobj.authority;
  equal(
    SG.utils.url( obj ),
    "http://test.com"
  );

  obj.query = "foo=bar";
  equal(
    SG.utils.url( obj ),
    "http://test.com/?foo=bar"
  );

  delete obj.query;
  obj.fragment = "some_fragment";
  equal(
    SG.utils.url( obj ),
    "http://test.com/#some_fragment"
  );
});


test("css", function() {
  var node = $("<div class=\"test1\">test test</div>").appendTo("#qunit-fixture").get(0);
 
  // get
  equal( SG.utils.css( node, "display" ), "none" );
  equal( SG.utils.css( node, "font-size" ), "14px" );
  
  // set
  SG.utils.css( node, "display", "inline" );
  equal( SG.utils.css( node, "display" ), "inline" );
  
  SG.utils.css( node, "font-size", "200px" );
  equal( SG.utils.css( node, "font-size" ), "200px" );
  
  SG.utils.css( node, "display", "block" );
  SG.utils.css( node, "width", "700px" );
  equal( SG.utils.css( node, "display" ), "block" );
  equal( SG.utils.css( node, "width" ), "700px" );

  node = null;
});


test("addCls/rmCls/hasCls", function() {
  var node = $("<div/>").appendTo("#qunit-fixture").get(0);

  var add = SG.utils.addCls,
    rm = SG.utils.rmCls,
    has = SG.utils.hasCls;

  ok( !has( node, "foobar" ) );

  add( node, "foobar" );
  
  ok( /(^|\s+)foobar(\s+|$)/.test( node.className ) );
  ok( has( node, "foobar" ) );

  rm( node, "foobar" );
  
  ok( !/(^|\s+)foobar(\s+|$)/.test( node.className ) );
  ok( !has( node, "foobar" ) );

  add( node, "foobarbaz" );

  ok( !/(^|\s+)foobar(\s+|$)/.test( node.className ) );
  ok( !has( node, "foobar" ) );
  ok( has( node, "foobarbaz" ) );
  
  rm( node, "foo" );
  
  ok( has( node, "foobarbaz" ) );

  add( node, "baz" );
  
  ok( has( node, "baz" ) );

  rm( node );
  
  ok( !has( node, "baz" ) );
  ok( !has( node, "foobarbaz" ) );
  ok( !node.className );

  node = null;
});


test("cres", function() {
  var nodes = SG.utils.cres("<span>1<b>2</b></span><span>3</span><div>4</div><br>");
  equal( nodes.length, 4 );
});


test("cre", function() {
  var node = SG.utils.cre(" input ");

  equal( node.nodeName.toLowerCase(), "input" );

  node = SG.utils.cre("<div></div>");
  equal( node.nodeName.toLowerCase(), "div" );
});


test("rme", function() {
  var cont = $("#qunit-fixture").get(0);
  var node1 = document.createElement("div"),
    node2 = document.createElement("span"),
    node3 = document.createElement("a");
  cont.appendChild( node1 );
  cont.appendChild( node2 );
  cont.appendChild( node3 );

  equal( cont.getElementsByTagName("div").length, 1 );
  SG.utils.rme( node1 );
  equal( cont.getElementsByTagName("div").length, 0 );

  equal( cont.getElementsByTagName("span").length, 1 );
  SG.utils.rme( node2 );
  equal( cont.getElementsByTagName("span").length, 0 );

  equal( cont.getElementsByTagName("a").length, 1 );
  SG.utils.rme( node3 );
  equal( cont.getElementsByTagName("a").length, 0 );
});


test("empty", function() {
  var $cont = $("#qunit-fixture");
  
  $cont.append("<a>1</a><span>2<b>3</b></span><i>4</i><div>5</div> some text<hr>");
  equal( $cont.get(0).childNodes.length, 6 );

  SG.utils.empty( $cont.get(0) );
  equal( $cont.get(0).childNodes.length, 0 );
});


test("attr", function() {
  ok(false);
});


test("hasFocus", function() {
  ok(false);
});


test("contains", function() {
  ok(false);
});


// TODO
test("parseXML", function() {
  ok(true);
});


// TODO
test("parseJSON", function() {
  ok(true);
});



























