/**
 * Created by dell on 4/28/15.
 *
 * USO EXEMPLO:
 * Pode-se criar um novo objeto a partir da heranca de PopUp, fazendo o override do metodo formulario
 * ou pode-se fazer assim:
 *  var menu = new PopUp(400, 300, null, null, function(){
        menu.div.style.textAlign = 'center'; // opcional, eh apenas um exemplo
        // Tudo mais que for necessario para criar o formulario deve ser colocado aqui
    });
 *
 *
 * USO EXEMPLO 2:
 let msg = new PopUp(300, 100, null, null, (form) => {
     console.log('form onclick');
     MFt.criaElem('div', {
         innerHTML: 'Aguardando análise do SEI',
         style: {
             fontFamily: 'Arial',
             fontSize: '14px',
             textAlign: 'center'
         }
     }, form.div);
});
 msg.init(msg);
 */

function PopUp(width, height, numproc, blurElem, funcFormulario) {
    /*
    Histórico: Inicialmente criei esse objeto com um evento que verificava toda vez...
    ...que a window mudava de tamanho para ajustar o tamanho da "cortina" e posição da this.div.
    ...Descobri que isso não era necessário se eu fizesse assim:
     self.atributos(self.div, {
     style : {
     top : '0px',
     bottom : '0px',
     left : '0px',
     right : '0px',
     display : 'block',
     margin : 'auto',
     position : 'fixed',
     .
     .
     .
     self.atributos(self.pano.style, {
     backgroundColor : 'rgba(255, 255, 255, 0.7)',
     top : '0px',
     left : '0px',
     bottom : '0px',
     right : '0px',
     webkitFilter : 'blur(20px)',
     filter : 'blur(20px)',
     position : 'fixed'
     });
     Entretanto, não apaguei as rotinas de recalcular as coisas, para referência futura.

     Coloquei a possibilidade de borrar o fundo, basta indicar qual o elemento cujo conteúdo deve ser borrado.
     Para isso é só indicar a propriedade blur do objeto.
     Se não for indicado nenhum, o Objeto vai procurar o elemento de id "wrapper" em document.body.
     Se encontrar, borra-o.

    Cuidado! Existe a possibilidade de inserir um cabeçalho em cada PopUp,
    mas para esse cabeçalho aparecer é necessário incluir um valor para
    ...prototype.header = 'Whatever';

    Também se prevê uma cor, mas é necessário indicar o valor de
     ...prototype.headerBack = '#fee';
     */
    this.x = 0;
    this.y = 0;
    this.width = width || 300;
    this.height = height || 300;
    this.numproc = numproc || '';
    this.div = undefined;
    this.aceitaEsc = false;
    this.blur = undefined;
    this.funcFormulario = funcFormulario;
    this.clicafora_sair = false; // Se verdadeiro fecha a janela quando se clica fora dela
    this.selfAnime = null; // Função/método a ser chamado quando a animação do popup terminar, normalmente associado a colocar o foco em algum elemento.
    Object.defineProperties(this, {
        blurElement : {
            get : function(){return blurElem;},
            set : function(val){blurElem = val;}
        }
    })
}

PopUp.count = 0; // A Variável estática é declarada aqui

PopUp.prototype = {
    widthPadrao : 300,
    heightPadrao : 300,
    header : '',
    resizing : false, // Serve para verificar se a janela foi redimensionada
    headerBack : 'rgb(155, 222, 213)',
    init : function() {
        var self = this;
        self.iniciar(self);
    },
    iniciar : function(self) {
        self = self || this;
        self.window(self);
        self.cabecalho(self);
        if (typeof self.funcFormulario === 'function') self.funcFormulario(this);
        else if (typeof self.funcFormulario !== 'undefined') {
            console.log(self.funcFormulario);
            throw new Error("funcFormulario foi definido, mas nao eh uma funcao");
        }
        else self.formulario(self);
    },
    window : function(self) {
        var startTime = Date.now(), scale = 0.9, timeanime = 200, cortina_opacity = 0.7;
        var contador_de_frames = 2;
        if (PopUp.count > 0) {
            console.log('Já existe um PopUp ativo.');
            return;
        }
        else PopUp.count++;
        self.div = document.createElement('div');
        self.setSizePopUpWindow(self);
        document.body.appendChild(self.div);
        self.atributos(self.div, {
            style : {
                top : '0px',
                bottom : '0px',
                left : '0px',
                right : '0px',
                display : 'block',
                margin : 'auto',
                padding : '20px',
                position : 'fixed',
                border : '1px solid black',
                backgroundColor : 'white',
                borderRadius : '8px',
                boxShadow : '0 0 16px  rgba(0,0,0,0.9)',
                overflow : 'hidden',
                transform : 'scale(' + scale.toFixed(1) + ')',
                transition : '0.5s ease'
                /*
                webkitAnimation :'pop-in ease-in 0.3s', // Chrome
                MozAnimationName :'pop-in',
                MozAnimationDirection : 'normal',
                MozAnimationDuration : '0.3s',
                MozAnimationDelay : '0s',
                MozAnimationIterationCount : 1,
                MozAnimationFillMode : 'none',
                MozAnimationTimingFunction : 'ease-in'
                */
            }
        });
        var efeito = function() {
            var cor1 = 'rgb(255,255,255)'; 
            var cor2 = 'rgb(32,95,187)'; 
            var grau = '180'; 
            var per1 = 52.1; 
            var per2 = 91.6;
            if (contador_de_frames-- === 0) {
                MFt.atribs(self.div, {
                    style: {
                        transform: 'scale(1)'
                    }
                });
                //self.pano.style.backgroundColor = 'rgba(145, 145, 145, 0.5)';
                //self.pano.style.background = 'rgba(145, 145, 145, 0.5)';
                //self.pano.style.backgroundImage = 'radial-gradient(circle, rgba(255, 255, 255, 0.0) 0%, rgba(80, 80, 80, 0.9))';
                //self.pano.style.backgroundImage = 'radial-gradient(ellipse farthest-corner at 245px 45px, rgba(50, 50, 50, 0.1) 0%, rgba(80, 80, 80, 0.2))';
                //self.pano.style.backgroundImage = 'radial-gradient(circle, rgba(50, 50, 50, 0) 40%, rgba(80, 80, 80, 1))';
                self.pano.style.backgroundImage = 'radial-gradient(circle, rgba(50, 50, 50, 0.1) 20%, rgba(50, 50, 50, 0.5) 60%, rgb(80, 80, 80))';
                if (self.blurElement && self.blurElement.style) self.blurElement.style.filter = 'blur(2px)';
            }
            else requestAnimationFrame(efeito);
        };
        self.cortina(self);
        self.div.style.zIndex = 100;
        if (!self.blurElement) self.getBlurElement();
        self.pano.style.transition = '0.5s ease';
        requestAnimationFrame(efeito); // Só se foi colocado essa linha para dar um tempo mínimo para o efeito funcionar
        window.addEventListener('keydown', self.key = function(e) {self.esc(self, e);}, false); // Construção interessante
        /*
        self.fimAnime(self); ///////////////////////////////
        */
    },
    setSizePopUpWindow : function(self) {
        self.width = self.width ? self.width : self.widthPadrao;
        self.height = self.height ? self.height : self.heightPadrao;
        var pos = self.calculatesCenter(self);
        self.div.style.top = pos.y + 'px';
        self.div.style.left = pos.x + 'px';
        self.div.style.height = self.height + 'px';
        self.div.style.width = self.width + 'px';
    },
    calculatesCenter : function(self) {
        var w = window.innerWidth;
        var h = window.innerHeight;
        var middleW = (w / 2) - (self.width / 2);
        var middleH = (h / 2) - (self.height / 2);
        middleH = (middleH - (middleH * 0.1) >= 0) ? middleH - (middleH * 0.1) : 0;
        return {x : middleW, y : middleH};
    },
    cria : function(tagName, obj) {
        /* VERSÃO NOVA - RECURSIVA, Cria um elemento e atribui todas as propriedades a ele */
        var elemento = document.createElement(tagName);
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
        if (elemento) subfunc(elemento, obj);
        return elemento;
    },
    formulario : function(self) {
        var p1 = self.cria('p', {innerHTML : 'Processo: '});
        var p2 = self.cria('p', {innerHTML : 'Advogado: '});
        var p3 = self.cria('p', {style : {textAlign : 'center'}});
        var p4 = self.cria('p', {innerHTML : 'Número Parecer: ', style : {paddingBottom: '0px'}});
        var input = self.cria('input', {id : 'np', type : 'text', value : self.numproc, style : {width : '200px'}});
        var button = self.cria('input', {type : 'button', value : 'Processar', id : 'processar'});
        var adv = self.cria('input', {type : 'text', id : 'nome_advogado', style : {width : '250px'}});
        var numpar = self.cria('input', {type : 'text', id : 'numpar', style : {width : '50px', textAlign : 'right'}});
        var tmp = new Date();
        var html  = self.cria('input', {type : 'checkbox'});
        var p5 = self.cria('p', {style : {margin : '0px', backgroundColor : '#f0f0f0', marginBottom: '15px'}});
        // localStorage
        if (localStorage['advogado']) adv.value = localStorage['advogado'];
        if (localStorage['html'] === 'true') html.checked = localStorage['html'];
        // Append
        p5.appendChild(html);
        p5.appendChild(document.createTextNode(' Sapiens - Exibir documento em formato Sapiens/HTML'));
        p1.appendChild(input);
        p2.appendChild(adv);
        p3.appendChild(button);
        p4.appendChild(numpar);
        p4.appendChild(document.createTextNode("/" + tmp.getFullYear()));
        self.div.appendChild(p1); // Número do processo
        self.div.appendChild(p2); // Advogado
        self.div.appendChild(p4); // Número Parecer
        self.div.appendChild(p5); // checkbox HTML
        self.div.appendChild(p3); // Botão de download
        // Eventos do formulário
        button.addEventListener('click', function(e) {
            localStorage['advogado'] = adv.value.trim();
            localStorage['html'] = html.checked;
            self.download(self, html.checked);
        }, false);
        input.addEventListener('input', function(e) {self.numproc = e.target.value;}, false);
        adv.onkeydown = function(e) { self._enter(self, e); };
        numpar.onkeydown = function(e) { self._enter(self, e); };
        self.animeEnd = function() {
            adv.focus();
        };
    },
    fimAnime : function(self) {
        // Este método é vinculado ao elemento self.div quando ele é criado. Assim, quando as animações mencionadas
        // ...terminam self.simAnime é invocado. Por sua vez, ele chama a função registrada em self.animeEnd, se
        // ...existir alguma.
        var eventosAnimacao = ['animationend', 'webkitAnimationEnd'];
        for (var i = 0; i < eventosAnimacao.length; i++) self.div.addEventListener(eventosAnimacao[i], function(e) {
            if (typeof self.animeEnd === 'function') self.animeEnd();
        });
    },
    _enter : function(self, e) {
        if (e.keyCode === 13 && self.$('nome_advogado').value.length && self.$('numpar').value.length) {
            e.preventDefault(e);
            self.download(self);
        }
    },
    doBlur : function(state){
        var self = this, blur;
        if (self.blurElement) {
            if (state) self.blurElement.style.filter = 'blur(' + (self.blurvalue || 5) + 'px)';
            else self.blurElement.style.filter = 'none';
        }
        else {
            blur = document.body.getElementsByTagName('div');
            for(var i = 0, max = blur.length; i < max; i++){
                tmp = blur[i];
                if (tmp && tmp.id && tmp.id.toLowerCase() === 'wrapper' && tmp.parentNode === document.body) {
                    self.blurElement = tmp;
                    if (state) self.blurElement.style.filter = 'blur(' + (self.blurvalue || 5) + 'px)';
                    else self.blurElement.style.filter = 'none';
                }
            }
        }
    },
    getBlurElement : function(){
        var self = this, blur;
        if (self.blurElement) return self.blurElement;
        else {
            blur = document.body.getElementsByTagName('div');
            for(var i = 0, max = blur.length; i < max; i++){
                tmp = blur[i];
                if (tmp && tmp.id && tmp.id.toLowerCase() === 'wrapper' && tmp.parentNode === document.body) {
                    self.blurElement = tmp;
                    return self.blur;
                }
            }
        }
        self.blur = undefined;
    },
    cortina : function(self) {
        var tmp;
        document.body.style.overflow = 'hidden';
        self.pano = self.cria('div');
        self.atributos(self.pano.style, {
            //backgroundColor : 'rgba(225, 225, 225, 0)',
            top : '0px',
            left : '0px',
            bottom : '0px',
            right : '0px',
            position : 'fixed'
        });
        self.pano.style.zIndex = 99;
        //self.doBlur(true);

        //self.reallocateElements(self);

        //self.panoResizeEvent = function() {
        //    if (self.resizing) return;
        //    self.resizing = true;
        //    var lapse = setTimeout(function(){
        //        /*
        //        Precisei inserir estes dois timers para ter a certeza que a janela foi redimensionada,
        //        vez que em movimentos rápidos de redimensionamento, o tamanho da janela ficava errado.
        //        Isso acontecia especialmente quando mostrando console view e maximizando a janela.
        //        Assim, o timer evita redimensionamentos inferiores a 50ms, e quando redimensiona faz
        //        nova verificação/redimensionamento 200ms depois. Esses foram os tempos que funcionaram bem
        //        com os diversos browsers.
        //         */
        //        self.reallocateElements(self);
        //        var lp2 = setTimeout(function(){
        //            self.reallocateElements(self);
        //            self.resizing = false;
        //        }, 50);
        //    }, 200);
        //};
        //window.addEventListener('resize', self.panoResizeEvent, false);



        document.body.appendChild(self.pano);
        self.pano.onclick = function(e){
            if (self.clicafora_sair) self.closeWindow(self);
        };
        self.lockWheel(self);
    },
    lockWheel : function(self) {
        window.addEventListener('DOMMouseScroll', self.preventDefault, false);
        window.addEventListener('keydown', self.keyDown, false);
    },
    releaseWheel : function(self) {
        window.removeEventListener('DOMMouseScroll', self.preventDefault, false);
        window.removeEventListener('keydown', self.keyDown, false);
    },
    preventDefault : function(e) {
        e.preventDefault(e);
    },
    keyDown : function(e) {
        var keys = []; //[38, 40]; // ATENÇÃO: IMPEDIR O FUNCIONAMENTO DAS TECLAS PRA CIMA E PRA BAIXO AFETA OS ELEMENTOS TEXTAREA E OS COM contenteditable = "true"
        for (var i = keys.length; i--;) {
            if (e.keyCode === keys[i]) {
                e.preventDefault(e);
                return;
            }
        }
    },
    closeWindow : function(self) {
        self.releaseWheel(self);
        self.div.parentNode.removeChild(self.div);
        self.pano.parentNode.removeChild(self.pano);
        self.doBlur.bind(self)(false);
        window.removeEventListener('keydown', self.key, false);
        //window.removeEventListener('resize', self.panoResizeEvent, false);
        document.body.style.overflow = 'auto';
        PopUp.count--;
        if (PopUp.count < 0) PopUp.count = 0;
    },
    esc : function(self, e) {
        if (!self.aceitaEsc) return;
        if (e.keyCode === 27) {
            e.preventDefault(e);
            self.closeWindow(self);
        }
    },
    reallocateElements : function(self) {
        self.atributos(self.pano.style, {
            width: window.innerWidth + 'px',
            height: window.innerHeight + 'px'
        });
        self.setSizePopUpWindow(self);
        self.cabecalhoPosicao(self);
    },
    download : function(self, html) {
        var url;
        if (html) url = 'http://' + document.domain.split('/')[0] + '/cgi-bin/agu/' + cgi + '/downloadhtml.py?numproc=';
        else url = 'http://' + document.domain.split('/')[0] + '/cgi-bin/agu/' + cgi + '/download.py?numproc=';
        url += encodeURIComponent(self.numproc);
        url += '&adv=' + encodeURIComponent(self.$('nome_advogado').value);
        url += '&numpar=' + encodeURIComponent(self.$('numpar').value);
        if (html) {
            if (janelaExtra) janelaExtra.close();
            janelaExtra = window.open(url, 'modelo', "height=750px, width=1000px, scrollbars");
        }
        else location = url;
        self.closeWindow(self);
    },
    $ : function(str) {
        return document.getElementById(str);
    },
    atributos : function(elem, props) {
        // Acerta os atributos de um elemento de modo recursivo
        /* Cria um elemento e atribui todas as propriedades a ele */
        var elemento;
        if (typeof elem === 'string') elemento = document.getElementById(elem);
        else elemento = elem;
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
        if (elemento) subfunc(elemento, props);
    },
    getTopPos : function(el) {
        for (var topPos = 0; el !== null; topPos += el.offsetTop, el = el.offsetParent);
        return topPos;
    },
    cabecalho : function(self) {
        if (self.header && self.header.length > 0) {
            self.cab = self.cria('div');
            self.cabP = self.cria('div', {innerHTML : self.header});
            self.cabecalhoPosicao(self);
            self.cab.appendChild(self.cabP);
            self.div.appendChild(self.cab);
        }
    },
    cabecalhoPosicao : function(self) {
        if (!self.cab || !self.cabP) return;
        var sumPx = function(matriz) {
            var total = 0;
            for(var i = 0; i < matriz.length; i++) {
                total += parseFloat(matriz[i]);
            }
            //console.log('sumPx', total);
            return total;
        };
        var cs = getComputedStyle(self.div);
        var paddingLeft = 15;
        var paddingRight = 15;
        var headerBack = '#fee';
        if (self.headerBack) headerBack = self.headerBack;
        self.atributos(self.cab, {
            style : {
                position : 'relative',
                left : '-' + cs.paddingLeft,
                top : '-' + sumPx([cs.paddingTop/*, cs.marginTop*/]) + 'px',
                width : (sumPx([cs.paddingLeft, cs.width, cs.paddingRight]) - (paddingLeft + paddingRight)) + 'px',
                borderTopLeftRadius : cs.borderTopLeftRadius,
                borderTopRightRadius : cs.borderTopRightRadius,
                backgroundColor : headerBack,
                paddingTop : '8px',
                paddingLeft : paddingLeft + 'px',
                paddingRight : paddingRight + 'px',
                paddingBottom : '7px',
                boxShadow : '0px 2px 3px #ccc'
            }
        });
        self.atributos(self.cabP, {
            style : {
                margin : '0px',
                fontFamily : 'Arial',
                fontWeight : '600',
                fontSize : '16px',
                textShadow : '2px 2px 3px #bbb'
            }
        });
    },
    totalHeight : function(elem) {
        // Retorna a altura total de um elemento (inner, padding, margins, borders)
        if (!elem) return 0;
        var cs = getComputedStyle(elem);
        var th = 0;
        var itens = [cs.height, cs.marginTop, cs.marginBottom, cs.paddingTop, cs.paddingBottom, cs.borderTopWidth, cs.borderBottomWidth];
        for(var i = 0; i < itens.length; i++) th += parseInt(itens[i]);
        return th;
    },
    totalWidth : function(elem) {
        // Retorna a largura total de um elemento
        if (!elem) return 0;
        var cs = getComputedStyle(elem);
        var tw = 0;
        var itens = [cs.width, cs.marginLeft, cs.marginRight, cs.paddingLeft, cs.paddingRight, cs.borderLeftWidth, cs.borderRightWidth];
        for(var i = 0; i < itens.length; i++) tw += parseInt(itens[i]);
        return tw;
    }
};
/*
 <!-- ANIMAÇÕES -->
 @-webkit-keyframes pop-in {
 0% { opacity: .5; -moz-transform: scale(.9); -webkit-transform: scale(.9); }
 100% { opacity: 1; -moz-transform: scale(1); -webkit-transform: scale(1); }
 }
 @keyframes pop-in {
 0% { opacity: .5; -moz-transform: scale(.9); -webkit-transform: scale(.9); }
 100% { opacity: 1; -moz-transform: scale(1); -webkit-transform: scale(1); }
 }

 */