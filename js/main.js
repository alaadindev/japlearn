let upload = document.getElementById("upload")
let upload_btn = upload.getElementByClass("button")
let upload_file = upload.getElementByClass("input")

upload_btn.addEventListener('click', upload)
function upload(){
    let text = upload_file
    console.log(text)
}

