function dowloadImage(url, filename){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function(){
        var urlCretor = window.URL || window.webkitURL;
        var imageUrl = urlCretor.createObjectURL(this.response)
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = filename;
        tag.click();

    }
    xhr.send();
}