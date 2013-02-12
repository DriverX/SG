/**!
* YASS 0.3.8 - The fastest CSS selectors JavaScript library
*
* Copyright (c) 2008-2009 Nikolay Matsievsky aka sunnybear (webo.in),
* Dual licensed under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.
*/
(function( window, sg ){

var document = window.document,
  utils = sg.utils,
  makeArray = utils.mkarr;

/* cached check for getElementsByClassName */
var k = !!document.getElementsByClassName,

/* cached check for querySelectorAll. Disable all IE due to lask of support */
  q = !!document.querySelectorAll;


/**
 * Returns number of nodes or an empty array
 * @param {String} CSS selector
 * @param {DOM node} root to look into
 */
var _ = function (selector, root ) {
  /* sets of nodes, to handle comma-separated selectors */
  var sets = [];
  
  /* clean root with document */
  root = root ? _( root )[0] : document;
  
  if( !selector ) {
    return sets;
  }
  
  if(
    selector.nodeType || typeof selector === "object" && "setTimeout" in selector
  )
  {
    return [ selector ];
  }
  
  if( typeof selector === "object" && ( utils.isArr( selector )
      || selector.length !== undefined )
  )
  {
    return makeArray( selector );
  }
  
  if( !root ) {
    return sets;
  }
  
/* quick return or generic call, missed ~ in attributes selector */
  if( /^[\w#.][\w\]*^|=!]*$/.test( selector ) ) {
/*
some simple cases - only ID or only CLASS for the very first occurence
- don't need additional checks. Switch works as a hash.
*/
    var idx = 0;
/* the only call -- no cache, thx to GreLI */
    switch (selector.charAt(0)) {
      case '#':
        idx = selector.slice(1);
        sets = document.getElementById(idx);
/*
workaround with IE bug about returning element by name not by ID.
Solution completely changed, thx to deerua.
Get all matching elements with this id
*/
        if ( sets && sets.id !== idx) {
          sets = document.all[idx];
        }
        sets = sets ? [sets] : [];
        break;
      case '.':
        var klass = selector.slice(1);
        if ( k ) {
          sets = (idx = (sets = root.getElementsByClassName(klass)).length) ? sets : [];
        } else {
/* no RegExp, thx to DenVdmj */
          klass = ' ' + klass + ' ';
          var nodes = root.getElementsByTagName('*'),
            i = 0,
            node;
          while (node = nodes[i++]) {
            if ((' ' + node.className + ' ').indexOf(klass) != -1) {
              sets[idx++] = node;
            }

          }
          sets = idx ? sets : [];
        }
        break;
      default:
        sets = (idx = (sets = root.getElementsByTagName(selector)).length) ? sets : [];
        break;
    }
  } else {
    
    var failQuerySelectorAll = false,
      selectorFindNorEqual = ~selector.indexOf('!=');
/*
all other cases. Apply querySelector if exists.
All methods are called via . not [] - thx to arty
*/
    if( q && !selectorFindNorEqual ) {
/* replace not quoted args with quoted one -- Safari doesn't understand either */
      try {
        sets = root.querySelectorAll( selector.replace( /=([^\]]+)/, '="$1"' ) );
      } catch( e ) {
        failQuerySelectorAll = true;
      }
/* generic function for complicated selectors */
    }
    
    if( failQuerySelectorAll || !q || selectorFindNorEqual ) {
/* number of groups to merge or not result arrays */
/*
groups of selectors separated by commas.
Split by RegExp, thx to tenshi.
*/
      var groups = selector.split(/ *, */),
/* group counter */
        gl = groups.length - 1,
/* if we need to concat several groups */
        concat = !!gl,
        group,
        singles,
        singles_length,
/* to handle RegExp for single selector */
        single,
        i,
/* to remember ancestor call for next childs, default is " " */
        ancestor,
/* current set of nodes - to handle single selectors */
        nodes,
/* for inner looping */
        tag, id, klass, attr, eql, mod, ind, newNodes, idx, J, child, last, childs, item, h;
/* loop in groups, maybe the fastest way */
      while (group = groups[gl--]) {
/*
Split selectors by space - to form single group tag-id-class,
or to get heredity operator. Replace + in child modificators
to % to avoid collisions. Additional replace is required for IE.
Replace ~ in attributes to & to avoid collisions.
*/  
        singles_length = (singles = group.replace(/(\([^)]*)\+/,"$1%").replace(/(\[[^\]]+)~/,"$1&").replace(/(~|>|\+)/," $1 ").split(/ +/)).length;
        i = 0;
        ancestor = ' ';
/* is cleanded up with DOM root */
        nodes = [root];
/*
John's Resig fast replace works a bit slower than
simple exec. Thx to GreLI for 'greed' RegExp
*/
        while (single = singles[i++]) {
/* simple comparison is faster than hash */
          if (single !== ' ' && single !== '>' && single !== '~' && single !== '+' && nodes) {
            single = single.match(/([^[:.#]+)?(?:#([^[:.#]+))?(?:\.([^[:.]+))?(?:\[([^!&^*|$[:=]+)([!$^*|&]?=)?([^:\]]+)?\])?(?:\:([^(]+)(?:\(([^)]+)\))?)?/);
/* 
Get all required matches from exec:
tag, id, class, attribute, value, modificator, index.
*/
            tag = single[1] || '*';
            id = single[2];
            klass = single[3] ? ' ' + single[3] + ' ' : '';
/* new nodes array */
            newNodes = [];
/* 
cached length of new nodes array
and length of root nodes
*/
            idx = J = 0;
/* if we need to mark node with expando yeasss */
            last = i == singles_length;
/* loop in all root nodes */
            while (child = nodes[J++]) {
/*
find all TAGs or just return all possible neibours.
Find correct 'children' for given node. They can be
direct childs, neighbours or something else.
*/
              switch (ancestor) {
                case ' ':
                  childs = child.getElementsByTagName(tag);
                  h = 0;
                  while (item = childs[h++]) {
/*
check them for ID or Class. Also check for expando 'yeasss'
to filter non-selected elements. Typeof 'string' not added -
if we get element with name="id" it won't be equal to given ID string.
Also check for given attributes selector.
Modificator is either not set in the selector, or just has been nulled
by modificator functions hash.
*/
                    if ((!id || item.id === id) && (!klass || (' ' + item.className + ' ').indexOf(klass) != -1) && !item.yeasss) {
/* 
Need to define expando property to true for the last step.
Then mark selected element with expando
*/
                      if (last) {
                        item.yeasss = 1;
                      }
                      newNodes[idx++] = item;
                    }
                  }
                  break;
              }
            }
/* put selected nodes in local nodes' set */
            nodes = newNodes;
          } else {
/* switch ancestor ( , > , ~ , +) */
            ancestor = single;
          }
        }
        
        if (concat) {
/* if sets isn't an array - create new one */
          if (!nodes.concat) {
            newNodes = [];
            h = 0;
            while (item = nodes[h]) {
              newNodes[h++] = item;
            }
            nodes = newNodes;
/* concat is faster than simple looping */
          }
          sets = nodes.concat(sets.length == 1 ? sets[0] : sets);
        } else {
/* inialize sets with nodes */
          sets = nodes;
        }
      }
      
/* define sets length to clean up expando */
      idx = sets.length;
/*
Need this looping as far as we also have expando 'yeasss'
that must be nulled. Need this only to generic case
*/
      while (idx--) {
        sets[idx].yeasss = sets[idx].nodeIndex = sets[idx].nodeIndexLast = null;
      }
    }
  }
/* return and cache results */
  return makeArray( sets );
};


// share
sg.$ = utils.$ = function( mixed, context ) {
  return _( mixed, context )[ 0 ] || null;
};
sg.$$ = utils.$$ = _;

})( window, SG );
