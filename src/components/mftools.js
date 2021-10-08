/**
 * Created by usb on 16/10/15.
 * Versão 1.00
 */
function MFt() {

}

MFt.smartphoneDetect = function(){
    var tipos = ['Android', 'webOS', 'iPad', 'iPod', 'iPhone', 'BlackBerry'];
    var nav = navigator.userAgent;
    for(var i = 0, max = tipos.length; i < max; i++) {
        if (nav.indexOf(tipos[i]) >= 0) return tipos[i];
    }
    return false;
};

MFt.isIpad = function(){
    const ua = window.navigator.userAgent;
    if (ua.indexOf('iPad') > -1) {
        return true;
    }
    if (ua.indexOf('Macintosh') > -1 && navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
        try {
            document.createEvent("TouchEvent");
            return true;
        } catch (e) {}
    }
    return false;
};

MFt.server = function(){
    return document.location.protocol + '//' + document.domain.split('/')[0];
};

MFt.atribs = function (elem, props) {
    /**
     * Acerta os atributos de um elemento ou de uma array de elementos de modo recursivo
     * PROBLEMA: por alguma razão, zIndex não funciona aqui
     */
    var subfunc = function(objeto, value) {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                switch(Object.prototype.toString.call(value[key])) {
                    case '[object String]':
                        objeto[key] = value[key];
                        break;
                    case '[object Number]':
                        objeto[key] = value[key];
                        break;
                    case '[object Object]':
                        subfunc(objeto[key], value[key]);
                        break;
                }
            }
        }
    };
    var doit = function(ee){
        var elemento;
        if (typeof ee == 'string') elemento = document.getElementById(ee);
        else elemento = ee;
        if (elemento) subfunc(elemento, props);
    };
    if (Object.prototype.toString.call(elem) === '[object Array]') {
        for(var i = 0, max = elem.length; i < max; i++){
            doit(elem[i]);
        }
    }
    else doit(elem);
};

MFt.sort = function(matriz, funcao){
    var tmp;
    if (Object.prototype.toString.call(matriz) != '[object Array]') throw('Elemento passado não é Array');
    if (typeof funcao != 'function') throw('Segundo elemento passado não é função');
    for(var i = 0, max = matriz.length; i < max - 1; i++) {
        for(var j = i + 1; j < max; j++) {
            if (funcao(matriz[i], matriz[j])) {
                tmp = matriz[i];
                matriz[i] = matriz[j];
                matriz[j] = tmp;
            }
        }
    }
    return matriz;
};


/**
 * Cria um elemento do tipo especificado em tipo, com as propriedades definidas em props, apenso ao elemento app e com os atributos atribs
 * @param tipo
 * @param props
 * @param app
 * @param atribs
 * @returns {Element}
 */
MFt.criaElem = function(tipo, props, app, atribs) {
    var ns = [ // tipos de elementos gráficos
        'svg', 'ellipse', 'image', 'line', 'path', 'polygon', 'polyline', 'rect', 'use', 'rect', 'altGlyph', 'arc',
        'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform',
        'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite',
        'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG',
        'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
        'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri',
        'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath',
        'pattern', 'radialGradient', 'script', 'set', 'stop', 'style', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref', 'tspan',
        'use', 'view', 'vkern'
    ];
    var elemento = MFt.inArray(tipo, ns) ? document.createElementNS('http://www.w3.org/2000/svg', tipo) : document.createElement(tipo);
    if (app && app.appendChild) app.appendChild(elemento);
    var subfunc = function(objeto, value) {
        if (Object.prototype.toString.call(value) !== "[object Object]") return;
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                switch(Object.prototype.toString.call(value[key])) {
                    case '[object String]':
                        objeto[key] = value[key];
                        break;
                    case '[object Object]':
                        subfunc(objeto[key], value[key]);
                        break;
                }
            }
        }
    };
    if (elemento) subfunc(elemento, props, true);
    if (atribs && Object.prototype.toString.call(atribs) === "[object Object]") {
        for(var key in atribs) {
            if (atribs.hasOwnProperty(key)) {
                if (Object.prototype.toString.call(atribs[key]) !== '[object Object]') elemento.setAttribute(key, atribs[key].toString());
            }
        }
    }
    return elemento;
};

/**
 * Muda um estilo de forma global
 * Exemplo:
 * changeStyle('blockquote', {
                paddingLeft:"15mm",
                marginLeft:'0'
            });
 * changeStyle('p.numerado::before', {
                width : '15mm'
            });
 * Os nomes são aqueles definidos em <style>, com a exceção de que ':' é tratado com '::', como mostra acima.
 * Qualquer dúvida, habilite a linha que contém "console.log(styles);", para visualizar os nomes dos estilos
 * @param style
 * @param cssRules
 */
MFt.changeStyle = function(style, cssRules) {
    // IMPORTANTE! LEMBRE-SE DE UTILIZAR O PONTO: '.nome_da_classe'
    // Procura a propriedade html em styleSheets
    var subfunc = function(cssStyle, cssRule) {
        if (Object.prototype.toString.call(cssRule) !== "[object Object]") return;
        for (let key in cssRule) {
            if (cssRule.hasOwnProperty(key)) {
                switch(Object.prototype.toString.call(cssRule[key])) {
                    case '[object Object]':
                        subfunc(cssStyle, cssRule[key]);
                        break;
                    default:
                        cssStyle[key] = cssRule[key];
                }
            }
        }
    };
    var cssRuleCode = document.all ? 'rules' : 'cssRules'; // Firefox usa CssRules  
    var styles = document.styleSheets[0][cssRuleCode];
    //console.log(styles);
    var estilo;
    for (let i in styles) {
        if (Object.prototype.toString.call(styles[i]) === '[object CSSStyleRule]') {
            if (styles[i].selectorText === style) {
                estilo = styles[i].style;
                break;
            }
        }
    }
    if (estilo && cssRules && Object.prototype.toString.call(cssRules) === "[object Object]") {
        subfunc(estilo, cssRules);
    }
};


MFt.criaSelect = function(options, props, app) {
    /* Cria um elemento SELECT e as OPTIONS e atribui todas as propriedades a ele */
    var inn = 'innerHTML'; // para evitar avisos nas extensoes do fire fox
    var elemento = document.createElement('SELECT');
    for(var i = 0; i < options.length; i++) {
        var o = document.createElement('option');
        o[inn] = options[i];
        elemento.appendChild(o);
    }
    var subfunc = function(objeto, value) {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                switch(Object.prototype.toString.call(value[key])) {
                    case '[object String]':
                        objeto[key] = value[key];
                        break;
                    case '[object Object]':
                        subfunc(objeto[key], value[key]);
                        break;
                }
            }
        }
    };
    if (elemento && props) subfunc(elemento, props);
    if (app && app.appendChild) app.appendChild(elemento);
    return elemento;
};

MFt.centerPage = function(elem) {
    if (!elem) return {x : 0, y : 0};
    var w = window.innerWidth;
    var h = window.innerHeight;
    var size = {width : parseInt(getComputedStyle(elem).width), height : parseInt(getComputedStyle(elem).height)};
    var middleW = (w / 2) - (size.width / 2);
    var middleH = (h / 2) - (size.height / 2);
    middleH = (middleH - (middleH * 0.1) >= 0) ? middleH - (middleH * 0.1) : 0;
    var ret = {x : middleW, y : middleH};
    return ret;
};

MFt.center = function(elem, dad) {
    if (!elem || !dad) return {x : 0, y : 0};
    var w = parseInt(getComputedStyle(dad).width);
    var h = parseInt(getComputedStyle(dad).height);
    var size = {width : 0, height : 0};
    if (getComputedStyle(elem).width.toString() != 'auto') size.width = parseInt(getComputedStyle(elem).width);
    if (getComputedStyle(elem).height.toString() == 'auto') size.height = parseInt(getComputedStyle(elem).fontSize);
    else size.height = parseInt(getComputedStyle(elem).height);
    var middleW = (w / 2) - (size.width / 2);
    var middleH = (h / 2) - (size.height / 2);
    middleH = (middleH - (middleH * 0.1) >= 0) ? middleH - (middleH * 0.1) : 0;
    var ret = {x : middleW, y : middleH};
    return ret;
};

MFt.bottomRight = function(elem, dad) {
    // Put the element in the bottom right corner of a wrapper element
    if (!elem || !dad) return {x : 0, y : 0};
    var w = parseInt(getComputedStyle(dad).width);
    var h = parseInt(getComputedStyle(dad).height);
    var size = {width : 0, height : 0};
    if (getComputedStyle(elem).width.toString() != 'auto') size.width = MFt.totalWidth(elem);
    if (getComputedStyle(elem).height.toString() == 'auto') size.height = parseInt(getComputedStyle(elem).fontSize);
    else size.height = MFt.totalHeight(elem);
    var right = w - size.width;
    var bottom = h - MFt.totalHeight(elem);
    var ret = {x : right, y : bottom};
    return ret;
};

MFt.animeOpacity = function(elem, tempo, delay) {
    var startTime = Date.now();
    var anime = function() {
        var dif = Date.now() - startTime;
        if (dif < delay) requestAnimationFrame(anime);
        else {
            var percent = parseFloat(dif - delay) / parseFloat(tempo);
            MFt.atribs(elem, {
                style : {
                    opacity : (percent > 1.0 ? 1.0 : percent.toFixed(2).toString())
                }
            });
            if (percent < 1.0) requestAnimationFrame(anime);
            else {
                MFt.atribs(elem, {
                    style : {
                        opacity : '1.0'
                    }
                });
            }
        }
    };
    requestAnimationFrame(anime);
};

MFt.animeFadeLeft = function(elem, tempo, delay, posInicial, posFinal) {
    var startTime = Date.now();
    var anime = function() {
        var dif = Date.now() - startTime;
        if (dif < delay) requestAnimationFrame(anime);
        else {
            var percent = parseFloat(dif - delay) / parseFloat(tempo);
            var pos = (posInicial - (parseFloat(posInicial - posFinal) * percent)).toFixed(2);
            MFt.atribs(elem, {
                style : {
                    left : (pos < posFinal ? posFinal : pos).toString() + 'px',
                    opacity : (percent > 1.0 ? 1.0 : percent.toFixed(2).toString()),
                    position : 'relative'
                }
            });
            if (percent < 1.0) requestAnimationFrame(anime);
            else {
                MFt.atribs(elem, {
                    style : {
                        opacity : '1.0'
                    }
                });
            }
        }
    };
    requestAnimationFrame(anime);
};

MFt.clear = function(elem) {
    if (elem == undefined) elem = document.body;
    else if (typeof elem == 'string') elem = document.getElementById(elem);
    while (elem.firstChild) elem.removeChild(elem.firstChild);
};


MFt.expandeVertical = function(elem, tempo, delay, expande, profundidade) {
    var deepElems = []; // Armazena os elementos que também precisam ser expandidos
    if (profundidade === undefined) profundidade = 2;
    var deep = function(e){ // Identifica os elementos que também precisam ser expandidos.
        deepElems.push(e);
        profundidade--;
        if(profundidade > 0 && e.parentNode) deep(e.parentNode);
    };
    deep(elem);
    if (expande === undefined) {
        expande = true;
    }
    for(var i = 0, max = deepElems.length; i < max ; i++) {
        elem.hidden = false;
        elem.style.overflow = 'hidden';
        deepElems[i].style.transition = (tempo / 1000).toFixed(2).toString() + 's linear height';
        if (i === 0) {
            if (expande) {
                if (parseFloat(deepElems[i].style.height) < deepElems[i].scrollHeight) deepElems[i].style.height = deepElems[i].scrollHeight + 'px';
            }
            else {
                elem.style.height = '0px';
            }
        }
        else deepElems[i].style.height = 'auto';

    }
};


MFt.expandeVertical_OLD = function(elem, tempo, delay, expande, profundidade) {
    // POR FAVOR NÃO USE BORDAS. NÃO RESOLVI UM PEQUENO BUG. COM BORNAS FUNCIONA, MAS NÃO 100% PERFEITO
    var startTime = Date.now(), offsetHeightPadrao;
    if (!profundidade) profundidade = 0; // Serve para identificar quantos elementos pais (parentNodes) precisam ser expandidos também.
    if (expande === undefined) expande = true;
    if (expande && elem.offsetHeight >= parseInt(elem.scrollHeight)) {
        return;
    }
    // Ao menos no Chrome as bordas acabam interferindo no tamanho do elemento
    // POR FAVOR NÃO USE BORDAS. NÃO RESOLVI UM PEQUENO BUG. COM BORNAS FUNCIONA, MAS NÃO 100% PERFEITO
    offsetHeightPadrao = elem.style.borderTopWidth ? parseFloat(elem.style.borderTopWidth) : 0;
    offsetHeightPadrao += elem.style.borderBottomWidth ? parseFloat(elem.style.borderBottomWidth) : 0;
    if (!expande && elem.offsetHeight <= offsetHeightPadrao) {
        // Não precisa recolher porque já está recolhido
        return;
    }
    var fator = expande ? 0.0 : 1.0;
    var deepElems = []; // Armazena os elementos que também precisam ser expandidos
    elem.style.overflow = 'hidden';
    var deep = function(e){ // Identifica os elementos que também precisam ser expandidos.
        deepElems.push(e);
        profundidade--;
        if(profundidade > 0) deep(e.parentNode);
    };
    if(profundidade > 0) deep(elem.parentNode);
    var anime = function() {
        var dif = Date.now() - startTime;
        if (dif < delay) requestAnimationFrame(anime);
        else {
            var height, opacity;
            var percent = parseFloat(dif - delay) / parseFloat(tempo);
            percent = percent > 1 ? 1 : percent;
            if (expande) {
                height = (parseFloat(elem.scrollHeight) * percent).toFixed(1);
                opacity = percent;
                //elem.hidden = !expande;
                elem.hidden = false;
            }
            else {
                height = parseFloat(elem.scrollHeight) * (fator - percent);
                opacity = fator - percent;
            }
            if (height < offsetHeightPadrao) height = offsetHeightPadrao;
            else if(height>elem.scrollHeight)height=elem.scrollHeight;
            MFt.atribs(elem, {
                style : {
                    height : height + 'px',
                    opacity : (opacity > 1.0 ? 1.0 : opacity.toFixed(2).toString())
                }
            });
            for(var i = 0, max = deepElems.length; i < max ; i++) {
                if (parseFloat(deepElems[i].style.height) < deepElems[i].scrollHeight) deepElems[i].style.height = deepElems[i].scrollHeight + 'px';
            }
            if (percent < 1.0) requestAnimationFrame(anime);
            else {
                MFt.atribs(elem, {
                    style : {
                        //height : elem.scrollHeight + 'px',
                        //height : 'auto',
                        height : expande ? 'auto' : 0,
                        overflow : 'hidden',
                        opacity : '1.0'
                    }
                });
                //elem.hidden = !expande;
            }
        }
    };
    requestAnimationFrame(anime);
};

MFt.magnifyShadow = function(elem, tempo, delay, posInicial, posFinal) {
    // Não concluído -----------------------------------------
    var startTime = Date.now();
    var anime = function() {
        var dif = Date.now() - startTime;
        if (dif < delay) requestAnimationFrame(anime);
        else {
            var percent = parseFloat(dif - delay) / parseFloat(tempo);
            var pos = (posInicial + (parseFloat(posFinal - posInicial) * percent)).toFixed(3);
            var tmp = "scale(" + (pos > posFinal ? posFinal : pos).toString() + ")";
            //console.log(pos);
            //elem.style.transform = tmp;
            MFt.atribs(elem, {
                style : {
                    transform : tmp
                }
            });
            if (percent < 1.0) requestAnimationFrame(anime);
            else {
                MFt.atribs(elem, {
                    style : {
                        scale : tmp
                    }
                });
            }
        }
    };
    requestAnimationFrame(anime);
};

MFt.inArray = function(e, ar) {
    for (var i = 0; i < ar.length; i++) {
        if (e == ar[i]) return true;
    }
    return false;
};

MFt.totalHeight = function(elem) {
    // Retorna a altura total de um elemento (inner, padding, margins, borders)
    if (!elem) return 0;
    var cs = getComputedStyle(elem);
    var th = 0;
    var itens = [cs.height, cs.marginTop, cs.marginBottom, cs.paddingTop, cs.paddingBottom, cs.borderTopWidth, cs.borderBottomWidth];
    for(var i = 0; i < itens.length; i++) th += parseInt(itens[i]);
    return th;
};

MFt.totalWidth = function(elem) {
    // Retorna a largura total de um elemento
    if (!elem) return 0;
    var cs = getComputedStyle(elem);
    var tw = 0;
    var itens = [cs.width, cs.marginLeft, cs.marginRight, cs.paddingLeft, cs.paddingRight, cs.borderLeftWidth, cs.borderRightWidth];
    for(var i = 0; i < itens.length; i++) tw += parseInt(itens[i]);
    return tw;
};

MFt.urlArgs = function(url) {
    // Retorna os argumentos inseridos na url
    var args = {}; // Start with an empty object
    var query = location.search.substring(1); // Get query string, minus '?'
    var regx = [
        /^https*[:\/a-zA-Z0-9\.\-]+\?([\w\W]*)/gi,
        /^chrome\-extension[:\/a-zA-Z0-9\.\-]+\?([\w\W]*)/gi,
        /^moz\-extension[:\/a-zA-Z0-9\.\-]+\?([\w\W]*)/gi
    ]
    if (url) {
        let res;
        for(let i = 0, maxi = regx.length; i < maxi; i++) {
            res = regx[i].exec(url);
            if (res) {
                query = res[1];
                break;
            }
        }
        if (!res) throw new Error("URL invalida!");
    }
    var pairs = query.split("&"); // Split at ampersands
    for(var i = 0; i < pairs.length; i++) { // For each fragment
        var pos = pairs[i].indexOf('='); // Look for "name=value"
        if (pos === -1) continue; // If not found, skip it
        var name = pairs[i].substring(0,pos); // Extract the name
        var value = pairs[i].substring(pos+1); // Extract the value
        value = decodeURIComponent(value); // Decode the value
        args[name] = value; // Store as a property
    }
    return args; // Return the parsed arguments
};

MFt.appendElems = function(wrapper, newElems) {
    // Append new elemens within another in given sequence
    // The new elemens come from an array
    if (Object.prototype.toString.call(newElems) == '[object Array]') {
        for(var i = 0; i < newElems.length; i++) {
            wrapper.appendChild(newElems[i]);
        }
    }
    else {
        wrapper.appendChild(newElems);
    }
};

MFt.tamanhoTotal = function(elem) {
    /**
     * Calcula o tamanho total de um elemento
     * Para isso soma as bordas, margens e paddings
     */
    var height = 0;
    var width = 0;
    var fatorH = [
        'marginTop',
        'marginBottom',
        'paddingTop',
        'paddingBottom',
        'borderBottomWidth',
        'borderTopWidth',
        'height'
    ];
    var fatorW = [
        'marginLeft',
        'marginRight',
        'paddingLeft',
        'paddingRight',
        'borderLeftWidth',
        'borderRightWidth',
        'width'
    ];
    for(var e = 0, max = fatorH.length; e < max; e++) height += parseInt(getComputedStyle(elem)[fatorH[e]]);
    for(e = 0, max = fatorW.length; e < max; e++) width += parseInt(getComputedStyle(elem)[fatorW[e]]);
    return {width : width, height : height};
};

MFt.zeraTudo = function(elem) {
    // Zera margens, paddings etc.
    var margin = [
        'marginTop',
        'marginBottom',
        'marginLeft',
        'marginRight'
    ];
    var padding = [
        'paddingTop',
        'paddingBottom',
        'paddingLeft',
        'paddingRight'
    ];
    var border = [
        'borderBottom',
        'borderTop',
        'borderLeft',
        'borderRight'
    ];
    var borderW = [
        'borderWidthBottom',
        'borderWidthTop',
        'borderWidthLeft',
        'borderWidthRight'
    ];
    for (var i = 0; i < margin.length; i++) elem.style[margin[i]] = '0px';
    for (i = 0; i < padding.length; i++) elem.style[padding[i]] = '0px';
    for (i = 0; i < border.length; i++) elem.style[border[i]] = '0px';
    for (i = 0; i < borderW.length; i++) elem.style[borderW[i]] = '0px';
};

MFt.rotate = function(elem, degrees, originX, originY) {
    var origin = originX != undefined && originY != undefined;
    if(navigator.userAgent.match("Chrome")){
        elem.style.WebkitTransform = "rotate("+degrees+"deg)";
        if (origin) {
            elem.style.WebkitTransformOrigin = originX + 'px ' + originY + 'px';
        }
    } else if(navigator.userAgent.match("Firefox")){
        elem.style.MozTransform = "rotate("+degrees+"deg)";
        if (origin) {
            elem.style.MozTransformOrigin = originX + 'px ' + originY + 'px';
        }
    } else if(navigator.userAgent.match("MSIE")){
        elem.style.msTransform = "rotate("+degrees+"deg)";
        if (origin) {
            elem.style.msTransformOrigin = originX + 'px ' + originY + 'px';
        }
    } else if(navigator.userAgent.match("Opera")){
        elem.style.Transform = "rotate("+degrees+"deg)";
        if (origin) {
            elem.style.TransformOrigin = originX + 'px ' + originY + 'px';
        }
    } else {
        elem.style.transform = "rotate("+degrees+"deg)";
        if (origin) {
            elem.style.transformOrigin = originX + 'px ' + originY + 'px';
        }
    }
};

MFt.criaFieldset = function(nome, props, app, op) {
    var fs = MFt.criaElem('fieldset',props);
    var lg = MFt.criaElem('legend', {innerHTML : nome});
    fs.appendChild(lg);
    if (app && app.appendChild) app.appendChild(fs);
    if (op) {
        if (op.style) MFt.atribs(lg, {style:op.style});
        else {
            if (op.legendFontSize) lg.style.fontSize = op.legendFontSize;
            if (op.legendFontFamily) lg.style.fontSize = op.legendFontFamily;
        }
    }
    return fs;
};

MFt.fillParent = function(elem, tipo) {
    /**
     * Preenche por completo o espaço interno do elemento pai.
     * Leva-se em consideração o tamanho das bordas, margens e paddings para definir o width e height do elemento
     * @param {HTML Element}
     * @param {String} null, V ou H, se for H faz a preenchimento na horizontal, V, na vertical.
     */
    if (!elem.parentNode) return;
    var csParent = getComputedStyle(elem.parentNode);
    var pai = {width : parseFloat(csParent.width), height : parseFloat(csParent.height)};
    var tmp;
    var largura = [
        'marginLeft',
        'paddingLeft',
        'borderLeftWidth',
        'marginRight',
        'paddingRight',
        'borderRightWidth'
    ];
    var altura = [
        'marginTop',
        'paddingTop',
        'borderTopWidth',
        'marginBottom',
        'paddingBottom',
        'borderBottomWidth'
    ];
    var width = pai.width;
    var height = pai.height;
    var cs = getComputedStyle(elem);
    for(var i = 0, max = largura.length; i < max; i++) {
        tmp = cs[largura[i]];
        if (tmp) width -= parseFloat(tmp);
    }
    for(i = 0, max = altura.length; i < max; i++) {
        //console.log(height);
        tmp = cs[altura[i]];
        if (tmp) height -= parseFloat(tmp);
    }
    if (tipo == undefined || tipo.toLowerCase() == 'h') elem.style.width = width + 'px';
    if (tipo == undefined || tipo.toLowerCase() == 'v') elem.style.height = height + 'px';
};

MFt.allNodes = function(elem, tagName) {
    /*
    Percorre toda a árvore de elementos de dentro de um elemento e retorna
    ...todos os elementos do tipo especificado em tagName.
    Se tagName é null ou undefined retorna todos os elementos filhos, netos etc.
     */
    var todos = [];
    function getNodes(e) {
        if (!e || !e.tagName) return;
        if (!tagName || e.tagName.toLocaleLowerCase() == tagName.toLowerCase()) todos.push(e);
        var nodes = e.childNodes;
        for (var i = 0, max = nodes.length; i < max; i++) getNodes(nodes[i]);
    }
    getNodes(elem);
    return todos;
};

MFt.incluiOptions = function(elem, options) {
    /**
     * Cria diversos elementos option a partir dos nomes dados da array options
     * e os insere no elemento select dado em elem
     */
    for(var i = 0, max = options.length; i < max; i++) {
        var tmp = MFt.criaElem('option', {innerHTML : options[i]});
        elem.appendChild(tmp);
    }
};

MFt.calcSizeText = function(txt, fontFamily, fontSize, fontWeight) {
    /**
     * Calcula o tamanho que um texto terá na tela.
     * @param {string} texto que será calculado
     * @param {string} com o nome da fonte
     * @param {number} tamanho da fonte sem 'px'
     * @returns {Array} width e height
     */
    var p = MFt.criaElem('p', {
        style : {
            position : 'fixed',
            top : '-100px',
            left : '-100px'
        }
    });
    if (fontFamily) p.style.fontFamily = fontFamily;
    if (fontSize) p.style.fontSize = fontSize + 'px';
    if (fontWeight) p.style.fontWeight = fontWeight;
    p.style.zIndex = -120;
    var s = MFt.criaElem('span', {innerHTML : txt});
    if (fontFamily) s.style.fontFamily = fontFamily;
    if (fontSize) s.style.fontSize = fontSize + 'px';
    if (fontWeight) s.style.fontWeight = fontWeight;
    p.appendChild(s);
    document.body.appendChild(p);
    var valores = s.getBoundingClientRect();
    p.parentNode.removeChild(p);
    p = null;
    s = null;
    return {width : Math.floor(valores.width) + 1, height : Math.floor(valores.height) + 1};
};

MFt.maximize = function() {
    window.innerWidth = screen.width;
    window.innerHeight = screen.height;
    window.screenX = 0;
    window.screenY = 0;
    alwaysLowered = false;
};

MFt.copyAtr = function(obj1) {
    /**
     * Retorna a cópía de um objeto como uma variável nova
     * @param {Object} Objeto a ser copiado
     * @returns {Object} Retorna uma cópia do objeto, sem as propriedades de prototype
     */
    var obj2 = {};
    var subfunc = function(novo, velho) {
        if (Object.prototype.toString.call(velho) != "[object Object]") return;
        for (var key in velho) {
            if (velho.hasOwnProperty(key)) {
                switch(Object.prototype.toString.call(velho[key])) {
                    case '[object String]':
                        novo[key] = velho[key];
                        break;
                    case '[object Object]':
                        subfunc(novo[key], velho[key]);
                        break;
                }
            }
        }
    };
    if (obj1) subfunc(obj2, obj1);
    return obj2;
};

MFt.ajustaInputAoConteudo = function(elem, max) {
    if (max == undefined) max = 800;
    if (elem.clientWidth < elem.scrollWidth) {
        MFt.atribs(elem, {
            style : {
                width : elem.scrollWidth + 'px'
            }
        });
    }
};

MFt.valToMoeda = function(val) {
    /**
     * Transforma um valor numérico no formado da moeda brasileira
     * Obs.: a função .toFixed() transforma number em string
     * @param {Number} Valor numérico
     * @returns {String} Valor em formato moeda
     */
    if (isNaN(val) === true) return;
    if (typeof a == "string") val = parseFloat(val); // Se um número chega como string isNaN() diz que ele é número, mas o toFixed() não funciona com string.
    var res = val.toFixed(2).toString();
    res = res.replace('.', ',');
    var max = res.length - 6;
    while (max > 0) {
        res = res.substr(0, max) + '.' + res.substr(max);
        max -= 3;
    }
    return res;
};

MFt.strtoval = function(valor) {
    /**
     * Pega uma string no formato 100.000,00 e retorna um valor em float.
     * @param {String}
     * @returns {Number}
     */
    if (typeof valor != "string") return undefined;
    valor = valor.replace(/\./g, '');
    valor = valor.replace(/,/g, '.');
    var retorno;
    try {
        retorno = parseFloat(valor);
    }
    catch(err) {
        retorno = undefined;
    }
    return retorno;
};

MFt.$ = function(e) {
    return typeof e == "string" ? document.getElementById(e) : undefined;
};

/**
 * Centraliza um elemento em relação ao seu parentNode. Ainda tenho sérios problemas
 * com o cálculo da posição correta, mas esta função é a melhor que já fiz até agora.
 * A função lida com o fato do elemento não ter sido incluído na página ainda.
 * Por isso, centraliza com o elemento inserido ou não na página.
 * @param e Elemento a ser centralizado
 */
MFt.centralizaElemento = function(e) {
    var soma = function(){
        var res = 0;
        for (var i = 0, max = arguments.length; i < max; i++) {
            res += parseFloat(arguments[i]);
        }
        return res;
    };
    var check = function(e){
        // Verifica se um elemento está inserido na página
        var c = function(n){
            var tmp = n.parentNode;
            if (tmp) {
                if (tmp == document.body) {
                    return true;
                }
                else return c(tmp);
            }
            else return false;
        };
        return c(e);
    };
    var center = function(elem, dad) {
        if (!elem) return false;
        if (dad == undefined) dad = elem.parentNode;
        var dadW = parseFloat(getComputedStyle(dad).width);
        var dadH = parseFloat(getComputedStyle(dad).height);
        var dadBl = parseFloat(getComputedStyle(dad).borderLeftWidth);
        var dadBr = parseFloat(getComputedStyle(dad).borderRightWidth);
        var dadBt = parseFloat(getComputedStyle(dad).borderTopWidth);
        var dadBb = parseFloat(getComputedStyle(dad).borderBottomWidth);
        var blw = getComputedStyle(dad).borderLeftWidth;
        var brw = getComputedStyle(dad).borderRightWidth;
        var btw = getComputedStyle(dad).borderTopWidth;
        var bbw = getComputedStyle(dad).borderBottomWidth;
        var size = {};
        var middleW = soma(dadW) / 2.0;
        var middleH = soma(dadH) / 2.0;
        console.log('middleW',middleW);
        console.log('middleH',middleH);
        return {x : (middleW - (soma(blw)/2.0)), y : middleH};
    };
    var size = function(e){
        var w = getComputedStyle(e).width;
        var h = getComputedStyle(e).height;
        var ml = getComputedStyle(e).marginLeft;
        var mr = getComputedStyle(e).marginRight;
        var mt = getComputedStyle(e).marginTop;
        var mb = getComputedStyle(e).marginBottom;
        var pl = getComputedStyle(e).paddingLeft;
        var pr = getComputedStyle(e).paddingRight;
        var pt = getComputedStyle(e).paddingTop;
        var pb = getComputedStyle(e).paddingBottom;
        console.log(getComputedStyle(e));
        var larg = soma(w, ml, mr, pl, pr);
        var alt = soma(h, mt, mb, pt, pb);
        return {w:larg, h:alt};
    };
    var doit = function(e){
        var centro = center(e);
        var tam = size(e);
        e.style.position = 'relative';
        var centroX = (centro.x) - (tam.w/2.0);
        var centroY = (centro.y - .6) - (tam.h/2.0);
        e.style.left = centroX + 'px';
        e.style.top = centroY + 'px';
        //console.log('centroX',centroX);
        //console.log('centroY',centroY);
        //console.log('centro:', centro);
        //console.log('tam:', tam);
    };
    if (!check(e)) {
        var left = e.parentNode.style.left;
        var top = e.parentNode.style.top;
        e.parentNode.style.left = '-1000px';
        e.parentNode.style.top = '-1000px';
        document.body.appendChild(e.parentNode);
        doit(e);
        document.body.removeChild(e.parentNode);
        e.parentNode.style.left = left;
        e.parentNode.style.top = top;
    }
    else doit(e);
};

MFt.bind = function(elem, variavel, chaves, callback) {
    /**
     * Vincula o valor de um elemento INPUT a uma chave de uma variável.
     * Sempre que o valor do elemento mudar, o valor na variável mudará.
     * O Javascript não permite a passagem de uma variável string ou numeral por referência.
     * Os objetos, porém, são sempre passados por referência.
     * Assim, o valor "chaves" deve ser de um objeto.
     * Ex.:
     * MFt.bind('HTML_Element ou id string do HTML_Element', {variável do tipo objeto}, {familia:undefined});
     * Onde houver o undefined, este método substituirá pelo valor que o HTML_Element tiver.
     * No caso de elementos Select, a chave indicada terá o "selectedIndex" e o "texto" da opção selecionada.
     * Obs.: Este método também acerta outros valores que forem especificados dentro das "chaves".
     * Obs2.: Este método também inicializa os elementos HTML com os valores indicados na variável.
     *
     * Para funcionar como Array Like (exemplo):
     var obInterno = {};
     obInterno[i] = undefined;
     var obExterno = {};
     obExterno[self.linhas] = obInterno;
     console.log(obExterno);
     inputLabel('', 100, allData, {contratos : obExterno}, {
            app : td,
            marginTop : '0px',
            marginBottom : '0px',
            divtextAlign : 'center',
            divWidth : 100,
            textAlign : 'right'
        });
     */
    var e;
    var retorno;
    var subfunc = function(chave1, chave2, value) {
        for (var key in chave2) {
            if (!chave1.hasOwnProperty(key)) {
                chave1[key] = undefined;
            }
            if (chave2[key] == undefined) {
                chave1[key] = value;
            }
            else {
                switch(Object.prototype.toString.call(chave2[key])) {
                    case '[object String]':
                        chave1[key] = chave2[key];
                        break;
                    case '[object Number]':
                        chave1[key] = chave2[key];
                        break;
                    case '[object Object]':
                        subfunc(chave1[key], chave2[key], value);
                        break;
                    case undefined:
                        chave1[key] = value;
                        break;
                }
            }
        }
    };
    var subfuncInicial = function(chave1, chave2) {
        var ret;
        for (var key in chave2) {
            if (!chave1.hasOwnProperty(key)) {
                chave1[key] = {};
            }
            if (chave2[key] == undefined) {
                if (Object.keys(chave1[key]).length > 0) {
                    retorno = chave1[key];
                    return chave1[key];
                }
            }
            else {
                switch(Object.prototype.toString.call(chave2[key])) {
                    case '[object String]':
                        chave1[key] = chave2[key];
                        break;
                    case '[object Number]':
                        chave1[key] = chave2[key];
                        break;
                    case '[object Object]':
                        ret = subfuncInicial(chave1[key], chave2[key]);
                        if (ret) return ret; // Por causa da recursividade
                        break;
                }
            }
        }
    };
    if (typeof chaves != "object") return;
    if (typeof elem == 'string') e = document.getElementById(elem);
    else e = elem;
    /*
    EVENTOS
     */
    if (Object.prototype.toString.call(e) == '[object HTMLInputElement]') {
        switch (e.type) {
            case 'text':
                e.oninput = function() {
                    subfunc(variavel, chaves, e.value);
                    if (callback && typeof callback == "function") callback();
                };
                var retornar;
                retornar = subfuncInicial(variavel, chaves);
                if (retorno) e.value = retorno;
                else e.value = '';
                break;
            case 'checkbox':
                e.addEventListener('change', function() {
                    subfunc(variavel, chaves, e.checked ? 1 : 0);
                    if (callback && typeof callback == "function") callback();
                });
                e.checked = subfuncInicial(variavel, chaves) == 1;
                break;
        }
    }
    else if (Object.prototype.toString.call(e) == "[object HTMLSelectElement]") {
        e.addEventListener('change', function(){
            subfunc(variavel, chaves, {selectedIndex : e.selectedIndex, texto : e[e.selectedIndex].value});
            if (callback && typeof callback == "function") callback();
        });
        var tmp = subfuncInicial(variavel, chaves);
        if (tmp && tmp.selectedIndex != undefined) e.selectedIndex = tmp.selectedIndex;
        else {
            console.log('Nao existe valor predefinido para o Elemento ID "' + e.id + '"');
        }
    }
};

MFt.dates = { // Compara datas de dois Object Date
    // http://stackoverflow.com/questions/492994/compare-two-dates-with-javascript
    str2date : function(d){
        // transforma datas no formato string para Date()
        var data;
        var a = new RegExp("(\\d{1,2})[\\/\\-\\.](\\d{1,2})[\\/\\-\\.](\\d{4})");
        var res = a.exec(d);
        if (res) {
            data = new Date(parseInt(res[3]), parseInt(res[2] - 1), parseInt(res[1]));
        }
        else {
            a = new RegExp("(\\d{4})[\\/\\-\\.](\\d{1,2})[\\/\\-\\.](\\d{1,2})");
            res = a.exec(d);
            data = new Date(parseInt(res[1]), parseInt(res[2] - 1), parseInt(res[3]));
        }
        if (!data) throw new Error('String informada não se encaixa nos formatos DD-MM-AAAA ou AAAA-MM-DD');
        return data;
    },
    convert:function(d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp)
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0],d[1],d[2]) :
                    d.constructor === Number ? new Date(d) :
                        d.constructor === String ? new Date(d) :
                            typeof d === "object" ? new Date(d.year,d.month,d.date) :
                                NaN
        );
    },
    compare:function(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a=this.convert(a).valueOf()) &&
            isFinite(b=this.convert(b).valueOf()) ?
            (a>b)-(a<b) :
                NaN
        );
    },
    inRange:function(d,start,end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(d=this.convert(d).valueOf()) &&
            isFinite(start=this.convert(start).valueOf()) &&
            isFinite(end=this.convert(end).valueOf()) ?
            start <= d && d <= end :
                NaN
        );
    },
    /**
     * Retorna x dias depois da data fornecida
     * @param {Date} date: dada inicial
     * @param {Integer} days: dias a serem acrescidos
     * @returns {Date}
     */
    addDays : function(date, days) {
        if (!(date instanceof Date)) {
            var data = date.split(' ')[0];
            var tmp = data.split('-');
            date = new Date(tmp[0], parseInt(tmp[1]) - 1, tmp[2]);
        }
        var newdate = new Date(date);
        newdate.setDate(newdate.getDate() + days);
        return new Date(newdate);
    },
    /**
     * Transforma Date em String no formato yyyy-mm-dd hh:mm:ss
     * @param date {String} retorna no formato yyyy-mm-dd hh:mm:ss
     */
    date2sql : function(date){
        if (!(date instanceof Date)) {
            var data = date.split(' ')[0];
            var tmp = data.split('-');
            date = new Date(tmp[0], parseInt(tmp[1]) - 1, tmp[2], 0, 0, 0);
        }
        var ano = date.getFullYear();
        var mes = date.getMonth() + 1;
        var dia = date.getDate();
        var hora = date.getHours();
        var minuto = date.getMinutes();
        var segundo = date.getSeconds();
        mes = (mes.toString().length < 2 ? '0' : '') + mes;
        dia = (dia.toString().length < 2 ? '0' : '') + dia;
        hora = (hora.toString().length < 2 ? '0' : '') + hora;
        minuto = (minuto.toString().length < 2 ? '0' : '') + minuto;
        segundo = (segundo.toString().length < 2 ? '0' : '') + segundo;
        return ano + '-' + mes + '-' + dia + ' ' + hora + ':' + minuto + ':' + segundo;
    },
    mysql2jsdate : function(str){
        var partes = str.split(' ');
        if (partes.length < 2) {
            if (partes.length === 1 && partes[0].split('-').length === 3) partes.push('00:00:00');
            else throw ('Erro: string não está no formato de data do MySQL');
        }
        var ano = parseInt(partes[0].substr(0,4));
        var mes = parseInt(partes[0].substr(5,2)) - 1;
        var dia = parseInt(partes[0].substr(8,2));
        var hora = parseInt(partes[1].substr(0,2));
        var minuto = parseInt(partes[1].substr(3,2));
        var segundo = parseInt(partes[1].substr(6,2));
        return new Date(ano, mes, dia, hora, minuto, segundo);
    },
    daydiff : function(first, second) {
        // retorna em dias a diferença entre duas datas (Date)
        first.setHours(0,0,0);
        second.setHours(0,0,0);
        return Math.round((second-first)/(1000*60*60*24));
    },
    addWorkingDays : function(date, days, obj){
        var notWorkingDays = {
            fixed : [
                '0101', // mm dd
                '2104', // Tiradentes
                '0105', // Dia do trabalhador
                '0709', // Independência
                '1210', // Dia das crianças
                '2810', // Dia do servidor público
                '0211', // Finados
                '1511', // Proclamação da República
                '2512' // Natal
            ],
            2017 : [
                '2702', // Carnaval
                '2802', // Carnaval
                '0103', // Cinzas
                '1404', // Paixão de CRISTO
                '1506' // Corpus Christi
            ],
            'CJU-PI' : [
                '1910', // Dia do Piauí
                '1608' // Dia de Teresina
            ]
        };
        if (!(date instanceof Date)) {
            var data = date.split(' ')[0];
            var tmp = data.split('-');
            date = new Date(tmp[0], parseInt(tmp[1]) - 1, tmp[2]);
        }
        var isWorkingDay = function(date, ob){
            var mes = date.getMonth() + 1;
            var dia = date.getDate();
            var m, d;
            var diasNaoUteis = [0, 6]; // domingo = 0 e sábado = 6
            // Percorre os feriados fixos
            if (MFt.inArray(date.getDay(), diasNaoUteis)) return false;
            for(var i = 0, max = notWorkingDays.fixed.length; i < max; i++){
                m = parseInt(notWorkingDays.fixed[i].substr(0,2));
                d = parseInt(notWorkingDays.fixed[i].substr(2,2));
                if (mes === m && d === dia) return false;
            }
            if (ob && ob.ano && !isNaN(ob.ano) && notWorkingDays[ob.ano]){
                // Se foi passada a chave 'ano' dentro de ob e é um ano e se esse ano está na lista de notWorkingDays
                for(i = 0, max = notWorkingDays[ob.ano].length; i < max; i++) {
                    m = parseInt(notWorkingDays[ob.ano][i].substr(0,2));
                    d = parseInt(notWorkingDays[ob.ano][i].substr(2,2));
                    if (mes === m && d === dia) return false;
                }
            }
            if (ob && ob.unidade && notWorkingDays[ob.unidade]){
                // Se foi passada a chave 'ano' dentro de ob e é um ano e se esse ano está na lista de notWorkingDays
                for(i = 0, max = notWorkingDays[ob.unidade].length; i < max; i++) {
                    m = parseInt(notWorkingDays[ob.unidade][i].substr(0,2));
                    d = parseInt(notWorkingDays[ob.unidade][i].substr(2,2));
                    if (mes === m && d === dia) return false;
                }
            }
            return true;
        };
        ///////////////////////////////
        var newdate = new Date(date);
        newdate.setDate(newdate.getDate() + days);
        while (!isWorkingDay(newdate, obj)){
            newdate.setDate(newdate.getDate() + 1);
        }
        return new Date(newdate);
    },
    extenso : function(date){
        var meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
        if (!(date instanceof Date)) {
            var data = date.split(' ')[0];
            var tmp = data.split('-');
            date = new Date(tmp[0], parseInt(tmp[1]) - 1, tmp[2], 0, 0, 0);
        }
        var dia = date.getDate();
        var mes = date.getMonth();
        var ano = date.getFullYear();
        if (dia === 1) dia = '1º';
        mes = meses[mes];
        return dia + ' de ' + mes + ' de ' + ano;
    },
    date2sapiens : function(date){
        var completa = function(s){
            var t = ['00', '0', ''];
            return t[s.toString().length] + s.toString();
        };
        var dia = completa(date.getDate());
        var mes = completa(date.getMonth() + 1);
        var ano = date.getFullYear();
        var hora = completa(date.getHours());
        var minuto = completa(date.getMinutes());
        var segundo = completa(date.getSeconds());
        return ano.toString() + mes.toString() + dia.toString() + ' ' + hora + minuto + segundo;
    }
};

MFt.Fifo = function(){
    var pilha = [];
    Object.defineProperties(this, {
        push : {
            set : function(val){
                pilha.push(val);
            }
        },
        pop : {
            get : function(){
                if (pilha.length) {
                    var tmp = pilha[0];
                    pilha.splice(0,1);
                    return tmp;
                }
                else return undefined;
            }
        },
        length : {
            get : function(){return pilha.length;}
        }
    });
};

/**
 * Se for um GET, recebe em obj uma propriedade get com todos os parâmetros
 * Se for um POST... da mesma forma
 *
 * @param obj
 * url
 * get / post
 * maximoTentativas - Máximo de tentativas
 * callback - Ao final do XML quando não há erro
 * errorCallback - Chamado sempre que houver um erro, ainda que ele vá tentar repetir a chamada XML
 */
MFt.xml = function(obj){
    var self = this;
    var i, max, fd, tentativas = 0;
    var xml = new XMLHttpRequest();
    var url = '';
    if (!obj) throw('Parâmetros não definidos');
    if (!obj.maximoTentativas) obj.maximoTentativas = 1;
    if (obj && obj.url && typeof obj.url === 'string' && obj.url.length) {
        if (obj.url.substr(0,4) !== 'http') {
            url = MFt.server();
            if (obj.url.substr(0,1) === '/') url += obj.url;
            else url += '/' + obj.url;
        }
        else url = obj.url;
    }
    else throw ('URL não definida');
    if (obj && obj.responseType) xml.responseType = obj.responseType;
    var getpost = function(){
        if ('get' in obj && Object.prototype.toString.call(obj.get) === '[object Object]') {
            if (Object.keys(obj.get).length) url += '?'; // Assim o get pode estar vazio quando se quer apenas um arquivo no servidor
            for(i = 0, max = Object.keys(obj.get).length; i < max; i++) {
                url += Object.keys(obj.get)[i] + '=' + encodeURIComponent(obj.get[Object.keys(obj.get)[i]]);
                if (i < max - 1) url += '&';
            }
            xml.open('get', url);
        }
        else if ('post' in obj && Object.prototype.toString.call(obj.post) === '[object Object]' && Object.keys(obj.post).length) {
            fd = new FormData();
            for(i in obj.post) {
                if (obj.post.hasOwnProperty(i)) {
                    fd.append(i, obj.post[i])
                }
            }
            xml.open('post', url);
        }
        else if (Object.prototype.toString.call(obj.msg) === '[object String]' || Object.prototype.toString.call(obj.msg) === '[object Blob]') {
            xml.open('post', url);
        }
        else {
            console.trace();
            console.log(Object.prototype.toString.call(obj.msg));
            throw new Error('Erro! GET/POST/MSG not defined!');
        }
    };
    getpost(); //////////////////////////////////----------------------- XML.OPEN(...)
    xml.onload = function(){
        var dados;
        if (obj && (obj.justText || obj.responseType === 'blob')) { // obj.justText indica que quero apenas o responseText, e não dados no formato JSON
            if ('callback' in obj && Object.prototype.toString.call(obj.callback) === "[object Function]") {
                if (obj.justText) obj.callback.bind(self)(this.responseText);
                else if (obj.responseType === 'blob') {
                    obj.callback.bind(self)(this.response);
                }
            }
        }
        else {
            try {
                dados = JSON.parse(this.responseText);
            }
            catch(err) {
                console.trace();
                console.log(this.responseText);
                if ('callback' in obj && Object.prototype.toString.call(obj.callback) === "[object Function]") {
                    obj.callback.bind(self)();
                }
            }
            if (dados){
                if ('callback' in obj && Object.prototype.toString.call(obj.callback) === "[object Function]") {
                    obj.callback.bind(self)(dados);
                }
                else throw('Callback ausente!');
            }
        }
    };
    xml.onprogress = function(e){
        if ('onprogresscb' in obj && Object.prototype.toString.call(obj.onprogresscb) === "[object Function]") onprogresscb.bind(self)(e);
    };
    xml.onerror = function(){
        if (tentativas < obj.maximoTentativas) {
            if (obj.errorCallback && typeof obj.errorCallback === 'function') {
                obj.errorCallback({
                    maximoTentativas : obj.maximoTentativas,
                    tentativa : tentativas
                });
            }
            tentativas++;
            if (Object.prototype.toString.call(obj.get) === '[object Object]') {
                getpost();
                xml.send();
            }
            else if (Object.prototype.toString.call(obj.post) === '[object Object]'){
                getpost();
                xml.send(fd);
            }
            else if (Object.prototype.toString.call(obj.msg) === '[object String]') {
                // Caso a mensagem nao precisar ser tratada, como ocorre com o Sapiens
                // Deve ser usado com obj.justText = 1
                getpost();
                xml.send(obj.msg);
            }
            else if (Object.prototype.toString.call(obj.msg) === '[object Blob]') {
                xml.send(obj.msg);
            }
            else {
                throw new Error("Nao foi especificado o metodo ou msg nao eh string");
            }
        }
        else {
            obj.errorCallback({
                maximoTentativas : obj.maximoTentativas,
                tentativa : tentativas,
                fim : true
            });
        }
    };
    tentativas++;
    if (Object.prototype.toString.call(obj.get) === '[object Object]') {
        xml.send();
    }
    else if (Object.prototype.toString.call(obj.post) === '[object Object]') {
        xml.send(fd);
    }
    else if (Object.prototype.toString.call(obj.msg) === '[object String]') {
        // Caso a mensagem nao precisar ser tratada, como ocorre com o Sapiens
        // Deve ser usado com obj.justText = 1
        xml.send(obj.msg);
    }
    else if (Object.prototype.toString.call(obj.msg) === '[object Blob]') {
        // Upload de arquivos para o Sapiens ou outro sistema que nao use o FormData para o envio de arquivos
        xml.setRequestHeader('X-File-Name', obj.filename);
        xml.setRequestHeader('X-File-Size', obj.msg.size);
        xml.setRequestHeader('X-File-Type', obj.msg.type);
        xml.setRequestHeader('Content-Type', 'application/binary');
        //xml.setRequestHeader('Content-Length', obj.msg.size); // considerado unsafe pelo browser que acrescenta essa chave por conta própria.
        // É assim que o Sapiens recebe documentos
        // A maneira tradicional é transformar um Blob em File e incluí-lo como um dos campos do FormData
        // Para isso, basta acrescentar dois campos no Blob:
        //       theBlob.lastModifiedDate = new Date();
        //       theBlob.name = fileName;
        xml.send(obj.msg);
    }
    else {
        throw new Error("Nao foi especificado o metodo ou msg nao eh string");
    }
    return xml;
};

/**
 * Faz o upload dos arquivos indicados no elemento ou na lista de arquivos para a URL indicada e retorna o objeto dado em resposta
 * No final do upload de cada arquivo, chama a função stepDone com o valor de responseText
 * No final de tudo, chama callback com o responseText
 * @param obj dados para serem inseridos no POST, incluindo files que se refere à array de arquivos
 * @param url
 * @param callback
 * @param stepDone
 * @param progress
 */
MFt.upload = function(obj){
    var arquivos;
    var i = 0; // Faz o loop pelos arquivos
    var self = this;
    if (!obj.url) throw "URL não definido";
    if (!obj.callback) throw "Função callback não definida";
    if (typeof obj.callback != 'function') throw "Callback não definida como function";
    if (obj && obj.files) {
        if (Object.prototype.toString.call(obj.files) == "[object HTMLInputElement]" && obj.files.files.length) {
            arquivos = obj.files.files;
            delete obj.files;
        }
        else if (Object.prototype.toString.call(obj.files) == "[object FileList]" && files.length) {
            arquivos = obj.files;
            delete obj.files;
        }
        else throw('Não existe elemento input.file ou object Filelist');
    }
    else {
        console.log(Object.prototype.toString.call(obj.files));
        throw ('Não existe lista de arquivos a ser processada para upload');
    }
    var url = obj.url;
    var processar = function(){
        var xml = new XMLHttpRequest();
        var fd = new FormData();
        xml.open('POST', url);
        if (Object.prototype.toString.call(obj) == '[object Object]' && Object.keys(obj).length) {
            for(var j = 0, maxj = Object.keys(obj).length; j < maxj; j++){
                fd.append(Object.keys(obj)[j], obj[Object.keys(obj)[j]]);
                //console.log(Object.keys(obj)[j], obj[Object.keys(obj)[j]]);
            }
        }
        fd.append('files', arquivos[i]);
        xml.onload = function(){
            i++;
            if (!MFt.upload_abort && i < arquivos.length) {
                if (obj.stepDone && typeof obj.stepDone == "function") obj.stepDone.bind(self)(this.responseText);
                processar();
            }
            else {
                MFt.upload_abort = false;
                if (typeof obj.callback == "function") obj.callback.bind(self)(this.responseText);
            }
        };
        xml.onprogress = function(evt){
            if (evt.lengthComputable) {
                var percentual = Math.ceil(((upload.loaded + evt.loaded) / upload.total) * 100);
                console.log('upload: ' + percentual.toString());
                if (obj.progress && typeof obj.progress == 'function') obj.progress.bind(self)(percentual);
            }
        };
        xml.send(fd);
    };
    processar();
};

MFt.upload_abort = false; // Se esse valor for verdadeiro o processo de upload de MFt.upload não será continuado com o próximo arquivo

/**
 * O ELEMENTO PAI PRECISA TER UM ID ÚNICO
 * Verifica se um elemento é pai, avô, bisavô etc... de outro
 * Retorna true se verdadeiro
 * Se o pai for document.body, retorna false
 *
 */
MFt.isParent = function(pai, filho){
    var res = false;
    var fim = false;
    while(!fim){
        //console.log(filho.id, pai.id, Object.prototype.toString.call(filho.id), Object.prototype.toString.call(pai.id));
        if (filho) {
            if (filho === document.body){
                fim = true;
            }
            else if(filho.id === pai.id) {
                res = true;
                fim = true;
            }
            else if (filho && filho.parentNode) filho = filho.parentNode;
            else fim = true;
        }
        else fim = true;
    }
    return res;
};


MFt.navegador = function(){
    var tmp = navigator.userAgent.split(' ');
    if (tmp[tmp.length - 3].indexOf('Chromium') === 0) return 'chromium';
    else if (tmp[tmp.length - 2].indexOf('Chrome') === 0) return 'chrome';
    else if (tmp[tmp.length - 1].indexOf('Firefox') === 0) return 'firefox';
    else if (tmp[tmp.length - 1].indexOf('Safari') === 0) return 'safari';
};

// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________


MFt.bt = function(obj){
    var self = this;
    var inn = 'innerHTML';
    this.bt = MFt.criaElem('div');
    var image;
    if (obj.image) {
        image = new Image();
        image.src = obj.image;
        if (obj.imageWidth) {
            image.width = parseInt(obj.imageWidth);
            image.style.width = parseInt(obj.imageWidth) + 'px';
        }
        else {
            image.width = 20;
            image.style.width = '20px';
        }
        if (obj.imageHeight) {
            image.height = parseInt(obj.imageHeight);
            image.style.height = parseInt(obj.imageHeight) + 'px';
        }
        else {
            image.height = 20;
            image.style.height = 20;
        }
        image.style.transitionDuration = '0.2s';
    }
    var disabled;
    if (obj && !obj.position) obj.position = 'relative';
    if (obj && !obj.left) obj.left = 0;
    if (obj && !obj.top) obj.top = 0;
    if (obj && !obj.display) obj.display = 'inline-flex';
    if (obj && obj.hasOwnProperty('disabled')) disabled = !!obj.disabled;
    Object.defineProperties(this, {
        value : {
            get : function(){
                return obj.value ? obj.value : 'VALUE NÃO DEFINIDO'
            },
            set : function(val){
                obj.value = val;
                self.bt[inn] = val;
            }
        },
        width : {
            get : function(){
                if (obj.width && Object.prototype.toString.call(obj.width) === '[object String]') {
                    return obj.width;
                }
                else {
                    return obj.width ? obj.width + 'px' : '300px'
                }
            }
        },
        height : {
            get : function(){
                if (obj.height && Object.prototype.toString.call(obj.height) === '[object String]') {
                    return obj.height;
                }
                else return obj.height ? obj.height + 'px' : '26px'
            }
        },
        display : {
            get : function(){return obj.display;},
            set : function(val){
                self.bt.style.display = val;
                obj.display = val;
            }
        },
        cor1 : {
            get : function(){
                return obj.cor1 ? obj.cor1 : 'rgb(255,255,255)';
            },
            set : function(val) {
                obj.cor1 = val;
                self.bt.background = 'radial-gradient(ellipse, ' + self.cor1 + ' ' + self.per1 + '%, ' + self.cor2 + ' ' + self.per2 + '%)'
            }
        },
        cor2 : {
            get : function(){
                return obj.cor2 ? obj.cor2 : '#eee';
            },
            set : function(val) {
                obj.cor2 = val;
                self.bt.background = 'radial-gradient(ellipse, ' + self.cor1 + ' ' + self.per1 + '%, ' + self.cor2 + ' ' + self.per2 + '%)'
            }
        },
        cor3 : {
            get : function(){
                return obj.cor3 ? obj.cor3 : 'rgb(255,255,255)';
            },
            set : function(val) {
                obj.cor3 = val;
                self.bt.background = 'radial-gradient(ellipse, ' + self.cor1 + ' ' + self.per1 + '%, ' + self.cor2 + ' ' + self.per2 + '%)'
            }
        },
        cor4 : {
            get : function(){
                return obj.cor4 ? obj.cor4 : '#ddd';
            },
            set : function(val) {
                obj.cor4 = val;
                self.bt.background = 'radial-gradient(ellipse, ' + self.cor1 + ' ' + self.per1 + '%, ' + self.cor2 + ' ' + self.per2 + '%)'
            }
        },
        per1 : {
            get : function(){
                return obj.per1 ? obj.per1 : '0';
            }
        },
        per2 : {
            get : function(){
                return obj.per2 ? obj.per2 : '100';
            }
        },
        callback : {
            get : function(){
                return obj.callback ? obj.callback : function(){}
            }
        },
        boxShadow : {
            get : function(){
                return obj.boxShadow ? obj.boxShadow : '2px 2px 3px #ccc';
            }
        },
        margin : {
            get : function(){
                return obj.margin ? obj.margin : undefined;
            },
            set : function(val){
                self.bt.style.margin = val;
                obj.margin = val;
            }
        },
        marginTop : {
            get : function(){
                return obj.marginTop ? obj.marginTop : undefined;
            },
            set : function(val){
                self.bt.style.marginTop = val;
                obj.marginTop = val;
            }
        },
        marginBottom : {
            get : function(){
                return obj.marginBottom ? obj.marginBottom : undefined;
            },
            set : function(val){
                self.bt.style.marginBottom = val;
                obj.marginBottom = val;
            }
        },
        marginLeft : {
            get : function(){
                return obj.marginLeft ? obj.marginLeft : undefined;
            },
            set : function(val) {
                self.bt.style.marginLeft = val;
                obj.marginLeft = val;
            }
        },
        marginRight : {
            get : function(){
                return obj.marginRight ? obj.marginRight : undefined;
            },
            set : function(val){
                self.bt.style.marginRight = val;
                obj.marginRight = val;
            }
        },
        wrapper : {
            get : function(){
                if (!obj.wrapper) throw ('Não foi indicado o elemento para se inserir o botão');
                else return obj.wrapper;
            }
        },
        fontFamily : {
            get : function(){return obj.fontFamily ? obj.fontFamily : 'Arial'}
        },
        fontSize : {
            get : function(){return obj.fontSize ? obj.fontSize : '14px'}
        },
        fontStyle : {
            get : function(){return obj.fontStyle ? obj.fontStyle : 'normal'}
        },
        fontWeight : {
            get : function(){return obj.fontWeight ? obj.fontWeight : 'normal'}
        },
        disabled : {
            get : function(){return disabled;},
            set : function(val){
                disabled = !!val;
                if (disabled) {
                    self.bt.style.opacity = '0.2';
                    self.bt.style.cursor = 'default';
                }
                else {
                    self.bt.style.opacity = '1';
                    self.bt.style.cursor = 'pointer';
                }
            }
        },
        dataset : {
            get : function(){
                return self.bt.dataset;
            },
            set : function(value){
                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        switch(Object.prototype.toString.call(value[key])) {
                            case '[object String]':
                            case '[object Number]':
                                self.bt.dataset[key] = value[key];
                                break;
                        }
                    }
                }
            }
        },
        image : {
            get : function(){return image;}
        },
        offsetTop : {
            get : function(){return self.bt.offsetTop;}
        },
        top : {
            get : function(){return obj.top;},
            set : function(val){
                obj.top = val;
                if (isNaN(val)) self.bt.style.top = val;
                else self.bt.style.top = val + 'px';
            }
        },
        left : {
            get : function(){return obj.left;},
            set : function(val){obj.left = val; self.bt.style.left = val + 'px';}
        },
        position : {
            get : function(){return obj.position;},
            set : function(val){obj.position = val; self.bt.style.position = val;}
        }
    });
    if (obj && obj.dataset) this.dataset = obj.dataset;
    this.init();
};

MFt.bt.prototype.init = function(){
    var self = this;
    if (self.image) {
        if (self.margin) self.image.style.margin = self.margin;
        if (self.marginLeft) self.image.style.marginLeft = self.marginLeft;
        if (self.marginRight) self.image.style.marginRight = self.marginRight;
        if (self.marginTop) self.image.style.marginTop = self.marginTop;
        if (self.marginBottom) self.image.style.marginBottom = self.marginBottom;
        if (!self.marginTop && !self.marginBottom && !self.marginLeft && !self.marginRight && !self.margin) {
            self.margin = '1px 1px 1px 1px';
        }
        if (self.top) {
            if (isNaN(val)) self.bt.style.top = self.top;
            else self.bt.style.top = self.top + 'px';
        }
    }
    else {
        MFt.atribs(self.bt, {
            innerHTML : self.value,
            style : {
                background : 'radial-gradient(ellipse, ' + self.cor1 + ' ' + self.per1 + '%, ' + self.cor2 + ' ' + self.per2 + '%)',
                position : self.position,
                width : self.width,
                height : self.height,
                textAlign : 'center',
                border : '1px solid #999',
                borderRadius : '6px',
                boxShadow : self.boxShadow,
                cursor : 'pointer',
                transitionDuration : '0.2s',
                display : self.display,
                alignItems : 'center',
                justifyContent : 'center',
                fontFamily : self.fontFamily,
                fontSize : self.fontSize,
                fontStyle : self.fontStyle,
                fontWeight : self.fontWeight,
                webkitUserSelect : 'none',
                mozUserSelect : 'none',
                msUserSelect : 'none',
                userSelect : 'none',
                top : isNaN(self.top) ? self.top : self.top + 'px',
                left : self.left + 'px'
            }
        });
        if (self.margin) self.bt.style.margin = self.margin;
        if (self.marginLeft) self.bt.style.marginLeft = self.marginLeft;
        if (self.marginRight) self.bt.style.marginRight = self.marginRight;
        if (self.marginTop) self.bt.style.marginTop = self.marginTop;
        if (self.marginBottom) self.bt.style.marginBottom = self.marginBottom;
        if (!self.marginTop && !self.marginBottom && !self.marginLeft && !self.marginRight && !self.margin) {
            self.margin = '1px 1px 1px 1px';
        }
    }
    if (self.image) MFt.appendElems(self.wrapper, self.image);
    else MFt.appendElems(self.wrapper, self.bt);
    self.disabled = self.disabled; // Só para chamar a parte de habilitar ou não
    if (self.image) {
        self.image.onmouseover = function(){
            if (!self.disabled) {
                self.image.style.transform = 'scale(1.2)';
            }
        };
        self.image.onmouseout = function(){
            if (!self.disabled){
                self.image.style.transform = 'scale(1)';
            }
        };
        self.image.onmousedown = function(e){
            e.stopPropagation();
            e.preventDefault(e);
            if (!self.disabled) {
                //self.image.style.boxShadow = '0px 0px 0px #ccc';
                self.image.style.left = '1px';
                self.image.style.top = '1px';
                self.image.style.transform = 'scale(0.8)';
            }
        };
        self.image.onmouseup = function(e){
            e.stopPropagation();
            e.preventDefault(e);
            if (!self.disabled){
                //self.image.style.boxShadow = self.boxShadow;
                self.image.style.left  = '0px';
                self.image.style.top = '0px';
                self.image.style.transform = 'scale(1)';
                self.callback();
            }
        };
        self.image.onclick = function(e){
            e.stopPropagation();
        };
    }
    else {
        self.bt.onmouseover = function(){
            if (!self.disabled) {
                self.bt.style.background = 'radial-gradient(ellipse, ' + self.cor3 + ' ' + self.per1 + '%, ' + self.cor4 + ' ' + self.per2 + '%)';
            }
        };
        self.bt.onmouseout = function(){
            if (!self.disabled){
                self.bt.style.background = 'radial-gradient(ellipse, ' + self.cor1 + ' ' + self.per1 + '%, ' + self.cor2 + ' ' + self.per2 + '%)';
                self.bt.style.boxShadow = self.boxShadow;
                self.bt.style.left  = self.left + 'px';
                self.bt.style.top = self.top + 'px';
            }
        };
        self.bt.onmousedown = function(e){
            e.stopPropagation();
            e.preventDefault(e);
            if (!self.disabled) {
                self.bt.style.boxShadow = '0px 0px 0px #ccc';
                self.bt.style.left = self.left + 1 + 'px';
                self.bt.style.top = self.top + 1 + 'px';
            }
        };
        self.bt.onmouseup = function(e){
            e.stopPropagation();
            e.preventDefault(e);
            if (!self.disabled){
                self.bt.style.boxShadow = self.boxShadow;
                self.bt.style.left  = self.left + 'px';
                self.bt.style.top = self.top + 'px';
                self.callback(self.bt);
            }
        };
        self.bt.onclick = function(e){
            e.stopPropagation();
        };
    }
};


// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________






MFt.BtSim = function(obj){
    var self = this;
    if (Object.prototype.toString.call(obj) !== '[object Object]') throw new Error('Necessário definir objeto');
    if (!obj.wrapper) throw new Error('Necessário definir onde o elemento será anexado');
    obj.width = obj.width || 40;
    obj.height = obj.height || 20;
    if (!obj.hasOwnProperty('sim')) obj.sim = false;
    if (isNaN(obj.width)) throw new Error('A largura precisa ser um número');
    if (isNaN(obj.height)) throw new Error('A altura precisa ser um número');
    Object.defineProperties(this, {
        width : {
            get : function(){return obj.width;}
        },
        height : {
            get : function(){return obj.height;}
        },
        wrapper : {
            get : function(){return obj.wrapper;}
        },
        sim : {
            get : function(){return !(!obj.sim);},
            set : function(val) {
                obj.sim = !(!val);
                self.update();
            }
        },
        onchange : {
            get : function(){
                if (obj && obj.onchange && typeof obj.onchange === 'function') return obj.onchange;
                else return undefined;
            }
        }
    });
    self.init();
};

MFt.BtSim.prototype.init = function(){
    var self = this;
    var espessura = 0.3 * parseInt(self.height);
    var curva = 10;
    var raio = 8;
    var desloc = Math.floor(self.width * 0.1);
    var fillSim = 'rgba(100,180,255,1)';
    var fillNao = 'rgba(100,100,100,0.8)';
    var strokeSim = 'rgba(100, 100, 100, 0.7)';
    var strokeNao = 'rgba(255, 255, 255, 0)';
    self.svg = MFt.criaElem('svg', {}, self.wrapper, {
        width : self.width,
        height : self.height
    });
    self.linha = MFt.criaElem('path', {
        style : {
            transitionDuration : '0.3s'
        }
    }, self.svg, {
        fill : self.sim ? fillSim : fillNao,
        stroke : self.sim ? strokeSim : strokeNao,
        d:  "M " + curva + ' ' + Math.floor((self.height / 2.0) - espessura) +
            "H " + (self.width - curva) +
            "C " +
            (self.width) + ' ' + Math.floor((self.height / 2.0) - espessura) + ', ' +
            (self.width) + ' ' + Math.floor((self.height / 2.0) + espessura) + ', ' +
            (self.width - curva) + ' ' + Math.floor((self.height / 2.0) + espessura) +
            "H " + curva +
        "C " +
        '0 ' + Math.floor((self.height / 2.0) + espessura) + ', ' +
        '0 ' + Math.floor((self.height / 2.0) - espessura) + ', ' +
        curva + ' ' + Math.floor((self.height / 2.0) - espessura)
    });
    self.circ = MFt.criaElem('circle', {
        style : {
            transitionDuration : '0.3s'
        }
    }, self.svg, {
        cx : self.sim ? (self.width - curva - desloc) : curva + desloc,
        cy : Math.floor(self.height / 2),
        r : raio,
        fill : "rgba(0,0,0,0.7)",
        'stroke-width' : 1
    });
    self.sombra = MFt.criaElem('circle', {
        style : {
            transitionDuration : '0.5s'
        }
    }, self.svg, {
        cx : self.sim ? (self.width - curva - desloc) : curva + desloc,
        cy : Math.floor(self.height / 2),
        r : raio + 2,
        fill : "rgba(0,0,0,0.2)"
    });
    self.svg.onclick = function () {
        self.sim = !self.sim;
        self.update();
    };
    self.update = function(){
        self.circ.setAttribute('cx', self.sim ? (self.width - curva - desloc) : curva + desloc);
        self.linha.setAttribute('fill', self.sim ? fillSim : fillNao);
        self.linha.setAttribute('stroke', self.sim ? strokeSim : strokeNao);
        self.sombra.setAttribute('cx', self.sim ? (self.width - curva - desloc) : curva + desloc);
        if (self.onchange) self.onchange(self.sim);
    }
};



// -----------------------------------------------------------------------------------------
// ----------------------------------- CLASSE MF_THEN --------------------------------------
/**
 * Concatena ações assíncronas.
 * Nâo sei nem como explicar. Eu vi isso no programa de mostrar PDF do Firefox.
 * Não vi o código fonte. Mas logo resolvi criar um para mim.
 * Tudo o que for assíncrono pode ser conectado com issso.
 * Basta que exista uma espécie de callback da rotina assíncrona ao método doit() de Then, com o bind do objeto
 * ...Then que foi criado.
 * A rotina assíncrona deve ter:
 * 1) var then = new MFThen();
 * 2) chamada para then.doit.bind(then) ou then.doit().bind(then), conforme o caso.
 * 3) ...ou chamada para then.doit(then).
 * 4) E o "return then" no final da rotina que contém a chamada assíncrona.
 * Então, se eu tenho um método load() com um XMLHTTPRequest, basta incluir esses parâmetros.
 * Se logo depois da resposta ao Request, eu quiser chamar outra função/método, basta fazer assim:
 * load().then(function(){...}) ou load().then(nome_function).
 *
 * Muito interessante.
 * @constructor
 */
function MFThen() {}

MFThen.prototype.then = function(callback, args) {
    this.callback = callback;
    this.args = args;
};

MFThen.prototype.doit = function(self) {
    if (!self) self = this;
    if (typeof self.callback == 'function') {
        self.callback(self.args);
        self.callback = undefined;
        self.args = undefined;
    }
};
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------