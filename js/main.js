
let upload = document.getElementById("upload")
let upload_btn = upload.getElementsByTagName("button")[0]
let upload_file = upload.getElementsByTagName("input")[0]
let loadedfile = document.getElementById("loadedfile")

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
        localStorage.setItem('load', JSON.stringify(result))
        display_loaded_file()
    }
    reader.readAsText(filename)
}
function display_loaded_file(){
    let file = JSON.parse(localStorage.getItem('load'))
    let cards = document.createElement('div')
    cards.className = 'cards'
    file.forEach(elem=>{
        let card = document.createElement('div')
        let line = document.createElement('li')
        line.innerText = elem.line
        let start = document.createElement('li')
        start.innerText = elem.start
        let end = document.createElement('li')
        end.innerText = elem.end
        let text = document.createElement('li')
        text.innerText = elem.text
        card.appendChild(line)
        card.appendChild(start)
        card.appendChild(end)
        card.appendChild(text)
        cards.appendChild(card)
    })
    loadedfile.innerHTML = ""
    loadedfile.appendChild(cards)
    console.log(cards)
}

function loadfile(){

}

