import CardDom from './dom/card.js'
import Store from './store/store.js'
let upload = document.getElementById("upload")
let upload_btn = upload.getElementsByTagName("button")[0]
let upload_file = upload.getElementsByTagName("input")[0]
let loadedfile = document.getElementById("loadedfile")

const store = new Store()

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
            let obj = {'line':token[0], 'start':token[1].split("-->")[0], 'end':token[1].split("-->")[1], 'text': token[2], 'viewed':false}
            result.push(obj)

        });
        store.setCurrent(result)
        display_loaded_file()
    }
    reader.readAsText(filename)
}
function display_loaded_file(){
    let file = store.getCurrent()
    let cards = document.createElement('div')
    cards.className = 'cards'
    file.forEach(elem=>{
        let carddom = new CardDom(elem)
        
        carddom.playBtn.addEventListener('click', play_sound)
        carddom.translateBtn.addEventListener('click', translate_text)
        
        cards.appendChild(carddom.card)
    })
    loadedfile.innerHTML = ""
    loadedfile.appendChild(cards)
}
function play_sound(e){
    let id = (e.currentTarget.id).split('-')[0]
    let textelem = document.getElementById(`${id}-text`)
    let text =textelem.innerText
    //text = text.replace(/\(.*?\)/g, '')
    let audio = new SpeechSynthesisUtterance(text)
    audio.lang = 'ja-JP'
    audio.pitch = 1
    audio.rate = 1
    speechSynthesis.speak(audio)
}
async function translate_text(e){
    try{
        let id = (e.currentTarget.id).split("-")[0]
        console.log(id)
        let card = document.getElementById(id)

        let control = card.querySelector(`[id="${id}-control"]`)
        let content = card.querySelector(`[id="${id}-content"]`) 
        const line = card.querySelector(`[id="${id}-line"]`)

        let textelem = card.querySelector(`[id="${id}-text"]`)
        console.dir(card)
        let text = textelem.innerText
        if(content.childNodes.length > 2) return

        //get translation from mymemory api
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|en`)
        const data = await response.json();
        const value = data.responseData.translatedText
        
        // save the new translation to loaded file 
        let loadedfile = store.getCurrent()
        let obj = loadedfile[id-1]
        obj = {...obj, 'translate': value}
        obj.viewed = true
        loadedfile[id-1] = obj
        store.setCurrent(loadedfile)

        //add translation to content
        let translationElem = document.createElement('li')
        translationElem.id= `${id}-translation`
        translationElem.innerText = value
        content.insertBefore(translationElem, control)
        card.classList.add("viewed")
        console.log(value, translationElem)
    }catch(err){
        console.log(err)
    }
}

function loadfile(){

}
display_loaded_file()

