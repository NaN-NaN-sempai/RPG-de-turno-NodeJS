var weapons = require("../weapons");
var races = require("../races")
var generateRandomName = require("../myModules/randomNameGenerator");

var parseIndexToObject = (index, list) => {
    var obj = typeof index == "string"? list.find(e=>e.id == index.toLowerCase()):
              typeof index == "number"? list[index]: 
              index;

    if(typeof obj == "undefined") throw "Objeto não encontrado";

    return obj;
}

class weapon{
    constructor(index){
        Object.assign(this, parseIndexToObject(index, weapons));
    }
}

class race {
    constructor(index){
        this.race = {}
        Object.assign(this.race, parseIndexToObject(index, races));
    }
}

class entity extends race {
    constructor(obj){
        if(typeof obj != "object") throw "O constructor precisa receber valores em Objetos";

        super(obj.race || "Human");

        this.name = obj.name || generateRandomName();

        this.fullHp = obj.fullHp || 100;
        this.hp = obj.hp || this.fullHp;

        this.fullMp = obj.fullMp || 100;
        this.mp = obj.mp || this.fullMp;

        this.weaponId = 0;
        this.inventory = [];
        var pushWeapon = (weaponName) => { 
            var newWeapon = new weapon(weaponName);
            newWeapon.index = this.weaponId++;
            this.inventory.push(newWeapon);
        }
        pushWeapon(obj.firstWeapon || "Hands");

        obj.inventory?.forEach(e=>{
            pushWeapon(e);
        });
        this.equipedIndex = obj.equiped || 0;

        obj.resistences = {}
        obj.status = {}

        this.status = {
            str: obj.status.str/* ,
            dex: obj.status.dex,
            int: obj.status.int,
            fai: obj.status.fai, */
        }

        this.resistences = {
            heat: obj.resistences.heat/* , 
            cold: obj.resistences.cold,
            poison: obj.resistences.poison,
            darkness: obj.resistences.darkness,
            holy: obj.resistences.holy */
        }
    }
}

module.exports = {
    weapon: weapon,
    race: race,
    entity: entity
} 