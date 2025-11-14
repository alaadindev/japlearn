export default class Store{
    constructor(){

    }
    getCurrent(){
        return this.get('loaded')
    }
    get(value){
        return JSON.parse(localStorage.getItem(value))
    }
    getShows(){
        let keys = this.getkeys()
        let shows = []
        for (let i =0; i< keys.length; i++){
            let show = keys[i].split('-')[0]
            if (!shows.includes(show)){
                shows.push(show)
            }
        }
        return shows
    }
    getSeasons(show){
        let keys = this.getkeys()
        let seasons = []
        for (let i =0; i< keys.length; i++){
            let info = keys[i].split('-')
            if (show==info[0]){
                if (!seasons.includes(info[1])){
                    seasons.push(info[1])
                }
            }
        }
        console.log(seasons)
        return seasons.sort()
    }
    getEpisodes(show, season){
        let keys = this.getkeys()
        let episodes = []
        for (let i=0; i<keys.length;i++){
            let info = keys[i].split('-')
            if (show == info[0] && season == info[1] && !episodes.includes(info[2])){
                episodes.push(info[2])
            }
        }
        return episodes.sort()
    }
    getkeys(){
        let keys = []
        for (let i=0;i < localStorage.length; i++){
            keys.push(localStorage.key(i))
        }
        return keys.filter(key => key !='loaded')
    }
    addShow(show, season, episode){
        let key = `${show}-${season}-${episode}`
        this.set(key, this.getCurrent())
    }
    setCurrent(value){
        this.set('loaded', value)
    }
    set(key, value){
        localStorage.setItem(key, JSON.stringify(value))
    }
}