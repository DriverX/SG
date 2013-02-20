(function() {

var
  $cont,
  $form,
  $input,
  $sgcont,
  $sgcont_items;

module("SG", {
  setup: function() {
    $cont = $("#qunit-fixture");
    $form = $('<form action="http://go.mail.ru" method="get"><input type="submit"></form>').appendTo( $cont );
    $input = $('<input id="q" name="q">').appendTo( $form );
    $sgcont = $('<div id="sgcont">').appendTo( $cont );
    $sgcont_items = $('<div id="sgcont_items">').appendTo( $sgcont );
  },
  teardown: function() {
    $cont.empty();
    $cont = $form = $input = $sgcont = $sgcont_items = null;
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
  $( field1 ).add( cont1 ).add( list1 ).add( form1 ).remove();

  expect( n );
});
























})();

