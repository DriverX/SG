(function() {


module("SG.Ajax");

test("basic", function() {
  ok( new SG.Ajax("") instanceof SG.Ajax );
  ok( SG.Ajax("") instanceof SG.Ajax );
});

asyncTest("basic requests", function() {
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

  n += 1;
  stop();
  SG.Ajax("data/test_ajax_notfound.xml", {
    error: function() {
      ok(true);
      start();
    }
  }).send();
  
  expect( n );
});


asyncTest("statuses", function() {
  var n = 0,
    dummy_url = "data/test_ajax_status.php?code={code}",
    ajax;

  n += 4;
  ajax = SG.Ajax(
    SG.utils.format( dummy_url, {code: 200}),
    {
      success: function( event, response, statusText ) {
        equal( SG.utils.trim( response ), "code=200" );
        equal( statusText, "success" );
        equal( this.status, 200 );
        equal( this.statusText, "success" );
        start();
      }
    }
  );
  ajax.send();
  
  n += 3;
  stop();
  ajax = SG.Ajax(
    SG.utils.format( dummy_url, {code: 204}),
    {
      success: function( event, response, statusText ) {
        equal( response, undefined );
        equal( statusText, "No Content" );
        equal( this.status, 204 );
        start();
      }
    }
  );
  ajax.send();
  
  n += 2;
  stop();
  ajax = SG.Ajax(
    SG.utils.format( dummy_url, {code: 304}),
    {
      success: function( event, response, statusText ) {
        equal( response, undefined );
        equal( statusText, "notmodified" );
        start();
      }
    }
  );
  ajax.send();

  n += 1;
  stop();
  ajax = SG.Ajax(
    SG.utils.format( dummy_url, {code: 404}),
    {
      error: function( event, statusText ) {
        equal( statusText, "Not Found" );
        start();
      }
    }
  );
  ajax.send();

  n += 1;
  stop();
  ajax = SG.Ajax(
    SG.utils.format( dummy_url, {code: 404}),
    {
      error: function( event, statusText ) {
        equal( statusText, "Not Found" );
        start();
      }
    }
  );
  ajax.send();

  expect( n );
});


asyncTest("callbacks", function() {
  var
    n = 0,
    ajax,
    success_calls,
    error_calls,
    complete_calls;

  function resetCalls() {
    success_calls = 0;
    error_calls = 0;
    complete_calls = 0;
  }

  resetCalls();
  n += 6;
  ajax = SG.Ajax("data/test_ajax_simple.html", {
    success: function() {
      success_calls++;
      equal( success_calls, 1 );
      equal( error_calls, 0 );
      equal( complete_calls, 0 );
    },
    error: function() {
      error_calls++;
      ok(false);
    },
    complete: function() {
      complete_calls++;
      equal( success_calls, 1 );
      equal( error_calls, 0 );
      equal( complete_calls, 1 );

      resetCalls();
      start();
    }
  });
  ajax.send();

  n += 6;
  stop();
  ajax = SG.Ajax("data/test_ajax_notfound.html", {
    success: function() {
      success_calls++;
      ok(false);
    },
    error: function() {
      error_calls++;
      equal( success_calls, 0 );
      equal( error_calls, 1 );
      equal( complete_calls, 0 );
    },
    complete: function() {
      complete_calls++;
      equal( success_calls, 0 );
      equal( error_calls, 1 );
      equal( complete_calls, 1 );

      resetCalls();
      start();
    }
  });
  ajax.send();

  n += 6;
  stop();
  ajax = SG.Ajax("data/test_ajax_simple.html");
  ajax.on("success", function() {
    success_calls++;
    equal( success_calls, 1 );
    equal( error_calls, 0 );
    equal( complete_calls, 0 );
  });
  ajax.on("error", function() {
    error_calls++;
    ok(false);
  });
  ajax.on("complete", function() {
    complete_calls++;
    equal( success_calls, 1 );
    equal( error_calls, 0 );
    equal( complete_calls, 1 );

    resetCalls();
    start();
  });
  ajax.send();

  expect( n );
});


asyncTest("times", function() {
  var
    n = 0,
    ajax,
    dummy_url = "data/test_ajax_times.php?sleep={sleep}";
  
  n += 2;
  ajax = SG.Ajax(
    SG.utils.format( dummy_url, {sleep: 500}),
    {
      dataType: "json",
      success: function( event, response ) {
        ok( this.elapsedTime > 500 );
        deepEqual( response, {sleep: 500} );
        start();
      }
    }
  );
  ajax.send();
  
  n += 2;
  stop();
  ajax = SG.Ajax(
    SG.utils.format( dummy_url, {sleep: 500}),
    {
      dataType: "jsonp",
      success: function( event, response ) {
        ok( this.elapsedTime > 500 );
        deepEqual( response, {sleep: 500} );
        start();
      }
    }
  );
  ajax.send();

  n += 3;
  stop();
  ajax = SG.Ajax(
    SG.utils.format( dummy_url, {sleep: 1100}),
    {
      timeout: 1000,
      error: function( event, statusText ) {
        ok( this.elapsedTime > 1000 );
        ok( this.elapsedTime < 1100 );
        equal( statusText, "timeout" );
        start();
      }
    }
  );
  ajax.send();
  
  n += 3;
  stop();
  ajax = SG.Ajax(
    SG.utils.format( dummy_url, {sleep: 1100}),
    {
      dataType: "jsonp",
      timeout: 1000,
      error: function( event, statusText ) {
        ok( this.elapsedTime > 1000 );
        ok( this.elapsedTime < 1100 );
        equal( statusText, "timeout" );
        start();
      }
    }
  );
  ajax.send();

  expect( n );
});




















})();

