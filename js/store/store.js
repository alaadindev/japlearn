export default class Store{
    constructor(){

    }
    getCurrent(){
        return this.get('loaded')
    }
    get(value){
        return JSON.parse(localStorage.getItem(value))
    }
    setCurrent(value){
        this.set('loaded', value)
    }
    set(key, value){
        localStorage.setItem(key, JSON.stringify(value))
    }
}