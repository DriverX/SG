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
  var DOMMethod = $("#qunit-fixture").get(0).appendChild;

  ok( SG.utils.isFn( fn1 ) );
  ok( SG.utils.isFn( fn2 ) );
  ok( SG.utils.isFn( fn3 ) );
  ok( SG.utils.isFn( DOMMethod ) );
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
  ok(true);
});













