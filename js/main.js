let upload = document.getElementById("upload")
let upload_btn = upload.getElementsByTagName("button")[0]
let upload_file = upload.getElementsByTagName("input")[0]

upload_file.addEventListener('change', load)
function load(){
    let filename = upload_file.files[0]
    if (!filename) return

    const reader = new FileReader()
    
    reader.onload = function(e){
        let filecontent = e.target.result
        let result = []
        filecontent = filecontent.trimEnd().split(/\r?\n\r?\n/).forEach(element => {
            let token = element.split("\n")
            let obj = {'line':token[0], 'start':token[1].split("-->")[0], 'end':token[1].split("-->")[1], 'text': token[2]}
            result.push(obj)

        });
        console.log(result)
    }
    reader.readAsText(filename)
    console.log(filename)
}

function loadfile(){

}

