
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
        let details = document.createElement('div')
        details.className = "details"
        let content = document.createElement('div')
        content.className = "content"
        let play = document.createElement('button')
        play.innerText = "play"
        play.addEventListener('click', play_sound)
        let translate = document.createElement('button')
        translate.innerText = "translate"
        let control = document.createElement('div')
        control.className = "control"
        control.appendChild(play)
        control.appendChild(translate)
        details.appendChild(line)
        details.appendChild(start)
        details.appendChild(end)
        content.appendChild(text)
        content.appendChild(control)
        card.appendChild(details)
        card.appendChild(content)
        card.className = "card"
        cards.appendChild(card)
    })
    loadedfile.innerHTML = ""
    loadedfile.appendChild(cards)
}
function play_sound(e){
    let text = e.currentTarget.parentNode.previousElementSibling.innerText
    //text = text.replace(/\(.*?\)/g, '')
    let audio = new SpeechSynthesisUtterance(text)
    audio.lang = 'ja-JP'
    audio.pitch = 1
    audio.rate = 1
    console.log(audio)
    speechSynthesis.speak(audio)
}

function loadfile(){

}
display_loaded_file()

