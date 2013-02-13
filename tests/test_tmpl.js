(function() {

var $cont;

module("SG.tmpl", {
  setup: function() {
    $cont = $("#qunit-fixture");
    $("<script class='jstmpl' type='plain/text'>bar=<%= bar %></script>").appendTo( $cont );
    $("<script id='jstmpl' type='plain/text'>passed=<%= is_passed %></script>").appendTo( $cont );
  },
  teardown: function() {
    $cont.empty();
    $cont = null;
  }
});


test("basic", function() {
  var tmplfn1 = SG.tmpl("<%= foo %>"),
    tmplfn2 = SG.tmpl("<% if( foo ) { %>bar<% } else { %>baz<% } %>");

  equal( tmplfn1({"foo": "bar"}), "bar" );
  equal( tmplfn2({"foo": false}), "baz" );
  equal( SG.tmpl("<%= foo.bar %>", {"foo": {"bar": "baz"}}), "baz" );
  throws(function() {
    SG.tmpl("<% foo >");
  });
  throws(function() {
    SG.tmpl("<% if( bla ) %><%= foo ><% } %>");
  });
  
  equal( SG.tmpl("123<%= foo.bar %><%= baz %>456", {"baz": "qux"}), "123qux456" );
  equal( SG.tmpl.errs.length, 1 );
});


test("create from DOMNode", function() {
  var tmplelem = $("<script type='plain/text'>foo=<%= foo %></script>").appendTo( $cont ).get(0),
    tmplfn1 = SG.tmpl( tmplelem );

  equal( tmplfn1({"foo": "baz"}), "foo=baz" );
});


test("create from selector", function() {
  var tmplfn1 = SG.tmpl(".jstmpl"),
    tmplfn2 = SG.tmpl("#jstmpl");

  equal( tmplfn1({"bar": "baz"}), "bar=baz" );
  equal( tmplfn2({"is_passed": "true"}), "passed=true" );
});


test("cache string", function() {
  SG.tmpl("test_cache1=<%= foo %>");

  ok( "test_cache1=<%= foo %>" in SG.tmpl.cch );
});


test("cache DOMNode", function() {
  var node1 = $("<script type='plain/text'>test_nodecache1=<%= foo %></script>").appendTo( $cont ).get(0);
  SG.tmpl( node1 );

  ok( node1[ SG.expando ] in SG.tmpl.cch );
  ok( node1.innerHTML in SG.tmpl.cch );
});


})();

