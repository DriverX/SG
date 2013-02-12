(function() {

var $cont;

module("SG.yass", {
  setup: function() {
    $cont = $("#qunit-fixture");
    $cont.append("<div><i class='test2'></i></div><div class='test1'><span id='test1' class='test1'/><span/><a/><a class='test2 test1'/> text <i class='test2'/><div id='foo_bar-baz__123' class='foo_bar-baz__123'/></div><span id='foo_bar-baz__123'> <center/><center/><center/> </span>");
  },
  teardown: function() {
    $cont = null;
  }
});


test("DOMNode", function() {
  var cont = $cont.get(0);
  equal( SG.$$( cont )[0], cont );
});


test("DOMNodeList", function() {
  var nodeList = document.getElementsByTagName("center");
  equal( SG.$$( nodeList ).length, 3 );
  equal( SG.$$( nodeList )[2], nodeList[2] );
});


test("#id", function() {
  equal( SG.$$("#qunit-fixture").length, 1 );
  equal( SG.$$(" #qunit-fixture ").length, 1 );
  equal( SG.$$("#foo_bar-baz__123").length, 1 );
});


test(".class", function() {
  equal( SG.$$(".test1").length, 3 );
  equal( SG.$$(".test2").length, 3 );
  equal( SG.$$(".foo_bar-baz__123").length, 1 );
});


test("node", function() {
  equal( SG.$$("center").length, 3 );
});


test("node#id/node.class", function() {
  equal( SG.$$("div#qunit-fixture").length, 1 );
  equal( SG.$$("div#foo_bar-baz__123").length, 1 );
  equal( SG.$$("div.test1").length, 1 );
  equal( SG.$$(".test1.test2").length, 1 );
  equal( SG.$$("span#test1.test1").length, 1 );
});


test("selector1, selector2", function() {
  equal( SG.$$("#test1, #qunit-fixture").length, 2 );
  equal( SG.$$(".test1, #qunit-fixture").length, 4 );
  equal( SG.$$(".test1, .test2").length, 5 );
  equal( SG.$$(".test1, .foo_bar-baz__123").length, 4 );

  // при сложных селекторах используется querySelectorAll,
  // который выбирает все элементы с таким id
  // именно поэтому тут 2
  equal( SG.$$("#foo_bar-baz__123, .blabla").length, 2 );
  
  equal( SG.$$(".test1, .test2, #test1, #test2, #foo_bar-baz__123, .foo_bar-baz__123, center, #qunit-fixture").length, 11 );
});


test("selector1 selector2", function() {
  equal( SG.$$("#qunit-fixture div").length, 3 );
  equal( SG.$$("#test1 div").length, 0 );
  equal( SG.$$(".test1 .test2").length, 2 );
  equal( SG.$$("div .test2").length, 3 );
  equal( SG.$$(".test1 .test1").length, 2 );
  equal( SG.$$("#foo_bar-baz__123 *").length, 3 );
});


test("find in root", function() {
  var cont = $cont.get(0);

  equal( SG.$$( "div", "#qunit-fixture" ).length, 3 );
  equal( SG.$$( "div", cont ).length, 3 );
  equal( SG.$$( "span", cont ).length, 3 );
  equal( SG.$$( "#test1", cont ).length, 1 );
  equal( SG.$$( ".test1, .test2", cont ).length, 5 );
  equal( SG.$$( ".test1, .test2", ".test1" ).length, 3 );
});


})();


