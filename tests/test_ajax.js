(function() {


module("SG.Ajax");


asyncTest("basic", function() {
  expect( 1 );

  alert(SG.Ajax("data/test_ajax_simple.html", {
    success: function( event, response ) {
      equal( response, "<!-- passed -->\n" );
      start(); 
    }
  }).send);
 
  // stop();
  // SG.Ajax("data/test_ajax_simple.html", {
  //   method: "post",
  //   success: function( event, response ) {
  //     equal( response, "<!-- passed -->\n" );
  //     start(); 
  //   }
  // }).send();
});


})();

