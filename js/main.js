import CardDom from './dom/card.js'
import Store from './store/store.js'
let upload = document.getElementById("upload")
let saveBtn = upload.getElementsByTagName("button")[0]
let uploadFile = document.getElementById("uploadfile")
let loadedfile = document.getElementById("loadedfile")

const store = new Store()

uploadFile.addEventListener('change', load)
saveBtn.addEventListener('click', save)


function load(){

    let filename = uploadFile.files[0]
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
    let showinfo = document.getElementById('showinfo')
    let addshow = document.getElementById('addshow')
    addshow.classList.add('hidden')
    showinfo.classList.add('hidden')
    loadedfile.classList.remove('hidden')
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
    }catch(err){
        console.log(err)
    }
}

function save(){
    showSaveForm()
}
function showSaveForm(){
    loadedfile.classList.add('hidden')
    let form = document.getElementById('addshow')
    form.innerHTML = ""
    form.classList.remove('hidden')
    let add = document.createElement('button')
    add.innerText = "add"
    add.addEventListener('click', addShow)
    let show = document.createElement('input')
    show.setAttribute('type', 'text')
    show.setAttribute('placeholder', 'show')
    show.id = 'show'
    let season = document.createElement('input')
    season.setAttribute('type', 'text')
    season.setAttribute('placeholder', 'season')
    season.id = 'season'
    let episode = document.createElement('input')
    episode.setAttribute('type', 'text')
    episode.setAttribute('placeholder', 'episode')
    episode.id = 'episode'

    form.appendChild(show)
    form.appendChild(season)
    form.appendChild(episode)
    form.appendChild(add)
    console.log(store.getShows())
}
function addShow(){
    let show = document.getElementById('show')
    let season = document.getElementById('season')
    let episode = document.getElementById('episode')
    let showinfo = document.getElementById('showinfo')
    let addshow = document.getElementById('addshow')
    showinfo.innerHTML = ""
    showinfo.classList.add('hidden')
    addshow.innerHTML = ""
    addshow.classList.add('hidden')
    store.addShow(show.value, season.value, episode.value)
    display_loaded_file()
}
function displayShows(){
    let shows = store.getShows()
    console.log(shows)
    if (!shows) return
    let showslist = document.getElementById('showslist')
    shows.forEach(show => {
        let li = document.createElement('li')
        li.innerText = show
        li.addEventListener('click', (e)=>displayShow(show))
        showslist.appendChild(li)
    });
}
function displayShow(show){
    let seasons = store.getSeasons(show)
    let showinfo = document.getElementById('showinfo')
    showinfo.classList.remove('hidden')
    showinfo.innerHTML = ""
    let seasoninfo = document.getElementById('seasoninfo')
    seasoninfo.innerHTML = ""
    seasoninfo.classList.add('hidden')
    seasons.forEach(season => {
        let li = document.createElement('li')
        li.innerText = "season "+season
        li.addEventListener('click', (e)=>{displaySeason(season, show)})
        showinfo.appendChild(li)
    });
    console.log(seasons)
}
function displaySeason(season, show){
    console.log(season)
    let episodes = store.getEpisodes(show, season)
    let seasoninfo = document.getElementById('seasoninfo')
    seasoninfo.innerHTML = ""
    seasoninfo.classList.remove('hidden')
    console.log(episodes)
    episodes.forEach(episode => {
        let li = document.createElement('li')
        li.innerText = episode
        li.addEventListener('click', (e)=>{displaySubtitiles(show, season, episode)})
        seasoninfo.appendChild(li)
        console.log(episode)
    });
}
function displaySubtitiles(show, season, episode){
    let showinfo = document.getElementById('showinfo')
    showinfo.classList.add('hidden')
    let seasoninfo = document.getElementById('seasoninfo')
    seasoninfo.classList.add('hidden')
    let filekey = `${show}-${season}-${episode}`
    let file = store.get(filekey)
    store.setCurrent(file)
    let loadedfile = document.getElementById('loadedfile')
    display_loaded_file()
    loadedfile.classList.remove('hidden')
    console.log(file)
}
showSaveForm()
displayShows()
display_loaded_file()

