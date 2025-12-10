var main;
( () => {
    "use strict";
    var e = {
        109: (e, t) => {
            function s(e, t) {
                const s = e.replace(/([\.\*\?\(\)\[\]\{\}])/g, "\\$1").replace(/\s+/g, "\\s+");
                return new RegExp(s,t ? "gi" : "g")
            }
            function i(e) {
                return " \n\r\t\v ".indexOf(e) >= 0
            }
            function a(e, t=null) {
                return null != t || (t = e.length),
                t - function(e, t=null) {
                    null != t || (t = e.length);
                    let s = 0;
                    for (let a = 0; a < t; ++a)
                        i(e[a]) && ++s;
                    return s
                }(e, t)
            }
            Object.defineProperty(t, "__esModule", {
                value: !0
            }),
            t.ElementCharacters = void 0,
            t.ElementCharacters = class {
                constructor(e) {
                    this.element = e
                }
                find(e, t=!1) {
                    const {textContent: i} = this.element
                      , r = s(e, t).exec(i);
                    if (r) {
                        const e = a(i, r.index)
                          , t = a(r[0]);
                        return {
                            element: this.element,
                            from: e,
                            to: e + t
                        }
                    }
                    return null
                }
                findAll(e, t=!1) {
                    const {textContent: i} = this.element
                      , r = s(e, t)
                      , n = [];
                    for (; ; ) {
                        const e = r.exec(i);
                        if (!e)
                            break;
                        {
                            const t = a(i, e.index)
                              , s = a(e[0]);
                            n.push({
                                element: this.element,
                                from: t,
                                to: t + s
                            })
                        }
                    }
                    return n
                }
                getCharacters(e) {
                    return this.element.textContent.replace(/\s+/g, "").slice(e.from, e.to)
                }
                mapFromSelectionRange(e) {
                    if (!e.intersectsNode(this.element))
                        return null;
                    const {Text: t} = this.element.ownerDocument.defaultView;
                    let s, i, r = null, n = 0;
                    if (e.startContainer instanceof t)
                        r = e.startContainer,
                        n = e.startOffset;
                    else {
                        const t = this.createTreeWalker();
                        let s = t.nextNode();
                        for (; s; ) {
                            if (e.intersectsNode(s) && e.comparePoint(s, 0) >= 0) {
                                r = s;
                                break
                            }
                            s = t.nextNode()
                        }
                        if (!r)
                            return null
                    }
                    if (e.endContainer instanceof t)
                        s = e.endContainer,
                        i = e.endOffset;
                    else {
                        const t = this.createTreeWalker();
                        let a = t.currentNode = r;
                        for (; a; ) {
                            const {textContent: r} = a;
                            if (!(e.intersectsNode(a) && e.comparePoint(a, r.length) <= 0))
                                break;
                            s = a,
                            i = r.length,
                            a = t.nextNode()
                        }
                        if (!s)
                            return null
                    }
                    const o = this.createTreeWalker();
                    let d = o.nextNode()
                      , l = 0
                      , c = -1;
                    for (; d; ) {
                        const {textContent: e} = d;
                        if (d === r && (c = l + a(e, n)),
                        d === s) {
                            l += a(e, i);
                            break
                        }
                        l += a(e),
                        d = o.nextNode()
                    }
                    return -1 === c ? null : {
                        element: this.element,
                        from: c,
                        to: l
                    }
                }
                mapFromTextRange(e) {
                    if (!this.element.contains(e.node))
                        throw new Error("Range refers to a foreign element.");
                    const t = this.createTreeWalker();
                    let s = t.nextNode()
                      , i = 0;
                    for (; s; ) {
                        const {textContent: r} = s;
                        if (s === e.node)
                            return {
                                element: this.element,
                                from: i + a(r, e.from),
                                to: i + a(r, e.to)
                            };
                        i += a(r),
                        s = t.nextNode()
                    }
                    throw new Error("Unreachable code.")
                }
                mapToTextRanges(e) {
                    if (e.element !== this.element)
                        throw new Error("Range refers to a foreign element.");
                    const t = this.createTreeWalker();
                    let s = t.nextNode()
                      , a = 0;
                    const r = [];
                    for (; s; ) {
                        const {textContent: n} = s;
                        let o = 0
                          , d = r.length ? 0 : -1;
                        for (; o < n.length && a < e.to; )
                            i(n[o]) || (-1 === d && a === e.from && (d = o),
                            ++a),
                            ++o;
                        if (a >= e.from && d >= 0 && (r.push({
                            node: s,
                            from: d,
                            to: o
                        }),
                        d = -1),
                        a === e.to)
                            return r;
                        s = t.nextNode()
                    }
                    return []
                }
                createTreeWalker() {
                    const e = this.element.ownerDocument
                      , {NodeFilter: t} = e.defaultView;
                    return e.createTreeWalker(this.element, t.SHOW_TEXT)
                }
            }
        }
        ,
        946: (e, t, s) => {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }),
            t.HighlightResult = t.Highlighter = void 0;
            const i = s(109)
              , a = s(34);
            t.Highlighter = class {
                constructor(e, t) {
                    this.characters = new i.ElementCharacters(e),
                    this.options = Object.assign({
                        tagName: "mark"
                    }, t)
                }
                get element() {
                    return this.characters.element
                }
                highlightText(e, t=!1) {
                    const s = this.characters.find(e, t);
                    if (s) {
                        const e = this.highlightRangeImpl(s);
                        return new r(e)
                    }
                    return new r([])
                }
                highlightAllText(e, t=!1) {
                    const s = this.characters.findAll(e, t)
                      , i = [];
                    for (const e of s)
                        i.push(...this.highlightRangeImpl(e));
                    return new r(i)
                }
                highlightRange(e) {
                    const t = this.highlightRangeImpl(e);
                    return new r(t)
                }
                highlightRangeImpl(e) {
                    if (e.element !== this.element)
                        throw new Error("Range refers to a foreign element.");
                    return this.characters.mapToTextRanges(e).filter((e => {
                        var t, s;
                        return null === (s = null === (t = this.options.onBeforeHighlighting) || void 0 === t ? void 0 : t.call(this, e)) || void 0 === s || s
                    }
                    )).map((e => a.spliceText(e, this.createReplacementElement.bind(this)).newNode))
                }
                createReplacementElement(e) {
                    var t;
                    const s = this.element.ownerDocument.createElement(this.options.tagName);
                    if (s.textContent = e,
                    null === (t = this.options.onHighlighting) || void 0 === t || t.call(this, s, e),
                    s.textContent !== e)
                        throw new Error("Text content may not be modified.");
                    return s
                }
            }
            ;
            class r {
                constructor(e) {
                    this.replacementElements = e
                }
                undo() {
                    for (const e of this.replacementElements)
                        e.isConnected && e.replaceWith(...e.childNodes)
                }
            }
            t.HighlightResult = r
        }
        ,
        753: (e, t, s) => {
            t.MD = void 0;
            s(109);
            var i = s(946);
            Object.defineProperty(t, "MD", {
                enumerable: !0,
                get: function() {
                    return i.Highlighter
                }
            });
            s(34)
        }
        ,
        34: (e, t) => {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }),
            t.spliceText = void 0,
            t.spliceText = function(e, t) {
                const {node: s, from: i, to: a} = e
                  , r = a - i;
                if (0 === r)
                    return null;
                const n = s.textContent.substr(i, r)
                  , o = t(n);
                if (o) {
                    const e = i > 0 ? s.splitText(i) : s
                      , t = e !== s ? s : null;
                    let a = null;
                    return n.length < e.length && (a = e.splitText(n.length)),
                    e.replaceWith(o),
                    {
                        prefix: t,
                        newNode: o,
                        suffix: a
                    }
                }
                return null
            }
        }
    }
      , t = {};
    function s(i) {
        var a = t[i];
        if (void 0 !== a)
            return a.exports;
        var r = t[i] = {
            exports: {}
        };
        return e[i](r, r.exports, s),
        r.exports
    }
    s.d = (e, t) => {
        for (var i in t)
            s.o(t, i) && !s.o(e, i) && Object.defineProperty(e, i, {
                enumerable: !0,
                get: t[i]
            })
    }
    ,
    s.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t),
    s.r = e => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ;
    var i = {};
    s.r(i),
    s.d(i, {
        init: () => Gs
    });
    class a {
        constructor() {
            this.entries = new Map
        }
        add(e, t) {
            return this.entries.set(e, t),
            this
        }
        get(e) {
            return this.entries.get(e) || (e && e.constructor ? this.entries.get(e.constructor) : void 0)
        }
    }
    var r = {
        regex: /\[\[([\s\S]+?)\]\]/g,
        mapper: function(e, t) {
            return "function() {\n try { with( data ) {\n return " + t + " } } catch (error) { this.log( error ) } }.call( this )"
        }
    }
      , n = {};
    function o(e, t=["data"]) {
        let s = e + t.join(" ");
        if (n[s])
            return n[s];
        let i = e.match(/\[\[([\s\S]+?)\]\]/);
        if (i && i[0] == e)
            var a = e.replace(r.regex, ( (e, t) => "return " + r.mapper(e, t) + ";"));
        else
            a = "return `" + e.replace(r.regex, ( (e, t) => "` + this.empty( " + r.mapper(e, t) + " ) + `")) + "`;";
        var o = new Function(...t,a);
        return n[s] = o,
        o
    }
    function d(e) {
        return e || 0 === e ? e : ""
    }
    function l(...e) {
        console && (console.trace ? console.trace(...e) : console.log(...e))
    }
    function c(e) {
        return r.regex.lastIndex = 0,
        r.regex.test(e)
    }
    class h {
        constructor(e) {
            this.context = e
        }
    }
    function p(e) {
        return e.replace(/(\-\w)/g, (e => e[1].toUpperCase()))
    }
    class u {
        constructor(e) {
            this.subscribe_ = e
        }
        debounce(e) {
            return new u((t => {
                let s;
                return this.subscribe((i => {
                    clearTimeout(s),
                    s = setTimeout(( () => {
                        s = null,
                        t(i)
                    }
                    ), e)
                }
                ))
            }
            ))
        }
        filter(e) {
            return new u((t => this.subscribe((s => {
                e(s) && t(s)
            }
            ))))
        }
        map(e) {
            return new u((t => this.subscribe((s => {
                t(e(s))
            }
            ))))
        }
        subscribe(e) {
            return this.subscribe_(e)
        }
    }
    class v extends u {
        constructor() {
            super((e => {
                this.observers_ ? this.observers_.indexOf(e) < 0 && this.observers_.push(e) : this.observers_ = [e];
                const t = this.observers_;
                return {
                    unsubscribe: () => {
                        const s = t.indexOf(e);
                        s >= 0 && t.splice(s, 1)
                    }
                }
            }
            )),
            this.observers_ = []
        }
        dispatch(e) {
            if (this.observers_)
                for (const t of [...this.observers_])
                    t(e)
        }
    }
    function m(e, t) {
        return new u((s => {
            let i = e => s(e);
            return t.addEventListener(e, i),
            {
                unsubscribe: () => {
                    t.removeEventListener(e, i)
                }
            }
        }
        ))
    }
    function g(e, t, s, i) {
        let a = b(e, t)
          , r = b(s, i);
        a && r && r.propertyChange.filter((e => e.name == i)).subscribe(( () => {
            a.propertyChange.dispatch({
                name: t
            })
        }
        ))
    }
    function b(e, ...t) {
        if (!e)
            return;
        let s = e;
        s.propertyChange && "function" == typeof s.propertyChange.subscribe || (s.propertyChange = new v),
        0 == t.length && (t = Object.keys(s));
        let i = {};
        for (const a of t) {
            if ("propertyChange" == a)
                continue;
            let t, r = s;
            for (; null != r && null == t; )
                t = Object.getOwnPropertyDescriptor(r, a),
                r = Object.getPrototypeOf(r);
            t ? t.get || t.set || (i[a] = e[a]) : i[a] = void 0
        }
        for (let e in i)
            Object.defineProperty(s, e, {
                get: () => i[e],
                set(t) {
                    i[e] !== t && (i[e] = t,
                    s.propertyChange.dispatch({
                        name: e
                    }))
                },
                enumerable: !0,
                configurable: !0
            });
        return s
    }
    function f(e) {
        if (!Array.isArray(e))
            return;
        let t = e;
        if (t.arrayChange)
            return t;
        t.arrayChange = new v;
        for (const e of ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"]) {
            const s = t[e];
            t[e] = function(...e) {
                const i = s.apply(this, e);
                return t.arrayChange.dispatch({}),
                i
            }
        }
        return t
    }
    class w extends h {
        constructor(e, t) {
            super(e),
            this.expression = o(t, ["event", "data"])
        }
        subscribe(e) {
            this.unsubscribe(),
            this.subscription = e.subscribe(this.invoke.bind(this))
        }
        unsubscribe() {
            this.subscription && this.subscription.unsubscribe()
        }
        invoke(e) {
            this.expression.call(this.context, e, this.context.data)
        }
        destroy() {
            this.unsubscribe()
        }
    }
    class x extends w {
        constructor(e, t, s, i) {
            super(e, t),
            this.event = s,
            this.node = i,
            this.updateSubscription()
        }
        updateSubscription() {
            this.subscribe(m(this.event, this.node))
        }
    }
    class y extends h {
        constructor(e, t) {
            super(e),
            this.expression = o(t, ["data"]);
            const s = J.logging;
            J.logging = !1,
            this.trace(),
            J.logging = s,
            this.subscribe()
        }
        inital() {
            this.update()
        }
        subscribe() {
            this.root.subscribeTo(this.context.data)
        }
        destroy() {
            this.root.destroy()
        }
        trace() {
            this.root = new M(this);
            var e = {
                has: () => !0,
                get: (t, s, i) => s == Symbol.unscopables ? {} : s == Symbol.toPrimitive ? e => "number" == e ? 1 : "" : ["JSON", "Math", "*this*"].indexOf(s) >= 0 ? void 0 : "data" == s && t == this.root ? t : (t.properties.has(s) || t.properties.set(s, new M(t.expression)),
                new Proxy(t.properties.get(s),e))
            };
            this.expression.call(this.context, new Proxy(this.root,e))
        }
        getExpressionValue() {
            return this.expression.call(this.context, this.context.data)
        }
    }
    const k = {
        checked: [HTMLInputElement],
        disabled: [HTMLButtonElement, HTMLFieldSetElement, HTMLInputElement, HTMLOptGroupElement, HTMLOptionElement, HTMLSelectElement, HTMLTextAreaElement],
        selected: [HTMLOptionElement],
        hidden: [Element],
        readonly: [HTMLInputElement, HTMLTextAreaElement],
        required: [HTMLInputElement, HTMLTextAreaElement, HTMLSelectElement]
    };
    class A extends y {
        constructor(e, t, s) {
            var i;
            super(s, t.value),
            this.node = e,
            this.attribute = t,
            this.boolean = null === (i = k[t.name]) || void 0 === i ? void 0 : i.some((t => e instanceof t))
        }
        update() {
            (this.node instanceof HTMLInputElement || this.node instanceof HTMLTextAreaElement) && ("value" != this.attribute.name && "checked" != this.attribute.name || (this.node[this.attribute.name] = this.getExpressionValue())),
            this.boolean ? this.getExpressionValue() ? this.node.setAttribute(this.attribute.name, "true") : this.node.removeAttribute(this.attribute.name) : this.node.setAttribute(this.attribute.name, this.getExpressionValue())
        }
    }
    class C extends A {
        constructor(e, t, s) {
            super(e, t, s),
            this.expressionString = t.value
        }
        getExpressionValue() {
            return e = e => {
                let t = o(e).call(this.context, this.context.data);
                return t && "object" == typeof t ? Object.keys(t).filter((e => t[e])).join(" ") : t
            }
            ,
            this.expressionString.replace(r.regex, e);
            var e
        }
    }
    class S extends y {
        constructor(e, t) {
            super(t, e.nodeValue),
            this.node = e
        }
        update() {
            this.node.nodeValue = this.context.empty(this.getExpressionValue())
        }
    }
    class M {
        constructor(e) {
            this.properties = new Map,
            this.expression = e
        }
        subscribeTo(e) {
            if (this.unsubscribe(),
            e && e instanceof Object && this.hasProperties()) {
                if (Array.isArray(e))
                    this.subscription = f(e).arrayChange.subscribe(this.onArrayChange.bind(this));
                else {
                    let t = [...this.properties.keys()];
                    t.unshift(e);
                    let s = b.apply(null, t);
                    this.subscription = s.propertyChange.subscribe(this.onObjectChange.bind(this))
                }
                this.properties.forEach(( (t, s) => {
                    t.subscribeTo(e[s])
                }
                ))
            }
        }
        unsubscribe() {
            this.subscription && this.subscription.unsubscribe(),
            this.properties.forEach(( (e, t) => {
                e.unsubscribe()
            }
            ))
        }
        onObjectChange(e) {
            let t = this.properties.get(e.name);
            t && (this.expression.update(),
            t.hasProperties() && this.expression.subscribe())
        }
        onArrayChange(e) {
            this.expression.update(),
            this.properties.size > 0 && this.expression.subscribe()
        }
        hasProperties() {
            return this.properties.size > 0
        }
        destroy() {
            this.unsubscribe();
            for (const e of this.properties.values())
                e.destroy();
            this.properties = new Map
        }
    }
    class T extends A {
        constructor(e, t) {
            super(e, e.attributes.getNamedItem("view"), t.context),
            this.template = t,
            this.expressions = [],
            this.mergers = [],
            this.parseAttributes(),
            this.parseInnerTemplates()
        }
        inital() {
            this.renderView()
        }
        update() {
            this.rerenderCheck.flag = !0
        }
        renderView() {
            for (const e of this.mergers)
                e.reset();
            this.mergers = [],
            this.view && this.view.destroy();
            let e = this.getExpressionValue();
            if (this.view = K(e, this.context),
            this.view) {
                var t;
                this.expressions.forEach((e => {
                    var t;
                    (t = e) && t.inital && e.inital()
                }
                )),
                (t = this.view) && t.prepareContent && this.view.prepareContent(this.node, this.template);
                for (const e of this.innerTemplates)
                    this.view.registry.add(e.name, ( () => {
                        const t = e.data ? o(e.data, ["data"]).call(this.context, this.context.data) : this.context.data;
                        return new Y({
                            template: e.template,
                            data: t
                        })
                    }
                    ));
                this.view.template.render(),
                this.node.setAttribute("view", this.getViewName(e)),
                this.mergeNodes(),
                this.expressions.forEach((e => {
                    e instanceof D && e.updateSubscription()
                }
                )),
                this.rerenderCheck.subscribe(),
                ee(this.view)
            }
        }
        parseAttributes() {
            let e = Array.prototype.slice.call(this.node.attributes);
            for (const t of e) {
                if ("data" == t.name) {
                    let e = new E(this,t.value);
                    this.rerenderCheck = new L(this,t.value + " " + this.node.getAttribute("view")),
                    this.node.removeAttribute(t.name),
                    this.expressions.unshift(e)
                } else
                    this.rerenderCheck = new L(this,this.node.getAttribute("view"));
                if (0 == t.name.indexOf("data-")) {
                    let e = new O(this,t.value,p(t.name.substring(5)));
                    this.node.removeAttribute(t.name),
                    this.expressions.push(e)
                }
                if (0 == t.name.indexOf("on-data-")) {
                    let e = p(t.name.replace("on-data-", ""))
                      , s = new N(this,t.value,e);
                    this.node.removeAttribute(t.name),
                    this.expressions.push(s)
                }
                if (0 == t.name.indexOf("on-")) {
                    let e = p(t.name.replace("on-", ""))
                      , s = new I(this,t.value,e);
                    this.node.removeAttribute(t.name),
                    this.expressions.push(s)
                }
            }
        }
        parseInnerTemplates() {
            const e = Array.from(this.node.children).filter((e => "TEMPLATE" == e.tagName));
            this.innerTemplates = Array.from(e).map((e => (e.parentNode.removeChild(e),
            {
                name: e.getAttribute("name"),
                template: e.innerHTML,
                data: e.getAttribute("data")
            }))),
            "" != this.node.innerHTML.trim() && this.innerTemplates.push({
                name: "Content",
                template: this.node.innerHTML,
                data: void 0
            })
        }
        destroy() {
            this.view && this.view.destroy();
            for (const e of this.expressions)
                e.destroy();
            this.rerenderCheck.destroy()
        }
        mergeNodes() {
            let e = Array.prototype.slice.call(this.node.attributes).concat(Array.prototype.slice.call(this.view.node.attributes)).map((e => e.name));
            for (e = e.filter(( (t, s) => e.indexOf(t) === s)),
            e.forEach((e => {
                let t = new P(this.node,e);
                t.setupInner(this.view.template),
                t.setupOuter(this.template),
                t.update(),
                this.mergers.push(t)
            }
            )),
            this.node.innerHTML = ""; this.view.node.hasChildNodes(); )
                this.node.appendChild(this.view.node.firstChild);
            this.view.template.filterExpressions((e => e instanceof x && e.node == this.view.node)).forEach((e => {
                e.node = this.node,
                e.updateSubscription()
            }
            )),
            this.view.template.node = this.node
        }
        getViewName(e) {
            if ("string" == typeof e)
                return e;
            if ("function" == typeof e)
                return e.toString().match(/function\s(.*?)\(/)[1];
            if ("object" == typeof e && null !== e) {
                let t = e.constructor.toString().match(/class\s(.*?)\s/);
                if (t)
                    return t[1];
                if (t = e.constructor.toString().match(/function\s(.*?)\(/),
                t)
                    return t[1]
            }
            return ""
        }
    }
    class O extends y {
        constructor(e, t, s) {
            super(e.context, t),
            this.attribute = s,
            this.viewExpression = e
        }
        update() {
            this.viewExpression.view.data[this.attribute] = this.getExpressionValue()
        }
    }
    class E extends y {
        constructor(e, t) {
            super(e.context, t),
            this.viewExpression = e
        }
        inital() {
            const e = this.getExpressionValue();
            null != e && (this.viewExpression.view.data = e)
        }
        update() {
            this.viewExpression.rerenderCheck.flag = !0
        }
    }
    class D extends w {
        constructor(e, t) {
            super(e.context, t),
            this.viewExpression = e
        }
        updateSubscription() {}
    }
    class N extends D {
        constructor(e, t, s) {
            super(e, t),
            this.attribute = s
        }
        updateSubscription() {
            let e = this.viewExpression.view.data;
            if (!e)
                return;
            let t = b(e, this.attribute);
            this.subscribe(t.propertyChange.filter((e => e.name == this.attribute)));
            let s = e[this.attribute];
            Array.isArray(s) && this.subscribeArray(f(s).arrayChange),
            this.invoke()
        }
        invoke() {
            super.invoke({
                name: this.attribute,
                value: this.viewExpression.view.data[this.attribute]
            })
        }
        subscribeArray(e) {
            this.unsubscribeArray(),
            this.arraySubscription = e.subscribe(this.invoke.bind(this))
        }
        unsubscribeArray() {
            this.arraySubscription && this.subscription.unsubscribe()
        }
        destroy() {
            super.destroy(),
            this.unsubscribeArray()
        }
    }
    class I extends D {
        constructor(e, t, s) {
            super(e, t),
            this.signalName = s
        }
        updateSubscription() {
            const e = this.viewExpression.view.data;
            if (!e)
                return;
            let t = e[this.signalName];
            t instanceof v && this.subscribe(t)
        }
    }
    class P {
        constructor(e, t) {
            this.node = e,
            this.attr = t
        }
        setupInner(e) {
            this.inner = e.filterExpressions((t => t instanceof A && t.node == e.node && t.attribute.name == this.attr))[0],
            !this.inner || this.inner instanceof T ? this.inner = new A(e.node,this.getAttrOf(e.node),e.context) : this.inner.update = this.update.bind(this)
        }
        setupOuter(e) {
            this.outer = e.filterExpressions((e => e instanceof A && e.node == this.node && e.attribute.name == this.attr))[0],
            !this.outer || this.outer instanceof T ? this.outer = new A(this.node,this.getAttrOf(this.node),e.context) : this.outer.update = this.update.bind(this)
        }
        update() {
            let e = this.outer.getExpressionValue()
              , t = this.inner.getExpressionValue();
            if ("class" == this.attr) {
                let s = (e + " " + t).split(" ").filter((e => e.length > 0))
                  , i = this.node.classList;
                this.node.setAttribute("class", ""),
                i.add.apply(i, s)
            } else
                this.node.setAttribute(this.attr, t || e)
        }
        getAttrOf(e) {
            let t = e.attributes[this.attr];
            return t || (t = {
                name: this.attr,
                value: ""
            }),
            t
        }
        reset() {
            this.node.setAttribute(this.attr, this.outer.getExpressionValue())
        }
    }
    class L extends y {
        constructor(e, t) {
            super(e.context, t),
            this.flag = !1,
            this.viewExpression = e
        }
        update() {
            this.flag && this.viewExpression.renderView(),
            this.flag = !1
        }
    }
    var H, j = {};
    function _(e, t={}) {
        if (null == e)
            return "";
        var s, i, a, r, n = function(e) {
            let t = o("[[ data" + e.split(".").map((e => '["' + e + '"]')).join("") + " ]]").call(J, j);
            return "string" == typeof t ? t : e
        }(e);
        return null != t.condition && (s = n,
        i = t.condition,
        r = function(e, t) {
            for (var s = 0; s < e.length; s++) {
                var i = /^[\{\[]([^\[\]\{\}]*)[\}\]](.*)/.exec(e[s]);
                if (null != i && 3 == i.length) {
                    var a = i[2]
                      , r = i[1]
                      , n = t;
                    if (r.indexOf(",") > -1) {
                        var [o,d] = r.split(",");
                        if ("*" == d && n >= parseInt(o))
                            return a;
                        if ("*" == o && n <= parseInt(d))
                            return a;
                        if (n >= parseInt(o) && n <= parseInt(d))
                            return a
                    } else if (parseInt(r) == n)
                        return a
                }
            }
        }(a = s.split("|"), i),
        n = r ? r.trim() : 1 == a.length ? z(a[0]) : z(a[1 == i ? 0 : 1])),
        t.data && (n = o(n).call(J, t.data)),
        n
    }
    function z(e) {
        return e.replace(/^[\{\[]([^\[\]\{\}]*)[\}\]]/, "").trim()
    }
    class R {
        constructor(e) {
            e && (Object.assign(this, e),
            b(this))
        }
    }
    function q(e, t, s) {
        if (s || (s = e => e.modelName || "default"),
        Array.isArray(e) && (e = e.map((e => q(e, t, s)))),
        e && e.constructor == Object) {
            let i = t.get(s(e));
            return Object.keys(e).forEach((i => {
                e[i] = q(e[i], t, s)
            }
            )),
            i ? i(e) : e
        }
        return e
    }
    class F {
        constructor(e) {
            this._method = "GET",
            this._headers = {},
            this.progress = new v,
            this._url = e,
            this.request = new XMLHttpRequest,
            this.request.onprogress = e => {
                this.progress.dispatch(e)
            }
        }
        method(e) {
            return this._method = e,
            this
        }
        headers(e) {
            return Object.assign(this._headers, e),
            this
        }
        timeout(e) {
            return this._timeout = e,
            this
        }
        load() {
            return this.sendRequest().then(this.parseJson)
        }
        send(e) {
            return this.sendRequest(e).then(this.parseJson)
        }
        url() {
            return this._url
        }
        jsonApi(e, t={}) {
            const s = this.relative(e);
            return s.headers({
                Accept: "application/json",
                "Content-Type": "application/json"
            }),
            s.method("POST"),
            s.send(JSON.stringify(t)).then((e => null == e ? void 0 : e.data)).catch((e => {
                let t = this.parseJson(e);
                throw new B(t.errors)
            }
            ))
        }
        relative(e) {
            const t = (this._url.endsWith("/") ? this._url.slice(0, -1) : this._url) + (e.startsWith("/") ? e : "/" + e)
              , s = new F(t);
            return s.headers(this._headers),
            s.method(this._method),
            s.timeout(this._timeout),
            s
        }
        sendRequest(e=null) {
            var t = this.request
              , s = this.promise(t);
            return t.open(this._method, this._url),
            Object.keys(this._headers).forEach((e => {
                t.setRequestHeader(e, this._headers[e])
            }
            )),
            t.send(e),
            s
        }
        promise(e) {
            return new Promise(( (t, s) => {
                var i;
                this._timeout && (i = setTimeout(( () => e.abort()), this._timeout));
                var a = function() {
                    const t = `Request \`${this._method} ${this._url}\` has exceeded its timeout of ${this._timeout} milliseconds.`
                      , i = new DOMException(t,"AbortError");
                    V.error.dispatch({
                        error: t,
                        request: e
                    }),
                    s(i)
                }
                .bind(this)
                  , r = function() {
                    i && clearTimeout(i);
                    let t = "Request `" + this._method + " " + this._url + "` failed with `" + e.status;
                    const a = e.statusText;
                    t += a ? " " + a + "`" : "`";
                    const r = e.responseText;
                    t += r ? ":\n" + r : ".";
                    const n = new Error(t);
                    V.error.dispatch({
                        error: t,
                        request: e
                    }),
                    s(n)
                }
                .bind(this);
                e.onload = function() {
                    i && clearTimeout(i),
                    e.status >= 200 && e.status < 300 ? t(e.responseText) : r()
                }
                ,
                e.onabort = a,
                e.onerror = r
            }
            ))
        }
        parseJson(e) {
            if (e)
                try {
                    return JSON.parse(e)
                } catch (e) {}
            return e
        }
    }
    class B extends Error {
        constructor(e) {
            super("JsonApiError"),
            this.errors = e
        }
    }
    class V {
        static post(e) {
            return new F(e).method("POST")
        }
        static get(e) {
            return new F(e).method("GET")
        }
        static put(e) {
            return new F(e).method("PUT")
        }
        static delete(e) {
            return new F(e).method("DELETE")
        }
    }
    function W(e, t) {
        var s;
        (H = e).lang && (s = H.lang,
        j = s),
        H.data && t && (H.data = q(H.data, t))
    }
    function Z(e) {
        return U(e, H.data)
    }
    function G(e, t={}) {
        let s = U(e, H.routes);
        if (!s)
            throw new Error("Route: '" + e + "' could not be found in setup routes.");
        let i = o(s.url).call({
            empty: d,
            log: l
        }, t)
          , a = new F(i);
        return s.method && a.method(s.method),
        s.headers && a.headers(s.headers),
        a
    }
    function U(e, t=H) {
        return o("[[ " + e + " ]]").call({
            empty: d,
            log: (...e) => {
                J.logging && l(...e)
            }
        }, t)
    }
    V.error = new v;
    class $ {
        constructor(e) {
            e.type || (e.type = this.guessType(e.url)),
            this.config = e
        }
        load() {
            return $.promises[this.config.url] || ("js" == this.config.type ? this.loadScript() : this.loadCSS()),
            $.promises[this.config.url]
        }
        loadScript() {
            var e = this.config.url;
            $.promises[e] = new Promise(( (t, s) => {
                var i = document.createElement("script");
                i.src = e,
                i.addEventListener("load", (e => t())),
                i.addEventListener("error", (e => s())),
                document.body.appendChild(i)
            }
            )).then((t => {
                this.finalize(e)
            }
            ))
        }
        loadCSS() {
            var e = this.config.url;
            $.promises[e] = new Promise(( (t, s) => {
                var i = document.createElement("link");
                i.type = "text/css",
                i.rel = "stylesheet",
                i.href = e,
                i.addEventListener("load", (e => t())),
                i.addEventListener("error", (e => s())),
                document.head.appendChild(i)
            }
            )).then((t => {
                this.finalize(e)
            }
            ))
        }
        finalize(e) {
            $.promises[e] = new Promise(( (e, t) => e()))
        }
        guessType(e) {
            return "js" == e.split(".").pop() ? "js" : "css"
        }
    }
    $.promises = {};
    class X {
        constructor(e) {
            this.expressions = [],
            this.content = e,
            this.context = {
                data: {},
                registry: new Q
            },
            Object.setPrototypeOf(this.context, J)
        }
        render() {
            this.node = this.content instanceof Element ? this.content : function(e) {
                let t = document.createElement("template");
                if (t.innerHTML = e,
                1 == t.content.children.length)
                    return t.content.children[0];
                {
                    let e = document.createElement("div");
                    return e.appendChild(t.content),
                    e
                }
            }(this.content),
            this.node.template = this,
            this.traverse(),
            this.expressions.forEach((e => {
                e instanceof y && e.inital()
            }
            ))
        }
        traverse() {
            let e = document.createTreeWalker(this.node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
                acceptNode: e => "script" == e.nodeName.toLowerCase() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
            })
              , t = this.node;
            for (; t; )
                if (this.processNode(t),
                t instanceof Element && t.getAttribute("view")) {
                    if (t = e.nextSibling(),
                    !t)
                        for (; e.parentNode() && !(t = e.nextSibling()); )
                            ;
                } else
                    t = e.nextNode()
        }
        processNode(e) {
            if (e instanceof Text)
                c(e.nodeValue) && this.expressions.push(new S(e,this.context));
            else if (e.getAttribute("view")) {
                this.processAttributes(e);
                let t = new T(e,this);
                this.expressions.push(t)
            } else
                this.processAttributes(e)
        }
        processAttributes(e) {
            Array.prototype.slice.call(e.attributes).forEach((t => {
                if (0 != t.name.indexOf("data-") && "view" != t.name)
                    if (0 == t.name.indexOf("on-")) {
                        let s = p(t.name.replace("on-", ""));
                        if (void 0 !== e["on" + s]) {
                            let i = new x(this.context,t.value,s,e);
                            this.expressions.push(i),
                            e.removeAttribute(t.name)
                        }
                    } else if (c(t.value)) {
                        let s = new ("class" == t.name ? C : A)(e,t,this.context);
                        this.expressions.push(s)
                    }
            }
            ))
        }
        destroy() {
            this.expressions.forEach((e => e.destroy()))
        }
        filterExpressions(e) {
            return this.expressions.filter(e)
        }
        extendContext(e) {
            this.context.parent = e,
            Object.setPrototypeOf(this.context, e)
        }
    }
    var J = {
        logging: !1,
        empty: d,
        log: (...e) => {
            J.logging && l(...e)
        }
        ,
        trans: _,
        setup: {
            data: Z,
            route: G,
            asset: function(e) {
                return new $(U(e, H.assets))
            },
            lookup: U
        },
        debug: () => {}
    };
    class Y {
        constructor(e={}) {
            this._template = new X(e.template),
            e.registry && (this._template.context.registry = e.registry),
            e.data && (this._template.context.data = e.data),
            this._template.context.view = this
        }
        render() {
            this._template.render(),
            ee(this)
        }
        init() {}
        destroy() {
            var e;
            this._template.destroy(),
            (e = this).data && "function" == typeof e.data.deinit && e.data.deinit(),
            e.deinit()
        }
        deinit() {}
        get node() {
            return this._template.node
        }
        get data() {
            return this._template.context.data
        }
        set data(e) {
            this._template.context.data = e
        }
        get context() {
            return this._template.context
        }
        get registry() {
            return this._template.context.registry
        }
        get template() {
            return this._template
        }
    }
    class Q extends a {
    }
    function K(e, t) {
        let s = function(e, t) {
            for (; t; ) {
                let s = t.registry.get(e);
                if (s)
                    return s;
                t = t.parent
            }
            return null
        }(e, t);
        if (!s)
            throw new Error("No registered view found with name: " + e);
        let i = s(e);
        return i.template.extendContext(t),
        i
    }
    function ee(e) {
        e.data && "function" == typeof e.data.init && e.data.init(),
        e.init()
    }
    class te extends Y {
        constructor(e) {
            super(Object.assign({
                template: "",
                data: new se
            }, e)),
            this.cache = new Map
        }
        prepareContent(e, t) {
            this.itemTemplate = e.innerHTML
        }
        init() {
            this.onDataChange()
        }
        deinit() {
            this.unsubscribe();
            for (const e of this.cache.values())
                e.destroy()
        }
        onDataChange() {
            this.unsubscribe(),
            this.subscribe(),
            this.renderItems()
        }
        renderItems() {
            let e = this.data.items;
            Array.isArray(e) || (e = []);
            let t = this.cache;
            this.cache = new Map,
            e.forEach(( (s, i) => {
                var a, r;
                let n = this.data.getCacheKey(s)
                  , o = t.get(n);
                o ? t.delete(n) : o = this.createTemplate(e, s, i),
                this.cache.set(n, o),
                (null === (a = this.node.childNodes) || void 0 === a ? void 0 : a[i]) != o.node && this.node.insertBefore(o.node, null === (r = this.node.childNodes) || void 0 === r ? void 0 : r[i])
            }
            )),
            t.forEach(( (e, t) => {
                var s, i;
                null === (i = null === (s = e.node) || void 0 === s ? void 0 : s.parentNode) || void 0 === i || i.removeChild(e.node),
                e.destroy()
            }
            ))
        }
        createTemplate(e, t, s) {
            let i = new X(this.itemTemplate)
              , a = {
                parent: this.template.context.parent.data,
                index: s,
                items: e,
                isFirst: t == e[0],
                isLast: t == e[e.length - 1]
            };
            return a[this.data.as] = t,
            i.context.data = a,
            i.extendContext(this.template.context),
            i.render(),
            i
        }
        subscribe() {
            var e, t;
            this.dataSubscription = null === (e = b(this.data, "items")) || void 0 === e ? void 0 : e.propertyChange.filter((e => "items" == e.name)).subscribe(this.onDataChange.bind(this)),
            this.arraySubscription = null === (t = f(this.data.items)) || void 0 === t ? void 0 : t.arrayChange.subscribe(this.onDataChange.bind(this))
        }
        unsubscribe() {
            var e, t;
            null === (e = this.dataSubscription) || void 0 === e || e.unsubscribe(),
            null === (t = this.arraySubscription) || void 0 === t || t.unsubscribe()
        }
    }
    class se extends R {
        constructor(e) {
            super(Object.assign({
                as: "item",
                items: [],
                caching: !0
            }, e))
        }
        set count(e) {
            this.items = Array.from(Array(e).keys())
        }
        getCacheKey(e) {
            return !0 === this.caching && "object" == typeof e ? e : {
                key: e
            }
        }
    }
    class ie extends Y {
        constructor() {
            super({
                template: "",
                data: {
                    if: !0
                }
            })
        }
        prepareContent(e, t) {
            this.contentTemplate = new X(e.innerHTML),
            e.innerHTML = ""
        }
        init() {
            this.checkVisibility(),
            this.dataSubscription = b(this.data, "if").propertyChange.filter((e => "if" == e.name)).subscribe(this.checkVisibility.bind(this))
        }
        checkVisibility() {
            var e;
            let t = this.contentTemplate.node;
            this.data.if ? (t || (this.contentTemplate.context = this.template.context.parent,
            this.contentTemplate.render(),
            t = this.contentTemplate.node),
            this.node.appendChild(t)) : null === (e = null == t ? void 0 : t.parentNode) || void 0 === e || e.removeChild(t)
        }
        deinit() {
            this.dataSubscription && this.dataSubscription.unsubscribe()
        }
    }
    class ae extends R {
        constructor(e={}) {
            super(Object.assign({
                isCollapsed: !0
            }, e))
        }
        toggle() {
            this.isCollapsed = !this.isCollapsed
        }
    }
    class re extends Y {
        constructor(e) {
            super(Object.assign({
                data: new ae,
                template: '<div> <div class="collapse-box transition-style"></div> <button class="button-style -action" on-click="[[ toggle() ]]">toggle</button> </div> '
            }, e))
        }
        prepareContent(e, t) {
            this.contentTemplate = new X(e.innerHTML),
            this.contentTemplate.context = this.context.parent,
            this.contentTemplate.render()
        }
        init() {
            this.collapseNode.appendChild(this.contentTemplate.node),
            this.data.propertyChange.filter((e => "isCollapsed" == e.name)).subscribe(this.updateHeight.bind(this)),
            setTimeout(this.updateHeight.bind(this), 1)
        }
        updateHeight() {
            this.data.isCollapsed ? this.collapseNode.removeAttribute("style") : this.collapseNode.setAttribute("style", "max-height: " + this.collapseNode.scrollHeight + "px;")
        }
        get collapseNode() {
            return this.node.getElementsByClassName("collapse-box")[0]
        }
    }
    class ne extends re {
        constructor() {
            super(...arguments),
            this.transitionEnd = () => {
                this.data.isCollapsed || this.collapseNode.setAttribute("style", "max-height: " + this.collapseNode.scrollHeight + "px;")
            }
        }
        updateHeight() {
            this.data.isCollapsed ? this.collapseNode.removeAttribute("style") : (this.collapseNode.addEventListener("transitionend", this.transitionEnd),
            this.collapseNode.setAttribute("style", "max-height: " + this.collapseNode.scrollHeight + "px;"))
        }
    }
    var oe = {
        p: "text-style -para",
        b: "text-style -b",
        i: "text-style -i",
        a: "text-style -a",
        ul: "text-style -list",
        ol: "text-style -list"
    };
    class de extends R {
    }
    class le extends Y {
        constructor(e) {
            super(Object.assign({
                data: new de({
                    styles: oe
                })
            }, e))
        }
        init() {
            this.subscription = b(this.data, "html").propertyChange.filter((e => "html" == e.name)).subscribe(this.update.bind(this)),
            this.update()
        }
        deinit() {
            this.subscription.unsubscribe()
        }
        update() {
            this.node.innerHTML = this.data.html,
            this.applyStyles(),
            this.resolveViews()
        }
        resolveViews() {
            let e = this.node.getAttribute("view");
            this.node.removeAttribute("view");
            let t = new X(this.node);
            t.context.data = this.context.parent.data,
            Object.setPrototypeOf(t.context, this.context),
            t.render(),
            this.node.setAttribute("view", e)
        }
        applyStyles() {
            const e = document.createTreeWalker(this.node, NodeFilter.SHOW_ELEMENT);
            for (; e.nextNode(); ) {
                const t = e.currentNode.nodeName.toLowerCase();
                if (t in this.data.styles) {
                    const s = e.currentNode;
                    s.classList.add.apply(s.classList, this.data.styles[t].split(" "))
                }
            }
        }
    }
    class ce extends R {
        constructor(e) {
            super(Object.assign({
                correct: !1,
                selected: !1
            }, e)),
            g(this, "correctlyAnswered", this, "correct"),
            g(this, "correctlyAnswered", this, "selected")
        }
        get correctlyAnswered() {
            return this.correct == this.selected
        }
    }
    class he extends R {
        constructor(e) {
            super(Object.assign({
                disabled: !1,
                evaluated: !1
            }, e))
        }
        updateCorrect() {
            this.propertyChange.dispatch({
                name: "correctlyAnswered"
            })
        }
        get correctlyAnswered() {
            return this.choices.every((e => e.correct == e.selected))
        }
    }
    class pe extends R {
        constructor(e={}) {
            super(Object.assign({
                bottomRight: {
                    x: 1,
                    y: 1
                },
                containedSpots: [],
                topLeft: {
                    x: 0,
                    y: 0
                }
            }, e))
        }
        get correctlyAnswered() {
            return 1 === this.containedSpots.length
        }
        removeSpot(e) {
            this.containedSpots = this.containedSpots.filter((t => t !== e)),
            this.propertyChange.dispatch({
                name: "correctlyAnswered"
            })
        }
        placeSpot(e) {
            e.x >= this.topLeft.x && e.x <= 1 - this.bottomRight.x && e.y >= this.topLeft.y && e.y <= 1 - this.bottomRight.y && (0 == this.containedSpots.length ? this.containedSpots.push(e) : this.containedSpots[0] = e,
            e.correctlyAnswered = 1 == this.containedSpots.length,
            this.propertyChange.dispatch({
                name: "correctlyAnswered"
            }))
        }
    }
    class ue extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div class="audio-player flex-layout -row -inline -items-center spacer-box -p-s color-box -primary30 border-style -radius-22"> <audio src="[[ source ]]"></audio> <div tabindex="0" on-click="[[ toggle( event ) ]]" class="spacer-box -m-between-h-s audio-focus-play"> <svg class="item -content -s30 spacer-box" view="Icon" data-icon="[[ nextState ]]"></svg> </div> <div class="item -content spacer-box -m-between-h-s text-style -infra -b -s9">[[ minutesOf( player.currentTime ) ]]</div> <div class="item spacer-box -m-between-h-s" view="SlideBar" data-ratio="[[ player.currentTime / player.duration ]]" on-seek="[[ player.currentTime = event.value * player.duration ]]"></div> <div class="item -content spacer-box -m-between-h-s -p-right text-style -infra -b -s9">[[ minutesOf( player.duration )]]</div> </div> ',
                data: new me
            }, e))
        }
        init() {
            this.data.registerPlayer(this.node.querySelector("audio"))
        }
    }
    class ve extends ue {
        constructor(e) {
            super(Object.assign({
                template: '<div class="flex-layout -row -inline -items-center spacer-box -p-s color-box -primary30 border-style -radius-22"> <audio src="[[ source ]]"></audio> <svg on-click="[[ toggle(event) ]]" class="item -s30 spacer-box -m-between-h-s" view="Icon" data-icon="[[ nextState ]]"></svg> </div> '
            }, e))
        }
    }
    class me extends R {
        constructor(e) {
            super(e)
        }
        registerPlayer(e) {
            this.player = e,
            e.addEventListener("play", ( () => this.dispatch("nextState"))),
            e.addEventListener("ended", ( () => this.dispatch("nextState"))),
            e.addEventListener("pause", ( () => this.dispatch("nextState"))),
            e.addEventListener("durationchange", (e => this.dispatch("player"))),
            e.addEventListener("timeupdate", (e => this.dispatch("player")))
        }
        toggle(e) {
            this.player.paused ? this.player.play() : this.player.pause(),
            e.preventDefault(),
            e.stopImmediatePropagation()
        }
        minutesOf(e) {
            e = Math.round(e);
            let t = Math.floor(e / 60)
              , s = e - 60 * t;
            return (t >= 10 ? t : "0" + t) + ":" + (s >= 10 ? s : "0" + s)
        }
        get nextState() {
            return null == this.player || this.player.paused ? "play" : "pause"
        }
        dispatch(e) {
            this.propertyChange.dispatch({
                name: e
            })
        }
    }
    class ge extends R {
        constructor(e) {
            super(Object.assign({}, e))
        }
    }
    class be extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div class="content-columns -wide" style="max-width:1280px"> <div class="grid-layout -gutter"> <div class="item -w1-2 -phone-only-1" view="Repeat" data-items="[[ left ]]" data-as="item"> <div class="spacer-box -m-bottom" view="[[ item.modelName ]]" data="[[ item ]]"></div> </div> <div class="item -w1-2 -phone-only-1" view="Repeat" data-items="[[ right ]]" data-as="item"> <div class="spacer-box -m-bottom" view="[[ item.modelName ]]" data="[[ item ]]"></div> </div> </div> </div> '
            }, e))
        }
    }
    function fe(e) {
        let t = function(e) {
            let t = e.getBoundingClientRect()
              , s = {
                top: t.top,
                left: t.left,
                right: t.right,
                bottom: t.bottom,
                height: t.height,
                width: t.width
            };
            return null == s.height && (s.height = s.bottom - s.top),
            null == s.width && (s.width = s.right - s.left),
            s
        }(e);
        return t.top += document.body.scrollTop || document.documentElement.scrollTop,
        t.bottom += document.body.scrollTop || document.documentElement.scrollTop,
        t.left += document.body.scrollLeft || document.documentElement.scrollLeft,
        t.right += document.body.scrollLeft || document.documentElement.scrollLeft,
        t
    }
    class we extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div class="slider-bar"> <div class="bar"> <div class="grab-knob" style="left: [[ ratio * 100 ]]%"></div> </div> </div> ',
                data: new xe
            }, e))
        }
        init() {
            this.subscribe(this.node.querySelector(".grab-knob"))
        }
        deinit() {
            this.unsubscribe()
        }
        onMouseDown(e) {
            e.preventDefault(),
            this.data.seeking = !0,
            this.upSubscription = m("mouseup", document.body).subscribe(this.onMouseUp.bind(this)),
            this.moveSubscription = m("mousemove", this.node).subscribe(this.onMouseMove.bind(this))
        }
        onMouseMove(e) {
            let t = this.calcRatio(e);
            this.node.querySelector(".grab-knob").style.left = 100 * t + "%"
        }
        onMouseUp(e) {
            this.moveSubscription.unsubscribe(),
            this.upSubscription.unsubscribe(),
            this.data.seeking = !1,
            this.data.seek.dispatch({
                value: this.calcRatio(e)
            })
        }
        calcRatio(e) {
            let t = fe(this.node.querySelector(".bar"));
            return Math.min(Math.max(0, (e.pageX - t.left) / t.width), 1)
        }
        subscribe(e) {
            this.downSubscription = m("mousedown", e).subscribe(this.onMouseDown.bind(this))
        }
        unsubscribe() {
            this.downSubscription.unsubscribe()
        }
    }
    class xe extends R {
        constructor(e) {
            super({
                ratio: 0,
                seeking: !1,
                config: e
            }),
            this.seek = new v
        }
        set ratio(e) {
            var t;
            this._ratio = e,
            this.seeking || null === (t = this.propertyChange) || void 0 === t || t.dispatch({
                name: "ratio"
            })
        }
        get ratio() {
            return this._ratio
        }
    }
    class ye extends Y {
        constructor() {
            super({
                template: '<div class="-no-break spacer-box -m-between-v-l text-style -max-read"> <div view="Show" data-if="[[ expandable ]]"> <div view="Collapse" data-is-collapsed="[[ !expanded ]]" class="border-style -dashed -radius"> <div> <div class="spacer-box -p" view="Repeat" data-items="[[ content ]]" data-as="item"> <div view="[[ item.modelName ]]" data="[[ item ]]"></div> </div> </div> </div> </div> <div view="Show" data-if="[[ !expandable ]]"> <div class="border-style -dashed -radius spacer-box -p" view="Repeat" data-items="[[ content ]]" data-as="item"> <div view="[[ item.modelName ]]" data="[[ item ]]"></div> </div> </div> <div class="_pointer text-style -read-more -center spacer-box -p-s [[ { \'_hidden\':!expandable } ]]" on-click="[[ expanded = !expanded ]]" tabindex="0"><span>[[ !expanded ? this.trans( \'readmore\' ) : this.trans( \'close\' ) ]]</span></div> </div> '
            })
        }
    }
    class ke extends R {
        constructor(e) {
            super(Object.assign({
                repetitions: 0,
                duration: 2,
                allowedRepetitions: 0,
                disabled: !1
            }, e)),
            this.showing = !1
        }
        showContent() {
            this.showing || this.repetitions > this.allowedRepetitions || (setTimeout(( () => {
                this.showing = !1,
                this.repetitions++,
                this.propertyChange.dispatch({
                    name: "remaining"
                })
            }
            ), 1e3 * this.duration),
            this.showing = !0)
        }
        get remaining() {
            return this.allowedRepetitions - this.repetitions + 1
        }
    }
    class Ae extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div class="-no-break [[ { \'flash-read\': !disabled } ]] [[{ \'-show\':showing, \'-disabled\':remaining == 0 }]] spacer-box -m-between-v-l" on-click="[[ showContent() ]]" tabindex="0"> <div class="content transition-style -fast"> <div class="spacer-box -p" view="Repeat" data-items="[[ content ]]" data-as="item"> <div view="[[ item.modelName ]]" data="[[ item ]]"></div> </div> </div> <div class="navi flex-layout -items-center spacer-box -m-top-l text-style -drag [[ { \'_hidden\': disabled } ]]"> <div view="Repeat" class="flex-layout -items-center" data-count="[[ remaining ]]" data-as="num"> <div class="spacer-box -p-right"> <svg class="eye-button" width="85px" height="43px" viewBox="0 0 85 43" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <path class="bg" d="M42.466,0 C26.592,0 11.728,7.133 0.505,20.093 C0.190612671,20.4959709 0.0136261107,20.98908 0,21.5 C0.00495655533,22.0315306 0.223745002,22.5386728 0.607,22.907 C11.83,35.867 26.693,43 42.466,43 C57.936,43 72.698,35.867 84.124,22.806 C84.7814902,22.0594605 84.7814902,20.9405395 84.124,20.194 C72.7,7.133 57.835,0 42.466,0 Z"> </path> <ellipse class="white transition-style" fill="#FFFFFF" cx="42.504" cy="21.583" rx="16.744" ry="16.606"> </ellipse> <circle class="iris transition-style" cx="42.504" cy="21.583" r="5.744"></circle> </svg> </div> </div> <div class="navi-text"> <div class="[[ { \'_hidden\': allowedRepetitions == 0 } ]]">[[ this.trans( \'flashreadtries\', { data: { count: remaining }, condition: remaining } ) ]]</div> <div class="[[ { \'_hidden\': allowedRepetitions != 0 } ]]">[[ this.trans( \'flashreadtriesonetry\', { data: { count: remaining }, condition: remaining } ) ]]</div> </div> </div> </div> '
            }, e))
        }
    }
    class Ce extends R {
        constructor() {
            super(...arguments),
            this.showHelp = !1
        }
    }
    class Se extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div class="-wide -no-break help-button content-spacer -pull-left -pull-right" style="margin-top:0"> <div view="Collapse" data-is-collapsed="[[ !showHelp ]]" class="collapse color-box -primary [[{ \'-open\':showHelp }]]"> <div class="text content-spacer -right -left"> <div view="Repeat" data-items="[[ content ]]" data-as="item"> <div view="[[ item.modelName ]]" data="[[ item ]]"></div> </div> </div> </div> <button js="toggle" class="toggle button-style -help -evaluate spacer-box -p-s color-box -primary [[{ \'-showing\':showHelp }]]" on-click="[[ showHelp = !showHelp ]]"> <span class="question-mark text-style -footer label -blue spacer-box -m-right-s">?</span> <span class="text text-style -footer -bold label spacer-box display-responsive -p-right-l -p-left">Hilfe</span> </button> </div> '
            }, e))
        }
    }
    function Me(e) {
        let t;
        e.content = e.content.filter((e => !(e instanceof Ce && (t = e,
        1)))),
        t && e.content.splice(1, 0, t)
    }
    class Te extends R {
        constructor(e) {
            super(e)
        }
        setQuestion(e) {
            this.question = e,
            e.propertyChange.filter((t => "correctlyAnswered" == t.name && e.evaluated)).subscribe(this.evaluate.bind(this))
        }
        evaluate() {
            this.question.feedback = this.question.correctlyAnswered ? this.question.posFeedback : this.question.negFeedback,
            this.question.evaluated = !0
        }
    }
    var Oe = s(753);
    class Ee extends R {
        constructor() {
            super(...arguments),
            this.on = !1
        }
    }
    class De extends Y {
        constructor(e) {
            super({
                template: e,
                data: new Ee
            })
        }
        shouldPlay() {
            return !!this.data.on || null != document.body.querySelector(".audio-glossar.-on")
        }
        play(e) {
            const t = this.node.querySelector("audio");
            this.shouldPlay() && (e.stopImmediatePropagation(),
            t.play())
        }
    }
    class Ne extends De {
        constructor() {
            super('<div on-click="[[ this.view.play( event ) ]]" class="-image glossar-element"> <div class="flex-layout -row"> <div class="abs-layout flex-layout"> <div view="Image" data-file="[[ file ]]" data-style="[[ style ]]"></div> <div class="item -top -right spacer-box -p-s glossar-icon"> <svg view="Icon" data-icon="audio-help"></svg> </div> </div> </div> <audio> <source src="[[ this.setup.route( \'audio\', { file:audio } ).url() ]]"> </audio> </div> ')
        }
    }
    class Ie extends De {
        constructor() {
            super('<div on-click="[[ this.view.play( event ) ]]" class="glossar-element -term text-style -para"> <div view="Html" data-html="[[ key ]]"></div> <svg class="icon svg-icon text-style -para [[ { \'_hidden\':this.setup.data(\'block\').grade == \'level1\' } ]]" view="Icon" data-icon="audio"></svg> <audio> <source src="[[ this.setup.route( \'audio\', { file:audio } ).url() ]]"> </audio> </div> ')
        }
    }
    class Pe extends De {
        constructor() {
            super('<div class="-wide -heading glossar-heading spacer-box -m-bottom-l" on-click="[[ this.view.play( event ) ]]"> <h1 class="text-style -heading -blue -max-read spacer-box -p-v-l"> <span view="AudioGlossarTerm" class="-title" data-key="[[ text ]]" data-audio="[[ audio ]]"></span> </h1> <div class="content-spacer -pull-right"> <div class="border-style -bottom-main"></div> </div> </div> ')
        }
        shouldPlay() {
            return document.body.classList.contains("-level1") || super.shouldPlay()
        }
    }
    class Le extends De {
        constructor() {
            super('<div class="drag-element -image -no-bg -max-width score-icon-layout -top [[ { \'-disabled\':placed.disabled, \'-selected\':placed.maintainer.selected == data  } ]]" on-click="[[ drop.selectDrag( data, event ) ]]"> <div on-click="[[ this.view.play( event ) ]]" class="glossar-element -image spacer-box -m-between-v-l"> <div class="abs-layout"> <div view="Image" data-file="[[ asset.file ]]"></div> <div class="item -top -right spacer-box -p-s glossar-icon"> <svg view="Icon" data-icon="audio-help"></svg> </div> </div> <audio> <source src="[[ this.setup.route( \'audio\', { file:asset.audio } ).url() ]]">  </audio> </div> <div class="[[ { \'-hide\':placed.maintainer.block.solutionMode, \'-ok\': placed.maintainer.evaluated && placed.isCorrect( data ), \'-ko\': placed.maintainer.evaluated && !placed.isCorrect( data ) } ]]" view="ScoreIcon"></div> </div> ')
        }
    }
    class He extends De {
        constructor() {
            super('<div style="max-width:200px"> <div on-click="[[ this.view.play( event ) ]]" class="glossar-element spacer-box -m-between-v-l"> <div class="abs-layout"> <div view="Image" data-file="[[ asset.file ]]"></div> <div class="item -top -right spacer-box -p-s glossar-icon"> <svg view="Icon" data-icon="audio-help"></svg> </div> </div> <audio> <source src="[[ this.setup.route( \'audio\', { file:asset.audio } ).url() ]]">  </audio> </div> </div> ')
        }
    }
    function je(e) {
        var t = e.content.find((e => "App\\AudioGlossar" == e.modelName));
        if (!t)
            return;
        function s(e) {
            const s = document.createElement("div");
            let i;
            s.innerHTML = e;
            const a = new Oe.MD(s,{
                tagName: "span",
                onHighlighting: e => {
                    e.setAttribute("view", "AudioGlossarTerm"),
                    e.setAttribute("data-audio", i.audio),
                    e.setAttribute("data-key", i.key)
                }
            });
            return t.items.forEach((e => {
                e.key && 0 != e.key.length && (i = e,
                a.highlightAllText(e.key))
            }
            )),
            s.innerHTML
        }
        e.content = e.content.filter((e => "App\\AudioGlossar" != e.modelName));
        const i = e.content.find((e => "App\\Heading" == e.modelName));
        let r = t.items.find((e => "$titel" == e.key));
        r && i && (i.modelName = "AudioGlossarHeading",
        i.audio = r.audio);
        const n = e.content.find((e => "App\\Image" == e.modelName));
        let o = t.items.find((e => "$bild" == e.key));
        o && n && (n.modelName = "AudioGlossarImage",
        n.audio = o.audio);
        let d = new a;
        d.add("App\\Text", (e => (e.text = s(e.text),
        e))),
        d.add("App\\Image", (e => {
            const s = t.items.find((t => t.key == e.file));
            return s && (e.modelName = "AudioGlossarImage",
            e.audio = s.audio),
            e
        }
        )),
        d.add("App\\ChoiceAnswer", (e => (e.text = s(e.text),
        e))),
        d.add("App\\Drop", (e => (e.text && (e.text = s(e.text)),
        e))),
        d.add("App\\Drag", (e => (e.text && (e.text = s(e.text)),
        e))),
        _e(e, d, (e => e.modelName), new Map)
    }
    function _e(e, t, s, i) {
        if (Array.isArray(e))
            return e.map((e => _e(e, t, s, i)));
        if ("object" == typeof e && null !== e && !i.get(e)) {
            i.set(e, !0);
            for (const a of Object.keys(e))
                e[a] = _e(e[a], t, s, i);
            const a = t.get(s(e));
            return a ? a(e) : e
        }
        return e
    }
    let ze;
    function Re(e, t, s, i) {
        try {
            s(e[t]) && i(e[t + 1]) && (ze.push(e[t + 1]),
            Re(e, t + 1, s, i))
        } catch (e) {}
    }
    function qe(e, t, s, i) {
        e.forEach(( (a, r) => {
            t(a) && (ze = [a],
            Re(e, r, t, s),
            ze.length > 1 && (e.splice(r, ze.length),
            e.splice(r, 0, i(ze))))
        }
        ))
    }
    function Fe(e) {
        !function(e) {
            e.evaluator || (e.evaluator = new Te),
            e.evaluator.setQuestion(e)
        }(e),
        je(e),
        Me(e),
        e.userInput = !0,
        function(e) {
            let t = e.content.find((e => "App\\FlashRead" == e.modelName));
            t && e.propertyChange.filter((e => "evaluated" == e.name)).subscribe(( () => {
                t.disabled = e.evaluated
            }
            ))
        }(e),
        qe(e.content, (e => "App\\Image" == e.modelName), (e => "App\\Image" == e.modelName), (e => ({
            modelName: "multipleImages",
            images: e
        }))),
        qe(e.content, (e => "App\\Audio" == e.modelName), (e => "App\\Audio" == e.modelName), (e => ({
            modelName: "multipleAudios",
            audios: e
        })))
    }
    function Be(e) {
        return Ve(e.posFeedback) && (e.posFeedback = We(Z("block").feedbackPos || [])),
        Ve(e.negFeedback) && (e.negFeedback = We(Z("block").feedbackNeg || [])),
        e
    }
    function Ve(e) {
        if (void 0 === e)
            return !0;
        const t = document.createElement("div");
        return t.innerHTML = e,
        "" == t.textContent
    }
    function We(e) {
        return e[Math.floor(e.length * Math.random())]
    }
    class Ze extends Te {
        constructor(e) {
            if (super(Object.assign({
                feedback: ""
            }, e)),
            this.currentAttempt = 1,
            0 == this.feedback.length) {
                let e = Be({});
                this.feedback = e.negFeedback
            }
        }
        evaluate() {
            const e = this.question;
            if (e.correctlyAnswered)
                return e.feedback = e.posFeedback,
                void (e.evaluated = !0);
            if (this.currentAttempt < this.attempts) {
                let t = this.attempts - this.currentAttempt
                  , s = _("remainingattempts", {
                    data: {
                        count: t
                    },
                    condition: t
                });
                e.feedback = `\n            <div class="attempt-feedback">\n                ${this.feedback}\n                <p class="remaining">\n                    ${s}\n                </p>\n            </div>`,
                this.currentAttempt++
            } else
                e.feedback = e.correctlyAnswered ? e.posFeedback : e.negFeedback,
                e.evaluated = !0
        }
    }
    function Ge(e, t) {
        let s = t.indexOf(e);
        s >= 0 && t.splice(s, 1)
    }
    function Ue(e) {
        for (let t = e.length - 1; t > 0; t--) {
            const s = Math.floor(Math.random() * (t + 1));
            [e[t],e[s]] = [e[s], e[t]]
        }
        return e
    }
    class $e extends R {
        constructor(e) {
            super(Object.assign({
                input: ""
            }, e))
        }
        get correctlyAnswered() {
            return !0
        }
    }
    class Xe extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div> <div view="ColumnContent" data="[[ data ]]"> <template name="App\\Freetext"> </template> </div> </div> '
            }, e))
        }
    }
    class Je extends $e {
        constructor(e) {
            super(Object.assign({
                evaluated: !0
            }, e)),
            je(this),
            Me(this),
            qe(this.content, (e => "App\\Image" == e.modelName), (e => "App\\Image" == e.modelName), (e => ({
                modelName: "multipleImages",
                images: e
            }))),
            qe(this.content, (e => "App\\Audio" == e.modelName), (e => "App\\Audio" == e.modelName), (e => ({
                modelName: "multipleAudios",
                audios: e
            })))
        }
        columnLayout() {
            return st(this, "-wide -no-break")
        }
    }
    class Ye extends R {
        constructor(e) {
            e.slides = e.questions,
            delete e.questions,
            super(Object.assign({
                authorMode: !1,
                slides: [],
                audioHelp: !0,
                grade: "level1",
                reviewPanel: !1,
                randomize: !1,
                solutionMode: !1
            }, e)),
            "level1" == this.grade && (this.audioHelp = !1),
            this.evalSufficient = it(e.evalSufficient, .5, this.questions.length),
            this.evalGood = it(e.evalGood, .8, this.questions.length),
            this.randomize && !this.authorMode && (this.slides = Ue(this.slides)),
            this.questions.forEach((e => {
                e.block = this
            }
            )),
            this.slides.push(new et({
                block: this
            })),
            this.show(this.slides[0]),
            "" != window.location.hash && this.slides.forEach(( (e, t) => {
                if (e.id == window.location.hash.substring(1))
                    return this.show(this.slides[t]),
                    !0
            }
            )),
            this.addListeners()
        }
        next() {
            this.currentSlide instanceof Je && (this.currentSlide.visited = !0),
            this.solutionMode = !1;
            let e = this.slides.indexOf(this.currentSlide);
            e < this.slides.length - 1 && this.show(this.slides[++e]),
            this.isFreetextOnly() && this.submit()
        }
        show(e) {
            this.currentSlide = e;
            let t = e.id;
            this.authorMode && t && (window.location.hash = t)
        }
        onPointNavi(e) {
            this.authorMode && this.show(e)
        }
        evaluate() {
            this.evalGood = 0;
            console.log('hacked');
            this.currentSlide instanceof et || (this.currentSlide.evaluator.evaluate(this.currentSlide),
            !this.authorMode && this.currentSlide.evaluated && (this.currentSlide.disabled = !0),
            this.submit())
        }
        resend() {
            this.sentryMessage("Resubmit score"),
            this.submit()
        }
        submit() {
            if (this.questions.length > 0 && !this.questions.every((e => e.evaluated)))
                return;
            if (this.isFreetextOnly() && !this.freetexts.every((e => e.visited)))
                return;
            let e = btoa(Z("submitToken") + "-" + this.blockScore);
            this.submitStatus = "",
            G("submit", {
                scoreEnc: e
            }).load().then(( () => {
                this.submitStatus = "success",
                Z("features").iframe_embedded && lmvz.postCrossWindowProgess(this.identifier)
            }
            )).catch((e => {
                this.sentryMessage(e),
                this.submitStatus = "error"
            }
            ))
        }
        onProceed() {
            this.currentSlide instanceof et || (this.currentSlide instanceof Je || this.currentSlide.evaluated ? this.next() : this.evaluate())
        }
        get correctQuestions() {
            return this.questions.filter((e => e.correctlyAnswered))
        }
        get questions() {
            return this.slides.filter((e => !(this.isSummary(e) || e instanceof Je)))
        }
        get questionsWithFreetext() {
            return this.slides.filter((e => !this.isSummary(e)))
        }
        get slidesWithoutSummary() {
            return this.slides.filter((e => !this.isSummary(e)))
        }
        get showPointNavi() {
            return this.questions.length <= 12 || this.authorMode
        }
        get blockScore() {
            if (this.isFreetextOnly())
                return 2;
            let e = this.correctQuestions.length / this.questions.length
              , t = 0;
            return e >= this.evalSufficient && (t = 1),
            e >= this.evalGood && (t = 2),
            t
        }
        get freetexts() {
            return this.slides.filter(this.isFreetext)
        }
        isFreetextOnly() {
            return this.freetexts.length == this.slidesWithoutSummary.length
        }
        isSummary(e) {
            return e instanceof et
        }
        isFreetext(e) {
            return e instanceof Je
        }
        get summaryTitle() {
            let e;
            switch (this.blockScore) {
            case 0:
                e = this.summary.Bad;
                break;
            case 1:
                e = this.summary.Sufficient;
                break;
            case 2:
                e = this.summary.Good
            }
            return e
        }
        get summaryAsset() {
            let e;
            switch (this.blockScore) {
            case 0:
                e = this.summary.AssetBad;
                break;
            case 1:
                e = this.summary.AssetSufficient;
                break;
            case 2:
                e = this.summary.AssetGood
            }
            return e
        }
        getDialogTitle(e) {
            const t = e.content.find((e => "App\\Heading" == e.modelName));
            return this.name + " - " + (t ? t.text : "")
        }
        getDialogSource(e) {
            return window.location.href
        }
        sentryMessage(e) {
            let t = window.Sentry;
            t && (e instanceof Error ? t.captureException(e, {
                tags: {
                    action: "submit"
                }
            }) : t.captureMessage(e, {
                tags: {
                    action: "submit"
                }
            }))
        }
        addListeners() {}
    }
    class Qe extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div class="block-layout max-width-layout -center audio-glossar [[ ( audioHelp ? \'-on\' : \'-off\' ) ]]"> <div class="content question-layout content-spacer -left -right" view="[[ currentSlide ]]" data="[[ currentSlide ]]"></div> <div view="Feedback" data="[[ data ]]"></div> <div class="footer [[ { \'_hidden\':isSummary( currentSlide ) } ]]" view="Footer" data="[[ data ]]"></div> </div> '
            }, e)),
            this.registry.add(et, ( () => new tt)),
            this.registry.add("SummaryVisuals", ( () => new Y({
                template: ""
            }))),
            this.registry.add("SummaryControlsIFrame", ( () => new Y({
                template: '<div class="flex-layout -row"> <button class="button-style color-box -primary spacer-box -p-v -p-h -m-right-xs" on-click="[[ window.lmvz.closeIFrame() ]]">[[ this.trans(\'closeexercise\' ) ]]</button> <button class="button-style color-box -primary spacer-box -p-v -p-h" on-click="[[ location.reload() ]]">[[ this.trans(\'repeatexercise\' ) ]]</button> </div> '
            }))),
            this.registry.add("SummaryControlsWindow", ( () => new Y({
                template: '<div class="flex-layout -row"> <button class="button-style color-box -primary spacer-box -p-v -p-h -m-right-xs" on-click="[[ window.close() ]]">[[ this.trans(\'closeexercise\' ) ]]</button> <button class="button-style color-box -primary spacer-box -p-v -p-h" on-click="[[ location.reload() ]]">[[ this.trans(\'repeatexercise\' ) ]]</button> </div> '
            }))),
            this.context.getCollapseHeight = this.getCollapseHeight.bind(this),
            this.context.features = Z("features")
        }
        init() {
            let e = this.data.grade.split(" ");
            e[0] = "-" + e[0],
            e.unshift("grade-layout"),
            e.forEach((e => {
                document.body.classList.add(e)
            }
            )),
            this.data.propertyChange.filter((e => "currentSlide" == e.name)).subscribe((e => {
                let t = this.data.currentSlide;
                t instanceof et || this.subscripeToQuestion(t),
                this.delayedUpdate()
            }
            )),
            this.data.propertyChange.filter((e => "solutionMode" == e.name)).subscribe((e => {
                this.delayedUpdate()
            }
            )),
            this.data.propertyChange.dispatch({
                name: "currentSlide"
            }),
            window.addEventListener("keydown", (e => {
                let t = this.node.querySelector(".review")
                  , s = this.node.querySelector("footer");
                const i = e.target;
                "Enter" != e.key || (null == t ? void 0 : t.contains(i)) || (null == s ? void 0 : s.contains(i)) || (this.data.onProceed(),
                e.target.classList.contains("-evaluate") && e.preventDefault())
            }
            ))
        }
        subscripeToQuestion(e) {
            this.subscription && this.subscription.unsubscribe(),
            this.subscription = e.propertyChange.subscribe(this.delayedUpdate.bind(this))
        }
        delayedUpdate() {
            !function(e, t, s=!1) {
                let i;
                return function() {
                    const a = this
                      , r = arguments
                      , n = s && !i;
                    clearTimeout(i),
                    i = setTimeout(( () => {
                        i = null,
                        s || e.apply(a, r)
                    }
                    ), t),
                    n && e.apply(a, r)
                }
            }(( () => {
                this.hideContext(),
                this.checkPanels(),
                this.showContext()
            }
            ), 10)()
        }
        checkPanels() {
            let e = this.node.querySelector(".feedback-panel")
              , t = this.node.querySelectorAll(".context-panel")
              , s = this.node.querySelector(".footer").getBoundingClientRect().height;
            t.forEach((e => {
                e.style.bottom = s + "px",
                s += e.getBoundingClientRect().height
            }
            )),
            e && (e.style.bottom = s + "px",
            s += e.getBoundingClientRect().height),
            this.node.querySelector(".content").style.paddingBottom = s + "px"
        }
        checkRepositoryHeight() {
            let e = this.node.querySelector(".context-panel .repository-clamp");
            if (e) {
                e.classList.remove("flex-layout", "-center"),
                e.style.width = "";
                let t = e.getBoundingClientRect().height;
                if (t > 150)
                    for (; t > 150; )
                        e.style.width = e.getBoundingClientRect().width + 200 + "px",
                        t = e.getBoundingClientRect().height;
                else
                    e.classList.add("flex-layout", "-center")
            }
        }
        hideContext() {
            this.node.querySelectorAll(".context-panel > :first-child").forEach((e => {
                e.style.visibility = "hidden"
            }
            ))
        }
        showContext() {
            this.node.querySelectorAll(".context-panel > :first-child").forEach((e => {
                e.style.visibility = ""
            }
            ))
        }
        getCollapseHeight() {
            return {
                level1: 80,
                level23: 80,
                level46: 80,
                level79: 80
            }[this.data.grade]
        }
    }
    class Ke extends Qe {
        constructor(e) {
            super(Object.assign({
                template: '<div class="block-layout [[ reviewPanel ? \'-review\' : \'\' ]] max-width-layout -center audio-glossar [[ ( audioHelp ? \'-on\' : \'-off\' ) ]]"> <div class="content question-layout content-spacer -left -right" view="[[ currentSlide ]]" data="[[ currentSlide ]]"></div> <div class="review transition-style -slow"> <div class="button-style toggle" on-click="[[ reviewPanel = !reviewPanel ]]"> <svg class="icon" view="Icon" data-icon="comment"></svg> </div> <div class="content"> <lfw-dialog key="[[ currentSlide.id ]]" source="[[ getDialogSource( currentSlide ) ]]" name="[[ getDialogTitle( currentSlide ) ]]" routes="[[ JSON.stringify( { \'model\': this.setup.lookup( \'routes.dialog\' ) } ) ]]" metadata="[[ JSON.stringify( { \'lehrmittel\':this.setup.data( \'resource\' ), \'unit\':this.setup.data( \'unit\' ), \'block\': { \'name\':name, \'uid\':id } } ) ]]"></lfw-dialog> </div> </div> <div view="Feedback" data="[[ data ]]"></div> <div class="footer [[ { \'_hidden\':isSummary( currentSlide ) } ]]" view="Footer" data="[[ data ]]"></div> </div> '
            }, e)),
            Z("block").authorMode = !0
        }
    }
    class et extends R {
    }
    class tt extends Y {
        constructor() {
            super({
                template: '<div class="summary-layout"> <h1 class="title spacer-box -p-top-xl -p-bottom-l" view="Html" data-html="[[  block.summaryTitle  ]]"></h1> <div view="Image" data-file="[[ block.summaryAsset.file ]]" data-alt="[[ block.summaryAsset.altText || \' \' ]]" data-style="[[ style ]]" data-caption="[[ block.summaryAsset.caption ]]" class="[[ { \'_hidden\':block.summaryAsset.modelName != \'App\\\\Image\' } ]] [[ { \'_hidden\':!block.summaryAsset } ]] spacer-box -m-bottom-l"></div> <div view="Video" data-file="[[ block.summaryAsset.file ]]" data-summary="[[true]]" class="[[ { \'_hidden\':block.summaryAsset.modelName != \'App\\\\Video\' } ]] [[ { \'_hidden\':!block.summaryAsset } ]] spacer-box -m-bottom-l" style="width:500px"></div> <div view="SummaryVisuals" data="[[ data ]]"></div> <p class="text">[[ this.trans( \'summary.details\', { data: { current: block.correctQuestions.length, total: block.questions.length }, condition: block.questions.length } ) ]]</p> <div class="navi -status" view="PointNavi" data-points="[[ block.questionsWithFreetext ]]"></div> <div class="error text-style -p -white spacer-box -p color-box -error [[ { \'_hidden\': block.submitStatus != \'error\' } ]]"> <div class="flex-layout -row -items-center"> <div class="item"> Fehler: Das Resultat konnte nicht gespeichert werden.</div> <button class="item -content button-style color-box -primary spacer-box -p" on-click="[[ block.resend() ]]">Nochmals senden</button> </div> </div> <p class="[[ { \'_hidden\': block.submitStatus != \'success\' } ]]">Das Resultat wurde gespeichert.</p> <div class="spacer-box -p-bottom-xl"></div> <div class="controls text-style -footer"> <div view="[[ this.features.iframe_embedded ? \'SummaryControlsIFrame\' : \'SummaryControlsWindow\' ]]"></div> </div> </div> '
            })
        }
    }
    function st(e, t="") {
        let s = e.content.map((e => ({
            content: e,
            style: ""
        })));
        return s.push({
            content: e,
            style: t
        }),
        s
    }
    function it(e, t, s) {
        if (!e)
            return t;
        if ("number" == typeof e)
            return e / s;
        if (e.indexOf("%") >= 0) {
            let t = parseInt(e.replace("%", "")) / 100;
            if (!isNaN(t))
                return t
        }
        let i = parseInt(e);
        return isNaN(i) ? t : i / s
    }
    class at extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div class="points-navigation"> <div class="flex-layout -items-center spacer-box -m-h" view="Repeat" data-items="[[ points ]]" data-as="q"> <div class="item point-item [[ { \'-here\': parent.active == q, \'-evaluated\': q.evaluated, \'-success\':q.correctlyAnswered, \'-error\':!q.correctlyAnswered, \'button-style\':parent.authorMode, \'-freetext\':  q.modelName == \'App\\\\Freetext\', \'-visitedFreetext\': q.visited == true} ]]" on-click="[[ parent.selectQuestion( q ) ]]"> <div class="inner"></div> <div class="outer"></div> </div> </div> </div> ',
                data: new rt
            }, e))
        }
    }
    class rt extends R {
        constructor() {
            super({
                points: []
            })
        }
    }
    class nt extends Y {
        click(e) {
            let t = document.activeElement.offsetLeft
              , s = document.activeElement.offsetTop
              , i = document.activeElement.offsetWidth
              , a = e.clientX
              , r = e.clientY;
            0 == e.clientX && (a = t + i / 2 + 1),
            0 == e.clientY && (r = s);
            let n = Array.from(e.currentTarget.children);
            for (let e = 0; e < n.length; e++) {
                let t = n[e].getBoundingClientRect();
                if (a >= t.left && a < t.right && r >= t.top && r < t.bottom) {
                    let s = t.left + t.width / 2;
                    this.data.toggleSplitAt(a > s ? e + 1 : e);
                    break
                }
            }
        }
    }
    class ot extends R {
        constructor(e) {
            super(Object.assign({
                disabled: !1,
                evaluated: !1,
                insertCharacter: "|",
                input: [],
                correct: []
            }, e)),
            this.input = this.correct.filter((e => e instanceof dt)),
            f(this.input).arrayChange.subscribe(( () => {
                this.propertyChange.dispatch({
                    name: "correctlyAnswered"
                })
            }
            ))
        }
        init() {
            Z("block").authorMode && (this.userInput = !0)
        }
        get correctlyAnswered() {
            let e = this.input.filter((e => e instanceof lt))
              , t = this.correct.filter((e => e instanceof lt));
            return e.length == t.length && e.every((e => this.isCorrect(e)))
        }
        isCorrect(e) {
            let t = this.uniqueIndex(e, this.input);
            return this.correct.filter((e => e instanceof lt)).some((e => t == this.uniqueIndex(e, this.correct)))
        }
        uniqueIndex(e, t) {
            return t.filter((t => t instanceof dt || t == e)).indexOf(e)
        }
        toggleSplitAt(e) {
            this.userInput = !0,
            this.disabled || 0 != e && e != this.input.length && (this.input[e - 1]instanceof lt ? this.input.splice(e - 1, 1) : this.input[e]instanceof lt ? this.input.splice(e, 1) : this.input.splice(e, 0, new lt({
                symbol: this.insertCharacter
            })))
        }
        renderParts(e, t, s) {
            return e ? s : t
        }
    }
    class dt extends R {
    }
    class lt extends R {
    }
    function ct(e, t="", s="|") {
        let i = e.split(t)
          , a = [];
        for (let e = 0; e < i.length; e++) {
            const r = i[e];
            let n = e < i.length ? t : "";
            if (r == s)
                a.push(new lt({
                    symbol: s
                }));
            else if (r.indexOf(s) >= 0) {
                let e = r.indexOf(s)
                  , t = r.slice(0, e)
                  , i = r.slice(e + 1);
                t.length > 0 && a.push(new dt({
                    text: t
                })),
                a.push(new lt({
                    symbol: s
                })),
                i.length > 0 && a.push(new dt({
                    text: i + n
                }))
            } else
                a.push(new dt({
                    text: r + n
                }))
        }
        return a
    }
    class ht extends nt {
        constructor(e) {
            super(Object.assign({
                template: '<div class="breakup"> <div view="ColumnContent" data="[[ data ]]"> <template name="App\\WordHyphen"> <div> <div style="max-width:1280px;white-space:break-spaces;outline:0" class="text-style -p breakup-parts -[[ mode ]] [[ { \'_pointer\':!disabled } ]]" view="Repeat" data-items="[[ renderParts( block.solutionMode, input, correct ) ]]" data-as="part" on-click="[[ this.handleClick( event ) ]]"> <span class="part" tabindex="0" view="[[ part ]]" data="[[ part ]]" data-evaluated="[[ parent.evaluated ]]" data-solution-mode="[[ parent.block.solutionMode ]]" data-correctly-answered="[[ parent.isCorrect( part ) ]]"></span> </div> <span class="result"> <div view="Show" data-if="[[ evaluated & block.currentSlide.correctlyAnswered & !block.solutionMode ]]"> <span view="ScoreIcon" class="-ok"></span> </div> <div view="Show" data-if="[[ evaluated & !block.currentSlide.correctlyAnswered & !block.solutionMode ]]"> <div view="ScoreIcon" class="-ko"></div> </div> </span> </div> </template> </div> </div> '
            }, e)),
            this.registry.add(dt, ( () => new Y({
                template: '<span class="-text">[[ text ]]</span> '
            }))),
            this.registry.add(lt, ( () => new Y({
                template: "<span class=\"-split score-icon-layout -top\"> [[ symbol ]] <div class=\"[[ { '-hide':solutionMode , '-ok': correctlyAnswered && evaluated, '-ko': !correctlyAnswered && evaluated} ]]\" view=\"ScoreIcon\"></div> </span> "
            }))),
            this.context.handleClick = this.click.bind(this)
        }
    }
    class pt extends ot {
        constructor(e) {
            super(Object.assign({
                layout: "one-column",
                correct: ct(e.text, "word" == e.mode ? " " : "", e.insertCharacter)
            }, Be(e))),
            Fe(this)
        }
        columnLayout() {
            return st(this, "-wide")
        }
    }
    function ut(e) {
        return void 0 !== e.correctlyAnswered
    }
    class vt extends R {
        constructor(e) {
            super(Object.assign({
                disabled: !1,
                evaluated: !1
            }, e)),
            this.registerParts()
        }
        get correctlyAnswered() {
            return this.questionParts.every((e => e.correctlyAnswered))
        }
        get questionParts() {
            return this.parts.filter((e => ut(e)))
        }
        registerParts() {
            for (const e of this.parts)
                g(this, "correctlyAnswered", e, "correctlyAnswered")
        }
    }
    function mt(e, t, s) {
        let i = [];
        return {
            text: e.replace(/{(.*?)}/g, ( (e, t) => {
                let a = s(t);
                return a.attributes.data = "[[ parts[ " + i.length + " ] ]]",
                i.push(a.part),
                "<span " + Object.keys(a.attributes).map((e => e + '="' + a.attributes[e] + '"')).join(" ") + "></span>"
            }
            )),
            parts: i
        }
    }
    class gt {
        constructor(e) {
            this.input = "",
            this.ignoreCase = e.ignoreCase,
            this.allowed = e.allowed || [],
            b(this, "disabled", "evaluated", "input"),
            g(this, "correctlyAnswered", this, "input")
        }
        get correctlyAnswered() {
            return this.allowed.some((e => this.ignoreCase ? e.toLowerCase() == this.input.toLowerCase().trim() : e.trim() == this.input.trim()))
        }
    }
    class bt extends vt {
    }
    class ft extends gt {
        get correctlyAnswered() {
            const e = new RegExp("'|`|‘|’|′|ʼ","g")
              , t = t => {
                const s = t.trim().replace(e, "'");
                return this.ignoreCase ? s.toLowerCase() : s
            }
            ;
            return this.allowed.some((e => t(e) == t(this.input)))
        }
        onInput() {
            this.block.currentSlide.userInput = !0
        }
        getInput(e, t) {
            return this.block.solutionMode ? this.allowed[0] : this.input
        }
    }
    class wt extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div class="input-grow"> <input view="Content" disabled="[[ disabled ]]"> <div class="shadow"></div> <div view="SpecialSigns" data-show="[[showSpecialSigns]]" data-signs="[[this.setup.data(\'specialSigns\')]]"></div> </div> ',
                data: new xt
            }, e)),
            this.handler = this.onInput.bind(this),
            this.handler2 = this.onFocus.bind(this),
            this.handler3 = this.onFocusOut.bind(this)
        }
        init() {
            this.data.view = this,
            this.input.addEventListener("input", this.handler),
            this.input.addEventListener("focus", this.handler2),
            this.input.addEventListener("focusout", this.handler3),
            this.updateWidth(this.input.value)
        }
        onFocus(e) {
            this.data.showSpecialSigns = !0
        }
        onFocusOut(e) {
            this.node.contains(e.relatedTarget) ? this.data.showSpecialSigns = !0 : this.data.showSpecialSigns = !1
        }
        onInput(e) {
            this.updateWidth(e.currentTarget.value)
        }
        updateWidth(e) {
            this.shadow.innerHTML = e.replace(/\s/g, "&nbsp;"),
            this.input.style.width = this.shadow.offsetWidth + "px"
        }
        setValue(e) {
            this.input.value = e,
            this.updateWidth(e)
        }
        get input() {
            return this.node.querySelector("input")
        }
        get shadow() {
            return this.node.querySelector(".shadow")
        }
        deinit() {
            this.input.removeEventListener("input", this.handler),
            this.input.removeEventListener("focus", this.handler2),
            this.input.removeEventListener("focusout", this.handler3)
        }
    }
    class xt extends R {
        constructor() {
            super(...arguments),
            this.showSpecialSigns = !1
        }
        set input(e) {
            var t;
            null === (t = this.view) || void 0 === t || t.setValue(e)
        }
    }
    class yt extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div> <div class="[[ { \'_hidden\':!isVisible( show, signs ) } ]]"> <div class="specialSign _absolute _z-6 color-box -grey border-style spacer-box -m-top-xxs"> <div class="_flex"> <div view="Repeat" data-items="[[ signs ]]" data-as="signs" class="_flex"> <input type="button" on-focus="[[ parent.addSpecialSign(event) ]]" value="[[signs]]" class="specialSignButton border-style -none spacer-box -p-h-s"> </div> <button type="button" on-focus="[[ shift(event) ]]" class="specialSignButton border-style -none spacer-box -p-h-s"> <svg class="svg-icon -small -black transform-style [[ { \'-rot270\':!shiftBool } ]] [[ { \'-rot90\':shiftBool } ]]"> <use xlink:href="#arrowBlack"/> </svg> </button> </div> </div> </div> </div> ',
                data: new kt
            }, e))
        }
    }
    class kt extends R {
        constructor() {
            super(...arguments),
            this.shiftBool = !1,
            this.signs = [],
            this.show = !1
        }
        addSpecialSign(e) {
            let t = e.target.value
              , s = e.relatedTarget;
            s.focus();
            let i = s.selectionStart
              , a = s.value
              , r = a.slice(0, i) + t + a.slice(i);
            s.value = r,
            s.setSelectionRange(i + t.length, i + t.length),
            s.dispatchEvent(new Event("input"))
        }
        shift(e) {
            e.relatedTarget.focus(),
            this.shiftBool ? (this.signs = this.signs.map((e => e.toLowerCase())),
            this.shiftBool = !1) : (this.signs = this.signs.map((e => e.toUpperCase())),
            this.shiftBool = !0)
        }
        isVisible(e, t) {
            return !!t && e && t.length > 0
        }
    }
    class At extends bt {
        constructor(e) {
            super(Object.assign(Object.assign({
                content: [],
                parts: []
            }, Be(e)), function(e, t=!0) {
                return mt(e, 0, (function(e) {
                    let s = "&lt;"
                      , i = "&gt;"
                      , a = "spacing";
                    e = e.trim(),
                    new RegExp("^&lt;.*&gt;$").test(e) ? (e = e.slice(4, -4),
                    a = "center") : new RegExp("^" + s).test(e) ? (e = e.slice(4),
                    a = "left") : new RegExp(i + "$").test(e) && (e = e.slice(0, -4),
                    a = "right");
                    let r = [];
                    for (const t of e.split(";"))
                        r.push(t.trim());
                    return {
                        part: new ft({
                            allowed: r,
                            ignoreCase: t
                        }),
                        attributes: {
                            view: "ClozePart",
                            "data-block": "[[ block ]]",
                            "data-align-class": a,
                            "data-disabled": "[[ disabled ]]",
                            "data-evaluated": "[[ evaluated ]]",
                            "data-visible-length": "[[ visibleLength ]]"
                        }
                    }
                }
                ))
            }(e.text, !e.caseSensitive))),
            this.visibleLength = this.calcMaxInputLength(e.gapLength),
            Fe(this)
        }
        init() {
            Z("block").authorMode && (this.userInput = !0)
        }
        calcMaxInputLength(e) {
            if (e > 0)
                return e;
            let t = [];
            return this.parts.forEach((e => {
                e.allowed.forEach((e => {
                    t.push(e)
                }
                ))
            }
            )),
            0 == t.length ? 2 : Math.round(t.reduce(( (e, t) => e + t.length), 0) / t.length)
        }
        columnLayout() {
            return st(this, "-wide -no-break")
        }
    }
    class Ct extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div> <div view="ColumnContent" data="[[ data ]]"> <template name="App\\Cloze"> <div view="Html" class="text-style -p -max-read" data-html="[[ text ]]"></div> </template> </div> </div> '
            }, e)),
            this.registry.add("ClozePart", ( () => new Y({
                template: '<span class="_inline-block score-icon-layout -top"> <div class="[[ { \'-ok\': correctlyAnswered && evaluated, \'-ko\': !correctlyAnswered && evaluated, \'-hide\':block.solutionMode } ]]" view="ScoreIcon"></div> <div view="InputGrow" data-input="[[ getInput( block.solutionMode ) ]]" data-disabled="[[ disabled ]]"> <input type="text" spellcheck="false" autocorrect="off" autocapitalize="off" style="min-width: [[ visibleLength ]]ch" class="cloze-input -[[ alignClass ]]" on-focus="[[onFocus = event.currentTarget.value]]" on-input="[[ input = event.currentTarget.value, onInput() ]]"> </div> </span> '
            }))),
            this.registry.add("InputGrow", ( () => new wt)),
            this.registry.add("SpecialSigns", ( () => new yt))
        }
        init() {
            setTimeout(( () => {
                this.node.querySelector("input").focus()
            }
            ), 10)
        }
    }
    function St(e, t="b|i|u|span.*?|s|br|p") {
        return e.replace(new RegExp("</?(" + t + ")>","gm"), "").trim()
    }
    class Mt extends R {
        constructor(e) {
            super(Object.assign({
                shuffle: !0,
                disabled: !1,
                evaluated: !1
            }, e)),
            this.setupBaseDrop(e.drags)
        }
        setupBaseDrop(e) {
            let t = this.drops.reduce(( (e, t) => e.concat(t.correct)), []);
            e || (e = t);
            let s = this.placedDrags
              , i = e.filter((e => -1 == s.indexOf(e)))
              , a = e.filter((e => -1 == t.indexOf(e)));
            this.base = new Ot({
                correct: a,
                placed: this.shuffle ? this.shuffleDrags(i) : i
            })
        }
        get correctlyAnswered() {
            return this.drops.every((e => e.correctlyAnswered))
        }
        get placedDrags() {
            return this.drops.reduce(( (e, t) => e.concat(t.placed)), [])
        }
        shuffleDrags(e) {
            for (let t = e.length - 1; t > 0; t--) {
                const s = Math.floor(Math.random() * (t + 1));
                [e[t],e[s]] = [e[s], e[t]]
            }
            return e
        }
    }
    class Tt extends R {
    }
    class Ot extends R {
        constructor(e) {
            super(Object.assign({
                correct: [],
                placed: [],
                disabled: !1,
                strictOrder: !1
            }, e));
            for (const e of this.placed)
                e.placed = this
        }
        selectDrop() {
            this.maintainer.state.onDrop(this)
        }
        selectDrag(e, t) {
            t.stopImmediatePropagation(),
            this.maintainer.state.onDrag(e)
        }
        place(e) {
            this.maintainer.userInput = !0,
            e.placed && e.placed.remove(e),
            e.placed = this,
            this.placed.push(e),
            this.dispatchUpdate()
        }
        testPlace(e) {
            if (!(this.placed.length > e.length))
                if (this.placed.length < e.length) {
                    let t = e.find((e => !this.has(e)));
                    t && this.maintainer.state.onDrag(t, this)
                } else
                    this.placed.length == e.length && (this.placed = e.slice(),
                    this.dispatchUpdate())
        }
        remove(e) {
            Ge(e, this.placed),
            this.dispatchUpdate()
        }
        has(e) {
            return this.placed.indexOf(e) >= 0
        }
        isCorrect(e) {
            return this.correct.indexOf(e) >= 0
        }
        get correctlyAnswered() {
            return this.correct.length == this.placed.length && this.correct.every(( (e, t) => this.strictOrder ? this.placed.indexOf(e) == t : this.placed.indexOf(e) >= 0))
        }
        dispatchUpdate() {
            this.propertyChange.dispatch({
                name: "placed"
            }),
            this.propertyChange.dispatch({
                name: "correctlyAnswered"
            })
        }
    }
    class Et {
        constructor(e) {
            this.maintainer = e
        }
        updateCorrectlyAnswered() {
            var e;
            ut(this.maintainer) && (e = this.maintainer) && e.propertyChange instanceof v && this.maintainer.propertyChange.dispatch({
                name: "correctlyAnswered"
            })
        }
    }
    const Dt = '<div on-click="[[ selectDrop( event ) ]]"> <div class="base-drop-zone spacer-box -p overflow-box -no-scrollbars"> <div class="repository-clamp grid-layout -gutter drop-zone-fix" view="DropZone" data-items="[[ this.ter( maintainer.block.solutionMode, correct, placed ) ]]" data-as="drag" data-disabled="[[ maintainer.disabled ]]" on-changed="[[ testPlace( event.items ) ]]"> <div class="item"> <div view="[[ drag.viewName ]]" data="[[ drag ]]" data-drop="[[ parent ]]"></div> </div> </div> </div> </div> '
      , Nt = '<div class="spacer-box -m-between-v OrderverticalDrop" on-click="[[ selectDrop( event ) ]]" tabindex="0"> <div view="[[ contentView ]]" data="[[ data ]]"></div> <div class="drop-zone -min-height -mode-[[ maintainer.mode ? maintainer.mode : \'\' ]] -selectable [[ { \'-selected\':maintainer.selected == data, \'-disabled\':maintainer.disabled } ]] spacer-box -p"> <div class="content repository-clamp grid-layout -gutter drop-zone-fix" view="DropZone" data-items="[[ this.ter( maintainer.block.solutionMode, correct, placed ) ]]" data-as="drag" data-disabled="[[ maintainer.disabled ]]" on-changed="[[ testPlace( event.items ) ]]"> <div class="item"> <div view="[[ drag.viewName ]]" data="[[ drag ]]"></div> </div> </div> </div> </div> ';
    class It extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div> <div view="ColumnContent" data="[[ data ]]"> <template name="App\\DragDrop"> <div view="Repeat" style="max-width:1280px" data-items="[[ drops ]]" data-as="drop" class="[[vertical ? \'drag-drop-vertical\' : \'\']]"> <div view="[[ parent.viewOf( drop ) ]]" data="[[ drop ]]" data-maintainer="[[ parent ]]" data-selected="[[ parent.selected == drop ]]"></div> </div> </template> </div> <div class="fixed-panel context-panel [[ base.placed.length == 0 && !block.solutionMode ? \'_hidden\' : \'\' ]] [[ base.correct.length == 0 && block.solutionMode ? \'_hidden\' : \'\' ]]"> <div class="max-width-layout -center"> <div view="BaseDrop" data="[[ base ]]" data-maintainer="[[ data ]]"></div> </div> </div> </div> '
            }, e)),
            this.registry.add("VerticalDrop", ( () => new Y({
                template: Nt
            }))),
            this.registry.add("HorizontalDrop", ( () => new Y({
                template: '<div class="spacer-box -m-between-v" on-click="[[ selectDrop( event ) ]]"> <div class="flex-layout -row grid-layout -gutter"> <div class="item -content"> <div view="[[ contentView ]]" data="[[ data ]]"></div> </div> <div class="item -stretch"> <div class="drop-zone -stretch -stretch-height [[ { \'-selected\':maintainer.selected == data, \'-disabled\':maintainer.disabled } ]] spacer-box -p"> <div class="content repository-clamp grid-layout -gutter drop-zone-fix" view="DropZone" data-items="[[ this.ter( maintainer.block.solutionMode, correct, placed ) ]]" data-disabled="[[ maintainer.disabled ]]" on-changed="[[ testPlace( event.items ) ]]" data-as="drag"> <div class="item"> <div view="[[ drag.viewName ]]" data="[[ drag ]]"></div> </div> </div> </div> </div> </div> </div> '
            }))),
            this.registry.add("Vertical2Drop", ( () => new Y({
                template: '<div class="" style="width:200px" on-click="[[ selectDrop( event ) ]]" tabindex="0"> <div view="[[ contentView ]]" data="[[ data ]]"></div> <div class="drop-zone -min-height -mode-[[ maintainer.mode ? maintainer.mode : \'\' ]] -selectable [[ { \'-selected\':maintainer.selected == data, \'-disabled\':maintainer.disabled } ]] spacer-box -p"> <div class="content repository-clamp grid-layout -gutter drop-zone-fix" view="DropZone" data-items="[[ this.ter( maintainer.block.solutionMode, correct, placed ) ]]" data-as="drag" data-disabled="[[ maintainer.disabled ]]" on-changed="[[ testPlace( event.items ) ]]"> <div class="item"> <div view="[[ drag.viewName ]]" data="[[ drag ]]"></div> </div> </div> </div> </div> '
            }))),
            this.registry.add("BaseDrop", ( () => new Y({
                template: Dt
            }))),
            this.registry.add("TextDrag", ( () => new Y({
                template: '<div class="drag-element drag-element-dragdrop [[ { \'-disabled\':placed.disabled, \'-selected\':this.and( placed.maintainer.selected == data, !placed.maintainer.block.solutionMode ) } ]] border-style -radius" on-click="[[ drop.selectDrag( data, event ) ]]" tabindex="0" autofocus> <div class="spacer-box -p-h -p-v-s score-icon-layout -top"> <div view="Html" data-html="[[ text ]]" class="text-style -drag"></div> <div class="[[ { \'-hide\':placed.maintainer.block.solutionMode , \'-ok\': placed.maintainer.evaluated && placed.isCorrect( data ), \'-ko\': placed.maintainer.evaluated && !placed.isCorrect( data )} ]]" view="ScoreIcon"></div> </div> </div> '
            }))),
            this.registry.add("ImageDrag", ( () => new Y({
                template: '<div class="drag-element -image -no-bg -max-width score-icon-layout -top [[ { \'-disabled\':placed.disabled, \'-selected\':this.and( placed.maintainer.selected == data, !placed.maintainer.block.solutionMode ) } ]] drag-element-dragdrop" tabindex="0" on-click="[[ drop.selectDrag( data, event ) ]]"> <div view="Image" data-file="[[ asset.file ]]" data-alt="[[ asset.altText || \' \' ]]" data-zoom="[[asset.zoom]]"></div> <div class="[[ { \'-hide\':placed.maintainer.block.solutionMode, \'-ok\': placed.maintainer.evaluated && placed.isCorrect( data ), \'-ko\': placed.maintainer.evaluated && !placed.isCorrect( data ) } ]]" view="ScoreIcon"></div> </div> '
            }))),
            this.registry.add("AudioDrag", ( () => new Y({
                template: '<div class="drag-element -audio [[ { \'-disabled\':placed.disabled, \'-selected\':this.and( placed.maintainer.selected == data, !placed.maintainer.block.solutionMode ) } ]] score-icon-layout -top"> <div class="flex-layout -items-center drag-element-dragdrop" on-click="[[ drop.selectDrag( data, event ) ]]" tabindex="0"> <div class="item spacer-box -p-left -p-right-s text-style -drag -white -infra" view="Html" data-html="[[ text ? text : \'&nbsp;&nbsp;&nbsp;&nbsp;\' ]]"> </div> <div class="item"> <div view="AudioPlayerMini" data-source="[[ this.setup.route( \'audio\', { file:asset.file, preset:\'original\' } ).url() ]]"></div> </div> </div> <div class="[[ { \'-hide\':placed.maintainer.block.solutionMode, \'-ok\': placed.maintainer.evaluated && placed.isCorrect( data ), \'-ko\': placed.maintainer.evaluated && !placed.isCorrect( data ) } ]]" view="ScoreIcon"></div> </div> '
            }))),
            this.registry.add("TextDrop", ( () => new Y({
                template: '<div view="Html" data-html="[[ text ]]" class="text-style -p"></div> '
            }))),
            this.registry.add("ImageDrop", ( () => new Y({
                template: '<div style="max-width:200px"> <div view="Image" data-file="[[ asset.file ]]" data-alt="[[ asset.altText || \' \' ]]" class="[[ { \'_hidden\':asset.zoom } ]]"></div> <div view="ImageZoom" data-file="[[ asset.file ]]" data-alt="[[ asset.altText || \' \' ]]" data-style="[[ style ]]" class="[[ { \'_hidden\':!asset.zoom } ]]"></div> </div> '
            }))),
            this.registry.add("AudioDrop", ( () => new Y({
                template: '<div class=""> <div view="Audio" data-file="[[ asset.file ]]"></div> </div> '
            }))),
            this.registry.add("VideoDrop", ( () => new Y({
                template: '<div style="max-width:300px"> <div view="Video" data-file="[[ asset.file ]]"></div> </div> '
            })))
        }
    }
    class Pt extends Mt {
        constructor(e) {
            super(Object.assign(Object.assign({
                content: [],
                selected: null
            }, function(e) {
                let t = e.drops
                  , s = e.drags;
                return s.forEach((e => {
                    let s = parseInt(e.target) - 1;
                    s < t.length && s >= 0 && t[s].correct.push(e)
                }
                )),
                {
                    drags: s,
                    drops: t
                }
            }(e)), Be(e))),
            Fe(this),
            this.state = new zt(this)
        }
        init() {
            Z("block").authorMode && (this.userInput = !0)
        }
        putCorrectDrags(e, t="target") {
            e.forEach((e => {
                let s = parseInt(e[t]) - 1;
                s < this.drops.length && s >= 0 && this.drops[s].correct.push(e),
                -1 == s && this.base.correct.push(e)
            }
            ))
        }
        viewOf(e) {
            return this.vertical ? "Vertical2Drop" : e.asset ? "HorizontalDrop" : "VerticalDrop"
        }
        isDistractor(e) {
            return this.base.correct.indexOf(e) >= 0
        }
        columnLayout() {
            return st(this, "-wide -no-break")
        }
        hidePanel(e, t) {
            return e && 0 == this.base.correct.length || !e && 0 == this.base.placed.length ? "_hidden" : ""
        }
    }
    class Lt extends Tt {
        get viewName() {
            return this.asset ? this.asset.modelName.replace("App\\", "") + "Drag" : "TextDrag"
        }
    }
    class Ht extends Ot {
        get contentView() {
            return this.asset ? this.asset.modelName.replace("App\\", "") + "Drop" : "TextDrop"
        }
    }
    class jt extends Et {
        constructor(e, t, s=!1) {
            super(e),
            e.selected = t,
            this.onlyOneDrag = s
        }
        init() {
            Z("block").authorMode && (this.maintainer.userInput = !0)
        }
        onDrag(e, t) {
            if (this.maintainer.userInput = !0,
            this.maintainer.disabled)
                return;
            let s = t || this.maintainer.selected;
            if (this.maintainer.base.has(e) || t) {
                if (this.onlyOneDrag)
                    for (const e of s.placed)
                        this.maintainer.base.place(e);
                if (s.place(e),
                this.onlyOneDrag) {
                    let e = this.maintainer.drops.indexOf(s);
                    e < this.maintainer.drops.length - 1 && this.onDrop(this.maintainer.drops[e + 1])
                }
            } else
                this.maintainer.base.place(e);
            this.updateCorrectlyAnswered()
        }
        onDrop(e) {
            this.maintainer.disabled || e != this.maintainer.base && (this.maintainer.state = new jt(this.maintainer,e,this.onlyOneDrag))
        }
    }
    class _t extends Et {
        constructor(e, t) {
            super(e),
            e.selected = t
        }
        onDrag(e, t) {
            this.maintainer.disabled || (t ? t.place(e) : e.placed == this.maintainer.base ? this.maintainer.selected = e : (this.maintainer.base.place(e),
            this.updateCorrectlyAnswered()))
        }
        onDrop(e) {
            if (this.maintainer.disabled)
                return;
            if (this.maintainer.base == e)
                return;
            let t = this.maintainer.selected;
            t && e.place(t),
            this.updateCorrectlyAnswered()
        }
    }
    class zt extends Et {
        constructor(e) {
            super(e),
            e.selected = null
        }
        onDrag(e, t) {
            this.maintainer.disabled || (t ? t.place(e) : e.placed == this.maintainer.base ? this.maintainer.state = new _t(this.maintainer,e) : (this.maintainer.base.place(e),
            this.updateCorrectlyAnswered()))
        }
        onDrop(e) {}
    }
    class Rt {
        constructor(e, t="default") {
            this.definitions = e,
            this.default = t,
            this.categories = e.map((e => e.label.trim())).join("|"),
            this.regexp = new RegExp("(" + this.categories + ")\\s?\\:")
        }
        parseText(e) {
            let t, s = this.regexp.exec(e);
            s && s.length > 0 && (t = s[1]);
            let i = this.colorOf(t);
            return null != i && (e = e.replace(this.regexp, "").trim()),
            {
                text: e,
                color: i || this.default,
                label: t
            }
        }
        parseParagraph(e) {
            let t = new RegExp(`{(${this.categories}):([^}]*)}`,"g");
            return e.replace(t, ( (e, t, s) => {
                let i = this.colorOf(t);
                return i ? `<span style="background-color: ${i}">${s}</span>` : e
            }
            ))
        }
        colorOf(e) {
            var t;
            return null === (t = this.definitions.find((t => t.label === e))) || void 0 === t ? void 0 : t.color
        }
    }
    class qt extends Pt {
        constructor(e) {
            let t = e.parts.filter((e => e instanceof Ft))
              , s = t.reduce(( (e, t) => e.concat(t.correct)), []);
            if (Array.isArray(e.distractors))
                for (const t of e.distractors)
                    s.push(new Lt({
                        text: t
                    }));
            if (super(Object.assign({
                drops: t,
                drags: s,
                selected: null
            }, e)),
            this.drops.length > 0) {
                let e = this.drops.every((e => 1 == e.correct.length));
                this.state = new jt(this,this.drops[0],e)
            }
        }
        get correctlyAnswered() {
            return this.drops.every((e => e.correctlyAnswered))
        }
    }
    class Ft extends Ht {
        isCorrect(e) {
            let t = this.placed.indexOf(e);
            return t >= 0 && this.correct[t].text == e.text
        }
        getParts(e, t) {
            return e ? this.correct : t
        }
        get correctlyAnswered() {
            return this.placed.length == this.correct.length && this.placed.every((e => this.isCorrect(e)))
        }
    }
    const Bt = '<div class="drag-element drag-element-dragcloze[[ { \'-disabled\':placed.disabled } ]] border-style -radius spacer-box -p-h -p-v-s text-selection -[[ color ]] -no-margin" style="background-color: [[color]]" tabindex="0" on-click="[[ drop.selectDrag( data, event ) ]]"> <div class="text-style -drag" view="Html" data-html="[[ text ]]"></div> </div> ';
    class Vt extends It {
        constructor(e) {
            super(Object.assign({
                template: '<div> <div view="ColumnContent" data="[[ data ]]"> <template name="App\\DragDropCloze"> <div view="Html" data-html="[[ text ]]" class="text-style -p -max-read drag-cloze -[[ mode ]]"></div> </template> </div> <div class="fixed-panel context-panel [[ hidePanel( block.solutionMode, selected, correctlyAnswered ) ]]"> <div class="max-width-layout -center"> <div view="BaseDrop" data="[[ base ]]" data-maintainer="[[ data ]]"></div> </div> </div> </div> '
            }, e)),
            this.registry.add("Drop", ( () => new Y({
                template: '<div class="_inline-block score-icon-layout -top" on-click="[[ selectDrop( event ) ]]"> <div class="drop-zone -inline-text [[ { \'-empty\':getParts( block.solutionMode, placed ).length == 0 } ]] -mode-[[ mode ]] [[ { \'-selected\':selected == data } ]] -selectable"> <div view="DropZone" data-items="[[ getParts( block.solutionMode, placed ) ]]" data-as="drag" data-disabled="[[ maintainer.disabled ]]" on-changed="[[ testPlace( event.items ) ]]" class="content grid-layout -gutter drop-zone-fix" style="min-width: [[ getParts( block.solutionMode, placed ).length == 0 ? maxChars : 0 ]]ch"> <div class="item"> <div view="[[ drag.viewName ]]" data="[[ drag ]]"></div> </div> </div> </div> <div class="[[ { \'-ok\': maintainer.evaluated && correctlyAnswered, \'-ko\': maintainer.evaluated && !correctlyAnswered, \'-hide\':block.solutionMode } ]]" view="ScoreIcon"></div> </div> '
            }))),
            this.registry.add("BaseDrop", ( () => new Y({
                template: Dt
            }))),
            this.registry.add("Empty", ( () => new Y({
                template: ""
            }))),
            this.registry.add("TextDrag", ( () => new Y({
                template: Bt
            })))
        }
    }
    class Wt extends qt {
        constructor(e) {
            super(Object.assign(Object.assign({
                parts: [],
                mode: "Sentence"
            }, Be(e)), function(e, t=[]) {
                t = t.concat(Z("colorDefinitions"));
                let s = new Rt(t)
                  , i = {};
                return s.definitions.forEach((e => {
                    i[e.label] = e.color
                }
                )),
                s.definitions.forEach((e => {
                    i[e.color] && (e.color = i[e.color])
                }
                )),
                mt(e = e.replace(/}{/g, "}<span style='margin-right:2px'></span>{"), 0, (function(e) {
                    let t = [e];
                    return e.indexOf("|") >= 0 && (t = e.split("|")),
                    t = t.filter((e => e.trim().length > 0)),
                    {
                        part: new Ft({
                            correct: t.map((e => new Lt(s.parseText(e)))),
                            active: !1
                        }),
                        attributes: {
                            view: "Drop",
                            "data-maintainer": "[[ data ]]",
                            "data-selected": "[[ selected ]]",
                            "data-block": "[[ block ]]",
                            "data-mode": "[[ mode ]]",
                            "data-max-chars": "[[ maxChars ]]"
                        }
                    }
                }
                ))
            }(e.text, e.definitions))),
            Fe(this)
        }
        columnLayout() {
            return st(this, "-wide -no-break")
        }
        get maxChars() {
            if (this.gapLength > 0)
                return this.gapLength;
            let e = [];
            return [this.base, ...this.drops].forEach((t => {
                e = e.concat(t.placed)
            }
            )),
            e.reduce(( (e, t) => Math.max(St(t.text).length, e)), 0)
        }
    }
    class Zt extends R {
        constructor() {
            super({
                open: !1,
                items: [],
                selection: null
            })
        }
        select(e) {
            this.selection = e,
            this.open = !1
        }
        getIndex(e) {
            return this.items.indexOf(e)
        }
    }
    class Gt {
        constructor(e) {
            this.dropdown = new Zt,
            this.dropdown.items = e.choices,
            this.correct = e.correct,
            b(this, "disabled", "evaluated", "correct"),
            g(this, "correctlyAnswered", this.dropdown, "selection")
        }
        get correctlyAnswered() {
            return this.correct.indexOf(this.dropdown.selection) >= 0
        }
    }
    class Ut extends vt {
        constructor(e) {
            super(Object.assign(Object.assign({
                content: [],
                activeItems: []
            }, Be(e)), function(e, t={
                view: "DropDownPart"
            }) {
                return mt(e = e.replace(/}{/g, "}<span style='margin-right:2px'></span>{"), 0, (function(e) {
                    let s = []
                      , i = [];
                    for (const t of e.split(";")) {
                        let e = /^\*|\*$/g
                          , a = t.trim();
                        if (a.match(e)) {
                            let t = a.replace(e, "").trim();
                            s.push(t),
                            i.push(t)
                        } else
                            i.push(a)
                    }
                    return {
                        part: new Gt({
                            correct: s,
                            choices: i
                        }),
                        attributes: t
                    }
                }
                ))
            }(e.text, {
                view: "DropDownPart",
                "data-active-part": "[[ activePart ]]",
                "data-select-drop-down": "[[ selectDropDown.bind( data ) ]]",
                "data-disabled": "[[ disabled ]]",
                "data-evaluated": "[[ evaluated ]]",
                "data-or-hack": "[[ orHack ]]",
                "data-ter-fix": "[[ terFix ]]",
                "data-solution-mode": "[[ block.solutionMode ]]",
                "data-max-chars": "[[ maxChars ]]"
            }))),
            Fe(this),
            null != this.parts[0] && this.selectDropDown(this.parts[0])
        }
        init() {
            Z("block").authorMode && (this.userInput = !0)
        }
        orHack(...e) {
            return e.some((e => e))
        }
        terFix(e, t, s) {
            return e ? s : t
        }
        maxChars(e) {
            return e.dropdown.items.reduce(( (e, t) => Math.max(e, St(t).length)), 0)
        }
        selectDropDown(e) {
            this.disabled || (e.dropdown.selection && (e.dropdown.selection = void 0),
            this.activatePart(e))
        }
        activatePart(e) {
            this.activePart = null,
            this.activeItems = [],
            e && (this.activePart = e,
            this.activeItems = e.dropdown.items.filter((t => t != e.dropdown.selection)))
        }
        textSelection(e) {
            this.disabled || (this.userInput = !0,
            this.activePart.dropdown.selection = e,
            this.selectNextDropDown())
        }
        selectNextDropDown() {
            let e = this.parts.filter((e => e instanceof Gt))
              , t = e.indexOf(this.activePart);
            this.activatePart(e[t + 1])
        }
        columnLayout() {
            return st(this, "-wide -no-break")
        }
    }
    class $t extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div> <div view="ColumnContent" data="[[ data ]]"> <template name="App\\DropDown"> <div class="text-style -p -max-read" view="Html" data-html="[[ text ]]"></div> </template> </div> <div class="fixed-panel context-panel [[ { \'_hidden\':activeItems.length == 0 } ]]"> <div class="max-width-layout -center"> <div class="spacer-box -p overflow-box -no-scrollbars"> <div class="repository-clamp grid-layout -gutter base-drop-zone" view="Repeat" data-items="[[ activeItems ]]" data-as="item"> <div class="item"> <div view="TextSelection" class="[[ { \'-disabled\':disabled } ]] drag-element-dropdown" data-text="[[ item ]]" on-click="[[ parent.textSelection( item ) ]]" tabindex="0" autofocus></div> </div> </div> </div> </div> </div> </div> '
            }, e)),
            this.registry.add("DropDownPart", ( () => new Y({
                template: '<div class="_inline-block score-icon-layout -top dropDownPart" on-click="[[ selectDropDown( data ) ]]" tabindex="0"> <div class="drop-zone -inline-text [[ { \'-selected\':activePart == data, \'-disabled\':disabled } ]] -selectable [[ orHack( dropdown.selection, solutionMode ) ? \'-full\' : \'-empty\' ]]"> <div view="Show" data-if="[[ orHack( dropdown.selection, solutionMode ) ]]"> <div view="TextSelection" class="[[ { \'-disabled\':disabled } ]]" data-text="[[ terFix( solutionMode, dropdown.selection, correct ) ]]"></div> </div> <div view="Show" data-if="[[ !orHack( dropdown.selection, solutionMode ) ]]"> <div class="dummy-element"> <div class="text-style -drag" style="min-width: [[ maxChars( data ) ]]ch">&nbsp;</div> </div> </div> </div> <div class="[[ { \'-ok\': correctlyAnswered && evaluated, \'-ko\': !correctlyAnswered && evaluated, \'-hide\':solutionMode } ]]" view="ScoreIcon"></div> </div> '
            }))),
            this.registry.add("TextSelection", ( () => new Y({
                template: '<div class="drag-element border-style -radius spacer-box -p-h -p-v-s"> <div class="text-style -drag" view="Html" data-html="[[ text ]]"></div> </div> '
            })))
        }
    }
    class Xt extends It {
        constructor(e) {
            super(Object.assign({
                template: '<div> <div view="ColumnContent" data="[[ data ]]"> <template name="App\\GridCloze"> <div style="max-width:1280px" class="spacer-box -p-top overflow-box -scrollable flex-layout -row" view="Repeat" data-items="[[ drops ]]" data-as="drop"> <div view="[[ parent.mode ]]" data="[[ drop ]]" data-maintainer="[[ parent ]]" data-selected="[[ parent.selected == drop ]]" data-index="[[ index ]]"></div> </div> </template> </div> <div class="fixed-panel context-panel [[ hidePanel( block.solutionMode, selected, correctlyAnswered ) ]]"> <div class="max-width-layout -center"> <div view="BaseDrop" data="[[ base ]]" data-text="" data-maintainer="[[ data ]]"></div> </div> </div> </div> '
            }, e)),
            this.registry.add("Silbenbogen", ( () => new Y({
                template: '<div class="_inline-block spacer-box -m-between-h _pointer score-icon-layout -top silbenbogen" on-click="[[ selectDrop( event ) ]]" tabindex="0"> <div view="Show" data-if="[[ !maintainer.block.solutionMode ]]"> <div class="item grid-cloze -min-height border-style -radius [[ maintainer.selected == data ? \'-solid color-box\' : \'-dashed\' ]] -black10 spacer-box -m-bottom -p-h flex-layout -center drop-zone-fix" view="DropZone" data-items="[[ placed ]]" data-as="drag" data-disabled="[[ maintainer.disabled ]]" on-changed="[[ testPlace( event.items ) ]]"> <div class="drag-element border-style -radius spacer-box -m-between-h-s" on-click="[[ parent.selectDrag( drag, event ) ]]"> <div class="spacer-box -p-h -p-v-s"> <div class="text-style -drag">[[ drag.text ]]</div> </div> </div> </div> </div> <div view="Show" data-if="[[ maintainer.block.solutionMode ]]"> <div class="item grid-cloze -min-height border-style -radius [[ maintainer.selected == data ? \'-solid color-box\' : \'-dashed\' ]] -black10 spacer-box -m-bottom -p-h flex-layout -center drop-zone-fix" view="DropZone" data-items="[[ correct ]]" data-as="drag" data-disabled="[[ maintainer.disabled ]]" on-changed="[[ testPlace( event.items ) ]]"> <div class="drag-element border-style -radius spacer-box -m-between-h-s" on-click="[[ parent.selectDrag( drag, event ) ]]"> <div class="spacer-box -p-h -p-v-s"> <div class="text-style -drag">[[ drag.text ]]</div> </div> </div> </div> </div> <div class="[[ { \'-ok\': this.and( maintainer.evaluated, correctlyAnswered ), \'-ko\': this.and( maintainer.evaluated, !correctlyAnswered ), \'-hide\':maintainer.block.solutionMode } ]]" view="ScoreIcon"></div> <div class="flex-layout -center"> <svg class="item" xmlns="http://www.w3.org/2000/svg" height="72" width="140"> <path d="M2 2a68 68 0 0068 68 68 68 0 0068-68" fill="none" stroke="#000" stroke-linecap="round" stroke-width="4"/> </svg> </div> </div> '
            }))),
            this.registry.add("Satzmuster", ( () => new Y({
                template: '<div class="_inline-block spacer-box -m-between-h _pointer score-icon-layout -top satzmuster" on-click="[[ selectDrop( event ) ]]" tabindex="0"> <div view="Show" data-if="[[ !maintainer.block.solutionMode ]]"> <div class="grid-cloze -pattern -index-[[ index ]] [[ { \'-selected\': maintainer.selected == data } ]] border-style -radius -dashed spacer-box -p-h flex-layout -center drop-zone-fix" view="DropZone" on-changed="[[ testPlace( event.items ) ]]" data-items="[[ placed ]]" data-as="drag" data-disabled="[[ maintainer.disabled ]]"> <div class="_inline-block drag-element border-style -radius spacer-box -m-between-h-s" on-click="[[ parent.selectDrag( drag, event ) ]]"> <div class="spacer-box -p-h -p-v-s"> <div class="text-style -drag">[[ drag.text ]]</div> </div> </div> </div> </div> <div view="Show" data-if="[[ maintainer.block.solutionMode ]]"> <div class="grid-cloze -pattern -index-[[ index ]] [[ { \'-selected\': maintainer.selected == data } ]] border-style -radius -dashed spacer-box -p-h flex-layout -center drop-zone-fix" view="DropZone" on-changed="[[ testPlace( event.items ) ]]" data-items="[[ correct ]]" data-as="drag" data-disabled="[[ maintainer.disabled ]]"> <div class="_inline-block drag-element border-style -radius spacer-box -m-between-h-s" on-click="[[ parent.selectDrag( drag, event ) ]]"> <div class="spacer-box -p-h -p-v-s"> <div class="text-style -drag">[[ drag.text ]]</div> </div> </div> </div> </div> <div class="-shift [[ { \'-ok\': this.and( maintainer.evaluated, correctlyAnswered ), \'-ko\': this.and( maintainer.evaluated, !correctlyAnswered ), \'-hide\':maintainer.block.solutionMode } ]]" view="ScoreIcon"></div> </div> '
            }))),
            this.registry.add("Wortstreifen", ( () => new Y({
                template: '<div class="_inline-block _pointer score-icon-layout -top wortstreifen" on-click="[[ selectDrop( event ) ]]" tabindex="0"> <div view="Show" data-if="[[ !maintainer.block.solutionMode ]]"> <div class="grid-cloze -strip -index-[[ index ]] -min-height [[ { \'-selected\': maintainer.selected == data } ]] spacer-box -p-h flex-layout -center drop-zone-fix" view="DropZone" on-changed="[[ testPlace( event.items ) ]]" data-items="[[ placed ]]" data-as="drag" data-disabled="[[ maintainer.disabled ]]"> <div class="_inline-block drag-element border-style -radius spacer-box -m-between-h-s" on-click="[[ parent.selectDrag( drag, event ) ]]"> <div class="spacer-box -p-h -p-v-s"> <div class="text-style -drag">[[ drag.text ]]</div> </div> </div> </div> </div> <div view="Show" data-if="[[ maintainer.block.solutionMode ]]"> <div class="grid-cloze -strip -index-[[ index ]] -min-height [[ { \'-selected\': maintainer.selected == data } ]] spacer-box -p-h flex-layout -center drop-zone-fix" view="DropZone" on-changed="[[ testPlace( event.items ) ]]" data-items="[[ correct ]]" data-as="drag" data-disabled="[[ maintainer.disabled ]]"> <div class="_inline-block drag-element border-style -radius spacer-box -m-between-h-s" on-click="[[ parent.selectDrag( drag, event ) ]]"> <div class="spacer-box -p-h -p-v-s"> <div class="text-style -drag">[[ drag.text ]]</div> </div> </div> </div> </div> <div class="[[ { \'-ok\': this.and( maintainer.evaluated, correctlyAnswered ), \'-ko\': this.and( maintainer.evaluated, !correctlyAnswered ), \'-hide\':maintainer.block.solutionMode } ]]" view="ScoreIcon"></div> </div> '
            })))
        }
    }
    class Jt extends Pt {
        constructor(e) {
            super(Object.assign(Object.assign({
                content: [],
                selected: null,
                mode: "Silbenbogen"
            }, function(e, t=[], s) {
                let i = []
                  , a = []
                  , r = e.split("|");
                for (const e of r) {
                    let t, r = [], n = [];
                    for (; null !== (t = s.exec(e)); ) {
                        let e = t[0];
                        if (0 == e.length)
                            continue;
                        let s = e.indexOf("*") >= 0;
                        e = e.replace("*", "");
                        let i = new Yt({
                            text: e
                        });
                        r.push(i),
                        s && n.push(i)
                    }
                    i.push(new Qt({
                        correct: r,
                        placed: n
                    })),
                    a = a.concat(r)
                }
                return a = a.concat(t.map((e => new Yt({
                    text: e
                })))),
                {
                    drops: i,
                    drags: a
                }
            }(e.grid, e.distractors, "Satzmuster" == e.mode ? /(\*?\S+)/g : /(\*?.)/g)), Be(e))),
            Fe(this),
            this.state = new zt(this)
        }
        get correctlyAnswered() {
            return this.drops.every((e => e.correct.map((e => e.text)).join("") == e.placed.map((e => e.text)).join("")))
        }
    }
    class Yt extends Lt {
        get correctlyAnswered() {
            let e = this.placed.placed.indexOf(this)
              , t = this.placed.correct[e];
            return !!t && t.text == this.text
        }
    }
    class Qt extends Ht {
        get correctlyAnswered() {
            return this.placed.length == this.correct.length && this.placed.every((e => e.correctlyAnswered))
        }
    }
    class Kt extends R {
    }
    class es extends R {
        constructor(e) {
            super(Object.assign({
                disabled: !1,
                evaluated: !1,
                hotSpotAreas: [],
                spots: []
            }, e)),
            f(this.spots).arrayChange.subscribe(( () => {
                this.propertyChange.dispatch({
                    name: "correctlyAnswered"
                })
            }
            ))
        }
        onSpotClicked(e) {
            for (const t of this.hotSpotAreas)
                t.placeSpot(e);
            if (this.spots.length == this.hotSpotAreas.length) {
                let e = this.spots.shift();
                for (const t of this.hotSpotAreas)
                    t.removeSpot(e)
            }
            this.spots.push(e),
            this.propertyChange.dispatch({
                name: "correctlyAnswered"
            })
        }
        get correctlyAnswered() {
            return this.hotSpotAreas.every((e => e.correctlyAnswered))
        }
    }
    class ts extends Y {
        constructor(e) {
            super({
                template: '<div> <div view="ColumnContent" data="[[ data ]]"> <template name="App\\HotSpot"> <div> <div style="max-width:1280px" class="hot-spots [[ { \'-evaluated\': block.solutionMode } ]]" on-click="[[onClick() ]]"> <div class="background"> <img style="display:block" class="image-responsive" view="ImageLoader" alt="[[ altText ]]" data-route="image" data-file="[[ image ]]" data-preset="[[ preset || \'large\' ]]"> </div> <div view="Repeat" data-items="[[hotSpotAreas]]" data-as="a"> <div class="_absolute hot-area" style="top: [[ a.topLeft.y*100 ]]%;left: [[ a.topLeft.x*100 ]]%;bottom: [[ a.bottomRight.y*100 ]]%;right: [[ a.bottomRight.x*100 ]]%"></div> </div> <div view="Repeat" data-items="[[ block.solutionMode ? correctSpots : spots ]]" data-as="spot"> <div class="_absolute score-icon-layout -hotspot hot-spot" style="top: [[ spot.y * 100 ]]%;left: [[ spot.x * 100 ]]%"> <svg width="23" height="31" xmlns="http://www.w3.org/2000/svg"> <path d="m1 1.972 19.43 14.912-7.893 1.329 4.178 8.516-5.398 2.603-4.216-8.605L1 26.012V1.972Z" fill-rule="nonzero" stroke="#000" stroke-width="2" stroke-opacity=".539"/> </svg> <div class="-shift [[ { \'-hide\':parent.block.solutionMode , \'-ok\': parent.evaluated && spot.correctlyAnswered, \'-ko\': parent.evaluated && !spot.correctlyAnswered } ]]" view="ScoreIcon"></div> </div> </div> </div> </div> </template> </div> </div> '
            })
        }
        init() {
            this.clickHandler = this.onClicked.bind(this),
            this.node.addEventListener("click", this.clickHandler)
        }
        onClicked(e) {
            if (!0 === this.data.disabled)
                return;
            let t = e.currentTarget;
            t = t.querySelector(".background");
            let s = t.getBoundingClientRect();
            if (!(e.clientX >= s.left && e.clientX <= s.right && e.clientY >= s.top && e.clientY <= s.bottom))
                return;
            const i = (e.clientX - s.left) / s.width
              , a = (e.clientY - s.top) / s.height;
            this.data.onSpotClicked(new Kt({
                x: i,
                y: a
            }))
        }
        destroy() {
            super.destroy(),
            this.node.removeEventListener("click", this.clickHandler)
        }
    }
    class ss extends es {
        constructor(e) {
            e.hotSpotAreas = e.areas,
            delete e.areas,
            super(Be(e)),
            Fe(this)
        }
        init() {
            Z("block").authorMode && (this.userInput = !0)
        }
        columnLayout() {
            return st(this, "-wide -no-break")
        }
        onClick() {
            this.userInput = !0
        }
        get correctSpots() {
            return this.hotSpotAreas.map((e => ({
                x: (e.topLeft.x + (1 - e.bottomRight.x)) / 2,
                y: (e.topLeft.y + (1 - e.bottomRight.y)) / 2
            })))
        }
    }
    class is extends It {
        constructor(e) {
            super(Object.assign({
                template: '<div> <div view="ColumnContent" data="[[ data ]]"> <template name="App\\Order"> <div view="Repeat" data-items="[[ drops ]]" data-as="drop" style="max-width:1280px"> <div view="VerticalDrop" data="[[ drop ]]" data-maintainer="[[ parent ]]" data-selected="[[ parent.selected == drop ]]" data-solution-mode="[[ parent.block.solutionMode ]]"></div> </div> </template> </div> <div class="fixed-panel context-panel [[ hidePanel( block.solutionMode, selected, correctlyAnswered ) ]]"> <div view="BaseDrop" data="[[ base ]]" data-maintainer="[[ data ]]" data-solution-mode="[[ block.solutionMode ]]"></div> </div> </div> '
            }, e)),
            this.registry.add("Drop", ( () => new Y({
                template: Nt
            })))
        }
    }
    class as extends Pt {
        constructor(e) {
            const t = e.drags.map((e => new Ht({
                text: "",
                correct: [e]
            })));
            super(Object.assign({
                content: [],
                drops: t,
                selected: null
            }, Be(e))),
            Fe(this),
            this.state = new zt(this)
        }
    }
    class rs extends Y {
    }
    class ns extends R {
        constructor(e) {
            super(Object.assign({
                disabled: !1,
                evaluated: !1,
                active: null
            }, e)),
            this.active = this.categories.length > 0 ? this.categories[0] : null
        }
        init() {
            Z("block").authorMode && (this.userInput = !0)
        }
        selectPart(e) {
            this.disabled || (this.userInput = !0,
            e.selected = this.active === e.selected ? void 0 : this.active,
            this.propertyChange.dispatch({
                name: "correctlyAnswered"
            }))
        }
        toggleSelectedCategory(e) {
            this.disabled || (this.active = e)
        }
        get isDefaultCategory() {
            return 0 != this.categories.length && "default" == this.categories[0].label
        }
        get correctlyAnswered() {
            return !(this.parts.filter((e => !1 === e.correctlyAnswered)).length > 0)
        }
    }
    function os(e, t) {
        let s = e.parentNode;
        for (const i of t)
            s.insertBefore(i, e);
        s.removeChild(e)
    }
    const ds = ".,!?;:\"“„'`«»‹›\\[\\]";
    class ls extends R {
        constructor(e) {
            super(Object.assign({
                selected: void 0,
                correct: void 0
            }, e))
        }
        get correctlyAnswered() {
            return this.selected === this.correct
        }
    }
    class cs {
        constructor(e, t, s, i=!1) {
            this.parts = [],
            this.nodes = [],
            this.seperator = e,
            this.viewAttributes = t,
            this.selectPunctuation = i,
            this.colors = s,
            this.categorieMap = {};
            for (const e of s)
                this.categorieMap[e.label] = e
        }
        pushTextPart(e, t=void 0, s={
            type: "-regular"
        }) {
            0 != e.length && (this.parts.push(new ls(Object.assign({
                text: e,
                correct: this.categorieMap[t]
            }, s))),
            this.nodes.push(function(e) {
                let t = document.createElement("span");
                return Object.keys(e).forEach((s => {
                    t.setAttribute(s, e[s])
                }
                )),
                t
            }(Object.assign(Object.assign({}, this.viewAttributes), {
                data: "[[ parts[ " + (this.parts.length - 1) + " ] ]]"
            }))))
        }
        pushTextNode(e) {
            this.nodes.push(document.createTextNode(e))
        }
        process(e) {
            let t, s = this.nodes.length, i = e.textContent, a = 0, r = /{.*?}/gm;
            do {
                t = r.exec(i),
                t && (this.processTextPart(i.substring(a, t.index)),
                this.processCorrectPart(t[0]),
                a = r.lastIndex)
            } while (t);
            return this.processTextPart(i.substring(a, i.length)),
            this.nodes.slice(s)
        }
        processCorrectPart(e) {
            let t = e.substring(1, e.length - 1);
            if (t.indexOf(":") >= 0) {
                let e = new Rt(this.colors).parseText(t);
                "" == e.label && (this.categorieMap.default || (this.categorieMap.default = {
                    label: "default",
                    color: "default"
                }),
                e.label = "default"),
                this.pushTextPart(e.text, e.label)
            } else
                this.categorieMap.default || (this.categorieMap.default = {
                    label: "default",
                    color: "default"
                }),
                this.pushTextPart(t, "default")
        }
        processTextPart(e) {
            e.match(/^\s*/gm) && this.pushTextNode(" "),
            e.trim().split(/\s*\|\s*/gm).forEach(( (e, t, s) => {
                let i;
                1 == e.length && (i = e.match("([" + ds + "])")),
                i ? this.selectPunctuation ? this.pushTextPart(i[1]) : this.pushTextNode(i[1]) : this.pushTextPart(e.trim()),
                t < s.length - 1 && this.pushTextNode(" ")
            }
            )),
            e.match(/\s*$/gm) && this.pushTextNode(" ")
        }
        get categories() {
            return Object.values(this.categorieMap)
        }
    }
    class hs extends cs {
        constructor(e, t, s=!1) {
            super(" ", e, t, s)
        }
        processTextPart(e) {
            e.split(this.seperator).forEach(( (e, t, s) => {
                const i = e.match("([" + ds + "]*)([^" + ds + "]*)([" + ds + "]*)");
                i[1] && (this.selectPunctuation ? this.pushTextPart(i[1]) : this.pushTextNode(i[1])),
                i[2] && this.pushTextPart(i[2]),
                i[3] && (this.selectPunctuation ? this.pushTextPart(i[3]) : this.pushTextNode(i[3])),
                t < s.length - 1 && this.pushTextNode(" ")
            }
            ))
        }
    }
    class ps extends rs {
        constructor(e) {
            super(Object.assign({
                template: '<div> <div view="ColumnContent" data="[[ data ]]"> <template name="App\\TextSelection"> <div view="Html" class="text-style -p -max-read" data-html="[[ text ]]"></div> </template> </div> <div class="fixed-panel context-panel [[ { \'_hidden\':isDefaultCategory || evaluated, \'-one-category\': categories.length == 1  } ]]"> <div class="max-width-layout -center"> <div class="repository-clamp grid-layout flex-layout -gutter -center spacer-box -p" view="Repeat" data-items="[[ categories ]]" data-as="category"> <div class="item"> <div class="[[ { \'button-style\':!parent.disabled } ]] spacer-box -m-between-h text-selection -label [[ parent.active == category ? \'-selected\': \'\']] -[[ category.color ]]" style="background-color: [[category.hex]]" on-click="[[ parent.toggleSelectedCategory( category ) ]]"> [[ category.label ]] </div> </div> </div> </div> </div> </div> '
            }, e)),
            this.registry.add("TextPart", ( () => new Y({
                template: "<div class=\"[[ style == 'accent' ? '_inline-block' : '_inline' ]] score-icon-layout -left text-selection [[ type ]] [[ partExtraStyles( data ) ]] [[ { '-selected':selected, '_pointer':!disabled } ]]\" style=\"[[ inlineStyle( data, selected, solutionMode ) ]]\" on-click=\"[[ selectPart( data ) ]]\" tabindex=\"0\">[[ text ]]<div class=\"[[ { '-ok': evaluated && selected == correct && selected, '-ko': evaluated && selected != correct && selected, '-hide':solutionMode } ]]\" view=\"ScoreIcon\"></div></div> "
            })))
        }
    }
    class us extends ns {
        constructor(e) {
            super(Object.assign(Object.assign({
                style: "none",
                singleWordMode: " " === e.splitCharacter
            }, Be(e)), function(e) {
                let {text: t, parts: s, categories: i} = e;
                return i = i.map((e => {
                    let t = Z("colorDefinitions").find((t => t.label === e.color));
                    return e.hex = t ? t.color : "#1B3C64",
                    e
                }
                )),
                {
                    text: t,
                    parts: s,
                    categories: i
                }
            }(function(e, t=[], s=" ", i={
                view: "TextPart"
            }, a=!1) {
                const r = ["'", "`", "‘", "’", "′", "ʼ", "ʻ", "ʽ", "ʾ", "ʿ"].join("|");
                let n = new RegExp(r,"g");
                e = e.replace(n, "’");
                let o = " " == s ? new hs(i,t,a) : new cs(s,i,t,a)
                  , d = document.createElement("div");
                d.innerHTML = e;
                let l = document.createTreeWalker(d, NodeFilter.SHOW_TEXT)
                  , c = l.nextNode();
                for (; c; ) {
                    if (!(c instanceof Text))
                        continue;
                    let e = l.currentNode;
                    c = l.nextNode(),
                    os(e, o.process(e))
                }
                return {
                    text: d.innerHTML,
                    parts: o.parts,
                    categories: o.categories
                }
            }(e.text, e.definitions, e.splitCharacter, {
                view: "TextPart",
                "data-select-part": "[[ selectPart.bind( data ) ]]",
                "data-inline-style": "[[ inlineStyle.bind( data ) ]]",
                "data-part-extra-styles": "[[ partExtraStyles.bind( data ) ]]",
                "data-disabled": "[[ disabled ]]",
                "data-evaluated": "[[ evaluated ]]",
                "data-style": "[[ style ]]",
                "data-question": "[[ data ]]",
                "data-solution-mode": "[[ block.solutionMode ]]"
            }, e.selectPunctuation)))),
            Fe(this)
        }
        partExtraStyles(e) {
            let t = e.text.trim()
              , s = ["-" + this.style]
              , i = ds;
            return t.match("([" + i + "])"),
            1 == t.length && t.match("([" + ds + "])") && s.push("-punctuation"),
            s.push(this.singleWordMode ? "-single-word" : "-multi-word"),
            s.join(" ")
        }
        inlineStyle(e) {
            if (this.block.solutionMode) {
                if (e.correct)
                    return "background-color: " + e.correct.hex + "; color: #FFF"
            } else if (e.selected)
                return "background-color: " + e.selected.hex + "; color: #FFF";
            return ""
        }
        columnLayout() {
            return st(this, "-wide -no-break")
        }
    }
    class vs extends It {
        constructor(e) {
            super(Object.assign(Object.assign({}, e), {
                template: '<div> <div view="ColumnContent" data="[[ data ]]"> <template name="App\\DragDropSentence"> <div class="score-icon-layout -top"> <div view="Repeat" style="max-width:1280px" data-items="[[ drops ]]" data-as="drop"> <div class="word-order" view="VerticalDrop" data="[[ drop ]]" data-maintainer="[[ parent ]]" data-mode="[[ mode ]]"></div> </div> <div class="[[ { \'-hide\':block.solutionMode , \'-ok\': evaluated && correctlyAnswered, \'-ko\': evaluated && !correctlyAnswered } ]]" view="ScoreIcon"></div> </div> </template> </div> <div class="fixed-panel context-panel [[ hidePanel( block.solutionMode, selected, correctlyAnswered ) ]]"> <div class="max-width-layout -center"> <div view="BaseDrop" data="[[ base ]]" data-maintainer="[[ data ]]"></div> </div> </div> </div> '
            })),
            this.registry.add("TextDrag", ( () => new Y({
                template: Bt
            })))
        }
    }
    class ms extends Pt {
        constructor(e) {
            let t = e.drags;
            delete e.drags,
            super(Object.assign(Object.assign({
                content: [],
                selected: null,
                solutions: []
            }, function(e, t=[], s=[]) {
                s = s.concat(Z("colorDefinitions"));
                let i = new Rt(s)
                  , a = {};
                i.definitions.forEach((e => {
                    a[e.label] = e.color
                }
                )),
                i.definitions.forEach((e => {
                    a[e.color] && (e.color = a[e.color])
                }
                ));
                let r = []
                  , n = {}
                  , o = [];
                return e.split("\n").forEach((e => {
                    let t = {}
                      , s = "";
                    if (0 == (e = e.trim()).length)
                        return;
                    let a = [];
                    e.split("|").forEach((e => {
                        let r = e.trim();
                        (!n[r] || t[r]) && r.length > 0 && (n[r] = !0,
                        t[r] = !0,
                        a.push(new Lt(i.parseText(r)))),
                        s += i.parseText(r).text
                    }
                    )),
                    r.push(a),
                    o.push(s)
                }
                )),
                {
                    drags: [].concat(...r).concat(t.map((e => new Lt({
                        text: e.trim()
                    })))),
                    drops: [new Ht({
                        text: "",
                        correct: r[0],
                        strictOrder: !0
                    })],
                    solutions: o
                }
            }(t, e.distractors, e.definitions)), Be(e))),
            Fe(this),
            this.state = new jt(this,this.drops[0])
        }
        get correctlyAnswered() {
            return this.drops.some((e => {
                let t = e.placed.map((e => e.text)).join("");
                return this.solutions.indexOf(t) >= 0
            }
            ))
        }
    }
    class gs extends R {
        constructor(e) {
            super(Object.assign({
                current: new fs({
                    pieces: []
                }),
                distractorPieces: [],
                found: [],
                seperator: ""
            }, e)),
            this.distractors && this.distractors.length > 0 && (this.distractorPieces = this.distractors.map((e => {
                switch (e[0].toLowerCase() + e[1].toLowerCase()) {
                case "l:":
                    return new bs({
                        type: "start",
                        text: e.substring(2),
                        distractor: !0
                    });
                case "m:":
                    return new bs({
                        type: "mid",
                        text: e.substring(2),
                        distractor: !0
                    });
                case "r:":
                    return new bs({
                        type: "end",
                        text: e.substring(2),
                        distractor: !0
                    })
                }
                return new bs({
                    type: this.randomPartType,
                    text: e,
                    distractor: !0
                })
            }
            ))),
            f(this.found).arrayChange.subscribe(( () => {
                this.propertyChange.dispatch({
                    name: "correctlyAnswered"
                })
            }
            ))
        }
        init() {
            Z("block").authorMode && (this.userInput = !0)
        }
        get randomPartType() {
            const e = ["start", "mid", "end"];
            return e[Math.floor(Math.random() * e.length)]
        }
        get correctlyAnswered() {
            return this.found.length == this.words.length && this.found.every((e => this.isCorrectWord(e)))
        }
        get pieces() {
            let e = Ue(this.words.reduce(( (e, t) => e.concat(t.pieces)), []));
            return Ue(e.concat(this.distractorPieces))
        }
        isCorrectWord(e) {
            return this.words.some((t => t.same(e)))
        }
        select(e) {
            if (!this.disabled && !e.hidden && (!this.current.isEmpty() || "start" == e.type) && (this.current.isEmpty() || "start" != e.type) && (this.current.add(e),
            e.selected = !0,
            "end" == e.type)) {
                this.found.push(this.current),
                this.userInput = !0;
                for (const e of this.current.pieces)
                    e.hidden = !0,
                    e.selected = !1;
                this.current = new fs({
                    pieces: []
                }),
                this.propertyChange.dispatch({
                    name: "correctlyAnswered"
                })
            }
        }
        reset(e) {
            if (!this.disabled) {
                Ge(e, this.found);
                for (const t of e.pieces)
                    t.hidden = !1;
                this.propertyChange.dispatch({
                    name: "correctlyAnswered"
                })
            }
        }
    }
    class bs extends R {
        constructor(e) {
            super(Object.assign({
                hidden: !1,
                selected: !1
            }, e))
        }
    }
    class fs extends R {
        constructor(e) {
            super(Object.assign({
                pieces: []
            }, e))
        }
        same(e) {
            return this.pieces.every(( (t, s) => t.text == e.pieces[s].text))
        }
        add(e) {
            this.pieces.push(e)
        }
        isEmpty() {
            return 0 == this.pieces.length
        }
        contains(e) {
            return this.pieces.indexOf(e) >= 0
        }
    }
    class ws extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div> <div view="ColumnContent" data="[[ data ]]"> <template name="App\\WordPuzzle"> <div class="text-style -p" style="max-width:1280px"> <div class="border-style -dashed -radius -black50" view="Repeat" data-items="[[ pieces ]]" data-as="piece"> <div on-click="[[ parent.select( piece ) ]]" class="puzzle-piece -[[ piece.type ]] [[ { \'-hidden\': this.or( piece.hidden  && (piece.distractor !==true), parent.block.solutionMode && (piece.distractor !==true) ), \'-focus\':piece.selected, \'-disabled\':parent.disabled } ]] spacer-box -m-l" style="transform:translate( [[ parent.calcOffset() ]]px, [[ parent.calcOffset() ]]px)" tabindex="0"> <div class="bulb -left"></div> [[ piece.text ]] <div class="bulb -right"></div> </div> </div> <div class="spacer-box -m-v flex-layout -wrap -gap-16" view="Repeat" data-items="[[ block.solutionMode ? words : found ]]" data-as="word"> <div class="_inline-block score-icon-layout -top puzzle-reset" on-click="[[ parent.reset( word ) ]]" tabindex="0"> <div view="Repeat" data-items="[[ word.pieces ]]" data-as="piece"> <span class="puzzle-piece -[[ piece.type ]] [[ { \'-disabled\':parent.parent.disabled } ]] -selected -found"> [[ piece.text ]] <span class="seperator [[ { \'_hidden\': isLast || parent.parent.seperator == \'\' } ]]"> [[ parent.parent.seperator ]] </span> </span> </div> <div class="[[ { \'-hide\':parent.block.solutionMode , \'-ok\': parent.evaluated && parent.isCorrectWord( word ), \'-ko\': parent.evaluated && !parent.isCorrectWord( word ) } ]]" view="ScoreIcon"></div> </div> </div> </div> </template> </div> </div> '
            }, e))
        }
    }
    class xs extends gs {
        constructor(e) {
            e.words = e.words.map((e => {
                let t = e.split("|").map(( (e, t, s) => {
                    let i = "mid";
                    return 0 == t && (i = "start"),
                    t == s.length - 1 && (i = "end"),
                    new bs({
                        type: i,
                        text: e
                    })
                }
                ));
                return new fs({
                    pieces: t
                })
            }
            )),
            super(Object.assign({}, Be(e))),
            Fe(this)
        }
        calcOffset() {
            return 20 * (2 * Math.random() - 1)
        }
        columnLayout() {
            return st(this, "-wide -no-break")
        }
    }
    class ys extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div class="image_zoom"> <div class="image-styles -[[ style ]]"> <svg class="icon" view="Icon" on-click="[[openLightbox(event)]]" data-icon="zoom"></svg> <img style="display:block" draggable="false" class="image-responsive" view="ImageLoader" alt="[[ alt || altText || \'\' ]]" data-route="image" data-file="[[ file ]]" data-preset="[[ preset || \'large\' ]]"> <div class="text-style -p -emphasize-gray media-caption">[[ caption ]]</div> </div> <div view="Teleport" data-show="[[ open ]]"> <div class="image_zoom"> <div class="lightbox [[ { \'_hidden\':!open } ]]"> <div class="content"> <div class="imageContainer"> <img id="ImageZoomLightbox-image" style="display:block" draggable="false" class="" view="ImageLoader" alt="[[ alt || altText || \'\' ]]" data-route="image" data-file="[[ file ]]" data-preset="[[ preset || \'large\' ]]"> </div> <svg class="icon" view="Icon" data-icon="zoom-out" on-click="[[open = false]]"></svg> </div> </div> </div> </div> </div> ',
                data: new ks
            }, e))
        }
    }
    class ks extends R {
        constructor() {
            super(),
            this.open = !1,
            this.closeLightbox = e => {
                this.open = !1,
                this.open = !1
            }
        }
        openLightbox(e) {
            e.preventDefault(),
            e.stopPropagation(),
            this.open = !this.open
        }
    }
    class As extends Y {
        constructor(e, t) {
            super(),
            this.checkedTemplate = e,
            this.uncheckedTemplate = t
        }
        init() {
            this.update()
        }
        update() {
            this.node.innerHTML = this.data ? this.checkedTemplate : this.uncheckedTemplate
        }
    }
    class Cs extends As {
        constructor() {
            super('<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/> </svg> ', '<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/> </svg> ')
        }
    }
    class Ss extends he {
        constructor(e) {
            e.choices = e.answers,
            delete e.answers,
            super(Object.assign({
                content: [],
                style: "default",
                shuffle: !1
            }, Be(e))),
            Fe(this)
        }
        init() {
            Z("block").authorMode && (this.userInput = !0)
        }
        get choiceMode() {
            return "default" != this.style ? this.style : this.hasOnlyImages() ? "Grid" : "List"
        }
        get sortedChoices() {
            return this.shuffle && !Z("block").authorMode ? Ue(this.choices) : this.choices
        }
        hasOnlyImages() {
            return this.choices.every((e => {
                var t, s;
                return "App\\Image" == (null === (t = e.asset) || void 0 === t ? void 0 : t.modelName) || "AudioGlossarImage" == (null === (s = e.asset) || void 0 === s ? void 0 : s.modelName)
            }
            ))
        }
        columnLayout() {
            return st(this, this.hasOnlyImages() ? "-wide -no-break" : "-no-break")
        }
        get columnClass() {
            let e = "";
            return this.content.forEach(( (t, s) => {
                switch (t.modelName) {
                case "App\\Image":
                case "AudioGlossarImage":
                    e += "-image";
                    break;
                case "App\\Audio":
                    e += "-audio";
                    break;
                case "App\\Text":
                    s + 1 == this.content.length && (e += "-wide")
                }
            }
            )),
            e
        }
        selectChoice(e) {
            this.disabled || (this.userInput = !0,
            e.selected = !e.selected,
            this.updateCorrect())
        }
        isSelected(e, ...t) {
            return this.block.solutionMode ? e.correct : e.selected
        }
        showCorrect(e, t) {
            return t && e.selected == e.correct && e.selected
        }
        showWrong(e, t) {
            return t && e.selected != e.correct && e.selected
        }
    }
    class Ms extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div> <div view="ColumnContent" class=" [[ columnClass ]]" data="[[ data ]]"> <template name="App\\MultipleChoice"> <div> <div view="[[ choiceMode ]]" data="[[ data ]]"></div> </div> </template> <template name="App\\SingleChoice"> <div> <div view="[[ choiceMode ]]" data="[[ data ]]"></div> </div> </template> </div> </div> '
            }, e)),
            this.registry.add("Repeat", ( () => new te)),
            this.registry.add("Checkbox", ( () => new Cs)),
            this.registry.add("List", ( () => new Y({
                template: '<div> <div class="text-style -p -max-read" view="Repeat" data-items="[[ sortedChoices ]]" data-as="item"> <div tabindex="0" class="text-choice -[[ parent.icon ]] [[ { \'-selected\':item.selected, \'button-style\':!parent.disabled } ]]" on-click="[[ parent.selectChoice( item ) ]]"> <div class="flex-layout -row -items-center"> <svg class="item -content" view="Icon" data-icon="[[ parent.isSelected( item, item.selected, parent.block.solutionMode ) ? parent.icon + \'-on\' : parent.icon + \'-off\' ]]"></svg> <div class="item -no-grow score-icon-layout -right"> <div view="[[ item.asset ? \'Media\' : \'Text\' ]]" data="[[ item ]]"></div> <div class="[[ { \'-hide\':parent.block.solutionMode, \'-ok\':parent.showCorrect( item, parent.evaluated, item.selected ), \'-ko\':parent.showWrong( item, parent.evaluated, item.selected ) } ]]" view="ScoreIcon"></div> </div> </div> </div> </div> </div> '
            }))),
            this.registry.add("Grid", ( () => new Y({
                template: '<div> <div class="text-style -p -max-read grid-layout -gutter" view="Repeat" data-items="[[ sortedChoices ]]" data-as="item"> <div class="item image-grid-item [[ { \'-selected\':parent.isSelected( item, item.selected, parent.block.solutionMode ), \'button-style\':!parent.disabled } ]] " on-click="[[ parent.selectChoice( item ) ]]"> <div class="content score-icon-layout -inside-br"> <div view="Media" data="[[ item ]]"></div> <div class="[[ { \'-hide\':parent.block.solutionMode, \'-ok\':parent.showCorrect( item, parent.evaluated, item.selected ), \'-ko\':parent.showWrong( item, parent.evaluated, item.selected ) } ]]" view="ScoreIcon"></div> </div> </div> </div> </div> '
            }))),
            this.registry.add("Media", ( () => new Y({
                template: '<div> <div view="[[ asset.modelName.replace( \'App\\\\\', \'\' ) ]]" data="[[ asset ]]"></div> <div class="choice-legend spacer-box -p-h-s" view="Html" data-html="[[ text ]]"></div> </div> '
            }))),
            this.registry.add("Text", ( () => new Y({
                template: '<div> <div view="Html" data-html="[[ text ]]"></div> </div> '
            })))
        }
    }
    class Ts extends Ss {
        constructor(e) {
            super(Object.assign({
                icon: "mc"
            }, e))
        }
        showWrong(e, t) {
            return t && e.selected != e.correct && (e.correct || e.selected)
        }
    }
    class Os extends Ss {
        constructor(e) {
            super(Object.assign({
                icon: "sc"
            }, e))
        }
        selectChoice(e) {
            if (this.userInput = !0,
            !this.disabled) {
                for (const t of this.choices)
                    t.selected = t == e;
                this.updateCorrect()
            }
        }
    }
    const Es = {
        source: void 0,
        target: void 0
    };
    class Ds extends te {
        constructor(e) {
            super(Object.assign({
                data: new Ns
            }, e)),
            this.moveHandler = this.onMouseMove.bind(this),
            this.upHandler = this.onMouseUp.bind(this),
            this.downHandler = this.onMouseDown.bind(this)
        }
        init() {
            this.node.DropZone = this,
            super.init(),
            this.indicator = K("Indicator", this.context),
            this.indicator.render()
        }
        deinit() {
            this.getItemNodes().forEach((e => {
                this.event([this.getHandleNode(e)], ["touchstart", "mousedown"], this.downHandler, "remove")
            }
            )),
            super.deinit()
        }
        createTemplate(e, t, s) {
            let i = super.createTemplate(e, t, s);
            return this.event([this.getHandleNode(i.node)], ["touchstart", "mousedown"], this.downHandler, "add"),
            i
        }
        onMouseDown(e) {
            if (this.data.disabled)
                return;
            this.downTarget = e.target;
            let t = this.getChildOfHandle(this.downTarget)
              , s = this.getItemNodes().indexOf(t);
            this.ghost = K("Ghost", this.context),
            this.ghost.render(),
            this.ghost.node.appendChild(t.cloneNode(!0));
            const i = fe(e.target)
              , a = Is(e);
            this.ghost.node.style.transform = "translate(-" + (a.pageX - i.left) + "px, -" + (a.pageY - i.top) + "px)",
            Es.source = {
                zone: this,
                index: s,
                node: t,
                item: this.data.items[s]
            },
            Es.target = void 0;
            const r = this.node.ownerDocument;
            this.event([r], ["touchmove", "mousemove"], this.moveHandler, "add"),
            this.event([r], ["mouseup", "touchend"], this.upHandler, "add"),
            this.updateTranslation(e)
        }
        onMouseMove(e) {
            var t;
            this.ghost.node.parentElement || this.node.ownerDocument.body.appendChild(this.ghost.node),
            this.updateTranslation(e),
            this.checkOver(e),
            null === (t = window.getSelection()) || void 0 === t || t.removeAllRanges()
        }
        updateTranslation(e) {
            let t = this.ghost.node
              , s = Is(e);
            t.style.top = s.clientY + "px",
            t.style.left = s.clientX + "px"
        }
        checkOver(e) {
            var t, s, i;
            const a = Is(e);
            let r = this.node.ownerDocument.elementFromPoint(a.clientX, a.clientY)
              , n = this.findDropZone(r);
            if (!n || !n.data.allowTransfer(Es.source))
                return;
            const o = a.pageX
              , d = a.pageY
              , l = n.getItemNodes();
            if (0 == l.length) {
                let e = 0;
                return Es.target = {
                    zone: n,
                    index: e
                },
                void n.node.appendChild(this.indicator.node)
            }
            for (let e = 0; e < l.length; e++) {
                let a = fe(l[e]);
                if (o < a.right && o > a.left && d > a.top && d < a.bottom) {
                    let r;
                    if (r = o > a.left + a.width / 2 ? e + 1 : e,
                    n == Es.source.zone && (r == Es.source.index || r == Es.source.index + 1))
                        return Es.target = void 0,
                        void (null === (t = this.indicator.node.parentNode) || void 0 === t || t.removeChild(this.indicator.node));
                    if (n == (null === (s = Es.target) || void 0 === s ? void 0 : s.zone) && r == (null === (i = Es.target) || void 0 === i ? void 0 : i.index))
                        return;
                    Es.target = {
                        zone: n,
                        index: r
                    },
                    n.node.insertBefore(this.indicator.node, l[r]);
                    break
                }
                if (o > a.right && d > a.top && d < a.bottom) {
                    let e = l.length;
                    Es.target = {
                        zone: n,
                        index: e
                    },
                    n.node.insertBefore(this.indicator.node, l[e])
                }
            }
        }
        findDropZone(e) {
            if (e) {
                if (e.DropZone)
                    return e.DropZone;
                if (e.parentNode)
                    return this.findDropZone(e.parentNode)
            }
        }
        onMouseUp(e) {
            var t, s;
            const i = this.node.ownerDocument;
            if (this.event([i], ["touchmove", "mousemove"], this.moveHandler, "remove"),
            this.event([i], ["mouseup", "touchend"], this.upHandler, "remove"),
            null === (t = this.ghost.node.parentNode) || void 0 === t || t.removeChild(this.ghost.node),
            null === (s = this.indicator.node.parentNode) || void 0 === s || s.removeChild(this.indicator.node),
            this.ghost.destroy(),
            Es.target)
                if (Es.source.zone == Es.target.zone)
                    Es.source.zone.data.swap(Es.source.index, Es.target.index);
                else {
                    let e = Es.source.zone.data.remove(Es.source.index);
                    Es.target.zone.data.add(Es.target.index, e)
                }
        }
        event(e, t, s, i) {
            for (const a of e) {
                if (!a)
                    return;
                for (const e of t)
                    a[i + "EventListener"](e, s)
            }
        }
        getHandleNode(e) {
            return this.data.handle ? e.querySelector(this.data.handle) : e
        }
        getChildOfHandle(e) {
            return this.node == e.parentNode ? e : this.getChildOfHandle(e.parentNode)
        }
        getItemNodes() {
            return [...this.cache.values()].map((e => e.node))
        }
    }
    class Ns extends se {
        constructor(e) {
            super(Object.assign({
                caching: !0
            }, e)),
            this.disabled = !1,
            this.changed = new v
        }
        allowTransfer(e) {
            return !0
        }
        swap(e, t) {
            let s = [...this.items]
              , i = s[e];
            s.splice(e, 1),
            s.splice(e < t ? t - 1 : t, 0, i),
            this.changed.dispatch({
                items: s
            })
        }
        remove(e) {
            let t = [...this.items]
              , s = t.splice(e, 1)[0];
            return this.changed.dispatch({
                items: t
            }),
            s
        }
        add(e, t) {
            let s = [...this.items];
            s.splice(e, 0, t),
            this.changed.dispatch({
                items: s
            })
        }
    }
    function Is(e) {
        return function(e) {
            return void 0 !== e.touches
        }(e) ? e.touches[0] : e
    }
    class Ps extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div> <div view="Content"></div> </div> ',
                data: new Ls
            }, e)),
            this.registry.add(null, ( () => new Y({
                template: ""
            })))
        }
        init() {
            this.comment = document.createComment("Teleport to: " + this.data.to),
            this.subscription = this.data.propertyChange.filter((e => "show" == e.name)).subscribe(this.check.bind(this)),
            this.node.parentNode.replaceChild(this.comment, this.node),
            this.check()
        }
        deinit() {
            var e;
            null === (e = this.subscription) || void 0 === e || e.unsubscribe()
        }
        check() {
            const e = document.querySelector(this.data.to);
            this.data.show ? e.appendChild(this.node) : this.node.parentNode == e && e.removeChild(this.node)
        }
    }
    class Ls extends R {
        constructor(e={}) {
            super(Object.assign({
                show: !1,
                to: "body",
                content: {
                    view: null
                }
            }, e))
        }
    }
    class Hs extends R {
        constructor(e) {
            super(e),
            this.setColor()
        }
        setColor() {
            let e = new Rt(Z("colorDefinitions")).parseParagraph(this.text);
            this.text = e
        }
    }
    class js extends Y {
        constructor(e) {
            super(Object.assign({
                template: '<div class="-wide -text"> <div class="text-style -p -max-read" view="Html" data-html="[[ text ]]"></div> </div> '
            }, e))
        }
    }
    class _s extends R {
    }
    class zs extends Y {
        constructor(e) {
            super(Object.assign({
                data: new _s({
                    route: "image"
                }),
                template: ""
            }, e))
        }
        init() {
            this.setAttributes(["width", "height"]);
            let e = {
                width: window.innerWidth || document.body.clientWidth,
                height: window.innerHeight || document.body.clientHeight
            };
            this.data.viewWidth = e.width,
            this.data.viewHeight = e.height,
            this.errorhandle = this.onError.bind(this),
            this.node.addEventListener("error", this.errorhandle),
            this.load()
        }
        deinit() {
            this.node.removeEventListener("error", this.errorhandle)
        }
        load() {
            this.node.setAttribute("src", G(this.data.route, this.data).url())
        }
        onError(e) {
            this.node.setAttribute("src", "https://placehold.co/500x300.png?text=Error")
        }
        setAttributes(e) {
            for (const t of e)
                this.data[t] && this.node.setAttribute(t, this.data[t])
        }
    }
    J.or = function() {
        return Array.from(arguments).some((e => e))
    }
    ,
    J.and = function() {
        return Array.from(arguments).every((e => e))
    }
    ,
    J.ter = function(e, t, s) {
        return e ? t : s
    }
    ;
    var Rs = new Q;
    Rs.add("Repeat", ( () => new te)),
    Rs.add("Collapse", ( () => new ne({
        template: '<div> <div class="collapse-box transition-style"></div> </div> '
    }))),
    Rs.add("ImageLoader", ( () => new zs)),
    Rs.add("Html", ( () => new le)),
    Rs.add("Teleport", ( () => new Ps)),
    Rs.add("Show", ( () => new ie)),
    Rs.add("Icon", ( () => new Y({
        template: '<svg class="svg-icon [[ styles ]]"> <use xlink:href="#[[ icon ]]"/> </svg> ',
        data: new R({
            styles: ""
        })
    }))),
    Rs.add("Footer", ( () => new Y({
        template: '<footer> <div class="max-width-layout -center"> <div class="flex-layout -row -items-stretch border-style -top-main text-style -footer color-box -primary30"> <div class="item overflow-box -no-scrollbars -scrolling display-responsive [[ { \'-hide-phone-only\':showPointNavi, \'_hidden\':!showPointNavi } ]]" view="PointNavi" data-active="[[ currentSlide ]]" data-points="[[ slidesWithoutSummary ]]" data-select-question="[[ onPointNavi.bind( data ) ]]" data-active="[[ currentSlide ]]" data-author-mode="[[ authorMode ]]"></div> <div class="item -content -center text-style -text-progress display-responsive [[ { \'-hide-tablet-portrait-up\':showPointNavi } ]] spacer-box -m-h"> [[ this.trans( \'progress\', { data: { current: questionsWithFreetext.indexOf( currentSlide ) + 1, total:slidesWithoutSummary.length } } ) ]] </div> <div class="item"></div> <div class="item -content audio-help-button abs-layout [[ { \'_hidden\':grade != \'level1\' } ]]" on-click="[[ audioHelp = !audioHelp ]]"> <button class="button button-style -icon"> <svg class="icon" view="Icon" data-icon="audio-help"></svg> </button> <div class="label item -vcenter"> <p class="text-style -white spacer-box -p-h">[[ this.trans( \'audiohelp\' ) ]]</p> </div> </div> <div class="item -content"> <button class="button-style -evaluate color-box -primary [[ { \'-disabled\':currentSlide.evaluated } ]] [[ { \'-disabled -deactivated\':!currentSlide.userInput } ]] -icon" on-click="[[ evaluate() ]]"> <svg class="icon" view="Icon" data-icon="[[ evaluated ? \'check-disabled\' : \'check\' ]]"></svg> <p class="label display-responsive -hide-phone-only spacer-box -p-right-l -p-left">[[ this.trans( \'evaluate\' ) ]]</p> </button> </div> <div class="item -content"> <div view="Show" data-if="[[ currentSlide.evaluated ]]"> <div class="flex-layout -row -items-stretch"> <button class="item button-style -icon color-box -primary" on-click="[[ next() ]]"> <svg class="icon" view="Icon" data-icon="next"></svg> </button> </div> </div> </div> </div> </div> </footer> '
    }))),
    Rs.add("ColumnContent", ( () => new Y({
        template: '<div class="column-layout" view="Repeat" data-items="[[ columnLayout() ]]" data-as="item"> <div class="item [[ item.style ]] " style="" view="[[ item.content.modelName ]]" data="[[ item.content ]]"></div> </div> '
    }))),
    Rs.add("Feedback", ( () => new Y({
        template: '<div> <div class="fixed-panel feedback-panel [[ { \'_hidden\':!currentSlide.feedback } ]]"> <div class="color-box -primary50 spacer-box -p-v -p-right-l"> <div class="flex-layout -row -items-center question-layout content-spacer -left"> <div class="item text-style -p [[ { \'_invisible\':solutionMode } ]]" view="Html" data-html="[[ currentSlide.feedback ]]"></div> <div class="item -content" view="Show" data-if="[[ currentSlide.evaluated ]]"> <div class="flex-layout -row -items-center _pointer [[ { \'_hidden\':currentSlide.correctlyAnswered } ]]" on-click="[[ solutionMode = !solutionMode ]]"> <div class="transition-style spacer-box -p-right-s text-style -infra -s18 -w500 [[ solutionMode ? \'-white\' : \'-blue\' ]]">Lösung</div> <div class="toggle-ui [[ { \'-on\': solutionMode } ]]"><div class="point transition-style"></div></div> </div> </div> </div> </div> </div> <div class="solution-overlay [[ { \'-show\': solutionMode } ]]" on-click="[[ solutionMode = false ]]"></div> </div> '
    }))),
    Rs.add("AudioGlossarTerm", ( () => new Ie)),
    Rs.add("AudioGlossarImage", ( () => new Ne)),
    Rs.add("AudioGlossarHeading", ( () => new Pe)),
    Rs.add("AudioGlossarImageDrag", ( () => new Le)),
    Rs.add("AudioGlossarImageDrop", ( () => new He)),
    Rs.add("AudioPlayer", ( () => new ue)),
    Rs.add("AudioPlayerMini", ( () => new ve)),
    Rs.add("SlideBar", ( () => new we)),
    Rs.add("ScoreIcon", ( () => new Y({
        template: '<div class="score-icon"> <svg viewBox="0 0 24 24" viewPort xmlns="http://www.w3.org/2000/svg"> <circle stroke="none" class="bg" cx="12" cy="12" r="12"/> <path class="ok" stroke-width="2" fill="none" d="m6 12.662 3.414 3.691L17.241 8"/> <path class="ko" stroke-width="2" d="M7 16.987 16.43 8M16.43 16.987 7 8"/> </svg> </div> '
    }))),
    Rs.add("DropZone", ( () => new Ds)),
    Rs.add("Ghost", ( () => new Y({
        template: '<div class="ghost" style="position: fixed; pointer-events: none; top: 0px; left: 0px; margin: 0px; opacity: 0.4; pointer-events: none; z-index: 10000; white-space: nowrap;"></div>'
    }))),
    Rs.add("Indicator", ( () => new Y({
        template: '<div class="ddIndicator">|</div>'
    }))),
    Rs.add("Image", ( () => new Y({
        template: '<div class="image-styles -[[ style ]]"> <img style="display:block" draggable="false" class="image-responsive [[ { \'_hidden\':zoom } ]]" view="ImageLoader" alt="[[ alt || altText || \'\' ]]" data-route="image" data-file="[[ file ]]" data-preset="[[ preset || \'large\' ]]"> <div class="text-style -p -emphasize-gray media-caption [[ { \'_hidden\':zoom } ]]">[[ caption ]]</div> <div view="ImageZoom" data-file="[[ file ]]" data-alt="[[ altText || \' \' ]]" data-style="[[ style ]]" data-caption="[[ caption ]]" class="[[ { \'_hidden\':!zoom } ]]"></div> </div> '
    }))),
    Rs.add("ImageZoom", ( () => new ys)),
    Rs.add("Audio", ( () => new Y({
        template: '<div> <div view="AudioPlayer" data-source="[[ this.setup.route( \'audio\', { file:file, preset:\'original\' } ).url() ]]"></div> <div class="text-style -p -emphasize-gray media-caption">[[ caption ]]</div> </div> '
    }))),
    Rs.add("Video", ( () => new Y({
        template: '<div class="video-styles -[[ style ]]"> <div view="Show" data-if="[[data.summary ]]"> <video autoplay loop style="display:block" width="100%" height="100%" controls="" preload="" src="[[ this.setup.route( \'video\', { file:file, preset:\'original\' } ).url() ]]"></video> </div> <div view="Show" data-if="[[!data.summary ]]"> <video style="display:block" width="100%" height="100%" controls="" preload="" src="[[ this.setup.route( \'video\', { file:file, preset:\'original\' } ).url() ]]"></video> </div> </div> '
    }))),
    Rs.add(Ts, ( () => new Ms)),
    Rs.add(Os, ( () => new Ms)),
    Rs.add(Pt, ( () => new It)),
    Rs.add(Ut, ( () => new $t)),
    Rs.add(At, ( () => new Ct)),
    Rs.add(as, ( () => new is)),
    Rs.add(pt, ( () => new ht)),
    Rs.add(us, ( () => new ps)),
    Rs.add(xs, ( () => new ws)),
    Rs.add(Wt, ( () => new Vt)),
    Rs.add(ms, ( () => new vs)),
    Rs.add(Je, ( () => new Xe)),
    Rs.add(Jt, ( () => new Xt)),
    Rs.add(ss, ( () => new ts)),
    Rs.add("App\\Heading", ( () => new Y({
        template: '<div class="-wide -heading"> <h1 class="text-style -heading -blue -max-read spacer-box -p-v-l" view="Html" data-html="[[ text ]]"></h1> <div class="content-spacer -pull-right"> <div class="border-style -bottom-main"></div> </div> </div> '
    }))),
    Rs.add("App\\Text", ( () => new js)),
    Rs.add("App\\Image", ( () => new Y({
        template: '<div class="-image [[style]]"> <div view="Image" data-file="[[ file ]]" data-alt="[[ altText || \' \' ]]" data-style="[[ style ]]" data-caption="[[ caption ]]" class="[[ { \'_hidden\':zoom } ]]"></div> <div view="ImageZoom" data-file="[[ file ]]" data-alt="[[ altText || \' \' ]]" data-style="[[ style ]]" data-caption="[[ caption ]]" class="[[ { \'_hidden\':!zoom } ]]"></div> </div> '
    }))),
    Rs.add("App\\Video", ( () => new Y({
        template: '<div class="spacer-box -m-between-v-l"> <div view="Video" data-file="[[ file ]]" data-style="[[ style ]]"></div> </div> '
    }))),
    Rs.add("App\\Audio", ( () => new Y({
        template: '<div class="spacer-box -m-between-v-l -audio"> <div view="Audio" data-file="[[ file ]]" data-caption="[[ caption ]]"></div> </div> '
    }))),
    Rs.add("App\\ExpandableText", ( () => new ye)),
    Rs.add("App\\FlashRead", ( () => new Ae)),
    Rs.add("App\\HelpButton", ( () => new Se)),
    Rs.add("multipleImages", ( () => new Y({
        template: '<div> <div view="Repeat" data-items="[[ images ]]" data-as="item" class="flex-layout -wrap -gap-16"> <div view="[[ item.modelName ]]" data="[[ item ]]"></div> </div> </div> '
    }))),
    Rs.add("multipleAudios", ( () => new Y({
        template: '<div> <div view="Repeat" data-items="[[ audios ]]" data-as="item" class="flex-layout -wrap -baseline -gap-16"> <div view="[[ item.modelName ]]" data="[[ item ]]"></div> </div> </div> '
    }))),
    Rs.add("App\\ContentColumns", ( () => new be)),
    Rs.add("PointNavi", ( () => new at)),
    Rs.add("Block", ( () => new Qe)),
    Rs.add("AdminBlock", ( () => new Ke)),
    Rs.add(Object, ( () => new Y({
        template: "Todo: [[ JSON.stringify( data ) ]]"
    })));
    var qs = new class extends a {
    }
    ;
    function Fs(e, t, s) {
        const i = e.get(t);
        e.add(t, (e => s(i(e))))
    }
    qs.add("App\\MultipleChoice", (e => new Ts(e))),
    qs.add("App\\SingleChoice", (e => new Os(e))),
    qs.add("App\\ChoiceAnswer", (e => new ce(e))),
    qs.add("App\\Cloze", (e => new At(e))),
    qs.add("App\\DropDown", (e => new Ut(e))),
    qs.add("App\\DragDrop", (e => new Pt(e))),
    qs.add("App\\Drag", (e => new Lt(e))),
    qs.add("App\\Drop", (e => new Ht(e))),
    qs.add("App\\Order", (e => new as(e))),
    qs.add("App\\OrderItem", (e => new Lt(e))),
    qs.add("App\\Block", (e => new Ye(e))),
    qs.add("App\\WordHyphen", (e => new pt(e))),
    qs.add("App\\TextSelection", (e => new us(e))),
    qs.add("App\\WordPuzzle", (e => new xs(e))),
    qs.add("App\\HotSpot", (e => new ss(e))),
    qs.add("App\\Rectangle", (e => new pe({
        topLeft: {
            x: e.left,
            y: e.top
        },
        bottomRight: {
            x: 1 - (e.left + e.width),
            y: 1 - (e.top + e.height)
        }
    }))),
    qs.add("App\\DragDropCloze", (e => new Wt(e))),
    qs.add("App\\DragDropSentence", (e => new ms(e))),
    qs.add("App\\Freetext", (e => new Je(e))),
    qs.add("App\\GridCloze", (e => new Jt(e))),
    qs.add("App\\FlashRead", (e => new ke(e))),
    qs.add("App\\HelpButton", (e => new Ce(e))),
    qs.add("App\\Text", (e => new Hs(e))),
    qs.add("App\\Columns", (e => new ge(e))),
    qs.add("App\\AttemptEvaluator", (e => new Ze(e)));
    class Bs extends Y {
        constructor() {
            super({
                template: '<div class="-wide page-title"> <div class="flex-layout -row -items-center"> <div class="item -content disdonc-logo spacer-box -p-v -p-right"> <img width="79px" view="ImageLoader" data-route="static" data-path="[[ logo ]]"/> </div> <h1 class="item -w1 text-style -pagetitle -blue spacer-box -p-v-l -p-left">[[ title ]]</h1> </div> </div> '
            })
        }
    }
    class Vs extends R {
        constructor(e) {
            super(Object.assign({
                modelName: "App\\PageTitle"
            }, e)),
            g(this, "identifier", this.block, "currentSlide")
        }
        get identifier() {
            return this.block.id + "-" + this.block.currentSlide.title
        }
        get title() {
            return this.block.name
        }
        get logo() {
            var e, t, s;
            return (null !== (s = null === (t = null === (e = this.block.unit[0]) || void 0 === e ? void 0 : e.resource[0]) || void 0 === t ? void 0 : t.grade) && void 0 !== s ? s : "").indexOf("gymnase2") >= 0 ? "images/dd_gymnase_2.jpg" : "images/dd_gymnase_1.jpg"
        }
    }
    const Ws = Rs
      , Zs = qs;
    function Gs(e) {
        J.logging = !0,
        W(e, Zs),
        function(e) {
            let t = new X(e.root);
            e.registry && (t.context.registry = e.registry),
            e.data && (t.context.data = e.data),
            t.render()
        }({
            root: document.body.querySelector("#app"),
            registry: Ws
        })
    }
    Ws.add("App\\PageTitle", ( () => new Bs)),
    Fs(Ws, "Block", (e => (e.registry.add("SummaryControls", ( () => new Y({
        template: '<div class="flex-layout -row"> <button class="button-style color-box -primary spacer-box -p-v -p-h -m-right-xs" on-click="[[ window.close() ]]">[[ this.trans(\'closeexercise\' ) ]]</button> <button class="button-style color-box -primary spacer-box -p-v -p-h" on-click="[[ location.reload() ]]">[[ this.trans(\'repeatexercise\' ) ]]</button> </div> '
    }))),
    e))),
    Fs(Zs, "App\\Block", (e => {
        const t = new Vs({
            block: e
        });
        for (const s of e.slidesWithoutSummary)
            s.content.unshift(t);
        return e
    }
    )),
    function() {
        let e = document.createElement("div");
        e.classList.add("_hidden"),
        e.innerHTML = '<svg><defs><clipPath id="a"><path d="M0-82.916h7.992v-13.076H0Z" transform="translate(0 95.992)" fill="#fff"/></clipPath><style>.cls-3{fill:none;stroke:#1e1e1c;stroke-miterlimit:10;stroke-linecap:round;stroke-width:8.73px}</style><style>.cls-3{fill:none;stroke:#1e1e1c;stroke-miterlimit:10;stroke-linecap:round;stroke-width:8.73px}</style></defs><symbol id="arrow" viewBox="0 0 75.187 64.422"><path d="M42.994 0 35.06 7.934l18.61 18.444H0v11.707h53.587L35.06 56.446l7.934 7.976 32.193-32.235Z" fill="#fff"/></symbol><symbol id="audio-help" viewBox="0 0 43.464 43.465"><path d="M21.732 43.465a21.732 21.732 0 0 0 21.732-21.732A21.733 21.733 0 0 0 21.732 0 21.733 21.733 0 0 0 0 21.733a21.732 21.732 0 0 0 21.732 21.732" fill="#fff"/><path d="M21.503 14.616a1.323 1.323 0 0 0-2.121-1.059l-4.915 3.724a2.79 2.79 0 0 1-1.594.5h-2.5a1.25 1.25 0 0 0-1.245 1.253v5.495a1.25 1.25 0 0 0 1.246 1.253h2.507a2.012 2.012 0 0 1 1.158.366l5.391 4.091a1.323 1.323 0 0 0 2.117-1.068Z" fill="#1b3c64"/><g transform="translate(25.574 14.467)" clip-path="url(#a)"><path d="M2.838 9.836h1.531V8.825c0-1.083.68-1.584 1.549-2.166a4 4 0 0 0 2.075-3.383c0-1.951-1.476-3.275-3.758-3.275A4.241 4.241 0 0 0 .001 2.972l1.432.519a2.788 2.788 0 0 1 2.775-2.059c1.343 0 2.166.689 2.166 1.844A3.077 3.077 0 0 1 4.7 5.702a3.316 3.316 0 0 0-1.862 2.945Z" fill="#1b3c64"/></g><path d="M28.206 28.048h1.942v-2.031h-1.942Z" fill="#1b3c64"/></symbol><symbol id="audio" viewBox="0 0 43.464 43.465"><path d="M21.732 43.465a21.732 21.732 0 0 0 21.732-21.732A21.733 21.733 0 0 0 21.732 0 21.733 21.733 0 0 0 0 21.733a21.732 21.732 0 0 0 21.732 21.732" fill="#fff"/><path d="M21.503 14.616a1.323 1.323 0 0 0-2.121-1.059l-4.915 3.724a2.79 2.79 0 0 1-1.594.5h-2.5a1.25 1.25 0 0 0-1.245 1.253v5.495a1.25 1.25 0 0 0 1.246 1.253h2.507a2.012 2.012 0 0 1 1.158.366l5.391 4.091a1.323 1.323 0 0 0 2.117-1.068Z" fill="#1b3c64"/></symbol><symbol id="check-disabled" viewBox="0 0 42 42"><g fill="#fff" opacity=".198"><path d="M21 40.75a19.686 19.686 0 0 1-13.965-5.785A19.686 19.686 0 0 1 1.25 21 19.686 19.686 0 0 1 7.035 7.035 19.686 19.686 0 0 1 21 1.25a19.686 19.686 0 0 1 13.965 5.785A19.686 19.686 0 0 1 40.75 21a19.686 19.686 0 0 1-5.785 13.965A19.686 19.686 0 0 1 21 40.75Z"/><path d="M21 2.5A18.379 18.379 0 0 0 7.919 7.919 18.379 18.379 0 0 0 2.5 21c0 4.942 1.924 9.587 5.419 13.081A18.379 18.379 0 0 0 21 39.5c4.942 0 9.587-1.924 13.081-5.419A18.379 18.379 0 0 0 39.5 21c0-4.942-1.924-9.587-5.419-13.081A18.379 18.379 0 0 0 21 2.5M21 0c11.598 0 21 9.402 21 21s-9.402 21-21 21S0 32.598 0 21 9.402 0 21 0Z"/></g><path d="M30.92 12.639 17.504 27.114l-5.407-5.885-2.1 1.971 7.4 8.184 15.589-16.7Z" fill="#fff"/></symbol><symbol id="check" viewBox="0 0 42 42"><g fill="#fff"><path d="M21 40.75a19.686 19.686 0 0 1-13.965-5.785A19.686 19.686 0 0 1 1.25 21 19.686 19.686 0 0 1 7.035 7.035 19.686 19.686 0 0 1 21 1.25a19.686 19.686 0 0 1 13.965 5.785A19.686 19.686 0 0 1 40.75 21a19.686 19.686 0 0 1-5.785 13.965A19.686 19.686 0 0 1 21 40.75Z"/><path d="M21 2.5A18.379 18.379 0 0 0 7.919 7.919 18.379 18.379 0 0 0 2.5 21c0 4.942 1.924 9.587 5.419 13.081A18.379 18.379 0 0 0 21 39.5c4.942 0 9.587-1.924 13.081-5.419A18.379 18.379 0 0 0 39.5 21c0-4.942-1.924-9.587-5.419-13.081A18.379 18.379 0 0 0 21 2.5M21 0c11.598 0 21 9.402 21 21s-9.402 21-21 21S0 32.598 0 21 9.402 0 21 0Z"/></g><path d="M30.92 12.639 17.504 27.114l-5.407-5.885-2.1 1.971 7.4 8.184 15.589-16.7Z" fill="#1b3c64"/></symbol><symbol id="close-black" viewBox="0 0 29 29"><g stroke="#000" stroke-width="2.5" fill="none" fill-rule="evenodd"><path d="m1 1.168 26.896 26.896M1 28.064 27.895 1.168"/></g></symbol><symbol id="close" viewBox="0 0 29 29"><g stroke="#FFF" stroke-width="2.5" fill="none" fill-rule="evenodd"><path d="m1 1.168 26.896 26.896M1 28.064 27.895 1.168"/></g></symbol><symbol id="comment" viewBox="0 0 125 101"><path d="M26 13h73a8 8 0 0 1 8 8v44.279a8 8 0 0 1-8 8H87.682V87L72.356 73.279H26a8 8 0 0 1-8-8V21a8 8 0 0 1 8-8Z" fill="#1B3C64" fill-rule="evenodd"/></symbol><symbol id="feedback_failed" viewBox="0 0 247.03 247.03"><path d="M297.57 303.22a117.7 117.7 0 1 1-117.7 117.7 117.71 117.71 0 0 1 117.7-117.7" transform="translate(-174.05 -297.4)" style="fill:#ea7b76"/><circle cx="297.57" cy="420.92" r="117.7" transform="rotate(-45 -148.46 482.314)" style="stroke-width:11.64px;fill:none;stroke:#1e1e1c;stroke-miterlimit:10"/><path class="cls-3" d="M268 387.62a19.34 19.34 0 0 1-38.65 0M365.77 387.62a19.33 19.33 0 0 1-38.64 0" transform="translate(-174.05 -297.4)"/><path d="M269.82 478.9a27.75 27.75 0 1 1 55.47-1.58v1.58" transform="translate(-174.05 -297.4)" style="stroke-width:8.75px;stroke-linecap:round;fill:none;stroke:#1e1e1c;stroke-miterlimit:10"/></symbol><symbol id="feedback_good" viewBox="0 0 247.03 247.03"><path d="M275.8 303.22a117.7 117.7 0 1 1-117.7 117.7 117.7 117.7 0 0 1 117.7-117.7" transform="translate(-152.28 -297.4)" style="fill:#c3dfc5"/><circle cx="123.52" cy="123.52" r="117.7" style="stroke-width:11.64px;fill:none;stroke:#1e1e1c;stroke-miterlimit:10"/><path class="cls-3" d="M207.73 403.76a19.33 19.33 0 0 1 38.64 0M305.51 403.76a19.34 19.34 0 0 1 38.65 0" transform="translate(-152.28 -297.4)"/><path d="M303.54 447.9a27.75 27.75 0 1 1-55.47 1.58v-1.58" transform="translate(-152.28 -297.4)" style="stroke-width:8.75px;stroke-linecap:round;fill:none;stroke:#1e1e1c;stroke-miterlimit:10"/></symbol><symbol id="mc-off" viewBox="0 0 42 42"><rect width="42" height="42" rx="4" fill="#e5e5e5"/></symbol><symbol id="mc-on" viewBox="0 0 42 42"><rect width="42" height="42" rx="4"/><path d="M31.436 9.726 16.407 27.642l-6.058-7.284L8 22.797l8.294 10.129 17.465-20.667Z" fill="#fff"/></symbol><symbol id="next" viewBox="0 0 42 42"><g fill="#fff"><path d="M21 40.75a19.686 19.686 0 0 1-13.965-5.785A19.686 19.686 0 0 1 1.25 21 19.686 19.686 0 0 1 7.035 7.035 19.686 19.686 0 0 1 21 1.25a19.686 19.686 0 0 1 13.965 5.785A19.686 19.686 0 0 1 40.75 21a19.686 19.686 0 0 1-5.785 13.965A19.686 19.686 0 0 1 21 40.75Z"/><path d="M21 2.5A18.379 18.379 0 0 0 7.919 7.919 18.379 18.379 0 0 0 2.5 21c0 4.942 1.924 9.587 5.419 13.081A18.379 18.379 0 0 0 21 39.5c4.942 0 9.587-1.924 13.081-5.419A18.379 18.379 0 0 0 39.5 21c0-4.942-1.924-9.587-5.419-13.081A18.379 18.379 0 0 0 21 2.5M21 0c11.598 0 21 9.402 21 21s-9.402 21-21 21S0 32.598 0 21 9.402 0 21 0Z"/></g><path d="m23.025 11.138-2.344 2.346 5.502 5.454H10.315v3.461h15.844l-5.478 5.428 2.344 2.358 9.519-9.531Z" fill="#1b3c64"/></symbol><symbol id="pause" viewBox="0 0 29.657 29.657"><path d="M14.832 29.657a14.829 14.829 0 0 0 14.825-14.828A14.829 14.829 0 0 0 14.832 0 14.829 14.829 0 0 0 0 14.829a14.829 14.829 0 0 0 14.832 14.828" fill="#1b3c64"/><g fill="#fff"><path d="M9.328 21.828v-15h4v15zM16.328 21.828v-15h4v15z"/></g></symbol><symbol id="play" viewBox="0 0 29.657 29.657"><path d="M14.832 29.657a14.829 14.829 0 0 0 14.825-14.828A14.829 14.829 0 0 0 14.832 0 14.829 14.829 0 0 0 0 14.829a14.829 14.829 0 0 0 14.832 14.828" fill="#1b3c64"/><path d="M10.439 22.39s0 .756.615.316l10.927-7.837a.5.5 0 0 0 0-.88L11.053 6.154s-.614-.443-.614.313z" fill="#fff"/></symbol><symbol id="sc-off" viewBox="0 0 42 42"><circle cx="21" cy="21" r="21" fill="#e5e5e5"/></symbol><symbol id="sc-on" viewBox="0 0 42 42"><g transform="translate(-122 -385)"><circle cx="21" cy="21" r="21" transform="translate(122 385)" fill="#e5e5e5"/><circle cx="11" cy="11" r="11" transform="translate(132 395)"/></g></symbol><symbol id="zoom-out" viewBox="-15132 -9320 147 147"><path d="M-15062.434-9315.058c37.685 0 68.235 30.55 68.235 68.235 0 37.684-30.55 68.234-68.235 68.234-37.684 0-68.234-30.55-68.234-68.234 0-37.685 30.55-68.235 68.234-68.235Z" fill="#1b3c64" fill-rule="evenodd"/><path d="M-15062.434-9313.808c36.995 0 66.985 29.99 66.985 66.985 0 36.994-29.99 66.984-66.985 66.984-36.994 0-66.984-29.99-66.984-66.984 0-36.995 29.99-66.985 66.984-66.985Z" stroke-linejoin="round" stroke-linecap="round" stroke-width="2.454" stroke="#fff" fill="transparent"/><path d="M-15132-9320h147v147h-147v-147z" fill="#1b3c64" fill-rule="evenodd"/><path d="m-15063.73-9252.006-36.31.005-.071 10.587h36.447l10.592.066 36.77-.072-.065-10.592-36.765.066-10.598-.06Z" fill="#fff" fill-rule="evenodd"/></symbol><symbol id="zoom" viewBox="1406 3298 147 147"><path d="M1475.566 3302.942c37.685 0 68.235 30.55 68.235 68.235 0 37.684-30.55 68.234-68.235 68.234-37.684 0-68.234-30.55-68.234-68.234 0-37.685 30.55-68.235 68.234-68.235Z" fill="#1b3c64" fill-rule="evenodd"/><path d="M1475.566 3304.192c36.995 0 66.985 29.99 66.985 66.985 0 36.994-29.99 66.984-66.985 66.984-36.994 0-66.984-29.99-66.984-66.984 0-36.995 29.99-66.985 66.984-66.985Z" stroke-linejoin="round" stroke-linecap="round" stroke-width="2.454" stroke="#fff" fill="transparent"/><path d="M1406 3298h147v147h-147v-147z" fill="#1b3c64" fill-rule="evenodd"/><path d="m1474.144 3329.815.126 36.179-36.31.005-.071 10.587h36.447l.126 36.573 10.597.06-.131-36.567 36.77-.072-.065-10.592-36.765.066-.203-36.245-10.521.006Z" fill="#fff" fill-rule="evenodd"/></symbol></svg>',
        document.body.appendChild(e)
    }(),
    main = i
}
)();
