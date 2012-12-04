(function( window, sg ) {

var document = window.document,
	expando = sg.expando,
	utils = sg.utils,
	str__setInterval = "setInterval",
	rWhiteSpaces = /\s+/;
	

// Event object part
// jQuery port
var str__tachEvent = 'tachEvent',
	str__attachEvent = 'at' + str__tachEvent,
	str__detachEvent = 'de' + str__tachEvent,
	str__EventListener = 'EventListener',
	str__addEventListener = 'add' + str__EventListener,
	str__removeEventListener = 'remove' + str__EventListener,
	str__preventDefault = 'preventDefault',
	str__isDefaultPrevented = 'isDefaultPrevented',
	str__stopPropagation = 'stopPropagation',
	str__isPropagationStopped = 'isPropagationStopped',
	str__stopImmediatePropagation = 'stopImmediatePropagation',
	str__isImmediatePropagationStopped = 'isImmediatePropagationStopped',
	eventMigrationProps = ( "altKey attrChange attrName bubbles button cancelable charCode " +
		"clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler " +
		"keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue " +
		"relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement " +
		"view wheelDelta which" ).split(" "),
	addEvent = document[ str__addEventListener ] ? function( elem, event, fn ) {
			elem[ str__addEventListener ]( event, fn, false );
		} : document[ str__attachEvent ] ? function( elem, event, fn ) {
			elem[ str__attachEvent ]( "on" + event, fn );
		} : emptyFn,
	removeEvent = document[ str__addEventListener ] ? function( elem, event, fn ) {
			elem[ str__removeEventListener ]( event, fn, false );
		} : document[ str__attachEvent ] ? function( elem, event, fn ) {
			elem[ str__detachEvent ]( "on" + event, fn );
		} : emptyFn,
	oneEvent = function( elem, event, fn ) {
		addEvent( elem, event, function() {
			removeEvent( elem, event, arguments.callee );
			return fn.apply( elem, arguments );
		});
	},
	isDefaultPrevented = function( event ) {
		return (
			"defaultPrevented" in event
				? event.defaultPrevented
				: "returnValue" in event
					? !event.returnValue
					: "getPreventDefault" in event
						? event.getPreventDefault()
						: false
		);
	},
	fnTRUE = function() {
		return true;
	},
	fnFALSE = function() {
		return false;
	};

	
var Event = {
		fired: null,
		c: {},
		custom: {},
		hlink: function( source, someFn ) {
			someFn[ expando ] = source[ expando ] = source[ expando ] || sg.guid();
			return someFn;
		},
		fix: function( event ) {
			if ( event[ expando ] ) {
				return event;
			}
			
			// Клонируем объект события
		    var originalEvent = event;
		    event = new Event.Event( event );
		    
		    // Клонируем свойства из оригинального объекта
		    for ( var i = 0, prop; ( prop = eventMigrationProps[ i++ ] ); ) {
				event[ prop ] = originalEvent[ prop ];
			}
	
			// Fix target property, if necessary
			if ( !event.target ) {
				// Fixes #1925 where srcElement might not be defined either
				event.target = event.srcElement || document;
			}
	
			// check if target is a textnode (safari)
			if ( event.target.nodeType === 3 ) {
				event.target = event.target.parentNode;
			}
	
			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && event.fromElement ) {
				event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
			}
	
			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && event.clientX != null ) {
				var eventDocument = event.target.ownerDocument || document,
					doc = eventDocument.documentElement,
					body = eventDocument.body;
	
				event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
				event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
			}
	
			// Add which for key events
			if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
				event.which = event.charCode != null ? event.charCode : event.keyCode;
			}
	
			// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
			if ( !event.metaKey && event.ctrlKey ) {
				event.metaKey = event.ctrlKey;
			}
	
			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && event.button !== undefined ) {
				event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
			}
		    
			return event;
		},
		handler: function( event, data ) {
			event = Event.fix( event || window.event );
		    
			event.currentTarget = this;
			
			var handlers = Event.c[ this[ expando ] ][ event.type ],
				handler,
				data = data && utils.isArr( data ) ? utils.mkarr( data ) : null;
			
			if( data ) {
				data.unshift( event );
			}
				
			for( var i = 0, l = handlers.length, ret; i < l; i++ ) {
				handler = handlers[ i ];
				ret = data
					? handler.apply( this, data )
					: handler.call( this, event );
				if( ret === false ) {
					event[ str__preventDefault ]();
					event[ str__stopPropagation ]();
				}
				if( event[ str__isImmediatePropagationStopped ]() ) {
					break;
				}
			}
		},
		add: function ( elem, event, handler ) {
			if( elem && event && utils.isFn( handler ) ) {
				if( elem[ str__setInterval ] && elem != window && !elem.frameElement ) {
					elem = window;
				}
				
				utils.arrEach( event.split( rWhiteSpaces ), function( eventType ) {
					if( !handler[ expando ] ) {
						handler[ expando ] = sg.guid();
					}
					
					var elemGuid = elem[ expando ] = elem[ expando ] || sg.guid(),
						listeners = Event.c[ elemGuid ] = Event.c[ elemGuid ] || {},
						eventListeners = listeners[ eventType ] = listeners[ eventType ] || [],
						eventHandle = eventListeners.handle = function( event, data ) {
							if( !event || event.type !== Event.fired ) {
								return Event.handler.call( eventHandle.elem, event, data );
							}
						};
					
					eventHandle.elem = elem;
	
					if( eventListeners.push( handler ) == 1 && ( elem.nodeType || elem[ str__setInterval ] ) ) {
						var custom = Event.custom && Event.custom[ eventType ] && Event.custom[ eventType ].setup;
						if( !custom || custom.call( elem, eventHandle ) === false ) {
							addEvent( elem, eventType, eventListeners.handle );
						}
					}
				});
			}
		},
		one: function( elem, event, handler ) {
			Event.add(
				elem,
				event,
				Event.hlink( handler, function() {
					Event.rm( this, event, arguments.callee );
					return handler.apply( this, arguments );
				})
			);
		},
		rm: function ( elem, event, handler ) {
			if( !elem ) {
				return;
			}
			
			if( !event ) {
				var elemGuid = elem[ expando ],
					listeners = elemGuid && Event.c[ elemGuid ],
					eventTypes = [],
					eventType;
				if( listeners ) {
					for( eventType in listeners ) {
						if( utils.hasOwn( listeners, eventType ) ) {
							eventTypes.push( eventType );
						}
					}
					Event.rm( elem, eventTypes.join(" ") );
				}
				
			} else {
			
				if( elem[ str__setInterval ] && elem != window && !elem.frameElement ) {
					elem = window;
				}
				utils.arrEach( event.split( rWhiteSpaces ), function( eventType ) {
					var elemGuid = elem[ expando ],
						listeners = elemGuid && Event.c[ elemGuid ],
						eventListeners = listeners && listeners[ eventType ];
						
					if( elemGuid && listeners && eventListeners ) {
						if( utils.isFn( handler ) && handler[ expando ] ) {
							for( var l = eventListeners.length; l--; ) {
								if( eventListeners[ l ][ expando ] == handler[ expando ] ) {
									eventListeners.splice( l, 1 );
									break;
								}
							}
						} else {
							eventListeners.length = 0;
						}
						
						if( !eventListeners.length ) {
							if( elem.nodeType || elem[ str__setInterval ] ) {
								var custom = Event.custom && Event.custom[ eventType ] && Event.custom[ eventType ].teardown;
								if( !custom || custom.call( elem, eventListeners.handle ) === false ) {
									removeEvent( elem, eventType, eventListeners.handle );
								}
							}
							
							delete listeners[ eventType ];
							
							for( eventType in listeners ) {
								return;
							}
							
							delete Event.c[ elemGuid ];
						}
					}
				});
			}
		},
		fire: function( elem, event, data ) {
			if( !elem || !event ) {
				return;
			}
			
			data = utils.from( data );
			
			var	eventType = event.type || event,
				eventObj,
				onEventType = 'on' + eventType,
				elemGuid = elem[ expando ],
				listeners = elemGuid && Event.c[ elemGuid ],
				eventListeners = listeners && listeners[ eventType ];
			
			if( eventListeners ) {
				
				if( !event[ expando ] ) {
					if( typeof event === "object" ) {
						eventObj = new Event.Event( eventType, event );
					} else {
						eventObj = new Event.Event( event );
					}
				} else {
					eventObj = event;
				}
				
				eventObj.type = eventType;
				eventObj.target = eventObj.currentTarget = elem;
				
				eventListeners.handle.call( elem, eventObj, data );
			}
			
			
			if( !eventObj || !eventObj[ str__isDefaultPrevented ]() ) {
				var oldOnEventType;
				try {
					if( ( elem.nodeType || elem[ str__setInterval ] ) && onEventType && elem[ eventType ] ) {
						oldOnEventType = elem[ onEventType ];
	
						if( oldOnEventType ) {
							elem[ onEventType ] = null;
						}
												
						Event.fired = eventType;
						elem[ eventType ]();
					}
				} catch ( ieError ) {}
	
				if ( oldOnEventType ) {
					elem[ onEventType ] = oldOnEventType;
				}
			}
			
			Event.fired = null;
		}
	};

Event.Event = function( event, props ) {
	var self = this;
	
	// Event object
	if( event && event.type ) {
		self.origEvent = event;
		self.type = event.type;
		
		self[ str__isDefaultPrevented ] = isDefaultPrevented( event ) ? fnTRUE : fnFALSE;

	// Event type
	} else {
		self.type = event;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		extend( self, props );
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	self.timeStamp = sg.now();

	// Mark it as fixed
	self[ expando ] = true;
};

var EventProto = Event.Event.prototype;
EventProto[ str__preventDefault ] = function() {
	this[ str__isDefaultPrevented ] = fnTRUE;
	     

	var e = this.origEvent;
	if ( !e ) {
		return;
	}

	// if preventDefault exists run it on the original event
	if ( e[ str__preventDefault ] ) {
		e[ str__preventDefault ]();

	// otherwise set the returnValue property of the original event to false (IE)
	} else {
		e.returnValue = false;
	}
};
EventProto[ str__stopPropagation ] = function() {
	this[ str__isPropagationStopped ] = fnTRUE;

	var e = this.origEvent;
	if ( !e ) {
		return;
	}
	
	// if stopPropagation exists run it on the original event
	if ( e[ str__stopPropagation ] ) {
		e[ str__stopPropagation ]();
	}
	// otherwise set the cancelBubble property of the original event to true (IE)
	e.cancelBubble = true;
};
EventProto[ str__stopImmediatePropagation ] = function() {
	this[ str__isImmediatePropagationStopped ] = fnTRUE;
	this[ str__stopPropagation ]();
};
EventProto[ str__isDefaultPrevented ] = fnFALSE;
EventProto[ str__isPropagationStopped ] = fnFALSE;
EventProto[ str__isImmediatePropagationStopped ] = fnFALSE;


var mouselenterFixObject = {
	mouseover: "mouseenter",
	mouseout: "mouseleave"
};
// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
function mouseenterFix( event ) {
	// Check if mouse(over|out) are still within the same parent element
	var related = event.relatedTarget,
		inside = false,
		eventType = event.type;

	event.type = mouselenterFixObject[ eventType ];

	if( related !== this ) {
		if( related ) {
			inside = utils.contains( this, related );
		}

		if( !inside ) {
			var args = utils.mkarr( arguments );
			Event.fire( this, args.shift(), args );
			event.type = eventType;
		}
	}
}

utils.objEach( mouselenterFixObject, function( orig, fix ) {
	Event.custom[ orig ] = {
		setup: function() {
			Event.add( this, fix, mouseenterFix );
		},
		teardown: function() {
			Event.rm( this, fix, mouseenterFix );
		}
	};
});


// share
Event.natAdd = addEvent;
Event.natRm = removeEvent;
Event.natOne = oneEvent;
sg.Event = Event;
utils.Event = Event; // deprecated

})( window, SG );
