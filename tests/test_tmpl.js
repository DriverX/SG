(function() {

var $cont;

module("SG.tmpl", {
  setup: function() {
    $cont = $("#qunit-fixture");
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
  ok(false);
});


test("cache string", function() {
  ok(false);
});


test("cache DOMNode", function() {
  ok(false);
});


test("cache selector", function() {
  ok(false);
});


})();

