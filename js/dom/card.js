export default class CardDom{
    constructor(elem){
        this.loadtags(elem)
    }
    loadContent(data){
        this.line.innerText = data.line
        this.start.innerText = data.start
        this.end.innerText = data.end
        this.text.innerText = data.text
        this.translation.innerText = data.translate ?? null
    }
    loadtags(elem){
        let id = elem.line
        this.card = document.createElement('div')
        this.details = document.createElement('div')
        this.content = document.createElement('div')
        this.control = document.createElement('div')
        this.card.className = "card"
        this.control.className = "control"
        this.details.className = "details"
        this.content.className = "content"

        this.line = document.createElement('li')
        this.start = document.createElement('li')
        this.end = document.createElement('li')
        this.text = document.createElement('li')
        this.translation = document.createElement('li')

        this.translateBtn = document.createElement('button')
        this.playBtn = document.createElement('button')
        this.translateBtn.innerText = 'translate'
        this.playBtn.innerText = 'play'

        this.card.id = id
        this.control.id = id + '-control'
        this.details.id = id + '-details'
        this.content.id = id + '-content'
        this.line.id = id + "-line"
        this.start.id = id + "-start"
        this.end.id = id + "-end"
        this.text.id = id + "-text"
        this.translation.id = id + "-translation"
        this.translateBtn.id = id + "-translateBtn"
        this.playBtn.id = id + '-playBtn'

        this.loadContent(elem)

        this.control.appendChild(this.playBtn)
        this.control.appendChild(this.translateBtn)
        this.details.appendChild(this.line)
        this.details.appendChild(this.start)
        this.details.appendChild(this.end)
        this.content.appendChild(this.text)
        if (this.translation.innerText){
            console.log(this.translation.innerText)
            this.content.appendChild(this.translation)
        }
        this.content.appendChild(this.control)
        this.card.appendChild(this.details)
        this.card.appendChild(this.content)
    }
}