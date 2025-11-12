
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
        translate.addEventListener('click', translate_text)
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
    speechSynthesis.speak(audio)
}
async function translate_text(e){
    try{
        let control = e.currentTarget.parentNode
        let content = control.parentNode
        let textelem = control.previousElementSibling
        let text = textelem.innerText
        if(content.childNodes.length > 2) return

        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|en`)
        const data = await response.json();
        const translation = data.responseData.translatedText
        let translated = document.createElement('li')
        translated.innerText = translation
        content.insertBefore(translated, control)
    }catch(err){
        console.log(err)
    }
}

function loadfile(){

}
display_loaded_file()

