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
    dummy_url = "data/test_ajax_httpcode.php?code={code}",
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
        ok(
          this.elapsedTime >= 490,
          "elapsedTime >= 490: " + this.elapsedTime
        );
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
        ok(
          this.elapsedTime >= 490,
          "elapsedTime >= 490: " + this.elapsedTime
        );
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
        ok(
          this.elapsedTime >= 990,
          "elapsedTime >= 990: " + this.elapsedTime
        );
        ok(
          this.elapsedTime < 1100,
          "elapsedTime < 1100: " + this.elapsedTime
        );
        equal(
          statusText,
          "timeout",
          "statusText == 'timeout': " + statusText
        );
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
        ok(
          this.elapsedTime >= 990,
          "jsonp: elapsedTime >= 990: " + this.elapsedTime
        );
        ok(
          this.elapsedTime < 1100,
          "jsonp: elapsedTime < 1100: " + this.elapsedTime
        );
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
      equal(
        this.url, "data/test_ajax_json.json",
        "url == 'data/test_ajax_json.json': " + this.url
      );
      equal(
        this.readyState,
        4,
        "readyState == 4: " + this.readyState 
      );
      equal(
        this.status,
        200,
        "status == 200: " + this.status
      );
      equal(
        this.statusText,
        "success",
        "statusText == 'success': " + this.statusText
      );
      ok(
        this.elapsedTime > 0,
        "elapsedTime > 0: " + this.elapsedTime
      );
      equal(
        this.endTime - this.startTime,
        this.elapsedTime,
        "calculate elapsedTime from endTime and startTime"
      );
      equal(
        SG.utils.trim( this.responseText ),
        '{"foo": "bar"}',
        "responseText == '{\"foo\": \"bar\"}'"
      );
      equal(
        this.responseXml,
        undefined,
        "responseXml is undefined"
      );

      start();
    }
  });
  ajax.send();

  n += 8;
  stop();
  ajax = SG.Ajax("data/test_ajax_jsonp.php", {
    dataType: "jsonp",
    success: function() {
      equal(
        this.url, "data/test_ajax_jsonp.php",
        "jsonp: url == 'data/test_ajax_jsonp.php': " + this.url
      );
      equal(
        this.readyState,
        4,
        "jsonp: readyState == 4: " + this.readyState
      );
      equal(
        this.status,
        200,
        "jsonp: status == 200: " + this.status
      );
      equal( this.statusText, "success" );
      ok(
        this.elapsedTime > 0,
        "jsonp: elapsedTime > 0: " + this.elapsedTime
      );
      equal(
        this.endTime - this.startTime,
        this.elapsedTime,
        "jsonp: calculate elapsedTime from endTime and startTime"
      );
      equal(
        this.responseText,
        undefined,
        "jsonp: responseText is undefined"
      );
      equal(
        this.responseXml,
        undefined,
        "responseXml is undefined"
      );

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
      equal(
        statusText,
        "canceled",
        "statusText == 'canceled': " + statusText
      );
      equal(
        this.readyState,
        0,
        "readyState == 0: " + this.readyState
      );
      equal(
        this.status,
        SG.Ajax.CANCELED,
        "status == " + SG.Ajax.CANCELED
      );
      equal(
        this.responseText,
        undefined,
        "responseText is undefined"
      );
      equal(
        this.responseXml,
        undefined,
        "responseXml is undefined"
      );
      ok(
        this.elapsedTime >= 490,
        "elapsedTime >= 490: " + this.elapsedTime
      );
      ok(
        this.elapsedTime < 1000,
        "elapsedTime < 1000: " + this.elapsedTime
      );

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
      equal(
        this.responseText,
        undefined,
        "responseText is undefined"
      );
      equal(
        this.responseXml,
        undefined,
        "responseXml is undefined"
      );
      ok(
        this.elapsedTime >= 490,
        "elapsedTime >= 490: " + this.elapsedTime
      );
      ok(
        this.elapsedTime < 1000,
        "elapsedTime < 1000: " + this.elapsedTime
      );

      start();
    }
  });
  ajax3.send();
  setTimeout(function() {
    ajax3.abort();
  }, 500);
  
  expect( n );
});


asyncTest("headers", function() {
  var
    n = 0,
    ajax;
  
  n += 4;
  ajax = SG.Ajax("data/test_ajax_headers.php", {
    success: function( event, response ) {
      var allHeaders = this.getAllResponseHeaders();
      ok( allHeaders != null, "headers string not null" );
      ok( allHeaders.indexOf("X-Test") >= 0, "X-Test in headers string" );

      equal(
        this.getResponseHeader("X-Test"),
        "OK",
        "getResponseHeader('X-Test')"
      );
      equal(
        this.getResponseHeader("CONTENT-TYPE"),
        this.getResponseHeader("Content-Type"),
        "getResponseHeader() case insensitivity"
      );

      start();
    }
  });
  ajax.send();

  n += 4;
  stop();
  ajax = SG.Ajax("data/test_ajax_headers.php", {
    dataType: "json",
    success: function( event, response ) {
      ok( "X-Requested-With" in response, "header X-Requested-With exists" );
      equal(
        response["X-Requested-With"],
        "XMLHttpRequest",
        "header X-Requested-With=XMLHttpRequest"
      );

      ok( "X-Foo" in response, "header X-Foo exists" );
      equal( response["X-Foo"], "bar", "header X-Foo=bar" );

      start();
    }
  });
  ajax.setRequestHeader("X-Foo", "bar");
  ajax.send();

  n += 4;
  stop();
  ajax = SG.Ajax("data/test_ajax_headers.php", {
    dataType: "jsonp",
    success: function( event, response ) {
      ok( !!response, "jsonp: response" );
      ok( !("X-Foo" in response), "jsonp: header X-Foo not exists" );
      equal(
        this.getAllResponseHeaders(),
        null,
        "jsonp: getAllResponseHeaders() is null"
      );
      equal(
        this.getResponseHeader("X-Test"),
        null,
        "jsonp: getResponseHeader('X-Test') is null"
      );

      start();
    }
  });
  ajax.setRequestHeader("X-Foo", "bar");
  ajax.send();

  expect( n );
});


asyncTest("extra url params", function() {
  var
    n = 0,
    ajax;

  n += 6;
  ajax = SG.Ajax("data/test_ajax_extraparams.php?foo=bar", {
    dataType: "json",
    data: {
      baz: "qux",
      fooo: function() {
        return 42;
      }
    },
    success: function( event, response ) {
      ok( "foo" in response.GET, "GET.foo exists" );
      equal( response.GET.foo, "bar", "GET.foo == 'bar'" );
      ok( "baz" in response.GET, "GET.baz exists" );
      equal( response.GET.baz, "qux", "GET.baz == 'qux'" );
      ok( "fooo" in response.GET, "GET.fooo exists" );
      equal( response.GET.fooo, "42", "GET.fooo == '42'" );

      start();
    }
  });
  ajax.send();

  n += 6;
  stop();
  ajax = SG.Ajax("data/test_ajax_extraparams.php?foo=bar", {
    dataType: "json",
    method: "post",
    data: {
      baz: "qux",
      fooo: function() {
        return 42;
      }
    },
    success: function( event, response ) {
      ok( "foo" in response.POST, "POST.foo exists" );
      equal( response.POST.foo, "bar", "POST.foo == 'bar'" );
      ok( "baz" in response.POST, "POST.baz exists" );
      equal( response.POST.baz, "qux", "POST.baz == 'qux'" );
      ok( "fooo" in response.POST, "POST.fooo exists" );
      equal( response.POST.fooo, "42", "POST.fooo == '42'" );

      start();
    }
  });
  ajax.send();

  n += 8;
  stop();
  ajax = SG.Ajax("data/test_ajax_extraparams.php?foo=bar", {
    dataType: "jsonp",
    data: {
      baz: "qux",
      fooo: function() {
        return 42;
      }
    },
    success: function( event, response ) {
      ok( "_" in response.GET, "jsonp: GET._ exists" );
      ok( "callback" in response.GET, "jsonp: GET.callback exists" );
      ok( "foo" in response.GET, "jsonp: GET.foo exists" );
      equal( response.GET.foo, "bar", "jsonp: GET.foo == 'bar'" );
      ok( "baz" in response.GET, "jsonp: GET.baz exists" );
      equal( response.GET.baz, "qux", "jsonp: GET.baz == 'qux'" );
      ok( "fooo" in response.GET, "jsonp: GET.fooo exists" );
      equal( response.GET.fooo, "42", "jsonp: GET.fooo == '42'" );

      start();
    }
  });
  ajax.send();

  expect( n );
});


})();

