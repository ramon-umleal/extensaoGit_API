chrome.runtime.sendMessage('get-variabe', (response) => {
    console.log(response)
})
const esperar = (n) => new Promise(rr => {
    setTimeout(() => {
        rr();
    }, n);
});

window.onload = async () => {
    ///////////////////////// Incluindo div do pop 
    console.log('iniciar');
    await esperar(10000);

    const bt = new MFt.bt({
        value: 'PopUp',
        width: 100,
        height: 30,
        wrapper: MFt.criaElem('div', {
            style: {
                position: 'fixed',
                top: '190px',
                left: '1400px'
            }
        }, document.body),
        callback: ()=>{
            // PopUp precisa de mftools.js
            const pop = new PopUp(400, 200, null, null, form=>{
                
                MFt.criaElem('a', {
                    href: 'https://manoelpaz.com',
                    target: '_blank',
                    innerText: 'TESTE'
                }, form.div);
                pop.aceitaEsc = true;
                pop.iniciar(pop);
                //pop.aceitaEsc = false;
                //pop.clicarForaSair = false;
            });
        }
    });

     
  
//incluido os botoes 


    var menuSa = document.getElementById('toolbar-1890-innerCt');

    menuSa.appendChild(ulbuttonConsulta1);

    var menuSul = document.getElementById("ulbuttonConsulta1");

    menuSul.appendChild(ulbuttonConsulta);

    var menuSli = document.getElementById("idulbuttonConsulta");

    menuSli.appendChild(llibuttonConsulta1);

    var menuSlia1 = document.getElementById("idliulbuttonConsulta1");

    menuSlia1.appendChild(a1buttonConsulta);


    //2 

    var menuSa2 = document.getElementById('toolbar-1890-innerCt');

    menuSa2.appendChild(aulbuttonConsulta2);


    var menuSu2 = document.getElementById("idaulbuttonConsulta2");

    menuSu2.appendChild(ulbuttonConsulta2);

    var menuSli2 = document.getElementById("idulbuttonConsulta2");

    menuSli2.appendChild(llibuttonConsulta2);

    var menuSlia2 = document.getElementById("idliulbuttonConsulta2");

    menuSlia2.appendChild(a1buttonConsulta2);


    //3 

    var menuSa3 = document.getElementById('toolbar-1890-innerCt');

    menuSa3.appendChild(aulbuttonConsulta3);

    var menuSu3 = document.getElementById("idbuttonConsulta3");

    menuSu3.appendChild(ulbuttonConsulta3);

    var menuSli3 = document.getElementById("idulbuttonConsulta3");

    menuSli3.appendChild(llibuttonConsulta3);

    var menuSlia3 = document.getElementById("idliulbuttonConsulta3");

    menuSlia3.appendChild(a1buttonConsulta3);



    console.log('Incluindo os novos botoes');    

const bt1 = new MFt.bt({
            value: 'PopUp',
            width: 60,
            height: 20,
            wrapper: MFt.criaElem('div', {
                style: {
                    position: 'fixed',
                    top: '110px',
                    left: '340px'
                }
            }, document.getElementById('toolbar-1890-innerCt')),
            callback: ()=>{
                                        //largura x altura
                    const pop = new PopUp(300, 400, null, null, form=>{
                        MFt.atribs(form.div, {
                            style: {
                                fontSize: '14px'
                            }
                        });

                        MFt.criaElem('div', {
                            innerText: 'Buscar todas as peças?',
                            style: {
        
                            }
                        }, form.div);
                        const d1 = MFt.criaElem('div', null, form.div);
                        const d2 = MFt.criaElem('div', {style:{margin:'10px 0'}}, form.div);
                        const sim = new MFt.bt({
                            value: 'Sim',
                            wrapper: d1,
                            width: 100,
                            height: 30,
                            callback: ()=>{
                                form.closeWindow(form);
                                ret({sim:true, tempo:c1.checked});
                            }
                        });
                        const nao = new MFt.bt({
                            value: 'Não',
                            wrapper: d1,
                            width: 100,
                            height: 30,
                            marginLeft: '20px',
                            callback: ()=>{
                                form.closeWindow(form);
                                ret({sim:false, tempo:c1.checked});
                            }
                        });
                        const c1 = MFt.criaElem('input', {
                            type: 'checkbox',
                            style: {
                                margin: '0 10px 0 0'
                            }
                        }, d2);
                        MFt.criaElem('span', {innerText: 'Buscar tempo das peças'}, d2);
                    });
                    pop.aceitaEsc = true;
                    pop.clicafora_sair = true;
                    pop.iniciar(pop); 
            }
        });


        

    const bt2 = new MFt.bt({
            value: 'PopUp2',
            width: 60,
            height: 20,
            wrapper: MFt.criaElem('div', {
                style: {
                    position: 'fixed',
                    top: '110px',
                    left: '440px'
                }
            }, document.getElementById('toolbar-1890-innerCt')),
            callback: ()=>{
                                        //largura x altura
                    const pop = new PopUp(300, 400, null, null, form=>{
                        MFt.atribs(form.div, {
                            style: {
                                fontSize: '14px'
                            }
                        });

                        MFt.criaElem('div', {
                            innerText: 'Buscar todas as peças?',
                            style: {
        
                            }
                        }, form.div);
                        const d1 = MFt.criaElem('div', null, form.div);
                        const d2 = MFt.criaElem('div', {style:{margin:'10px 0'}}, form.div);
                        const sim = new MFt.bt({
                            value: 'Sim',
                            wrapper: d1,
                            width: 100,
                            height: 30,
                            callback: ()=>{
                                form.closeWindow(form);
                                ret({sim:true, tempo:c1.checked});
                            }
                        });
                        const nao = new MFt.bt({
                            value: 'Não',
                            wrapper: d1,
                            width: 100,
                            height: 30,
                            marginLeft: '20px',
                            callback: ()=>{
                                form.closeWindow(form);
                                ret({sim:false, tempo:c1.checked});
                            }
                        });
                        const c1 = MFt.criaElem('input', {
                            type: 'checkbox',
                            style: {
                                margin: '0 10px 0 0'
                            }
                        }, d2);
                        MFt.criaElem('span', {innerText: 'Buscar tempo das peças'}, d2);
                    });
                    pop.aceitaEsc = true;
                    pop.clicafora_sair = true;
                    pop.iniciar(pop); 
            }
        });
    
        const bt3 = new MFt.bt({
            value: 'PopUp3',
            width: 60,
            height: 20,
            wrapper: MFt.criaElem('div', {
                style: {
                    position: 'fixed',
                    top: '110px',
                    left: '540px'
                }
            }, document.getElementById('toolbar-1890-innerCt')),
            callback: ()=>{
                                        //largura x altura
                    const pop = new PopUp(300, 400, null, null, form=>{
                        MFt.atribs(form.div, {
                            style: {
                                fontSize: '14px'
                            }
                        });
    
                        MFt.criaElem('div', {
                            innerText: 'Buscar todas as peças?',
                            style: {
        
                            }
                        }, form.div);
                        const d1 = MFt.criaElem('div', null, form.div);
                        const d2 = MFt.criaElem('div', {style:{margin:'10px 0'}}, form.div);
                        const sim = new MFt.bt({
                            value: 'Sim',
                            wrapper: d1,
                            width: 100,
                            height: 30,
                            callback: ()=>{
                                form.closeWindow(form);
                                ret({sim:true, tempo:c1.checked});
                            }
                        });
                        const nao = new MFt.bt({
                            value: 'Não',
                            wrapper: d1,
                            width: 100,
                            height: 30,
                            marginLeft: '20px',
                            callback: ()=>{
                                form.closeWindow(form);
                                ret({sim:false, tempo:c1.checked});
                            }
                        });
                        const c1 = MFt.criaElem('input', {
                            type: 'checkbox',
                            style: {
                                margin: '0 10px 0 0'
                            }
                        }, d2);
                        MFt.criaElem('span', {innerText: 'Buscar tempo das peças'}, d2);
                    });
                    pop.aceitaEsc = true;
                    pop.clicafora_sair = true;
                    pop.iniciar(pop); 
            }
        });
    
        console.log('fim dos botoes');

        function TelaAnotacoesTitulo(elem_desc, id_comp, titulos, nup, tela_processo){
            console.log(titulos);
            this.width = 750;
            this.height = 500;
            Object.defineProperties(this, {
                elem_desc: {
                    get: function () {
                        return elem_desc;
                    }
                },
                id_comp: {
                    get: function () {
                        return id_comp
                    }
                },
                titulos: {
                    get: function () {
                        return titulos;
                    }
                },
                nup: {
                    get: function () {
                        return nup;
                    }
                },
                tela_processo: {get: function(){return tela_processo;}}
            });
            this.aceitaEsc = true;
            this.clicafora_sair = true;
            this.init();
        }
        console.log('inicio testes');
        
        const bt4 = new MFt.bt({
            value: 'PopUp4',
            width: 60,
            height: 20,
            wrapper: MFt.criaElem('div', {
                style: {
                    position: 'fixed',
                    top: '110px',
                    left: '640px'
                }
            }, document.getElementById('toolbar-1890-innerCt')),
            callback: ()=>{

                                        //largura x altura
                                        TelaAnotacoesTitulo.prototype = new PopUp();

                                        
                                        TelaAnotacoesTitulo.prototype.formulario = function(self) {
                                            MFt.clear(self.div);
                                            MFt.atribs(self.div, {
                                                style: {
                                                    fontFamily: '"Titillium Web", "Arial"',
                                                    fontSize: '14px'
                                                }
                                            });
                                            let d1 = MFt.criaElem('div', {}, self.div);
                                            MFt.criaElem('span', {
                                                innerText: 'Título do documento: ',
                                                style: {
                                                    fontWeight: 'bold'
                                                }
                                            }, d1);
                                            let tipo_docs = (()=>{
                                                let dl = MFt.criaElem('datalist', {id:'tipos_docs'}, d1);
                                                const ops = self.tela_processo.tipos_docs;
                                                ops.forEach((d)=>{
                                                    MFt.criaElem('option', {value:d}, dl);
                                                });
                                                return dl;
                                            })();
                                            let titulo = MFt.criaElem('input', {
                                                type: 'text',
                                                value: self.elem_desc.innerText,
                                                style: {
                                                    width: '591px',
                                                    marginLeft: '10px',
                                                    border: '0',
                                                    borderBottom: '1px dotted #CCC',
                                                    outline: 'none',
                                                    fontFamily: '"Titillium Web", "Arial"',
                                                    fontSize: '14px'
                                                }
                                            }, d1, {list:'tipos_docs'});
                                            titulo.focus();
                                            let d2 = MFt.criaElem('div', {}, self.div);
                                            MFt.criaElem('p', {
                                                innerText: 'Anotações:',
                                                style: {
                                                    fontFamily: '"Titillium Web", "Arial"',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold'
                                                }
                                            }, d2);
                                            let anotacoes = MFt.criaElem('textarea', {
                                                value: self.get_anotacoes(self),
                                                style: {
                                                    width: '704px',
                                                    height: '350px',
                                                    resize: 'none',
                                                    border: 'none',
                                                    outline: 'none',
                                                    fontFamily: '"Titillium Web", "Arial"',
                                                    fontSize: '14px',
                                                    paddingLeft: '15px',
                                                    paddingTop: '10px',
                                                    paddingBottom: '10px',
                                                    marginLeft: '15px',
                                                    marginBottom: '20px',
                                                    borderLeft: '1px dotted #CCC',
                                                    backgroundColor: '#fffcf1',
                                                    boxShadow: '2px 2px 7px #dfdcd0'
                                                }
                                            }, d2);
                                            let div_salvar = MFt.criaElem('div', {}, self.div);
                                            let bt_salvar = new MFt.bt({
                                                value: 'Salvar',
                                                width: 100,
                                                height: 27,
                                                wrapper: div_salvar,
                                                callback: (b) => {
                                                    if ((titulo.value.trim() && self.elem_desc.innerText.trim() !== titulo.value.trim()) || self.get_anotacoes(self) !== anotacoes.value) {
                                                        bt_salvar.disabled = true;
                                                        self.salvar(self, titulo.value.trim(), anotacoes.value.trim(), self.id_comp, self.nup, bt_salvar, anotacoes, titulo);
                                                    }
                                                    else {
                                                        alert('Não houve modificação do texto');
                                                    }
                                                }
                                            });
                                            titulo.onkeyup = (e)=>{
                                                if (e.key === 'Enter') {
                                                    if (titulo.value.trim() && self.elem_desc.innerText.trim() !== titulo.value.trim()) {
                                                        bt_salvar.disabled = true;
                                                        self.salvar(self, titulo.value.trim(), anotacoes.value.trim(), self.id_comp, self.nup, bt_salvar, anotacoes, titulo);
                                                    }
                                                }
                                            };
                                            let transparencia = MFt.criaElem('span', {
                                                innerText: 'Transparência',
                                                style: {
                                                    marginLeft: '100px',
                                                    border: '1px dotted #CCC',
                                                    padding: '10px 20px',
                                                    borderRadius: '9px'
                                                }
                                            }, div_salvar);
                                            transparencia.onmouseenter = (e) => {
                                                self.div.style.opacity = 0;
                                            };
                                            transparencia.onmouseleave = (e) => {
                                                self.div.style.opacity = 1;
                                            };
                                            let div_obs = MFt.criaElem('div', {}, self.div);
                                            MFt.criaElem('p', {
                                                innerText: 'Obs.: Todas as anotações feitas aqui estarão disponíveis aos outros usuários.',
                                                style: {
                                                    fontFamily: '"Titillium Web", "Arial"',
                                                    fontSize: '14px',
                                                    marginTop: '20px'
                                                }
                                            }, div_obs);
                                        };     
                                        




            }


        });
    

}
//004101181272021-95
