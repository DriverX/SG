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
    }, 50);
  }, 50);
  

  expect( n );
});



















})();

