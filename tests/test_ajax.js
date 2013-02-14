(function() {


module("SG.Ajax");


test("TODO", function() {
  
  ok( SG.Ajax( "", {} ) instanceof SG.Ajax );

  var ajax = SG.Ajax("test_ajax.js");
  ajax.send();

  ok(false);
});


})();

