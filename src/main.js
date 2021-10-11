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
    

        
        
    console.log(bt);
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

}
//004101181272021-95
