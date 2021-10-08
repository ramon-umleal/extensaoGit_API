// A inicializacao ocorre no final deste arquivo

/*
EXPLICAÇÕES SOBRE O FUNCIONAMENTO
O Sapiens verifica a cada 5 minutos se o arquivo foi modificado.
Se sim, ele faz o salvamento. Se não, não faz nada.
Quando o Editor abre um arquivo, ele recebe um "ticket" de autorização para salvar o arquivo.
Só pode salvar o arquivo quem tem esse "ticket".
Assim, se o usuário abrir o mesmo arquivo em duas abas, somente a aba mais recente poderá salvar o arquivo porque recebeu o último "ticket".
A cada vez que o editor salva, ele fornece o "ticket" antigo, que o autoriza a salvar, e recebe um novo que vai autorizar um novo salvamento.
Esse "ticket" é armazenado em "Ext.getCmp("editor").ticket".
Para fazer o editor salvar sempre a cada mudança do texto, uso uma injeção de código via extensão, por meio de "content_scripts" que
vão rodar assim que o documento é iniciado (document_start), mas antes da existência do DOM. Então, este "content_editor.js" é configurado para funcionar
assim a que q página é iniciada, conforme consta no "manifest.json".
Ocorre que os scripts iniciados por meio do "content_scripts" do "manifest.json" têm alguns problemas:
1. Não acessam variáveis locais.
2. Não podem capturar o conteúdo dos XMLHttpRequest trocados entre a página e o servidor.
3. Só podem capturar o conteúdo do que é enviado por meio do XMLHttpRequest
4. Assim, não podem capturar o novo "ticket" que é fornecido a cada novo salvamento.

Além disso, quero que essa funcionalidade fique disponível apenas para algumas pessoas.
Isso me obriga a buscar no meu servidor de internet as pessoas que têm esse direito.
Os scripts definidos em "content_scripts" só podem acessar o servidor da própria página original.
Acessar outro servidor, somente por meio do "background.js" (também definido no "manifest.json").

Então, a solução funciona da seguinte maneira:
- Este "content_editor.js" envia mensagem para o "background.js" solicitando a lista de autorizados.
- Enquanto isso, fica escutando as mensagens que podem vir de "background.js".
- O "background.js" solicita ao meu servidor o número dos autorizados e envia mensagem ao "content_editor.js".
- Em "content_editor.js" existe uma rotina que fica verificando se os autorizados já foram informados.
- Quando são informados, aguarda-se o primeiro salvamento (automático ou manual) para se obter o "ticket" de salvamento.
- A partir daí sempre que houver alteração no texto, o documento é salvo por meio de um XMLHttpRequest enviado pelo "content_editor.js".

O trunfo é que existe outra maneira de se injetar código na página principal criando-se um elemento "script", anexando-o no "header".
Isso é feito pelo método interceptar(). Ele faz mais: ele muda o "prototype" do XMLHttpRequest para receber todas as mensagens.
Assim, toda comunicação passa pelo XMLHttpRequest que ele cria.
Daí verifica-se o conteúdo do novo "ticket" e passa esse "ticket" tanto para o "content_editor.js" como para "Ext.getCmp("editor").ticket".
Como não é possível enviar mensagem entre a página principal e o "content_editor.js", criei um elemento no DOM que sempre terá o valor atualizado do "ticket".
Cada XMLHttpRequest enviado para salvar o documento atualiza o elemento input.hidden no DOM.
E há um setInterval() que fica atualizando "Ext.getCmp("editor").ticket" de acordo com o valor do elemento do DOM.


 */

class NuncaPerder extends Tudo {
    constructor() {
        super();
        this.timer = undefined;
        this.ultimo_salvamento = undefined;
        this.usuarios_autorizados = [];
        this.ticket = undefined;
        if (browser) {
            browser.runtime.onMessage.addListener(msg=>{
                console.log(msg);
                if (msg.from === 'background') {
                    if (msg.subject === 'autorizados_salvamento') {
                        this.usuarios_autorizados = msg.dados;
                        // aqui eu poderia ter chamado a continuidade do programa,
                        // mas preferi criar um setInterval() no metodo que envia a mensagem
                        // porque a sequencia do programa fica mais clara
                    }
                    // else if (msg.subject === 'ticket') {
                    //     console.log(`TICKET PARA SALVAR RECEBIDO - ${msg.ticket}`);
                    //     this.ticket = msg.ticket;
                    // }
                }
            });
        }
        this.interceptar();
        this.encontrar_div_editor(elem=>{
            this.autorizados(()=>{
                this.sapiens_route(new Payloads().identidade(), user=>{
                    if (user) {
                        let usuario = user[0];
                        // console.log(usuario);
                        if (MFt.inArray(usuario.id, this.usuarios_autorizados)) {
                            console.log(`Usuario ${usuario.nome} autorizado.`);
                            this.verificar_alteracao(elem);
                        }
                    }
                });
            });
        });
    }

    inserir_marca(iframe) {
        let id_elem = '__watermark__';
        let doc = iframe.document || iframe.contentDocument || iframe.contentWindow.document;
        let wm = doc.getElementById(id_elem);
        if (!wm) {
            wm = doc.createElement('div');
            wm.id = id_elem;
            doc.body.appendChild(wm);
        }
        else {
            wm = doc.getElementById(id_elem);
        }
        wm.style.display = 'none';
        if (wm.innerText.length === 0) {
            let sp = doc.createElement('span');
            sp.style.color = "transparent";
            sp.innerText = '.';
            wm.appendChild(sp);
        }
        else wm.innerText = '';
        wm.setAttribute('helper', `${new Date().toString()}`);
    }

    interceptar() {
        console.log('interceptar');
        let checkForDOM = ()=>{
            console.log('checkForDOM');
            if (document.body && document.head) {
                interceptData();
            } else {
                requestIdleCallback(checkForDOM); // Espera a pagina ficar em IDLE
            }
        };
        let interceptData = ()=>{
            /*
            Com a injeção de código é possível acessar variáveis da página como se fosse a própria página.
            Também é possível sobrescrever classes como a XMLHttpRequest
             */
            var xhrOverrideScript = document.createElement('script');
            xhrOverrideScript.type = 'text/javascript';
            xhrOverrideScript['innerHTML'] = `
            (function() {
            var intervalo_ticket = setInterval(()=>{
                let e_ticket = document.getElementById('numero_do_ticket');
                if (e_ticket && e_ticket.value) {
                    Ext.getCmp("editor").ticket = e_ticket.value;
                }
            }, 300);
            var XHR = XMLHttpRequest.prototype;
            var send = XHR.send;
            var open = XHR.open;
            let elem_ticket = document.createElement('input');
            document.body.appendChild(elem_ticket);
            elem_ticket.type = 'hidden';
            elem_ticket.id = 'numero_do_ticket';
            XHR.open = function(method, url) {
                this.url = url; // the request url
                return open.apply(this, arguments);
            }
            XHR.send = function() {
                this.addEventListener('load', function() {
                    let server = document.location.protocol + '//' + document.domain.split('/')[0];
                    if (this.url === 'upload_editor') {
                        console.log(this);
                        console.log(server);
                        console.log(this.url);
                        console.log(this.response);
                        let dados;
                        try {
                            dados = JSON.parse(this.response);
                        }
                        catch(e) {
                        }
                        if (dados) {
                            console.log(dados);
                            console.log('+---------------------------------------------------+');
                            console.log(Ext.getCmp("editor"));
                            console.log(Ext.getCmp("editor").ticket);
                            if (dados.ticket) {
                                Ext.getCmp("editor").ticket = dados.ticket;
                                elem_ticket.value = dados.ticket;
                            }
                            else {
                                console.log('NAO DEU CERTO');
                            }
                            console.log('+---------------------------------------------------+');
                        }
                        else {
                            console.log('browser nao funciona');
                        }
                    }               
                });
                return send.apply(this, arguments);
            };
            })();
            `;
            document.head.prepend(xhrOverrideScript); // adiciona como primeiro child de um elemento.
            console.log(xhrOverrideScript);
            console.log('script inserido');
        };
        requestIdleCallback(checkForDOM);  // Espera a pagina ficar em IDLE
    }

    autorizados(cb) { // Solicita do background.js a lista de servidores autorizados a utilizar esse teste de salvamento automatico
        if (browser) {
            if (browser.runtime) {
                browser.runtime.sendMessage(null, {
                    from: 'content_editor.js',
                    subject: 'autorizados_salvamento',
                });
            }
        }
        let t1 = setInterval(()=>{
            if (this.usuarios_autorizados.length) {
                clearInterval(t1);
                cb();
            }
        }, 1000);
    }

    encontrar_div_editor(cb) {
        setTimeout(()=>{
            let iframes = this.encontrar(document.body, (elem)=>{
                return elem instanceof HTMLElement && elem.tagName === 'IFRAME';
            });
            for(let i = 0; i < iframes.length; i++) {
                if (iframes[i].pai.id === 'cke_1_contents') {
                    cb(iframes[i].elem);
                    break;
                }
            }
            console.log(iframes);
        }, 5000);
    }

    encontrar(elemInicial, func_check) {
        let matriz = [];
        let item = undefined;
        let busca = (elem) => {
            let cn = elem.childNodes;
            for (let i = 0; i < cn.length; i++) {
                if (func_check(cn[i])) {
                    matriz.push({
                        elem: cn[i],
                        pai: elem
                    });
                }
                busca(cn[i]);
            }
        };
        busca(elemInicial);
        return matriz;
    }

    obter_ticket(id_comp, cb) {
        MFt.xml({
            url: `https://sapiens.agu.gov.br/documento/${id_comp}/1`,
            get: {},
            callback: res=>{
                if (res && res.ticket) {
                    cb(res.ticket);
                }
                else cb(false);
            }
        });
    }

    verificar_alteracao(iframe) {
        let doc = iframe.document || iframe.contentDocument || iframe.contentWindow.document;
        let conteudo_salvo = '';
        let id_componente = MFt.urlArgs().c;
        let id_documento = MFt.urlArgs().d;
        let salvando = false;
        let intervalo_salvamento = 4 * 60 * 1000;
        let xml_salvar;
        let max_timeout = 10;
        let timeout = max_timeout;
        let esperando_confirmacao = false;
        let ativado = false;
        let pergunta_feita = false;
        let intervalo_verificacao = 5000;
        if (id_componente && id_documento) {
            this.timer = setInterval(()=>{
                if (esperando_confirmacao) return;
                if (salvando) {
                    timeout--;
                    console.log(`AGUARDANDO RESULTADO DO SALVAMENTO (${timeout})`);
                    if (timeout <= 0) {
                        console.log('TIMEOUT excedido!');
                        xml.abort();
                        timeout = max_timeout;
                    }
                    return;
                }
                if (MFt.$('numero_do_ticket').value && MFt.$('numero_do_ticket').value !== this.ticket) {
                    this.ticket = MFt.$('numero_do_ticket').value;
                    console.log(`MUDANCA DO NUMERO DO TICKET: ${this.ticket}`);
                    this.ultimo_salvamento = new Date();
                }
                if (!this.ticket) {
                    console.log('AINDA NAO RECEBI O TICKET PARA SALVAR');
                    return;
                }
                if (!ativado && !pergunta_feita) {
                    if (confirm('Ativar o modo "Só JESUS Salva!" ???')) {
                        ativado = true;
                        this.botao_tempo();
                        this.botao_forcar(iframe);
                    }
                    else {
                        console.log('SALVAMENTO CONTINUO NAO ATIVADO');
                        console.log('--------------------------------------------------------------');
                    }
                    pergunta_feita = true;
                }
                if (!ativado) {
                    return;
                }
                let conteudo_atual = doc.body.innerText;
                let lapso = this.ultimo_salvamento ? new Date() - this.ultimo_salvamento : 0;
                if (conteudo_atual !== conteudo_salvo) {
                    // console.log(conteudo_atual);
                    console.log('CONTEUDO ALTERADO');
                    this.inserir_marca(iframe);
                    conteudo_atual = doc.body.innerText;
                    salvando = true;
                    xml_salvar = this.salvar(id_componente, id_documento, doc.body.innerHTML, this.ticket,res=>{
                        salvando = false;
                        if (res) {
                            console.log('CONTEUDO SALVO', new Date());
                            conteudo_salvo = conteudo_atual;
                            this.ultimo_salvamento = new Date();
                        }
                        else {
                            console.log('NAO FOI POSSIVEL SALVAR');
                        }
                    });
                }
                else if (lapso >= intervalo_salvamento) {
                    console.log('SALVAMENTO AUTOMATICO');
                    this.inserir_marca(iframe);
                    conteudo_atual = doc.body.innerText;
                    salvando = true;
                    xml_salvar = this.salvar(id_componente, id_documento, doc.body.innerHTML, this.ticket,res=>{
                        salvando = false;
                        if (res) {
                            console.log('CONTEUDO SALVO', new Date());
                            conteudo_salvo = conteudo_atual;
                            this.ultimo_salvamento = new Date();
                        }
                        else {
                            console.log('NAO FOI POSSIVEL SALVAR');
                        }
                    });
                }
            }, intervalo_verificacao);
        }
    }

    salvar(id_comp, id_doc, conteudo_html, ticket, cb) {
        let save_doc = ticket=>{
            console.log(`TENTANDO SALVAR COM O TICKET ${ticket}`);
            let dados = {
                autoSave: false,
                componenteDigital: id_comp,
                documento: id_doc,
                ticket: ticket,
                conteudoHTML: conteudo_html
            };
            return this.xml({
                url: 'https://sapiens.agu.gov.br/upload_editor',
                headers : {
                    "Content-Type":"application/json",
                    "X-Requested-With":"XMLHttpRequest"
                },
                msg: JSON.stringify(dados),
                // justText: 1,
                callback: res=>{
                    console.log(res);
                    if (res && res.success) {
                        MFt.$('numero_do_ticket').value = res.ticket;
                        cb(true);
                    }
                    else cb(false);
                }
            });
        };
        if (ticket) {
            return save_doc(ticket);
        }
        else { // Aqui ele salva com novo numero de ticket, desprezando o antigo
            this.obter_ticket(id_comp, novo_ticket=>{
                console.log(novo_ticket);
                if (novo_ticket) {
                    return save_doc(novo_ticket);
                }
            });
        }
    }

    botao_tempo() {
        let toolbox = MFt.$('cke_1_toolbox');
        let wrapper = MFt.$('cke_1_top');
        let msg = undefined;
        let timer = undefined;
        let show_time = ()=>{
            if (msg && this.ultimo_salvamento) {
                let lapso = new Date() - this.ultimo_salvamento;
                if (lapso < 60 * 1000) {
                    let segs = lapso / 1000;
                    msg.innerText = `Salvo há ${segs.toFixed(0)} seg.`
                }
                else {
                    let segs = lapso / (60 * 1000);
                    msg.innerText = `Salvo há ${segs.toFixed(0)} min.`;
                }
            }
        };
        if (toolbox && wrapper) {
            console.log(toolbox);
            let grupo = MFt.criaElem('div', {
                id: 'salvar_tempo',
                style: {
                    width: '200px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            }, toolbox);
            msg = MFt.criaElem('div', {}, grupo);
            timer = setInterval(show_time, 1000);
        }
        else {
            console.log('NAO ENCONTREI O TOOLBOX');
        }
    }

    botao_forcar(iframe) {
        let toolbox = MFt.$('cke_1_toolbox');
        let wrapper = MFt.$('cke_1_top');
        let xml_salvar;
        let div_salvar_tempo = MFt.$('salvar_tempo');
        let self = this;
        if (toolbox && wrapper && div_salvar_tempo) {
            console.log(toolbox);
            let bt = new MFt.bt({
                value: 'Salvar!!!!',
                wrapper: div_salvar_tempo,//MFt.criaElem('div', {style:{position:'absolute', top:'37px', left:'805px'}}, wrapper),
                width: 80,
                height: 26,
                marginLeft: '10px',
                callback: ()=>{
                    console.log('Salvando...');
                    let pop = new PopUp(400, 200, null, null, form=>{
                        MFt.criaElem('div', {innerText: 'Para quando o salvar do Sapiens não funciona.'}, form.div);
                        MFt.criaElem('div', {innerText: 'Tentando salvar...'}, form.div);
                        let cancelar = new MFt.bt({
                            value: 'Cancelar',
                            wrapper: form.div,
                            width: 90,
                            height: 30,
                            marginTop: '10px',
                            callback: ()=>{
                                if (xml_salvar) xml_salvar.abort();
                                form.closeWindow(form);
                            }
                        });
                        let id_componente = MFt.urlArgs().c;
                        let id_documento = MFt.urlArgs().d;
                        let doc = iframe.document || iframe.contentDocument || iframe.contentWindow.document;
                        console.log(doc);
                        xml_salvar = self.salvar(id_componente, id_documento, doc.body.innerHTML, null,res=>{
                            if (res) {
                                form.div.innerText = 'CONTEÚDO SALVO!';
                                this.ultimo_salvamento = new Date();
                                setTimeout(()=>{
                                    form.closeWindow(form);
                                }, 2000);
                            }
                            else {
                                form.div.innerText = 'NÃO FOI POSSÍVEL SALVAR';
                            }
                        });
                    });
                    pop.iniciar(pop);
                }
            });
        }
        else {
            console.log('NAO ENCONTREI O TOOLBOX PARA INSERIR BOTAO');
        }
    }
}




if (MFt.navegador() === 'chrome') {
    console.log('CHROME');
    window.onload = ()=>{
        console.log('ONLOAD CONTENT EDITOR___');
        let np = new NuncaPerder();
    };
}
else {
    console.log('NAO CHROME');
    console.log('CONTENT_EDITOR.JS');
    let np = new NuncaPerder();
}
