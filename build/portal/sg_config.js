(function( sg ) {

// detect dataURI support 
sg.utils.suppDataURI = false;

var tmp_img = new Image;
sg.utils.Event.add(tmp_img, "load error", function( event ) {
	sg.utils.Event.rm(tmp_img, "load error");
	sg.utils.suppDataURI = event.type === "load";
	tmp_img = null;
});
tmp_img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";


sg.SHOW_MUSICON = false;


var navSuggSelected = null;
var options = {
	enabled : false,
	field : null,
	cont : ".go-suggests",
	list : ".go-suggests__items",
	switcher : "go-suggests_open",
	autoSubmit : true,
	preview : true,
	hover : 'go-suggests__item_hover',
	max : 7,
	url : {
		scheme : '', // empty, because suggest must working on both schemas: http, https
		authority : 'suggests.go.mail.ru',
		path : "sg_u",
		query : {
			q : '{query}'
		}
	},
	reqTimeout : 3000,
	reqDataType: "jsonp",
	reqData : {},
	dataFilter : function(data) {
		if (data) {
			if (!data.items && data.sites && data.sites.length) {
				data.items = [];
			}
			if (data.items) {
				var i, l;
				for (l = data.items.length; l--;) {
					if(!sg.SHOW_MUSICON) {
						delete data.items[l].mus
					}
				}
				
				if (data.sites) {
					for (i = 0, l = data.sites.length; i < l; i++) {
                        data.items.unshift(data.sites[i]);
					}
				}
			}
		}
		return data;
	},
	item: ".go-suggests__suggest-tmpl",
	result : function(itemData) {
		return itemData.text;
	},
	select : function(data) {
		var itemData = data.itemData, result = data.result, value = data.value, srchForm = this.form;

		if (itemData.type === 'site') {
			navSuggSelected = data;
			return;
		}

		var moreData = {
			us : value.length,
			usln : data.selected + 1
		};
		if (itemData.spcAuto) {
			moreData.ussp = itemData.spcAuto;
		}

		var isMusSugg = itemData.mus;
		if (isMusSugg) {
			moreData.usmus = 1;
			moreData.rch = "l";
			sg.utils.rme(srchForm.elements.rch);
		}

		var inputs = [];
		sg.utils.objEach(moreData, function(v, k) {
			if (value == null) {
				return;
			}
			var input = sg.utils.cre("input");
			input.type = "hidden";
			input.name = k;
			input.value = v;
			
			// collect for remove after submit
			inputs.push(input);
			
			srchForm.appendChild(input);
		});

		setTimeout(function() {
			sg.utils.arrEach(inputs, function(n) {
				sg.utils.rme(n);
			})
		}, 10);
	},
	unselect: function() {
		navSuggSelected = null;
	}
};


function onFormSubmit( event ) {
	if( !navSuggSelected ) {
		return
	}
	
	var itemData = navSuggSelected.itemData,
		value = navSuggSelected.value;
	
	// create temporary form node for redirect
	var redirForm = sg.utils.cre("form");
	redirForm.action = "//go.mail.ru/search";
	redirForm.method = "get";
	redirForm.target = "_blank";
	var	params = {
			q: itemData.link,
			sg: value,
			sgsig: itemData.sig,
			ce: 1
		};
	sg.utils.objEach( params, function( v, k ) {
		var input = sg.utils.cre("input");
		input.type = "hidden";
		input.name = k;
		input.value = v;
		redirForm.appendChild( input );
		input = null;
	});
	
	document.body.appendChild( redirForm );
	redirForm.submit();
	
	// remove temporary form 
	setTimeout(function() {
		sg.utils.rme( redirForm );
		redirForm = null;
	}, 15);
	
	event.preventDefault();
}

function onEnable( event ) {
	sg.utils.Event.add( this.form, "submit", onFormSubmit );
}

function onDisable( event ) {
	sg.utils.Event.rm( this.form, "submit", onFormSubmit );
}

options.onEnable = onEnable;
options.onDisable = onDisable;

// merge default options with go.mail.ru options
sg.utils.ext( true, sg.opts, options );

})(SG);
