(function() {

var
  $cont;

module("SG", {
  setup: function() {
    $cont = $("#qunit-fixture");
  },
  teardown: function() {
    $cont.empty();
    $cont = null;
  }
});


test("instance", function() {
  var
    n = 0,
    sg;
  
  n += 1;
  var
    node1 = $("<input>").get(0),
    cont1 = $("<div>").get(0);
  sg = SG({
    field: node1,
    cont: cont1
  });
  ok( sg instanceof SG, "sg = SG()" );
  sg.destroy();
 
  n += 1;
  sg = new SG({
    field: node1,
    cont: cont1
  });
  ok( sg instanceof SG, "sg = new SG()" );
  sg.destroy();

  expect( n );
});


test("initialize elements", function() {
  var
    n = 0,
    sg;

  n += 4;
  var
    field1 = $("<input class='test_field'>").appendTo( $cont ).get(0),
    cont1 = $("<div class='test_cont'>").appendTo( $cont ).get(0),
    list1 = $("<ul class='test_list'>").appendTo( cont1 ).get(0);

  sg = SG({
    field: field1,
    cont: cont1
  });
  equal( sg.field, field1, "sg.field" );
  equal( sg.cont, cont1, "sg.cont" );
  equal( sg.list, cont1, "sg.list == sg.cont" );
  equal( sg.form, undefined, "sg.form is undefined" );
  sg.destroy();

  n += 2;
  sg = SG({
    field: field1,
    cont: cont1,
    list: list1
  });
  equal( sg.cont, cont1, "sg.cont" );
  equal( sg.list, list1, "sg.list" );
  sg.destroy();

  n += 3;
  $( list1 ).appendTo( cont1 );
  sg = SG({
    field: ".test_field",
    cont: ".test_cont",
    list: ".test_list"
  });
  equal( sg.field, field1, "selector sg.field" );
  equal( sg.cont, cont1, "selector sg.cont" );
  equal( sg.list, list1, "selector sg.list" );
  sg.destroy();

  n += 3;
  throws(function() {
    SG();
  }, /options\.field/, "options.field not found");
  throws(function() {
    SG({
      field: field1
    });
  }, /options\.cont/, "options.cont not found");
  throws(function() {
    SG({
      field: field1,
      cont: cont1,
      list: ".foobarbaz"
    });
  }, /options\.list/, "options.list not found");

  n += 1;
  var form1 = $("<form action=''>").appendTo( $cont ).get(0);
  $( field1 ).appendTo( form1 );
  sg = SG({
    field: field1,
    cont: cont1,
    list: list1
  });
  equal( sg.form, form1, "sg.form" );
  sg.destroy();

  // чистим
  $cont.empty();

  expect( n );
});


asyncTest("on/off native autocomplete", function() {
  var
    n = 0,
    attrs = ["autocomplete", "autocapitalize", "autocorrect"];

  start();

  $('<form action=""><input class="sgfield" name="q"></form><div class="sgcont"></div>').appendTo( $cont );

  var
    field = SG.$(".sgfield"),
    cont = SG.$(".sgcont");

  field.focus();

  n += 9;
  var sg = SG({
      enabled: false,
      field: field,
      cont: cont
    });
  
  equal(
    SG.utils.attr( field, "autocomplete" ),
    undefined,
    'field.attr("autocomplete") is undefined'
  );

  sg.enable();
  SG.utils.arrEach(
    attrs,
    function( attr ) {
      equal(
        SG.utils.attr( field, attr ),
        "off",
        'field.attr("' + attr + '") is off'
      );
    }
  );
  
  stop();
  setTimeout(function() {
    ok( SG.utils.hasFocus( field ), "field has focus after enabling" );

    start();

    sg.disable();
    SG.utils.arrEach(
      attrs,
      function( attr ) {
        equal(
          SG.utils.attr( field, attr ),
          "on",
          'field.attr("' + attr + '") is on'
        );
      }
    );

    stop();
    setTimeout(function() {
      ok( SG.utils.hasFocus( field ), "field has focus after disabling" );

      start();
      
      sg.destroy();
      $cont.empty();
    }, 50);
  }, 50);
  

  expect( n );
});


asyncTest("value checker", function() {
  $('<form action=""><input class="sgfield" name="q"></form><div class="sgcont"></div>').appendTo( $cont );

  var
    n = 0,
    sg,
    field = SG.$(".sgfield"),
    cont = SG.$(".sgcont");

  field.value = "foo";

  sg = SG({
    field: field,
    cont: cont,
    delay: 50,
    url: "data/test_sg_data.php?query={query}",
    ajax: {
      dataType: "json",
      timeout: null
    }
  });
  
  n += 3;
  var checker = sg._checker;
  equal( checker.curr, "foo", "init: checker.curr=='foo'" );
  equal( checker.prev, "foo", "init: checker.prev=='foo'" );
  equal( checker.rcnt, null, "init: checker.rcnt==null" );
  start();

  n += 17;
  stop();
  sg.on( SG.evt.valueChange, function( event, curr, prev, recent ) {
    equal( curr, "bar", "event.curr=='bar'" );
    equal( prev, "foo", "event.prev=='foo'" );
    equal( recent, "foo", "event.rcnt=='foo'" );
  });
  field.value = "bar";
  setTimeout(function() {
    equal( checker.curr, "bar", "new value: checker.prev=='bar'" );
    equal( checker.prev, "bar", "new value: checker.prev=='bar'" );
    equal( checker.rcnt, "foo", "new value: checker.rcnt=='foo'" );
    sg.off( SG.evt.valueChange );
    start();
    
    checker.off();
    stop();
    field.value = "baz";
    setTimeout(function() {
      equal( checker.curr, "bar", "new value (off): checker.prev=='bar'" );
      equal( checker.prev, "bar", "new value (off): checker.prev=='bar'" );
      equal( checker.rcnt, "foo", "new value (off): checker.rcnt=='foo'" );

      start();
      checker.on();
      equal( checker.curr, "baz", "new value (on): checker.prev=='baz'" );
      equal( checker.prev, "baz", "new value (on): checker.prev=='baz'" );
      equal( checker.rcnt, "bar", "new value (on): checker.rcnt=='bar'" );
      
      sg.on(
        SG.evt.valueChange,
        function( event, curr, prev, recent ) {
          equal( curr, prev, "fire with no check: curr == prev" );
          equal( recent, "bar", "fire with no check: rcnt not changed" );
        }
      );
      checker.fire( true );
      sg.off( SG.evt.valueChange );

      sg.on( SG.evt.valueChange, function( event, curr, prev, recent ) {
        ok(false, "fire: it's never called");
      });
      checker.fire();
      sg.off( SG.evt.valueChange );
      
      sg.on( SG.evt.valueChange, function( event, curr, prev, recent ) {
        ok(false, "ignore: it's never called");
      });
      checker.setIgnore("qux");
      stop();
      setTimeout(function() {
        equal( checker.curr, "qux", "ignore: checker.curr == 'qux'");
        equal( checker.prev, "qux", "ignore: checker.prev == 'qux'");
        equal( checker.rcnt, "bar", "ignore: checker.rcnt == 'bar'");
        start();

        sg.off( SG.evt.valueChange );

        sg.destroy();
        $cont.empty();
      }, 50);
    }, 50);
  }, 50);

  expect( n );
});


asyncTest("ajax manager", function() {
  $('<form action=""><input class="sgfield" name="q"></form><div class="sgcont"></div>').appendTo( $cont );

  var
    n = 0,
    sg,
    field = SG.$(".sgfield"),
    cont = SG.$(".sgcont"),
    sleep_calls = 1;

  sg = SG({
    field: field,
    cont: cont,
    delay: 50,
    url: "data/test_sg_data.php?query={query}",
    ajax: {
      dataType: "json",
      timeout: 1000,
      data: {
        sleep: function() {
          return sleep_calls++ % 3 ? 500 : 1500;
        }
      },
      stackSize: 2
    }
  });


  n += 3;
  sg.on( SG.evt.successRequest, function( event, response, value ) {
    if( value === "foo" || value === "baz" ) {
      ok(false, "success: it's never called");
    } else {
      equal( value, "bar", "success request with value 'bar'");
    }
  });
  sg.on( SG.evt.errorRequest, function( event, reason, value ) {
    if( value === "foo" ) {
      equal( reason, "canceled", "value 'foo': abort reason - canceled" );
      start();
    } else if( value === "baz" ) {
      equal( reason, "timeout", "value 'baz': abort reason - timeout" );
      start();

      sg.destroy();
      $cont.empty();
    } else {
      ok(false, "error: it's never called");
    }
  });

  field.focus();
  field.value = "foo";
  stop();
  setTimeout(function() {
    field.value = "bar";
    setTimeout(function() {
      field.value = "baz";
    }, 100);
  }, 100);
  
  expect( n );
});


asyncTest("cache", function() {
  $('<form action=""><input class="sgfield" name="q"></form><div class="sgcont"></div>').appendTo( $cont );

  var
    n = 0,
    sg,
    field = SG.$(".sgfield"),
    cont = SG.$(".sgcont"),
    ajax_returns = 0,
    cache_returns = 0,
    cache_sets = 0;

  sg = SG({
    field: field,
    cont: cont,
    delay: 50,
    url: "data/test_sg_data.php?query={query}",
    ajax: {
      dataType: "json"
    },
    cchLimit: 2
  });

  n += 2;
  sg.on( SG.evt.completeRequest, function() {
    ajax_returns++;
    equal( ajax_returns, 1, "one ajax call");
  });
  sg.on( SG.evt.setCacheEnd, function() {
    cache_sets++;
    equal( cache_sets, 1, "set to cache" );

    start();
    test2();
  });

  field.focus();
  field.value = "foo";
 
  n += 3;
  function test2() {
    sg.off();

    ok( sg._cache.has("foo"), "value 'foo' exists in cache")
    equal( sg._cache.i, 1, "cache size == 1" );
    equal( sg._cache.get("foo")[0], "foo", "cache data correct" );

    field.value = "bar";
    stop();
    setTimeout(function() {
      sg.on( SG.evt.valueChange, function() {
        sg.on( SG.evt.stopRequest, test3 );
      });
      field.value = "baz";
    }, 60);
  }

  n += 2;
  function test3() {
    equal( sg._cache.i, 1, "cache is flushed");
    start();

    sg.flushCache();
    equal( sg._cache.i, 0, "cache is flushed 2");

    sg.destroy();
    $cont.empty();
  }
  
  expect( n );
});












})();

