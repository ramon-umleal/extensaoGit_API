var elements = document.querySelectorAll('.v1nh3');
elements.forEach(function (element) {
    element.addEventListener('click', function () {
        //console.log('selecionou a imagem');


        //add o buttons
        AddButton();
        function AddButton() {
            setTimeout(() => {
                var menu = document.getElementsByClassName('ltpMr Slqrh')[0];
                if (menu != undefined) {
                    menu.appendChild(buttonDownload);
                    linkImage = document.querySelectorAll('._97aPb')[0].querySelectorAll('img')[0].src;
                } else {
                    AddButton()
                }
            }, 2000);
            console.log('executou')
        }
    });
});




buttonDownload.addEventListener('click', () => {
    console.log(linkImage);
    dowloadImage(linkImage, imagem.jpeg);


})

//var buttonDownload = document.createElement('button');