
import gameEngine from './gameEngine'
import entity from './entity'

window.addEventListener("load", () => {
        var ent = new entity ();
    console.log (ent)    
    console.log('update' in ent);
});

