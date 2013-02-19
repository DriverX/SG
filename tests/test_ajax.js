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
        ok( this.elapsedTime >= 500 );
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
        ok( this.elapsedTime >= 500 );
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
        ok( this.elapsedTime >= 1000 );
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
        ok( this.elapsedTime >= 1000 );
        ok( this.elapsedTime < 1100 );
        equal( statusText, "timeout" );
        start();
      }
    }
  );
  ajax.send();

  expect( n );
});


asyncTest("instance properties", function() {
  var
    n = 0,
    ajax,
    exists = ("url options readyState status statusText responseText " +
      "responseXML startTime endTime elapsedTime send abort " +
      "setRequestHeader getAllResponseHeaders getResponseHeader").split(" ");

  n += exists.length;
  ajax = SG.Ajax("data/test_ajax_json.json");
  SG.utils.arrEach( exists, function( prop ) {
    ok( prop in ajax, "property '"+ prop +"' in ajax" );
  });

  n += 2;
  equal( ajax.readyState, 0, "readyState before send()" );
  ajax.send();
  equal( ajax.readyState, 1, "readyState after send()" );

  n += 8;
  ajax = SG.Ajax("data/test_ajax_json.json", {
    success: function() {
      equal( this.url, "data/test_ajax_json.json" );
      equal( this.readyState, 4 );
      equal( this.status, 200 );
      equal( this.statusText, "success" );
      ok( this.elapsedTime > 0 );
      equal( this.endTime - this.startTime, this.elapsedTime );
      equal( SG.utils.trim( this.responseText ), '{"foo": "bar"}' );
      equal( this.responseXml, undefined );

      start();
    }
  });
  ajax.send();

  n += 8;
  stop();
  ajax = SG.Ajax("data/test_ajax_jsonp.php", {
    dataType: "jsonp",
    success: function() {
      equal( this.url, "data/test_ajax_jsonp.php" );
      equal( this.readyState, 4 );
      equal( this.status, 200 );
      equal( this.statusText, "success" );
      ok( this.elapsedTime > 0 );
      equal( this.endTime - this.startTime, this.elapsedTime );
      equal( this.responseText, undefined );
      equal( this.responseXml, undefined );

      start();
    }
  });
  ajax.send();

  n += 3;
  stop();
  ajax = SG.Ajax("data/test_ajax_notfound.html", {
    error: function() {
      equal( this.readyState, 4 );
      equal( this.status, 404 );
      equal( this.statusText, "Not Found" );

      start();
    }
  });
  ajax.send();

  n += 3;
  stop();
  ajax = SG.Ajax("data/test_ajax_notfound.html", {
    error: function() {
      equal( this.readyState, 4 );
      equal( this.status, 404 );
      equal( this.statusText, "Not Found" );

      start();
    }
  });
  ajax.send();

  expect( n );
});


asyncTest("abortation", function() {
  var
    n = 0,
    ajax;

  n += 5;
  ajax = SG.Ajax("data/test_ajax_json.json", {
    error: function( event, statusText ) {
      equal( statusText, "canceled" );
      equal( this.readyState, 0 );
      equal( this.status, SG.Ajax.CANCELED );
      equal( this.responseText, undefined );
      equal( this.responseXml, undefined );

      start();
    }
  });
  ajax.send();
  ajax.abort();
  
  n += 5;
  stop();
  ajax = SG.Ajax("data/test_ajax_jsonp.php", {
    dataType: "jsonp",
    error: function( event, statusText ) {
      equal( statusText, "canceled" );
      equal( this.readyState, 0 );
      equal( this.status, SG.Ajax.CANCELED );
      equal( this.responseText, undefined );
      equal( this.responseXml, undefined );

      start();
    }
  });
  ajax.send();
  ajax.abort();
  
  n += 7;
  stop();
  var ajax2 = SG.Ajax("data/test_ajax_times.php?sleep=1000", {
    error: function( event, statusText ) {
      equal( statusText, "canceled" );
      equal( this.readyState, 0 );
      equal( this.status, SG.Ajax.CANCELED );
      equal( this.responseText, undefined );
      equal( this.responseXml, undefined );
      ok( this.elapsedTime >= 500 );
      ok( this.elapsedTime < 1000 );

      start();
    }
  });
  ajax2.send();
  setTimeout(function() {
    ajax2.abort();
  }, 500);

  n += 7;
  stop();
  var ajax3 = SG.Ajax("data/test_ajax_times.php?sleep=1000", {
    dataType: "jsonp",
    error: function( event, statusText ) {
      equal( statusText, "canceled" );
      equal( this.readyState, 0 );
      equal( this.status, SG.Ajax.CANCELED );
      equal( this.responseText, undefined );
      equal( this.responseXml, undefined );
      ok( this.elapsedTime >= 500 );
      ok( this.elapsedTime < 1000 );

      start();
    }
  });
  ajax3.send();
  setTimeout(function() {
    ajax3.abort();
  }, 500);
  
  expect( n );
});



















})();

