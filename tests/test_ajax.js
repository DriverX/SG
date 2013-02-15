(function() {


module("SG.Ajax");


asyncTest("1. basic", function() {
  var n = 0;

  n++;
  var ajax = SG.Ajax("data/test_ajax_simple.html", {
    success: function( event, response ) {
      equal( response, "<!-- passed -->\n" );
      start(); 
    }
  });
  ajax.send();
 
  n++;
  stop();
  SG.Ajax("data/test_ajax_simple.html", {
    method: "post",
    success: function( event, response ) {
      equal( response, "<!-- passed -->\n" );
      start(); 
    }
  }).send();
  
  n++;
  stop();
  SG.Ajax("data/test_ajax_json.json", {
    dataType: "json",
    success: function( event, response ) {
      deepEqual( response, {"foo": "bar"} );
      start(); 
    }
  }).send();
  
  n += 3;
  stop();
  SG.Ajax("data/test_ajax_xml.xml", {
    dataType: "xml",
    success: function( event, response ) {
      var root = response.getElementsByTagName( "root" );
      equal( root.length, 1 );
      root = root[ 0 ];
      
      var foo = root.getElementsByTagName( "foo" );
      equal( foo.length, 1 );
      foo = foo[ 0 ];
      equal( foo.textContent || foo.text, "bar" );
      start(); 
    }
  }).send();
  
  n += 1;
  stop();
  SG.Ajax("data/test_ajax_jsonp.json", {
    dataType: "jsonp",
    success: function( event, response ) {
      deepEqual( response, {"foo": "bar"} );
      start(); 
    },
    jsonpCallback: "jsonp_callback_1"
  }).send();
  
  n += 1;
  stop();
  SG.Ajax("data/test_ajax_jsonp2.json", {
    dataType: "jsonp",
    success: function( event, response ) {
      deepEqual( response, {"baz": "qux"} );
      start(); 
    },
    jsonpCallback: function() {
      return "jsonp_callback_2";              
    }
  }).send();
  
  expect( n );
});


})();

