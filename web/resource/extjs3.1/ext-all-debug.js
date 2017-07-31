/*
 * Ext JS Library 3.1.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

Ext.DomHelper = function(){
	var tempTableEl = null,
		emptyTags = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i,
		tableRe = /^table|tbody|tr|td$/i,
		pub,

		afterbegin = 'afterbegin',
		afterend = 'afterend',
		beforebegin = 'beforebegin',
		beforeend = 'beforeend',
		ts = '<table>',
		te = '</table>',
		tbs = ts+'<tbody>',
		tbe = '</tbody>'+te,
		trs = tbs + '<tr>',
		tre = '</tr>'+tbe;


	function doInsert(el, o, returnElement, pos, sibling, append){
		var newNode = pub.insertHtml(pos, Ext.getDom(el), createHtml(o));
		return returnElement ? Ext.get(newNode, true) : newNode;
	}


	function createHtml(o){
		var b = '',
			attr,
			val,
			key,
			keyVal,
			cn;

		if(Ext.isString(o)){
			b = o;
		} else if (Ext.isArray(o)) {
			for (var i=0; i < o.length; i++) {
				if(o[i]) {
					b += createHtml(o[i]);
				}
			};
		} else {
			b += '<' + (o.tag = o.tag || 'div');
			Ext.iterate(o, function(attr, val){
				if(!/tag|children|cn|html$/i.test(attr)){
					if (Ext.isObject(val)) {
						b += ' ' + attr + '="';
						Ext.iterate(val, function(key, keyVal){
							b += key + ':' + keyVal + ';';
						});
						b += '"';
					}else{
						b += ' ' + ({cls : 'class', htmlFor : 'for'}[attr] || attr) + '="' + val + '"';
					}
				}
			});

			if (emptyTags.test(o.tag)) {
				b += '/>';
			} else {
				b += '>';
				if ((cn = o.children || o.cn)) {
					b += createHtml(cn);
				} else if(o.html){
					b += o.html;
				}
				b += '</' + o.tag + '>';
			}
		}
		return b;
	}

	function ieTable(depth, s, h, e){
		tempTableEl.innerHTML = [s, h, e].join('');
		var i = -1,
			el = tempTableEl,
			ns;
		while(++i < depth){
			el = el.firstChild;
		}

		if(ns = el.nextSibling){
			var df = document.createDocumentFragment();
			while(el){
				ns = el.nextSibling;
				df.appendChild(el);
				el = ns;
			}
			el = df;
		}
		return el;
	}


	function insertIntoTable(tag, where, el, html) {
		var node,
			before;

		tempTableEl = tempTableEl || document.createElement('div');

		if(tag == 'td' && (where == afterbegin || where == beforeend) ||
			!/td|tr|tbody/i.test(tag) && (where == beforebegin || where == afterend)) {
			return;
		}
		before = where == beforebegin ? el :
			where == afterend ? el.nextSibling :
				where == afterbegin ? el.firstChild : null;

		if (where == beforebegin || where == afterend) {
			el = el.parentNode;
		}

		if (tag == 'td' || (tag == 'tr' && (where == beforeend || where == afterbegin))) {
			node = ieTable(4, trs, html, tre);
		} else if ((tag == 'tbody' && (where == beforeend || where == afterbegin)) ||
			(tag == 'tr' && (where == beforebegin || where == afterend))) {
			node = ieTable(3, tbs, html, tbe);
		} else {
			node = ieTable(2, ts, html, te);
		}
		el.insertBefore(node, before);
		return node;
	}


	pub = {

		markup : function(o){
			return createHtml(o);
		},


		applyStyles : function(el, styles){
			if(styles){
				var i = 0,
					len,
					style;

				el = Ext.fly(el);
				if(Ext.isFunction(styles)){
					styles = styles.call();
				}
				if(Ext.isString(styles)){
					styles = styles.trim().split(/\s*(?::|;)\s*/);
					for(len = styles.length; i < len;){
						el.setStyle(styles[i++], styles[i++]);
					}
				}else if (Ext.isObject(styles)){
					el.setStyle(styles);
				}
			}
		},


		insertHtml : function(where, el, html){
			var hash = {},
				hashVal,
				setStart,
				range,
				frag,
				rangeEl,
				rs;

			where = where.toLowerCase();

			hash[beforebegin] = ['BeforeBegin', 'previousSibling'];
			hash[afterend] = ['AfterEnd', 'nextSibling'];

			if (el.insertAdjacentHTML) {
				if(tableRe.test(el.tagName) && (rs = insertIntoTable(el.tagName.toLowerCase(), where, el, html))){
					return rs;
				}

				hash[afterbegin] = ['AfterBegin', 'firstChild'];
				hash[beforeend] = ['BeforeEnd', 'lastChild'];
				if ((hashVal = hash[where])) {
					el.insertAdjacentHTML(hashVal[0], html);
					return el[hashVal[1]];
				}
			} else {
				range = el.ownerDocument.createRange();
				setStart = 'setStart' + (/end/i.test(where) ? 'After' : 'Before');
				if (hash[where]) {
					range[setStart](el);
					frag = range.createContextualFragment(html);
					el.parentNode.insertBefore(frag, where == beforebegin ? el : el.nextSibling);
					return el[(where == beforebegin ? 'previous' : 'next') + 'Sibling'];
				} else {
					rangeEl = (where == afterbegin ? 'first' : 'last') + 'Child';
					if (el.firstChild) {
						range[setStart](el[rangeEl]);
						frag = range.createContextualFragment(html);
						if(where == afterbegin){
							el.insertBefore(frag, el.firstChild);
						}else{
							el.appendChild(frag);
						}
					} else {
						el.innerHTML = html;
					}
					return el[rangeEl];
				}
			}
			throw 'Illegal insertion point -> "' + where + '"';
		},


		insertBefore : function(el, o, returnElement){
			return doInsert(el, o, returnElement, beforebegin);
		},


		insertAfter : function(el, o, returnElement){
			return doInsert(el, o, returnElement, afterend, 'nextSibling');
		},


		insertFirst : function(el, o, returnElement){
			return doInsert(el, o, returnElement, afterbegin, 'firstChild');
		},


		append : function(el, o, returnElement){
			return doInsert(el, o, returnElement, beforeend, '', true);
		},


		overwrite : function(el, o, returnElement){
			el = Ext.getDom(el);
			el.innerHTML = createHtml(o);
			return returnElement ? Ext.get(el.firstChild) : el.firstChild;
		},

		createHtml : createHtml
	};
	return pub;
}();
Ext.apply(Ext.DomHelper,
	function(){
		var pub,
			afterbegin = 'afterbegin',
			afterend = 'afterend',
			beforebegin = 'beforebegin',
			beforeend = 'beforeend';


		function doInsert(el, o, returnElement, pos, sibling, append){
			el = Ext.getDom(el);
			var newNode;
			if (pub.useDom) {
				newNode = createDom(o, null);
				if (append) {
					el.appendChild(newNode);
				} else {
					(sibling == 'firstChild' ? el : el.parentNode).insertBefore(newNode, el[sibling] || el);
				}
			} else {
				newNode = Ext.DomHelper.insertHtml(pos, el, Ext.DomHelper.createHtml(o));
			}
			return returnElement ? Ext.get(newNode, true) : newNode;
		}



		function createDom(o, parentNode){
			var el,
				doc = document,
				useSet,
				attr,
				val,
				cn;

			if (Ext.isArray(o)) {
				el = doc.createDocumentFragment();
				Ext.each(o, function(v) {
					createDom(v, el);
				});
			} else if (Ext.isString(o)) {
				el = doc.createTextNode(o);
			} else {
				el = doc.createElement( o.tag || 'div' );
				useSet = !!el.setAttribute;
				Ext.iterate(o, function(attr, val){
					if(!/tag|children|cn|html|style/.test(attr)){
						if(attr == 'cls'){
							el.className = val;
						}else{
							if(useSet){
								el.setAttribute(attr, val);
							}else{
								el[attr] = val;
							}
						}
					}
				});
				Ext.DomHelper.applyStyles(el, o.style);

				if ((cn = o.children || o.cn)) {
					createDom(cn, el);
				} else if (o.html) {
					el.innerHTML = o.html;
				}
			}
			if(parentNode){
				parentNode.appendChild(el);
			}
			return el;
		}

		pub = {

			createTemplate : function(o){
				var html = Ext.DomHelper.createHtml(o);
				return new Ext.Template(html);
			},


			useDom : false,


			insertBefore : function(el, o, returnElement){
				return doInsert(el, o, returnElement, beforebegin);
			},


			insertAfter : function(el, o, returnElement){
				return doInsert(el, o, returnElement, afterend, 'nextSibling');
			},


			insertFirst : function(el, o, returnElement){
				return doInsert(el, o, returnElement, afterbegin, 'firstChild');
			},


			append: function(el, o, returnElement){
				return doInsert(el, o, returnElement, beforeend, '', true);
			},


			createDom: createDom
		};
		return pub;
	}());
Ext.Template = function(html){
	var me = this,
		a = arguments,
		buf = [];

	if (Ext.isArray(html)) {
		html = html.join("");
	} else if (a.length > 1) {
		Ext.each(a, function(v) {
			if (Ext.isObject(v)) {
				Ext.apply(me, v);
			} else {
				buf.push(v);
			}
		});
		html = buf.join('');
	}


	me.html = html;

	if (me.compiled) {
		me.compile();
	}
};
Ext.Template.prototype = {

	re : /\{([\w-]+)\}/g,



	applyTemplate : function(values){
		var me = this;

		return me.compiled ?
			me.compiled(values) :
			me.html.replace(me.re, function(m, name){
				return values[name] !== undefined ? values[name] : "";
			});
	},


	set : function(html, compile){
		var me = this;
		me.html = html;
		me.compiled = null;
		return compile ? me.compile() : me;
	},


	compile : function(){
		var me = this,
			sep = Ext.isGecko ? "+" : ",";

		function fn(m, name){
			name = "values['" + name + "']";
			return "'"+ sep + '(' + name + " == undefined ? '' : " + name + ')' + sep + "'";
		}

		eval("this.compiled = function(values){ return " + (Ext.isGecko ? "'" : "['") +
			me.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn) +
			(Ext.isGecko ?  "';};" : "'].join('');};"));
		return me;
	},


	insertFirst: function(el, values, returnElement){
		return this.doInsert('afterBegin', el, values, returnElement);
	},


	insertBefore: function(el, values, returnElement){
		return this.doInsert('beforeBegin', el, values, returnElement);
	},


	insertAfter : function(el, values, returnElement){
		return this.doInsert('afterEnd', el, values, returnElement);
	},


	append : function(el, values, returnElement){
		return this.doInsert('beforeEnd', el, values, returnElement);
	},

	doInsert : function(where, el, values, returnEl){
		el = Ext.getDom(el);
		var newNode = Ext.DomHelper.insertHtml(where, el, this.applyTemplate(values));
		return returnEl ? Ext.get(newNode, true) : newNode;
	},


	overwrite : function(el, values, returnElement){
		el = Ext.getDom(el);
		el.innerHTML = this.applyTemplate(values);
		return returnElement ? Ext.get(el.firstChild, true) : el.firstChild;
	}
};

Ext.Template.prototype.apply = Ext.Template.prototype.applyTemplate;


Ext.Template.from = function(el, config){
	el = Ext.getDom(el);
	return new Ext.Template(el.value || el.innerHTML, config || '');
};
Ext.apply(Ext.Template.prototype, {

	disableFormats : false,



	re : /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,


	applyTemplate : function(values){
		var me = this,
			useF = me.disableFormats !== true,
			fm = Ext.util.Format,
			tpl = me;

		if(me.compiled){
			return me.compiled(values);
		}
		function fn(m, name, format, args){
			if (format && useF) {
				if (format.substr(0, 5) == "this.") {
					return tpl.call(format.substr(5), values[name], values);
				} else {
					if (args) {



						var re = /^\s*['"](.*)["']\s*$/;
						args = args.split(',');
						for(var i = 0, len = args.length; i < len; i++){
							args[i] = args[i].replace(re, "$1");
						}
						args = [values[name]].concat(args);
					} else {
						args = [values[name]];
					}
					return fm[format].apply(fm, args);
				}
			} else {
				return values[name] !== undefined ? values[name] : "";
			}
		}
		return me.html.replace(me.re, fn);
	},


	compile : function(){
		var me = this,
			fm = Ext.util.Format,
			useF = me.disableFormats !== true,
			sep = Ext.isGecko ? "+" : ",",
			body;

		function fn(m, name, format, args){
			if(format && useF){
				args = args ? ',' + args : "";
				if(format.substr(0, 5) != "this."){
					format = "fm." + format + '(';
				}else{
					format = 'this.call("'+ format.substr(5) + '", ';
					args = ", values";
				}
			}else{
				args= ''; format = "(values['" + name + "'] == undefined ? '' : ";
			}
			return "'"+ sep + format + "values['" + name + "']" + args + ")"+sep+"'";
		}


		if(Ext.isGecko){
			body = "this.compiled = function(values){ return '" +
				me.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn) +
				"';};";
		}else{
			body = ["this.compiled = function(values){ return ['"];
			body.push(me.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn));
			body.push("'].join('');};");
			body = body.join('');
		}
		eval(body);
		return me;
	},


	call : function(fnName, value, allValues){
		return this[fnName](value, allValues);
	}
});
Ext.Template.prototype.apply = Ext.Template.prototype.applyTemplate;

Ext.DomQuery = function(){
	var cache = {},
		simpleCache = {},
		valueCache = {},
		nonSpace = /\S/,
		trimRe = /^\s+|\s+$/g,
		tplRe = /\{(\d+)\}/g,
		modeRe = /^(\s?[\/>+~]\s?|\s|$)/,
		tagTokenRe = /^(#)?([\w-\*]+)/,
		nthRe = /(\d*)n\+?(\d*)/,
		nthRe2 = /\D/,



		isIE = window.ActiveXObject ? true : false,
		key = 30803;



	eval("var batch = 30803;");

	function child(p, index){
		var i = 0,
			n = p.firstChild;
		while(n){
			if(n.nodeType == 1){
				if(++i == index){
					return n;
				}
			}
			n = n.nextSibling;
		}
		return null;
	};

	function next(n){
		while((n = n.nextSibling) && n.nodeType != 1);
		return n;
	};

	function prev(n){
		while((n = n.previousSibling) && n.nodeType != 1);
		return n;
	};

	function children(d){
		var n = d.firstChild, ni = -1,
			nx;
		while(n){
			nx = n.nextSibling;
			if(n.nodeType == 3 && !nonSpace.test(n.nodeValue)){
				d.removeChild(n);
			}else{
				n.nodeIndex = ++ni;
			}
			n = nx;
		}
		return this;
	};

	function byClassName(c, a, v){
		if(!v){
			return c;
		}
		var r = [], ri = -1, cn;
		for(var i = 0, ci; ci = c[i]; i++){
			if((' '+ci.className+' ').indexOf(v) != -1){
				r[++ri] = ci;
			}
		}
		return r;
	};

	function attrValue(n, attr){
		if(!n.tagName && typeof n.length != "undefined"){
			n = n[0];
		}
		if(!n){
			return null;
		}
		if(attr == "for"){
			return n.htmlFor;
		}
		if(attr == "class" || attr == "className"){
			return n.className;
		}
		return n.getAttribute(attr) || n[attr];

	};

	function getNodes(ns, mode, tagName){
		var result = [], ri = -1, cs;
		if(!ns){
			return result;
		}
		tagName = tagName || "*";
		if(typeof ns.getElementsByTagName != "undefined"){
			ns = [ns];
		}
		if(!mode){
			for(var i = 0, ni; ni = ns[i]; i++){
				cs = ni.getElementsByTagName(tagName);
				for(var j = 0, ci; ci = cs[j]; j++){
					result[++ri] = ci;
				}
			}
		}else if(mode == "/" || mode == ">"){
			var utag = tagName.toUpperCase();
			for(var i = 0, ni, cn; ni = ns[i]; i++){
				cn = ni.childNodes;
				for(var j = 0, cj; cj = cn[j]; j++){
					if(cj.nodeName == utag || cj.nodeName == tagName  || tagName == '*'){
						result[++ri] = cj;
					}
				}
			}
		}else if(mode == "+"){
			var utag = tagName.toUpperCase();
			for(var i = 0, n; n = ns[i]; i++){
				while((n = n.nextSibling) && n.nodeType != 1);
				if(n && (n.nodeName == utag || n.nodeName == tagName || tagName == '*')){
					result[++ri] = n;
				}
			}
		}else if(mode == "~"){
			var utag = tagName.toUpperCase();
			for(var i = 0, n; n = ns[i]; i++){
				while((n = n.nextSibling)){
					if (n.nodeName == utag || n.nodeName == tagName || tagName == '*'){
						result[++ri] = n;
					}
				}
			}
		}
		return result;
	};

	function concat(a, b){
		if(b.slice){
			return a.concat(b);
		}
		for(var i = 0, l = b.length; i < l; i++){
			a[a.length] = b[i];
		}
		return a;
	}

	function byTag(cs, tagName){
		if(cs.tagName || cs == document){
			cs = [cs];
		}
		if(!tagName){
			return cs;
		}
		var r = [], ri = -1;
		tagName = tagName.toLowerCase();
		for(var i = 0, ci; ci = cs[i]; i++){
			if(ci.nodeType == 1 && ci.tagName.toLowerCase()==tagName){
				r[++ri] = ci;
			}
		}
		return r;
	};

	function byId(cs, attr, id){
		if(cs.tagName || cs == document){
			cs = [cs];
		}
		if(!id){
			return cs;
		}
		var r = [], ri = -1;
		for(var i = 0,ci; ci = cs[i]; i++){
			if(ci && ci.id == id){
				r[++ri] = ci;
				return r;
			}
		}
		return r;
	};

	function byAttribute(cs, attr, value, op, custom){
		var r = [],
			ri = -1,
			st = custom=="{",
			f = Ext.DomQuery.operators[op];
		for(var i = 0, ci; ci = cs[i]; i++){
			if(ci.nodeType != 1){
				continue;
			}
			var a;
			if(st){
				a = Ext.DomQuery.getStyle(ci, attr);
			}
			else if(attr == "class" || attr == "className"){
				a = ci.className;
			}else if(attr == "for"){
				a = ci.htmlFor;
			}else if(attr == "href"){
				a = ci.getAttribute("href", 2);
			}else{
				a = ci.getAttribute(attr);
			}
			if((f && f(a, value)) || (!f && a)){
				r[++ri] = ci;
			}
		}
		return r;
	};

	function byPseudo(cs, name, value){
		return Ext.DomQuery.pseudos[name](cs, value);
	};

	function nodupIEXml(cs){
		var d = ++key,
			r;
		cs[0].setAttribute("_nodup", d);
		r = [cs[0]];
		for(var i = 1, len = cs.length; i < len; i++){
			var c = cs[i];
			if(!c.getAttribute("_nodup") != d){
				c.setAttribute("_nodup", d);
				r[r.length] = c;
			}
		}
		for(var i = 0, len = cs.length; i < len; i++){
			cs[i].removeAttribute("_nodup");
		}
		return r;
	}

	function nodup(cs){
		if(!cs){
			return [];
		}
		var len = cs.length, c, i, r = cs, cj, ri = -1;
		if(!len || typeof cs.nodeType != "undefined" || len == 1){
			return cs;
		}
		if(isIE && typeof cs[0].selectSingleNode != "undefined"){
			return nodupIEXml(cs);
		}
		var d = ++key;
		cs[0]._nodup = d;
		for(i = 1; c = cs[i]; i++){
			if(c._nodup != d){
				c._nodup = d;
			}else{
				r = [];
				for(var j = 0; j < i; j++){
					r[++ri] = cs[j];
				}
				for(j = i+1; cj = cs[j]; j++){
					if(cj._nodup != d){
						cj._nodup = d;
						r[++ri] = cj;
					}
				}
				return r;
			}
		}
		return r;
	}

	function quickDiffIEXml(c1, c2){
		var d = ++key,
			r = [];
		for(var i = 0, len = c1.length; i < len; i++){
			c1[i].setAttribute("_qdiff", d);
		}
		for(var i = 0, len = c2.length; i < len; i++){
			if(c2[i].getAttribute("_qdiff") != d){
				r[r.length] = c2[i];
			}
		}
		for(var i = 0, len = c1.length; i < len; i++){
			c1[i].removeAttribute("_qdiff");
		}
		return r;
	}

	function quickDiff(c1, c2){
		var len1 = c1.length,
			d = ++key,
			r = [];
		if(!len1){
			return c2;
		}
		if(isIE && typeof c1[0].selectSingleNode != "undefined"){
			return quickDiffIEXml(c1, c2);
		}
		for(var i = 0; i < len1; i++){
			c1[i]._qdiff = d;
		}
		for(var i = 0, len = c2.length; i < len; i++){
			if(c2[i]._qdiff != d){
				r[r.length] = c2[i];
			}
		}
		return r;
	}

	function quickId(ns, mode, root, id){
		if(ns == root){
			var d = root.ownerDocument || root;
			return d.getElementById(id);
		}
		ns = getNodes(ns, mode, "*");
		return byId(ns, null, id);
	}

	return {
		getStyle : function(el, name){
			return Ext.fly(el).getStyle(name);
		},

		compile : function(path, type){
			type = type || "select";

			var fn = ["var f = function(root){\n var mode; ++batch; var n = root || document;\n"],
				q = path, mode, lq,
				tk = Ext.DomQuery.matchers,
				tklen = tk.length,
				mm,

				lmode = q.match(modeRe);

			if(lmode && lmode[1]){
				fn[fn.length] = 'mode="'+lmode[1].replace(trimRe, "")+'";';
				q = q.replace(lmode[1], "");
			}

			while(path.substr(0, 1)=="/"){
				path = path.substr(1);
			}

			while(q && lq != q){
				lq = q;
				var tm = q.match(tagTokenRe);
				if(type == "select"){
					if(tm){
						if(tm[1] == "#"){
							fn[fn.length] = 'n = quickId(n, mode, root, "'+tm[2]+'");';
						}else{
							fn[fn.length] = 'n = getNodes(n, mode, "'+tm[2]+'");';
						}
						q = q.replace(tm[0], "");
					}else if(q.substr(0, 1) != '@'){
						fn[fn.length] = 'n = getNodes(n, mode, "*");';
					}
				}else{
					if(tm){
						if(tm[1] == "#"){
							fn[fn.length] = 'n = byId(n, null, "'+tm[2]+'");';
						}else{
							fn[fn.length] = 'n = byTag(n, "'+tm[2]+'");';
						}
						q = q.replace(tm[0], "");
					}
				}
				while(!(mm = q.match(modeRe))){
					var matched = false;
					for(var j = 0; j < tklen; j++){
						var t = tk[j];
						var m = q.match(t.re);
						if(m){
							fn[fn.length] = t.select.replace(tplRe, function(x, i){
								return m[i];
							});
							q = q.replace(m[0], "");
							matched = true;
							break;
						}
					}

					if(!matched){
						throw 'Error parsing selector, parsing failed at "' + q + '"';
					}
				}
				if(mm[1]){
					fn[fn.length] = 'mode="'+mm[1].replace(trimRe, "")+'";';
					q = q.replace(mm[1], "");
				}
			}
			fn[fn.length] = "return nodup(n);\n}";
			eval(fn.join(""));
			return f;
		},


		select : function(path, root, type){
			if(!root || root == document){
				root = document;
			}
			if(typeof root == "string"){
				root = document.getElementById(root);
			}
			var paths = path.split(","),
				results = [];
			for(var i = 0, len = paths.length; i < len; i++){
				var p = paths[i].replace(trimRe, "");
				if(!cache[p]){
					cache[p] = Ext.DomQuery.compile(p);
					if(!cache[p]){
						throw p + " is not a valid selector";
					}
				}
				var result = cache[p](root);
				if(result && result != document){
					results = results.concat(result);
				}
			}
			if(paths.length > 1){
				return nodup(results);
			}
			return results;
		},


		selectNode : function(path, root){
			return Ext.DomQuery.select(path, root)[0];
		},


		selectValue : function(path, root, defaultValue){
			path = path.replace(trimRe, "");
			if(!valueCache[path]){
				valueCache[path] = Ext.DomQuery.compile(path, "select");
			}
			var n = valueCache[path](root), v;
			n = n[0] ? n[0] : n;

			if (typeof n.normalize == 'function') n.normalize();

			v = (n && n.firstChild ? n.firstChild.nodeValue : null);
			return ((v === null||v === undefined||v==='') ? defaultValue : v);
		},


		selectNumber : function(path, root, defaultValue){
			var v = Ext.DomQuery.selectValue(path, root, defaultValue || 0);
			return parseFloat(v);
		},


		is : function(el, ss){
			if(typeof el == "string"){
				el = document.getElementById(el);
			}
			var isArray = Ext.isArray(el),
				result = Ext.DomQuery.filter(isArray ? el : [el], ss);
			return isArray ? (result.length == el.length) : (result.length > 0);
		},


		filter : function(els, ss, nonMatches){
			ss = ss.replace(trimRe, "");
			if(!simpleCache[ss]){
				simpleCache[ss] = Ext.DomQuery.compile(ss, "simple");
			}
			var result = simpleCache[ss](els);
			return nonMatches ? quickDiff(result, els) : result;
		},


		matchers : [{
			re: /^\.([\w-]+)/,
			select: 'n = byClassName(n, null, " {1} ");'
		}, {
			re: /^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
			select: 'n = byPseudo(n, "{1}", "{2}");'
		},{
			re: /^(?:([\[\{])(?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
			select: 'n = byAttribute(n, "{2}", "{4}", "{3}", "{1}");'
		}, {
			re: /^#([\w-]+)/,
			select: 'n = byId(n, null, "{1}");'
		},{
			re: /^@([\w-]+)/,
			select: 'return {firstChild:{nodeValue:attrValue(n, "{1}")}};'
		}
		],


		operators : {
			"=" : function(a, v){
				return a == v;
			},
			"!=" : function(a, v){
				return a != v;
			},
			"^=" : function(a, v){
				return a && a.substr(0, v.length) == v;
			},
			"$=" : function(a, v){
				return a && a.substr(a.length-v.length) == v;
			},
			"*=" : function(a, v){
				return a && a.indexOf(v) !== -1;
			},
			"%=" : function(a, v){
				return (a % v) == 0;
			},
			"|=" : function(a, v){
				return a && (a == v || a.substr(0, v.length+1) == v+'-');
			},
			"~=" : function(a, v){
				return a && (' '+a+' ').indexOf(' '+v+' ') != -1;
			}
		},


		pseudos : {
			"first-child" : function(c){
				var r = [], ri = -1, n;
				for(var i = 0, ci; ci = n = c[i]; i++){
					while((n = n.previousSibling) && n.nodeType != 1);
					if(!n){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"last-child" : function(c){
				var r = [], ri = -1, n;
				for(var i = 0, ci; ci = n = c[i]; i++){
					while((n = n.nextSibling) && n.nodeType != 1);
					if(!n){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"nth-child" : function(c, a) {
				var r = [], ri = -1,
					m = nthRe.exec(a == "even" && "2n" || a == "odd" && "2n+1" || !nthRe2.test(a) && "n+" + a || a),
					f = (m[1] || 1) - 0, l = m[2] - 0;
				for(var i = 0, n; n = c[i]; i++){
					var pn = n.parentNode;
					if (batch != pn._batch) {
						var j = 0;
						for(var cn = pn.firstChild; cn; cn = cn.nextSibling){
							if(cn.nodeType == 1){
								cn.nodeIndex = ++j;
							}
						}
						pn._batch = batch;
					}
					if (f == 1) {
						if (l == 0 || n.nodeIndex == l){
							r[++ri] = n;
						}
					} else if ((n.nodeIndex + l) % f == 0){
						r[++ri] = n;
					}
				}

				return r;
			},

			"only-child" : function(c){
				var r = [], ri = -1;;
				for(var i = 0, ci; ci = c[i]; i++){
					if(!prev(ci) && !next(ci)){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"empty" : function(c){
				var r = [], ri = -1;
				for(var i = 0, ci; ci = c[i]; i++){
					var cns = ci.childNodes, j = 0, cn, empty = true;
					while(cn = cns[j]){
						++j;
						if(cn.nodeType == 1 || cn.nodeType == 3){
							empty = false;
							break;
						}
					}
					if(empty){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"contains" : function(c, v){
				var r = [], ri = -1;
				for(var i = 0, ci; ci = c[i]; i++){
					if((ci.textContent||ci.innerText||'').indexOf(v) != -1){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"nodeValue" : function(c, v){
				var r = [], ri = -1;
				for(var i = 0, ci; ci = c[i]; i++){
					if(ci.firstChild && ci.firstChild.nodeValue == v){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"checked" : function(c){
				var r = [], ri = -1;
				for(var i = 0, ci; ci = c[i]; i++){
					if(ci.checked == true){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"not" : function(c, ss){
				return Ext.DomQuery.filter(c, ss, true);
			},

			"any" : function(c, selectors){
				var ss = selectors.split('|'),
					r = [], ri = -1, s;
				for(var i = 0, ci; ci = c[i]; i++){
					for(var j = 0; s = ss[j]; j++){
						if(Ext.DomQuery.is(ci, s)){
							r[++ri] = ci;
							break;
						}
					}
				}
				return r;
			},

			"odd" : function(c){
				return this["nth-child"](c, "odd");
			},

			"even" : function(c){
				return this["nth-child"](c, "even");
			},

			"nth" : function(c, a){
				return c[a-1] || [];
			},

			"first" : function(c){
				return c[0] || [];
			},

			"last" : function(c){
				return c[c.length-1] || [];
			},

			"has" : function(c, ss){
				var s = Ext.DomQuery.select,
					r = [], ri = -1;
				for(var i = 0, ci; ci = c[i]; i++){
					if(s(ss, ci).length > 0){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"next" : function(c, ss){
				var is = Ext.DomQuery.is,
					r = [], ri = -1;
				for(var i = 0, ci; ci = c[i]; i++){
					var n = next(ci);
					if(n && is(n, ss)){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"prev" : function(c, ss){
				var is = Ext.DomQuery.is,
					r = [], ri = -1;
				for(var i = 0, ci; ci = c[i]; i++){
					var n = prev(ci);
					if(n && is(n, ss)){
						r[++ri] = ci;
					}
				}
				return r;
			}
		}
	};
}();


Ext.query = Ext.DomQuery.select;

Ext.util.DelayedTask = function(fn, scope, args){
	var me = this,
		id,
		call = function(){
			clearInterval(id);
			id = null;
			fn.apply(scope, args || []);
		};


	me.delay = function(delay, newFn, newScope, newArgs){
		me.cancel();
		fn = newFn || fn;
		scope = newScope || scope;
		args = newArgs || args;
		id = setInterval(call, delay);
	};


	me.cancel = function(){
		if(id){
			clearInterval(id);
			id = null;
		}
	};
};(function(){

	var EXTUTIL = Ext.util,
		TOARRAY = Ext.toArray,
		EACH = Ext.each,
		ISOBJECT = Ext.isObject,
		TRUE = true,
		FALSE = false;

	EXTUTIL.Observable = function(){

		var me = this, e = me.events;
		if(me.listeners){
			me.on(me.listeners);
			delete me.listeners;
		}
		me.events = e || {};
	};

	EXTUTIL.Observable.prototype = {

		filterOptRe : /^(?:scope|delay|buffer|single)$/,


		fireEvent : function(){
			var a = TOARRAY(arguments),
				ename = a[0].toLowerCase(),
				me = this,
				ret = TRUE,
				ce = me.events[ename],
				q,
				c;
			if (me.eventsSuspended === TRUE) {
				if (q = me.eventQueue) {
					q.push(a);
				}
			}
			else if(ISOBJECT(ce) && ce.bubble){
				if(ce.fire.apply(ce, a.slice(1)) === FALSE) {
					return FALSE;
				}
				c = me.getBubbleTarget && me.getBubbleTarget();
				if(c && c.enableBubble) {
					if(!c.events[ename] || !Ext.isObject(c.events[ename]) || !c.events[ename].bubble) {
						c.enableBubble(ename);
					}
					return c.fireEvent.apply(c, a);
				}
			}
			else {
				if (ISOBJECT(ce)) {
					a.shift();
					ret = ce.fire.apply(ce, a);
				}
			}
			return ret;
		},


		addListener : function(eventName, fn, scope, o){
			var me = this,
				e,
				oe,
				isF,
				ce;
			if (ISOBJECT(eventName)) {
				o = eventName;
				for (e in o){
					oe = o[e];
					if (!me.filterOptRe.test(e)) {
						me.addListener(e, oe.fn || oe, oe.scope || o.scope, oe.fn ? oe : o);
					}
				}
			} else {
				eventName = eventName.toLowerCase();
				ce = me.events[eventName] || TRUE;
				if (Ext.isBoolean(ce)) {
					me.events[eventName] = ce = new EXTUTIL.Event(me, eventName);
				}
				ce.addListener(fn, scope, ISOBJECT(o) ? o : {});
			}
		},


		removeListener : function(eventName, fn, scope){
			var ce = this.events[eventName.toLowerCase()];
			if (ISOBJECT(ce)) {
				ce.removeListener(fn, scope);
			}
		},


		purgeListeners : function(){
			var events = this.events,
				evt,
				key;
			for(key in events){
				evt = events[key];
				if(ISOBJECT(evt)){
					evt.clearListeners();
				}
			}
		},


		addEvents : function(o){
			var me = this;
			me.events = me.events || {};
			if (Ext.isString(o)) {
				var a = arguments,
					i = a.length;
				while(i--) {
					me.events[a[i]] = me.events[a[i]] || TRUE;
				}
			} else {
				Ext.applyIf(me.events, o);
			}
		},


		hasListener : function(eventName){
			var e = this.events[eventName];
			return ISOBJECT(e) && e.listeners.length > 0;
		},


		suspendEvents : function(queueSuspended){
			this.eventsSuspended = TRUE;
			if(queueSuspended && !this.eventQueue){
				this.eventQueue = [];
			}
		},


		resumeEvents : function(){
			var me = this,
				queued = me.eventQueue || [];
			me.eventsSuspended = FALSE;
			delete me.eventQueue;
			EACH(queued, function(e) {
				me.fireEvent.apply(me, e);
			});
		}
	};

	var OBSERVABLE = EXTUTIL.Observable.prototype;

	OBSERVABLE.on = OBSERVABLE.addListener;

	OBSERVABLE.un = OBSERVABLE.removeListener;


	EXTUTIL.Observable.releaseCapture = function(o){
		o.fireEvent = OBSERVABLE.fireEvent;
	};

	function createTargeted(h, o, scope){
		return function(){
			if(o.target == arguments[0]){
				h.apply(scope, TOARRAY(arguments));
			}
		};
	};

	function createBuffered(h, o, fn, scope){
		fn.task = new EXTUTIL.DelayedTask();
		return function(){
			fn.task.delay(o.buffer, h, scope, TOARRAY(arguments));
		};
	}

	function createSingle(h, e, fn, scope){
		return function(){
			e.removeListener(fn, scope);
			return h.apply(scope, arguments);
		};
	}

	function createDelayed(h, o, fn, scope){
		return function(){
			var task = new EXTUTIL.DelayedTask();
			if(!fn.tasks) {
				fn.tasks = [];
			}
			fn.tasks.push(task);
			task.delay(o.delay || 10, h, scope, TOARRAY(arguments));
		};
	};

	EXTUTIL.Event = function(obj, name){
		this.name = name;
		this.obj = obj;
		this.listeners = [];
	};

	EXTUTIL.Event.prototype = {
		addListener : function(fn, scope, options){
			var me = this,
				l;
			scope = scope || me.obj;
			if(!me.isListening(fn, scope)){
				l = me.createListener(fn, scope, options);
				if(me.firing){
					me.listeners = me.listeners.slice(0);
				}
				me.listeners.push(l);
			}
		},

		createListener: function(fn, scope, o){
			o = o || {}, scope = scope || this.obj;
			var l = {
				fn: fn,
				scope: scope,
				options: o
			}, h = fn;
			if(o.target){
				h = createTargeted(h, o, scope);
			}
			if(o.delay){
				h = createDelayed(h, o, fn, scope);
			}
			if(o.single){
				h = createSingle(h, this, fn, scope);
			}
			if(o.buffer){
				h = createBuffered(h, o, fn, scope);
			}
			l.fireFn = h;
			return l;
		},

		findListener : function(fn, scope){
			var list = this.listeners,
				i = list.length,
				l,
				s;
			while(i--) {
				l = list[i];
				if(l) {
					s = l.scope;
					if(l.fn == fn && (s == scope || s == this.obj)){
						return i;
					}
				}
			}
			return -1;
		},

		isListening : function(fn, scope){
			return this.findListener(fn, scope) != -1;
		},

		removeListener : function(fn, scope){
			var index,
				l,
				k,
				me = this,
				ret = FALSE;
			if((index = me.findListener(fn, scope)) != -1){
				if (me.firing) {
					me.listeners = me.listeners.slice(0);
				}
				l = me.listeners[index].fn;

				if(l.task) {
					l.task.cancel();
					delete l.task;
				}

				k = l.tasks && l.tasks.length;
				if(k) {
					while(k--) {
						l.tasks[k].cancel();
					}
					delete l.tasks;
				}
				me.listeners.splice(index, 1);
				ret = TRUE;
			}
			return ret;
		},


		clearListeners : function(){
			var me = this,
				l = me.listeners,
				i = l.length;
			while(i--) {
				me.removeListener(l[i].fn, l[i].scope);
			}
		},

		fire : function(){
			var me = this,
				args = TOARRAY(arguments),
				listeners = me.listeners,
				len = listeners.length,
				i = 0,
				l;

			if(len > 0){
				me.firing = TRUE;
				for (; i < len; i++) {
					l = listeners[i];
					if(l && l.fireFn.apply(l.scope || me.obj || window, args) === FALSE) {
						return (me.firing = FALSE);
					}
				}
			}
			me.firing = FALSE;
			return TRUE;
		}
	};
})();
Ext.apply(Ext.util.Observable.prototype, function(){



	function getMethodEvent(method){
		var e = (this.methodEvents = this.methodEvents ||
		{})[method], returnValue, v, cancel, obj = this;

		if (!e) {
			this.methodEvents[method] = e = {};
			e.originalFn = this[method];
			e.methodName = method;
			e.before = [];
			e.after = [];

			var makeCall = function(fn, scope, args){
				if (!Ext.isEmpty(v = fn.apply(scope || obj, args))) {
					if (Ext.isObject(v)) {
						returnValue = !Ext.isEmpty(v.returnValue) ? v.returnValue : v;
						cancel = !!v.cancel;
					}
					else
					if (v === false) {
						cancel = true;
					}
					else {
						returnValue = v;
					}
				}
			};

			this[method] = function(){
				var args = Ext.toArray(arguments);
				returnValue = v = undefined;
				cancel = false;

				Ext.each(e.before, function(b){
					makeCall(b.fn, b.scope, args);
					if (cancel) {
						return returnValue;
					}
				});

				if (!Ext.isEmpty(v = e.originalFn.apply(obj, args))) {
					returnValue = v;
				}
				Ext.each(e.after, function(a){
					makeCall(a.fn, a.scope, args);
					if (cancel) {
						return returnValue;
					}
				});
				return returnValue;
			};
		}
		return e;
	}

	return {



		beforeMethod : function(method, fn, scope){
			getMethodEvent.call(this, method).before.push({
				fn: fn,
				scope: scope
			});
		},


		afterMethod : function(method, fn, scope){
			getMethodEvent.call(this, method).after.push({
				fn: fn,
				scope: scope
			});
		},

		removeMethodListener: function(method, fn, scope){
			var e = getMethodEvent.call(this, method), found = false;
			Ext.each(e.before, function(b, i, arr){
				if (b.fn == fn && b.scope == scope) {
					arr.splice(i, 1);
					found = true;
					return false;
				}
			});
			if (!found) {
				Ext.each(e.after, function(a, i, arr){
					if (a.fn == fn && a.scope == scope) {
						arr.splice(i, 1);
						return false;
					}
				});
			}
		},


		relayEvents : function(o, events){
			var me = this;
			function createHandler(ename){
				return function(){
					return me.fireEvent.apply(me, [ename].concat(Ext.toArray(arguments)));
				};
			}
			Ext.each(events, function(ename){
				me.events[ename] = me.events[ename] || true;
				o.on(ename, createHandler(ename), me);
			});
		},


		enableBubble : function(events){
			var me = this;
			if(!Ext.isEmpty(events)){
				events = Ext.isArray(events) ? events : Ext.toArray(arguments);
				Ext.each(events, function(ename){
					ename = ename.toLowerCase();
					var ce = me.events[ename] || true;
					if (Ext.isBoolean(ce)) {
						ce = new Ext.util.Event(me, ename);
						me.events[ename] = ce;
					}
					ce.bubble = true;
				});
			}
		}
	};
}());



Ext.util.Observable.capture = function(o, fn, scope){
	o.fireEvent = o.fireEvent.createInterceptor(fn, scope);
};



Ext.util.Observable.observeClass = function(c, listeners){
	if(c){
		if(!c.fireEvent){
			Ext.apply(c, new Ext.util.Observable());
			Ext.util.Observable.capture(c.prototype, c.fireEvent, c);
		}
		if(Ext.isObject(listeners)){
			c.on(listeners);
		}
		return c;
	}
};
Ext.EventManager = function(){
	var docReadyEvent,
		docReadyProcId,
		docReadyState = false,
		E = Ext.lib.Event,
		D = Ext.lib.Dom,
		DOC = document,
		WINDOW = window,
		IEDEFERED = "ie-deferred-loader",
		DOMCONTENTLOADED = "DOMContentLoaded",
		propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/,

		specialElCache = [];

	function getId(el){
		var id = false,
			i = 0,
			len = specialElCache.length,
			id = false,
			skip = false,
			o;
		if(el){
			if(el.getElementById || el.navigator){

				for(; i < len; ++i){
					o = specialElCache[i];
					if(o.el === el){
						id = o.id;
						break;
					}
				}
				if(!id){

					id = Ext.id(el);
					specialElCache.push({
						id: id,
						el: el
					});
					skip = true;
				}
			}else{
				id = Ext.id(el);
			}
			if(!Ext.elCache[id]){
				Ext.Element.addToCache(new Ext.Element(el), id);
				if(skip){
					Ext.elCache[id].skipGC = true;
				}
			}
		}
		return id;
	};


	function addListener(el, ename, fn, wrap, scope){
		el = Ext.getDom(el);
		var id = getId(el),
			es = Ext.elCache[id].events,
			wfn;

		wfn = E.on(el, ename, wrap);
		es[ename] = es[ename] || [];
		es[ename].push([fn, wrap, scope, wfn]);



		if(ename == "mousewheel" && el.addEventListener){
			var args = ["DOMMouseScroll", wrap, false];
			el.addEventListener.apply(el, args);
			Ext.EventManager.addListener(WINDOW, 'unload', function(){
				el.removeEventListener.apply(el, args);
			});
		}
		if(ename == "mousedown" && el == document){
			Ext.EventManager.stoppedMouseDownEvent.addListener(wrap);
		}
	};

	function fireDocReady(){
		if(!docReadyState){
			Ext.isReady = docReadyState = true;
			if(docReadyProcId){
				clearInterval(docReadyProcId);
			}
			if(Ext.isGecko || Ext.isOpera) {
				DOC.removeEventListener(DOMCONTENTLOADED, fireDocReady, false);
			}
			if(Ext.isIE){
				var defer = DOC.getElementById(IEDEFERED);
				if(defer){
					defer.onreadystatechange = null;
					defer.parentNode.removeChild(defer);
				}
			}
			if(docReadyEvent){
				docReadyEvent.fire();
				docReadyEvent.listeners = [];
			}
		}
	};

	function initDocReady(){
		var COMPLETE = "complete";

		docReadyEvent = new Ext.util.Event();
		if (Ext.isGecko || Ext.isOpera) {
			DOC.addEventListener(DOMCONTENTLOADED, fireDocReady, false);
		} else if (Ext.isIE){
			DOC.write("<s"+'cript id=' + IEDEFERED + ' defer="defer" src="/'+'/:"></s'+"cript>");
			DOC.getElementById(IEDEFERED).onreadystatechange = function(){
				if(this.readyState == COMPLETE){
					fireDocReady();
				}
			};
		} else if (Ext.isWebKit){
			docReadyProcId = setInterval(function(){
				if(DOC.readyState == COMPLETE) {
					fireDocReady();
				}
			}, 10);
		}

		E.on(WINDOW, "load", fireDocReady);
	};

	function createTargeted(h, o){
		return function(){
			var args = Ext.toArray(arguments);
			if(o.target == Ext.EventObject.setEvent(args[0]).target){
				h.apply(this, args);
			}
		};
	};

	function createBuffered(h, o, fn){
		fn.task = new Ext.util.DelayedTask(h);
		var w = function(e){

			fn.task.delay(o.buffer, h, null, [new Ext.EventObjectImpl(e)]);
		};
		return w;
	};

	function createSingle(h, el, ename, fn, scope){
		return function(e){
			Ext.EventManager.removeListener(el, ename, fn, scope);
			h(e);
		};
	};

	function createDelayed(h, o, fn){
		return function(e){
			var task = new Ext.util.DelayedTask(h);
			if(!fn.tasks) {
				fn.tasks = [];
			}
			fn.tasks.push(task);
			task.delay(o.delay || 10, h, null, [new Ext.EventObjectImpl(e)]);
		};
	};

	function listen(element, ename, opt, fn, scope){
		var o = !Ext.isObject(opt) ? {} : opt,
			el = Ext.getDom(element);

		fn = fn || o.fn;
		scope = scope || o.scope;

		if(!el){
			throw "Error listening for \"" + ename + '\". Element "' + element + '" doesn\'t exist.';
		}
		function h(e){

			if(!Ext){
				return;
			}
			e = Ext.EventObject.setEvent(e);
			var t;
			if (o.delegate) {
				if(!(t = e.getTarget(o.delegate, el))){
					return;
				}
			} else {
				t = e.target;
			}
			if (o.stopEvent) {
				e.stopEvent();
			}
			if (o.preventDefault) {
				e.preventDefault();
			}
			if (o.stopPropagation) {
				e.stopPropagation();
			}
			if (o.normalized) {
				e = e.browserEvent;
			}

			fn.call(scope || el, e, t, o);
		};
		if(o.target){
			h = createTargeted(h, o);
		}
		if(o.delay){
			h = createDelayed(h, o, fn);
		}
		if(o.single){
			h = createSingle(h, el, ename, fn, scope);
		}
		if(o.buffer){
			h = createBuffered(h, o, fn);
		}

		addListener(el, ename, fn, h, scope);
		return h;
	};

	var pub = {

		addListener : function(element, eventName, fn, scope, options){
			if(Ext.isObject(eventName)){
				var o = eventName, e, val;
				for(e in o){
					val = o[e];
					if(!propRe.test(e)){
						if(Ext.isFunction(val)){

							listen(element, e, o, val, o.scope);
						}else{

							listen(element, e, val);
						}
					}
				}
			} else {
				listen(element, eventName, options, fn, scope);
			}
		},


		removeListener : function(el, eventName, fn, scope){
			el = Ext.getDom(el);
			var id = getId(el),
				f = el && (Ext.elCache[id].events)[eventName] || [],
				wrap, i, l, k, wf;

			for (i = 0, len = f.length; i < len; i++) {
				if (Ext.isArray(f[i]) && f[i][0] == fn && (!scope || f[i][2] == scope)) {
					if(fn.task) {
						fn.task.cancel();
						delete fn.task;
					}
					k = fn.tasks && fn.tasks.length;
					if(k) {
						while(k--) {
							fn.tasks[k].cancel();
						}
						delete fn.tasks;
					}
					wf = wrap = f[i][1];
					if (E.extAdapter) {
						wf = f[i][3];
					}
					E.un(el, eventName, wf);
					f.splice(i,1);
					if (f.length === 0) {
						delete Ext.elCache[id].events[eventName];
					}
					for (k in Ext.elCache[id].events) {
						return false;
					}
					Ext.elCache[id].events = {};
					return false;
				}
			}


			if(eventName == "mousewheel" && el.addEventListener && wrap){
				el.removeEventListener("DOMMouseScroll", wrap, false);
			}

			if(eventName == "mousedown" && el == DOC && wrap){
				Ext.EventManager.stoppedMouseDownEvent.removeListener(wrap);
			}
		},


		removeAll : function(el){
			el = Ext.getDom(el);
			var id = getId(el),
				ec = Ext.elCache[id] || {},
				es = ec.events || {},
				f, i, len, ename, fn, k;

			for(ename in es){
				if(es.hasOwnProperty(ename)){
					f = es[ename];
					for (i = 0, len = f.length; i < len; i++) {
						fn = f[i][0];
						if(fn.task) {
							fn.task.cancel();
							delete fn.task;
						}
						if(fn.tasks && (k = fn.tasks.length)) {
							while(k--) {
								fn.tasks[k].cancel();
							}
							delete fn.tasks;
						}
						E.un(el, ename, E.extAdapter ? f[i][3] : f[i][1]);
					}
				}
			}
			if (Ext.elCache[id]) {
				Ext.elCache[id].events = {};
			}
		},

		getListeners : function(el, eventName) {
			el = Ext.getDom(el);
			var id = getId(el),
				ec = Ext.elCache[id] || {},
				es = ec.events || {},
				results = [];
			if (es && es[eventName]) {
				return es[eventName];
			} else {
				return null;
			}
		},

		purgeElement : function(el, recurse, eventName) {
			el = Ext.getDom(el);
			var id = getId(el),
				ec = Ext.elCache[id] || {},
				es = ec.events || {},
				i, f, len;
			if (eventName) {
				if (es && es.hasOwnProperty(eventName)) {
					f = es[eventName];
					for (i = 0, len = f.length; i < len; i++) {
						Ext.EventManager.removeListener(el, eventName, f[i][0]);
					}
				}
			} else {
				Ext.EventManager.removeAll(el);
			}
			if (recurse && el && el.childNodes) {
				for (i = 0, len = el.childNodes.length; i < len; i++) {
					Ext.EventManager.purgeElement(el.childNodes[i], recurse, eventName);
				}
			}
		},

		_unload : function() {
			var el;
			for (el in Ext.elCache) {
				Ext.EventManager.removeAll(el);
			}
		},

		onDocumentReady : function(fn, scope, options){
			if(docReadyState){
				docReadyEvent.addListener(fn, scope, options);
				docReadyEvent.fire();
				docReadyEvent.listeners = [];
			} else {
				if(!docReadyEvent) initDocReady();
				options = options || {};
				options.delay = options.delay || 1;
				docReadyEvent.addListener(fn, scope, options);
			}
		}
	};

	pub.on = pub.addListener;

	pub.un = pub.removeListener;

	pub.stoppedMouseDownEvent = new Ext.util.Event();
	return pub;
}();

Ext.onReady = Ext.EventManager.onDocumentReady;



(function(){

	var initExtCss = function(){

		var bd = document.body || document.getElementsByTagName('body')[0];
		if(!bd){ return false; }
		var cls = [' ',
			Ext.isIE ? "ext-ie " + (Ext.isIE6 ? 'ext-ie6' : (Ext.isIE7 ? 'ext-ie7' : 'ext-ie8'))
				: Ext.isGecko ? "ext-gecko " + (Ext.isGecko2 ? 'ext-gecko2' : 'ext-gecko3')
				: Ext.isOpera ? "ext-opera"
				: Ext.isWebKit ? "ext-webkit" : ""];

		if(Ext.isSafari){
			cls.push("ext-safari " + (Ext.isSafari2 ? 'ext-safari2' : (Ext.isSafari3 ? 'ext-safari3' : 'ext-safari4')));
		}else if(Ext.isChrome){
			cls.push("ext-chrome");
		}

		if(Ext.isMac){
			cls.push("ext-mac");
		}
		if(Ext.isLinux){
			cls.push("ext-linux");
		}

		if(Ext.isStrict || Ext.isBorderBox){
			var p = bd.parentNode;
			if(p){
				p.className += Ext.isStrict ? ' ext-strict' : ' ext-border-box';
			}
		}
		bd.className += cls.join(' ');
		return true;
	}

	if(!initExtCss()){
		Ext.onReady(initExtCss);
	}
})();



Ext.EventObject = function(){
	var E = Ext.lib.Event,

		safariKeys = {
			3 : 13,
			63234 : 37,
			63235 : 39,
			63232 : 38,
			63233 : 40,
			63276 : 33,
			63277 : 34,
			63272 : 46,
			63273 : 36,
			63275 : 35
		},

		btnMap = Ext.isIE ? {1:0,4:1,2:2} :
			(Ext.isWebKit ? {1:0,2:1,3:2} : {0:0,1:1,2:2});

	Ext.EventObjectImpl = function(e){
		if(e){
			this.setEvent(e.browserEvent || e);
		}
	};

	Ext.EventObjectImpl.prototype = {

		setEvent : function(e){
			var me = this;
			if(e == me || (e && e.browserEvent)){
				return e;
			}
			me.browserEvent = e;
			if(e){

				me.button = e.button ? btnMap[e.button] : (e.which ? e.which - 1 : -1);
				if(e.type == 'click' && me.button == -1){
					me.button = 0;
				}
				me.type = e.type;
				me.shiftKey = e.shiftKey;

				me.ctrlKey = e.ctrlKey || e.metaKey || false;
				me.altKey = e.altKey;

				me.keyCode = e.keyCode;
				me.charCode = e.charCode;

				me.target = E.getTarget(e);

				me.xy = E.getXY(e);
			}else{
				me.button = -1;
				me.shiftKey = false;
				me.ctrlKey = false;
				me.altKey = false;
				me.keyCode = 0;
				me.charCode = 0;
				me.target = null;
				me.xy = [0, 0];
			}
			return me;
		},


		stopEvent : function(){
			var me = this;
			if(me.browserEvent){
				if(me.browserEvent.type == 'mousedown'){
					Ext.EventManager.stoppedMouseDownEvent.fire(me);
				}
				E.stopEvent(me.browserEvent);
			}
		},


		preventDefault : function(){
			if(this.browserEvent){
				E.preventDefault(this.browserEvent);
			}
		},


		stopPropagation : function(){
			var me = this;
			if(me.browserEvent){
				if(me.browserEvent.type == 'mousedown'){
					Ext.EventManager.stoppedMouseDownEvent.fire(me);
				}
				E.stopPropagation(me.browserEvent);
			}
		},


		getCharCode : function(){
			return this.charCode || this.keyCode;
		},


		getKey : function(){
			return this.normalizeKey(this.keyCode || this.charCode)
		},


		normalizeKey: function(k){
			return Ext.isSafari ? (safariKeys[k] || k) : k;
		},


		getPageX : function(){
			return this.xy[0];
		},


		getPageY : function(){
			return this.xy[1];
		},


		getXY : function(){
			return this.xy;
		},


		getTarget : function(selector, maxDepth, returnEl){
			return selector ? Ext.fly(this.target).findParent(selector, maxDepth, returnEl) : (returnEl ? Ext.get(this.target) : this.target);
		},


		getRelatedTarget : function(){
			return this.browserEvent ? E.getRelatedTarget(this.browserEvent) : null;
		},


		getWheelDelta : function(){
			var e = this.browserEvent;
			var delta = 0;
			if(e.wheelDelta){
				delta = e.wheelDelta/120;
			}else if(e.detail){
				delta = -e.detail/3;
			}
			return delta;
		},


		within : function(el, related, allowEl){
			if(el){
				var t = this[related ? "getRelatedTarget" : "getTarget"]();
				return t && ((allowEl ? (t == Ext.getDom(el)) : false) || Ext.fly(el).contains(t));
			}
			return false;
		}
	};

	return new Ext.EventObjectImpl();
}();


Ext.apply(Ext.EventManager, function(){
	var resizeEvent,
		resizeTask,
		textEvent,
		textSize,
		D = Ext.lib.Dom,
		propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/,
		curWidth = 0,
		curHeight = 0,



		useKeydown = Ext.isWebKit ?
			Ext.num(navigator.userAgent.match(/AppleWebKit\/(\d+)/)[1]) >= 525 :
			!((Ext.isGecko && !Ext.isWindows) || Ext.isOpera);

	return {

		doResizeEvent: function(){
			var h = D.getViewHeight(),
				w = D.getViewWidth();


			if(curHeight != h || curWidth != w){
				resizeEvent.fire(curWidth = w, curHeight = h);
			}
		},


		onWindowResize : function(fn, scope, options){
			if(!resizeEvent){
				resizeEvent = new Ext.util.Event();
				resizeTask = new Ext.util.DelayedTask(this.doResizeEvent);
				Ext.EventManager.on(window, "resize", this.fireWindowResize, this);
			}
			resizeEvent.addListener(fn, scope, options);
		},


		fireWindowResize : function(){
			if(resizeEvent){
				if((Ext.isIE||Ext.isAir) && resizeTask){
					resizeTask.delay(50);
				}else{
					resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
				}
			}
		},


		onTextResize : function(fn, scope, options){
			if(!textEvent){
				textEvent = new Ext.util.Event();
				var textEl = new Ext.Element(document.createElement('div'));
				textEl.dom.className = 'x-text-resize';
				textEl.dom.innerHTML = 'X';
				textEl.appendTo(document.body);
				textSize = textEl.dom.offsetHeight;
				setInterval(function(){
					if(textEl.dom.offsetHeight != textSize){
						textEvent.fire(textSize, textSize = textEl.dom.offsetHeight);
					}
				}, this.textResizeInterval);
			}
			textEvent.addListener(fn, scope, options);
		},


		removeResizeListener : function(fn, scope){
			if(resizeEvent){
				resizeEvent.removeListener(fn, scope);
			}
		},


		fireResize : function(){
			if(resizeEvent){
				resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
			}
		},


		textResizeInterval : 50,


		ieDeferSrc : false,



		useKeydown: useKeydown
	};
}());

Ext.EventManager.on = Ext.EventManager.addListener;


Ext.apply(Ext.EventObjectImpl.prototype, {

	BACKSPACE: 8,

	TAB: 9,

	NUM_CENTER: 12,

	ENTER: 13,

	RETURN: 13,

	SHIFT: 16,

	CTRL: 17,
	CONTROL : 17,

	ALT: 18,

	PAUSE: 19,

	CAPS_LOCK: 20,

	ESC: 27,

	SPACE: 32,

	PAGE_UP: 33,
	PAGEUP : 33,

	PAGE_DOWN: 34,
	PAGEDOWN : 34,

	END: 35,

	HOME: 36,

	LEFT: 37,

	UP: 38,

	RIGHT: 39,

	DOWN: 40,

	PRINT_SCREEN: 44,

	INSERT: 45,

	DELETE: 46,

	ZERO: 48,

	ONE: 49,

	TWO: 50,

	THREE: 51,

	FOUR: 52,

	FIVE: 53,

	SIX: 54,

	SEVEN: 55,

	EIGHT: 56,

	NINE: 57,

	A: 65,

	B: 66,

	C: 67,

	D: 68,

	E: 69,

	F: 70,

	G: 71,

	H: 72,

	I: 73,

	J: 74,

	K: 75,

	L: 76,

	M: 77,

	N: 78,

	O: 79,

	P: 80,

	Q: 81,

	R: 82,

	S: 83,

	T: 84,

	U: 85,

	V: 86,

	W: 87,

	X: 88,

	Y: 89,

	Z: 90,

	CONTEXT_MENU: 93,

	NUM_ZERO: 96,

	NUM_ONE: 97,

	NUM_TWO: 98,

	NUM_THREE: 99,

	NUM_FOUR: 100,

	NUM_FIVE: 101,

	NUM_SIX: 102,

	NUM_SEVEN: 103,

	NUM_EIGHT: 104,

	NUM_NINE: 105,

	NUM_MULTIPLY: 106,

	NUM_PLUS: 107,

	NUM_MINUS: 109,

	NUM_PERIOD: 110,

	NUM_DIVISION: 111,

	F1: 112,

	F2: 113,

	F3: 114,

	F4: 115,

	F5: 116,

	F6: 117,

	F7: 118,

	F8: 119,

	F9: 120,

	F10: 121,

	F11: 122,

	F12: 123,


	isNavKeyPress : function(){
		var me = this,
			k = this.normalizeKey(me.keyCode);
		return (k >= 33 && k <= 40) ||
			k == me.RETURN ||
			k == me.TAB ||
			k == me.ESC;
	},

	isSpecialKey : function(){
		var k = this.normalizeKey(this.keyCode);
		return (this.type == 'keypress' && this.ctrlKey) ||
			this.isNavKeyPress() ||
			(k == this.BACKSPACE) ||
			(k >= 16 && k <= 20) ||
			(k >= 44 && k <= 45);
	},

	getPoint : function(){
		return new Ext.lib.Point(this.xy[0], this.xy[1]);
	},


	hasModifier : function(){
		return ((this.ctrlKey || this.altKey) || this.shiftKey);
	}
});
(function(){
	var DOC = document;

	Ext.Element = function(element, forceNew){
		var dom = typeof element == "string" ?
				DOC.getElementById(element) : element,
			id;

		if(!dom) return null;

		id = dom.id;

		if(!forceNew && id && Ext.elCache[id]){
			return Ext.elCache[id].el;
		}


		this.dom = dom;


		this.id = id || Ext.id(dom);
	};

	var D = Ext.lib.Dom,
		DH = Ext.DomHelper,
		E = Ext.lib.Event,
		A = Ext.lib.Anim,
		El = Ext.Element,
		EC = Ext.elCache;

	El.prototype = {

		set : function(o, useSet){
			var el = this.dom,
				attr,
				val,
				useSet = (useSet !== false) && !!el.setAttribute;

			for(attr in o){
				if (o.hasOwnProperty(attr)) {
					val = o[attr];
					if (attr == 'style') {
						DH.applyStyles(el, val);
					} else if (attr == 'cls') {
						el.className = val;
					} else if (useSet) {
						el.setAttribute(attr, val);
					} else {
						el[attr] = val;
					}
				}
			}
			return this;
		},


















































		defaultUnit : "px",


		is : function(simpleSelector){
			return Ext.DomQuery.is(this.dom, simpleSelector);
		},


		focus : function(defer,  dom) {
			var me = this,
				dom = dom || me.dom;
			try{
				if(Number(defer)){
					me.focus.defer(defer, null, [null, dom]);
				}else{
					dom.focus();
				}
			}catch(e){}
			return me;
		},


		blur : function() {
			try{
				this.dom.blur();
			}catch(e){}
			return this;
		},


		getValue : function(asNumber){
			var val = this.dom.value;
			return asNumber ? parseInt(val, 10) : val;
		},


		addListener : function(eventName, fn, scope, options){
			Ext.EventManager.on(this.dom,  eventName, fn, scope || this, options);
			return this;
		},


		removeListener : function(eventName, fn, scope){
			Ext.EventManager.removeListener(this.dom,  eventName, fn, scope || this);
			return this;
		},


		removeAllListeners : function(){
			Ext.EventManager.removeAll(this.dom);
			return this;
		},


		purgeAllListeners : function() {
			Ext.EventManager.purgeElement(this, true);
			return this;
		},

		addUnits : function(size){
			if(size === "" || size == "auto" || size === undefined){
				size = size || '';
			} else if(!isNaN(size) || !unitPattern.test(size)){
				size = size + (this.defaultUnit || 'px');
			}
			return size;
		},


		load : function(url, params, cb){
			Ext.Ajax.request(Ext.apply({
				params: params,
				url: url.url || url,
				callback: cb,
				el: this.dom,
				indicatorText: url.indicatorText || ''
			}, Ext.isObject(url) ? url : {}));
			return this;
		},


		isBorderBox : function(){
			return noBoxAdjust[(this.dom.tagName || "").toLowerCase()] || Ext.isBorderBox;
		},


		remove : function(){
			var me = this,
				dom = me.dom;

			if (dom) {
				delete me.dom;
				Ext.removeNode(dom);
			}
		},


		hover : function(overFn, outFn, scope, options){
			var me = this;
			me.on('mouseenter', overFn, scope || me.dom, options);
			me.on('mouseleave', outFn, scope || me.dom, options);
			return me;
		},


		contains : function(el){
			return !el ? false : Ext.lib.Dom.isAncestor(this.dom, el.dom ? el.dom : el);
		},


		getAttributeNS : function(ns, name){
			return this.getAttribute(name, ns);
		},


		getAttribute : Ext.isIE ? function(name, ns){
			var d = this.dom,
				type = typeof d[ns + ":" + name];

			if(['undefined', 'unknown'].indexOf(type) == -1){
				return d[ns + ":" + name];
			}
			return d[name];
		} : function(name, ns){
			var d = this.dom;
			return d.getAttributeNS(ns, name) || d.getAttribute(ns + ":" + name) || d.getAttribute(name) || d[name];
		},


		update : function(html) {
			if (this.dom) {
				this.dom.innerHTML = html;
			}
			return this;
		}
	};

	var ep = El.prototype;

	El.addMethods = function(o){
		Ext.apply(ep, o);
	};


	ep.on = ep.addListener;


	ep.un = ep.removeListener;


	ep.autoBoxAdjust = true;


	var unitPattern = /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,
		docEl;




	El.get = function(el){
		var ex,
			elm,
			id;
		if(!el){ return null; }
		if (typeof el == "string") {
			if (!(elm = DOC.getElementById(el))) {
				return null;
			}
			if (EC[el] && EC[el].el) {
				ex = EC[el].el;
				ex.dom = elm;
			} else {
				ex = El.addToCache(new El(elm));
			}
			return ex;
		} else if (el.tagName) {
			if(!(id = el.id)){
				id = Ext.id(el);
			}
			if (EC[id] && EC[id].el) {
				ex = EC[id].el;
				ex.dom = el;
			} else {
				ex = El.addToCache(new El(el));
			}
			return ex;
		} else if (el instanceof El) {
			if(el != docEl){
				el.dom = DOC.getElementById(el.id) || el.dom;

			}
			return el;
		} else if(el.isComposite) {
			return el;
		} else if(Ext.isArray(el)) {
			return El.select(el);
		} else if(el == DOC) {

			if(!docEl){
				var f = function(){};
				f.prototype = El.prototype;
				docEl = new f();
				docEl.dom = DOC;
			}
			return docEl;
		}
		return null;
	};

	El.addToCache = function(el, id){
		id = id || el.id;
		EC[id] = {
			el:  el,
			data: {},
			events: {}
		};
		return el;
	};


	El.data = function(el, key, value){
		el = El.get(el);
		if (!el) {
			return null;
		}
		var c = EC[el.id].data;
		if(arguments.length == 2){
			return c[key];
		}else{
			return (c[key] = value);
		}
	};




	function garbageCollect(){
		if(!Ext.enableGarbageCollector){
			clearInterval(El.collectorThreadId);
		} else {
			var eid,
				el,
				d,
				o;

			for(eid in EC){
				o = EC[eid];
				if(o.skipGC){
					continue;
				}
				el = o.el;
				d = el.dom;

















				if(!d || !d.parentNode || (!d.offsetParent && !DOC.getElementById(eid))){
					if(Ext.enableListenerCollection){
						Ext.EventManager.removeAll(d);
					}
					delete EC[eid];
				}
			}

			if (Ext.isIE) {
				var t = {};
				for (eid in EC) {
					t[eid] = EC[eid];
				}
				EC = Ext.elCache = t;
			}
		}
	}
	El.collectorThreadId = setInterval(garbageCollect, 30000);

	var flyFn = function(){};
	flyFn.prototype = El.prototype;


	El.Flyweight = function(dom){
		this.dom = dom;
	};

	El.Flyweight.prototype = new flyFn();
	El.Flyweight.prototype.isFlyweight = true;
	El._flyweights = {};


	El.fly = function(el, named){
		var ret = null;
		named = named || '_global';

		if (el = Ext.getDom(el)) {
			(El._flyweights[named] = El._flyweights[named] || new El.Flyweight()).dom = el;
			ret = El._flyweights[named];
		}
		return ret;
	};


	Ext.get = El.get;


	Ext.fly = El.fly;


	var noBoxAdjust = Ext.isStrict ? {
		select:1
	} : {
		input:1, select:1, textarea:1
	};
	if(Ext.isIE || Ext.isGecko){
		noBoxAdjust['button'] = 1;
	}


	Ext.EventManager.on(window, 'unload', function(){
		delete EC;
		delete El._flyweights;
	});
})();

Ext.Element.addMethods({

	swallowEvent : function(eventName, preventDefault){
		var me = this;
		function fn(e){
			e.stopPropagation();
			if(preventDefault){
				e.preventDefault();
			}
		}
		if(Ext.isArray(eventName)){
			Ext.each(eventName, function(e) {
				me.on(e, fn);
			});
			return me;
		}
		me.on(eventName, fn);
		return me;
	},


	relayEvent : function(eventName, observable){
		this.on(eventName, function(e){
			observable.fireEvent(eventName, e);
		});
	},


	clean : function(forceReclean){
		var me = this,
			dom = me.dom,
			n = dom.firstChild,
			ni = -1;

		if(Ext.Element.data(dom, 'isCleaned') && forceReclean !== true){
			return me;
		}

		while(n){
			var nx = n.nextSibling;
			if(n.nodeType == 3 && !/\S/.test(n.nodeValue)){
				dom.removeChild(n);
			}else{
				n.nodeIndex = ++ni;
			}
			n = nx;
		}
		Ext.Element.data(dom, 'isCleaned', true);
		return me;
	},


	load : function(){
		var um = this.getUpdater();
		um.update.apply(um, arguments);
		return this;
	},


	getUpdater : function(){
		return this.updateManager || (this.updateManager = new Ext.Updater(this));
	},


	update : function(html, loadScripts, callback){
		if (!this.dom) {
			return this;
		}
		html = html || "";

		if(loadScripts !== true){
			this.dom.innerHTML = html;
			if(Ext.isFunction(callback)){
				callback();
			}
			return this;
		}

		var id = Ext.id(),
			dom = this.dom;

		html += '<span id="' + id + '"></span>';

		Ext.lib.Event.onAvailable(id, function(){
			var DOC = document,
				hd = DOC.getElementsByTagName("head")[0],
				re = /(?:<script([^>]*)?>)((\n|\r|.)*?)(?:<\/script>)/ig,
				srcRe = /\ssrc=([\'\"])(.*?)\1/i,
				typeRe = /\stype=([\'\"])(.*?)\1/i,
				match,
				attrs,
				srcMatch,
				typeMatch,
				el,
				s;

			while((match = re.exec(html))){
				attrs = match[1];
				srcMatch = attrs ? attrs.match(srcRe) : false;
				if(srcMatch && srcMatch[2]){
					s = DOC.createElement("script");
					s.src = srcMatch[2];
					typeMatch = attrs.match(typeRe);
					if(typeMatch && typeMatch[2]){
						s.type = typeMatch[2];
					}
					hd.appendChild(s);
				}else if(match[2] && match[2].length > 0){
					if(window.execScript) {
						window.execScript(match[2]);
					} else {
						window.eval(match[2]);
					}
				}
			}
			el = DOC.getElementById(id);
			if(el){Ext.removeNode(el);}
			if(Ext.isFunction(callback)){
				callback();
			}
		});
		dom.innerHTML = html.replace(/(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig, "");
		return this;
	},


	removeAllListeners : function(){
		this.removeAnchor();
		Ext.EventManager.removeAll(this.dom);
		return this;
	},


	createProxy : function(config, renderTo, matchBox){
		config = Ext.isObject(config) ? config : {tag : "div", cls: config};

		var me = this,
			proxy = renderTo ? Ext.DomHelper.append(renderTo, config, true) :
				Ext.DomHelper.insertBefore(me.dom, config, true);

		if(matchBox && me.setBox && me.getBox){
			proxy.setBox(me.getBox());
		}
		return proxy;
	}
});

Ext.Element.prototype.getUpdateManager = Ext.Element.prototype.getUpdater;

Ext.Element.addMethods({

	getAnchorXY : function(anchor, local, s){


		anchor = (anchor || "tl").toLowerCase();
		s = s || {};

		var me = this,
			vp = me.dom == document.body || me.dom == document,
			w = s.width || vp ? Ext.lib.Dom.getViewWidth() : me.getWidth(),
			h = s.height || vp ? Ext.lib.Dom.getViewHeight() : me.getHeight(),
			xy,
			r = Math.round,
			o = me.getXY(),
			scroll = me.getScroll(),
			extraX = vp ? scroll.left : !local ? o[0] : 0,
			extraY = vp ? scroll.top : !local ? o[1] : 0,
			hash = {
				c  : [r(w * 0.5), r(h * 0.5)],
				t  : [r(w * 0.5), 0],
				l  : [0, r(h * 0.5)],
				r  : [w, r(h * 0.5)],
				b  : [r(w * 0.5), h],
				tl : [0, 0],
				bl : [0, h],
				br : [w, h],
				tr : [w, 0]
			};

		xy = hash[anchor];
		return [xy[0] + extraX, xy[1] + extraY];
	},


	anchorTo : function(el, alignment, offsets, animate, monitorScroll, callback){
		var me = this,
			dom = me.dom,
			scroll = !Ext.isEmpty(monitorScroll),
			action = function(){
				Ext.fly(dom).alignTo(el, alignment, offsets, animate);
				Ext.callback(callback, Ext.fly(dom));
			},
			anchor = this.getAnchor();


		this.removeAnchor();
		Ext.apply(anchor, {
			fn: action,
			scroll: scroll
		});

		Ext.EventManager.onWindowResize(action, null);

		if(scroll){
			Ext.EventManager.on(window, 'scroll', action, null,
				{buffer: !isNaN(monitorScroll) ? monitorScroll : 50});
		}
		action.call(me);
		return me;
	},


	removeAnchor : function(){
		var me = this,
			anchor = this.getAnchor();

		if(anchor && anchor.fn){
			Ext.EventManager.removeResizeListener(anchor.fn);
			if(anchor.scroll){
				Ext.EventManager.un(window, 'scroll', anchor.fn);
			}
			delete anchor.fn;
		}
		return me;
	},


	getAnchor : function(){
		var data = Ext.Element.data,
			dom = this.dom;
		if (!dom) {
			return;
		}
		var anchor = data(dom, '_anchor');

		if(!anchor){
			anchor = data(dom, '_anchor', {});
		}
		return anchor;
	},


	getAlignToXY : function(el, p, o){
		el = Ext.get(el);

		if(!el || !el.dom){
			throw "Element.alignToXY with an element that doesn't exist";
		}

		o = o || [0,0];
		p = (!p || p == "?" ? "tl-bl?" : (!/-/.test(p) && p !== "" ? "tl-" + p : p || "tl-bl")).toLowerCase();

		var me = this,
			d = me.dom,
			a1,
			a2,
			x,
			y,

			w,
			h,
			r,
			dw = Ext.lib.Dom.getViewWidth() -10,
			dh = Ext.lib.Dom.getViewHeight()-10,
			p1y,
			p1x,
			p2y,
			p2x,
			swapY,
			swapX,
			doc = document,
			docElement = doc.documentElement,
			docBody = doc.body,
			scrollX = (docElement.scrollLeft || docBody.scrollLeft || 0)+5,
			scrollY = (docElement.scrollTop || docBody.scrollTop || 0)+5,
			c = false,
			p1 = "",
			p2 = "",
			m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/);

		if(!m){
			throw "Element.alignTo with an invalid alignment " + p;
		}

		p1 = m[1];
		p2 = m[2];
		c = !!m[3];



		a1 = me.getAnchorXY(p1, true);
		a2 = el.getAnchorXY(p2, false);

		x = a2[0] - a1[0] + o[0];
		y = a2[1] - a1[1] + o[1];

		if(c){
			w = me.getWidth();
			h = me.getHeight();
			r = el.getRegion();



			p1y = p1.charAt(0);
			p1x = p1.charAt(p1.length-1);
			p2y = p2.charAt(0);
			p2x = p2.charAt(p2.length-1);
			swapY = ((p1y=="t" && p2y=="b") || (p1y=="b" && p2y=="t"));
			swapX = ((p1x=="r" && p2x=="l") || (p1x=="l" && p2x=="r"));


			if (x + w > dw + scrollX) {
				x = swapX ? r.left-w : dw+scrollX-w;
			}
			if (x < scrollX) {
				x = swapX ? r.right : scrollX;
			}
			if (y + h > dh + scrollY) {
				y = swapY ? r.top-h : dh+scrollY-h;
			}
			if (y < scrollY){
				y = swapY ? r.bottom : scrollY;
			}
		}
		return [x,y];
	},


	alignTo : function(element, position, offsets, animate){
		var me = this;
		return me.setXY(me.getAlignToXY(element, position, offsets),
			me.preanim && !!animate ? me.preanim(arguments, 3) : false);
	},


	adjustForConstraints : function(xy, parent, offsets){
		return this.getConstrainToXY(parent || document, false, offsets, xy) ||  xy;
	},


	getConstrainToXY : function(el, local, offsets, proposedXY){
		var os = {top:0, left:0, bottom:0, right: 0};

		return function(el, local, offsets, proposedXY){
			el = Ext.get(el);
			offsets = offsets ? Ext.applyIf(offsets, os) : os;

			var vw, vh, vx = 0, vy = 0;
			if(el.dom == document.body || el.dom == document){
				vw =Ext.lib.Dom.getViewWidth();
				vh = Ext.lib.Dom.getViewHeight();
			}else{
				vw = el.dom.clientWidth;
				vh = el.dom.clientHeight;
				if(!local){
					var vxy = el.getXY();
					vx = vxy[0];
					vy = vxy[1];
				}
			}

			var s = el.getScroll();

			vx += offsets.left + s.left;
			vy += offsets.top + s.top;

			vw -= offsets.right;
			vh -= offsets.bottom;

			var vr = vx+vw;
			var vb = vy+vh;

			var xy = proposedXY || (!local ? this.getXY() : [this.getLeft(true), this.getTop(true)]);
			var x = xy[0], y = xy[1];
			var w = this.dom.offsetWidth, h = this.dom.offsetHeight;


			var moved = false;


			if((x + w) > vr){
				x = vr - w;
				moved = true;
			}
			if((y + h) > vb){
				y = vb - h;
				moved = true;
			}

			if(x < vx){
				x = vx;
				moved = true;
			}
			if(y < vy){
				y = vy;
				moved = true;
			}
			return moved ? [x, y] : false;
		};
	}(),

























































	getCenterXY : function(){
		return this.getAlignToXY(document, 'c-c');
	},


	center : function(centerIn){
		return this.alignTo(centerIn || document, 'c-c');
	}
});

Ext.Element.addMethods(function(){
	var PARENTNODE = 'parentNode',
		NEXTSIBLING = 'nextSibling',
		PREVIOUSSIBLING = 'previousSibling',
		DQ = Ext.DomQuery,
		GET = Ext.get;

	return {

		findParent : function(simpleSelector, maxDepth, returnEl){
			var p = this.dom,
				b = document.body,
				depth = 0,
				stopEl;
			if(Ext.isGecko && Object.prototype.toString.call(p) == '[object XULElement]') {
				return null;
			}
			maxDepth = maxDepth || 50;
			if (isNaN(maxDepth)) {
				stopEl = Ext.getDom(maxDepth);
				maxDepth = Number.MAX_VALUE;
			}
			while(p && p.nodeType == 1 && depth < maxDepth && p != b && p != stopEl){
				if(DQ.is(p, simpleSelector)){
					return returnEl ? GET(p) : p;
				}
				depth++;
				p = p.parentNode;
			}
			return null;
		},


		findParentNode : function(simpleSelector, maxDepth, returnEl){
			var p = Ext.fly(this.dom.parentNode, '_internal');
			return p ? p.findParent(simpleSelector, maxDepth, returnEl) : null;
		},


		up : function(simpleSelector, maxDepth){
			return this.findParentNode(simpleSelector, maxDepth, true);
		},


		select : function(selector){
			return Ext.Element.select(selector, this.dom);
		},


		query : function(selector){
			return DQ.select(selector, this.dom);
		},


		child : function(selector, returnDom){
			var n = DQ.selectNode(selector, this.dom);
			return returnDom ? n : GET(n);
		},


		down : function(selector, returnDom){
			var n = DQ.selectNode(" > " + selector, this.dom);
			return returnDom ? n : GET(n);
		},


		parent : function(selector, returnDom){
			return this.matchNode(PARENTNODE, PARENTNODE, selector, returnDom);
		},


		next : function(selector, returnDom){
			return this.matchNode(NEXTSIBLING, NEXTSIBLING, selector, returnDom);
		},


		prev : function(selector, returnDom){
			return this.matchNode(PREVIOUSSIBLING, PREVIOUSSIBLING, selector, returnDom);
		},



		first : function(selector, returnDom){
			return this.matchNode(NEXTSIBLING, 'firstChild', selector, returnDom);
		},


		last : function(selector, returnDom){
			return this.matchNode(PREVIOUSSIBLING, 'lastChild', selector, returnDom);
		},

		matchNode : function(dir, start, selector, returnDom){
			var n = this.dom[start];
			while(n){
				if(n.nodeType == 1 && (!selector || DQ.is(n, selector))){
					return !returnDom ? GET(n) : n;
				}
				n = n[dir];
			}
			return null;
		}
	}
}());
Ext.Element.addMethods({

	select : function(selector, unique){
		return Ext.Element.select(selector, unique, this.dom);
	}
});
Ext.Element.addMethods(
	function() {
		var GETDOM = Ext.getDom,
			GET = Ext.get,
			DH = Ext.DomHelper;

		return {

			appendChild: function(el){
				return GET(el).appendTo(this);
			},


			appendTo: function(el){
				GETDOM(el).appendChild(this.dom);
				return this;
			},


			insertBefore: function(el){
				(el = GETDOM(el)).parentNode.insertBefore(this.dom, el);
				return this;
			},


			insertAfter: function(el){
				(el = GETDOM(el)).parentNode.insertBefore(this.dom, el.nextSibling);
				return this;
			},


			insertFirst: function(el, returnDom){
				el = el || {};
				if(el.nodeType || el.dom || typeof el == 'string'){
					el = GETDOM(el);
					this.dom.insertBefore(el, this.dom.firstChild);
					return !returnDom ? GET(el) : el;
				}else{
					return this.createChild(el, this.dom.firstChild, returnDom);
				}
			},


			replace: function(el){
				el = GET(el);
				this.insertBefore(el);
				el.remove();
				return this;
			},


			replaceWith: function(el){
				var me = this;

				if(el.nodeType || el.dom || typeof el == 'string'){
					el = GETDOM(el);
					me.dom.parentNode.insertBefore(el, me.dom);
				}else{
					el = DH.insertBefore(me.dom, el);
				}

				delete Ext.elCache[me.id];
				Ext.removeNode(me.dom);
				me.id = Ext.id(me.dom = el);
				Ext.Element.addToCache(me.isFlyweight ? new Ext.Element(me.dom) : me);
				return me;
			},


			createChild: function(config, insertBefore, returnDom){
				config = config || {tag:'div'};
				return insertBefore ?
					DH.insertBefore(insertBefore, config, returnDom !== true) :
					DH[!this.dom.firstChild ? 'overwrite' : 'append'](this.dom, config,  returnDom !== true);
			},


			wrap: function(config, returnDom){
				var newEl = DH.insertBefore(this.dom, config || {tag: "div"}, !returnDom);
				newEl.dom ? newEl.dom.appendChild(this.dom) : newEl.appendChild(this.dom);
				return newEl;
			},


			insertHtml : function(where, html, returnEl){
				var el = DH.insertHtml(where, this.dom, html);
				return returnEl ? Ext.get(el) : el;
			}
		}
	}());
Ext.apply(Ext.Element.prototype, function() {
	var GETDOM = Ext.getDom,
		GET = Ext.get,
		DH = Ext.DomHelper;

	return {

		insertSibling: function(el, where, returnDom){
			var me = this,
				rt,
				isAfter = (where || 'before').toLowerCase() == 'after',
				insertEl;

			if(Ext.isArray(el)){
				insertEl = me;
				Ext.each(el, function(e) {
					rt = Ext.fly(insertEl, '_internal').insertSibling(e, where, returnDom);
					if(isAfter){
						insertEl = rt;
					}
				});
				return rt;
			}

			el = el || {};

			if(el.nodeType || el.dom){
				rt = me.dom.parentNode.insertBefore(GETDOM(el), isAfter ? me.dom.nextSibling : me.dom);
				if (!returnDom) {
					rt = GET(rt);
				}
			}else{
				if (isAfter && !me.dom.nextSibling) {
					rt = DH.append(me.dom.parentNode, el, !returnDom);
				} else {
					rt = DH[isAfter ? 'insertAfter' : 'insertBefore'](me.dom, el, !returnDom);
				}
			}
			return rt;
		}
	};
}());
Ext.Element.addMethods(function(){

	var propCache = {},
		camelRe = /(-[a-z])/gi,
		classReCache = {},
		view = document.defaultView,
		propFloat = Ext.isIE ? 'styleFloat' : 'cssFloat',
		opacityRe = /alpha\(opacity=(.*)\)/i,
		trimRe = /^\s+|\s+$/g,
		EL = Ext.Element,
		PADDING = "padding",
		MARGIN = "margin",
		BORDER = "border",
		LEFT = "-left",
		RIGHT = "-right",
		TOP = "-top",
		BOTTOM = "-bottom",
		WIDTH = "-width",
		MATH = Math,
		HIDDEN = 'hidden',
		ISCLIPPED = 'isClipped',
		OVERFLOW = 'overflow',
		OVERFLOWX = 'overflow-x',
		OVERFLOWY = 'overflow-y',
		ORIGINALCLIP = 'originalClip',

		borders = {l: BORDER + LEFT + WIDTH, r: BORDER + RIGHT + WIDTH, t: BORDER + TOP + WIDTH, b: BORDER + BOTTOM + WIDTH},
		paddings = {l: PADDING + LEFT, r: PADDING + RIGHT, t: PADDING + TOP, b: PADDING + BOTTOM},
		margins = {l: MARGIN + LEFT, r: MARGIN + RIGHT, t: MARGIN + TOP, b: MARGIN + BOTTOM},
		data = Ext.Element.data;



	function camelFn(m, a) {
		return a.charAt(1).toUpperCase();
	}

	function chkCache(prop) {
		return propCache[prop] || (propCache[prop] = prop == 'float' ? propFloat : prop.replace(camelRe, camelFn));
	}

	return {

		adjustWidth : function(width) {
			var me = this;
			var isNum = Ext.isNumber(width);
			if(isNum && me.autoBoxAdjust && !me.isBorderBox()){
				width -= (me.getBorderWidth("lr") + me.getPadding("lr"));
			}
			return (isNum && width < 0) ? 0 : width;
		},


		adjustHeight : function(height) {
			var me = this;
			var isNum = Ext.isNumber(height);
			if(isNum && me.autoBoxAdjust && !me.isBorderBox()){
				height -= (me.getBorderWidth("tb") + me.getPadding("tb"));
			}
			return (isNum && height < 0) ? 0 : height;
		},



		addClass : function(className){
			var me = this, i, len, v;
			className = Ext.isArray(className) ? className : [className];
			for (i=0, len = className.length; i < len; i++) {
				v = className[i];
				if (v) {
					me.dom.className += (!me.hasClass(v) && v ? " " + v : "");
				};
			};
			return me;
		},


		radioClass : function(className){
			var cn = this.dom.parentNode.childNodes, v;
			className = Ext.isArray(className) ? className : [className];
			for (var i=0, len = cn.length; i < len; i++) {
				v = cn[i];
				if(v && v.nodeType == 1) {
					Ext.fly(v, '_internal').removeClass(className);
				}
			};
			return this.addClass(className);
		},


		removeClass : function(className){
			var me = this, v;
			className = Ext.isArray(className) ? className : [className];
			if (me.dom && me.dom.className) {
				for (var i=0, len=className.length; i < len; i++) {
					v = className[i];
					if(v) {
						me.dom.className = me.dom.className.replace(
							classReCache[v] = classReCache[v] || new RegExp('(?:^|\\s+)' + v + '(?:\\s+|$)', "g"), " "
						);
					}
				};
			}
			return me;
		},


		toggleClass : function(className){
			return this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
		},


		hasClass : function(className){
			return className && (' '+this.dom.className+' ').indexOf(' '+className+' ') != -1;
		},


		replaceClass : function(oldClassName, newClassName){
			return this.removeClass(oldClassName).addClass(newClassName);
		},

		isStyle : function(style, val) {
			return this.getStyle(style) == val;
		},


		getStyle : function(){
			return view && view.getComputedStyle ?
				function(prop){
					var el = this.dom,
						v,
						cs,
						out,
						display,
						wk = Ext.isWebKit,
						display;

					if(el == document){
						return null;
					}
					prop = chkCache(prop);

					if(wk && /marginRight/.test(prop)){
						display = this.getStyle('display');
						el.style.display = 'inline-block';
					}
					out = (v = el.style[prop]) ? v :
						(cs = view.getComputedStyle(el, "")) ? cs[prop] : null;


					if(wk){
						if(out == 'rgba(0, 0, 0, 0)'){
							out = 'transparent';
						}else if(display){
							el.style.display = display;
						}
					}
					return out;
				} :
				function(prop){
					var el = this.dom,
						m,
						cs;

					if(el == document) return null;
					if (prop == 'opacity') {
						if (el.style.filter.match) {
							if(m = el.style.filter.match(opacityRe)){
								var fv = parseFloat(m[1]);
								if(!isNaN(fv)){
									return fv ? fv / 100 : 0;
								}
							}
						}
						return 1;
					}
					prop = chkCache(prop);
					return el.style[prop] || ((cs = el.currentStyle) ? cs[prop] : null);
				};
		}(),


		getColor : function(attr, defaultValue, prefix){
			var v = this.getStyle(attr),
				color = Ext.isDefined(prefix) ? prefix : '#',
				h;

			if(!v || /transparent|inherit/.test(v)){
				return defaultValue;
			}
			if(/^r/.test(v)){
				Ext.each(v.slice(4, v.length -1).split(','), function(s){
					h = parseInt(s, 10);
					color += (h < 16 ? '0' : '') + h.toString(16);
				});
			}else{
				v = v.replace('#', '');
				color += v.length == 3 ? v.replace(/^(\w)(\w)(\w)$/, '$1$1$2$2$3$3') : v;
			}
			return(color.length > 5 ? color.toLowerCase() : defaultValue);
		},


		setStyle : function(prop, value){
			var tmp,
				style,
				camel;
			if (!Ext.isObject(prop)) {
				tmp = {};
				tmp[prop] = value;
				prop = tmp;
			}
			for (style in prop) {
				value = prop[style];
				style == 'opacity' ?
					this.setOpacity(value) :
					this.dom.style[chkCache(style)] = value;
			}
			return this;
		},


		setOpacity : function(opacity, animate){
			var me = this,
				s = me.dom.style;

			if(!animate || !me.anim){
				if(Ext.isIE){
					var opac = opacity < 1 ? 'alpha(opacity=' + opacity * 100 + ')' : '',
						val = s.filter.replace(opacityRe, '').replace(trimRe, '');

					s.zoom = 1;
					s.filter = val + (val.length > 0 ? ' ' : '') + opac;
				}else{
					s.opacity = opacity;
				}
			}else{
				me.anim({opacity: {to: opacity}}, me.preanim(arguments, 1), null, .35, 'easeIn');
			}
			return me;
		},


		clearOpacity : function(){
			var style = this.dom.style;
			if(Ext.isIE){
				if(!Ext.isEmpty(style.filter)){
					style.filter = style.filter.replace(opacityRe, '').replace(trimRe, '');
				}
			}else{
				style.opacity = style['-moz-opacity'] = style['-khtml-opacity'] = '';
			}
			return this;
		},


		getHeight : function(contentHeight){
			var me = this,
				dom = me.dom,
				hidden = Ext.isIE && me.isStyle('display', 'none'),
				h = MATH.max(dom.offsetHeight, hidden ? 0 : dom.clientHeight) || 0;

			h = !contentHeight ? h : h - me.getBorderWidth("tb") - me.getPadding("tb");
			return h < 0 ? 0 : h;
		},


		getWidth : function(contentWidth){
			var me = this,
				dom = me.dom,
				hidden = Ext.isIE && me.isStyle('display', 'none'),
				w = MATH.max(dom.offsetWidth, hidden ? 0 : dom.clientWidth) || 0;
			w = !contentWidth ? w : w - me.getBorderWidth("lr") - me.getPadding("lr");
			return w < 0 ? 0 : w;
		},


		setWidth : function(width, animate){
			var me = this;
			width = me.adjustWidth(width);
			!animate || !me.anim ?
				me.dom.style.width = me.addUnits(width) :
				me.anim({width : {to : width}}, me.preanim(arguments, 1));
			return me;
		},


		setHeight : function(height, animate){
			var me = this;
			height = me.adjustHeight(height);
			!animate || !me.anim ?
				me.dom.style.height = me.addUnits(height) :
				me.anim({height : {to : height}}, me.preanim(arguments, 1));
			return me;
		},


		getBorderWidth : function(side){
			return this.addStyles(side, borders);
		},


		getPadding : function(side){
			return this.addStyles(side, paddings);
		},


		clip : function(){
			var me = this,
				dom = me.dom;

			if(!data(dom, ISCLIPPED)){
				data(dom, ISCLIPPED, true);
				data(dom, ORIGINALCLIP, {
					o: me.getStyle(OVERFLOW),
					x: me.getStyle(OVERFLOWX),
					y: me.getStyle(OVERFLOWY)
				});
				me.setStyle(OVERFLOW, HIDDEN);
				me.setStyle(OVERFLOWX, HIDDEN);
				me.setStyle(OVERFLOWY, HIDDEN);
			}
			return me;
		},


		unclip : function(){
			var me = this,
				dom = me.dom;

			if(data(dom, ISCLIPPED)){
				data(dom, ISCLIPPED, false);
				var o = data(dom, ORIGINALCLIP);
				if(o.o){
					me.setStyle(OVERFLOW, o.o);
				}
				if(o.x){
					me.setStyle(OVERFLOWX, o.x);
				}
				if(o.y){
					me.setStyle(OVERFLOWY, o.y);
				}
			}
			return me;
		},


		addStyles : function(sides, styles){
			var val = 0,
				m = sides.match(/\w/g),
				s;
			for (var i=0, len=m.length; i<len; i++) {
				s = m[i] && parseInt(this.getStyle(styles[m[i]]), 10);
				if (s) {
					val += MATH.abs(s);
				}
			}
			return val;
		},

		margins : margins
	}
}()
);



Ext.Element.boxMarkup = '<div class="{0}-tl"><div class="{0}-tr"><div class="{0}-tc"></div></div></div><div class="{0}-ml"><div class="{0}-mr"><div class="{0}-mc"></div></div></div><div class="{0}-bl"><div class="{0}-br"><div class="{0}-bc"></div></div></div>';

Ext.Element.addMethods(function(){
	var INTERNAL = "_internal",
		pxMatch = /(\d+)px/;
	return {

		applyStyles : function(style){
			Ext.DomHelper.applyStyles(this.dom, style);
			return this;
		},


		getStyles : function(){
			var ret = {};
			Ext.each(arguments, function(v) {
					ret[v] = this.getStyle(v);
				},
				this);
			return ret;
		},


		getStyleSize : function(){
			var me = this,
				w,
				h,
				d = this.dom,
				s = d.style;
			if(s.width && s.width != 'auto'){
				w = parseInt(s.width, 10);
				if(me.isBorderBox()){
					w -= me.getFrameWidth('lr');
				}
			}
			if(s.height && s.height != 'auto'){
				h = parseInt(s.height, 10);
				if(me.isBorderBox()){
					h -= me.getFrameWidth('tb');
				}
			}
			return {width: w || me.getWidth(true), height: h || me.getHeight(true)};
		},


		setOverflow : function(v){
			var dom = this.dom;
			if(v=='auto' && Ext.isMac && Ext.isGecko2){
				dom.style.overflow = 'hidden';
				(function(){dom.style.overflow = 'auto';}).defer(1);
			}else{
				dom.style.overflow = v;
			}
		},


		boxWrap : function(cls){
			cls = cls || 'x-box';
			var el = Ext.get(this.insertHtml("beforeBegin", "<div class='" + cls + "'>" + String.format(Ext.Element.boxMarkup, cls) + "</div>"));
			Ext.DomQuery.selectNode('.' + cls + '-mc', el.dom).appendChild(this.dom);
			return el;
		},


		setSize : function(width, height, animate){
			var me = this;
			if(Ext.isObject(width)){
				height = width.height;
				width = width.width;
			}
			width = me.adjustWidth(width);
			height = me.adjustHeight(height);
			if(!animate || !me.anim){
				me.dom.style.width = me.addUnits(width);
				me.dom.style.height = me.addUnits(height);
			}else{
				me.anim({width: {to: width}, height: {to: height}}, me.preanim(arguments, 2));
			}
			return me;
		},


		getComputedHeight : function(){
			var me = this,
				h = Math.max(me.dom.offsetHeight, me.dom.clientHeight);
			if(!h){
				h = parseInt(me.getStyle('height'), 10) || 0;
				if(!me.isBorderBox()){
					h += me.getFrameWidth('tb');
				}
			}
			return h;
		},


		getComputedWidth : function(){
			var w = Math.max(this.dom.offsetWidth, this.dom.clientWidth);
			if(!w){
				w = parseInt(this.getStyle('width'), 10) || 0;
				if(!this.isBorderBox()){
					w += this.getFrameWidth('lr');
				}
			}
			return w;
		},


		getFrameWidth : function(sides, onlyContentBox){
			return onlyContentBox && this.isBorderBox() ? 0 : (this.getPadding(sides) + this.getBorderWidth(sides));
		},


		addClassOnOver : function(className){
			this.hover(
				function(){
					Ext.fly(this, INTERNAL).addClass(className);
				},
				function(){
					Ext.fly(this, INTERNAL).removeClass(className);
				}
			);
			return this;
		},


		addClassOnFocus : function(className){
			this.on("focus", function(){
				Ext.fly(this, INTERNAL).addClass(className);
			}, this.dom);
			this.on("blur", function(){
				Ext.fly(this, INTERNAL).removeClass(className);
			}, this.dom);
			return this;
		},


		addClassOnClick : function(className){
			var dom = this.dom;
			this.on("mousedown", function(){
				Ext.fly(dom, INTERNAL).addClass(className);
				var d = Ext.getDoc(),
					fn = function(){
						Ext.fly(dom, INTERNAL).removeClass(className);
						d.removeListener("mouseup", fn);
					};
				d.on("mouseup", fn);
			});
			return this;
		},


		getViewSize : function(contentBox){
			var doc = document,
				me = this,
				d = me.dom,
				extdom = Ext.lib.Dom,
				isDoc = (d == doc || d == doc.body),
				isBB, w, h, tbBorder = 0, lrBorder = 0,
				tbPadding = 0, lrPadding = 0;
			if (isDoc) {
				return { width: extdom.getViewWidth(), height: extdom.getViewHeight() };
			}
			isBB = me.isBorderBox();
			tbBorder = me.getBorderWidth('tb');
			lrBorder = me.getBorderWidth('lr');
			tbPadding = me.getPadding('tb');
			lrPadding = me.getPadding('lr');



			if (w = me.getStyle('width').match(pxMatch)){
				if ((w = parseInt(w[1], 10)) && isBB){

					w -= (lrBorder + lrPadding);
				}
				if (!contentBox){
					w += lrPadding;
				}
			} else {
				if (!(w = d.clientWidth) && (w = d.offsetWidth)){
					w -= lrBorder;
				}
				if (w && contentBox){
					w -= lrPadding;
				}
			}



			if (h = me.getStyle('height').match(pxMatch)){
				if ((h = parseInt(h[1], 10)) && isBB){

					h -= (tbBorder + tbPadding);
				}
				if (!contentBox){
					h += tbPadding;
				}
			} else {
				if (!(h = d.clientHeight) && (h = d.offsetHeight)){
					h -= tbBorder;
				}
				if (h && contentBox){
					h -= tbPadding;
				}
			}

			return {
				width : w,
				height : h
			};
		},


		getSize : function(contentSize){
			return {width: this.getWidth(contentSize), height: this.getHeight(contentSize)};
		},


		repaint : function(){
			var dom = this.dom;
			this.addClass("x-repaint");
			setTimeout(function(){
				Ext.fly(dom).removeClass("x-repaint");
			}, 1);
			return this;
		},


		unselectable : function(){
			this.dom.unselectable = "on";
			return this.swallowEvent("selectstart", true).
				applyStyles("-moz-user-select:none;-khtml-user-select:none;").
				addClass("x-unselectable");
		},


		getMargins : function(side){
			var me = this,
				key,
				hash = {t:"top", l:"left", r:"right", b: "bottom"},
				o = {};

			if (!side) {
				for (key in me.margins){
					o[hash[key]] = parseInt(me.getStyle(me.margins[key]), 10) || 0;
				}
				return o;
			} else {
				return me.addStyles.call(me, side, me.margins);
			}
		}
	};
}());

(function(){
	var D = Ext.lib.Dom,
		LEFT = "left",
		RIGHT = "right",
		TOP = "top",
		BOTTOM = "bottom",
		POSITION = "position",
		STATIC = "static",
		RELATIVE = "relative",
		AUTO = "auto",
		ZINDEX = "z-index";

	Ext.Element.addMethods({

		getX : function(){
			return D.getX(this.dom);
		},


		getY : function(){
			return D.getY(this.dom);
		},


		getXY : function(){
			return D.getXY(this.dom);
		},


		getOffsetsTo : function(el){
			var o = this.getXY(),
				e = Ext.fly(el, '_internal').getXY();
			return [o[0]-e[0],o[1]-e[1]];
		},


		setX : function(x, animate){
			return this.setXY([x, this.getY()], this.animTest(arguments, animate, 1));
		},


		setY : function(y, animate){
			return this.setXY([this.getX(), y], this.animTest(arguments, animate, 1));
		},


		setLeft : function(left){
			this.setStyle(LEFT, this.addUnits(left));
			return this;
		},


		setTop : function(top){
			this.setStyle(TOP, this.addUnits(top));
			return this;
		},


		setRight : function(right){
			this.setStyle(RIGHT, this.addUnits(right));
			return this;
		},


		setBottom : function(bottom){
			this.setStyle(BOTTOM, this.addUnits(bottom));
			return this;
		},


		setXY : function(pos, animate){
			var me = this;
			if(!animate || !me.anim){
				D.setXY(me.dom, pos);
			}else{
				me.anim({points: {to: pos}}, me.preanim(arguments, 1), 'motion');
			}
			return me;
		},


		setLocation : function(x, y, animate){
			return this.setXY([x, y], this.animTest(arguments, animate, 2));
		},


		moveTo : function(x, y, animate){
			return this.setXY([x, y], this.animTest(arguments, animate, 2));
		},


		getLeft : function(local){
			return !local ? this.getX() : parseInt(this.getStyle(LEFT), 10) || 0;
		},


		getRight : function(local){
			var me = this;
			return !local ? me.getX() + me.getWidth() : (me.getLeft(true) + me.getWidth()) || 0;
		},


		getTop : function(local) {
			return !local ? this.getY() : parseInt(this.getStyle(TOP), 10) || 0;
		},


		getBottom : function(local){
			var me = this;
			return !local ? me.getY() + me.getHeight() : (me.getTop(true) + me.getHeight()) || 0;
		},


		position : function(pos, zIndex, x, y){
			var me = this;

			if(!pos && me.isStyle(POSITION, STATIC)){
				me.setStyle(POSITION, RELATIVE);
			} else if(pos) {
				me.setStyle(POSITION, pos);
			}
			if(zIndex){
				me.setStyle(ZINDEX, zIndex);
			}
			if(x || y) me.setXY([x || false, y || false]);
		},


		clearPositioning : function(value){
			value = value || '';
			this.setStyle({
				left : value,
				right : value,
				top : value,
				bottom : value,
				"z-index" : "",
				position : STATIC
			});
			return this;
		},


		getPositioning : function(){
			var l = this.getStyle(LEFT);
			var t = this.getStyle(TOP);
			return {
				"position" : this.getStyle(POSITION),
				"left" : l,
				"right" : l ? "" : this.getStyle(RIGHT),
				"top" : t,
				"bottom" : t ? "" : this.getStyle(BOTTOM),
				"z-index" : this.getStyle(ZINDEX)
			};
		},


		setPositioning : function(pc){
			var me = this,
				style = me.dom.style;

			me.setStyle(pc);

			if(pc.right == AUTO){
				style.right = "";
			}
			if(pc.bottom == AUTO){
				style.bottom = "";
			}

			return me;
		},


		translatePoints : function(x, y){
			y = isNaN(x[1]) ? y : x[1];
			x = isNaN(x[0]) ? x : x[0];
			var me = this,
				relative = me.isStyle(POSITION, RELATIVE),
				o = me.getXY(),
				l = parseInt(me.getStyle(LEFT), 10),
				t = parseInt(me.getStyle(TOP), 10);

			l = !isNaN(l) ? l : (relative ? 0 : me.dom.offsetLeft);
			t = !isNaN(t) ? t : (relative ? 0 : me.dom.offsetTop);

			return {left: (x - o[0] + l), top: (y - o[1] + t)};
		},

		animTest : function(args, animate, i) {
			return !!animate && this.preanim ? this.preanim(args, i) : false;
		}
	});
})();
Ext.Element.addMethods({

	setBox : function(box, adjust, animate){
		var me = this,
			w = box.width,
			h = box.height;
		if((adjust && !me.autoBoxAdjust) && !me.isBorderBox()){
			w -= (me.getBorderWidth("lr") + me.getPadding("lr"));
			h -= (me.getBorderWidth("tb") + me.getPadding("tb"));
		}
		me.setBounds(box.x, box.y, w, h, me.animTest.call(me, arguments, animate, 2));
		return me;
	},


	getBox : function(contentBox, local) {
		var me = this,
			xy,
			left,
			top,
			getBorderWidth = me.getBorderWidth,
			getPadding = me.getPadding,
			l,
			r,
			t,
			b;
		if(!local){
			xy = me.getXY();
		}else{
			left = parseInt(me.getStyle("left"), 10) || 0;
			top = parseInt(me.getStyle("top"), 10) || 0;
			xy = [left, top];
		}
		var el = me.dom, w = el.offsetWidth, h = el.offsetHeight, bx;
		if(!contentBox){
			bx = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: w, height: h};
		}else{
			l = getBorderWidth.call(me, "l") + getPadding.call(me, "l");
			r = getBorderWidth.call(me, "r") + getPadding.call(me, "r");
			t = getBorderWidth.call(me, "t") + getPadding.call(me, "t");
			b = getBorderWidth.call(me, "b") + getPadding.call(me, "b");
			bx = {x: xy[0]+l, y: xy[1]+t, 0: xy[0]+l, 1: xy[1]+t, width: w-(l+r), height: h-(t+b)};
		}
		bx.right = bx.x + bx.width;
		bx.bottom = bx.y + bx.height;
		return bx;
	},


	move : function(direction, distance, animate){
		var me = this,
			xy = me.getXY(),
			x = xy[0],
			y = xy[1],
			left = [x - distance, y],
			right = [x + distance, y],
			top = [x, y - distance],
			bottom = [x, y + distance],
			hash = {
				l :	left,
				left : left,
				r : right,
				right : right,
				t : top,
				top : top,
				up : top,
				b : bottom,
				bottom : bottom,
				down : bottom
			};

		direction = direction.toLowerCase();
		me.moveTo(hash[direction][0], hash[direction][1], me.animTest.call(me, arguments, animate, 2));
	},


	setLeftTop : function(left, top){
		var me = this,
			style = me.dom.style;
		style.left = me.addUnits(left);
		style.top = me.addUnits(top);
		return me;
	},


	getRegion : function(){
		return Ext.lib.Dom.getRegion(this.dom);
	},


	setBounds : function(x, y, width, height, animate){
		var me = this;
		if (!animate || !me.anim) {
			me.setSize(width, height);
			me.setLocation(x, y);
		} else {
			me.anim({points: {to: [x, y]},
					width: {to: me.adjustWidth(width)},
					height: {to: me.adjustHeight(height)}},
				me.preanim(arguments, 4),
				'motion');
		}
		return me;
	},


	setRegion : function(region, animate) {
		return this.setBounds(region.left, region.top, region.right-region.left, region.bottom-region.top, this.animTest.call(this, arguments, animate, 1));
	}
});
Ext.Element.addMethods({

	isScrollable : function(){
		var dom = this.dom;
		return dom.scrollHeight > dom.clientHeight || dom.scrollWidth > dom.clientWidth;
	},


	scrollTo : function(side, value){
		this.dom["scroll" + (/top/i.test(side) ? "Top" : "Left")] = value;
		return this;
	},


	getScroll : function(){
		var d = this.dom,
			doc = document,
			body = doc.body,
			docElement = doc.documentElement,
			l,
			t,
			ret;

		if(d == doc || d == body){
			if(Ext.isIE && Ext.isStrict){
				l = docElement.scrollLeft;
				t = docElement.scrollTop;
			}else{
				l = window.pageXOffset;
				t = window.pageYOffset;
			}
			ret = {left: l || (body ? body.scrollLeft : 0), top: t || (body ? body.scrollTop : 0)};
		}else{
			ret = {left: d.scrollLeft, top: d.scrollTop};
		}
		return ret;
	}
});
Ext.Element.addMethods({

	scrollTo : function(side, value, animate){
		var top = /top/i.test(side),
			me = this,
			dom = me.dom,
			prop;
		if (!animate || !me.anim) {
			prop = 'scroll' + (top ? 'Top' : 'Left'),
				dom[prop] = value;
		}else{
			prop = 'scroll' + (top ? 'Left' : 'Top'),
				me.anim({scroll: {to: top ? [dom[prop], value] : [value, dom[prop]]}},
					me.preanim(arguments, 2), 'scroll');
		}
		return me;
	},


	scrollIntoView : function(container, hscroll){
		var c = Ext.getDom(container) || Ext.getBody().dom,
			el = this.dom,
			o = this.getOffsetsTo(c),
			l = o[0] + c.scrollLeft,
			t = o[1] + c.scrollTop,
			b = t + el.offsetHeight,
			r = l + el.offsetWidth,
			ch = c.clientHeight,
			ct = parseInt(c.scrollTop, 10),
			cl = parseInt(c.scrollLeft, 10),
			cb = ct + ch,
			cr = cl + c.clientWidth;

		if (el.offsetHeight > ch || t < ct) {
			c.scrollTop = t;
		} else if (b > cb){
			c.scrollTop = b-ch;
		}
		c.scrollTop = c.scrollTop;

		if(hscroll !== false){
			if(el.offsetWidth > c.clientWidth || l < cl){
				c.scrollLeft = l;
			}else if(r > cr){
				c.scrollLeft = r - c.clientWidth;
			}
			c.scrollLeft = c.scrollLeft;
		}
		return this;
	},


	scrollChildIntoView : function(child, hscroll){
		Ext.fly(child, '_scrollChildIntoView').scrollIntoView(this, hscroll);
	},


	scroll : function(direction, distance, animate){
		if(!this.isScrollable()){
			return;
		}
		var el = this.dom,
			l = el.scrollLeft, t = el.scrollTop,
			w = el.scrollWidth, h = el.scrollHeight,
			cw = el.clientWidth, ch = el.clientHeight,
			scrolled = false, v,
			hash = {
				l: Math.min(l + distance, w-cw),
				r: v = Math.max(l - distance, 0),
				t: Math.max(t - distance, 0),
				b: Math.min(t + distance, h-ch)
			};
		hash.d = hash.b;
		hash.u = hash.t;

		direction = direction.substr(0, 1);
		if((v = hash[direction]) > -1){
			scrolled = true;
			this.scrollTo(direction == 'l' || direction == 'r' ? 'left' : 'top', v, this.preanim(arguments, 2));
		}
		return scrolled;
	}
});

Ext.Element.VISIBILITY = 1;

Ext.Element.DISPLAY = 2;

Ext.Element.addMethods(function(){
	var VISIBILITY = "visibility",
		DISPLAY = "display",
		HIDDEN = "hidden",
		NONE = "none",
		ORIGINALDISPLAY = 'originalDisplay',
		VISMODE = 'visibilityMode',
		ELDISPLAY = Ext.Element.DISPLAY,
		data = Ext.Element.data,
		getDisplay = function(dom){
			var d = data(dom, ORIGINALDISPLAY);
			if(d === undefined){
				data(dom, ORIGINALDISPLAY, d = '');
			}
			return d;
		},
		getVisMode = function(dom){
			var m = data(dom, VISMODE);
			if(m === undefined){
				data(dom, VISMODE, m = 1)
			}
			return m;
		};

	return {

		originalDisplay : "",
		visibilityMode : 1,


		setVisibilityMode : function(visMode){
			data(this.dom, VISMODE, visMode);
			return this;
		},


		animate : function(args, duration, onComplete, easing, animType){
			this.anim(args, {duration: duration, callback: onComplete, easing: easing}, animType);
			return this;
		},


		anim : function(args, opt, animType, defaultDur, defaultEase, cb){
			animType = animType || 'run';
			opt = opt || {};
			var me = this,
				anim = Ext.lib.Anim[animType](
					me.dom,
					args,
					(opt.duration || defaultDur) || .35,
					(opt.easing || defaultEase) || 'easeOut',
					function(){
						if(cb) cb.call(me);
						if(opt.callback) opt.callback.call(opt.scope || me, me, opt);
					},
					me
				);
			opt.anim = anim;
			return anim;
		},


		preanim : function(a, i){
			return !a[i] ? false : (Ext.isObject(a[i]) ? a[i]: {duration: a[i+1], callback: a[i+2], easing: a[i+3]});
		},


		isVisible : function() {
			return !this.isStyle(VISIBILITY, HIDDEN) && !this.isStyle(DISPLAY, NONE);
		},


		setVisible : function(visible, animate){
			var me = this,
				dom = me.dom,
				isDisplay = getVisMode(this.dom) == ELDISPLAY;

			if (!animate || !me.anim) {
				if(isDisplay){
					me.setDisplayed(visible);
				}else{
					me.fixDisplay();
					dom.style.visibility = visible ? "visible" : HIDDEN;
				}
			}else{

				if(visible){
					me.setOpacity(.01);
					me.setVisible(true);
				}
				me.anim({opacity: { to: (visible?1:0) }},
					me.preanim(arguments, 1),
					null,
					.35,
					'easeIn',
					function(){
						if(!visible){
							dom.style[isDisplay ? DISPLAY : VISIBILITY] = (isDisplay) ? NONE : HIDDEN;
							Ext.fly(dom).setOpacity(1);
						}
					});
			}
			return me;
		},


		toggle : function(animate){
			var me = this;
			me.setVisible(!me.isVisible(), me.preanim(arguments, 0));
			return me;
		},


		setDisplayed : function(value) {
			if(typeof value == "boolean"){
				value = value ? getDisplay(this.dom) : NONE;
			}
			this.setStyle(DISPLAY, value);
			return this;
		},


		fixDisplay : function(){
			var me = this;
			if(me.isStyle(DISPLAY, NONE)){
				me.setStyle(VISIBILITY, HIDDEN);
				me.setStyle(DISPLAY, getDisplay(this.dom));
				if(me.isStyle(DISPLAY, NONE)){
					me.setStyle(DISPLAY, "block");
				}
			}
		},


		hide : function(animate){
			this.setVisible(false, this.preanim(arguments, 0));
			return this;
		},


		show : function(animate){
			this.setVisible(true, this.preanim(arguments, 0));
			return this;
		}
	}
}());
Ext.Element.addMethods(
	function(){
		var VISIBILITY = "visibility",
			DISPLAY = "display",
			HIDDEN = "hidden",
			NONE = "none",
			XMASKED = "x-masked",
			XMASKEDRELATIVE = "x-masked-relative",
			data = Ext.Element.data;

		return {

			isVisible : function(deep) {
				var vis = !this.isStyle(VISIBILITY,HIDDEN) && !this.isStyle(DISPLAY,NONE),
					p = this.dom.parentNode;
				if(deep !== true || !vis){
					return vis;
				}
				while(p && !/body/i.test(p.tagName)){
					if(!Ext.fly(p, '_isVisible').isVisible()){
						return false;
					}
					p = p.parentNode;
				}
				return true;
			},


			isDisplayed : function() {
				return !this.isStyle(DISPLAY, NONE);
			},


			enableDisplayMode : function(display){
				this.setVisibilityMode(Ext.Element.DISPLAY);
				if(!Ext.isEmpty(display)){
					data(this.dom, 'originalDisplay', display);
				}
				return this;
			},


			mask : function(msg, msgCls){
				var me = this,
					dom = me.dom,
					dh = Ext.DomHelper,
					EXTELMASKMSG = "ext-el-mask-msg",
					el,
					mask;

				if(me.getStyle("position") == "static"){
					me.addClass(XMASKEDRELATIVE);
				}
				if((el = data(dom, 'maskMsg'))){
					el.remove();
				}
				if((el = data(dom, 'mask'))){
					el.remove();
				}

				mask = dh.append(dom, {cls : "ext-el-mask"}, true);
				data(dom, 'mask', mask);

				me.addClass(XMASKED);
				mask.setDisplayed(true);
				if(typeof msg == 'string'){
					var mm = dh.append(dom, {cls : EXTELMASKMSG, cn:{tag:'div'}}, true);
					data(dom, 'maskMsg', mm);
					mm.dom.className = msgCls ? EXTELMASKMSG + " " + msgCls : EXTELMASKMSG;
					mm.dom.firstChild.innerHTML = msg;
					mm.setDisplayed(true);
					mm.center(me);
				}
				if(Ext.isIE && !(Ext.isIE7 && Ext.isStrict) && me.getStyle('height') == 'auto'){
					mask.setSize(undefined, me.getHeight());
				}
				return mask;
			},


			unmask : function(){
				var me = this,
					dom = me.dom,
					mask = data(dom, 'mask'),
					maskMsg = data(dom, 'maskMsg');
				if(mask){
					if(maskMsg){
						maskMsg.remove();
						data(dom, 'maskMsg', undefined);
					}
					mask.remove();
					data(dom, 'mask', undefined);
				}
				me.removeClass([XMASKED, XMASKEDRELATIVE]);
			},


			isMasked : function(){
				var m = data(this.dom, 'mask');
				return m && m.isVisible();
			},


			createShim : function(){
				var el = document.createElement('iframe'),
					shim;
				el.frameBorder = '0';
				el.className = 'ext-shim';
				el.src = Ext.SSL_SECURE_URL;
				shim = Ext.get(this.dom.parentNode.insertBefore(el, this.dom));
				shim.autoBoxAdjust = false;
				return shim;
			}
		};
	}());
Ext.Element.addMethods({

	addKeyListener : function(key, fn, scope){
		var config;
		if(!Ext.isObject(key) || Ext.isArray(key)){
			config = {
				key: key,
				fn: fn,
				scope: scope
			};
		}else{
			config = {
				key : key.key,
				shift : key.shift,
				ctrl : key.ctrl,
				alt : key.alt,
				fn: fn,
				scope: scope
			};
		}
		return new Ext.KeyMap(this, config);
	},


	addKeyMap : function(config){
		return new Ext.KeyMap(this, config);
	}
});(function(){

	var NULL = null,
		UNDEFINED = undefined,
		TRUE = true,
		FALSE = false,
		SETX = "setX",
		SETY = "setY",
		SETXY = "setXY",
		LEFT = "left",
		BOTTOM = "bottom",
		TOP = "top",
		RIGHT = "right",
		HEIGHT = "height",
		WIDTH = "width",
		POINTS = "points",
		HIDDEN = "hidden",
		ABSOLUTE = "absolute",
		VISIBLE = "visible",
		MOTION = "motion",
		POSITION = "position",
		EASEOUT = "easeOut",

		flyEl = new Ext.Element.Flyweight(),
		queues = {},
		getObject = function(o){
			return o || {};
		},
		fly = function(dom){
			flyEl.dom = dom;
			flyEl.id = Ext.id(dom);
			return flyEl;
		},

		getQueue = function(id){
			if(!queues[id]){
				queues[id] = [];
			}
			return queues[id];
		},
		setQueue = function(id, value){
			queues[id] = value;
		};


	Ext.enableFx = TRUE;


	Ext.Fx = {



		switchStatements : function(key, fn, argHash){
			return fn.apply(this, argHash[key]);
		},


		slideIn : function(anchor, o){
			o = getObject(o);
			var me = this,
				dom = me.dom,
				st = dom.style,
				xy,
				r,
				b,
				wrap,
				after,
				st,
				args,
				pt,
				bw,
				bh;

			anchor = anchor || "t";

			me.queueFx(o, function(){
				xy = fly(dom).getXY();

				fly(dom).fixDisplay();


				r = fly(dom).getFxRestore();
				b = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: dom.offsetWidth, height: dom.offsetHeight};
				b.right = b.x + b.width;
				b.bottom = b.y + b.height;


				fly(dom).setWidth(b.width).setHeight(b.height);


				wrap = fly(dom).fxWrap(r.pos, o, HIDDEN);

				st.visibility = VISIBLE;
				st.position = ABSOLUTE;


				function after(){
					fly(dom).fxUnwrap(wrap, r.pos, o);
					st.width = r.width;
					st.height = r.height;
					fly(dom).afterFx(o);
				}


				pt = {to: [b.x, b.y]};
				bw = {to: b.width};
				bh = {to: b.height};

				function argCalc(wrap, style, ww, wh, sXY, sXYval, s1, s2, w, h, p){
					var ret = {};
					fly(wrap).setWidth(ww).setHeight(wh);
					if(fly(wrap)[sXY]){
						fly(wrap)[sXY](sXYval);
					}
					style[s1] = style[s2] = "0";
					if(w){
						ret.width = w
					};
					if(h){
						ret.height = h;
					}
					if(p){
						ret.points = p;
					}
					return ret;
				};

				args = fly(dom).switchStatements(anchor.toLowerCase(), argCalc, {
					t  : [wrap, st, b.width, 0, NULL, NULL, LEFT, BOTTOM, NULL, bh, NULL],
					l  : [wrap, st, 0, b.height, NULL, NULL, RIGHT, TOP, bw, NULL, NULL],
					r  : [wrap, st, b.width, b.height, SETX, b.right, LEFT, TOP, NULL, NULL, pt],
					b  : [wrap, st, b.width, b.height, SETY, b.bottom, LEFT, TOP, NULL, bh, pt],
					tl : [wrap, st, 0, 0, NULL, NULL, RIGHT, BOTTOM, bw, bh, pt],
					bl : [wrap, st, 0, 0, SETY, b.y + b.height, RIGHT, TOP, bw, bh, pt],
					br : [wrap, st, 0, 0, SETXY, [b.right, b.bottom], LEFT, TOP, bw, bh, pt],
					tr : [wrap, st, 0, 0, SETX, b.x + b.width, LEFT, BOTTOM, bw, bh, pt]
				});

				st.visibility = VISIBLE;
				fly(wrap).show();

				arguments.callee.anim = fly(wrap).fxanim(args,
					o,
					MOTION,
					.5,
					EASEOUT,
					after);
			});
			return me;
		},


		slideOut : function(anchor, o){
			o = getObject(o);
			var me = this,
				dom = me.dom,
				st = dom.style,
				xy = me.getXY(),
				wrap,
				r,
				b,
				a,
				zero = {to: 0};

			anchor = anchor || "t";

			me.queueFx(o, function(){


				r = fly(dom).getFxRestore();
				b = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: dom.offsetWidth, height: dom.offsetHeight};
				b.right = b.x + b.width;
				b.bottom = b.y + b.height;


				fly(dom).setWidth(b.width).setHeight(b.height);


				wrap = fly(dom).fxWrap(r.pos, o, VISIBLE);

				st.visibility = VISIBLE;
				st.position = ABSOLUTE;
				fly(wrap).setWidth(b.width).setHeight(b.height);

				function after(){
					o.useDisplay ? fly(dom).setDisplayed(FALSE) : fly(dom).hide();
					fly(dom).fxUnwrap(wrap, r.pos, o);
					st.width = r.width;
					st.height = r.height;
					fly(dom).afterFx(o);
				}

				function argCalc(style, s1, s2, p1, v1, p2, v2, p3, v3){
					var ret = {};

					style[s1] = style[s2] = "0";
					ret[p1] = v1;
					if(p2){
						ret[p2] = v2;
					}
					if(p3){
						ret[p3] = v3;
					}

					return ret;
				};

				a = fly(dom).switchStatements(anchor.toLowerCase(), argCalc, {
					t  : [st, LEFT, BOTTOM, HEIGHT, zero],
					l  : [st, RIGHT, TOP, WIDTH, zero],
					r  : [st, LEFT, TOP, WIDTH, zero, POINTS, {to : [b.right, b.y]}],
					b  : [st, LEFT, TOP, HEIGHT, zero, POINTS, {to : [b.x, b.bottom]}],
					tl : [st, RIGHT, BOTTOM, WIDTH, zero, HEIGHT, zero],
					bl : [st, RIGHT, TOP, WIDTH, zero, HEIGHT, zero, POINTS, {to : [b.x, b.bottom]}],
					br : [st, LEFT, TOP, WIDTH, zero, HEIGHT, zero, POINTS, {to : [b.x + b.width, b.bottom]}],
					tr : [st, LEFT, BOTTOM, WIDTH, zero, HEIGHT, zero, POINTS, {to : [b.right, b.y]}]
				});

				arguments.callee.anim = fly(wrap).fxanim(a,
					o,
					MOTION,
					.5,
					EASEOUT,
					after);
			});
			return me;
		},


		puff : function(o){
			o = getObject(o);
			var me = this,
				dom = me.dom,
				st = dom.style,
				width,
				height,
				r;

			me.queueFx(o, function(){
				width = fly(dom).getWidth();
				height = fly(dom).getHeight();
				fly(dom).clearOpacity();
				fly(dom).show();


				r = fly(dom).getFxRestore();

				function after(){
					o.useDisplay ? fly(dom).setDisplayed(FALSE) : fly(dom).hide();
					fly(dom).clearOpacity();
					fly(dom).setPositioning(r.pos);
					st.width = r.width;
					st.height = r.height;
					st.fontSize = '';
					fly(dom).afterFx(o);
				}

				arguments.callee.anim = fly(dom).fxanim({
						width : {to : fly(dom).adjustWidth(width * 2)},
						height : {to : fly(dom).adjustHeight(height * 2)},
						points : {by : [-width * .5, -height * .5]},
						opacity : {to : 0},
						fontSize: {to : 200, unit: "%"}
					},
					o,
					MOTION,
					.5,
					EASEOUT,
					after);
			});
			return me;
		},


		switchOff : function(o){
			o = getObject(o);
			var me = this,
				dom = me.dom,
				st = dom.style,
				r;

			me.queueFx(o, function(){
				fly(dom).clearOpacity();
				fly(dom).clip();


				r = fly(dom).getFxRestore();

				function after(){
					o.useDisplay ? fly(dom).setDisplayed(FALSE) : fly(dom).hide();
					fly(dom).clearOpacity();
					fly(dom).setPositioning(r.pos);
					st.width = r.width;
					st.height = r.height;
					fly(dom).afterFx(o);
				};

				fly(dom).fxanim({opacity : {to : 0.3}},
					NULL,
					NULL,
					.1,
					NULL,
					function(){
						fly(dom).clearOpacity();
						(function(){
							fly(dom).fxanim({
									height : {to : 1},
									points : {by : [0, fly(dom).getHeight() * .5]}
								},
								o,
								MOTION,
								0.3,
								'easeIn',
								after);
						}).defer(100);
					});
			});
			return me;
		},


		highlight : function(color, o){
			o = getObject(o);
			var me = this,
				dom = me.dom,
				attr = o.attr || "backgroundColor",
				a = {},
				restore;

			me.queueFx(o, function(){
				fly(dom).clearOpacity();
				fly(dom).show();

				function after(){
					dom.style[attr] = restore;
					fly(dom).afterFx(o);
				}
				restore = dom.style[attr];
				a[attr] = {from: color || "ffff9c", to: o.endColor || fly(dom).getColor(attr) || "ffffff"};
				arguments.callee.anim = fly(dom).fxanim(a,
					o,
					'color',
					1,
					'easeIn',
					after);
			});
			return me;
		},


		frame : function(color, count, o){
			o = getObject(o);
			var me = this,
				dom = me.dom,
				proxy,
				active;

			me.queueFx(o, function(){
				color = color || '#C3DAF9';
				if(color.length == 6){
					color = '#' + color;
				}
				count = count || 1;
				fly(dom).show();

				var xy = fly(dom).getXY(),
					b = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: dom.offsetWidth, height: dom.offsetHeight},
					queue = function(){
						proxy = fly(document.body || document.documentElement).createChild({
							style:{
								position : ABSOLUTE,
								'z-index': 35000,
								border : '0px solid ' + color
							}
						});
						return proxy.queueFx({}, animFn);
					};


				arguments.callee.anim = {
					isAnimated: true,
					stop: function() {
						count = 0;
						proxy.stopFx();
					}
				};

				function animFn(){
					var scale = Ext.isBorderBox ? 2 : 1;
					active = proxy.anim({
						top : {from : b.y, to : b.y - 20},
						left : {from : b.x, to : b.x - 20},
						borderWidth : {from : 0, to : 10},
						opacity : {from : 1, to : 0},
						height : {from : b.height, to : b.height + 20 * scale},
						width : {from : b.width, to : b.width + 20 * scale}
					},{
						duration: o.duration || 1,
						callback: function() {
							proxy.remove();
							--count > 0 ? queue() : fly(dom).afterFx(o);
						}
					});
					arguments.callee.anim = {
						isAnimated: true,
						stop: function(){
							active.stop();
						}
					};
				};
				queue();
			});
			return me;
		},


		pause : function(seconds){
			var dom = this.dom,
				t;

			this.queueFx({}, function(){
				t = setTimeout(function(){
					fly(dom).afterFx({});
				}, seconds * 1000);
				arguments.callee.anim = {
					isAnimated: true,
					stop: function(){
						clearTimeout(t);
						fly(dom).afterFx({});
					}
				};
			});
			return this;
		},


		fadeIn : function(o){
			o = getObject(o);
			var me = this,
				dom = me.dom,
				to = o.endOpacity || 1;

			me.queueFx(o, function(){
				fly(dom).setOpacity(0);
				fly(dom).fixDisplay();
				dom.style.visibility = VISIBLE;
				arguments.callee.anim = fly(dom).fxanim({opacity:{to:to}},
					o, NULL, .5, EASEOUT, function(){
						if(to == 1){
							fly(dom).clearOpacity();
						}
						fly(dom).afterFx(o);
					});
			});
			return me;
		},


		fadeOut : function(o){
			o = getObject(o);
			var me = this,
				dom = me.dom,
				style = dom.style,
				to = o.endOpacity || 0;

			me.queueFx(o, function(){
				arguments.callee.anim = fly(dom).fxanim({
						opacity : {to : to}},
					o,
					NULL,
					.5,
					EASEOUT,
					function(){
						if(to == 0){
							Ext.Element.data(dom, 'visibilityMode') == Ext.Element.DISPLAY || o.useDisplay ?
								style.display = "none" :
								style.visibility = HIDDEN;

							fly(dom).clearOpacity();
						}
						fly(dom).afterFx(o);
					});
			});
			return me;
		},


		scale : function(w, h, o){
			this.shift(Ext.apply({}, o, {
				width: w,
				height: h
			}));
			return this;
		},


		shift : function(o){
			o = getObject(o);
			var dom = this.dom,
				a = {};

			this.queueFx(o, function(){
				for (var prop in o) {
					if (o[prop] != UNDEFINED) {
						a[prop] = {to : o[prop]};
					}
				}

				a.width ? a.width.to = fly(dom).adjustWidth(o.width) : a;
				a.height ? a.height.to = fly(dom).adjustWidth(o.height) : a;

				if (a.x || a.y || a.xy) {
					a.points = a.xy ||
					{to : [ a.x ? a.x.to : fly(dom).getX(),
						a.y ? a.y.to : fly(dom).getY()]};
				}

				arguments.callee.anim = fly(dom).fxanim(a,
					o,
					MOTION,
					.35,
					EASEOUT,
					function(){
						fly(dom).afterFx(o);
					});
			});
			return this;
		},


		ghost : function(anchor, o){
			o = getObject(o);
			var me = this,
				dom = me.dom,
				st = dom.style,
				a = {opacity: {to: 0}, points: {}},
				pt = a.points,
				r,
				w,
				h;

			anchor = anchor || "b";

			me.queueFx(o, function(){

				r = fly(dom).getFxRestore();
				w = fly(dom).getWidth();
				h = fly(dom).getHeight();

				function after(){
					o.useDisplay ? fly(dom).setDisplayed(FALSE) : fly(dom).hide();
					fly(dom).clearOpacity();
					fly(dom).setPositioning(r.pos);
					st.width = r.width;
					st.height = r.height;
					fly(dom).afterFx(o);
				}

				pt.by = fly(dom).switchStatements(anchor.toLowerCase(), function(v1,v2){ return [v1, v2];}, {
					t  : [0, -h],
					l  : [-w, 0],
					r  : [w, 0],
					b  : [0, h],
					tl : [-w, -h],
					bl : [-w, h],
					br : [w, h],
					tr : [w, -h]
				});

				arguments.callee.anim = fly(dom).fxanim(a,
					o,
					MOTION,
					.5,
					EASEOUT, after);
			});
			return me;
		},


		syncFx : function(){
			var me = this;
			me.fxDefaults = Ext.apply(me.fxDefaults || {}, {
				block : FALSE,
				concurrent : TRUE,
				stopFx : FALSE
			});
			return me;
		},


		sequenceFx : function(){
			var me = this;
			me.fxDefaults = Ext.apply(me.fxDefaults || {}, {
				block : FALSE,
				concurrent : FALSE,
				stopFx : FALSE
			});
			return me;
		},


		nextFx : function(){
			var ef = getQueue(this.dom.id)[0];
			if(ef){
				ef.call(this);
			}
		},


		hasActiveFx : function(){
			return getQueue(this.dom.id)[0];
		},


		stopFx : function(finish){
			var me = this,
				id = me.dom.id;
			if(me.hasActiveFx()){
				var cur = getQueue(id)[0];
				if(cur && cur.anim){
					if(cur.anim.isAnimated){
						setQueue(id, [cur]);
						cur.anim.stop(finish !== undefined ? finish : TRUE);
					}else{
						setQueue(id, []);
					}
				}
			}
			return me;
		},


		beforeFx : function(o){
			if(this.hasActiveFx() && !o.concurrent){
				if(o.stopFx){
					this.stopFx();
					return TRUE;
				}
				return FALSE;
			}
			return TRUE;
		},


		hasFxBlock : function(){
			var q = getQueue(this.dom.id);
			return q && q[0] && q[0].block;
		},


		queueFx : function(o, fn){
			var me = fly(this.dom);
			if(!me.hasFxBlock()){
				Ext.applyIf(o, me.fxDefaults);
				if(!o.concurrent){
					var run = me.beforeFx(o);
					fn.block = o.block;
					getQueue(me.dom.id).push(fn);
					if(run){
						me.nextFx();
					}
				}else{
					fn.call(me);
				}
			}
			return me;
		},


		fxWrap : function(pos, o, vis){
			var dom = this.dom,
				wrap,
				wrapXY;
			if(!o.wrap || !(wrap = Ext.getDom(o.wrap))){
				if(o.fixPosition){
					wrapXY = fly(dom).getXY();
				}
				var div = document.createElement("div");
				div.style.visibility = vis;
				wrap = dom.parentNode.insertBefore(div, dom);
				fly(wrap).setPositioning(pos);
				if(fly(wrap).isStyle(POSITION, "static")){
					fly(wrap).position("relative");
				}
				fly(dom).clearPositioning('auto');
				fly(wrap).clip();
				wrap.appendChild(dom);
				if(wrapXY){
					fly(wrap).setXY(wrapXY);
				}
			}
			return wrap;
		},


		fxUnwrap : function(wrap, pos, o){
			var dom = this.dom;
			fly(dom).clearPositioning();
			fly(dom).setPositioning(pos);
			if(!o.wrap){
				var pn = fly(wrap).dom.parentNode;
				pn.insertBefore(dom, wrap);
				fly(wrap).remove();
			}
		},


		getFxRestore : function(){
			var st = this.dom.style;
			return {pos: this.getPositioning(), width: st.width, height : st.height};
		},


		afterFx : function(o){
			var dom = this.dom,
				id = dom.id;
			if(o.afterStyle){
				fly(dom).setStyle(o.afterStyle);
			}
			if(o.afterCls){
				fly(dom).addClass(o.afterCls);
			}
			if(o.remove == TRUE){
				fly(dom).remove();
			}
			if(o.callback){
				o.callback.call(o.scope, fly(dom));
			}
			if(!o.concurrent){
				getQueue(id).shift();
				fly(dom).nextFx();
			}
		},


		fxanim : function(args, opt, animType, defaultDur, defaultEase, cb){
			animType = animType || 'run';
			opt = opt || {};
			var anim = Ext.lib.Anim[animType](
				this.dom,
				args,
				(opt.duration || defaultDur) || .35,
				(opt.easing || defaultEase) || EASEOUT,
				cb,
				this
			);
			opt.anim = anim;
			return anim;
		}
	};


	Ext.Fx.resize = Ext.Fx.scale;



	Ext.Element.addMethods(Ext.Fx);
})();

Ext.CompositeElementLite = function(els, root){

	this.elements = [];
	this.add(els, root);
	this.el = new Ext.Element.Flyweight();
};

Ext.CompositeElementLite.prototype = {
	isComposite: true,


	getElement : function(el){

		var e = this.el;
		e.dom = el;
		e.id = el.id;
		return e;
	},


	transformElement : function(el){
		return Ext.getDom(el);
	},


	getCount : function(){
		return this.elements.length;
	},

	add : function(els, root){
		var me = this,
			elements = me.elements;
		if(!els){
			return this;
		}
		if(Ext.isString(els)){
			els = Ext.Element.selectorFunction(els, root);
		}else if(els.isComposite){
			els = els.elements;
		}else if(!Ext.isIterable(els)){
			els = [els];
		}

		for(var i = 0, len = els.length; i < len; ++i){
			elements.push(me.transformElement(els[i]));
		}
		return me;
	},

	invoke : function(fn, args){
		var me = this,
			els = me.elements,
			len = els.length,
			e;

		for(i = 0; i<len; i++) {
			e = els[i];
			if(e){
				Ext.Element.prototype[fn].apply(me.getElement(e), args);
			}
		}
		return me;
	},

	item : function(index){
		var me = this,
			el = me.elements[index],
			out = null;

		if(el){
			out = me.getElement(el);
		}
		return out;
	},


	addListener : function(eventName, handler, scope, opt){
		var els = this.elements,
			len = els.length,
			i, e;

		for(i = 0; i<len; i++) {
			e = els[i];
			if(e) {
				Ext.EventManager.on(e, eventName, handler, scope || e, opt);
			}
		}
		return this;
	},

	each : function(fn, scope){
		var me = this,
			els = me.elements,
			len = els.length,
			i, e;

		for(i = 0; i<len; i++) {
			e = els[i];
			if(e){
				e = this.getElement(e);
				if(fn.call(scope || e, e, me, i)){
					break;
				}
			}
		}
		return me;
	},


	fill : function(els){
		var me = this;
		me.elements = [];
		me.add(els);
		return me;
	},


	filter : function(selector){
		var els = [],
			me = this,
			elements = me.elements,
			fn = Ext.isFunction(selector) ? selector
				: function(el){
				return el.is(selector);
			};


		me.each(function(el, self, i){
			if(fn(el, i) !== false){
				els[els.length] = me.transformElement(el);
			}
		});
		me.elements = els;
		return me;
	},


	indexOf : function(el){
		return this.elements.indexOf(this.transformElement(el));
	},


	replaceElement : function(el, replacement, domReplace){
		var index = !isNaN(el) ? el : this.indexOf(el),
			d;
		if(index > -1){
			replacement = Ext.getDom(replacement);
			if(domReplace){
				d = this.elements[index];
				d.parentNode.insertBefore(replacement, d);
				Ext.removeNode(d);
			}
			this.elements.splice(index, 1, replacement);
		}
		return this;
	},


	clear : function(){
		this.elements = [];
	}
};

Ext.CompositeElementLite.prototype.on = Ext.CompositeElementLite.prototype.addListener;

(function(){
	var fnName,
		ElProto = Ext.Element.prototype,
		CelProto = Ext.CompositeElementLite.prototype;

	for(fnName in ElProto){
		if(Ext.isFunction(ElProto[fnName])){
			(function(fnName){
				CelProto[fnName] = CelProto[fnName] || function(){
					return this.invoke(fnName, arguments);
				};
			}).call(CelProto, fnName);

		}
	}
})();

if(Ext.DomQuery){
	Ext.Element.selectorFunction = Ext.DomQuery.select;
}


Ext.Element.select = function(selector, root){
	var els;
	if(typeof selector == "string"){
		els = Ext.Element.selectorFunction(selector, root);
	}else if(selector.length !== undefined){
		els = selector;
	}else{
		throw "Invalid selector";
	}
	return new Ext.CompositeElementLite(els);
};

Ext.select = Ext.Element.select;
Ext.apply(Ext.CompositeElementLite.prototype, {
	addElements : function(els, root){
		if(!els){
			return this;
		}
		if(typeof els == "string"){
			els = Ext.Element.selectorFunction(els, root);
		}
		var yels = this.elements;
		Ext.each(els, function(e) {
			yels.push(Ext.get(e));
		});
		return this;
	},


	first : function(){
		return this.item(0);
	},


	last : function(){
		return this.item(this.getCount()-1);
	},


	contains : function(el){
		return this.indexOf(el) != -1;
	},


	removeElement : function(keys, removeDom){
		var me = this,
			els = this.elements,
			el;
		Ext.each(keys, function(val){
			if ((el = (els[val] || els[val = me.indexOf(val)]))) {
				if(removeDom){
					if(el.dom){
						el.remove();
					}else{
						Ext.removeNode(el);
					}
				}
				els.splice(val, 1);
			}
		});
		return this;
	}
});

Ext.CompositeElement = function(els, root){
	this.elements = [];
	this.add(els, root);
};

Ext.extend(Ext.CompositeElement, Ext.CompositeElementLite, {


	getElement : function(el){

		return el;
	},


	transformElement : function(el){
		return Ext.get(el);
	}






});


Ext.Element.select = function(selector, unique, root){
	var els;
	if(typeof selector == "string"){
		els = Ext.Element.selectorFunction(selector, root);
	}else if(selector.length !== undefined){
		els = selector;
	}else{
		throw "Invalid selector";
	}

	return (unique === true) ? new Ext.CompositeElement(els) : new Ext.CompositeElementLite(els);
};


Ext.select = Ext.Element.select;(function(){
	var BEFOREREQUEST = "beforerequest",
		REQUESTCOMPLETE = "requestcomplete",
		REQUESTEXCEPTION = "requestexception",
		UNDEFINED = undefined,
		LOAD = 'load',
		POST = 'POST',
		GET = 'GET',
		WINDOW = window;


	Ext.data.Connection = function(config){
		Ext.apply(this, config);
		this.addEvents(

			BEFOREREQUEST,

			REQUESTCOMPLETE,

			REQUESTEXCEPTION
		);
		Ext.data.Connection.superclass.constructor.call(this);
	};

	Ext.extend(Ext.data.Connection, Ext.util.Observable, {





		timeout : 30000,

		autoAbort:false,


		disableCaching: true,


		disableCachingParam: '_dc',


		request : function(o){
			var me = this;
			if(me.fireEvent(BEFOREREQUEST, me, o)){
				if (o.el) {
					if(!Ext.isEmpty(o.indicatorText)){
						me.indicatorText = '<div class="loading-indicator">'+o.indicatorText+"</div>";
					}
					if(me.indicatorText) {
						Ext.getDom(o.el).innerHTML = me.indicatorText;
					}
					o.success = (Ext.isFunction(o.success) ? o.success : function(){}).createInterceptor(function(response) {
						Ext.getDom(o.el).innerHTML = response.responseText;
					});
				}

				var p = o.params,
					url = o.url || me.url,
					method,
					cb = {success: me.handleResponse,
						failure: me.handleFailure,
						scope: me,
						argument: {options: o},
						timeout : o.timeout || me.timeout
					},
					form,
					serForm;


				if (Ext.isFunction(p)) {
					p = p.call(o.scope||WINDOW, o);
				}

				p = Ext.urlEncode(me.extraParams, Ext.isObject(p) ? Ext.urlEncode(p) : p);

				if (Ext.isFunction(url)) {
					url = url.call(o.scope || WINDOW, o);
				}

				if((form = Ext.getDom(o.form))){
					url = url || form.action;
					if(o.isUpload || /multipart\/form-data/i.test(form.getAttribute("enctype"))) {
						return me.doFormUpload.call(me, o, p, url);
					}
					serForm = Ext.lib.Ajax.serializeForm(form);
					p = p ? (p + '&' + serForm) : serForm;
				}

				method = o.method || me.method || ((p || o.xmlData || o.jsonData) ? POST : GET);

				if(method === GET && (me.disableCaching && o.disableCaching !== false) || o.disableCaching === true){
					var dcp = o.disableCachingParam || me.disableCachingParam;
					url = Ext.urlAppend(url, dcp + '=' + (new Date().getTime()));
				}

				o.headers = Ext.apply(o.headers || {}, me.defaultHeaders || {});

				if(o.autoAbort === true || me.autoAbort) {
					me.abort();
				}

				if((method == GET || o.xmlData || o.jsonData) && p){
					url = Ext.urlAppend(url, p);
					p = '';
				}
				return (me.transId = Ext.lib.Ajax.request(method, url, cb, p, o));
			}else{
				return o.callback ? o.callback.apply(o.scope, [o,UNDEFINED,UNDEFINED]) : null;
			}
		},


		isLoading : function(transId){
			return transId ? Ext.lib.Ajax.isCallInProgress(transId) : !! this.transId;
		},


		abort : function(transId){
			if(transId || this.isLoading()){
				Ext.lib.Ajax.abort(transId || this.transId);
			}
		},


		handleResponse : function(response){
			this.transId = false;
			var options = response.argument.options;
			response.argument = options ? options.argument : null;
			this.fireEvent(REQUESTCOMPLETE, this, response, options);
			if(options.success){
				options.success.call(options.scope, response, options);
			}
			if(options.callback){
				options.callback.call(options.scope, options, true, response);
			}
		},


		handleFailure : function(response, e){
			this.transId = false;
			var options = response.argument.options;
			response.argument = options ? options.argument : null;
			this.fireEvent(REQUESTEXCEPTION, this, response, options, e);
			if(options.failure){
				options.failure.call(options.scope, response, options);
			}
			if(options.callback){
				options.callback.call(options.scope, options, false, response);
			}
		},


		doFormUpload : function(o, ps, url){
			var id = Ext.id(),
				doc = document,
				frame = doc.createElement('iframe'),
				form = Ext.getDom(o.form),
				hiddens = [],
				hd,
				encoding = 'multipart/form-data',
				buf = {
					target: form.target,
					method: form.method,
					encoding: form.encoding,
					enctype: form.enctype,
					action: form.action
				};

			Ext.fly(frame).set({
				id: id,
				name: id,
				cls: 'x-hidden',
				src: Ext.SSL_SECURE_URL
			});
			doc.body.appendChild(frame);


			if(Ext.isIE){
				document.frames[id].name = id;
			}

			Ext.fly(form).set({
				target: id,
				method: POST,
				enctype: encoding,
				encoding: encoding,
				action: url || buf.action
			});


			Ext.iterate(Ext.urlDecode(ps, false), function(k, v){
				hd = doc.createElement('input');
				Ext.fly(hd).set({
					type: 'hidden',
					value: v,
					name: k
				});
				form.appendChild(hd);
				hiddens.push(hd);
			});

			function cb(){
				var me = this,

					r = {responseText : '',
						responseXML : null,
						argument : o.argument},
					doc,
					firstChild;

				try{
					doc = frame.contentWindow.document || frame.contentDocument || WINDOW.frames[id].document;
					if(doc){
						if(doc.body){
							if(/textarea/i.test((firstChild = doc.body.firstChild || {}).tagName)){
								r.responseText = firstChild.value;
							}else{
								r.responseText = doc.body.innerHTML;
							}
						}

						r.responseXML = doc.XMLDocument || doc;
					}
				}
				catch(e) {}

				Ext.EventManager.removeListener(frame, LOAD, cb, me);

				me.fireEvent(REQUESTCOMPLETE, me, r, o);

				function runCallback(fn, scope, args){
					if(Ext.isFunction(fn)){
						fn.apply(scope, args);
					}
				}

				runCallback(o.success, o.scope, [r, o]);
				runCallback(o.callback, o.scope, [o, true, r]);

				if(!me.debugUploads){
					setTimeout(function(){Ext.removeNode(frame);}, 100);
				}
			}

			Ext.EventManager.on(frame, LOAD, cb, this);
			form.submit();

			Ext.fly(form).set(buf);
			Ext.each(hiddens, function(h) {
				Ext.removeNode(h);
			});
		}
	});
})();


Ext.Ajax = new Ext.data.Connection({

















	autoAbort : false,


	serializeForm : function(form){
		return Ext.lib.Ajax.serializeForm(form);
	}
});

Ext.UpdateManager = Ext.Updater = Ext.extend(Ext.util.Observable,
	function() {
		var BEFOREUPDATE = "beforeupdate",
			UPDATE = "update",
			FAILURE = "failure";


		function processSuccess(response){
			var me = this;
			me.transaction = null;
			if (response.argument.form && response.argument.reset) {
				try {
					response.argument.form.reset();
				} catch(e){}
			}
			if (me.loadScripts) {
				me.renderer.render(me.el, response, me,
					updateComplete.createDelegate(me, [response]));
			} else {
				me.renderer.render(me.el, response, me);
				updateComplete.call(me, response);
			}
		}


		function updateComplete(response, type, success){
			this.fireEvent(type || UPDATE, this.el, response);
			if(Ext.isFunction(response.argument.callback)){
				response.argument.callback.call(response.argument.scope, this.el, Ext.isEmpty(success) ? true : false, response, response.argument.options);
			}
		}


		function processFailure(response){
			updateComplete.call(this, response, FAILURE, !!(this.transaction = null));
		}

		return {
			constructor: function(el, forceNew){
				var me = this;
				el = Ext.get(el);
				if(!forceNew && el.updateManager){
					return el.updateManager;
				}

				me.el = el;

				me.defaultUrl = null;

				me.addEvents(

					BEFOREUPDATE,

					UPDATE,

					FAILURE
				);

				Ext.apply(me, Ext.Updater.defaults);








				me.transaction = null;

				me.refreshDelegate = me.refresh.createDelegate(me);

				me.updateDelegate = me.update.createDelegate(me);

				me.formUpdateDelegate = (me.formUpdate || function(){}).createDelegate(me);


				me.renderer = me.renderer || me.getDefaultRenderer();

				Ext.Updater.superclass.constructor.call(me);
			},


			setRenderer : function(renderer){
				this.renderer = renderer;
			},


			getRenderer : function(){
				return this.renderer;
			},


			getDefaultRenderer: function() {
				return new Ext.Updater.BasicRenderer();
			},


			setDefaultUrl : function(defaultUrl){
				this.defaultUrl = defaultUrl;
			},


			getEl : function(){
				return this.el;
			},


			update : function(url, params, callback, discardUrl){
				var me = this,
					cfg,
					callerScope;

				if(me.fireEvent(BEFOREUPDATE, me.el, url, params) !== false){
					if(Ext.isObject(url)){
						cfg = url;
						url = cfg.url;
						params = params || cfg.params;
						callback = callback || cfg.callback;
						discardUrl = discardUrl || cfg.discardUrl;
						callerScope = cfg.scope;
						if(!Ext.isEmpty(cfg.nocache)){me.disableCaching = cfg.nocache;};
						if(!Ext.isEmpty(cfg.text)){me.indicatorText = '<div class="loading-indicator">'+cfg.text+"</div>";};
						if(!Ext.isEmpty(cfg.scripts)){me.loadScripts = cfg.scripts;};
						if(!Ext.isEmpty(cfg.timeout)){me.timeout = cfg.timeout;};
					}
					me.showLoading();

					if(!discardUrl){
						me.defaultUrl = url;
					}
					if(Ext.isFunction(url)){
						url = url.call(me);
					}

					var o = Ext.apply({}, {
						url : url,
						params: (Ext.isFunction(params) && callerScope) ? params.createDelegate(callerScope) : params,
						success: processSuccess,
						failure: processFailure,
						scope: me,
						callback: undefined,
						timeout: (me.timeout*1000),
						disableCaching: me.disableCaching,
						argument: {
							"options": cfg,
							"url": url,
							"form": null,
							"callback": callback,
							"scope": callerScope || window,
							"params": params
						}
					}, cfg);

					me.transaction = Ext.Ajax.request(o);
				}
			},


			formUpdate : function(form, url, reset, callback){
				var me = this;
				if(me.fireEvent(BEFOREUPDATE, me.el, form, url) !== false){
					if(Ext.isFunction(url)){
						url = url.call(me);
					}
					form = Ext.getDom(form)
					me.transaction = Ext.Ajax.request({
						form: form,
						url:url,
						success: processSuccess,
						failure: processFailure,
						scope: me,
						timeout: (me.timeout*1000),
						argument: {
							"url": url,
							"form": form,
							"callback": callback,
							"reset": reset
						}
					});
					me.showLoading.defer(1, me);
				}
			},


			startAutoRefresh : function(interval, url, params, callback, refreshNow){
				var me = this;
				if(refreshNow){
					me.update(url || me.defaultUrl, params, callback, true);
				}
				if(me.autoRefreshProcId){
					clearInterval(me.autoRefreshProcId);
				}
				me.autoRefreshProcId = setInterval(me.update.createDelegate(me, [url || me.defaultUrl, params, callback, true]), interval * 1000);
			},


			stopAutoRefresh : function(){
				if(this.autoRefreshProcId){
					clearInterval(this.autoRefreshProcId);
					delete this.autoRefreshProcId;
				}
			},


			isAutoRefreshing : function(){
				return !!this.autoRefreshProcId;
			},


			showLoading : function(){
				if(this.showLoadIndicator){
					this.el.dom.innerHTML = this.indicatorText;
				}
			},


			abort : function(){
				if(this.transaction){
					Ext.Ajax.abort(this.transaction);
				}
			},


			isUpdating : function(){
				return this.transaction ? Ext.Ajax.isLoading(this.transaction) : false;
			},


			refresh : function(callback){
				if(this.defaultUrl){
					this.update(this.defaultUrl, null, callback, true);
				}
			}
		}
	}());


Ext.Updater.defaults = {

	timeout : 30,

	disableCaching : false,

	showLoadIndicator : true,

	indicatorText : '<div class="loading-indicator">Loading...</div>',

	loadScripts : false,

	sslBlankUrl : Ext.SSL_SECURE_URL
};



Ext.Updater.updateElement = function(el, url, params, options){
	var um = Ext.get(el).getUpdater();
	Ext.apply(um, options);
	um.update(url, params, options ? options.callback : null);
};


Ext.Updater.BasicRenderer = function(){};

Ext.Updater.BasicRenderer.prototype = {

	render : function(el, response, updateManager, callback){
		el.update(response.responseText, updateManager.loadScripts, callback);
	}
};



(function() {


	Date.useStrict = false;





	function xf(format) {
		var args = Array.prototype.slice.call(arguments, 1);
		return format.replace(/\{(\d+)\}/g, function(m, i) {
			return args[i];
		});
	}



	Date.formatCodeToRegex = function(character, currentGroup) {

		var p = Date.parseCodes[character];

		if (p) {
			p = typeof p == 'function'? p() : p;
			Date.parseCodes[character] = p;
		}

		return p? Ext.applyIf({
			c: p.c? xf(p.c, currentGroup || "{0}") : p.c
		}, p) : {
			g:0,
			c:null,
			s:Ext.escapeRe(character)
		}
	}


	var $f = Date.formatCodeToRegex;

	Ext.apply(Date, {

		parseFunctions: {
			"M$": function(input, strict) {


				var re = new RegExp('\\/Date\\(([-+])?(\\d+)(?:[+-]\\d{4})?\\)\\/');
				var r = (input || '').match(re);
				return r? new Date(((r[1] || '') + r[2]) * 1) : null;
			}
		},
		parseRegexes: [],


		formatFunctions: {
			"M$": function() {

				return '\\/Date(' + this.getTime() + ')\\/';
			}
		},

		y2kYear : 50,


		MILLI : "ms",


		SECOND : "s",


		MINUTE : "mi",


		HOUR : "h",


		DAY : "d",


		MONTH : "mo",


		YEAR : "y",


		defaults: {},


		dayNames : [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday"
		],


		monthNames : [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		],


		monthNumbers : {
			Jan:0,
			Feb:1,
			Mar:2,
			Apr:3,
			May:4,
			Jun:5,
			Jul:6,
			Aug:7,
			Sep:8,
			Oct:9,
			Nov:10,
			Dec:11
		},


		getShortMonthName : function(month) {
			return Date.monthNames[month].substring(0, 3);
		},


		getShortDayName : function(day) {
			return Date.dayNames[day].substring(0, 3);
		},


		getMonthNumber : function(name) {

			return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
		},


		formatCodes : {
			d: "String.leftPad(this.getDate(), 2, '0')",
			D: "Date.getShortDayName(this.getDay())",
			j: "this.getDate()",
			l: "Date.dayNames[this.getDay()]",
			N: "(this.getDay() ? this.getDay() : 7)",
			S: "this.getSuffix()",
			w: "this.getDay()",
			z: "this.getDayOfYear()",
			W: "String.leftPad(this.getWeekOfYear(), 2, '0')",
			F: "Date.monthNames[this.getMonth()]",
			m: "String.leftPad(this.getMonth() + 1, 2, '0')",
			M: "Date.getShortMonthName(this.getMonth())",
			n: "(this.getMonth() + 1)",
			t: "this.getDaysInMonth()",
			L: "(this.isLeapYear() ? 1 : 0)",
			o: "(this.getFullYear() + (this.getWeekOfYear() == 1 && this.getMonth() > 0 ? +1 : (this.getWeekOfYear() >= 52 && this.getMonth() < 11 ? -1 : 0)))",
			Y: "this.getFullYear()",
			y: "('' + this.getFullYear()).substring(2, 4)",
			a: "(this.getHours() < 12 ? 'am' : 'pm')",
			A: "(this.getHours() < 12 ? 'AM' : 'PM')",
			g: "((this.getHours() % 12) ? this.getHours() % 12 : 12)",
			G: "this.getHours()",
			h: "String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0')",
			H: "String.leftPad(this.getHours(), 2, '0')",
			i: "String.leftPad(this.getMinutes(), 2, '0')",
			s: "String.leftPad(this.getSeconds(), 2, '0')",
			u: "String.leftPad(this.getMilliseconds(), 3, '0')",
			O: "this.getGMTOffset()",
			P: "this.getGMTOffset(true)",
			T: "this.getTimezone()",
			Z: "(this.getTimezoneOffset() * -60)",

			c: function() {
				for (var c = "Y-m-dTH:i:sP", code = [], i = 0, l = c.length; i < l; ++i) {
					var e = c.charAt(i);
					code.push(e == "T" ? "'T'" : Date.getFormatCode(e));
				}
				return code.join(" + ");
			},


			U: "Math.round(this.getTime() / 1000)"
		},


		isValid : function(y, m, d, h, i, s, ms) {

			h = h || 0;
			i = i || 0;
			s = s || 0;
			ms = ms || 0;

			var dt = new Date(y, m - 1, d, h, i, s, ms);

			return y == dt.getFullYear() &&
				m == dt.getMonth() + 1 &&
				d == dt.getDate() &&
				h == dt.getHours() &&
				i == dt.getMinutes() &&
				s == dt.getSeconds() &&
				ms == dt.getMilliseconds();
		},


		parseDate : function(input, format, strict) {
			var p = Date.parseFunctions;
			if (p[format] == null) {
				Date.createParser(format);
			}
			return p[format](input, Ext.isDefined(strict) ? strict : Date.useStrict);
		},


		getFormatCode : function(character) {
			var f = Date.formatCodes[character];

			if (f) {
				f = typeof f == 'function'? f() : f;
				Date.formatCodes[character] = f;
			}


			return f || ("'" + String.escape(character) + "'");
		},


		createFormat : function(format) {
			var code = [],
				special = false,
				ch = '';

			for (var i = 0; i < format.length; ++i) {
				ch = format.charAt(i);
				if (!special && ch == "\\") {
					special = true;
				} else if (special) {
					special = false;
					code.push("'" + String.escape(ch) + "'");
				} else {
					code.push(Date.getFormatCode(ch))
				}
			}
			Date.formatFunctions[format] = new Function("return " + code.join('+'));
		},


		createParser : function() {
			var code = [
				"var dt, y, m, d, h, i, s, ms, o, z, zz, u, v,",
				"def = Date.defaults,",
				"results = String(input).match(Date.parseRegexes[{0}]);",

				"if(results){",
				"{1}",

				"if(u != null){",
				"v = new Date(u * 1000);",
				"}else{",



				"dt = (new Date()).clearTime();",


				"y = y >= 0? y : Ext.num(def.y, dt.getFullYear());",
				"m = m >= 0? m : Ext.num(def.m - 1, dt.getMonth());",
				"d = d >= 0? d : Ext.num(def.d, dt.getDate());",


				"h  = h || Ext.num(def.h, dt.getHours());",
				"i  = i || Ext.num(def.i, dt.getMinutes());",
				"s  = s || Ext.num(def.s, dt.getSeconds());",
				"ms = ms || Ext.num(def.ms, dt.getMilliseconds());",

				"if(z >= 0 && y >= 0){",




				"v = new Date(y, 0, 1, h, i, s, ms);",


				"v = !strict? v : (strict === true && (z <= 364 || (v.isLeapYear() && z <= 365))? v.add(Date.DAY, z) : null);",
				"}else if(strict === true && !Date.isValid(y, m + 1, d, h, i, s, ms)){",
				"v = null;",
				"}else{",

				"v = new Date(y, m, d, h, i, s, ms);",
				"}",
				"}",
				"}",

				"if(v){",

				"if(zz != null){",

				"v = v.add(Date.SECOND, -v.getTimezoneOffset() * 60 - zz);",
				"}else if(o){",

				"v = v.add(Date.MINUTE, -v.getTimezoneOffset() + (sn == '+'? -1 : 1) * (hr * 60 + mn));",
				"}",
				"}",

				"return v;"
			].join('\n');

			return function(format) {
				var regexNum = Date.parseRegexes.length,
					currentGroup = 1,
					calc = [],
					regex = [],
					special = false,
					ch = "";

				for (var i = 0; i < format.length; ++i) {
					ch = format.charAt(i);
					if (!special && ch == "\\") {
						special = true;
					} else if (special) {
						special = false;
						regex.push(String.escape(ch));
					} else {
						var obj = $f(ch, currentGroup);
						currentGroup += obj.g;
						regex.push(obj.s);
						if (obj.g && obj.c) {
							calc.push(obj.c);
						}
					}
				}

				Date.parseRegexes[regexNum] = new RegExp("^" + regex.join('') + "$", "i");
				Date.parseFunctions[format] = new Function("input", "strict", xf(code, regexNum, calc.join('')));
			}
		}(),


		parseCodes : {

			d: {
				g:1,
				c:"d = parseInt(results[{0}], 10);\n",
				s:"(\\d{2})"
			},
			j: {
				g:1,
				c:"d = parseInt(results[{0}], 10);\n",
				s:"(\\d{1,2})"
			},
			D: function() {
				for (var a = [], i = 0; i < 7; a.push(Date.getShortDayName(i)), ++i);
				return {
					g:0,
					c:null,
					s:"(?:" + a.join("|") +")"
				}
			},
			l: function() {
				return {
					g:0,
					c:null,
					s:"(?:" + Date.dayNames.join("|") + ")"
				}
			},
			N: {
				g:0,
				c:null,
				s:"[1-7]"
			},
			S: {
				g:0,
				c:null,
				s:"(?:st|nd|rd|th)"
			},
			w: {
				g:0,
				c:null,
				s:"[0-6]"
			},
			z: {
				g:1,
				c:"z = parseInt(results[{0}], 10);\n",
				s:"(\\d{1,3})"
			},
			W: {
				g:0,
				c:null,
				s:"(?:\\d{2})"
			},
			F: function() {
				return {
					g:1,
					c:"m = parseInt(Date.getMonthNumber(results[{0}]), 10);\n",
					s:"(" + Date.monthNames.join("|") + ")"
				}
			},
			M: function() {
				for (var a = [], i = 0; i < 12; a.push(Date.getShortMonthName(i)), ++i);
				return Ext.applyIf({
					s:"(" + a.join("|") + ")"
				}, $f("F"));
			},
			m: {
				g:1,
				c:"m = parseInt(results[{0}], 10) - 1;\n",
				s:"(\\d{2})"
			},
			n: {
				g:1,
				c:"m = parseInt(results[{0}], 10) - 1;\n",
				s:"(\\d{1,2})"
			},
			t: {
				g:0,
				c:null,
				s:"(?:\\d{2})"
			},
			L: {
				g:0,
				c:null,
				s:"(?:1|0)"
			},
			o: function() {
				return $f("Y");
			},
			Y: {
				g:1,
				c:"y = parseInt(results[{0}], 10);\n",
				s:"(\\d{4})"
			},
			y: {
				g:1,
				c:"var ty = parseInt(results[{0}], 10);\n"
					+ "y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
				s:"(\\d{1,2})"
			},
			a: {
				g:1,
				c:"if (results[{0}] == 'am') {\n"
					+ "if (!h || h == 12) { h = 0; }\n"
					+ "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
				s:"(am|pm)"
			},
			A: {
				g:1,
				c:"if (results[{0}] == 'AM') {\n"
					+ "if (!h || h == 12) { h = 0; }\n"
					+ "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
				s:"(AM|PM)"
			},
			g: function() {
				return $f("G");
			},
			G: {
				g:1,
				c:"h = parseInt(results[{0}], 10);\n",
				s:"(\\d{1,2})"
			},
			h: function() {
				return $f("H");
			},
			H: {
				g:1,
				c:"h = parseInt(results[{0}], 10);\n",
				s:"(\\d{2})"
			},
			i: {
				g:1,
				c:"i = parseInt(results[{0}], 10);\n",
				s:"(\\d{2})"
			},
			s: {
				g:1,
				c:"s = parseInt(results[{0}], 10);\n",
				s:"(\\d{2})"
			},
			u: {
				g:1,
				c:"ms = results[{0}]; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n",
				s:"(\\d+)"
			},
			O: {
				g:1,
				c:[
					"o = results[{0}];",
					"var sn = o.substring(0,1),",
					"hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60),",
					"mn = o.substring(3,5) % 60;",
					"o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + String.leftPad(hr, 2, '0') + String.leftPad(mn, 2, '0')) : null;\n"
				].join("\n"),
				s: "([+\-]\\d{4})"
			},
			P: {
				g:1,
				c:[
					"o = results[{0}];",
					"var sn = o.substring(0,1),",
					"hr = o.substring(1,3)*1 + Math.floor(o.substring(4,6) / 60),",
					"mn = o.substring(4,6) % 60;",
					"o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + String.leftPad(hr, 2, '0') + String.leftPad(mn, 2, '0')) : null;\n"
				].join("\n"),
				s: "([+\-]\\d{2}:\\d{2})"
			},
			T: {
				g:0,
				c:null,
				s:"[A-Z]{1,4}"
			},
			Z: {
				g:1,
				c:"zz = results[{0}] * 1;\n"
					+ "zz = (-43200 <= zz && zz <= 50400)? zz : null;\n",
				s:"([+\-]?\\d{1,5})"
			},
			c: function() {
				var calc = [],
					arr = [
						$f("Y", 1),
						$f("m", 2),
						$f("d", 3),
						$f("h", 4),
						$f("i", 5),
						$f("s", 6),
						{c:"ms = results[7] || '0'; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n"},
						{c:[
							"if(results[8]) {",
							"if(results[8] == 'Z'){",
							"zz = 0;",
							"}else if (results[8].indexOf(':') > -1){",
							$f("P", 8).c,
							"}else{",
							$f("O", 8).c,
							"}",
							"}"
						].join('\n')}
					];

				for (var i = 0, l = arr.length; i < l; ++i) {
					calc.push(arr[i].c);
				}

				return {
					g:1,
					c:calc.join(""),
					s:[
						arr[0].s,
						"(?:", "-", arr[1].s,
						"(?:", "-", arr[2].s,
						"(?:",
						"(?:T| )?",
						arr[3].s, ":", arr[4].s,
						"(?::", arr[5].s, ")?",
						"(?:(?:\\.|,)(\\d+))?",
						"(Z|(?:[-+]\\d{2}(?::)?\\d{2}))?",
						")?",
						")?",
						")?"
					].join("")
				}
			},
			U: {
				g:1,
				c:"u = parseInt(results[{0}], 10);\n",
				s:"(-?\\d+)"
			}
		}
	});

}());

Ext.apply(Date.prototype, {

	dateFormat : function(format) {
		if (Date.formatFunctions[format] == null) {
			Date.createFormat(format);
		}
		return Date.formatFunctions[format].call(this);
	},


	getTimezone : function() {












		return this.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "");
	},


	getGMTOffset : function(colon) {
		return (this.getTimezoneOffset() > 0 ? "-" : "+")
			+ String.leftPad(Math.floor(Math.abs(this.getTimezoneOffset()) / 60), 2, "0")
			+ (colon ? ":" : "")
			+ String.leftPad(Math.abs(this.getTimezoneOffset() % 60), 2, "0");
	},


	getDayOfYear: function() {
		var num = 0,
			d = this.clone(),
			m = this.getMonth(),
			i;

		for (i = 0, d.setDate(1), d.setMonth(0); i < m; d.setMonth(++i)) {
			num += d.getDaysInMonth();
		}
		return num + this.getDate() - 1;
	},


	getWeekOfYear : function() {

		var ms1d = 864e5,
			ms7d = 7 * ms1d;

		return function() {
			var DC3 = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate() + 3) / ms1d,
				AWN = Math.floor(DC3 / 7),
				Wyr = new Date(AWN * ms7d).getUTCFullYear();

			return AWN - Math.floor(Date.UTC(Wyr, 0, 7) / ms7d) + 1;
		}
	}(),


	isLeapYear : function() {
		var year = this.getFullYear();
		return !!((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
	},


	getFirstDayOfMonth : function() {
		var day = (this.getDay() - (this.getDate() - 1)) % 7;
		return (day < 0) ? (day + 7) : day;
	},


	getLastDayOfMonth : function() {
		return this.getLastDateOfMonth().getDay();
	},



	getFirstDateOfMonth : function() {
		return new Date(this.getFullYear(), this.getMonth(), 1);
	},


	getLastDateOfMonth : function() {
		return new Date(this.getFullYear(), this.getMonth(), this.getDaysInMonth());
	},


	getDaysInMonth: function() {
		var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

		return function() {
			var m = this.getMonth();

			return m == 1 && this.isLeapYear() ? 29 : daysInMonth[m];
		}
	}(),


	getSuffix : function() {
		switch (this.getDate()) {
			case 1:
			case 21:
			case 31:
				return "st";
			case 2:
			case 22:
				return "nd";
			case 3:
			case 23:
				return "rd";
			default:
				return "th";
		}
	},


	clone : function() {
		return new Date(this.getTime());
	},


	isDST : function() {


		return new Date(this.getFullYear(), 0, 1).getTimezoneOffset() != this.getTimezoneOffset();
	},


	clearTime : function(clone) {
		if (clone) {
			return this.clone().clearTime();
		}


		var d = this.getDate();


		this.setHours(0);
		this.setMinutes(0);
		this.setSeconds(0);
		this.setMilliseconds(0);

		if (this.getDate() != d) {




			for (var hr = 1, c = this.add(Date.HOUR, hr); c.getDate() != d; hr++, c = this.add(Date.HOUR, hr));

			this.setDate(d);
			this.setHours(c.getHours());
		}

		return this;
	},


	add : function(interval, value) {
		var d = this.clone();
		if (!interval || value === 0) return d;

		switch(interval.toLowerCase()) {
			case Date.MILLI:
				d.setMilliseconds(this.getMilliseconds() + value);
				break;
			case Date.SECOND:
				d.setSeconds(this.getSeconds() + value);
				break;
			case Date.MINUTE:
				d.setMinutes(this.getMinutes() + value);
				break;
			case Date.HOUR:
				d.setHours(this.getHours() + value);
				break;
			case Date.DAY:
				d.setDate(this.getDate() + value);
				break;
			case Date.MONTH:
				var day = this.getDate();
				if (day > 28) {
					day = Math.min(day, this.getFirstDateOfMonth().add('mo', value).getLastDateOfMonth().getDate());
				}
				d.setDate(day);
				d.setMonth(this.getMonth() + value);
				break;
			case Date.YEAR:
				d.setFullYear(this.getFullYear() + value);
				break;
		}
		return d;
	},


	between : function(start, end) {
		var t = this.getTime();
		return start.getTime() <= t && t <= end.getTime();
	}
});



Date.prototype.format = Date.prototype.dateFormat;



if (Ext.isSafari && (navigator.userAgent.match(/WebKit\/(\d+)/)[1] || NaN) < 420) {
	Ext.apply(Date.prototype, {
		_xMonth : Date.prototype.setMonth,
		_xDate  : Date.prototype.setDate,



		setMonth : function(num) {
			if (num <= -1) {
				var n = Math.ceil(-num),
					back_year = Math.ceil(n / 12),
					month = (n % 12) ? 12 - n % 12 : 0;

				this.setFullYear(this.getFullYear() - back_year);

				return this._xMonth(month);
			} else {
				return this._xMonth(num);
			}
		},




		setDate : function(d) {


			return this.setTime(this.getTime() - (this.getDate() - d) * 864e5);
		}
	});
}




Ext.util.MixedCollection = function(allowFunctions, keyFn){
	this.items = [];
	this.map = {};
	this.keys = [];
	this.length = 0;
	this.addEvents(

		'clear',

		'add',

		'replace',

		'remove',
		'sort'
	);
	this.allowFunctions = allowFunctions === true;
	if(keyFn){
		this.getKey = keyFn;
	}
	Ext.util.MixedCollection.superclass.constructor.call(this);
};

Ext.extend(Ext.util.MixedCollection, Ext.util.Observable, {


	allowFunctions : false,


	add : function(key, o){
		if(arguments.length == 1){
			o = arguments[0];
			key = this.getKey(o);
		}
		if(typeof key != 'undefined' && key !== null){
			var old = this.map[key];
			if(typeof old != 'undefined'){
				return this.replace(key, o);
			}
			this.map[key] = o;
		}
		this.length++;
		this.items.push(o);
		this.keys.push(key);
		this.fireEvent('add', this.length-1, o, key);
		return o;
	},


	getKey : function(o){
		return o.id;
	},


	replace : function(key, o){
		if(arguments.length == 1){
			o = arguments[0];
			key = this.getKey(o);
		}
		var old = this.map[key];
		if(typeof key == 'undefined' || key === null || typeof old == 'undefined'){
			return this.add(key, o);
		}
		var index = this.indexOfKey(key);
		this.items[index] = o;
		this.map[key] = o;
		this.fireEvent('replace', key, old, o);
		return o;
	},


	addAll : function(objs){
		if(arguments.length > 1 || Ext.isArray(objs)){
			var args = arguments.length > 1 ? arguments : objs;
			for(var i = 0, len = args.length; i < len; i++){
				this.add(args[i]);
			}
		}else{
			for(var key in objs){
				if(this.allowFunctions || typeof objs[key] != 'function'){
					this.add(key, objs[key]);
				}
			}
		}
	},


	each : function(fn, scope){
		var items = [].concat(this.items);
		for(var i = 0, len = items.length; i < len; i++){
			if(fn.call(scope || items[i], items[i], i, len) === false){
				break;
			}
		}
	},


	eachKey : function(fn, scope){
		for(var i = 0, len = this.keys.length; i < len; i++){
			fn.call(scope || window, this.keys[i], this.items[i], i, len);
		}
	},


	find : function(fn, scope){
		for(var i = 0, len = this.items.length; i < len; i++){
			if(fn.call(scope || window, this.items[i], this.keys[i])){
				return this.items[i];
			}
		}
		return null;
	},


	insert : function(index, key, o){
		if(arguments.length == 2){
			o = arguments[1];
			key = this.getKey(o);
		}
		if(this.containsKey(key)){
			this.suspendEvents();
			this.removeKey(key);
			this.resumeEvents();
		}
		if(index >= this.length){
			return this.add(key, o);
		}
		this.length++;
		this.items.splice(index, 0, o);
		if(typeof key != 'undefined' && key !== null){
			this.map[key] = o;
		}
		this.keys.splice(index, 0, key);
		this.fireEvent('add', index, o, key);
		return o;
	},


	remove : function(o){
		return this.removeAt(this.indexOf(o));
	},


	removeAt : function(index){
		if(index < this.length && index >= 0){
			this.length--;
			var o = this.items[index];
			this.items.splice(index, 1);
			var key = this.keys[index];
			if(typeof key != 'undefined'){
				delete this.map[key];
			}
			this.keys.splice(index, 1);
			this.fireEvent('remove', o, key);
			return o;
		}
		return false;
	},


	removeKey : function(key){
		return this.removeAt(this.indexOfKey(key));
	},


	getCount : function(){
		return this.length;
	},


	indexOf : function(o){
		return this.items.indexOf(o);
	},


	indexOfKey : function(key){
		return this.keys.indexOf(key);
	},


	item : function(key){
		var mk = this.map[key],
			item = mk !== undefined ? mk : (typeof key == 'number') ? this.items[key] : undefined;
		return !Ext.isFunction(item) || this.allowFunctions ? item : null;
	},


	itemAt : function(index){
		return this.items[index];
	},


	key : function(key){
		return this.map[key];
	},


	contains : function(o){
		return this.indexOf(o) != -1;
	},


	containsKey : function(key){
		return typeof this.map[key] != 'undefined';
	},


	clear : function(){
		this.length = 0;
		this.items = [];
		this.keys = [];
		this.map = {};
		this.fireEvent('clear');
	},


	first : function(){
		return this.items[0];
	},


	last : function(){
		return this.items[this.length-1];
	},


	_sort : function(property, dir, fn){
		var i,
			len,
			dsc = String(dir).toUpperCase() == 'DESC' ? -1 : 1,
			c = [], k = this.keys, items = this.items;

		fn = fn || function(a, b){
			return a-b;
		};
		for(i = 0, len = items.length; i < len; i++){
			c[c.length] = {key: k[i], value: items[i], index: i};
		}
		c.sort(function(a, b){
			var v = fn(a[property], b[property]) * dsc;
			if(v === 0){
				v = (a.index < b.index ? -1 : 1);
			}
			return v;
		});
		for(i = 0, len = c.length; i < len; i++){
			items[i] = c[i].value;
			k[i] = c[i].key;
		}
		this.fireEvent('sort', this);
	},


	sort : function(dir, fn){
		this._sort('value', dir, fn);
	},


	keySort : function(dir, fn){
		this._sort('key', dir, fn || function(a, b){
			var v1 = String(a).toUpperCase(), v2 = String(b).toUpperCase();
			return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
		});
	},


	getRange : function(start, end){
		var items = this.items;
		if(items.length < 1){
			return [];
		}
		start = start || 0;
		end = Math.min(typeof end == 'undefined' ? this.length-1 : end, this.length-1);
		var i, r = [];
		if(start <= end){
			for(i = start; i <= end; i++) {
				r[r.length] = items[i];
			}
		}else{
			for(i = start; i >= end; i--) {
				r[r.length] = items[i];
			}
		}
		return r;
	},


	filter : function(property, value, anyMatch, caseSensitive){
		if(Ext.isEmpty(value, false)){
			return this.clone();
		}
		value = this.createValueMatcher(value, anyMatch, caseSensitive);
		return this.filterBy(function(o){
			return o && value.test(o[property]);
		});
	},


	filterBy : function(fn, scope){
		var r = new Ext.util.MixedCollection();
		r.getKey = this.getKey;
		var k = this.keys, it = this.items;
		for(var i = 0, len = it.length; i < len; i++){
			if(fn.call(scope||this, it[i], k[i])){
				r.add(k[i], it[i]);
			}
		}
		return r;
	},


	findIndex : function(property, value, start, anyMatch, caseSensitive){
		if(Ext.isEmpty(value, false)){
			return -1;
		}
		value = this.createValueMatcher(value, anyMatch, caseSensitive);
		return this.findIndexBy(function(o){
			return o && value.test(o[property]);
		}, null, start);
	},


	findIndexBy : function(fn, scope, start){
		var k = this.keys, it = this.items;
		for(var i = (start||0), len = it.length; i < len; i++){
			if(fn.call(scope||this, it[i], k[i])){
				return i;
			}
		}
		return -1;
	},


	createValueMatcher : function(value, anyMatch, caseSensitive, exactMatch) {
		if (!value.exec) {
			var er = Ext.escapeRe;
			value = String(value);
			if (anyMatch === true) {
				value = er(value);
			} else {
				value = '^' + er(value);
				if (exactMatch === true) {
					value += '$';
				}
			}
			value = new RegExp(value, caseSensitive ? '' : 'i');
		}
		return value;
	},


	clone : function(){
		var r = new Ext.util.MixedCollection();
		var k = this.keys, it = this.items;
		for(var i = 0, len = it.length; i < len; i++){
			r.add(k[i], it[i]);
		}
		r.getKey = this.getKey;
		return r;
	}
});

Ext.util.MixedCollection.prototype.get = Ext.util.MixedCollection.prototype.item;
Ext.util.JSON = new (function(){
	var useHasOwn = !!{}.hasOwnProperty,
		isNative = function() {
			var useNative = null;

			return function() {
				if (useNative === null) {
					useNative = Ext.USE_NATIVE_JSON && window.JSON && JSON.toString() == '[object JSON]';
				}

				return useNative;
			};
		}(),
		pad = function(n) {
			return n < 10 ? "0" + n : n;
		},
		doDecode = function(json){
			return eval("(" + json + ')');
		},
		doEncode = function(o){
			if(!Ext.isDefined(o) || o === null){
				return "null";
			}else if(Ext.isArray(o)){
				return encodeArray(o);
			}else if(Ext.isDate(o)){
				return Ext.util.JSON.encodeDate(o);
			}else if(Ext.isString(o)){
				return encodeString(o);
			}else if(typeof o == "number"){

				return isFinite(o) ? String(o) : "null";
			}else if(Ext.isBoolean(o)){
				return String(o);
			}else {
				var a = ["{"], b, i, v;
				for (i in o) {

					if(!o.getElementsByTagName){
						if(!useHasOwn || o.hasOwnProperty(i)) {
							v = o[i];
							switch (typeof v) {
								case "undefined":
								case "function":
								case "unknown":
									break;
								default:
									if(b){
										a.push(',');
									}
									a.push(doEncode(i), ":",
										v === null ? "null" : doEncode(v));
									b = true;
							}
						}
					}
				}
				a.push("}");
				return a.join("");
			}
		},
		m = {
			"\b": '\\b',
			"\t": '\\t',
			"\n": '\\n',
			"\f": '\\f',
			"\r": '\\r',
			'"' : '\\"',
			"\\": '\\\\'
		},
		encodeString = function(s){
			if (/["\\\x00-\x1f]/.test(s)) {
				return '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
					var c = m[b];
					if(c){
						return c;
					}
					c = b.charCodeAt();
					return "\\u00" +
						Math.floor(c / 16).toString(16) +
						(c % 16).toString(16);
				}) + '"';
			}
			return '"' + s + '"';
		},
		encodeArray = function(o){
			var a = ["["], b, i, l = o.length, v;
			for (i = 0; i < l; i += 1) {
				v = o[i];
				switch (typeof v) {
					case "undefined":
					case "function":
					case "unknown":
						break;
					default:
						if (b) {
							a.push(',');
						}
						a.push(v === null ? "null" : Ext.util.JSON.encode(v));
						b = true;
				}
			}
			a.push("]");
			return a.join("");
		};

	this.encodeDate = function(o){
		return '"' + o.getFullYear() + "-" +
			pad(o.getMonth() + 1) + "-" +
			pad(o.getDate()) + "T" +
			pad(o.getHours()) + ":" +
			pad(o.getMinutes()) + ":" +
			pad(o.getSeconds()) + '"';
	};


	this.encode = function() {
		var ec;
		return function(o) {
			if (!ec) {

				ec = isNative() ? JSON.stringify : doEncode;
			}
			return ec(o);
		};
	}();



	this.decode = function() {
		var dc;
		return function(json) {
			if (!dc) {

				dc = isNative() ? JSON.parse : doDecode;
			}
			return dc(json);
		};
	}();

})();

Ext.encode = Ext.util.JSON.encode;

Ext.decode = Ext.util.JSON.decode;

Ext.util.Format = function(){
	var trimRe = /^\s+|\s+$/g,
		stripTagsRE = /<\/?[^>]+>/gi,
		stripScriptsRe = /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig,
		nl2brRe = /\r?\n/g;

	return {

		ellipsis : function(value, len, word){
			if(value && value.length > len){
				if(word){
					var vs = value.substr(0, len - 2),
						index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
					if(index == -1 || index < (len - 15)){
						return value.substr(0, len - 3) + "...";
					}else{
						return vs.substr(0, index) + "...";
					}
				} else{
					return value.substr(0, len - 3) + "...";
				}
			}
			return value;
		},


		undef : function(value){
			return value !== undefined ? value : "";
		},


		defaultValue : function(value, defaultValue){
			return value !== undefined && value !== '' ? value : defaultValue;
		},


		htmlEncode : function(value){
			return !value ? value : String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
		},


		htmlDecode : function(value){
			return !value ? value : String(value).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
		},


		trim : function(value){
			return String(value).replace(trimRe, "");
		},


		substr : function(value, start, length){
			return String(value).substr(start, length);
		},


		lowercase : function(value){
			return String(value).toLowerCase();
		},


		uppercase : function(value){
			return String(value).toUpperCase();
		},


		capitalize : function(value){
			return !value ? value : value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();
		},


		call : function(value, fn){
			if(arguments.length > 2){
				var args = Array.prototype.slice.call(arguments, 2);
				args.unshift(value);
				return eval(fn).apply(window, args);
			}else{
				return eval(fn).call(window, value);
			}
		},


		usMoney : function(v){
			v = (Math.round((v-0)*100))/100;
			v = (v == Math.floor(v)) ? v + ".00" : ((v*10 == Math.floor(v*10)) ? v + "0" : v);
			v = String(v);
			var ps = v.split('.'),
				whole = ps[0],
				sub = ps[1] ? '.'+ ps[1] : '.00',
				r = /(\d+)(\d{3})/;
			while (r.test(whole)) {
				whole = whole.replace(r, '$1' + ',' + '$2');
			}
			v = whole + sub;
			if(v.charAt(0) == '-'){
				return '-$' + v.substr(1);
			}
			return "$" +  v;
		},


		date : function(v, format){
			if(!v){
				return "";
			}
			if(!Ext.isDate(v)){
				v = new Date(Date.parse(v));
			}
			return v.dateFormat(format || "m/d/Y");
		},


		dateRenderer : function(format){
			return function(v){
				return Ext.util.Format.date(v, format);
			};
		},


		stripTags : function(v){
			return !v ? v : String(v).replace(stripTagsRE, "");
		},


		stripScripts : function(v){
			return !v ? v : String(v).replace(stripScriptsRe, "");
		},


		fileSize : function(size){
			if(size < 1024) {
				return size + " bytes";
			} else if(size < 1048576) {
				return (Math.round(((size*10) / 1024))/10) + " KB";
			} else {
				return (Math.round(((size*10) / 1048576))/10) + " MB";
			}
		},


		math : function(){
			var fns = {};
			return function(v, a){
				if(!fns[a]){
					fns[a] = new Function('v', 'return v ' + a + ';');
				}
				return fns[a](v);
			}
		}(),


		round : function(value, precision) {
			var result = Number(value);
			if (typeof precision == 'number') {
				precision = Math.pow(10, precision);
				result = Math.round(value * precision) / precision;
			}
			return result;
		},


		number: function(v, format) {
			if(!format){
				return v;
			}
			v = Ext.num(v, NaN);
			if (isNaN(v)){
				return '';
			}
			var comma = ',',
				dec = '.',
				i18n = false,
				neg = v < 0;

			v = Math.abs(v);
			if(format.substr(format.length - 2) == '/i'){
				format = format.substr(0, format.length - 2);
				i18n = true;
				comma = '.';
				dec = ',';
			}

			var hasComma = format.indexOf(comma) != -1,
				psplit = (i18n ? format.replace(/[^\d\,]/g, '') : format.replace(/[^\d\.]/g, '')).split(dec);

			if(1 < psplit.length){
				v = v.toFixed(psplit[1].length);
			}else if(2 < psplit.length){
				throw ('NumberFormatException: invalid format, formats should have no more than 1 period: ' + format);
			}else{
				v = v.toFixed(0);
			}

			var fnum = v.toString();
			if(hasComma){
				psplit = fnum.split('.');

				var cnum = psplit[0], parr = [], j = cnum.length, m = Math.floor(j / 3), n = cnum.length % 3 || 3;

				for(var i = 0; i < j; i += n){
					if(i != 0){
						n = 3;
					}
					parr[parr.length] = cnum.substr(i, n);
					m -= 1;
				}
				fnum = parr.join(comma);
				if(psplit[1]){
					fnum += dec + psplit[1];
				}
			}

			return (neg ? '-' : '') + format.replace(/[\d,?\.?]+/, fnum);
		},


		numberRenderer : function(format){
			return function(v){
				return Ext.util.Format.number(v, format);
			};
		},


		plural : function(v, s, p){
			return v +' ' + (v == 1 ? s : (p ? p : s+'s'));
		},


		nl2br : function(v){
			return Ext.isEmpty(v) ? '' : v.replace(nl2brRe, '<br/>');
		}
	}
}();

Ext.XTemplate = function(){
	Ext.XTemplate.superclass.constructor.apply(this, arguments);

	var me = this,
		s = me.html,
		re = /<tpl\b[^>]*>((?:(?=([^<]+))\2|<(?!tpl\b[^>]*>))*?)<\/tpl>/,
		nameRe = /^<tpl\b[^>]*?for="(.*?)"/,
		ifRe = /^<tpl\b[^>]*?if="(.*?)"/,
		execRe = /^<tpl\b[^>]*?exec="(.*?)"/,
		m,
		id = 0,
		tpls = [],
		VALUES = 'values',
		PARENT = 'parent',
		XINDEX = 'xindex',
		XCOUNT = 'xcount',
		RETURN = 'return ',
		WITHVALUES = 'with(values){ ';

	s = ['<tpl>', s, '</tpl>'].join('');

	while((m = s.match(re))){
		var m2 = m[0].match(nameRe),
			m3 = m[0].match(ifRe),
			m4 = m[0].match(execRe),
			exp = null,
			fn = null,
			exec = null,
			name = m2 && m2[1] ? m2[1] : '';

		if (m3) {
			exp = m3 && m3[1] ? m3[1] : null;
			if(exp){
				fn = new Function(VALUES, PARENT, XINDEX, XCOUNT, WITHVALUES + RETURN +(Ext.util.Format.htmlDecode(exp))+'; }');
			}
		}
		if (m4) {
			exp = m4 && m4[1] ? m4[1] : null;
			if(exp){
				exec = new Function(VALUES, PARENT, XINDEX, XCOUNT, WITHVALUES +(Ext.util.Format.htmlDecode(exp))+'; }');
			}
		}
		if(name){
			switch(name){
				case '.': name = new Function(VALUES, PARENT, WITHVALUES + RETURN + VALUES + '; }'); break;
				case '..': name = new Function(VALUES, PARENT, WITHVALUES + RETURN + PARENT + '; }'); break;
				default: name = new Function(VALUES, PARENT, WITHVALUES + RETURN + name + '; }');
			}
		}
		tpls.push({
			id: id,
			target: name,
			exec: exec,
			test: fn,
			body: m[1]||''
		});
		s = s.replace(m[0], '{xtpl'+ id + '}');
		++id;
	}
	Ext.each(tpls, function(t) {
		me.compileTpl(t);
	});
	me.master = tpls[tpls.length-1];
	me.tpls = tpls;
};
Ext.extend(Ext.XTemplate, Ext.Template, {

	re : /\{([\w-\.\#]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?(\s?[\+\-\*\\]\s?[\d\.\+\-\*\\\(\)]+)?\}/g,

	codeRe : /\{\[((?:\\\]|.|\n)*?)\]\}/g,


	applySubTemplate : function(id, values, parent, xindex, xcount){
		var me = this,
			len,
			t = me.tpls[id],
			vs,
			buf = [];
		if ((t.test && !t.test.call(me, values, parent, xindex, xcount)) ||
			(t.exec && t.exec.call(me, values, parent, xindex, xcount))) {
			return '';
		}
		vs = t.target ? t.target.call(me, values, parent) : values;
		len = vs.length;
		parent = t.target ? values : parent;
		if(t.target && Ext.isArray(vs)){
			Ext.each(vs, function(v, i) {
				buf[buf.length] = t.compiled.call(me, v, parent, i+1, len);
			});
			return buf.join('');
		}
		return t.compiled.call(me, vs, parent, xindex, xcount);
	},


	compileTpl : function(tpl){
		var fm = Ext.util.Format,
			useF = this.disableFormats !== true,
			sep = Ext.isGecko ? "+" : ",",
			body;

		function fn(m, name, format, args, math){
			if(name.substr(0, 4) == 'xtpl'){
				return "'"+ sep +'this.applySubTemplate('+name.substr(4)+', values, parent, xindex, xcount)'+sep+"'";
			}
			var v;
			if(name === '.'){
				v = 'values';
			}else if(name === '#'){
				v = 'xindex';
			}else if(name.indexOf('.') != -1){
				v = name;
			}else{
				v = "values['" + name + "']";
			}
			if(math){
				v = '(' + v + math + ')';
			}
			if (format && useF) {
				args = args ? ',' + args : "";
				if(format.substr(0, 5) != "this."){
					format = "fm." + format + '(';
				}else{
					format = 'this.call("'+ format.substr(5) + '", ';
					args = ", values";
				}
			} else {
				args= ''; format = "("+v+" === undefined ? '' : ";
			}
			return "'"+ sep + format + v + args + ")"+sep+"'";
		}

		function codeFn(m, code){

			return "'" + sep + '(' + code.replace(/\\'/g, "'") + ')' + sep + "'";
		}


		if(Ext.isGecko){
			body = "tpl.compiled = function(values, parent, xindex, xcount){ return '" +
				tpl.body.replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn).replace(this.codeRe, codeFn) +
				"';};";
		}else{
			body = ["tpl.compiled = function(values, parent, xindex, xcount){ return ['"];
			body.push(tpl.body.replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn).replace(this.codeRe, codeFn));
			body.push("'].join('');};");
			body = body.join('');
		}
		eval(body);
		return this;
	},


	applyTemplate : function(values){
		return this.master.compiled.call(this, values, {}, 1, 1);
	},


	compile : function(){return this;}





});

Ext.XTemplate.prototype.apply = Ext.XTemplate.prototype.applyTemplate;


Ext.XTemplate.from = function(el){
	el = Ext.getDom(el);
	return new Ext.XTemplate(el.value || el.innerHTML);
};
Ext.util.CSS = function(){
	var rules = null;
	var doc = document;

	var camelRe = /(-[a-z])/gi;
	var camelFn = function(m, a){ return a.charAt(1).toUpperCase(); };

	return {

		createStyleSheet : function(cssText, id){
			var ss;
			var head = doc.getElementsByTagName("head")[0];
			var rules = doc.createElement("style");
			rules.setAttribute("type", "text/css");
			if(id){
				rules.setAttribute("id", id);
			}
			if(Ext.isIE){
				head.appendChild(rules);
				ss = rules.styleSheet;
				ss.cssText = cssText;
			}else{
				try{
					rules.appendChild(doc.createTextNode(cssText));
				}catch(e){
					rules.cssText = cssText;
				}
				head.appendChild(rules);
				ss = rules.styleSheet ? rules.styleSheet : (rules.sheet || doc.styleSheets[doc.styleSheets.length-1]);
			}
			this.cacheStyleSheet(ss);
			return ss;
		},


		removeStyleSheet : function(id){
			var existing = doc.getElementById(id);
			if(existing){
				existing.parentNode.removeChild(existing);
			}
		},


		swapStyleSheet : function(id, url){
			this.removeStyleSheet(id);
			var ss = doc.createElement("link");
			ss.setAttribute("rel", "stylesheet");
			ss.setAttribute("type", "text/css");
			ss.setAttribute("id", id);
			ss.setAttribute("href", url);
			doc.getElementsByTagName("head")[0].appendChild(ss);
		},


		refreshCache : function(){
			return this.getRules(true);
		},


		cacheStyleSheet : function(ss){
			if(!rules){
				rules = {};
			}
			try{
				var ssRules = ss.cssRules || ss.rules;
				for(var j = ssRules.length-1; j >= 0; --j){
					rules[ssRules[j].selectorText.toLowerCase()] = ssRules[j];
				}
			}catch(e){}
		},


		getRules : function(refreshCache){
			if(rules === null || refreshCache){
				rules = {};
				var ds = doc.styleSheets;
				for(var i =0, len = ds.length; i < len; i++){
					try{
						this.cacheStyleSheet(ds[i]);
					}catch(e){}
				}
			}
			return rules;
		},


		getRule : function(selector, refreshCache){
			var rs = this.getRules(refreshCache);
			if(!Ext.isArray(selector)){
				return rs[selector.toLowerCase()];
			}
			for(var i = 0; i < selector.length; i++){
				if(rs[selector[i]]){
					return rs[selector[i].toLowerCase()];
				}
			}
			return null;
		},



		updateRule : function(selector, property, value){
			if(!Ext.isArray(selector)){
				var rule = this.getRule(selector);
				if(rule){
					rule.style[property.replace(camelRe, camelFn)] = value;
					return true;
				}
			}else{
				for(var i = 0; i < selector.length; i++){
					if(this.updateRule(selector[i], property, value)){
						return true;
					}
				}
			}
			return false;
		}
	};
}();
Ext.util.ClickRepeater = function(el, config)
{
	this.el = Ext.get(el);
	this.el.unselectable();

	Ext.apply(this, config);

	this.addEvents(

		"mousedown",

		"click",

		"mouseup"
	);

	if(!this.disabled){
		this.disabled = true;
		this.enable();
	}


	if(this.handler){
		this.on("click", this.handler,  this.scope || this);
	}

	Ext.util.ClickRepeater.superclass.constructor.call(this);
};

Ext.extend(Ext.util.ClickRepeater, Ext.util.Observable, {
	interval : 20,
	delay: 250,
	preventDefault : true,
	stopDefault : false,
	timer : 0,


	enable: function(){
		if(this.disabled){
			this.el.on('mousedown', this.handleMouseDown, this);
			if(this.preventDefault || this.stopDefault){
				this.el.on('click', this.eventOptions, this);
			}
		}
		this.disabled = false;
	},


	disable: function( force){
		if(force || !this.disabled){
			clearTimeout(this.timer);
			if(this.pressClass){
				this.el.removeClass(this.pressClass);
			}
			Ext.getDoc().un('mouseup', this.handleMouseUp, this);
			this.el.removeAllListeners();
		}
		this.disabled = true;
	},


	setDisabled: function(disabled){
		this[disabled ? 'disable' : 'enable']();
	},

	eventOptions: function(e){
		if(this.preventDefault){
			e.preventDefault();
		}
		if(this.stopDefault){
			e.stopEvent();
		}
	},


	destroy : function() {
		this.disable(true);
		Ext.destroy(this.el);
		this.purgeListeners();
	},


	handleMouseDown : function(){
		clearTimeout(this.timer);
		this.el.blur();
		if(this.pressClass){
			this.el.addClass(this.pressClass);
		}
		this.mousedownTime = new Date();

		Ext.getDoc().on("mouseup", this.handleMouseUp, this);
		this.el.on("mouseout", this.handleMouseOut, this);

		this.fireEvent("mousedown", this);
		this.fireEvent("click", this);


		if (this.accelerate) {
			this.delay = 400;
		}
		this.timer = this.click.defer(this.delay || this.interval, this);
	},


	click : function(){
		this.fireEvent("click", this);
		this.timer = this.click.defer(this.accelerate ?
			this.easeOutExpo(this.mousedownTime.getElapsed(),
				400,
				-390,
				12000) :
			this.interval, this);
	},

	easeOutExpo : function (t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},


	handleMouseOut : function(){
		clearTimeout(this.timer);
		if(this.pressClass){
			this.el.removeClass(this.pressClass);
		}
		this.el.on("mouseover", this.handleMouseReturn, this);
	},


	handleMouseReturn : function(){
		this.el.un("mouseover", this.handleMouseReturn, this);
		if(this.pressClass){
			this.el.addClass(this.pressClass);
		}
		this.click();
	},


	handleMouseUp : function(){
		clearTimeout(this.timer);
		this.el.un("mouseover", this.handleMouseReturn, this);
		this.el.un("mouseout", this.handleMouseOut, this);
		Ext.getDoc().un("mouseup", this.handleMouseUp, this);
		this.el.removeClass(this.pressClass);
		this.fireEvent("mouseup", this);
	}
});
Ext.KeyNav = function(el, config){
	this.el = Ext.get(el);
	Ext.apply(this, config);
	if(!this.disabled){
		this.disabled = true;
		this.enable();
	}
};

Ext.KeyNav.prototype = {

	disabled : false,

	defaultEventAction: "stopEvent",

	forceKeyDown : false,


	relay : function(e){
		var k = e.getKey();
		var h = this.keyToHandler[k];
		if(h && this[h]){
			if(this.doRelay(e, this[h], h) !== true){
				e[this.defaultEventAction]();
			}
		}
	},


	doRelay : function(e, h, hname){
		return h.call(this.scope || this, e);
	},


	enter : false,
	left : false,
	right : false,
	up : false,
	down : false,
	tab : false,
	esc : false,
	pageUp : false,
	pageDown : false,
	del : false,
	home : false,
	end : false,


	keyToHandler : {
		37 : "left",
		39 : "right",
		38 : "up",
		40 : "down",
		33 : "pageUp",
		34 : "pageDown",
		46 : "del",
		36 : "home",
		35 : "end",
		13 : "enter",
		27 : "esc",
		9  : "tab"
	},

	stopKeyUp: function(e) {
		var k = e.getKey();

		if (k >= 37 && k <= 40) {


			e.stopEvent();
		}
	},


	destroy: function(){
		this.disable();
	},


	enable: function() {
		if (this.disabled) {
			if (Ext.isSafari2) {

				this.el.on('keyup', this.stopKeyUp, this);
			}

			this.el.on(this.isKeydown()? 'keydown' : 'keypress', this.relay, this);
			this.disabled = false;
		}
	},


	disable: function() {
		if (!this.disabled) {
			if (Ext.isSafari2) {

				this.el.un('keyup', this.stopKeyUp, this);
			}

			this.el.un(this.isKeydown()? 'keydown' : 'keypress', this.relay, this);
			this.disabled = true;
		}
	},


	setDisabled : function(disabled){
		this[disabled ? "disable" : "enable"]();
	},


	isKeydown: function(){
		return this.forceKeyDown || Ext.EventManager.useKeydown;
	}
};

Ext.KeyMap = function(el, config, eventName){
	this.el  = Ext.get(el);
	this.eventName = eventName || "keydown";
	this.bindings = [];
	if(config){
		this.addBinding(config);
	}
	this.enable();
};

Ext.KeyMap.prototype = {

	stopEvent : false,


	addBinding : function(config){
		if(Ext.isArray(config)){
			Ext.each(config, function(c){
				this.addBinding(c);
			}, this);
			return;
		}
		var keyCode = config.key,
			fn = config.fn || config.handler,
			scope = config.scope;

		if (config.stopEvent) {
			this.stopEvent = config.stopEvent;
		}

		if(typeof keyCode == "string"){
			var ks = [];
			var keyString = keyCode.toUpperCase();
			for(var j = 0, len = keyString.length; j < len; j++){
				ks.push(keyString.charCodeAt(j));
			}
			keyCode = ks;
		}
		var keyArray = Ext.isArray(keyCode);

		var handler = function(e){
			if(this.checkModifiers(config, e)){
				var k = e.getKey();
				if(keyArray){
					for(var i = 0, len = keyCode.length; i < len; i++){
						if(keyCode[i] == k){
							if(this.stopEvent){
								e.stopEvent();
							}
							fn.call(scope || window, k, e);
							return;
						}
					}
				}else{
					if(k == keyCode){
						if(this.stopEvent){
							e.stopEvent();
						}
						fn.call(scope || window, k, e);
					}
				}
			}
		};
		this.bindings.push(handler);
	},


	checkModifiers: function(config, e){
		var val, key, keys = ['shift', 'ctrl', 'alt'];
		for (var i = 0, len = keys.length; i < len; ++i){
			key = keys[i];
			val = config[key];
			if(!(val === undefined || (val === e[key + 'Key']))){
				return false;
			}
		}
		return true;
	},


	on : function(key, fn, scope){
		var keyCode, shift, ctrl, alt;
		if(typeof key == "object" && !Ext.isArray(key)){
			keyCode = key.key;
			shift = key.shift;
			ctrl = key.ctrl;
			alt = key.alt;
		}else{
			keyCode = key;
		}
		this.addBinding({
			key: keyCode,
			shift: shift,
			ctrl: ctrl,
			alt: alt,
			fn: fn,
			scope: scope
		});
	},


	handleKeyDown : function(e){
		if(this.enabled){
			var b = this.bindings;
			for(var i = 0, len = b.length; i < len; i++){
				b[i].call(this, e);
			}
		}
	},


	isEnabled : function(){
		return this.enabled;
	},


	enable: function(){
		if(!this.enabled){
			this.el.on(this.eventName, this.handleKeyDown, this);
			this.enabled = true;
		}
	},


	disable: function(){
		if(this.enabled){
			this.el.removeListener(this.eventName, this.handleKeyDown, this);
			this.enabled = false;
		}
	},


	setDisabled : function(disabled){
		this[disabled ? "disable" : "enable"]();
	}
};
Ext.util.TextMetrics = function(){
	var shared;
	return {

		measure : function(el, text, fixedWidth){
			if(!shared){
				shared = Ext.util.TextMetrics.Instance(el, fixedWidth);
			}
			shared.bind(el);
			shared.setFixedWidth(fixedWidth || 'auto');
			return shared.getSize(text);
		},


		createInstance : function(el, fixedWidth){
			return Ext.util.TextMetrics.Instance(el, fixedWidth);
		}
	};
}();

Ext.util.TextMetrics.Instance = function(bindTo, fixedWidth){
	var ml = new Ext.Element(document.createElement('div'));
	document.body.appendChild(ml.dom);
	ml.position('absolute');
	ml.setLeftTop(-1000, -1000);
	ml.hide();

	if(fixedWidth){
		ml.setWidth(fixedWidth);
	}

	var instance = {

		getSize : function(text){
			ml.update(text);
			var s = ml.getSize();
			ml.update('');
			return s;
		},


		bind : function(el){
			ml.setStyle(
				Ext.fly(el).getStyles('font-size','font-style', 'font-weight', 'font-family','line-height', 'text-transform', 'letter-spacing')
			);
		},


		setFixedWidth : function(width){
			ml.setWidth(width);
		},


		getWidth : function(text){
			ml.dom.style.width = 'auto';
			return this.getSize(text).width;
		},


		getHeight : function(text){
			return this.getSize(text).height;
		}
	};

	instance.bind(bindTo);

	return instance;
};

Ext.Element.addMethods({

	getTextWidth : function(text, min, max){
		return (Ext.util.TextMetrics.measure(this.dom, Ext.value(text, this.dom.innerHTML, true)).width).constrain(min || 0, max || 1000000);
	}
});

Ext.util.Cookies = {

	set : function(name, value){
		var argv = arguments;
		var argc = arguments.length;
		var expires = (argc > 2) ? argv[2] : null;
		var path = (argc > 3) ? argv[3] : '/';
		var domain = (argc > 4) ? argv[4] : null;
		var secure = (argc > 5) ? argv[5] : false;
		document.cookie = name + "=" + escape(value) + ((expires === null) ? "" : ("; expires=" + expires.toGMTString())) + ((path === null) ? "" : ("; path=" + path)) + ((domain === null) ? "" : ("; domain=" + domain)) + ((secure === true) ? "; secure" : "");
	},


	get : function(name){
		var arg = name + "=";
		var alen = arg.length;
		var clen = document.cookie.length;
		var i = 0;
		var j = 0;
		while(i < clen){
			j = i + alen;
			if(document.cookie.substring(i, j) == arg){
				return Ext.util.Cookies.getCookieVal(j);
			}
			i = document.cookie.indexOf(" ", i) + 1;
			if(i === 0){
				break;
			}
		}
		return null;
	},


	clear : function(name){
		if(Ext.util.Cookies.get(name)){
			document.cookie = name + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
		}
	},

	getCookieVal : function(offset){
		var endstr = document.cookie.indexOf(";", offset);
		if(endstr == -1){
			endstr = document.cookie.length;
		}
		return unescape(document.cookie.substring(offset, endstr));
	}
};
Ext.handleError = function(e) {
	throw e;
};


Ext.Error = function(message) {

	this.message = (this.lang[message]) ? this.lang[message] : message;
}
Ext.Error.prototype = new Error();
Ext.apply(Ext.Error.prototype, {

	lang: {},

	name: 'Ext.Error',

	getName : function() {
		return this.name;
	},

	getMessage : function() {
		return this.message;
	},

	toJson : function() {
		return Ext.encode(this);
	}
});


Ext.ComponentMgr = function(){
	var all = new Ext.util.MixedCollection();
	var types = {};
	var ptypes = {};

	return {

		register : function(c){
			all.add(c);
		},


		unregister : function(c){
			all.remove(c);
		},


		get : function(id){
			return all.get(id);
		},


		onAvailable : function(id, fn, scope){
			all.on("add", function(index, o){
				if(o.id == id){
					fn.call(scope || o, o);
					all.un("add", fn, scope);
				}
			});
		},


		all : all,


		isRegistered : function(xtype){
			return types[xtype] !== undefined;
		},


		registerType : function(xtype, cls){
			types[xtype] = cls;
			cls.xtype = xtype;
		},


		create : function(config, defaultType){
			return config.render ? config : new types[config.xtype || defaultType](config);
		},


		registerPlugin : function(ptype, cls){
			ptypes[ptype] = cls;
			cls.ptype = ptype;
		},


		createPlugin : function(config, defaultType){
			var PluginCls = ptypes[config.ptype || defaultType];
			if (PluginCls.init) {
				return PluginCls;
			} else {
				return new PluginCls(config);
			}
		}
	};
}();


Ext.reg = Ext.ComponentMgr.registerType;

Ext.preg = Ext.ComponentMgr.registerPlugin;

Ext.create = Ext.ComponentMgr.create;
Ext.Component = function(config){
	config = config || {};
	if(config.initialConfig){
		if(config.isAction){
			this.baseAction = config;
		}
		config = config.initialConfig;
	}else if(config.tagName || config.dom || Ext.isString(config)){
		config = {applyTo: config, id: config.id || config};
	}


	this.initialConfig = config;

	Ext.apply(this, config);
	this.addEvents(

		'added',

		'disable',

		'enable',

		'beforeshow',

		'show',

		'beforehide',

		'hide',

		'removed',

		'beforerender',

		'render',

		'afterrender',

		'beforedestroy',

		'destroy',

		'beforestaterestore',

		'staterestore',

		'beforestatesave',

		'statesave'
	);
	this.getId();
	Ext.ComponentMgr.register(this);
	Ext.Component.superclass.constructor.call(this);

	if(this.baseAction){
		this.baseAction.addComponent(this);
	}

	this.initComponent();

	if(this.plugins){
		if(Ext.isArray(this.plugins)){
			for(var i = 0, len = this.plugins.length; i < len; i++){
				this.plugins[i] = this.initPlugin(this.plugins[i]);
			}
		}else{
			this.plugins = this.initPlugin(this.plugins);
		}
	}

	if(this.stateful !== false){
		this.initState();
	}

	if(this.applyTo){
		this.applyToMarkup(this.applyTo);
		delete this.applyTo;
	}else if(this.renderTo){
		this.render(this.renderTo);
		delete this.renderTo;
	}
};


Ext.Component.AUTO_ID = 1000;

Ext.extend(Ext.Component, Ext.util.Observable, {




















	disabled : false,

	hidden : false,







	autoEl : 'div',


	disabledClass : 'x-item-disabled',

	allowDomMove : true,

	autoShow : false,

	hideMode : 'display',

	hideParent : false,





	rendered : false,







	tplWriteMode : 'overwrite',





	ctype : 'Ext.Component',


	actionMode : 'el',


	getActionEl : function(){
		return this[this.actionMode];
	},

	initPlugin : function(p){
		if(p.ptype && !Ext.isFunction(p.init)){
			p = Ext.ComponentMgr.createPlugin(p);
		}else if(Ext.isString(p)){
			p = Ext.ComponentMgr.createPlugin({
				ptype: p
			});
		}
		p.init(this);
		return p;
	},


	initComponent : Ext.emptyFn,


	render : function(container, position){
		if(!this.rendered && this.fireEvent('beforerender', this) !== false){
			if(!container && this.el){
				this.el = Ext.get(this.el);
				container = this.el.dom.parentNode;
				this.allowDomMove = false;
			}
			this.container = Ext.get(container);
			if(this.ctCls){
				this.container.addClass(this.ctCls);
			}
			this.rendered = true;
			if(position !== undefined){
				if(Ext.isNumber(position)){
					position = this.container.dom.childNodes[position];
				}else{
					position = Ext.getDom(position);
				}
			}
			this.onRender(this.container, position || null);
			if(this.autoShow){
				this.el.removeClass(['x-hidden','x-hide-' + this.hideMode]);
			}
			if(this.cls){
				this.el.addClass(this.cls);
				delete this.cls;
			}
			if(this.style){
				this.el.applyStyles(this.style);
				delete this.style;
			}
			if(this.overCls){
				this.el.addClassOnOver(this.overCls);
			}
			this.fireEvent('render', this);




			var contentTarget = this.getContentTarget();
			if (this.html){
				contentTarget.update(Ext.DomHelper.markup(this.html));
				delete this.html;
			}
			if (this.contentEl){
				var ce = Ext.getDom(this.contentEl);
				Ext.fly(ce).removeClass(['x-hidden', 'x-hide-display']);
				contentTarget.appendChild(ce);
			}
			if (this.tpl) {
				if (!this.tpl.compile) {
					this.tpl = new Ext.XTemplate(this.tpl);
				}
				if (this.data) {
					this.tpl[this.tplWriteMode](contentTarget, this.data);
					delete this.data;
				}
			}
			this.afterRender(this.container);


			if(this.hidden){

				this.doHide();
			}
			if(this.disabled){

				this.disable(true);
			}

			if(this.stateful !== false){
				this.initStateEvents();
			}
			this.fireEvent('afterrender', this);
		}
		return this;
	},



	update: function(htmlOrData, loadScripts, cb) {
		var contentTarget = this.getContentTarget();
		if (this.tpl && typeof htmlOrData !== "string") {
			this.tpl[this.tplWriteMode](contentTarget, htmlOrData || {});
		} else {
			var html = Ext.isObject(htmlOrData) ? Ext.DomHelper.markup(htmlOrData) : htmlOrData;
			contentTarget.update(html, loadScripts, cb);
		}
	},



	onAdded : function(container, pos) {
		this.ownerCt = container;
		this.initRef();
		this.fireEvent('added', this, container, pos);
	},


	onRemoved : function() {
		this.removeRef();
		this.fireEvent('removed', this, this.ownerCt);
		delete this.ownerCt;
	},


	initRef : function() {

		if(this.ref && !this.refOwner){
			var levels = this.ref.split('/'),
				last = levels.length,
				i = 0,
				t = this;

			while(t && i < last){
				t = t.ownerCt;
				++i;
			}
			if(t){
				t[this.refName = levels[--i]] = this;

				this.refOwner = t;
			}
		}
	},

	removeRef : function() {
		if (this.refOwner && this.refName) {
			delete this.refOwner[this.refName];
			delete this.refOwner;
		}
	},


	initState : function(){
		if(Ext.state.Manager){
			var id = this.getStateId();
			if(id){
				var state = Ext.state.Manager.get(id);
				if(state){
					if(this.fireEvent('beforestaterestore', this, state) !== false){
						this.applyState(Ext.apply({}, state));
						this.fireEvent('staterestore', this, state);
					}
				}
			}
		}
	},


	getStateId : function(){
		return this.stateId || ((this.id.indexOf('ext-comp-') == 0 || this.id.indexOf('ext-gen') == 0) ? null : this.id);
	},


	initStateEvents : function(){
		if(this.stateEvents){
			for(var i = 0, e; e = this.stateEvents[i]; i++){
				this.on(e, this.saveState, this, {delay:100});
			}
		}
	},


	applyState : function(state){
		if(state){
			Ext.apply(this, state);
		}
	},


	getState : function(){
		return null;
	},


	saveState : function(){
		if(Ext.state.Manager && this.stateful !== false){
			var id = this.getStateId();
			if(id){
				var state = this.getState();
				if(this.fireEvent('beforestatesave', this, state) !== false){
					Ext.state.Manager.set(id, state);
					this.fireEvent('statesave', this, state);
				}
			}
		}
	},


	applyToMarkup : function(el){
		this.allowDomMove = false;
		this.el = Ext.get(el);
		this.render(this.el.dom.parentNode);
	},


	addClass : function(cls){
		if(this.el){
			this.el.addClass(cls);
		}else{
			this.cls = this.cls ? this.cls + ' ' + cls : cls;
		}
		return this;
	},


	removeClass : function(cls){
		if(this.el){
			this.el.removeClass(cls);
		}else if(this.cls){
			this.cls = this.cls.split(' ').remove(cls).join(' ');
		}
		return this;
	},



	onRender : function(ct, position){
		if(!this.el && this.autoEl){
			if(Ext.isString(this.autoEl)){
				this.el = document.createElement(this.autoEl);
			}else{
				var div = document.createElement('div');
				Ext.DomHelper.overwrite(div, this.autoEl);
				this.el = div.firstChild;
			}
			if (!this.el.id) {
				this.el.id = this.getId();
			}
		}
		if(this.el){
			this.el = Ext.get(this.el);
			if(this.allowDomMove !== false){
				ct.dom.insertBefore(this.el.dom, position);
				if (div) {
					Ext.removeNode(div);
					div = null;
				}
			}
		}
	},


	getAutoCreate : function(){
		var cfg = Ext.isObject(this.autoCreate) ?
			this.autoCreate : Ext.apply({}, this.defaultAutoCreate);
		if(this.id && !cfg.id){
			cfg.id = this.id;
		}
		return cfg;
	},


	afterRender : Ext.emptyFn,


	destroy : function(){
		if(!this.isDestroyed){
			if(this.fireEvent('beforedestroy', this) !== false){
				this.destroying = true;
				this.beforeDestroy();
				if(this.ownerCt && this.ownerCt.remove){
					this.ownerCt.remove(this, false);
				}
				if(this.rendered){
					this.el.remove();
					if(this.actionMode == 'container' || this.removeMode == 'container'){
						this.container.remove();
					}
				}
				this.onDestroy();
				Ext.ComponentMgr.unregister(this);
				this.fireEvent('destroy', this);
				this.purgeListeners();
				this.destroying = false;
				this.isDestroyed = true;
			}
		}
	},

	deleteMembers : function(){
		var args = arguments;
		for(var i = 0, len = args.length; i < len; ++i){
			delete this[args[i]];
		}
	},


	beforeDestroy : Ext.emptyFn,


	onDestroy  : Ext.emptyFn,


	getEl : function(){
		return this.el;
	},


	getContentTarget : function(){
		return this.el;
	},


	getId : function(){
		return this.id || (this.id = 'ext-comp-' + (++Ext.Component.AUTO_ID));
	},


	getItemId : function(){
		return this.itemId || this.getId();
	},


	focus : function(selectText, delay){
		if(delay){
			this.focus.defer(Ext.isNumber(delay) ? delay : 10, this, [selectText, false]);
			return;
		}
		if(this.rendered){
			this.el.focus();
			if(selectText === true){
				this.el.dom.select();
			}
		}
		return this;
	},


	blur : function(){
		if(this.rendered){
			this.el.blur();
		}
		return this;
	},


	disable : function( silent){
		if(this.rendered){
			this.onDisable();
		}
		this.disabled = true;
		if(silent !== true){
			this.fireEvent('disable', this);
		}
		return this;
	},


	onDisable : function(){
		this.getActionEl().addClass(this.disabledClass);
		this.el.dom.disabled = true;
	},


	enable : function(){
		if(this.rendered){
			this.onEnable();
		}
		this.disabled = false;
		this.fireEvent('enable', this);
		return this;
	},


	onEnable : function(){
		this.getActionEl().removeClass(this.disabledClass);
		this.el.dom.disabled = false;
	},


	setDisabled : function(disabled){
		return this[disabled ? 'disable' : 'enable']();
	},


	show : function(){
		if(this.fireEvent('beforeshow', this) !== false){
			this.hidden = false;
			if(this.autoRender){
				this.render(Ext.isBoolean(this.autoRender) ? Ext.getBody() : this.autoRender);
			}
			if(this.rendered){
				this.onShow();
			}
			this.fireEvent('show', this);
		}
		return this;
	},


	onShow : function(){
		this.getVisibilityEl().removeClass('x-hide-' + this.hideMode);
	},


	hide : function(){
		if(this.fireEvent('beforehide', this) !== false){
			this.doHide();
			this.fireEvent('hide', this);
		}
		return this;
	},


	doHide: function(){
		this.hidden = true;
		if(this.rendered){
			this.onHide();
		}
	},


	onHide : function(){
		this.getVisibilityEl().addClass('x-hide-' + this.hideMode);
	},


	getVisibilityEl : function(){
		return this.hideParent ? this.container : this.getActionEl();
	},


	setVisible : function(visible){
		return this[visible ? 'show' : 'hide']();
	},


	isVisible : function(){
		return this.rendered && this.getVisibilityEl().isVisible();
	},


	cloneConfig : function(overrides){
		overrides = overrides || {};
		var id = overrides.id || Ext.id();
		var cfg = Ext.applyIf(overrides, this.initialConfig);
		cfg.id = id;
		return new this.constructor(cfg);
	},


	getXType : function(){
		return this.constructor.xtype;
	},


	isXType : function(xtype, shallow){

		if (Ext.isFunction(xtype)){
			xtype = xtype.xtype;
		}else if (Ext.isObject(xtype)){
			xtype = xtype.constructor.xtype;
		}

		return !shallow ? ('/' + this.getXTypes() + '/').indexOf('/' + xtype + '/') != -1 : this.constructor.xtype == xtype;
	},


	getXTypes : function(){
		var tc = this.constructor;
		if(!tc.xtypes){
			var c = [], sc = this;
			while(sc && sc.constructor.xtype){
				c.unshift(sc.constructor.xtype);
				sc = sc.constructor.superclass;
			}
			tc.xtypeChain = c;
			tc.xtypes = c.join('/');
		}
		return tc.xtypes;
	},


	findParentBy : function(fn) {
		for (var p = this.ownerCt; (p != null) && !fn(p, this); p = p.ownerCt);
		return p || null;
	},


	findParentByType : function(xtype) {
		return Ext.isFunction(xtype) ?
			this.findParentBy(function(p){
				return p.constructor === xtype;
			}) :
			this.findParentBy(function(p){
				return p.constructor.xtype === xtype;
			});
	},


	getPositionEl : function(){
		return this.positionEl || this.el;
	},


	purgeListeners : function(){
		Ext.Component.superclass.purgeListeners.call(this);
		if(this.mons){
			this.on('beforedestroy', this.clearMons, this, {single: true});
		}
	},


	clearMons : function(){
		Ext.each(this.mons, function(m){
			m.item.un(m.ename, m.fn, m.scope);
		}, this);
		this.mons = [];
	},


	createMons: function(){
		if(!this.mons){
			this.mons = [];
			this.on('beforedestroy', this.clearMons, this, {single: true});
		}
	},


	mon : function(item, ename, fn, scope, opt){
		this.createMons();
		if(Ext.isObject(ename)){
			var propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/;

			var o = ename;
			for(var e in o){
				if(propRe.test(e)){
					continue;
				}
				if(Ext.isFunction(o[e])){

					this.mons.push({
						item: item, ename: e, fn: o[e], scope: o.scope
					});
					item.on(e, o[e], o.scope, o);
				}else{

					this.mons.push({
						item: item, ename: e, fn: o[e], scope: o.scope
					});
					item.on(e, o[e]);
				}
			}
			return;
		}

		this.mons.push({
			item: item, ename: ename, fn: fn, scope: scope
		});
		item.on(ename, fn, scope, opt);
	},


	mun : function(item, ename, fn, scope){
		var found, mon;
		this.createMons();
		for(var i = 0, len = this.mons.length; i < len; ++i){
			mon = this.mons[i];
			if(item === mon.item && ename == mon.ename && fn === mon.fn && scope === mon.scope){
				this.mons.splice(i, 1);
				item.un(ename, fn, scope);
				found = true;
				break;
			}
		}
		return found;
	},


	nextSibling : function(){
		if(this.ownerCt){
			var index = this.ownerCt.items.indexOf(this);
			if(index != -1 && index+1 < this.ownerCt.items.getCount()){
				return this.ownerCt.items.itemAt(index+1);
			}
		}
		return null;
	},


	previousSibling : function(){
		if(this.ownerCt){
			var index = this.ownerCt.items.indexOf(this);
			if(index > 0){
				return this.ownerCt.items.itemAt(index-1);
			}
		}
		return null;
	},


	getBubbleTarget : function(){
		return this.ownerCt;
	}
});

Ext.reg('component', Ext.Component);
Ext.Action = Ext.extend(Object, {








	constructor : function(config){
		this.initialConfig = config;
		this.itemId = config.itemId = (config.itemId || config.id || Ext.id());
		this.items = [];
	},


	isAction : true,


	setText : function(text){
		this.initialConfig.text = text;
		this.callEach('setText', [text]);
	},


	getText : function(){
		return this.initialConfig.text;
	},


	setIconClass : function(cls){
		this.initialConfig.iconCls = cls;
		this.callEach('setIconClass', [cls]);
	},


	getIconClass : function(){
		return this.initialConfig.iconCls;
	},


	setDisabled : function(v){
		this.initialConfig.disabled = v;
		this.callEach('setDisabled', [v]);
	},


	enable : function(){
		this.setDisabled(false);
	},


	disable : function(){
		this.setDisabled(true);
	},


	isDisabled : function(){
		return this.initialConfig.disabled;
	},


	setHidden : function(v){
		this.initialConfig.hidden = v;
		this.callEach('setVisible', [!v]);
	},


	show : function(){
		this.setHidden(false);
	},


	hide : function(){
		this.setHidden(true);
	},


	isHidden : function(){
		return this.initialConfig.hidden;
	},


	setHandler : function(fn, scope){
		this.initialConfig.handler = fn;
		this.initialConfig.scope = scope;
		this.callEach('setHandler', [fn, scope]);
	},


	each : function(fn, scope){
		Ext.each(this.items, fn, scope);
	},


	callEach : function(fnName, args){
		var cs = this.items;
		for(var i = 0, len = cs.length; i < len; i++){
			cs[i][fnName].apply(cs[i], args);
		}
	},


	addComponent : function(comp){
		this.items.push(comp);
		comp.on('destroy', this.removeComponent, this);
	},


	removeComponent : function(comp){
		this.items.remove(comp);
	},


	execute : function(){
		this.initialConfig.handler.apply(this.initialConfig.scope || window, arguments);
	}
});

(function(){
	Ext.Layer = function(config, existingEl){
		config = config || {};
		var dh = Ext.DomHelper;
		var cp = config.parentEl, pel = cp ? Ext.getDom(cp) : document.body;
		if(existingEl){
			this.dom = Ext.getDom(existingEl);
		}
		if(!this.dom){
			var o = config.dh || {tag: 'div', cls: 'x-layer'};
			this.dom = dh.append(pel, o);
		}
		if(config.cls){
			this.addClass(config.cls);
		}
		this.constrain = config.constrain !== false;
		this.setVisibilityMode(Ext.Element.VISIBILITY);
		if(config.id){
			this.id = this.dom.id = config.id;
		}else{
			this.id = Ext.id(this.dom);
		}
		this.zindex = config.zindex || this.getZIndex();
		this.position('absolute', this.zindex);
		if(config.shadow){
			this.shadowOffset = config.shadowOffset || 4;
			this.shadow = new Ext.Shadow({
				offset : this.shadowOffset,
				mode : config.shadow
			});
		}else{
			this.shadowOffset = 0;
		}
		this.useShim = config.shim !== false && Ext.useShims;
		this.useDisplay = config.useDisplay;
		this.hide();
	};

	var supr = Ext.Element.prototype;


	var shims = [];

	Ext.extend(Ext.Layer, Ext.Element, {

		getZIndex : function(){
			return this.zindex || parseInt((this.getShim() || this).getStyle('z-index'), 10) || 11000;
		},

		getShim : function(){
			if(!this.useShim){
				return null;
			}
			if(this.shim){
				return this.shim;
			}
			var shim = shims.shift();
			if(!shim){
				shim = this.createShim();
				shim.enableDisplayMode('block');
				shim.dom.style.display = 'none';
				shim.dom.style.visibility = 'visible';
			}
			var pn = this.dom.parentNode;
			if(shim.dom.parentNode != pn){
				pn.insertBefore(shim.dom, this.dom);
			}
			shim.setStyle('z-index', this.getZIndex()-2);
			this.shim = shim;
			return shim;
		},

		hideShim : function(){
			if(this.shim){
				this.shim.setDisplayed(false);
				shims.push(this.shim);
				delete this.shim;
			}
		},

		disableShadow : function(){
			if(this.shadow){
				this.shadowDisabled = true;
				this.shadow.hide();
				this.lastShadowOffset = this.shadowOffset;
				this.shadowOffset = 0;
			}
		},

		enableShadow : function(show){
			if(this.shadow){
				this.shadowDisabled = false;
				this.shadowOffset = this.lastShadowOffset;
				delete this.lastShadowOffset;
				if(show){
					this.sync(true);
				}
			}
		},




		sync : function(doShow){
			var sw = this.shadow;
			if(!this.updating && this.isVisible() && (sw || this.useShim)){
				var sh = this.getShim();

				var w = this.getWidth(),
					h = this.getHeight();

				var l = this.getLeft(true),
					t = this.getTop(true);

				if(sw && !this.shadowDisabled){
					if(doShow && !sw.isVisible()){
						sw.show(this);
					}else{
						sw.realign(l, t, w, h);
					}
					if(sh){
						if(doShow){
							sh.show();
						}

						var a = sw.adjusts, s = sh.dom.style;
						s.left = (Math.min(l, l+a.l))+'px';
						s.top = (Math.min(t, t+a.t))+'px';
						s.width = (w+a.w)+'px';
						s.height = (h+a.h)+'px';
					}
				}else if(sh){
					if(doShow){
						sh.show();
					}
					sh.setSize(w, h);
					sh.setLeftTop(l, t);
				}

			}
		},


		destroy : function(){
			this.hideShim();
			if(this.shadow){
				this.shadow.hide();
			}
			this.removeAllListeners();
			Ext.removeNode(this.dom);
			delete this.dom;
		},

		remove : function(){
			this.destroy();
		},


		beginUpdate : function(){
			this.updating = true;
		},


		endUpdate : function(){
			this.updating = false;
			this.sync(true);
		},


		hideUnders : function(negOffset){
			if(this.shadow){
				this.shadow.hide();
			}
			this.hideShim();
		},


		constrainXY : function(){
			if(this.constrain){
				var vw = Ext.lib.Dom.getViewWidth(),
					vh = Ext.lib.Dom.getViewHeight();
				var s = Ext.getDoc().getScroll();

				var xy = this.getXY();
				var x = xy[0], y = xy[1];
				var so = this.shadowOffset;
				var w = this.dom.offsetWidth+so, h = this.dom.offsetHeight+so;

				var moved = false;

				if((x + w) > vw+s.left){
					x = vw - w - so;
					moved = true;
				}
				if((y + h) > vh+s.top){
					y = vh - h - so;
					moved = true;
				}

				if(x < s.left){
					x = s.left;
					moved = true;
				}
				if(y < s.top){
					y = s.top;
					moved = true;
				}
				if(moved){
					if(this.avoidY){
						var ay = this.avoidY;
						if(y <= ay && (y+h) >= ay){
							y = ay-h-5;
						}
					}
					xy = [x, y];
					this.storeXY(xy);
					supr.setXY.call(this, xy);
					this.sync();
				}
			}
			return this;
		},

		isVisible : function(){
			return this.visible;
		},


		showAction : function(){
			this.visible = true;
			if(this.useDisplay === true){
				this.setDisplayed('');
			}else if(this.lastXY){
				supr.setXY.call(this, this.lastXY);
			}else if(this.lastLT){
				supr.setLeftTop.call(this, this.lastLT[0], this.lastLT[1]);
			}
		},


		hideAction : function(){
			this.visible = false;
			if(this.useDisplay === true){
				this.setDisplayed(false);
			}else{
				this.setLeftTop(-10000,-10000);
			}
		},


		setVisible : function(v, a, d, c, e){
			if(v){
				this.showAction();
			}
			if(a && v){
				var cb = function(){
					this.sync(true);
					if(c){
						c();
					}
				}.createDelegate(this);
				supr.setVisible.call(this, true, true, d, cb, e);
			}else{
				if(!v){
					this.hideUnders(true);
				}
				var cb = c;
				if(a){
					cb = function(){
						this.hideAction();
						if(c){
							c();
						}
					}.createDelegate(this);
				}
				supr.setVisible.call(this, v, a, d, cb, e);
				if(v){
					this.sync(true);
				}else if(!a){
					this.hideAction();
				}
			}
			return this;
		},

		storeXY : function(xy){
			delete this.lastLT;
			this.lastXY = xy;
		},

		storeLeftTop : function(left, top){
			delete this.lastXY;
			this.lastLT = [left, top];
		},


		beforeFx : function(){
			this.beforeAction();
			return Ext.Layer.superclass.beforeFx.apply(this, arguments);
		},


		afterFx : function(){
			Ext.Layer.superclass.afterFx.apply(this, arguments);
			this.sync(this.isVisible());
		},


		beforeAction : function(){
			if(!this.updating && this.shadow){
				this.shadow.hide();
			}
		},


		setLeft : function(left){
			this.storeLeftTop(left, this.getTop(true));
			supr.setLeft.apply(this, arguments);
			this.sync();
			return this;
		},

		setTop : function(top){
			this.storeLeftTop(this.getLeft(true), top);
			supr.setTop.apply(this, arguments);
			this.sync();
			return this;
		},

		setLeftTop : function(left, top){
			this.storeLeftTop(left, top);
			supr.setLeftTop.apply(this, arguments);
			this.sync();
			return this;
		},

		setXY : function(xy, a, d, c, e){
			this.fixDisplay();
			this.beforeAction();
			this.storeXY(xy);
			var cb = this.createCB(c);
			supr.setXY.call(this, xy, a, d, cb, e);
			if(!a){
				cb();
			}
			return this;
		},


		createCB : function(c){
			var el = this;
			return function(){
				el.constrainXY();
				el.sync(true);
				if(c){
					c();
				}
			};
		},


		setX : function(x, a, d, c, e){
			this.setXY([x, this.getY()], a, d, c, e);
			return this;
		},


		setY : function(y, a, d, c, e){
			this.setXY([this.getX(), y], a, d, c, e);
			return this;
		},


		setSize : function(w, h, a, d, c, e){
			this.beforeAction();
			var cb = this.createCB(c);
			supr.setSize.call(this, w, h, a, d, cb, e);
			if(!a){
				cb();
			}
			return this;
		},


		setWidth : function(w, a, d, c, e){
			this.beforeAction();
			var cb = this.createCB(c);
			supr.setWidth.call(this, w, a, d, cb, e);
			if(!a){
				cb();
			}
			return this;
		},


		setHeight : function(h, a, d, c, e){
			this.beforeAction();
			var cb = this.createCB(c);
			supr.setHeight.call(this, h, a, d, cb, e);
			if(!a){
				cb();
			}
			return this;
		},


		setBounds : function(x, y, w, h, a, d, c, e){
			this.beforeAction();
			var cb = this.createCB(c);
			if(!a){
				this.storeXY([x, y]);
				supr.setXY.call(this, [x, y]);
				supr.setSize.call(this, w, h, a, d, cb, e);
				cb();
			}else{
				supr.setBounds.call(this, x, y, w, h, a, d, cb, e);
			}
			return this;
		},


		setZIndex : function(zindex){
			this.zindex = zindex;
			this.setStyle('z-index', zindex + 2);
			if(this.shadow){
				this.shadow.setZIndex(zindex + 1);
			}
			if(this.shim){
				this.shim.setStyle('z-index', zindex);
			}
			return this;
		}
	});
})();

Ext.Shadow = function(config){
	Ext.apply(this, config);
	if(typeof this.mode != "string"){
		this.mode = this.defaultMode;
	}
	var o = this.offset, a = {h: 0};
	var rad = Math.floor(this.offset/2);
	switch(this.mode.toLowerCase()){
		case "drop":
			a.w = 0;
			a.l = a.t = o;
			a.t -= 1;
			if(Ext.isIE){
				a.l -= this.offset + rad;
				a.t -= this.offset + rad;
				a.w -= rad;
				a.h -= rad;
				a.t += 1;
			}
			break;
		case "sides":
			a.w = (o*2);
			a.l = -o;
			a.t = o-1;
			if(Ext.isIE){
				a.l -= (this.offset - rad);
				a.t -= this.offset + rad;
				a.l += 1;
				a.w -= (this.offset - rad)*2;
				a.w -= rad + 1;
				a.h -= 1;
			}
			break;
		case "frame":
			a.w = a.h = (o*2);
			a.l = a.t = -o;
			a.t += 1;
			a.h -= 2;
			if(Ext.isIE){
				a.l -= (this.offset - rad);
				a.t -= (this.offset - rad);
				a.l += 1;
				a.w -= (this.offset + rad + 1);
				a.h -= (this.offset + rad);
				a.h += 1;
			}
			break;
	};

	this.adjusts = a;
};

Ext.Shadow.prototype = {


	offset: 4,


	defaultMode: "drop",


	show : function(target){
		target = Ext.get(target);
		if(!this.el){
			this.el = Ext.Shadow.Pool.pull();
			if(this.el.dom.nextSibling != target.dom){
				this.el.insertBefore(target);
			}
		}
		this.el.setStyle("z-index", this.zIndex || parseInt(target.getStyle("z-index"), 10)-1);
		if(Ext.isIE){
			this.el.dom.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity=50) progid:DXImageTransform.Microsoft.Blur(pixelradius="+(this.offset)+")";
		}
		this.realign(
			target.getLeft(true),
			target.getTop(true),
			target.getWidth(),
			target.getHeight()
		);
		this.el.dom.style.display = "block";
	},


	isVisible : function(){
		return this.el ? true : false;
	},


	realign : function(l, t, w, h){
		if(!this.el){
			return;
		}
		var a = this.adjusts, d = this.el.dom, s = d.style;
		var iea = 0;
		s.left = (l+a.l)+"px";
		s.top = (t+a.t)+"px";
		var sw = (w+a.w), sh = (h+a.h), sws = sw +"px", shs = sh + "px";
		if(s.width != sws || s.height != shs){
			s.width = sws;
			s.height = shs;
			if(!Ext.isIE){
				var cn = d.childNodes;
				var sww = Math.max(0, (sw-12))+"px";
				cn[0].childNodes[1].style.width = sww;
				cn[1].childNodes[1].style.width = sww;
				cn[2].childNodes[1].style.width = sww;
				cn[1].style.height = Math.max(0, (sh-12))+"px";
			}
		}
	},


	hide : function(){
		if(this.el){
			this.el.dom.style.display = "none";
			Ext.Shadow.Pool.push(this.el);
			delete this.el;
		}
	},


	setZIndex : function(z){
		this.zIndex = z;
		if(this.el){
			this.el.setStyle("z-index", z);
		}
	}
};


Ext.Shadow.Pool = function(){
	var p = [];
	var markup = Ext.isIE ?
		'<div class="x-ie-shadow"></div>' :
		'<div class="x-shadow"><div class="xst"><div class="xstl"></div><div class="xstc"></div><div class="xstr"></div></div><div class="xsc"><div class="xsml"></div><div class="xsmc"></div><div class="xsmr"></div></div><div class="xsb"><div class="xsbl"></div><div class="xsbc"></div><div class="xsbr"></div></div></div>';
	return {
		pull : function(){
			var sh = p.shift();
			if(!sh){
				sh = Ext.get(Ext.DomHelper.insertHtml("beforeBegin", document.body.firstChild, markup));
				sh.autoBoxAdjust = false;
			}
			return sh;
		},

		push : function(sh){
			p.push(sh);
		}
	};
}();
Ext.BoxComponent = Ext.extend(Ext.Component, {
























	initComponent : function(){
		Ext.BoxComponent.superclass.initComponent.call(this);
		this.addEvents(

			'resize',

			'move'
		);
	},


	boxReady : false,

	deferHeight: false,


	setSize : function(w, h){


		if(typeof w == 'object'){
			h = w.height, w = w.width;
		}
		if (Ext.isDefined(w) && Ext.isDefined(this.boxMinWidth) && (w < this.boxMinWidth)) {
			w = this.boxMinWidth;
		}
		if (Ext.isDefined(h) && Ext.isDefined(this.boxMinHeight) && (h < this.boxMinHeight)) {
			h = this.boxMinHeight;
		}
		if (Ext.isDefined(w) && Ext.isDefined(this.boxMaxWidth) && (w > this.boxMaxWidth)) {
			w = this.boxMaxWidth;
		}
		if (Ext.isDefined(h) && Ext.isDefined(this.boxMaxHeight) && (h > this.boxMaxHeight)) {
			h = this.boxMaxHeight;
		}

		if(!this.boxReady){
			this.width = w, this.height = h;
			return this;
		}


		if(this.cacheSizes !== false && this.lastSize && this.lastSize.width == w && this.lastSize.height == h){
			return this;
		}
		this.lastSize = {width: w, height: h};
		var adj = this.adjustSize(w, h),
			aw = adj.width,
			ah = adj.height,
			rz;
		if(aw !== undefined || ah !== undefined){
			rz = this.getResizeEl();
			if(!this.deferHeight && aw !== undefined && ah !== undefined){
				rz.setSize(aw, ah);
			}else if(!this.deferHeight && ah !== undefined){
				rz.setHeight(ah);
			}else if(aw !== undefined){
				rz.setWidth(aw);
			}
			this.onResize(aw, ah, w, h);
		}
		return this;
	},


	setWidth : function(width){
		return this.setSize(width);
	},


	setHeight : function(height){
		return this.setSize(undefined, height);
	},


	getSize : function(){
		return this.getResizeEl().getSize();
	},


	getWidth : function(){
		return this.getResizeEl().getWidth();
	},


	getHeight : function(){
		return this.getResizeEl().getHeight();
	},


	getOuterSize : function(){
		var el = this.getResizeEl();
		return {width: el.getWidth() + el.getMargins('lr'),
			height: el.getHeight() + el.getMargins('tb')};
	},


	getPosition : function(local){
		var el = this.getPositionEl();
		if(local === true){
			return [el.getLeft(true), el.getTop(true)];
		}
		return this.xy || el.getXY();
	},


	getBox : function(local){
		var pos = this.getPosition(local);
		var s = this.getSize();
		s.x = pos[0];
		s.y = pos[1];
		return s;
	},


	updateBox : function(box){
		this.setSize(box.width, box.height);
		this.setPagePosition(box.x, box.y);
		return this;
	},


	getResizeEl : function(){
		return this.resizeEl || this.el;
	},


	setAutoScroll : function(scroll){
		if(this.rendered){
			this.getContentTarget().setOverflow(scroll ? 'auto' : '');
		}
		this.autoScroll = scroll;
		return this;
	},


	setPosition : function(x, y){
		if(x && typeof x[1] == 'number'){
			y = x[1];
			x = x[0];
		}
		this.x = x;
		this.y = y;
		if(!this.boxReady){
			return this;
		}
		var adj = this.adjustPosition(x, y);
		var ax = adj.x, ay = adj.y;

		var el = this.getPositionEl();
		if(ax !== undefined || ay !== undefined){
			if(ax !== undefined && ay !== undefined){
				el.setLeftTop(ax, ay);
			}else if(ax !== undefined){
				el.setLeft(ax);
			}else if(ay !== undefined){
				el.setTop(ay);
			}
			this.onPosition(ax, ay);
			this.fireEvent('move', this, ax, ay);
		}
		return this;
	},


	setPagePosition : function(x, y){
		if(x && typeof x[1] == 'number'){
			y = x[1];
			x = x[0];
		}
		this.pageX = x;
		this.pageY = y;
		if(!this.boxReady){
			return;
		}
		if(x === undefined || y === undefined){
			return;
		}
		var p = this.getPositionEl().translatePoints(x, y);
		this.setPosition(p.left, p.top);
		return this;
	},


	afterRender : function(){
		Ext.BoxComponent.superclass.afterRender.call(this);
		if(this.resizeEl){
			this.resizeEl = Ext.get(this.resizeEl);
		}
		if(this.positionEl){
			this.positionEl = Ext.get(this.positionEl);
		}
		this.boxReady = true;
		this.setAutoScroll(this.autoScroll);
		this.setSize(this.width, this.height);
		if(this.x || this.y){
			this.setPosition(this.x, this.y);
		}else if(this.pageX || this.pageY){
			this.setPagePosition(this.pageX, this.pageY);
		}
	},


	syncSize : function(){
		delete this.lastSize;
		this.setSize(this.autoWidth ? undefined : this.getResizeEl().getWidth(), this.autoHeight ? undefined : this.getResizeEl().getHeight());
		return this;
	},


	onResize : function(adjWidth, adjHeight, rawWidth, rawHeight){
		this.fireEvent('resize', this, adjWidth, adjHeight, rawWidth, rawHeight);
	},


	onPosition : function(x, y){

	},


	adjustSize : function(w, h){
		if(this.autoWidth){
			w = 'auto';
		}
		if(this.autoHeight){
			h = 'auto';
		}
		return {width : w, height: h};
	},


	adjustPosition : function(x, y){
		return {x : x, y: y};
	}
});
Ext.reg('box', Ext.BoxComponent);



Ext.Spacer = Ext.extend(Ext.BoxComponent, {
	autoEl:'div'
});
Ext.reg('spacer', Ext.Spacer);
Ext.SplitBar = function(dragElement, resizingElement, orientation, placement, existingProxy){


	this.el = Ext.get(dragElement, true);
	this.el.dom.unselectable = "on";

	this.resizingEl = Ext.get(resizingElement, true);


	this.orientation = orientation || Ext.SplitBar.HORIZONTAL;



	this.minSize = 0;


	this.maxSize = 2000;


	this.animate = false;


	this.useShim = false;


	this.shim = null;

	if(!existingProxy){

		this.proxy = Ext.SplitBar.createProxy(this.orientation);
	}else{
		this.proxy = Ext.get(existingProxy).dom;
	}

	this.dd = new Ext.dd.DDProxy(this.el.dom.id, "XSplitBars", {dragElId : this.proxy.id});


	this.dd.b4StartDrag = this.onStartProxyDrag.createDelegate(this);


	this.dd.endDrag = this.onEndProxyDrag.createDelegate(this);


	this.dragSpecs = {};


	this.adapter = new Ext.SplitBar.BasicLayoutAdapter();
	this.adapter.init(this);

	if(this.orientation == Ext.SplitBar.HORIZONTAL){

		this.placement = placement || (this.el.getX() > this.resizingEl.getX() ? Ext.SplitBar.LEFT : Ext.SplitBar.RIGHT);
		this.el.addClass("x-splitbar-h");
	}else{

		this.placement = placement || (this.el.getY() > this.resizingEl.getY() ? Ext.SplitBar.TOP : Ext.SplitBar.BOTTOM);
		this.el.addClass("x-splitbar-v");
	}

	this.addEvents(

		"resize",

		"moved",

		"beforeresize",

		"beforeapply"
	);

	Ext.SplitBar.superclass.constructor.call(this);
};

Ext.extend(Ext.SplitBar, Ext.util.Observable, {
	onStartProxyDrag : function(x, y){
		this.fireEvent("beforeresize", this);
		this.overlay =  Ext.DomHelper.append(document.body,  {cls: "x-drag-overlay", html: "&#160;"}, true);
		this.overlay.unselectable();
		this.overlay.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true));
		this.overlay.show();
		Ext.get(this.proxy).setDisplayed("block");
		var size = this.adapter.getElementSize(this);
		this.activeMinSize = this.getMinimumSize();
		this.activeMaxSize = this.getMaximumSize();
		var c1 = size - this.activeMinSize;
		var c2 = Math.max(this.activeMaxSize - size, 0);
		if(this.orientation == Ext.SplitBar.HORIZONTAL){
			this.dd.resetConstraints();
			this.dd.setXConstraint(
				this.placement == Ext.SplitBar.LEFT ? c1 : c2,
				this.placement == Ext.SplitBar.LEFT ? c2 : c1,
				this.tickSize
			);
			this.dd.setYConstraint(0, 0);
		}else{
			this.dd.resetConstraints();
			this.dd.setXConstraint(0, 0);
			this.dd.setYConstraint(
				this.placement == Ext.SplitBar.TOP ? c1 : c2,
				this.placement == Ext.SplitBar.TOP ? c2 : c1,
				this.tickSize
			);
		}
		this.dragSpecs.startSize = size;
		this.dragSpecs.startPoint = [x, y];
		Ext.dd.DDProxy.prototype.b4StartDrag.call(this.dd, x, y);
	},


	onEndProxyDrag : function(e){
		Ext.get(this.proxy).setDisplayed(false);
		var endPoint = Ext.lib.Event.getXY(e);
		if(this.overlay){
			Ext.destroy(this.overlay);
			delete this.overlay;
		}
		var newSize;
		if(this.orientation == Ext.SplitBar.HORIZONTAL){
			newSize = this.dragSpecs.startSize +
				(this.placement == Ext.SplitBar.LEFT ?
					endPoint[0] - this.dragSpecs.startPoint[0] :
					this.dragSpecs.startPoint[0] - endPoint[0]
					);
		}else{
			newSize = this.dragSpecs.startSize +
				(this.placement == Ext.SplitBar.TOP ?
					endPoint[1] - this.dragSpecs.startPoint[1] :
					this.dragSpecs.startPoint[1] - endPoint[1]
					);
		}
		newSize = Math.min(Math.max(newSize, this.activeMinSize), this.activeMaxSize);
		if(newSize != this.dragSpecs.startSize){
			if(this.fireEvent('beforeapply', this, newSize) !== false){
				this.adapter.setElementSize(this, newSize);
				this.fireEvent("moved", this, newSize);
				this.fireEvent("resize", this, newSize);
			}
		}
	},


	getAdapter : function(){
		return this.adapter;
	},


	setAdapter : function(adapter){
		this.adapter = adapter;
		this.adapter.init(this);
	},


	getMinimumSize : function(){
		return this.minSize;
	},


	setMinimumSize : function(minSize){
		this.minSize = minSize;
	},


	getMaximumSize : function(){
		return this.maxSize;
	},


	setMaximumSize : function(maxSize){
		this.maxSize = maxSize;
	},


	setCurrentSize : function(size){
		var oldAnimate = this.animate;
		this.animate = false;
		this.adapter.setElementSize(this, size);
		this.animate = oldAnimate;
	},


	destroy : function(removeEl){
		Ext.destroy(this.shim, Ext.get(this.proxy));
		this.dd.unreg();
		if(removeEl){
			this.el.remove();
		}
		this.purgeListeners();
	}
});


Ext.SplitBar.createProxy = function(dir){
	var proxy = new Ext.Element(document.createElement("div"));
	document.body.appendChild(proxy.dom);
	proxy.unselectable();
	var cls = 'x-splitbar-proxy';
	proxy.addClass(cls + ' ' + (dir == Ext.SplitBar.HORIZONTAL ? cls +'-h' : cls + '-v'));
	return proxy.dom;
};


Ext.SplitBar.BasicLayoutAdapter = function(){
};

Ext.SplitBar.BasicLayoutAdapter.prototype = {

	init : function(s){

	},

	getElementSize : function(s){
		if(s.orientation == Ext.SplitBar.HORIZONTAL){
			return s.resizingEl.getWidth();
		}else{
			return s.resizingEl.getHeight();
		}
	},


	setElementSize : function(s, newSize, onComplete){
		if(s.orientation == Ext.SplitBar.HORIZONTAL){
			if(!s.animate){
				s.resizingEl.setWidth(newSize);
				if(onComplete){
					onComplete(s, newSize);
				}
			}else{
				s.resizingEl.setWidth(newSize, true, .1, onComplete, 'easeOut');
			}
		}else{

			if(!s.animate){
				s.resizingEl.setHeight(newSize);
				if(onComplete){
					onComplete(s, newSize);
				}
			}else{
				s.resizingEl.setHeight(newSize, true, .1, onComplete, 'easeOut');
			}
		}
	}
};


Ext.SplitBar.AbsoluteLayoutAdapter = function(container){
	this.basic = new Ext.SplitBar.BasicLayoutAdapter();
	this.container = Ext.get(container);
};

Ext.SplitBar.AbsoluteLayoutAdapter.prototype = {
	init : function(s){
		this.basic.init(s);
	},

	getElementSize : function(s){
		return this.basic.getElementSize(s);
	},

	setElementSize : function(s, newSize, onComplete){
		this.basic.setElementSize(s, newSize, this.moveSplitter.createDelegate(this, [s]));
	},

	moveSplitter : function(s){
		var yes = Ext.SplitBar;
		switch(s.placement){
			case yes.LEFT:
				s.el.setX(s.resizingEl.getRight());
				break;
			case yes.RIGHT:
				s.el.setStyle("right", (this.container.getWidth() - s.resizingEl.getLeft()) + "px");
				break;
			case yes.TOP:
				s.el.setY(s.resizingEl.getBottom());
				break;
			case yes.BOTTOM:
				s.el.setY(s.resizingEl.getTop() - s.el.getHeight());
				break;
		}
	}
};


Ext.SplitBar.VERTICAL = 1;


Ext.SplitBar.HORIZONTAL = 2;


Ext.SplitBar.LEFT = 1;


Ext.SplitBar.RIGHT = 2;


Ext.SplitBar.TOP = 3;


Ext.SplitBar.BOTTOM = 4;

Ext.Container = Ext.extend(Ext.BoxComponent, {




	bufferResize: 50,







	autoDestroy : true,


	forceLayout: false,



	defaultType : 'panel',


	resizeEvent: 'resize',


	bubbleEvents: ['add', 'remove'],


	initComponent : function(){
		Ext.Container.superclass.initComponent.call(this);

		this.addEvents(

			'afterlayout',

			'beforeadd',

			'beforeremove',

			'add',

			'remove'
		);

		this.enableBubble(this.bubbleEvents);


		var items = this.items;
		if(items){
			delete this.items;
			this.add(items);
		}
	},


	initItems : function(){
		if(!this.items){
			this.items = new Ext.util.MixedCollection(false, this.getComponentId);
			this.getLayout();
		}
	},


	setLayout : function(layout){
		if(this.layout && this.layout != layout){
			this.layout.setContainer(null);
		}
		this.initItems();
		this.layout = layout;
		layout.setContainer(this);
	},

	afterRender: function(){
		this.layoutDone = false;
		if(!this.layout){
			this.layout = 'auto';
		}
		if(Ext.isObject(this.layout) && !this.layout.layout){
			this.layoutConfig = this.layout;
			this.layout = this.layoutConfig.type;
		}
		if(Ext.isString(this.layout)){
			this.layout = new Ext.Container.LAYOUTS[this.layout.toLowerCase()](this.layoutConfig);
		}
		this.setLayout(this.layout);



		Ext.Container.superclass.afterRender.call(this);

		if(Ext.isDefined(this.activeItem)){
			var item = this.activeItem;
			delete this.activeItem;
			this.layout.setActiveItem(item);
		}


		if(!this.ownerCt && !this.layoutDone){
			this.doLayout(false, true);
		}

		if(this.monitorResize === true){
			Ext.EventManager.onWindowResize(this.doLayout, this, [false]);
		}
	},


	getLayoutTarget : function(){
		return this.el;
	},


	getComponentId : function(comp){
		return comp.getItemId();
	},


	add : function(comp){
		this.initItems();
		var args = arguments.length > 1;
		if(args || Ext.isArray(comp)){
			var result = [];
			Ext.each(args ? arguments : comp, function(c){
				result.push(this.add(c));
			}, this);
			return result;
		}
		var c = this.lookupComponent(this.applyDefaults(comp));
		var index = this.items.length;
		if(this.fireEvent('beforeadd', this, c, index) !== false && this.onBeforeAdd(c) !== false){
			this.items.add(c);

			c.onAdded(this, index);
			this.onAdd(c);
			this.fireEvent('add', this, c, index);
		}
		return c;
	},

	onAdd : function(c){

	},


	onAdded : function(container, pos) {

		this.ownerCt = container;
		this.initRef();

		this.cascade(function(c){
			c.initRef();
		});
		this.fireEvent('added', this, container, pos);
	},


	insert : function(index, comp){
		this.initItems();
		var a = arguments, len = a.length;
		if(len > 2){
			var result = [];
			for(var i = len-1; i >= 1; --i) {
				result.push(this.insert(index, a[i]));
			}
			return result;
		}
		var c = this.lookupComponent(this.applyDefaults(comp));
		index = Math.min(index, this.items.length);
		if(this.fireEvent('beforeadd', this, c, index) !== false && this.onBeforeAdd(c) !== false){
			if(c.ownerCt == this){
				this.items.remove(c);
			}
			this.items.insert(index, c);
			c.onAdded(this, index);
			this.onAdd(c);
			this.fireEvent('add', this, c, index);
		}
		return c;
	},


	applyDefaults : function(c){
		var d = this.defaults;
		if(d){
			if(Ext.isFunction(d)){
				d = d.call(this, c);
			}
			if(Ext.isString(c)){
				c = Ext.ComponentMgr.get(c);
				Ext.apply(c, d);
			}else if(!c.events){
				Ext.applyIf(c, d);
			}else{
				Ext.apply(c, d);
			}
		}
		return c;
	},


	onBeforeAdd : function(item){
		if(item.ownerCt){
			item.ownerCt.remove(item, false);
		}
		if(this.hideBorders === true){
			item.border = (item.border === true);
		}
	},


	remove : function(comp, autoDestroy){
		this.initItems();
		var c = this.getComponent(comp);
		if(c && this.fireEvent('beforeremove', this, c) !== false){
			this.doRemove(c, autoDestroy);
			this.fireEvent('remove', this, c);
		}
		return c;
	},

	onRemove: function(c){

	},


	doRemove: function(c, autoDestroy){
		if(this.layout && this.rendered){
			this.layout.onRemove(c);
		}
		this.items.remove(c);
		c.onRemoved();
		this.onRemove(c);
		if(autoDestroy === true || (autoDestroy !== false && this.autoDestroy)){
			c.destroy();
		}
	},


	removeAll: function(autoDestroy){
		this.initItems();
		var item, rem = [], items = [];
		this.items.each(function(i){
			rem.push(i);
		});
		for (var i = 0, len = rem.length; i < len; ++i){
			item = rem[i];
			this.remove(item, autoDestroy);
			if(item.ownerCt !== this){
				items.push(item);
			}
		}
		return items;
	},


	getComponent : function(comp){
		if(Ext.isObject(comp)){
			comp = comp.getItemId();
		}
		return this.items.get(comp);
	},


	lookupComponent : function(comp){
		if(Ext.isString(comp)){
			return Ext.ComponentMgr.get(comp);
		}else if(!comp.events){
			return this.createComponent(comp);
		}
		return comp;
	},


	createComponent : function(config, defaultType){


		var c = config.render ? config : Ext.create(Ext.apply({
			ownerCt: this
		}, config), defaultType || this.defaultType);
		delete c.ownerCt;
		return c;
	},


	canLayout: function() {
		var el = this.getLayoutTarget(), vs;
		return !!(el && (vs = el.dom.offsetWidth || el.dom.offsetHeight));
	},


	doLayout: function(shallow, force){
		var rendered = this.rendered,
			forceLayout = force || this.forceLayout,
			cs, i, len, c;

		this.layoutDone = true;
		if(!this.canLayout() || this.collapsed){
			this.deferLayout = this.deferLayout || !shallow;
			if(!forceLayout){
				return;
			}
			shallow = shallow && !this.deferLayout;
		} else {
			delete this.deferLayout;
		}

		cs = (shallow !== true && this.items) ? this.items.items : [];


		for(i = 0, len = cs.length; i < len; i++){
			if ((c = cs[i]).layout) {
				c.suspendLayoutResize = true;
			}
		}



		if(rendered && this.layout){
			this.layout.layout();
		}


		for(i = 0; i < len; i++){
			if((c = cs[i]).doLayout){
				c.doLayout(false, forceLayout);
			}
		}
		if(rendered){
			this.onLayout(shallow, forceLayout);
		}

		this.hasLayout = true;
		delete this.forceLayout;


		for(i = 0; i < len; i++){
			if ((c = cs[i]).layout) {
				delete c.suspendLayoutResize;
			}
		}
	},


	onLayout : Ext.emptyFn,

	onResize: function(adjWidth, adjHeight, rawWidth, rawHeight){
		Ext.Container.superclass.onResize.apply(this, arguments);
		if ((this.rendered && this.layout && this.layout.monitorResize) && !this.suspendLayoutResize) {
			this.layout.onResize();
		}
	},


	hasLayoutPending: function(){

		var pending = this.layoutPending;
		this.ownerCt.bubble(function(c){
			return !(pending = c.layoutPending);
		});
		return pending;

	},

	onShow : function(){
		Ext.Container.superclass.onShow.call(this);
		if(Ext.isDefined(this.deferLayout)){
			this.doLayout(true);
		}
	},


	getLayout : function(){
		if(!this.layout){
			var layout = new Ext.layout.ContainerLayout(this.layoutConfig);
			this.setLayout(layout);
		}
		return this.layout;
	},


	beforeDestroy : function(){
		var c;
		if(this.items){
			while(c = this.items.first()){
				this.doRemove(c, true);
			}
		}
		if(this.monitorResize){
			Ext.EventManager.removeResizeListener(this.doLayout, this);
		}
		Ext.destroy(this.layout);
		Ext.Container.superclass.beforeDestroy.call(this);
	},


	bubble : function(fn, scope, args){
		var p = this;
		while(p){
			if(fn.apply(scope || p, args || [p]) === false){
				break;
			}
			p = p.ownerCt;
		}
		return this;
	},


	cascade : function(fn, scope, args){
		if(fn.apply(scope || this, args || [this]) !== false){
			if(this.items){
				var cs = this.items.items;
				for(var i = 0, len = cs.length; i < len; i++){
					if(cs[i].cascade){
						cs[i].cascade(fn, scope, args);
					}else{
						fn.apply(scope || cs[i], args || [cs[i]]);
					}
				}
			}
		}
		return this;
	},


	findById : function(id){
		var m, ct = this;
		this.cascade(function(c){
			if(ct != c && c.id === id){
				m = c;
				return false;
			}
		});
		return m || null;
	},


	findByType : function(xtype, shallow){
		return this.findBy(function(c){
			return c.isXType(xtype, shallow);
		});
	},


	find : function(prop, value){
		return this.findBy(function(c){
			return c[prop] === value;
		});
	},


	findBy : function(fn, scope){
		var m = [], ct = this;
		this.cascade(function(c){
			if(ct != c && fn.call(scope || c, c, ct) === true){
				m.push(c);
			}
		});
		return m;
	},


	get : function(key){
		return this.items.get(key);
	}
});

Ext.Container.LAYOUTS = {};
Ext.reg('container', Ext.Container);

Ext.layout.ContainerLayout = Ext.extend(Object, {






	monitorResize:false,

	activeItem : null,

	constructor : function(config){
		Ext.apply(this, config);
	},


	layout : function(){
		var target = this.container.getLayoutTarget();
		if(!(this.hasLayout || Ext.isEmpty(this.targetCls))){
			target.addClass(this.targetCls)
		}
		this.onLayout(this.container, target);
		this.container.fireEvent('afterlayout', this.container, this);
		this.hasLayout = true;
	},


	onLayout : function(ct, target){
		this.renderAll(ct, target);
	},


	isValidParent : function(c, target){
		return target && c.getPositionEl().dom.parentNode == (target.dom || target);
	},


	renderAll : function(ct, target){
		var items = ct.items.items;
		for(var i = 0, len = items.length; i < len; i++) {
			var c = items[i];
			if(c && (!c.rendered || !this.isValidParent(c, target))){
				this.renderItem(c, i, target);
			}
		}
	},


	renderItem : function(c, position, target){
		if(c && !c.rendered){
			c.render(target, position);
			this.configureItem(c, position);
		}else if(c && !this.isValidParent(c, target)){
			if(Ext.isNumber(position)){
				position = target.dom.childNodes[position];
			}
			target.dom.insertBefore(c.getPositionEl().dom, position || null);
			c.container = target;
			this.configureItem(c, position);
		}
	},


	configureItem: function(c, position){
		if(this.extraCls){
			var t = c.getPositionEl ? c.getPositionEl() : c;
			t.addClass(this.extraCls);
		}

		if(c.doLayout && this.forceLayout){
			c.doLayout(false, true);
		}
		if (this.renderHidden && c != this.activeItem) {
			c.hide();
		}
	},

	onRemove: function(c){
		if(this.activeItem == c){
			delete this.activeItem;
		}
		if(c.rendered && this.extraCls){
			var t = c.getPositionEl ? c.getPositionEl() : c;
			t.removeClass(this.extraCls);
		}
	},


	onResize: function(){
		var ct = this.container,
			b = ct.bufferResize;

		if (ct.collapsed){
			return;
		}



		if (b && ct.ownerCt) {



			if (!ct.hasLayoutPending()){
				if(!this.resizeTask){
					this.resizeTask = new Ext.util.DelayedTask(this.runLayout, this);
					this.resizeBuffer = Ext.isNumber(b) ? b : 50;
				}
				ct.layoutPending = true;
				this.resizeTask.delay(this.resizeBuffer);
			}
		}else{
			ct.doLayout(false, this.forceLayout);
		}
	},


	runLayout: function(){
		var ct = this.container;
		ct.doLayout();
		delete ct.layoutPending;
	},


	setContainer : function(ct){


		this.container = ct;
	},


	parseMargins : function(v){
		if(Ext.isNumber(v)){
			v = v.toString();
		}
		var ms = v.split(' ');
		var len = ms.length;
		if(len == 1){
			ms[1] = ms[0];
			ms[2] = ms[0];
			ms[3] = ms[0];
		}
		if(len == 2){
			ms[2] = ms[0];
			ms[3] = ms[1];
		}
		if(len == 3){
			ms[3] = ms[1];
		}
		return {
			top:parseInt(ms[0], 10) || 0,
			right:parseInt(ms[1], 10) || 0,
			bottom:parseInt(ms[2], 10) || 0,
			left:parseInt(ms[3], 10) || 0
		};
	},


	fieldTpl: (function() {
		var t = new Ext.Template(
			'<div class="x-form-item {itemCls}" tabIndex="-1">',
			'<label for="{id}" style="{labelStyle}" class="x-form-item-label">{label}{labelSeparator}</label>',
			'<div class="x-form-element" id="x-form-el-{id}" style="{elementStyle}">',
			'</div><div class="{clearCls}"></div>',
			'</div>'
		);
		t.disableFormats = true;
		return t.compile();
	})(),


	destroy : function(){
		if(!Ext.isEmpty(this.targetCls)){
			var target = this.container.getLayoutTarget();
			if(target){
				target.removeClass(this.targetCls);
			}
		}
	}
});
Ext.Container.LAYOUTS['auto'] = Ext.layout.ContainerLayout;

Ext.layout.FitLayout = Ext.extend(Ext.layout.ContainerLayout, {

	monitorResize:true,


	onLayout : function(ct, target){
		Ext.layout.FitLayout.superclass.onLayout.call(this, ct, target);
		if(!this.container.collapsed){
			this.setItemSize(this.activeItem || ct.items.itemAt(0), target.getViewSize(true));
		}
	},


	setItemSize : function(item, size){
		if(item && size.height > 0){
			item.setSize(size);
		}
	}
});
Ext.Container.LAYOUTS['fit'] = Ext.layout.FitLayout;
Ext.layout.CardLayout = Ext.extend(Ext.layout.FitLayout, {

	deferredRender : false,


	layoutOnCardChange : false,



	renderHidden : true,

	constructor: function(config){
		Ext.layout.CardLayout.superclass.constructor.call(this, config);

	},


	setActiveItem : function(item){
		var ai = this.activeItem;
		item = this.container.getComponent(item);
		if(ai != item){
			if(ai){
				ai.hide();
				ai.fireEvent('deactivate', ai);
			}
			var layout = item.doLayout && (this.layoutOnCardChange || !item.rendered);
			this.activeItem = item;
			if(item){
				item.show();
			}
			this.layout();
			if(item && layout){
				item.doLayout();
			}
			item.fireEvent('activate', item);
		}
	},


	renderAll : function(ct, target){
		if(this.deferredRender){
			this.renderItem(this.activeItem, undefined, target);
		}else{
			Ext.layout.CardLayout.superclass.renderAll.call(this, ct, target);
		}
	}
});
Ext.Container.LAYOUTS['card'] = Ext.layout.CardLayout;
Ext.layout.AnchorLayout = Ext.extend(Ext.layout.ContainerLayout, {



	monitorResize:true,



	getAnchorViewSize : function(ct, target){
		return target.dom == document.body ?
			target.getViewSize(true) : target.getStyleSize();
	},


	onLayout : function(ct, target){
		Ext.layout.AnchorLayout.superclass.onLayout.call(this, ct, target);

		var size = target.getViewSize(true);

		var w = size.width, h = size.height;

		if(w < 20 && h < 20){
			return;
		}


		var aw, ah;
		if(ct.anchorSize){
			if(typeof ct.anchorSize == 'number'){
				aw = ct.anchorSize;
			}else{
				aw = ct.anchorSize.width;
				ah = ct.anchorSize.height;
			}
		}else{
			aw = ct.initialConfig.width;
			ah = ct.initialConfig.height;
		}

		var cs = ct.items.items, len = cs.length, i, c, a, cw, ch, el, vs;
		for(i = 0; i < len; i++){
			c = cs[i];
			el = c.getPositionEl();
			if(c.anchor){
				a = c.anchorSpec;
				if(!a){
					vs = c.anchor.split(' ');
					c.anchorSpec = a = {
						right: this.parseAnchor(vs[0], c.initialConfig.width, aw),
						bottom: this.parseAnchor(vs[1], c.initialConfig.height, ah)
					};
				}
				cw = a.right ? this.adjustWidthAnchor(a.right(w) - el.getMargins('lr'), c) : undefined;
				ch = a.bottom ? this.adjustHeightAnchor(a.bottom(h) - el.getMargins('tb'), c) : undefined;

				if(cw || ch){
					c.setSize(cw || undefined, ch || undefined);
				}
			}
		}
	},


	parseAnchor : function(a, start, cstart){
		if(a && a != 'none'){
			var last;
			if(/^(r|right|b|bottom)$/i.test(a)){
				var diff = cstart - start;
				return function(v){
					if(v !== last){
						last = v;
						return v - diff;
					}
				}
			}else if(a.indexOf('%') != -1){
				var ratio = parseFloat(a.replace('%', ''))*.01;
				return function(v){
					if(v !== last){
						last = v;
						return Math.floor(v*ratio);
					}
				}
			}else{
				a = parseInt(a, 10);
				if(!isNaN(a)){
					return function(v){
						if(v !== last){
							last = v;
							return v + a;
						}
					}
				}
			}
		}
		return false;
	},


	adjustWidthAnchor : function(value, comp){
		return value;
	},


	adjustHeightAnchor : function(value, comp){
		return value;
	}


});
Ext.Container.LAYOUTS['anchor'] = Ext.layout.AnchorLayout;

Ext.layout.ColumnLayout = Ext.extend(Ext.layout.ContainerLayout, {

	monitorResize:true,

	extraCls: 'x-column',

	scrollOffset : 0,



	targetCls: 'x-column-layout-ct',

	isValidParent : function(c, target){
		return c.getPositionEl().dom.parentNode == this.innerCt.dom;
	},


	onLayout : function(ct, target){
		var cs = ct.items.items, len = cs.length, c, i;

		if(!this.innerCt){


			this.innerCt = target.createChild({cls:'x-column-inner'});
			this.innerCt.createChild({cls:'x-clear'});
		}
		this.renderAll(ct, this.innerCt);

		var size = target.getViewSize(true);

		if(size.width < 1 && size.height < 1){
			return;
		}

		var w = size.width - this.scrollOffset,
			h = size.height,
			pw = w;

		this.innerCt.setWidth(w);




		for(i = 0; i < len; i++){
			c = cs[i];
			if(!c.columnWidth){
				pw -= (c.getSize().width + c.getPositionEl().getMargins('lr'));
			}
		}

		pw = pw < 0 ? 0 : pw;

		for(i = 0; i < len; i++){
			c = cs[i];
			if(c.columnWidth){
				c.setSize(Math.floor(c.columnWidth * pw) - c.getPositionEl().getMargins('lr'));
			}
		}
	}


});

Ext.Container.LAYOUTS['column'] = Ext.layout.ColumnLayout;
Ext.layout.BorderLayout = Ext.extend(Ext.layout.ContainerLayout, {

	monitorResize:true,

	rendered : false,

	targetCls: 'x-border-layout-ct',


	onLayout : function(ct, target){
		var collapsed;
		if(!this.rendered){
			var items = ct.items.items;
			collapsed = [];
			for(var i = 0, len = items.length; i < len; i++) {
				var c = items[i];
				var pos = c.region;
				if(c.collapsed){
					collapsed.push(c);
				}
				c.collapsed = false;
				if(!c.rendered){
					c.render(target, i);
					c.getPositionEl().addClass('x-border-panel');
				}
				this[pos] = pos != 'center' && c.split ?
					new Ext.layout.BorderLayout.SplitRegion(this, c.initialConfig, pos) :
					new Ext.layout.BorderLayout.Region(this, c.initialConfig, pos);
				this[pos].render(target, c);
			}
			this.rendered = true;
		}

		var size = target.getViewSize(false);
		if(size.width < 20 || size.height < 20){
			if(collapsed){
				this.restoreCollapsed = collapsed;
			}
			return;
		}else if(this.restoreCollapsed){
			collapsed = this.restoreCollapsed;
			delete this.restoreCollapsed;
		}

		var w = size.width, h = size.height;
		var centerW = w, centerH = h, centerY = 0, centerX = 0;

		var n = this.north, s = this.south, west = this.west, e = this.east, c = this.center;
		if(!c && Ext.layout.BorderLayout.WARN !== false){
			throw 'No center region defined in BorderLayout ' + ct.id;
		}

		if(n && n.isVisible()){
			var b = n.getSize();
			var m = n.getMargins();
			b.width = w - (m.left+m.right);
			b.x = m.left;
			b.y = m.top;
			centerY = b.height + b.y + m.bottom;
			centerH -= centerY;
			n.applyLayout(b);
		}
		if(s && s.isVisible()){
			var b = s.getSize();
			var m = s.getMargins();
			b.width = w - (m.left+m.right);
			b.x = m.left;
			var totalHeight = (b.height + m.top + m.bottom);
			b.y = h - totalHeight + m.top;
			centerH -= totalHeight;
			s.applyLayout(b);
		}
		if(west && west.isVisible()){
			var b = west.getSize();
			var m = west.getMargins();
			b.height = centerH - (m.top+m.bottom);
			b.x = m.left;
			b.y = centerY + m.top;
			var totalWidth = (b.width + m.left + m.right);
			centerX += totalWidth;
			centerW -= totalWidth;
			west.applyLayout(b);
		}
		if(e && e.isVisible()){
			var b = e.getSize();
			var m = e.getMargins();
			b.height = centerH - (m.top+m.bottom);
			var totalWidth = (b.width + m.left + m.right);
			b.x = w - totalWidth + m.left;
			b.y = centerY + m.top;
			centerW -= totalWidth;
			e.applyLayout(b);
		}
		if(c){
			var m = c.getMargins();
			var centerBox = {
				x: centerX + m.left,
				y: centerY + m.top,
				width: centerW - (m.left+m.right),
				height: centerH - (m.top+m.bottom)
			};
			c.applyLayout(centerBox);
		}
		if(collapsed){
			for(var i = 0, len = collapsed.length; i < len; i++){
				collapsed[i].collapse(false);
			}
		}
		if(Ext.isIE && Ext.isStrict){
			target.repaint();
		}
	},

	destroy: function() {
		var r = ['north', 'south', 'east', 'west'];
		for (var i = 0; i < r.length; i++) {
			var region = this[r[i]];
			if(region){
				if(region.destroy){
					region.destroy();
				}else if (region.split){
					region.split.destroy(true);
				}
			}
		}
		Ext.layout.BorderLayout.superclass.destroy.call(this);
	}


});


Ext.layout.BorderLayout.Region = function(layout, config, pos){
	Ext.apply(this, config);
	this.layout = layout;
	this.position = pos;
	this.state = {};
	if(typeof this.margins == 'string'){
		this.margins = this.layout.parseMargins(this.margins);
	}
	this.margins = Ext.applyIf(this.margins || {}, this.defaultMargins);
	if(this.collapsible){
		if(typeof this.cmargins == 'string'){
			this.cmargins = this.layout.parseMargins(this.cmargins);
		}
		if(this.collapseMode == 'mini' && !this.cmargins){
			this.cmargins = {left:0,top:0,right:0,bottom:0};
		}else{
			this.cmargins = Ext.applyIf(this.cmargins || {},
				pos == 'north' || pos == 'south' ? this.defaultNSCMargins : this.defaultEWCMargins);
		}
	}
};

Ext.layout.BorderLayout.Region.prototype = {






	collapsible : false,

	split:false,

	floatable: true,

	minWidth:50,

	minHeight:50,


	defaultMargins : {left:0,top:0,right:0,bottom:0},

	defaultNSCMargins : {left:5,top:5,right:5,bottom:5},

	defaultEWCMargins : {left:5,top:0,right:5,bottom:0},
	floatingZIndex: 100,


	isCollapsed : false,






	render : function(ct, p){
		this.panel = p;
		p.el.enableDisplayMode();
		this.targetEl = ct;
		this.el = p.el;

		var gs = p.getState, ps = this.position;
		p.getState = function(){
			return Ext.apply(gs.call(p) || {}, this.state);
		}.createDelegate(this);

		if(ps != 'center'){
			p.allowQueuedExpand = false;
			p.on({
				beforecollapse: this.beforeCollapse,
				collapse: this.onCollapse,
				beforeexpand: this.beforeExpand,
				expand: this.onExpand,
				hide: this.onHide,
				show: this.onShow,
				scope: this
			});
			if(this.collapsible || this.floatable){
				p.collapseEl = 'el';
				p.slideAnchor = this.getSlideAnchor();
			}
			if(p.tools && p.tools.toggle){
				p.tools.toggle.addClass('x-tool-collapse-'+ps);
				p.tools.toggle.addClassOnOver('x-tool-collapse-'+ps+'-over');
			}
		}
	},


	getCollapsedEl : function(){
		if(!this.collapsedEl){
			if(!this.toolTemplate){
				var tt = new Ext.Template(
					'<div class="x-tool x-tool-{id}">&#160;</div>'
				);
				tt.disableFormats = true;
				tt.compile();
				Ext.layout.BorderLayout.Region.prototype.toolTemplate = tt;
			}
			this.collapsedEl = this.targetEl.createChild({
				cls: "x-layout-collapsed x-layout-collapsed-"+this.position,
				id: this.panel.id + '-xcollapsed'
			});
			this.collapsedEl.enableDisplayMode('block');

			if(this.collapseMode == 'mini'){
				this.collapsedEl.addClass('x-layout-cmini-'+this.position);
				this.miniCollapsedEl = this.collapsedEl.createChild({
					cls: "x-layout-mini x-layout-mini-"+this.position, html: "&#160;"
				});
				this.miniCollapsedEl.addClassOnOver('x-layout-mini-over');
				this.collapsedEl.addClassOnOver("x-layout-collapsed-over");
				this.collapsedEl.on('click', this.onExpandClick, this, {stopEvent:true});
			}else {
				if(this.collapsible !== false && !this.hideCollapseTool) {
					var t = this.toolTemplate.append(
						this.collapsedEl.dom,
						{id:'expand-'+this.position}, true);
					t.addClassOnOver('x-tool-expand-'+this.position+'-over');
					t.on('click', this.onExpandClick, this, {stopEvent:true});
				}
				if(this.floatable !== false || this.titleCollapse){
					this.collapsedEl.addClassOnOver("x-layout-collapsed-over");
					this.collapsedEl.on("click", this[this.floatable ? 'collapseClick' : 'onExpandClick'], this);
				}
			}
		}
		return this.collapsedEl;
	},


	onExpandClick : function(e){
		if(this.isSlid){
			this.panel.expand(false);
		}else{
			this.panel.expand();
		}
	},


	onCollapseClick : function(e){
		this.panel.collapse();
	},


	beforeCollapse : function(p, animate){
		this.lastAnim = animate;
		if(this.splitEl){
			this.splitEl.hide();
		}
		this.getCollapsedEl().show();
		var el = this.panel.getEl();
		this.originalZIndex = el.getStyle('z-index');
		el.setStyle('z-index', 100);
		this.isCollapsed = true;
		this.layout.layout();
	},


	onCollapse : function(animate){
		this.panel.el.setStyle('z-index', 1);
		if(this.lastAnim === false || this.panel.animCollapse === false){
			this.getCollapsedEl().dom.style.visibility = 'visible';
		}else{
			this.getCollapsedEl().slideIn(this.panel.slideAnchor, {duration:.2});
		}
		this.state.collapsed = true;
		this.panel.saveState();
	},


	beforeExpand : function(animate){
		if(this.isSlid){
			this.afterSlideIn();
		}
		var c = this.getCollapsedEl();
		this.el.show();
		if(this.position == 'east' || this.position == 'west'){
			this.panel.setSize(undefined, c.getHeight());
		}else{
			this.panel.setSize(c.getWidth(), undefined);
		}
		c.hide();
		c.dom.style.visibility = 'hidden';
		this.panel.el.setStyle('z-index', this.floatingZIndex);
	},


	onExpand : function(){
		this.isCollapsed = false;
		if(this.splitEl){
			this.splitEl.show();
		}
		this.layout.layout();
		this.panel.el.setStyle('z-index', this.originalZIndex);
		this.state.collapsed = false;
		this.panel.saveState();
	},


	collapseClick : function(e){
		if(this.isSlid){
			e.stopPropagation();
			this.slideIn();
		}else{
			e.stopPropagation();
			this.slideOut();
		}
	},


	onHide : function(){
		if(this.isCollapsed){
			this.getCollapsedEl().hide();
		}else if(this.splitEl){
			this.splitEl.hide();
		}
	},


	onShow : function(){
		if(this.isCollapsed){
			this.getCollapsedEl().show();
		}else if(this.splitEl){
			this.splitEl.show();
		}
	},


	isVisible : function(){
		return !this.panel.hidden;
	},


	getMargins : function(){
		return this.isCollapsed && this.cmargins ? this.cmargins : this.margins;
	},


	getSize : function(){
		return this.isCollapsed ? this.getCollapsedEl().getSize() : this.panel.getSize();
	},


	setPanel : function(panel){
		this.panel = panel;
	},


	getMinWidth: function(){
		return this.minWidth;
	},


	getMinHeight: function(){
		return this.minHeight;
	},


	applyLayoutCollapsed : function(box){
		var ce = this.getCollapsedEl();
		ce.setLeftTop(box.x, box.y);
		ce.setSize(box.width, box.height);
	},


	applyLayout : function(box){
		if(this.isCollapsed){
			this.applyLayoutCollapsed(box);
		}else{
			this.panel.setPosition(box.x, box.y);
			this.panel.setSize(box.width, box.height);
		}
	},


	beforeSlide: function(){
		this.panel.beforeEffect();
	},


	afterSlide : function(){
		this.panel.afterEffect();
	},


	initAutoHide : function(){
		if(this.autoHide !== false){
			if(!this.autoHideHd){
				var st = new Ext.util.DelayedTask(this.slideIn, this);
				this.autoHideHd = {
					"mouseout": function(e){
						if(!e.within(this.el, true)){
							st.delay(500);
						}
					},
					"mouseover" : function(e){
						st.cancel();
					},
					scope : this
				};
			}
			this.el.on(this.autoHideHd);
			this.collapsedEl.on(this.autoHideHd);
		}
	},


	clearAutoHide : function(){
		if(this.autoHide !== false){
			this.el.un("mouseout", this.autoHideHd.mouseout);
			this.el.un("mouseover", this.autoHideHd.mouseover);
			this.collapsedEl.un("mouseout", this.autoHideHd.mouseout);
			this.collapsedEl.un("mouseover", this.autoHideHd.mouseover);
		}
	},


	clearMonitor : function(){
		Ext.getDoc().un("click", this.slideInIf, this);
	},


	slideOut : function(){
		if(this.isSlid || this.el.hasActiveFx()){
			return;
		}
		this.isSlid = true;
		var ts = this.panel.tools;
		if(ts && ts.toggle){
			ts.toggle.hide();
		}
		this.el.show();
		if(this.position == 'east' || this.position == 'west'){
			this.panel.setSize(undefined, this.collapsedEl.getHeight());
		}else{
			this.panel.setSize(this.collapsedEl.getWidth(), undefined);
		}
		this.restoreLT = [this.el.dom.style.left, this.el.dom.style.top];
		this.el.alignTo(this.collapsedEl, this.getCollapseAnchor());
		this.el.setStyle("z-index", this.floatingZIndex+2);
		this.panel.el.replaceClass('x-panel-collapsed', 'x-panel-floating');
		if(this.animFloat !== false){
			this.beforeSlide();
			this.el.slideIn(this.getSlideAnchor(), {
				callback: function(){
					this.afterSlide();
					this.initAutoHide();
					Ext.getDoc().on("click", this.slideInIf, this);
				},
				scope: this,
				block: true
			});
		}else{
			this.initAutoHide();
			Ext.getDoc().on("click", this.slideInIf, this);
		}
	},


	afterSlideIn : function(){
		this.clearAutoHide();
		this.isSlid = false;
		this.clearMonitor();
		this.el.setStyle("z-index", "");
		this.panel.el.replaceClass('x-panel-floating', 'x-panel-collapsed');
		this.el.dom.style.left = this.restoreLT[0];
		this.el.dom.style.top = this.restoreLT[1];

		var ts = this.panel.tools;
		if(ts && ts.toggle){
			ts.toggle.show();
		}
	},


	slideIn : function(cb){
		if(!this.isSlid || this.el.hasActiveFx()){
			Ext.callback(cb);
			return;
		}
		this.isSlid = false;
		if(this.animFloat !== false){
			this.beforeSlide();
			this.el.slideOut(this.getSlideAnchor(), {
				callback: function(){
					this.el.hide();
					this.afterSlide();
					this.afterSlideIn();
					Ext.callback(cb);
				},
				scope: this,
				block: true
			});
		}else{
			this.el.hide();
			this.afterSlideIn();
		}
	},


	slideInIf : function(e){
		if(!e.within(this.el)){
			this.slideIn();
		}
	},


	anchors : {
		"west" : "left",
		"east" : "right",
		"north" : "top",
		"south" : "bottom"
	},


	sanchors : {
		"west" : "l",
		"east" : "r",
		"north" : "t",
		"south" : "b"
	},


	canchors : {
		"west" : "tl-tr",
		"east" : "tr-tl",
		"north" : "tl-bl",
		"south" : "bl-tl"
	},


	getAnchor : function(){
		return this.anchors[this.position];
	},


	getCollapseAnchor : function(){
		return this.canchors[this.position];
	},


	getSlideAnchor : function(){
		return this.sanchors[this.position];
	},


	getAlignAdj : function(){
		var cm = this.cmargins;
		switch(this.position){
			case "west":
				return [0, 0];
				break;
			case "east":
				return [0, 0];
				break;
			case "north":
				return [0, 0];
				break;
			case "south":
				return [0, 0];
				break;
		}
	},


	getExpandAdj : function(){
		var c = this.collapsedEl, cm = this.cmargins;
		switch(this.position){
			case "west":
				return [-(cm.right+c.getWidth()+cm.left), 0];
				break;
			case "east":
				return [cm.right+c.getWidth()+cm.left, 0];
				break;
			case "north":
				return [0, -(cm.top+cm.bottom+c.getHeight())];
				break;
			case "south":
				return [0, cm.top+cm.bottom+c.getHeight()];
				break;
		}
	},

	destroy : function(){
		Ext.destroy(this.miniCollapsedEl, this.collapsedEl);
	}
};


Ext.layout.BorderLayout.SplitRegion = function(layout, config, pos){
	Ext.layout.BorderLayout.SplitRegion.superclass.constructor.call(this, layout, config, pos);

	this.applyLayout = this.applyFns[pos];
};

Ext.extend(Ext.layout.BorderLayout.SplitRegion, Ext.layout.BorderLayout.Region, {


	splitTip : "Drag to resize.",

	collapsibleSplitTip : "Drag to resize. Double click to hide.",

	useSplitTips : false,


	splitSettings : {
		north : {
			orientation: Ext.SplitBar.VERTICAL,
			placement: Ext.SplitBar.TOP,
			maxFn : 'getVMaxSize',
			minProp: 'minHeight',
			maxProp: 'maxHeight'
		},
		south : {
			orientation: Ext.SplitBar.VERTICAL,
			placement: Ext.SplitBar.BOTTOM,
			maxFn : 'getVMaxSize',
			minProp: 'minHeight',
			maxProp: 'maxHeight'
		},
		east : {
			orientation: Ext.SplitBar.HORIZONTAL,
			placement: Ext.SplitBar.RIGHT,
			maxFn : 'getHMaxSize',
			minProp: 'minWidth',
			maxProp: 'maxWidth'
		},
		west : {
			orientation: Ext.SplitBar.HORIZONTAL,
			placement: Ext.SplitBar.LEFT,
			maxFn : 'getHMaxSize',
			minProp: 'minWidth',
			maxProp: 'maxWidth'
		}
	},


	applyFns : {
		west : function(box){
			if(this.isCollapsed){
				return this.applyLayoutCollapsed(box);
			}
			var sd = this.splitEl.dom, s = sd.style;
			this.panel.setPosition(box.x, box.y);
			var sw = sd.offsetWidth;
			s.left = (box.x+box.width-sw)+'px';
			s.top = (box.y)+'px';
			s.height = Math.max(0, box.height)+'px';
			this.panel.setSize(box.width-sw, box.height);
		},
		east : function(box){
			if(this.isCollapsed){
				return this.applyLayoutCollapsed(box);
			}
			var sd = this.splitEl.dom, s = sd.style;
			var sw = sd.offsetWidth;
			this.panel.setPosition(box.x+sw, box.y);
			s.left = (box.x)+'px';
			s.top = (box.y)+'px';
			s.height = Math.max(0, box.height)+'px';
			this.panel.setSize(box.width-sw, box.height);
		},
		north : function(box){
			if(this.isCollapsed){
				return this.applyLayoutCollapsed(box);
			}
			var sd = this.splitEl.dom, s = sd.style;
			var sh = sd.offsetHeight;
			this.panel.setPosition(box.x, box.y);
			s.left = (box.x)+'px';
			s.top = (box.y+box.height-sh)+'px';
			s.width = Math.max(0, box.width)+'px';
			this.panel.setSize(box.width, box.height-sh);
		},
		south : function(box){
			if(this.isCollapsed){
				return this.applyLayoutCollapsed(box);
			}
			var sd = this.splitEl.dom, s = sd.style;
			var sh = sd.offsetHeight;
			this.panel.setPosition(box.x, box.y+sh);
			s.left = (box.x)+'px';
			s.top = (box.y)+'px';
			s.width = Math.max(0, box.width)+'px';
			this.panel.setSize(box.width, box.height-sh);
		}
	},


	render : function(ct, p){
		Ext.layout.BorderLayout.SplitRegion.superclass.render.call(this, ct, p);

		var ps = this.position;

		this.splitEl = ct.createChild({
			cls: "x-layout-split x-layout-split-"+ps, html: "&#160;",
			id: this.panel.id + '-xsplit'
		});

		if(this.collapseMode == 'mini'){
			this.miniSplitEl = this.splitEl.createChild({
				cls: "x-layout-mini x-layout-mini-"+ps, html: "&#160;"
			});
			this.miniSplitEl.addClassOnOver('x-layout-mini-over');
			this.miniSplitEl.on('click', this.onCollapseClick, this, {stopEvent:true});
		}

		var s = this.splitSettings[ps];

		this.split = new Ext.SplitBar(this.splitEl.dom, p.el, s.orientation);
		this.split.tickSize = this.tickSize;
		this.split.placement = s.placement;
		this.split.getMaximumSize = this[s.maxFn].createDelegate(this);
		this.split.minSize = this.minSize || this[s.minProp];
		this.split.on("beforeapply", this.onSplitMove, this);
		this.split.useShim = this.useShim === true;
		this.maxSize = this.maxSize || this[s.maxProp];

		if(p.hidden){
			this.splitEl.hide();
		}

		if(this.useSplitTips){
			this.splitEl.dom.title = this.collapsible ? this.collapsibleSplitTip : this.splitTip;
		}
		if(this.collapsible){
			this.splitEl.on("dblclick", this.onCollapseClick,  this);
		}
	},


	getSize : function(){
		if(this.isCollapsed){
			return this.collapsedEl.getSize();
		}
		var s = this.panel.getSize();
		if(this.position == 'north' || this.position == 'south'){
			s.height += this.splitEl.dom.offsetHeight;
		}else{
			s.width += this.splitEl.dom.offsetWidth;
		}
		return s;
	},


	getHMaxSize : function(){
		var cmax = this.maxSize || 10000;
		var center = this.layout.center;
		return Math.min(cmax, (this.el.getWidth()+center.el.getWidth())-center.getMinWidth());
	},


	getVMaxSize : function(){
		var cmax = this.maxSize || 10000;
		var center = this.layout.center;
		return Math.min(cmax, (this.el.getHeight()+center.el.getHeight())-center.getMinHeight());
	},


	onSplitMove : function(split, newSize){
		var s = this.panel.getSize();
		this.lastSplitSize = newSize;
		if(this.position == 'north' || this.position == 'south'){
			this.panel.setSize(s.width, newSize);
			this.state.height = newSize;
		}else{
			this.panel.setSize(newSize, s.height);
			this.state.width = newSize;
		}
		this.layout.layout();
		this.panel.saveState();
		return false;
	},


	getSplitBar : function(){
		return this.split;
	},


	destroy : function() {
		Ext.destroy(this.miniSplitEl, this.split, this.splitEl);
		Ext.layout.BorderLayout.SplitRegion.superclass.destroy.call(this);
	}
});

Ext.Container.LAYOUTS['border'] = Ext.layout.BorderLayout;
Ext.layout.FormLayout = Ext.extend(Ext.layout.AnchorLayout, {


	labelSeparator : ':',




	trackLabels: false,


	onRemove: function(c){
		Ext.layout.FormLayout.superclass.onRemove.call(this, c);
		if(this.trackLabels){
			c.un('show', this.onFieldShow, this);
			c.un('hide', this.onFieldHide, this);
		}

		var el = c.getPositionEl(),
			ct = c.getItemCt && c.getItemCt();
		if(c.rendered && ct){
			if (el && el.dom) {
				el.insertAfter(ct);
			}
			Ext.destroy(ct);
			Ext.destroyMembers(c, 'label', 'itemCt');
			if(c.customItemCt){
				Ext.destroyMembers(c, 'getItemCt', 'customItemCt');
			}
		}
	},


	setContainer : function(ct){
		Ext.layout.FormLayout.superclass.setContainer.call(this, ct);
		if(ct.labelAlign){
			ct.addClass('x-form-label-'+ct.labelAlign);
		}

		if(ct.hideLabels){
			Ext.apply(this, {
				labelStyle: 'display:none',
				elementStyle: 'padding-left:0;',
				labelAdjust: 0
			});
		}else{
			this.labelSeparator = ct.labelSeparator || this.labelSeparator;
			ct.labelWidth = ct.labelWidth || 100;
			if(Ext.isNumber(ct.labelWidth)){
				var pad = Ext.isNumber(ct.labelPad) ? ct.labelPad : 5;
				Ext.apply(this, {
					labelAdjust: ct.labelWidth + pad,
					labelStyle: 'width:' + ct.labelWidth + 'px;',
					elementStyle: 'padding-left:' + (ct.labelWidth + pad) + 'px'
				});
			}
			if(ct.labelAlign == 'top'){
				Ext.apply(this, {
					labelStyle: 'width:auto;',
					labelAdjust: 0,
					elementStyle: 'padding-left:0;'
				});
			}
		}
	},


	isHide: function(c){
		return c.hideLabel || this.container.hideLabels;
	},

	onFieldShow: function(c){
		c.getItemCt().removeClass('x-hide-' + c.hideMode);
	},

	onFieldHide: function(c){
		c.getItemCt().addClass('x-hide-' + c.hideMode);
	},


	getLabelStyle: function(s){
		var ls = '', items = [this.labelStyle, s];
		for (var i = 0, len = items.length; i < len; ++i){
			if (items[i]){
				ls += items[i];
				if (ls.substr(-1, 1) != ';'){
					ls += ';'
				}
			}
		}
		return ls;
	},




	renderItem : function(c, position, target){
		if(c && (c.isFormField || c.fieldLabel) && c.inputType != 'hidden'){
			var args = this.getTemplateArgs(c);
			if(Ext.isNumber(position)){
				position = target.dom.childNodes[position] || null;
			}
			if(position){
				c.itemCt = this.fieldTpl.insertBefore(position, args, true);
			}else{
				c.itemCt = this.fieldTpl.append(target, args, true);
			}
			if(!c.getItemCt){


				Ext.apply(c, {
					getItemCt: function(){
						return c.itemCt;
					},
					customItemCt: true
				});
			}
			c.label = c.getItemCt().child('label.x-form-item-label');
			if(!c.rendered){
				c.render('x-form-el-' + c.id);
			}else if(!this.isValidParent(c, target)){
				Ext.fly('x-form-el-' + c.id).appendChild(c.getPositionEl());
			}
			if(this.trackLabels){
				if(c.hidden){
					this.onFieldHide(c);
				}
				c.on({
					scope: this,
					show: this.onFieldShow,
					hide: this.onFieldHide
				});
			}
			this.configureItem(c);
		}else {
			Ext.layout.FormLayout.superclass.renderItem.apply(this, arguments);
		}
	},


	getTemplateArgs: function(field) {
		var noLabelSep = !field.fieldLabel || field.hideLabel;
		return {
			id: field.id,
			label: field.fieldLabel,
			labelStyle: this.getLabelStyle(field.labelStyle),
			elementStyle: this.elementStyle||'',
			labelSeparator: noLabelSep ? '' : (Ext.isDefined(field.labelSeparator) ? field.labelSeparator : this.labelSeparator),
			itemCls: (field.itemCls||this.container.itemCls||'') + (field.hideLabel ? ' x-hide-label' : ''),
			clearCls: field.clearCls || 'x-form-clear-left'
		};
	},


	adjustWidthAnchor: function(value, c){
		if(c.label && !this.isHide(c) && (this.container.labelAlign != 'top')){
			var adjust = Ext.isIE6 || (Ext.isIE && !Ext.isStrict);
			return value - this.labelAdjust + (adjust ? -3 : 0);
		}
		return value;
	},

	adjustHeightAnchor : function(value, c){
		if(c.label && !this.isHide(c) && (this.container.labelAlign == 'top')){
			return value - c.label.getHeight();
		}
		return value;
	},


	isValidParent : function(c, target){
		return target && this.container.getEl().contains(c.getPositionEl());
	}


});

Ext.Container.LAYOUTS['form'] = Ext.layout.FormLayout;

Ext.layout.AccordionLayout = Ext.extend(Ext.layout.FitLayout, {

	fill : true,

	autoWidth : true,

	titleCollapse : true,

	hideCollapseTool : false,

	collapseFirst : false,

	animate : false,

	sequence : false,

	activeOnTop : false,

	renderItem : function(c){
		if(this.animate === false){
			c.animCollapse = false;
		}
		c.collapsible = true;
		if(this.autoWidth){
			c.autoWidth = true;
		}
		if(this.titleCollapse){
			c.titleCollapse = true;
		}
		if(this.hideCollapseTool){
			c.hideCollapseTool = true;
		}
		if(this.collapseFirst !== undefined){
			c.collapseFirst = this.collapseFirst;
		}
		if(!this.activeItem && !c.collapsed){
			this.setActiveItem(c, true);
		}else if(this.activeItem && this.activeItem != c){
			c.collapsed = true;
		}
		Ext.layout.AccordionLayout.superclass.renderItem.apply(this, arguments);
		c.header.addClass('x-accordion-hd');
		c.on('beforeexpand', this.beforeExpand, this);
	},

	onRemove: function(c){
		Ext.layout.AccordionLayout.superclass.onRemove.call(this, c);
		if(c.rendered){
			c.header.removeClass('x-accordion-hd');
		}
		c.un('beforeexpand', this.beforeExpand, this);
	},


	beforeExpand : function(p, anim){
		var ai = this.activeItem;
		if(ai){
			if(this.sequence){
				delete this.activeItem;
				if (!ai.collapsed){
					ai.collapse({callback:function(){
						p.expand(anim || true);
					}, scope: this});
					return false;
				}
			}else{
				ai.collapse(this.animate);
			}
		}
		this.setActive(p);
		if(this.activeOnTop){
			p.el.dom.parentNode.insertBefore(p.el.dom, p.el.dom.parentNode.firstChild);
		}
		this.layout();
	},


	setItemSize : function(item, size){
		if(this.fill && item){
			var hh = 0;
			this.container.items.each(function(p){
				if(p != item){
					hh += p.header.getHeight();
				}
			});
			size.height -= hh;
			item.setSize(size);
		}
	},


	setActiveItem : function(item){
		this.setActive(item, true);
	},


	setActive : function(item, expand){
		var ai = this.activeItem;
		item = this.container.getComponent(item);
		if(ai != item){
			if(item.rendered && item.collapsed && expand){
				item.expand();
			}else{
				if(ai){
					ai.fireEvent('deactivate', ai);
				}
				this.activeItem = item;
				item.fireEvent('activate', item);
			}
		}
	}
});
Ext.Container.LAYOUTS.accordion = Ext.layout.AccordionLayout;


Ext.layout.Accordion = Ext.layout.AccordionLayout;
Ext.layout.TableLayout = Ext.extend(Ext.layout.ContainerLayout, {



	monitorResize:false,

	targetCls: 'x-table-layout-ct',


	tableAttrs:null,


	setContainer : function(ct){
		Ext.layout.TableLayout.superclass.setContainer.call(this, ct);

		this.currentRow = 0;
		this.currentColumn = 0;
		this.cells = [];
	},


	onLayout : function(ct, target){
		var cs = ct.items.items, len = cs.length, c, i;

		if(!this.table){
			this.table = target.createChild(
				Ext.apply({tag:'table', cls:'x-table-layout', cellspacing: 0, cn: {tag: 'tbody'}}, this.tableAttrs), null, true);
		}
		this.renderAll(ct, target);
	},


	getRow : function(index){
		var row = this.table.tBodies[0].childNodes[index];
		if(!row){
			row = document.createElement('tr');
			this.table.tBodies[0].appendChild(row);
		}
		return row;
	},


	getNextCell : function(c){
		var cell = this.getNextNonSpan(this.currentColumn, this.currentRow);
		var curCol = this.currentColumn = cell[0], curRow = this.currentRow = cell[1];
		for(var rowIndex = curRow; rowIndex < curRow + (c.rowspan || 1); rowIndex++){
			if(!this.cells[rowIndex]){
				this.cells[rowIndex] = [];
			}
			for(var colIndex = curCol; colIndex < curCol + (c.colspan || 1); colIndex++){
				this.cells[rowIndex][colIndex] = true;
			}
		}
		var td = document.createElement('td');
		if(c.cellId){
			td.id = c.cellId;
		}
		var cls = 'x-table-layout-cell';
		if(c.cellCls){
			cls += ' ' + c.cellCls;
		}
		td.className = cls;
		if(c.colspan){
			td.colSpan = c.colspan;
		}
		if(c.rowspan){
			td.rowSpan = c.rowspan;
		}
		this.getRow(curRow).appendChild(td);
		return td;
	},


	getNextNonSpan: function(colIndex, rowIndex){
		var cols = this.columns;
		while((cols && colIndex >= cols) || (this.cells[rowIndex] && this.cells[rowIndex][colIndex])) {
			if(cols && colIndex >= cols){
				rowIndex++;
				colIndex = 0;
			}else{
				colIndex++;
			}
		}
		return [colIndex, rowIndex];
	},


	renderItem : function(c, position, target){
		if(c && !c.rendered){
			c.render(this.getNextCell(c));
			this.configureItem(c, position);
		}else if(c && !this.isValidParent(c, target)){
			var container = this.getNextCell(c);
			container.insertBefore(c.getPositionEl().dom, null);
			c.container = Ext.get(container);
			this.configureItem(c, position);
		}
	},


	isValidParent : function(c, target){
		return c.getPositionEl().up('table', 5).dom.parentNode === (target.dom || target);
	}


});

Ext.Container.LAYOUTS['table'] = Ext.layout.TableLayout;
Ext.layout.AbsoluteLayout = Ext.extend(Ext.layout.AnchorLayout, {

	extraCls: 'x-abs-layout-item',

	onLayout : function(ct, target){
		target.position();
		this.paddingLeft = target.getPadding('l');
		this.paddingTop = target.getPadding('t');

		Ext.layout.AbsoluteLayout.superclass.onLayout.call(this, ct, target);
	},


	adjustWidthAnchor : function(value, comp){
		return value ? value - comp.getPosition(true)[0] + this.paddingLeft : value;
	},


	adjustHeightAnchor : function(value, comp){
		return  value ? value - comp.getPosition(true)[1] + this.paddingTop : value;
	}

});
Ext.Container.LAYOUTS['absolute'] = Ext.layout.AbsoluteLayout;

Ext.layout.BoxLayout = Ext.extend(Ext.layout.ContainerLayout, {

	defaultMargins : {left:0,top:0,right:0,bottom:0},

	padding : '0',

	pack : 'start',


	monitorResize : true,
	scrollOffset : 0,
	extraCls : 'x-box-item',
	targetCls : 'x-box-layout-ct',
	innerCls : 'x-box-inner',

	constructor : function(config){
		Ext.layout.BoxLayout.superclass.constructor.call(this, config);
		if(Ext.isString(this.defaultMargins)){
			this.defaultMargins = this.parseMargins(this.defaultMargins);
		}
	},


	isValidParent : function(c, target){
		return c.getPositionEl().dom.parentNode == this.innerCt.dom;
	},


	onLayout : function(ct, target){
		var cs = ct.items.items, len = cs.length, c, i, last = len-1, cm;

		if(!this.innerCt){


			this.innerCt = target.createChild({cls:this.innerCls});
			this.padding = this.parseMargins(this.padding);
		}
		this.renderAll(ct, this.innerCt);
	},


	renderItem : function(c){
		if(Ext.isString(c.margins)){
			c.margins = this.parseMargins(c.margins);
		}else if(!c.margins){
			c.margins = this.defaultMargins;
		}
		Ext.layout.BoxLayout.superclass.renderItem.apply(this, arguments);
	},


	getTargetSize : function(target){
		return (Ext.isIE6 && Ext.isStrict && target.dom == document.body) ? target.getStyleSize() : target.getViewSize(true);
	},

	getItems: function(ct){
		var items = [];
		ct.items.each(function(c){
			if(c.isVisible()){
				items.push(c);
			}
		});
		return items;
	}
});


Ext.layout.VBoxLayout = Ext.extend(Ext.layout.BoxLayout, {

	align : 'left',




	onLayout : function(ct, target){
		Ext.layout.VBoxLayout.superclass.onLayout.call(this, ct, target);

		var cs = this.getItems(ct), cm, ch, margin, cl, diff, aw,
			size = target.getViewSize(true),
			w = size.width,
			h = size.height - this.scrollOffset,
			l = this.padding.left, t = this.padding.top,
			isStart = this.pack == 'start',
			stretchWidth = w - (this.padding.left + this.padding.right),
			extraHeight = 0,
			maxWidth = 0,
			totalFlex = 0,
			flexHeight = 0,
			usedHeight = 0,
			idx = 0,
			heights = [],
			restore = [],
			c,
			csLen = cs.length;


		for (i = 0 ; i < csLen; i++) {
			c = cs[i];
			cm = c.margins;
			margin = cm.top + cm.bottom;
			maxWidth = Math.max(maxWidth, c.getWidth() + cm.left + cm.right);
		}

		var innerCtWidth = maxWidth + this.padding.left + this.padding.right;
		switch(this.align){
			case 'stretch':
				this.innerCt.setSize(w, h);
				break;
			case 'stretchmax':
			case 'left':
				this.innerCt.setSize(innerCtWidth, h);
				break;
			case 'center':
				this.innerCt.setSize(w = Math.max(w, innerCtWidth), h);
				break;
		}

		var availableWidth = Math.max(0, w - this.padding.left - this.padding.right);

		for (i = 0 ; i < csLen; i++) {
			c = cs[i];
			cm = c.margins;
			if(this.align == 'stretch'){
				c.setWidth((stretchWidth - (cm.left + cm.right)).constrain(
					c.minWidth || 0, c.maxWidth || 1000000));
			}else if(this.align == 'stretchmax'){
				c.setWidth((maxWidth - (cm.left + cm.right)).constrain(
					c.minWidth || 0, c.maxWidth || 1000000));
			}else if(isStart && c.flex){
				c.setWidth();
			}

		}


		for (i = 0 ; i < csLen; i++) {
			c = cs[i];
			cm = c.margins;
			totalFlex += c.flex || 0;
			ch = c.getHeight();
			margin = cm.top + cm.bottom;
			extraHeight += ch + margin;
			flexHeight += margin + (c.flex ? 0 : ch);
		}
		extraHeight = h - extraHeight - this.padding.top - this.padding.bottom;

		var availHeight = Math.max(0, h - this.padding.top - this.padding.bottom - flexHeight),
			leftOver = availHeight;
		for (i = 0 ; i < csLen; i++) {
			c = cs[i];
			if(isStart && c.flex){
				ch = Math.floor(availHeight * (c.flex / totalFlex));
				leftOver -= ch;
				heights.push(ch);
			}
		}
		if(this.pack == 'center'){
			t += extraHeight ? extraHeight / 2 : 0;
		}else if(this.pack == 'end'){
			t += extraHeight;
		}
		idx = 0;

		for (i = 0 ; i < csLen; i++) {
			c = cs[i];
			cm = c.margins;
			t += cm.top;
			aw = availableWidth;
			cl = l + cm.left


			if(this.align == 'center'){
				if((diff = availableWidth - (c.getWidth() + cm.left + cm.right)) > 0){
					cl += (diff/2);
					aw -= diff;
				}
			}

			c.setPosition(cl, t);
			if(isStart && c.flex){
				ch = Math.max(0, heights[idx++] + (leftOver-- > 0 ? 1 : 0));
				c.setSize(aw, ch);
			}else{
				ch = c.getHeight();
			}
			t += ch + cm.bottom;
		}
	}
});

Ext.Container.LAYOUTS.vbox = Ext.layout.VBoxLayout;


Ext.layout.HBoxLayout = Ext.extend(Ext.layout.BoxLayout, {

	align : 'top',




	onLayout : function(ct, target){
		Ext.layout.HBoxLayout.superclass.onLayout.call(this, ct, target);

		var cs = this.getItems(ct), cm, cw, margin, ch, diff,
			size = target.getViewSize(true),
			w = size.width - this.scrollOffset,
			h = size.height,
			l = this.padding.left, t = this.padding.top,
			isStart = this.pack == 'start',
			isRestore = ['stretch', 'stretchmax'].indexOf(this.align) == -1,
			stretchHeight = h - (this.padding.top + this.padding.bottom),
			extraWidth = 0,
			maxHeight = 0,
			totalFlex = 0,
			flexWidth = 0,
			usedWidth = 0;

		Ext.each(cs, function(c){
			cm = c.margins;
			totalFlex += c.flex || 0;
			cw = c.getWidth();
			margin = cm.left + cm.right;
			extraWidth += cw + margin;
			flexWidth += margin + (c.flex ? 0 : cw);
			maxHeight = Math.max(maxHeight, c.getHeight() + cm.top + cm.bottom);
		});
		extraWidth = w - extraWidth - this.padding.left - this.padding.right;

		var innerCtHeight = maxHeight + this.padding.top + this.padding.bottom;
		switch(this.align){
			case 'stretch':
				this.innerCt.setSize(w, h);
				break;
			case 'stretchmax':
			case 'top':
				this.innerCt.setSize(w, innerCtHeight);
				break;
			case 'middle':
				this.innerCt.setSize(w, h = Math.max(h, innerCtHeight));
				break;
		}


		var availWidth = Math.max(0, w - this.padding.left - this.padding.right - flexWidth),
			leftOver = availWidth,
			widths = [],
			restore = [],
			idx = 0,
			availableHeight = Math.max(0, h - this.padding.top - this.padding.bottom);


		Ext.each(cs, function(c){
			if(isStart && c.flex){
				cw = Math.floor(availWidth * (c.flex / totalFlex));
				leftOver -= cw;
				widths.push(cw);
			}
		});

		if(this.pack == 'center'){
			l += extraWidth ? extraWidth / 2 : 0;
		}else if(this.pack == 'end'){
			l += extraWidth;
		}
		Ext.each(cs, function(c){
			cm = c.margins;
			l += cm.left;
			c.setPosition(l, t + cm.top);
			if(isStart && c.flex){
				cw = Math.max(0, widths[idx++] + (leftOver-- > 0 ? 1 : 0));
				if(isRestore){
					restore.push(c.getHeight());
				}
				c.setSize(cw, availableHeight);
			}else{
				cw = c.getWidth();
			}
			l += cw + cm.right;
		});

		idx = 0;
		Ext.each(cs, function(c){
			cm = c.margins;
			ch = c.getHeight();
			if(isStart && c.flex){
				ch = restore[idx++];
			}
			if(this.align == 'stretch'){
				c.setHeight((stretchHeight - (cm.top + cm.bottom)).constrain(
					c.minHeight || 0, c.maxHeight || 1000000));
			}else if(this.align == 'stretchmax'){
				c.setHeight((maxHeight - (cm.top + cm.bottom)).constrain(
					c.minHeight || 0, c.maxHeight || 1000000));
			}else{
				if(this.align == 'middle'){
					diff = availableHeight - (ch + cm.top + cm.bottom);
					ch = t + cm.top + (diff/2);
					if(diff > 0){
						c.setPosition(c.x, ch);
					}
				}
				if(isStart && c.flex){
					c.setHeight(ch);
				}
			}
		}, this);
	}
});

Ext.Container.LAYOUTS.hbox = Ext.layout.HBoxLayout;

Ext.Viewport = Ext.extend(Ext.Container, {













	initComponent : function() {
		Ext.Viewport.superclass.initComponent.call(this);
		document.getElementsByTagName('html')[0].className += ' x-viewport';
		this.el = Ext.getBody();
		this.el.setHeight = Ext.emptyFn;
		this.el.setWidth = Ext.emptyFn;
		this.el.setSize = Ext.emptyFn;
		this.el.dom.scroll = 'no';
		this.allowDomMove = false;
		this.autoWidth = true;
		this.autoHeight = true;
		Ext.EventManager.onWindowResize(this.fireResize, this);
		this.renderTo = this.el;
	},

	fireResize : function(w, h){
		this.onResize(w, h, w, h);
	}
});
Ext.reg('viewport', Ext.Viewport);

Ext.Panel = Ext.extend(Ext.Container, {












































	baseCls : 'x-panel',

	collapsedCls : 'x-panel-collapsed',

	maskDisabled : true,

	animCollapse : Ext.enableFx,

	headerAsText : true,

	buttonAlign : 'right',

	collapsed : false,

	collapseFirst : true,

	minButtonWidth : 75,


	elements : 'body',

	preventBodyReset : false,


	padding: undefined,


	resizeEvent: 'bodyresize',




	toolTarget : 'header',
	collapseEl : 'bwrap',
	slideAnchor : 't',
	disabledClass : '',


	deferHeight : true,

	expandDefaults: {
		duration : 0.25
	},

	collapseDefaults : {
		duration : 0.25
	},


	initComponent : function(){
		Ext.Panel.superclass.initComponent.call(this);

		this.addEvents(

			'bodyresize',

			'titlechange',

			'iconchange',

			'collapse',

			'expand',

			'beforecollapse',

			'beforeexpand',

			'beforeclose',

			'close',

			'activate',

			'deactivate'
		);

		if(this.unstyled){
			this.baseCls = 'x-plain';
		}


		this.toolbars = [];

		if(this.tbar){
			this.elements += ',tbar';
			this.topToolbar = this.createToolbar(this.tbar);
			delete this.tbar;

		}
		if(this.bbar){
			this.elements += ',bbar';
			this.bottomToolbar = this.createToolbar(this.bbar);
			delete this.bbar;
		}

		if(this.header === true){
			this.elements += ',header';
			delete this.header;
		}else if(this.headerCfg || (this.title && this.header !== false)){
			this.elements += ',header';
		}

		if(this.footerCfg || this.footer === true){
			this.elements += ',footer';
			delete this.footer;
		}

		if(this.buttons){
			this.fbar = this.buttons;
			delete this.buttons;
		}
		if(this.fbar){
			this.createFbar(this.fbar);
		}
		if(this.autoLoad){
			this.on('render', this.doAutoLoad, this, {delay:10});
		}
	},


	createFbar : function(fbar){
		var min = this.minButtonWidth;
		this.elements += ',footer';
		this.fbar = this.createToolbar(fbar, {
			buttonAlign: this.buttonAlign,
			toolbarCls: 'x-panel-fbar',
			enableOverflow: false,
			defaults: function(c){
				return {
					minWidth: c.minWidth || min
				};
			}
		});
		//@compat addButton and buttons could possibly be removed

		//@target 4.0


		this.fbar.items.each(function(c){
			c.minWidth = c.minWidth || this.minButtonWidth;
		}, this);
		this.buttons = this.fbar.items.items;
	},


	createToolbar: function(tb, options){
		var result;

		if(Ext.isArray(tb)){
			tb = {
				items: tb
			};
		}
		result = tb.events ? Ext.apply(tb, options) : this.createComponent(Ext.apply({}, tb, options), 'toolbar');
		result.ownerCt = this;
		result.bufferResize = false;
		this.toolbars.push(result);
		return result;
	},


	createElement : function(name, pnode){
		if(this[name]){
			pnode.appendChild(this[name].dom);
			return;
		}

		if(name === 'bwrap' || this.elements.indexOf(name) != -1){
			if(this[name+'Cfg']){
				this[name] = Ext.fly(pnode).createChild(this[name+'Cfg']);
			}else{
				var el = document.createElement('div');
				el.className = this[name+'Cls'];
				this[name] = Ext.get(pnode.appendChild(el));
			}
			if(this[name+'CssClass']){
				this[name].addClass(this[name+'CssClass']);
			}
			if(this[name+'Style']){
				this[name].applyStyles(this[name+'Style']);
			}
		}
	},


	onRender : function(ct, position){
		Ext.Panel.superclass.onRender.call(this, ct, position);
		this.createClasses();

		var el = this.el,
			d = el.dom,
			bw,
			ts;


		if(this.collapsible && !this.hideCollapseTool){
			this.tools = this.tools ? this.tools.slice(0) : [];
			this.tools[this.collapseFirst?'unshift':'push']({
				id: 'toggle',
				handler : this.toggleCollapse,
				scope: this
			});
		}

		if(this.tools){
			ts = this.tools;
			this.elements += (this.header !== false) ? ',header' : '';
		}
		this.tools = {};

		el.addClass(this.baseCls);
		if(d.firstChild){
			this.header = el.down('.'+this.headerCls);
			this.bwrap = el.down('.'+this.bwrapCls);
			var cp = this.bwrap ? this.bwrap : el;
			this.tbar = cp.down('.'+this.tbarCls);
			this.body = cp.down('.'+this.bodyCls);
			this.bbar = cp.down('.'+this.bbarCls);
			this.footer = cp.down('.'+this.footerCls);
			this.fromMarkup = true;
		}
		if (this.preventBodyReset === true) {
			el.addClass('x-panel-reset');
		}
		if(this.cls){
			el.addClass(this.cls);
		}

		if(this.buttons){
			this.elements += ',footer';
		}




		if(this.frame){
			el.insertHtml('afterBegin', String.format(Ext.Element.boxMarkup, this.baseCls));

			this.createElement('header', d.firstChild.firstChild.firstChild);
			this.createElement('bwrap', d);


			bw = this.bwrap.dom;
			var ml = d.childNodes[1], bl = d.childNodes[2];
			bw.appendChild(ml);
			bw.appendChild(bl);

			var mc = bw.firstChild.firstChild.firstChild;
			this.createElement('tbar', mc);
			this.createElement('body', mc);
			this.createElement('bbar', mc);
			this.createElement('footer', bw.lastChild.firstChild.firstChild);

			if(!this.footer){
				this.bwrap.dom.lastChild.className += ' x-panel-nofooter';
			}

			this.ft = Ext.get(this.bwrap.dom.lastChild);
			this.mc = Ext.get(mc);
		}else{
			this.createElement('header', d);
			this.createElement('bwrap', d);


			bw = this.bwrap.dom;
			this.createElement('tbar', bw);
			this.createElement('body', bw);
			this.createElement('bbar', bw);
			this.createElement('footer', bw);

			if(!this.header){
				this.body.addClass(this.bodyCls + '-noheader');
				if(this.tbar){
					this.tbar.addClass(this.tbarCls + '-noheader');
				}
			}
		}

		if(Ext.isDefined(this.padding)){
			this.body.setStyle('padding', this.body.addUnits(this.padding));
		}

		if(this.border === false){
			this.el.addClass(this.baseCls + '-noborder');
			this.body.addClass(this.bodyCls + '-noborder');
			if(this.header){
				this.header.addClass(this.headerCls + '-noborder');
			}
			if(this.footer){
				this.footer.addClass(this.footerCls + '-noborder');
			}
			if(this.tbar){
				this.tbar.addClass(this.tbarCls + '-noborder');
			}
			if(this.bbar){
				this.bbar.addClass(this.bbarCls + '-noborder');
			}
		}

		if(this.bodyBorder === false){
			this.body.addClass(this.bodyCls + '-noborder');
		}

		this.bwrap.enableDisplayMode('block');

		if(this.header){
			this.header.unselectable();


			if(this.headerAsText){
				this.header.dom.innerHTML =
					'<span class="' + this.headerTextCls + '">'+this.header.dom.innerHTML+'</span>';

				if(this.iconCls){
					this.setIconClass(this.iconCls);
				}
			}
		}

		if(this.floating){
			this.makeFloating(this.floating);
		}

		if(this.collapsible && this.titleCollapse && this.header){
			this.mon(this.header, 'click', this.toggleCollapse, this);
			this.header.setStyle('cursor', 'pointer');
		}
		if(ts){
			this.addTool.apply(this, ts);
		}
		if(this.fbar){
			this.footer.addClass('x-panel-btns');
			this.fbar.render(this.footer);
			this.footer.createChild({cls:'x-clear'});
		}

		if(this.tbar && this.topToolbar){
			this.topToolbar.render(this.tbar);
		}
		if(this.bbar && this.bottomToolbar){
			this.bottomToolbar.render(this.bbar);

		}
	},


	setIconClass : function(cls){
		var old = this.iconCls;
		this.iconCls = cls;
		if(this.rendered && this.header){
			if(this.frame){
				this.header.addClass('x-panel-icon');
				this.header.replaceClass(old, this.iconCls);
			}else{
				var hd = this.header,
					img = hd.child('img.x-panel-inline-icon');
				if(img){
					Ext.fly(img).replaceClass(old, this.iconCls);
				}else{
					Ext.DomHelper.insertBefore(hd.dom.firstChild, {
						tag:'img', src: Ext.BLANK_IMAGE_URL, cls:'x-panel-inline-icon '+this.iconCls
					});
				}
			}
		}
		this.fireEvent('iconchange', this, cls, old);
	},


	makeFloating : function(cfg){
		this.floating = true;
		this.el = new Ext.Layer(Ext.apply({}, cfg, {
			shadow: Ext.isDefined(this.shadow) ? this.shadow : 'sides',
			shadowOffset: this.shadowOffset,
			constrain:false,
			shim: this.shim === false ? false : undefined
		}), this.el);
	},


	getTopToolbar : function(){
		return this.topToolbar;
	},


	getBottomToolbar : function(){
		return this.bottomToolbar;
	},


	addButton : function(config, handler, scope){
		if(!this.fbar){
			this.createFbar([]);
		}
		if(handler){
			if(Ext.isString(config)){
				config = {text: config};
			}
			config = Ext.apply({
				handler: handler,
				scope: scope
			}, config)
		}
		return this.fbar.add(config);
	},


	addTool : function(){
		if(!this.rendered){
			if(!this.tools){
				this.tools = [];
			}
			Ext.each(arguments, function(arg){
				this.tools.push(arg)
			}, this);
			return;
		}

		if(!this[this.toolTarget]){
			return;
		}
		if(!this.toolTemplate){

			var tt = new Ext.Template(
				'<div class="x-tool x-tool-{id}">&#160;</div>'
			);
			tt.disableFormats = true;
			tt.compile();
			Ext.Panel.prototype.toolTemplate = tt;
		}
		for(var i = 0, a = arguments, len = a.length; i < len; i++) {
			var tc = a[i];
			if(!this.tools[tc.id]){
				var overCls = 'x-tool-'+tc.id+'-over';
				var t = this.toolTemplate.insertFirst((tc.align !== 'left') ? this[this.toolTarget] : this[this.toolTarget].child('span'), tc, true);
				this.tools[tc.id] = t;
				t.enableDisplayMode('block');
				this.mon(t, 'click',  this.createToolHandler(t, tc, overCls, this));
				if(tc.on){
					this.mon(t, tc.on);
				}
				if(tc.hidden){
					t.hide();
				}
				if(tc.qtip){
					if(Ext.isObject(tc.qtip)){
						Ext.QuickTips.register(Ext.apply({
							target: t.id
						}, tc.qtip));
					} else {
						t.dom.qtip = tc.qtip;
					}
				}
				t.addClassOnOver(overCls);
			}
		}
	},

	onLayout : function(shallow, force){
		if(this.hasLayout && this.toolbars.length > 0){
			Ext.each(this.toolbars, function(tb){
				tb.doLayout(undefined, force);
			});
			this.syncHeight();
		}
	},

	syncHeight : function(){
		var h = this.toolbarHeight,
			bd = this.body,
			lsh = this.lastSize.height,
			sz;

		if(this.autoHeight || !Ext.isDefined(lsh) || lsh == 'auto'){
			return;
		}


		if(h != this.getToolbarHeight()){
			h = Math.max(0, this.adjustBodyHeight(lsh - this.getFrameHeight()));
			bd.setHeight(h);
			sz = bd.getSize();
			this.toolbarHeight = this.getToolbarHeight();
			this.onBodyResize(sz.width, sz.height);
		}
	},


	onShow : function(){
		if(this.floating){
			return this.el.show();
		}
		Ext.Panel.superclass.onShow.call(this);
	},


	onHide : function(){
		if(this.floating){
			return this.el.hide();
		}
		Ext.Panel.superclass.onHide.call(this);
	},


	createToolHandler : function(t, tc, overCls, panel){
		return function(e){
			t.removeClass(overCls);
			if(tc.stopEvent !== false){
				e.stopEvent();
			}
			if(tc.handler){
				tc.handler.call(tc.scope || t, e, t, panel, tc);
			}
		};
	},


	afterRender : function(){
		if(this.floating && !this.hidden){
			this.el.show();
		}
		if(this.title){
			this.setTitle(this.title);
		}
		if(this.collapsed){
			this.collapsed = false;
			this.collapse(false);
		}
		Ext.Panel.superclass.afterRender.call(this);
		this.initEvents();
	},


	getKeyMap : function(){
		if(!this.keyMap){
			this.keyMap = new Ext.KeyMap(this.el, this.keys);
		}
		return this.keyMap;
	},


	initEvents : function(){
		if(this.keys){
			this.getKeyMap();
		}
		if(this.draggable){
			this.initDraggable();
		}
		if(this.toolbars.length > 0){
			Ext.each(this.toolbars, function(tb){
				tb.doLayout();
				tb.on({
					scope: this,
					afterlayout: this.syncHeight,
					remove: this.syncHeight
				});
			}, this);
			if(!this.ownerCt){
				this.syncHeight();
			}
		}

	},


	initDraggable : function(){

		this.dd = new Ext.Panel.DD(this, Ext.isBoolean(this.draggable) ? null : this.draggable);
	},


	beforeEffect : function(anim){
		if(this.floating){
			this.el.beforeAction();
		}
		if(anim !== false){
			this.el.addClass('x-panel-animated');
		}
	},


	afterEffect : function(anim){
		this.syncShadow();
		if(anim !== false){
			this.el.removeClass('x-panel-animated');
		}
	},


	createEffect : function(a, cb, scope){
		var o = {
			scope:scope,
			block:true
		};
		if(a === true){
			o.callback = cb;
			return o;
		}else if(!a.callback){
			o.callback = cb;
		}else {
			o.callback = function(){
				cb.call(scope);
				Ext.callback(a.callback, a.scope);
			};
		}
		return Ext.applyIf(o, a);
	},


	collapse : function(animate){
		if(this.collapsed || this.el.hasFxBlock() || this.fireEvent('beforecollapse', this, animate) === false){
			return;
		}
		var doAnim = animate === true || (animate !== false && this.animCollapse);
		this.beforeEffect(doAnim);
		this.onCollapse(doAnim, animate);
		return this;
	},


	onCollapse : function(doAnim, animArg){
		if(doAnim){
			this[this.collapseEl].slideOut(this.slideAnchor,
				Ext.apply(this.createEffect(animArg||true, this.afterCollapse, this),
					this.collapseDefaults));
		}else{
			this[this.collapseEl].hide();
			this.afterCollapse(false);
		}
	},


	afterCollapse : function(anim){
		this.collapsed = true;
		this.el.addClass(this.collapsedCls);
		this.afterEffect(anim);
		this.fireEvent('collapse', this);
	},


	expand : function(animate){
		if(!this.collapsed || this.el.hasFxBlock() || this.fireEvent('beforeexpand', this, animate) === false){
			return;
		}
		var doAnim = animate === true || (animate !== false && this.animCollapse);
		this.el.removeClass(this.collapsedCls);
		this.beforeEffect(doAnim);
		this.onExpand(doAnim, animate);
		return this;
	},


	onExpand : function(doAnim, animArg){
		if(doAnim){
			this[this.collapseEl].slideIn(this.slideAnchor,
				Ext.apply(this.createEffect(animArg||true, this.afterExpand, this),
					this.expandDefaults));
		}else{
			this[this.collapseEl].show();
			this.afterExpand(false);
		}
	},


	afterExpand : function(anim){
		this.collapsed = false;
		this.afterEffect(anim);
		if(Ext.isDefined(this.deferLayout)){
			this.doLayout(true);
		}
		this.fireEvent('expand', this);
	},


	toggleCollapse : function(animate){
		this[this.collapsed ? 'expand' : 'collapse'](animate);
		return this;
	},


	onDisable : function(){
		if(this.rendered && this.maskDisabled){
			this.el.mask();
		}
		Ext.Panel.superclass.onDisable.call(this);
	},


	onEnable : function(){
		if(this.rendered && this.maskDisabled){
			this.el.unmask();
		}
		Ext.Panel.superclass.onEnable.call(this);
	},


	onResize : function(w, h){
		if(Ext.isDefined(w) || Ext.isDefined(h)){
			if(!this.collapsed){




				if(Ext.isNumber(w)){
					this.body.setWidth(w = this.adjustBodyWidth(w - this.getFrameWidth()));
				} else if (w == 'auto') {
					w = this.body.setWidth('auto').dom.offsetWidth;
				} else {
					w = this.body.dom.offsetWidth;
				}

				if(this.tbar){
					this.tbar.setWidth(w);
					if(this.topToolbar){
						this.topToolbar.setSize(w);
					}
				}
				if(this.bbar){
					this.bbar.setWidth(w);
					if(this.bottomToolbar){
						this.bottomToolbar.setSize(w);

						if (Ext.isIE) {
							this.bbar.setStyle('position', 'static');
							this.bbar.setStyle('position', '');
						}
					}
				}
				if(this.footer){
					this.footer.setWidth(w);
					if(this.fbar){
						this.fbar.setSize(Ext.isIE ? (w - this.footer.getFrameWidth('lr')) : 'auto');
					}
				}


				if(Ext.isNumber(h)){
					h = Math.max(0, this.adjustBodyHeight(h - this.getFrameHeight()));
					this.body.setHeight(h);
				}else if(h == 'auto'){
					this.body.setHeight(h);
				}

				if(this.disabled && this.el._mask){
					this.el._mask.setSize(this.el.dom.clientWidth, this.el.getHeight());
				}
			}else{
				this.queuedBodySize = {width: w, height: h};
				if(!this.queuedExpand && this.allowQueuedExpand !== false){
					this.queuedExpand = true;
					this.on('expand', function(){
						delete this.queuedExpand;
						this.onResize(this.queuedBodySize.width, this.queuedBodySize.height);
					}, this, {single:true});
				}
			}
			this.onBodyResize(w, h);
		}
		this.syncShadow();
		Ext.Panel.superclass.onResize.call(this);
	},


	onBodyResize: function(w, h){
		this.fireEvent('bodyresize', this, w, h);
	},


	getToolbarHeight: function(){
		var h = 0;
		if(this.rendered){
			Ext.each(this.toolbars, function(tb){
				h += tb.getHeight();
			}, this);
		}
		return h;
	},


	adjustBodyHeight : function(h){
		return h;
	},


	adjustBodyWidth : function(w){
		return w;
	},


	onPosition : function(){
		this.syncShadow();
	},


	getFrameWidth : function(){
		var w = this.el.getFrameWidth('lr') + this.bwrap.getFrameWidth('lr');

		if(this.frame){
			var l = this.bwrap.dom.firstChild;
			w += (Ext.fly(l).getFrameWidth('l') + Ext.fly(l.firstChild).getFrameWidth('r'));
			w += this.mc.getFrameWidth('lr');
		}
		return w;
	},


	getFrameHeight : function(){
		var h  = this.el.getFrameWidth('tb') + this.bwrap.getFrameWidth('tb');
		h += (this.tbar ? this.tbar.getHeight() : 0) +
			(this.bbar ? this.bbar.getHeight() : 0);

		if(this.frame){
			h += this.el.dom.firstChild.offsetHeight + this.ft.dom.offsetHeight + this.mc.getFrameWidth('tb');
		}else{
			h += (this.header ? this.header.getHeight() : 0) +
				(this.footer ? this.footer.getHeight() : 0);
		}
		return h;
	},


	getInnerWidth : function(){
		return this.getSize().width - this.getFrameWidth();
	},


	getInnerHeight : function(){
		return this.getSize().height - this.getFrameHeight();
	},


	syncShadow : function(){
		if(this.floating){
			this.el.sync(true);
		}
	},


	getLayoutTarget : function(){
		return this.body;
	},


	getContentTarget : function(){
		return this.body;
	},


	setTitle : function(title, iconCls){
		this.title = title;
		if(this.header && this.headerAsText){
			this.header.child('span').update(title);
		}
		if(iconCls){
			this.setIconClass(iconCls);
		}
		this.fireEvent('titlechange', this, title);
		return this;
	},


	getUpdater : function(){
		return this.body.getUpdater();
	},


	load : function(){
		var um = this.body.getUpdater();
		um.update.apply(um, arguments);
		return this;
	},


	beforeDestroy : function(){
		Ext.Panel.superclass.beforeDestroy.call(this);
		if(this.header){
			this.header.removeAllListeners();
		}
		if(this.tools){
			for(var k in this.tools){
				Ext.destroy(this.tools[k]);
			}
		}
		if(Ext.isArray(this.buttons)){
			while(this.buttons.length) {
				Ext.destroy(this.buttons[0]);
			}
		}
		if(this.rendered){
			Ext.destroy(
				this.ft,
				this.header,
				this.footer,
				this.toolbars,
				this.tbar,
				this.bbar,
				this.body,
				this.mc,
				this.bwrap
			);
			if (this.fbar) {
				Ext.destroy(
					this.fbar,
					this.fbar.el
				);
			}
		}else{
			Ext.destroy(
				this.topToolbar,
				this.bottomToolbar
			);
		}
	},


	createClasses : function(){
		this.headerCls = this.baseCls + '-header';
		this.headerTextCls = this.baseCls + '-header-text';
		this.bwrapCls = this.baseCls + '-bwrap';
		this.tbarCls = this.baseCls + '-tbar';
		this.bodyCls = this.baseCls + '-body';
		this.bbarCls = this.baseCls + '-bbar';
		this.footerCls = this.baseCls + '-footer';
	},


	createGhost : function(cls, useShim, appendTo){
		var el = document.createElement('div');
		el.className = 'x-panel-ghost ' + (cls ? cls : '');
		if(this.header){
			el.appendChild(this.el.dom.firstChild.cloneNode(true));
		}
		Ext.fly(el.appendChild(document.createElement('ul'))).setHeight(this.bwrap.getHeight());
		el.style.width = this.el.dom.offsetWidth + 'px';;
		if(!appendTo){
			this.container.dom.appendChild(el);
		}else{
			Ext.getDom(appendTo).appendChild(el);
		}
		if(useShim !== false && this.el.useShim !== false){
			var layer = new Ext.Layer({shadow:false, useDisplay:true, constrain:false}, el);
			layer.show();
			return layer;
		}else{
			return new Ext.Element(el);
		}
	},


	doAutoLoad : function(){
		var u = this.body.getUpdater();
		if(this.renderer){
			u.setRenderer(this.renderer);
		}
		u.update(Ext.isObject(this.autoLoad) ? this.autoLoad : {url: this.autoLoad});
	},


	getTool : function(id) {
		return this.tools[id];
	}


});
Ext.reg('panel', Ext.Panel);

Ext.Editor = function(field, config){
	if(field.field){
		this.field = Ext.create(field.field, 'textfield');
		config = Ext.apply({}, field);
		delete config.field;
	}else{
		this.field = field;
	}
	Ext.Editor.superclass.constructor.call(this, config);
};

Ext.extend(Ext.Editor, Ext.Component, {







	value : "",

	alignment: "c-c?",

	offsets: [0, 0],

	shadow : "frame",

	constrain : false,

	swallowKeys : true,

	completeOnEnter : true,

	cancelOnEsc : true,

	updateEl : false,

	initComponent : function(){
		Ext.Editor.superclass.initComponent.call(this);
		this.addEvents(

			"beforestartedit",

			"startedit",

			"beforecomplete",

			"complete",

			"canceledit",

			"specialkey"
		);
	},


	onRender : function(ct, position){
		this.el = new Ext.Layer({
			shadow: this.shadow,
			cls: "x-editor",
			parentEl : ct,
			shim : this.shim,
			shadowOffset: this.shadowOffset || 4,
			id: this.id,
			constrain: this.constrain
		});
		if(this.zIndex){
			this.el.setZIndex(this.zIndex);
		}
		this.el.setStyle("overflow", Ext.isGecko ? "auto" : "hidden");
		if(this.field.msgTarget != 'title'){
			this.field.msgTarget = 'qtip';
		}
		this.field.inEditor = true;
		this.mon(this.field, {
			scope: this,
			blur: this.onBlur,
			specialkey: this.onSpecialKey
		});
		if(this.field.grow){
			this.mon(this.field, "autosize", this.el.sync,  this.el, {delay:1});
		}
		this.field.render(this.el).show();
		this.field.getEl().dom.name = '';
		if(this.swallowKeys){
			this.field.el.swallowEvent([
				'keypress',
				'keydown'
			]);
		}
	},


	onSpecialKey : function(field, e){
		var key = e.getKey(),
			complete = this.completeOnEnter && key == e.ENTER,
			cancel = this.cancelOnEsc && key == e.ESC;
		if(complete || cancel){
			e.stopEvent();
			if(complete){
				this.completeEdit();
			}else{
				this.cancelEdit();
			}
			if(field.triggerBlur){
				field.triggerBlur();
			}
		}
		this.fireEvent('specialkey', field, e);
	},


	startEdit : function(el, value){
		if(this.editing){
			this.completeEdit();
		}
		this.boundEl = Ext.get(el);
		var v = value !== undefined ? value : this.boundEl.dom.innerHTML;
		if(!this.rendered){
			this.render(this.parentEl || document.body);
		}
		if(this.fireEvent("beforestartedit", this, this.boundEl, v) !== false){
			this.startValue = v;
			this.field.reset();
			this.field.setValue(v);
			this.realign(true);
			this.editing = true;
			this.show();
		}
	},


	doAutoSize : function(){
		if(this.autoSize){
			var sz = this.boundEl.getSize(),
				fs = this.field.getSize();

			switch(this.autoSize){
				case "width":
					this.setSize(sz.width, fs.height);
					break;
				case "height":
					this.setSize(fs.width, sz.height);
					break;
				case "none":
					this.setSize(fs.width, fs.height);
					break;
				default:
					this.setSize(sz.width, sz.height);
			}
		}
	},


	setSize : function(w, h){
		delete this.field.lastSize;
		this.field.setSize(w, h);
		if(this.el){
			if(Ext.isGecko2 || Ext.isOpera){

				this.el.setSize(w, h);
			}
			this.el.sync();
		}
	},


	realign : function(autoSize){
		if(autoSize === true){
			this.doAutoSize();
		}
		this.el.alignTo(this.boundEl, this.alignment, this.offsets);
	},


	completeEdit : function(remainVisible){
		if(!this.editing){
			return;
		}
		var v = this.getValue();
		if(!this.field.isValid()){
			if(this.revertInvalid !== false){
				this.cancelEdit(remainVisible);
			}
			return;
		}
		if(String(v) === String(this.startValue) && this.ignoreNoChange){
			this.hideEdit(remainVisible);
			return;
		}
		if(this.fireEvent("beforecomplete", this, v, this.startValue) !== false){
			v = this.getValue();
			if(this.updateEl && this.boundEl){
				this.boundEl.update(v);
			}
			this.hideEdit(remainVisible);
			this.fireEvent("complete", this, v, this.startValue);
		}
	},


	onShow : function(){
		this.el.show();
		if(this.hideEl !== false){
			this.boundEl.hide();
		}
		this.field.show().focus(false, true);
		this.fireEvent("startedit", this.boundEl, this.startValue);
	},


	cancelEdit : function(remainVisible){
		if(this.editing){
			var v = this.getValue();
			this.setValue(this.startValue);
			this.hideEdit(remainVisible);
			this.fireEvent("canceledit", this, v, this.startValue);
		}
	},


	hideEdit: function(remainVisible){
		if(remainVisible !== true){
			this.editing = false;
			this.hide();
		}
	},


	onBlur : function(){
		if(this.allowBlur !== true && this.editing){
			this.completeEdit();
		}
	},


	onHide : function(){
		if(this.editing){
			this.completeEdit();
			return;
		}
		this.field.blur();
		if(this.field.collapse){
			this.field.collapse();
		}
		this.el.hide();
		if(this.hideEl !== false){
			this.boundEl.show();
		}
	},


	setValue : function(v){
		this.field.setValue(v);
	},


	getValue : function(){
		return this.field.getValue();
	},

	beforeDestroy : function(){
		Ext.destroyMembers(this, 'field');

		delete this.parentEl;
		delete this.boundEl;
	}
});
Ext.reg('editor', Ext.Editor);

Ext.ColorPalette = Ext.extend(Ext.Component, {


	itemCls : 'x-color-palette',

	value : null,

	clickEvent :'click',

	ctype : 'Ext.ColorPalette',


	allowReselect : false,


	colors : [
		'000000', '993300', '333300', '003300', '003366', '000080', '333399', '333333',
		'800000', 'FF6600', '808000', '008000', '008080', '0000FF', '666699', '808080',
		'FF0000', 'FF9900', '99CC00', '339966', '33CCCC', '3366FF', '800080', '969696',
		'FF00FF', 'FFCC00', 'FFFF00', '00FF00', '00FFFF', '00CCFF', '993366', 'C0C0C0',
		'FF99CC', 'FFCC99', 'FFFF99', 'CCFFCC', 'CCFFFF', '99CCFF', 'CC99FF', 'FFFFFF'
	],





	initComponent : function(){
		Ext.ColorPalette.superclass.initComponent.call(this);
		this.addEvents(

			'select'
		);

		if(this.handler){
			this.on('select', this.handler, this.scope, true);
		}
	},


	onRender : function(container, position){
		this.autoEl = {
			tag: 'div',
			cls: this.itemCls
		};
		Ext.ColorPalette.superclass.onRender.call(this, container, position);
		var t = this.tpl || new Ext.XTemplate(
			'<tpl for="."><a href="#" class="color-{.}" hidefocus="on"><em><span style="background:#{.}" unselectable="on">&#160;</span></em></a></tpl>'
		);
		t.overwrite(this.el, this.colors);
		this.mon(this.el, this.clickEvent, this.handleClick, this, {delegate: 'a'});
		if(this.clickEvent != 'click'){
			this.mon(this.el, 'click', Ext.emptyFn, this, {delegate: 'a', preventDefault: true});
		}
	},


	afterRender : function(){
		Ext.ColorPalette.superclass.afterRender.call(this);
		if(this.value){
			var s = this.value;
			this.value = null;
			this.select(s);
		}
	},


	handleClick : function(e, t){
		e.preventDefault();
		if(!this.disabled){
			var c = t.className.match(/(?:^|\s)color-(.{6})(?:\s|$)/)[1];
			this.select(c.toUpperCase());
		}
	},


	select : function(color){
		color = color.replace('#', '');
		if(color != this.value || this.allowReselect){
			var el = this.el;
			if(this.value){
				el.child('a.color-'+this.value).removeClass('x-color-palette-sel');
			}
			el.child('a.color-'+color).addClass('x-color-palette-sel');
			this.value = color;
			this.fireEvent('select', this, color);
		}
	}


});
Ext.reg('colorpalette', Ext.ColorPalette);

Ext.DatePicker = Ext.extend(Ext.BoxComponent, {

	todayText : 'Today',

	okText : '&#160;OK&#160;',

	cancelText : 'Cancel',



	todayTip : '{0} (Spacebar)',

	minText : 'This date is before the minimum date',

	maxText : 'This date is after the maximum date',

	format : 'm/d/y',

	disabledDaysText : 'Disabled',

	disabledDatesText : 'Disabled',

	monthNames : Date.monthNames,

	dayNames : Date.dayNames,

	nextText : 'Next Month (Control+Right)',

	prevText : 'Previous Month (Control+Left)',

	monthYearText : 'Choose a month (Control+Up/Down to move years)',

	startDay : 0,

	showToday : true,








	focusOnSelect: true,


	initComponent : function(){
		Ext.DatePicker.superclass.initComponent.call(this);

		this.value = this.value ?
			this.value.clearTime(true) : new Date().clearTime();

		this.addEvents(

			'select'
		);

		if(this.handler){
			this.on('select', this.handler,  this.scope || this);
		}

		this.initDisabledDays();
	},


	initDisabledDays : function(){
		if(!this.disabledDatesRE && this.disabledDates){
			var dd = this.disabledDates,
				len = dd.length - 1,
				re = '(?:';

			Ext.each(dd, function(d, i){
				re += Ext.isDate(d) ? '^' + Ext.escapeRe(d.dateFormat(this.format)) + '$' : dd[i];
				if(i != len){
					re += '|';
				}
			}, this);
			this.disabledDatesRE = new RegExp(re + ')');
		}
	},


	setDisabledDates : function(dd){
		if(Ext.isArray(dd)){
			this.disabledDates = dd;
			this.disabledDatesRE = null;
		}else{
			this.disabledDatesRE = dd;
		}
		this.initDisabledDays();
		this.update(this.value, true);
	},


	setDisabledDays : function(dd){
		this.disabledDays = dd;
		this.update(this.value, true);
	},


	setMinDate : function(dt){
		this.minDate = dt;
		this.update(this.value, true);
	},


	setMaxDate : function(dt){
		this.maxDate = dt;
		this.update(this.value, true);
	},


	setValue : function(value){
		this.value = value.clearTime(true);
		this.update(this.value);
	},


	getValue : function(){
		return this.value;
	},


	focus : function(){
		this.update(this.activeDate);
	},


	onEnable: function(initial){
		Ext.DatePicker.superclass.onEnable.call(this);
		this.doDisabled(false);
		this.update(initial ? this.value : this.activeDate);
		if(Ext.isIE){
			this.el.repaint();
		}

	},


	onDisable : function(){
		Ext.DatePicker.superclass.onDisable.call(this);
		this.doDisabled(true);
		if(Ext.isIE && !Ext.isIE8){

			Ext.each([].concat(this.textNodes, this.el.query('th span')), function(el){
				Ext.fly(el).repaint();
			});
		}
	},


	doDisabled : function(disabled){
		this.keyNav.setDisabled(disabled);
		this.prevRepeater.setDisabled(disabled);
		this.nextRepeater.setDisabled(disabled);
		if(this.showToday){
			this.todayKeyListener.setDisabled(disabled);
			this.todayBtn.setDisabled(disabled);
		}
	},


	onRender : function(container, position){
		var m = [
				'<table cellspacing="0">',
				'<tr><td class="x-date-left"><a href="#" title="', this.prevText ,'">&#160;</a></td><td class="x-date-middle" align="center"></td><td class="x-date-right"><a href="#" title="', this.nextText ,'">&#160;</a></td></tr>',
				'<tr><td colspan="3"><table class="x-date-inner" cellspacing="0"><thead><tr>'],
			dn = this.dayNames,
			i;
		for(i = 0; i < 7; i++){
			var d = this.startDay+i;
			if(d > 6){
				d = d-7;
			}
			m.push('<th><span>', dn[d].substr(0,1), '</span></th>');
		}
		m[m.length] = '</tr></thead><tbody><tr>';
		for(i = 0; i < 42; i++) {
			if(i % 7 === 0 && i !== 0){
				m[m.length] = '</tr><tr>';
			}
			m[m.length] = '<td><a href="#" hidefocus="on" class="x-date-date" tabIndex="1"><em><span></span></em></a></td>';
		}
		m.push('</tr></tbody></table></td></tr>',
			this.showToday ? '<tr><td colspan="3" class="x-date-bottom" align="center"></td></tr>' : '',
			'</table><div class="x-date-mp"></div>');

		var el = document.createElement('div');
		el.className = 'x-date-picker';
		el.innerHTML = m.join('');

		container.dom.insertBefore(el, position);

		this.el = Ext.get(el);
		this.eventEl = Ext.get(el.firstChild);

		this.prevRepeater = new Ext.util.ClickRepeater(this.el.child('td.x-date-left a'), {
			handler: this.showPrevMonth,
			scope: this,
			preventDefault:true,
			stopDefault:true
		});

		this.nextRepeater = new Ext.util.ClickRepeater(this.el.child('td.x-date-right a'), {
			handler: this.showNextMonth,
			scope: this,
			preventDefault:true,
			stopDefault:true
		});

		this.monthPicker = this.el.down('div.x-date-mp');
		this.monthPicker.enableDisplayMode('block');

		this.keyNav = new Ext.KeyNav(this.eventEl, {
			'left' : function(e){
				if(e.ctrlKey){
					this.showPrevMonth();
				}else{
					this.update(this.activeDate.add('d', -1));
				}
			},

			'right' : function(e){
				if(e.ctrlKey){
					this.showNextMonth();
				}else{
					this.update(this.activeDate.add('d', 1));
				}
			},

			'up' : function(e){
				if(e.ctrlKey){
					this.showNextYear();
				}else{
					this.update(this.activeDate.add('d', -7));
				}
			},

			'down' : function(e){
				if(e.ctrlKey){
					this.showPrevYear();
				}else{
					this.update(this.activeDate.add('d', 7));
				}
			},

			'pageUp' : function(e){
				this.showNextMonth();
			},

			'pageDown' : function(e){
				this.showPrevMonth();
			},

			'enter' : function(e){
				e.stopPropagation();
				return true;
			},

			scope : this
		});

		this.el.unselectable();

		this.cells = this.el.select('table.x-date-inner tbody td');
		this.textNodes = this.el.query('table.x-date-inner tbody span');

		this.mbtn = new Ext.Button({
			text: '&#160;',
			tooltip: this.monthYearText,
			renderTo: this.el.child('td.x-date-middle', true)
		});
		this.mbtn.el.child('em').addClass('x-btn-arrow');

		if(this.showToday){
			this.todayKeyListener = this.eventEl.addKeyListener(Ext.EventObject.SPACE, this.selectToday,  this);
			var today = (new Date()).dateFormat(this.format);
			this.todayBtn = new Ext.Button({
				renderTo: this.el.child('td.x-date-bottom', true),
				text: String.format(this.todayText, today),
				tooltip: String.format(this.todayTip, today),
				handler: this.selectToday,
				scope: this
			});
		}
		this.mon(this.eventEl, 'mousewheel', this.handleMouseWheel, this);
		this.mon(this.eventEl, 'click', this.handleDateClick,  this, {delegate: 'a.x-date-date'});
		this.mon(this.mbtn, 'click', this.showMonthPicker, this);
		this.onEnable(true);
	},


	createMonthPicker : function(){
		if(!this.monthPicker.dom.firstChild){
			var buf = ['<table border="0" cellspacing="0">'];
			for(var i = 0; i < 6; i++){
				buf.push(
					'<tr><td class="x-date-mp-month"><a href="#">', Date.getShortMonthName(i), '</a></td>',
					'<td class="x-date-mp-month x-date-mp-sep"><a href="#">', Date.getShortMonthName(i + 6), '</a></td>',
					i === 0 ?
						'<td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-prev"></a></td><td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-next"></a></td></tr>' :
						'<td class="x-date-mp-year"><a href="#"></a></td><td class="x-date-mp-year"><a href="#"></a></td></tr>'
				);
			}
			buf.push(
				'<tr class="x-date-mp-btns"><td colspan="4"><button type="button" class="x-date-mp-ok">',
				this.okText,
				'</button><button type="button" class="x-date-mp-cancel">',
				this.cancelText,
				'</button></td></tr>',
				'</table>'
			);
			this.monthPicker.update(buf.join(''));

			this.mon(this.monthPicker, 'click', this.onMonthClick, this);
			this.mon(this.monthPicker, 'dblclick', this.onMonthDblClick, this);

			this.mpMonths = this.monthPicker.select('td.x-date-mp-month');
			this.mpYears = this.monthPicker.select('td.x-date-mp-year');

			this.mpMonths.each(function(m, a, i){
				i += 1;
				if((i%2) === 0){
					m.dom.xmonth = 5 + Math.round(i * 0.5);
				}else{
					m.dom.xmonth = Math.round((i-1) * 0.5);
				}
			});
		}
	},


	showMonthPicker : function(){
		if(!this.disabled){
			this.createMonthPicker();
			var size = this.el.getSize();
			this.monthPicker.setSize(size);
			this.monthPicker.child('table').setSize(size);

			this.mpSelMonth = (this.activeDate || this.value).getMonth();
			this.updateMPMonth(this.mpSelMonth);
			this.mpSelYear = (this.activeDate || this.value).getFullYear();
			this.updateMPYear(this.mpSelYear);

			this.monthPicker.slideIn('t', {duration:0.2});
		}
	},


	updateMPYear : function(y){
		this.mpyear = y;
		var ys = this.mpYears.elements;
		for(var i = 1; i <= 10; i++){
			var td = ys[i-1], y2;
			if((i%2) === 0){
				y2 = y + Math.round(i * 0.5);
				td.firstChild.innerHTML = y2;
				td.xyear = y2;
			}else{
				y2 = y - (5-Math.round(i * 0.5));
				td.firstChild.innerHTML = y2;
				td.xyear = y2;
			}
			this.mpYears.item(i-1)[y2 == this.mpSelYear ? 'addClass' : 'removeClass']('x-date-mp-sel');
		}
	},


	updateMPMonth : function(sm){
		this.mpMonths.each(function(m, a, i){
			m[m.dom.xmonth == sm ? 'addClass' : 'removeClass']('x-date-mp-sel');
		});
	},


	selectMPMonth : function(m){

	},


	onMonthClick : function(e, t){
		e.stopEvent();
		var el = new Ext.Element(t), pn;
		if(el.is('button.x-date-mp-cancel')){
			this.hideMonthPicker();
		}
		else if(el.is('button.x-date-mp-ok')){
			var d = new Date(this.mpSelYear, this.mpSelMonth, (this.activeDate || this.value).getDate());
			if(d.getMonth() != this.mpSelMonth){

				d = new Date(this.mpSelYear, this.mpSelMonth, 1).getLastDateOfMonth();
			}
			this.update(d);
			this.hideMonthPicker();
		}
		else if((pn = el.up('td.x-date-mp-month', 2))){
			this.mpMonths.removeClass('x-date-mp-sel');
			pn.addClass('x-date-mp-sel');
			this.mpSelMonth = pn.dom.xmonth;
		}
		else if((pn = el.up('td.x-date-mp-year', 2))){
			this.mpYears.removeClass('x-date-mp-sel');
			pn.addClass('x-date-mp-sel');
			this.mpSelYear = pn.dom.xyear;
		}
		else if(el.is('a.x-date-mp-prev')){
			this.updateMPYear(this.mpyear-10);
		}
		else if(el.is('a.x-date-mp-next')){
			this.updateMPYear(this.mpyear+10);
		}
	},


	onMonthDblClick : function(e, t){
		e.stopEvent();
		var el = new Ext.Element(t), pn;
		if((pn = el.up('td.x-date-mp-month', 2))){
			this.update(new Date(this.mpSelYear, pn.dom.xmonth, (this.activeDate || this.value).getDate()));
			this.hideMonthPicker();
		}
		else if((pn = el.up('td.x-date-mp-year', 2))){
			this.update(new Date(pn.dom.xyear, this.mpSelMonth, (this.activeDate || this.value).getDate()));
			this.hideMonthPicker();
		}
	},


	hideMonthPicker : function(disableAnim){
		if(this.monthPicker){
			if(disableAnim === true){
				this.monthPicker.hide();
			}else{
				this.monthPicker.slideOut('t', {duration:0.2});
			}
		}
	},


	showPrevMonth : function(e){
		this.update(this.activeDate.add('mo', -1));
	},


	showNextMonth : function(e){
		this.update(this.activeDate.add('mo', 1));
	},


	showPrevYear : function(){
		this.update(this.activeDate.add('y', -1));
	},


	showNextYear : function(){
		this.update(this.activeDate.add('y', 1));
	},


	handleMouseWheel : function(e){
		e.stopEvent();
		if(!this.disabled){
			var delta = e.getWheelDelta();
			if(delta > 0){
				this.showPrevMonth();
			} else if(delta < 0){
				this.showNextMonth();
			}
		}
	},


	handleDateClick : function(e, t){
		e.stopEvent();
		if(!this.disabled && t.dateValue && !Ext.fly(t.parentNode).hasClass('x-date-disabled')){
			this.cancelFocus = this.focusOnSelect === false;
			this.setValue(new Date(t.dateValue));
			delete this.cancelFocus;
			this.fireEvent('select', this, this.value);
		}
	},


	selectToday : function(){
		if(this.todayBtn && !this.todayBtn.disabled){
			this.setValue(new Date().clearTime());
			this.fireEvent('select', this, this.value);
		}
	},


	update : function(date, forceRefresh){
		if(this.rendered){
			var vd = this.activeDate, vis = this.isVisible();
			this.activeDate = date;
			if(!forceRefresh && vd && this.el){
				var t = date.getTime();
				if(vd.getMonth() == date.getMonth() && vd.getFullYear() == date.getFullYear()){
					this.cells.removeClass('x-date-selected');
					this.cells.each(function(c){
						if(c.dom.firstChild.dateValue == t){
							c.addClass('x-date-selected');
							if(vis && !this.cancelFocus){
								Ext.fly(c.dom.firstChild).focus(50);
							}
							return false;
						}
					}, this);
					return;
				}
			}
			var days = date.getDaysInMonth(),
				firstOfMonth = date.getFirstDateOfMonth(),
				startingPos = firstOfMonth.getDay()-this.startDay;

			if(startingPos < 0){
				startingPos += 7;
			}
			days += startingPos;

			var pm = date.add('mo', -1),
				prevStart = pm.getDaysInMonth()-startingPos,
				cells = this.cells.elements,
				textEls = this.textNodes,

				day = 86400000,
				d = (new Date(pm.getFullYear(), pm.getMonth(), prevStart)).clearTime(),
				today = new Date().clearTime().getTime(),
				sel = date.clearTime(true).getTime(),
				min = this.minDate ? this.minDate.clearTime(true) : Number.NEGATIVE_INFINITY,
				max = this.maxDate ? this.maxDate.clearTime(true) : Number.POSITIVE_INFINITY,
				ddMatch = this.disabledDatesRE,
				ddText = this.disabledDatesText,
				ddays = this.disabledDays ? this.disabledDays.join('') : false,
				ddaysText = this.disabledDaysText,
				format = this.format;

			if(this.showToday){
				var td = new Date().clearTime(),
					disable = (td < min || td > max ||
						(ddMatch && format && ddMatch.test(td.dateFormat(format))) ||
						(ddays && ddays.indexOf(td.getDay()) != -1));

				if(!this.disabled){
					this.todayBtn.setDisabled(disable);
					this.todayKeyListener[disable ? 'disable' : 'enable']();
				}
			}

			var setCellClass = function(cal, cell){
				cell.title = '';
				var t = d.getTime();
				cell.firstChild.dateValue = t;
				if(t == today){
					cell.className += ' x-date-today';
					cell.title = cal.todayText;
				}
				if(t == sel){
					cell.className += ' x-date-selected';
					if(vis){
						Ext.fly(cell.firstChild).focus(50);
					}
				}

				if(t < min) {
					cell.className = ' x-date-disabled';
					cell.title = cal.minText;
					return;
				}
				if(t > max) {
					cell.className = ' x-date-disabled';
					cell.title = cal.maxText;
					return;
				}
				if(ddays){
					if(ddays.indexOf(d.getDay()) != -1){
						cell.title = ddaysText;
						cell.className = ' x-date-disabled';
					}
				}
				if(ddMatch && format){
					var fvalue = d.dateFormat(format);
					if(ddMatch.test(fvalue)){
						cell.title = ddText.replace('%0', fvalue);
						cell.className = ' x-date-disabled';
					}
				}
			};

			var i = 0;
			for(; i < startingPos; i++) {
				textEls[i].innerHTML = (++prevStart);
				d.setDate(d.getDate()+1);
				cells[i].className = 'x-date-prevday';
				setCellClass(this, cells[i]);
			}
			for(; i < days; i++){
				var intDay = i - startingPos + 1;
				textEls[i].innerHTML = (intDay);
				d.setDate(d.getDate()+1);
				cells[i].className = 'x-date-active';
				setCellClass(this, cells[i]);
			}
			var extraDays = 0;
			for(; i < 42; i++) {
				textEls[i].innerHTML = (++extraDays);
				d.setDate(d.getDate()+1);
				cells[i].className = 'x-date-nextday';
				setCellClass(this, cells[i]);
			}

			this.mbtn.setText(this.monthNames[date.getMonth()] + ' ' + date.getFullYear());

			if(!this.internalRender){
				var main = this.el.dom.firstChild,
					w = main.offsetWidth;
				this.el.setWidth(w + this.el.getBorderWidth('lr'));
				Ext.fly(main).setWidth(w);
				this.internalRender = true;



				if(Ext.isOpera && !this.secondPass){
					main.rows[0].cells[1].style.width = (w - (main.rows[0].cells[0].offsetWidth+main.rows[0].cells[2].offsetWidth)) + 'px';
					this.secondPass = true;
					this.update.defer(10, this, [date]);
				}
			}
		}
	},


	beforeDestroy : function() {
		if(this.rendered){
			Ext.destroy(
				this.keyNav,
				this.monthPicker,
				this.eventEl,
				this.mbtn,
				this.nextRepeater,
				this.prevRepeater,
				this.cells.el,
				this.todayBtn
			);
			delete this.textNodes;
			delete this.cells.elements;
		}
	}


});

Ext.reg('datepicker', Ext.DatePicker);

Ext.LoadMask = function(el, config){
	this.el = Ext.get(el);
	Ext.apply(this, config);
	if(this.store){
		this.store.on({
			scope: this,
			beforeload: this.onBeforeLoad,
			load: this.onLoad,
			exception: this.onLoad
		});
		this.removeMask = Ext.value(this.removeMask, false);
	}else{
		var um = this.el.getUpdater();
		um.showLoadIndicator = false;
		um.on({
			scope: this,
			beforeupdate: this.onBeforeLoad,
			update: this.onLoad,
			failure: this.onLoad
		});
		this.removeMask = Ext.value(this.removeMask, true);
	}
};

Ext.LoadMask.prototype = {



	msg : 'Loading...',

	msgCls : 'x-mask-loading',


	disabled: false,


	disable : function(){
		this.disabled = true;
	},


	enable : function(){
		this.disabled = false;
	},


	onLoad : function(){
		this.el.unmask(this.removeMask);
	},


	onBeforeLoad : function(){
		if(!this.disabled){
			this.el.mask(this.msg, this.msgCls);
		}
	},


	show: function(){
		this.onBeforeLoad();
	},


	hide: function(){
		this.onLoad();
	},


	destroy : function(){
		if(this.store){
			this.store.un('beforeload', this.onBeforeLoad, this);
			this.store.un('load', this.onLoad, this);
			this.store.un('exception', this.onLoad, this);
		}else{
			var um = this.el.getUpdater();
			um.un('beforeupdate', this.onBeforeLoad, this);
			um.un('update', this.onLoad, this);
			um.un('failure', this.onLoad, this);
		}
	}
};
Ext.Slider = Ext.extend(Ext.BoxComponent, {


	vertical: false,

	minValue: 0,

	maxValue: 100,

	decimalPrecision: 0,

	keyIncrement: 1,

	increment: 0,

	clickRange: [5,15],

	clickToChange : true,

	animate: true,


	dragging: false,


	initComponent : function(){
		if(!Ext.isDefined(this.value)){
			this.value = this.minValue;
		}
		Ext.Slider.superclass.initComponent.call(this);
		this.keyIncrement = Math.max(this.increment, this.keyIncrement);
		this.addEvents(

			'beforechange',

			'change',

			'changecomplete',

			'dragstart',

			'drag',

			'dragend'
		);

		if(this.vertical){
			Ext.apply(this, Ext.Slider.Vertical);
		}
	},


	onRender : function(){
		this.autoEl = {
			cls: 'x-slider ' + (this.vertical ? 'x-slider-vert' : 'x-slider-horz'),
			cn:{cls:'x-slider-end',cn:{cls:'x-slider-inner',cn:[{cls:'x-slider-thumb'},{tag:'a', cls:'x-slider-focus', href:"#", tabIndex: '-1', hidefocus:'on'}]}}
		};
		Ext.Slider.superclass.onRender.apply(this, arguments);
		this.endEl = this.el.first();
		this.innerEl = this.endEl.first();
		this.thumb = this.innerEl.first();
		this.halfThumb = (this.vertical ? this.thumb.getHeight() : this.thumb.getWidth())/2;
		this.focusEl = this.thumb.next();
		this.initEvents();
	},


	initEvents : function(){
		this.thumb.addClassOnOver('x-slider-thumb-over');
		this.mon(this.el, {
			scope: this,
			mousedown: this.onMouseDown,
			keydown: this.onKeyDown
		});

		this.focusEl.swallowEvent("click", true);

		this.tracker = new Ext.dd.DragTracker({
			onBeforeStart: this.onBeforeDragStart.createDelegate(this),
			onStart: this.onDragStart.createDelegate(this),
			onDrag: this.onDrag.createDelegate(this),
			onEnd: this.onDragEnd.createDelegate(this),
			tolerance: 3,
			autoStart: 300
		});
		this.tracker.initEl(this.thumb);
	},


	onMouseDown : function(e){
		if(this.disabled){
			return;
		}
		if(this.clickToChange && e.target != this.thumb.dom){
			var local = this.innerEl.translatePoints(e.getXY());
			this.onClickChange(local);
		}
		this.focus();
	},


	onClickChange : function(local){
		if(local.top > this.clickRange[0] && local.top < this.clickRange[1]){
			this.setValue(Ext.util.Format.round(this.reverseValue(local.left), this.decimalPrecision), undefined, true);
		}
	},


	onKeyDown : function(e){
		if(this.disabled){e.preventDefault();return;}
		var k = e.getKey();
		switch(k){
			case e.UP:
			case e.RIGHT:
				e.stopEvent();
				if(e.ctrlKey){
					this.setValue(this.maxValue, undefined, true);
				}else{
					this.setValue(this.value+this.keyIncrement, undefined, true);
				}
				break;
			case e.DOWN:
			case e.LEFT:
				e.stopEvent();
				if(e.ctrlKey){
					this.setValue(this.minValue, undefined, true);
				}else{
					this.setValue(this.value-this.keyIncrement, undefined, true);
				}
				break;
			default:
				e.preventDefault();
		}
	},


	doSnap : function(value){
		if(!(this.increment && value)){
			return value;
		}
		var newValue = value,
			inc = this.increment,
			m = value % inc;
		if(m != 0){
			newValue -= m;
			if(m * 2 > inc){
				newValue += inc;
			}else if(m * 2 < -inc){
				newValue -= inc;
			}
		}
		return newValue.constrain(this.minValue,  this.maxValue);
	},


	afterRender : function(){
		Ext.Slider.superclass.afterRender.apply(this, arguments);
		if(this.value !== undefined){
			var v = this.normalizeValue(this.value);
			if(v !== this.value){
				delete this.value;
				this.setValue(v, false);
			}else{
				this.moveThumb(this.translateValue(v), false);
			}
		}
	},


	getRatio : function(){
		var w = this.innerEl.getWidth(),
			v = this.maxValue - this.minValue;
		return v == 0 ? w : (w/v);
	},


	normalizeValue : function(v){
		v = this.doSnap(v);
		v = Ext.util.Format.round(v, this.decimalPrecision);
		v = v.constrain(this.minValue, this.maxValue);
		return v;
	},


	setValue : function(v, animate, changeComplete){
		v = this.normalizeValue(v);
		if(v !== this.value && this.fireEvent('beforechange', this, v, this.value) !== false){
			this.value = v;
			this.moveThumb(this.translateValue(v), animate !== false);
			this.fireEvent('change', this, v);
			if(changeComplete){
				this.fireEvent('changecomplete', this, v);
			}
		}
	},


	translateValue : function(v){
		var ratio = this.getRatio();
		return (v * ratio) - (this.minValue * ratio) - this.halfThumb;
	},

	reverseValue : function(pos){
		var ratio = this.getRatio();
		return (pos + this.halfThumb + (this.minValue * ratio)) / ratio;
	},


	moveThumb: function(v, animate){
		if(!animate || this.animate === false){
			this.thumb.setLeft(v);
		}else{
			this.thumb.shift({left: v, stopFx: true, duration:.35});
		}
	},


	focus : function(){
		this.focusEl.focus(10);
	},


	onBeforeDragStart : function(e){
		return !this.disabled;
	},


	onDragStart: function(e){
		this.thumb.addClass('x-slider-thumb-drag');
		this.dragging = true;
		this.dragStartValue = this.value;
		this.fireEvent('dragstart', this, e);
	},


	onDrag: function(e){
		var pos = this.innerEl.translatePoints(this.tracker.getXY());
		this.setValue(Ext.util.Format.round(this.reverseValue(pos.left), this.decimalPrecision), false);
		this.fireEvent('drag', this, e);
	},


	onDragEnd: function(e){
		this.thumb.removeClass('x-slider-thumb-drag');
		this.dragging = false;
		this.fireEvent('dragend', this, e);
		if(this.dragStartValue != this.value){
			this.fireEvent('changecomplete', this, this.value);
		}
	},


	onResize : function(w, h){
		this.innerEl.setWidth(w - (this.el.getPadding('l') + this.endEl.getPadding('r')));
		this.syncThumb();
	},


	onDisable: function(){
		Ext.Slider.superclass.onDisable.call(this);
		this.thumb.addClass(this.disabledClass);
		if(Ext.isIE){


			var xy = this.thumb.getXY();
			this.thumb.hide();
			this.innerEl.addClass(this.disabledClass).dom.disabled = true;
			if (!this.thumbHolder){
				this.thumbHolder = this.endEl.createChild({cls: 'x-slider-thumb ' + this.disabledClass});
			}
			this.thumbHolder.show().setXY(xy);
		}
	},


	onEnable: function(){
		Ext.Slider.superclass.onEnable.call(this);
		this.thumb.removeClass(this.disabledClass);
		if(Ext.isIE){
			this.innerEl.removeClass(this.disabledClass).dom.disabled = false;
			if(this.thumbHolder){
				this.thumbHolder.hide();
			}
			this.thumb.show();
			this.syncThumb();
		}
	},


	syncThumb : function(){
		if(this.rendered){
			this.moveThumb(this.translateValue(this.value));
		}
	},


	getValue : function(){
		return this.value;
	},


	beforeDestroy : function(){
		Ext.destroyMembers(this, 'endEl', 'innerEl', 'thumb', 'halfThumb', 'focusEl', 'tracker', 'thumbHolder');
		Ext.Slider.superclass.beforeDestroy.call(this);
	}
});
Ext.reg('slider', Ext.Slider);


Ext.Slider.Vertical = {
	onResize : function(w, h){
		this.innerEl.setHeight(h - (this.el.getPadding('t') + this.endEl.getPadding('b')));
		this.syncThumb();
	},

	getRatio : function(){
		var h = this.innerEl.getHeight(),
			v = this.maxValue - this.minValue;
		return h/v;
	},

	moveThumb: function(v, animate){
		if(!animate || this.animate === false){
			this.thumb.setBottom(v);
		}else{
			this.thumb.shift({bottom: v, stopFx: true, duration:.35});
		}
	},

	onDrag: function(e){
		var pos = this.innerEl.translatePoints(this.tracker.getXY()),
			bottom = this.innerEl.getHeight()-pos.top;
		this.setValue(this.minValue + Ext.util.Format.round(bottom/this.getRatio(), this.decimalPrecision), false);
		this.fireEvent('drag', this, e);
	},

	onClickChange : function(local){
		if(local.left > this.clickRange[0] && local.left < this.clickRange[1]){
			var bottom = this.innerEl.getHeight() - local.top;
			this.setValue(this.minValue + Ext.util.Format.round(bottom/this.getRatio(), this.decimalPrecision), undefined, true);
		}
	}
};
Ext.ProgressBar = Ext.extend(Ext.BoxComponent, {

	baseCls : 'x-progress',


	animate : false,


	waitTimer : null,


	initComponent : function(){
		Ext.ProgressBar.superclass.initComponent.call(this);
		this.addEvents(

			"update"
		);
	},


	onRender : function(ct, position){
		var tpl = new Ext.Template(
			'<div class="{cls}-wrap">',
			'<div class="{cls}-inner">',
			'<div class="{cls}-bar">',
			'<div class="{cls}-text">',
			'<div>&#160;</div>',
			'</div>',
			'</div>',
			'<div class="{cls}-text {cls}-text-back">',
			'<div>&#160;</div>',
			'</div>',
			'</div>',
			'</div>'
		);

		this.el = position ? tpl.insertBefore(position, {cls: this.baseCls}, true)
			: tpl.append(ct, {cls: this.baseCls}, true);

		if(this.id){
			this.el.dom.id = this.id;
		}
		var inner = this.el.dom.firstChild;
		this.progressBar = Ext.get(inner.firstChild);

		if(this.textEl){

			this.textEl = Ext.get(this.textEl);
			delete this.textTopEl;
		}else{

			this.textTopEl = Ext.get(this.progressBar.dom.firstChild);
			var textBackEl = Ext.get(inner.childNodes[1]);
			this.textTopEl.setStyle("z-index", 99).addClass('x-hidden');
			this.textEl = new Ext.CompositeElement([this.textTopEl.dom.firstChild, textBackEl.dom.firstChild]);
			this.textEl.setWidth(inner.offsetWidth);
		}
		this.progressBar.setHeight(inner.offsetHeight);
	},


	afterRender : function(){
		Ext.ProgressBar.superclass.afterRender.call(this);
		if(this.value){
			this.updateProgress(this.value, this.text);
		}else{
			this.updateText(this.text);
		}
	},


	updateProgress : function(value, text, animate){
		this.value = value || 0;
		if(text){
			this.updateText(text);
		}
		if(this.rendered){
			var w = Math.floor(value*this.el.dom.firstChild.offsetWidth);
			this.progressBar.setWidth(w, animate === true || (animate !== false && this.animate));
			if(this.textTopEl){

				this.textTopEl.removeClass('x-hidden').setWidth(w);
			}
		}
		this.fireEvent('update', this, value, text);
		return this;
	},


	wait : function(o){
		if(!this.waitTimer){
			var scope = this;
			o = o || {};
			this.updateText(o.text);
			this.waitTimer = Ext.TaskMgr.start({
				run: function(i){
					var inc = o.increment || 10;
					i -= 1;
					this.updateProgress(((((i+inc)%inc)+1)*(100/inc))*0.01, null, o.animate);
				},
				interval: o.interval || 1000,
				duration: o.duration,
				onStop: function(){
					if(o.fn){
						o.fn.apply(o.scope || this);
					}
					this.reset();
				},
				scope: scope
			});
		}
		return this;
	},


	isWaiting : function(){
		return this.waitTimer !== null;
	},


	updateText : function(text){
		this.text = text || '&#160;';
		if(this.rendered){
			this.textEl.update(this.text);
		}
		return this;
	},


	syncProgressBar : function(){
		if(this.value){
			this.updateProgress(this.value, this.text);
		}
		return this;
	},


	setSize : function(w, h){
		Ext.ProgressBar.superclass.setSize.call(this, w, h);
		if(this.textTopEl){
			var inner = this.el.dom.firstChild;
			this.textEl.setSize(inner.offsetWidth, inner.offsetHeight);
		}
		this.syncProgressBar();
		return this;
	},


	reset : function(hide){
		this.updateProgress(0);
		if(this.textTopEl){
			this.textTopEl.addClass('x-hidden');
		}
		if(this.waitTimer){
			this.waitTimer.onStop = null;
			Ext.TaskMgr.stop(this.waitTimer);
			this.waitTimer = null;
		}
		if(hide === true){
			this.hide();
		}
		return this;
	},

	onDestroy: function(){
		if(this.rendered){
			if(this.textEl.isComposite){
				this.textEl.clear();
			}
			Ext.destroyMembers(this, 'textEl', 'progressBar', 'textTopEl');
		}
		Ext.ProgressBar.superclass.onDestroy.call(this);
	}
});
Ext.reg('progress', Ext.ProgressBar);

(function() {

	var Event=Ext.EventManager;
	var Dom=Ext.lib.Dom;


	Ext.dd.DragDrop = function(id, sGroup, config) {
		if(id) {
			this.init(id, sGroup, config);
		}
	};

	Ext.dd.DragDrop.prototype = {




		id: null,


		config: null,


		dragElId: null,


		handleElId: null,


		invalidHandleTypes: null,


		invalidHandleIds: null,


		invalidHandleClasses: null,


		startPageX: 0,


		startPageY: 0,


		groups: null,


		locked: false,


		lock: function() { this.locked = true; },


		moveOnly: false,


		unlock: function() { this.locked = false; },


		isTarget: true,


		padding: null,


		_domRef: null,


		__ygDragDrop: true,


		constrainX: false,


		constrainY: false,


		minX: 0,


		maxX: 0,


		minY: 0,


		maxY: 0,


		maintainOffset: false,


		xTicks: null,


		yTicks: null,


		primaryButtonOnly: true,


		available: false,


		hasOuterHandles: false,


		b4StartDrag: function(x, y) { },


		startDrag: function(x, y) {  },


		b4Drag: function(e) { },


		onDrag: function(e) {  },


		onDragEnter: function(e, id) {  },


		b4DragOver: function(e) { },


		onDragOver: function(e, id) {  },


		b4DragOut: function(e) { },


		onDragOut: function(e, id) {  },


		b4DragDrop: function(e) { },


		onDragDrop: function(e, id) {  },


		onInvalidDrop: function(e) {  },


		b4EndDrag: function(e) { },


		endDrag: function(e) {  },


		b4MouseDown: function(e) {  },


		onMouseDown: function(e) {  },


		onMouseUp: function(e) {  },


		onAvailable: function () {
		},


		defaultPadding : {left:0, right:0, top:0, bottom:0},


		constrainTo : function(constrainTo, pad, inContent){
			if(Ext.isNumber(pad)){
				pad = {left: pad, right:pad, top:pad, bottom:pad};
			}
			pad = pad || this.defaultPadding;
			var b = Ext.get(this.getEl()).getBox(),
				ce = Ext.get(constrainTo),
				s = ce.getScroll(),
				c,
				cd = ce.dom;
			if(cd == document.body){
				c = { x: s.left, y: s.top, width: Ext.lib.Dom.getViewWidth(), height: Ext.lib.Dom.getViewHeight()};
			}else{
				var xy = ce.getXY();
				c = {x : xy[0], y: xy[1], width: cd.clientWidth, height: cd.clientHeight};
			}


			var topSpace = b.y - c.y,
				leftSpace = b.x - c.x;

			this.resetConstraints();
			this.setXConstraint(leftSpace - (pad.left||0),
				c.width - leftSpace - b.width - (pad.right||0),
				this.xTickSize
			);
			this.setYConstraint(topSpace - (pad.top||0),
				c.height - topSpace - b.height - (pad.bottom||0),
				this.yTickSize
			);
		},


		getEl: function() {
			if (!this._domRef) {
				this._domRef = Ext.getDom(this.id);
			}

			return this._domRef;
		},


		getDragEl: function() {
			return Ext.getDom(this.dragElId);
		},


		init: function(id, sGroup, config) {
			this.initTarget(id, sGroup, config);
			Event.on(this.id, "mousedown", this.handleMouseDown, this);

		},


		initTarget: function(id, sGroup, config) {


			this.config = config || {};


			this.DDM = Ext.dd.DDM;

			this.groups = {};



			if (typeof id !== "string") {
				id = Ext.id(id);
			}


			this.id = id;


			this.addToGroup((sGroup) ? sGroup : "default");



			this.handleElId = id;


			this.setDragElId(id);


			this.invalidHandleTypes = { A: "A" };
			this.invalidHandleIds = {};
			this.invalidHandleClasses = [];

			this.applyConfig();

			this.handleOnAvailable();
		},


		applyConfig: function() {



			this.padding           = this.config.padding || [0, 0, 0, 0];
			this.isTarget          = (this.config.isTarget !== false);
			this.maintainOffset    = (this.config.maintainOffset);
			this.primaryButtonOnly = (this.config.primaryButtonOnly !== false);

		},


		handleOnAvailable: function() {
			this.available = true;
			this.resetConstraints();
			this.onAvailable();
		},


		setPadding: function(iTop, iRight, iBot, iLeft) {

			if (!iRight && 0 !== iRight) {
				this.padding = [iTop, iTop, iTop, iTop];
			} else if (!iBot && 0 !== iBot) {
				this.padding = [iTop, iRight, iTop, iRight];
			} else {
				this.padding = [iTop, iRight, iBot, iLeft];
			}
		},


		setInitPosition: function(diffX, diffY) {
			var el = this.getEl();

			if (!this.DDM.verifyEl(el)) {
				return;
			}

			var dx = diffX || 0;
			var dy = diffY || 0;

			var p = Dom.getXY( el );

			this.initPageX = p[0] - dx;
			this.initPageY = p[1] - dy;

			this.lastPageX = p[0];
			this.lastPageY = p[1];


			this.setStartPosition(p);
		},


		setStartPosition: function(pos) {
			var p = pos || Dom.getXY( this.getEl() );
			this.deltaSetXY = null;

			this.startPageX = p[0];
			this.startPageY = p[1];
		},


		addToGroup: function(sGroup) {
			this.groups[sGroup] = true;
			this.DDM.regDragDrop(this, sGroup);
		},


		removeFromGroup: function(sGroup) {
			if (this.groups[sGroup]) {
				delete this.groups[sGroup];
			}

			this.DDM.removeDDFromGroup(this, sGroup);
		},


		setDragElId: function(id) {
			this.dragElId = id;
		},


		setHandleElId: function(id) {
			if (typeof id !== "string") {
				id = Ext.id(id);
			}
			this.handleElId = id;
			this.DDM.regHandle(this.id, id);
		},


		setOuterHandleElId: function(id) {
			if (typeof id !== "string") {
				id = Ext.id(id);
			}
			Event.on(id, "mousedown",
				this.handleMouseDown, this);
			this.setHandleElId(id);

			this.hasOuterHandles = true;
		},


		unreg: function() {
			Event.un(this.id, "mousedown",
				this.handleMouseDown);
			this._domRef = null;
			this.DDM._remove(this);
		},

		destroy : function(){
			this.unreg();
		},


		isLocked: function() {
			return (this.DDM.isLocked() || this.locked);
		},


		handleMouseDown: function(e, oDD){
			if (this.primaryButtonOnly && e.button != 0) {
				return;
			}

			if (this.isLocked()) {
				return;
			}

			this.DDM.refreshCache(this.groups);

			var pt = new Ext.lib.Point(Ext.lib.Event.getPageX(e), Ext.lib.Event.getPageY(e));
			if (!this.hasOuterHandles && !this.DDM.isOverTarget(pt, this) )  {
			} else {
				if (this.clickValidator(e)) {


					this.setStartPosition();


					this.b4MouseDown(e);
					this.onMouseDown(e);

					this.DDM.handleMouseDown(e, this);

					this.DDM.stopEvent(e);
				} else {


				}
			}
		},

		clickValidator: function(e) {
			var target = e.getTarget();
			return ( this.isValidHandleChild(target) &&
				(this.id == this.handleElId ||
					this.DDM.handleWasClicked(target, this.id)) );
		},


		addInvalidHandleType: function(tagName) {
			var type = tagName.toUpperCase();
			this.invalidHandleTypes[type] = type;
		},


		addInvalidHandleId: function(id) {
			if (typeof id !== "string") {
				id = Ext.id(id);
			}
			this.invalidHandleIds[id] = id;
		},


		addInvalidHandleClass: function(cssClass) {
			this.invalidHandleClasses.push(cssClass);
		},


		removeInvalidHandleType: function(tagName) {
			var type = tagName.toUpperCase();

			delete this.invalidHandleTypes[type];
		},


		removeInvalidHandleId: function(id) {
			if (typeof id !== "string") {
				id = Ext.id(id);
			}
			delete this.invalidHandleIds[id];
		},


		removeInvalidHandleClass: function(cssClass) {
			for (var i=0, len=this.invalidHandleClasses.length; i<len; ++i) {
				if (this.invalidHandleClasses[i] == cssClass) {
					delete this.invalidHandleClasses[i];
				}
			}
		},


		isValidHandleChild: function(node) {

			var valid = true;

			var nodeName;
			try {
				nodeName = node.nodeName.toUpperCase();
			} catch(e) {
				nodeName = node.nodeName;
			}
			valid = valid && !this.invalidHandleTypes[nodeName];
			valid = valid && !this.invalidHandleIds[node.id];

			for (var i=0, len=this.invalidHandleClasses.length; valid && i<len; ++i) {
				valid = !Ext.fly(node).hasClass(this.invalidHandleClasses[i]);
			}


			return valid;

		},


		setXTicks: function(iStartX, iTickSize) {
			this.xTicks = [];
			this.xTickSize = iTickSize;

			var tickMap = {};

			for (var i = this.initPageX; i >= this.minX; i = i - iTickSize) {
				if (!tickMap[i]) {
					this.xTicks[this.xTicks.length] = i;
					tickMap[i] = true;
				}
			}

			for (i = this.initPageX; i <= this.maxX; i = i + iTickSize) {
				if (!tickMap[i]) {
					this.xTicks[this.xTicks.length] = i;
					tickMap[i] = true;
				}
			}

			this.xTicks.sort(this.DDM.numericSort) ;
		},


		setYTicks: function(iStartY, iTickSize) {
			this.yTicks = [];
			this.yTickSize = iTickSize;

			var tickMap = {};

			for (var i = this.initPageY; i >= this.minY; i = i - iTickSize) {
				if (!tickMap[i]) {
					this.yTicks[this.yTicks.length] = i;
					tickMap[i] = true;
				}
			}

			for (i = this.initPageY; i <= this.maxY; i = i + iTickSize) {
				if (!tickMap[i]) {
					this.yTicks[this.yTicks.length] = i;
					tickMap[i] = true;
				}
			}

			this.yTicks.sort(this.DDM.numericSort) ;
		},


		setXConstraint: function(iLeft, iRight, iTickSize) {
			this.leftConstraint = iLeft;
			this.rightConstraint = iRight;

			this.minX = this.initPageX - iLeft;
			this.maxX = this.initPageX + iRight;
			if (iTickSize) { this.setXTicks(this.initPageX, iTickSize); }

			this.constrainX = true;
		},


		clearConstraints: function() {
			this.constrainX = false;
			this.constrainY = false;
			this.clearTicks();
		},


		clearTicks: function() {
			this.xTicks = null;
			this.yTicks = null;
			this.xTickSize = 0;
			this.yTickSize = 0;
		},


		setYConstraint: function(iUp, iDown, iTickSize) {
			this.topConstraint = iUp;
			this.bottomConstraint = iDown;

			this.minY = this.initPageY - iUp;
			this.maxY = this.initPageY + iDown;
			if (iTickSize) { this.setYTicks(this.initPageY, iTickSize); }

			this.constrainY = true;

		},


		resetConstraints: function() {



			if (this.initPageX || this.initPageX === 0) {

				var dx = (this.maintainOffset) ? this.lastPageX - this.initPageX : 0;
				var dy = (this.maintainOffset) ? this.lastPageY - this.initPageY : 0;

				this.setInitPosition(dx, dy);


			} else {
				this.setInitPosition();
			}

			if (this.constrainX) {
				this.setXConstraint( this.leftConstraint,
					this.rightConstraint,
					this.xTickSize        );
			}

			if (this.constrainY) {
				this.setYConstraint( this.topConstraint,
					this.bottomConstraint,
					this.yTickSize         );
			}
		},


		getTick: function(val, tickArray) {

			if (!tickArray) {


				return val;
			} else if (tickArray[0] >= val) {


				return tickArray[0];
			} else {
				for (var i=0, len=tickArray.length; i<len; ++i) {
					var next = i + 1;
					if (tickArray[next] && tickArray[next] >= val) {
						var diff1 = val - tickArray[i];
						var diff2 = tickArray[next] - val;
						return (diff2 > diff1) ? tickArray[i] : tickArray[next];
					}
				}



				return tickArray[tickArray.length - 1];
			}
		},


		toString: function() {
			return ("DragDrop " + this.id);
		}

	};

})();




if (!Ext.dd.DragDropMgr) {


	Ext.dd.DragDropMgr = function() {

		var Event = Ext.EventManager;

		return {


			ids: {},


			handleIds: {},


			dragCurrent: null,


			dragOvers: {},


			deltaX: 0,


			deltaY: 0,


			preventDefault: true,


			stopPropagation: true,


			initialized: false,


			locked: false,


			init: function() {
				this.initialized = true;
			},


			POINT: 0,


			INTERSECT: 1,


			mode: 0,


			_execOnAll: function(sMethod, args) {
				for (var i in this.ids) {
					for (var j in this.ids[i]) {
						var oDD = this.ids[i][j];
						if (! this.isTypeOfDD(oDD)) {
							continue;
						}
						oDD[sMethod].apply(oDD, args);
					}
				}
			},


			_onLoad: function() {

				this.init();


				Event.on(document, "mouseup",   this.handleMouseUp, this, true);
				Event.on(document, "mousemove", this.handleMouseMove, this, true);
				Event.on(window,   "unload",    this._onUnload, this, true);
				Event.on(window,   "resize",    this._onResize, this, true);


			},


			_onResize: function(e) {
				this._execOnAll("resetConstraints", []);
			},


			lock: function() { this.locked = true; },


			unlock: function() { this.locked = false; },


			isLocked: function() { return this.locked; },


			locationCache: {},


			useCache: true,


			clickPixelThresh: 3,


			clickTimeThresh: 350,


			dragThreshMet: false,


			clickTimeout: null,


			startX: 0,


			startY: 0,


			regDragDrop: function(oDD, sGroup) {
				if (!this.initialized) { this.init(); }

				if (!this.ids[sGroup]) {
					this.ids[sGroup] = {};
				}
				this.ids[sGroup][oDD.id] = oDD;
			},


			removeDDFromGroup: function(oDD, sGroup) {
				if (!this.ids[sGroup]) {
					this.ids[sGroup] = {};
				}

				var obj = this.ids[sGroup];
				if (obj && obj[oDD.id]) {
					delete obj[oDD.id];
				}
			},


			_remove: function(oDD) {
				for (var g in oDD.groups) {
					if (g && this.ids[g] && this.ids[g][oDD.id]) {
						delete this.ids[g][oDD.id];
					}
				}
				delete this.handleIds[oDD.id];
			},


			regHandle: function(sDDId, sHandleId) {
				if (!this.handleIds[sDDId]) {
					this.handleIds[sDDId] = {};
				}
				this.handleIds[sDDId][sHandleId] = sHandleId;
			},


			isDragDrop: function(id) {
				return ( this.getDDById(id) ) ? true : false;
			},


			getRelated: function(p_oDD, bTargetsOnly) {
				var oDDs = [];
				for (var i in p_oDD.groups) {
					for (var j in this.ids[i]) {
						var dd = this.ids[i][j];
						if (! this.isTypeOfDD(dd)) {
							continue;
						}
						if (!bTargetsOnly || dd.isTarget) {
							oDDs[oDDs.length] = dd;
						}
					}
				}

				return oDDs;
			},


			isLegalTarget: function (oDD, oTargetDD) {
				var targets = this.getRelated(oDD, true);
				for (var i=0, len=targets.length;i<len;++i) {
					if (targets[i].id == oTargetDD.id) {
						return true;
					}
				}

				return false;
			},


			isTypeOfDD: function (oDD) {
				return (oDD && oDD.__ygDragDrop);
			},


			isHandle: function(sDDId, sHandleId) {
				return ( this.handleIds[sDDId] &&
					this.handleIds[sDDId][sHandleId] );
			},


			getDDById: function(id) {
				for (var i in this.ids) {
					if (this.ids[i][id]) {
						return this.ids[i][id];
					}
				}
				return null;
			},


			handleMouseDown: function(e, oDD) {
				if(Ext.QuickTips){
					Ext.QuickTips.disable();
				}
				if(this.dragCurrent){


					this.handleMouseUp(e);
				}

				this.currentTarget = e.getTarget();
				this.dragCurrent = oDD;

				var el = oDD.getEl();


				this.startX = e.getPageX();
				this.startY = e.getPageY();

				this.deltaX = this.startX - el.offsetLeft;
				this.deltaY = this.startY - el.offsetTop;

				this.dragThreshMet = false;

				this.clickTimeout = setTimeout(
					function() {
						var DDM = Ext.dd.DDM;
						DDM.startDrag(DDM.startX, DDM.startY);
					},
					this.clickTimeThresh );
			},


			startDrag: function(x, y) {
				clearTimeout(this.clickTimeout);
				if (this.dragCurrent) {
					this.dragCurrent.b4StartDrag(x, y);
					this.dragCurrent.startDrag(x, y);
				}
				this.dragThreshMet = true;
			},


			handleMouseUp: function(e) {

				if(Ext.QuickTips){
					Ext.QuickTips.enable();
				}
				if (! this.dragCurrent) {
					return;
				}

				clearTimeout(this.clickTimeout);

				if (this.dragThreshMet) {
					this.fireEvents(e, true);
				} else {
				}

				this.stopDrag(e);

				this.stopEvent(e);
			},


			stopEvent: function(e){
				if(this.stopPropagation) {
					e.stopPropagation();
				}

				if (this.preventDefault) {
					e.preventDefault();
				}
			},


			stopDrag: function(e) {

				if (this.dragCurrent) {
					if (this.dragThreshMet) {
						this.dragCurrent.b4EndDrag(e);
						this.dragCurrent.endDrag(e);
					}

					this.dragCurrent.onMouseUp(e);
				}

				this.dragCurrent = null;
				this.dragOvers = {};
			},


			handleMouseMove: function(e) {
				if (! this.dragCurrent) {
					return true;
				}



				if (Ext.isIE && (e.button !== 0 && e.button !== 1 && e.button !== 2)) {
					this.stopEvent(e);
					return this.handleMouseUp(e);
				}

				if (!this.dragThreshMet) {
					var diffX = Math.abs(this.startX - e.getPageX());
					var diffY = Math.abs(this.startY - e.getPageY());
					if (diffX > this.clickPixelThresh ||
						diffY > this.clickPixelThresh) {
						this.startDrag(this.startX, this.startY);
					}
				}

				if (this.dragThreshMet) {
					this.dragCurrent.b4Drag(e);
					this.dragCurrent.onDrag(e);
					if(!this.dragCurrent.moveOnly){
						this.fireEvents(e, false);
					}
				}

				this.stopEvent(e);

				return true;
			},


			fireEvents: function(e, isDrop) {
				var dc = this.dragCurrent;



				if (!dc || dc.isLocked()) {
					return;
				}

				var pt = e.getPoint();


				var oldOvers = [];

				var outEvts   = [];
				var overEvts  = [];
				var dropEvts  = [];
				var enterEvts = [];



				for (var i in this.dragOvers) {

					var ddo = this.dragOvers[i];

					if (! this.isTypeOfDD(ddo)) {
						continue;
					}

					if (! this.isOverTarget(pt, ddo, this.mode)) {
						outEvts.push( ddo );
					}

					oldOvers[i] = true;
					delete this.dragOvers[i];
				}

				for (var sGroup in dc.groups) {

					if ("string" != typeof sGroup) {
						continue;
					}

					for (i in this.ids[sGroup]) {
						var oDD = this.ids[sGroup][i];
						if (! this.isTypeOfDD(oDD)) {
							continue;
						}

						if (oDD.isTarget && !oDD.isLocked() && ((oDD != dc) || (dc.ignoreSelf === false))) {
							if (this.isOverTarget(pt, oDD, this.mode)) {

								if (isDrop) {
									dropEvts.push( oDD );

								} else {


									if (!oldOvers[oDD.id]) {
										enterEvts.push( oDD );

									} else {
										overEvts.push( oDD );
									}

									this.dragOvers[oDD.id] = oDD;
								}
							}
						}
					}
				}

				if (this.mode) {
					if (outEvts.length) {
						dc.b4DragOut(e, outEvts);
						dc.onDragOut(e, outEvts);
					}

					if (enterEvts.length) {
						dc.onDragEnter(e, enterEvts);
					}

					if (overEvts.length) {
						dc.b4DragOver(e, overEvts);
						dc.onDragOver(e, overEvts);
					}

					if (dropEvts.length) {
						dc.b4DragDrop(e, dropEvts);
						dc.onDragDrop(e, dropEvts);
					}

				} else {

					var len = 0;
					for (i=0, len=outEvts.length; i<len; ++i) {
						dc.b4DragOut(e, outEvts[i].id);
						dc.onDragOut(e, outEvts[i].id);
					}


					for (i=0,len=enterEvts.length; i<len; ++i) {

						dc.onDragEnter(e, enterEvts[i].id);
					}


					for (i=0,len=overEvts.length; i<len; ++i) {
						dc.b4DragOver(e, overEvts[i].id);
						dc.onDragOver(e, overEvts[i].id);
					}


					for (i=0, len=dropEvts.length; i<len; ++i) {
						dc.b4DragDrop(e, dropEvts[i].id);
						dc.onDragDrop(e, dropEvts[i].id);
					}

				}


				if (isDrop && !dropEvts.length) {
					dc.onInvalidDrop(e);
				}

			},


			getBestMatch: function(dds) {
				var winner = null;






				var len = dds.length;

				if (len == 1) {
					winner = dds[0];
				} else {

					for (var i=0; i<len; ++i) {
						var dd = dds[i];



						if (dd.cursorIsOver) {
							winner = dd;
							break;

						} else {
							if (!winner ||
								winner.overlap.getArea() < dd.overlap.getArea()) {
								winner = dd;
							}
						}
					}
				}

				return winner;
			},


			refreshCache: function(groups) {
				for (var sGroup in groups) {
					if ("string" != typeof sGroup) {
						continue;
					}
					for (var i in this.ids[sGroup]) {
						var oDD = this.ids[sGroup][i];

						if (this.isTypeOfDD(oDD)) {

							var loc = this.getLocation(oDD);
							if (loc) {
								this.locationCache[oDD.id] = loc;
							} else {
								delete this.locationCache[oDD.id];



							}
						}
					}
				}
			},


			verifyEl: function(el) {
				if (el) {
					var parent;
					if(Ext.isIE){
						try{
							parent = el.offsetParent;
						}catch(e){}
					}else{
						parent = el.offsetParent;
					}
					if (parent) {
						return true;
					}
				}

				return false;
			},


			getLocation: function(oDD) {
				if (! this.isTypeOfDD(oDD)) {
					return null;
				}

				var el = oDD.getEl(), pos, x1, x2, y1, y2, t, r, b, l;

				try {
					pos= Ext.lib.Dom.getXY(el);
				} catch (e) { }

				if (!pos) {
					return null;
				}

				x1 = pos[0];
				x2 = x1 + el.offsetWidth;
				y1 = pos[1];
				y2 = y1 + el.offsetHeight;

				t = y1 - oDD.padding[0];
				r = x2 + oDD.padding[1];
				b = y2 + oDD.padding[2];
				l = x1 - oDD.padding[3];

				return new Ext.lib.Region( t, r, b, l );
			},


			isOverTarget: function(pt, oTarget, intersect) {

				var loc = this.locationCache[oTarget.id];
				if (!loc || !this.useCache) {
					loc = this.getLocation(oTarget);
					this.locationCache[oTarget.id] = loc;

				}

				if (!loc) {
					return false;
				}

				oTarget.cursorIsOver = loc.contains( pt );






				var dc = this.dragCurrent;
				if (!dc || !dc.getTargetCoord ||
					(!intersect && !dc.constrainX && !dc.constrainY)) {
					return oTarget.cursorIsOver;
				}

				oTarget.overlap = null;





				var pos = dc.getTargetCoord(pt.x, pt.y);

				var el = dc.getDragEl();
				var curRegion = new Ext.lib.Region( pos.y,
					pos.x + el.offsetWidth,
					pos.y + el.offsetHeight,
					pos.x );

				var overlap = curRegion.intersect(loc);

				if (overlap) {
					oTarget.overlap = overlap;
					return (intersect) ? true : oTarget.cursorIsOver;
				} else {
					return false;
				}
			},


			_onUnload: function(e, me) {
				Ext.dd.DragDropMgr.unregAll();
			},


			unregAll: function() {

				if (this.dragCurrent) {
					this.stopDrag();
					this.dragCurrent = null;
				}

				this._execOnAll("unreg", []);

				for (var i in this.elementCache) {
					delete this.elementCache[i];
				}

				this.elementCache = {};
				this.ids = {};
			},


			elementCache: {},


			getElWrapper: function(id) {
				var oWrapper = this.elementCache[id];
				if (!oWrapper || !oWrapper.el) {
					oWrapper = this.elementCache[id] =
						new this.ElementWrapper(Ext.getDom(id));
				}
				return oWrapper;
			},


			getElement: function(id) {
				return Ext.getDom(id);
			},


			getCss: function(id) {
				var el = Ext.getDom(id);
				return (el) ? el.style : null;
			},


			ElementWrapper: function(el) {

				this.el = el || null;

				this.id = this.el && el.id;

				this.css = this.el && el.style;
			},


			getPosX: function(el) {
				return Ext.lib.Dom.getX(el);
			},


			getPosY: function(el) {
				return Ext.lib.Dom.getY(el);
			},


			swapNode: function(n1, n2) {
				if (n1.swapNode) {
					n1.swapNode(n2);
				} else {
					var p = n2.parentNode;
					var s = n2.nextSibling;

					if (s == n1) {
						p.insertBefore(n1, n2);
					} else if (n2 == n1.nextSibling) {
						p.insertBefore(n2, n1);
					} else {
						n1.parentNode.replaceChild(n2, n1);
						p.insertBefore(n1, s);
					}
				}
			},


			getScroll: function () {
				var t, l, dde=document.documentElement, db=document.body;
				if (dde && (dde.scrollTop || dde.scrollLeft)) {
					t = dde.scrollTop;
					l = dde.scrollLeft;
				} else if (db) {
					t = db.scrollTop;
					l = db.scrollLeft;
				} else {

				}
				return { top: t, left: l };
			},


			getStyle: function(el, styleProp) {
				return Ext.fly(el).getStyle(styleProp);
			},


			getScrollTop: function () { return this.getScroll().top; },


			getScrollLeft: function () { return this.getScroll().left; },


			moveToEl: function (moveEl, targetEl) {
				var aCoord = Ext.lib.Dom.getXY(targetEl);
				Ext.lib.Dom.setXY(moveEl, aCoord);
			},


			numericSort: function(a, b) { return (a - b); },


			_timeoutCount: 0,


			_addListeners: function() {
				var DDM = Ext.dd.DDM;
				if ( Ext.lib.Event && document ) {
					DDM._onLoad();
				} else {
					if (DDM._timeoutCount > 2000) {
					} else {
						setTimeout(DDM._addListeners, 10);
						if (document && document.body) {
							DDM._timeoutCount += 1;
						}
					}
				}
			},


			handleWasClicked: function(node, id) {
				if (this.isHandle(id, node.id)) {
					return true;
				} else {

					var p = node.parentNode;

					while (p) {
						if (this.isHandle(id, p.id)) {
							return true;
						} else {
							p = p.parentNode;
						}
					}
				}

				return false;
			}

		};

	}();


	Ext.dd.DDM = Ext.dd.DragDropMgr;
	Ext.dd.DDM._addListeners();

}


Ext.dd.DD = function(id, sGroup, config) {
	if (id) {
		this.init(id, sGroup, config);
	}
};

Ext.extend(Ext.dd.DD, Ext.dd.DragDrop, {


	scroll: true,


	autoOffset: function(iPageX, iPageY) {
		var x = iPageX - this.startPageX;
		var y = iPageY - this.startPageY;
		this.setDelta(x, y);
	},


	setDelta: function(iDeltaX, iDeltaY) {
		this.deltaX = iDeltaX;
		this.deltaY = iDeltaY;
	},


	setDragElPos: function(iPageX, iPageY) {



		var el = this.getDragEl();
		this.alignElWithMouse(el, iPageX, iPageY);
	},


	alignElWithMouse: function(el, iPageX, iPageY) {
		var oCoord = this.getTargetCoord(iPageX, iPageY);
		var fly = el.dom ? el : Ext.fly(el, '_dd');
		if (!this.deltaSetXY) {
			var aCoord = [oCoord.x, oCoord.y];
			fly.setXY(aCoord);
			var newLeft = fly.getLeft(true);
			var newTop  = fly.getTop(true);
			this.deltaSetXY = [ newLeft - oCoord.x, newTop - oCoord.y ];
		} else {
			fly.setLeftTop(oCoord.x + this.deltaSetXY[0], oCoord.y + this.deltaSetXY[1]);
		}

		this.cachePosition(oCoord.x, oCoord.y);
		this.autoScroll(oCoord.x, oCoord.y, el.offsetHeight, el.offsetWidth);
		return oCoord;
	},


	cachePosition: function(iPageX, iPageY) {
		if (iPageX) {
			this.lastPageX = iPageX;
			this.lastPageY = iPageY;
		} else {
			var aCoord = Ext.lib.Dom.getXY(this.getEl());
			this.lastPageX = aCoord[0];
			this.lastPageY = aCoord[1];
		}
	},


	autoScroll: function(x, y, h, w) {

		if (this.scroll) {

			var clientH = Ext.lib.Dom.getViewHeight();


			var clientW = Ext.lib.Dom.getViewWidth();


			var st = this.DDM.getScrollTop();


			var sl = this.DDM.getScrollLeft();


			var bot = h + y;


			var right = w + x;




			var toBot = (clientH + st - y - this.deltaY);


			var toRight = (clientW + sl - x - this.deltaX);




			var thresh = 40;




			var scrAmt = (document.all) ? 80 : 30;



			if ( bot > clientH && toBot < thresh ) {
				window.scrollTo(sl, st + scrAmt);
			}



			if ( y < st && st > 0 && y - st < thresh ) {
				window.scrollTo(sl, st - scrAmt);
			}



			if ( right > clientW && toRight < thresh ) {
				window.scrollTo(sl + scrAmt, st);
			}



			if ( x < sl && sl > 0 && x - sl < thresh ) {
				window.scrollTo(sl - scrAmt, st);
			}
		}
	},


	getTargetCoord: function(iPageX, iPageY) {


		var x = iPageX - this.deltaX;
		var y = iPageY - this.deltaY;

		if (this.constrainX) {
			if (x < this.minX) { x = this.minX; }
			if (x > this.maxX) { x = this.maxX; }
		}

		if (this.constrainY) {
			if (y < this.minY) { y = this.minY; }
			if (y > this.maxY) { y = this.maxY; }
		}

		x = this.getTick(x, this.xTicks);
		y = this.getTick(y, this.yTicks);


		return {x:x, y:y};
	},


	applyConfig: function() {
		Ext.dd.DD.superclass.applyConfig.call(this);
		this.scroll = (this.config.scroll !== false);
	},


	b4MouseDown: function(e) {

		this.autoOffset(e.getPageX(),
			e.getPageY());
	},


	b4Drag: function(e) {
		this.setDragElPos(e.getPageX(),
			e.getPageY());
	},

	toString: function() {
		return ("DD " + this.id);
	}






});

Ext.dd.DDProxy = function(id, sGroup, config) {
	if (id) {
		this.init(id, sGroup, config);
		this.initFrame();
	}
};


Ext.dd.DDProxy.dragElId = "ygddfdiv";

Ext.extend(Ext.dd.DDProxy, Ext.dd.DD, {


	resizeFrame: true,


	centerFrame: false,


	createFrame: function() {
		var self = this;
		var body = document.body;

		if (!body || !body.firstChild) {
			setTimeout( function() { self.createFrame(); }, 50 );
			return;
		}

		var div = this.getDragEl();

		if (!div) {
			div    = document.createElement("div");
			div.id = this.dragElId;
			var s  = div.style;

			s.position   = "absolute";
			s.visibility = "hidden";
			s.cursor     = "move";
			s.border     = "2px solid #aaa";
			s.zIndex     = 999;




			body.insertBefore(div, body.firstChild);
		}
	},


	initFrame: function() {
		this.createFrame();
	},

	applyConfig: function() {
		Ext.dd.DDProxy.superclass.applyConfig.call(this);

		this.resizeFrame = (this.config.resizeFrame !== false);
		this.centerFrame = (this.config.centerFrame);
		this.setDragElId(this.config.dragElId || Ext.dd.DDProxy.dragElId);
	},


	showFrame: function(iPageX, iPageY) {
		var el = this.getEl();
		var dragEl = this.getDragEl();
		var s = dragEl.style;

		this._resizeProxy();

		if (this.centerFrame) {
			this.setDelta( Math.round(parseInt(s.width,  10)/2),
				Math.round(parseInt(s.height, 10)/2) );
		}

		this.setDragElPos(iPageX, iPageY);

		Ext.fly(dragEl).show();
	},


	_resizeProxy: function() {
		if (this.resizeFrame) {
			var el = this.getEl();
			Ext.fly(this.getDragEl()).setSize(el.offsetWidth, el.offsetHeight);
		}
	},


	b4MouseDown: function(e) {
		var x = e.getPageX();
		var y = e.getPageY();
		this.autoOffset(x, y);
		this.setDragElPos(x, y);
	},


	b4StartDrag: function(x, y) {

		this.showFrame(x, y);
	},


	b4EndDrag: function(e) {
		Ext.fly(this.getDragEl()).hide();
	},




	endDrag: function(e) {

		var lel = this.getEl();
		var del = this.getDragEl();


		del.style.visibility = "";

		this.beforeMove();


		lel.style.visibility = "hidden";
		Ext.dd.DDM.moveToEl(lel, del);
		del.style.visibility = "hidden";
		lel.style.visibility = "";

		this.afterDrag();
	},

	beforeMove : function(){

	},

	afterDrag : function(){

	},

	toString: function() {
		return ("DDProxy " + this.id);
	}

});

Ext.dd.DDTarget = function(id, sGroup, config) {
	if (id) {
		this.initTarget(id, sGroup, config);
	}
};


Ext.extend(Ext.dd.DDTarget, Ext.dd.DragDrop, {

	getDragEl: Ext.emptyFn,

	isValidHandleChild: Ext.emptyFn,

	startDrag: Ext.emptyFn,

	endDrag: Ext.emptyFn,

	onDrag: Ext.emptyFn,

	onDragDrop: Ext.emptyFn,

	onDragEnter: Ext.emptyFn,

	onDragOut: Ext.emptyFn,

	onDragOver: Ext.emptyFn,

	onInvalidDrop: Ext.emptyFn,

	onMouseDown: Ext.emptyFn,

	onMouseUp: Ext.emptyFn,

	setXConstraint: Ext.emptyFn,

	setYConstraint: Ext.emptyFn,

	resetConstraints: Ext.emptyFn,

	clearConstraints: Ext.emptyFn,

	clearTicks: Ext.emptyFn,

	setInitPosition: Ext.emptyFn,

	setDragElId: Ext.emptyFn,

	setHandleElId: Ext.emptyFn,

	setOuterHandleElId: Ext.emptyFn,

	addInvalidHandleClass: Ext.emptyFn,

	addInvalidHandleId: Ext.emptyFn,

	addInvalidHandleType: Ext.emptyFn,

	removeInvalidHandleClass: Ext.emptyFn,

	removeInvalidHandleId: Ext.emptyFn,

	removeInvalidHandleType: Ext.emptyFn,

	toString: function() {
		return ("DDTarget " + this.id);
	}
});
Ext.dd.DragTracker = Ext.extend(Ext.util.Observable,  {

	active: false,

	tolerance: 5,

	autoStart: false,

	constructor : function(config){
		Ext.apply(this, config);
		this.addEvents(

			'mousedown',

			'mouseup',

			'mousemove',

			'dragstart',

			'dragend',

			'drag'
		);

		this.dragRegion = new Ext.lib.Region(0,0,0,0);

		if(this.el){
			this.initEl(this.el);
		}
		Ext.dd.DragTracker.superclass.constructor.call(this, config);
	},

	initEl: function(el){
		this.el = Ext.get(el);
		el.on('mousedown', this.onMouseDown, this,
			this.delegate ? {delegate: this.delegate} : undefined);
	},

	destroy : function(){
		this.el.un('mousedown', this.onMouseDown, this);
	},

	onMouseDown: function(e, target){
		if(this.fireEvent('mousedown', this, e) !== false && this.onBeforeStart(e) !== false){
			this.startXY = this.lastXY = e.getXY();
			this.dragTarget = this.delegate ? target : this.el.dom;
			if(this.preventDefault !== false){
				e.preventDefault();
			}
			var doc = Ext.getDoc();
			doc.on('mouseup', this.onMouseUp, this);
			doc.on('mousemove', this.onMouseMove, this);
			doc.on('selectstart', this.stopSelect, this);
			if(this.autoStart){
				this.timer = this.triggerStart.defer(this.autoStart === true ? 1000 : this.autoStart, this);
			}
		}
	},

	onMouseMove: function(e, target){

		if(this.active && Ext.isIE && !e.browserEvent.button){
			e.preventDefault();
			this.onMouseUp(e);
			return;
		}

		e.preventDefault();
		var xy = e.getXY(), s = this.startXY;
		this.lastXY = xy;
		if(!this.active){
			if(Math.abs(s[0]-xy[0]) > this.tolerance || Math.abs(s[1]-xy[1]) > this.tolerance){
				this.triggerStart();
			}else{
				return;
			}
		}
		this.fireEvent('mousemove', this, e);
		this.onDrag(e);
		this.fireEvent('drag', this, e);
	},

	onMouseUp: function(e){
		var doc = Ext.getDoc();
		doc.un('mousemove', this.onMouseMove, this);
		doc.un('mouseup', this.onMouseUp, this);
		doc.un('selectstart', this.stopSelect, this);
		e.preventDefault();
		this.clearStart();
		var wasActive = this.active;
		this.active = false;
		delete this.elRegion;
		this.fireEvent('mouseup', this, e);
		if(wasActive){
			this.onEnd(e);
			this.fireEvent('dragend', this, e);
		}
	},

	triggerStart: function(isTimer){
		this.clearStart();
		this.active = true;
		this.onStart(this.startXY);
		this.fireEvent('dragstart', this, this.startXY);
	},

	clearStart : function(){
		if(this.timer){
			clearTimeout(this.timer);
			delete this.timer;
		}
	},

	stopSelect : function(e){
		e.stopEvent();
		return false;
	},

	onBeforeStart : function(e){

	},

	onStart : function(xy){

	},

	onDrag : function(e){

	},

	onEnd : function(e){

	},

	getDragTarget : function(){
		return this.dragTarget;
	},

	getDragCt : function(){
		return this.el;
	},

	getXY : function(constrain){
		return constrain ?
			this.constrainModes[constrain].call(this, this.lastXY) : this.lastXY;
	},

	getOffset : function(constrain){
		var xy = this.getXY(constrain);
		var s = this.startXY;
		return [s[0]-xy[0], s[1]-xy[1]];
	},

	constrainModes: {
		'point' : function(xy){

			if(!this.elRegion){
				this.elRegion = this.getDragCt().getRegion();
			}

			var dr = this.dragRegion;

			dr.left = xy[0];
			dr.top = xy[1];
			dr.right = xy[0];
			dr.bottom = xy[1];

			dr.constrainTo(this.elRegion);

			return [dr.left, dr.top];
		}
	}
});
Ext.dd.ScrollManager = function(){
	var ddm = Ext.dd.DragDropMgr;
	var els = {};
	var dragEl = null;
	var proc = {};

	var onStop = function(e){
		dragEl = null;
		clearProc();
	};

	var triggerRefresh = function(){
		if(ddm.dragCurrent){
			ddm.refreshCache(ddm.dragCurrent.groups);
		}
	};

	var doScroll = function(){
		if(ddm.dragCurrent){
			var dds = Ext.dd.ScrollManager;
			var inc = proc.el.ddScrollConfig ?
				proc.el.ddScrollConfig.increment : dds.increment;
			if(!dds.animate){
				if(proc.el.scroll(proc.dir, inc)){
					triggerRefresh();
				}
			}else{
				proc.el.scroll(proc.dir, inc, true, dds.animDuration, triggerRefresh);
			}
		}
	};

	var clearProc = function(){
		if(proc.id){
			clearInterval(proc.id);
		}
		proc.id = 0;
		proc.el = null;
		proc.dir = "";
	};

	var startProc = function(el, dir){
		clearProc();
		proc.el = el;
		proc.dir = dir;
		var freq = (el.ddScrollConfig && el.ddScrollConfig.frequency) ?
			el.ddScrollConfig.frequency : Ext.dd.ScrollManager.frequency;
		proc.id = setInterval(doScroll, freq);
	};

	var onFire = function(e, isDrop){
		if(isDrop || !ddm.dragCurrent){ return; }
		var dds = Ext.dd.ScrollManager;
		if(!dragEl || dragEl != ddm.dragCurrent){
			dragEl = ddm.dragCurrent;

			dds.refreshCache();
		}

		var xy = Ext.lib.Event.getXY(e);
		var pt = new Ext.lib.Point(xy[0], xy[1]);
		for(var id in els){
			var el = els[id], r = el._region;
			var c = el.ddScrollConfig ? el.ddScrollConfig : dds;
			if(r && r.contains(pt) && el.isScrollable()){
				if(r.bottom - pt.y <= c.vthresh){
					if(proc.el != el){
						startProc(el, "down");
					}
					return;
				}else if(r.right - pt.x <= c.hthresh){
					if(proc.el != el){
						startProc(el, "left");
					}
					return;
				}else if(pt.y - r.top <= c.vthresh){
					if(proc.el != el){
						startProc(el, "up");
					}
					return;
				}else if(pt.x - r.left <= c.hthresh){
					if(proc.el != el){
						startProc(el, "right");
					}
					return;
				}
			}
		}
		clearProc();
	};

	ddm.fireEvents = ddm.fireEvents.createSequence(onFire, ddm);
	ddm.stopDrag = ddm.stopDrag.createSequence(onStop, ddm);

	return {

		register : function(el){
			if(Ext.isArray(el)){
				for(var i = 0, len = el.length; i < len; i++) {
					this.register(el[i]);
				}
			}else{
				el = Ext.get(el);
				els[el.id] = el;
			}
		},


		unregister : function(el){
			if(Ext.isArray(el)){
				for(var i = 0, len = el.length; i < len; i++) {
					this.unregister(el[i]);
				}
			}else{
				el = Ext.get(el);
				delete els[el.id];
			}
		},


		vthresh : 25,

		hthresh : 25,


		increment : 100,


		frequency : 500,


		animate: true,


		animDuration: .4,


		refreshCache : function(){
			for(var id in els){
				if(typeof els[id] == 'object'){
					els[id]._region = els[id].getRegion();
				}
			}
		}
	};
}();
Ext.dd.Registry = function(){
	var elements = {};
	var handles = {};
	var autoIdSeed = 0;

	var getId = function(el, autogen){
		if(typeof el == "string"){
			return el;
		}
		var id = el.id;
		if(!id && autogen !== false){
			id = "extdd-" + (++autoIdSeed);
			el.id = id;
		}
		return id;
	};

	return {

		register : function(el, data){
			data = data || {};
			if(typeof el == "string"){
				el = document.getElementById(el);
			}
			data.ddel = el;
			elements[getId(el)] = data;
			if(data.isHandle !== false){
				handles[data.ddel.id] = data;
			}
			if(data.handles){
				var hs = data.handles;
				for(var i = 0, len = hs.length; i < len; i++){
					handles[getId(hs[i])] = data;
				}
			}
		},


		unregister : function(el){
			var id = getId(el, false);
			var data = elements[id];
			if(data){
				delete elements[id];
				if(data.handles){
					var hs = data.handles;
					for(var i = 0, len = hs.length; i < len; i++){
						delete handles[getId(hs[i], false)];
					}
				}
			}
		},


		getHandle : function(id){
			if(typeof id != "string"){
				id = id.id;
			}
			return handles[id];
		},


		getHandleFromEvent : function(e){
			var t = Ext.lib.Event.getTarget(e);
			return t ? handles[t.id] : null;
		},


		getTarget : function(id){
			if(typeof id != "string"){
				id = id.id;
			}
			return elements[id];
		},


		getTargetFromEvent : function(e){
			var t = Ext.lib.Event.getTarget(e);
			return t ? elements[t.id] || handles[t.id] : null;
		}
	};
}();
Ext.dd.StatusProxy = function(config){
	Ext.apply(this, config);
	this.id = this.id || Ext.id();
	this.el = new Ext.Layer({
		dh: {
			id: this.id, tag: "div", cls: "x-dd-drag-proxy "+this.dropNotAllowed, children: [
				{tag: "div", cls: "x-dd-drop-icon"},
				{tag: "div", cls: "x-dd-drag-ghost"}
			]
		},
		shadow: !config || config.shadow !== false
	});
	this.ghost = Ext.get(this.el.dom.childNodes[1]);
	this.dropStatus = this.dropNotAllowed;
};

Ext.dd.StatusProxy.prototype = {

	dropAllowed : "x-dd-drop-ok",

	dropNotAllowed : "x-dd-drop-nodrop",


	setStatus : function(cssClass){
		cssClass = cssClass || this.dropNotAllowed;
		if(this.dropStatus != cssClass){
			this.el.replaceClass(this.dropStatus, cssClass);
			this.dropStatus = cssClass;
		}
	},


	reset : function(clearGhost){
		this.el.dom.className = "x-dd-drag-proxy " + this.dropNotAllowed;
		this.dropStatus = this.dropNotAllowed;
		if(clearGhost){
			this.ghost.update("");
		}
	},


	update : function(html){
		if(typeof html == "string"){
			this.ghost.update(html);
		}else{
			this.ghost.update("");
			html.style.margin = "0";
			this.ghost.dom.appendChild(html);
		}
		var el = this.ghost.dom.firstChild;
		if(el){
			Ext.fly(el).setStyle('float', 'none');
		}
	},


	getEl : function(){
		return this.el;
	},


	getGhost : function(){
		return this.ghost;
	},


	hide : function(clear){
		this.el.hide();
		if(clear){
			this.reset(true);
		}
	},


	stop : function(){
		if(this.anim && this.anim.isAnimated && this.anim.isAnimated()){
			this.anim.stop();
		}
	},


	show : function(){
		this.el.show();
	},


	sync : function(){
		this.el.sync();
	},


	repair : function(xy, callback, scope){
		this.callback = callback;
		this.scope = scope;
		if(xy && this.animRepair !== false){
			this.el.addClass("x-dd-drag-repair");
			this.el.hideUnders(true);
			this.anim = this.el.shift({
				duration: this.repairDuration || .5,
				easing: 'easeOut',
				xy: xy,
				stopFx: true,
				callback: this.afterRepair,
				scope: this
			});
		}else{
			this.afterRepair();
		}
	},


	afterRepair : function(){
		this.hide(true);
		if(typeof this.callback == "function"){
			this.callback.call(this.scope || this);
		}
		this.callback = null;
		this.scope = null;
	},

	destroy: function(){
		Ext.destroy(this.ghost, this.el);
	}
};
Ext.dd.DragSource = function(el, config){
	this.el = Ext.get(el);
	if(!this.dragData){
		this.dragData = {};
	}

	Ext.apply(this, config);

	if(!this.proxy){
		this.proxy = new Ext.dd.StatusProxy();
	}
	Ext.dd.DragSource.superclass.constructor.call(this, this.el.dom, this.ddGroup || this.group,
		{dragElId : this.proxy.id, resizeFrame: false, isTarget: false, scroll: this.scroll === true});

	this.dragging = false;
};

Ext.extend(Ext.dd.DragSource, Ext.dd.DDProxy, {


	dropAllowed : "x-dd-drop-ok",

	dropNotAllowed : "x-dd-drop-nodrop",


	getDragData : function(e){
		return this.dragData;
	},


	onDragEnter : function(e, id){
		var target = Ext.dd.DragDropMgr.getDDById(id);
		this.cachedTarget = target;
		if(this.beforeDragEnter(target, e, id) !== false){
			if(target.isNotifyTarget){
				var status = target.notifyEnter(this, e, this.dragData);
				this.proxy.setStatus(status);
			}else{
				this.proxy.setStatus(this.dropAllowed);
			}

			if(this.afterDragEnter){

				this.afterDragEnter(target, e, id);
			}
		}
	},


	beforeDragEnter : function(target, e, id){
		return true;
	},


	alignElWithMouse: function() {
		Ext.dd.DragSource.superclass.alignElWithMouse.apply(this, arguments);
		this.proxy.sync();
	},


	onDragOver : function(e, id){
		var target = this.cachedTarget || Ext.dd.DragDropMgr.getDDById(id);
		if(this.beforeDragOver(target, e, id) !== false){
			if(target.isNotifyTarget){
				var status = target.notifyOver(this, e, this.dragData);
				this.proxy.setStatus(status);
			}

			if(this.afterDragOver){

				this.afterDragOver(target, e, id);
			}
		}
	},


	beforeDragOver : function(target, e, id){
		return true;
	},


	onDragOut : function(e, id){
		var target = this.cachedTarget || Ext.dd.DragDropMgr.getDDById(id);
		if(this.beforeDragOut(target, e, id) !== false){
			if(target.isNotifyTarget){
				target.notifyOut(this, e, this.dragData);
			}
			this.proxy.reset();
			if(this.afterDragOut){

				this.afterDragOut(target, e, id);
			}
		}
		this.cachedTarget = null;
	},


	beforeDragOut : function(target, e, id){
		return true;
	},


	onDragDrop : function(e, id){
		var target = this.cachedTarget || Ext.dd.DragDropMgr.getDDById(id);
		if(this.beforeDragDrop(target, e, id) !== false){
			if(target.isNotifyTarget){
				if(target.notifyDrop(this, e, this.dragData)){
					this.onValidDrop(target, e, id);
				}else{
					this.onInvalidDrop(target, e, id);
				}
			}else{
				this.onValidDrop(target, e, id);
			}

			if(this.afterDragDrop){

				this.afterDragDrop(target, e, id);
			}
		}
		delete this.cachedTarget;
	},


	beforeDragDrop : function(target, e, id){
		return true;
	},


	onValidDrop : function(target, e, id){
		this.hideProxy();
		if(this.afterValidDrop){

			this.afterValidDrop(target, e, id);
		}
	},


	getRepairXY : function(e, data){
		return this.el.getXY();
	},


	onInvalidDrop : function(target, e, id){
		this.beforeInvalidDrop(target, e, id);
		if(this.cachedTarget){
			if(this.cachedTarget.isNotifyTarget){
				this.cachedTarget.notifyOut(this, e, this.dragData);
			}
			this.cacheTarget = null;
		}
		this.proxy.repair(this.getRepairXY(e, this.dragData), this.afterRepair, this);

		if(this.afterInvalidDrop){

			this.afterInvalidDrop(e, id);
		}
	},


	afterRepair : function(){
		if(Ext.enableFx){
			this.el.highlight(this.hlColor || "c3daf9");
		}
		this.dragging = false;
	},


	beforeInvalidDrop : function(target, e, id){
		return true;
	},


	handleMouseDown : function(e){
		if(this.dragging) {
			return;
		}
		var data = this.getDragData(e);
		if(data && this.onBeforeDrag(data, e) !== false){
			this.dragData = data;
			this.proxy.stop();
			Ext.dd.DragSource.superclass.handleMouseDown.apply(this, arguments);
		}
	},


	onBeforeDrag : function(data, e){
		return true;
	},


	onStartDrag : Ext.emptyFn,


	startDrag : function(x, y){
		this.proxy.reset();
		this.dragging = true;
		this.proxy.update("");
		this.onInitDrag(x, y);
		this.proxy.show();
	},


	onInitDrag : function(x, y){
		var clone = this.el.dom.cloneNode(true);
		clone.id = Ext.id();
		this.proxy.update(clone);
		this.onStartDrag(x, y);
		return true;
	},


	getProxy : function(){
		return this.proxy;
	},


	hideProxy : function(){
		this.proxy.hide();
		this.proxy.reset(true);
		this.dragging = false;
	},


	triggerCacheRefresh : function(){
		Ext.dd.DDM.refreshCache(this.groups);
	},


	b4EndDrag: function(e) {
	},


	endDrag : function(e){
		this.onEndDrag(this.dragData, e);
	},


	onEndDrag : function(data, e){
	},


	autoOffset : function(x, y) {
		this.setDelta(-12, -20);
	},

	destroy: function(){
		Ext.dd.DragSource.superclass.destroy.call(this);
		Ext.destroy(this.proxy);
	}
});
Ext.dd.DropTarget = function(el, config){
	this.el = Ext.get(el);

	Ext.apply(this, config);

	if(this.containerScroll){
		Ext.dd.ScrollManager.register(this.el);
	}

	Ext.dd.DropTarget.superclass.constructor.call(this, this.el.dom, this.ddGroup || this.group,
		{isTarget: true});

};

Ext.extend(Ext.dd.DropTarget, Ext.dd.DDTarget, {



	dropAllowed : "x-dd-drop-ok",

	dropNotAllowed : "x-dd-drop-nodrop",


	isTarget : true,


	isNotifyTarget : true,


	notifyEnter : function(dd, e, data){
		if(this.overClass){
			this.el.addClass(this.overClass);
		}
		return this.dropAllowed;
	},


	notifyOver : function(dd, e, data){
		return this.dropAllowed;
	},


	notifyOut : function(dd, e, data){
		if(this.overClass){
			this.el.removeClass(this.overClass);
		}
	},


	notifyDrop : function(dd, e, data){
		return false;
	}
});
Ext.dd.DragZone = function(el, config){
	Ext.dd.DragZone.superclass.constructor.call(this, el, config);
	if(this.containerScroll){
		Ext.dd.ScrollManager.register(this.el);
	}
};

Ext.extend(Ext.dd.DragZone, Ext.dd.DragSource, {





	getDragData : function(e){
		return Ext.dd.Registry.getHandleFromEvent(e);
	},


	onInitDrag : function(x, y){
		this.proxy.update(this.dragData.ddel.cloneNode(true));
		this.onStartDrag(x, y);
		return true;
	},


	afterRepair : function(){
		if(Ext.enableFx){
			Ext.Element.fly(this.dragData.ddel).highlight(this.hlColor || "c3daf9");
		}
		this.dragging = false;
	},


	getRepairXY : function(e){
		return Ext.Element.fly(this.dragData.ddel).getXY();
	}
});
Ext.dd.DropZone = function(el, config){
	Ext.dd.DropZone.superclass.constructor.call(this, el, config);
};

Ext.extend(Ext.dd.DropZone, Ext.dd.DropTarget, {

	getTargetFromEvent : function(e){
		return Ext.dd.Registry.getTargetFromEvent(e);
	},


	onNodeEnter : function(n, dd, e, data){

	},


	onNodeOver : function(n, dd, e, data){
		return this.dropAllowed;
	},


	onNodeOut : function(n, dd, e, data){

	},


	onNodeDrop : function(n, dd, e, data){
		return false;
	},


	onContainerOver : function(dd, e, data){
		return this.dropNotAllowed;
	},


	onContainerDrop : function(dd, e, data){
		return false;
	},


	notifyEnter : function(dd, e, data){
		return this.dropNotAllowed;
	},


	notifyOver : function(dd, e, data){
		var n = this.getTargetFromEvent(e);
		if(!n){
			if(this.lastOverNode){
				this.onNodeOut(this.lastOverNode, dd, e, data);
				this.lastOverNode = null;
			}
			return this.onContainerOver(dd, e, data);
		}
		if(this.lastOverNode != n){
			if(this.lastOverNode){
				this.onNodeOut(this.lastOverNode, dd, e, data);
			}
			this.onNodeEnter(n, dd, e, data);
			this.lastOverNode = n;
		}
		return this.onNodeOver(n, dd, e, data);
	},


	notifyOut : function(dd, e, data){
		if(this.lastOverNode){
			this.onNodeOut(this.lastOverNode, dd, e, data);
			this.lastOverNode = null;
		}
	},


	notifyDrop : function(dd, e, data){
		if(this.lastOverNode){
			this.onNodeOut(this.lastOverNode, dd, e, data);
			this.lastOverNode = null;
		}
		var n = this.getTargetFromEvent(e);
		return n ?
			this.onNodeDrop(n, dd, e, data) :
			this.onContainerDrop(dd, e, data);
	},


	triggerCacheRefresh : function(){
		Ext.dd.DDM.refreshCache(this.groups);
	}
});
Ext.Element.addMethods({

	initDD : function(group, config, overrides){
		var dd = new Ext.dd.DD(Ext.id(this.dom), group, config);
		return Ext.apply(dd, overrides);
	},


	initDDProxy : function(group, config, overrides){
		var dd = new Ext.dd.DDProxy(Ext.id(this.dom), group, config);
		return Ext.apply(dd, overrides);
	},


	initDDTarget : function(group, config, overrides){
		var dd = new Ext.dd.DDTarget(Ext.id(this.dom), group, config);
		return Ext.apply(dd, overrides);
	}
});

Ext.data.Api = (function() {





	var validActions = {};

	return {

		actions : {
			create  : 'create',
			read    : 'read',
			update  : 'update',
			destroy : 'destroy'
		},


		restActions : {
			create  : 'POST',
			read    : 'GET',
			update  : 'PUT',
			destroy : 'DELETE'
		},


		isAction : function(action) {
			return (Ext.data.Api.actions[action]) ? true : false;
		},


		getVerb : function(name) {
			if (validActions[name]) {
				return validActions[name];
			}
			for (var verb in this.actions) {
				if (this.actions[verb] === name) {
					validActions[name] = verb;
					break;
				}
			}
			return (validActions[name] !== undefined) ? validActions[name] : null;
		},


		isValid : function(api){
			var invalid = [];
			var crud = this.actions;
			for (var action in api) {
				if (!(action in crud)) {
					invalid.push(action);
				}
			}
			return (!invalid.length) ? true : invalid;
		},


		hasUniqueUrl : function(proxy, verb) {
			var url = (proxy.api[verb]) ? proxy.api[verb].url : null;
			var unique = true;
			for (var action in proxy.api) {
				if ((unique = (action === verb) ? true : (proxy.api[action].url != url) ? true : false) === false) {
					break;
				}
			}
			return unique;
		},


		prepare : function(proxy) {
			if (!proxy.api) {
				proxy.api = {};
			}
			for (var verb in this.actions) {
				var action = this.actions[verb];
				proxy.api[action] = proxy.api[action] || proxy.url || proxy.directFn;
				if (typeof(proxy.api[action]) == 'string') {
					proxy.api[action] = {
						url: proxy.api[action],
						method: (proxy.restful === true) ? Ext.data.Api.restActions[action] : undefined
					};
				}
			}
		},


		restify : function(proxy) {
			proxy.restful = true;
			for (var verb in this.restActions) {
				proxy.api[this.actions[verb]].method = this.restActions[verb];
			}


			proxy.onWrite = proxy.onWrite.createInterceptor(function(action, o, response, rs) {
				var reader = o.reader;
				var res = new Ext.data.Response({
					action: action,
					raw: response
				});

				switch (response.status) {
					case 200:
						return true;
						break;
					case 201:
						res.success = true;
						break;
					case 204:
						res.success = true;
						res.data = null;
						break;
					default:
						return true;
						break;
				}
				if (res.success === true) {
					this.fireEvent("write", this, action, res.data, res, rs, o.request.arg);
				} else {
					this.fireEvent('exception', this, 'remote', action, o, res, rs);
				}
				o.request.callback.call(o.request.scope, res.data, res, res.success);

				return false;
			}, proxy);
		}
	};
})();


Ext.data.Response = function(params, response) {
	Ext.apply(this, params, {
		raw: response
	});
};
Ext.data.Response.prototype = {
	message : null,
	success : false,
	status : null,
	root : null,
	raw : null,

	getMessage : function() {
		return this.message;
	},
	getSuccess : function() {
		return this.success;
	},
	getStatus : function() {
		return this.status
	},
	getRoot : function() {
		return this.root;
	},
	getRawResponse : function() {
		return this.raw;
	}
};


Ext.data.Api.Error = Ext.extend(Ext.Error, {
	constructor : function(message, arg) {
		this.arg = arg;
		Ext.Error.call(this, message);
	},
	name: 'Ext.data.Api'
});
Ext.apply(Ext.data.Api.Error.prototype, {
	lang: {
		'action-url-undefined': 'No fallback url defined for this action.  When defining a DataProxy api, please be sure to define an url for each CRUD action in Ext.data.Api.actions or define a default url in addition to your api-configuration.',
		'invalid': 'received an invalid API-configuration.  Please ensure your proxy API-configuration contains only the actions defined in Ext.data.Api.actions',
		'invalid-url': 'Invalid url.  Please review your proxy configuration.',
		'execute': 'Attempted to execute an unknown action.  Valid API actions are defined in Ext.data.Api.actions"'
	}
});




Ext.data.SortTypes = {

	none : function(s){
		return s;
	},


	stripTagsRE : /<\/?[^>]+>/gi,


	asText : function(s){
		return String(s).replace(this.stripTagsRE, "");
	},


	asUCText : function(s){
		return String(s).toUpperCase().replace(this.stripTagsRE, "");
	},


	asUCString : function(s) {
		return String(s).toUpperCase();
	},


	asDate : function(s) {
		if(!s){
			return 0;
		}
		if(Ext.isDate(s)){
			return s.getTime();
		}
		return Date.parse(String(s));
	},


	asFloat : function(s) {
		var val = parseFloat(String(s).replace(/,/g, ""));
		return isNaN(val) ? 0 : val;
	},


	asInt : function(s) {
		var val = parseInt(String(s).replace(/,/g, ""), 10);
		return isNaN(val) ? 0 : val;
	}
};
Ext.data.Record = function(data, id){

	this.id = (id || id === 0) ? id : Ext.data.Record.id(this);
	this.data = data || {};
};


Ext.data.Record.create = function(o){
	var f = Ext.extend(Ext.data.Record, {});
	var p = f.prototype;
	p.fields = new Ext.util.MixedCollection(false, function(field){
		return field.name;
	});
	for(var i = 0, len = o.length; i < len; i++){
		p.fields.add(new Ext.data.Field(o[i]));
	}
	f.getField = function(name){
		return p.fields.get(name);
	};
	return f;
};

Ext.data.Record.PREFIX = 'ext-record';
Ext.data.Record.AUTO_ID = 1;
Ext.data.Record.EDIT = 'edit';
Ext.data.Record.REJECT = 'reject';
Ext.data.Record.COMMIT = 'commit';



Ext.data.Record.id = function(rec) {
	rec.phantom = true;
	return [Ext.data.Record.PREFIX, '-', Ext.data.Record.AUTO_ID++].join('');
};

Ext.data.Record.prototype = {






	dirty : false,
	editing : false,
	error : null,

	modified : null,

	phantom : false,


	join : function(store){

		this.store = store;
	},


	set : function(name, value){
		var encode = Ext.isPrimitive(value) ? String : Ext.encode;
		if(encode(this.data[name]) == encode(value)) {
			return;
		}
		this.dirty = true;
		if(!this.modified){
			this.modified = {};
		}
		if(this.modified[name] === undefined){
			this.modified[name] = this.data[name];
		}
		this.data[name] = value;
		if(!this.editing){
			this.afterEdit();
		}
	},


	afterEdit : function(){
		if(this.store){
			this.store.afterEdit(this);
		}
	},


	afterReject : function(){
		if(this.store){
			this.store.afterReject(this);
		}
	},


	afterCommit : function(){
		if(this.store){
			this.store.afterCommit(this);
		}
	},


	get : function(name){
		return this.data[name];
	},


	beginEdit : function(){
		this.editing = true;
		this.modified = this.modified || {};
	},


	cancelEdit : function(){
		this.editing = false;
		delete this.modified;
	},


	endEdit : function(){
		this.editing = false;
		if(this.dirty){
			this.afterEdit();
		}
	},


	reject : function(silent){
		var m = this.modified;
		for(var n in m){
			if(typeof m[n] != "function"){
				this.data[n] = m[n];
			}
		}
		this.dirty = false;
		delete this.modified;
		this.editing = false;
		if(silent !== true){
			this.afterReject();
		}
	},


	commit : function(silent){
		this.dirty = false;
		delete this.modified;
		this.editing = false;
		if(silent !== true){
			this.afterCommit();
		}
	},


	getChanges : function(){
		var m = this.modified, cs = {};
		for(var n in m){
			if(m.hasOwnProperty(n)){
				cs[n] = this.data[n];
			}
		}
		return cs;
	},


	hasError : function(){
		return this.error !== null;
	},


	clearError : function(){
		this.error = null;
	},


	copy : function(newId) {
		return new this.constructor(Ext.apply({}, this.data), newId || this.id);
	},


	isModified : function(fieldName){
		return !!(this.modified && this.modified.hasOwnProperty(fieldName));
	},


	isValid : function() {
		return this.fields.find(function(f) {
			return (f.allowBlank === false && Ext.isEmpty(this.data[f.name])) ? true : false;
		},this) ? false : true;
	},


	markDirty : function(){
		this.dirty = true;
		if(!this.modified){
			this.modified = {};
		}
		this.fields.each(function(f) {
			this.modified[f.name] = this.data[f.name];
		},this);
	}
};

Ext.StoreMgr = Ext.apply(new Ext.util.MixedCollection(), {



	register : function(){
		for(var i = 0, s; (s = arguments[i]); i++){
			this.add(s);
		}
	},


	unregister : function(){
		for(var i = 0, s; (s = arguments[i]); i++){
			this.remove(this.lookup(s));
		}
	},


	lookup : function(id){
		if(Ext.isArray(id)){
			var fields = ['field1'], expand = !Ext.isArray(id[0]);
			if(!expand){
				for(var i = 2, len = id[0].length; i <= len; ++i){
					fields.push('field' + i);
				}
			}
			return new Ext.data.ArrayStore({
				fields: fields,
				data: id,
				expandData: expand,
				autoDestroy: true,
				autoCreated: true

			});
		}
		return Ext.isObject(id) ? (id.events ? id : Ext.create(id, 'store')) : this.get(id);
	},


	getKey : function(o){
		return o.storeId;
	}
});
Ext.data.Store = Ext.extend(Ext.util.Observable, {







	writer : undefined,



	remoteSort : false,


	autoDestroy : false,


	pruneModifiedRecords : false,


	lastOptions : null,


	autoSave : true,


	batch : true,


	restful: false,


	paramNames : undefined,


	defaultParamNames : {
		start : 'start',
		limit : 'limit',
		sort : 'sort',
		dir : 'dir'
	},


	batchKey : '_ext_batch_',

	constructor : function(config){
		this.data = new Ext.util.MixedCollection(false);
		this.data.getKey = function(o){
			return o.id;
		};

		this.baseParams = {};


		this.removed = [];

		if(config && config.data){
			this.inlineData = config.data;
			delete config.data;
		}

		Ext.apply(this, config);

		this.paramNames = Ext.applyIf(this.paramNames || {}, this.defaultParamNames);

		if((this.url || this.api) && !this.proxy){
			this.proxy = new Ext.data.HttpProxy({url: this.url, api: this.api});
		}

		if (this.restful === true && this.proxy) {


			this.batch = false;
			Ext.data.Api.restify(this.proxy);
		}

		if(this.reader){
			if(!this.recordType){
				this.recordType = this.reader.recordType;
			}
			if(this.reader.onMetaChange){
				this.reader.onMetaChange = this.reader.onMetaChange.createSequence(this.onMetaChange, this);
			}
			if (this.writer) {
				if (this.writer instanceof(Ext.data.DataWriter) === false) {
					this.writer = this.buildWriter(this.writer);
				}
				this.writer.meta = this.reader.meta;
				this.pruneModifiedRecords = true;
			}
		}



		if(this.recordType){

			this.fields = this.recordType.prototype.fields;
		}
		this.modified = [];

		this.addEvents(

			'datachanged',

			'metachange',

			'add',

			'remove',

			'update',

			'clear',

			'exception',

			'beforeload',

			'load',

			'loadexception',

			'beforewrite',

			'write',

			'beforesave',

			'save'

		);

		if(this.proxy){

			this.relayEvents(this.proxy,  ['loadexception', 'exception']);
		}

		if (this.writer) {
			this.on({
				scope: this,
				add: this.createRecords,
				remove: this.destroyRecord,
				update: this.updateRecord,
				clear: this.onClear
			});
		}

		this.sortToggle = {};
		if(this.sortField){
			this.setDefaultSort(this.sortField, this.sortDir);
		}else if(this.sortInfo){
			this.setDefaultSort(this.sortInfo.field, this.sortInfo.direction);
		}

		Ext.data.Store.superclass.constructor.call(this);

		if(this.id){
			this.storeId = this.id;
			delete this.id;
		}
		if(this.storeId){
			Ext.StoreMgr.register(this);
		}
		if(this.inlineData){
			this.loadData(this.inlineData);
			delete this.inlineData;
		}else if(this.autoLoad){
			this.load.defer(10, this, [
				typeof this.autoLoad == 'object' ?
					this.autoLoad : undefined]);
		}

		this.batchCounter = 0;
		this.batches = {};
	},


	buildWriter : function(config) {
		var klass = undefined;
		type = (config.format || 'json').toLowerCase();
		switch (type) {
			case 'json':
				klass = Ext.data.JsonWriter;
				break;
			case 'xml':
				klass = Ext.data.XmlWriter;
				break;
			default:
				klass = Ext.data.JsonWriter;
		}
		return new klass(config);
	},


	destroy : function(){
		if(!this.isDestroyed){
			if(this.storeId){
				Ext.StoreMgr.unregister(this);
			}
			this.clearData();
			this.data = null;
			Ext.destroy(this.proxy);
			this.reader = this.writer = null;
			this.purgeListeners();
			this.isDestroyed = true;
		}
	},


	add : function(records){
		records = [].concat(records);
		if(records.length < 1){
			return;
		}
		for(var i = 0, len = records.length; i < len; i++){
			records[i].join(this);
		}
		var index = this.data.length;
		this.data.addAll(records);
		if(this.snapshot){
			this.snapshot.addAll(records);
		}
		this.fireEvent('add', this, records, index);
	},


	addSorted : function(record){
		var index = this.findInsertIndex(record);
		this.insert(index, record);
	},


	remove : function(record){
		if(Ext.isArray(record)){
			Ext.each(record, function(r){
				this.remove(r);
			}, this);
		}
		var index = this.data.indexOf(record);
		if(index > -1){
			record.join(null);
			this.data.removeAt(index);
		}
		if(this.pruneModifiedRecords){
			this.modified.remove(record);
		}
		if(this.snapshot){
			this.snapshot.remove(record);
		}
		if(index > -1){
			this.fireEvent('remove', this, record, index);
		}
	},


	removeAt : function(index){
		this.remove(this.getAt(index));
	},


	removeAll : function(silent){
		var items = [];
		this.each(function(rec){
			items.push(rec);
		});
		this.clearData();
		if(this.snapshot){
			this.snapshot.clear();
		}
		if(this.pruneModifiedRecords){
			this.modified = [];
		}
		if (silent !== true) {
			this.fireEvent('clear', this, items);
		}
	},


	onClear: function(store, records){
		Ext.each(records, function(rec, index){
			this.destroyRecord(this, rec, index);
		}, this);
	},


	insert : function(index, records){
		records = [].concat(records);
		for(var i = 0, len = records.length; i < len; i++){
			this.data.insert(index, records[i]);
			records[i].join(this);
		}
		if(this.snapshot){
			this.snapshot.addAll(records);
		}
		this.fireEvent('add', this, records, index);
	},


	indexOf : function(record){
		return this.data.indexOf(record);
	},


	indexOfId : function(id){
		return this.data.indexOfKey(id);
	},


	getById : function(id){
		return (this.snapshot || this.data).key(id);
	},


	getAt : function(index){
		return this.data.itemAt(index);
	},


	getRange : function(start, end){
		return this.data.getRange(start, end);
	},


	storeOptions : function(o){
		o = Ext.apply({}, o);
		delete o.callback;
		delete o.scope;
		this.lastOptions = o;
	},


	clearData: function(){
		this.data.each(function(rec) {
			rec.join(null);
		});
		this.data.clear();
	},


	load : function(options) {
		options = options || {};
		this.storeOptions(options);
		if(this.sortInfo && this.remoteSort){
			var pn = this.paramNames;
			options.params = options.params || {};
			options.params[pn.sort] = this.sortInfo.field;
			options.params[pn.dir] = this.sortInfo.direction;
		}
		try {
			return this.execute('read', null, options);
		} catch(e) {
			this.handleException(e);
			return false;
		}
	},


	updateRecord : function(store, record, action) {
		if (action == Ext.data.Record.EDIT && this.autoSave === true && (!record.phantom || (record.phantom && record.isValid()))) {
			this.save();
		}
	},


	createRecords : function(store, rs, index) {
		for (var i = 0, len = rs.length; i < len; i++) {
			if (rs[i].phantom && rs[i].isValid()) {
				rs[i].markDirty();
				this.modified.push(rs[i]);
			}
		}
		if (this.autoSave === true) {
			this.save();
		}
	},


	destroyRecord : function(store, record, index) {
		if (this.modified.indexOf(record) != -1) {
			this.modified.remove(record);
		}
		if (!record.phantom) {
			this.removed.push(record);




			record.lastIndex = index;

			if (this.autoSave === true) {
				this.save();
			}
		}
	},


	execute : function(action, rs, options,  batch) {

		if (!Ext.data.Api.isAction(action)) {
			throw new Ext.data.Api.Error('execute', action);
		}

		options = Ext.applyIf(options||{}, {
			params: {}
		});
		if(batch !== undefined){
			this.addToBatch(batch);
		}


		var doRequest = true;

		if (action === 'read') {
			Ext.applyIf(options.params, this.baseParams);
			doRequest = this.fireEvent('beforeload', this, options);
		}
		else {


			if (this.writer.listful === true && this.restful !== true) {
				rs = (Ext.isArray(rs)) ? rs : [rs];
			}

			else if (Ext.isArray(rs) && rs.length == 1) {
				rs = rs.shift();
			}

			if ((doRequest = this.fireEvent('beforewrite', this, action, rs, options)) !== false) {
				this.writer.apply(options.params, this.baseParams, action, rs);
			}
		}
		if (doRequest !== false) {

			if (this.writer && this.proxy.url && !this.proxy.restful && !Ext.data.Api.hasUniqueUrl(this.proxy, action)) {
				options.params.xaction = action;
			}





			this.proxy.request(Ext.data.Api.actions[action], rs, options.params, this.reader, this.createCallback(action, rs, batch), this, options);
		}
		return doRequest;
	},


	save : function() {
		if (!this.writer) {
			throw new Ext.data.Store.Error('writer-undefined');
		}

		var queue = [],
			len,
			trans,
			batch,
			data = {};

		if(this.removed.length){
			queue.push(['destroy', this.removed]);
		}


		var rs = [].concat(this.getModifiedRecords());
		if(rs.length){

			var phantoms = [];
			for(var i = rs.length-1; i >= 0; i--){
				if(rs[i].phantom === true){
					var rec = rs.splice(i, 1).shift();
					if(rec.isValid()){
						phantoms.push(rec);
					}
				}else if(!rs[i].isValid()){
					rs.splice(i,1);
				}
			}

			if(phantoms.length){
				queue.push(['create', phantoms]);
			}


			if(rs.length){
				queue.push(['update', rs]);
			}
		}
		len = queue.length;
		if(len){
			batch = ++this.batchCounter;
			for(var i = 0; i < len; ++i){
				trans = queue[i];
				data[trans[0]] = trans[1];
			}
			if(this.fireEvent('beforesave', this, data) !== false){
				for(var i = 0; i < len; ++i){
					trans = queue[i];
					this.doTransaction(trans[0], trans[1], batch);
				}
				return batch;
			}
		}
		return -1;
	},


	doTransaction : function(action, rs, batch) {
		function transaction(records) {
			try{
				this.execute(action, records, undefined, batch);
			}catch (e){
				this.handleException(e);
			}
		}
		if(this.batch === false){
			for(var i = 0, len = rs.length; i < len; i++){
				transaction.call(this, rs[i]);
			}
		}else{
			transaction.call(this, rs);
		}
	},


	addToBatch : function(batch){
		var b = this.batches,
			key = this.batchKey + batch,
			o = b[key];

		if(!o){
			b[key] = o = {
				id: batch,
				count: 0,
				data: {}
			}
		}
		++o.count;
	},

	removeFromBatch : function(batch, action, data){
		var b = this.batches,
			key = this.batchKey + batch,
			o = b[key],
			data,
			arr;


		if(o){
			arr = o.data[action] || [];
			o.data[action] = arr.concat(data);
			if(o.count === 1){
				data = o.data;
				delete b[key];
				this.fireEvent('save', this, batch, data);
			}else{
				--o.count;
			}
		}
	},



	createCallback : function(action, rs, batch) {
		var actions = Ext.data.Api.actions;
		return (action == 'read') ? this.loadRecords : function(data, response, success) {

			this['on' + Ext.util.Format.capitalize(action) + 'Records'](success, rs, [].concat(data));

			if (success === true) {
				this.fireEvent('write', this, action, data, response, rs);
			}
			this.removeFromBatch(batch, action, data);
		};
	},




	clearModified : function(rs) {
		if (Ext.isArray(rs)) {
			for (var n=rs.length-1;n>=0;n--) {
				this.modified.splice(this.modified.indexOf(rs[n]), 1);
			}
		} else {
			this.modified.splice(this.modified.indexOf(rs), 1);
		}
	},


	reMap : function(record) {
		if (Ext.isArray(record)) {
			for (var i = 0, len = record.length; i < len; i++) {
				this.reMap(record[i]);
			}
		} else {
			delete this.data.map[record._phid];
			this.data.map[record.id] = record;
			var index = this.data.keys.indexOf(record._phid);
			this.data.keys.splice(index, 1, record.id);
			delete record._phid;
		}
	},


	onCreateRecords : function(success, rs, data) {
		if (success === true) {
			try {
				this.reader.realize(rs, data);
				this.reMap(rs);
			}
			catch (e) {
				this.handleException(e);
				if (Ext.isArray(rs)) {

					this.onCreateRecords(success, rs, data);
				}
			}
		}
	},


	onUpdateRecords : function(success, rs, data) {
		if (success === true) {
			try {
				this.reader.update(rs, data);
			} catch (e) {
				this.handleException(e);
				if (Ext.isArray(rs)) {

					this.onUpdateRecords(success, rs, data);
				}
			}
		}
	},


	onDestroyRecords : function(success, rs, data) {

		rs = (rs instanceof Ext.data.Record) ? [rs] : [].concat(rs);
		for (var i=0,len=rs.length;i<len;i++) {
			this.removed.splice(this.removed.indexOf(rs[i]), 1);
		}
		if (success === false) {


			for (i=rs.length-1;i>=0;i--) {
				this.insert(rs[i].lastIndex, rs[i]);
			}
		}
	},


	handleException : function(e) {

		Ext.handleError(e);
	},


	reload : function(options){
		this.load(Ext.applyIf(options||{}, this.lastOptions));
	},



	loadRecords : function(o, options, success){
		if (this.isDestroyed === true) {
			return;
		}
		if(!o || success === false){
			if(success !== false){
				this.fireEvent('load', this, [], options);
			}
			if(options.callback){
				options.callback.call(options.scope || this, [], options, false, o);
			}
			return;
		}
		var r = o.records, t = o.totalRecords || r.length;
		if(!options || options.add !== true){
			if(this.pruneModifiedRecords){
				this.modified = [];
			}
			for(var i = 0, len = r.length; i < len; i++){
				r[i].join(this);
			}
			if(this.snapshot){
				this.data = this.snapshot;
				delete this.snapshot;
			}
			this.clearData();
			this.data.addAll(r);
			this.totalLength = t;
			this.applySort();
			this.fireEvent('datachanged', this);
		}else{
			this.totalLength = Math.max(t, this.data.length+r.length);
			this.add(r);
		}
		this.fireEvent('load', this, r, options);
		if(options.callback){
			options.callback.call(options.scope || this, r, options, true);
		}
	},


	loadData : function(o, append){
		var r = this.reader.readRecords(o);
		this.loadRecords(r, {add: append}, true);
	},


	getCount : function(){
		return this.data.length || 0;
	},


	getTotalCount : function(){
		return this.totalLength || 0;
	},


	getSortState : function(){
		return this.sortInfo;
	},


	applySort : function(){
		if(this.sortInfo && !this.remoteSort){
			var s = this.sortInfo, f = s.field;
			this.sortData(f, s.direction);
		}
	},


	sortData : function(f, direction){
		direction = direction || 'ASC';
		var st = this.fields.get(f).sortType;
		var fn = function(r1, r2){
			var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
			return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
		};
		this.data.sort(direction, fn);
		if(this.snapshot && this.snapshot != this.data){
			this.snapshot.sort(direction, fn);
		}
	},


	setDefaultSort : function(field, dir){
		dir = dir ? dir.toUpperCase() : 'ASC';
		this.sortInfo = {field: field, direction: dir};
		this.sortToggle[field] = dir;
	},


	sort : function(fieldName, dir){
		var f = this.fields.get(fieldName);
		if(!f){
			return false;
		}
		if(!dir){
			if(this.sortInfo && this.sortInfo.field == f.name){
				dir = (this.sortToggle[f.name] || 'ASC').toggle('ASC', 'DESC');
			}else{
				dir = f.sortDir;
			}
		}
		var st = (this.sortToggle) ? this.sortToggle[f.name] : null;
		var si = (this.sortInfo) ? this.sortInfo : null;

		this.sortToggle[f.name] = dir;
		this.sortInfo = {field: f.name, direction: dir};
		if(!this.remoteSort){
			this.applySort();
			this.fireEvent('datachanged', this);
		}else{
			if (!this.load(this.lastOptions)) {
				if (st) {
					this.sortToggle[f.name] = st;
				}
				if (si) {
					this.sortInfo = si;
				}
			}
		}
	},


	each : function(fn, scope){
		this.data.each(fn, scope);
	},


	getModifiedRecords : function(){
		return this.modified;
	},


	createFilterFn : function(property, value, anyMatch, caseSensitive){
		if(Ext.isEmpty(value, false)){
			return false;
		}
		value = this.data.createValueMatcher(value, anyMatch, caseSensitive);
		return function(r){
			return value.test(r.data[property]);
		};
	},


	sum : function(property, start, end){
		var rs = this.data.items, v = 0;
		start = start || 0;
		end = (end || end === 0) ? end : rs.length-1;

		for(var i = start; i <= end; i++){
			v += (rs[i].data[property] || 0);
		}
		return v;
	},


	filter : function(property, value, anyMatch, caseSensitive){
		var fn = this.createFilterFn(property, value, anyMatch, caseSensitive);
		return fn ? this.filterBy(fn) : this.clearFilter();
	},


	filterBy : function(fn, scope){
		this.snapshot = this.snapshot || this.data;
		this.data = this.queryBy(fn, scope||this);
		this.fireEvent('datachanged', this);
	},


	query : function(property, value, anyMatch, caseSensitive){
		var fn = this.createFilterFn(property, value, anyMatch, caseSensitive);
		return fn ? this.queryBy(fn) : this.data.clone();
	},


	queryBy : function(fn, scope){
		var data = this.snapshot || this.data;
		return data.filterBy(fn, scope||this);
	},


	find : function(property, value, start, anyMatch, caseSensitive){
		var fn = this.createFilterFn(property, value, anyMatch, caseSensitive);
		return fn ? this.data.findIndexBy(fn, null, start) : -1;
	},


	findExact: function(property, value, start){
		return this.data.findIndexBy(function(rec){
			return rec.get(property) === value;
		}, this, start);
	},


	findBy : function(fn, scope, start){
		return this.data.findIndexBy(fn, scope, start);
	},


	collect : function(dataIndex, allowNull, bypassFilter){
		var d = (bypassFilter === true && this.snapshot) ?
			this.snapshot.items : this.data.items;
		var v, sv, r = [], l = {};
		for(var i = 0, len = d.length; i < len; i++){
			v = d[i].data[dataIndex];
			sv = String(v);
			if((allowNull || !Ext.isEmpty(v)) && !l[sv]){
				l[sv] = true;
				r[r.length] = v;
			}
		}
		return r;
	},


	clearFilter : function(suppressEvent){
		if(this.isFiltered()){
			this.data = this.snapshot;
			delete this.snapshot;
			if(suppressEvent !== true){
				this.fireEvent('datachanged', this);
			}
		}
	},


	isFiltered : function(){
		return this.snapshot && this.snapshot != this.data;
	},


	afterEdit : function(record){
		if(this.modified.indexOf(record) == -1){
			this.modified.push(record);
		}
		this.fireEvent('update', this, record, Ext.data.Record.EDIT);
	},


	afterReject : function(record){
		this.modified.remove(record);
		this.fireEvent('update', this, record, Ext.data.Record.REJECT);
	},


	afterCommit : function(record){
		this.modified.remove(record);
		this.fireEvent('update', this, record, Ext.data.Record.COMMIT);
	},


	commitChanges : function(){
		var m = this.modified.slice(0);
		this.modified = [];
		for(var i = 0, len = m.length; i < len; i++){
			m[i].commit();
		}
	},


	rejectChanges : function(){
		var m = this.modified.slice(0);
		this.modified = [];
		for(var i = 0, len = m.length; i < len; i++){
			m[i].reject();
		}
		var m = this.removed.slice(0).reverse();
		this.removed = [];
		for(var i = 0, len = m.length; i < len; i++){
			this.insert(m[i].lastIndex||0, m[i]);
			m[i].reject();
		}
	},


	onMetaChange : function(meta){
		this.recordType = this.reader.recordType;
		this.fields = this.recordType.prototype.fields;
		delete this.snapshot;
		if(this.reader.meta.sortInfo){
			this.sortInfo = this.reader.meta.sortInfo;
		}else if(this.sortInfo  && !this.fields.get(this.sortInfo.field)){
			delete this.sortInfo;
		}
		if(this.writer){
			this.writer.meta = this.reader.meta;
		}
		this.modified = [];
		this.fireEvent('metachange', this, this.reader.meta);
	},


	findInsertIndex : function(record){
		this.suspendEvents();
		var data = this.data.clone();
		this.data.add(record);
		this.applySort();
		var index = this.data.indexOf(record);
		this.data = data;
		this.resumeEvents();
		return index;
	},


	setBaseParam : function (name, value){
		this.baseParams = this.baseParams || {};
		this.baseParams[name] = value;
	}
});

Ext.reg('store', Ext.data.Store);


Ext.data.Store.Error = Ext.extend(Ext.Error, {
	name: 'Ext.data.Store'
});
Ext.apply(Ext.data.Store.Error.prototype, {
	lang: {
		'writer-undefined' : 'Attempted to execute a write-action without a DataWriter installed.'
	}
});

Ext.data.Field = function(config){
	if(typeof config == "string"){
		config = {name: config};
	}
	Ext.apply(this, config);

	if(!this.type){
		this.type = "auto";
	}

	var st = Ext.data.SortTypes;

	if(typeof this.sortType == "string"){
		this.sortType = st[this.sortType];
	}


	if(!this.sortType){
		switch(this.type){
			case "string":
				this.sortType = st.asUCString;
				break;
			case "date":
				this.sortType = st.asDate;
				break;
			default:
				this.sortType = st.none;
		}
	}


	var stripRe = /[\$,%]/g;



	if(!this.convert){
		var cv, dateFormat = this.dateFormat;
		switch(this.type){
			case "":
			case "auto":
			case undefined:
				cv = function(v){ return v; };
				break;
			case "string":
				cv = function(v){ return (v === undefined || v === null) ? '' : String(v); };
				break;
			case "int":
				cv = function(v){
					return v !== undefined && v !== null && v !== '' ?
						parseInt(String(v).replace(stripRe, ""), 10) : '';
				};
				break;
			case "float":
				cv = function(v){
					return v !== undefined && v !== null && v !== '' ?
						parseFloat(String(v).replace(stripRe, ""), 10) : '';
				};
				break;
			case "bool":
				cv = function(v){ return v === true || v === "true" || v == 1; };
				break;
			case "date":
				cv = function(v){
					if(!v){
						return '';
					}
					if(Ext.isDate(v)){
						return v;
					}
					if(dateFormat){
						if(dateFormat == "timestamp"){
							return new Date(v*1000);
						}
						if(dateFormat == "time"){
							return new Date(parseInt(v, 10));
						}
						return Date.parseDate(v, dateFormat);
					}
					var parsed = Date.parse(v);
					return parsed ? new Date(parsed) : null;
				};
				break;
			default:
				cv = function(v){ return v; };
				break;

		}
		this.convert = cv;
	}
};

Ext.data.Field.prototype = {




	dateFormat: null,

	defaultValue: "",

	mapping: null,

	sortType : null,

	sortDir : "ASC",

	allowBlank : true
};
Ext.data.DataReader = function(meta, recordType){

	this.meta = meta;

	this.recordType = Ext.isArray(recordType) ?
		Ext.data.Record.create(recordType) : recordType;


	if (this.recordType){
		this.buildExtractors();
	}
};

Ext.data.DataReader.prototype = {


	getTotal: Ext.emptyFn,

	getRoot: Ext.emptyFn,

	getMessage: Ext.emptyFn,

	getSuccess: Ext.emptyFn,

	getId: Ext.emptyFn,

	buildExtractors : Ext.emptyFn,

	extractData : Ext.emptyFn,

	extractValues : Ext.emptyFn,


	realize: function(rs, data){
		if (Ext.isArray(rs)) {
			for (var i = rs.length - 1; i >= 0; i--) {

				if (Ext.isArray(data)) {
					this.realize(rs.splice(i,1).shift(), data.splice(i,1).shift());
				}
				else {


					this.realize(rs.splice(i,1).shift(), data);
				}
			}
		}
		else {

			if (Ext.isArray(data) && data.length == 1) {
				data = data.shift();
			}
			if (!this.isData(data)) {


				throw new Ext.data.DataReader.Error('realize', rs);
			}
			rs.phantom = false;
			rs._phid = rs.id;
			rs.id = this.getId(data);

			rs.fields.each(function(f) {
				if (data[f.name] !== f.defaultValue) {
					rs.data[f.name] = data[f.name];
				}
			});
			rs.commit();
		}
	},


	update : function(rs, data) {
		if (Ext.isArray(rs)) {
			for (var i=rs.length-1; i >= 0; i--) {
				if (Ext.isArray(data)) {
					this.update(rs.splice(i,1).shift(), data.splice(i,1).shift());
				}
				else {


					this.update(rs.splice(i,1).shift(), data);
				}
			}
		}
		else {

			if (Ext.isArray(data) && data.length == 1) {
				data = data.shift();
			}
			if (this.isData(data)) {
				rs.fields.each(function(f) {
					if (data[f.name] !== f.defaultValue) {
						rs.data[f.name] = data[f.name];
					}
				});
			}
			rs.commit();
		}
	},


	extractData : function(root, returnRecords) {

		var rawName = (this instanceof Ext.data.JsonReader) ? 'json' : 'node';

		var rs = [];



		if (this.isData(root) && !(this instanceof Ext.data.XmlReader)) {
			root = [root];
		}
		var f       = this.recordType.prototype.fields,
			fi      = f.items,
			fl      = f.length,
			rs      = [];
		if (returnRecords === true) {
			var Record = this.recordType;
			for (var i = 0; i < root.length; i++) {
				var n = root[i];
				var record = new Record(this.extractValues(n, fi, fl), this.getId(n));
				record[rawName] = n;
				rs.push(record);
			}
		}
		else {
			for (var i = 0; i < root.length; i++) {
				var data = this.extractValues(root[i], fi, fl);
				data[this.meta.idProperty] = this.getId(root[i]);
				rs.push(data);
			}
		}
		return rs;
	},


	isData : function(data) {
		return (data && Ext.isObject(data) && !Ext.isEmpty(this.getId(data))) ? true : false;
	},


	onMetaChange : function(meta){
		delete this.ef;
		this.meta = meta;
		this.recordType = Ext.data.Record.create(meta.fields);
		this.buildExtractors();
	}
};


Ext.data.DataReader.Error = Ext.extend(Ext.Error, {
	constructor : function(message, arg) {
		this.arg = arg;
		Ext.Error.call(this, message);
	},
	name: 'Ext.data.DataReader'
});
Ext.apply(Ext.data.DataReader.Error.prototype, {
	lang : {
		'update': "#update received invalid data from server.  Please see docs for DataReader#update and review your DataReader configuration.",
		'realize': "#realize was called with invalid remote-data.  Please see the docs for DataReader#realize and review your DataReader configuration.",
		'invalid-response': "#readResponse received an invalid response from the server."
	}
});

Ext.data.DataWriter = function(config){
	Ext.apply(this, config);
};
Ext.data.DataWriter.prototype = {


	writeAllFields : false,

	listful : false,


	apply : function(params, baseParams, action, rs) {
		var data    = [],
			renderer    = action + 'Record';

		if (Ext.isArray(rs)) {
			Ext.each(rs, function(rec){
				data.push(this[renderer](rec));
			}, this);
		}
		else if (rs instanceof Ext.data.Record) {
			data = this[renderer](rs);
		}
		this.render(params, baseParams, data);
	},


	render : Ext.emptyFn,


	updateRecord : Ext.emptyFn,


	createRecord : Ext.emptyFn,


	destroyRecord : Ext.emptyFn,


	toHash : function(rec, config) {
		var map = rec.fields.map,
			data = {},
			raw = (this.writeAllFields === false && rec.phantom === false) ? rec.getChanges() : rec.data,
			m;
		Ext.iterate(raw, function(prop, value){
			if((m = map[prop])){
				data[m.mapping ? m.mapping : m.name] = value;
			}
		});



		if (rec.phantom) {
			if (rec.fields.containsKey(this.meta.idProperty) && Ext.isEmpty(rec.data[this.meta.idProperty])) {
				delete data[this.meta.idProperty];
			}
		} else {
			data[this.meta.idProperty] = rec.id
		}
		return data;
	},


	toArray : function(data) {
		var fields = [];
		Ext.iterate(data, function(k, v) {fields.push({name: k, value: v});},this);
		return fields;
	}
};
Ext.data.DataProxy = function(conn){


	conn = conn || {};





	this.api     = conn.api;
	this.url     = conn.url;
	this.restful = conn.restful;
	this.listeners = conn.listeners;


	this.prettyUrls = conn.prettyUrls;



	this.addEvents(

		'exception',

		'beforeload',

		'load',

		'loadexception',

		'beforewrite',

		'write'
	);
	Ext.data.DataProxy.superclass.constructor.call(this);


	try {
		Ext.data.Api.prepare(this);
	} catch (e) {
		if (e instanceof Ext.data.Api.Error) {
			e.toConsole();
		}
	}

	Ext.data.DataProxy.relayEvents(this, ['beforewrite', 'write', 'exception']);
};

Ext.extend(Ext.data.DataProxy, Ext.util.Observable, {

	restful: false,


	setApi : function() {
		if (arguments.length == 1) {
			var valid = Ext.data.Api.isValid(arguments[0]);
			if (valid === true) {
				this.api = arguments[0];
			}
			else {
				throw new Ext.data.Api.Error('invalid', valid);
			}
		}
		else if (arguments.length == 2) {
			if (!Ext.data.Api.isAction(arguments[0])) {
				throw new Ext.data.Api.Error('invalid', arguments[0]);
			}
			this.api[arguments[0]] = arguments[1];
		}
		Ext.data.Api.prepare(this);
	},


	isApiAction : function(action) {
		return (this.api[action]) ? true : false;
	},


	request : function(action, rs, params, reader, callback, scope, options) {
		if (!this.api[action] && !this.load) {
			throw new Ext.data.DataProxy.Error('action-undefined', action);
		}
		params = params || {};
		if ((action === Ext.data.Api.actions.read) ? this.fireEvent("beforeload", this, params) : this.fireEvent("beforewrite", this, action, rs, params) !== false) {
			this.doRequest.apply(this, arguments);
		}
		else {
			callback.call(scope || this, null, options, false);
		}
	},



	load : null,


	doRequest : function(action, rs, params, reader, callback, scope, options) {



		this.load(params, reader, callback, scope, options);
	},


	onRead : Ext.emptyFn,

	onWrite : Ext.emptyFn,

	buildUrl : function(action, record) {
		record = record || null;




		var url = (this.conn && this.conn.url) ? this.conn.url : (this.api[action]) ? this.api[action].url : this.url;
		if (!url) {
			throw new Ext.data.Api.Error('invalid-url', action);
		}







		var provides = null;
		var m = url.match(/(.*)(\.json|\.xml|\.html)$/);
		if (m) {
			provides = m[2];
			url      = m[1];
		}

		if ((this.restful === true || this.prettyUrls === true) && record instanceof Ext.data.Record && !record.phantom) {
			url += '/' + record.id;
		}
		return (provides === null) ? url : url + provides;
	},


	destroy: function(){
		this.purgeListeners();
	}
});



Ext.apply(Ext.data.DataProxy, Ext.util.Observable.prototype);
Ext.util.Observable.call(Ext.data.DataProxy);


Ext.data.DataProxy.Error = Ext.extend(Ext.Error, {
	constructor : function(message, arg) {
		this.arg = arg;
		Ext.Error.call(this, message);
	},
	name: 'Ext.data.DataProxy'
});
Ext.apply(Ext.data.DataProxy.Error.prototype, {
	lang: {
		'action-undefined': "DataProxy attempted to execute an API-action but found an undefined url / function.  Please review your Proxy url/api-configuration.",
		'api-invalid': 'Recieved an invalid API-configuration.  Please ensure your proxy API-configuration contains only the actions from Ext.data.Api.actions.'
	}
});



Ext.data.Request = function(params) {
	Ext.apply(this, params);
};
Ext.data.Request.prototype = {

	action : undefined,

	rs : undefined,

	params: undefined,

	callback : Ext.emptyFn,

	scope : undefined,

	reader : undefined
};

Ext.data.Response = function(params) {
	Ext.apply(this, params);
};
Ext.data.Response.prototype = {

	action: undefined,

	success : undefined,

	message : undefined,

	data: undefined,

	raw: undefined,

	records: undefined
};

Ext.data.ScriptTagProxy = function(config){
	Ext.apply(this, config);

	Ext.data.ScriptTagProxy.superclass.constructor.call(this, config);

	this.head = document.getElementsByTagName("head")[0];


};

Ext.data.ScriptTagProxy.TRANS_ID = 1000;

Ext.extend(Ext.data.ScriptTagProxy, Ext.data.DataProxy, {


	timeout : 30000,

	callbackParam : "callback",

	nocache : true,


	doRequest : function(action, rs, params, reader, callback, scope, arg) {
		var p = Ext.urlEncode(Ext.apply(params, this.extraParams));

		var url = this.buildUrl(action, rs);
		if (!url) {
			throw new Ext.data.Api.Error('invalid-url', url);
		}
		url = Ext.urlAppend(url, p);

		if(this.nocache){
			url = Ext.urlAppend(url, '_dc=' + (new Date().getTime()));
		}
		var transId = ++Ext.data.ScriptTagProxy.TRANS_ID;
		var trans = {
			id : transId,
			action: action,
			cb : "stcCallback"+transId,
			scriptId : "stcScript"+transId,
			params : params,
			arg : arg,
			url : url,
			callback : callback,
			scope : scope,
			reader : reader
		};
		window[trans.cb] = this.createCallback(action, rs, trans);
		url += String.format("&{0}={1}", this.callbackParam, trans.cb);
		if(this.autoAbort !== false){
			this.abort();
		}

		trans.timeoutId = this.handleFailure.defer(this.timeout, this, [trans]);

		var script = document.createElement("script");
		script.setAttribute("src", url);
		script.setAttribute("type", "text/javascript");
		script.setAttribute("id", trans.scriptId);
		this.head.appendChild(script);

		this.trans = trans;
	},


	createCallback : function(action, rs, trans) {
		var self = this;
		return function(res) {
			self.trans = false;
			self.destroyTrans(trans, true);
			if (action === Ext.data.Api.actions.read) {
				self.onRead.call(self, action, trans, res);
			} else {
				self.onWrite.call(self, action, trans, res, rs);
			}
		};
	},

	onRead : function(action, trans, res) {
		var result;
		try {
			result = trans.reader.readRecords(res);
		}catch(e){

			this.fireEvent("loadexception", this, trans, res, e);

			this.fireEvent('exception', this, 'response', action, trans, res, e);
			trans.callback.call(trans.scope||window, null, trans.arg, false);
			return;
		}
		if (result.success === false) {

			this.fireEvent('loadexception', this, trans, res);

			this.fireEvent('exception', this, 'remote', action, trans, res, null);
		} else {
			this.fireEvent("load", this, res, trans.arg);
		}
		trans.callback.call(trans.scope||window, result, trans.arg, result.success);
	},

	onWrite : function(action, trans, response, rs) {
		var reader = trans.reader;
		try {

			var res = reader.readResponse(action, response);
		} catch (e) {
			this.fireEvent('exception', this, 'response', action, trans, res, e);
			trans.callback.call(trans.scope||window, null, res, false);
			return;
		}
		if(!res.success === true){
			this.fireEvent('exception', this, 'remote', action, trans, res, rs);
			trans.callback.call(trans.scope||window, null, res, false);
			return;
		}
		this.fireEvent("write", this, action, res.data, res, rs, trans.arg );
		trans.callback.call(trans.scope||window, res.data, res, true);
	},


	isLoading : function(){
		return this.trans ? true : false;
	},


	abort : function(){
		if(this.isLoading()){
			this.destroyTrans(this.trans);
		}
	},


	destroyTrans : function(trans, isLoaded){
		this.head.removeChild(document.getElementById(trans.scriptId));
		clearTimeout(trans.timeoutId);
		if(isLoaded){
			window[trans.cb] = undefined;
			try{
				delete window[trans.cb];
			}catch(e){}
		}else{

			window[trans.cb] = function(){
				window[trans.cb] = undefined;
				try{
					delete window[trans.cb];
				}catch(e){}
			};
		}
	},


	handleFailure : function(trans){
		this.trans = false;
		this.destroyTrans(trans, false);
		if (trans.action === Ext.data.Api.actions.read) {

			this.fireEvent("loadexception", this, null, trans.arg);
		}

		this.fireEvent('exception', this, 'response', trans.action, {
			response: null,
			options: trans.arg
		});
		trans.callback.call(trans.scope||window, null, trans.arg, false);
	},


	destroy: function(){
		this.abort();
		Ext.data.ScriptTagProxy.superclass.destroy.call(this);
	}
});
Ext.data.HttpProxy = function(conn){
	Ext.data.HttpProxy.superclass.constructor.call(this, conn);


	this.conn = conn;





	this.conn.url = null;

	this.useAjax = !conn || !conn.events;


	var actions = Ext.data.Api.actions;
	this.activeRequest = {};
	for (var verb in actions) {
		this.activeRequest[actions[verb]] = undefined;
	}
};

Ext.extend(Ext.data.HttpProxy, Ext.data.DataProxy, {

	getConnection : function() {
		return this.useAjax ? Ext.Ajax : this.conn;
	},


	setUrl : function(url, makePermanent) {
		this.conn.url = url;
		if (makePermanent === true) {
			this.url = url;
			this.api = null;
			Ext.data.Api.prepare(this);
		}
	},


	doRequest : function(action, rs, params, reader, cb, scope, arg) {
		var  o = {
			method: (this.api[action]) ? this.api[action]['method'] : undefined,
			request: {
				callback : cb,
				scope : scope,
				arg : arg
			},
			reader: reader,
			callback : this.createCallback(action, rs),
			scope: this
		};



		if (params.jsonData) {
			o.jsonData = params.jsonData;
		} else if (params.xmlData) {
			o.xmlData = params.xmlData;
		} else {
			o.params = params || {};
		}



		this.conn.url = this.buildUrl(action, rs);

		if(this.useAjax){

			Ext.applyIf(o, this.conn);


			if (this.activeRequest[action]) {





			}
			this.activeRequest[action] = Ext.Ajax.request(o);
		}else{
			this.conn.request(o);
		}

		this.conn.url = null;
	},


	createCallback : function(action, rs) {
		return function(o, success, response) {
			this.activeRequest[action] = undefined;
			if (!success) {
				if (action === Ext.data.Api.actions.read) {


					this.fireEvent('loadexception', this, o, response);
				}
				this.fireEvent('exception', this, 'response', action, o, response);
				o.request.callback.call(o.request.scope, null, o.request.arg, false);
				return;
			}
			if (action === Ext.data.Api.actions.read) {
				this.onRead(action, o, response);
			} else {
				this.onWrite(action, o, response, rs);
			}
		}
	},


	onRead : function(action, o, response) {
		var result;
		try {
			result = o.reader.read(response);
		}catch(e){


			this.fireEvent('loadexception', this, o, response, e);

			this.fireEvent('exception', this, 'response', action, o, response, e);
			o.request.callback.call(o.request.scope, null, o.request.arg, false);
			return;
		}
		if (result.success === false) {


			this.fireEvent('loadexception', this, o, response);


			var res = o.reader.readResponse(action, response);
			this.fireEvent('exception', this, 'remote', action, o, res, null);
		}
		else {
			this.fireEvent('load', this, o, o.request.arg);
		}



		o.request.callback.call(o.request.scope, result, o.request.arg, result.success);
	},

	onWrite : function(action, o, response, rs) {
		var reader = o.reader;
		var res;
		try {
			res = reader.readResponse(action, response);
		} catch (e) {
			this.fireEvent('exception', this, 'response', action, o, response, e);
			o.request.callback.call(o.request.scope, null, o.request.arg, false);
			return;
		}
		if (res.success === false) {
			this.fireEvent('exception', this, 'remote', action, o, res, rs);
		} else {
			this.fireEvent('write', this, action, res.data, res, rs, o.request.arg);
		}



		o.request.callback.call(o.request.scope, res.data, res, res.success);
	},


	destroy: function(){
		if(!this.useAjax){
			this.conn.abort();
		}else if(this.activeRequest){
			var actions = Ext.data.Api.actions;
			for (var verb in actions) {
				if(this.activeRequest[actions[verb]]){
					Ext.Ajax.abort(this.activeRequest[actions[verb]]);
				}
			}
		}
		Ext.data.HttpProxy.superclass.destroy.call(this);
	}
});
Ext.data.MemoryProxy = function(data){

	var api = {};
	api[Ext.data.Api.actions.read] = true;
	Ext.data.MemoryProxy.superclass.constructor.call(this, {
		api: api
	});
	this.data = data;
};

Ext.extend(Ext.data.MemoryProxy, Ext.data.DataProxy, {



	doRequest : function(action, rs, params, reader, callback, scope, arg) {

		params = params || {};
		var result;
		try {
			result = reader.readRecords(this.data);
		}catch(e){

			this.fireEvent("loadexception", this, null, arg, e);

			this.fireEvent('exception', this, 'response', action, arg, null, e);
			callback.call(scope, null, arg, false);
			return;
		}
		callback.call(scope, result, arg, true);
	}
});
Ext.data.JsonWriter = function(config) {
	Ext.data.JsonWriter.superclass.constructor.call(this, config);



	if (this.returnJson != undefined) {
		this.encode = this.returnJson;
	}
}
Ext.extend(Ext.data.JsonWriter, Ext.data.DataWriter, {

	returnJson : undefined,

	encode : true,


	render : function(params, baseParams, data) {
		if (this.encode === true) {

			Ext.apply(params, baseParams);
			params[this.meta.root] = Ext.encode(data);
		} else {

			var jdata = Ext.apply({}, baseParams);
			jdata[this.meta.root] = data;
			params.jsonData = jdata;
		}
	},

	createRecord : function(rec) {
		return this.toHash(rec);
	},

	updateRecord : function(rec) {
		return this.toHash(rec);

	},

	destroyRecord : function(rec) {
		return rec.id;
	}
});
Ext.data.JsonReader = function(meta, recordType){
	meta = meta || {};




	Ext.applyIf(meta, {
		idProperty: 'id',
		successProperty: 'success',
		totalProperty: 'total'
	});

	Ext.data.JsonReader.superclass.constructor.call(this, meta, recordType || meta.fields);
};
Ext.extend(Ext.data.JsonReader, Ext.data.DataReader, {


	read : function(response){
		var json = response.responseText;
		var o = Ext.decode(json);
		if(!o) {
			throw {message: 'JsonReader.read: Json object not found'};
		}
		return this.readRecords(o);
	},


	readResponse : function(action, response) {
		var o = (response.responseText !== undefined) ? Ext.decode(response.responseText) : response;
		if(!o) {
			throw new Ext.data.JsonReader.Error('response');
		}

		var root = this.getRoot(o);
		if (action === Ext.data.Api.actions.create) {
			var def = Ext.isDefined(root);
			if (def && Ext.isEmpty(root)) {
				throw new Ext.data.JsonReader.Error('root-empty', this.meta.root);
			}
			else if (!def) {
				throw new Ext.data.JsonReader.Error('root-undefined-response', this.meta.root);
			}
		}


		var res = new Ext.data.Response({
			action: action,
			success: this.getSuccess(o),
			data: (root) ? this.extractData(root, false) : [],
			message: this.getMessage(o),
			raw: o
		});


		if (Ext.isEmpty(res.success)) {
			throw new Ext.data.JsonReader.Error('successProperty-response', this.meta.successProperty);
		}
		return res;
	},


	readRecords : function(o){

		this.jsonData = o;
		if(o.metaData){
			this.onMetaChange(o.metaData);
		}
		var s = this.meta, Record = this.recordType,
			f = Record.prototype.fields, fi = f.items, fl = f.length, v;

		var root = this.getRoot(o), c = root.length, totalRecords = c, success = true;
		if(s.totalProperty){
			v = parseInt(this.getTotal(o), 10);
			if(!isNaN(v)){
				totalRecords = v;
			}
		}
		if(s.successProperty){
			v = this.getSuccess(o);
			if(v === false || v === 'false'){
				success = false;
			}
		}


		return {
			success : success,
			records : this.extractData(root, true),
			totalRecords : totalRecords
		};
	},


	buildExtractors : function() {
		if(this.ef){
			return;
		}
		var s = this.meta, Record = this.recordType,
			f = Record.prototype.fields, fi = f.items, fl = f.length;

		if(s.totalProperty) {
			this.getTotal = this.createAccessor(s.totalProperty);
		}
		if(s.successProperty) {
			this.getSuccess = this.createAccessor(s.successProperty);
		}
		if (s.messageProperty) {
			this.getMessage = this.createAccessor(s.messageProperty);
		}
		this.getRoot = s.root ? this.createAccessor(s.root) : function(p){return p;};
		if (s.id || s.idProperty) {
			var g = this.createAccessor(s.id || s.idProperty);
			this.getId = function(rec) {
				var r = g(rec);
				return (r === undefined || r === '') ? null : r;
			};
		} else {
			this.getId = function(){return null;};
		}
		var ef = [];
		for(var i = 0; i < fl; i++){
			f = fi[i];
			var map = (f.mapping !== undefined && f.mapping !== null) ? f.mapping : f.name;
			ef.push(this.createAccessor(map));
		}
		this.ef = ef;
	},


	simpleAccess : function(obj, subsc) {
		return obj[subsc];
	},


	createAccessor : function(){
		var re = /[\[\.]/;
		return function(expr) {
			try {
				return(re.test(expr)) ?
					new Function('obj', 'return obj.' + expr) :
					function(obj){
						return obj[expr];
					};
			} catch(e){}
			return Ext.emptyFn;
		};
	}(),


	extractValues : function(data, items, len) {
		var f, values = {};
		for(var j = 0; j < len; j++){
			f = items[j];
			var v = this.ef[j](data);
			values[f.name] = f.convert((v !== undefined) ? v : f.defaultValue, data);
		}
		return values;
	}
});


Ext.data.JsonReader.Error = Ext.extend(Ext.Error, {
	constructor : function(message, arg) {
		this.arg = arg;
		Ext.Error.call(this, message);
	},
	name : 'Ext.data.JsonReader'
});
Ext.apply(Ext.data.JsonReader.Error.prototype, {
	lang: {
		'response': 'An error occurred while json-decoding your server response',
		'successProperty-response': 'Could not locate your "successProperty" in your server response.  Please review your JsonReader config to ensure the config-property "successProperty" matches the property in your server-response.  See the JsonReader docs.',
		'root-undefined-config': 'Your JsonReader was configured without a "root" property.  Please review your JsonReader config and make sure to define the root property.  See the JsonReader docs.',
		'idProperty-undefined' : 'Your JsonReader was configured without an "idProperty"  Please review your JsonReader configuration and ensure the "idProperty" is set (e.g.: "id").  See the JsonReader docs.',
		'root-empty': 'Data was expected to be returned by the server in the "root" property of the response.  Please review your JsonReader configuration to ensure the "root" property matches that returned in the server-response.  See JsonReader docs.'
	}
});

Ext.data.ArrayReader = Ext.extend(Ext.data.JsonReader, {




	readRecords : function(o){
		this.arrayData = o;
		var s = this.meta,
			sid = s ? Ext.num(s.idIndex, s.id) : null,
			recordType = this.recordType,
			fields = recordType.prototype.fields,
			records = [],
			v;

		var root = this.getRoot(o);

		for(var i = 0, len = root.length; i < len; i++) {
			var n = root[i],
				values = {},
				id = ((sid || sid === 0) && n[sid] !== undefined && n[sid] !== "" ? n[sid] : null);
			for(var j = 0, jlen = fields.length; j < jlen; j++) {
				var f = fields.items[j],
					k = f.mapping !== undefined && f.mapping !== null ? f.mapping : j;
				v = n[k] !== undefined ? n[k] : f.defaultValue;
				v = f.convert(v, n);
				values[f.name] = v;
			}
			var record = new recordType(values, id);
			record.json = n;
			records[records.length] = record;
		}

		var totalRecords = records.length;

		if(s.totalProperty) {
			v = parseInt(this.getTotal(o), 10);
			if(!isNaN(v)) {
				totalRecords = v;
			}
		}

		return {
			records : records,
			totalRecords : totalRecords
		};
	}
});
Ext.data.ArrayStore = Ext.extend(Ext.data.Store, {

	constructor: function(config){
		Ext.data.ArrayStore.superclass.constructor.call(this, Ext.apply(config, {
			reader: new Ext.data.ArrayReader(config)
		}));
	},

	loadData : function(data, append){
		if(this.expandData === true){
			var r = [];
			for(var i = 0, len = data.length; i < len; i++){
				r[r.length] = [data[i]];
			}
			data = r;
		}
		Ext.data.ArrayStore.superclass.loadData.call(this, data, append);
	}
});
Ext.reg('arraystore', Ext.data.ArrayStore);


Ext.data.SimpleStore = Ext.data.ArrayStore;
Ext.reg('simplestore', Ext.data.SimpleStore);
Ext.data.JsonStore = Ext.extend(Ext.data.Store, {

	constructor: function(config){
		Ext.data.JsonStore.superclass.constructor.call(this, Ext.apply(config, {
			reader: new Ext.data.JsonReader(config)
		}));
	}
});
Ext.reg('jsonstore', Ext.data.JsonStore);
Ext.data.XmlWriter = function(params) {
	Ext.data.XmlWriter.superclass.constructor.apply(this, arguments);

	this.tpl = (typeof(this.tpl) === 'string') ? new Ext.XTemplate(this.tpl).compile() : this.tpl.compile();
};
Ext.extend(Ext.data.XmlWriter, Ext.data.DataWriter, {

	documentRoot: 'xrequest',

	forceDocumentRoot: false,

	root: 'records',

	xmlVersion : '1.0',

	xmlEncoding: 'ISO-8859-15',


	tpl: '<tpl for="."><' + '?xml version="{version}" encoding="{encoding}"?' + '><tpl if="documentRoot"><{documentRoot}><tpl for="baseParams"><tpl for="."><{name}>{value}</{name}</tpl></tpl></tpl><tpl if="records.length&gt;1"><{root}></tpl><tpl for="records"><{parent.record}><tpl for="."><{name}>{value}</{name}></tpl></{parent.record}></tpl><tpl if="records.length&gt;1"></{root}></tpl><tpl if="documentRoot"></{documentRoot}></tpl></tpl>',


	render : function(params, baseParams, data) {
		baseParams = this.toArray(baseParams);
		params.xmlData = this.tpl.applyTemplate({
			version: this.xmlVersion,
			encoding: this.xmlEncoding,
			documentRoot: (baseParams.length > 0 || this.forceDocumentRoot === true) ? this.documentRoot : false,
			record: this.meta.record,
			root: this.root,
			baseParams: baseParams,
			records: (Ext.isArray(data[0])) ? data : [data]
		});
	},


	createRecord : function(rec) {
		return this.toArray(this.toHash(rec));
	},


	updateRecord : function(rec) {
		return this.toArray(this.toHash(rec));

	},

	destroyRecord : function(rec) {
		var data = {};
		data[this.meta.idProperty] = rec.id;
		return this.toArray(data);
	}
});


Ext.data.XmlReader = function(meta, recordType){
	meta = meta || {};


	Ext.applyIf(meta, {
		idProperty: meta.idProperty || meta.idPath || meta.id,
		successProperty: meta.successProperty || meta.success
	});

	Ext.data.XmlReader.superclass.constructor.call(this, meta, recordType || meta.fields);
};
Ext.extend(Ext.data.XmlReader, Ext.data.DataReader, {

	read : function(response){
		var doc = response.responseXML;
		if(!doc) {
			throw {message: "XmlReader.read: XML Document not available"};
		}
		return this.readRecords(doc);
	},


	readRecords : function(doc){

		this.xmlData = doc;

		var root    = doc.documentElement || doc,
			q       = Ext.DomQuery,
			totalRecords = 0,
			success = true;

		if(this.meta.totalProperty){
			totalRecords = this.getTotal(root, 0);
		}
		if(this.meta.successProperty){
			success = this.getSuccess(root);
		}

		var records = this.extractData(q.select(this.meta.record, root), true);


		return {
			success : success,
			records : records,
			totalRecords : totalRecords || records.length
		};
	},


	readResponse : function(action, response) {
		var q   = Ext.DomQuery,
			doc     = response.responseXML;


		var res = new Ext.data.Response({
			action: action,
			success : this.getSuccess(doc),
			message: this.getMessage(doc),
			data: this.extractData(q.select(this.meta.record, doc) || q.select(this.meta.root, doc), false),
			raw: doc
		});

		if (Ext.isEmpty(res.success)) {
			throw new Ext.data.DataReader.Error('successProperty-response', this.meta.successProperty);
		}


		if (action === Ext.data.Api.actions.create) {
			var def = Ext.isDefined(res.data);
			if (def && Ext.isEmpty(res.data)) {
				throw new Ext.data.JsonReader.Error('root-empty', this.meta.root);
			}
			else if (!def) {
				throw new Ext.data.JsonReader.Error('root-undefined-response', this.meta.root);
			}
		}
		return res;
	},

	getSuccess : function() {
		return true;
	},


	buildExtractors : function() {
		if(this.ef){
			return;
		}
		var s       = this.meta,
			Record  = this.recordType,
			f       = Record.prototype.fields,
			fi      = f.items,
			fl      = f.length;

		if(s.totalProperty) {
			this.getTotal = this.createAccessor(s.totalProperty);
		}
		if(s.successProperty) {
			this.getSuccess = this.createAccessor(s.successProperty);
		}
		if (s.messageProperty) {
			this.getMessage = this.createAccessor(s.messageProperty);
		}
		this.getRoot = function(res) {
			return (!Ext.isEmpty(res[this.meta.record])) ? res[this.meta.record] : res[this.meta.root];
		}
		if (s.idPath || s.idProperty) {
			var g = this.createAccessor(s.idPath || s.idProperty);
			this.getId = function(rec) {
				var id = g(rec) || rec.id;
				return (id === undefined || id === '') ? null : id;
			};
		} else {
			this.getId = function(){return null;};
		}
		var ef = [];
		for(var i = 0; i < fl; i++){
			f = fi[i];
			var map = (f.mapping !== undefined && f.mapping !== null) ? f.mapping : f.name;
			ef.push(this.createAccessor(map));
		}
		this.ef = ef;
	},


	createAccessor : function(){
		var q = Ext.DomQuery;
		return function(key) {
			switch(key) {
				case this.meta.totalProperty:
					return function(root, def){
						return q.selectNumber(key, root, def);
					}
					break;
				case this.meta.successProperty:
					return function(root, def) {
						var sv = q.selectValue(key, root, true);
						var success = sv !== false && sv !== 'false';
						return success;
					}
					break;
				default:
					return function(root, def) {
						return q.selectValue(key, root, def);
					}
					break;
			}
		};
	}(),


	extractValues : function(data, items, len) {
		var f, values = {};
		for(var j = 0; j < len; j++){
			f = items[j];
			var v = this.ef[j](data);
			values[f.name] = f.convert((v !== undefined) ? v : f.defaultValue, data);
		}
		return values;
	}
});
Ext.data.XmlStore = Ext.extend(Ext.data.Store, {

	constructor: function(config){
		Ext.data.XmlStore.superclass.constructor.call(this, Ext.apply(config, {
			reader: new Ext.data.XmlReader(config)
		}));
	}
});
Ext.reg('xmlstore', Ext.data.XmlStore);
Ext.data.GroupingStore = Ext.extend(Ext.data.Store, {


	constructor: function(config){
		Ext.data.GroupingStore.superclass.constructor.call(this, config);
		this.applyGroupField();
	},



	remoteGroup : false,

	groupOnSort:false,

	groupDir : 'ASC',


	clearGrouping : function(){
		this.groupField = false;
		if(this.remoteGroup){
			if(this.baseParams){
				delete this.baseParams.groupBy;
			}
			var lo = this.lastOptions;
			if(lo && lo.params){
				delete lo.params.groupBy;
			}
			this.reload();
		}else{
			this.applySort();
			this.fireEvent('datachanged', this);
		}
	},


	groupBy : function(field, forceRegroup, direction){
		direction = direction ? (String(direction).toUpperCase() == 'DESC' ? 'DESC' : 'ASC') : this.groupDir;
		if(this.groupField == field && this.groupDir == direction && !forceRegroup){
			return;
		}
		this.groupField = field;
		this.groupDir = direction;
		this.applyGroupField();
		if(this.groupOnSort){
			this.sort(field, direction);
			return;
		}
		if(this.remoteGroup){
			this.reload();
		}else{
			var si = this.sortInfo || {};
			if(si.field != field || si.direction != direction){
				this.applySort();
			}else{
				this.sortData(field, direction);
			}
			this.fireEvent('datachanged', this);
		}
	},


	applyGroupField: function(){
		if(this.remoteGroup){
			if(!this.baseParams){
				this.baseParams = {};
			}
			this.baseParams.groupBy = this.groupField;
			this.baseParams.groupDir = this.groupDir;
		}
	},


	applySort : function(){
		Ext.data.GroupingStore.superclass.applySort.call(this);
		if(!this.groupOnSort && !this.remoteGroup){
			var gs = this.getGroupState();
			if(gs && (gs != this.sortInfo.field || this.groupDir != this.sortInfo.direction)){
				this.sortData(this.groupField, this.groupDir);
			}
		}
	},


	applyGrouping : function(alwaysFireChange){
		if(this.groupField !== false){
			this.groupBy(this.groupField, true, this.groupDir);
			return true;
		}else{
			if(alwaysFireChange === true){
				this.fireEvent('datachanged', this);
			}
			return false;
		}
	},


	getGroupState : function(){
		return this.groupOnSort && this.groupField !== false ?
			(this.sortInfo ? this.sortInfo.field : undefined) : this.groupField;
	}
});
Ext.reg('groupingstore', Ext.data.GroupingStore);
Ext.data.DirectProxy = function(config){
	Ext.apply(this, config);
	if(typeof this.paramOrder == 'string'){
		this.paramOrder = this.paramOrder.split(/[\s,|]/);
	}
	Ext.data.DirectProxy.superclass.constructor.call(this, config);
};

Ext.extend(Ext.data.DirectProxy, Ext.data.DataProxy, {

	paramOrder: undefined,


	paramsAsHash: true,


	directFn : undefined,


	doRequest : function(action, rs, params, reader, callback, scope, options) {
		var args = [],
			directFn = this.api[action] || this.directFn;

		switch (action) {
			case Ext.data.Api.actions.create:
				args.push(params.jsonData);
				break;
			case Ext.data.Api.actions.read:

				if(directFn.directCfg.method.len > 0){
					if(this.paramOrder){
						for(var i = 0, len = this.paramOrder.length; i < len; i++){
							args.push(params[this.paramOrder[i]]);
						}
					}else if(this.paramsAsHash){
						args.push(params);
					}
				}
				break;
			case Ext.data.Api.actions.update:
				args.push(params.jsonData);
				break;
			case Ext.data.Api.actions.destroy:
				args.push(params.jsonData);
				break;
		}

		var trans = {
			params : params || {},
			request: {
				callback : callback,
				scope : scope,
				arg : options
			},
			reader: reader
		};

		args.push(this.createCallback(action, rs, trans), this);
		directFn.apply(window, args);
	},


	createCallback : function(action, rs, trans) {
		return function(result, res) {
			if (!res.status) {

				if (action === Ext.data.Api.actions.read) {
					this.fireEvent("loadexception", this, trans, res, null);
				}
				this.fireEvent('exception', this, 'remote', action, trans, res, null);
				trans.request.callback.call(trans.request.scope, null, trans.request.arg, false);
				return;
			}
			if (action === Ext.data.Api.actions.read) {
				this.onRead(action, trans, result, res);
			} else {
				this.onWrite(action, trans, result, res, rs);
			}
		};
	},

	onRead : function(action, trans, result, res) {
		var records;
		try {
			records = trans.reader.readRecords(result);
		}
		catch (ex) {

			this.fireEvent("loadexception", this, trans, res, ex);

			this.fireEvent('exception', this, 'response', action, trans, res, ex);
			trans.request.callback.call(trans.request.scope, null, trans.request.arg, false);
			return;
		}
		this.fireEvent("load", this, res, trans.request.arg);
		trans.request.callback.call(trans.request.scope, records, trans.request.arg, true);
	},

	onWrite : function(action, trans, result, res, rs) {
		var data = trans.reader.extractData(result, false);
		this.fireEvent("write", this, action, data, res, rs, trans.request.arg);
		trans.request.callback.call(trans.request.scope, data, res, true);
	}
});


Ext.data.DirectStore = function(c){

	c.batchTransactions = false;

	Ext.data.DirectStore.superclass.constructor.call(this, Ext.apply(c, {
		proxy: (typeof(c.proxy) == 'undefined') ? new Ext.data.DirectProxy(Ext.copyTo({}, c, 'paramOrder,paramsAsHash,directFn,api')) : c.proxy,
		reader: (typeof(c.reader) == 'undefined' && typeof(c.fields) == 'object') ? new Ext.data.JsonReader(Ext.copyTo({}, c, 'totalProperty,root,idProperty'), c.fields) : c.reader
	}));
};
Ext.extend(Ext.data.DirectStore, Ext.data.Store, {});
Ext.reg('directstore', Ext.data.DirectStore);

Ext.Direct = Ext.extend(Ext.util.Observable, {



	exceptions: {
		TRANSPORT: 'xhr',
		PARSE: 'parse',
		LOGIN: 'login',
		SERVER: 'exception'
	},


	constructor: function(){
		this.addEvents(

			'event',

			'exception'
		);
		this.transactions = {};
		this.providers = {};
	},


	addProvider : function(provider){
		var a = arguments;
		if(a.length > 1){
			for(var i = 0, len = a.length; i < len; i++){
				this.addProvider(a[i]);
			}
			return;
		}


		if(!provider.events){
			provider = new Ext.Direct.PROVIDERS[provider.type](provider);
		}
		provider.id = provider.id || Ext.id();
		this.providers[provider.id] = provider;

		provider.on('data', this.onProviderData, this);
		provider.on('exception', this.onProviderException, this);


		if(!provider.isConnected()){
			provider.connect();
		}

		return provider;
	},


	getProvider : function(id){
		return this.providers[id];
	},

	removeProvider : function(id){
		var provider = id.id ? id : this.providers[id.id];
		provider.un('data', this.onProviderData, this);
		provider.un('exception', this.onProviderException, this);
		delete this.providers[provider.id];
		return provider;
	},

	addTransaction: function(t){
		this.transactions[t.tid] = t;
		return t;
	},

	removeTransaction: function(t){
		delete this.transactions[t.tid || t];
		return t;
	},

	getTransaction: function(tid){
		return this.transactions[tid.tid || tid];
	},

	onProviderData : function(provider, e){
		if(Ext.isArray(e)){
			for(var i = 0, len = e.length; i < len; i++){
				this.onProviderData(provider, e[i]);
			}
			return;
		}
		if(e.name && e.name != 'event' && e.name != 'exception'){
			this.fireEvent(e.name, e);
		}else if(e.type == 'exception'){
			this.fireEvent('exception', e);
		}
		this.fireEvent('event', e, provider);
	},

	createEvent : function(response, extraProps){
		return new Ext.Direct.eventTypes[response.type](Ext.apply(response, extraProps));
	}
});

Ext.Direct = new Ext.Direct();

Ext.Direct.TID = 1;
Ext.Direct.PROVIDERS = {};
Ext.Direct.Transaction = function(config){
	Ext.apply(this, config);
	this.tid = ++Ext.Direct.TID;
	this.retryCount = 0;
};
Ext.Direct.Transaction.prototype = {
	send: function(){
		this.provider.queueTransaction(this);
	},

	retry: function(){
		this.retryCount++;
		this.send();
	},

	getProvider: function(){
		return this.provider;
	}
};Ext.Direct.Event = function(config){
	Ext.apply(this, config);
}
Ext.Direct.Event.prototype = {
	status: true,
	getData: function(){
		return this.data;
	}
};

Ext.Direct.RemotingEvent = Ext.extend(Ext.Direct.Event, {
	type: 'rpc',
	getTransaction: function(){
		return this.transaction || Ext.Direct.getTransaction(this.tid);
	}
});

Ext.Direct.ExceptionEvent = Ext.extend(Ext.Direct.RemotingEvent, {
	status: false,
	type: 'exception'
});

Ext.Direct.eventTypes = {
	'rpc':  Ext.Direct.RemotingEvent,
	'event':  Ext.Direct.Event,
	'exception':  Ext.Direct.ExceptionEvent
};


Ext.direct.Provider = Ext.extend(Ext.util.Observable, {



	priority: 1,




	constructor : function(config){
		Ext.apply(this, config);
		this.addEvents(

			'connect',

			'disconnect',

			'data',

			'exception'
		);
		Ext.direct.Provider.superclass.constructor.call(this, config);
	},


	isConnected: function(){
		return false;
	},


	connect: Ext.emptyFn,


	disconnect: Ext.emptyFn
});

Ext.direct.JsonProvider = Ext.extend(Ext.direct.Provider, {
	parseResponse: function(xhr){
		if(!Ext.isEmpty(xhr.responseText)){
			if(typeof xhr.responseText == 'object'){
				return xhr.responseText;
			}
			return Ext.decode(xhr.responseText);
		}
		return null;
	},

	getEvents: function(xhr){
		var data = null;
		try{
			data = this.parseResponse(xhr);
		}catch(e){
			var event = new Ext.Direct.ExceptionEvent({
				data: e,
				xhr: xhr,
				code: Ext.Direct.exceptions.PARSE,
				message: 'Error parsing json response: \n\n ' + data
			})
			return [event];
		}
		var events = [];
		if(Ext.isArray(data)){
			for(var i = 0, len = data.length; i < len; i++){
				events.push(Ext.Direct.createEvent(data[i]));
			}
		}else{
			events.push(Ext.Direct.createEvent(data));
		}
		return events;
	}
});
Ext.direct.PollingProvider = Ext.extend(Ext.direct.JsonProvider, {


	priority: 3,


	interval: 3000,






	constructor : function(config){
		Ext.direct.PollingProvider.superclass.constructor.call(this, config);
		this.addEvents(

			'beforepoll',

			'poll'
		);
	},


	isConnected: function(){
		return !!this.pollTask;
	},


	connect: function(){
		if(this.url && !this.pollTask){
			this.pollTask = Ext.TaskMgr.start({
				run: function(){
					if(this.fireEvent('beforepoll', this) !== false){
						if(typeof this.url == 'function'){
							this.url(this.baseParams);
						}else{
							Ext.Ajax.request({
								url: this.url,
								callback: this.onData,
								scope: this,
								params: this.baseParams
							});
						}
					}
				},
				interval: this.interval,
				scope: this
			});
			this.fireEvent('connect', this);
		}else if(!this.url){
			throw 'Error initializing PollingProvider, no url configured.';
		}
	},


	disconnect: function(){
		if(this.pollTask){
			Ext.TaskMgr.stop(this.pollTask);
			delete this.pollTask;
			this.fireEvent('disconnect', this);
		}
	},


	onData: function(opt, success, xhr){
		if(success){
			var events = this.getEvents(xhr);
			for(var i = 0, len = events.length; i < len; i++){
				var e = events[i];
				this.fireEvent('data', this, e);
			}
		}else{
			var e = new Ext.Direct.ExceptionEvent({
				data: e,
				code: Ext.Direct.exceptions.TRANSPORT,
				message: 'Unable to connect to the server.',
				xhr: xhr
			});
			this.fireEvent('data', this, e);
		}
	}
});

Ext.Direct.PROVIDERS['polling'] = Ext.direct.PollingProvider;
Ext.direct.RemotingProvider = Ext.extend(Ext.direct.JsonProvider, {









	enableBuffer: 10,


	maxRetries: 1,


	timeout: undefined,

	constructor : function(config){
		Ext.direct.RemotingProvider.superclass.constructor.call(this, config);
		this.addEvents(

			'beforecall',

			'call'
		);
		this.namespace = (Ext.isString(this.namespace)) ? Ext.ns(this.namespace) : this.namespace || window;
		this.transactions = {};
		this.callBuffer = [];
	},


	initAPI : function(){
		var o = this.actions;
		for(var c in o){
			var cls = this.namespace[c] || (this.namespace[c] = {}),
				ms = o[c];
			for(var i = 0, len = ms.length; i < len; i++){
				var m = ms[i];
				cls[m.name] = this.createMethod(c, m);
			}
		}
	},


	isConnected: function(){
		return !!this.connected;
	},

	connect: function(){
		if(this.url){
			this.initAPI();
			this.connected = true;
			this.fireEvent('connect', this);
		}else if(!this.url){
			throw 'Error initializing RemotingProvider, no url configured.';
		}
	},

	disconnect: function(){
		if(this.connected){
			this.connected = false;
			this.fireEvent('disconnect', this);
		}
	},

	onData: function(opt, success, xhr){
		if(success){
			var events = this.getEvents(xhr);
			for(var i = 0, len = events.length; i < len; i++){
				var e = events[i],
					t = this.getTransaction(e);
				this.fireEvent('data', this, e);
				if(t){
					this.doCallback(t, e, true);
					Ext.Direct.removeTransaction(t);
				}
			}
		}else{
			var ts = [].concat(opt.ts);
			for(var i = 0, len = ts.length; i < len; i++){
				var t = this.getTransaction(ts[i]);
				if(t && t.retryCount < this.maxRetries){
					t.retry();
				}else{
					var e = new Ext.Direct.ExceptionEvent({
						data: e,
						transaction: t,
						code: Ext.Direct.exceptions.TRANSPORT,
						message: 'Unable to connect to the server.',
						xhr: xhr
					});
					this.fireEvent('data', this, e);
					if(t){
						this.doCallback(t, e, false);
						Ext.Direct.removeTransaction(t);
					}
				}
			}
		}
	},

	getCallData: function(t){
		return {
			action: t.action,
			method: t.method,
			data: t.data,
			type: 'rpc',
			tid: t.tid
		};
	},

	doSend : function(data){
		var o = {
			url: this.url,
			callback: this.onData,
			scope: this,
			ts: data,
			timeout: this.timeout
		}, callData;

		if(Ext.isArray(data)){
			callData = [];
			for(var i = 0, len = data.length; i < len; i++){
				callData.push(this.getCallData(data[i]));
			}
		}else{
			callData = this.getCallData(data);
		}

		if(this.enableUrlEncode){
			var params = {};
			params[Ext.isString(this.enableUrlEncode) ? this.enableUrlEncode : 'data'] = Ext.encode(callData);
			o.params = params;
		}else{
			o.jsonData = callData;
		}
		Ext.Ajax.request(o);
	},

	combineAndSend : function(){
		var len = this.callBuffer.length;
		if(len > 0){
			this.doSend(len == 1 ? this.callBuffer[0] : this.callBuffer);
			this.callBuffer = [];
		}
	},

	queueTransaction: function(t){
		if(t.form){
			this.processForm(t);
			return;
		}
		this.callBuffer.push(t);
		if(this.enableBuffer){
			if(!this.callTask){
				this.callTask = new Ext.util.DelayedTask(this.combineAndSend, this);
			}
			this.callTask.delay(Ext.isNumber(this.enableBuffer) ? this.enableBuffer : 10);
		}else{
			this.combineAndSend();
		}
	},

	doCall : function(c, m, args){
		var data = null, hs = args[m.len], scope = args[m.len+1];

		if(m.len !== 0){
			data = args.slice(0, m.len);
		}

		var t = new Ext.Direct.Transaction({
			provider: this,
			args: args,
			action: c,
			method: m.name,
			data: data,
			cb: scope && Ext.isFunction(hs) ? hs.createDelegate(scope) : hs
		});

		if(this.fireEvent('beforecall', this, t) !== false){
			Ext.Direct.addTransaction(t);
			this.queueTransaction(t);
			this.fireEvent('call', this, t);
		}
	},

	doForm : function(c, m, form, callback, scope){
		var t = new Ext.Direct.Transaction({
			provider: this,
			action: c,
			method: m.name,
			args:[form, callback, scope],
			cb: scope && Ext.isFunction(callback) ? callback.createDelegate(scope) : callback,
			isForm: true
		});

		if(this.fireEvent('beforecall', this, t) !== false){
			Ext.Direct.addTransaction(t);
			var isUpload = String(form.getAttribute("enctype")).toLowerCase() == 'multipart/form-data',
				params = {
					extTID: t.tid,
					extAction: c,
					extMethod: m.name,
					extType: 'rpc',
					extUpload: String(isUpload)
				};



			Ext.apply(t, {
				form: Ext.getDom(form),
				isUpload: isUpload,
				params: callback && Ext.isObject(callback.params) ? Ext.apply(params, callback.params) : params
			});
			this.fireEvent('call', this, t);
			this.processForm(t);
		}
	},

	processForm: function(t){
		Ext.Ajax.request({
			url: this.url,
			params: t.params,
			callback: this.onData,
			scope: this,
			form: t.form,
			isUpload: t.isUpload,
			ts: t
		});
	},

	createMethod : function(c, m){
		var f;
		if(!m.formHandler){
			f = function(){
				this.doCall(c, m, Array.prototype.slice.call(arguments, 0));
			}.createDelegate(this);
		}else{
			f = function(form, callback, scope){
				this.doForm(c, m, form, callback, scope);
			}.createDelegate(this);
		}
		f.directCfg = {
			action: c,
			method: m
		};
		return f;
	},

	getTransaction: function(opt){
		return opt && opt.tid ? Ext.Direct.getTransaction(opt.tid) : null;
	},

	doCallback: function(t, e){
		var fn = e.status ? 'success' : 'failure';
		if(t && t.cb){
			var hs = t.cb,
				result = Ext.isDefined(e.result) ? e.result : e.data;
			if(Ext.isFunction(hs)){
				hs(result, e);
			} else{
				Ext.callback(hs[fn], hs.scope, [result, e]);
				Ext.callback(hs.callback, hs.scope, [result, e]);
			}
		}
	}
});
Ext.Direct.PROVIDERS['remoting'] = Ext.direct.RemotingProvider;
Ext.Resizable = function(el, config){
	this.el = Ext.get(el);

	if(config && config.wrap){
		config.resizeChild = this.el;
		this.el = this.el.wrap(typeof config.wrap == 'object' ? config.wrap : {cls:'xresizable-wrap'});
		this.el.id = this.el.dom.id = config.resizeChild.id + '-rzwrap';
		this.el.setStyle('overflow', 'hidden');
		this.el.setPositioning(config.resizeChild.getPositioning());
		config.resizeChild.clearPositioning();
		if(!config.width || !config.height){
			var csize = config.resizeChild.getSize();
			this.el.setSize(csize.width, csize.height);
		}
		if(config.pinned && !config.adjustments){
			config.adjustments = 'auto';
		}
	}


	this.proxy = this.el.createProxy({tag: 'div', cls: 'x-resizable-proxy', id: this.el.id + '-rzproxy'}, Ext.getBody());
	this.proxy.unselectable();
	this.proxy.enableDisplayMode('block');

	Ext.apply(this, config);

	if(this.pinned){
		this.disableTrackOver = true;
		this.el.addClass('x-resizable-pinned');
	}

	var position = this.el.getStyle('position');
	if(position != 'absolute' && position != 'fixed'){
		this.el.setStyle('position', 'relative');
	}
	if(!this.handles){
		this.handles = 's,e,se';
		if(this.multiDirectional){
			this.handles += ',n,w';
		}
	}
	if(this.handles == 'all'){
		this.handles = 'n s e w ne nw se sw';
	}
	var hs = this.handles.split(/\s*?[,;]\s*?| /);
	var ps = Ext.Resizable.positions;
	for(var i = 0, len = hs.length; i < len; i++){
		if(hs[i] && ps[hs[i]]){
			var pos = ps[hs[i]];
			this[pos] = new Ext.Resizable.Handle(this, pos, this.disableTrackOver, this.transparent);
		}
	}

	this.corner = this.southeast;

	if(this.handles.indexOf('n') != -1 || this.handles.indexOf('w') != -1){
		this.updateBox = true;
	}

	this.activeHandle = null;

	if(this.resizeChild){
		if(typeof this.resizeChild == 'boolean'){
			this.resizeChild = Ext.get(this.el.dom.firstChild, true);
		}else{
			this.resizeChild = Ext.get(this.resizeChild, true);
		}
	}

	if(this.adjustments == 'auto'){
		var rc = this.resizeChild;
		var hw = this.west, he = this.east, hn = this.north, hs = this.south;
		if(rc && (hw || hn)){
			rc.position('relative');
			rc.setLeft(hw ? hw.el.getWidth() : 0);
			rc.setTop(hn ? hn.el.getHeight() : 0);
		}
		this.adjustments = [
			(he ? -he.el.getWidth() : 0) + (hw ? -hw.el.getWidth() : 0),
			(hn ? -hn.el.getHeight() : 0) + (hs ? -hs.el.getHeight() : 0) -1
		];
	}

	if(this.draggable){
		this.dd = this.dynamic ?
			this.el.initDD(null) : this.el.initDDProxy(null, {dragElId: this.proxy.id});
		this.dd.setHandleElId(this.resizeChild ? this.resizeChild.id : this.el.id);
		if(this.constrainTo){
			this.dd.constrainTo(this.constrainTo);
		}
	}

	this.addEvents(

		'beforeresize',

		'resize'
	);

	if(this.width !== null && this.height !== null){
		this.resizeTo(this.width, this.height);
	}else{
		this.updateChildSize();
	}
	if(Ext.isIE){
		this.el.dom.style.zoom = 1;
	}
	Ext.Resizable.superclass.constructor.call(this);
};

Ext.extend(Ext.Resizable, Ext.util.Observable, {


	adjustments : [0, 0],

	animate : false,


	disableTrackOver : false,

	draggable: false,

	duration : 0.35,

	dynamic : false,

	easing : 'easeOutStrong',

	enabled : true,


	handles : false,

	multiDirectional : false,

	height : null,

	width : null,

	heightIncrement : 0,

	widthIncrement : 0,

	minHeight : 5,

	minWidth : 5,

	maxHeight : 10000,

	maxWidth : 10000,

	minX: 0,

	minY: 0,

	pinned : false,

	preserveRatio : false,

	resizeChild : false,

	transparent: false,





	resizeTo : function(width, height){
		this.el.setSize(width, height);
		this.updateChildSize();
		this.fireEvent('resize', this, width, height, null);
	},


	startSizing : function(e, handle){
		this.fireEvent('beforeresize', this, e);
		if(this.enabled){

			if(!this.overlay){
				this.overlay = this.el.createProxy({tag: 'div', cls: 'x-resizable-overlay', html: '&#160;'}, Ext.getBody());
				this.overlay.unselectable();
				this.overlay.enableDisplayMode('block');
				this.overlay.on({
					scope: this,
					mousemove: this.onMouseMove,
					mouseup: this.onMouseUp
				});
			}
			this.overlay.setStyle('cursor', handle.el.getStyle('cursor'));

			this.resizing = true;
			this.startBox = this.el.getBox();
			this.startPoint = e.getXY();
			this.offsets = [(this.startBox.x + this.startBox.width) - this.startPoint[0],
				(this.startBox.y + this.startBox.height) - this.startPoint[1]];

			this.overlay.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true));
			this.overlay.show();

			if(this.constrainTo) {
				var ct = Ext.get(this.constrainTo);
				this.resizeRegion = ct.getRegion().adjust(
					ct.getFrameWidth('t'),
					ct.getFrameWidth('l'),
					-ct.getFrameWidth('b'),
					-ct.getFrameWidth('r')
				);
			}

			this.proxy.setStyle('visibility', 'hidden');
			this.proxy.show();
			this.proxy.setBox(this.startBox);
			if(!this.dynamic){
				this.proxy.setStyle('visibility', 'visible');
			}
		}
	},


	onMouseDown : function(handle, e){
		if(this.enabled){
			e.stopEvent();
			this.activeHandle = handle;
			this.startSizing(e, handle);
		}
	},


	onMouseUp : function(e){
		this.activeHandle = null;
		var size = this.resizeElement();
		this.resizing = false;
		this.handleOut();
		this.overlay.hide();
		this.proxy.hide();
		this.fireEvent('resize', this, size.width, size.height, e);
	},


	updateChildSize : function(){
		if(this.resizeChild){
			var el = this.el;
			var child = this.resizeChild;
			var adj = this.adjustments;
			if(el.dom.offsetWidth){
				var b = el.getSize(true);
				child.setSize(b.width+adj[0], b.height+adj[1]);
			}




			if(Ext.isIE){
				setTimeout(function(){
					if(el.dom.offsetWidth){
						var b = el.getSize(true);
						child.setSize(b.width+adj[0], b.height+adj[1]);
					}
				}, 10);
			}
		}
	},


	snap : function(value, inc, min){
		if(!inc || !value){
			return value;
		}
		var newValue = value;
		var m = value % inc;
		if(m > 0){
			if(m > (inc/2)){
				newValue = value + (inc-m);
			}else{
				newValue = value - m;
			}
		}
		return Math.max(min, newValue);
	},


	resizeElement : function(){
		var box = this.proxy.getBox();
		if(this.updateBox){
			this.el.setBox(box, false, this.animate, this.duration, null, this.easing);
		}else{
			this.el.setSize(box.width, box.height, this.animate, this.duration, null, this.easing);
		}
		this.updateChildSize();
		if(!this.dynamic){
			this.proxy.hide();
		}
		if(this.draggable && this.constrainTo){
			this.dd.resetConstraints();
			this.dd.constrainTo(this.constrainTo);
		}
		return box;
	},


	constrain : function(v, diff, m, mx){
		if(v - diff < m){
			diff = v - m;
		}else if(v - diff > mx){
			diff = v - mx;
		}
		return diff;
	},


	onMouseMove : function(e){
		if(this.enabled && this.activeHandle){
			try{

				if(this.resizeRegion && !this.resizeRegion.contains(e.getPoint())) {
					return;
				}


				var curSize = this.curSize || this.startBox,
					x = this.startBox.x, y = this.startBox.y,
					ox = x,
					oy = y,
					w = curSize.width,
					h = curSize.height,
					ow = w,
					oh = h,
					mw = this.minWidth,
					mh = this.minHeight,
					mxw = this.maxWidth,
					mxh = this.maxHeight,
					wi = this.widthIncrement,
					hi = this.heightIncrement,
					eventXY = e.getXY(),
					diffX = -(this.startPoint[0] - Math.max(this.minX, eventXY[0])),
					diffY = -(this.startPoint[1] - Math.max(this.minY, eventXY[1])),
					pos = this.activeHandle.position,
					tw,
					th;

				switch(pos){
					case 'east':
						w += diffX;
						w = Math.min(Math.max(mw, w), mxw);
						break;
					case 'south':
						h += diffY;
						h = Math.min(Math.max(mh, h), mxh);
						break;
					case 'southeast':
						w += diffX;
						h += diffY;
						w = Math.min(Math.max(mw, w), mxw);
						h = Math.min(Math.max(mh, h), mxh);
						break;
					case 'north':
						diffY = this.constrain(h, diffY, mh, mxh);
						y += diffY;
						h -= diffY;
						break;
					case 'west':
						diffX = this.constrain(w, diffX, mw, mxw);
						x += diffX;
						w -= diffX;
						break;
					case 'northeast':
						w += diffX;
						w = Math.min(Math.max(mw, w), mxw);
						diffY = this.constrain(h, diffY, mh, mxh);
						y += diffY;
						h -= diffY;
						break;
					case 'northwest':
						diffX = this.constrain(w, diffX, mw, mxw);
						diffY = this.constrain(h, diffY, mh, mxh);
						y += diffY;
						h -= diffY;
						x += diffX;
						w -= diffX;
						break;
					case 'southwest':
						diffX = this.constrain(w, diffX, mw, mxw);
						h += diffY;
						h = Math.min(Math.max(mh, h), mxh);
						x += diffX;
						w -= diffX;
						break;
				}

				var sw = this.snap(w, wi, mw);
				var sh = this.snap(h, hi, mh);
				if(sw != w || sh != h){
					switch(pos){
						case 'northeast':
							y -= sh - h;
							break;
						case 'north':
							y -= sh - h;
							break;
						case 'southwest':
							x -= sw - w;
							break;
						case 'west':
							x -= sw - w;
							break;
						case 'northwest':
							x -= sw - w;
							y -= sh - h;
							break;
					}
					w = sw;
					h = sh;
				}

				if(this.preserveRatio){
					switch(pos){
						case 'southeast':
						case 'east':
							h = oh * (w/ow);
							h = Math.min(Math.max(mh, h), mxh);
							w = ow * (h/oh);
							break;
						case 'south':
							w = ow * (h/oh);
							w = Math.min(Math.max(mw, w), mxw);
							h = oh * (w/ow);
							break;
						case 'northeast':
							w = ow * (h/oh);
							w = Math.min(Math.max(mw, w), mxw);
							h = oh * (w/ow);
							break;
						case 'north':
							tw = w;
							w = ow * (h/oh);
							w = Math.min(Math.max(mw, w), mxw);
							h = oh * (w/ow);
							x += (tw - w) / 2;
							break;
						case 'southwest':
							h = oh * (w/ow);
							h = Math.min(Math.max(mh, h), mxh);
							tw = w;
							w = ow * (h/oh);
							x += tw - w;
							break;
						case 'west':
							th = h;
							h = oh * (w/ow);
							h = Math.min(Math.max(mh, h), mxh);
							y += (th - h) / 2;
							tw = w;
							w = ow * (h/oh);
							x += tw - w;
							break;
						case 'northwest':
							tw = w;
							th = h;
							h = oh * (w/ow);
							h = Math.min(Math.max(mh, h), mxh);
							w = ow * (h/oh);
							y += th - h;
							x += tw - w;
							break;

					}
				}
				this.proxy.setBounds(x, y, w, h);
				if(this.dynamic){
					this.resizeElement();
				}
			}catch(ex){}
		}
	},


	handleOver : function(){
		if(this.enabled){
			this.el.addClass('x-resizable-over');
		}
	},


	handleOut : function(){
		if(!this.resizing){
			this.el.removeClass('x-resizable-over');
		}
	},


	getEl : function(){
		return this.el;
	},


	getResizeChild : function(){
		return this.resizeChild;
	},


	destroy : function(removeEl){
		Ext.destroy(this.dd, this.overlay, this.proxy);
		this.overlay = null;
		this.proxy = null;

		var ps = Ext.Resizable.positions;
		for(var k in ps){
			if(typeof ps[k] != 'function' && this[ps[k]]){
				this[ps[k]].destroy();
			}
		}
		if(removeEl){
			this.el.update('');
			Ext.destroy(this.el);
			this.el = null;
		}
		this.purgeListeners();
	},

	syncHandleHeight : function(){
		var h = this.el.getHeight(true);
		if(this.west){
			this.west.el.setHeight(h);
		}
		if(this.east){
			this.east.el.setHeight(h);
		}
	}
});



Ext.Resizable.positions = {
	n: 'north', s: 'south', e: 'east', w: 'west', se: 'southeast', sw: 'southwest', nw: 'northwest', ne: 'northeast'
};


Ext.Resizable.Handle = function(rz, pos, disableTrackOver, transparent){
	if(!this.tpl){

		var tpl = Ext.DomHelper.createTemplate(
			{tag: 'div', cls: 'x-resizable-handle x-resizable-handle-{0}'}
		);
		tpl.compile();
		Ext.Resizable.Handle.prototype.tpl = tpl;
	}
	this.position = pos;
	this.rz = rz;
	this.el = this.tpl.append(rz.el.dom, [this.position], true);
	this.el.unselectable();
	if(transparent){
		this.el.setOpacity(0);
	}
	this.el.on('mousedown', this.onMouseDown, this);
	if(!disableTrackOver){
		this.el.on({
			scope: this,
			mouseover: this.onMouseOver,
			mouseout: this.onMouseOut
		});
	}
};


Ext.Resizable.Handle.prototype = {

	afterResize : function(rz){

	},

	onMouseDown : function(e){
		this.rz.onMouseDown(this, e);
	},

	onMouseOver : function(e){
		this.rz.handleOver(this, e);
	},

	onMouseOut : function(e){
		this.rz.handleOut(this, e);
	},

	destroy : function(){
		Ext.destroy(this.el);
		this.el = null;
	}
};

Ext.Window = Ext.extend(Ext.Panel, {












	baseCls : 'x-window',

	resizable : true,

	draggable : true,

	closable : true,

	closeAction : 'close',

	constrain : false,

	constrainHeader : false,

	plain : false,

	minimizable : false,

	maximizable : false,

	minHeight : 100,

	minWidth : 200,

	expandOnShow : true,


	collapsible : false,


	initHidden : undefined,


	hidden : true,


	monitorResize : true,






	elements : 'header,body',

	frame : true,

	floating : true,


	initComponent : function(){
		this.initTools();
		Ext.Window.superclass.initComponent.call(this);
		this.addEvents(



			'resize',

			'maximize',

			'minimize',

			'restore'
		);

		if(Ext.isDefined(this.initHidden)){
			this.hidden = this.initHidden;
		}
		if(this.hidden === false){
			this.hidden = true;
			this.show();
		}
	},


	getState : function(){
		return Ext.apply(Ext.Window.superclass.getState.call(this) || {}, this.getBox(true));
	},


	onRender : function(ct, position){
		Ext.Window.superclass.onRender.call(this, ct, position);

		if(this.plain){
			this.el.addClass('x-window-plain');
		}


		this.focusEl = this.el.createChild({
			tag: 'a', href:'#', cls:'x-dlg-focus',
			tabIndex:'-1', html: '&#160;'});
		this.focusEl.swallowEvent('click', true);

		this.proxy = this.el.createProxy('x-window-proxy');
		this.proxy.enableDisplayMode('block');

		if(this.modal){
			this.mask = this.container.createChild({cls:'ext-el-mask'}, this.el.dom);
			this.mask.enableDisplayMode('block');
			this.mask.hide();
			this.mon(this.mask, 'click', this.focus, this);
		}
		if(this.maximizable){
			this.mon(this.header, 'dblclick', this.toggleMaximize, this);
		}
	},


	initEvents : function(){
		Ext.Window.superclass.initEvents.call(this);
		if(this.animateTarget){
			this.setAnimateTarget(this.animateTarget);
		}

		if(this.resizable){
			this.resizer = new Ext.Resizable(this.el, {
				minWidth: this.minWidth,
				minHeight:this.minHeight,
				handles: this.resizeHandles || 'all',
				pinned: true,
				resizeElement : this.resizerAction
			});
			this.resizer.window = this;
			this.mon(this.resizer, 'beforeresize', this.beforeResize, this);
		}

		if(this.draggable){
			this.header.addClass('x-window-draggable');
		}
		this.mon(this.el, 'mousedown', this.toFront, this);
		this.manager = this.manager || Ext.WindowMgr;
		this.manager.register(this);
		if(this.maximized){
			this.maximized = false;
			this.maximize();
		}
		if(this.closable){
			var km = this.getKeyMap();
			km.on(27, this.onEsc, this);
			km.disable();
		}
	},

	initDraggable : function(){

		this.dd = new Ext.Window.DD(this);
	},


	onEsc : function(){
		this[this.closeAction]();
	},


	beforeDestroy : function(){
		if (this.rendered){
			this.hide();
			if(this.doAnchor){
				Ext.EventManager.removeResizeListener(this.doAnchor, this);
				Ext.EventManager.un(window, 'scroll', this.doAnchor, this);
			}
			Ext.destroy(
				this.focusEl,
				this.resizer,
				this.dd,
				this.proxy,
				this.mask
			);
		}
		Ext.Window.superclass.beforeDestroy.call(this);
	},


	onDestroy : function(){
		if(this.manager){
			this.manager.unregister(this);
		}
		Ext.Window.superclass.onDestroy.call(this);
	},


	initTools : function(){
		if(this.minimizable){
			this.addTool({
				id: 'minimize',
				handler: this.minimize.createDelegate(this, [])
			});
		}
		if(this.maximizable){
			this.addTool({
				id: 'maximize',
				handler: this.maximize.createDelegate(this, [])
			});
			this.addTool({
				id: 'restore',
				handler: this.restore.createDelegate(this, []),
				hidden:true
			});
		}
		if(this.closable){
			this.addTool({
				id: 'close',
				handler: this[this.closeAction].createDelegate(this, [])
			});
		}
	},


	resizerAction : function(){
		var box = this.proxy.getBox();
		this.proxy.hide();
		this.window.handleResize(box);
		return box;
	},


	beforeResize : function(){
		this.resizer.minHeight = Math.max(this.minHeight, this.getFrameHeight() + 40);
		this.resizer.minWidth = Math.max(this.minWidth, this.getFrameWidth() + 40);
		this.resizeBox = this.el.getBox();
	},


	updateHandles : function(){
		if(Ext.isIE && this.resizer){
			this.resizer.syncHandleHeight();
			this.el.repaint();
		}
	},


	handleResize : function(box){
		var rz = this.resizeBox;
		if(rz.x != box.x || rz.y != box.y){
			this.updateBox(box);
		}else{
			this.setSize(box);
		}
		this.focus();
		this.updateHandles();
		this.saveState();
	},


	focus : function(){
		var f = this.focusEl, db = this.defaultButton, t = typeof db;
		if(Ext.isDefined(db)){
			if(Ext.isNumber(db) && this.fbar){
				f = this.fbar.items.get(db);
			}else if(Ext.isString(db)){
				f = Ext.getCmp(db);
			}else{
				f = db;
			}
		}
		f = f || this.focusEl;
		f.focus.defer(10, f);
	},


	setAnimateTarget : function(el){
		el = Ext.get(el);
		this.animateTarget = el;
	},


	beforeShow : function(){
		delete this.el.lastXY;
		delete this.el.lastLT;
		if(this.x === undefined || this.y === undefined){
			var xy = this.el.getAlignToXY(this.container, 'c-c');
			var pos = this.el.translatePoints(xy[0], xy[1]);
			this.x = this.x === undefined? pos.left : this.x;
			this.y = this.y === undefined? pos.top : this.y;
		}
		this.el.setLeftTop(this.x, this.y);

		if(this.expandOnShow){
			this.expand(false);
		}

		if(this.modal){
			Ext.getBody().addClass('x-body-masked');
			this.mask.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true));
			this.mask.show();
		}
	},


	show : function(animateTarget, cb, scope){
		if(!this.rendered){
			this.render(Ext.getBody());
		}
		if(this.hidden === false){
			this.toFront();
			return this;
		}
		if(this.fireEvent('beforeshow', this) === false){
			return this;
		}
		if(cb){
			this.on('show', cb, scope, {single:true});
		}
		this.hidden = false;
		if(Ext.isDefined(animateTarget)){
			this.setAnimateTarget(animateTarget);
		}
		this.beforeShow();
		if(this.animateTarget){
			this.animShow();
		}else{
			this.afterShow();
		}
		return this;
	},


	afterShow : function(isAnim){
		this.proxy.hide();
		this.el.setStyle('display', 'block');
		this.el.show();
		if(this.maximized){
			this.fitContainer();
		}
		if(Ext.isMac && Ext.isGecko2){
			this.cascade(this.setAutoScroll);
		}

		if(this.monitorResize || this.modal || this.constrain || this.constrainHeader){
			Ext.EventManager.onWindowResize(this.onWindowResize, this);
		}
		this.doConstrain();
		this.doLayout();
		if(this.keyMap){
			this.keyMap.enable();
		}
		this.toFront();
		this.updateHandles();
		if(isAnim && (Ext.isIE || Ext.isWebKit)){
			var sz = this.getSize();
			this.onResize(sz.width, sz.height);
		}
		this.onShow();
		this.fireEvent('show', this);
	},


	animShow : function(){
		this.proxy.show();
		this.proxy.setBox(this.animateTarget.getBox());
		this.proxy.setOpacity(0);
		var b = this.getBox();
		this.el.setStyle('display', 'none');
		this.proxy.shift(Ext.apply(b, {
			callback: this.afterShow.createDelegate(this, [true], false),
			scope: this,
			easing: 'easeNone',
			duration: 0.25,
			opacity: 0.5
		}));
	},


	hide : function(animateTarget, cb, scope){
		if(this.hidden || this.fireEvent('beforehide', this) === false){
			return this;
		}
		if(cb){
			this.on('hide', cb, scope, {single:true});
		}
		this.hidden = true;
		if(animateTarget !== undefined){
			this.setAnimateTarget(animateTarget);
		}
		if(this.modal){
			this.mask.hide();
			Ext.getBody().removeClass('x-body-masked');
		}
		if(this.animateTarget){
			this.animHide();
		}else{
			this.el.hide();
			this.afterHide();
		}
		return this;
	},


	afterHide : function(){
		this.proxy.hide();
		if(this.monitorResize || this.modal || this.constrain || this.constrainHeader){
			Ext.EventManager.removeResizeListener(this.onWindowResize, this);
		}
		if(this.keyMap){
			this.keyMap.disable();
		}
		this.onHide();
		this.fireEvent('hide', this);
	},


	animHide : function(){
		this.proxy.setOpacity(0.5);
		this.proxy.show();
		var tb = this.getBox(false);
		this.proxy.setBox(tb);
		this.el.hide();
		this.proxy.shift(Ext.apply(this.animateTarget.getBox(), {
			callback: this.afterHide,
			scope: this,
			duration: 0.25,
			easing: 'easeNone',
			opacity: 0
		}));
	},


	onShow : Ext.emptyFn,


	onHide : Ext.emptyFn,


	onWindowResize : function(){
		if(this.maximized){
			this.fitContainer();
		}
		if(this.modal){
			this.mask.setSize('100%', '100%');
			var force = this.mask.dom.offsetHeight;
			this.mask.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true));
		}
		this.doConstrain();
	},


	doConstrain : function(){
		if(this.constrain || this.constrainHeader){
			var offsets;
			if(this.constrain){
				offsets = {
					right:this.el.shadowOffset,
					left:this.el.shadowOffset,
					bottom:this.el.shadowOffset
				};
			}else {
				var s = this.getSize();
				offsets = {
					right:-(s.width - 100),
					bottom:-(s.height - 25)
				};
			}

			var xy = this.el.getConstrainToXY(this.container, true, offsets);
			if(xy){
				this.setPosition(xy[0], xy[1]);
			}
		}
	},


	ghost : function(cls){
		var ghost = this.createGhost(cls);
		var box = this.getBox(true);
		ghost.setLeftTop(box.x, box.y);
		ghost.setWidth(box.width);
		this.el.hide();
		this.activeGhost = ghost;
		return ghost;
	},


	unghost : function(show, matchPosition){
		if(!this.activeGhost) {
			return;
		}
		if(show !== false){
			this.el.show();
			this.focus();
			if(Ext.isMac && Ext.isGecko2){
				this.cascade(this.setAutoScroll);
			}
		}
		if(matchPosition !== false){
			this.setPosition(this.activeGhost.getLeft(true), this.activeGhost.getTop(true));
		}
		this.activeGhost.hide();
		this.activeGhost.remove();
		delete this.activeGhost;
	},


	minimize : function(){
		this.fireEvent('minimize', this);
		return this;
	},


	close : function(){
		if(this.fireEvent('beforeclose', this) !== false){
			if(this.hidden){
				this.doClose();
			}else{
				this.hide(null, this.doClose, this);
			}
		}
	},


	doClose : function(){
		this.fireEvent('close', this);
		this.destroy();
	},


	maximize : function(){
		if(!this.maximized){
			this.expand(false);
			this.restoreSize = this.getSize();
			this.restorePos = this.getPosition(true);
			if (this.maximizable){
				this.tools.maximize.hide();
				this.tools.restore.show();
			}
			this.maximized = true;
			this.el.disableShadow();

			if(this.dd){
				this.dd.lock();
			}
			if(this.collapsible){
				this.tools.toggle.hide();
			}
			this.el.addClass('x-window-maximized');
			this.container.addClass('x-window-maximized-ct');

			this.setPosition(0, 0);
			this.fitContainer();
			this.fireEvent('maximize', this);
		}
		return this;
	},


	restore : function(){
		if(this.maximized){
			var t = this.tools;
			this.el.removeClass('x-window-maximized');
			if(t.restore){
				t.restore.hide();
			}
			if(t.maximize){
				t.maximize.show();
			}
			this.setPosition(this.restorePos[0], this.restorePos[1]);
			this.setSize(this.restoreSize.width, this.restoreSize.height);
			delete this.restorePos;
			delete this.restoreSize;
			this.maximized = false;
			this.el.enableShadow(true);

			if(this.dd){
				this.dd.unlock();
			}
			if(this.collapsible && t.toggle){
				t.toggle.show();
			}
			this.container.removeClass('x-window-maximized-ct');

			this.doConstrain();
			this.fireEvent('restore', this);
		}
		return this;
	},


	toggleMaximize : function(){
		return this[this.maximized ? 'restore' : 'maximize']();
	},


	fitContainer : function(){
		var vs = this.container.getViewSize(false);
		this.setSize(vs.width, vs.height);
	},



	setZIndex : function(index){
		if(this.modal){
			this.mask.setStyle('z-index', index);
		}
		this.el.setZIndex(++index);
		index += 5;

		if(this.resizer){
			this.resizer.proxy.setStyle('z-index', ++index);
		}

		this.lastZIndex = index;
	},


	alignTo : function(element, position, offsets){
		var xy = this.el.getAlignToXY(element, position, offsets);
		this.setPagePosition(xy[0], xy[1]);
		return this;
	},


	anchorTo : function(el, alignment, offsets, monitorScroll){
		if(this.doAnchor){
			Ext.EventManager.removeResizeListener(this.doAnchor, this);
			Ext.EventManager.un(window, 'scroll', this.doAnchor, this);
		}
		this.doAnchor = function(){
			this.alignTo(el, alignment, offsets);
		};
		Ext.EventManager.onWindowResize(this.doAnchor, this);

		var tm = typeof monitorScroll;
		if(tm != 'undefined'){
			Ext.EventManager.on(window, 'scroll', this.doAnchor, this,
				{buffer: tm == 'number' ? monitorScroll : 50});
		}
		this.doAnchor();
		return this;
	},


	toFront : function(e){
		if(this.manager.bringToFront(this)){
			if(!e || !e.getTarget().focus){
				this.focus();
			}
		}
		return this;
	},


	setActive : function(active){
		if(active){
			if(!this.maximized){
				this.el.enableShadow(true);
			}
			this.fireEvent('activate', this);
		}else{
			this.el.disableShadow();
			this.fireEvent('deactivate', this);
		}
	},


	toBack : function(){
		this.manager.sendToBack(this);
		return this;
	},


	center : function(){
		var xy = this.el.getAlignToXY(this.container, 'c-c');
		this.setPagePosition(xy[0], xy[1]);
		return this;
	}


});
Ext.reg('window', Ext.Window);


Ext.Window.DD = function(win){
	this.win = win;
	Ext.Window.DD.superclass.constructor.call(this, win.el.id, 'WindowDD-'+win.id);
	this.setHandleElId(win.header.id);
	this.scroll = false;
};

Ext.extend(Ext.Window.DD, Ext.dd.DD, {
	moveOnly:true,
	headerOffsets:[100, 25],
	startDrag : function(){
		var w = this.win;
		this.proxy = w.ghost();
		if(w.constrain !== false){
			var so = w.el.shadowOffset;
			this.constrainTo(w.container, {right: so, left: so, bottom: so});
		}else if(w.constrainHeader !== false){
			var s = this.proxy.getSize();
			this.constrainTo(w.container, {right: -(s.width-this.headerOffsets[0]), bottom: -(s.height-this.headerOffsets[1])});
		}
	},
	b4Drag : Ext.emptyFn,

	onDrag : function(e){
		this.alignElWithMouse(this.proxy, e.getPageX(), e.getPageY());
	},

	endDrag : function(e){
		this.win.unghost();
		this.win.saveState();
	}
});

Ext.WindowGroup = function(){
	var list = {};
	var accessList = [];
	var front = null;


	var sortWindows = function(d1, d2){
		return (!d1._lastAccess || d1._lastAccess < d2._lastAccess) ? -1 : 1;
	};


	var orderWindows = function(){
		var a = accessList, len = a.length;
		if(len > 0){
			a.sort(sortWindows);
			var seed = a[0].manager.zseed;
			for(var i = 0; i < len; i++){
				var win = a[i];
				if(win && !win.hidden){
					win.setZIndex(seed + (i*10));
				}
			}
		}
		activateLast();
	};


	var setActiveWin = function(win){
		if(win != front){
			if(front){
				front.setActive(false);
			}
			front = win;
			if(win){
				win.setActive(true);
			}
		}
	};


	var activateLast = function(){
		for(var i = accessList.length-1; i >=0; --i) {
			if(!accessList[i].hidden){
				setActiveWin(accessList[i]);
				return;
			}
		}

		setActiveWin(null);
	};

	return {

		zseed : 9000,


		register : function(win){
			if(win.manager){
				win.manager.unregister(win);
			}
			win.manager = this;

			list[win.id] = win;
			accessList.push(win);
			win.on('hide', activateLast);
		},


		unregister : function(win){
			delete win.manager;
			delete list[win.id];
			win.un('hide', activateLast);
			accessList.remove(win);
		},


		get : function(id){
			return typeof id == "object" ? id : list[id];
		},


		bringToFront : function(win){
			win = this.get(win);
			if(win != front){
				win._lastAccess = new Date().getTime();
				orderWindows();
				return true;
			}
			return false;
		},


		sendToBack : function(win){
			win = this.get(win);
			win._lastAccess = -(new Date().getTime());
			orderWindows();
			return win;
		},


		hideAll : function(){
			for(var id in list){
				if(list[id] && typeof list[id] != "function" && list[id].isVisible()){
					list[id].hide();
				}
			}
		},


		getActive : function(){
			return front;
		},


		getBy : function(fn, scope){
			var r = [];
			for(var i = accessList.length-1; i >=0; --i) {
				var win = accessList[i];
				if(fn.call(scope||win, win) !== false){
					r.push(win);
				}
			}
			return r;
		},


		each : function(fn, scope){
			for(var id in list){
				if(list[id] && typeof list[id] != "function"){
					if(fn.call(scope || list[id], list[id]) === false){
						return;
					}
				}
			}
		}
	};
};



Ext.WindowMgr = new Ext.WindowGroup();
Ext.MessageBox = function(){
	var dlg, opt, mask, waitTimer,
		bodyEl, msgEl, textboxEl, textareaEl, progressBar, pp, iconEl, spacerEl,
		buttons, activeTextEl, bwidth, bufferIcon = '', iconCls = '',
		buttonNames = ['ok', 'yes', 'no', 'cancel'];


	var handleButton = function(button){
		buttons[button].blur();
		if(dlg.isVisible()){
			dlg.hide();
			handleHide();
			Ext.callback(opt.fn, opt.scope||window, [button, activeTextEl.dom.value, opt], 1);
		}
	};


	var handleHide = function(){
		if(opt && opt.cls){
			dlg.el.removeClass(opt.cls);
		}
		progressBar.reset();
	};


	var handleEsc = function(d, k, e){
		if(opt && opt.closable !== false){
			dlg.hide();
			handleHide();
		}
		if(e){
			e.stopEvent();
		}
	};


	var updateButtons = function(b){
		var width = 0,
			cfg;
		if(!b){
			Ext.each(buttonNames, function(name){
				buttons[name].hide();
			});
			return width;
		}
		dlg.footer.dom.style.display = '';
		Ext.iterate(buttons, function(name, btn){
			cfg = b[name];
			if(cfg){
				btn.show();
				btn.setText(Ext.isString(cfg) ? cfg : Ext.MessageBox.buttonText[name]);
				width += btn.getEl().getWidth() + 15;
			}else{
				btn.hide();
			}
		});
		return width;
	};

	return {

		getDialog : function(titleText){
			if(!dlg){
				var btns = [];

				buttons = {};
				Ext.each(buttonNames, function(name){
					btns.push(buttons[name] = new Ext.Button({
						text: this.buttonText[name],
						handler: handleButton.createCallback(name),
						hideMode: 'offsets'
					}));
				}, this);
				dlg = new Ext.Window({
					autoCreate : true,
					title:titleText,
					resizable:false,
					constrain:true,
					constrainHeader:true,
					minimizable : false,
					maximizable : false,
					stateful: false,
					modal: true,
					shim:true,
					buttonAlign:"center",
					width:400,
					height:100,
					minHeight: 80,
					plain:true,
					footer:true,
					closable:true,
					close : function(){
						if(opt && opt.buttons && opt.buttons.no && !opt.buttons.cancel){
							handleButton("no");
						}else{
							handleButton("cancel");
						}
					},
					fbar: new Ext.Toolbar({
						items: btns,
						enableOverflow: false
					})
				});
				dlg.render(document.body);
				dlg.getEl().addClass('x-window-dlg');
				mask = dlg.mask;
				bodyEl = dlg.body.createChild({
					html:'<div class="ext-mb-icon"></div><div class="ext-mb-content"><span class="ext-mb-text"></span><br /><div class="ext-mb-fix-cursor"><input type="text" class="ext-mb-input" /><textarea class="ext-mb-textarea"></textarea></div></div>'
				});
				iconEl = Ext.get(bodyEl.dom.firstChild);
				var contentEl = bodyEl.dom.childNodes[1];
				msgEl = Ext.get(contentEl.firstChild);
				textboxEl = Ext.get(contentEl.childNodes[2].firstChild);
				textboxEl.enableDisplayMode();
				textboxEl.addKeyListener([10,13], function(){
					if(dlg.isVisible() && opt && opt.buttons){
						if(opt.buttons.ok){
							handleButton("ok");
						}else if(opt.buttons.yes){
							handleButton("yes");
						}
					}
				});
				textareaEl = Ext.get(contentEl.childNodes[2].childNodes[1]);
				textareaEl.enableDisplayMode();
				progressBar = new Ext.ProgressBar({
					renderTo:bodyEl
				});
				bodyEl.createChild({cls:'x-clear'});
			}
			return dlg;
		},


		updateText : function(text){
			if(!dlg.isVisible() && !opt.width){
				dlg.setSize(this.maxWidth, 100);
			}
			msgEl.update(text || '&#160;');

			var iw = iconCls != '' ? (iconEl.getWidth() + iconEl.getMargins('lr')) : 0;
			var mw = msgEl.getWidth() + msgEl.getMargins('lr');
			var fw = dlg.getFrameWidth('lr');
			var bw = dlg.body.getFrameWidth('lr');
			if (Ext.isIE && iw > 0){


				iw += 3;
			}
			var w = Math.max(Math.min(opt.width || iw+mw+fw+bw, this.maxWidth),
				Math.max(opt.minWidth || this.minWidth, bwidth || 0));

			if(opt.prompt === true){
				activeTextEl.setWidth(w-iw-fw-bw);
			}
			if(opt.progress === true || opt.wait === true){
				progressBar.setSize(w-iw-fw-bw);
			}
			if(Ext.isIE && w == bwidth){
				w += 4;
			}
			dlg.setSize(w, 'auto').center();
			return this;
		},


		updateProgress : function(value, progressText, msg){
			progressBar.updateProgress(value, progressText);
			if(msg){
				this.updateText(msg);
			}
			return this;
		},


		isVisible : function(){
			return dlg && dlg.isVisible();
		},


		hide : function(){
			var proxy = dlg ? dlg.activeGhost : null;
			if(this.isVisible() || proxy){
				dlg.hide();
				handleHide();
				if (proxy){


					dlg.unghost(false, false);
				}
			}
			return this;
		},


		show : function(options){
			if(this.isVisible()){
				this.hide();
			}
			opt = options;
			var d = this.getDialog(opt.title || "&#160;");

			d.setTitle(opt.title || "&#160;");
			var allowClose = (opt.closable !== false && opt.progress !== true && opt.wait !== true);
			d.tools.close.setDisplayed(allowClose);
			activeTextEl = textboxEl;
			opt.prompt = opt.prompt || (opt.multiline ? true : false);
			if(opt.prompt){
				if(opt.multiline){
					textboxEl.hide();
					textareaEl.show();
					textareaEl.setHeight(Ext.isNumber(opt.multiline) ? opt.multiline : this.defaultTextHeight);
					activeTextEl = textareaEl;
				}else{
					textboxEl.show();
					textareaEl.hide();
				}
			}else{
				textboxEl.hide();
				textareaEl.hide();
			}
			activeTextEl.dom.value = opt.value || "";
			if(opt.prompt){
				d.focusEl = activeTextEl;
			}else{
				var bs = opt.buttons;
				var db = null;
				if(bs && bs.ok){
					db = buttons["ok"];
				}else if(bs && bs.yes){
					db = buttons["yes"];
				}
				if (db){
					d.focusEl = db;
				}
			}
			if(opt.iconCls){
				d.setIconClass(opt.iconCls);
			}
			this.setIcon(Ext.isDefined(opt.icon) ? opt.icon : bufferIcon);
			bwidth = updateButtons(opt.buttons);
			progressBar.setVisible(opt.progress === true || opt.wait === true);
			this.updateProgress(0, opt.progressText);
			this.updateText(opt.msg);
			if(opt.cls){
				d.el.addClass(opt.cls);
			}
			d.proxyDrag = opt.proxyDrag === true;
			d.modal = opt.modal !== false;
			d.mask = opt.modal !== false ? mask : false;
			if(!d.isVisible()){

				document.body.appendChild(dlg.el.dom);
				d.setAnimateTarget(opt.animEl);

				d.on('show', function(){
					if(allowClose === true){
						d.keyMap.enable();
					}else{
						d.keyMap.disable();
					}
				}, this, {single:true});
				d.show(opt.animEl);
			}
			if(opt.wait === true){
				progressBar.wait(opt.waitConfig);
			}
			return this;
		},


		setIcon : function(icon){
			if(!dlg){
				bufferIcon = icon;
				return;
			}
			bufferIcon = undefined;
			if(icon && icon != ''){
				iconEl.removeClass('x-hidden');
				iconEl.replaceClass(iconCls, icon);
				bodyEl.addClass('x-dlg-icon');
				iconCls = icon;
			}else{
				iconEl.replaceClass(iconCls, 'x-hidden');
				bodyEl.removeClass('x-dlg-icon');
				iconCls = '';
			}
			return this;
		},


		progress : function(title, msg, progressText){
			this.show({
				title : title,
				msg : msg,
				buttons: false,
				progress:true,
				closable:false,
				minWidth: this.minProgressWidth,
				progressText: progressText
			});
			return this;
		},


		wait : function(msg, title, config){
			this.show({
				title : title,
				msg : msg,
				buttons: false,
				closable:false,
				wait:true,
				modal:true,
				minWidth: this.minProgressWidth,
				waitConfig: config
			});
			return this;
		},


		alert : function(title, msg, fn, scope){
			this.show({
				title : title,
				msg : msg,
				buttons: this.OK,
				fn: fn,
				scope : scope
			});
			return this;
		},


		confirm : function(title, msg, fn, scope){
			this.show({
				title : title,
				msg : msg,
				buttons: this.YESNO,
				fn: fn,
				scope : scope,
				icon: this.QUESTION
			});
			return this;
		},


		prompt : function(title, msg, fn, scope, multiline, value){
			this.show({
				title : title,
				msg : msg,
				buttons: this.OKCANCEL,
				fn: fn,
				minWidth:250,
				scope : scope,
				prompt:true,
				multiline: multiline,
				value: value
			});
			return this;
		},


		OK : {ok:true},

		CANCEL : {cancel:true},

		OKCANCEL : {ok:true, cancel:true},

		YESNO : {yes:true, no:true},

		YESNOCANCEL : {yes:true, no:true, cancel:true},

		INFO : 'ext-mb-info',

		WARNING : 'ext-mb-warning',

		QUESTION : 'ext-mb-question',

		ERROR : 'ext-mb-error',


		defaultTextHeight : 75,

		maxWidth : 600,

		minWidth : 100,

		minProgressWidth : 250,

		buttonText : {
			ok : "OK",
			cancel : "Cancel",
			yes : "Yes",
			no : "No"
		}
	};
}();


Ext.Msg = Ext.MessageBox;
Ext.dd.PanelProxy = function(panel, config){
	this.panel = panel;
	this.id = this.panel.id +'-ddproxy';
	Ext.apply(this, config);
};

Ext.dd.PanelProxy.prototype = {

	insertProxy : true,


	setStatus : Ext.emptyFn,
	reset : Ext.emptyFn,
	update : Ext.emptyFn,
	stop : Ext.emptyFn,
	sync: Ext.emptyFn,


	getEl : function(){
		return this.ghost;
	},


	getGhost : function(){
		return this.ghost;
	},


	getProxy : function(){
		return this.proxy;
	},


	hide : function(){
		if(this.ghost){
			if(this.proxy){
				this.proxy.remove();
				delete this.proxy;
			}
			this.panel.el.dom.style.display = '';
			this.ghost.remove();
			delete this.ghost;
		}
	},


	show : function(){
		if(!this.ghost){
			this.ghost = this.panel.createGhost(undefined, undefined, Ext.getBody());
			this.ghost.setXY(this.panel.el.getXY())
			if(this.insertProxy){
				this.proxy = this.panel.el.insertSibling({cls:'x-panel-dd-spacer'});
				this.proxy.setSize(this.panel.getSize());
			}
			this.panel.el.dom.style.display = 'none';
		}
	},


	repair : function(xy, callback, scope){
		this.hide();
		if(typeof callback == "function"){
			callback.call(scope || this);
		}
	},


	moveProxy : function(parentNode, before){
		if(this.proxy){
			parentNode.insertBefore(this.proxy.dom, before);
		}
	}
};


Ext.Panel.DD = function(panel, cfg){
	this.panel = panel;
	this.dragData = {panel: panel};
	this.proxy = new Ext.dd.PanelProxy(panel, cfg);
	Ext.Panel.DD.superclass.constructor.call(this, panel.el, cfg);
	var h = panel.header;
	if(h){
		this.setHandleElId(h.id);
	}
	(h ? h : this.panel.body).setStyle('cursor', 'move');
	this.scroll = false;
};

Ext.extend(Ext.Panel.DD, Ext.dd.DragSource, {
	showFrame: Ext.emptyFn,
	startDrag: Ext.emptyFn,
	b4StartDrag: function(x, y) {
		this.proxy.show();
	},
	b4MouseDown: function(e) {
		var x = e.getPageX();
		var y = e.getPageY();
		this.autoOffset(x, y);
	},
	onInitDrag : function(x, y){
		this.onStartDrag(x, y);
		return true;
	},
	createFrame : Ext.emptyFn,
	getDragEl : function(e){
		return this.proxy.ghost.dom;
	},
	endDrag : function(e){
		this.proxy.hide();
		this.panel.saveState();
	},

	autoOffset : function(x, y) {
		x -= this.startPageX;
		y -= this.startPageY;
		this.setDelta(x, y);
	}
});
Ext.state.Provider = function(){

	this.addEvents("statechange");
	this.state = {};
	Ext.state.Provider.superclass.constructor.call(this);
};
Ext.extend(Ext.state.Provider, Ext.util.Observable, {

	get : function(name, defaultValue){
		return typeof this.state[name] == "undefined" ?
			defaultValue : this.state[name];
	},


	clear : function(name){
		delete this.state[name];
		this.fireEvent("statechange", this, name, null);
	},


	set : function(name, value){
		this.state[name] = value;
		this.fireEvent("statechange", this, name, value);
	},


	decodeValue : function(cookie){
		var re = /^(a|n|d|b|s|o)\:(.*)$/;
		var matches = re.exec(unescape(cookie));
		if(!matches || !matches[1]) return;
		var type = matches[1];
		var v = matches[2];
		switch(type){
			case "n":
				return parseFloat(v);
			case "d":
				return new Date(Date.parse(v));
			case "b":
				return (v == "1");
			case "a":
				var all = [];
				if(v != ''){
					Ext.each(v.split('^'), function(val){
						all.push(this.decodeValue(val));
					}, this);
				}
				return all;
			case "o":
				var all = {};
				if(v != ''){
					Ext.each(v.split('^'), function(val){
						var kv = val.split('=');
						all[kv[0]] = this.decodeValue(kv[1]);
					}, this);
				}
				return all;
			default:
				return v;
		}
	},


	encodeValue : function(v){
		var enc;
		if(typeof v == "number"){
			enc = "n:" + v;
		}else if(typeof v == "boolean"){
			enc = "b:" + (v ? "1" : "0");
		}else if(Ext.isDate(v)){
			enc = "d:" + v.toGMTString();
		}else if(Ext.isArray(v)){
			var flat = "";
			for(var i = 0, len = v.length; i < len; i++){
				flat += this.encodeValue(v[i]);
				if(i != len-1) flat += "^";
			}
			enc = "a:" + flat;
		}else if(typeof v == "object"){
			var flat = "";
			for(var key in v){
				if(typeof v[key] != "function" && v[key] !== undefined){
					flat += key + "=" + this.encodeValue(v[key]) + "^";
				}
			}
			enc = "o:" + flat.substring(0, flat.length-1);
		}else{
			enc = "s:" + v;
		}
		return escape(enc);
	}
});

Ext.state.Manager = function(){
	var provider = new Ext.state.Provider();

	return {

		setProvider : function(stateProvider){
			provider = stateProvider;
		},


		get : function(key, defaultValue){
			return provider.get(key, defaultValue);
		},


		set : function(key, value){
			provider.set(key, value);
		},


		clear : function(key){
			provider.clear(key);
		},


		getProvider : function(){
			return provider;
		}
	};
}();

Ext.state.CookieProvider = function(config){
	Ext.state.CookieProvider.superclass.constructor.call(this);
	this.path = "/";
	this.expires = new Date(new Date().getTime()+(1000*60*60*24*7));
	this.domain = null;
	this.secure = false;
	Ext.apply(this, config);
	this.state = this.readCookies();
};

Ext.extend(Ext.state.CookieProvider, Ext.state.Provider, {

	set : function(name, value){
		if(typeof value == "undefined" || value === null){
			this.clear(name);
			return;
		}
		this.setCookie(name, value);
		Ext.state.CookieProvider.superclass.set.call(this, name, value);
	},


	clear : function(name){
		this.clearCookie(name);
		Ext.state.CookieProvider.superclass.clear.call(this, name);
	},


	readCookies : function(){
		var cookies = {};
		var c = document.cookie + ";";
		var re = /\s?(.*?)=(.*?);/g;
		var matches;
		while((matches = re.exec(c)) != null){
			var name = matches[1];
			var value = matches[2];
			if(name && name.substring(0,3) == "ys-"){
				cookies[name.substr(3)] = this.decodeValue(value);
			}
		}
		return cookies;
	},


	setCookie : function(name, value){
		document.cookie = "ys-"+ name + "=" + this.encodeValue(value) +
			((this.expires == null) ? "" : ("; expires=" + this.expires.toGMTString())) +
			((this.path == null) ? "" : ("; path=" + this.path)) +
			((this.domain == null) ? "" : ("; domain=" + this.domain)) +
			((this.secure == true) ? "; secure" : "");
	},


	clearCookie : function(name){
		document.cookie = "ys-" + name + "=null; expires=Thu, 01-Jan-70 00:00:01 GMT" +
			((this.path == null) ? "" : ("; path=" + this.path)) +
			((this.domain == null) ? "" : ("; domain=" + this.domain)) +
			((this.secure == true) ? "; secure" : "");
	}
});
Ext.DataView = Ext.extend(Ext.BoxComponent, {









	selectedClass : "x-view-selected",

	emptyText : "",


	deferEmptyText: true,

	trackOver: false,


	last: false,


	initComponent : function(){
		Ext.DataView.superclass.initComponent.call(this);
		if(Ext.isString(this.tpl) || Ext.isArray(this.tpl)){
			this.tpl = new Ext.XTemplate(this.tpl);
		}

		this.addEvents(

			"beforeclick",

			"click",

			"mouseenter",

			"mouseleave",

			"containerclick",

			"dblclick",

			"contextmenu",

			"containercontextmenu",

			"selectionchange",


			"beforeselect"
		);

		this.store = Ext.StoreMgr.lookup(this.store);
		this.all = new Ext.CompositeElementLite();
		this.selected = new Ext.CompositeElementLite();
	},


	afterRender : function(){
		Ext.DataView.superclass.afterRender.call(this);

		this.mon(this.getTemplateTarget(), {
			"click": this.onClick,
			"dblclick": this.onDblClick,
			"contextmenu": this.onContextMenu,
			scope:this
		});

		if(this.overClass || this.trackOver){
			this.mon(this.getTemplateTarget(), {
				"mouseover": this.onMouseOver,
				"mouseout": this.onMouseOut,
				scope:this
			});
		}

		if(this.store){
			this.bindStore(this.store, true);
		}
	},


	refresh : function(){
		this.clearSelections(false, true);
		var el = this.getTemplateTarget();
		el.update("");
		var records = this.store.getRange();
		if(records.length < 1){
			if(!this.deferEmptyText || this.hasSkippedEmptyText){
				el.update(this.emptyText);
			}
			this.all.clear();
		}else{
			this.tpl.overwrite(el, this.collectData(records, 0));
			this.all.fill(Ext.query(this.itemSelector, el.dom));
			this.updateIndexes(0);
		}
		this.hasSkippedEmptyText = true;
	},

	getTemplateTarget: function(){
		return this.el;
	},


	prepareData : function(data){
		return data;
	},


	collectData : function(records, startIndex){
		var r = [];
		for(var i = 0, len = records.length; i < len; i++){
			r[r.length] = this.prepareData(records[i].data, startIndex+i, records[i]);
		}
		return r;
	},


	bufferRender : function(records){
		var div = document.createElement('div');
		this.tpl.overwrite(div, this.collectData(records));
		return Ext.query(this.itemSelector, div);
	},


	onUpdate : function(ds, record){
		var index = this.store.indexOf(record);
		if(index > -1){
			var sel = this.isSelected(index);
			var original = this.all.elements[index];
			var node = this.bufferRender([record], index)[0];

			this.all.replaceElement(index, node, true);
			if(sel){
				this.selected.replaceElement(original, node);
				this.all.item(index).addClass(this.selectedClass);
			}
			this.updateIndexes(index, index);
		}
	},


	onAdd : function(ds, records, index){
		if(this.all.getCount() === 0){
			this.refresh();
			return;
		}
		var nodes = this.bufferRender(records, index), n, a = this.all.elements;
		if(index < this.all.getCount()){
			n = this.all.item(index).insertSibling(nodes, 'before', true);
			a.splice.apply(a, [index, 0].concat(nodes));
		}else{
			n = this.all.last().insertSibling(nodes, 'after', true);
			a.push.apply(a, nodes);
		}
		this.updateIndexes(index);
	},


	onRemove : function(ds, record, index){
		this.deselect(index);
		this.all.removeElement(index, true);
		this.updateIndexes(index);
		if (this.store.getCount() === 0){
			this.refresh();
		}
	},


	refreshNode : function(index){
		this.onUpdate(this.store, this.store.getAt(index));
	},


	updateIndexes : function(startIndex, endIndex){
		var ns = this.all.elements;
		startIndex = startIndex || 0;
		endIndex = endIndex || ((endIndex === 0) ? 0 : (ns.length - 1));
		for(var i = startIndex; i <= endIndex; i++){
			ns[i].viewIndex = i;
		}
	},


	getStore : function(){
		return this.store;
	},


	bindStore : function(store, initial){
		if(!initial && this.store){
			if(store !== this.store && this.store.autoDestroy){
				this.store.destroy();
			}else{
				this.store.un("beforeload", this.onBeforeLoad, this);
				this.store.un("datachanged", this.refresh, this);
				this.store.un("add", this.onAdd, this);
				this.store.un("remove", this.onRemove, this);
				this.store.un("update", this.onUpdate, this);
				this.store.un("clear", this.refresh, this);
			}
			if(!store){
				this.store = null;
			}
		}
		if(store){
			store = Ext.StoreMgr.lookup(store);
			store.on({
				scope: this,
				beforeload: this.onBeforeLoad,
				datachanged: this.refresh,
				add: this.onAdd,
				remove: this.onRemove,
				update: this.onUpdate,
				clear: this.refresh
			});
		}
		this.store = store;
		if(store){
			this.refresh();
		}
	},


	findItemFromChild : function(node){
		return Ext.fly(node).findParent(this.itemSelector, this.getTemplateTarget());
	},


	onClick : function(e){
		var item = e.getTarget(this.itemSelector, this.getTemplateTarget());
		if(item){
			var index = this.indexOf(item);
			if(this.onItemClick(item, index, e) !== false){
				this.fireEvent("click", this, index, item, e);
			}
		}else{
			if(this.fireEvent("containerclick", this, e) !== false){
				this.onContainerClick(e);
			}
		}
	},

	onContainerClick : function(e){
		this.clearSelections();
	},


	onContextMenu : function(e){
		var item = e.getTarget(this.itemSelector, this.getTemplateTarget());
		if(item){
			this.fireEvent("contextmenu", this, this.indexOf(item), item, e);
		}else{
			this.fireEvent("containercontextmenu", this, e);
		}
	},


	onDblClick : function(e){
		var item = e.getTarget(this.itemSelector, this.getTemplateTarget());
		if(item){
			this.fireEvent("dblclick", this, this.indexOf(item), item, e);
		}
	},


	onMouseOver : function(e){
		var item = e.getTarget(this.itemSelector, this.getTemplateTarget());
		if(item && item !== this.lastItem){
			this.lastItem = item;
			Ext.fly(item).addClass(this.overClass);
			this.fireEvent("mouseenter", this, this.indexOf(item), item, e);
		}
	},


	onMouseOut : function(e){
		if(this.lastItem){
			if(!e.within(this.lastItem, true, true)){
				Ext.fly(this.lastItem).removeClass(this.overClass);
				this.fireEvent("mouseleave", this, this.indexOf(this.lastItem), this.lastItem, e);
				delete this.lastItem;
			}
		}
	},


	onItemClick : function(item, index, e){
		if(this.fireEvent("beforeclick", this, index, item, e) === false){
			return false;
		}
		if(this.multiSelect){
			this.doMultiSelection(item, index, e);
			e.preventDefault();
		}else if(this.singleSelect){
			this.doSingleSelection(item, index, e);
			e.preventDefault();
		}
		return true;
	},


	doSingleSelection : function(item, index, e){
		if(e.ctrlKey && this.isSelected(index)){
			this.deselect(index);
		}else{
			this.select(index, false);
		}
	},


	doMultiSelection : function(item, index, e){
		if(e.shiftKey && this.last !== false){
			var last = this.last;
			this.selectRange(last, index, e.ctrlKey);
			this.last = last;
		}else{
			if((e.ctrlKey||this.simpleSelect) && this.isSelected(index)){
				this.deselect(index);
			}else{
				this.select(index, e.ctrlKey || e.shiftKey || this.simpleSelect);
			}
		}
	},


	getSelectionCount : function(){
		return this.selected.getCount();
	},


	getSelectedNodes : function(){
		return this.selected.elements;
	},


	getSelectedIndexes : function(){
		var indexes = [], s = this.selected.elements;
		for(var i = 0, len = s.length; i < len; i++){
			indexes.push(s[i].viewIndex);
		}
		return indexes;
	},


	getSelectedRecords : function(){
		var r = [], s = this.selected.elements;
		for(var i = 0, len = s.length; i < len; i++){
			r[r.length] = this.store.getAt(s[i].viewIndex);
		}
		return r;
	},


	getRecords : function(nodes){
		var r = [], s = nodes;
		for(var i = 0, len = s.length; i < len; i++){
			r[r.length] = this.store.getAt(s[i].viewIndex);
		}
		return r;
	},


	getRecord : function(node){
		return this.store.getAt(node.viewIndex);
	},


	clearSelections : function(suppressEvent, skipUpdate){
		if((this.multiSelect || this.singleSelect) && this.selected.getCount() > 0){
			if(!skipUpdate){
				this.selected.removeClass(this.selectedClass);
			}
			this.selected.clear();
			this.last = false;
			if(!suppressEvent){
				this.fireEvent("selectionchange", this, this.selected.elements);
			}
		}
	},


	isSelected : function(node){
		return this.selected.contains(this.getNode(node));
	},


	deselect : function(node){
		if(this.isSelected(node)){
			node = this.getNode(node);
			this.selected.removeElement(node);
			if(this.last == node.viewIndex){
				this.last = false;
			}
			Ext.fly(node).removeClass(this.selectedClass);
			this.fireEvent("selectionchange", this, this.selected.elements);
		}
	},


	select : function(nodeInfo, keepExisting, suppressEvent){
		if(Ext.isArray(nodeInfo)){
			if(!keepExisting){
				this.clearSelections(true);
			}
			for(var i = 0, len = nodeInfo.length; i < len; i++){
				this.select(nodeInfo[i], true, true);
			}
			if(!suppressEvent){
				this.fireEvent("selectionchange", this, this.selected.elements);
			}
		} else{
			var node = this.getNode(nodeInfo);
			if(!keepExisting){
				this.clearSelections(true);
			}
			if(node && !this.isSelected(node)){
				if(this.fireEvent("beforeselect", this, node, this.selected.elements) !== false){
					Ext.fly(node).addClass(this.selectedClass);
					this.selected.add(node);
					this.last = node.viewIndex;
					if(!suppressEvent){
						this.fireEvent("selectionchange", this, this.selected.elements);
					}
				}
			}
		}
	},


	selectRange : function(start, end, keepExisting){
		if(!keepExisting){
			this.clearSelections(true);
		}
		this.select(this.getNodes(start, end), true);
	},


	getNode : function(nodeInfo){
		if(Ext.isString(nodeInfo)){
			return document.getElementById(nodeInfo);
		}else if(Ext.isNumber(nodeInfo)){
			return this.all.elements[nodeInfo];
		}
		return nodeInfo;
	},


	getNodes : function(start, end){
		var ns = this.all.elements;
		start = start || 0;
		end = !Ext.isDefined(end) ? Math.max(ns.length - 1, 0) : end;
		var nodes = [], i;
		if(start <= end){
			for(i = start; i <= end && ns[i]; i++){
				nodes.push(ns[i]);
			}
		} else{
			for(i = start; i >= end && ns[i]; i--){
				nodes.push(ns[i]);
			}
		}
		return nodes;
	},


	indexOf : function(node){
		node = this.getNode(node);
		if(Ext.isNumber(node.viewIndex)){
			return node.viewIndex;
		}
		return this.all.indexOf(node);
	},


	onBeforeLoad : function(){
		if(this.loadingText){
			this.clearSelections(false, true);
			this.getTemplateTarget().update('<div class="loading-indicator">'+this.loadingText+'</div>');
			this.all.clear();
		}
	},

	onDestroy : function(){
		this.all.clear();
		this.selected.clear();
		Ext.DataView.superclass.onDestroy.call(this);
		this.bindStore(null);
	}
});


Ext.DataView.prototype.setStore = Ext.DataView.prototype.bindStore;

Ext.reg('dataview', Ext.DataView);

Ext.list.ListView = Ext.extend(Ext.DataView, {



	itemSelector: 'dl',

	selectedClass:'x-list-selected',

	overClass:'x-list-over',


	scrollOffset : undefined,

	columnResize: true,


	columnSort: true,



	maxWidth: Ext.isIE ? 99 : 100,

	initComponent : function(){
		if(this.columnResize){
			this.colResizer = new Ext.list.ColumnResizer(this.colResizer);
			this.colResizer.init(this);
		}
		if(this.columnSort){
			this.colSorter = new Ext.list.Sorter(this.columnSort);
			this.colSorter.init(this);
		}
		if(!this.internalTpl){
			this.internalTpl = new Ext.XTemplate(
				'<div class="x-list-header"><div class="x-list-header-inner">',
				'<tpl for="columns">',
				'<div style="width:{[values.width*100]}%;text-align:{align};"><em unselectable="on" id="',this.id, '-xlhd-{#}">',
				'{header}',
				'</em></div>',
				'</tpl>',
				'<div class="x-clear"></div>',
				'</div></div>',
				'<div class="x-list-body"><div class="x-list-body-inner">',
				'</div></div>'
			);
		}
		if(!this.tpl){
			this.tpl = new Ext.XTemplate(
				'<tpl for="rows">',
				'<dl>',
				'<tpl for="parent.columns">',
				'<dt style="width:{[values.width*100]}%;text-align:{align};">',
				'<em unselectable="on"<tpl if="cls"> class="{cls}</tpl>">',
				'{[values.tpl.apply(parent)]}',
				'</em></dt>',
				'</tpl>',
				'<div class="x-clear"></div>',
				'</dl>',
				'</tpl>'
			);
		};

		var cs = this.columns,
			allocatedWidth = 0,
			colsWithWidth = 0,
			len = cs.length,
			columns = [];

		for(var i = 0; i < len; i++){
			var c = cs[i];
			if(!c.isColumn) {
				c.xtype = c.xtype ? (/^lv/.test(c.xtype) ? c.xtype : 'lv' + c.xtype) : 'lvcolumn';
				c = Ext.create(c);
			}
			if(c.width) {
				allocatedWidth += c.width*100;
				colsWithWidth++;
			}
			columns.push(c);
		}

		cs = this.columns = columns;


		if(colsWithWidth < len){
			var remaining = len - colsWithWidth;
			if(allocatedWidth < this.maxWidth){
				var perCol = ((this.maxWidth-allocatedWidth) / remaining)/100;
				for(var j = 0; j < len; j++){
					var c = cs[j];
					if(!c.width){
						c.width = perCol;
					}
				}
			}
		}
		Ext.list.ListView.superclass.initComponent.call(this);
	},

	onRender : function(){
		this.autoEl = {
			cls: 'x-list-wrap'
		};
		Ext.list.ListView.superclass.onRender.apply(this, arguments);

		this.internalTpl.overwrite(this.el, {columns: this.columns});

		this.innerBody = Ext.get(this.el.dom.childNodes[1].firstChild);
		this.innerHd = Ext.get(this.el.dom.firstChild.firstChild);

		if(this.hideHeaders){
			this.el.dom.firstChild.style.display = 'none';
		}
	},

	getTemplateTarget : function(){
		return this.innerBody;
	},


	collectData : function(){
		var rs = Ext.list.ListView.superclass.collectData.apply(this, arguments);
		return {
			columns: this.columns,
			rows: rs
		}
	},

	verifyInternalSize : function(){
		if(this.lastSize){
			this.onResize(this.lastSize.width, this.lastSize.height);
		}
	},


	onResize : function(w, h){
		var bd = this.innerBody.dom;
		var hd = this.innerHd.dom
		if(!bd){
			return;
		}
		var bdp = bd.parentNode;
		if(Ext.isNumber(w)){
			var sw = w - Ext.num(this.scrollOffset, Ext.getScrollBarWidth());
			if(this.reserveScrollOffset || ((bdp.offsetWidth - bdp.clientWidth) > 10)){
				bd.style.width = sw + 'px';
				hd.style.width = sw + 'px';
			}else{
				bd.style.width = w + 'px';
				hd.style.width = w + 'px';
				setTimeout(function(){
					if((bdp.offsetWidth - bdp.clientWidth) > 10){
						bd.style.width = sw + 'px';
						hd.style.width = sw + 'px';
					}
				}, 10);
			}
		}
		if(Ext.isNumber(h)){
			bdp.style.height = (h - hd.parentNode.offsetHeight) + 'px';
		}
	},

	updateIndexes : function(){
		Ext.list.ListView.superclass.updateIndexes.apply(this, arguments);
		this.verifyInternalSize();
	},

	findHeaderIndex : function(hd){
		hd = hd.dom || hd;
		var pn = hd.parentNode, cs = pn.parentNode.childNodes;
		for(var i = 0, c; c = cs[i]; i++){
			if(c == pn){
				return i;
			}
		}
		return -1;
	},

	setHdWidths : function(){
		var els = this.innerHd.dom.getElementsByTagName('div');
		for(var i = 0, cs = this.columns, len = cs.length; i < len; i++){
			els[i].style.width = (cs[i].width*100) + '%';
		}
	}
});

Ext.reg('listview', Ext.list.ListView);


Ext.ListView = Ext.list.ListView;
Ext.list.Column = Ext.extend(Object, {

	isColumn: true,


	align: 'left',

	header: '',


	width: null,


	cls: '',





	constructor : function(c){
		if(!c.tpl){
			c.tpl = new Ext.XTemplate('{' + c.dataIndex + '}');
		}
		else if(Ext.isString(c.tpl)){
			c.tpl = new Ext.XTemplate(c.tpl);
		}

		Ext.apply(this, c);
	}
});

Ext.reg('lvcolumn', Ext.list.Column);


Ext.list.NumberColumn = Ext.extend(Ext.list.Column, {

	format: '0,000.00',

	constructor : function(c) {
		c.tpl = c.tpl || new Ext.XTemplate('{' + c.dataIndex + ':number("' + (c.format || this.format) + '")}');
		Ext.list.NumberColumn.superclass.constructor.call(this, c);
	}
});

Ext.reg('lvnumbercolumn', Ext.list.NumberColumn);


Ext.list.DateColumn = Ext.extend(Ext.list.Column, {
	format: 'm/d/Y',
	constructor : function(c) {
		c.tpl = c.tpl || new Ext.XTemplate('{' + c.dataIndex + ':date("' + (c.format || this.format) + '")}');
		Ext.list.DateColumn.superclass.constructor.call(this, c);
	}
});
Ext.reg('lvdatecolumn', Ext.list.DateColumn);


Ext.list.BooleanColumn = Ext.extend(Ext.list.Column, {

	trueText: 'true',

	falseText: 'false',

	undefinedText: '&#160;',

	constructor : function(c) {
		c.tpl = c.tpl || new Ext.XTemplate('{' + c.dataIndex + ':this.format}');

		var t = this.trueText, f = this.falseText, u = this.undefinedText;
		c.tpl.format = function(v){
			if(v === undefined){
				return u;
			}
			if(!v || v === 'false'){
				return f;
			}
			return t;
		};

		Ext.list.DateColumn.superclass.constructor.call(this, c);
	}
});

Ext.reg('lvbooleancolumn', Ext.list.BooleanColumn);
Ext.list.ColumnResizer = Ext.extend(Ext.util.Observable, {

	minPct: .05,

	constructor: function(config){
		Ext.apply(this, config);
		Ext.list.ColumnResizer.superclass.constructor.call(this);
	},
	init : function(listView){
		this.view = listView;
		listView.on('render', this.initEvents, this);
	},

	initEvents : function(view){
		view.mon(view.innerHd, 'mousemove', this.handleHdMove, this);
		this.tracker = new Ext.dd.DragTracker({
			onBeforeStart: this.onBeforeStart.createDelegate(this),
			onStart: this.onStart.createDelegate(this),
			onDrag: this.onDrag.createDelegate(this),
			onEnd: this.onEnd.createDelegate(this),
			tolerance: 3,
			autoStart: 300
		});
		this.tracker.initEl(view.innerHd);
		view.on('beforedestroy', this.tracker.destroy, this.tracker);
	},

	handleHdMove : function(e, t){
		var hw = 5,
			x = e.getPageX(),
			hd = e.getTarget('em', 3, true);
		if(hd){
			var r = hd.getRegion(),
				ss = hd.dom.style,
				pn = hd.dom.parentNode;

			if(x - r.left <= hw && pn != pn.parentNode.firstChild){
				this.activeHd = Ext.get(pn.previousSibling.firstChild);
				ss.cursor = Ext.isWebKit ? 'e-resize' : 'col-resize';
			} else if(r.right - x <= hw && pn != pn.parentNode.lastChild.previousSibling){
				this.activeHd = hd;
				ss.cursor = Ext.isWebKit ? 'w-resize' : 'col-resize';
			} else{
				delete this.activeHd;
				ss.cursor = '';
			}
		}
	},

	onBeforeStart : function(e){
		this.dragHd = this.activeHd;
		return !!this.dragHd;
	},

	onStart: function(e){
		this.view.disableHeaders = true;
		this.proxy = this.view.el.createChild({cls:'x-list-resizer'});
		this.proxy.setHeight(this.view.el.getHeight());

		var x = this.tracker.getXY()[0],
			w = this.view.innerHd.getWidth();

		this.hdX = this.dragHd.getX();
		this.hdIndex = this.view.findHeaderIndex(this.dragHd);

		this.proxy.setX(this.hdX);
		this.proxy.setWidth(x-this.hdX);

		this.minWidth = w*this.minPct;
		this.maxWidth = w - (this.minWidth*(this.view.columns.length-1-this.hdIndex));
	},

	onDrag: function(e){
		var cursorX = this.tracker.getXY()[0];
		this.proxy.setWidth((cursorX-this.hdX).constrain(this.minWidth, this.maxWidth));
	},

	onEnd: function(e){

		var nw = this.proxy.getWidth();
		this.proxy.remove();

		var index = this.hdIndex,
			vw = this.view,
			cs = vw.columns,
			len = cs.length,
			w = this.view.innerHd.getWidth(),
			minPct = this.minPct * 100,
			pct = Math.ceil((nw * vw.maxWidth) / w),
			diff = (cs[index].width * 100) - pct,
			each = Math.floor(diff / (len-1-index)),
			mod = diff - (each * (len-1-index));

		for(var i = index+1; i < len; i++){
			var cw = (cs[i].width * 100) + each,
				ncw = Math.max(minPct, cw);
			if(cw != ncw){
				mod += cw - ncw;
			}
			cs[i].width = ncw / 100;
		}
		cs[index].width = pct / 100;
		cs[index+1].width += (mod / 100);
		delete this.dragHd;
		vw.setHdWidths();
		vw.refresh();
		setTimeout(function(){
			vw.disableHeaders = false;
		}, 100);
	}
});


Ext.ListView.ColumnResizer = Ext.list.ColumnResizer;
Ext.list.Sorter = Ext.extend(Ext.util.Observable, {

	sortClasses : ["sort-asc", "sort-desc"],

	constructor: function(config){
		Ext.apply(this, config);
		Ext.list.Sorter.superclass.constructor.call(this);
	},

	init : function(listView){
		this.view = listView;
		listView.on('render', this.initEvents, this);
	},

	initEvents : function(view){
		view.mon(view.innerHd, 'click', this.onHdClick, this);
		view.innerHd.setStyle('cursor', 'pointer');
		view.mon(view.store, 'datachanged', this.updateSortState, this);
		this.updateSortState.defer(10, this, [view.store]);
	},

	updateSortState : function(store){
		var state = store.getSortState();
		if(!state){
			return;
		}
		this.sortState = state;
		var cs = this.view.columns, sortColumn = -1;
		for(var i = 0, len = cs.length; i < len; i++){
			if(cs[i].dataIndex == state.field){
				sortColumn = i;
				break;
			}
		}
		if(sortColumn != -1){
			var sortDir = state.direction;
			this.updateSortIcon(sortColumn, sortDir);
		}
	},

	updateSortIcon : function(col, dir){
		var sc = this.sortClasses;
		var hds = this.view.innerHd.select('em').removeClass(sc);
		hds.item(col).addClass(sc[dir == "DESC" ? 1 : 0]);
	},

	onHdClick : function(e){
		var hd = e.getTarget('em', 3);
		if(hd && !this.view.disableHeaders){
			var index = this.view.findHeaderIndex(hd);
			this.view.store.sort(this.view.columns[index].dataIndex);
		}
	}
});


Ext.ListView.Sorter = Ext.list.Sorter;
Ext.TabPanel = Ext.extend(Ext.Panel,  {



	monitorResize : true,

	deferredRender : true,

	tabWidth : 120,

	minTabWidth : 30,

	resizeTabs : false,

	enableTabScroll : false,

	scrollIncrement : 0,

	scrollRepeatInterval : 400,

	scrollDuration : 0.35,

	animScroll : true,

	tabPosition : 'top',

	baseCls : 'x-tab-panel',

	autoTabs : false,

	autoTabSelector : 'div.x-tab',

	activeTab : undefined,

	tabMargin : 2,

	plain : false,

	wheelIncrement : 20,


	idDelimiter : '__',


	itemCls : 'x-tab-item',


	elements : 'body',
	headerAsText : false,
	frame : false,
	hideBorders :true,


	initComponent : function(){
		this.frame = false;
		Ext.TabPanel.superclass.initComponent.call(this);
		this.addEvents(

			'beforetabchange',

			'tabchange',

			'contextmenu'
		);

		this.setLayout(new Ext.layout.CardLayout(Ext.apply({
			layoutOnCardChange: this.layoutOnTabChange,
			deferredRender: this.deferredRender
		}, this.layoutConfig)));

		if(this.tabPosition == 'top'){
			this.elements += ',header';
			this.stripTarget = 'header';
		}else {
			this.elements += ',footer';
			this.stripTarget = 'footer';
		}
		if(!this.stack){
			this.stack = Ext.TabPanel.AccessStack();
		}
		this.initItems();
	},


	onRender : function(ct, position){
		Ext.TabPanel.superclass.onRender.call(this, ct, position);

		if(this.plain){
			var pos = this.tabPosition == 'top' ? 'header' : 'footer';
			this[pos].addClass('x-tab-panel-'+pos+'-plain');
		}

		var st = this[this.stripTarget];

		this.stripWrap = st.createChild({cls:'x-tab-strip-wrap', cn:{
			tag:'ul', cls:'x-tab-strip x-tab-strip-'+this.tabPosition}});

		var beforeEl = (this.tabPosition=='bottom' ? this.stripWrap : null);
		st.createChild({cls:'x-tab-strip-spacer'}, beforeEl);
		this.strip = new Ext.Element(this.stripWrap.dom.firstChild);


		this.edge = this.strip.createChild({tag:'li', cls:'x-tab-edge', cn: [{tag: 'span', cls: 'x-tab-strip-text', cn: '&#160;'}]});
		this.strip.createChild({cls:'x-clear'});

		this.body.addClass('x-tab-panel-body-'+this.tabPosition);


		if(!this.itemTpl){
			var tt = new Ext.Template(
				'<li class="{cls}" id="{id}"><a class="x-tab-strip-close"></a>',
				'<a class="x-tab-right" href="#"><em class="x-tab-left">',
				'<span class="x-tab-strip-inner"><span class="x-tab-strip-text {iconCls}">{text}</span></span>',
				'</em></a></li>'
			);
			tt.disableFormats = true;
			tt.compile();
			Ext.TabPanel.prototype.itemTpl = tt;
		}

		this.items.each(this.initTab, this);
	},


	afterRender : function(){
		Ext.TabPanel.superclass.afterRender.call(this);
		if(this.autoTabs){
			this.readTabs(false);
		}
		if(this.activeTab !== undefined){
			var item = Ext.isObject(this.activeTab) ? this.activeTab : this.items.get(this.activeTab);
			delete this.activeTab;
			this.setActiveTab(item);
		}
	},


	initEvents : function(){
		Ext.TabPanel.superclass.initEvents.call(this);
		this.mon(this.strip, {
			scope: this,
			mousedown: this.onStripMouseDown,
			contextmenu: this.onStripContextMenu
		});
		if(this.enableTabScroll){
			this.mon(this.strip, 'mousewheel', this.onWheel, this);
		}
	},


	findTargets : function(e){
		var item = null;
		var itemEl = e.getTarget('li', this.strip);
		if(itemEl){
			item = this.getComponent(itemEl.id.split(this.idDelimiter)[1]);
			if(item.disabled){
				return {
					close : null,
					item : null,
					el : null
				};
			}
		}
		return {
			close : e.getTarget('.x-tab-strip-close', this.strip),
			item : item,
			el : itemEl
		};
	},


	onStripMouseDown : function(e){
		if(e.button !== 0){
			return;
		}
		e.preventDefault();
		var t = this.findTargets(e);
		if(t.close){
			if (t.item.fireEvent('beforeclose', t.item) !== false) {
				t.item.fireEvent('close', t.item);
				this.remove(t.item);
			}
			return;
		}
		if(t.item && t.item != this.activeTab){
			this.setActiveTab(t.item);
		}
	},


	onStripContextMenu : function(e){
		e.preventDefault();
		var t = this.findTargets(e);
		if(t.item){
			this.fireEvent('contextmenu', this, t.item, e);
		}
	},


	readTabs : function(removeExisting){
		if(removeExisting === true){
			this.items.each(function(item){
				this.remove(item);
			}, this);
		}
		var tabs = this.el.query(this.autoTabSelector);
		for(var i = 0, len = tabs.length; i < len; i++){
			var tab = tabs[i],
				title = tab.getAttribute('title');
			tab.removeAttribute('title');
			this.add({
				title: title,
				contentEl: tab
			});
		}
	},


	initTab : function(item, index){
		var before = this.strip.dom.childNodes[index],
			p = this.getTemplateArgs(item),
			el = before ?
				this.itemTpl.insertBefore(before, p) :
				this.itemTpl.append(this.strip, p),
			cls = 'x-tab-strip-over',
			tabEl = Ext.get(el);

		tabEl.hover(function(){
			if(!item.disabled){
				tabEl.addClass(cls);
			}
		}, function(){
			tabEl.removeClass(cls);
		});

		if(item.tabTip){
			tabEl.child('span.x-tab-strip-text', true).qtip = item.tabTip;
		}
		item.tabEl = el;


		tabEl.select('a').on('click', function(e){
			if(!e.getPageX()){
				this.onStripMouseDown(e);
			}
		}, this, {preventDefault: true});

		item.on({
			scope: this,
			disable: this.onItemDisabled,
			enable: this.onItemEnabled,
			titlechange: this.onItemTitleChanged,
			iconchange: this.onItemIconChanged,
			beforeshow: this.onBeforeShowItem
		});
	},




	getTemplateArgs : function(item) {
		var cls = item.closable ? 'x-tab-strip-closable' : '';
		if(item.disabled){
			cls += ' x-item-disabled';
		}
		if(item.iconCls){
			cls += ' x-tab-with-icon';
		}
		if(item.tabCls){
			cls += ' ' + item.tabCls;
		}

		return {
			id: this.id + this.idDelimiter + item.getItemId(),
			text: item.title,
			cls: cls,
			iconCls: item.iconCls || ''
		};
	},


	onAdd : function(c){
		Ext.TabPanel.superclass.onAdd.call(this, c);
		if(this.rendered){
			var items = this.items;
			this.initTab(c, items.indexOf(c));
			if(items.getCount() == 1){
				this.syncSize();
			}
			this.delegateUpdates();
		}
	},


	onBeforeAdd : function(item){
		var existing = item.events ? (this.items.containsKey(item.getItemId()) ? item : null) : this.items.get(item);
		if(existing){
			this.setActiveTab(item);
			return false;
		}
		Ext.TabPanel.superclass.onBeforeAdd.apply(this, arguments);
		var es = item.elements;
		item.elements = es ? es.replace(',header', '') : es;
		item.border = (item.border === true);
	},


	onRemove : function(c){
		var te = Ext.get(c.tabEl);

		if(te){
			te.select('a').removeAllListeners();
			Ext.destroy(te);
		}
		Ext.TabPanel.superclass.onRemove.call(this, c);
		this.stack.remove(c);
		delete c.tabEl;
		c.un('disable', this.onItemDisabled, this);
		c.un('enable', this.onItemEnabled, this);
		c.un('titlechange', this.onItemTitleChanged, this);
		c.un('iconchange', this.onItemIconChanged, this);
		c.un('beforeshow', this.onBeforeShowItem, this);
		if(c == this.activeTab){
			var next = this.stack.next();
			if(next){
				this.setActiveTab(next);
			}else if(this.items.getCount() > 0){
				this.setActiveTab(0);
			}else{
				this.setActiveTab(null);
			}
		}
		if(!this.destroying){
			this.delegateUpdates();
		}
	},


	onBeforeShowItem : function(item){
		if(item != this.activeTab){
			this.setActiveTab(item);
			return false;
		}
	},


	onItemDisabled : function(item){
		var el = this.getTabEl(item);
		if(el){
			Ext.fly(el).addClass('x-item-disabled');
		}
		this.stack.remove(item);
	},


	onItemEnabled : function(item){
		var el = this.getTabEl(item);
		if(el){
			Ext.fly(el).removeClass('x-item-disabled');
		}
	},


	onItemTitleChanged : function(item){
		var el = this.getTabEl(item);
		if(el){
			Ext.fly(el).child('span.x-tab-strip-text', true).innerHTML = item.title;
		}
	},


	onItemIconChanged : function(item, iconCls, oldCls){
		var el = this.getTabEl(item);
		if(el){
			el = Ext.get(el);
			el.child('span.x-tab-strip-text').replaceClass(oldCls, iconCls);
			el[Ext.isEmpty(iconCls) ? 'removeClass' : 'addClass']('x-tab-with-icon');
		}
	},


	getTabEl : function(item){
		var c = this.getComponent(item);
		return c ? c.tabEl : null;
	},


	onResize : function(){
		Ext.TabPanel.superclass.onResize.apply(this, arguments);
		this.delegateUpdates();
	},


	beginUpdate : function(){
		this.suspendUpdates = true;
	},


	endUpdate : function(){
		this.suspendUpdates = false;
		this.delegateUpdates();
	},


	hideTabStripItem : function(item){
		item = this.getComponent(item);
		var el = this.getTabEl(item);
		if(el){
			el.style.display = 'none';
			this.delegateUpdates();
		}
		this.stack.remove(item);
	},


	unhideTabStripItem : function(item){
		item = this.getComponent(item);
		var el = this.getTabEl(item);
		if(el){
			el.style.display = '';
			this.delegateUpdates();
		}
	},


	delegateUpdates : function(){
		if(this.suspendUpdates){
			return;
		}
		if(this.resizeTabs && this.rendered){
			this.autoSizeTabs();
		}
		if(this.enableTabScroll && this.rendered){
			this.autoScrollTabs();
		}
	},


	autoSizeTabs : function(){
		var count = this.items.length,
			ce = this.tabPosition != 'bottom' ? 'header' : 'footer',
			ow = this[ce].dom.offsetWidth,
			aw = this[ce].dom.clientWidth;

		if(!this.resizeTabs || count < 1 || !aw){
			return;
		}

		var each = Math.max(Math.min(Math.floor((aw-4) / count) - this.tabMargin, this.tabWidth), this.minTabWidth);
		this.lastTabWidth = each;
		var lis = this.strip.query("li:not([className^=x-tab-edge])");
		for(var i = 0, len = lis.length; i < len; i++) {
			var li = lis[i],
				inner = Ext.fly(li).child('.x-tab-strip-inner', true),
				tw = li.offsetWidth,
				iw = inner.offsetWidth;
			inner.style.width = (each - (tw-iw)) + 'px';
		}
	},


	adjustBodyWidth : function(w){
		if(this.header){
			this.header.setWidth(w);
		}
		if(this.footer){
			this.footer.setWidth(w);
		}
		return w;
	},


	setActiveTab : function(item){
		item = this.getComponent(item);
		if(this.fireEvent('beforetabchange', this, item, this.activeTab) === false){
			return;
		}
		if(!this.rendered){
			this.activeTab = item;
			return;
		}
		if(this.activeTab != item){
			if(this.activeTab){
				var oldEl = this.getTabEl(this.activeTab);
				if(oldEl){
					Ext.fly(oldEl).removeClass('x-tab-strip-active');
				}
			}
			if(item){
				var el = this.getTabEl(item);
				Ext.fly(el).addClass('x-tab-strip-active');
				this.activeTab = item;
				this.stack.add(item);

				this.layout.setActiveItem(item);
				if(this.scrolling){
					this.scrollToTab(item, this.animScroll);
				}
			}
			this.fireEvent('tabchange', this, item);
		}
	},


	getActiveTab : function(){
		return this.activeTab || null;
	},


	getItem : function(item){
		return this.getComponent(item);
	},


	autoScrollTabs : function(){
		this.pos = this.tabPosition=='bottom' ? this.footer : this.header;
		var count = this.items.length,
			ow = this.pos.dom.offsetWidth,
			tw = this.pos.dom.clientWidth,
			wrap = this.stripWrap,
			wd = wrap.dom,
			cw = wd.offsetWidth,
			pos = this.getScrollPos(),
			l = this.edge.getOffsetsTo(this.stripWrap)[0] + pos;

		if(!this.enableTabScroll || count < 1 || cw < 20){
			return;
		}
		if(l <= tw){
			wd.scrollLeft = 0;
			wrap.setWidth(tw);
			if(this.scrolling){
				this.scrolling = false;
				this.pos.removeClass('x-tab-scrolling');
				this.scrollLeft.hide();
				this.scrollRight.hide();

				if(Ext.isAir || Ext.isWebKit){
					wd.style.marginLeft = '';
					wd.style.marginRight = '';
				}
			}
		}else{
			if(!this.scrolling){
				this.pos.addClass('x-tab-scrolling');

				if(Ext.isAir || Ext.isWebKit){
					wd.style.marginLeft = '18px';
					wd.style.marginRight = '18px';
				}
			}
			tw -= wrap.getMargins('lr');
			wrap.setWidth(tw > 20 ? tw : 20);
			if(!this.scrolling){
				if(!this.scrollLeft){
					this.createScrollers();
				}else{
					this.scrollLeft.show();
					this.scrollRight.show();
				}
			}
			this.scrolling = true;
			if(pos > (l-tw)){
				wd.scrollLeft = l-tw;
			}else{
				this.scrollToTab(this.activeTab, false);
			}
			this.updateScrollButtons();
		}
	},


	createScrollers : function(){
		this.pos.addClass('x-tab-scrolling-' + this.tabPosition);
		var h = this.stripWrap.dom.offsetHeight;


		var sl = this.pos.insertFirst({
			cls:'x-tab-scroller-left'
		});
		sl.setHeight(h);
		sl.addClassOnOver('x-tab-scroller-left-over');
		this.leftRepeater = new Ext.util.ClickRepeater(sl, {
			interval : this.scrollRepeatInterval,
			handler: this.onScrollLeft,
			scope: this
		});
		this.scrollLeft = sl;


		var sr = this.pos.insertFirst({
			cls:'x-tab-scroller-right'
		});
		sr.setHeight(h);
		sr.addClassOnOver('x-tab-scroller-right-over');
		this.rightRepeater = new Ext.util.ClickRepeater(sr, {
			interval : this.scrollRepeatInterval,
			handler: this.onScrollRight,
			scope: this
		});
		this.scrollRight = sr;
	},


	getScrollWidth : function(){
		return this.edge.getOffsetsTo(this.stripWrap)[0] + this.getScrollPos();
	},


	getScrollPos : function(){
		return parseInt(this.stripWrap.dom.scrollLeft, 10) || 0;
	},


	getScrollArea : function(){
		return parseInt(this.stripWrap.dom.clientWidth, 10) || 0;
	},


	getScrollAnim : function(){
		return {duration:this.scrollDuration, callback: this.updateScrollButtons, scope: this};
	},


	getScrollIncrement : function(){
		return this.scrollIncrement || (this.resizeTabs ? this.lastTabWidth+2 : 100);
	},



	scrollToTab : function(item, animate){
		if(!item){
			return;
		}
		var el = this.getTabEl(item),
			pos = this.getScrollPos(),
			area = this.getScrollArea(),
			left = Ext.fly(el).getOffsetsTo(this.stripWrap)[0] + pos,
			right = left + el.offsetWidth;
		if(left < pos){
			this.scrollTo(left, animate);
		}else if(right > (pos + area)){
			this.scrollTo(right - area, animate);
		}
	},


	scrollTo : function(pos, animate){
		this.stripWrap.scrollTo('left', pos, animate ? this.getScrollAnim() : false);
		if(!animate){
			this.updateScrollButtons();
		}
	},

	onWheel : function(e){
		var d = e.getWheelDelta()*this.wheelIncrement*-1;
		e.stopEvent();

		var pos = this.getScrollPos(),
			newpos = pos + d,
			sw = this.getScrollWidth()-this.getScrollArea();

		var s = Math.max(0, Math.min(sw, newpos));
		if(s != pos){
			this.scrollTo(s, false);
		}
	},


	onScrollRight : function(){
		var sw = this.getScrollWidth()-this.getScrollArea(),
			pos = this.getScrollPos(),
			s = Math.min(sw, pos + this.getScrollIncrement());
		if(s != pos){
			this.scrollTo(s, this.animScroll);
		}
	},


	onScrollLeft : function(){
		var pos = this.getScrollPos(),
			s = Math.max(0, pos - this.getScrollIncrement());
		if(s != pos){
			this.scrollTo(s, this.animScroll);
		}
	},


	updateScrollButtons : function(){
		var pos = this.getScrollPos();
		this.scrollLeft[pos === 0 ? 'addClass' : 'removeClass']('x-tab-scroller-left-disabled');
		this.scrollRight[pos >= (this.getScrollWidth()-this.getScrollArea()) ? 'addClass' : 'removeClass']('x-tab-scroller-right-disabled');
	},


	beforeDestroy : function() {
		Ext.destroy(this.leftRepeater, this.rightRepeater);
		this.deleteMembers('strip', 'edge', 'scrollLeft', 'scrollRight', 'stripWrap');
		this.activeTab = null;
		Ext.TabPanel.superclass.beforeDestroy.apply(this);
	}













});
Ext.reg('tabpanel', Ext.TabPanel);


Ext.TabPanel.prototype.activate = Ext.TabPanel.prototype.setActiveTab;


Ext.TabPanel.AccessStack = function(){
	var items = [];
	return {
		add : function(item){
			items.push(item);
			if(items.length > 10){
				items.shift();
			}
		},

		remove : function(item){
			var s = [];
			for(var i = 0, len = items.length; i < len; i++) {
				if(items[i] != item){
					s.push(items[i]);
				}
			}
			items = s;
		},

		next : function(){
			return items.pop();
		}
	};
};

Ext.Button = Ext.extend(Ext.BoxComponent, {

	hidden : false,

	disabled : false,

	pressed : false,






	enableToggle : false,



	menuAlign : 'tl-bl?',




	type : 'button',


	menuClassTarget : 'tr:nth(2)',


	clickEvent : 'click',


	handleMouseEvents : true,


	tooltipType : 'qtip',


	buttonSelector : 'button:first-child',


	scale : 'small',




	iconAlign : 'left',


	arrowAlign : 'right',





	initComponent : function(){
		Ext.Button.superclass.initComponent.call(this);

		this.addEvents(

			'click',

			'toggle',

			'mouseover',

			'mouseout',

			'menushow',

			'menuhide',

			'menutriggerover',

			'menutriggerout'
		);
		if(this.menu){
			this.menu = Ext.menu.MenuMgr.get(this.menu);
		}
		if(Ext.isString(this.toggleGroup)){
			this.enableToggle = true;
		}
	},


	getTemplateArgs : function(){
		return [this.type, 'x-btn-' + this.scale + ' x-btn-icon-' + this.scale + '-' + this.iconAlign, this.getMenuClass(), this.cls, this.id];
	},


	setButtonClass : function(){
		if(this.useSetClass){
			if(!Ext.isEmpty(this.oldCls)){
				this.el.removeClass([this.oldCls, 'x-btn-pressed']);
			}
			this.oldCls = (this.iconCls || this.icon) ? (this.text ? ' x-btn-text-icon' : ' x-btn-icon') : ' x-btn-noicon';
			this.el.addClass([this.oldCls, this.pressed ? 'x-btn-pressed' : null]);
		}
	},


	getMenuClass : function(){
		return this.menu ? (this.arrowAlign != 'bottom' ? 'x-btn-arrow' : 'x-btn-arrow-bottom') : '';
	},


	onRender : function(ct, position){
		if(!this.template){
			if(!Ext.Button.buttonTemplate){

				Ext.Button.buttonTemplate = new Ext.Template(
					'<table id="{4}" cellspacing="0" class="x-btn {3}"><tbody class="{1}">',
					'<tr><td class="x-btn-tl"><i>&#160;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&#160;</i></td></tr>',
					'<tr><td class="x-btn-ml"><i>&#160;</i></td><td class="x-btn-mc"><em class="{2}" unselectable="on"><button type="{0}"></button></em></td><td class="x-btn-mr"><i>&#160;</i></td></tr>',
					'<tr><td class="x-btn-bl"><i>&#160;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&#160;</i></td></tr>',
					'</tbody></table>');
				Ext.Button.buttonTemplate.compile();
			}
			this.template = Ext.Button.buttonTemplate;
		}

		var btn, targs = this.getTemplateArgs();

		if(position){
			btn = this.template.insertBefore(position, targs, true);
		}else{
			btn = this.template.append(ct, targs, true);
		}

		this.btnEl = btn.child(this.buttonSelector);
		this.mon(this.btnEl, {
			scope: this,
			focus: this.onFocus,
			blur: this.onBlur
		});

		this.initButtonEl(btn, this.btnEl);

		Ext.ButtonToggleMgr.register(this);
	},


	initButtonEl : function(btn, btnEl){
		this.el = btn;
		this.setIcon(this.icon);
		this.setText(this.text);
		this.setIconClass(this.iconCls);
		if(Ext.isDefined(this.tabIndex)){
			btnEl.dom.tabIndex = this.tabIndex;
		}
		if(this.tooltip){
			this.setTooltip(this.tooltip, true);
		}

		if(this.handleMouseEvents){
			this.mon(btn, {
				scope: this,
				mouseover: this.onMouseOver,
				mousedown: this.onMouseDown
			});



		}

		if(this.menu){
			this.mon(this.menu, {
				scope: this,
				show: this.onMenuShow,
				hide: this.onMenuHide
			});
		}

		if(this.repeat){
			var repeater = new Ext.util.ClickRepeater(btn, Ext.isObject(this.repeat) ? this.repeat : {});
			this.mon(repeater, 'click', this.onClick, this);
		}
		this.mon(btn, this.clickEvent, this.onClick, this);
	},


	afterRender : function(){
		Ext.Button.superclass.afterRender.call(this);
		this.useSetClass = true;
		this.setButtonClass();
		this.doc = Ext.getDoc();
		this.doAutoWidth();
	},


	setIconClass : function(cls){
		this.iconCls = cls;
		if(this.el){
			this.btnEl.dom.className = '';
			this.btnEl.addClass(['x-btn-text', cls || '']);
			this.setButtonClass();
		}
		return this;
	},


	setTooltip : function(tooltip,  initial){
		if(this.rendered){
			if(!initial){
				this.clearTip();
			}
			if(Ext.isObject(tooltip)){
				Ext.QuickTips.register(Ext.apply({
					target: this.btnEl.id
				}, tooltip));
				this.tooltip = tooltip;
			}else{
				this.btnEl.dom[this.tooltipType] = tooltip;
			}
		}else{
			this.tooltip = tooltip;
		}
		return this;
	},


	clearTip : function(){
		if(Ext.isObject(this.tooltip)){
			Ext.QuickTips.unregister(this.btnEl);
		}
	},


	beforeDestroy : function(){
		if(this.rendered){
			this.clearTip();
		}
		if(this.menu && this.menu.autoDestroy) {
			Ext.destroy(this.menu);
		}
		Ext.destroy(this.repeater);
	},


	onDestroy : function(){
		if(this.rendered){
			this.doc.un('mouseover', this.monitorMouseOver, this);
			this.doc.un('mouseup', this.onMouseUp, this);
			delete this.doc;
			delete this.btnEl;
			Ext.ButtonToggleMgr.unregister(this);
		}
	},


	doAutoWidth : function(){
		if(this.el && this.text && this.width === undefined){
			this.el.setWidth('auto');
			if(Ext.isIE7 && Ext.isStrict){
				var ib = this.btnEl;
				if(ib && ib.getWidth() > 20){
					ib.clip();
					ib.setWidth(Ext.util.TextMetrics.measure(ib, this.text).width+ib.getFrameWidth('lr'));
				}
			}
			if(this.minWidth){
				if(this.el.getWidth() < this.minWidth){
					this.el.setWidth(this.minWidth);
				}
			}
		}
	},


	setHandler : function(handler, scope){
		this.handler = handler;
		this.scope = scope;
		return this;
	},


	setText : function(text){
		this.text = text;
		if(this.el){
			this.btnEl.update(text || '&#160;');
			this.setButtonClass();
		}
		this.doAutoWidth();
		return this;
	},


	setIcon : function(icon){
		this.icon = icon;
		if(this.el){
			this.btnEl.setStyle('background-image', icon ? 'url(' + icon + ')' : '');
			this.setButtonClass();
		}
		return this;
	},


	getText : function(){
		return this.text;
	},


	toggle : function(state, suppressEvent){
		state = state === undefined ? !this.pressed : !!state;
		if(state != this.pressed){
			if(this.rendered){
				this.el[state ? 'addClass' : 'removeClass']('x-btn-pressed');
			}
			this.pressed = state;
			if(!suppressEvent){
				this.fireEvent('toggle', this, state);
				if(this.toggleHandler){
					this.toggleHandler.call(this.scope || this, this, state);
				}
			}
		}
		return this;
	},


	focus : function(){
		this.btnEl.focus();
	},


	onDisable : function(){
		this.onDisableChange(true);
	},


	onEnable : function(){
		this.onDisableChange(false);
	},

	onDisableChange : function(disabled){
		if(this.el){
			if(!Ext.isIE6 || !this.text){
				this.el[disabled ? 'addClass' : 'removeClass'](this.disabledClass);
			}
			this.el.dom.disabled = disabled;
		}
		this.disabled = disabled;
	},


	showMenu : function(){
		if(this.rendered && this.menu){
			if(this.tooltip){
				Ext.QuickTips.getQuickTip().cancelShow(this.btnEl);
			}
			this.menu.show(this.el, this.menuAlign);
		}
		return this;
	},


	hideMenu : function(){
		if(this.menu){
			this.menu.hide();
		}
		return this;
	},


	hasVisibleMenu : function(){
		return this.menu && this.menu.isVisible();
	},


	onClick : function(e){
		if(e){
			e.preventDefault();
		}
		if(e.button !== 0){
			return;
		}
		if(!this.disabled){
			if(this.enableToggle && (this.allowDepress !== false || !this.pressed)){
				this.toggle();
			}
			if(this.menu && !this.menu.isVisible() && !this.ignoreNextClick){
				this.showMenu();
			}
			this.fireEvent('click', this, e);
			if(this.handler){

				this.handler.call(this.scope || this, this, e);
			}
		}
	},


	isMenuTriggerOver : function(e, internal){
		return this.menu && !internal;
	},


	isMenuTriggerOut : function(e, internal){
		return this.menu && !internal;
	},


	onMouseOver : function(e){
		if(!this.disabled){
			var internal = e.within(this.el,  true);
			if(!internal){
				this.el.addClass('x-btn-over');
				if(!this.monitoringMouseOver){
					this.doc.on('mouseover', this.monitorMouseOver, this);
					this.monitoringMouseOver = true;
				}
				this.fireEvent('mouseover', this, e);
			}
			if(this.isMenuTriggerOver(e, internal)){
				this.fireEvent('menutriggerover', this, this.menu, e);
			}
		}
	},


	monitorMouseOver : function(e){
		if(e.target != this.el.dom && !e.within(this.el)){
			if(this.monitoringMouseOver){
				this.doc.un('mouseover', this.monitorMouseOver, this);
				this.monitoringMouseOver = false;
			}
			this.onMouseOut(e);
		}
	},


	onMouseOut : function(e){
		var internal = e.within(this.el) && e.target != this.el.dom;
		this.el.removeClass('x-btn-over');
		this.fireEvent('mouseout', this, e);
		if(this.isMenuTriggerOut(e, internal)){
			this.fireEvent('menutriggerout', this, this.menu, e);
		}
	},

	focus : function() {
		this.btnEl.focus();
	},

	blur : function() {
		this.btnEl.blur();
	},


	onFocus : function(e){
		if(!this.disabled){
			this.el.addClass('x-btn-focus');
		}
	},

	onBlur : function(e){
		this.el.removeClass('x-btn-focus');
	},


	getClickEl : function(e, isUp){
		return this.el;
	},


	onMouseDown : function(e){
		if(!this.disabled && e.button === 0){
			this.getClickEl(e).addClass('x-btn-click');
			this.doc.on('mouseup', this.onMouseUp, this);
		}
	},

	onMouseUp : function(e){
		if(e.button === 0){
			this.getClickEl(e, true).removeClass('x-btn-click');
			this.doc.un('mouseup', this.onMouseUp, this);
		}
	},

	onMenuShow : function(e){
		this.menu.ownerCt = this;
		this.ignoreNextClick = 0;
		this.el.addClass('x-btn-menu-active');
		this.fireEvent('menushow', this, this.menu);
	},

	onMenuHide : function(e){
		this.el.removeClass('x-btn-menu-active');
		this.ignoreNextClick = this.restoreClick.defer(250, this);
		this.fireEvent('menuhide', this, this.menu);
		delete this.menu.ownerCt;
	},


	restoreClick : function(){
		this.ignoreNextClick = 0;
	}


});
Ext.reg('button', Ext.Button);


Ext.ButtonToggleMgr = function(){
	var groups = {};

	function toggleGroup(btn, state){
		if(state){
			var g = groups[btn.toggleGroup];
			for(var i = 0, l = g.length; i < l; i++){
				if(g[i] != btn){
					g[i].toggle(false);
				}
			}
		}
	}

	return {
		register : function(btn){
			if(!btn.toggleGroup){
				return;
			}
			var g = groups[btn.toggleGroup];
			if(!g){
				g = groups[btn.toggleGroup] = [];
			}
			g.push(btn);
			btn.on('toggle', toggleGroup);
		},

		unregister : function(btn){
			if(!btn.toggleGroup){
				return;
			}
			var g = groups[btn.toggleGroup];
			if(g){
				g.remove(btn);
				btn.un('toggle', toggleGroup);
			}
		},


		getPressed : function(group){
			var g = groups[group];
			if(g){
				for(var i = 0, len = g.length; i < len; i++){
					if(g[i].pressed === true){
						return g[i];
					}
				}
			}
			return null;
		}
	};
}();

Ext.SplitButton = Ext.extend(Ext.Button, {

	arrowSelector : 'em',
	split: true,


	initComponent : function(){
		Ext.SplitButton.superclass.initComponent.call(this);

		this.addEvents("arrowclick");
	},


	onRender : function(){
		Ext.SplitButton.superclass.onRender.apply(this, arguments);
		if(this.arrowTooltip){
			this.el.child(this.arrowSelector).dom[this.tooltipType] = this.arrowTooltip;
		}
	},


	setArrowHandler : function(handler, scope){
		this.arrowHandler = handler;
		this.scope = scope;
	},

	getMenuClass : function(){
		return 'x-btn-split' + (this.arrowAlign == 'bottom' ? '-bottom' : '');
	},

	isClickOnArrow : function(e){
		if (this.arrowAlign != 'bottom') {
			var visBtn = this.el.child('em.x-btn-split');
			var right = visBtn.getRegion().right - visBtn.getPadding('r');
			return e.getPageX() > right;
		} else {
			return e.getPageY() > this.btnEl.getRegion().bottom;
		}
	},


	onClick : function(e, t){
		e.preventDefault();
		if(!this.disabled){
			if(this.isClickOnArrow(e)){
				if(this.menu && !this.menu.isVisible() && !this.ignoreNextClick){
					this.showMenu();
				}
				this.fireEvent("arrowclick", this, e);
				if(this.arrowHandler){
					this.arrowHandler.call(this.scope || this, this, e);
				}
			}else{
				if(this.enableToggle){
					this.toggle();
				}
				this.fireEvent("click", this, e);
				if(this.handler){
					this.handler.call(this.scope || this, this, e);
				}
			}
		}
	},


	isMenuTriggerOver : function(e){
		return this.menu && e.target.tagName == this.arrowSelector;
	},


	isMenuTriggerOut : function(e, internal){
		return this.menu && e.target.tagName != this.arrowSelector;
	}
});

Ext.reg('splitbutton', Ext.SplitButton);
Ext.CycleButton = Ext.extend(Ext.SplitButton, {








	getItemText : function(item){
		if(item && this.showText === true){
			var text = '';
			if(this.prependText){
				text += this.prependText;
			}
			text += item.text;
			return text;
		}
		return undefined;
	},


	setActiveItem : function(item, suppressEvent){
		if(!Ext.isObject(item)){
			item = this.menu.getComponent(item);
		}
		if(item){
			if(!this.rendered){
				this.text = this.getItemText(item);
				this.iconCls = item.iconCls;
			}else{
				var t = this.getItemText(item);
				if(t){
					this.setText(t);
				}
				this.setIconClass(item.iconCls);
			}
			this.activeItem = item;
			if(!item.checked){
				item.setChecked(true, true);
			}
			if(this.forceIcon){
				this.setIconClass(this.forceIcon);
			}
			if(!suppressEvent){
				this.fireEvent('change', this, item);
			}
		}
	},


	getActiveItem : function(){
		return this.activeItem;
	},


	initComponent : function(){
		this.addEvents(

			"change"
		);

		if(this.changeHandler){
			this.on('change', this.changeHandler, this.scope||this);
			delete this.changeHandler;
		}

		this.itemCount = this.items.length;

		this.menu = {cls:'x-cycle-menu', items:[]};
		var checked;
		Ext.each(this.items, function(item, i){
			Ext.apply(item, {
				group: item.group || this.id,
				itemIndex: i,
				checkHandler: this.checkHandler,
				scope: this,
				checked: item.checked || false
			});
			this.menu.items.push(item);
			if(item.checked){
				checked = item;
			}
		}, this);
		this.setActiveItem(checked, true);
		Ext.CycleButton.superclass.initComponent.call(this);

		this.on('click', this.toggleSelected, this);
	},


	checkHandler : function(item, pressed){
		if(pressed){
			this.setActiveItem(item);
		}
	},


	toggleSelected : function(){
		var m = this.menu;
		m.render();

		if(!m.hasLayout){
			m.doLayout();
		}

		var nextIdx, checkItem;
		for (var i = 1; i < this.itemCount; i++) {
			nextIdx = (this.activeItem.itemIndex + i) % this.itemCount;

			checkItem = m.items.itemAt(nextIdx);

			if (!checkItem.disabled) {
				checkItem.setChecked(true);
				break;
			}
		}
	}
});
Ext.reg('cycle', Ext.CycleButton);
Ext.layout.ToolbarLayout = Ext.extend(Ext.layout.ContainerLayout, {
	monitorResize : true,
	triggerWidth : 18,
	lastOverflow : false,
	forceLayout: true,

	noItemsMenuText : '<div class="x-toolbar-no-items">(None)</div>',

	onLayout : function(ct, target){
		if(!this.leftTr){
			var align = ct.buttonAlign == 'center' ? 'center' : 'left';
			target.addClass('x-toolbar-layout-ct');
			target.insertHtml('beforeEnd',
				'<table cellspacing="0" class="x-toolbar-ct"><tbody><tr><td class="x-toolbar-left" align="' + align + '"><table cellspacing="0"><tbody><tr class="x-toolbar-left-row"></tr></tbody></table></td><td class="x-toolbar-right" align="right"><table cellspacing="0" class="x-toolbar-right-ct"><tbody><tr><td><table cellspacing="0"><tbody><tr class="x-toolbar-right-row"></tr></tbody></table></td><td><table cellspacing="0"><tbody><tr class="x-toolbar-extras-row"></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>');
			this.leftTr = target.child('tr.x-toolbar-left-row', true);
			this.rightTr = target.child('tr.x-toolbar-right-row', true);
			this.extrasTr = target.child('tr.x-toolbar-extras-row', true);
		}
		var side = ct.buttonAlign == 'right' ? this.rightTr : this.leftTr,
			pos = 0,
			items = ct.items.items;

		for(var i = 0, len = items.length, c; i < len; i++, pos++) {
			c = items[i];
			if(c.isFill){
				side = this.rightTr;
				pos = -1;
			}else if(!c.rendered){
				c.render(this.insertCell(c, side, pos));
			}else{
				if(!c.xtbHidden && !this.isValidParent(c, side.childNodes[pos])){
					var td = this.insertCell(c, side, pos);
					td.appendChild(c.getPositionEl().dom);
					c.container = Ext.get(td);
				}
			}
		}

		this.cleanup(this.leftTr);
		this.cleanup(this.rightTr);
		this.cleanup(this.extrasTr);
		this.fitToSize(target);
	},

	cleanup : function(row){
		var cn = row.childNodes;
		for(var i = cn.length-1, c; i >= 0 && (c = cn[i]); i--){
			if(!c.firstChild){
				row.removeChild(c);
			}
		}
	},

	insertCell : function(c, side, pos){
		var td = document.createElement('td');
		td.className='x-toolbar-cell';
		side.insertBefore(td, side.childNodes[pos]||null);
		return td;
	},

	hideItem : function(item){
		var h = (this.hiddens = this.hiddens || []);
		h.push(item);
		item.xtbHidden = true;
		item.xtbWidth = item.getPositionEl().dom.parentNode.offsetWidth;
		item.hide();
	},

	unhideItem : function(item){
		item.show();
		item.xtbHidden = false;
		this.hiddens.remove(item);
		if(this.hiddens.length < 1){
			delete this.hiddens;
		}
	},

	getItemWidth : function(c){
		return c.hidden ? (c.xtbWidth || 0) : c.getPositionEl().dom.parentNode.offsetWidth;
	},

	fitToSize : function(t){
		if(this.container.enableOverflow === false){
			return;
		}
		var w = t.dom.clientWidth,
			lw = this.lastWidth || 0,
			iw = t.dom.firstChild.offsetWidth,
			clipWidth = w - this.triggerWidth,
			hideIndex = -1;

		this.lastWidth = w;

		if(iw > w || (this.hiddens && w >= lw)){
			var i, items = this.container.items.items,
				len = items.length, c,
				loopWidth = 0;

			for(i = 0; i < len; i++) {
				c = items[i];
				if(!c.isFill){
					loopWidth += this.getItemWidth(c);
					if(loopWidth > clipWidth){
						if(!(c.hidden || c.xtbHidden)){
							this.hideItem(c);
						}
					}else if(c.xtbHidden){
						this.unhideItem(c);
					}
				}
			}
		}
		if(this.hiddens){
			this.initMore();
			if(!this.lastOverflow){
				this.container.fireEvent('overflowchange', this.container, true);
				this.lastOverflow = true;
			}
		}else if(this.more){
			this.clearMenu();
			this.more.destroy();
			delete this.more;
			if(this.lastOverflow){
				this.container.fireEvent('overflowchange', this.container, false);
				this.lastOverflow = false;
			}
		}
	},

	createMenuConfig : function(c, hideOnClick){
		var cfg = Ext.apply({}, c.initialConfig),
			group = c.toggleGroup;

		Ext.apply(cfg, {
			text: c.overflowText || c.text,
			iconCls: c.iconCls,
			icon: c.icon,
			itemId: c.itemId,
			disabled: c.disabled,
			handler: c.handler,
			scope: c.scope,
			menu: c.menu,
			hideOnClick: hideOnClick
		});
		if(group || c.enableToggle){
			Ext.apply(cfg, {
				group: group,
				checked: c.pressed,
				listeners: {
					checkchange: function(item, checked){
						c.toggle(checked);
					}
				}
			});
		}
		delete cfg.ownerCt;
		delete cfg.xtype;
		delete cfg.id;
		return cfg;
	},


	addComponentToMenu : function(m, c){
		if(c instanceof Ext.Toolbar.Separator){
			m.add('-');
		}else if(Ext.isFunction(c.isXType)){
			if(c.isXType('splitbutton')){
				m.add(this.createMenuConfig(c, true));
			}else if(c.isXType('button')){
				m.add(this.createMenuConfig(c, !c.menu));
			}else if(c.isXType('buttongroup')){
				c.items.each(function(item){
					this.addComponentToMenu(m, item);
				}, this);
			}
		}
	},

	clearMenu : function(){
		var m = this.moreMenu;
		if(m && m.items){
			m.items.each(function(item){
				delete item.menu;
			});
		}
	},


	beforeMoreShow : function(m){
		var h = this.container.items.items,
			len = h.length,
			c,
			prev,
			needsSep = function(group, item){
				return group.isXType('buttongroup') && !(item instanceof Ext.Toolbar.Separator);
			};

		this.clearMenu();
		m.removeAll();
		for(var i = 0; i < len; i++){
			c = h[i];
			if(c.xtbHidden){
				if(prev && (needsSep(c, prev) || needsSep(prev, c))){
					m.add('-');
				}
				this.addComponentToMenu(m, c);
				prev = c;
			}
		}


		if(m.items.length < 1){
			m.add(this.noItemsMenuText);
		}
	},

	initMore : function(){
		if(!this.more){
			this.moreMenu = new Ext.menu.Menu({
				listeners: {
					beforeshow: this.beforeMoreShow,
					scope: this
				}
			});
			this.moreMenu.ownerCt = this.container;
			this.more = new Ext.Button({
				iconCls: 'x-toolbar-more-icon',
				cls: 'x-toolbar-more',
				menu: this.moreMenu
			});
			var td = this.insertCell(this.more, this.extrasTr, 100);
			this.more.render(td);
		}
	},

	onRemove : function(c){
		delete this.leftTr;
		delete this.rightTr;
		delete this.extrasTr;
		Ext.layout.ToolbarLayout.superclass.onRemove.call(this, c);
	},

	destroy : function(){
		Ext.destroy(this.more, this.moreMenu);
		delete this.leftTr;
		delete this.rightTr;
		delete this.extrasTr;
		Ext.layout.ToolbarLayout.superclass.destroy.call(this);
	}

});

Ext.Container.LAYOUTS.toolbar = Ext.layout.ToolbarLayout;


Ext.Toolbar = function(config){
	if(Ext.isArray(config)){
		config = {items: config, layout: 'toolbar'};
	} else {
		config = Ext.apply({
			layout: 'toolbar'
		}, config);
		if(config.buttons) {
			config.items = config.buttons;
		}
	}
	Ext.Toolbar.superclass.constructor.call(this, config);
};

(function(){

	var T = Ext.Toolbar;

	Ext.extend(T, Ext.Container, {

		defaultType: 'button',




		trackMenus : true,
		internalDefaults: {removeMode: 'container', hideParent: true},
		toolbarCls: 'x-toolbar',

		initComponent : function(){
			T.superclass.initComponent.call(this);


			this.addEvents('overflowchange');
		},


		onRender : function(ct, position){
			if(!this.el){
				if(!this.autoCreate){
					this.autoCreate = {
						cls: this.toolbarCls + ' x-small-editor'
					};
				}
				this.el = ct.createChild(Ext.apply({ id: this.id },this.autoCreate), position);
				Ext.Toolbar.superclass.onRender.apply(this, arguments);
			}
		},




		lookupComponent : function(c){
			if(Ext.isString(c)){
				if(c == '-'){
					c = new T.Separator();
				}else if(c == ' '){
					c = new T.Spacer();
				}else if(c == '->'){
					c = new T.Fill();
				}else{
					c = new T.TextItem(c);
				}
				this.applyDefaults(c);
			}else{
				if(c.isFormField || c.render){
					c = this.createComponent(c);
				}else if(c.tag){
					c = new T.Item({autoEl: c});
				}else if(c.tagName){
					c = new T.Item({el:c});
				}else if(Ext.isObject(c)){
					c = c.xtype ? this.createComponent(c) : this.constructButton(c);
				}
			}
			return c;
		},


		applyDefaults : function(c){
			if(!Ext.isString(c)){
				c = Ext.Toolbar.superclass.applyDefaults.call(this, c);
				var d = this.internalDefaults;
				if(c.events){
					Ext.applyIf(c.initialConfig, d);
					Ext.apply(c, d);
				}else{
					Ext.applyIf(c, d);
				}
			}
			return c;
		},


		addSeparator : function(){
			return this.add(new T.Separator());
		},


		addSpacer : function(){
			return this.add(new T.Spacer());
		},


		addFill : function(){
			this.add(new T.Fill());
		},


		addElement : function(el){
			return this.addItem(new T.Item({el:el}));
		},


		addItem : function(item){
			return this.add.apply(this, arguments);
		},


		addButton : function(config){
			if(Ext.isArray(config)){
				var buttons = [];
				for(var i = 0, len = config.length; i < len; i++) {
					buttons.push(this.addButton(config[i]));
				}
				return buttons;
			}
			return this.add(this.constructButton(config));
		},


		addText : function(text){
			return this.addItem(new T.TextItem(text));
		},


		addDom : function(config){
			return this.add(new T.Item({autoEl: config}));
		},


		addField : function(field){
			return this.add(field);
		},


		insertButton : function(index, item){
			if(Ext.isArray(item)){
				var buttons = [];
				for(var i = 0, len = item.length; i < len; i++) {
					buttons.push(this.insertButton(index + i, item[i]));
				}
				return buttons;
			}
			return Ext.Toolbar.superclass.insert.call(this, index, item);
		},


		trackMenu : function(item, remove){
			if(this.trackMenus && item.menu){
				var method = remove ? 'mun' : 'mon';
				this[method](item, 'menutriggerover', this.onButtonTriggerOver, this);
				this[method](item, 'menushow', this.onButtonMenuShow, this);
				this[method](item, 'menuhide', this.onButtonMenuHide, this);
			}
		},


		constructButton : function(item){
			var b = item.events ? item : this.createComponent(item, item.split ? 'splitbutton' : this.defaultType);
			return b;
		},


		onAdd : function(c){
			Ext.Toolbar.superclass.onAdd.call(this);
			this.trackMenu(c);
		},


		onRemove : function(c){
			Ext.Toolbar.superclass.onRemove.call(this);
			this.trackMenu(c, true);
		},


		onDisable : function(){
			this.items.each(function(item){
				if(item.disable){
					item.disable();
				}
			});
		},


		onEnable : function(){
			this.items.each(function(item){
				if(item.enable){
					item.enable();
				}
			});
		},


		onButtonTriggerOver : function(btn){
			if(this.activeMenuBtn && this.activeMenuBtn != btn){
				this.activeMenuBtn.hideMenu();
				btn.showMenu();
				this.activeMenuBtn = btn;
			}
		},


		onButtonMenuShow : function(btn){
			this.activeMenuBtn = btn;
		},


		onButtonMenuHide : function(btn){
			delete this.activeMenuBtn;
		}
	});
	Ext.reg('toolbar', Ext.Toolbar);


	T.Item = Ext.extend(Ext.BoxComponent, {
		hideParent: true,
		enable:Ext.emptyFn,
		disable:Ext.emptyFn,
		focus:Ext.emptyFn

	});
	Ext.reg('tbitem', T.Item);


	T.Separator = Ext.extend(T.Item, {
		onRender : function(ct, position){
			this.el = ct.createChild({tag:'span', cls:'xtb-sep'}, position);
		}
	});
	Ext.reg('tbseparator', T.Separator);


	T.Spacer = Ext.extend(T.Item, {


		onRender : function(ct, position){
			this.el = ct.createChild({tag:'div', cls:'xtb-spacer', style: this.width?'width:'+this.width+'px':''}, position);
		}
	});
	Ext.reg('tbspacer', T.Spacer);


	T.Fill = Ext.extend(T.Item, {

		render : Ext.emptyFn,
		isFill : true
	});
	Ext.reg('tbfill', T.Fill);


	T.TextItem = Ext.extend(T.Item, {


		constructor: function(config){
			T.TextItem.superclass.constructor.call(this, Ext.isString(config) ? {text: config} : config);
		},


		onRender : function(ct, position) {
			this.autoEl = {cls: 'xtb-text', html: this.text || ''};
			T.TextItem.superclass.onRender.call(this, ct, position);
		},


		setText : function(t) {
			if(this.rendered){
				this.el.update(t);
			}else{
				this.text = t;
			}
		}
	});
	Ext.reg('tbtext', T.TextItem);


	T.Button = Ext.extend(Ext.Button, {});
	T.SplitButton = Ext.extend(Ext.SplitButton, {});
	Ext.reg('tbbutton', T.Button);
	Ext.reg('tbsplit', T.SplitButton);

})();

Ext.ButtonGroup = Ext.extend(Ext.Panel, {


	baseCls: 'x-btn-group',

	layout:'table',
	defaultType: 'button',

	frame: true,
	internalDefaults: {removeMode: 'container', hideParent: true},

	initComponent : function(){
		this.layoutConfig = this.layoutConfig || {};
		Ext.applyIf(this.layoutConfig, {
			columns : this.columns
		});
		if(!this.title){
			this.addClass('x-btn-group-notitle');
		}
		this.on('afterlayout', this.onAfterLayout, this);
		Ext.ButtonGroup.superclass.initComponent.call(this);
	},

	applyDefaults : function(c){
		c = Ext.ButtonGroup.superclass.applyDefaults.call(this, c);
		var d = this.internalDefaults;
		if(c.events){
			Ext.applyIf(c.initialConfig, d);
			Ext.apply(c, d);
		}else{
			Ext.applyIf(c, d);
		}
		return c;
	},

	onAfterLayout : function(){
		var bodyWidth = this.body.getFrameWidth('lr') + this.body.dom.firstChild.offsetWidth;
		this.body.setWidth(bodyWidth);
		this.el.setWidth(bodyWidth + this.getFrameWidth());
	}

});

Ext.reg('buttongroup', Ext.ButtonGroup);

(function() {

	var T = Ext.Toolbar;

	Ext.PagingToolbar = Ext.extend(Ext.Toolbar, {



		pageSize : 20,


		displayMsg : 'Displaying {0} - {1} of {2}',

		emptyMsg : 'No data to display',

		beforePageText : 'Page',

		afterPageText : 'of {0}',

		firstText : 'First Page',

		prevText : 'Previous Page',

		nextText : 'Next Page',

		lastText : 'Last Page',

		refreshText : 'Refresh',







		initComponent : function(){
			var pagingItems = [this.first = new T.Button({
				tooltip: this.firstText,
				overflowText: this.firstText,
				iconCls: 'x-tbar-page-first',
				disabled: true,
				handler: this.moveFirst,
				scope: this
			}), this.prev = new T.Button({
				tooltip: this.prevText,
				overflowText: this.prevText,
				iconCls: 'x-tbar-page-prev',
				disabled: true,
				handler: this.movePrevious,
				scope: this
			}), '-', this.beforePageText,
				this.inputItem = new Ext.form.NumberField({
					cls: 'x-tbar-page-number',
					allowDecimals: false,
					allowNegative: false,
					enableKeyEvents: true,
					selectOnFocus: true,
					submitValue: false,
					listeners: {
						scope: this,
						keydown: this.onPagingKeyDown,
						blur: this.onPagingBlur
					}
				}), this.afterTextItem = new T.TextItem({
					text: String.format(this.afterPageText, 1)
				}), '-', this.next = new T.Button({
					tooltip: this.nextText,
					overflowText: this.nextText,
					iconCls: 'x-tbar-page-next',
					disabled: true,
					handler: this.moveNext,
					scope: this
				}), this.last = new T.Button({
					tooltip: this.lastText,
					overflowText: this.lastText,
					iconCls: 'x-tbar-page-last',
					disabled: true,
					handler: this.moveLast,
					scope: this
				}), '-', this.refresh = new T.Button({
					tooltip: this.refreshText,
					overflowText: this.refreshText,
					iconCls: 'x-tbar-loading',
					handler: this.doRefresh,
					scope: this
				})];


			var userItems = this.items || this.buttons || [];
			if (this.prependButtons) {
				this.items = userItems.concat(pagingItems);
			}else{
				this.items = pagingItems.concat(userItems);
			}
			delete this.buttons;
			if(this.displayInfo){
				this.items.push('->');
				this.items.push(this.displayItem = new T.TextItem({}));
			}
			Ext.PagingToolbar.superclass.initComponent.call(this);
			this.addEvents(

				'change',

				'beforechange'
			);
			this.on('afterlayout', this.onFirstLayout, this, {single: true});
			this.cursor = 0;
			this.bindStore(this.store, true);
		},


		onFirstLayout : function(){
			if(this.dsLoaded){
				this.onLoad.apply(this, this.dsLoaded);
			}
		},


		updateInfo : function(){
			if(this.displayItem){
				var count = this.store.getCount();
				var msg = count == 0 ?
					this.emptyMsg :
					String.format(
						this.displayMsg,
						this.cursor+1, this.cursor+count, this.store.getTotalCount()
					);
				this.displayItem.setText(msg);
			}
		},


		onLoad : function(store, r, o){
			if(!this.rendered){
				this.dsLoaded = [store, r, o];
				return;
			}
			var p = this.getParams();
			this.cursor = (o.params && o.params[p.start]) ? o.params[p.start] : 0;
			var d = this.getPageData(), ap = d.activePage, ps = d.pages;

			this.afterTextItem.setText(String.format(this.afterPageText, d.pages));
			this.inputItem.setValue(ap);
			this.first.setDisabled(ap == 1);
			this.prev.setDisabled(ap == 1);
			this.next.setDisabled(ap == ps);
			this.last.setDisabled(ap == ps);
			this.refresh.enable();
			this.updateInfo();
			this.fireEvent('change', this, d);
		},


		getPageData : function(){
			var total = this.store.getTotalCount();
			return {
				total : total,
				activePage : Math.ceil((this.cursor+this.pageSize)/this.pageSize),
				pages :  total < this.pageSize ? 1 : Math.ceil(total/this.pageSize)
			};
		},


		changePage : function(page){
			this.doLoad(((page-1) * this.pageSize).constrain(0, this.store.getTotalCount()));
		},


		onLoadError : function(){
			if(!this.rendered){
				return;
			}
			this.refresh.enable();
		},


		readPage : function(d){
			var v = this.inputItem.getValue(), pageNum;
			if (!v || isNaN(pageNum = parseInt(v, 10))) {
				this.inputItem.setValue(d.activePage);
				return false;
			}
			return pageNum;
		},

		onPagingFocus : function(){
			this.inputItem.select();
		},


		onPagingBlur : function(e){
			this.inputItem.setValue(this.getPageData().activePage);
		},


		onPagingKeyDown : function(field, e){
			var k = e.getKey(), d = this.getPageData(), pageNum;
			if (k == e.RETURN) {
				e.stopEvent();
				pageNum = this.readPage(d);
				if(pageNum !== false){
					pageNum = Math.min(Math.max(1, pageNum), d.pages) - 1;
					this.doLoad(pageNum * this.pageSize);
				}
			}else if (k == e.HOME || k == e.END){
				e.stopEvent();
				pageNum = k == e.HOME ? 1 : d.pages;
				field.setValue(pageNum);
			}else if (k == e.UP || k == e.PAGEUP || k == e.DOWN || k == e.PAGEDOWN){
				e.stopEvent();
				if((pageNum = this.readPage(d))){
					var increment = e.shiftKey ? 10 : 1;
					if(k == e.DOWN || k == e.PAGEDOWN){
						increment *= -1;
					}
					pageNum += increment;
					if(pageNum >= 1 & pageNum <= d.pages){
						field.setValue(pageNum);
					}
				}
			}
		},


		getParams : function(){

			return this.paramNames || this.store.paramNames;
		},


		beforeLoad : function(){
			if(this.rendered && this.refresh){
				this.refresh.disable();
			}
		},


		doLoad : function(start){
			var o = {}, pn = this.getParams();
			o[pn.start] = start;
			o[pn.limit] = this.pageSize;
			if(this.fireEvent('beforechange', this, o) !== false){
				this.store.load({params:o});
			}
		},


		moveFirst : function(){
			this.doLoad(0);
		},


		movePrevious : function(){
			this.doLoad(Math.max(0, this.cursor-this.pageSize));
		},


		moveNext : function(){
			this.doLoad(this.cursor+this.pageSize);
		},


		moveLast : function(){
			var total = this.store.getTotalCount(),
				extra = total % this.pageSize;

			this.doLoad(extra ? (total - extra) : total - this.pageSize);
		},


		doRefresh : function(){
			this.doLoad(this.cursor);
		},


		bindStore : function(store, initial){
			var doLoad;
			if(!initial && this.store){
				if(store !== this.store && this.store.autoDestroy){
					this.store.destroy();
				}else{
					this.store.un('beforeload', this.beforeLoad, this);
					this.store.un('load', this.onLoad, this);
					this.store.un('exception', this.onLoadError, this);
				}
				if(!store){
					this.store = null;
				}
			}
			if(store){
				store = Ext.StoreMgr.lookup(store);
				store.on({
					scope: this,
					beforeload: this.beforeLoad,
					load: this.onLoad,
					exception: this.onLoadError
				});
				doLoad = true;
			}
			this.store = store;
			if(doLoad){
				this.onLoad(store, null, {});
			}
		},


		unbind : function(store){
			this.bindStore(null);
		},


		bind : function(store){
			this.bindStore(store);
		},


		onDestroy : function(){
			this.bindStore(null);
			Ext.PagingToolbar.superclass.onDestroy.call(this);
		}
	});

})();
Ext.reg('paging', Ext.PagingToolbar);
Ext.History = (function () {
	var iframe, hiddenField;
	var ready = false;
	var currentToken;

	function getHash() {
		var href = top.location.href, i = href.indexOf("#");
		return i >= 0 ? href.substr(i + 1) : null;
	}

	function doSave() {
		hiddenField.value = currentToken;
	}

	function handleStateChange(token) {
		currentToken = token;
		Ext.History.fireEvent('change', token);
	}

	function updateIFrame (token) {
		var html = ['<html><body><div id="state">',Ext.util.Format.htmlEncode(token),'</div></body></html>'].join('');
		try {
			var doc = iframe.contentWindow.document;
			doc.open();
			doc.write(html);
			doc.close();
			return true;
		} catch (e) {
			return false;
		}
	}

	function checkIFrame() {
		if (!iframe.contentWindow || !iframe.contentWindow.document) {
			setTimeout(checkIFrame, 10);
			return;
		}

		var doc = iframe.contentWindow.document;
		var elem = doc.getElementById("state");
		var token = elem ? elem.innerText : null;

		var hash = getHash();

		setInterval(function () {

			doc = iframe.contentWindow.document;
			elem = doc.getElementById("state");

			var newtoken = elem ? elem.innerText : null;

			var newHash = getHash();

			if (newtoken !== token) {
				token = newtoken;
				handleStateChange(token);
				top.location.hash = token;
				hash = token;
				doSave();
			} else if (newHash !== hash) {
				hash = newHash;
				updateIFrame(newHash);
			}

		}, 50);

		ready = true;

		Ext.History.fireEvent('ready', Ext.History);
	}

	function startUp() {
		currentToken = hiddenField.value ? hiddenField.value : getHash();

		if (Ext.isIE) {
			checkIFrame();
		} else {
			var hash = getHash();
			setInterval(function () {
				var newHash = getHash();
				if (newHash !== hash) {
					hash = newHash;
					handleStateChange(hash);
					doSave();
				}
			}, 50);
			ready = true;
			Ext.History.fireEvent('ready', Ext.History);
		}
	}

	return {

		fieldId: 'x-history-field',

		iframeId: 'x-history-frame',

		events:{},


		init: function (onReady, scope) {
			if(ready) {
				Ext.callback(onReady, scope, [this]);
				return;
			}
			if(!Ext.isReady){
				Ext.onReady(function(){
					Ext.History.init(onReady, scope);
				});
				return;
			}
			hiddenField = Ext.getDom(Ext.History.fieldId);
			if (Ext.isIE) {
				iframe = Ext.getDom(Ext.History.iframeId);
			}
			this.addEvents(

				'ready',

				'change'
			);
			if(onReady){
				this.on('ready', onReady, scope, {single:true});
			}
			startUp();
		},


		add: function (token, preventDup) {
			if(preventDup !== false){
				if(this.getToken() == token){
					return true;
				}
			}
			if (Ext.isIE) {
				return updateIFrame(token);
			} else {
				top.location.hash = token;
				return true;
			}
		},


		back: function(){
			history.go(-1);
		},


		forward: function(){
			history.go(1);
		},


		getToken: function() {
			return ready ? currentToken : getHash();
		}
	};
})();
Ext.apply(Ext.History, new Ext.util.Observable());
Ext.Tip = Ext.extend(Ext.Panel, {



	minWidth : 40,

	maxWidth : 300,

	shadow : "sides",

	defaultAlign : "tl-bl?",
	autoRender: true,
	quickShowInterval : 250,


	frame:true,
	hidden:true,
	baseCls: 'x-tip',
	floating:{shadow:true,shim:true,useDisplay:true,constrain:false},
	autoHeight:true,

	closeAction: 'hide',


	initComponent : function(){
		Ext.Tip.superclass.initComponent.call(this);
		if(this.closable && !this.title){
			this.elements += ',header';
		}
	},


	afterRender : function(){
		Ext.Tip.superclass.afterRender.call(this);
		if(this.closable){
			this.addTool({
				id: 'close',
				handler: this[this.closeAction],
				scope: this
			});
		}
	},


	showAt : function(xy){
		Ext.Tip.superclass.show.call(this);
		if(this.measureWidth !== false && (!this.initialConfig || typeof this.initialConfig.width != 'number')){
			this.doAutoWidth();
		}
		if(this.constrainPosition){
			xy = this.el.adjustForConstraints(xy);
		}
		this.setPagePosition(xy[0], xy[1]);
	},


	doAutoWidth : function(adjust){
		adjust = adjust || 0;
		var bw = this.body.getTextWidth();
		if(this.title){
			bw = Math.max(bw, this.header.child('span').getTextWidth(this.title));
		}
		bw += this.getFrameWidth() + (this.closable ? 20 : 0) + this.body.getPadding("lr") + adjust;
		this.setWidth(bw.constrain(this.minWidth, this.maxWidth));


		if(Ext.isIE7 && !this.repainted){
			this.el.repaint();
			this.repainted = true;
		}
	},


	showBy : function(el, pos){
		if(!this.rendered){
			this.render(Ext.getBody());
		}
		this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign));
	},

	initDraggable : function(){
		this.dd = new Ext.Tip.DD(this, typeof this.draggable == 'boolean' ? null : this.draggable);
		this.header.addClass('x-tip-draggable');
	}
});

Ext.reg('tip', Ext.Tip);


Ext.Tip.DD = function(tip, config){
	Ext.apply(this, config);
	this.tip = tip;
	Ext.Tip.DD.superclass.constructor.call(this, tip.el.id, 'WindowDD-'+tip.id);
	this.setHandleElId(tip.header.id);
	this.scroll = false;
};

Ext.extend(Ext.Tip.DD, Ext.dd.DD, {
	moveOnly:true,
	scroll:false,
	headerOffsets:[100, 25],
	startDrag : function(){
		this.tip.el.disableShadow();
	},
	endDrag : function(e){
		this.tip.el.enableShadow(true);
	}
});
Ext.ToolTip = Ext.extend(Ext.Tip, {




	showDelay : 500,

	hideDelay : 200,

	dismissDelay : 5000,


	trackMouse : false,

	anchorToTarget : true,

	anchorOffset : 0,



	targetCounter : 0,

	constrainPosition : false,


	initComponent : function(){
		Ext.ToolTip.superclass.initComponent.call(this);
		this.lastActive = new Date();
		this.initTarget(this.target);
		this.origAnchor = this.anchor;
	},


	onRender : function(ct, position){
		Ext.ToolTip.superclass.onRender.call(this, ct, position);
		this.anchorCls = 'x-tip-anchor-' + this.getAnchorPosition();
		this.anchorEl = this.el.createChild({
			cls: 'x-tip-anchor ' + this.anchorCls
		});
	},


	afterRender : function(){
		Ext.ToolTip.superclass.afterRender.call(this);
		this.anchorEl.setStyle('z-index', this.el.getZIndex() + 1);
	},


	initTarget : function(target){
		var t;
		if((t = Ext.get(target))){
			if(this.target){
				var tg = Ext.get(this.target);
				this.mun(tg, 'mouseover', this.onTargetOver, this);
				this.mun(tg, 'mouseout', this.onTargetOut, this);
				this.mun(tg, 'mousemove', this.onMouseMove, this);
			}
			this.mon(t, {
				mouseover: this.onTargetOver,
				mouseout: this.onTargetOut,
				mousemove: this.onMouseMove,
				scope: this
			});
			this.target = t;
		}
		if(this.anchor){
			this.anchorTarget = this.target;
		}
	},


	onMouseMove : function(e){
		var t = this.delegate ? e.getTarget(this.delegate) : this.triggerElement = true;
		if (t) {
			this.targetXY = e.getXY();
			if (t === this.triggerElement) {
				if(!this.hidden && this.trackMouse){
					this.setPagePosition(this.getTargetXY());
				}
			} else {
				this.hide();
				this.lastActive = new Date(0);
				this.onTargetOver(e);
			}
		} else if (!this.closable && this.isVisible()) {
			this.hide();
		}
	},


	getTargetXY : function(){
		if(this.delegate){
			this.anchorTarget = this.triggerElement;
		}
		if(this.anchor){
			this.targetCounter++;
			var offsets = this.getOffsets(),
				xy = (this.anchorToTarget && !this.trackMouse) ? this.el.getAlignToXY(this.anchorTarget, this.getAnchorAlign()) : this.targetXY,
				dw = Ext.lib.Dom.getViewWidth() - 5,
				dh = Ext.lib.Dom.getViewHeight() - 5,
				de = document.documentElement,
				bd = document.body,
				scrollX = (de.scrollLeft || bd.scrollLeft || 0) + 5,
				scrollY = (de.scrollTop || bd.scrollTop || 0) + 5,
				axy = [xy[0] + offsets[0], xy[1] + offsets[1]]
			sz = this.getSize();

			this.anchorEl.removeClass(this.anchorCls);

			if(this.targetCounter < 2){
				if(axy[0] < scrollX){
					if(this.anchorToTarget){
						this.defaultAlign = 'l-r';
						if(this.mouseOffset){this.mouseOffset[0] *= -1;}
					}
					this.anchor = 'left';
					return this.getTargetXY();
				}
				if(axy[0]+sz.width > dw){
					if(this.anchorToTarget){
						this.defaultAlign = 'r-l';
						if(this.mouseOffset){this.mouseOffset[0] *= -1;}
					}
					this.anchor = 'right';
					return this.getTargetXY();
				}
				if(axy[1] < scrollY){
					if(this.anchorToTarget){
						this.defaultAlign = 't-b';
						if(this.mouseOffset){this.mouseOffset[1] *= -1;}
					}
					this.anchor = 'top';
					return this.getTargetXY();
				}
				if(axy[1]+sz.height > dh){
					if(this.anchorToTarget){
						this.defaultAlign = 'b-t';
						if(this.mouseOffset){this.mouseOffset[1] *= -1;}
					}
					this.anchor = 'bottom';
					return this.getTargetXY();
				}
			}

			this.anchorCls = 'x-tip-anchor-'+this.getAnchorPosition();
			this.anchorEl.addClass(this.anchorCls);
			this.targetCounter = 0;
			return axy;
		}else{
			var mouseOffset = this.getMouseOffset();
			return [this.targetXY[0]+mouseOffset[0], this.targetXY[1]+mouseOffset[1]];
		}
	},

	getMouseOffset : function(){
		var offset = this.anchor ? [0,0] : [15,18];
		if(this.mouseOffset){
			offset[0] += this.mouseOffset[0];
			offset[1] += this.mouseOffset[1];
		}
		return offset;
	},


	getAnchorPosition : function(){
		if(this.anchor){
			this.tipAnchor = this.anchor.charAt(0);
		}else{
			var m = this.defaultAlign.match(/^([a-z]+)-([a-z]+)(\?)?$/);
			if(!m){
				throw 'AnchorTip.defaultAlign is invalid';
			}
			this.tipAnchor = m[1].charAt(0);
		}

		switch(this.tipAnchor){
			case 't': return 'top';
			case 'b': return 'bottom';
			case 'r': return 'right';
		}
		return 'left';
	},


	getAnchorAlign : function(){
		switch(this.anchor){
			case 'top'  : return 'tl-bl';
			case 'left' : return 'tl-tr';
			case 'right': return 'tr-tl';
			default     : return 'bl-tl';
		}
	},


	getOffsets : function(){
		var offsets,
			ap = this.getAnchorPosition().charAt(0);
		if(this.anchorToTarget && !this.trackMouse){
			switch(ap){
				case 't':
					offsets = [0, 9];
					break;
				case 'b':
					offsets = [0, -13];
					break;
				case 'r':
					offsets = [-13, 0];
					break;
				default:
					offsets = [9, 0];
					break;
			}
		}else{
			switch(ap){
				case 't':
					offsets = [-15-this.anchorOffset, 30];
					break;
				case 'b':
					offsets = [-19-this.anchorOffset, -13-this.el.dom.offsetHeight];
					break;
				case 'r':
					offsets = [-15-this.el.dom.offsetWidth, -13-this.anchorOffset];
					break;
				default:
					offsets = [25, -13-this.anchorOffset];
					break;
			}
		}
		var mouseOffset = this.getMouseOffset();
		offsets[0] += mouseOffset[0];
		offsets[1] += mouseOffset[1];

		return offsets;
	},


	onTargetOver : function(e){
		if(this.disabled || e.within(this.target.dom, true)){
			return;
		}
		var t = e.getTarget(this.delegate);
		if (t) {
			this.triggerElement = t;
			this.clearTimer('hide');
			this.targetXY = e.getXY();
			this.delayShow();
		}
	},


	delayShow : function(){
		if(this.hidden && !this.showTimer){
			if(this.lastActive.getElapsed() < this.quickShowInterval){
				this.show();
			}else{
				this.showTimer = this.show.defer(this.showDelay, this);
			}
		}else if(!this.hidden && this.autoHide !== false){
			this.show();
		}
	},


	onTargetOut : function(e){
		if(this.disabled || e.within(this.target.dom, true)){
			return;
		}
		this.clearTimer('show');
		if(this.autoHide !== false){
			this.delayHide();
		}
	},


	delayHide : function(){
		if(!this.hidden && !this.hideTimer){
			this.hideTimer = this.hide.defer(this.hideDelay, this);
		}
	},


	hide: function(){
		this.clearTimer('dismiss');
		this.lastActive = new Date();
		if(this.anchorEl){
			this.anchorEl.hide();
		}
		Ext.ToolTip.superclass.hide.call(this);
		delete this.triggerElement;
	},


	show : function(){
		if(this.anchor){


			this.showAt([-1000,-1000]);
			this.origConstrainPosition = this.constrainPosition;
			this.constrainPosition = false;
			this.anchor = this.origAnchor;
		}
		this.showAt(this.getTargetXY());

		if(this.anchor){
			this.syncAnchor();
			this.anchorEl.show();
			this.constrainPosition = this.origConstrainPosition;
		}else{
			this.anchorEl.hide();
		}
	},


	showAt : function(xy){
		this.lastActive = new Date();
		this.clearTimers();
		Ext.ToolTip.superclass.showAt.call(this, xy);
		if(this.dismissDelay && this.autoHide !== false){
			this.dismissTimer = this.hide.defer(this.dismissDelay, this);
		}
		if(this.anchor && !this.anchorEl.isVisible()){
			this.syncAnchor();
			this.anchorEl.show();
		}
	},


	syncAnchor : function(){
		var anchorPos, targetPos, offset;
		switch(this.tipAnchor.charAt(0)){
			case 't':
				anchorPos = 'b';
				targetPos = 'tl';
				offset = [20+this.anchorOffset, 2];
				break;
			case 'r':
				anchorPos = 'l';
				targetPos = 'tr';
				offset = [-2, 11+this.anchorOffset];
				break;
			case 'b':
				anchorPos = 't';
				targetPos = 'bl';
				offset = [20+this.anchorOffset, -2];
				break;
			default:
				anchorPos = 'r';
				targetPos = 'tl';
				offset = [2, 11+this.anchorOffset];
				break;
		}
		this.anchorEl.alignTo(this.el, anchorPos+'-'+targetPos, offset);
	},


	setPagePosition : function(x, y){
		Ext.ToolTip.superclass.setPagePosition.call(this, x, y);
		if(this.anchor){
			this.syncAnchor();
		}
	},


	clearTimer : function(name){
		name = name + 'Timer';
		clearTimeout(this[name]);
		delete this[name];
	},


	clearTimers : function(){
		this.clearTimer('show');
		this.clearTimer('dismiss');
		this.clearTimer('hide');
	},


	onShow : function(){
		Ext.ToolTip.superclass.onShow.call(this);
		Ext.getDoc().on('mousedown', this.onDocMouseDown, this);
	},


	onHide : function(){
		Ext.ToolTip.superclass.onHide.call(this);
		Ext.getDoc().un('mousedown', this.onDocMouseDown, this);
	},


	onDocMouseDown : function(e){
		if(this.autoHide !== true && !this.closable && !e.within(this.el.dom)){
			this.disable();
			this.enable.defer(100, this);
		}
	},


	onDisable : function(){
		this.clearTimers();
		this.hide();
	},


	adjustPosition : function(x, y){
		if(this.contstrainPosition){
			var ay = this.targetXY[1], h = this.getSize().height;
			if(y <= ay && (y+h) >= ay){
				y = ay-h-5;
			}
		}
		return {x : x, y: y};
	},

	beforeDestroy : function(){
		this.clearTimers();
		Ext.destroy(this.anchorEl);
		delete this.anchorEl;
		delete this.target;
		delete this.anchorTarget;
		delete this.triggerElement;
		Ext.ToolTip.superclass.beforeDestroy.call(this);
	},


	onDestroy : function(){
		Ext.getDoc().un('mousedown', this.onDocMouseDown, this);
		Ext.ToolTip.superclass.onDestroy.call(this);
	}
});

Ext.reg('tooltip', Ext.ToolTip);
Ext.QuickTip = Ext.extend(Ext.ToolTip, {


	interceptTitles : false,


	tagConfig : {
		namespace : "ext",
		attribute : "qtip",
		width : "qwidth",
		target : "target",
		title : "qtitle",
		hide : "hide",
		cls : "qclass",
		align : "qalign",
		anchor : "anchor"
	},


	initComponent : function(){
		this.target = this.target || Ext.getDoc();
		this.targets = this.targets || {};
		Ext.QuickTip.superclass.initComponent.call(this);
	},


	register : function(config){
		var cs = Ext.isArray(config) ? config : arguments;
		for(var i = 0, len = cs.length; i < len; i++){
			var c = cs[i];
			var target = c.target;
			if(target){
				if(Ext.isArray(target)){
					for(var j = 0, jlen = target.length; j < jlen; j++){
						this.targets[Ext.id(target[j])] = c;
					}
				} else{
					this.targets[Ext.id(target)] = c;
				}
			}
		}
	},


	unregister : function(el){
		delete this.targets[Ext.id(el)];
	},


	cancelShow: function(el){
		var at = this.activeTarget;
		el = Ext.get(el).dom;
		if(this.isVisible()){
			if(at && at.el == el){
				this.hide();
			}
		}else if(at && at.el == el){
			this.clearTimer('show');
		}
	},

	getTipCfg: function(e) {
		var t = e.getTarget(),
			ttp,
			cfg;
		if(this.interceptTitles && t.title && Ext.isString(t.title)){
			ttp = t.title;
			t.qtip = ttp;
			t.removeAttribute("title");
			e.preventDefault();
		}else{
			cfg = this.tagConfig;
			ttp = t.qtip || Ext.fly(t).getAttribute(cfg.attribute, cfg.namespace);
		}
		return ttp;
	},


	onTargetOver : function(e){
		if(this.disabled){
			return;
		}
		this.targetXY = e.getXY();
		var t = e.getTarget();
		if(!t || t.nodeType !== 1 || t == document || t == document.body){
			return;
		}
		if(this.activeTarget && ((t == this.activeTarget.el) || Ext.fly(this.activeTarget.el).contains(t))){
			this.clearTimer('hide');
			this.show();
			return;
		}
		if(t && this.targets[t.id]){
			this.activeTarget = this.targets[t.id];
			this.activeTarget.el = t;
			this.anchor = this.activeTarget.anchor;
			if(this.anchor){
				this.anchorTarget = t;
			}
			this.delayShow();
			return;
		}
		var ttp, et = Ext.fly(t), cfg = this.tagConfig, ns = cfg.namespace;
		if(ttp = this.getTipCfg(e)){
			var autoHide = et.getAttribute(cfg.hide, ns);
			this.activeTarget = {
				el: t,
				text: ttp,
				width: et.getAttribute(cfg.width, ns),
				autoHide: autoHide != "user" && autoHide !== 'false',
				title: et.getAttribute(cfg.title, ns),
				cls: et.getAttribute(cfg.cls, ns),
				align: et.getAttribute(cfg.align, ns)

			};
			this.anchor = et.getAttribute(cfg.anchor, ns);
			if(this.anchor){
				this.anchorTarget = t;
			}
			this.delayShow();
		}
	},


	onTargetOut : function(e){


		if (this.activeTarget && e.within(this.activeTarget.el) && !this.getTipCfg(e)) {
			return;
		}

		this.clearTimer('show');
		if(this.autoHide !== false){
			this.delayHide();
		}
	},


	showAt : function(xy){
		var t = this.activeTarget;
		if(t){
			if(!this.rendered){
				this.render(Ext.getBody());
				this.activeTarget = t;
			}
			if(t.width){
				this.setWidth(t.width);
				this.body.setWidth(this.adjustBodyWidth(t.width - this.getFrameWidth()));
				this.measureWidth = false;
			} else{
				this.measureWidth = true;
			}
			this.setTitle(t.title || '');
			this.body.update(t.text);
			this.autoHide = t.autoHide;
			this.dismissDelay = t.dismissDelay || this.dismissDelay;
			if(this.lastCls){
				this.el.removeClass(this.lastCls);
				delete this.lastCls;
			}
			if(t.cls){
				this.el.addClass(t.cls);
				this.lastCls = t.cls;
			}
			if(this.anchor){
				this.constrainPosition = false;
			}else if(t.align){
				xy = this.el.getAlignToXY(t.el, t.align);
				this.constrainPosition = false;
			}else{
				this.constrainPosition = true;
			}
		}
		Ext.QuickTip.superclass.showAt.call(this, xy);
	},


	hide: function(){
		delete this.activeTarget;
		Ext.QuickTip.superclass.hide.call(this);
	}
});
Ext.reg('quicktip', Ext.QuickTip);
Ext.QuickTips = function(){
	var tip, locks = [];
	return {

		init : function(autoRender){
			if(!tip){
				if(!Ext.isReady){
					Ext.onReady(function(){
						Ext.QuickTips.init(autoRender);
					});
					return;
				}
				tip = new Ext.QuickTip({elements:'header,body'});
				if(autoRender !== false){
					tip.render(Ext.getBody());
				}
			}
		},


		enable : function(){
			if(tip){
				locks.pop();
				if(locks.length < 1){
					tip.enable();
				}
			}
		},


		disable : function(){
			if(tip){
				tip.disable();
			}
			locks.push(1);
		},


		isEnabled : function(){
			return tip !== undefined && !tip.disabled;
		},


		getQuickTip : function(){
			return tip;
		},


		register : function(){
			tip.register.apply(tip, arguments);
		},


		unregister : function(){
			tip.unregister.apply(tip, arguments);
		},


		tips :function(){
			tip.register.apply(tip, arguments);
		}
	}
}();
Ext.tree.TreePanel = Ext.extend(Ext.Panel, {
	rootVisible : true,
	animate : Ext.enableFx,
	lines : true,
	enableDD : false,
	hlDrop : Ext.enableFx,
	pathSeparator : '/',


	bubbleEvents : [],

	initComponent : function(){
		Ext.tree.TreePanel.superclass.initComponent.call(this);

		if(!this.eventModel){
			this.eventModel = new Ext.tree.TreeEventModel(this);
		}


		var l = this.loader;
		if(!l){
			l = new Ext.tree.TreeLoader({
				dataUrl: this.dataUrl,
				requestMethod: this.requestMethod
			});
		}else if(Ext.isObject(l) && !l.load){
			l = new Ext.tree.TreeLoader(l);
		}
		this.loader = l;

		this.nodeHash = {};


		if(this.root){
			var r = this.root;
			delete this.root;
			this.setRootNode(r);
		}


		this.addEvents(


			'append',

			'remove',

			'movenode',

			'insert',

			'beforeappend',

			'beforeremove',

			'beforemovenode',

			'beforeinsert',


			'beforeload',

			'load',

			'textchange',

			'beforeexpandnode',

			'beforecollapsenode',

			'expandnode',

			'disabledchange',

			'collapsenode',

			'beforeclick',

			'click',

			'containerclick',

			'checkchange',

			'beforedblclick',

			'dblclick',

			'containerdblclick',

			'contextmenu',

			'containercontextmenu',

			'beforechildrenrendered',

			'startdrag',

			'enddrag',

			'dragdrop',

			'beforenodedrop',

			'nodedrop',

			'nodedragover'
		);
		if(this.singleExpand){
			this.on('beforeexpandnode', this.restrictExpand, this);
		}
	},


	proxyNodeEvent : function(ename, a1, a2, a3, a4, a5, a6){
		if(ename == 'collapse' || ename == 'expand' || ename == 'beforecollapse' || ename == 'beforeexpand' || ename == 'move' || ename == 'beforemove'){
			ename = ename+'node';
		}

		return this.fireEvent(ename, a1, a2, a3, a4, a5, a6);
	},



	getRootNode : function(){
		return this.root;
	},


	setRootNode : function(node){
		Ext.destroy(this.root);
		if(!node.render){
			node = this.loader.createNode(node);
		}
		this.root = node;
		node.ownerTree = this;
		node.isRoot = true;
		this.registerNode(node);
		if(!this.rootVisible){
			var uiP = node.attributes.uiProvider;
			node.ui = uiP ? new uiP(node) : new Ext.tree.RootTreeNodeUI(node);
		}
		if (this.innerCt) {
			this.innerCt.update('');
			this.afterRender();
		}
		return node;
	},


	getNodeById : function(id){
		return this.nodeHash[id];
	},


	registerNode : function(node){
		this.nodeHash[node.id] = node;
	},


	unregisterNode : function(node){
		delete this.nodeHash[node.id];
	},


	toString : function(){
		return '[Tree'+(this.id?' '+this.id:'')+']';
	},


	restrictExpand : function(node){
		var p = node.parentNode;
		if(p){
			if(p.expandedChild && p.expandedChild.parentNode == p){
				p.expandedChild.collapse();
			}
			p.expandedChild = node;
		}
	},


	getChecked : function(a, startNode){
		startNode = startNode || this.root;
		var r = [];
		var f = function(){
			if(this.attributes.checked){
				r.push(!a ? this : (a == 'id' ? this.id : this.attributes[a]));
			}
		};
		startNode.cascade(f);
		return r;
	},


	getLoader : function(){
		return this.loader;
	},


	expandAll : function(){
		this.root.expand(true);
	},


	collapseAll : function(){
		this.root.collapse(true);
	},


	getSelectionModel : function(){
		if(!this.selModel){
			this.selModel = new Ext.tree.DefaultSelectionModel();
		}
		return this.selModel;
	},


	expandPath : function(path, attr, callback){
		attr = attr || 'id';
		var keys = path.split(this.pathSeparator);
		var curNode = this.root;
		if(curNode.attributes[attr] != keys[1]){
			if(callback){
				callback(false, null);
			}
			return;
		}
		var index = 1;
		var f = function(){
			if(++index == keys.length){
				if(callback){
					callback(true, curNode);
				}
				return;
			}
			var c = curNode.findChild(attr, keys[index]);
			if(!c){
				if(callback){
					callback(false, curNode);
				}
				return;
			}
			curNode = c;
			c.expand(false, false, f);
		};
		curNode.expand(false, false, f);
	},


	selectPath : function(path, attr, callback){
		attr = attr || 'id';
		var keys = path.split(this.pathSeparator),
			v = keys.pop();
		if(keys.length > 1){
			var f = function(success, node){
				if(success && node){
					var n = node.findChild(attr, v);
					if(n){
						n.select();
						if(callback){
							callback(true, n);
						}
					}else if(callback){
						callback(false, n);
					}
				}else{
					if(callback){
						callback(false, n);
					}
				}
			};
			this.expandPath(keys.join(this.pathSeparator), attr, f);
		}else{
			this.root.select();
			if(callback){
				callback(true, this.root);
			}
		}
	},


	getTreeEl : function(){
		return this.body;
	},


	onRender : function(ct, position){
		Ext.tree.TreePanel.superclass.onRender.call(this, ct, position);
		this.el.addClass('x-tree');
		this.innerCt = this.body.createChild({tag:'ul',
			cls:'x-tree-root-ct ' +
				(this.useArrows ? 'x-tree-arrows' : this.lines ? 'x-tree-lines' : 'x-tree-no-lines')});
	},


	initEvents : function(){
		Ext.tree.TreePanel.superclass.initEvents.call(this);

		if(this.containerScroll){
			Ext.dd.ScrollManager.register(this.body);
		}
		if((this.enableDD || this.enableDrop) && !this.dropZone){

			this.dropZone = new Ext.tree.TreeDropZone(this, this.dropConfig || {
				ddGroup: this.ddGroup || 'TreeDD', appendOnly: this.ddAppendOnly === true
			});
		}
		if((this.enableDD || this.enableDrag) && !this.dragZone){

			this.dragZone = new Ext.tree.TreeDragZone(this, this.dragConfig || {
				ddGroup: this.ddGroup || 'TreeDD',
				scroll: this.ddScroll
			});
		}
		this.getSelectionModel().init(this);
	},


	afterRender : function(){
		Ext.tree.TreePanel.superclass.afterRender.call(this);
		this.root.render();
		if(!this.rootVisible){
			this.root.renderChildren();
		}
	},

	beforeDestroy : function(){
		if(this.rendered){
			Ext.dd.ScrollManager.unregister(this.body);
			Ext.destroy(this.dropZone, this.dragZone);
		}
		Ext.destroy(this.root, this.loader);
		this.nodeHash = this.root = this.loader = null;
		Ext.tree.TreePanel.superclass.beforeDestroy.call(this);
	}
















































});

Ext.tree.TreePanel.nodeTypes = {};

Ext.reg('treepanel', Ext.tree.TreePanel);Ext.tree.TreeEventModel = function(tree){
	this.tree = tree;
	this.tree.on('render', this.initEvents, this);
}

Ext.tree.TreeEventModel.prototype = {
	initEvents : function(){
		var t = this.tree;

		if(t.trackMouseOver !== false){
			t.mon(t.innerCt, {
				scope: this,
				mouseover: this.delegateOver,
				mouseout: this.delegateOut
			});
		}
		t.mon(t.getTreeEl(), {
			scope: this,
			click: this.delegateClick,
			dblclick: this.delegateDblClick,
			contextmenu: this.delegateContextMenu
		});
	},

	getNode : function(e){
		var t;
		if(t = e.getTarget('.x-tree-node-el', 10)){
			var id = Ext.fly(t, '_treeEvents').getAttribute('tree-node-id', 'ext');
			if(id){
				return this.tree.getNodeById(id);
			}
		}
		return null;
	},

	getNodeTarget : function(e){
		var t = e.getTarget('.x-tree-node-icon', 1);
		if(!t){
			t = e.getTarget('.x-tree-node-el', 6);
		}
		return t;
	},

	delegateOut : function(e, t){
		if(!this.beforeEvent(e)){
			return;
		}
		if(e.getTarget('.x-tree-ec-icon', 1)){
			var n = this.getNode(e);
			this.onIconOut(e, n);
			if(n == this.lastEcOver){
				delete this.lastEcOver;
			}
		}
		if((t = this.getNodeTarget(e)) && !e.within(t, true)){
			this.onNodeOut(e, this.getNode(e));
		}
	},

	delegateOver : function(e, t){
		if(!this.beforeEvent(e)){
			return;
		}
		if(Ext.isGecko && !this.trackingDoc){
			Ext.getBody().on('mouseover', this.trackExit, this);
			this.trackingDoc = true;
		}
		if(this.lastEcOver){
			this.onIconOut(e, this.lastEcOver);
			delete this.lastEcOver;
		}
		if(e.getTarget('.x-tree-ec-icon', 1)){
			this.lastEcOver = this.getNode(e);
			this.onIconOver(e, this.lastEcOver);
		}
		if(t = this.getNodeTarget(e)){
			this.onNodeOver(e, this.getNode(e));
		}
	},

	trackExit : function(e){
		if(this.lastOverNode && !e.within(this.lastOverNode.ui.getEl())){
			this.onNodeOut(e, this.lastOverNode);
			delete this.lastOverNode;
			Ext.getBody().un('mouseover', this.trackExit, this);
			this.trackingDoc = false;
		}
	},

	delegateClick : function(e, t){
		if(this.beforeEvent(e)){
			if(e.getTarget('input[type=checkbox]', 1)){
				this.onCheckboxClick(e, this.getNode(e));
			}else if(e.getTarget('.x-tree-ec-icon', 1)){
				this.onIconClick(e, this.getNode(e));
			}else if(this.getNodeTarget(e)){
				this.onNodeClick(e, this.getNode(e));
			}else{
				this.onContainerEvent(e, 'click');
			}
		}
	},

	delegateDblClick : function(e, t){
		if(this.beforeEvent(e)){
			if(this.getNodeTarget(e)){
				this.onNodeDblClick(e, this.getNode(e));
			}else{
				this.onContainerEvent(e, 'dblclick');
			}
		}
	},

	delegateContextMenu : function(e, t){
		if(this.beforeEvent(e)){
			if(this.getNodeTarget(e)){
				this.onNodeContextMenu(e, this.getNode(e));
			}else{
				this.onContainerEvent(e, 'contextmenu');
			}
		}
	},

	onContainerEvent: function(e, type){
		this.tree.fireEvent('container' + type, this.tree, e);
	},

	onNodeClick : function(e, node){
		node.ui.onClick(e);
	},

	onNodeOver : function(e, node){
		this.lastOverNode = node;
		node.ui.onOver(e);
	},

	onNodeOut : function(e, node){
		node.ui.onOut(e);
	},

	onIconOver : function(e, node){
		node.ui.addClass('x-tree-ec-over');
	},

	onIconOut : function(e, node){
		node.ui.removeClass('x-tree-ec-over');
	},

	onIconClick : function(e, node){
		node.ui.ecClick(e);
	},

	onCheckboxClick : function(e, node){
		node.ui.onCheckChange(e);
	},

	onNodeDblClick : function(e, node){
		node.ui.onDblClick(e);
	},

	onNodeContextMenu : function(e, node){
		node.ui.onContextMenu(e);
	},

	beforeEvent : function(e){
		if(this.disabled){
			e.stopEvent();
			return false;
		}
		return true;
	},

	disable: function(){
		this.disabled = true;
	},

	enable: function(){
		this.disabled = false;
	}
};
Ext.tree.DefaultSelectionModel = function(config){
	this.selNode = null;

	this.addEvents(

		'selectionchange',


		'beforeselect'
	);

	Ext.apply(this, config);
	Ext.tree.DefaultSelectionModel.superclass.constructor.call(this);
};

Ext.extend(Ext.tree.DefaultSelectionModel, Ext.util.Observable, {
	init : function(tree){
		this.tree = tree;
		tree.mon(tree.getTreeEl(), 'keydown', this.onKeyDown, this);
		tree.on('click', this.onNodeClick, this);
	},

	onNodeClick : function(node, e){
		this.select(node);
	},


	select : function(node,  selectNextNode){

		if (!Ext.fly(node.ui.wrap).isVisible() && selectNextNode) {
			return selectNextNode.call(this, node);
		}
		var last = this.selNode;
		if(node == last){
			node.ui.onSelectedChange(true);
		}else if(this.fireEvent('beforeselect', this, node, last) !== false){
			if(last && last.ui){
				last.ui.onSelectedChange(false);
			}
			this.selNode = node;
			node.ui.onSelectedChange(true);
			this.fireEvent('selectionchange', this, node, last);
		}
		return node;
	},


	unselect : function(node, silent){
		if(this.selNode == node){
			this.clearSelections(silent);
		}
	},


	clearSelections : function(silent){
		var n = this.selNode;
		if(n){
			n.ui.onSelectedChange(false);
			this.selNode = null;
			if(silent !== true){
				this.fireEvent('selectionchange', this, null);
			}
		}
		return n;
	},


	getSelectedNode : function(){
		return this.selNode;
	},


	isSelected : function(node){
		return this.selNode == node;
	},


	selectPrevious : function( s){
		if(!(s = s || this.selNode || this.lastSelNode)){
			return null;
		}

		var ps = s.previousSibling;
		if(ps){
			if(!ps.isExpanded() || ps.childNodes.length < 1){
				return this.select(ps, this.selectPrevious);
			} else{
				var lc = ps.lastChild;
				while(lc && lc.isExpanded() && Ext.fly(lc.ui.wrap).isVisible() && lc.childNodes.length > 0){
					lc = lc.lastChild;
				}
				return this.select(lc, this.selectPrevious);
			}
		} else if(s.parentNode && (this.tree.rootVisible || !s.parentNode.isRoot)){
			return this.select(s.parentNode, this.selectPrevious);
		}
		return null;
	},


	selectNext : function( s){
		if(!(s = s || this.selNode || this.lastSelNode)){
			return null;
		}

		if(s.firstChild && s.isExpanded() && Ext.fly(s.ui.wrap).isVisible()){
			return this.select(s.firstChild, this.selectNext);
		}else if(s.nextSibling){
			return this.select(s.nextSibling, this.selectNext);
		}else if(s.parentNode){
			var newS = null;
			s.parentNode.bubble(function(){
				if(this.nextSibling){
					newS = this.getOwnerTree().selModel.select(this.nextSibling, this.selectNext);
					return false;
				}
			});
			return newS;
		}
		return null;
	},

	onKeyDown : function(e){
		var s = this.selNode || this.lastSelNode;

		var sm = this;
		if(!s){
			return;
		}
		var k = e.getKey();
		switch(k){
			case e.DOWN:
				e.stopEvent();
				this.selectNext();
				break;
			case e.UP:
				e.stopEvent();
				this.selectPrevious();
				break;
			case e.RIGHT:
				e.preventDefault();
				if(s.hasChildNodes()){
					if(!s.isExpanded()){
						s.expand();
					}else if(s.firstChild){
						this.select(s.firstChild, e);
					}
				}
				break;
			case e.LEFT:
				e.preventDefault();
				if(s.hasChildNodes() && s.isExpanded()){
					s.collapse();
				}else if(s.parentNode && (this.tree.rootVisible || s.parentNode != this.tree.getRootNode())){
					this.select(s.parentNode, e);
				}
				break;
		};
	}
});


Ext.tree.MultiSelectionModel = function(config){
	this.selNodes = [];
	this.selMap = {};
	this.addEvents(

		'selectionchange'
	);
	Ext.apply(this, config);
	Ext.tree.MultiSelectionModel.superclass.constructor.call(this);
};

Ext.extend(Ext.tree.MultiSelectionModel, Ext.util.Observable, {
	init : function(tree){
		this.tree = tree;
		tree.mon(tree.getTreeEl(), 'keydown', this.onKeyDown, this);
		tree.on('click', this.onNodeClick, this);
	},

	onNodeClick : function(node, e){
		if(e.ctrlKey && this.isSelected(node)){
			this.unselect(node);
		}else{
			this.select(node, e, e.ctrlKey);
		}
	},


	select : function(node, e, keepExisting){
		if(keepExisting !== true){
			this.clearSelections(true);
		}
		if(this.isSelected(node)){
			this.lastSelNode = node;
			return node;
		}
		this.selNodes.push(node);
		this.selMap[node.id] = node;
		this.lastSelNode = node;
		node.ui.onSelectedChange(true);
		this.fireEvent('selectionchange', this, this.selNodes);
		return node;
	},


	unselect : function(node){
		if(this.selMap[node.id]){
			node.ui.onSelectedChange(false);
			var sn = this.selNodes;
			var index = sn.indexOf(node);
			if(index != -1){
				this.selNodes.splice(index, 1);
			}
			delete this.selMap[node.id];
			this.fireEvent('selectionchange', this, this.selNodes);
		}
	},


	clearSelections : function(suppressEvent){
		var sn = this.selNodes;
		if(sn.length > 0){
			for(var i = 0, len = sn.length; i < len; i++){
				sn[i].ui.onSelectedChange(false);
			}
			this.selNodes = [];
			this.selMap = {};
			if(suppressEvent !== true){
				this.fireEvent('selectionchange', this, this.selNodes);
			}
		}
	},


	isSelected : function(node){
		return this.selMap[node.id] ? true : false;
	},


	getSelectedNodes : function(){
		return this.selNodes;
	},

	onKeyDown : Ext.tree.DefaultSelectionModel.prototype.onKeyDown,

	selectNext : Ext.tree.DefaultSelectionModel.prototype.selectNext,

	selectPrevious : Ext.tree.DefaultSelectionModel.prototype.selectPrevious
});
Ext.data.Tree = function(root){
	this.nodeHash = {};

	this.root = null;
	if(root){
		this.setRootNode(root);
	}
	this.addEvents(

		"append",

		"remove",

		"move",

		"insert",

		"beforeappend",

		"beforeremove",

		"beforemove",

		"beforeinsert"
	);

	Ext.data.Tree.superclass.constructor.call(this);
};

Ext.extend(Ext.data.Tree, Ext.util.Observable, {

	pathSeparator: "/",


	proxyNodeEvent : function(){
		return this.fireEvent.apply(this, arguments);
	},


	getRootNode : function(){
		return this.root;
	},


	setRootNode : function(node){
		this.root = node;
		node.ownerTree = this;
		node.isRoot = true;
		this.registerNode(node);
		return node;
	},


	getNodeById : function(id){
		return this.nodeHash[id];
	},


	registerNode : function(node){
		this.nodeHash[node.id] = node;
	},


	unregisterNode : function(node){
		delete this.nodeHash[node.id];
	},

	toString : function(){
		return "[Tree"+(this.id?" "+this.id:"")+"]";
	}
});


Ext.data.Node = function(attributes){

	this.attributes = attributes || {};
	this.leaf = this.attributes.leaf;

	this.id = this.attributes.id;
	if(!this.id){
		this.id = Ext.id(null, "xnode-");
		this.attributes.id = this.id;
	}

	this.childNodes = [];
	if(!this.childNodes.indexOf){
		this.childNodes.indexOf = function(o){
			for(var i = 0, len = this.length; i < len; i++){
				if(this[i] == o){
					return i;
				}
			}
			return -1;
		};
	}

	this.parentNode = null;

	this.firstChild = null;

	this.lastChild = null;

	this.previousSibling = null;

	this.nextSibling = null;

	this.addEvents({

		"append" : true,

		"remove" : true,

		"move" : true,

		"insert" : true,

		"beforeappend" : true,

		"beforeremove" : true,

		"beforemove" : true,

		"beforeinsert" : true
	});
	this.listeners = this.attributes.listeners;
	Ext.data.Node.superclass.constructor.call(this);
};

Ext.extend(Ext.data.Node, Ext.util.Observable, {

	fireEvent : function(evtName){

		if(Ext.data.Node.superclass.fireEvent.apply(this, arguments) === false){
			return false;
		}

		var ot = this.getOwnerTree();
		if(ot){
			if(ot.proxyNodeEvent.apply(ot, arguments) === false){
				return false;
			}
		}
		return true;
	},


	isLeaf : function(){
		return this.leaf === true;
	},


	setFirstChild : function(node){
		this.firstChild = node;
	},


	setLastChild : function(node){
		this.lastChild = node;
	},



	isLast : function(){
		return (!this.parentNode ? true : this.parentNode.lastChild == this);
	},


	isFirst : function(){
		return (!this.parentNode ? true : this.parentNode.firstChild == this);
	},


	hasChildNodes : function(){
		return !this.isLeaf() && this.childNodes.length > 0;
	},


	isExpandable : function(){
		return this.attributes.expandable || this.hasChildNodes();
	},


	appendChild : function(node){
		var multi = false;
		if(Ext.isArray(node)){
			multi = node;
		}else if(arguments.length > 1){
			multi = arguments;
		}

		if(multi){
			for(var i = 0, len = multi.length; i < len; i++) {
				this.appendChild(multi[i]);
			}
		}else{
			if(this.fireEvent("beforeappend", this.ownerTree, this, node) === false){
				return false;
			}
			var index = this.childNodes.length;
			var oldParent = node.parentNode;

			if(oldParent){
				if(node.fireEvent("beforemove", node.getOwnerTree(), node, oldParent, this, index) === false){
					return false;
				}
				oldParent.removeChild(node);
			}
			index = this.childNodes.length;
			if(index === 0){
				this.setFirstChild(node);
			}
			this.childNodes.push(node);
			node.parentNode = this;
			var ps = this.childNodes[index-1];
			if(ps){
				node.previousSibling = ps;
				ps.nextSibling = node;
			}else{
				node.previousSibling = null;
			}
			node.nextSibling = null;
			this.setLastChild(node);
			node.setOwnerTree(this.getOwnerTree());
			this.fireEvent("append", this.ownerTree, this, node, index);
			if(oldParent){
				node.fireEvent("move", this.ownerTree, node, oldParent, this, index);
			}
			return node;
		}
	},


	removeChild : function(node, destroy){
		var index = this.childNodes.indexOf(node);
		if(index == -1){
			return false;
		}
		if(this.fireEvent("beforeremove", this.ownerTree, this, node) === false){
			return false;
		}


		this.childNodes.splice(index, 1);


		if(node.previousSibling){
			node.previousSibling.nextSibling = node.nextSibling;
		}
		if(node.nextSibling){
			node.nextSibling.previousSibling = node.previousSibling;
		}


		if(this.firstChild == node){
			this.setFirstChild(node.nextSibling);
		}
		if(this.lastChild == node){
			this.setLastChild(node.previousSibling);
		}

		node.clear();
		this.fireEvent("remove", this.ownerTree, this, node);
		if(destroy){
			node.destroy();
		}
		return node;
	},


	clear : function(destroy){

		this.setOwnerTree(null, destroy);
		this.parentNode = this.previousSibling = this.nextSibling = null
		if(destroy){
			this.firstChild = this.lastChild = null;
		}
	},


	destroy : function(){
		this.purgeListeners();
		this.clear(true);
		Ext.each(this.childNodes, function(n){
			n.destroy();
		});
		this.childNodes = null;
	},


	insertBefore : function(node, refNode){
		if(!refNode){
			return this.appendChild(node);
		}

		if(node == refNode){
			return false;
		}

		if(this.fireEvent("beforeinsert", this.ownerTree, this, node, refNode) === false){
			return false;
		}
		var index = this.childNodes.indexOf(refNode);
		var oldParent = node.parentNode;
		var refIndex = index;


		if(oldParent == this && this.childNodes.indexOf(node) < index){
			refIndex--;
		}


		if(oldParent){
			if(node.fireEvent("beforemove", node.getOwnerTree(), node, oldParent, this, index, refNode) === false){
				return false;
			}
			oldParent.removeChild(node);
		}
		if(refIndex === 0){
			this.setFirstChild(node);
		}
		this.childNodes.splice(refIndex, 0, node);
		node.parentNode = this;
		var ps = this.childNodes[refIndex-1];
		if(ps){
			node.previousSibling = ps;
			ps.nextSibling = node;
		}else{
			node.previousSibling = null;
		}
		node.nextSibling = refNode;
		refNode.previousSibling = node;
		node.setOwnerTree(this.getOwnerTree());
		this.fireEvent("insert", this.ownerTree, this, node, refNode);
		if(oldParent){
			node.fireEvent("move", this.ownerTree, node, oldParent, this, refIndex, refNode);
		}
		return node;
	},


	remove : function(destroy){
		this.parentNode.removeChild(this, destroy);
		return this;
	},


	item : function(index){
		return this.childNodes[index];
	},


	replaceChild : function(newChild, oldChild){
		var s = oldChild ? oldChild.nextSibling : null;
		this.removeChild(oldChild);
		this.insertBefore(newChild, s);
		return oldChild;
	},


	indexOf : function(child){
		return this.childNodes.indexOf(child);
	},


	getOwnerTree : function(){

		if(!this.ownerTree){
			var p = this;
			while(p){
				if(p.ownerTree){
					this.ownerTree = p.ownerTree;
					break;
				}
				p = p.parentNode;
			}
		}
		return this.ownerTree;
	},


	getDepth : function(){
		var depth = 0;
		var p = this;
		while(p.parentNode){
			++depth;
			p = p.parentNode;
		}
		return depth;
	},


	setOwnerTree : function(tree, destroy){

		if(tree != this.ownerTree){
			if(this.ownerTree){
				this.ownerTree.unregisterNode(this);
			}
			this.ownerTree = tree;

			if(destroy !== true){
				Ext.each(this.childNodes, function(n){
					n.setOwnerTree(tree);
				});
			}
			if(tree){
				tree.registerNode(this);
			}
		}
	},


	setId: function(id){
		if(id !== this.id){
			var t = this.ownerTree;
			if(t){
				t.unregisterNode(this);
			}
			this.id = this.attributes.id = id;
			if(t){
				t.registerNode(this);
			}
			this.onIdChange(id);
		}
	},


	onIdChange: Ext.emptyFn,


	getPath : function(attr){
		attr = attr || "id";
		var p = this.parentNode;
		var b = [this.attributes[attr]];
		while(p){
			b.unshift(p.attributes[attr]);
			p = p.parentNode;
		}
		var sep = this.getOwnerTree().pathSeparator;
		return sep + b.join(sep);
	},


	bubble : function(fn, scope, args){
		var p = this;
		while(p){
			if(fn.apply(scope || p, args || [p]) === false){
				break;
			}
			p = p.parentNode;
		}
	},


	cascade : function(fn, scope, args){
		if(fn.apply(scope || this, args || [this]) !== false){
			var cs = this.childNodes;
			for(var i = 0, len = cs.length; i < len; i++) {
				cs[i].cascade(fn, scope, args);
			}
		}
	},


	eachChild : function(fn, scope, args){
		var cs = this.childNodes;
		for(var i = 0, len = cs.length; i < len; i++) {
			if(fn.apply(scope || this, args || [cs[i]]) === false){
				break;
			}
		}
	},


	findChild : function(attribute, value){
		var cs = this.childNodes;
		for(var i = 0, len = cs.length; i < len; i++) {
			if(cs[i].attributes[attribute] == value){
				return cs[i];
			}
		}
		return null;
	},


	findChildBy : function(fn, scope){
		var cs = this.childNodes;
		for(var i = 0, len = cs.length; i < len; i++) {
			if(fn.call(scope||cs[i], cs[i]) === true){
				return cs[i];
			}
		}
		return null;
	},


	sort : function(fn, scope){
		var cs = this.childNodes;
		var len = cs.length;
		if(len > 0){
			var sortFn = scope ? function(){fn.apply(scope, arguments);} : fn;
			cs.sort(sortFn);
			for(var i = 0; i < len; i++){
				var n = cs[i];
				n.previousSibling = cs[i-1];
				n.nextSibling = cs[i+1];
				if(i === 0){
					this.setFirstChild(n);
				}
				if(i == len-1){
					this.setLastChild(n);
				}
			}
		}
	},


	contains : function(node){
		return node.isAncestor(this);
	},


	isAncestor : function(node){
		var p = this.parentNode;
		while(p){
			if(p == node){
				return true;
			}
			p = p.parentNode;
		}
		return false;
	},

	toString : function(){
		return "[Node"+(this.id?" "+this.id:"")+"]";
	}
});
Ext.tree.TreeNode = function(attributes){
	attributes = attributes || {};
	if(Ext.isString(attributes)){
		attributes = {text: attributes};
	}
	this.childrenRendered = false;
	this.rendered = false;
	Ext.tree.TreeNode.superclass.constructor.call(this, attributes);
	this.expanded = attributes.expanded === true;
	this.isTarget = attributes.isTarget !== false;
	this.draggable = attributes.draggable !== false && attributes.allowDrag !== false;
	this.allowChildren = attributes.allowChildren !== false && attributes.allowDrop !== false;


	this.text = attributes.text;

	this.disabled = attributes.disabled === true;

	this.hidden = attributes.hidden === true;

	this.addEvents(

		'textchange',

		'beforeexpand',

		'beforecollapse',

		'expand',

		'disabledchange',

		'collapse',

		'beforeclick',

		'click',

		'checkchange',

		'beforedblclick',

		'dblclick',

		'contextmenu',

		'beforechildrenrendered'
	);

	var uiClass = this.attributes.uiProvider || this.defaultUI || Ext.tree.TreeNodeUI;


	this.ui = new uiClass(this);
};
Ext.extend(Ext.tree.TreeNode, Ext.data.Node, {
	preventHScroll : true,

	isExpanded : function(){
		return this.expanded;
	},


	getUI : function(){
		return this.ui;
	},

	getLoader : function(){
		var owner;
		return this.loader || ((owner = this.getOwnerTree()) && owner.loader ? owner.loader : (this.loader = new Ext.tree.TreeLoader()));
	},


	setFirstChild : function(node){
		var of = this.firstChild;
		Ext.tree.TreeNode.superclass.setFirstChild.call(this, node);
		if(this.childrenRendered && of && node != of){
			of.renderIndent(true, true);
		}
		if(this.rendered){
			this.renderIndent(true, true);
		}
	},


	setLastChild : function(node){
		var ol = this.lastChild;
		Ext.tree.TreeNode.superclass.setLastChild.call(this, node);
		if(this.childrenRendered && ol && node != ol){
			ol.renderIndent(true, true);
		}
		if(this.rendered){
			this.renderIndent(true, true);
		}
	},



	appendChild : function(n){
		if(!n.render && !Ext.isArray(n)){
			n = this.getLoader().createNode(n);
		}
		var node = Ext.tree.TreeNode.superclass.appendChild.call(this, n);
		if(node && this.childrenRendered){
			node.render();
		}
		this.ui.updateExpandIcon();
		return node;
	},


	removeChild : function(node, destroy){
		this.ownerTree.getSelectionModel().unselect(node);
		Ext.tree.TreeNode.superclass.removeChild.apply(this, arguments);

		if(node.ui.rendered){
			node.ui.remove();
		}
		if(this.childNodes.length < 1){
			this.collapse(false, false);
		}else{
			this.ui.updateExpandIcon();
		}
		if(!this.firstChild && !this.isHiddenRoot()) {
			this.childrenRendered = false;
		}
		return node;
	},


	insertBefore : function(node, refNode){
		if(!node.render){
			node = this.getLoader().createNode(node);
		}
		var newNode = Ext.tree.TreeNode.superclass.insertBefore.call(this, node, refNode);
		if(newNode && refNode && this.childrenRendered){
			node.render();
		}
		this.ui.updateExpandIcon();
		return newNode;
	},


	setText : function(text){
		var oldText = this.text;
		this.text = this.attributes.text = text;
		if(this.rendered){
			this.ui.onTextChange(this, text, oldText);
		}
		this.fireEvent('textchange', this, text, oldText);
	},


	select : function(){
		var t = this.getOwnerTree();
		if(t){
			t.getSelectionModel().select(this);
		}
	},


	unselect : function(silent){
		var t = this.getOwnerTree();
		if(t){
			t.getSelectionModel().unselect(this, silent);
		}
	},


	isSelected : function(){
		var t = this.getOwnerTree();
		return t ? t.getSelectionModel().isSelected(this) : false;
	},


	expand : function(deep, anim, callback, scope){
		if(!this.expanded){
			if(this.fireEvent('beforeexpand', this, deep, anim) === false){
				return;
			}
			if(!this.childrenRendered){
				this.renderChildren();
			}
			this.expanded = true;
			if(!this.isHiddenRoot() && (this.getOwnerTree().animate && anim !== false) || anim){
				this.ui.animExpand(function(){
					this.fireEvent('expand', this);
					this.runCallback(callback, scope || this, [this]);
					if(deep === true){
						this.expandChildNodes(true);
					}
				}.createDelegate(this));
				return;
			}else{
				this.ui.expand();
				this.fireEvent('expand', this);
				this.runCallback(callback, scope || this, [this]);
			}
		}else{
			this.runCallback(callback, scope || this, [this]);
		}
		if(deep === true){
			this.expandChildNodes(true);
		}
	},

	runCallback : function(cb, scope, args){
		if(Ext.isFunction(cb)){
			cb.apply(scope, args);
		}
	},

	isHiddenRoot : function(){
		return this.isRoot && !this.getOwnerTree().rootVisible;
	},


	collapse : function(deep, anim, callback, scope){
		if(this.expanded && !this.isHiddenRoot()){
			if(this.fireEvent('beforecollapse', this, deep, anim) === false){
				return;
			}
			this.expanded = false;
			if((this.getOwnerTree().animate && anim !== false) || anim){
				this.ui.animCollapse(function(){
					this.fireEvent('collapse', this);
					this.runCallback(callback, scope || this, [this]);
					if(deep === true){
						this.collapseChildNodes(true);
					}
				}.createDelegate(this));
				return;
			}else{
				this.ui.collapse();
				this.fireEvent('collapse', this);
				this.runCallback(callback, scope || this, [this]);
			}
		}else if(!this.expanded){
			this.runCallback(callback, scope || this, [this]);
		}
		if(deep === true){
			var cs = this.childNodes;
			for(var i = 0, len = cs.length; i < len; i++) {
				cs[i].collapse(true, false);
			}
		}
	},


	delayedExpand : function(delay){
		if(!this.expandProcId){
			this.expandProcId = this.expand.defer(delay, this);
		}
	},


	cancelExpand : function(){
		if(this.expandProcId){
			clearTimeout(this.expandProcId);
		}
		this.expandProcId = false;
	},


	toggle : function(){
		if(this.expanded){
			this.collapse();
		}else{
			this.expand();
		}
	},


	ensureVisible : function(callback, scope){
		var tree = this.getOwnerTree();
		tree.expandPath(this.parentNode ? this.parentNode.getPath() : this.getPath(), false, function(){
			var node = tree.getNodeById(this.id);
			tree.getTreeEl().scrollChildIntoView(node.ui.anchor);
			this.runCallback(callback, scope || this, [this]);
		}.createDelegate(this));
	},


	expandChildNodes : function(deep){
		var cs = this.childNodes;
		for(var i = 0, len = cs.length; i < len; i++) {
			cs[i].expand(deep);
		}
	},


	collapseChildNodes : function(deep){
		var cs = this.childNodes;
		for(var i = 0, len = cs.length; i < len; i++) {
			cs[i].collapse(deep);
		}
	},


	disable : function(){
		this.disabled = true;
		this.unselect();
		if(this.rendered && this.ui.onDisableChange){
			this.ui.onDisableChange(this, true);
		}
		this.fireEvent('disabledchange', this, true);
	},


	enable : function(){
		this.disabled = false;
		if(this.rendered && this.ui.onDisableChange){
			this.ui.onDisableChange(this, false);
		}
		this.fireEvent('disabledchange', this, false);
	},


	renderChildren : function(suppressEvent){
		if(suppressEvent !== false){
			this.fireEvent('beforechildrenrendered', this);
		}
		var cs = this.childNodes;
		for(var i = 0, len = cs.length; i < len; i++){
			cs[i].render(true);
		}
		this.childrenRendered = true;
	},


	sort : function(fn, scope){
		Ext.tree.TreeNode.superclass.sort.apply(this, arguments);
		if(this.childrenRendered){
			var cs = this.childNodes;
			for(var i = 0, len = cs.length; i < len; i++){
				cs[i].render(true);
			}
		}
	},


	render : function(bulkRender){
		this.ui.render(bulkRender);
		if(!this.rendered){

			this.getOwnerTree().registerNode(this);
			this.rendered = true;
			if(this.expanded){
				this.expanded = false;
				this.expand(false, false);
			}
		}
	},


	renderIndent : function(deep, refresh){
		if(refresh){
			this.ui.childIndent = null;
		}
		this.ui.renderIndent();
		if(deep === true && this.childrenRendered){
			var cs = this.childNodes;
			for(var i = 0, len = cs.length; i < len; i++){
				cs[i].renderIndent(true, refresh);
			}
		}
	},

	beginUpdate : function(){
		this.childrenRendered = false;
	},

	endUpdate : function(){
		if(this.expanded && this.rendered){
			this.renderChildren();
		}
	},

	destroy : function(){
		this.unselect(true);
		Ext.tree.TreeNode.superclass.destroy.call(this);
		Ext.destroy(this.ui, this.loader);
		this.ui = this.loader = null;
	},


	onIdChange : function(id){
		this.ui.onIdChange(id);
	}
});

Ext.tree.TreePanel.nodeTypes.node = Ext.tree.TreeNode;
Ext.tree.AsyncTreeNode = function(config){
	this.loaded = config && config.loaded === true;
	this.loading = false;
	Ext.tree.AsyncTreeNode.superclass.constructor.apply(this, arguments);

	this.addEvents('beforeload', 'load');


};
Ext.extend(Ext.tree.AsyncTreeNode, Ext.tree.TreeNode, {
	expand : function(deep, anim, callback, scope){
		if(this.loading){
			var timer;
			var f = function(){
				if(!this.loading){
					clearInterval(timer);
					this.expand(deep, anim, callback, scope);
				}
			}.createDelegate(this);
			timer = setInterval(f, 200);
			return;
		}
		if(!this.loaded){
			if(this.fireEvent("beforeload", this) === false){
				return;
			}
			this.loading = true;
			this.ui.beforeLoad(this);
			var loader = this.loader || this.attributes.loader || this.getOwnerTree().getLoader();
			if(loader){
				loader.load(this, this.loadComplete.createDelegate(this, [deep, anim, callback, scope]), this);
				return;
			}
		}
		Ext.tree.AsyncTreeNode.superclass.expand.call(this, deep, anim, callback, scope);
	},


	isLoading : function(){
		return this.loading;
	},

	loadComplete : function(deep, anim, callback, scope){
		this.loading = false;
		this.loaded = true;
		this.ui.afterLoad(this);
		this.fireEvent("load", this);
		this.expand(deep, anim, callback, scope);
	},


	isLoaded : function(){
		return this.loaded;
	},

	hasChildNodes : function(){
		if(!this.isLeaf() && !this.loaded){
			return true;
		}else{
			return Ext.tree.AsyncTreeNode.superclass.hasChildNodes.call(this);
		}
	},


	reload : function(callback, scope){
		this.collapse(false, false);
		while(this.firstChild){
			this.removeChild(this.firstChild).destroy();
		}
		this.childrenRendered = false;
		this.loaded = false;
		if(this.isHiddenRoot()){
			this.expanded = false;
		}
		this.expand(false, false, callback, scope);
	}
});

Ext.tree.TreePanel.nodeTypes.async = Ext.tree.AsyncTreeNode;
Ext.tree.TreeNodeUI = function(node){
	this.node = node;
	this.rendered = false;
	this.animating = false;
	this.wasLeaf = true;
	this.ecc = 'x-tree-ec-icon x-tree-elbow';
	this.emptyIcon = Ext.BLANK_IMAGE_URL;
};

Ext.tree.TreeNodeUI.prototype = {

	removeChild : function(node){
		if(this.rendered){
			this.ctNode.removeChild(node.ui.getEl());
		}
	},


	beforeLoad : function(){
		this.addClass("x-tree-node-loading");
	},


	afterLoad : function(){
		this.removeClass("x-tree-node-loading");
	},


	onTextChange : function(node, text, oldText){
		if(this.rendered){
			this.textNode.innerHTML = text;
		}
	},


	onDisableChange : function(node, state){
		this.disabled = state;
		if (this.checkbox) {
			this.checkbox.disabled = state;
		}
		if(state){
			this.addClass("x-tree-node-disabled");
		}else{
			this.removeClass("x-tree-node-disabled");
		}
	},


	onSelectedChange : function(state){
		if(state){
			this.focus();
			this.addClass("x-tree-selected");
		}else{

			this.removeClass("x-tree-selected");
		}
	},


	onMove : function(tree, node, oldParent, newParent, index, refNode){
		this.childIndent = null;
		if(this.rendered){
			var targetNode = newParent.ui.getContainer();
			if(!targetNode){
				this.holder = document.createElement("div");
				this.holder.appendChild(this.wrap);
				return;
			}
			var insertBefore = refNode ? refNode.ui.getEl() : null;
			if(insertBefore){
				targetNode.insertBefore(this.wrap, insertBefore);
			}else{
				targetNode.appendChild(this.wrap);
			}
			this.node.renderIndent(true, oldParent != newParent);
		}
	},


	addClass : function(cls){
		if(this.elNode){
			Ext.fly(this.elNode).addClass(cls);
		}
	},


	removeClass : function(cls){
		if(this.elNode){
			Ext.fly(this.elNode).removeClass(cls);
		}
	},


	remove : function(){
		if(this.rendered){
			this.holder = document.createElement("div");
			this.holder.appendChild(this.wrap);
		}
	},


	fireEvent : function(){
		return this.node.fireEvent.apply(this.node, arguments);
	},


	initEvents : function(){
		this.node.on("move", this.onMove, this);

		if(this.node.disabled){
			this.onDisableChange(this.node, true);
		}
		if(this.node.hidden){
			this.hide();
		}
		var ot = this.node.getOwnerTree();
		var dd = ot.enableDD || ot.enableDrag || ot.enableDrop;
		if(dd && (!this.node.isRoot || ot.rootVisible)){
			Ext.dd.Registry.register(this.elNode, {
				node: this.node,
				handles: this.getDDHandles(),
				isHandle: false
			});
		}
	},


	getDDHandles : function(){
		return [this.iconNode, this.textNode, this.elNode];
	},


	hide : function(){
		this.node.hidden = true;
		if(this.wrap){
			this.wrap.style.display = "none";
		}
	},


	show : function(){
		this.node.hidden = false;
		if(this.wrap){
			this.wrap.style.display = "";
		}
	},


	onContextMenu : function(e){
		if (this.node.hasListener("contextmenu") || this.node.getOwnerTree().hasListener("contextmenu")) {
			e.preventDefault();
			this.focus();
			this.fireEvent("contextmenu", this.node, e);
		}
	},


	onClick : function(e){
		if(this.dropping){
			e.stopEvent();
			return;
		}
		if(this.fireEvent("beforeclick", this.node, e) !== false){
			var a = e.getTarget('a');
			if(!this.disabled && this.node.attributes.href && a){
				this.fireEvent("click", this.node, e);
				return;
			}else if(a && e.ctrlKey){
				e.stopEvent();
			}
			e.preventDefault();
			if(this.disabled){
				return;
			}

			if(this.node.attributes.singleClickExpand && !this.animating && this.node.isExpandable()){
				this.node.toggle();
			}

			this.fireEvent("click", this.node, e);
		}else{
			e.stopEvent();
		}
	},


	onDblClick : function(e){
		e.preventDefault();
		if(this.disabled){
			return;
		}
		if(this.fireEvent("beforedblclick", this.node, e) !== false){
			if(this.checkbox){
				this.toggleCheck();
			}
			if(!this.animating && this.node.isExpandable()){
				this.node.toggle();
			}
			this.fireEvent("dblclick", this.node, e);
		}
	},

	onOver : function(e){
		this.addClass('x-tree-node-over');
	},

	onOut : function(e){
		this.removeClass('x-tree-node-over');
	},


	onCheckChange : function(){
		var checked = this.checkbox.checked;

		this.checkbox.defaultChecked = checked;
		this.node.attributes.checked = checked;
		this.fireEvent('checkchange', this.node, checked);
	},


	ecClick : function(e){
		if(!this.animating && this.node.isExpandable()){
			this.node.toggle();
		}
	},


	startDrop : function(){
		this.dropping = true;
	},


	endDrop : function(){
		setTimeout(function(){
			this.dropping = false;
		}.createDelegate(this), 50);
	},


	expand : function(){
		this.updateExpandIcon();
		this.ctNode.style.display = "";
	},


	focus : function(){
		if(!this.node.preventHScroll){
			try{this.anchor.focus();
			}catch(e){}
		}else{
			try{
				var noscroll = this.node.getOwnerTree().getTreeEl().dom;
				var l = noscroll.scrollLeft;
				this.anchor.focus();
				noscroll.scrollLeft = l;
			}catch(e){}
		}
	},


	toggleCheck : function(value){
		var cb = this.checkbox;
		if(cb){
			cb.checked = (value === undefined ? !cb.checked : value);
			this.onCheckChange();
		}
	},


	blur : function(){
		try{
			this.anchor.blur();
		}catch(e){}
	},


	animExpand : function(callback){
		var ct = Ext.get(this.ctNode);
		ct.stopFx();
		if(!this.node.isExpandable()){
			this.updateExpandIcon();
			this.ctNode.style.display = "";
			Ext.callback(callback);
			return;
		}
		this.animating = true;
		this.updateExpandIcon();

		ct.slideIn('t', {
			callback : function(){
				this.animating = false;
				Ext.callback(callback);
			},
			scope: this,
			duration: this.node.ownerTree.duration || .25
		});
	},


	highlight : function(){
		var tree = this.node.getOwnerTree();
		Ext.fly(this.wrap).highlight(
			tree.hlColor || "C3DAF9",
			{endColor: tree.hlBaseColor}
		);
	},


	collapse : function(){
		this.updateExpandIcon();
		this.ctNode.style.display = "none";
	},


	animCollapse : function(callback){
		var ct = Ext.get(this.ctNode);
		ct.enableDisplayMode('block');
		ct.stopFx();

		this.animating = true;
		this.updateExpandIcon();

		ct.slideOut('t', {
			callback : function(){
				this.animating = false;
				Ext.callback(callback);
			},
			scope: this,
			duration: this.node.ownerTree.duration || .25
		});
	},


	getContainer : function(){
		return this.ctNode;
	},


	getEl : function(){
		return this.wrap;
	},


	appendDDGhost : function(ghostNode){
		ghostNode.appendChild(this.elNode.cloneNode(true));
	},


	getDDRepairXY : function(){
		return Ext.lib.Dom.getXY(this.iconNode);
	},


	onRender : function(){
		this.render();
	},


	render : function(bulkRender){
		var n = this.node, a = n.attributes;
		var targetNode = n.parentNode ?
			n.parentNode.ui.getContainer() : n.ownerTree.innerCt.dom;

		if(!this.rendered){
			this.rendered = true;

			this.renderElements(n, a, targetNode, bulkRender);

			if(a.qtip){
				if(this.textNode.setAttributeNS){
					this.textNode.setAttributeNS("ext", "qtip", a.qtip);
					if(a.qtipTitle){
						this.textNode.setAttributeNS("ext", "qtitle", a.qtipTitle);
					}
				}else{
					this.textNode.setAttribute("ext:qtip", a.qtip);
					if(a.qtipTitle){
						this.textNode.setAttribute("ext:qtitle", a.qtipTitle);
					}
				}
			}else if(a.qtipCfg){
				a.qtipCfg.target = Ext.id(this.textNode);
				Ext.QuickTips.register(a.qtipCfg);
			}
			this.initEvents();
			if(!this.node.expanded){
				this.updateExpandIcon(true);
			}
		}else{
			if(bulkRender === true) {
				targetNode.appendChild(this.wrap);
			}
		}
	},


	renderElements : function(n, a, targetNode, bulkRender){

		this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';

		var cb = Ext.isBoolean(a.checked),
			nel,
			href = a.href ? a.href : Ext.isGecko ? "" : "#",
			buf = ['<li class="x-tree-node"><div ext:tree-node-id="',n.id,'" class="x-tree-node-el x-tree-node-leaf x-unselectable ', a.cls,'" unselectable="on">',
				'<span class="x-tree-node-indent">',this.indentMarkup,"</span>",
				'<img src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow" />',
				'<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon',(a.icon ? " x-tree-node-inline-icon" : ""),(a.iconCls ? " "+a.iconCls : ""),'" unselectable="on" />',
				cb ? ('<input class="x-tree-node-cb" type="checkbox" ' + (a.checked ? 'checked="checked" />' : '/>')) : '',
				'<a hidefocus="on" class="x-tree-node-anchor" href="',href,'" tabIndex="1" ',
				a.hrefTarget ? ' target="'+a.hrefTarget+'"' : "", '><span unselectable="on">',n.text,"</span></a></div>",
				'<ul class="x-tree-node-ct" style="display:none;"></ul>',
				"</li>"].join('');

		if(bulkRender !== true && n.nextSibling && (nel = n.nextSibling.ui.getEl())){
			this.wrap = Ext.DomHelper.insertHtml("beforeBegin", nel, buf);
		}else{
			this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf);
		}

		this.elNode = this.wrap.childNodes[0];
		this.ctNode = this.wrap.childNodes[1];
		var cs = this.elNode.childNodes;
		this.indentNode = cs[0];
		this.ecNode = cs[1];
		this.iconNode = cs[2];
		var index = 3;
		if(cb){
			this.checkbox = cs[3];

			this.checkbox.defaultChecked = this.checkbox.checked;
			index++;
		}
		this.anchor = cs[index];
		this.textNode = cs[index].firstChild;
	},


	getAnchor : function(){
		return this.anchor;
	},


	getTextEl : function(){
		return this.textNode;
	},


	getIconEl : function(){
		return this.iconNode;
	},


	isChecked : function(){
		return this.checkbox ? this.checkbox.checked : false;
	},


	updateExpandIcon : function(){
		if(this.rendered){
			var n = this.node,
				c1,
				c2,
				cls = n.isLast() ? "x-tree-elbow-end" : "x-tree-elbow",
				hasChild = n.hasChildNodes();
			if(hasChild || n.attributes.expandable){
				if(n.expanded){
					cls += "-minus";
					c1 = "x-tree-node-collapsed";
					c2 = "x-tree-node-expanded";
				}else{
					cls += "-plus";
					c1 = "x-tree-node-expanded";
					c2 = "x-tree-node-collapsed";
				}
				if(this.wasLeaf){
					this.removeClass("x-tree-node-leaf");
					this.wasLeaf = false;
				}
				if(this.c1 != c1 || this.c2 != c2){
					Ext.fly(this.elNode).replaceClass(c1, c2);
					this.c1 = c1; this.c2 = c2;
				}
			}else{
				if(!this.wasLeaf){
					Ext.fly(this.elNode).replaceClass("x-tree-node-expanded", "x-tree-node-leaf");
					delete this.c1;
					delete this.c2;
					this.wasLeaf = true;
				}
			}
			var ecc = "x-tree-ec-icon "+cls;
			if(this.ecc != ecc){
				this.ecNode.className = ecc;
				this.ecc = ecc;
			}
		}
	},


	onIdChange: function(id){
		if(this.rendered){
			this.elNode.setAttribute('ext:tree-node-id', id);
		}
	},


	getChildIndent : function(){
		if(!this.childIndent){
			var buf = [],
				p = this.node;
			while(p){
				if(!p.isRoot || (p.isRoot && p.ownerTree.rootVisible)){
					if(!p.isLast()) {
						buf.unshift('<img src="'+this.emptyIcon+'" class="x-tree-elbow-line" />');
					} else {
						buf.unshift('<img src="'+this.emptyIcon+'" class="x-tree-icon" />');
					}
				}
				p = p.parentNode;
			}
			this.childIndent = buf.join("");
		}
		return this.childIndent;
	},


	renderIndent : function(){
		if(this.rendered){
			var indent = "",
				p = this.node.parentNode;
			if(p){
				indent = p.ui.getChildIndent();
			}
			if(this.indentMarkup != indent){
				this.indentNode.innerHTML = indent;
				this.indentMarkup = indent;
			}
			this.updateExpandIcon();
		}
	},

	destroy : function(){
		if(this.elNode){
			Ext.dd.Registry.unregister(this.elNode.id);
		}

		Ext.each(['textnode', 'anchor', 'checkbox', 'indentNode', 'ecNode', 'iconNode', 'elNode', 'ctNode', 'wrap', 'holder'], function(el){
			if(this[el]){
				Ext.fly(this[el]).remove();
				delete this[el];
			}
		}, this);
		delete this.node;
	}
};


Ext.tree.RootTreeNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {

	render : function(){
		if(!this.rendered){
			var targetNode = this.node.ownerTree.innerCt.dom;
			this.node.expanded = true;
			targetNode.innerHTML = '<div class="x-tree-root-node"></div>';
			this.wrap = this.ctNode = targetNode.firstChild;
		}
	},
	collapse : Ext.emptyFn,
	expand : Ext.emptyFn
});
Ext.tree.TreeLoader = function(config){
	this.baseParams = {};
	Ext.apply(this, config);

	this.addEvents(

		"beforeload",

		"load",

		"loadexception"
	);
	Ext.tree.TreeLoader.superclass.constructor.call(this);
	if(Ext.isString(this.paramOrder)){
		this.paramOrder = this.paramOrder.split(/[\s,|]/);
	}
};

Ext.extend(Ext.tree.TreeLoader, Ext.util.Observable, {







	uiProviders : {},


	clearOnLoad : true,


	paramOrder: undefined,


	paramsAsHash: false,


	nodeParameter: 'node',


	directFn : undefined,


	load : function(node, callback, scope){
		if(this.clearOnLoad){
			while(node.firstChild){
				node.removeChild(node.firstChild);
			}
		}
		if(this.doPreload(node)){
			this.runCallback(callback, scope || node, [node]);
		}else if(this.directFn || this.dataUrl || this.url){
			this.requestData(node, callback, scope || node);
		}
	},

	doPreload : function(node){
		if(node.attributes.children){
			if(node.childNodes.length < 1){
				var cs = node.attributes.children;
				node.beginUpdate();
				for(var i = 0, len = cs.length; i < len; i++){
					var cn = node.appendChild(this.createNode(cs[i]));
					if(this.preloadChildren){
						this.doPreload(cn);
					}
				}
				node.endUpdate();
			}
			return true;
		}
		return false;
	},

	getParams: function(node){
		var buf = [], bp = this.baseParams;
		if(this.directFn){
			buf.push(node.id);
			if(bp){
				if(this.paramOrder){
					for(var i = 0, len = this.paramOrder.length; i < len; i++){
						buf.push(bp[this.paramOrder[i]]);
					}
				}else if(this.paramsAsHash){
					buf.push(bp);
				}
			}
			return buf;
		}else{
			var o = Ext.apply({}, bp);
			o[this.nodeParameter] = node.id;
			return o;
		}
	},

	requestData : function(node, callback, scope){
		if(this.fireEvent("beforeload", this, node, callback) !== false){
			if(this.directFn){
				var args = this.getParams(node);
				args.push(this.processDirectResponse.createDelegate(this, [{callback: callback, node: node, scope: scope}], true));
				this.directFn.apply(window, args);
			}else{
				this.transId = Ext.Ajax.request({
					method:this.requestMethod,
					url: this.dataUrl||this.url,
					success: this.handleResponse,
					failure: this.handleFailure,
					scope: this,
					argument: {callback: callback, node: node, scope: scope},
					params: this.getParams(node)
				});
			}
		}else{


			this.runCallback(callback, scope || node, []);
		}
	},

	processDirectResponse: function(result, response, args){
		if(response.status){
			this.handleResponse({
				responseData: Ext.isArray(result) ? result : null,
				responseText: result,
				argument: args
			});
		}else{
			this.handleFailure({
				argument: args
			});
		}
	},


	runCallback: function(cb, scope, args){
		if(Ext.isFunction(cb)){
			cb.apply(scope, args);
		}
	},

	isLoading : function(){
		return !!this.transId;
	},

	abort : function(){
		if(this.isLoading()){
			Ext.Ajax.abort(this.transId);
		}
	},


	createNode : function(attr){

		if(this.baseAttrs){
			Ext.applyIf(attr, this.baseAttrs);
		}
		if(this.applyLoader !== false && !attr.loader){
			attr.loader = this;
		}
		if(Ext.isString(attr.uiProvider)){
			attr.uiProvider = this.uiProviders[attr.uiProvider] || eval(attr.uiProvider);
		}
		if(attr.nodeType){
			return new Ext.tree.TreePanel.nodeTypes[attr.nodeType](attr);
		}else{
			return attr.leaf ?
				new Ext.tree.TreeNode(attr) :
				new Ext.tree.AsyncTreeNode(attr);
		}
	},

	processResponse : function(response, node, callback, scope){
		var json = response.responseText;
		try {
			var o = response.responseData || Ext.decode(json);
			node.beginUpdate();
			for(var i = 0, len = o.length; i < len; i++){
				var n = this.createNode(o[i]);
				if(n){
					node.appendChild(n);
				}
			}
			node.endUpdate();
			this.runCallback(callback, scope || node, [node]);
		}catch(e){
			this.handleFailure(response);
		}
	},

	handleResponse : function(response){
		this.transId = false;
		var a = response.argument;
		this.processResponse(response, a.node, a.callback, a.scope);
		this.fireEvent("load", this, a.node, response);
	},

	handleFailure : function(response){
		this.transId = false;
		var a = response.argument;
		this.fireEvent("loadexception", this, a.node, response);
		this.runCallback(a.callback, a.scope || a.node, [a.node]);
	},

	destroy : function(){
		this.purgeListeners();
	}
});
Ext.tree.TreeFilter = function(tree, config){
	this.tree = tree;
	this.filtered = {};
	Ext.apply(this, config);
};

Ext.tree.TreeFilter.prototype = {
	clearBlank:false,
	reverse:false,
	autoClear:false,
	remove:false,


	filter : function(value, attr, startNode){
		attr = attr || "text";
		var f;
		if(typeof value == "string"){
			var vlen = value.length;

			if(vlen == 0 && this.clearBlank){
				this.clear();
				return;
			}
			value = value.toLowerCase();
			f = function(n){
				return n.attributes[attr].substr(0, vlen).toLowerCase() == value;
			};
		}else if(value.exec){
			f = function(n){
				return value.test(n.attributes[attr]);
			};
		}else{
			throw 'Illegal filter type, must be string or regex';
		}
		this.filterBy(f, null, startNode);
	},


	filterBy : function(fn, scope, startNode){
		startNode = startNode || this.tree.root;
		if(this.autoClear){
			this.clear();
		}
		var af = this.filtered, rv = this.reverse;
		var f = function(n){
			if(n == startNode){
				return true;
			}
			if(af[n.id]){
				return false;
			}
			var m = fn.call(scope || n, n);
			if(!m || rv){
				af[n.id] = n;
				n.ui.hide();
				return false;
			}
			return true;
		};
		startNode.cascade(f);
		if(this.remove){
			for(var id in af){
				if(typeof id != "function"){
					var n = af[id];
					if(n && n.parentNode){
						n.parentNode.removeChild(n);
					}
				}
			}
		}
	},


	clear : function(){
		var t = this.tree;
		var af = this.filtered;
		for(var id in af){
			if(typeof id != "function"){
				var n = af[id];
				if(n){
					n.ui.show();
				}
			}
		}
		this.filtered = {};
	}
};

Ext.tree.TreeSorter = function(tree, config){







	Ext.apply(this, config);
	tree.on("beforechildrenrendered", this.doSort, this);
	tree.on("append", this.updateSort, this);
	tree.on("insert", this.updateSort, this);
	tree.on("textchange", this.updateSortParent, this);

	var dsc = this.dir && this.dir.toLowerCase() == "desc";
	var p = this.property || "text";
	var sortType = this.sortType;
	var fs = this.folderSort;
	var cs = this.caseSensitive === true;
	var leafAttr = this.leafAttr || 'leaf';

	this.sortFn = function(n1, n2){
		if(fs){
			if(n1.attributes[leafAttr] && !n2.attributes[leafAttr]){
				return 1;
			}
			if(!n1.attributes[leafAttr] && n2.attributes[leafAttr]){
				return -1;
			}
		}
		var v1 = sortType ? sortType(n1.attributes[p]) : (cs ? n1.attributes[p] : n1.attributes[p].toUpperCase());
		var v2 = sortType ? sortType(n2.attributes[p]) : (cs ? n2.attributes[p] : n2.attributes[p].toUpperCase());
		if(v1 < v2){
			return dsc ? +1 : -1;
		}else if(v1 > v2){
			return dsc ? -1 : +1;
		}else{
			return 0;
		}
	};
};

Ext.tree.TreeSorter.prototype = {
	doSort : function(node){
		node.sort(this.sortFn);
	},

	compareNodes : function(n1, n2){
		return (n1.text.toUpperCase() > n2.text.toUpperCase() ? 1 : -1);
	},

	updateSort : function(tree, node){
		if(node.childrenRendered){
			this.doSort.defer(1, this, [node]);
		}
	},

	updateSortParent : function(node){
		var p = node.parentNode;
		if(p && p.childrenRendered){
			this.doSort.defer(1, this, [p]);
		}
	}
};
if(Ext.dd.DropZone){

	Ext.tree.TreeDropZone = function(tree, config){

		this.allowParentInsert = config.allowParentInsert || false;

		this.allowContainerDrop = config.allowContainerDrop || false;

		this.appendOnly = config.appendOnly || false;

		Ext.tree.TreeDropZone.superclass.constructor.call(this, tree.getTreeEl(), config);

		this.tree = tree;

		this.dragOverData = {};

		this.lastInsertClass = "x-tree-no-status";
	};

	Ext.extend(Ext.tree.TreeDropZone, Ext.dd.DropZone, {

		ddGroup : "TreeDD",


		expandDelay : 1000,


		expandNode : function(node){
			if(node.hasChildNodes() && !node.isExpanded()){
				node.expand(false, null, this.triggerCacheRefresh.createDelegate(this));
			}
		},


		queueExpand : function(node){
			this.expandProcId = this.expandNode.defer(this.expandDelay, this, [node]);
		},


		cancelExpand : function(){
			if(this.expandProcId){
				clearTimeout(this.expandProcId);
				this.expandProcId = false;
			}
		},


		isValidDropPoint : function(n, pt, dd, e, data){
			if(!n || !data){ return false; }
			var targetNode = n.node;
			var dropNode = data.node;

			if(!(targetNode && targetNode.isTarget && pt)){
				return false;
			}
			if(pt == "append" && targetNode.allowChildren === false){
				return false;
			}
			if((pt == "above" || pt == "below") && (targetNode.parentNode && targetNode.parentNode.allowChildren === false)){
				return false;
			}
			if(dropNode && (targetNode == dropNode || dropNode.contains(targetNode))){
				return false;
			}

			var overEvent = this.dragOverData;
			overEvent.tree = this.tree;
			overEvent.target = targetNode;
			overEvent.data = data;
			overEvent.point = pt;
			overEvent.source = dd;
			overEvent.rawEvent = e;
			overEvent.dropNode = dropNode;
			overEvent.cancel = false;
			var result = this.tree.fireEvent("nodedragover", overEvent);
			return overEvent.cancel === false && result !== false;
		},


		getDropPoint : function(e, n, dd){
			var tn = n.node;
			if(tn.isRoot){
				return tn.allowChildren !== false ? "append" : false;
			}
			var dragEl = n.ddel;
			var t = Ext.lib.Dom.getY(dragEl), b = t + dragEl.offsetHeight;
			var y = Ext.lib.Event.getPageY(e);
			var noAppend = tn.allowChildren === false || tn.isLeaf();
			if(this.appendOnly || tn.parentNode.allowChildren === false){
				return noAppend ? false : "append";
			}
			var noBelow = false;
			if(!this.allowParentInsert){
				noBelow = tn.hasChildNodes() && tn.isExpanded();
			}
			var q = (b - t) / (noAppend ? 2 : 3);
			if(y >= t && y < (t + q)){
				return "above";
			}else if(!noBelow && (noAppend || y >= b-q && y <= b)){
				return "below";
			}else{
				return "append";
			}
		},


		onNodeEnter : function(n, dd, e, data){
			this.cancelExpand();
		},

		onContainerOver : function(dd, e, data) {
			if (this.allowContainerDrop && this.isValidDropPoint({ ddel: this.tree.getRootNode().ui.elNode, node: this.tree.getRootNode() }, "append", dd, e, data)) {
				return this.dropAllowed;
			}
			return this.dropNotAllowed;
		},


		onNodeOver : function(n, dd, e, data){
			var pt = this.getDropPoint(e, n, dd);
			var node = n.node;


			if(!this.expandProcId && pt == "append" && node.hasChildNodes() && !n.node.isExpanded()){
				this.queueExpand(node);
			}else if(pt != "append"){
				this.cancelExpand();
			}


			var returnCls = this.dropNotAllowed;
			if(this.isValidDropPoint(n, pt, dd, e, data)){
				if(pt){
					var el = n.ddel;
					var cls;
					if(pt == "above"){
						returnCls = n.node.isFirst() ? "x-tree-drop-ok-above" : "x-tree-drop-ok-between";
						cls = "x-tree-drag-insert-above";
					}else if(pt == "below"){
						returnCls = n.node.isLast() ? "x-tree-drop-ok-below" : "x-tree-drop-ok-between";
						cls = "x-tree-drag-insert-below";
					}else{
						returnCls = "x-tree-drop-ok-append";
						cls = "x-tree-drag-append";
					}
					if(this.lastInsertClass != cls){
						Ext.fly(el).replaceClass(this.lastInsertClass, cls);
						this.lastInsertClass = cls;
					}
				}
			}
			return returnCls;
		},


		onNodeOut : function(n, dd, e, data){
			this.cancelExpand();
			this.removeDropIndicators(n);
		},


		onNodeDrop : function(n, dd, e, data){
			var point = this.getDropPoint(e, n, dd);
			var targetNode = n.node;
			targetNode.ui.startDrop();
			if(!this.isValidDropPoint(n, point, dd, e, data)){
				targetNode.ui.endDrop();
				return false;
			}

			var dropNode = data.node || (dd.getTreeNode ? dd.getTreeNode(data, targetNode, point, e) : null);
			return this.processDrop(targetNode, data, point, dd, e, dropNode);
		},

		onContainerDrop : function(dd, e, data){
			if (this.allowContainerDrop && this.isValidDropPoint({ ddel: this.tree.getRootNode().ui.elNode, node: this.tree.getRootNode() }, "append", dd, e, data)) {
				var targetNode = this.tree.getRootNode();
				targetNode.ui.startDrop();
				var dropNode = data.node || (dd.getTreeNode ? dd.getTreeNode(data, targetNode, 'append', e) : null);
				return this.processDrop(targetNode, data, 'append', dd, e, dropNode);
			}
			return false;
		},


		processDrop: function(target, data, point, dd, e, dropNode){
			var dropEvent = {
				tree : this.tree,
				target: target,
				data: data,
				point: point,
				source: dd,
				rawEvent: e,
				dropNode: dropNode,
				cancel: !dropNode,
				dropStatus: false
			};
			var retval = this.tree.fireEvent("beforenodedrop", dropEvent);
			if(retval === false || dropEvent.cancel === true || !dropEvent.dropNode){
				target.ui.endDrop();
				return dropEvent.dropStatus;
			}

			target = dropEvent.target;
			if(point == 'append' && !target.isExpanded()){
				target.expand(false, null, function(){
					this.completeDrop(dropEvent);
				}.createDelegate(this));
			}else{
				this.completeDrop(dropEvent);
			}
			return true;
		},


		completeDrop : function(de){
			var ns = de.dropNode, p = de.point, t = de.target;
			if(!Ext.isArray(ns)){
				ns = [ns];
			}
			var n;
			for(var i = 0, len = ns.length; i < len; i++){
				n = ns[i];
				if(p == "above"){
					t.parentNode.insertBefore(n, t);
				}else if(p == "below"){
					t.parentNode.insertBefore(n, t.nextSibling);
				}else{
					t.appendChild(n);
				}
			}
			n.ui.focus();
			if(Ext.enableFx && this.tree.hlDrop){
				n.ui.highlight();
			}
			t.ui.endDrop();
			this.tree.fireEvent("nodedrop", de);
		},


		afterNodeMoved : function(dd, data, e, targetNode, dropNode){
			if(Ext.enableFx && this.tree.hlDrop){
				dropNode.ui.focus();
				dropNode.ui.highlight();
			}
			this.tree.fireEvent("nodedrop", this.tree, targetNode, data, dd, e);
		},


		getTree : function(){
			return this.tree;
		},


		removeDropIndicators : function(n){
			if(n && n.ddel){
				var el = n.ddel;
				Ext.fly(el).removeClass([
					"x-tree-drag-insert-above",
					"x-tree-drag-insert-below",
					"x-tree-drag-append"]);
				this.lastInsertClass = "_noclass";
			}
		},


		beforeDragDrop : function(target, e, id){
			this.cancelExpand();
			return true;
		},


		afterRepair : function(data){
			if(data && Ext.enableFx){
				data.node.ui.highlight();
			}
			this.hideProxy();
		}
	});

}
if(Ext.dd.DragZone){
	Ext.tree.TreeDragZone = function(tree, config){
		Ext.tree.TreeDragZone.superclass.constructor.call(this, tree.innerCt, config);

		this.tree = tree;
	};

	Ext.extend(Ext.tree.TreeDragZone, Ext.dd.DragZone, {

		ddGroup : "TreeDD",


		onBeforeDrag : function(data, e){
			var n = data.node;
			return n && n.draggable && !n.disabled;
		},


		onInitDrag : function(e){
			var data = this.dragData;
			this.tree.getSelectionModel().select(data.node);
			this.tree.eventModel.disable();
			this.proxy.update("");
			data.node.ui.appendDDGhost(this.proxy.ghost.dom);
			this.tree.fireEvent("startdrag", this.tree, data.node, e);
		},


		getRepairXY : function(e, data){
			return data.node.ui.getDDRepairXY();
		},


		onEndDrag : function(data, e){
			this.tree.eventModel.enable.defer(100, this.tree.eventModel);
			this.tree.fireEvent("enddrag", this.tree, data.node, e);
		},


		onValidDrop : function(dd, e, id){
			this.tree.fireEvent("dragdrop", this.tree, this.dragData.node, dd, e);
			this.hideProxy();
		},


		beforeInvalidDrop : function(e, id){

			var sm = this.tree.getSelectionModel();
			sm.clearSelections();
			sm.select(this.dragData.node);
		},


		afterRepair : function(){
			if (Ext.enableFx && this.tree.hlDrop) {
				Ext.Element.fly(this.dragData.ddel).highlight(this.hlColor || "c3daf9");
			}
			this.dragging = false;
		}
	});
}
Ext.tree.TreeEditor = function(tree, fc, config){
	fc = fc || {};
	var field = fc.events ? fc : new Ext.form.TextField(fc);
	Ext.tree.TreeEditor.superclass.constructor.call(this, field, config);

	this.tree = tree;

	if(!tree.rendered){
		tree.on('render', this.initEditor, this);
	}else{
		this.initEditor(tree);
	}
};

Ext.extend(Ext.tree.TreeEditor, Ext.Editor, {

	alignment: "l-l",

	autoSize: false,

	hideEl : false,

	cls: "x-small-editor x-tree-editor",

	shim:false,

	shadow:"frame",

	maxWidth: 250,

	editDelay : 350,

	initEditor : function(tree){
		tree.on({
			scope: this,
			beforeclick: this.beforeNodeClick,
			dblclick: this.onNodeDblClick
		});
		this.on({
			scope: this,
			complete: this.updateNode,
			beforestartedit: this.fitToTree,
			specialkey: this.onSpecialKey
		});
		this.on('startedit', this.bindScroll, this, {delay:10});
	},


	fitToTree : function(ed, el){
		var td = this.tree.getTreeEl().dom, nd = el.dom;
		if(td.scrollLeft >  nd.offsetLeft){
			td.scrollLeft = nd.offsetLeft;
		}
		var w = Math.min(
			this.maxWidth,
			(td.clientWidth > 20 ? td.clientWidth : td.offsetWidth) - Math.max(0, nd.offsetLeft-td.scrollLeft) - 5);
		this.setSize(w, '');
	},


	triggerEdit : function(node, defer){
		this.completeEdit();
		if(node.attributes.editable !== false){

			this.editNode = node;
			if(this.tree.autoScroll){
				Ext.fly(node.ui.getEl()).scrollIntoView(this.tree.body);
			}
			var value = node.text || '';
			if (!Ext.isGecko && Ext.isEmpty(node.text)){
				node.setText('&#160;');
			}
			this.autoEditTimer = this.startEdit.defer(this.editDelay, this, [node.ui.textNode, value]);
			return false;
		}
	},


	bindScroll : function(){
		this.tree.getTreeEl().on('scroll', this.cancelEdit, this);
	},


	beforeNodeClick : function(node, e){
		clearTimeout(this.autoEditTimer);
		if(this.tree.getSelectionModel().isSelected(node)){
			e.stopEvent();
			return this.triggerEdit(node);
		}
	},

	onNodeDblClick : function(node, e){
		clearTimeout(this.autoEditTimer);
	},


	updateNode : function(ed, value){
		this.tree.getTreeEl().un('scroll', this.cancelEdit, this);
		this.editNode.setText(value);
	},


	onHide : function(){
		Ext.tree.TreeEditor.superclass.onHide.call(this);
		if(this.editNode){
			this.editNode.ui.focus.defer(50, this.editNode.ui);
		}
	},


	onSpecialKey : function(field, e){
		var k = e.getKey();
		if(k == e.ESC){
			e.stopEvent();
			this.cancelEdit();
		}else if(k == e.ENTER && !e.hasModifier()){
			e.stopEvent();
			this.completeEdit();
		}
	},

	onDestroy : function(){
		clearTimeout(this.autoEditTimer);
		Ext.tree.TreeEditor.superclass.onDestroy.call(this);
		var tree = this.tree;
		tree.un('beforeclick', this.beforeNodeClick, this);
		tree.un('dblclick', this.onNodeDblClick, this);
	}
});

var swfobject = function() {

	var UNDEF = "undefined",
		OBJECT = "object",
		SHOCKWAVE_FLASH = "Shockwave Flash",
		SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
		FLASH_MIME_TYPE = "application/x-shockwave-flash",
		EXPRESS_INSTALL_ID = "SWFObjectExprInst",
		ON_READY_STATE_CHANGE = "onreadystatechange",

		win = window,
		doc = document,
		nav = navigator,

		plugin = false,
		domLoadFnArr = [main],
		regObjArr = [],
		objIdArr = [],
		listenersArr = [],
		storedAltContent,
		storedAltContentId,
		storedCallbackFn,
		storedCallbackObj,
		isDomLoaded = false,
		isExpressInstallActive = false,
		dynamicStylesheet,
		dynamicStylesheetMedia,
		autoHideShow = true,


		ua = function() {
			var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
				u = nav.userAgent.toLowerCase(),
				p = nav.platform.toLowerCase(),
				windows = p ? /win/.test(p) : /win/.test(u),
				mac = p ? /mac/.test(p) : /mac/.test(u),
				webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false,
				ie = !+"\v1",
				playerVersion = [0,0,0],
				d = null;
			if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
				d = nav.plugins[SHOCKWAVE_FLASH].description;
				if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) {
					plugin = true;
					ie = false;
					d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
					playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
					playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
					playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
				}
			}
			else if (typeof win.ActiveXObject != UNDEF) {
				try {
					var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
					if (a) {
						d = a.GetVariable("$version");
						if (d) {
							ie = true;
							d = d.split(" ")[1].split(",");
							playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
						}
					}
				}
				catch(e) {}
			}
			return { w3:w3cdom, pv:playerVersion, wk:webkit, ie:ie, win:windows, mac:mac };
		}(),


		onDomLoad = function() {
			if (!ua.w3) { return; }
			if ((typeof doc.readyState != UNDEF && doc.readyState == "complete") || (typeof doc.readyState == UNDEF && (doc.getElementsByTagName("body")[0] || doc.body))) {
				callDomLoadFunctions();
			}
			if (!isDomLoaded) {
				if (typeof doc.addEventListener != UNDEF) {
					doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
				}
				if (ua.ie && ua.win) {
					doc.attachEvent(ON_READY_STATE_CHANGE, function() {
						if (doc.readyState == "complete") {
							doc.detachEvent(ON_READY_STATE_CHANGE, arguments.callee);
							callDomLoadFunctions();
						}
					});
					if (win == top) {
						(function(){
							if (isDomLoaded) { return; }
							try {
								doc.documentElement.doScroll("left");
							}
							catch(e) {
								setTimeout(arguments.callee, 0);
								return;
							}
							callDomLoadFunctions();
						})();
					}
				}
				if (ua.wk) {
					(function(){
						if (isDomLoaded) { return; }
						if (!/loaded|complete/.test(doc.readyState)) {
							setTimeout(arguments.callee, 0);
							return;
						}
						callDomLoadFunctions();
					})();
				}
				addLoadEvent(callDomLoadFunctions);
			}
		}();

	function callDomLoadFunctions() {
		if (isDomLoaded) { return; }
		try {
			var t = doc.getElementsByTagName("body")[0].appendChild(createElement("span"));
			t.parentNode.removeChild(t);
		}
		catch (e) { return; }
		isDomLoaded = true;
		var dl = domLoadFnArr.length;
		for (var i = 0; i < dl; i++) {
			domLoadFnArr[i]();
		}
	}

	function addDomLoadEvent(fn) {
		if (isDomLoaded) {
			fn();
		}
		else {
			domLoadFnArr[domLoadFnArr.length] = fn;
		}
	}


	function addLoadEvent(fn) {
		if (typeof win.addEventListener != UNDEF) {
			win.addEventListener("load", fn, false);
		}
		else if (typeof doc.addEventListener != UNDEF) {
			doc.addEventListener("load", fn, false);
		}
		else if (typeof win.attachEvent != UNDEF) {
			addListener(win, "onload", fn);
		}
		else if (typeof win.onload == "function") {
			var fnOld = win.onload;
			win.onload = function() {
				fnOld();
				fn();
			};
		}
		else {
			win.onload = fn;
		}
	}


	function main() {
		if (plugin) {
			testPlayerVersion();
		}
		else {
			matchVersions();
		}
	}


	function testPlayerVersion() {
		var b = doc.getElementsByTagName("body")[0];
		var o = createElement(OBJECT);
		o.setAttribute("type", FLASH_MIME_TYPE);
		var t = b.appendChild(o);
		if (t) {
			var counter = 0;
			(function(){
				if (typeof t.GetVariable != UNDEF) {
					var d = t.GetVariable("$version");
					if (d) {
						d = d.split(" ")[1].split(",");
						ua.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
					}
				}
				else if (counter < 10) {
					counter++;
					setTimeout(arguments.callee, 10);
					return;
				}
				b.removeChild(o);
				t = null;
				matchVersions();
			})();
		}
		else {
			matchVersions();
		}
	}


	function matchVersions() {
		var rl = regObjArr.length;
		if (rl > 0) {
			for (var i = 0; i < rl; i++) {
				var id = regObjArr[i].id;
				var cb = regObjArr[i].callbackFn;
				var cbObj = {success:false, id:id};
				if (ua.pv[0] > 0) {
					var obj = getElementById(id);
					if (obj) {
						if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) {
							setVisibility(id, true);
							if (cb) {
								cbObj.success = true;
								cbObj.ref = getObjectById(id);
								cb(cbObj);
							}
						}
						else if (regObjArr[i].expressInstall && canExpressInstall()) {
							var att = {};
							att.data = regObjArr[i].expressInstall;
							att.width = obj.getAttribute("width") || "0";
							att.height = obj.getAttribute("height") || "0";
							if (obj.getAttribute("class")) { att.styleclass = obj.getAttribute("class"); }
							if (obj.getAttribute("align")) { att.align = obj.getAttribute("align"); }

							var par = {};
							var p = obj.getElementsByTagName("param");
							var pl = p.length;
							for (var j = 0; j < pl; j++) {
								if (p[j].getAttribute("name").toLowerCase() != "movie") {
									par[p[j].getAttribute("name")] = p[j].getAttribute("value");
								}
							}
							showExpressInstall(att, par, id, cb);
						}
						else {
							displayAltContent(obj);
							if (cb) { cb(cbObj); }
						}
					}
				}
				else {
					setVisibility(id, true);
					if (cb) {
						var o = getObjectById(id);
						if (o && typeof o.SetVariable != UNDEF) {
							cbObj.success = true;
							cbObj.ref = o;
						}
						cb(cbObj);
					}
				}
			}
		}
	}

	function getObjectById(objectIdStr) {
		var r = null;
		var o = getElementById(objectIdStr);
		if (o && o.nodeName == "OBJECT") {
			if (typeof o.SetVariable != UNDEF) {
				r = o;
			}
			else {
				var n = o.getElementsByTagName(OBJECT)[0];
				if (n) {
					r = n;
				}
			}
		}
		return r;
	}


	function canExpressInstall() {
		return !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac) && !(ua.wk && ua.wk < 312);
	}


	function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {
		isExpressInstallActive = true;
		storedCallbackFn = callbackFn || null;
		storedCallbackObj = {success:false, id:replaceElemIdStr};
		var obj = getElementById(replaceElemIdStr);
		if (obj) {
			if (obj.nodeName == "OBJECT") {
				storedAltContent = abstractAltContent(obj);
				storedAltContentId = null;
			}
			else {
				storedAltContent = obj;
				storedAltContentId = replaceElemIdStr;
			}
			att.id = EXPRESS_INSTALL_ID;
			if (typeof att.width == UNDEF || (!/%$/.test(att.width) && parseInt(att.width, 10) < 310)) { att.width = "310"; }
			if (typeof att.height == UNDEF || (!/%$/.test(att.height) && parseInt(att.height, 10) < 137)) { att.height = "137"; }
			doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
			var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn",
				fv = "MMredirectURL=" + win.location.toString().replace(/&/g,"%26") + "&MMplayerType=" + pt + "&MMdoctitle=" + doc.title;
			if (typeof par.flashvars != UNDEF) {
				par.flashvars += "&" + fv;
			}
			else {
				par.flashvars = fv;
			}


			if (ua.ie && ua.win && obj.readyState != 4) {
				var newObj = createElement("div");
				replaceElemIdStr += "SWFObjectNew";
				newObj.setAttribute("id", replaceElemIdStr);
				obj.parentNode.insertBefore(newObj, obj);
				obj.style.display = "none";
				(function(){
					if (obj.readyState == 4) {
						obj.parentNode.removeChild(obj);
					}
					else {
						setTimeout(arguments.callee, 10);
					}
				})();
			}
			createSWF(att, par, replaceElemIdStr);
		}
	}


	function displayAltContent(obj) {
		if (ua.ie && ua.win && obj.readyState != 4) {


			var el = createElement("div");
			obj.parentNode.insertBefore(el, obj);
			el.parentNode.replaceChild(abstractAltContent(obj), el);
			obj.style.display = "none";
			(function(){
				if (obj.readyState == 4) {
					obj.parentNode.removeChild(obj);
				}
				else {
					setTimeout(arguments.callee, 10);
				}
			})();
		}
		else {
			obj.parentNode.replaceChild(abstractAltContent(obj), obj);
		}
	}

	function abstractAltContent(obj) {
		var ac = createElement("div");
		if (ua.win && ua.ie) {
			ac.innerHTML = obj.innerHTML;
		}
		else {
			var nestedObj = obj.getElementsByTagName(OBJECT)[0];
			if (nestedObj) {
				var c = nestedObj.childNodes;
				if (c) {
					var cl = c.length;
					for (var i = 0; i < cl; i++) {
						if (!(c[i].nodeType == 1 && c[i].nodeName == "PARAM") && !(c[i].nodeType == 8)) {
							ac.appendChild(c[i].cloneNode(true));
						}
					}
				}
			}
		}
		return ac;
	}


	function createSWF(attObj, parObj, id) {
		var r, el = getElementById(id);
		if (ua.wk && ua.wk < 312) { return r; }
		if (el) {
			if (typeof attObj.id == UNDEF) {
				attObj.id = id;
			}
			if (ua.ie && ua.win) {
				var att = "";
				for (var i in attObj) {
					if (attObj[i] != Object.prototype[i]) {
						if (i.toLowerCase() == "data") {
							parObj.movie = attObj[i];
						}
						else if (i.toLowerCase() == "styleclass") {
							att += ' class="' + attObj[i] + '"';
						}
						else if (i.toLowerCase() != "classid") {
							att += ' ' + i + '="' + attObj[i] + '"';
						}
					}
				}
				var par = "";
				for (var j in parObj) {
					if (parObj[j] != Object.prototype[j]) {
						par += '<param name="' + j + '" value="' + parObj[j] + '" />';
					}
				}
				el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + '>' + par + '</object>';
				objIdArr[objIdArr.length] = attObj.id;
				r = getElementById(attObj.id);
			}
			else {
				var o = createElement(OBJECT);
				o.setAttribute("type", FLASH_MIME_TYPE);
				for (var m in attObj) {
					if (attObj[m] != Object.prototype[m]) {
						if (m.toLowerCase() == "styleclass") {
							o.setAttribute("class", attObj[m]);
						}
						else if (m.toLowerCase() != "classid") {
							o.setAttribute(m, attObj[m]);
						}
					}
				}
				for (var n in parObj) {
					if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") {
						createObjParam(o, n, parObj[n]);
					}
				}
				el.parentNode.replaceChild(o, el);
				r = o;
			}
		}
		return r;
	}

	function createObjParam(el, pName, pValue) {
		var p = createElement("param");
		p.setAttribute("name", pName);
		p.setAttribute("value", pValue);
		el.appendChild(p);
	}


	function removeSWF(id) {
		var obj = getElementById(id);
		if (obj && obj.nodeName == "OBJECT") {
			if (ua.ie && ua.win) {
				obj.style.display = "none";
				(function(){
					if (obj.readyState == 4) {
						removeObjectInIE(id);
					}
					else {
						setTimeout(arguments.callee, 10);
					}
				})();
			}
			else {
				obj.parentNode.removeChild(obj);
			}
		}
	}

	function removeObjectInIE(id) {
		var obj = getElementById(id);
		if (obj) {
			for (var i in obj) {
				if (typeof obj[i] == "function") {
					obj[i] = null;
				}
			}
			obj.parentNode.removeChild(obj);
		}
	}


	function getElementById(id) {
		var el = null;
		try {
			el = doc.getElementById(id);
		}
		catch (e) {}
		return el;
	}

	function createElement(el) {
		return doc.createElement(el);
	}


	function addListener(target, eventType, fn) {
		target.attachEvent(eventType, fn);
		listenersArr[listenersArr.length] = [target, eventType, fn];
	}


	function hasPlayerVersion(rv) {
		var pv = ua.pv, v = rv.split(".");
		v[0] = parseInt(v[0], 10);
		v[1] = parseInt(v[1], 10) || 0;
		v[2] = parseInt(v[2], 10) || 0;
		return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
	}


	function createCSS(sel, decl, media, newStyle) {
		if (ua.ie && ua.mac) { return; }
		var h = doc.getElementsByTagName("head")[0];
		if (!h) { return; }
		var m = (media && typeof media == "string") ? media : "screen";
		if (newStyle) {
			dynamicStylesheet = null;
			dynamicStylesheetMedia = null;
		}
		if (!dynamicStylesheet || dynamicStylesheetMedia != m) {

			var s = createElement("style");
			s.setAttribute("type", "text/css");
			s.setAttribute("media", m);
			dynamicStylesheet = h.appendChild(s);
			if (ua.ie && ua.win && typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0) {
				dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
			}
			dynamicStylesheetMedia = m;
		}

		if (ua.ie && ua.win) {
			if (dynamicStylesheet && typeof dynamicStylesheet.addRule == OBJECT) {
				dynamicStylesheet.addRule(sel, decl);
			}
		}
		else {
			if (dynamicStylesheet && typeof doc.createTextNode != UNDEF) {
				dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
			}
		}
	}

	function setVisibility(id, isVisible) {
		if (!autoHideShow) { return; }
		var v = isVisible ? "visible" : "hidden";
		if (isDomLoaded && getElementById(id)) {
			getElementById(id).style.visibility = v;
		}
		else {
			createCSS("#" + id, "visibility:" + v);
		}
	}


	function urlEncodeIfNecessary(s) {
		var regex = /[\\\"<>\.;]/;
		var hasBadChars = regex.exec(s) != null;
		return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s;
	}


	var cleanup = function() {
		if (ua.ie && ua.win) {
			window.attachEvent("onunload", function() {

				var ll = listenersArr.length;
				for (var i = 0; i < ll; i++) {
					listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
				}

				var il = objIdArr.length;
				for (var j = 0; j < il; j++) {
					removeSWF(objIdArr[j]);
				}

				for (var k in ua) {
					ua[k] = null;
				}
				ua = null;
				for (var l in swfobject) {
					swfobject[l] = null;
				}
				swfobject = null;
			});
		}
	}();

	return {

		registerObject: function(objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn) {
			if (ua.w3 && objectIdStr && swfVersionStr) {
				var regObj = {};
				regObj.id = objectIdStr;
				regObj.swfVersion = swfVersionStr;
				regObj.expressInstall = xiSwfUrlStr;
				regObj.callbackFn = callbackFn;
				regObjArr[regObjArr.length] = regObj;
				setVisibility(objectIdStr, false);
			}
			else if (callbackFn) {
				callbackFn({success:false, id:objectIdStr});
			}
		},

		getObjectById: function(objectIdStr) {
			if (ua.w3) {
				return getObjectById(objectIdStr);
			}
		},

		embedSWF: function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn) {
			var callbackObj = {success:false, id:replaceElemIdStr};
			if (ua.w3 && !(ua.wk && ua.wk < 312) && swfUrlStr && replaceElemIdStr && widthStr && heightStr && swfVersionStr) {
				setVisibility(replaceElemIdStr, false);
				addDomLoadEvent(function() {
					widthStr += "";
					heightStr += "";
					var att = {};
					if (attObj && typeof attObj === OBJECT) {
						for (var i in attObj) {
							att[i] = attObj[i];
						}
					}
					att.data = swfUrlStr;
					att.width = widthStr;
					att.height = heightStr;
					var par = {};
					if (parObj && typeof parObj === OBJECT) {
						for (var j in parObj) {
							par[j] = parObj[j];
						}
					}
					if (flashvarsObj && typeof flashvarsObj === OBJECT) {
						for (var k in flashvarsObj) {
							if (typeof par.flashvars != UNDEF) {
								par.flashvars += "&" + k + "=" + flashvarsObj[k];
							}
							else {
								par.flashvars = k + "=" + flashvarsObj[k];
							}
						}
					}
					if (hasPlayerVersion(swfVersionStr)) {
						var obj = createSWF(att, par, replaceElemIdStr);
						if (att.id == replaceElemIdStr) {
							setVisibility(replaceElemIdStr, true);
						}
						callbackObj.success = true;
						callbackObj.ref = obj;
					}
					else if (xiSwfUrlStr && canExpressInstall()) {
						att.data = xiSwfUrlStr;
						showExpressInstall(att, par, replaceElemIdStr, callbackFn);
						return;
					}
					else {
						setVisibility(replaceElemIdStr, true);
					}
					if (callbackFn) { callbackFn(callbackObj); }
				});
			}
			else if (callbackFn) { callbackFn(callbackObj); }
		},

		switchOffAutoHideShow: function() {
			autoHideShow = false;
		},

		ua: ua,

		getFlashPlayerVersion: function() {
			return { major:ua.pv[0], minor:ua.pv[1], release:ua.pv[2] };
		},

		hasFlashPlayerVersion: hasPlayerVersion,

		createSWF: function(attObj, parObj, replaceElemIdStr) {
			if (ua.w3) {
				return createSWF(attObj, parObj, replaceElemIdStr);
			}
			else {
				return undefined;
			}
		},

		showExpressInstall: function(att, par, replaceElemIdStr, callbackFn) {
			if (ua.w3 && canExpressInstall()) {
				showExpressInstall(att, par, replaceElemIdStr, callbackFn);
			}
		},

		removeSWF: function(objElemIdStr) {
			if (ua.w3) {
				removeSWF(objElemIdStr);
			}
		},

		createCSS: function(selStr, declStr, mediaStr, newStyleBoolean) {
			if (ua.w3) {
				createCSS(selStr, declStr, mediaStr, newStyleBoolean);
			}
		},

		addDomLoadEvent: addDomLoadEvent,

		addLoadEvent: addLoadEvent,

		getQueryParamValue: function(param) {
			var q = doc.location.search || doc.location.hash;
			if (q) {
				if (/\?/.test(q)) { q = q.split("?")[1]; }
				if (param == null) {
					return urlEncodeIfNecessary(q);
				}
				var pairs = q.split("&");
				for (var i = 0; i < pairs.length; i++) {
					if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
						return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)));
					}
				}
			}
			return "";
		},


		expressInstallCallback: function() {
			if (isExpressInstallActive) {
				var obj = getElementById(EXPRESS_INSTALL_ID);
				if (obj && storedAltContent) {
					obj.parentNode.replaceChild(storedAltContent, obj);
					if (storedAltContentId) {
						setVisibility(storedAltContentId, true);
						if (ua.ie && ua.win) { storedAltContent.style.display = "block"; }
					}
					if (storedCallbackFn) { storedCallbackFn(storedCallbackObj); }
				}
				isExpressInstallActive = false;
			}
		}
	};
}();

Ext.FlashComponent = Ext.extend(Ext.BoxComponent, {

	flashVersion : '9.0.115',


	backgroundColor: '#ffffff',


	wmode: 'opaque',


	flashVars: undefined,


	flashParams: undefined,


	url: undefined,
	swfId : undefined,
	swfWidth: '100%',
	swfHeight: '100%',


	expressInstall: false,

	initComponent : function(){
		Ext.FlashComponent.superclass.initComponent.call(this);

		this.addEvents(

			'initialize'
		);
	},

	onRender : function(){
		Ext.FlashComponent.superclass.onRender.apply(this, arguments);

		var params = Ext.apply({
			allowScriptAccess: 'always',
			bgcolor: this.backgroundColor,
			wmode: this.wmode
		}, this.flashParams), vars = Ext.apply({
			allowedDomain: document.location.hostname,
			elementID: this.getId(),
			eventHandler: 'Ext.FlashEventProxy.onEvent'
		}, this.flashVars);

		new swfobject.embedSWF(this.url, this.id, this.swfWidth, this.swfHeight, this.flashVersion,
			this.expressInstall ? Ext.FlashComponent.EXPRESS_INSTALL_URL : undefined, vars, params);

		this.swf = Ext.getDom(this.id);
		this.el = Ext.get(this.swf);
	},

	getSwfId : function(){
		return this.swfId || (this.swfId = "extswf" + (++Ext.Component.AUTO_ID));
	},

	getId : function(){
		return this.id || (this.id = "extflashcmp" + (++Ext.Component.AUTO_ID));
	},

	onFlashEvent : function(e){
		switch(e.type){
			case "swfReady":
				this.initSwf();
				return;
			case "log":
				return;
		}
		e.component = this;
		this.fireEvent(e.type.toLowerCase().replace(/event$/, ''), e);
	},

	initSwf : function(){
		this.onSwfReady(!!this.isInitialized);
		this.isInitialized = true;
		this.fireEvent('initialize', this);
	},

	beforeDestroy: function(){
		if(this.rendered){
			swfobject.removeSWF(this.swf.id);
		}
		Ext.FlashComponent.superclass.beforeDestroy.call(this);
	},

	onSwfReady : Ext.emptyFn
});


Ext.FlashComponent.EXPRESS_INSTALL_URL = 'http:/' + '/swfobject.googlecode.com/svn/trunk/swfobject/expressInstall.swf';

Ext.reg('flash', Ext.FlashComponent);
Ext.FlashEventProxy = {
	onEvent : function(id, e){
		var fp = Ext.getCmp(id);
		if(fp){
			fp.onFlashEvent(e);
		}else{
			arguments.callee.defer(10, this, [id, e]);
		}
	}
}

Ext.chart.Chart = Ext.extend(Ext.FlashComponent, {
	refreshBuffer: 100,




	chartStyle: {
		padding: 10,
		animationEnabled: true,
		font: {
			name: 'Tahoma',
			color: 0x444444,
			size: 11
		},
		dataTip: {
			padding: 5,
			border: {
				color: 0x99bbe8,
				size:1
			},
			background: {
				color: 0xDAE7F6,
				alpha: .9
			},
			font: {
				name: 'Tahoma',
				color: 0x15428B,
				size: 10,
				bold: true
			}
		}
	},




	extraStyle: null,


	seriesStyles: null,


	disableCaching: Ext.isIE || Ext.isOpera,
	disableCacheParam: '_dc',

	initComponent : function(){
		Ext.chart.Chart.superclass.initComponent.call(this);
		if(!this.url){
			this.url = Ext.chart.Chart.CHART_URL;
		}
		if(this.disableCaching){
			this.url = Ext.urlAppend(this.url, String.format('{0}={1}', this.disableCacheParam, new Date().getTime()));
		}
		this.addEvents(
			'itemmouseover',
			'itemmouseout',
			'itemclick',
			'itemdoubleclick',
			'itemdragstart',
			'itemdrag',
			'itemdragend',

			'beforerefresh',

			'refresh'
		);
		this.store = Ext.StoreMgr.lookup(this.store);
	},


	setStyle: function(name, value){
		this.swf.setStyle(name, Ext.encode(value));
	},


	setStyles: function(styles){
		this.swf.setStyles(Ext.encode(styles));
	},


	setSeriesStyles: function(styles){
		this.seriesStyles = styles;
		var s = [];
		Ext.each(styles, function(style){
			s.push(Ext.encode(style));
		});
		this.swf.setSeriesStyles(s);
	},

	setCategoryNames : function(names){
		this.swf.setCategoryNames(names);
	},

	setTipRenderer : function(fn){
		var chart = this;
		this.tipFnName = this.createFnProxy(function(item, index, series){
			var record = chart.store.getAt(index);
			return fn(chart, record, index, series);
		}, this.tipFnName);
		this.swf.setDataTipFunction(this.tipFnName);
	},

	setSeries : function(series){
		this.series = series;
		this.refresh();
	},


	bindStore : function(store, initial){
		if(!initial && this.store){
			if(store !== this.store && this.store.autoDestroy){
				this.store.destroy();
			}else{
				this.store.un("datachanged", this.refresh, this);
				this.store.un("add", this.delayRefresh, this);
				this.store.un("remove", this.delayRefresh, this);
				this.store.un("update", this.delayRefresh, this);
				this.store.un("clear", this.refresh, this);
			}
		}
		if(store){
			store = Ext.StoreMgr.lookup(store);
			store.on({
				scope: this,
				datachanged: this.refresh,
				add: this.delayRefresh,
				remove: this.delayRefresh,
				update: this.delayRefresh,
				clear: this.refresh
			});
		}
		this.store = store;
		if(store && !initial){
			this.refresh();
		}
	},

	onSwfReady : function(isReset){
		Ext.chart.Chart.superclass.onSwfReady.call(this, isReset);
		this.swf.setType(this.type);

		if(this.chartStyle){
			this.setStyles(Ext.apply({}, this.extraStyle, this.chartStyle));
		}

		if(this.categoryNames){
			this.setCategoryNames(this.categoryNames);
		}

		if(this.tipRenderer){
			this.setTipRenderer(this.tipRenderer);
		}
		if(!isReset){
			this.bindStore(this.store, true);
		}
		this.refresh.defer(10, this);
	},

	delayRefresh : function(){
		if(!this.refreshTask){
			this.refreshTask = new Ext.util.DelayedTask(this.refresh, this);
		}
		this.refreshTask.delay(this.refreshBuffer);
	},

	refresh : function(){
		if(this.fireEvent('beforerefresh', this) !== false){
			var styleChanged = false;

			var data = [], rs = this.store.data.items;
			for(var j = 0, len = rs.length; j < len; j++){
				data[j] = rs[j].data;
			}


			var dataProvider = [];
			var seriesCount = 0;
			var currentSeries = null;
			var i = 0;
			if(this.series){
				seriesCount = this.series.length;
				for(i = 0; i < seriesCount; i++){
					currentSeries = this.series[i];
					var clonedSeries = {};
					for(var prop in currentSeries){
						if(prop == "style" && currentSeries.style !== null){
							clonedSeries.style = Ext.encode(currentSeries.style);
							styleChanged = true;




						} else{
							clonedSeries[prop] = currentSeries[prop];
						}
					}
					dataProvider.push(clonedSeries);
				}
			}

			if(seriesCount > 0){
				for(i = 0; i < seriesCount; i++){
					currentSeries = dataProvider[i];
					if(!currentSeries.type){
						currentSeries.type = this.type;
					}
					currentSeries.dataProvider = data;
				}
			} else{
				dataProvider.push({type: this.type, dataProvider: data});
			}
			this.swf.setDataProvider(dataProvider);
			if(this.seriesStyles){
				this.setSeriesStyles(this.seriesStyles);
			}
			this.fireEvent('refresh', this);
		}
	},

	createFnProxy : function(fn, old){
		if(old){
			delete window[old];
		}
		var fnName = "extFnProxy" + (++Ext.chart.Chart.PROXY_FN_ID);
		window[fnName] = fn;
		return fnName;
	},

	onDestroy: function(){
		Ext.chart.Chart.superclass.onDestroy.call(this);
		this.bindStore(null);
		var tip = this.tipFnName;
		if(!Ext.isEmpty(tip)){
			delete window[tip];
		}
	}
});
Ext.reg('chart', Ext.chart.Chart);
Ext.chart.Chart.PROXY_FN_ID = 0;


Ext.chart.Chart.CHART_URL = 'http:/' + '/yui.yahooapis.com/2.7.0/build/charts/assets/charts.swf';


Ext.chart.PieChart = Ext.extend(Ext.chart.Chart, {
	type: 'pie',

	onSwfReady : function(isReset){
		Ext.chart.PieChart.superclass.onSwfReady.call(this, isReset);

		this.setDataField(this.dataField);
		this.setCategoryField(this.categoryField);
	},

	setDataField : function(field){
		this.dataField = field;
		this.swf.setDataField(field);
	},

	setCategoryField : function(field){
		this.categoryField = field;
		this.swf.setCategoryField(field);
	}
});
Ext.reg('piechart', Ext.chart.PieChart);


Ext.chart.CartesianChart = Ext.extend(Ext.chart.Chart, {
	onSwfReady : function(isReset){
		Ext.chart.CartesianChart.superclass.onSwfReady.call(this, isReset);

		if(this.xField){
			this.setXField(this.xField);
		}
		if(this.yField){
			this.setYField(this.yField);
		}
		if(this.xAxis){
			this.setXAxis(this.xAxis);
		}
		if(this.yAxis){
			this.setYAxis(this.yAxis);
		}
	},

	setXField : function(value){
		this.xField = value;
		this.swf.setHorizontalField(value);
	},

	setYField : function(value){
		this.yField = value;
		this.swf.setVerticalField(value);
	},

	setXAxis : function(value){
		this.xAxis = this.createAxis('xAxis', value);
		this.swf.setHorizontalAxis(this.xAxis);
	},

	setYAxis : function(value){
		this.yAxis = this.createAxis('yAxis', value);
		this.swf.setVerticalAxis(this.yAxis);
	},

	createAxis : function(axis, value){
		var o = Ext.apply({}, value), oldFn = null;
		if(this[axis]){
			oldFn = this[axis].labelFunction;
		}
		if(o.labelRenderer){
			var fn = o.labelRenderer;
			o.labelFunction = this.createFnProxy(function(v){
				return fn(v);
			}, oldFn);
			delete o.labelRenderer;
		}
		return o;
	}
});
Ext.reg('cartesianchart', Ext.chart.CartesianChart);


Ext.chart.LineChart = Ext.extend(Ext.chart.CartesianChart, {
	type: 'line'
});
Ext.reg('linechart', Ext.chart.LineChart);


Ext.chart.ColumnChart = Ext.extend(Ext.chart.CartesianChart, {
	type: 'column'
});
Ext.reg('columnchart', Ext.chart.ColumnChart);


Ext.chart.StackedColumnChart = Ext.extend(Ext.chart.CartesianChart, {
	type: 'stackcolumn'
});
Ext.reg('stackedcolumnchart', Ext.chart.StackedColumnChart);


Ext.chart.BarChart = Ext.extend(Ext.chart.CartesianChart, {
	type: 'bar'
});
Ext.reg('barchart', Ext.chart.BarChart);


Ext.chart.StackedBarChart = Ext.extend(Ext.chart.CartesianChart, {
	type: 'stackbar'
});
Ext.reg('stackedbarchart', Ext.chart.StackedBarChart);




Ext.chart.Axis = function(config){
	Ext.apply(this, config);
};

Ext.chart.Axis.prototype =
{

	type: null,


	orientation: "horizontal",


	reverse: false,


	labelFunction: null,


	hideOverlappingLabels: true
};


Ext.chart.NumericAxis = Ext.extend(Ext.chart.Axis, {
	type: "numeric",


	minimum: NaN,


	maximum: NaN,


	majorUnit: NaN,


	minorUnit: NaN,


	snapToUnits: true,


	alwaysShowZero: true,


	scale: "linear"
});


Ext.chart.TimeAxis = Ext.extend(Ext.chart.Axis, {
	type: "time",


	minimum: null,


	maximum: null,


	majorUnit: NaN,


	majorTimeUnit: null,


	minorUnit: NaN,


	minorTimeUnit: null,


	snapToUnits: true
});


Ext.chart.CategoryAxis = Ext.extend(Ext.chart.Axis, {
	type: "category",


	categoryNames: null
});


Ext.chart.Series = function(config) { Ext.apply(this, config); };

Ext.chart.Series.prototype =
{

	type: null,


	displayName: null
};


Ext.chart.CartesianSeries = Ext.extend(Ext.chart.Series, {

	xField: null,


	yField: null
});


Ext.chart.ColumnSeries = Ext.extend(Ext.chart.CartesianSeries, {
	type: "column"
});


Ext.chart.LineSeries = Ext.extend(Ext.chart.CartesianSeries, {
	type: "line"
});


Ext.chart.BarSeries = Ext.extend(Ext.chart.CartesianSeries, {
	type: "bar"
});



Ext.chart.PieSeries = Ext.extend(Ext.chart.Series, {
	type: "pie",
	dataField: null,
	categoryField: null
});
Ext.layout.MenuLayout = Ext.extend(Ext.layout.ContainerLayout, {
	monitorResize : true,

	setContainer : function(ct){
		this.monitorResize = !ct.floating;


		ct.on('autosize', this.doAutoSize, this);
		Ext.layout.MenuLayout.superclass.setContainer.call(this, ct);
	},

	renderItem : function(c, position, target){
		if (!this.itemTpl) {
			this.itemTpl = Ext.layout.MenuLayout.prototype.itemTpl = new Ext.XTemplate(
				'<li id="{itemId}" class="{itemCls}">',
				'<tpl if="needsIcon">',
				'<img src="{icon}" class="{iconCls}"/>',
				'</tpl>',
				'</li>'
			);
		}

		if(c && !c.rendered){
			if(Ext.isNumber(position)){
				position = target.dom.childNodes[position];
			}
			var a = this.getItemArgs(c);


			c.render(c.positionEl = position ?
				this.itemTpl.insertBefore(position, a, true) :
				this.itemTpl.append(target, a, true));


			c.positionEl.menuItemId = c.getItemId();



			if (!a.isMenuItem && a.needsIcon) {
				c.positionEl.addClass('x-menu-list-item-indent');
			}
			this.configureItem(c, position);
		}else if(c && !this.isValidParent(c, target)){
			if(Ext.isNumber(position)){
				position = target.dom.childNodes[position];
			}
			target.dom.insertBefore(c.getActionEl().dom, position || null);
		}
	},

	getItemArgs : function(c) {
		var isMenuItem = c instanceof Ext.menu.Item;
		return {
			isMenuItem: isMenuItem,
			needsIcon: !isMenuItem && (c.icon || c.iconCls),
			icon: c.icon || Ext.BLANK_IMAGE_URL,
			iconCls: 'x-menu-item-icon ' + (c.iconCls || ''),
			itemId: 'x-menu-el-' + c.id,
			itemCls: 'x-menu-list-item '
		};
	},


	isValidParent : function(c, target) {
		return c.el.up('li.x-menu-list-item', 5).dom.parentNode === (target.dom || target);
	},

	onLayout : function(ct, target){
		this.renderAll(ct, target);
		this.doAutoSize();
	},

	doAutoSize : function(){
		var ct = this.container, w = ct.width;
		if(ct.floating){
			if(w){
				ct.setWidth(w);
			}else if(Ext.isIE){
				ct.setWidth(Ext.isStrict && (Ext.isIE7 || Ext.isIE8) ? 'auto' : ct.minWidth);
				var el = ct.getEl(), t = el.dom.offsetWidth;
				ct.setWidth(ct.getLayoutTarget().getWidth() + el.getFrameWidth('lr'));
			}
		}
	}
});
Ext.Container.LAYOUTS['menu'] = Ext.layout.MenuLayout;


Ext.menu.Menu = Ext.extend(Ext.Container, {



	minWidth : 120,

	shadow : 'sides',

	subMenuAlign : 'tl-tr?',

	defaultAlign : 'tl-bl?',

	allowOtherMenus : false,

	ignoreParentClicks : false,

	enableScrolling : true,

	maxHeight : null,

	scrollIncrement : 24,

	showSeparator : true,

	defaultOffsets : [0, 0],


	plain : false,


	floating : true,


	hidden : true,


	layout : 'menu',
	hideMode : 'offsets',
	scrollerHeight : 8,
	autoLayout : true,
	defaultType : 'menuitem',
	bufferResize : false,

	initComponent : function(){
		if(Ext.isArray(this.initialConfig)){
			Ext.apply(this, {items:this.initialConfig});
		}
		this.addEvents(

			'click',

			'mouseover',

			'mouseout',

			'itemclick'
		);
		Ext.menu.MenuMgr.register(this);
		if(this.floating){
			Ext.EventManager.onWindowResize(this.hide, this);
		}else{
			if(this.initialConfig.hidden !== false){
				this.hidden = false;
			}
			this.internalDefaults = {hideOnClick: false};
		}
		Ext.menu.Menu.superclass.initComponent.call(this);
		if(this.autoLayout){
			this.on({
				add: this.doLayout,
				remove: this.doLayout,
				scope: this
			});
		}
	},


	getLayoutTarget : function() {
		return this.ul;
	},


	onRender : function(ct, position){
		if(!ct){
			ct = Ext.getBody();
		}

		var dh = {
			id: this.getId(),
			cls: 'x-menu ' + ((this.floating) ? 'x-menu-floating x-layer ' : '') + (this.cls || '') + (this.plain ? ' x-menu-plain' : '') + (this.showSeparator ? '' : ' x-menu-nosep'),
			style: this.style,
			cn: [
				{tag: 'a', cls: 'x-menu-focus', href: '#', onclick: 'return false;', tabIndex: '-1'},
				{tag: 'ul', cls: 'x-menu-list'}
			]
		};
		if(this.floating){
			this.el = new Ext.Layer({
				shadow: this.shadow,
				dh: dh,
				constrain: false,
				parentEl: ct,
				zindex:15000
			});
		}else{
			this.el = ct.createChild(dh);
		}
		Ext.menu.Menu.superclass.onRender.call(this, ct, position);

		if(!this.keyNav){
			this.keyNav = new Ext.menu.MenuNav(this);
		}

		this.focusEl = this.el.child('a.x-menu-focus');
		this.ul = this.el.child('ul.x-menu-list');
		this.mon(this.ul, {
			scope: this,
			click: this.onClick,
			mouseover: this.onMouseOver,
			mouseout: this.onMouseOut
		});
		if(this.enableScrolling){
			this.mon(this.el, {
				scope: this,
				delegate: '.x-menu-scroller',
				click: this.onScroll,
				mouseover: this.deactivateActive
			});
		}
	},


	findTargetItem : function(e){
		var t = e.getTarget('.x-menu-list-item', this.ul, true);
		if(t && t.menuItemId){
			return this.items.get(t.menuItemId);
		}
	},


	onClick : function(e){
		var t = this.findTargetItem(e);
		if(t){
			if(t.isFormField){
				this.setActiveItem(t);
			}else if(t instanceof Ext.menu.BaseItem){
				if(t.menu && this.ignoreParentClicks){
					t.expandMenu();
					e.preventDefault();
				}else if(t.onClick){
					t.onClick(e);
					this.fireEvent('click', this, t, e);
				}
			}
		}
	},


	setActiveItem : function(item, autoExpand){
		if(item != this.activeItem){
			this.deactivateActive();
			if((this.activeItem = item).isFormField){
				item.focus();
			}else{
				item.activate(autoExpand);
			}
		}else if(autoExpand){
			item.expandMenu();
		}
	},

	deactivateActive : function(){
		var a = this.activeItem;
		if(a){
			if(a.isFormField){

				if(a.collapse){
					a.collapse();
				}
			}else{
				a.deactivate();
			}
			delete this.activeItem;
		}
	},


	tryActivate : function(start, step){
		var items = this.items;
		for(var i = start, len = items.length; i >= 0 && i < len; i+= step){
			var item = items.get(i);
			if(!item.disabled && (item.canActivate || item.isFormField)){
				this.setActiveItem(item, false);
				return item;
			}
		}
		return false;
	},


	onMouseOver : function(e){
		var t = this.findTargetItem(e);
		if(t){
			if(t.canActivate && !t.disabled){
				this.setActiveItem(t, true);
			}
		}
		this.over = true;
		this.fireEvent('mouseover', this, e, t);
	},


	onMouseOut : function(e){
		var t = this.findTargetItem(e);
		if(t){
			if(t == this.activeItem && t.shouldDeactivate && t.shouldDeactivate(e)){
				this.activeItem.deactivate();
				delete this.activeItem;
			}
		}
		this.over = false;
		this.fireEvent('mouseout', this, e, t);
	},


	onScroll : function(e, t){
		if(e){
			e.stopEvent();
		}
		var ul = this.ul.dom, top = Ext.fly(t).is('.x-menu-scroller-top');
		ul.scrollTop += this.scrollIncrement * (top ? -1 : 1);
		if(top ? ul.scrollTop <= 0 : ul.scrollTop + this.activeMax >= ul.scrollHeight){
			this.onScrollerOut(null, t);
		}
	},


	onScrollerIn : function(e, t){
		var ul = this.ul.dom, top = Ext.fly(t).is('.x-menu-scroller-top');
		if(top ? ul.scrollTop > 0 : ul.scrollTop + this.activeMax < ul.scrollHeight){
			Ext.fly(t).addClass(['x-menu-item-active', 'x-menu-scroller-active']);
		}
	},


	onScrollerOut : function(e, t){
		Ext.fly(t).removeClass(['x-menu-item-active', 'x-menu-scroller-active']);
	},


	show : function(el, pos, parentMenu){
		if(this.floating){
			this.parentMenu = parentMenu;
			if(!this.el){
				this.render();
				this.doLayout(false, true);
			}
			this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign, this.defaultOffsets), parentMenu);
		}else{
			Ext.menu.Menu.superclass.show.call(this);
		}
	},


	showAt : function(xy, parentMenu){
		if(this.fireEvent('beforeshow', this) !== false){
			this.parentMenu = parentMenu;
			if(!this.el){
				this.render();
			}
			if(this.enableScrolling){

				this.el.setXY(xy);

				this.constrainScroll(xy[1]);
				xy = [this.el.adjustForConstraints(xy)[0], xy[1]];
			}else{

				xy = this.el.adjustForConstraints(xy);
			}
			this.el.setXY(xy);
			this.el.show();
			Ext.menu.Menu.superclass.onShow.call(this);
			if(Ext.isIE){

				this.fireEvent('autosize', this);
				if(!Ext.isIE8){
					this.el.repaint();
				}
			}
			this.hidden = false;
			this.focus();
			this.fireEvent('show', this);
		}
	},

	constrainScroll : function(y){
		var max, full = this.ul.setHeight('auto').getHeight();
		if(this.floating){
			max = this.maxHeight ? this.maxHeight : Ext.fly(this.el.dom.parentNode).getViewSize(false).height - y;
		}else{
			max = this.getHeight();
		}
		if(full > max && max > 0){
			this.activeMax = max - this.scrollerHeight * 2 - this.el.getFrameWidth('tb') - Ext.num(this.el.shadowOffset, 0);
			this.ul.setHeight(this.activeMax);
			this.createScrollers();
			this.el.select('.x-menu-scroller').setDisplayed('');
		}else{
			this.ul.setHeight(full);
			this.el.select('.x-menu-scroller').setDisplayed('none');
		}
		this.ul.dom.scrollTop = 0;
	},

	createScrollers : function(){
		if(!this.scroller){
			this.scroller = {
				pos: 0,
				top: this.el.insertFirst({
					tag: 'div',
					cls: 'x-menu-scroller x-menu-scroller-top',
					html: '&#160;'
				}),
				bottom: this.el.createChild({
					tag: 'div',
					cls: 'x-menu-scroller x-menu-scroller-bottom',
					html: '&#160;'
				})
			};
			this.scroller.top.hover(this.onScrollerIn, this.onScrollerOut, this);
			this.scroller.topRepeater = new Ext.util.ClickRepeater(this.scroller.top, {
				listeners: {
					click: this.onScroll.createDelegate(this, [null, this.scroller.top], false)
				}
			});
			this.scroller.bottom.hover(this.onScrollerIn, this.onScrollerOut, this);
			this.scroller.bottomRepeater = new Ext.util.ClickRepeater(this.scroller.bottom, {
				listeners: {
					click: this.onScroll.createDelegate(this, [null, this.scroller.bottom], false)
				}
			});
		}
	},

	onLayout : function(){
		if(this.isVisible()){
			if(this.enableScrolling){
				this.constrainScroll(this.el.getTop());
			}
			if(this.floating){
				this.el.sync();
			}
		}
	},

	focus : function(){
		if(!this.hidden){
			this.doFocus.defer(50, this);
		}
	},

	doFocus : function(){
		if(!this.hidden){
			this.focusEl.focus();
		}
	},


	hide : function(deep){
		this.deepHide = deep;
		Ext.menu.Menu.superclass.hide.call(this);
		delete this.deepHide;
	},


	onHide : function(){
		Ext.menu.Menu.superclass.onHide.call(this);
		this.deactivateActive();
		if(this.el && this.floating){
			this.el.hide();
		}
		var pm = this.parentMenu;
		if(this.deepHide === true && pm){
			if(pm.floating){
				pm.hide(true);
			}else{
				pm.deactivateActive();
			}
		}
	},


	lookupComponent : function(c){
		if(Ext.isString(c)){
			c = (c == 'separator' || c == '-') ? new Ext.menu.Separator() : new Ext.menu.TextItem(c);
			this.applyDefaults(c);
		}else{
			if(Ext.isObject(c)){
				c = this.getMenuItem(c);
			}else if(c.tagName || c.el){
				c = new Ext.BoxComponent({
					el: c
				});
			}
		}
		return c;
	},

	applyDefaults : function(c){
		if(!Ext.isString(c)){
			c = Ext.menu.Menu.superclass.applyDefaults.call(this, c);
			var d = this.internalDefaults;
			if(d){
				if(c.events){
					Ext.applyIf(c.initialConfig, d);
					Ext.apply(c, d);
				}else{
					Ext.applyIf(c, d);
				}
			}
		}
		return c;
	},


	getMenuItem : function(config){
		if(!config.isXType){
			if(!config.xtype && Ext.isBoolean(config.checked)){
				return new Ext.menu.CheckItem(config)
			}
			return Ext.create(config, this.defaultType);
		}
		return config;
	},


	addSeparator : function(){
		return this.add(new Ext.menu.Separator());
	},


	addElement : function(el){
		return this.add(new Ext.menu.BaseItem(el));
	},


	addItem : function(item){
		return this.add(item);
	},


	addMenuItem : function(config){
		return this.add(this.getMenuItem(config));
	},


	addText : function(text){
		return this.add(new Ext.menu.TextItem(text));
	},


	onDestroy : function(){
		var pm = this.parentMenu;
		if(pm && pm.activeChild == this){
			delete pm.activeChild;
		}
		delete this.parentMenu;
		Ext.menu.Menu.superclass.onDestroy.call(this);
		Ext.menu.MenuMgr.unregister(this);
		Ext.EventManager.removeResizeListener(this.hide, this);
		if(this.keyNav) {
			this.keyNav.disable();
		}
		var s = this.scroller;
		if(s){
			Ext.destroy(s.topRepeater, s.bottomRepeater, s.top, s.bottom);
		}
		Ext.destroy(
			this.el,
			this.focusEl,
			this.ul
		);
	}
});

Ext.reg('menu', Ext.menu.Menu);


Ext.menu.MenuNav = Ext.extend(Ext.KeyNav, function(){
	function up(e, m){
		if(!m.tryActivate(m.items.indexOf(m.activeItem)-1, -1)){
			m.tryActivate(m.items.length-1, -1);
		}
	}
	function down(e, m){
		if(!m.tryActivate(m.items.indexOf(m.activeItem)+1, 1)){
			m.tryActivate(0, 1);
		}
	}
	return {
		constructor : function(menu){
			Ext.menu.MenuNav.superclass.constructor.call(this, menu.el);
			this.scope = this.menu = menu;
		},

		doRelay : function(e, h){
			var k = e.getKey();

			if (this.menu.activeItem && this.menu.activeItem.isFormField && k != e.TAB) {
				return false;
			}
			if(!this.menu.activeItem && e.isNavKeyPress() && k != e.SPACE && k != e.RETURN){
				this.menu.tryActivate(0, 1);
				return false;
			}
			return h.call(this.scope || this, e, this.menu);
		},

		tab: function(e, m) {
			e.stopEvent();
			if (e.shiftKey) {
				up(e, m);
			} else {
				down(e, m);
			}
		},

		up : up,

		down : down,

		right : function(e, m){
			if(m.activeItem){
				m.activeItem.expandMenu(true);
			}
		},

		left : function(e, m){
			m.hide();
			if(m.parentMenu && m.parentMenu.activeItem){
				m.parentMenu.activeItem.activate();
			}
		},

		enter : function(e, m){
			if(m.activeItem){
				e.stopPropagation();
				m.activeItem.onClick(e);
				m.fireEvent('click', this, m.activeItem);
				return true;
			}
		}
	};
}());

Ext.menu.MenuMgr = function(){
	var menus, active, groups = {}, attached = false, lastShow = new Date();


	function init(){
		menus = {};
		active = new Ext.util.MixedCollection();
		Ext.getDoc().addKeyListener(27, function(){
			if(active.length > 0){
				hideAll();
			}
		});
	}


	function hideAll(){
		if(active && active.length > 0){
			var c = active.clone();
			c.each(function(m){
				m.hide();
			});
			return true;
		}
		return false;
	}


	function onHide(m){
		active.remove(m);
		if(active.length < 1){
			Ext.getDoc().un("mousedown", onMouseDown);
			attached = false;
		}
	}


	function onShow(m){
		var last = active.last();
		lastShow = new Date();
		active.add(m);
		if(!attached){
			Ext.getDoc().on("mousedown", onMouseDown);
			attached = true;
		}
		if(m.parentMenu){
			m.getEl().setZIndex(parseInt(m.parentMenu.getEl().getStyle("z-index"), 10) + 3);
			m.parentMenu.activeChild = m;
		}else if(last && last.isVisible()){
			m.getEl().setZIndex(parseInt(last.getEl().getStyle("z-index"), 10) + 3);
		}
	}


	function onBeforeHide(m){
		if(m.activeChild){
			m.activeChild.hide();
		}
		if(m.autoHideTimer){
			clearTimeout(m.autoHideTimer);
			delete m.autoHideTimer;
		}
	}


	function onBeforeShow(m){
		var pm = m.parentMenu;
		if(!pm && !m.allowOtherMenus){
			hideAll();
		}else if(pm && pm.activeChild){
			pm.activeChild.hide();
		}
	}


	function onMouseDown(e){
		if(lastShow.getElapsed() > 50 && active.length > 0 && !e.getTarget(".x-menu")){
			hideAll();
		}
	}


	function onBeforeCheck(mi, state){
		if(state){
			var g = groups[mi.group];
			for(var i = 0, l = g.length; i < l; i++){
				if(g[i] != mi){
					g[i].setChecked(false);
				}
			}
		}
	}

	return {


		hideAll : function(){
			return hideAll();
		},


		register : function(menu){
			if(!menus){
				init();
			}
			menus[menu.id] = menu;
			menu.on({
				beforehide: onBeforeHide,
				hide: onHide,
				beforeshow: onBeforeShow,
				show: onShow
			});
		},


		get : function(menu){
			if(typeof menu == "string"){
				if(!menus){
					return null;
				}
				return menus[menu];
			}else if(menu.events){
				return menu;
			}else if(typeof menu.length == 'number'){
				return new Ext.menu.Menu({items:menu});
			}else{
				return Ext.create(menu, 'menu');
			}
		},


		unregister : function(menu){
			delete menus[menu.id];
			menu.un("beforehide", onBeforeHide);
			menu.un("hide", onHide);
			menu.un("beforeshow", onBeforeShow);
			menu.un("show", onShow);
		},


		registerCheckable : function(menuItem){
			var g = menuItem.group;
			if(g){
				if(!groups[g]){
					groups[g] = [];
				}
				groups[g].push(menuItem);
				menuItem.on("beforecheckchange", onBeforeCheck);
			}
		},


		unregisterCheckable : function(menuItem){
			var g = menuItem.group;
			if(g){
				groups[g].remove(menuItem);
				menuItem.un("beforecheckchange", onBeforeCheck);
			}
		},

		getCheckedItem : function(groupId){
			var g = groups[groupId];
			if(g){
				for(var i = 0, l = g.length; i < l; i++){
					if(g[i].checked){
						return g[i];
					}
				}
			}
			return null;
		},

		setCheckedItem : function(groupId, itemId){
			var g = groups[groupId];
			if(g){
				for(var i = 0, l = g.length; i < l; i++){
					if(g[i].id == itemId){
						g[i].setChecked(true);
					}
				}
			}
			return null;
		}
	};
}();

Ext.menu.BaseItem = Ext.extend(Ext.Component, {




	canActivate : false,

	activeClass : "x-menu-item-active",

	hideOnClick : true,

	clickHideDelay : 1,


	ctype : "Ext.menu.BaseItem",


	actionMode : "container",

	initComponent : function(){
		Ext.menu.BaseItem.superclass.initComponent.call(this);
		this.addEvents(

			'click',

			'activate',

			'deactivate'
		);
		if(this.handler){
			this.on("click", this.handler, this.scope);
		}
	},


	onRender : function(container, position){
		Ext.menu.BaseItem.superclass.onRender.apply(this, arguments);
		if(this.ownerCt && this.ownerCt instanceof Ext.menu.Menu){
			this.parentMenu = this.ownerCt;
		}else{
			this.container.addClass('x-menu-list-item');
			this.mon(this.el, {
				scope: this,
				click: this.onClick,
				mouseenter: this.activate,
				mouseleave: this.deactivate
			});
		}
	},


	setHandler : function(handler, scope){
		if(this.handler){
			this.un("click", this.handler, this.scope);
		}
		this.on("click", this.handler = handler, this.scope = scope);
	},


	onClick : function(e){
		if(!this.disabled && this.fireEvent("click", this, e) !== false
			&& (this.parentMenu && this.parentMenu.fireEvent("itemclick", this, e) !== false)){
			this.handleClick(e);
		}else{
			e.stopEvent();
		}
	},


	activate : function(){
		if(this.disabled){
			return false;
		}
		var li = this.container;
		li.addClass(this.activeClass);
		this.region = li.getRegion().adjust(2, 2, -2, -2);
		this.fireEvent("activate", this);
		return true;
	},


	deactivate : function(){
		this.container.removeClass(this.activeClass);
		this.fireEvent("deactivate", this);
	},


	shouldDeactivate : function(e){
		return !this.region || !this.region.contains(e.getPoint());
	},


	handleClick : function(e){
		var pm = this.parentMenu;
		if(this.hideOnClick){
			if(pm.floating){
				pm.hide.defer(this.clickHideDelay, pm, [true]);
			}else{
				pm.deactivateActive();
			}
		}
	},


	expandMenu : Ext.emptyFn,


	hideMenu : Ext.emptyFn
});
Ext.reg('menubaseitem', Ext.menu.BaseItem);
Ext.menu.TextItem = Ext.extend(Ext.menu.BaseItem, {


	hideOnClick : false,

	itemCls : "x-menu-text",

	constructor : function(config){
		if(typeof config == 'string'){
			config = {text: config}
		}
		Ext.menu.TextItem.superclass.constructor.call(this, config);
	},


	onRender : function(){
		var s = document.createElement("span");
		s.className = this.itemCls;
		s.innerHTML = this.text;
		this.el = s;
		Ext.menu.TextItem.superclass.onRender.apply(this, arguments);
	}
});
Ext.reg('menutextitem', Ext.menu.TextItem);
Ext.menu.Separator = Ext.extend(Ext.menu.BaseItem, {

	itemCls : "x-menu-sep",

	hideOnClick : false,


	activeClass: '',


	onRender : function(li){
		var s = document.createElement("span");
		s.className = this.itemCls;
		s.innerHTML = "&#160;";
		this.el = s;
		li.addClass("x-menu-sep-li");
		Ext.menu.Separator.superclass.onRender.apply(this, arguments);
	}
});
Ext.reg('menuseparator', Ext.menu.Separator);
Ext.menu.Item = Ext.extend(Ext.menu.BaseItem, {








	itemCls : 'x-menu-item',

	canActivate : true,

	showDelay: 200,

	hideDelay: 200,


	ctype: 'Ext.menu.Item',

	initComponent : function(){
		Ext.menu.Item.superclass.initComponent.call(this);
		if(this.menu){
			this.menu = Ext.menu.MenuMgr.get(this.menu);
			this.menu.ownerCt = this;
		}
	},


	onRender : function(container, position){
		if (!this.itemTpl) {
			this.itemTpl = Ext.menu.Item.prototype.itemTpl = new Ext.XTemplate(
				'<a id="{id}" class="{cls}" hidefocus="true" unselectable="on" href="{href}"',
				'<tpl if="hrefTarget">',
				' target="{hrefTarget}"',
				'</tpl>',
				'>',
				'<img src="{icon}" class="x-menu-item-icon {iconCls}"/>',
				'<span class="x-menu-item-text">{text}</span>',
				'</a>'
			);
		}
		var a = this.getTemplateArgs();
		this.el = position ? this.itemTpl.insertBefore(position, a, true) : this.itemTpl.append(container, a, true);
		this.iconEl = this.el.child('img.x-menu-item-icon');
		this.textEl = this.el.child('.x-menu-item-text');
		if(!this.href) {
			this.mon(this.el, 'click', Ext.emptyFn, null, { preventDefault: true });
		}
		Ext.menu.Item.superclass.onRender.call(this, container, position);
	},

	getTemplateArgs: function() {
		return {
			id: this.id,
			cls: this.itemCls + (this.menu ?  ' x-menu-item-arrow' : '') + (this.cls ?  ' ' + this.cls : ''),
			href: this.href || '#',
			hrefTarget: this.hrefTarget,
			icon: this.icon || Ext.BLANK_IMAGE_URL,
			iconCls: this.iconCls || '',
			text: this.itemText||this.text||'&#160;'
		};
	},


	setText : function(text){
		this.text = text||'&#160;';
		if(this.rendered){
			this.textEl.update(this.text);
			this.parentMenu.layout.doAutoSize();
		}
	},


	setIconClass : function(cls){
		var oldCls = this.iconCls;
		this.iconCls = cls;
		if(this.rendered){
			this.iconEl.replaceClass(oldCls, this.iconCls);
		}
	},


	beforeDestroy: function(){
		if (this.menu){
			delete this.menu.ownerCt;
			this.menu.destroy();
		}
		Ext.menu.Item.superclass.beforeDestroy.call(this);
	},


	handleClick : function(e){
		if(!this.href){
			e.stopEvent();
		}
		Ext.menu.Item.superclass.handleClick.apply(this, arguments);
	},


	activate : function(autoExpand){
		if(Ext.menu.Item.superclass.activate.apply(this, arguments)){
			this.focus();
			if(autoExpand){
				this.expandMenu();
			}
		}
		return true;
	},


	shouldDeactivate : function(e){
		if(Ext.menu.Item.superclass.shouldDeactivate.call(this, e)){
			if(this.menu && this.menu.isVisible()){
				return !this.menu.getEl().getRegion().contains(e.getPoint());
			}
			return true;
		}
		return false;
	},


	deactivate : function(){
		Ext.menu.Item.superclass.deactivate.apply(this, arguments);
		this.hideMenu();
	},


	expandMenu : function(autoActivate){
		if(!this.disabled && this.menu){
			clearTimeout(this.hideTimer);
			delete this.hideTimer;
			if(!this.menu.isVisible() && !this.showTimer){
				this.showTimer = this.deferExpand.defer(this.showDelay, this, [autoActivate]);
			}else if (this.menu.isVisible() && autoActivate){
				this.menu.tryActivate(0, 1);
			}
		}
	},


	deferExpand : function(autoActivate){
		delete this.showTimer;
		this.menu.show(this.container, this.parentMenu.subMenuAlign || 'tl-tr?', this.parentMenu);
		if(autoActivate){
			this.menu.tryActivate(0, 1);
		}
	},


	hideMenu : function(){
		clearTimeout(this.showTimer);
		delete this.showTimer;
		if(!this.hideTimer && this.menu && this.menu.isVisible()){
			this.hideTimer = this.deferHide.defer(this.hideDelay, this);
		}
	},


	deferHide : function(){
		delete this.hideTimer;
		if(this.menu.over){
			this.parentMenu.setActiveItem(this, false);
		}else{
			this.menu.hide();
		}
	}
});
Ext.reg('menuitem', Ext.menu.Item);
Ext.menu.CheckItem = Ext.extend(Ext.menu.Item, {


	itemCls : "x-menu-item x-menu-check-item",

	groupClass : "x-menu-group-item",


	checked: false,


	ctype: "Ext.menu.CheckItem",

	initComponent : function(){
		Ext.menu.CheckItem.superclass.initComponent.call(this);
		this.addEvents(

			"beforecheckchange" ,

			"checkchange"
		);

		if(this.checkHandler){
			this.on('checkchange', this.checkHandler, this.scope);
		}
		Ext.menu.MenuMgr.registerCheckable(this);
	},


	onRender : function(c){
		Ext.menu.CheckItem.superclass.onRender.apply(this, arguments);
		if(this.group){
			this.el.addClass(this.groupClass);
		}
		if(this.checked){
			this.checked = false;
			this.setChecked(true, true);
		}
	},


	destroy : function(){
		Ext.menu.MenuMgr.unregisterCheckable(this);
		Ext.menu.CheckItem.superclass.destroy.apply(this, arguments);
	},


	setChecked : function(state, suppressEvent){
		if(this.checked != state && this.fireEvent("beforecheckchange", this, state) !== false){
			if(this.container){
				this.container[state ? "addClass" : "removeClass"]("x-menu-item-checked");
			}
			this.checked = state;
			if(suppressEvent !== true){
				this.fireEvent("checkchange", this, state);
			}
		}
	},


	handleClick : function(e){
		if(!this.disabled && !(this.checked && this.group)){
			this.setChecked(!this.checked);
		}
		Ext.menu.CheckItem.superclass.handleClick.apply(this, arguments);
	}
});
Ext.reg('menucheckitem', Ext.menu.CheckItem);
Ext.menu.DateMenu = Ext.extend(Ext.menu.Menu, {

	enableScrolling : false,



	hideOnClick : true,


	pickerId : null,




	cls : 'x-date-menu',





	initComponent : function(){
		this.on('beforeshow', this.onBeforeShow, this);
		if(this.strict = (Ext.isIE7 && Ext.isStrict)){
			this.on('show', this.onShow, this, {single: true, delay: 20});
		}
		Ext.apply(this, {
			plain: true,
			showSeparator: false,
			items: this.picker = new Ext.DatePicker(Ext.applyIf({
				internalRender: this.strict || !Ext.isIE,
				ctCls: 'x-menu-date-item',
				id: this.pickerId
			}, this.initialConfig))
		});
		this.picker.purgeListeners();
		Ext.menu.DateMenu.superclass.initComponent.call(this);

		this.relayEvents(this.picker, ['select']);
		this.on('show', this.picker.focus, this.picker);
		this.on('select', this.menuHide, this);
		if(this.handler){
			this.on('select', this.handler, this.scope || this);
		}
	},

	menuHide : function() {
		if(this.hideOnClick){
			this.hide(true);
		}
	},

	onBeforeShow : function(){
		if(this.picker){
			this.picker.hideMonthPicker(true);
		}
	},

	onShow : function(){
		var el = this.picker.getEl();
		el.setWidth(el.getWidth());
	}
});
Ext.reg('datemenu', Ext.menu.DateMenu);

Ext.menu.ColorMenu = Ext.extend(Ext.menu.Menu, {

	enableScrolling : false,




	hideOnClick : true,

	cls : 'x-color-menu',


	paletteId : null,










	initComponent : function(){
		Ext.apply(this, {
			plain: true,
			showSeparator: false,
			items: this.palette = new Ext.ColorPalette(Ext.applyIf({
				id: this.paletteId
			}, this.initialConfig))
		});
		this.palette.purgeListeners();
		Ext.menu.ColorMenu.superclass.initComponent.call(this);

		this.relayEvents(this.palette, ['select']);
		this.on('select', this.menuHide, this);
		if(this.handler){
			this.on('select', this.handler, this.scope || this);
		}
	},

	menuHide : function(){
		if(this.hideOnClick){
			this.hide(true);
		}
	}
});
Ext.reg('colormenu', Ext.menu.ColorMenu);

Ext.form.Field = Ext.extend(Ext.BoxComponent,  {








	invalidClass : 'x-form-invalid',

	invalidText : 'The value in this field is invalid',

	focusClass : 'x-form-focus',


	validationEvent : 'keyup',

	validateOnBlur : true,

	validationDelay : 250,

	defaultAutoCreate : {tag: 'input', type: 'text', size: '20', autocomplete: 'off'},

	fieldClass : 'x-form-field',

	msgTarget : 'qtip',

	msgFx : 'normal',

	readOnly : false,

	disabled : false,

	submitValue: true,


	isFormField : true,


	msgDisplay: '',


	hasFocus : false,


	initComponent : function(){
		Ext.form.Field.superclass.initComponent.call(this);
		this.addEvents(

			'focus',

			'blur',

			'specialkey',

			'change',

			'invalid',

			'valid'
		);
	},


	getName : function(){
		return this.rendered && this.el.dom.name ? this.el.dom.name : this.name || this.id || '';
	},


	onRender : function(ct, position){
		if(!this.el){
			var cfg = this.getAutoCreate();

			if(!cfg.name){
				cfg.name = this.name || this.id;
			}
			if(this.inputType){
				cfg.type = this.inputType;
			}
			this.autoEl = cfg;
		}
		Ext.form.Field.superclass.onRender.call(this, ct, position);
		if(this.submitValue === false){
			this.el.dom.removeAttribute('name');
		}
		var type = this.el.dom.type;
		if(type){
			if(type == 'password'){
				type = 'text';
			}
			this.el.addClass('x-form-'+type);
		}
		if(this.readOnly){
			this.setReadOnly(true);
		}
		if(this.tabIndex !== undefined){
			this.el.dom.setAttribute('tabIndex', this.tabIndex);
		}

		this.el.addClass([this.fieldClass, this.cls]);
	},


	getItemCt : function(){
		return this.itemCt;
	},


	initValue : function(){
		if(this.value !== undefined){
			this.setValue(this.value);
		}else if(!Ext.isEmpty(this.el.dom.value) && this.el.dom.value != this.emptyText){
			this.setValue(this.el.dom.value);
		}

		this.originalValue = this.getValue();
	},


	isDirty : function() {
		if(this.disabled || !this.rendered) {
			return false;
		}
		return String(this.getValue()) !== String(this.originalValue);
	},


	setReadOnly : function(readOnly){
		if(this.rendered){
			this.el.dom.readOnly = readOnly;
		}
		this.readOnly = readOnly;
	},


	afterRender : function(){
		Ext.form.Field.superclass.afterRender.call(this);
		this.initEvents();
		this.initValue();
	},


	fireKey : function(e){
		if(e.isSpecialKey()){
			this.fireEvent('specialkey', this, e);
		}
	},


	reset : function(){
		this.setValue(this.originalValue);
		this.clearInvalid();
	},


	initEvents : function(){
		this.mon(this.el, Ext.EventManager.useKeydown ? 'keydown' : 'keypress', this.fireKey,  this);
		this.mon(this.el, 'focus', this.onFocus, this);



		this.mon(this.el, 'blur', this.onBlur, this, this.inEditor ? {buffer:10} : null);
	},


	preFocus: Ext.emptyFn,


	onFocus : function(){
		this.preFocus();
		if(this.focusClass){
			this.el.addClass(this.focusClass);
		}
		if(!this.hasFocus){
			this.hasFocus = true;

			this.startValue = this.getValue();
			this.fireEvent('focus', this);
		}
	},


	beforeBlur : Ext.emptyFn,


	onBlur : function(){
		this.beforeBlur();
		if(this.focusClass){
			this.el.removeClass(this.focusClass);
		}
		this.hasFocus = false;
		if(this.validationEvent !== false && (this.validateOnBlur || this.validationEvent == 'blur')){
			this.validate();
		}
		var v = this.getValue();
		if(String(v) !== String(this.startValue)){
			this.fireEvent('change', this, v, this.startValue);
		}
		this.fireEvent('blur', this);
		this.postBlur();
	},


	postBlur : Ext.emptyFn,


	isValid : function(preventMark){
		if(this.disabled){
			return true;
		}
		var restore = this.preventMark;
		this.preventMark = preventMark === true;
		var v = this.validateValue(this.processValue(this.getRawValue()));
		this.preventMark = restore;
		return v;
	},


	validate : function(){
		if(this.disabled || this.validateValue(this.processValue(this.getRawValue()))){
			this.clearInvalid();
			return true;
		}
		return false;
	},


	processValue : function(value){
		return value;
	},


	validateValue : function(value){
		return true;
	},


	getActiveError : function(){
		return this.activeError || '';
	},


	markInvalid : function(msg){
		if(!this.rendered || this.preventMark){
			return;
		}
		msg = msg || this.invalidText;

		var mt = this.getMessageHandler();
		if(mt){
			mt.mark(this, msg);
		}else if(this.msgTarget){
			this.el.addClass(this.invalidClass);
			var t = Ext.getDom(this.msgTarget);
			if(t){
				t.innerHTML = msg;
				t.style.display = this.msgDisplay;
			}
		}
		this.activeError = msg;
		this.fireEvent('invalid', this, msg);
	},


	clearInvalid : function(){
		if(!this.rendered || this.preventMark){
			return;
		}
		this.el.removeClass(this.invalidClass);
		var mt = this.getMessageHandler();
		if(mt){
			mt.clear(this);
		}else if(this.msgTarget){
			this.el.removeClass(this.invalidClass);
			var t = Ext.getDom(this.msgTarget);
			if(t){
				t.innerHTML = '';
				t.style.display = 'none';
			}
		}
		delete this.activeError;
		this.fireEvent('valid', this);
	},


	getMessageHandler : function(){
		return Ext.form.MessageTargets[this.msgTarget];
	},


	getErrorCt : function(){
		return this.el.findParent('.x-form-element', 5, true) ||
			this.el.findParent('.x-form-field-wrap', 5, true);
	},


	alignErrorIcon : function(){
		this.errorIcon.alignTo(this.el, 'tl-tr', [2, 0]);
	},


	getRawValue : function(){
		var v = this.rendered ? this.el.getValue() : Ext.value(this.value, '');
		if(v === this.emptyText){
			v = '';
		}
		return v;
	},


	getValue : function(){
		if(!this.rendered) {
			return this.value;
		}
		var v = this.el.getValue();
		if(v === this.emptyText || v === undefined){
			v = '';
		}
		return v;
	},


	setRawValue : function(v){
		return this.rendered ? (this.el.dom.value = (Ext.isEmpty(v) ? '' : v)) : '';
	},


	setValue : function(v){
		this.value = v;
		if(this.rendered){
			this.el.dom.value = (Ext.isEmpty(v) ? '' : v);
			this.validate();
		}
		return this;
	},


	append : function(v){
		this.setValue([this.getValue(), v].join(''));
	}





});


Ext.form.MessageTargets = {
	'qtip' : {
		mark: function(field, msg){
			field.el.addClass(field.invalidClass);
			field.el.dom.qtip = msg;
			field.el.dom.qclass = 'x-form-invalid-tip';
			if(Ext.QuickTips){
				Ext.QuickTips.enable();
			}
		},
		clear: function(field){
			field.el.removeClass(field.invalidClass);
			field.el.dom.qtip = '';
		}
	},
	'title' : {
		mark: function(field, msg){
			field.el.addClass(field.invalidClass);
			field.el.dom.title = msg;
		},
		clear: function(field){
			field.el.dom.title = '';
		}
	},
	'under' : {
		mark: function(field, msg){
			field.el.addClass(field.invalidClass);
			if(!field.errorEl){
				var elp = field.getErrorCt();
				if(!elp){
					field.el.dom.title = msg;
					return;
				}
				field.errorEl = elp.createChild({cls:'x-form-invalid-msg'});
				field.errorEl.setWidth(elp.getWidth(true)-20);
			}
			field.errorEl.update(msg);
			Ext.form.Field.msgFx[field.msgFx].show(field.errorEl, field);
		},
		clear: function(field){
			field.el.removeClass(field.invalidClass);
			if(field.errorEl){
				Ext.form.Field.msgFx[field.msgFx].hide(field.errorEl, field);
			}else{
				field.el.dom.title = '';
			}
		}
	},
	'side' : {
		mark: function(field, msg){
			field.el.addClass(field.invalidClass);
			if(!field.errorIcon){
				var elp = field.getErrorCt();
				if(!elp){
					field.el.dom.title = msg;
					return;
				}
				field.errorIcon = elp.createChild({cls:'x-form-invalid-icon'});
			}
			field.alignErrorIcon();
			field.errorIcon.dom.qtip = msg;
			field.errorIcon.dom.qclass = 'x-form-invalid-tip';
			field.errorIcon.show();
			field.on('resize', field.alignErrorIcon, field);
		},
		clear: function(field){
			field.el.removeClass(field.invalidClass);
			if(field.errorIcon){
				field.errorIcon.dom.qtip = '';
				field.errorIcon.hide();
				field.un('resize', field.alignErrorIcon, field);
			}else{
				field.el.dom.title = '';
			}
		}
	}
};


Ext.form.Field.msgFx = {
	normal : {
		show: function(msgEl, f){
			msgEl.setDisplayed('block');
		},

		hide : function(msgEl, f){
			msgEl.setDisplayed(false).update('');
		}
	},

	slide : {
		show: function(msgEl, f){
			msgEl.slideIn('t', {stopFx:true});
		},

		hide : function(msgEl, f){
			msgEl.slideOut('t', {stopFx:true,useDisplay:true});
		}
	},

	slideRight : {
		show: function(msgEl, f){
			msgEl.fixDisplay();
			msgEl.alignTo(f.el, 'tl-tr');
			msgEl.slideIn('l', {stopFx:true});
		},

		hide : function(msgEl, f){
			msgEl.slideOut('l', {stopFx:true,useDisplay:true});
		}
	}
};
Ext.reg('field', Ext.form.Field);

Ext.form.TextField = Ext.extend(Ext.form.Field,  {



	grow : false,

	growMin : 30,

	growMax : 800,

	vtype : null,

	maskRe : null,

	disableKeyFilter : false,

	allowBlank : true,

	minLength : 0,

	maxLength : Number.MAX_VALUE,

	minLengthText : 'The minimum length for this field is {0}',

	maxLengthText : 'The maximum length for this field is {0}',

	selectOnFocus : false,

	blankText : 'This field is required',

	validator : null,

	regex : null,

	regexText : '',

	emptyText : null,

	emptyClass : 'x-form-empty-field',



	initComponent : function(){
		Ext.form.TextField.superclass.initComponent.call(this);
		this.addEvents(

			'autosize',


			'keydown',

			'keyup',

			'keypress'
		);
	},


	initEvents : function(){
		Ext.form.TextField.superclass.initEvents.call(this);
		if(this.validationEvent == 'keyup'){
			this.validationTask = new Ext.util.DelayedTask(this.validate, this);
			this.mon(this.el, 'keyup', this.filterValidation, this);
		}
		else if(this.validationEvent !== false && this.validationEvent != 'blur'){
			this.mon(this.el, this.validationEvent, this.validate, this, {buffer: this.validationDelay});
		}
		if(this.selectOnFocus || this.emptyText){
			this.mon(this.el, 'mousedown', this.onMouseDown, this);

			if(this.emptyText){
				this.applyEmptyText();
			}
		}
		if(this.maskRe || (this.vtype && this.disableKeyFilter !== true && (this.maskRe = Ext.form.VTypes[this.vtype+'Mask']))){
			this.mon(this.el, 'keypress', this.filterKeys, this);
		}
		if(this.grow){
			this.mon(this.el, 'keyup', this.onKeyUpBuffered, this, {buffer: 50});
			this.mon(this.el, 'click', this.autoSize, this);
		}
		if(this.enableKeyEvents){
			this.mon(this.el, {
				scope: this,
				keyup: this.onKeyUp,
				keydown: this.onKeyDown,
				keypress: this.onKeyPress
			});
		}
	},

	onMouseDown: function(e){
		if(!this.hasFocus){
			this.mon(this.el, 'mouseup', Ext.emptyFn, this, { single: true, preventDefault: true });
		}
	},

	processValue : function(value){
		if(this.stripCharsRe){
			var newValue = value.replace(this.stripCharsRe, '');
			if(newValue !== value){
				this.setRawValue(newValue);
				return newValue;
			}
		}
		return value;
	},

	filterValidation : function(e){
		if(!e.isNavKeyPress()){
			this.validationTask.delay(this.validationDelay);
		}
	},


	onDisable: function(){
		Ext.form.TextField.superclass.onDisable.call(this);
		if(Ext.isIE){
			this.el.dom.unselectable = 'on';
		}
	},


	onEnable: function(){
		Ext.form.TextField.superclass.onEnable.call(this);
		if(Ext.isIE){
			this.el.dom.unselectable = '';
		}
	},


	onKeyUpBuffered : function(e){
		if(this.doAutoSize(e)){
			this.autoSize();
		}
	},


	doAutoSize : function(e){
		return !e.isNavKeyPress();
	},


	onKeyUp : function(e){
		this.fireEvent('keyup', this, e);
	},


	onKeyDown : function(e){
		this.fireEvent('keydown', this, e);
	},


	onKeyPress : function(e){
		this.fireEvent('keypress', this, e);
	},


	reset : function(){
		Ext.form.TextField.superclass.reset.call(this);
		this.applyEmptyText();
	},

	applyEmptyText : function(){
		if(this.rendered && this.emptyText && this.getRawValue().length < 1 && !this.hasFocus){
			this.setRawValue(this.emptyText);
			this.el.addClass(this.emptyClass);
		}
	},


	preFocus : function(){
		var el = this.el;
		if(this.emptyText){
			if(el.dom.value == this.emptyText){
				this.setRawValue('');
			}
			el.removeClass(this.emptyClass);
		}
		if(this.selectOnFocus){
			el.dom.select();
		}
	},


	postBlur : function(){
		this.applyEmptyText();
	},


	filterKeys : function(e){
		if(e.ctrlKey){
			return;
		}
		var k = e.getKey();
		if(Ext.isGecko && (e.isNavKeyPress() || k == e.BACKSPACE || (k == e.DELETE && e.button == -1))){
			return;
		}
		var cc = String.fromCharCode(e.getCharCode());
		if(!Ext.isGecko && e.isSpecialKey() && !cc){
			return;
		}
		if(!this.maskRe.test(cc)){
			e.stopEvent();
		}
	},

	setValue : function(v){
		if(this.emptyText && this.el && !Ext.isEmpty(v)){
			this.el.removeClass(this.emptyClass);
		}
		Ext.form.TextField.superclass.setValue.apply(this, arguments);
		this.applyEmptyText();
		this.autoSize();
		return this;
	},


	validateValue : function(value){
		if(Ext.isFunction(this.validator)){
			var msg = this.validator(value);
			if(msg !== true){
				this.markInvalid(msg);
				return false;
			}
		}
		if(value.length < 1 || value === this.emptyText){
			if(this.allowBlank){
				this.clearInvalid();
				return true;
			}else{
				this.markInvalid(this.blankText);
				return false;
			}
		}
		if(value.length < this.minLength){
			this.markInvalid(String.format(this.minLengthText, this.minLength));
			return false;
		}
		if(value.length > this.maxLength){
			this.markInvalid(String.format(this.maxLengthText, this.maxLength));
			return false;
		}
		if(this.vtype){
			var vt = Ext.form.VTypes;
			if(!vt[this.vtype](value, this)){
				this.markInvalid(this.vtypeText || vt[this.vtype +'Text']);
				return false;
			}
		}
		if(this.regex && !this.regex.test(value)){
			this.markInvalid(this.regexText);
			return false;
		}
		return true;
	},


	selectText : function(start, end){
		var v = this.getRawValue();
		var doFocus = false;
		if(v.length > 0){
			start = start === undefined ? 0 : start;
			end = end === undefined ? v.length : end;
			var d = this.el.dom;
			if(d.setSelectionRange){
				d.setSelectionRange(start, end);
			}else if(d.createTextRange){
				var range = d.createTextRange();
				range.moveStart('character', start);
				range.moveEnd('character', end-v.length);
				range.select();
			}
			doFocus = Ext.isGecko || Ext.isOpera;
		}else{
			doFocus = true;
		}
		if(doFocus){
			this.focus();
		}
	},


	autoSize : function(){
		if(!this.grow || !this.rendered){
			return;
		}
		if(!this.metrics){
			this.metrics = Ext.util.TextMetrics.createInstance(this.el);
		}
		var el = this.el;
		var v = el.dom.value;
		var d = document.createElement('div');
		d.appendChild(document.createTextNode(v));
		v = d.innerHTML;
		Ext.removeNode(d);
		d = null;
		v += '&#160;';
		var w = Math.min(this.growMax, Math.max(this.metrics.getWidth(v) +  10, this.growMin));
		this.el.setWidth(w);
		this.fireEvent('autosize', this, w);
	},

	onDestroy: function(){
		if(this.validationTask){
			this.validationTask.cancel();
			this.validationTask = null;
		}
		Ext.form.TextField.superclass.onDestroy.call(this);
	}
});
Ext.reg('textfield', Ext.form.TextField);

Ext.form.TriggerField = Ext.extend(Ext.form.TextField,  {



	defaultAutoCreate : {tag: "input", type: "text", size: "16", autocomplete: "off"},

	hideTrigger:false,

	editable: true,

	readOnly: false,

	wrapFocusClass: 'x-trigger-wrap-focus',

	autoSize: Ext.emptyFn,

	monitorTab : true,

	deferHeight : true,

	mimicing : false,

	actionMode: 'wrap',

	removeMode: 'container',

	defaultTriggerWidth: 17,


	onResize : function(w, h){
		Ext.form.TriggerField.superclass.onResize.call(this, w, h);
		var tw = this.getTriggerWidth();
		if(Ext.isNumber(w)){
			this.el.setWidth(w - tw);
		}
		this.wrap.setWidth(this.el.getWidth() + tw);
	},

	getTriggerWidth: function(){
		var tw = this.trigger.getWidth();
		if(!this.hideTrigger && tw === 0){
			tw = this.defaultTriggerWidth;
		}
		return tw;
	},


	alignErrorIcon : function(){
		if(this.wrap){
			this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
		}
	},


	onRender : function(ct, position){
		this.doc = Ext.isIE ? Ext.getBody() : Ext.getDoc();
		Ext.form.TriggerField.superclass.onRender.call(this, ct, position);

		this.wrap = this.el.wrap({cls: 'x-form-field-wrap x-form-field-trigger-wrap'});
		this.trigger = this.wrap.createChild(this.triggerConfig ||
		{tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.triggerClass});
		this.initTrigger();
		if(!this.width){
			this.wrap.setWidth(this.el.getWidth()+this.trigger.getWidth());
		}
		this.resizeEl = this.positionEl = this.wrap;
		this.updateEditState();
	},

	updateEditState: function(){
		if(this.rendered){
			if (this.readOnly) {
				this.el.dom.readOnly = true;
				this.el.addClass('x-trigger-noedit');
				this.mun(this.el, 'click', this.onTriggerClick, this);
				this.trigger.setDisplayed(false);
			} else {
				if (!this.editable) {
					this.el.dom.readOnly = true;
					this.el.addClass('x-trigger-noedit');
					this.mon(this.el, 'click', this.onTriggerClick, this);
				} else {
					this.el.dom.readOnly = false;
					this.el.removeClass('x-trigger-noedit');
					this.mun(this.el, 'click', this.onTriggerClick, this);
				}
				this.trigger.setDisplayed(!this.hideTrigger);
			}
			this.onResize(this.width || this.wrap.getWidth());
		}
	},

	setHideTrigger: function(hideTrigger){
		if(hideTrigger != this.hideTrigger){
			this.hideTrigger = hideTrigger;
			this.updateEditState();
		}
	},


	setEditable: function(editable){
		if(editable != this.editable){
			this.editable = editable;
			this.updateEditState();
		}
	},


	setReadOnly: function(readOnly){
		if(readOnly != this.readOnly){
			this.readOnly = readOnly;
			this.updateEditState();
		}
	},

	afterRender : function(){
		Ext.form.TriggerField.superclass.afterRender.call(this);
	},


	initTrigger : function(){
		this.mon(this.trigger, 'click', this.onTriggerClick, this, {preventDefault:true});
		this.trigger.addClassOnOver('x-form-trigger-over');
		this.trigger.addClassOnClick('x-form-trigger-click');
	},


	onDestroy : function(){
		Ext.destroy(this.trigger, this.wrap);
		if (this.mimicing){
			this.doc.un('mousedown', this.mimicBlur, this);
		}
		delete this.doc;
		Ext.form.TriggerField.superclass.onDestroy.call(this);
	},


	onFocus : function(){
		Ext.form.TriggerField.superclass.onFocus.call(this);
		if(!this.mimicing){
			this.wrap.addClass(this.wrapFocusClass);
			this.mimicing = true;
			this.doc.on('mousedown', this.mimicBlur, this, {delay: 10});
			if(this.monitorTab){
				this.on('specialkey', this.checkTab, this);
			}
		}
	},


	checkTab : function(me, e){
		if(e.getKey() == e.TAB){
			this.triggerBlur();
		}
	},


	onBlur : Ext.emptyFn,


	mimicBlur : function(e){
		if(!this.isDestroyed && !this.wrap.contains(e.target) && this.validateBlur(e)){
			this.triggerBlur();
		}
	},


	triggerBlur : function(){
		this.mimicing = false;
		this.doc.un('mousedown', this.mimicBlur, this);
		if(this.monitorTab && this.el){
			this.un('specialkey', this.checkTab, this);
		}
		Ext.form.TriggerField.superclass.onBlur.call(this);
		if(this.wrap){
			this.wrap.removeClass(this.wrapFocusClass);
		}
	},

	beforeBlur : Ext.emptyFn,



	validateBlur : function(e){
		return true;
	},


	onTriggerClick : Ext.emptyFn




});


Ext.form.TwinTriggerField = Ext.extend(Ext.form.TriggerField, {




	initComponent : function(){
		Ext.form.TwinTriggerField.superclass.initComponent.call(this);

		this.triggerConfig = {
			tag:'span', cls:'x-form-twin-triggers', cn:[
				{tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.trigger1Class},
				{tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.trigger2Class}
			]};
	},

	getTrigger : function(index){
		return this.triggers[index];
	},

	initTrigger : function(){
		var ts = this.trigger.select('.x-form-trigger', true);
		var triggerField = this;
		ts.each(function(t, all, index){
			var triggerIndex = 'Trigger'+(index+1);
			t.hide = function(){
				var w = triggerField.wrap.getWidth();
				this.dom.style.display = 'none';
				triggerField.el.setWidth(w-triggerField.trigger.getWidth());
				this['hidden' + triggerIndex] = true;
			};
			t.show = function(){
				var w = triggerField.wrap.getWidth();
				this.dom.style.display = '';
				triggerField.el.setWidth(w-triggerField.trigger.getWidth());
				this['hidden' + triggerIndex] = false;
			};

			if(this['hide'+triggerIndex]){
				t.dom.style.display = 'none';
				this['hidden' + triggerIndex] = true;
			}
			this.mon(t, 'click', this['on'+triggerIndex+'Click'], this, {preventDefault:true});
			t.addClassOnOver('x-form-trigger-over');
			t.addClassOnClick('x-form-trigger-click');
		}, this);
		this.triggers = ts.elements;
	},

	getTriggerWidth: function(){
		var tw = 0;
		Ext.each(this.triggers, function(t, index){
			var triggerIndex = 'Trigger' + (index + 1),
				w = t.getWidth();
			if(w === 0 && !this['hidden' + triggerIndex]){
				tw += this.defaultTriggerWidth;
			}else{
				tw += w;
			}
		}, this);
		return tw;
	},


	onDestroy : function() {
		Ext.destroy(this.triggers);
		Ext.form.TwinTriggerField.superclass.onDestroy.call(this);
	},


	onTrigger1Click : Ext.emptyFn,

	onTrigger2Click : Ext.emptyFn
});
Ext.reg('trigger', Ext.form.TriggerField);

Ext.form.TextArea = Ext.extend(Ext.form.TextField,  {

	growMin : 60,

	growMax: 1000,
	growAppend : '&#160;\n&#160;',

	enterIsSpecial : false,


	preventScrollbars: false,



	onRender : function(ct, position){
		if(!this.el){
			this.defaultAutoCreate = {
				tag: "textarea",
				style:"width:100px;height:60px;",
				autocomplete: "off"
			};
		}
		Ext.form.TextArea.superclass.onRender.call(this, ct, position);
		if(this.grow){
			this.textSizeEl = Ext.DomHelper.append(document.body, {
				tag: "pre", cls: "x-form-grow-sizer"
			});
			if(this.preventScrollbars){
				this.el.setStyle("overflow", "hidden");
			}
			this.el.setHeight(this.growMin);
		}
	},

	onDestroy : function(){
		Ext.removeNode(this.textSizeEl);
		Ext.form.TextArea.superclass.onDestroy.call(this);
	},

	fireKey : function(e){
		if(e.isSpecialKey() && (this.enterIsSpecial || (e.getKey() != e.ENTER || e.hasModifier()))){
			this.fireEvent("specialkey", this, e);
		}
	},


	doAutoSize : function(e){
		return !e.isNavKeyPress() || e.getKey() == e.ENTER;
	},


	autoSize: function(){
		if(!this.grow || !this.textSizeEl){
			return;
		}
		var el = this.el,
			v = Ext.util.Format.htmlEncode(el.dom.value),
			ts = this.textSizeEl,
			h;

		Ext.fly(ts).setWidth(this.el.getWidth());
		if(v.length < 1){
			v = "&#160;&#160;";
		}else{
			v += this.growAppend;
			if(Ext.isIE){
				v = v.replace(/\n/g, '&#160;<br />');
			}
		}
		ts.innerHTML = v;
		h = Math.min(this.growMax, Math.max(ts.offsetHeight, this.growMin));
		if(h != this.lastHeight){
			this.lastHeight = h;
			this.el.setHeight(h);
			this.fireEvent("autosize", this, h);
		}
	}
});
Ext.reg('textarea', Ext.form.TextArea);
Ext.form.NumberField = Ext.extend(Ext.form.TextField,  {



	fieldClass: "x-form-field x-form-num-field",

	allowDecimals : true,

	decimalSeparator : ".",

	decimalPrecision : 2,

	allowNegative : true,

	minValue : Number.NEGATIVE_INFINITY,

	maxValue : Number.MAX_VALUE,

	minText : "The minimum value for this field is {0}",

	maxText : "The maximum value for this field is {0}",

	nanText : "{0} is not a valid number",

	baseChars : "0123456789",


	initEvents : function(){
		var allowed = this.baseChars + '';
		if (this.allowDecimals) {
			allowed += this.decimalSeparator;
		}
		if (this.allowNegative) {
			allowed += '-';
		}
		this.maskRe = new RegExp('[' + Ext.escapeRe(allowed) + ']');
		Ext.form.NumberField.superclass.initEvents.call(this);
	},


	validateValue : function(value){
		if(!Ext.form.NumberField.superclass.validateValue.call(this, value)){
			return false;
		}
		if(value.length < 1){
			return true;
		}
		value = String(value).replace(this.decimalSeparator, ".");
		if(isNaN(value)){
			this.markInvalid(String.format(this.nanText, value));
			return false;
		}
		var num = this.parseValue(value);
		if(num < this.minValue){
			this.markInvalid(String.format(this.minText, this.minValue));
			return false;
		}
		if(num > this.maxValue){
			this.markInvalid(String.format(this.maxText, this.maxValue));
			return false;
		}
		return true;
	},

	getValue : function(){
		return this.fixPrecision(this.parseValue(Ext.form.NumberField.superclass.getValue.call(this)));
	},

	setValue : function(v){
		v = Ext.isNumber(v) ? v : parseFloat(String(v).replace(this.decimalSeparator, "."));
		v = isNaN(v) ? '' : String(v).replace(".", this.decimalSeparator);
		return Ext.form.NumberField.superclass.setValue.call(this, v);
	},


	setMinValue : function(value){
		this.minValue = Ext.num(value, Number.NEGATIVE_INFINITY);
	},


	setMaxValue : function(value){
		this.maxValue = Ext.num(value, Number.MAX_VALUE);
	},


	parseValue : function(value){
		value = parseFloat(String(value).replace(this.decimalSeparator, "."));
		return isNaN(value) ? '' : value;
	},


	fixPrecision : function(value){
		var nan = isNaN(value);
		if(!this.allowDecimals || this.decimalPrecision == -1 || nan || !value){
			return nan ? '' : value;
		}
		return parseFloat(parseFloat(value).toFixed(this.decimalPrecision));
	},

	beforeBlur : function(){
		var v = this.parseValue(this.getRawValue());
		if(!Ext.isEmpty(v)){
			this.setValue(this.fixPrecision(v));
		}
	}
});
Ext.reg('numberfield', Ext.form.NumberField);
Ext.form.DateField = Ext.extend(Ext.form.TriggerField,  {

	format : "m/d/Y",

	altFormats : "m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d",

	disabledDaysText : "Disabled",

	disabledDatesText : "Disabled",

	minText : "The date in this field must be equal to or after {0}",

	maxText : "The date in this field must be equal to or before {0}",

	invalidText : "{0} is not a valid date - it must be in the format {1}",

	triggerClass : 'x-form-date-trigger',

	showToday : true,







	defaultAutoCreate : {tag: "input", type: "text", size: "10", autocomplete: "off"},

	initComponent : function(){
		Ext.form.DateField.superclass.initComponent.call(this);

		this.addEvents(

			'select'
		);

		if(Ext.isString(this.minValue)){
			this.minValue = this.parseDate(this.minValue);
		}
		if(Ext.isString(this.maxValue)){
			this.maxValue = this.parseDate(this.maxValue);
		}
		this.disabledDatesRE = null;
		this.initDisabledDays();
	},

	initEvents: function() {
		Ext.form.DateField.superclass.initEvents.call(this);
		this.keyNav = new Ext.KeyNav(this.el, {
			"down": function(e) {
				this.onTriggerClick();
			},
			scope: this,
			forceKeyDown: true
		});
	},



	initDisabledDays : function(){
		if(this.disabledDates){
			var dd = this.disabledDates,
				len = dd.length - 1,
				re = "(?:";

			Ext.each(dd, function(d, i){
				re += Ext.isDate(d) ? '^' + Ext.escapeRe(d.dateFormat(this.format)) + '$' : dd[i];
				if(i != len){
					re += '|';
				}
			}, this);
			this.disabledDatesRE = new RegExp(re + ')');
		}
	},


	setDisabledDates : function(dd){
		this.disabledDates = dd;
		this.initDisabledDays();
		if(this.menu){
			this.menu.picker.setDisabledDates(this.disabledDatesRE);
		}
	},


	setDisabledDays : function(dd){
		this.disabledDays = dd;
		if(this.menu){
			this.menu.picker.setDisabledDays(dd);
		}
	},


	setMinValue : function(dt){
		this.minValue = (Ext.isString(dt) ? this.parseDate(dt) : dt);
		if(this.menu){
			this.menu.picker.setMinDate(this.minValue);
		}
	},


	setMaxValue : function(dt){
		this.maxValue = (Ext.isString(dt) ? this.parseDate(dt) : dt);
		if(this.menu){
			this.menu.picker.setMaxDate(this.maxValue);
		}
	},


	validateValue : function(value){
		value = this.formatDate(value);
		if(!Ext.form.DateField.superclass.validateValue.call(this, value)){
			return false;
		}
		if(value.length < 1){
			return true;
		}
		var svalue = value;
		value = this.parseDate(value);
		if(!value){
			this.markInvalid(String.format(this.invalidText, svalue, this.format));
			return false;
		}
		var time = value.getTime();
		if(this.minValue && time < this.minValue.getTime()){
			this.markInvalid(String.format(this.minText, this.formatDate(this.minValue)));
			return false;
		}
		if(this.maxValue && time > this.maxValue.getTime()){
			this.markInvalid(String.format(this.maxText, this.formatDate(this.maxValue)));
			return false;
		}
		if(this.disabledDays){
			var day = value.getDay();
			for(var i = 0; i < this.disabledDays.length; i++) {
				if(day === this.disabledDays[i]){
					this.markInvalid(this.disabledDaysText);
					return false;
				}
			}
		}
		var fvalue = this.formatDate(value);
		if(this.disabledDatesRE && this.disabledDatesRE.test(fvalue)){
			this.markInvalid(String.format(this.disabledDatesText, fvalue));
			return false;
		}
		return true;
	},



	validateBlur : function(){
		return !this.menu || !this.menu.isVisible();
	},


	getValue : function(){
		return this.parseDate(Ext.form.DateField.superclass.getValue.call(this)) || "";
	},


	setValue : function(date){
		return Ext.form.DateField.superclass.setValue.call(this, this.formatDate(this.parseDate(date)));
	},


	parseDate : function(value){
		if(!value || Ext.isDate(value)){
			return value;
		}
		var v = Date.parseDate(value, this.format);
		if(!v && this.altFormats){
			if(!this.altFormatsArray){
				this.altFormatsArray = this.altFormats.split("|");
			}
			for(var i = 0, len = this.altFormatsArray.length; i < len && !v; i++){
				v = Date.parseDate(value, this.altFormatsArray[i]);
			}
		}
		return v;
	},


	onDestroy : function(){
		Ext.destroy(this.menu, this.keyNav);
		Ext.form.DateField.superclass.onDestroy.call(this);
	},


	formatDate : function(date){
		return Ext.isDate(date) ? date.dateFormat(this.format) : date;
	},




	onTriggerClick : function(){
		if(this.disabled){
			return;
		}
		if(this.menu == null){
			this.menu = new Ext.menu.DateMenu({
				hideOnClick: false,
				focusOnSelect: false
			});
		}
		this.onFocus();
		Ext.apply(this.menu.picker,  {
			minDate : this.minValue,
			maxDate : this.maxValue,
			disabledDatesRE : this.disabledDatesRE,
			disabledDatesText : this.disabledDatesText,
			disabledDays : this.disabledDays,
			disabledDaysText : this.disabledDaysText,
			format : this.format,
			showToday : this.showToday,
			minText : String.format(this.minText, this.formatDate(this.minValue)),
			maxText : String.format(this.maxText, this.formatDate(this.maxValue))
		});
		this.menu.picker.setValue(this.getValue() || new Date());
		this.menu.show(this.el, "tl-bl?");
		this.menuEvents('on');
	},


	menuEvents: function(method){
		this.menu[method]('select', this.onSelect, this);
		this.menu[method]('hide', this.onMenuHide, this);
		this.menu[method]('show', this.onFocus, this);
	},

	onSelect: function(m, d){
		this.setValue(d);
		this.fireEvent('select', this, d);
		this.menu.hide();
	},

	onMenuHide: function(){
		this.focus(false, 60);
		this.menuEvents('un');
	},


	beforeBlur : function(){
		var v = this.parseDate(this.getRawValue());
		if(v){
			this.setValue(v);
		}
	}





});
Ext.reg('datefield', Ext.form.DateField);
Ext.form.DisplayField = Ext.extend(Ext.form.Field,  {
	validationEvent : false,
	validateOnBlur : false,
	defaultAutoCreate : {tag: "div"},

	fieldClass : "x-form-display-field",

	htmlEncode: false,


	initEvents : Ext.emptyFn,

	isValid : function(){
		return true;
	},

	validate : function(){
		return true;
	},

	getRawValue : function(){
		var v = this.rendered ? this.el.dom.innerHTML : Ext.value(this.value, '');
		if(v === this.emptyText){
			v = '';
		}
		if(this.htmlEncode){
			v = Ext.util.Format.htmlDecode(v);
		}
		return v;
	},

	getValue : function(){
		return this.getRawValue();
	},

	getName: function() {
		return this.name;
	},

	setRawValue : function(v){
		if(this.htmlEncode){
			v = Ext.util.Format.htmlEncode(v);
		}
		return this.rendered ? (this.el.dom.innerHTML = (Ext.isEmpty(v) ? '' : v)) : (this.value = v);
	},

	setValue : function(v){
		this.setRawValue(v);
		return this;
	}






});

Ext.reg('displayfield', Ext.form.DisplayField);

Ext.form.ComboBox = Ext.extend(Ext.form.TriggerField, {







	defaultAutoCreate : {tag: "input", type: "text", size: "24", autocomplete: "off"},







	listClass : '',

	selectedClass : 'x-combo-selected',

	listEmptyText: '',

	triggerClass : 'x-form-arrow-trigger',

	shadow : 'sides',

	listAlign : 'tl-bl?',

	maxHeight : 300,

	minHeight : 90,

	triggerAction : 'query',

	minChars : 4,

	typeAhead : false,

	queryDelay : 500,

	pageSize : 0,

	selectOnFocus : false,

	queryParam : 'query',

	loadingText : 'Loading...',

	resizable : false,

	handleHeight : 8,

	allQuery: '',

	mode: 'remote',

	minListWidth : 70,

	forceSelection : false,

	typeAheadDelay : 250,



	lazyInit : true,


	clearFilterOnReset : true,


	submitValue: undefined,




	initComponent : function(){
		Ext.form.ComboBox.superclass.initComponent.call(this);
		this.addEvents(

			'expand',

			'collapse',

			'beforeselect',

			'select',

			'beforequery'
		);
		if(this.transform){
			var s = Ext.getDom(this.transform);
			if(!this.hiddenName){
				this.hiddenName = s.name;
			}
			if(!this.store){
				this.mode = 'local';
				var d = [], opts = s.options;
				for(var i = 0, len = opts.length;i < len; i++){
					var o = opts[i],
						value = (o.hasAttribute ? o.hasAttribute('value') : o.getAttributeNode('value').specified) ? o.value : o.text;
					if(o.selected && Ext.isEmpty(this.value, true)) {
						this.value = value;
					}
					d.push([value, o.text]);
				}
				this.store = new Ext.data.ArrayStore({
					'id': 0,
					fields: ['value', 'text'],
					data : d,
					autoDestroy: true
				});
				this.valueField = 'value';
				this.displayField = 'text';
			}
			s.name = Ext.id();
			if(!this.lazyRender){
				this.target = true;
				this.el = Ext.DomHelper.insertBefore(s, this.autoCreate || this.defaultAutoCreate);
				this.render(this.el.parentNode, s);
			}
			Ext.removeNode(s);
		}

		else if(this.store){
			this.store = Ext.StoreMgr.lookup(this.store);
			if(this.store.autoCreated){
				this.displayField = this.valueField = 'field1';
				if(!this.store.expandData){
					this.displayField = 'field2';
				}
				this.mode = 'local';
			}
		}

		this.selectedIndex = -1;
		if(this.mode == 'local'){
			if(!Ext.isDefined(this.initialConfig.queryDelay)){
				this.queryDelay = 10;
			}
			if(!Ext.isDefined(this.initialConfig.minChars)){
				this.minChars = 0;
			}
		}
	},


	onRender : function(ct, position){
		if(this.hiddenName && !Ext.isDefined(this.submitValue)){
			this.submitValue = false;
		}
		Ext.form.ComboBox.superclass.onRender.call(this, ct, position);
		if(this.hiddenName){
			this.hiddenField = this.el.insertSibling({tag:'input', type:'hidden', name: this.hiddenName,
				id: (this.hiddenId||this.hiddenName)}, 'before', true);

		}
		if(Ext.isGecko){
			this.el.dom.setAttribute('autocomplete', 'off');
		}

		if(!this.lazyInit){
			this.initList();
		}else{
			this.on('focus', this.initList, this, {single: true});
		}
	},


	initValue : function(){
		Ext.form.ComboBox.superclass.initValue.call(this);
		if(this.hiddenField){
			this.hiddenField.value =
				Ext.isDefined(this.hiddenValue) ? this.hiddenValue :
					Ext.isDefined(this.value) ? this.value : '';
		}
	},


	initList : function(){
		if(!this.list){
			var cls = 'x-combo-list';

			this.list = new Ext.Layer({
				parentEl: this.getListParent(),
				shadow: this.shadow,
				cls: [cls, this.listClass].join(' '),
				constrain:false,
				zindex: 12000
			});

			var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
			this.list.setSize(lw, 0);
			this.list.swallowEvent('mousewheel');
			this.assetHeight = 0;
			if(this.syncFont !== false){
				this.list.setStyle('font-size', this.el.getStyle('font-size'));
			}
			if(this.title){
				this.header = this.list.createChild({cls:cls+'-hd', html: this.title});
				this.assetHeight += this.header.getHeight();
			}

			this.innerList = this.list.createChild({cls:cls+'-inner'});
			this.mon(this.innerList, 'mouseover', this.onViewOver, this);
			this.mon(this.innerList, 'mousemove', this.onViewMove, this);
			this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

			if(this.pageSize){
				this.footer = this.list.createChild({cls:cls+'-ft'});
				this.pageTb = new Ext.PagingToolbar({
					store: this.store,
					pageSize: this.pageSize,
					renderTo:this.footer
				});
				this.assetHeight += this.footer.getHeight();
			}

			if(!this.tpl){

				this.tpl = '<tpl for="."><div class="'+cls+'-item">{' + this.displayField + '}</div></tpl>';

			}


			this.view = new Ext.DataView({
				applyTo: this.innerList,
				tpl: this.tpl,
				singleSelect: true,
				selectedClass: this.selectedClass,
				itemSelector: this.itemSelector || '.' + cls + '-item',
				emptyText: this.listEmptyText
			});

			this.mon(this.view, 'click', this.onViewClick, this);

			this.bindStore(this.store, true);

			if(this.resizable){
				this.resizer = new Ext.Resizable(this.list,  {
					pinned:true, handles:'se'
				});
				this.mon(this.resizer, 'resize', function(r, w, h){
					this.maxHeight = h-this.handleHeight-this.list.getFrameWidth('tb')-this.assetHeight;
					this.listWidth = w;
					this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
					this.restrictHeight();
				}, this);

				this[this.pageSize?'footer':'innerList'].setStyle('margin-bottom', this.handleHeight+'px');
			}
		}
	},


	getListParent : function() {
		return document.body;
	},


	getStore : function(){
		return this.store;
	},


	bindStore : function(store, initial){
		if(this.store && !initial){
			if(this.store !== store && this.store.autoDestroy){
				this.store.destroy();
			}else{
				this.store.un('beforeload', this.onBeforeLoad, this);
				this.store.un('load', this.onLoad, this);
				this.store.un('exception', this.collapse, this);
			}
			if(!store){
				this.store = null;
				if(this.view){
					this.view.bindStore(null);
				}
				if(this.pageTb){
					this.pageTb.bindStore(null);
				}
			}
		}
		if(store){
			if(!initial) {
				this.lastQuery = null;
				if(this.pageTb) {
					this.pageTb.bindStore(store);
				}
			}

			this.store = Ext.StoreMgr.lookup(store);
			this.store.on({
				scope: this,
				beforeload: this.onBeforeLoad,
				load: this.onLoad,
				exception: this.collapse
			});

			if(this.view){
				this.view.bindStore(store);
			}
		}
	},

	reset : function(){
		Ext.form.ComboBox.superclass.reset.call(this);
		if(this.clearFilterOnReset && this.mode == 'local'){
			this.store.clearFilter();
		}
	},


	initEvents : function(){
		Ext.form.ComboBox.superclass.initEvents.call(this);

		this.keyNav = new Ext.KeyNav(this.el, {
			"up" : function(e){
				this.inKeyMode = true;
				this.selectPrev();
			},

			"down" : function(e){
				if(!this.isExpanded()){
					this.onTriggerClick();
				}else{
					this.inKeyMode = true;
					this.selectNext();
				}
			},

			"enter" : function(e){
				this.onViewClick();
			},

			"esc" : function(e){
				this.collapse();
			},

			"tab" : function(e){
				this.onViewClick(false);
				return true;
			},

			scope : this,

			doRelay : function(e, h, hname){
				if(hname == 'down' || this.scope.isExpanded()){

					var relay = Ext.KeyNav.prototype.doRelay.apply(this, arguments);
					if(!Ext.isIE && Ext.EventManager.useKeydown){

						this.scope.fireKey(e);
					}
					return relay;
				}
				return true;
			},

			forceKeyDown : true,
			defaultEventAction: 'stopEvent'
		});
		this.queryDelay = Math.max(this.queryDelay || 10,
			this.mode == 'local' ? 10 : 250);
		this.dqTask = new Ext.util.DelayedTask(this.initQuery, this);
		if(this.typeAhead){
			this.taTask = new Ext.util.DelayedTask(this.onTypeAhead, this);
		}
		if(!this.enableKeyEvents){
			this.mon(this.el, 'keyup', this.onKeyUp, this);
		}
	},


	onDestroy : function(){
		if (this.dqTask){
			this.dqTask.cancel();
			this.dqTask = null;
		}
		this.bindStore(null);
		Ext.destroy(
			this.resizer,
			this.view,
			this.pageTb,
			this.list
		);
		Ext.destroyMembers(this, 'hiddenField');
		Ext.form.ComboBox.superclass.onDestroy.call(this);
	},


	fireKey : function(e){
		if (!this.isExpanded()) {
			Ext.form.ComboBox.superclass.fireKey.call(this, e);
		}
	},


	onResize : function(w, h){
		Ext.form.ComboBox.superclass.onResize.apply(this, arguments);
		if(this.isVisible() && this.list){
			this.doResize(w);
		}else{
			this.bufferSize = w;
		}
	},

	doResize: function(w){
		if(!Ext.isDefined(this.listWidth)){
			var lw = Math.max(w, this.minListWidth);
			this.list.setWidth(lw);
			this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
		}
	},


	onEnable : function(){
		Ext.form.ComboBox.superclass.onEnable.apply(this, arguments);
		if(this.hiddenField){
			this.hiddenField.disabled = false;
		}
	},


	onDisable : function(){
		Ext.form.ComboBox.superclass.onDisable.apply(this, arguments);
		if(this.hiddenField){
			this.hiddenField.disabled = true;
		}
	},


	onBeforeLoad : function(){
		if(!this.hasFocus){
			return;
		}
		this.innerList.update(this.loadingText ?
			'<div class="loading-indicator">'+this.loadingText+'</div>' : '');
		this.restrictHeight();
		this.selectedIndex = -1;
	},


	onLoad : function(){
		if(!this.hasFocus){
			return;
		}
		if(this.store.getCount() > 0 || this.listEmptyText){
			this.expand();
			this.restrictHeight();
			if(this.lastQuery == this.allQuery){
				if(this.editable){
					this.el.dom.select();
				}
				if(!this.selectByValue(this.value, true)){
					this.select(0, true);
				}
			}else{
				this.selectNext();
				if(this.typeAhead && this.lastKey != Ext.EventObject.BACKSPACE && this.lastKey != Ext.EventObject.DELETE){
					this.taTask.delay(this.typeAheadDelay);
				}
			}
		}else{
			this.onEmptyResults();
		}

	},


	onTypeAhead : function(){
		if(this.store.getCount() > 0){
			var r = this.store.getAt(0);
			var newValue = r.data[this.displayField];
			var len = newValue.length;
			var selStart = this.getRawValue().length;
			if(selStart != len){
				this.setRawValue(newValue);
				this.selectText(selStart, newValue.length);
			}
		}
	},


	onSelect : function(record, index){
		if(this.fireEvent('beforeselect', this, record, index) !== false){
			this.setValue(record.data[this.valueField || this.displayField]);
			this.collapse();
			this.fireEvent('select', this, record, index);
		}
	},


	getName: function(){
		var hf = this.hiddenField;
		return hf && hf.name ? hf.name : this.hiddenName || Ext.form.ComboBox.superclass.getName.call(this);
	},


	getValue : function(){
		if(this.valueField){
			return Ext.isDefined(this.value) ? this.value : '';
		}else{
			return Ext.form.ComboBox.superclass.getValue.call(this);
		}
	},


	clearValue : function(){
		if(this.hiddenField){
			this.hiddenField.value = '';
		}
		this.setRawValue('');
		this.lastSelectionText = '';
		this.applyEmptyText();
		this.value = '';
	},


	setValue : function(v){
		var text = v;
		if(this.valueField){
			var r = this.findRecord(this.valueField, v);
			if(r){
				text = r.data[this.displayField];
			}else if(Ext.isDefined(this.valueNotFoundText)){
				text = this.valueNotFoundText;
			}
		}
		this.lastSelectionText = text;
		if(this.hiddenField){
			this.hiddenField.value = v;
		}
		Ext.form.ComboBox.superclass.setValue.call(this, text);
		this.value = v;
		return this;
	},


	findRecord : function(prop, value){
		var record;
		if(this.store.getCount() > 0){
			this.store.each(function(r){
				if(r.data[prop] == value){
					record = r;
					return false;
				}
			});
		}
		return record;
	},


	onViewMove : function(e, t){
		this.inKeyMode = false;
	},


	onViewOver : function(e, t){
		if(this.inKeyMode){
			return;
		}
		var item = this.view.findItemFromChild(t);
		if(item){
			var index = this.view.indexOf(item);
			this.select(index, false);
		}
	},


	onViewClick : function(doFocus){
		var index = this.view.getSelectedIndexes()[0],
			s = this.store,
			r = s.getAt(index);
		if(r){
			this.onSelect(r, index);
		}else if(s.getCount() === 0){
			this.onEmptyResults();
		}
		if(doFocus !== false){
			this.el.focus();
		}
	},


	restrictHeight : function(){
		this.innerList.dom.style.height = '';
		var inner = this.innerList.dom,
			pad = this.list.getFrameWidth('tb') + (this.resizable ? this.handleHeight : 0) + this.assetHeight,
			h = Math.max(inner.clientHeight, inner.offsetHeight, inner.scrollHeight),
			ha = this.getPosition()[1]-Ext.getBody().getScroll().top,
			hb = Ext.lib.Dom.getViewHeight()-ha-this.getSize().height,
			space = Math.max(ha, hb, this.minHeight || 0)-this.list.shadowOffset-pad-5;

		h = Math.min(h, space, this.maxHeight);

		this.innerList.setHeight(h);
		this.list.beginUpdate();
		this.list.setHeight(h+pad);
		this.list.alignTo(this.wrap, this.listAlign);
		this.list.endUpdate();
	},


	onEmptyResults : function(){
		this.collapse();
	},


	isExpanded : function(){
		return this.list && this.list.isVisible();
	},


	selectByValue : function(v, scrollIntoView){
		if(!Ext.isEmpty(v, true)){
			var r = this.findRecord(this.valueField || this.displayField, v);
			if(r){
				this.select(this.store.indexOf(r), scrollIntoView);
				return true;
			}
		}
		return false;
	},


	select : function(index, scrollIntoView){
		this.selectedIndex = index;
		this.view.select(index);
		if(scrollIntoView !== false){
			var el = this.view.getNode(index);
			if(el){
				this.innerList.scrollChildIntoView(el, false);
			}
		}
	},


	selectNext : function(){
		var ct = this.store.getCount();
		if(ct > 0){
			if(this.selectedIndex == -1){
				this.select(0);
			}else if(this.selectedIndex < ct-1){
				this.select(this.selectedIndex+1);
			}
		}
	},


	selectPrev : function(){
		var ct = this.store.getCount();
		if(ct > 0){
			if(this.selectedIndex == -1){
				this.select(0);
			}else if(this.selectedIndex !== 0){
				this.select(this.selectedIndex-1);
			}
		}
	},


	onKeyUp : function(e){
		var k = e.getKey();
		if(this.editable !== false && this.readOnly !== true && (k == e.BACKSPACE || !e.isSpecialKey())){
			this.lastKey = k;
			this.dqTask.delay(this.queryDelay);
		}
		Ext.form.ComboBox.superclass.onKeyUp.call(this, e);
	},


	validateBlur : function(){
		return !this.list || !this.list.isVisible();
	},


	initQuery : function(){
		this.doQuery(this.getRawValue());
	},


	beforeBlur : function(){
		var val = this.getRawValue(),
			rec = this.findRecord(this.displayField, val);
		if(!rec && this.forceSelection){
			if(val.length > 0 && val != this.emptyText){
				this.el.dom.value = Ext.isEmpty(this.lastSelectionText) ? '' : this.lastSelectionText;
				this.applyEmptyText();
			}else{
				this.clearValue();
			}
		}else{
			if(rec){
				val = rec.get(this.valueField || this.displayField);
			}
			this.setValue(val);
		}
	},


	doQuery : function(q, forceAll){
		q = Ext.isEmpty(q) ? '' : q;
		var qe = {
			query: q,
			forceAll: forceAll,
			combo: this,
			cancel:false
		};
		if(this.fireEvent('beforequery', qe)===false || qe.cancel){
			return false;
		}
		q = qe.query;
		forceAll = qe.forceAll;
		if(forceAll === true || (q.length >= this.minChars)){
			if(this.lastQuery !== q){
				this.lastQuery = q;
				if(this.mode == 'local'){
					this.selectedIndex = -1;
					if(forceAll){
						this.store.clearFilter();
					}else{
						this.store.filter(this.displayField, q);
					}
					this.onLoad();
				}else{
					this.store.baseParams[this.queryParam] = q;
					this.store.load({
						params: this.getParams(q)
					});
					this.expand();
				}
			}else{
				this.selectedIndex = -1;
				this.onLoad();
			}
		}
	},


	getParams : function(q){
		var p = {};

		if(this.pageSize){
			p.start = 0;
			p.limit = this.pageSize;
		}
		return p;
	},


	collapse : function(){
		if(!this.isExpanded()){
			return;
		}
		this.list.hide();
		Ext.getDoc().un('mousewheel', this.collapseIf, this);
		Ext.getDoc().un('mousedown', this.collapseIf, this);
		this.fireEvent('collapse', this);
	},


	collapseIf : function(e){
		if(!e.within(this.wrap) && !e.within(this.list)){
			this.collapse();
		}
	},


	expand : function(){
		if(this.isExpanded() || !this.hasFocus){
			return;
		}
		if(this.bufferSize){
			this.doResize(this.bufferSize);
			delete this.bufferSize;
		}
		this.list.alignTo(this.wrap, this.listAlign);
		this.list.show();
		if(Ext.isGecko2){
			this.innerList.setOverflow('auto');
		}
		this.mon(Ext.getDoc(), {
			scope: this,
			mousewheel: this.collapseIf,
			mousedown: this.collapseIf
		});
		this.fireEvent('expand', this);
	},




	onTriggerClick : function(){
		if(this.readOnly || this.disabled){
			return;
		}
		if(this.isExpanded()){
			this.collapse();
			this.el.focus();
		}else {
			this.onFocus({});
			if(this.triggerAction == 'all') {
				this.doQuery(this.allQuery, true);
			} else {
				this.doQuery(this.getRawValue());
			}
			this.el.focus();
		}
	}






});
Ext.reg('combo', Ext.form.ComboBox);

Ext.form.Checkbox = Ext.extend(Ext.form.Field,  {

	focusClass : undefined,

	fieldClass : 'x-form-field',

	checked : false,

	defaultAutoCreate : { tag: 'input', type: 'checkbox', autocomplete: 'off'},






	actionMode : 'wrap',


	initComponent : function(){
		Ext.form.Checkbox.superclass.initComponent.call(this);
		this.addEvents(

			'check'
		);
	},


	onResize : function(){
		Ext.form.Checkbox.superclass.onResize.apply(this, arguments);
		if(!this.boxLabel && !this.fieldLabel){
			this.el.alignTo(this.wrap, 'c-c');
		}
	},


	initEvents : function(){
		Ext.form.Checkbox.superclass.initEvents.call(this);
		this.mon(this.el, {
			scope: this,
			click: this.onClick,
			change: this.onClick
		});
	},


	markInvalid : Ext.emptyFn,

	clearInvalid : Ext.emptyFn,


	onRender : function(ct, position){
		Ext.form.Checkbox.superclass.onRender.call(this, ct, position);
		if(this.inputValue !== undefined){
			this.el.dom.value = this.inputValue;
		}
		this.wrap = this.el.wrap({cls: 'x-form-check-wrap'});
		if(this.boxLabel){
			this.wrap.createChild({tag: 'label', htmlFor: this.el.id, cls: 'x-form-cb-label', html: this.boxLabel});
		}
		if(this.checked){
			this.setValue(true);
		}else{
			this.checked = this.el.dom.checked;
		}

		if(Ext.isIE){
			this.wrap.repaint();
		}
		this.resizeEl = this.positionEl = this.wrap;
	},


	onDestroy : function(){
		Ext.destroy(this.wrap);
		Ext.form.Checkbox.superclass.onDestroy.call(this);
	},


	initValue : function() {
		this.originalValue = this.getValue();
	},


	getValue : function(){
		if(this.rendered){
			return this.el.dom.checked;
		}
		return this.checked;
	},


	onClick : function(){
		if(this.el.dom.checked != this.checked){
			this.setValue(this.el.dom.checked);
		}
	},


	setValue : function(v){
		var checked = this.checked ;
		this.checked = (v === true || v === 'true' || v == '1' || String(v).toLowerCase() == 'on');
		if(this.rendered){
			this.el.dom.checked = this.checked;
			this.el.dom.defaultChecked = this.checked;
		}
		if(checked != this.checked){
			this.fireEvent('check', this, this.checked);
			if(this.handler){
				this.handler.call(this.scope || this, this, this.checked);
			}
		}
		return this;
	}
});
Ext.reg('checkbox', Ext.form.Checkbox);

Ext.form.CheckboxGroup = Ext.extend(Ext.form.Field, {


	columns : 'auto',

	vertical : false,

	allowBlank : true,

	blankText : "You must select at least one item in this group",


	defaultType : 'checkbox',


	groupCls : 'x-form-check-group',


	initComponent: function(){
		this.addEvents(

			'change'
		);
		this.on('change', this.validate, this);
		Ext.form.CheckboxGroup.superclass.initComponent.call(this);
	},


	onRender : function(ct, position){
		if(!this.el){
			var panelCfg = {
				autoEl: {
					id: this.id
				},
				cls: this.groupCls,
				layout: 'column',
				renderTo: ct,
				bufferResize: false
			};
			var colCfg = {
				xtype: 'container',
				defaultType: this.defaultType,
				layout: 'form',
				defaults: {
					hideLabel: true,
					anchor: '100%'
				}
			};

			if(this.items[0].items){



				Ext.apply(panelCfg, {
					layoutConfig: {columns: this.items.length},
					defaults: this.defaults,
					items: this.items
				});
				for(var i=0, len=this.items.length; i<len; i++){
					Ext.applyIf(this.items[i], colCfg);
				}

			}else{




				var numCols, cols = [];

				if(typeof this.columns == 'string'){
					this.columns = this.items.length;
				}
				if(!Ext.isArray(this.columns)){
					var cs = [];
					for(var i=0; i<this.columns; i++){
						cs.push((100/this.columns)*.01);
					}
					this.columns = cs;
				}

				numCols = this.columns.length;


				for(var i=0; i<numCols; i++){
					var cc = Ext.apply({items:[]}, colCfg);
					cc[this.columns[i] <= 1 ? 'columnWidth' : 'width'] = this.columns[i];
					if(this.defaults){
						cc.defaults = Ext.apply(cc.defaults || {}, this.defaults)
					}
					cols.push(cc);
				};


				if(this.vertical){
					var rows = Math.ceil(this.items.length / numCols), ri = 0;
					for(var i=0, len=this.items.length; i<len; i++){
						if(i>0 && i%rows==0){
							ri++;
						}
						if(this.items[i].fieldLabel){
							this.items[i].hideLabel = false;
						}
						cols[ri].items.push(this.items[i]);
					};
				}else{
					for(var i=0, len=this.items.length; i<len; i++){
						var ci = i % numCols;
						if(this.items[i].fieldLabel){
							this.items[i].hideLabel = false;
						}
						cols[ci].items.push(this.items[i]);
					};
				}

				Ext.apply(panelCfg, {
					layoutConfig: {columns: numCols},
					items: cols
				});
			}

			this.panel = new Ext.Container(panelCfg);
			this.panel.ownerCt = this;
			this.el = this.panel.getEl();

			if(this.forId && this.itemCls){
				var l = this.el.up(this.itemCls).child('label', true);
				if(l){
					l.setAttribute('htmlFor', this.forId);
				}
			}

			var fields = this.panel.findBy(function(c){
				return c.isFormField;
			}, this);

			this.items = new Ext.util.MixedCollection();
			this.items.addAll(fields);
		}
		Ext.form.CheckboxGroup.superclass.onRender.call(this, ct, position);
	},

	initValue : function(){
		if(this.value){
			this.setValue.apply(this, this.buffered ? this.value : [this.value]);
			delete this.buffered;
			delete this.value;
		}
	},

	afterRender : function(){
		Ext.form.CheckboxGroup.superclass.afterRender.call(this);
		this.eachItem(function(item){
			item.on('check', this.fireChecked, this);
			item.inGroup = true;
		});
	},


	doLayout: function(){

		if(this.rendered){
			this.panel.forceLayout = this.ownerCt.forceLayout;
			this.panel.doLayout();
		}
	},


	fireChecked: function(){
		var arr = [];
		this.eachItem(function(item){
			if(item.checked){
				arr.push(item);
			}
		});
		this.fireEvent('change', this, arr);
	},


	validateValue : function(value){
		if(!this.allowBlank){
			var blank = true;
			this.eachItem(function(f){
				if(f.checked){
					return (blank = false);
				}
			});
			if(blank){
				this.markInvalid(this.blankText);
				return false;
			}
		}
		return true;
	},


	isDirty: function(){

		if (this.disabled || !this.rendered) {
			return false;
		}

		var dirty = false;
		this.eachItem(function(item){
			if(item.isDirty()){
				dirty = true;
				return false;
			}
		});
		return dirty;
	},


	onDisable : function(){
		this.eachItem(function(item){
			item.disable();
		});
	},


	onEnable : function(){
		this.eachItem(function(item){
			item.enable();
		});
	},


	doLayout: function(){
		if(this.rendered){
			this.panel.forceLayout = this.ownerCt.forceLayout;
			this.panel.doLayout();
		}
	},


	onResize : function(w, h){
		this.panel.setSize(w, h);
		this.panel.doLayout();
	},


	reset : function(){
		this.eachItem(function(c){
			if(c.reset){
				c.reset();
			}
		});


		(function() {
			this.clearInvalid();
		}).defer(50, this);
	},


	setValue: function(){
		if(this.rendered){
			this.onSetValue.apply(this, arguments);
		}else{
			this.buffered = true;
			this.value = arguments;
		}
		return this;
	},

	onSetValue: function(id, value){
		if(arguments.length == 1){
			if(Ext.isArray(id)){

				Ext.each(id, function(val, idx){
					var item = this.items.itemAt(idx);
					if(item){
						item.setValue(val);
					}
				}, this);
			}else if(Ext.isObject(id)){

				for(var i in id){
					var f = this.getBox(i);
					if(f){
						f.setValue(id[i]);
					}
				}
			}else{
				this.setValueForItem(id);
			}
		}else{
			var f = this.getBox(id);
			if(f){
				f.setValue(value);
			}
		}
	},


	beforeDestroy: function(){
		Ext.destroy(this.panel);
		Ext.form.CheckboxGroup.superclass.beforeDestroy.call(this);

	},

	setValueForItem : function(val){
		val = String(val).split(',');
		this.eachItem(function(item){
			if(val.indexOf(item.inputValue)> -1){
				item.setValue(true);
			}
		});
	},


	getBox : function(id){
		var box = null;
		this.eachItem(function(f){
			if(id == f || f.dataIndex == id || f.id == id || f.getName() == id){
				box = f;
				return false;
			}
		});
		return box;
	},


	getValue : function(){
		var out = [];
		this.eachItem(function(item){
			if(item.checked){
				out.push(item);
			}
		});
		return out;
	},


	eachItem: function(fn){
		if(this.items && this.items.each){
			this.items.each(fn, this);
		}
	},




	getRawValue : Ext.emptyFn,


	setRawValue : Ext.emptyFn

});

Ext.reg('checkboxgroup', Ext.form.CheckboxGroup);

Ext.form.Radio = Ext.extend(Ext.form.Checkbox, {
	inputType: 'radio',


	markInvalid : Ext.emptyFn,

	clearInvalid : Ext.emptyFn,


	getGroupValue : function(){
		var p = this.el.up('form') || Ext.getBody();
		var c = p.child('input[name='+this.el.dom.name+']:checked', true);
		return c ? c.value : null;
	},


	onClick : function(){
		if(this.el.dom.checked != this.checked){
			var els = this.getCheckEl().select('input[name=' + this.el.dom.name + ']');
			els.each(function(el){
				if(el.dom.id == this.id){
					this.setValue(true);
				}else{
					Ext.getCmp(el.dom.id).setValue(false);
				}
			}, this);
		}
	},


	setValue : function(v){
		if (typeof v == 'boolean') {
			Ext.form.Radio.superclass.setValue.call(this, v);
		} else {
			var r = this.getCheckEl().child('input[name=' + this.el.dom.name + '][value=' + v + ']', true);
			if(r){
				Ext.getCmp(r.id).setValue(true);
			}
		}
		return this;
	},


	getCheckEl: function(){
		if(this.inGroup){
			return this.el.up('.x-form-radio-group')
		}
		return this.el.up('form') || Ext.getBody();
	}
});
Ext.reg('radio', Ext.form.Radio);

Ext.form.RadioGroup = Ext.extend(Ext.form.CheckboxGroup, {


	allowBlank : true,

	blankText : 'You must select one item in this group',


	defaultType : 'radio',


	groupCls : 'x-form-radio-group',




	getValue : function(){
		var out = null;
		this.eachItem(function(item){
			if(item.checked){
				out = item;
				return false;
			}
		});
		return out;
	},


	onSetValue : function(id, value){
		if(arguments.length > 1){
			var f = this.getBox(id);
			if(f){
				f.setValue(value);
				if(f.checked){
					this.eachItem(function(item){
						if (item !== f){
							item.setValue(false);
						}
					});
				}
			}
		}else{
			this.setValueForItem(id);
		}
	},

	setValueForItem : function(val){
		val = String(val).split(',')[0];
		this.eachItem(function(item){
			item.setValue(val == item.inputValue);
		});
	},


	fireChecked : function(){
		if(!this.checkTask){
			this.checkTask = new Ext.util.DelayedTask(this.bufferChecked, this);
		}
		this.checkTask.delay(10);
	},


	bufferChecked : function(){
		var out = null;
		this.eachItem(function(item){
			if(item.checked){
				out = item;
				return false;
			}
		});
		this.fireEvent('change', this, out);
	},

	onDestroy : function(){
		if(this.checkTask){
			this.checkTask.cancel();
			this.checkTask = null;
		}
		Ext.form.RadioGroup.superclass.onDestroy.call(this);
	}

});

Ext.reg('radiogroup', Ext.form.RadioGroup);

Ext.form.Hidden = Ext.extend(Ext.form.Field, {

	inputType : 'hidden',


	onRender : function(){
		Ext.form.Hidden.superclass.onRender.apply(this, arguments);
	},


	initEvents : function(){
		this.originalValue = this.getValue();
	},


	setSize : Ext.emptyFn,
	setWidth : Ext.emptyFn,
	setHeight : Ext.emptyFn,
	setPosition : Ext.emptyFn,
	setPagePosition : Ext.emptyFn,
	markInvalid : Ext.emptyFn,
	clearInvalid : Ext.emptyFn
});
Ext.reg('hidden', Ext.form.Hidden);
Ext.form.BasicForm = function(el, config){
	Ext.apply(this, config);
	if(Ext.isString(this.paramOrder)){
		this.paramOrder = this.paramOrder.split(/[\s,|]/);
	}

	this.items = new Ext.util.MixedCollection(false, function(o){
		return o.getItemId();
	});
	this.addEvents(

		'beforeaction',

		'actionfailed',

		'actioncomplete'
	);

	if(el){
		this.initEl(el);
	}
	Ext.form.BasicForm.superclass.constructor.call(this);
};

Ext.extend(Ext.form.BasicForm, Ext.util.Observable, {







	timeout: 30,




	paramOrder: undefined,


	paramsAsHash: false,


	waitTitle: 'Please Wait...',


	activeAction : null,


	trackResetOnLoad : false,





	initEl : function(el){
		this.el = Ext.get(el);
		this.id = this.el.id || Ext.id();
		if(!this.standardSubmit){
			this.el.on('submit', this.onSubmit, this);
		}
		this.el.addClass('x-form');
	},


	getEl: function(){
		return this.el;
	},


	onSubmit : function(e){
		e.stopEvent();
	},


	destroy: function() {
		this.items.each(function(f){
			Ext.destroy(f);
		});
		if(this.el){
			this.el.removeAllListeners();
			this.el.remove();
		}
		this.purgeListeners();
	},


	isValid : function(){
		var valid = true;
		this.items.each(function(f){
			if(!f.validate()){
				valid = false;
			}
		});
		return valid;
	},


	isDirty : function(){
		var dirty = false;
		this.items.each(function(f){
			if(f.isDirty()){
				dirty = true;
				return false;
			}
		});
		return dirty;
	},


	doAction : function(action, options){
		if(Ext.isString(action)){
			action = new Ext.form.Action.ACTION_TYPES[action](this, options);
		}
		if(this.fireEvent('beforeaction', this, action) !== false){
			this.beforeAction(action);
			action.run.defer(100, action);
		}
		return this;
	},


	submit : function(options){
		if(this.standardSubmit){
			var v = this.isValid();
			if(v){
				var el = this.el.dom;
				if(this.url && Ext.isEmpty(el.action)){
					el.action = this.url;
				}
				el.submit();
			}
			return v;
		}
		var submitAction = String.format('{0}submit', this.api ? 'direct' : '');
		this.doAction(submitAction, options);
		return this;
	},


	load : function(options){
		var loadAction = String.format('{0}load', this.api ? 'direct' : '');
		this.doAction(loadAction, options);
		return this;
	},


	updateRecord : function(record){
		record.beginEdit();
		var fs = record.fields;
		fs.each(function(f){
			var field = this.findField(f.name);
			if(field){
				record.set(f.name, field.getValue());
			}
		}, this);
		record.endEdit();
		return this;
	},


	loadRecord : function(record){
		this.setValues(record.data);
		return this;
	},


	beforeAction : function(action){
		var o = action.options;
		if(o.waitMsg){
			if(this.waitMsgTarget === true){
				this.el.mask(o.waitMsg, 'x-mask-loading');
			}else if(this.waitMsgTarget){
				this.waitMsgTarget = Ext.get(this.waitMsgTarget);
				this.waitMsgTarget.mask(o.waitMsg, 'x-mask-loading');
			}else{
				Ext.MessageBox.wait(o.waitMsg, o.waitTitle || this.waitTitle);
			}
		}
	},


	afterAction : function(action, success){
		this.activeAction = null;
		var o = action.options;
		if(o.waitMsg){
			if(this.waitMsgTarget === true){
				this.el.unmask();
			}else if(this.waitMsgTarget){
				this.waitMsgTarget.unmask();
			}else{
				Ext.MessageBox.updateProgress(1);
				Ext.MessageBox.hide();
			}
		}
		if(success){
			if(o.reset){
				this.reset();
			}
			Ext.callback(o.success, o.scope, [this, action]);
			this.fireEvent('actioncomplete', this, action);
		}else{
			Ext.callback(o.failure, o.scope, [this, action]);
			this.fireEvent('actionfailed', this, action);
		}
	},


	findField : function(id){
		var field = this.items.get(id);
		if(!Ext.isObject(field)){
			this.items.each(function(f){
				if(f.isFormField && (f.dataIndex == id || f.id == id || f.getName() == id)){
					field = f;
					return false;
				}
			});
		}
		return field || null;
	},



	markInvalid : function(errors){
		if(Ext.isArray(errors)){
			for(var i = 0, len = errors.length; i < len; i++){
				var fieldError = errors[i];
				var f = this.findField(fieldError.id);
				if(f){
					f.markInvalid(fieldError.msg);
				}
			}
		}else{
			var field, id;
			for(id in errors){
				if(!Ext.isFunction(errors[id]) && (field = this.findField(id))){
					field.markInvalid(errors[id]);
				}
			}
		}
		return this;
	},


	setValues : function(values){
		if(Ext.isArray(values)){
			for(var i = 0, len = values.length; i < len; i++){
				var v = values[i];
				var f = this.findField(v.id);
				if(f){
					f.setValue(v.value);
					if(this.trackResetOnLoad){
						f.originalValue = f.getValue();
					}
				}
			}
		}else{
			var field, id;
			for(id in values){
				if(!Ext.isFunction(values[id]) && (field = this.findField(id))){
					field.setValue(values[id]);
					if(this.trackResetOnLoad){
						field.originalValue = field.getValue();
					}
				}
			}
		}
		return this;
	},


	getValues : function(asString){
		var fs = Ext.lib.Ajax.serializeForm(this.el.dom);
		if(asString === true){
			return fs;
		}
		return Ext.urlDecode(fs);
	},


	getFieldValues : function(dirtyOnly){
		var o = {},
			n,
			key,
			val;
		this.items.each(function(f){
			if(dirtyOnly !== true || f.isDirty()){
				n = f.getName();
				key = o[n];
				val = f.getValue();

				if(Ext.isDefined(key)){
					if(Ext.isArray(key)){
						o[n].push(val);
					}else{
						o[n] = [key, val];
					}
				}else{
					o[n] = val;
				}
			}
		});
		return o;
	},


	clearInvalid : function(){
		this.items.each(function(f){
			f.clearInvalid();
		});
		return this;
	},


	reset : function(){
		this.items.each(function(f){
			f.reset();
		});
		return this;
	},


	add : function(){
		this.items.addAll(Array.prototype.slice.call(arguments, 0));
		return this;
	},



	remove : function(field){
		this.items.remove(field);
		return this;
	},


	render : function(){
		this.items.each(function(f){
			if(f.isFormField && !f.rendered && document.getElementById(f.id)){
				f.applyToMarkup(f.id);
			}
		});
		return this;
	},


	applyToFields : function(o){
		this.items.each(function(f){
			Ext.apply(f, o);
		});
		return this;
	},


	applyIfToFields : function(o){
		this.items.each(function(f){
			Ext.applyIf(f, o);
		});
		return this;
	},

	callFieldMethod : function(fnName, args){
		args = args || [];
		this.items.each(function(f){
			if(Ext.isFunction(f[fnName])){
				f[fnName].apply(f, args);
			}
		});
		return this;
	}
});


Ext.BasicForm = Ext.form.BasicForm;
Ext.FormPanel = Ext.extend(Ext.Panel, {










	minButtonWidth : 75,


	labelAlign : 'left',


	monitorValid : false,


	monitorPoll : 200,


	layout : 'form',


	initComponent : function(){
		this.form = this.createForm();
		Ext.FormPanel.superclass.initComponent.call(this);

		this.bodyCfg = {
			tag: 'form',
			cls: this.baseCls + '-body',
			method : this.method || 'POST',
			id : this.formId || Ext.id()
		};
		if(this.fileUpload) {
			this.bodyCfg.enctype = 'multipart/form-data';
		}
		this.initItems();

		this.addEvents(

			'clientvalidation'
		);

		this.relayEvents(this.form, ['beforeaction', 'actionfailed', 'actioncomplete']);
	},


	createForm : function(){
		var config = Ext.applyIf({listeners: {}}, this.initialConfig);
		return new Ext.form.BasicForm(null, config);
	},


	initFields : function(){
		var f = this.form;
		var formPanel = this;
		var fn = function(c){
			if(formPanel.isField(c)){
				f.add(c);
			}else if(c.findBy && c != formPanel){
				formPanel.applySettings(c);

				if(c.items && c.items.each){
					c.items.each(fn, this);
				}
			}
		};
		this.items.each(fn, this);
	},


	applySettings: function(c){
		var ct = c.ownerCt;
		Ext.applyIf(c, {
			labelAlign: ct.labelAlign,
			labelWidth: ct.labelWidth,
			itemCls: ct.itemCls
		});
	},


	getLayoutTarget : function(){
		return this.form.el;
	},


	getForm : function(){
		return this.form;
	},


	onRender : function(ct, position){
		this.initFields();
		Ext.FormPanel.superclass.onRender.call(this, ct, position);
		this.form.initEl(this.body);
	},


	beforeDestroy : function(){
		this.stopMonitoring();

		Ext.destroy(this.form);
		this.form.items.clear();
		Ext.FormPanel.superclass.beforeDestroy.call(this);
	},


	isField : function(c) {
		return !!c.setValue && !!c.getValue && !!c.markInvalid && !!c.clearInvalid;
	},


	initEvents : function(){
		Ext.FormPanel.superclass.initEvents.call(this);

		this.on({
			scope: this,
			add: this.onAddEvent,
			remove: this.onRemoveEvent
		});
		if(this.monitorValid){
			this.startMonitoring();
		}
	},


	onAdd: function(c){
		Ext.FormPanel.superclass.onAdd.call(this, c);
		this.processAdd(c);
	},


	onAddEvent: function(ct, c){
		if(ct !== this){
			this.processAdd(c);
		}
	},


	processAdd : function(c){

		if(this.isField(c)){
			this.form.add(c);

		}else if(c.findBy){
			this.applySettings(c);
			this.form.add.apply(this.form, c.findBy(this.isField));
		}
	},


	onRemove: function(c){
		Ext.FormPanel.superclass.onRemove.call(this, c);
		this.processRemove(c);
	},

	onRemoveEvent: function(ct, c){
		if(ct !== this){
			this.processRemove(c);
		}
	},


	processRemove : function(c){

		if(this.isField(c)){
			this.form.remove(c);

		}else if(c.findBy){
			var isDestroyed = function(o) {
				return !!o.isDestroyed;
			}
			this.form.items.filterBy(isDestroyed, this.form).each(this.form.remove, this.form);
		}
	},


	startMonitoring : function(){
		if(!this.validTask){
			this.validTask = new Ext.util.TaskRunner();
			this.validTask.start({
				run : this.bindHandler,
				interval : this.monitorPoll || 200,
				scope: this
			});
		}
	},


	stopMonitoring : function(){
		if(this.validTask){
			this.validTask.stopAll();
			this.validTask = null;
		}
	},


	load : function(){
		this.form.load.apply(this.form, arguments);
	},


	onDisable : function(){
		Ext.FormPanel.superclass.onDisable.call(this);
		if(this.form){
			this.form.items.each(function(){
				this.disable();
			});
		}
	},


	onEnable : function(){
		Ext.FormPanel.superclass.onEnable.call(this);
		if(this.form){
			this.form.items.each(function(){
				this.enable();
			});
		}
	},


	bindHandler : function(){
		var valid = true;
		this.form.items.each(function(f){
			if(!f.isValid(true)){
				valid = false;
				return false;
			}
		});
		if(this.fbar){
			var fitems = this.fbar.items.items;
			for(var i = 0, len = fitems.length; i < len; i++){
				var btn = fitems[i];
				if(btn.formBind === true && btn.disabled === valid){
					btn.setDisabled(!valid);
				}
			}
		}
		this.fireEvent('clientvalidation', this, valid);
	}
});
Ext.reg('form', Ext.FormPanel);

Ext.form.FormPanel = Ext.FormPanel;

Ext.form.FieldSet = Ext.extend(Ext.Panel, {






	baseCls : 'x-fieldset',

	layout : 'form',

	animCollapse : false,


	onRender : function(ct, position){
		if(!this.el){
			this.el = document.createElement('fieldset');
			this.el.id = this.id;
			if (this.title || this.header || this.checkboxToggle) {
				this.el.appendChild(document.createElement('legend')).className = 'x-fieldset-header';
			}
		}

		Ext.form.FieldSet.superclass.onRender.call(this, ct, position);

		if(this.checkboxToggle){
			var o = typeof this.checkboxToggle == 'object' ?
				this.checkboxToggle :
			{tag: 'input', type: 'checkbox', name: this.checkboxName || this.id+'-checkbox'};
			this.checkbox = this.header.insertFirst(o);
			this.checkbox.dom.checked = !this.collapsed;
			this.mon(this.checkbox, 'click', this.onCheckClick, this);
		}
	},


	onCollapse : function(doAnim, animArg){
		if(this.checkbox){
			this.checkbox.dom.checked = false;
		}
		Ext.form.FieldSet.superclass.onCollapse.call(this, doAnim, animArg);

	},


	onExpand : function(doAnim, animArg){
		if(this.checkbox){
			this.checkbox.dom.checked = true;
		}
		Ext.form.FieldSet.superclass.onExpand.call(this, doAnim, animArg);
	},


	onCheckClick : function(){
		this[this.checkbox.dom.checked ? 'expand' : 'collapse']();
	}



































});
Ext.reg('fieldset', Ext.form.FieldSet);


Ext.form.HtmlEditor = Ext.extend(Ext.form.Field, {

	enableFormat : true,

	enableFontSize : true,

	enableColors : true,

	enableAlignments : true,

	enableLists : true,

	enableSourceEdit : true,

	enableLinks : true,

	enableFont : true,

	createLinkText : 'Please enter the URL for the link:',

	defaultLinkValue : 'http:/'+'/',

	fontFamilies : [
		'Arial',
		'Courier New',
		'Tahoma',
		'Times New Roman',
		'Verdana'
	],
	defaultFont: 'tahoma',

	defaultValue: (Ext.isOpera || Ext.isIE6) ? '&#160;' : '&#8203;',


	actionMode: 'wrap',
	validationEvent : false,
	deferHeight: true,
	initialized : false,
	activated : false,
	sourceEditMode : false,
	onFocus : Ext.emptyFn,
	iframePad:3,
	hideMode:'offsets',
	defaultAutoCreate : {
		tag: "textarea",
		style:"width:500px;height:300px;",
		autocomplete: "off"
	},


	initComponent : function(){
		this.addEvents(

			'initialize',

			'activate',

			'beforesync',

			'beforepush',

			'sync',

			'push',

			'editmodechange'
		)
	},


	createFontOptions : function(){
		var buf = [], fs = this.fontFamilies, ff, lc;
		for(var i = 0, len = fs.length; i< len; i++){
			ff = fs[i];
			lc = ff.toLowerCase();
			buf.push(
				'<option value="',lc,'" style="font-family:',ff,';"',
				(this.defaultFont == lc ? ' selected="true">' : '>'),
				ff,
				'</option>'
			);
		}
		return buf.join('');
	},


	createToolbar : function(editor){
		var items = [];
		var tipsEnabled = Ext.QuickTips && Ext.QuickTips.isEnabled();


		function btn(id, toggle, handler){
			return {
				itemId : id,
				cls : 'x-btn-icon',
				iconCls: 'x-edit-'+id,
				enableToggle:toggle !== false,
				scope: editor,
				handler:handler||editor.relayBtnCmd,
				clickEvent:'mousedown',
				tooltip: tipsEnabled ? editor.buttonTips[id] || undefined : undefined,
				overflowText: editor.buttonTips[id].title || undefined,
				tabIndex:-1
			};
		}


		if(this.enableFont && !Ext.isSafari2){
			var fontSelectItem = new Ext.Toolbar.Item({
				autoEl: {
					tag:'select',
					cls:'x-font-select',
					html: this.createFontOptions()
				}
			});

			items.push(
				fontSelectItem,
				'-'
			);
		}

		if(this.enableFormat){
			items.push(
				btn('bold'),
				btn('italic'),
				btn('underline')
			);
		}

		if(this.enableFontSize){
			items.push(
				'-',
				btn('increasefontsize', false, this.adjustFont),
				btn('decreasefontsize', false, this.adjustFont)
			);
		}

		if(this.enableColors){
			items.push(
				'-', {
					itemId:'forecolor',
					cls:'x-btn-icon',
					iconCls: 'x-edit-forecolor',
					clickEvent:'mousedown',
					tooltip: tipsEnabled ? editor.buttonTips.forecolor || undefined : undefined,
					tabIndex:-1,
					menu : new Ext.menu.ColorMenu({
						allowReselect: true,
						focus: Ext.emptyFn,
						value:'000000',
						plain:true,
						listeners: {
							scope: this,
							select: function(cp, color){
								this.execCmd('forecolor', Ext.isWebKit || Ext.isIE ? '#'+color : color);
								this.deferFocus();
							}
						},
						clickEvent:'mousedown'
					})
				}, {
					itemId:'backcolor',
					cls:'x-btn-icon',
					iconCls: 'x-edit-backcolor',
					clickEvent:'mousedown',
					tooltip: tipsEnabled ? editor.buttonTips.backcolor || undefined : undefined,
					tabIndex:-1,
					menu : new Ext.menu.ColorMenu({
						focus: Ext.emptyFn,
						value:'FFFFFF',
						plain:true,
						allowReselect: true,
						listeners: {
							scope: this,
							select: function(cp, color){
								if(Ext.isGecko){
									this.execCmd('useCSS', false);
									this.execCmd('hilitecolor', color);
									this.execCmd('useCSS', true);
									this.deferFocus();
								}else{
									this.execCmd(Ext.isOpera ? 'hilitecolor' : 'backcolor', Ext.isWebKit || Ext.isIE ? '#'+color : color);
									this.deferFocus();
								}
							}
						},
						clickEvent:'mousedown'
					})
				}
			);
		}

		if(this.enableAlignments){
			items.push(
				'-',
				btn('justifyleft'),
				btn('justifycenter'),
				btn('justifyright')
			);
		}

		if(!Ext.isSafari2){
			if(this.enableLinks){
				items.push(
					'-',
					btn('createlink', false, this.createLink)
				);
			}

			if(this.enableLists){
				items.push(
					'-',
					btn('insertorderedlist'),
					btn('insertunorderedlist')
				);
			}
			if(this.enableSourceEdit){
				items.push(
					'-',
					btn('sourceedit', true, function(btn){
						this.toggleSourceEdit(!this.sourceEditMode);
					})
				);
			}
		}


		var tb = new Ext.Toolbar({
			renderTo: this.wrap.dom.firstChild,
			items: items
		});

		if (fontSelectItem) {
			this.fontSelect = fontSelectItem.el;

			this.mon(this.fontSelect, 'change', function(){
				var font = this.fontSelect.dom.value;
				this.relayCmd('fontname', font);
				this.deferFocus();
			}, this);
		}



		this.mon(tb.el, 'click', function(e){
			e.preventDefault();
		});



		this.tb = tb;
	},

	onDisable: function(){
		this.wrap.mask();
		Ext.form.HtmlEditor.superclass.onDisable.call(this);
	},

	onEnable: function(){
		this.wrap.unmask();
		Ext.form.HtmlEditor.superclass.onEnable.call(this);
	},

	setReadOnly: function(readOnly){
		if(this.initialized){
			var newDM = readOnly ? 'off' : 'on',
				doc = this.getDoc();
			if(String(doc.designMode).toLowerCase() != newDM){
				doc.designMode = newDM;
			}
			this.disableItems(!readOnly);
		}
		Ext.form.HtmlEditor.superclass.setReadOnly.call(this, readOnly);
	},


	getDocMarkup : function(){
		return '<html><head><style type="text/css">body{border:0;margin:0;padding:3px;height:98%;cursor:text;}</style></head><body></body></html>';
	},


	getEditorBody : function(){
		var doc = this.getDoc();
		return doc.body || doc.documentElement;
	},


	getDoc : function(){
		return Ext.isIE ? this.getWin().document : (this.iframe.contentDocument || this.getWin().document);
	},


	getWin : function(){
		return Ext.isIE ? this.iframe.contentWindow : window.frames[this.iframe.name];
	},


	onRender : function(ct, position){
		Ext.form.HtmlEditor.superclass.onRender.call(this, ct, position);
		this.el.dom.style.border = '0 none';
		this.el.dom.setAttribute('tabIndex', -1);
		this.el.addClass('x-hidden');
		if(Ext.isIE){
			this.el.applyStyles('margin-top:-1px;margin-bottom:-1px;')
		}
		this.wrap = this.el.wrap({
			cls:'x-html-editor-wrap', cn:{cls:'x-html-editor-tb'}
		});

		this.createToolbar(this);

		this.disableItems(true);



		this.createIFrame();

		if(!this.width){
			var sz = this.el.getSize();
			this.setSize(sz.width, this.height || sz.height);
		}
		this.resizeEl = this.positionEl = this.wrap;
	},

	createIFrame: function(){
		var iframe = document.createElement('iframe');
		iframe.name = Ext.id();
		iframe.frameBorder = '0';
		iframe.src = Ext.SSL_SECURE_URL;
		this.wrap.dom.appendChild(iframe);

		this.iframe = iframe;

		this.monitorTask = Ext.TaskMgr.start({
			run: this.checkDesignMode,
			scope: this,
			interval:100
		});
	},

	initFrame : function(){
		Ext.TaskMgr.stop(this.monitorTask);
		var doc = this.getDoc();
		this.win = this.getWin();

		doc.open();
		doc.write(this.getDocMarkup());
		doc.close();

		var task = {
			run : function(){
				var doc = this.getDoc();
				if(doc.body || doc.readyState == 'complete'){
					Ext.TaskMgr.stop(task);
					doc.designMode="on";
					this.initEditor.defer(10, this);
				}
			},
			interval : 10,
			duration:10000,
			scope: this
		};
		Ext.TaskMgr.start(task);
	},


	checkDesignMode : function(){
		if(this.wrap && this.wrap.dom.offsetWidth){
			var doc = this.getDoc();
			if(!doc){
				return;
			}
			if(!doc.editorInitialized || String(doc.designMode).toLowerCase() != 'on'){
				this.initFrame();
			}
		}
	},

	disableItems: function(disabled){
		if(this.fontSelect){
			this.fontSelect.dom.disabled = disabled;
		}
		this.tb.items.each(function(item){
			if(item.getItemId() != 'sourceedit'){
				item.setDisabled(disabled);
			}
		});
	},


	onResize : function(w, h){
		Ext.form.HtmlEditor.superclass.onResize.apply(this, arguments);
		if(this.el && this.iframe){
			if(Ext.isNumber(w)){
				var aw = w - this.wrap.getFrameWidth('lr');
				this.el.setWidth(aw);
				this.tb.setWidth(aw);
				this.iframe.style.width = Math.max(aw, 0) + 'px';
			}
			if(Ext.isNumber(h)){
				var ah = h - this.wrap.getFrameWidth('tb') - this.tb.el.getHeight();
				this.el.setHeight(ah);
				this.iframe.style.height = Math.max(ah, 0) + 'px';
				var bd = this.getEditorBody();
				if(bd){
					bd.style.height = Math.max((ah - (this.iframePad*2)), 0) + 'px';
				}
			}
		}
	},


	toggleSourceEdit : function(sourceEditMode){
		if(sourceEditMode === undefined){
			sourceEditMode = !this.sourceEditMode;
		}
		this.sourceEditMode = sourceEditMode === true;
		var btn = this.tb.getComponent('sourceedit');

		if(btn.pressed !== this.sourceEditMode){
			btn.toggle(this.sourceEditMode);
			if(!btn.xtbHidden){
				return;
			}
		}
		if(this.sourceEditMode){
			this.disableItems(true);
			this.syncValue();
			this.iframe.className = 'x-hidden';
			this.el.removeClass('x-hidden');
			this.el.dom.removeAttribute('tabIndex');
			this.el.focus();
		}else{
			if(this.initialized && !this.readOnly){
				this.disableItems(false);
			}
			this.pushValue();
			this.iframe.className = '';
			this.el.addClass('x-hidden');
			this.el.dom.setAttribute('tabIndex', -1);
			this.deferFocus();
		}
		var lastSize = this.lastSize;
		if(lastSize){
			delete this.lastSize;
			this.setSize(lastSize);
		}
		this.fireEvent('editmodechange', this, this.sourceEditMode);
	},


	createLink : function(){
		var url = prompt(this.createLinkText, this.defaultLinkValue);
		if(url && url != 'http:/'+'/'){
			this.relayCmd('createlink', url);
		}
	},


	initEvents : function(){
		this.originalValue = this.getValue();
	},


	markInvalid : Ext.emptyFn,


	clearInvalid : Ext.emptyFn,


	setValue : function(v){
		Ext.form.HtmlEditor.superclass.setValue.call(this, v);
		this.pushValue();
		return this;
	},


	cleanHtml: function(html) {
		html = String(html);
		if(Ext.isWebKit){
			html = html.replace(/\sclass="(?:Apple-style-span|khtml-block-placeholder)"/gi, '');
		}


		if(html.charCodeAt(0) == this.defaultValue.replace(/\D/g, '')){
			html = html.substring(1);
		}
		return html;
	},


	syncValue : function(){
		if(this.initialized){
			var bd = this.getEditorBody();
			var html = bd.innerHTML;
			if(Ext.isWebKit){
				var bs = bd.getAttribute('style');
				var m = bs.match(/text-align:(.*?);/i);
				if(m && m[1]){
					html = '<div style="'+m[0]+'">' + html + '</div>';
				}
			}
			html = this.cleanHtml(html);
			if(this.fireEvent('beforesync', this, html) !== false){
				this.el.dom.value = html;
				this.fireEvent('sync', this, html);
			}
		}
	},


	getValue : function() {
		this[this.sourceEditMode ? 'pushValue' : 'syncValue']();
		return Ext.form.HtmlEditor.superclass.getValue.call(this);
	},


	pushValue : function(){
		if(this.initialized){
			var v = this.el.dom.value;
			if(!this.activated && v.length < 1){
				v = this.defaultValue;
			}
			if(this.fireEvent('beforepush', this, v) !== false){
				this.getEditorBody().innerHTML = v;
				if(Ext.isGecko){

					var d = this.getDoc(),
						mode = d.designMode.toLowerCase();

					d.designMode = mode.toggle('on', 'off');
					d.designMode = mode;
				}
				this.fireEvent('push', this, v);
			}
		}
	},


	deferFocus : function(){
		this.focus.defer(10, this);
	},


	focus : function(){
		if(this.win && !this.sourceEditMode){
			this.win.focus();
		}else{
			this.el.focus();
		}
	},


	initEditor : function(){

		try{
			var dbody = this.getEditorBody(),
				ss = this.el.getStyles('font-size', 'font-family', 'background-image', 'background-repeat'),
				doc,
				fn;

			ss['background-attachment'] = 'fixed';
			dbody.bgProperties = 'fixed';

			Ext.DomHelper.applyStyles(dbody, ss);

			doc = this.getDoc();

			if(doc){
				try{
					Ext.EventManager.removeAll(doc);
				}catch(e){}
			}


			fn = this.onEditorEvent.createDelegate(this);
			Ext.EventManager.on(doc, {
				mousedown: fn,
				dblclick: fn,
				click: fn,
				keyup: fn,
				buffer:100
			});

			if(Ext.isGecko){
				Ext.EventManager.on(doc, 'keypress', this.applyCommand, this);
			}
			if(Ext.isIE || Ext.isWebKit || Ext.isOpera){
				Ext.EventManager.on(doc, 'keydown', this.fixKeys, this);
			}
			doc.editorInitialized = true;
			this.initialized = true;
			this.pushValue();
			this.setReadOnly(this.readOnly);
			this.fireEvent('initialize', this);
		}catch(e){}
	},


	onDestroy : function(){
		if(this.monitorTask){
			Ext.TaskMgr.stop(this.monitorTask);
		}
		if(this.rendered){
			Ext.destroy(this.tb);
			var doc = this.getDoc();
			if(doc){
				try{
					Ext.EventManager.removeAll(doc);
					for (var prop in doc){
						delete doc[prop];
					}
				}catch(e){}
			}
			if(this.wrap){
				this.wrap.dom.innerHTML = '';
				this.wrap.remove();
			}
		}

		if(this.el){
			this.el.removeAllListeners();
			this.el.remove();
		}
		this.purgeListeners();
	},


	onFirstFocus : function(){
		this.activated = true;
		this.disableItems(false);
		if(Ext.isGecko){
			this.win.focus();
			var s = this.win.getSelection();
			if(!s.focusNode || s.focusNode.nodeType != 3){
				var r = s.getRangeAt(0);
				r.selectNodeContents(this.getEditorBody());
				r.collapse(true);
				this.deferFocus();
			}
			try{
				this.execCmd('useCSS', true);
				this.execCmd('styleWithCSS', false);
			}catch(e){}
		}
		this.fireEvent('activate', this);
	},


	adjustFont: function(btn){
		var adjust = btn.getItemId() == 'increasefontsize' ? 1 : -1,
			doc = this.getDoc(),
			v = parseInt(doc.queryCommandValue('FontSize') || 2, 10);
		if((Ext.isSafari && !Ext.isSafari2) || Ext.isChrome || Ext.isAir){


			if(v <= 10){
				v = 1 + adjust;
			}else if(v <= 13){
				v = 2 + adjust;
			}else if(v <= 16){
				v = 3 + adjust;
			}else if(v <= 18){
				v = 4 + adjust;
			}else if(v <= 24){
				v = 5 + adjust;
			}else {
				v = 6 + adjust;
			}
			v = v.constrain(1, 6);
		}else{
			if(Ext.isSafari){
				adjust *= 2;
			}
			v = Math.max(1, v+adjust) + (Ext.isSafari ? 'px' : 0);
		}
		this.execCmd('FontSize', v);
	},


	onEditorEvent : function(e){
		this.updateToolbar();
	},



	updateToolbar: function(){

		if(this.readOnly){
			return;
		}

		if(!this.activated){
			this.onFirstFocus();
			return;
		}

		var btns = this.tb.items.map,
			doc = this.getDoc();

		if(this.enableFont && !Ext.isSafari2){
			var name = (doc.queryCommandValue('FontName')||this.defaultFont).toLowerCase();
			if(name != this.fontSelect.dom.value){
				this.fontSelect.dom.value = name;
			}
		}
		if(this.enableFormat){
			btns.bold.toggle(doc.queryCommandState('bold'));
			btns.italic.toggle(doc.queryCommandState('italic'));
			btns.underline.toggle(doc.queryCommandState('underline'));
		}
		if(this.enableAlignments){
			btns.justifyleft.toggle(doc.queryCommandState('justifyleft'));
			btns.justifycenter.toggle(doc.queryCommandState('justifycenter'));
			btns.justifyright.toggle(doc.queryCommandState('justifyright'));
		}
		if(!Ext.isSafari2 && this.enableLists){
			btns.insertorderedlist.toggle(doc.queryCommandState('insertorderedlist'));
			btns.insertunorderedlist.toggle(doc.queryCommandState('insertunorderedlist'));
		}

		Ext.menu.MenuMgr.hideAll();

		this.syncValue();
	},


	relayBtnCmd : function(btn){
		this.relayCmd(btn.getItemId());
	},


	relayCmd : function(cmd, value){
		(function(){
			this.focus();
			this.execCmd(cmd, value);
			this.updateToolbar();
		}).defer(10, this);
	},


	execCmd : function(cmd, value){
		var doc = this.getDoc();
		doc.execCommand(cmd, false, value === undefined ? null : value);
		this.syncValue();
	},


	applyCommand : function(e){
		if(e.ctrlKey){
			var c = e.getCharCode(), cmd;
			if(c > 0){
				c = String.fromCharCode(c);
				switch(c){
					case 'b':
						cmd = 'bold';
						break;
					case 'i':
						cmd = 'italic';
						break;
					case 'u':
						cmd = 'underline';
						break;
				}
				if(cmd){
					this.win.focus();
					this.execCmd(cmd);
					this.deferFocus();
					e.preventDefault();
				}
			}
		}
	},


	insertAtCursor : function(text){
		if(!this.activated){
			return;
		}
		if(Ext.isIE){
			this.win.focus();
			var doc = this.getDoc(),
				r = doc.selection.createRange();
			if(r){
				r.pasteHTML(text);
				this.syncValue();
				this.deferFocus();
			}
		}else{
			this.win.focus();
			this.execCmd('InsertHTML', text);
			this.deferFocus();
		}
	},


	fixKeys : function(){
		if(Ext.isIE){
			return function(e){
				var k = e.getKey(),
					doc = this.getDoc(),
					r;
				if(k == e.TAB){
					e.stopEvent();
					r = doc.selection.createRange();
					if(r){
						r.collapse(true);
						r.pasteHTML('&nbsp;&nbsp;&nbsp;&nbsp;');
						this.deferFocus();
					}
				}else if(k == e.ENTER){
					r = doc.selection.createRange();
					if(r){
						var target = r.parentElement();
						if(!target || target.tagName.toLowerCase() != 'li'){
							e.stopEvent();
							r.pasteHTML('<br />');
							r.collapse(false);
							r.select();
						}
					}
				}
			};
		}else if(Ext.isOpera){
			return function(e){
				var k = e.getKey();
				if(k == e.TAB){
					e.stopEvent();
					this.win.focus();
					this.execCmd('InsertHTML','&nbsp;&nbsp;&nbsp;&nbsp;');
					this.deferFocus();
				}
			};
		}else if(Ext.isWebKit){
			return function(e){
				var k = e.getKey();
				if(k == e.TAB){
					e.stopEvent();
					this.execCmd('InsertText','\t');
					this.deferFocus();
				}else if(k == e.ENTER){
					e.stopEvent();
					this.execCmd('InsertHtml','<br /><br />');
					this.deferFocus();
				}
			};
		}
	}(),


	getToolbar : function(){
		return this.tb;
	},


	buttonTips : {
		bold : {
			title: 'Bold (Ctrl+B)',
			text: 'Make the selected text bold.',
			cls: 'x-html-editor-tip'
		},
		italic : {
			title: 'Italic (Ctrl+I)',
			text: 'Make the selected text italic.',
			cls: 'x-html-editor-tip'
		},
		underline : {
			title: 'Underline (Ctrl+U)',
			text: 'Underline the selected text.',
			cls: 'x-html-editor-tip'
		},
		increasefontsize : {
			title: 'Grow Text',
			text: 'Increase the font size.',
			cls: 'x-html-editor-tip'
		},
		decreasefontsize : {
			title: 'Shrink Text',
			text: 'Decrease the font size.',
			cls: 'x-html-editor-tip'
		},
		backcolor : {
			title: 'Text Highlight Color',
			text: 'Change the background color of the selected text.',
			cls: 'x-html-editor-tip'
		},
		forecolor : {
			title: 'Font Color',
			text: 'Change the color of the selected text.',
			cls: 'x-html-editor-tip'
		},
		justifyleft : {
			title: 'Align Text Left',
			text: 'Align text to the left.',
			cls: 'x-html-editor-tip'
		},
		justifycenter : {
			title: 'Center Text',
			text: 'Center text in the editor.',
			cls: 'x-html-editor-tip'
		},
		justifyright : {
			title: 'Align Text Right',
			text: 'Align text to the right.',
			cls: 'x-html-editor-tip'
		},
		insertunorderedlist : {
			title: 'Bullet List',
			text: 'Start a bulleted list.',
			cls: 'x-html-editor-tip'
		},
		insertorderedlist : {
			title: 'Numbered List',
			text: 'Start a numbered list.',
			cls: 'x-html-editor-tip'
		},
		createlink : {
			title: 'Hyperlink',
			text: 'Make the selected text a hyperlink.',
			cls: 'x-html-editor-tip'
		},
		sourceedit : {
			title: 'Source Edit',
			text: 'Switch to source editing mode.',
			cls: 'x-html-editor-tip'
		}
	}



































});
Ext.reg('htmleditor', Ext.form.HtmlEditor);
Ext.form.TimeField = Ext.extend(Ext.form.ComboBox, {

	minValue : undefined,

	maxValue : undefined,

	minText : "The time in this field must be equal to or after {0}",

	maxText : "The time in this field must be equal to or before {0}",

	invalidText : "{0} is not a valid time",

	format : "g:i A",

	altFormats : "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H",

	increment: 15,


	mode: 'local',

	triggerAction: 'all',

	typeAhead: false,




	initDate: '1/1/2008',


	initComponent : function(){
		if(Ext.isDefined(this.minValue)){
			this.setMinValue(this.minValue, true);
		}
		if(Ext.isDefined(this.maxValue)){
			this.setMaxValue(this.maxValue, true);
		}
		if(!this.store){
			this.generateStore(true);
		}
		Ext.form.TimeField.superclass.initComponent.call(this);
	},


	setMinValue: function(value,  initial){
		this.setLimit(value, true, initial);
		return this;
	},


	setMaxValue: function(value,  initial){
		this.setLimit(value, false, initial);
		return this;
	},


	generateStore: function(initial){
		var min = this.minValue || new Date(this.initDate).clearTime(),
			max = this.maxValue || new Date(this.initDate).clearTime().add('mi', (24 * 60) - 1),
			times = [];

		while(min <= max){
			times.push(min.dateFormat(this.format));
			min = min.add('mi', this.increment);
		}
		this.bindStore(times, initial);
	},


	setLimit: function(value, isMin, initial){
		var d;
		if(Ext.isString(value)){
			d = this.parseDate(value);
		}else if(Ext.isDate(value)){
			d = value;
		}
		if(d){
			var val = new Date(this.initDate).clearTime();
			val.setHours(d.getHours(), d.getMinutes(), isMin ? 0 : 59, 0);
			this[isMin ? 'minValue' : 'maxValue'] = val;
			if(!initial){
				this.generateStore();
			}
		}
	},


	getValue : function(){
		var v = Ext.form.TimeField.superclass.getValue.call(this);
		return this.formatDate(this.parseDate(v)) || '';
	},


	setValue : function(value){
		return Ext.form.TimeField.superclass.setValue.call(this, this.formatDate(this.parseDate(value)));
	},


	validateValue : Ext.form.DateField.prototype.validateValue,
	parseDate : Ext.form.DateField.prototype.parseDate,
	formatDate : Ext.form.DateField.prototype.formatDate,


	beforeBlur : function(){
		var v = this.parseDate(this.getRawValue());
		if(v){
			this.setValue(v.dateFormat(this.format));
		}
		Ext.form.TimeField.superclass.beforeBlur.call(this);
	}





});
Ext.reg('timefield', Ext.form.TimeField);
Ext.form.Label = Ext.extend(Ext.BoxComponent, {





	onRender : function(ct, position){
		if(!this.el){
			this.el = document.createElement('label');
			this.el.id = this.getId();
			this.el.innerHTML = this.text ? Ext.util.Format.htmlEncode(this.text) : (this.html || '');
			if(this.forId){
				this.el.setAttribute('for', this.forId);
			}
		}
		Ext.form.Label.superclass.onRender.call(this, ct, position);
	},


	setText : function(t, encode){
		var e = encode === false;
		this[!e ? 'text' : 'html'] = t;
		delete this[e ? 'text' : 'html'];
		if(this.rendered){
			this.el.dom.innerHTML = encode !== false ? Ext.util.Format.htmlEncode(t) : t;
		}
		return this;
	}
});

Ext.reg('label', Ext.form.Label);
Ext.form.Action = function(form, options){
	this.form = form;
	this.options = options || {};
};


Ext.form.Action.CLIENT_INVALID = 'client';

Ext.form.Action.SERVER_INVALID = 'server';

Ext.form.Action.CONNECT_FAILURE = 'connect';

Ext.form.Action.LOAD_FAILURE = 'load';

Ext.form.Action.prototype = {












	type : 'default',





	run : function(options){

	},


	success : function(response){

	},


	handleResponse : function(response){

	},


	failure : function(response){
		this.response = response;
		this.failureType = Ext.form.Action.CONNECT_FAILURE;
		this.form.afterAction(this, false);
	},




	processResponse : function(response){
		this.response = response;
		if(!response.responseText && !response.responseXML){
			return true;
		}
		this.result = this.handleResponse(response);
		return this.result;
	},


	getUrl : function(appendParams){
		var url = this.options.url || this.form.url || this.form.el.dom.action;
		if(appendParams){
			var p = this.getParams();
			if(p){
				url = Ext.urlAppend(url, p);
			}
		}
		return url;
	},


	getMethod : function(){
		return (this.options.method || this.form.method || this.form.el.dom.method || 'POST').toUpperCase();
	},


	getParams : function(){
		var bp = this.form.baseParams;
		var p = this.options.params;
		if(p){
			if(typeof p == "object"){
				p = Ext.urlEncode(Ext.applyIf(p, bp));
			}else if(typeof p == 'string' && bp){
				p += '&' + Ext.urlEncode(bp);
			}
		}else if(bp){
			p = Ext.urlEncode(bp);
		}
		return p;
	},


	createCallback : function(opts){
		var opts = opts || {};
		return {
			success: this.success,
			failure: this.failure,
			scope: this,
			timeout: (opts.timeout*1000) || (this.form.timeout*1000),
			upload: this.form.fileUpload ? this.success : undefined
		};
	}
};


Ext.form.Action.Submit = function(form, options){
	Ext.form.Action.Submit.superclass.constructor.call(this, form, options);
};

Ext.extend(Ext.form.Action.Submit, Ext.form.Action, {


	type : 'submit',


	run : function(){
		var o = this.options;
		var method = this.getMethod();
		var isGet = method == 'GET';
		if(o.clientValidation === false || this.form.isValid()){
			Ext.Ajax.request(Ext.apply(this.createCallback(o), {
				form:this.form.el.dom,
				url:this.getUrl(isGet),
				method: method,
				headers: o.headers,
				params:!isGet ? this.getParams() : null,
				isUpload: this.form.fileUpload
			}));
		}else if (o.clientValidation !== false){
			this.failureType = Ext.form.Action.CLIENT_INVALID;
			this.form.afterAction(this, false);
		}
	},


	success : function(response){
		var result = this.processResponse(response);
		if(result === true || result.success){
			this.form.afterAction(this, true);
			return;
		}
		if(result.errors){
			this.form.markInvalid(result.errors);
		}
		this.failureType = Ext.form.Action.SERVER_INVALID;
		this.form.afterAction(this, false);
	},


	handleResponse : function(response){
		if(this.form.errorReader){
			var rs = this.form.errorReader.read(response);
			var errors = [];
			if(rs.records){
				for(var i = 0, len = rs.records.length; i < len; i++) {
					var r = rs.records[i];
					errors[i] = r.data;
				}
			}
			if(errors.length < 1){
				errors = null;
			}
			return {
				success : rs.success,
				errors : errors
			};
		}
		return Ext.decode(response.responseText);
	}
});



Ext.form.Action.Load = function(form, options){
	Ext.form.Action.Load.superclass.constructor.call(this, form, options);
	this.reader = this.form.reader;
};

Ext.extend(Ext.form.Action.Load, Ext.form.Action, {

	type : 'load',


	run : function(){
		Ext.Ajax.request(Ext.apply(
			this.createCallback(this.options), {
				method:this.getMethod(),
				url:this.getUrl(false),
				headers: this.options.headers,
				params:this.getParams()
			}));
	},


	success : function(response){
		var result = this.processResponse(response);
		if(result === true || !result.success || !result.data){
			this.failureType = Ext.form.Action.LOAD_FAILURE;
			this.form.afterAction(this, false);
			return;
		}
		this.form.clearInvalid();
		this.form.setValues(result.data);
		this.form.afterAction(this, true);
	},


	handleResponse : function(response){
		if(this.form.reader){
			var rs = this.form.reader.read(response);
			var data = rs.records && rs.records[0] ? rs.records[0].data : null;
			return {
				success : rs.success,
				data : data
			};
		}
		return Ext.decode(response.responseText);
	}
});




Ext.form.Action.DirectLoad = Ext.extend(Ext.form.Action.Load, {
	constructor: function(form, opts) {
		Ext.form.Action.DirectLoad.superclass.constructor.call(this, form, opts);
	},
	type : 'directload',

	run : function(){
		var args = this.getParams();
		args.push(this.success, this);
		this.form.api.load.apply(window, args);
	},

	getParams : function() {
		var buf = [], o = {};
		var bp = this.form.baseParams;
		var p = this.options.params;
		Ext.apply(o, p, bp);
		var paramOrder = this.form.paramOrder;
		if(paramOrder){
			for(var i = 0, len = paramOrder.length; i < len; i++){
				buf.push(o[paramOrder[i]]);
			}
		}else if(this.form.paramsAsHash){
			buf.push(o);
		}
		return buf;
	},



	processResponse : function(result) {
		this.result = result;
		return result;
	},

	success : function(response, trans){
		if(trans.type == Ext.Direct.exceptions.SERVER){
			response = {};
		}
		Ext.form.Action.DirectLoad.superclass.success.call(this, response);
	}
});


Ext.form.Action.DirectSubmit = Ext.extend(Ext.form.Action.Submit, {
	constructor : function(form, opts) {
		Ext.form.Action.DirectSubmit.superclass.constructor.call(this, form, opts);
	},
	type : 'directsubmit',

	run : function(){
		var o = this.options;
		if(o.clientValidation === false || this.form.isValid()){


			this.success.params = this.getParams();
			this.form.api.submit(this.form.el.dom, this.success, this);
		}else if (o.clientValidation !== false){
			this.failureType = Ext.form.Action.CLIENT_INVALID;
			this.form.afterAction(this, false);
		}
	},

	getParams : function() {
		var o = {};
		var bp = this.form.baseParams;
		var p = this.options.params;
		Ext.apply(o, p, bp);
		return o;
	},



	processResponse : function(result) {
		this.result = result;
		return result;
	},

	success : function(response, trans){
		if(trans.type == Ext.Direct.exceptions.SERVER){
			response = {};
		}
		Ext.form.Action.DirectSubmit.superclass.success.call(this, response);
	}
});

Ext.form.Action.ACTION_TYPES = {
	'load' : Ext.form.Action.Load,
	'submit' : Ext.form.Action.Submit,
	'directload' : Ext.form.Action.DirectLoad,
	'directsubmit' : Ext.form.Action.DirectSubmit
};

Ext.form.VTypes = function(){

	var alpha = /^[a-zA-Z_]+$/,
		alphanum = /^[a-zA-Z0-9_]+$/,
		email = /^(\w+)([\-+.][\w]+)*@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/,
		url = /(((^https?)|(^ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i;


	return {

		'email' : function(v){
			return email.test(v);
		},

		'emailText' : 'This field should be an e-mail address in the format "user@example.com"',

		'emailMask' : /[a-z0-9_\.\-@]/i,


		'url' : function(v){
			return url.test(v);
		},

		'urlText' : 'This field should be a URL in the format "http:/'+'/www.example.com"',


		'alpha' : function(v){
			return alpha.test(v);
		},

		'alphaText' : 'This field should only contain letters and _',

		'alphaMask' : /[a-z_]/i,


		'alphanum' : function(v){
			return alphanum.test(v);
		},

		'alphanumText' : 'This field should only contain letters, numbers and _',

		'alphanumMask' : /[a-z0-9_]/i
	};
}();
Ext.grid.GridPanel = Ext.extend(Ext.Panel, {

	autoExpandColumn : false,

	autoExpandMax : 1000,

	autoExpandMin : 50,

	columnLines : false,





	ddText : '{0} selected row{1}',

	deferRowRender : true,



	enableColumnHide : true,

	enableColumnMove : true,

	enableDragDrop : false,

	enableHdMenu : true,


	loadMask : false,


	minColumnWidth : 25,




	stripeRows : false,

	trackMouseOver : true,

	stateEvents : ['columnmove', 'columnresize', 'sortchange'],

	view : null,


	bubbleEvents: [],




	rendered : false,

	viewReady : false,


	initComponent : function(){
		Ext.grid.GridPanel.superclass.initComponent.call(this);

		if(this.columnLines){
			this.cls = (this.cls || '') + ' x-grid-with-col-lines';
		}


		this.autoScroll = false;
		this.autoWidth = false;

		if(Ext.isArray(this.columns)){
			this.colModel = new Ext.grid.ColumnModel(this.columns);
			delete this.columns;
		}


		if(this.ds){
			this.store = this.ds;
			delete this.ds;
		}
		if(this.cm){
			this.colModel = this.cm;
			delete this.cm;
		}
		if(this.sm){
			this.selModel = this.sm;
			delete this.sm;
		}
		this.store = Ext.StoreMgr.lookup(this.store);

		this.addEvents(


			'click',

			'dblclick',

			'contextmenu',

			'mousedown',

			'mouseup',

			'mouseover',

			'mouseout',

			'keypress',

			'keydown',



			'cellmousedown',

			'rowmousedown',

			'headermousedown',


			'groupmousedown',


			'rowbodymousedown',


			'containermousedown',


			'cellclick',

			'celldblclick',

			'rowclick',

			'rowdblclick',

			'headerclick',

			'headerdblclick',

			'groupclick',

			'groupdblclick',

			'containerclick',

			'containerdblclick',


			'rowbodyclick',

			'rowbodydblclick',


			'rowcontextmenu',

			'cellcontextmenu',

			'headercontextmenu',

			'groupcontextmenu',

			'containercontextmenu',

			'rowbodycontextmenu',

			'bodyscroll',

			'columnresize',

			'columnmove',

			'sortchange',

			'reconfigure',

			'viewready'
		);
	},


	onRender : function(ct, position){
		Ext.grid.GridPanel.superclass.onRender.apply(this, arguments);

		var c = this.getGridEl();

		this.el.addClass('x-grid-panel');

		this.mon(c, {
			scope: this,
			mousedown: this.onMouseDown,
			click: this.onClick,
			dblclick: this.onDblClick,
			contextmenu: this.onContextMenu
		});

		this.relayEvents(c, ['mousedown','mouseup','mouseover','mouseout','keypress', 'keydown']);

		var view = this.getView();
		view.init(this);
		view.render();
		this.getSelectionModel().init(this);
	},


	initEvents : function(){
		Ext.grid.GridPanel.superclass.initEvents.call(this);

		if(this.loadMask){
			this.loadMask = new Ext.LoadMask(this.bwrap,
				Ext.apply({store:this.store}, this.loadMask));
		}
	},

	initStateEvents : function(){
		Ext.grid.GridPanel.superclass.initStateEvents.call(this);
		this.mon(this.colModel, 'hiddenchange', this.saveState, this, {delay: 100});
	},

	applyState : function(state){
		var cm = this.colModel,
			cs = state.columns;
		if(cs){
			for(var i = 0, len = cs.length; i < len; i++){
				var s = cs[i],
					c = cm.getColumnById(s.id);
				if(c){
					c.hidden = s.hidden;
					c.width = s.width;
					var oldIndex = cm.getIndexById(s.id);
					if(oldIndex != i){
						cm.moveColumn(oldIndex, i);
					}
				}
			}
		}
		if(state.sort && this.store){
			this.store[this.store.remoteSort ? 'setDefaultSort' : 'sort'](state.sort.field, state.sort.direction);
		}
		var o = Ext.apply({}, state);
		delete o.columns;
		delete o.sort;
		Ext.grid.GridPanel.superclass.applyState.call(this, o);
	},

	getState : function(){
		var o = {columns: []};
		for(var i = 0, c; (c = this.colModel.config[i]); i++){
			o.columns[i] = {
				id: c.id,
				width: c.width
			};
			if(c.hidden){
				o.columns[i].hidden = true;
			}
		}
		if(this.store){
			var ss = this.store.getSortState();
			if(ss){
				o.sort = ss;
			}
		}
		return o;
	},


	afterRender : function(){
		Ext.grid.GridPanel.superclass.afterRender.call(this);
		var v = this.view;
		this.on('bodyresize', v.layout, v);
		v.layout();
		if(this.deferRowRender){
			v.afterRender.defer(10, this.view);
		}else{
			v.afterRender();
		}
		this.viewReady = true;
	},


	reconfigure : function(store, colModel){
		var rendered = this.rendered;
		if(rendered){
			if(this.loadMask){
				this.loadMask.destroy();
				this.loadMask = new Ext.LoadMask(this.bwrap,
					Ext.apply({}, {store:store}, this.initialConfig.loadMask));
			}
		}
		if(this.view){
			this.view.initData(store, colModel);
		}
		this.store = store;
		this.colModel = colModel;
		if(rendered){
			this.view.refresh(true);
		}
		this.fireEvent('reconfigure', this, store, colModel);
	},


	onDestroy : function(){
		if(this.rendered){
			Ext.destroy(this.view, this.loadMask);
		}else if(this.store && this.store.autoDestroy){
			this.store.destroy();
		}
		Ext.destroy(this.colModel, this.selModel);
		this.store = this.selModel = this.colModel = this.view = this.loadMask = null;
		Ext.grid.GridPanel.superclass.onDestroy.call(this);
	},


	processEvent : function(name, e){
		this.fireEvent(name, e);
		var t = e.getTarget(),
			v = this.view,
			header = v.findHeaderIndex(t);

		if(header !== false){
			this.fireEvent('header' + name, this, header, e);
		}else{
			var row = v.findRowIndex(t),
				cell,
				body;
			if(row !== false){
				this.fireEvent('row' + name, this, row, e);
				cell = v.findCellIndex(t);
				body = v.findRowBody(t);
				if(cell !== false){
					this.fireEvent('cell' + name, this, row, cell, e);
				}
				if(body){
					this.fireEvent('rowbody' + name, this, row, e);
				}
			}else{
				this.fireEvent('container' + name, this, e);
			}
		}
		this.view.processEvent(name, e);
	},


	onClick : function(e){
		this.processEvent('click', e);
	},


	onMouseDown : function(e){
		this.processEvent('mousedown', e);
	},


	onContextMenu : function(e, t){
		this.processEvent('contextmenu', e);
	},


	onDblClick : function(e){
		this.processEvent('dblclick', e);
	},


	walkCells : function(row, col, step, fn, scope){
		var cm = this.colModel,
			clen = cm.getColumnCount(),
			ds = this.store,
			rlen = ds.getCount(),
			first = true;
		if(step < 0){
			if(col < 0){
				row--;
				first = false;
			}
			while(row >= 0){
				if(!first){
					col = clen-1;
				}
				first = false;
				while(col >= 0){
					if(fn.call(scope || this, row, col, cm) === true){
						return [row, col];
					}
					col--;
				}
				row--;
			}
		} else {
			if(col >= clen){
				row++;
				first = false;
			}
			while(row < rlen){
				if(!first){
					col = 0;
				}
				first = false;
				while(col < clen){
					if(fn.call(scope || this, row, col, cm) === true){
						return [row, col];
					}
					col++;
				}
				row++;
			}
		}
		return null;
	},


	onResize : function(){
		Ext.grid.GridPanel.superclass.onResize.apply(this, arguments);
		if(this.viewReady){
			this.view.layout();
		}
	},


	getGridEl : function(){
		return this.body;
	},


	stopEditing : Ext.emptyFn,


	getSelectionModel : function(){
		if(!this.selModel){
			this.selModel = new Ext.grid.RowSelectionModel(
				this.disableSelection ? {selectRow: Ext.emptyFn} : null);
		}
		return this.selModel;
	},


	getStore : function(){
		return this.store;
	},


	getColumnModel : function(){
		return this.colModel;
	},


	getView : function(){
		if(!this.view){
			this.view = new Ext.grid.GridView(this.viewConfig);
		}
		return this.view;
	},

	getDragDropText : function(){
		var count = this.selModel.getCount();
		return String.format(this.ddText, count, count == 1 ? '' : 's');
	}



















































});
Ext.reg('grid', Ext.grid.GridPanel);
Ext.grid.GridView = Ext.extend(Ext.util.Observable, {






	deferEmptyText : true,

	scrollOffset : undefined,

	autoFill : false,

	forceFit : false,

	sortClasses : ['sort-asc', 'sort-desc'],

	sortAscText : 'Sort Ascending',

	sortDescText : 'Sort Descending',

	columnsText : 'Columns',


	selectedRowClass : 'x-grid3-row-selected',


	borderWidth : 2,
	tdClass : 'x-grid3-cell',
	hdCls : 'x-grid3-hd',
	markDirty : true,


	cellSelectorDepth : 4,

	rowSelectorDepth : 10,


	rowBodySelectorDepth : 10,


	cellSelector : 'td.x-grid3-cell',

	rowSelector : 'div.x-grid3-row',


	rowBodySelector : 'div.x-grid3-row-body',


	firstRowCls: 'x-grid3-row-first',
	lastRowCls: 'x-grid3-row-last',
	rowClsRe: /(?:^|\s+)x-grid3-row-(first|last|alt)(?:\s+|$)/g,

	constructor : function(config){
		Ext.apply(this, config);

		this.addEvents(

			'beforerowremoved',

			'beforerowsinserted',

			'beforerefresh',

			'rowremoved',

			'rowsinserted',

			'rowupdated',

			'refresh'
		);
		Ext.grid.GridView.superclass.constructor.call(this);
	},




	initTemplates : function(){
		var ts = this.templates || {};
		if(!ts.master){
			ts.master = new Ext.Template(
				'<div class="x-grid3" hidefocus="true">',
				'<div class="x-grid3-viewport">',
				'<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset" style="{ostyle}">{header}</div></div><div class="x-clear"></div></div>',
				'<div class="x-grid3-scroller"><div class="x-grid3-body" style="{bstyle}">{body}</div><a href="#" class="x-grid3-focus" tabIndex="-1"></a></div>',
				'</div>',
				'<div class="x-grid3-resize-marker">&#160;</div>',
				'<div class="x-grid3-resize-proxy">&#160;</div>',
				'</div>'
			);
		}

		if(!ts.header){
			ts.header = new Ext.Template(
				'<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
				'<thead><tr class="x-grid3-hd-row">{cells}</tr></thead>',
				'</table>'
			);
		}

		if(!ts.hcell){
			ts.hcell = new Ext.Template(
				'<td class="x-grid3-hd x-grid3-cell x-grid3-td-{id} {css}" style="{style}"><div {tooltip} {attr} class="x-grid3-hd-inner x-grid3-hd-{id}" unselectable="on" style="{istyle}">', this.grid.enableHdMenu ? '<a class="x-grid3-hd-btn" href="#"></a>' : '',
				'{value}<img class="x-grid3-sort-icon" src="', Ext.BLANK_IMAGE_URL, '" />',
				'</div></td>'
			);
		}

		if(!ts.body){
			ts.body = new Ext.Template('{rows}');
		}

		if(!ts.row){
			ts.row = new Ext.Template(
				'<div class="x-grid3-row {alt}" style="{tstyle}"><table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
				'<tbody><tr>{cells}</tr>',
				(this.enableRowBody ? '<tr class="x-grid3-row-body-tr" style="{bodyStyle}"><td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on"><div class="x-grid3-row-body">{body}</div></td></tr>' : ''),
				'</tbody></table></div>'
			);
		}

		if(!ts.cell){
			ts.cell = new Ext.Template(
				'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
				'<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on" {attr}>{value}</div>',
				'</td>'
			);
		}

		for(var k in ts){
			var t = ts[k];
			if(t && Ext.isFunction(t.compile) && !t.compiled){
				t.disableFormats = true;
				t.compile();
			}
		}

		this.templates = ts;
		this.colRe = new RegExp('x-grid3-td-([^\\s]+)', '');
	},


	fly : function(el){
		if(!this._flyweight){
			this._flyweight = new Ext.Element.Flyweight(document.body);
		}
		this._flyweight.dom = el;
		return this._flyweight;
	},


	getEditorParent : function(){
		return this.scroller.dom;
	},


	initElements : function(){
		var E = Ext.Element;

		var el = this.grid.getGridEl().dom.firstChild;
		var cs = el.childNodes;

		this.el = new E(el);

		this.mainWrap = new E(cs[0]);
		this.mainHd = new E(this.mainWrap.dom.firstChild);

		if(this.grid.hideHeaders){
			this.mainHd.setDisplayed(false);
		}

		this.innerHd = this.mainHd.dom.firstChild;
		this.scroller = new E(this.mainWrap.dom.childNodes[1]);
		if(this.forceFit){
			this.scroller.setStyle('overflow-x', 'hidden');
		}

		this.mainBody = new E(this.scroller.dom.firstChild);

		this.focusEl = new E(this.scroller.dom.childNodes[1]);
		this.focusEl.swallowEvent('click', true);

		this.resizeMarker = new E(cs[1]);
		this.resizeProxy = new E(cs[2]);
	},


	getRows : function(){
		return this.hasRows() ? this.mainBody.dom.childNodes : [];
	},




	findCell : function(el){
		if(!el){
			return false;
		}
		return this.fly(el).findParent(this.cellSelector, this.cellSelectorDepth);
	},


	findCellIndex : function(el, requiredCls){
		var cell = this.findCell(el);
		if(cell && (!requiredCls || this.fly(cell).hasClass(requiredCls))){
			return this.getCellIndex(cell);
		}
		return false;
	},


	getCellIndex : function(el){
		if(el){
			var m = el.className.match(this.colRe);
			if(m && m[1]){
				return this.cm.getIndexById(m[1]);
			}
		}
		return false;
	},


	findHeaderCell : function(el){
		var cell = this.findCell(el);
		return cell && this.fly(cell).hasClass(this.hdCls) ? cell : null;
	},


	findHeaderIndex : function(el){
		return this.findCellIndex(el, this.hdCls);
	},


	findRow : function(el){
		if(!el){
			return false;
		}
		return this.fly(el).findParent(this.rowSelector, this.rowSelectorDepth);
	},


	findRowIndex : function(el){
		var r = this.findRow(el);
		return r ? r.rowIndex : false;
	},


	findRowBody : function(el){
		if(!el){
			return false;
		}
		return this.fly(el).findParent(this.rowBodySelector, this.rowBodySelectorDepth);
	},




	getRow : function(row){
		return this.getRows()[row];
	},


	getCell : function(row, col){
		return this.getRow(row).getElementsByTagName('td')[col];
	},


	getHeaderCell : function(index){
		return this.mainHd.dom.getElementsByTagName('td')[index];
	},




	addRowClass : function(row, cls){
		var r = this.getRow(row);
		if(r){
			this.fly(r).addClass(cls);
		}
	},


	removeRowClass : function(row, cls){
		var r = this.getRow(row);
		if(r){
			this.fly(r).removeClass(cls);
		}
	},


	removeRow : function(row){
		Ext.removeNode(this.getRow(row));
		this.syncFocusEl(row);
	},


	removeRows : function(firstRow, lastRow){
		var bd = this.mainBody.dom;
		for(var rowIndex = firstRow; rowIndex <= lastRow; rowIndex++){
			Ext.removeNode(bd.childNodes[firstRow]);
		}
		this.syncFocusEl(firstRow);
	},




	getScrollState : function(){
		var sb = this.scroller.dom;
		return {left: sb.scrollLeft, top: sb.scrollTop};
	},


	restoreScroll : function(state){
		var sb = this.scroller.dom;
		sb.scrollLeft = state.left;
		sb.scrollTop = state.top;
	},


	scrollToTop : function(){
		this.scroller.dom.scrollTop = 0;
		this.scroller.dom.scrollLeft = 0;
	},


	syncScroll : function(){
		this.syncHeaderScroll();
		var mb = this.scroller.dom;
		this.grid.fireEvent('bodyscroll', mb.scrollLeft, mb.scrollTop);
	},


	syncHeaderScroll : function(){
		var mb = this.scroller.dom;
		this.innerHd.scrollLeft = mb.scrollLeft;
		this.innerHd.scrollLeft = mb.scrollLeft;
	},


	updateSortIcon : function(col, dir){
		var sc = this.sortClasses;
		var hds = this.mainHd.select('td').removeClass(sc);
		hds.item(col).addClass(sc[dir == 'DESC' ? 1 : 0]);
	},


	updateAllColumnWidths : function(){
		var tw = this.getTotalWidth(),
			clen = this.cm.getColumnCount(),
			ws = [],
			len,
			i;
		for(i = 0; i < clen; i++){
			ws[i] = this.getColumnWidth(i);
		}
		this.innerHd.firstChild.style.width = this.getOffsetWidth();
		this.innerHd.firstChild.firstChild.style.width = tw;
		this.mainBody.dom.style.width = tw;
		for(i = 0; i < clen; i++){
			var hd = this.getHeaderCell(i);
			hd.style.width = ws[i];
		}

		var ns = this.getRows(), row, trow;
		for(i = 0, len = ns.length; i < len; i++){
			row = ns[i];
			row.style.width = tw;
			if(row.firstChild){
				row.firstChild.style.width = tw;
				trow = row.firstChild.rows[0];
				for (var j = 0; j < clen; j++) {
					trow.childNodes[j].style.width = ws[j];
				}
			}
		}

		this.onAllColumnWidthsUpdated(ws, tw);
	},


	updateColumnWidth : function(col, width){
		var w = this.getColumnWidth(col);
		var tw = this.getTotalWidth();
		this.innerHd.firstChild.style.width = this.getOffsetWidth();
		this.innerHd.firstChild.firstChild.style.width = tw;
		this.mainBody.dom.style.width = tw;
		var hd = this.getHeaderCell(col);
		hd.style.width = w;

		var ns = this.getRows(), row;
		for(var i = 0, len = ns.length; i < len; i++){
			row = ns[i];
			row.style.width = tw;
			if(row.firstChild){
				row.firstChild.style.width = tw;
				row.firstChild.rows[0].childNodes[col].style.width = w;
			}
		}

		this.onColumnWidthUpdated(col, w, tw);
	},


	updateColumnHidden : function(col, hidden){
		var tw = this.getTotalWidth();
		this.innerHd.firstChild.style.width = this.getOffsetWidth();
		this.innerHd.firstChild.firstChild.style.width = tw;
		this.mainBody.dom.style.width = tw;
		var display = hidden ? 'none' : '';

		var hd = this.getHeaderCell(col);
		hd.style.display = display;

		var ns = this.getRows(), row;
		for(var i = 0, len = ns.length; i < len; i++){
			row = ns[i];
			row.style.width = tw;
			if(row.firstChild){
				row.firstChild.style.width = tw;
				row.firstChild.rows[0].childNodes[col].style.display = display;
			}
		}

		this.onColumnHiddenUpdated(col, hidden, tw);
		delete this.lastViewWidth;
		this.layout();
	},


	doRender : function(cs, rs, ds, startRow, colCount, stripe){
		var ts = this.templates, ct = ts.cell, rt = ts.row, last = colCount-1;
		var tstyle = 'width:'+this.getTotalWidth()+';';

		var buf = [], cb, c, p = {}, rp = {tstyle: tstyle}, r;
		for(var j = 0, len = rs.length; j < len; j++){
			r = rs[j]; cb = [];
			var rowIndex = (j+startRow);
			for(var i = 0; i < colCount; i++){
				c = cs[i];
				p.id = c.id;
				p.css = i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
				p.attr = p.cellAttr = '';
				p.value = c.renderer.call(c.scope, r.data[c.name], p, r, rowIndex, i, ds);
				p.style = c.style;
				if(Ext.isEmpty(p.value)){
					p.value = '&#160;';
				}
				if(this.markDirty && r.dirty && Ext.isDefined(r.modified[c.name])){
					p.css += ' x-grid3-dirty-cell';
				}
				cb[cb.length] = ct.apply(p);
			}
			var alt = [];
			if(stripe && ((rowIndex+1) % 2 === 0)){
				alt[0] = 'x-grid3-row-alt';
			}
			if(r.dirty){
				alt[1] = ' x-grid3-dirty-row';
			}
			rp.cols = colCount;
			if(this.getRowClass){
				alt[2] = this.getRowClass(r, rowIndex, rp, ds);
			}
			rp.alt = alt.join(' ');
			rp.cells = cb.join('');
			buf[buf.length] =  rt.apply(rp);
		}
		return buf.join('');
	},


	processRows : function(startRow, skipStripe){
		if(!this.ds || this.ds.getCount() < 1){
			return;
		}
		var rows = this.getRows(),
			len = rows.length,
			i, r;

		skipStripe = skipStripe || !this.grid.stripeRows;
		startRow = startRow || 0;
		for(i = 0; i<len; i++) {
			r = rows[i];
			if(r) {
				r.rowIndex = i;
				if(!skipStripe){
					r.className = r.className.replace(this.rowClsRe, ' ');
					if ((i + 1) % 2 === 0){
						r.className += ' x-grid3-row-alt';
					}
				}
			}
		}

		if(startRow === 0){
			Ext.fly(rows[0]).addClass(this.firstRowCls);
		}
		Ext.fly(rows[rows.length - 1]).addClass(this.lastRowCls);
	},

	afterRender : function(){
		if(!this.ds || !this.cm){
			return;
		}
		this.mainBody.dom.innerHTML = this.renderRows() || '&#160;';
		this.processRows(0, true);

		if(this.deferEmptyText !== true){
			this.applyEmptyText();
		}
		this.grid.fireEvent('viewready', this.grid);
	},


	renderUI : function(){

		var header = this.renderHeaders();
		var body = this.templates.body.apply({rows:'&#160;'});


		var html = this.templates.master.apply({
			body: body,
			header: header,
			ostyle: 'width:'+this.getOffsetWidth()+';',
			bstyle: 'width:'+this.getTotalWidth()+';'
		});

		var g = this.grid;

		g.getGridEl().dom.innerHTML = html;

		this.initElements();


		Ext.fly(this.innerHd).on('click', this.handleHdDown, this);
		this.mainHd.on({
			scope: this,
			mouseover: this.handleHdOver,
			mouseout: this.handleHdOut,
			mousemove: this.handleHdMove
		});

		this.scroller.on('scroll', this.syncScroll,  this);
		if(g.enableColumnResize !== false){
			this.splitZone = new Ext.grid.GridView.SplitDragZone(g, this.mainHd.dom);
		}

		if(g.enableColumnMove){
			this.columnDrag = new Ext.grid.GridView.ColumnDragZone(g, this.innerHd);
			this.columnDrop = new Ext.grid.HeaderDropZone(g, this.mainHd.dom);
		}

		if(g.enableHdMenu !== false){
			this.hmenu = new Ext.menu.Menu({id: g.id + '-hctx'});
			this.hmenu.add(
				{itemId:'asc', text: this.sortAscText, cls: 'xg-hmenu-sort-asc'},
				{itemId:'desc', text: this.sortDescText, cls: 'xg-hmenu-sort-desc'}
			);
			if(g.enableColumnHide !== false){
				this.colMenu = new Ext.menu.Menu({id:g.id + '-hcols-menu'});
				this.colMenu.on({
					scope: this,
					beforeshow: this.beforeColMenuShow,
					itemclick: this.handleHdMenuClick
				});
				this.hmenu.add('-', {
					itemId:'columns',
					hideOnClick: false,
					text: this.columnsText,
					menu: this.colMenu,
					iconCls: 'x-cols-icon'
				});
			}
			this.hmenu.on('itemclick', this.handleHdMenuClick, this);
		}

		if(g.trackMouseOver){
			this.mainBody.on({
				scope: this,
				mouseover: this.onRowOver,
				mouseout: this.onRowOut
			});
		}

		if(g.enableDragDrop || g.enableDrag){
			this.dragZone = new Ext.grid.GridDragZone(g, {
				ddGroup : g.ddGroup || 'GridDD'
			});
		}

		this.updateHeaderSortState();

	},


	processEvent: Ext.emptyFn,


	layout : function(){
		if(!this.mainBody){
			return;
		}
		var g = this.grid;
		var c = g.getGridEl();
		var csize = c.getSize(true);
		var vw = csize.width;

		if(!g.hideHeaders && (vw < 20 || csize.height < 20)){
			return;
		}

		if(g.autoHeight){
			this.scroller.dom.style.overflow = 'visible';
			if(Ext.isWebKit){
				this.scroller.dom.style.position = 'static';
			}
		}else{
			this.el.setSize(csize.width, csize.height);

			var hdHeight = this.mainHd.getHeight();
			var vh = csize.height - (hdHeight);

			this.scroller.setSize(vw, vh);
			if(this.innerHd){
				this.innerHd.style.width = (vw)+'px';
			}
		}
		if(this.forceFit){
			if(this.lastViewWidth != vw){
				this.fitColumns(false, false);
				this.lastViewWidth = vw;
			}
		}else {
			this.autoExpand();
			this.syncHeaderScroll();
		}
		this.onLayout(vw, vh);
	},



	onLayout : function(vw, vh){

	},

	onColumnWidthUpdated : function(col, w, tw){

	},

	onAllColumnWidthsUpdated : function(ws, tw){

	},

	onColumnHiddenUpdated : function(col, hidden, tw){

	},

	updateColumnText : function(col, text){

	},

	afterMove : function(colIndex){

	},



	init : function(grid){
		this.grid = grid;

		this.initTemplates();
		this.initData(grid.store, grid.colModel);
		this.initUI(grid);
	},


	getColumnId : function(index){
		return this.cm.getColumnId(index);
	},


	getOffsetWidth : function() {
		return (this.cm.getTotalWidth() + this.getScrollOffset()) + 'px';
	},

	getScrollOffset: function(){
		return Ext.num(this.scrollOffset, Ext.getScrollBarWidth());
	},


	renderHeaders : function(){
		var cm = this.cm,
			ts = this.templates,
			ct = ts.hcell,
			cb = [],
			p = {},
			len = cm.getColumnCount(),
			last = len - 1;

		for(var i = 0; i < len; i++){
			p.id = cm.getColumnId(i);
			p.value = cm.getColumnHeader(i) || '';
			p.style = this.getColumnStyle(i, true);
			p.tooltip = this.getColumnTooltip(i);
			p.css = i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
			if(cm.config[i].align == 'right'){
				p.istyle = 'padding-right:16px';
			} else {
				delete p.istyle;
			}
			cb[cb.length] = ct.apply(p);
		}
		return ts.header.apply({cells: cb.join(''), tstyle:'width:'+this.getTotalWidth()+';'});
	},


	getColumnTooltip : function(i){
		var tt = this.cm.getColumnTooltip(i);
		if(tt){
			if(Ext.QuickTips.isEnabled()){
				return 'ext:qtip="'+tt+'"';
			}else{
				return 'title="'+tt+'"';
			}
		}
		return '';
	},


	beforeUpdate : function(){
		this.grid.stopEditing(true);
	},


	updateHeaders : function(){
		this.innerHd.firstChild.innerHTML = this.renderHeaders();
		this.innerHd.firstChild.style.width = this.getOffsetWidth();
		this.innerHd.firstChild.firstChild.style.width = this.getTotalWidth();
	},


	focusRow : function(row){
		this.focusCell(row, 0, false);
	},


	focusCell : function(row, col, hscroll){
		this.syncFocusEl(this.ensureVisible(row, col, hscroll));
		if(Ext.isGecko){
			this.focusEl.focus();
		}else{
			this.focusEl.focus.defer(1, this.focusEl);
		}
	},

	resolveCell : function(row, col, hscroll){
		if(!Ext.isNumber(row)){
			row = row.rowIndex;
		}
		if(!this.ds){
			return null;
		}
		if(row < 0 || row >= this.ds.getCount()){
			return null;
		}
		col = (col !== undefined ? col : 0);

		var rowEl = this.getRow(row),
			cm = this.cm,
			colCount = cm.getColumnCount(),
			cellEl;
		if(!(hscroll === false && col === 0)){
			while(col < colCount && cm.isHidden(col)){
				col++;
			}
			cellEl = this.getCell(row, col);
		}

		return {row: rowEl, cell: cellEl};
	},

	getResolvedXY : function(resolved){
		if(!resolved){
			return null;
		}
		var s = this.scroller.dom, c = resolved.cell, r = resolved.row;
		return c ? Ext.fly(c).getXY() : [this.el.getX(), Ext.fly(r).getY()];
	},

	syncFocusEl : function(row, col, hscroll){
		var xy = row;
		if(!Ext.isArray(xy)){
			row = Math.min(row, Math.max(0, this.getRows().length-1));
			xy = this.getResolvedXY(this.resolveCell(row, col, hscroll));
		}
		this.focusEl.setXY(xy||this.scroller.getXY());
	},

	ensureVisible : function(row, col, hscroll){
		var resolved = this.resolveCell(row, col, hscroll);
		if(!resolved || !resolved.row){
			return;
		}

		var rowEl = resolved.row,
			cellEl = resolved.cell,
			c = this.scroller.dom,
			ctop = 0,
			p = rowEl,
			stop = this.el.dom;

		while(p && p != stop){
			ctop += p.offsetTop;
			p = p.offsetParent;
		}

		ctop -= this.mainHd.dom.offsetHeight;
		stop = parseInt(c.scrollTop, 10);

		var cbot = ctop + rowEl.offsetHeight,
			ch = c.clientHeight,
			sbot = stop + ch;


		if(ctop < stop){
			c.scrollTop = ctop;
		}else if(cbot > sbot){
			c.scrollTop = cbot-ch;
		}

		if(hscroll !== false){
			var cleft = parseInt(cellEl.offsetLeft, 10);
			var cright = cleft + cellEl.offsetWidth;

			var sleft = parseInt(c.scrollLeft, 10);
			var sright = sleft + c.clientWidth;
			if(cleft < sleft){
				c.scrollLeft = cleft;
			}else if(cright > sright){
				c.scrollLeft = cright-c.clientWidth;
			}
		}
		return this.getResolvedXY(resolved);
	},


	insertRows : function(dm, firstRow, lastRow, isUpdate){
		var last = dm.getCount() - 1;
		if(!isUpdate && firstRow === 0 && lastRow >= last){
			this.fireEvent('beforerowsinserted', this, firstRow, lastRow);
			this.refresh();
			this.fireEvent('rowsinserted', this, firstRow, lastRow);
		}else{
			if(!isUpdate){
				this.fireEvent('beforerowsinserted', this, firstRow, lastRow);
			}
			var html = this.renderRows(firstRow, lastRow),
				before = this.getRow(firstRow);
			if(before){
				if(firstRow === 0){
					Ext.fly(this.getRow(0)).removeClass(this.firstRowCls);
				}
				Ext.DomHelper.insertHtml('beforeBegin', before, html);
			}else{
				var r = this.getRow(last - 1);
				if(r){
					Ext.fly(r).removeClass(this.lastRowCls);
				}
				Ext.DomHelper.insertHtml('beforeEnd', this.mainBody.dom, html);
			}
			if(!isUpdate){
				this.fireEvent('rowsinserted', this, firstRow, lastRow);
				this.processRows(firstRow);
			}else if(firstRow === 0 || firstRow >= last){

				Ext.fly(this.getRow(firstRow)).addClass(firstRow === 0 ? this.firstRowCls : this.lastRowCls);
			}
		}
		this.syncFocusEl(firstRow);
	},


	deleteRows : function(dm, firstRow, lastRow){
		if(dm.getRowCount()<1){
			this.refresh();
		}else{
			this.fireEvent('beforerowsdeleted', this, firstRow, lastRow);

			this.removeRows(firstRow, lastRow);

			this.processRows(firstRow);
			this.fireEvent('rowsdeleted', this, firstRow, lastRow);
		}
	},


	getColumnStyle : function(col, isHeader){
		var style = !isHeader ? (this.cm.config[col].css || '') : '';
		style += 'width:'+this.getColumnWidth(col)+';';
		if(this.cm.isHidden(col)){
			style += 'display:none;';
		}
		var align = this.cm.config[col].align;
		if(align){
			style += 'text-align:'+align+';';
		}
		return style;
	},


	getColumnWidth : function(col){
		var w = this.cm.getColumnWidth(col);
		if(Ext.isNumber(w)){
			return (Ext.isBorderBox || (Ext.isWebKit && !Ext.isSafari2) ? w : (w - this.borderWidth > 0 ? w - this.borderWidth : 0)) + 'px';
		}
		return w;
	},


	getTotalWidth : function(){
		return this.cm.getTotalWidth()+'px';
	},


	fitColumns : function(preventRefresh, onlyExpand, omitColumn){
		var cm = this.cm, i;
		var tw = cm.getTotalWidth(false);
		var aw = this.grid.getGridEl().getWidth(true)-this.getScrollOffset();

		if(aw < 20){
			return;
		}
		var extra = aw - tw;

		if(extra === 0){
			return false;
		}

		var vc = cm.getColumnCount(true);
		var ac = vc-(Ext.isNumber(omitColumn) ? 1 : 0);
		if(ac === 0){
			ac = 1;
			omitColumn = undefined;
		}
		var colCount = cm.getColumnCount();
		var cols = [];
		var extraCol = 0;
		var width = 0;
		var w;
		for (i = 0; i < colCount; i++){
			if(!cm.isHidden(i) && !cm.isFixed(i) && i !== omitColumn){
				w = cm.getColumnWidth(i);
				cols.push(i);
				extraCol = i;
				cols.push(w);
				width += w;
			}
		}
		var frac = (aw - cm.getTotalWidth())/width;
		while (cols.length){
			w = cols.pop();
			i = cols.pop();
			cm.setColumnWidth(i, Math.max(this.grid.minColumnWidth, Math.floor(w + w*frac)), true);
		}

		if((tw = cm.getTotalWidth(false)) > aw){
			var adjustCol = ac != vc ? omitColumn : extraCol;
			cm.setColumnWidth(adjustCol, Math.max(1,
				cm.getColumnWidth(adjustCol)- (tw-aw)), true);
		}

		if(preventRefresh !== true){
			this.updateAllColumnWidths();
		}


		return true;
	},


	autoExpand : function(preventUpdate){
		var g = this.grid, cm = this.cm;
		if(!this.userResized && g.autoExpandColumn){
			var tw = cm.getTotalWidth(false);
			var aw = this.grid.getGridEl().getWidth(true)-this.getScrollOffset();
			if(tw != aw){
				var ci = cm.getIndexById(g.autoExpandColumn);
				var currentWidth = cm.getColumnWidth(ci);
				var cw = Math.min(Math.max(((aw-tw)+currentWidth), g.autoExpandMin), g.autoExpandMax);
				if(cw != currentWidth){
					cm.setColumnWidth(ci, cw, true);
					if(preventUpdate !== true){
						this.updateColumnWidth(ci, cw);
					}
				}
			}
		}
	},


	getColumnData : function(){

		var cs = [], cm = this.cm, colCount = cm.getColumnCount();
		for(var i = 0; i < colCount; i++){
			var name = cm.getDataIndex(i);
			cs[i] = {
				name : (!Ext.isDefined(name) ? this.ds.fields.get(i).name : name),
				renderer : cm.getRenderer(i),
				scope: cm.getRendererScope(i),
				id : cm.getColumnId(i),
				style : this.getColumnStyle(i)
			};
		}
		return cs;
	},


	renderRows : function(startRow, endRow){

		var g = this.grid, cm = g.colModel, ds = g.store, stripe = g.stripeRows;
		var colCount = cm.getColumnCount();

		if(ds.getCount() < 1){
			return '';
		}

		var cs = this.getColumnData();

		startRow = startRow || 0;
		endRow = !Ext.isDefined(endRow) ? ds.getCount()-1 : endRow;


		var rs = ds.getRange(startRow, endRow);

		return this.doRender(cs, rs, ds, startRow, colCount, stripe);
	},


	renderBody : function(){
		var markup = this.renderRows() || '&#160;';
		return this.templates.body.apply({rows: markup});
	},


	refreshRow : function(record){
		var ds = this.ds, index;
		if(Ext.isNumber(record)){
			index = record;
			record = ds.getAt(index);
			if(!record){
				return;
			}
		}else{
			index = ds.indexOf(record);
			if(index < 0){
				return;
			}
		}
		this.insertRows(ds, index, index, true);
		this.getRow(index).rowIndex = index;
		this.onRemove(ds, record, index+1, true);
		this.fireEvent('rowupdated', this, index, record);
	},


	refresh : function(headersToo){
		this.fireEvent('beforerefresh', this);
		this.grid.stopEditing(true);

		var result = this.renderBody();
		this.mainBody.update(result).setWidth(this.getTotalWidth());
		if(headersToo === true){
			this.updateHeaders();
			this.updateHeaderSortState();
		}
		this.processRows(0, true);
		this.layout();
		this.applyEmptyText();
		this.fireEvent('refresh', this);
	},


	applyEmptyText : function(){
		if(this.emptyText && !this.hasRows()){
			this.mainBody.update('<div class="x-grid-empty">' + this.emptyText + '</div>');
		}
	},


	updateHeaderSortState : function(){
		var state = this.ds.getSortState();
		if(!state){
			return;
		}
		if(!this.sortState || (this.sortState.field != state.field || this.sortState.direction != state.direction)){
			this.grid.fireEvent('sortchange', this.grid, state);
		}
		this.sortState = state;
		var sortColumn = this.cm.findColumnIndex(state.field);
		if(sortColumn != -1){
			var sortDir = state.direction;
			this.updateSortIcon(sortColumn, sortDir);
		}
	},


	clearHeaderSortState : function(){
		if(!this.sortState){
			return;
		}
		this.grid.fireEvent('sortchange', this.grid, null);
		this.mainHd.select('td').removeClass(this.sortClasses);
		delete this.sortState;
	},


	destroy : function(){
		if(this.colMenu){
			Ext.menu.MenuMgr.unregister(this.colMenu);
			this.colMenu.destroy();
			delete this.colMenu;
		}
		if(this.hmenu){
			Ext.menu.MenuMgr.unregister(this.hmenu);
			this.hmenu.destroy();
			delete this.hmenu;
		}

		this.initData(null, null);
		this.purgeListeners();
		Ext.fly(this.innerHd).un("click", this.handleHdDown, this);

		if(this.grid.enableColumnMove){
			Ext.destroy(
				this.columnDrag.el,
				this.columnDrag.proxy.ghost,
				this.columnDrag.proxy.el,
				this.columnDrop.el,
				this.columnDrop.proxyTop,
				this.columnDrop.proxyBottom,
				this.columnDrag.dragData.ddel,
				this.columnDrag.dragData.header
			);
			if (this.columnDrag.proxy.anim) {
				Ext.destroy(this.columnDrag.proxy.anim);
			}
			delete this.columnDrag.proxy.ghost;
			delete this.columnDrag.dragData.ddel;
			delete this.columnDrag.dragData.header;
			this.columnDrag.destroy();
			delete Ext.dd.DDM.locationCache[this.columnDrag.id];
			delete this.columnDrag._domRef;

			delete this.columnDrop.proxyTop;
			delete this.columnDrop.proxyBottom;
			this.columnDrop.destroy();
			delete Ext.dd.DDM.locationCache["gridHeader" + this.grid.getGridEl().id];
			delete this.columnDrop._domRef;
			delete Ext.dd.DDM.ids[this.columnDrop.ddGroup];
		}

		if (this.splitZone){
			this.splitZone.destroy();
			delete this.splitZone._domRef;
			delete Ext.dd.DDM.ids["gridSplitters" + this.grid.getGridEl().id];
		}

		Ext.fly(this.innerHd).removeAllListeners();
		Ext.removeNode(this.innerHd);
		delete this.innerHd;

		Ext.destroy(
			this.el,
			this.mainWrap,
			this.mainHd,
			this.scroller,
			this.mainBody,
			this.focusEl,
			this.resizeMarker,
			this.resizeProxy,
			this.activeHdBtn,
			this.dragZone,
			this.splitZone,
			this._flyweight
		);

		delete this.grid.container;

		if(this.dragZone){
			this.dragZone.destroy();
		}

		Ext.dd.DDM.currentTarget = null;
		delete Ext.dd.DDM.locationCache[this.grid.getGridEl().id];

		Ext.EventManager.removeResizeListener(this.onWindowResize, this);
	},


	onDenyColumnHide : function(){

	},


	render : function(){
		if(this.autoFill){
			var ct = this.grid.ownerCt;
			if (ct && ct.getLayout()){
				ct.on('afterlayout', function(){
					this.fitColumns(true, true);
					this.updateHeaders();
				}, this, {single: true});
			}else{
				this.fitColumns(true, true);
			}
		}else if(this.forceFit){
			this.fitColumns(true, false);
		}else if(this.grid.autoExpandColumn){
			this.autoExpand(true);
		}

		this.renderUI();
	},



	initData : function(ds, cm){
		if(this.ds){
			this.ds.un('load', this.onLoad, this);
			this.ds.un('datachanged', this.onDataChange, this);
			this.ds.un('add', this.onAdd, this);
			this.ds.un('remove', this.onRemove, this);
			this.ds.un('update', this.onUpdate, this);
			this.ds.un('clear', this.onClear, this);
			if(this.ds !== ds && this.ds.autoDestroy){
				this.ds.destroy();
			}
		}
		if(ds){
			ds.on({
				scope: this,
				load: this.onLoad,
				datachanged: this.onDataChange,
				add: this.onAdd,
				remove: this.onRemove,
				update: this.onUpdate,
				clear: this.onClear
			});
		}
		this.ds = ds;

		if(this.cm){
			this.cm.un('configchange', this.onColConfigChange, this);
			this.cm.un('widthchange', this.onColWidthChange, this);
			this.cm.un('headerchange', this.onHeaderChange, this);
			this.cm.un('hiddenchange', this.onHiddenChange, this);
			this.cm.un('columnmoved', this.onColumnMove, this);
		}
		if(cm){
			delete this.lastViewWidth;
			cm.on({
				scope: this,
				configchange: this.onColConfigChange,
				widthchange: this.onColWidthChange,
				headerchange: this.onHeaderChange,
				hiddenchange: this.onHiddenChange,
				columnmoved: this.onColumnMove
			});
		}
		this.cm = cm;
	},


	onDataChange : function(){
		this.refresh();
		this.updateHeaderSortState();
		this.syncFocusEl(0);
	},


	onClear : function(){
		this.refresh();
		this.syncFocusEl(0);
	},


	onUpdate : function(ds, record){
		this.refreshRow(record);
	},


	onAdd : function(ds, records, index){

		this.insertRows(ds, index, index + (records.length-1));
	},


	onRemove : function(ds, record, index, isUpdate){
		if(isUpdate !== true){
			this.fireEvent('beforerowremoved', this, index, record);
		}
		this.removeRow(index);
		if(isUpdate !== true){
			this.processRows(index);
			this.applyEmptyText();
			this.fireEvent('rowremoved', this, index, record);
		}
	},


	onLoad : function(){
		this.scrollToTop.defer(Ext.isGecko ? 1 : 0, this);
	},


	onColWidthChange : function(cm, col, width){
		this.updateColumnWidth(col, width);
	},


	onHeaderChange : function(cm, col, text){
		this.updateHeaders();
	},


	onHiddenChange : function(cm, col, hidden){
		this.updateColumnHidden(col, hidden);
	},


	onColumnMove : function(cm, oldIndex, newIndex){
		this.indexMap = null;
		var s = this.getScrollState();
		this.refresh(true);
		this.restoreScroll(s);
		this.afterMove(newIndex);
		this.grid.fireEvent('columnmove', oldIndex, newIndex);
	},


	onColConfigChange : function(){
		delete this.lastViewWidth;
		this.indexMap = null;
		this.refresh(true);
	},



	initUI : function(grid){
		grid.on('headerclick', this.onHeaderClick, this);
	},


	initEvents : function(){
	},


	onHeaderClick : function(g, index){
		if(this.headersDisabled || !this.cm.isSortable(index)){
			return;
		}
		g.stopEditing(true);
		g.store.sort(this.cm.getDataIndex(index));
	},


	onRowOver : function(e, t){
		var row;
		if((row = this.findRowIndex(t)) !== false){
			this.addRowClass(row, 'x-grid3-row-over');
		}
	},


	onRowOut : function(e, t){
		var row;
		if((row = this.findRowIndex(t)) !== false && !e.within(this.getRow(row), true)){
			this.removeRowClass(row, 'x-grid3-row-over');
		}
	},


	handleWheel : function(e){
		e.stopPropagation();
	},


	onRowSelect : function(row){
		this.addRowClass(row, this.selectedRowClass);
	},


	onRowDeselect : function(row){
		this.removeRowClass(row, this.selectedRowClass);
	},


	onCellSelect : function(row, col){
		var cell = this.getCell(row, col);
		if(cell){
			this.fly(cell).addClass('x-grid3-cell-selected');
		}
	},


	onCellDeselect : function(row, col){
		var cell = this.getCell(row, col);
		if(cell){
			this.fly(cell).removeClass('x-grid3-cell-selected');
		}
	},


	onColumnSplitterMoved : function(i, w){
		this.userResized = true;
		var cm = this.grid.colModel;
		cm.setColumnWidth(i, w, true);

		if(this.forceFit){
			this.fitColumns(true, false, i);
			this.updateAllColumnWidths();
		}else{
			this.updateColumnWidth(i, w);
			this.syncHeaderScroll();
		}

		this.grid.fireEvent('columnresize', i, w);
	},


	handleHdMenuClick : function(item){
		var index = this.hdCtxIndex,
			cm = this.cm,
			ds = this.ds,
			id = item.getItemId();
		switch(id){
			case 'asc':
				ds.sort(cm.getDataIndex(index), 'ASC');
				break;
			case 'desc':
				ds.sort(cm.getDataIndex(index), 'DESC');
				break;
			default:
				index = cm.getIndexById(id.substr(4));
				if(index != -1){
					if(item.checked && cm.getColumnsBy(this.isHideableColumn, this).length <= 1){
						this.onDenyColumnHide();
						return false;
					}
					cm.setHidden(index, item.checked);
				}
		}
		return true;
	},


	isHideableColumn : function(c){
		return !c.hidden && !c.fixed;
	},


	beforeColMenuShow : function(){
		var cm = this.cm,  colCount = cm.getColumnCount();
		this.colMenu.removeAll();
		for(var i = 0; i < colCount; i++){
			if(cm.config[i].fixed !== true && cm.config[i].hideable !== false){
				this.colMenu.add(new Ext.menu.CheckItem({
					itemId: 'col-'+cm.getColumnId(i),
					text: cm.getColumnHeader(i),
					checked: !cm.isHidden(i),
					hideOnClick:false,
					disabled: cm.config[i].hideable === false
				}));
			}
		}
	},


	handleHdDown : function(e, t){
		if(Ext.fly(t).hasClass('x-grid3-hd-btn')){
			e.stopEvent();
			var hd = this.findHeaderCell(t);
			Ext.fly(hd).addClass('x-grid3-hd-menu-open');
			var index = this.getCellIndex(hd);
			this.hdCtxIndex = index;
			var ms = this.hmenu.items, cm = this.cm;
			ms.get('asc').setDisabled(!cm.isSortable(index));
			ms.get('desc').setDisabled(!cm.isSortable(index));
			this.hmenu.on('hide', function(){
				Ext.fly(hd).removeClass('x-grid3-hd-menu-open');
			}, this, {single:true});
			this.hmenu.show(t, 'tl-bl?');
		}
	},


	handleHdOver : function(e, t){
		var hd = this.findHeaderCell(t);
		if(hd && !this.headersDisabled){
			this.activeHdRef = t;
			this.activeHdIndex = this.getCellIndex(hd);
			var fly = this.fly(hd);
			this.activeHdRegion = fly.getRegion();
			if(!this.cm.isMenuDisabled(this.activeHdIndex)){
				fly.addClass('x-grid3-hd-over');
				this.activeHdBtn = fly.child('.x-grid3-hd-btn');
				if(this.activeHdBtn){
					this.activeHdBtn.dom.style.height = (hd.firstChild.offsetHeight-1)+'px';
				}
			}
		}
	},


	handleHdMove : function(e, t){
		var hd = this.findHeaderCell(this.activeHdRef);
		if(hd && !this.headersDisabled){
			var hw = this.splitHandleWidth || 5,
				r = this.activeHdRegion,
				x = e.getPageX(),
				ss = hd.style,
				cur = '';
			if(this.grid.enableColumnResize !== false){
				if(x - r.left <= hw && this.cm.isResizable(this.activeHdIndex-1)){
					cur = Ext.isAir ? 'move' : Ext.isWebKit ? 'e-resize' : 'col-resize';
				}else if(r.right - x <= (!this.activeHdBtn ? hw : 2) && this.cm.isResizable(this.activeHdIndex)){
					cur = Ext.isAir ? 'move' : Ext.isWebKit ? 'w-resize' : 'col-resize';
				}
			}
			ss.cursor = cur;
		}
	},


	handleHdOut : function(e, t){
		var hd = this.findHeaderCell(t);
		if(hd && (!Ext.isIE || !e.within(hd, true))){
			this.activeHdRef = null;
			this.fly(hd).removeClass('x-grid3-hd-over');
			hd.style.cursor = '';
		}
	},


	hasRows : function(){
		var fc = this.mainBody.dom.firstChild;
		return fc && fc.nodeType == 1 && fc.className != 'x-grid-empty';
	},


	bind : function(d, c){
		this.initData(d, c);
	}
});




Ext.grid.GridView.SplitDragZone = function(grid, hd){
	this.grid = grid;
	this.view = grid.getView();
	this.marker = this.view.resizeMarker;
	this.proxy = this.view.resizeProxy;
	Ext.grid.GridView.SplitDragZone.superclass.constructor.call(this, hd,
		'gridSplitters' + this.grid.getGridEl().id, {
			dragElId : Ext.id(this.proxy.dom), resizeFrame:false
		});
	this.scroll = false;
	this.hw = this.view.splitHandleWidth || 5;
};
Ext.extend(Ext.grid.GridView.SplitDragZone, Ext.dd.DDProxy, {

	b4StartDrag : function(x, y){
		this.view.headersDisabled = true;
		var h = this.view.mainWrap.getHeight();
		this.marker.setHeight(h);
		this.marker.show();
		this.marker.alignTo(this.view.getHeaderCell(this.cellIndex), 'tl-tl', [-2, 0]);
		this.proxy.setHeight(h);
		var w = this.cm.getColumnWidth(this.cellIndex);
		var minw = Math.max(w-this.grid.minColumnWidth, 0);
		this.resetConstraints();
		this.setXConstraint(minw, 1000);
		this.setYConstraint(0, 0);
		this.minX = x - minw;
		this.maxX = x + 1000;
		this.startPos = x;
		Ext.dd.DDProxy.prototype.b4StartDrag.call(this, x, y);
	},

	allowHeaderDrag : function(e){
		return true;
	},


	handleMouseDown : function(e){
		var t = this.view.findHeaderCell(e.getTarget());
		if(t && this.allowHeaderDrag(e)){
			var xy = this.view.fly(t).getXY(), x = xy[0], y = xy[1];
			var exy = e.getXY(), ex = exy[0];
			var w = t.offsetWidth, adjust = false;
			if((ex - x) <= this.hw){
				adjust = -1;
			}else if((x+w) - ex <= this.hw){
				adjust = 0;
			}
			if(adjust !== false){
				this.cm = this.grid.colModel;
				var ci = this.view.getCellIndex(t);
				if(adjust == -1){
					if (ci + adjust < 0) {
						return;
					}
					while(this.cm.isHidden(ci+adjust)){
						--adjust;
						if(ci+adjust < 0){
							return;
						}
					}
				}
				this.cellIndex = ci+adjust;
				this.split = t.dom;
				if(this.cm.isResizable(this.cellIndex) && !this.cm.isFixed(this.cellIndex)){
					Ext.grid.GridView.SplitDragZone.superclass.handleMouseDown.apply(this, arguments);
				}
			}else if(this.view.columnDrag){
				this.view.columnDrag.callHandleMouseDown(e);
			}
		}
	},

	endDrag : function(e){
		this.marker.hide();
		var v = this.view;
		var endX = Math.max(this.minX, e.getPageX());
		var diff = endX - this.startPos;
		v.onColumnSplitterMoved(this.cellIndex, this.cm.getColumnWidth(this.cellIndex)+diff);
		setTimeout(function(){
			v.headersDisabled = false;
		}, 50);
	},

	autoOffset : function(){
		this.setDelta(0,0);
	}
});


Ext.grid.HeaderDragZone = Ext.extend(Ext.dd.DragZone, {
	maxDragWidth: 120,

	constructor : function(grid, hd, hd2){
		this.grid = grid;
		this.view = grid.getView();
		this.ddGroup = "gridHeader" + this.grid.getGridEl().id;
		Ext.grid.HeaderDragZone.superclass.constructor.call(this, hd);
		if(hd2){
			this.setHandleElId(Ext.id(hd));
			this.setOuterHandleElId(Ext.id(hd2));
		}
		this.scroll = false;
	},

	getDragData : function(e){
		var t = Ext.lib.Event.getTarget(e);
		var h = this.view.findHeaderCell(t);
		if(h){
			return {ddel: h.firstChild, header:h};
		}
		return false;
	},

	onInitDrag : function(e){
		this.view.headersDisabled = true;
		var clone = this.dragData.ddel.cloneNode(true);
		clone.id = Ext.id();
		clone.style.width = Math.min(this.dragData.header.offsetWidth,this.maxDragWidth) + "px";
		this.proxy.update(clone);
		return true;
	},

	afterValidDrop : function(){
		var v = this.view;
		setTimeout(function(){
			v.headersDisabled = false;
		}, 50);
	},

	afterInvalidDrop : function(){
		var v = this.view;
		setTimeout(function(){
			v.headersDisabled = false;
		}, 50);
	}
});



Ext.grid.HeaderDropZone = Ext.extend(Ext.dd.DropZone, {
	proxyOffsets : [-4, -9],
	fly: Ext.Element.fly,

	constructor : function(grid, hd, hd2){
		this.grid = grid;
		this.view = grid.getView();

		this.proxyTop = Ext.DomHelper.append(document.body, {
			cls:"col-move-top", html:"&#160;"
		}, true);
		this.proxyBottom = Ext.DomHelper.append(document.body, {
			cls:"col-move-bottom", html:"&#160;"
		}, true);
		this.proxyTop.hide = this.proxyBottom.hide = function(){
			this.setLeftTop(-100,-100);
			this.setStyle("visibility", "hidden");
		};
		this.ddGroup = "gridHeader" + this.grid.getGridEl().id;


		Ext.grid.HeaderDropZone.superclass.constructor.call(this, grid.getGridEl().dom);
	},

	getTargetFromEvent : function(e){
		var t = Ext.lib.Event.getTarget(e);
		var cindex = this.view.findCellIndex(t);
		if(cindex !== false){
			return this.view.getHeaderCell(cindex);
		}
	},

	nextVisible : function(h){
		var v = this.view, cm = this.grid.colModel;
		h = h.nextSibling;
		while(h){
			if(!cm.isHidden(v.getCellIndex(h))){
				return h;
			}
			h = h.nextSibling;
		}
		return null;
	},

	prevVisible : function(h){
		var v = this.view, cm = this.grid.colModel;
		h = h.prevSibling;
		while(h){
			if(!cm.isHidden(v.getCellIndex(h))){
				return h;
			}
			h = h.prevSibling;
		}
		return null;
	},

	positionIndicator : function(h, n, e){
		var x = Ext.lib.Event.getPageX(e);
		var r = Ext.lib.Dom.getRegion(n.firstChild);
		var px, pt, py = r.top + this.proxyOffsets[1];
		if((r.right - x) <= (r.right-r.left)/2){
			px = r.right+this.view.borderWidth;
			pt = "after";
		}else{
			px = r.left;
			pt = "before";
		}

		if(this.grid.colModel.isFixed(this.view.getCellIndex(n))){
			return false;
		}

		px +=  this.proxyOffsets[0];
		this.proxyTop.setLeftTop(px, py);
		this.proxyTop.show();
		if(!this.bottomOffset){
			this.bottomOffset = this.view.mainHd.getHeight();
		}
		this.proxyBottom.setLeftTop(px, py+this.proxyTop.dom.offsetHeight+this.bottomOffset);
		this.proxyBottom.show();
		return pt;
	},

	onNodeEnter : function(n, dd, e, data){
		if(data.header != n){
			this.positionIndicator(data.header, n, e);
		}
	},

	onNodeOver : function(n, dd, e, data){
		var result = false;
		if(data.header != n){
			result = this.positionIndicator(data.header, n, e);
		}
		if(!result){
			this.proxyTop.hide();
			this.proxyBottom.hide();
		}
		return result ? this.dropAllowed : this.dropNotAllowed;
	},

	onNodeOut : function(n, dd, e, data){
		this.proxyTop.hide();
		this.proxyBottom.hide();
	},

	onNodeDrop : function(n, dd, e, data){
		var h = data.header;
		if(h != n){
			var cm = this.grid.colModel;
			var x = Ext.lib.Event.getPageX(e);
			var r = Ext.lib.Dom.getRegion(n.firstChild);
			var pt = (r.right - x) <= ((r.right-r.left)/2) ? "after" : "before";
			var oldIndex = this.view.getCellIndex(h);
			var newIndex = this.view.getCellIndex(n);
			if(pt == "after"){
				newIndex++;
			}
			if(oldIndex < newIndex){
				newIndex--;
			}
			cm.moveColumn(oldIndex, newIndex);
			return true;
		}
		return false;
	}
});

Ext.grid.GridView.ColumnDragZone = Ext.extend(Ext.grid.HeaderDragZone, {

	constructor : function(grid, hd){
		Ext.grid.GridView.ColumnDragZone.superclass.constructor.call(this, grid, hd, null);
		this.proxy.el.addClass('x-grid3-col-dd');
	},

	handleMouseDown : function(e){
	},

	callHandleMouseDown : function(e){
		Ext.grid.GridView.ColumnDragZone.superclass.handleMouseDown.call(this, e);
	}
});

Ext.grid.SplitDragZone = Ext.extend(Ext.dd.DDProxy, {
	fly: Ext.Element.fly,

	constructor : function(grid, hd, hd2){
		this.grid = grid;
		this.view = grid.getView();
		this.proxy = this.view.resizeProxy;
		Ext.grid.SplitDragZone.superclass.constructor.call(this, hd,
			"gridSplitters" + this.grid.getGridEl().id, {
				dragElId : Ext.id(this.proxy.dom), resizeFrame:false
			});
		this.setHandleElId(Ext.id(hd));
		this.setOuterHandleElId(Ext.id(hd2));
		this.scroll = false;
	},

	b4StartDrag : function(x, y){
		this.view.headersDisabled = true;
		this.proxy.setHeight(this.view.mainWrap.getHeight());
		var w = this.cm.getColumnWidth(this.cellIndex);
		var minw = Math.max(w-this.grid.minColumnWidth, 0);
		this.resetConstraints();
		this.setXConstraint(minw, 1000);
		this.setYConstraint(0, 0);
		this.minX = x - minw;
		this.maxX = x + 1000;
		this.startPos = x;
		Ext.dd.DDProxy.prototype.b4StartDrag.call(this, x, y);
	},


	handleMouseDown : function(e){
		var ev = Ext.EventObject.setEvent(e);
		var t = this.fly(ev.getTarget());
		if(t.hasClass("x-grid-split")){
			this.cellIndex = this.view.getCellIndex(t.dom);
			this.split = t.dom;
			this.cm = this.grid.colModel;
			if(this.cm.isResizable(this.cellIndex) && !this.cm.isFixed(this.cellIndex)){
				Ext.grid.SplitDragZone.superclass.handleMouseDown.apply(this, arguments);
			}
		}
	},

	endDrag : function(e){
		this.view.headersDisabled = false;
		var endX = Math.max(this.minX, Ext.lib.Event.getPageX(e));
		var diff = endX - this.startPos;
		this.view.onColumnSplitterMoved(this.cellIndex, this.cm.getColumnWidth(this.cellIndex)+diff);
	},

	autoOffset : function(){
		this.setDelta(0,0);
	}
});
Ext.grid.GridDragZone = function(grid, config){
	this.view = grid.getView();
	Ext.grid.GridDragZone.superclass.constructor.call(this, this.view.mainBody.dom, config);
	this.scroll = false;
	this.grid = grid;
	this.ddel = document.createElement('div');
	this.ddel.className = 'x-grid-dd-wrap';
};

Ext.extend(Ext.grid.GridDragZone, Ext.dd.DragZone, {
	ddGroup : "GridDD",


	getDragData : function(e){
		var t = Ext.lib.Event.getTarget(e);
		var rowIndex = this.view.findRowIndex(t);
		if(rowIndex !== false){
			var sm = this.grid.selModel;
			if(!sm.isSelected(rowIndex) || e.hasModifier()){
				sm.handleMouseDown(this.grid, rowIndex, e);
			}
			return {grid: this.grid, ddel: this.ddel, rowIndex: rowIndex, selections:sm.getSelections()};
		}
		return false;
	},


	onInitDrag : function(e){
		var data = this.dragData;
		this.ddel.innerHTML = this.grid.getDragDropText();
		this.proxy.update(this.ddel);

	},


	afterRepair : function(){
		this.dragging = false;
	},


	getRepairXY : function(e, data){
		return false;
	},

	onEndDrag : function(data, e){

	},

	onValidDrop : function(dd, e, id){

		this.hideProxy();
	},

	beforeInvalidDrop : function(e, id){

	}
});

Ext.grid.ColumnModel = Ext.extend(Ext.util.Observable, {

	defaultWidth: 100,

	defaultSortable: false,



	constructor : function(config){

		if(config.columns){
			Ext.apply(this, config);
			this.setConfig(config.columns, true);
		}else{
			this.setConfig(config, true);
		}
		this.addEvents(

			"widthchange",

			"headerchange",

			"hiddenchange",

			"columnmoved",

			"configchange"
		);
		Ext.grid.ColumnModel.superclass.constructor.call(this);
	},


	getColumnId : function(index){
		return this.config[index].id;
	},

	getColumnAt : function(index){
		return this.config[index];
	},


	setConfig : function(config, initial){
		var i, c, len;
		if(!initial){
			delete this.totalWidth;
			for(i = 0, len = this.config.length; i < len; i++){
				c = this.config[i];
				if(c.editor){
					c.editor.destroy();
				}
			}
		}


		this.defaults = Ext.apply({
			width: this.defaultWidth,
			sortable: this.defaultSortable
		}, this.defaults);

		this.config = config;
		this.lookup = {};

		for(i = 0, len = config.length; i < len; i++){
			c = Ext.applyIf(config[i], this.defaults);

			if(typeof c.id == 'undefined'){
				c.id = i;
			}
			if(!c.isColumn){
				var Cls = Ext.grid.Column.types[c.xtype || 'gridcolumn'];
				c = new Cls(c);
				config[i] = c;
			}
			this.lookup[c.id] = c;
		}
		if(!initial){
			this.fireEvent('configchange', this);
		}
	},


	getColumnById : function(id){
		return this.lookup[id];
	},


	getIndexById : function(id){
		for(var i = 0, len = this.config.length; i < len; i++){
			if(this.config[i].id == id){
				return i;
			}
		}
		return -1;
	},


	moveColumn : function(oldIndex, newIndex){
		var c = this.config[oldIndex];
		this.config.splice(oldIndex, 1);
		this.config.splice(newIndex, 0, c);
		this.dataMap = null;
		this.fireEvent("columnmoved", this, oldIndex, newIndex);
	},


	getColumnCount : function(visibleOnly){
		if(visibleOnly === true){
			var c = 0;
			for(var i = 0, len = this.config.length; i < len; i++){
				if(!this.isHidden(i)){
					c++;
				}
			}
			return c;
		}
		return this.config.length;
	},


	getColumnsBy : function(fn, scope){
		var r = [];
		for(var i = 0, len = this.config.length; i < len; i++){
			var c = this.config[i];
			if(fn.call(scope||this, c, i) === true){
				r[r.length] = c;
			}
		}
		return r;
	},


	isSortable : function(col){
		return !!this.config[col].sortable;
	},


	isMenuDisabled : function(col){
		return !!this.config[col].menuDisabled;
	},


	getRenderer : function(col){
		if(!this.config[col].renderer){
			return Ext.grid.ColumnModel.defaultRenderer;
		}
		return this.config[col].renderer;
	},

	getRendererScope : function(col){
		return this.config[col].scope;
	},


	setRenderer : function(col, fn){
		this.config[col].renderer = fn;
	},


	getColumnWidth : function(col){
		return this.config[col].width;
	},


	setColumnWidth : function(col, width, suppressEvent){
		this.config[col].width = width;
		this.totalWidth = null;
		if(!suppressEvent){
			this.fireEvent("widthchange", this, col, width);
		}
	},


	getTotalWidth : function(includeHidden){
		if(!this.totalWidth){
			this.totalWidth = 0;
			for(var i = 0, len = this.config.length; i < len; i++){
				if(includeHidden || !this.isHidden(i)){
					this.totalWidth += this.getColumnWidth(i);
				}
			}
		}
		return this.totalWidth;
	},


	getColumnHeader : function(col){
		return this.config[col].header;
	},


	setColumnHeader : function(col, header){
		this.config[col].header = header;
		this.fireEvent("headerchange", this, col, header);
	},


	getColumnTooltip : function(col){
		return this.config[col].tooltip;
	},

	setColumnTooltip : function(col, tooltip){
		this.config[col].tooltip = tooltip;
	},


	getDataIndex : function(col){
		return this.config[col].dataIndex;
	},


	setDataIndex : function(col, dataIndex){
		this.config[col].dataIndex = dataIndex;
	},


	findColumnIndex : function(dataIndex){
		var c = this.config;
		for(var i = 0, len = c.length; i < len; i++){
			if(c[i].dataIndex == dataIndex){
				return i;
			}
		}
		return -1;
	},


	isCellEditable : function(colIndex, rowIndex){
		return (this.config[colIndex].editable || (typeof this.config[colIndex].editable == "undefined" && this.config[colIndex].editor)) ? true : false;
	},


	getCellEditor : function(colIndex, rowIndex){
		return this.config[colIndex].getCellEditor(rowIndex);
	},


	setEditable : function(col, editable){
		this.config[col].editable = editable;
	},


	isHidden : function(colIndex){
		return !!this.config[colIndex].hidden;
	},


	isFixed : function(colIndex){
		return !!this.config[colIndex].fixed;
	},


	isResizable : function(colIndex){
		return colIndex >= 0 && this.config[colIndex].resizable !== false && this.config[colIndex].fixed !== true;
	},

	setHidden : function(colIndex, hidden){
		var c = this.config[colIndex];
		if(c.hidden !== hidden){
			c.hidden = hidden;
			this.totalWidth = null;
			this.fireEvent("hiddenchange", this, colIndex, hidden);
		}
	},


	setEditor : function(col, editor){
		Ext.destroy(this.config[col].editor);
		this.config[col].editor = editor;
	},


	destroy : function(){
		for(var i = 0, c = this.config, len = c.length; i < len; i++){
			Ext.destroy(c[i].editor);
		}
		this.purgeListeners();
	}
});


Ext.grid.ColumnModel.defaultRenderer = function(value){
	if(typeof value == "string" && value.length < 1){
		return "&#160;";
	}
	return value;
};
Ext.grid.AbstractSelectionModel = Ext.extend(Ext.util.Observable,  {


	constructor : function(){
		this.locked = false;
		Ext.grid.AbstractSelectionModel.superclass.constructor.call(this);
	},


	init : function(grid){
		this.grid = grid;
		this.initEvents();
	},


	lock : function(){
		this.locked = true;
	},


	unlock : function(){
		this.locked = false;
	},


	isLocked : function(){
		return this.locked;
	},

	destroy: function(){
		this.purgeListeners();
	}
});
Ext.grid.RowSelectionModel = Ext.extend(Ext.grid.AbstractSelectionModel,  {

	singleSelect : false,

	constructor : function(config){
		Ext.apply(this, config);
		this.selections = new Ext.util.MixedCollection(false, function(o){
			return o.id;
		});

		this.last = false;
		this.lastActive = false;

		this.addEvents(

			'selectionchange',

			'beforerowselect',

			'rowselect',

			'rowdeselect'
		);
		Ext.grid.RowSelectionModel.superclass.constructor.call(this);
	},



	initEvents : function(){

		if(!this.grid.enableDragDrop && !this.grid.enableDrag){
			this.grid.on('rowmousedown', this.handleMouseDown, this);
		}

		this.rowNav = new Ext.KeyNav(this.grid.getGridEl(), {
			'up' : function(e){
				if(!e.shiftKey || this.singleSelect){
					this.selectPrevious(false);
				}else if(this.last !== false && this.lastActive !== false){
					var last = this.last;
					this.selectRange(this.last,  this.lastActive-1);
					this.grid.getView().focusRow(this.lastActive);
					if(last !== false){
						this.last = last;
					}
				}else{
					this.selectFirstRow();
				}
			},
			'down' : function(e){
				if(!e.shiftKey || this.singleSelect){
					this.selectNext(false);
				}else if(this.last !== false && this.lastActive !== false){
					var last = this.last;
					this.selectRange(this.last,  this.lastActive+1);
					this.grid.getView().focusRow(this.lastActive);
					if(last !== false){
						this.last = last;
					}
				}else{
					this.selectFirstRow();
				}
			},
			scope: this
		});

		this.grid.getView().on({
			scope: this,
			refresh: this.onRefresh,
			rowupdated: this.onRowUpdated,
			rowremoved: this.onRemove
		});
	},


	onRefresh : function(){
		var ds = this.grid.store, index;
		var s = this.getSelections();
		this.clearSelections(true);
		for(var i = 0, len = s.length; i < len; i++){
			var r = s[i];
			if((index = ds.indexOfId(r.id)) != -1){
				this.selectRow(index, true);
			}
		}
		if(s.length != this.selections.getCount()){
			this.fireEvent('selectionchange', this);
		}
	},


	onRemove : function(v, index, r){
		if(this.selections.remove(r) !== false){
			this.fireEvent('selectionchange', this);
		}
	},


	onRowUpdated : function(v, index, r){
		if(this.isSelected(r)){
			v.onRowSelect(index);
		}
	},


	selectRecords : function(records, keepExisting){
		if(!keepExisting){
			this.clearSelections();
		}
		var ds = this.grid.store;
		for(var i = 0, len = records.length; i < len; i++){
			this.selectRow(ds.indexOf(records[i]), true);
		}
	},


	getCount : function(){
		return this.selections.length;
	},


	selectFirstRow : function(){
		this.selectRow(0);
	},


	selectLastRow : function(keepExisting){
		this.selectRow(this.grid.store.getCount() - 1, keepExisting);
	},


	selectNext : function(keepExisting){
		if(this.hasNext()){
			this.selectRow(this.last+1, keepExisting);
			this.grid.getView().focusRow(this.last);
			return true;
		}
		return false;
	},


	selectPrevious : function(keepExisting){
		if(this.hasPrevious()){
			this.selectRow(this.last-1, keepExisting);
			this.grid.getView().focusRow(this.last);
			return true;
		}
		return false;
	},


	hasNext : function(){
		return this.last !== false && (this.last+1) < this.grid.store.getCount();
	},


	hasPrevious : function(){
		return !!this.last;
	},



	getSelections : function(){
		return [].concat(this.selections.items);
	},


	getSelected : function(){
		return this.selections.itemAt(0);
	},


	each : function(fn, scope){
		var s = this.getSelections();
		for(var i = 0, len = s.length; i < len; i++){
			if(fn.call(scope || this, s[i], i) === false){
				return false;
			}
		}
		return true;
	},


	clearSelections : function(fast){
		if(this.isLocked()){
			return;
		}
		if(fast !== true){
			var ds = this.grid.store;
			var s = this.selections;
			s.each(function(r){
				this.deselectRow(ds.indexOfId(r.id));
			}, this);
			s.clear();
		}else{
			this.selections.clear();
		}
		this.last = false;
	},



	selectAll : function(){
		if(this.isLocked()){
			return;
		}
		this.selections.clear();
		for(var i = 0, len = this.grid.store.getCount(); i < len; i++){
			this.selectRow(i, true);
		}
	},


	hasSelection : function(){
		return this.selections.length > 0;
	},


	isSelected : function(index){
		var r = Ext.isNumber(index) ? this.grid.store.getAt(index) : index;
		return (r && this.selections.key(r.id) ? true : false);
	},


	isIdSelected : function(id){
		return (this.selections.key(id) ? true : false);
	},


	handleMouseDown : function(g, rowIndex, e){
		if(e.button !== 0 || this.isLocked()){
			return;
		}
		var view = this.grid.getView();
		if(e.shiftKey && !this.singleSelect && this.last !== false){
			var last = this.last;
			this.selectRange(last, rowIndex, e.ctrlKey);
			this.last = last;
			view.focusRow(rowIndex);
		}else{
			var isSelected = this.isSelected(rowIndex);
			if(e.ctrlKey && isSelected){
				this.deselectRow(rowIndex);
			}else if(!isSelected || this.getCount() > 1){
				this.selectRow(rowIndex, e.ctrlKey || e.shiftKey);
				view.focusRow(rowIndex);
			}
		}
	},


	selectRows : function(rows, keepExisting){
		if(!keepExisting){
			this.clearSelections();
		}
		for(var i = 0, len = rows.length; i < len; i++){
			this.selectRow(rows[i], true);
		}
	},


	selectRange : function(startRow, endRow, keepExisting){
		var i;
		if(this.isLocked()){
			return;
		}
		if(!keepExisting){
			this.clearSelections();
		}
		if(startRow <= endRow){
			for(i = startRow; i <= endRow; i++){
				this.selectRow(i, true);
			}
		}else{
			for(i = startRow; i >= endRow; i--){
				this.selectRow(i, true);
			}
		}
	},


	deselectRange : function(startRow, endRow, preventViewNotify){
		if(this.isLocked()){
			return;
		}
		for(var i = startRow; i <= endRow; i++){
			this.deselectRow(i, preventViewNotify);
		}
	},


	selectRow : function(index, keepExisting, preventViewNotify){
		if(this.isLocked() || (index < 0 || index >= this.grid.store.getCount()) || (keepExisting && this.isSelected(index))){
			return;
		}
		var r = this.grid.store.getAt(index);
		if(r && this.fireEvent('beforerowselect', this, index, keepExisting, r) !== false){
			if(!keepExisting || this.singleSelect){
				this.clearSelections();
			}
			this.selections.add(r);
			this.last = this.lastActive = index;
			if(!preventViewNotify){
				this.grid.getView().onRowSelect(index);
			}
			this.fireEvent('rowselect', this, index, r);
			this.fireEvent('selectionchange', this);
		}
	},


	deselectRow : function(index, preventViewNotify){
		if(this.isLocked()){
			return;
		}
		if(this.last == index){
			this.last = false;
		}
		if(this.lastActive == index){
			this.lastActive = false;
		}
		var r = this.grid.store.getAt(index);
		if(r){
			this.selections.remove(r);
			if(!preventViewNotify){
				this.grid.getView().onRowDeselect(index);
			}
			this.fireEvent('rowdeselect', this, index, r);
			this.fireEvent('selectionchange', this);
		}
	},


	restoreLast : function(){
		if(this._last){
			this.last = this._last;
		}
	},


	acceptsNav : function(row, col, cm){
		return !cm.isHidden(col) && cm.isCellEditable(col, row);
	},


	onEditorKey : function(field, e){
		var k = e.getKey(),
			newCell,
			g = this.grid,
			last = g.lastEdit,
			ed = g.activeEditor,
			ae, last, r, c;
		var shift = e.shiftKey;
		if(k == e.TAB){
			e.stopEvent();
			ed.completeEdit();
			if(shift){
				newCell = g.walkCells(ed.row, ed.col-1, -1, this.acceptsNav, this);
			}else{
				newCell = g.walkCells(ed.row, ed.col+1, 1, this.acceptsNav, this);
			}
		}else if(k == e.ENTER){
			if(this.moveEditorOnEnter !== false){
				if(shift){
					newCell = g.walkCells(last.row - 1, last.col, -1, this.acceptsNav, this);
				}else{
					newCell = g.walkCells(last.row + 1, last.col, 1, this.acceptsNav, this);
				}
			}
		}
		if(newCell){
			r = newCell[0];
			c = newCell[1];

			if(last.row != r){
				this.selectRow(r);
			}

			if(g.isEditor && g.editing){
				ae = g.activeEditor;
				if(ae && ae.field.triggerBlur){

					ae.field.triggerBlur();
				}
			}
			g.startEditing(r, c);
		}
	},

	destroy : function(){
		if(this.rowNav){
			this.rowNav.disable();
			this.rowNav = null;
		}
		Ext.grid.RowSelectionModel.superclass.destroy.call(this);
	}
});
Ext.grid.Column = Ext.extend(Object, {
























	isColumn : true,

	constructor : function(config){
		Ext.apply(this, config);

		if(Ext.isString(this.renderer)){
			this.renderer = Ext.util.Format[this.renderer];
		}else if(Ext.isObject(this.renderer)){
			this.scope = this.renderer.scope;
			this.renderer = this.renderer.fn;
		}
		if(!this.scope){
			this.scope = this;
		}

		if(this.editor){
			this.editor = Ext.create(this.editor, 'textfield');
		}
	},


	renderer : function(value){
		if(Ext.isString(value) && value.length < 1){
			return '&#160;';
		}
		return value;
	},


	getEditor: function(rowIndex){
		return this.editable !== false ? this.editor : null;
	},


	getCellEditor: function(rowIndex){
		var editor = this.getEditor(rowIndex);
		if(editor){
			if(!editor.startEdit){
				if(!editor.gridEditor){
					editor.gridEditor = new Ext.grid.GridEditor(editor);
				}
				return editor.gridEditor;
			}else if(editor.startEdit){
				return editor;
			}
		}
		return null;
	}
});


Ext.grid.BooleanColumn = Ext.extend(Ext.grid.Column, {

	trueText: 'true',

	falseText: 'false',

	undefinedText: '&#160;',

	constructor: function(cfg){
		Ext.grid.BooleanColumn.superclass.constructor.call(this, cfg);
		var t = this.trueText, f = this.falseText, u = this.undefinedText;
		this.renderer = function(v){
			if(v === undefined){
				return u;
			}
			if(!v || v === 'false'){
				return f;
			}
			return t;
		};
	}
});


Ext.grid.NumberColumn = Ext.extend(Ext.grid.Column, {

	format : '0,000.00',
	constructor: function(cfg){
		Ext.grid.NumberColumn.superclass.constructor.call(this, cfg);
		this.renderer = Ext.util.Format.numberRenderer(this.format);
	}
});


Ext.grid.DateColumn = Ext.extend(Ext.grid.Column, {

	format : 'm/d/Y',
	constructor: function(cfg){
		Ext.grid.DateColumn.superclass.constructor.call(this, cfg);
		this.renderer = Ext.util.Format.dateRenderer(this.format);
	}
});


Ext.grid.TemplateColumn = Ext.extend(Ext.grid.Column, {

	constructor: function(cfg){
		Ext.grid.TemplateColumn.superclass.constructor.call(this, cfg);
		var tpl = (!Ext.isPrimitive(this.tpl) && this.tpl.compile) ? this.tpl : new Ext.XTemplate(this.tpl);
		this.renderer = function(value, p, r){
			return tpl.apply(r.data);
		};
		this.tpl = tpl;
	}
});


Ext.grid.Column.types = {
	gridcolumn : Ext.grid.Column,
	booleancolumn: Ext.grid.BooleanColumn,
	numbercolumn: Ext.grid.NumberColumn,
	datecolumn: Ext.grid.DateColumn,
	templatecolumn: Ext.grid.TemplateColumn
};
Ext.grid.RowNumberer = Ext.extend(Object, {

	header: "",

	width: 23,

	sortable: false,

	constructor : function(config){
		Ext.apply(this, config);
		if(this.rowspan){
			this.renderer = this.renderer.createDelegate(this);
		}
	},


	fixed:true,
	menuDisabled:true,
	dataIndex: '',
	id: 'numberer',
	rowspan: undefined,


	renderer : function(v, p, record, rowIndex){
		if(this.rowspan){
			p.cellAttr = 'rowspan="'+this.rowspan+'"';
		}
		return rowIndex+1;
	}
});
Ext.grid.CheckboxSelectionModel = Ext.extend(Ext.grid.RowSelectionModel, {



	header : '<div class="x-grid3-hd-checker">&#160;</div>',

	width : 20,

	sortable : false,


	menuDisabled : true,
	fixed : true,
	dataIndex : '',
	id : 'checker',

	constructor : function(){
		Ext.grid.CheckboxSelectionModel.superclass.constructor.apply(this, arguments);

		if(this.checkOnly){
			this.handleMouseDown = Ext.emptyFn;
		}
	},


	initEvents : function(){
		Ext.grid.CheckboxSelectionModel.superclass.initEvents.call(this);
		this.grid.on('render', function(){
			var view = this.grid.getView();
			view.mainBody.on('mousedown', this.onMouseDown, this);
			Ext.fly(view.innerHd).on('mousedown', this.onHdMouseDown, this);

		}, this);
	},


	onMouseDown : function(e, t){
		if(e.button === 0 && t.className == 'x-grid3-row-checker'){
			e.stopEvent();
			var row = e.getTarget('.x-grid3-row');
			if(row){
				var index = row.rowIndex;
				if(this.isSelected(index)){
					this.deselectRow(index);
				}else{
					this.selectRow(index, true);
				}
			}
		}
	},


	onHdMouseDown : function(e, t){
		if(t.className == 'x-grid3-hd-checker'){
			e.stopEvent();
			var hd = Ext.fly(t.parentNode);
			var isChecked = hd.hasClass('x-grid3-hd-checker-on');
			if(isChecked){
				hd.removeClass('x-grid3-hd-checker-on');
				this.clearSelections();
			}else{
				hd.addClass('x-grid3-hd-checker-on');
				this.selectAll();
			}
		}
	},


	renderer : function(v, p, record){
		return '<div class="x-grid3-row-checker">&#160;</div>';
	}
});
Ext.grid.CellSelectionModel = Ext.extend(Ext.grid.AbstractSelectionModel,  {

	constructor : function(config){
		Ext.apply(this, config);

		this.selection = null;

		this.addEvents(

			"beforecellselect",

			"cellselect",

			"selectionchange"
		);

		Ext.grid.CellSelectionModel.superclass.constructor.call(this);
	},


	initEvents : function(){
		this.grid.on('cellmousedown', this.handleMouseDown, this);
		this.grid.on(Ext.EventManager.useKeydown ? 'keydown' : 'keypress', this.handleKeyDown, this);
		this.grid.getView().on({
			scope: this,
			refresh: this.onViewChange,
			rowupdated: this.onRowUpdated,
			beforerowremoved: this.clearSelections,
			beforerowsinserted: this.clearSelections
		});
		if(this.grid.isEditor){
			this.grid.on('beforeedit', this.beforeEdit,  this);
		}
	},


	beforeEdit : function(e){
		this.select(e.row, e.column, false, true, e.record);
	},


	onRowUpdated : function(v, index, r){
		if(this.selection && this.selection.record == r){
			v.onCellSelect(index, this.selection.cell[1]);
		}
	},


	onViewChange : function(){
		this.clearSelections(true);
	},


	getSelectedCell : function(){
		return this.selection ? this.selection.cell : null;
	},


	clearSelections : function(preventNotify){
		var s = this.selection;
		if(s){
			if(preventNotify !== true){
				this.grid.view.onCellDeselect(s.cell[0], s.cell[1]);
			}
			this.selection = null;
			this.fireEvent("selectionchange", this, null);
		}
	},


	hasSelection : function(){
		return this.selection ? true : false;
	},


	handleMouseDown : function(g, row, cell, e){
		if(e.button !== 0 || this.isLocked()){
			return;
		}
		this.select(row, cell);
	},


	select : function(rowIndex, colIndex, preventViewNotify, preventFocus,  r){
		if(this.fireEvent("beforecellselect", this, rowIndex, colIndex) !== false){
			this.clearSelections();
			r = r || this.grid.store.getAt(rowIndex);
			this.selection = {
				record : r,
				cell : [rowIndex, colIndex]
			};
			if(!preventViewNotify){
				var v = this.grid.getView();
				v.onCellSelect(rowIndex, colIndex);
				if(preventFocus !== true){
					v.focusCell(rowIndex, colIndex);
				}
			}
			this.fireEvent("cellselect", this, rowIndex, colIndex);
			this.fireEvent("selectionchange", this, this.selection);
		}
	},


	isSelectable : function(rowIndex, colIndex, cm){
		return !cm.isHidden(colIndex);
	},


	onEditorKey: function(field, e){
		if(e.getKey() == e.TAB){
			this.handleKeyDown(e);
		}
	},


	handleKeyDown : function(e){
		if(!e.isNavKeyPress()){
			return;
		}

		var k = e.getKey(),
			g = this.grid,
			s = this.selection,
			sm = this,
			walk = function(row, col, step){
				return g.walkCells(
					row,
					col,
					step,
					g.isEditor && g.editing ? sm.acceptsNav : sm.isSelectable,
					sm
				);
			},
			cell, newCell, r, c, ae;

		switch(k){
			case e.ESC:
			case e.PAGE_UP:
			case e.PAGE_DOWN:

				break;
			default:

				e.stopEvent();
				break;
		}

		if(!s){
			cell = walk(0, 0, 1);
			if(cell){
				this.select(cell[0], cell[1]);
			}
			return;
		}

		cell = s.cell;
		r = cell[0];
		c = cell[1];

		switch(k){
			case e.TAB:
				if(e.shiftKey){
					newCell = walk(r, c - 1, -1);
				}else{
					newCell = walk(r, c + 1, 1);
				}
				break;
			case e.DOWN:
				newCell = walk(r + 1, c, 1);
				break;
			case e.UP:
				newCell = walk(r - 1, c, -1);
				break;
			case e.RIGHT:
				newCell = walk(r, c + 1, 1);
				break;
			case e.LEFT:
				newCell = walk(r, c - 1, -1);
				break;
			case e.ENTER:
				if (g.isEditor && !g.editing) {
					g.startEditing(r, c);
					return;
				}
				break;
		}

		if(newCell){

			r = newCell[0];
			c = newCell[1];

			this.select(r, c);

			if(g.isEditor && g.editing){
				ae = g.activeEditor;
				if(ae && ae.field.triggerBlur){

					ae.field.triggerBlur();
				}
				g.startEditing(r, c);
			}
		}
	},

	acceptsNav : function(row, col, cm){
		return !cm.isHidden(col) && cm.isCellEditable(col, row);
	}
});
Ext.grid.EditorGridPanel = Ext.extend(Ext.grid.GridPanel, {

	clicksToEdit: 2,


	forceValidation: false,


	isEditor : true,

	detectEdit: false,


	autoEncode : false,



	trackMouseOver: false,


	initComponent : function(){
		Ext.grid.EditorGridPanel.superclass.initComponent.call(this);

		if(!this.selModel){

			this.selModel = new Ext.grid.CellSelectionModel();
		}

		this.activeEditor = null;

		this.addEvents(

			"beforeedit",

			"afteredit",

			"validateedit"
		);
	},


	initEvents : function(){
		Ext.grid.EditorGridPanel.superclass.initEvents.call(this);

		this.getGridEl().on('mousewheel', this.stopEditing.createDelegate(this, [true]), this);
		this.on('columnresize', this.stopEditing, this, [true]);

		if(this.clicksToEdit == 1){
			this.on("cellclick", this.onCellDblClick, this);
		}else {
			var view = this.getView();
			if(this.clicksToEdit == 'auto' && view.mainBody){
				view.mainBody.on('mousedown', this.onAutoEditClick, this);
			}
			this.on('celldblclick', this.onCellDblClick, this);
		}
	},

	onResize : function(){
		Ext.grid.EditorGridPanel.superclass.onResize.apply(this, arguments);
		var ae = this.activeEditor;
		if(this.editing && ae){
			ae.realign(true);
		}
	},


	onCellDblClick : function(g, row, col){
		this.startEditing(row, col);
	},


	onAutoEditClick : function(e, t){
		if(e.button !== 0){
			return;
		}
		var row = this.view.findRowIndex(t),
			col = this.view.findCellIndex(t);
		if(row !== false && col !== false){
			this.stopEditing();
			if(this.selModel.getSelectedCell){
				var sc = this.selModel.getSelectedCell();
				if(sc && sc[0] === row && sc[1] === col){
					this.startEditing(row, col);
				}
			}else{
				if(this.selModel.isSelected(row)){
					this.startEditing(row, col);
				}
			}
		}
	},


	onEditComplete : function(ed, value, startValue){
		this.editing = false;
		this.activeEditor = null;

		var r = ed.record,
			field = this.colModel.getDataIndex(ed.col);
		value = this.postEditValue(value, startValue, r, field);
		if(this.forceValidation === true || String(value) !== String(startValue)){
			var e = {
				grid: this,
				record: r,
				field: field,
				originalValue: startValue,
				value: value,
				row: ed.row,
				column: ed.col,
				cancel:false
			};
			if(this.fireEvent("validateedit", e) !== false && !e.cancel && String(value) !== String(startValue)){
				r.set(field, e.value);
				delete e.cancel;
				this.fireEvent("afteredit", e);
			}
		}
		this.view.focusCell(ed.row, ed.col);
	},


	startEditing : function(row, col){
		this.stopEditing();
		if(this.colModel.isCellEditable(col, row)){
			this.view.ensureVisible(row, col, true);
			var r = this.store.getAt(row),
				field = this.colModel.getDataIndex(col),
				e = {
					grid: this,
					record: r,
					field: field,
					value: r.data[field],
					row: row,
					column: col,
					cancel:false
				};
			if(this.fireEvent("beforeedit", e) !== false && !e.cancel){
				this.editing = true;
				var ed = this.colModel.getCellEditor(col, row);
				if(!ed){
					return;
				}
				if(!ed.rendered){
					ed.parentEl = this.view.getEditorParent(ed);
					ed.on({
						scope: this,
						render: {
							fn: function(c){
								c.field.focus(false, true);
							},
							single: true,
							scope: this
						},
						specialkey: function(field, e){
							this.getSelectionModel().onEditorKey(field, e);
						},
						complete: this.onEditComplete,
						canceledit: this.stopEditing.createDelegate(this, [true])
					});
				}
				Ext.apply(ed, {
					row     : row,
					col     : col,
					record  : r
				});
				this.lastEdit = {
					row: row,
					col: col
				};
				this.activeEditor = ed;
				var v = this.preEditValue(r, field);
				ed.startEdit(this.view.getCell(row, col).firstChild, Ext.isDefined(v) ? v : '');
			}
		}
	},


	preEditValue : function(r, field){
		var value = r.data[field];
		return this.autoEncode && Ext.isString(value) ? Ext.util.Format.htmlDecode(value) : value;
	},


	postEditValue : function(value, originalValue, r, field){
		return this.autoEncode && Ext.isString(value) ? Ext.util.Format.htmlEncode(value) : value;
	},


	stopEditing : function(cancel){
		if(this.editing){
			var ae = this.activeEditor;
			if(ae){
				ae[cancel === true ? 'cancelEdit' : 'completeEdit']();
				this.view.focusCell(ae.row, ae.col);
			}
			this.activeEditor = null;
		}
		this.editing = false;
	}
});
Ext.reg('editorgrid', Ext.grid.EditorGridPanel);

Ext.grid.GridEditor = function(field, config){
	Ext.grid.GridEditor.superclass.constructor.call(this, field, config);
	field.monitorTab = false;
};

Ext.extend(Ext.grid.GridEditor, Ext.Editor, {
	alignment: "tl-tl",
	autoSize: "width",
	hideEl : false,
	cls: "x-small-editor x-grid-editor",
	shim:false,
	shadow:false
});
Ext.grid.PropertyRecord = Ext.data.Record.create([
	{name:'name',type:'string'}, 'value'
]);


Ext.grid.PropertyStore = Ext.extend(Ext.util.Observable, {

	constructor : function(grid, source){
		this.grid = grid;
		this.store = new Ext.data.Store({
			recordType : Ext.grid.PropertyRecord
		});
		this.store.on('update', this.onUpdate,  this);
		if(source){
			this.setSource(source);
		}
		Ext.grid.PropertyStore.superclass.constructor.call(this);
	},


	setSource : function(o){
		this.source = o;
		this.store.removeAll();
		var data = [];
		for(var k in o){
			if(this.isEditableValue(o[k])){
				data.push(new Ext.grid.PropertyRecord({name: k, value: o[k]}, k));
			}
		}
		this.store.loadRecords({records: data}, {}, true);
	},


	onUpdate : function(ds, record, type){
		if(type == Ext.data.Record.EDIT){
			var v = record.data.value;
			var oldValue = record.modified.value;
			if(this.grid.fireEvent('beforepropertychange', this.source, record.id, v, oldValue) !== false){
				this.source[record.id] = v;
				record.commit();
				this.grid.fireEvent('propertychange', this.source, record.id, v, oldValue);
			}else{
				record.reject();
			}
		}
	},


	getProperty : function(row){
		return this.store.getAt(row);
	},


	isEditableValue: function(val){
		return Ext.isPrimitive(val) || Ext.isDate(val);
	},


	setValue : function(prop, value){
		this.source[prop] = value;
		this.store.getById(prop).set('value', value);
	},


	getSource : function(){
		return this.source;
	}
});


Ext.grid.PropertyColumnModel = Ext.extend(Ext.grid.ColumnModel, {

	nameText : 'Name',
	valueText : 'Value',
	dateFormat : 'm/j/Y',

	constructor : function(grid, store){
		var g = Ext.grid,
			f = Ext.form;

		this.grid = grid;
		g.PropertyColumnModel.superclass.constructor.call(this, [
			{header: this.nameText, width:50, sortable: true, dataIndex:'name', id: 'name', menuDisabled:true},
			{header: this.valueText, width:50, resizable:false, dataIndex: 'value', id: 'value', menuDisabled:true}
		]);
		this.store = store;

		var bfield = new f.Field({
			autoCreate: {tag: 'select', children: [
				{tag: 'option', value: 'true', html: 'true'},
				{tag: 'option', value: 'false', html: 'false'}
			]},
			getValue : function(){
				return this.el.dom.value == 'true';
			}
		});
		this.editors = {
			'date' : new g.GridEditor(new f.DateField({selectOnFocus:true})),
			'string' : new g.GridEditor(new f.TextField({selectOnFocus:true})),
			'number' : new g.GridEditor(new f.NumberField({selectOnFocus:true, style:'text-align:left;'})),
			'boolean' : new g.GridEditor(bfield, {
				autoSize: 'both'
			})
		};
		this.renderCellDelegate = this.renderCell.createDelegate(this);
		this.renderPropDelegate = this.renderProp.createDelegate(this);
	},


	renderDate : function(dateVal){
		return dateVal.dateFormat(this.dateFormat);
	},


	renderBool : function(bVal){
		return bVal ? 'true' : 'false';
	},


	isCellEditable : function(colIndex, rowIndex){
		return colIndex == 1;
	},


	getRenderer : function(col){
		return col == 1 ?
			this.renderCellDelegate : this.renderPropDelegate;
	},


	renderProp : function(v){
		return this.getPropertyName(v);
	},


	renderCell : function(val){
		var rv = val;
		if(Ext.isDate(val)){
			rv = this.renderDate(val);
		}else if(typeof val == 'boolean'){
			rv = this.renderBool(val);
		}
		return Ext.util.Format.htmlEncode(rv);
	},


	getPropertyName : function(name){
		var pn = this.grid.propertyNames;
		return pn && pn[name] ? pn[name] : name;
	},


	getCellEditor : function(colIndex, rowIndex){
		var p = this.store.getProperty(rowIndex),
			n = p.data.name,
			val = p.data.value;
		if(this.grid.customEditors[n]){
			return this.grid.customEditors[n];
		}
		if(Ext.isDate(val)){
			return this.editors.date;
		}else if(typeof val == 'number'){
			return this.editors.number;
		}else if(typeof val == 'boolean'){
			return this.editors['boolean'];
		}else{
			return this.editors.string;
		}
	},


	destroy : function(){
		Ext.grid.PropertyColumnModel.superclass.destroy.call(this);
		for(var ed in this.editors){
			Ext.destroy(this.editors[ed]);
		}
	}
});


Ext.grid.PropertyGrid = Ext.extend(Ext.grid.EditorGridPanel, {





	enableColumnMove:false,
	stripeRows:false,
	trackMouseOver: false,
	clicksToEdit:1,
	enableHdMenu : false,
	viewConfig : {
		forceFit:true
	},


	initComponent : function(){
		this.customEditors = this.customEditors || {};
		this.lastEditRow = null;
		var store = new Ext.grid.PropertyStore(this);
		this.propStore = store;
		var cm = new Ext.grid.PropertyColumnModel(this, store);
		store.store.sort('name', 'ASC');
		this.addEvents(

			'beforepropertychange',

			'propertychange'
		);
		this.cm = cm;
		this.ds = store.store;
		Ext.grid.PropertyGrid.superclass.initComponent.call(this);

		this.mon(this.selModel, 'beforecellselect', function(sm, rowIndex, colIndex){
			if(colIndex === 0){
				this.startEditing.defer(200, this, [rowIndex, 1]);
				return false;
			}
		}, this);
	},


	onRender : function(){
		Ext.grid.PropertyGrid.superclass.onRender.apply(this, arguments);

		this.getGridEl().addClass('x-props-grid');
	},


	afterRender: function(){
		Ext.grid.PropertyGrid.superclass.afterRender.apply(this, arguments);
		if(this.source){
			this.setSource(this.source);
		}
	},


	setSource : function(source){
		this.propStore.setSource(source);
	},


	getSource : function(){
		return this.propStore.getSource();
	}





});
Ext.reg("propertygrid", Ext.grid.PropertyGrid);

Ext.grid.GroupingView = Ext.extend(Ext.grid.GridView, {


	groupByText : 'Group By This Field',

	showGroupsText : 'Show in Groups',

	hideGroupedColumn : false,

	showGroupName : true,

	startCollapsed : false,

	enableGrouping : true,

	enableGroupingMenu : true,

	enableNoGroups : true,

	emptyGroupText : '(None)',

	ignoreAdd : false,

	groupTextTpl : '{text}',


	groupMode: 'value',




	gidSeed : 1000,


	initTemplates : function(){
		Ext.grid.GroupingView.superclass.initTemplates.call(this);
		this.state = {};

		var sm = this.grid.getSelectionModel();
		sm.on(sm.selectRow ? 'beforerowselect' : 'beforecellselect',
			this.onBeforeRowSelect, this);

		if(!this.startGroup){
			this.startGroup = new Ext.XTemplate(
				'<div id="{groupId}" class="x-grid-group {cls}">',
				'<div id="{groupId}-hd" class="x-grid-group-hd" style="{style}"><div class="x-grid-group-title">', this.groupTextTpl ,'</div></div>',
				'<div id="{groupId}-bd" class="x-grid-group-body">'
			);
		}
		this.startGroup.compile();
		if(!this.endGroup){
			this.endGroup = '</div></div>';
		}

		this.endGroup = '</div></div>';
	},


	findGroup : function(el){
		return Ext.fly(el).up('.x-grid-group', this.mainBody.dom);
	},


	getGroups : function(){
		return this.hasRows() ? this.mainBody.dom.childNodes : [];
	},


	onAdd : function(){
		if(this.enableGrouping && !this.ignoreAdd){
			var ss = this.getScrollState();
			this.refresh();
			this.restoreScroll(ss);
		}else if(!this.enableGrouping){
			Ext.grid.GroupingView.superclass.onAdd.apply(this, arguments);
		}
	},


	onRemove : function(ds, record, index, isUpdate){
		Ext.grid.GroupingView.superclass.onRemove.apply(this, arguments);
		var g = document.getElementById(record._groupId);
		if(g && g.childNodes[1].childNodes.length < 1){
			Ext.removeNode(g);
		}
		this.applyEmptyText();
	},


	refreshRow : function(record){
		if(this.ds.getCount()==1){
			this.refresh();
		}else{
			this.isUpdating = true;
			Ext.grid.GroupingView.superclass.refreshRow.apply(this, arguments);
			this.isUpdating = false;
		}
	},


	beforeMenuShow : function(){
		var item, items = this.hmenu.items, disabled = this.cm.config[this.hdCtxIndex].groupable === false;
		if((item = items.get('groupBy'))){
			item.setDisabled(disabled);
		}
		if((item = items.get('showGroups'))){
			item.setDisabled(disabled);
			item.setChecked(this.enableGrouping, true);
		}
	},


	renderUI : function(){
		Ext.grid.GroupingView.superclass.renderUI.call(this);
		this.mainBody.on('mousedown', this.interceptMouse, this);

		if(this.enableGroupingMenu && this.hmenu){
			this.hmenu.add('-',{
				itemId:'groupBy',
				text: this.groupByText,
				handler: this.onGroupByClick,
				scope: this,
				iconCls:'x-group-by-icon'
			});
			if(this.enableNoGroups){
				this.hmenu.add({
					itemId:'showGroups',
					text: this.showGroupsText,
					checked: true,
					checkHandler: this.onShowGroupsClick,
					scope: this
				});
			}
			this.hmenu.on('beforeshow', this.beforeMenuShow, this);
		}
	},

	processEvent: function(name, e){
		var hd = e.getTarget('.x-grid-group-hd', this.mainBody);
		if(hd){

			var field = this.getGroupField(),
				prefix = this.getPrefix(field),
				groupValue = hd.id.substring(prefix.length);


			groupValue = groupValue.substr(0, groupValue.length - 3);
			if(groupValue){
				this.grid.fireEvent('group' + name, this.grid, field, groupValue, e);
			}
		}

	},


	onGroupByClick : function(){
		this.enableGrouping = true;
		this.grid.store.groupBy(this.cm.getDataIndex(this.hdCtxIndex));
		this.beforeMenuShow();
		this.refresh();
	},


	onShowGroupsClick : function(mi, checked){
		this.enableGrouping = checked;
		if(checked){
			this.onGroupByClick();
		}else{
			this.grid.store.clearGrouping();
		}
	},


	toggleRowIndex : function(rowIndex, expanded){
		if(!this.enableGrouping){
			return;
		}
		var row = this.getRow(rowIndex);
		if(row){
			this.toggleGroup(this.findGroup(row), expanded);
		}
	},


	toggleGroup : function(group, expanded){
		var gel = Ext.get(group);
		expanded = Ext.isDefined(expanded) ? expanded : gel.hasClass('x-grid-group-collapsed');
		if(this.state[gel.id] !== expanded){
			this.grid.stopEditing(true);
			this.state[gel.id] = expanded;
			gel[expanded ? 'removeClass' : 'addClass']('x-grid-group-collapsed');
		}
	},


	toggleAllGroups : function(expanded){
		var groups = this.getGroups();
		for(var i = 0, len = groups.length; i < len; i++){
			this.toggleGroup(groups[i], expanded);
		}
	},


	expandAllGroups : function(){
		this.toggleAllGroups(true);
	},


	collapseAllGroups : function(){
		this.toggleAllGroups(false);
	},


	interceptMouse : function(e){
		var hd = e.getTarget('.x-grid-group-hd', this.mainBody);
		if(hd){
			e.stopEvent();
			this.toggleGroup(hd.parentNode);
		}
	},


	getGroup : function(v, r, groupRenderer, rowIndex, colIndex, ds){
		var g = groupRenderer ? groupRenderer(v, {}, r, rowIndex, colIndex, ds) : String(v);
		if(g === '' || g === '&#160;'){
			g = this.cm.config[colIndex].emptyGroupText || this.emptyGroupText;
		}
		return g;
	},


	getGroupField : function(){
		return this.grid.store.getGroupState();
	},


	afterRender : function(){
		Ext.grid.GroupingView.superclass.afterRender.call(this);
		if(this.grid.deferRowRender){
			this.updateGroupWidths();
		}
	},


	renderRows : function(){
		var groupField = this.getGroupField();
		var eg = !!groupField;

		if(this.hideGroupedColumn) {
			var colIndex = this.cm.findColumnIndex(groupField),
				hasLastGroupField = Ext.isDefined(this.lastGroupField);
			if(!eg && hasLastGroupField){
				this.mainBody.update('');
				this.cm.setHidden(this.cm.findColumnIndex(this.lastGroupField), false);
				delete this.lastGroupField;
			}else if (eg && !hasLastGroupField){
				this.lastGroupField = groupField;
				this.cm.setHidden(colIndex, true);
			}else if (eg && hasLastGroupField && groupField !== this.lastGroupField) {
				this.mainBody.update('');
				var oldIndex = this.cm.findColumnIndex(this.lastGroupField);
				this.cm.setHidden(oldIndex, false);
				this.lastGroupField = groupField;
				this.cm.setHidden(colIndex, true);
			}
		}
		return Ext.grid.GroupingView.superclass.renderRows.apply(
			this, arguments);
	},


	doRender : function(cs, rs, ds, startRow, colCount, stripe){
		if(rs.length < 1){
			return '';
		}
		var groupField = this.getGroupField(),
			colIndex = this.cm.findColumnIndex(groupField),
			g;

		this.enableGrouping = (this.enableGrouping === false) ? false : !!groupField;

		if(!this.enableGrouping || this.isUpdating){
			return Ext.grid.GroupingView.superclass.doRender.apply(
				this, arguments);
		}
		var gstyle = 'width:' + this.getTotalWidth() + ';',
			cfg = this.cm.config[colIndex],
			groupRenderer = cfg.groupRenderer || cfg.renderer,
			prefix = this.showGroupName ? (cfg.groupName || cfg.header)+': ' : '',
			groups = [],
			curGroup, i, len, gid;

		for(i = 0, len = rs.length; i < len; i++){
			var rowIndex = startRow + i,
				r = rs[i],
				gvalue = r.data[groupField];

			g = this.getGroup(gvalue, r, groupRenderer, rowIndex, colIndex, ds);
			if(!curGroup || curGroup.group != g){
				gid = this.constructId(gvalue, groupField, colIndex);


				this.state[gid] = !(Ext.isDefined(this.state[gid]) ? !this.state[gid] : this.startCollapsed);
				curGroup = {
					group: g,
					gvalue: gvalue,
					text: prefix + g,
					groupId: gid,
					startRow: rowIndex,
					rs: [r],
					cls: this.state[gid] ? '' : 'x-grid-group-collapsed',
					style: gstyle
				};
				groups.push(curGroup);
			}else{
				curGroup.rs.push(r);
			}
			r._groupId = gid;
		}

		var buf = [];
		for(i = 0, len = groups.length; i < len; i++){
			g = groups[i];
			this.doGroupStart(buf, g, cs, ds, colCount);
			buf[buf.length] = Ext.grid.GroupingView.superclass.doRender.call(
				this, cs, g.rs, ds, g.startRow, colCount, stripe);

			this.doGroupEnd(buf, g, cs, ds, colCount);
		}
		return buf.join('');
	},


	getGroupId : function(value){
		var field = this.getGroupField();
		return this.constructId(value, field, this.cm.findColumnIndex(field));
	},


	constructId : function(value, field, idx){
		var cfg = this.cm.config[idx],
			groupRenderer = cfg.groupRenderer || cfg.renderer,
			val = (this.groupMode == 'value') ? value : this.getGroup(value, {data:{}}, groupRenderer, 0, idx, this.ds);

		return this.getPrefix(field) + Ext.util.Format.htmlEncode(val);
	},


	getPrefix: function(field){
		return this.grid.getGridEl().id + '-gp-' + field + '-';
	},


	doGroupStart : function(buf, g, cs, ds, colCount){
		buf[buf.length] = this.startGroup.apply(g);
	},


	doGroupEnd : function(buf, g, cs, ds, colCount){
		buf[buf.length] = this.endGroup;
	},


	getRows : function(){
		if(!this.enableGrouping){
			return Ext.grid.GroupingView.superclass.getRows.call(this);
		}
		var r = [];
		var g, gs = this.getGroups();
		for(var i = 0, len = gs.length; i < len; i++){
			g = gs[i].childNodes[1].childNodes;
			for(var j = 0, jlen = g.length; j < jlen; j++){
				r[r.length] = g[j];
			}
		}
		return r;
	},


	updateGroupWidths : function(){
		if(!this.enableGrouping || !this.hasRows()){
			return;
		}
		var tw = Math.max(this.cm.getTotalWidth(), this.el.dom.offsetWidth-this.getScrollOffset()) +'px';
		var gs = this.getGroups();
		for(var i = 0, len = gs.length; i < len; i++){
			gs[i].firstChild.style.width = tw;
		}
	},


	onColumnWidthUpdated : function(col, w, tw){
		Ext.grid.GroupingView.superclass.onColumnWidthUpdated.call(this, col, w, tw);
		this.updateGroupWidths();
	},


	onAllColumnWidthsUpdated : function(ws, tw){
		Ext.grid.GroupingView.superclass.onAllColumnWidthsUpdated.call(this, ws, tw);
		this.updateGroupWidths();
	},


	onColumnHiddenUpdated : function(col, hidden, tw){
		Ext.grid.GroupingView.superclass.onColumnHiddenUpdated.call(this, col, hidden, tw);
		this.updateGroupWidths();
	},


	onLayout : function(){
		this.updateGroupWidths();
	},


	onBeforeRowSelect : function(sm, rowIndex){
		this.toggleRowIndex(rowIndex, true);
	}
});

Ext.grid.GroupingView.GROUP_ID = 1000;
