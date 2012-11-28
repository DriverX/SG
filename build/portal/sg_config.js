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
	
// merge default options with go.mail.ru options
sg.utils.ext(true, sg.opts, {
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
			// create temporary form node for redirect
			var redirForm = SG.utils.cre("form");
			redirForm.action = "//go.mail.ru/search";
			redirForm.method = "get";
			redirForm.target = "_blank";
			var	params = {
					q: itemData.link,
					sg: data.value,
					sgsig: itemData.sig,
					ce: 1
				};
			SG.utils.objEach(params, function(v, k) {
				var input = SG.utils.cre("input");
				input.type = "hidden";
				input.name = k;
				input.value = v;
				redirForm.appendChild(input);
			});
			
			document.body.appendChild(redirForm);
			redirForm.submit();
			
			// remove temporary form 
			setTimeout(function() {
				SG.utils.rme(redirForm);
				redirForm = null;
			}, 50);
			return false;
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
			SG.utils.rme(srchForm.elements.rch);
		}

		var inputs = [];
		SG.utils.objEach(moreData, function(v, k) {
			if (value == null) {
				return;
			}
			var input = SG.utils.cre("input");
			input.type = "hidden";
			input.name = k;
			input.value = v;
			
			// collect for remove after submit
			inputs.push(input);
			
			srchForm.appendChild(input);
		});

		setTimeout(function() {
			SG.utils.arrEach(inputs, function(n) {
				SG.utils.rme(n);
			})
		}, 10);
	}
});

})(SG);
