(function() {

var $cont,
  $a,
  a;

module("SG.Event", {
  setup: function() {
    $cont = $("#qunit-fixture");
    $a = $("<a id='test_event_link' href='#test'/>").appendTo( $cont );
    a = $a.get(0);
  },
  teardown: function() {
    $cont.empty();
    $cont = $a = a = null;
  }
});


test("add/rm event", function() {
  var click_handler = function() {},
    click_handler2 = function() {},
    click_handler3 = function() {},
    mouseover_handler = function() {},
    mouseover_handler2 = function() {},
    mousedown_handler = function() {},
    mouseoverdown_handler = function() {};

  SG.Event.add( a, "click", click_handler );
  ok( a[ SG.expando ] in SG.Event.c );

  var a_handlers = SG.Event.c[ a[ SG.expando ] ];
  equal( SG.utils.indexOf( a_handlers["click"], click_handler ), 0 );
  equal( a_handlers["click"].length, 1 );

  SG.Event.add( a, "mouseover", mouseover_handler );
  equal( SG.utils.indexOf( a_handlers["mouseover"], mouseover_handler ), 0 );
  equal( SG.utils.indexOf( a_handlers["mouseover"], click_handler ), -1 );
  equal( a_handlers["mouseover"].length, 1 );

  SG.Event.add( a, "click", click_handler2 );
  equal( SG.utils.indexOf( a_handlers["click"], click_handler ), 0 );
  equal( SG.utils.indexOf( a_handlers["click"], click_handler2 ), 1 );
  equal( a_handlers["click"].length, 2 );
  
  SG.Event.add( a, "click", click_handler );
  equal( SG.utils.indexOf( a_handlers["click"], click_handler ), 0 );
  equal( SG.utils.indexOf( a_handlers["click"], click_handler, 1 ), 2 );
  equal( a_handlers["click"].length, 3 );
  
  SG.Event.add( a, " mouseover mousedown    ", mouseoverdown_handler );
  equal( SG.utils.indexOf( a_handlers["mouseover"], mouseoverdown_handler ), 1 );
  equal( SG.utils.indexOf( a_handlers["mousedown"], mouseoverdown_handler ), 0 );
  equal( a_handlers["mouseover"].length, 2 );
  equal( a_handlers["mousedown"].length, 1 );

  SG.Event.add( a, "click", function() {} );
  SG.Event.add( a, "click", function() {} );
  SG.Event.add( a, "click", function() {} );
  SG.Event.add( a, "mouseover", function() {} );
  equal( a_handlers["click"].length, 6 );
  equal( a_handlers["mouseover"].length, 3 );

  SG.Event.first( a, "click", click_handler3 );
  equal( SG.utils.indexOf( a_handlers["click"], click_handler3 ), 0 );
  equal( SG.utils.indexOf( a_handlers["click"], click_handler ), 1 );
  equal( a_handlers["click"].length, 7 );
  
  equal( SG.utils.keys( a_handlers ).length, 3 );


  SG.Event.rm( a, "click", click_handler );
  equal( SG.utils.indexOf( a_handlers["click"], click_handler ), 1 );
  equal( SG.utils.indexOf( a_handlers["click"], click_handler, 2 ), -1 );
  equal( a_handlers["click"].length, 6 );
  
  SG.Event.rm( a, " mouseover", mouseoverdown_handler );
  equal( SG.utils.indexOf( a_handlers["mouseover"], mouseoverdown_handler ), -1 );
  equal( SG.utils.indexOf( a_handlers["mousedown"], mouseoverdown_handler ), 0 );
  equal( a_handlers["mouseover"].length, 2 );
  equal( a_handlers["mousedown"].length, 1 );
 
  SG.Event.rm( a, "mouseover" );
  ok( a_handlers["mouseover"] === undefined );
  equal( a_handlers["click"].length, 6 );

  SG.Event.rm( a );
  ok( a_handlers["click"] === undefined );
  ok( a_handlers["mousedown"] === undefined );
  
  equal( SG.utils.keys( a_handlers ).length, 0 );
});


test("add/rm special events", function() {
  var special_handler = function() {};

  SG.Event.add( a, "mouseenter mouseleave", special_handler );
  
  var a_handlers = SG.Event.c[ a[ SG.expando ] ];
  equal( a_handlers["mouseenter"].length, 1 );
  equal( a_handlers["mouseover"].length, 1 );
  equal( a_handlers["mouseleave"].length, 1 );
  equal( a_handlers["mouseout"].length, 1 );

  SG.Event.rm( a, "mouseenter", special_handler );
  ok( a_handlers["mouseenter"] === undefined );
  ok( a_handlers["mouseover"] === undefined );
  equal( a_handlers["mouseleave"].length, 1 );
  equal( a_handlers["mouseout"].length, 1 );
  
  SG.Event.rm( a, "mouseleave" );
  ok( a_handlers["mouseleave"] === undefined );
  ok( a_handlers["mouseout"] === undefined );

  equal( SG.utils.keys( a_handlers ).length, 0 );
});


test("fire event", function() {
  var calls = {};
  function inc_call( evt ) {
    calls[ evt ] = ( calls[ evt ] || 0 ) + 1;
    return calls[ evt ];
  }
  function get_handler() {
    return function( event ) {
      inc_call( event.type );
    };
  }

  SG.Event.add( a, "click", get_handler() );
  SG.Event.add( a, "mouseenter", get_handler() );
  SG.Event.add( a, "mouseleave", get_handler() );
  SG.Event.add( a, "mousedown", get_handler() );
  SG.Event.add( a, "blabla", get_handler() );
  
  SG.Event.fire( a, "click" );
  equal( calls["click"], 1 );
  
  SG.Event.add( a, "click", get_handler() );
  SG.Event.fire( a, "click" );
  equal( calls["click"], 3 );
  equal( SG.utils.keys( calls ).length, 1 );

  SG.Event.fire( a, "mouseenter" );
  equal( calls["mouseenter"], 1 );
  equal( SG.utils.keys( calls ).length, 2 );
  
  SG.Event.fire( a, "mouseleave" );
  equal( calls["mouseleave"], 1 );
  equal( SG.utils.keys( calls ).length, 3 );

  SG.Event.fire( a, "foobar" );
  equal( SG.utils.keys( calls ).length, 3 );
  
  SG.Event.fire( a, "blabla" );
  equal( SG.utils.keys( calls ).length, 4 );
  
  SG.Event.rm( a );
});


test("fire event order", function() {
  var calls = [];

  SG.Event.add( a, "click", function() {
    calls.push("second");
  });
  SG.Event.first( a, "click", function() {
    calls.push("first");
  });
  SG.Event.add( a, "click", function() {
    calls.push("third");
  });
  
  SG.Event.fire( a, "click" );
  equal( calls.length, 3 );
  equal( SG.utils.indexOf( calls, "first" ), 0 );
  equal( SG.utils.indexOf( calls, "second" ), 1 );
  equal( SG.utils.indexOf( calls, "third" ), 2 );
});


test("remove custom event", function() {
  ok(false);
});


test("trigger custom event", function() {
  ok(false);
});





})();

