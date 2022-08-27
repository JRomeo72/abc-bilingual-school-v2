// ? Animacion de los elementos con el Scroll 
export const contentWayPointAnimalo = () => {

    var waypoints = document.querySelectorAll('.animalo');
    waypoints.forEach( waypoint => {
        let _waypoint = new Waypoint ({
            element: waypoint,
            handler: function(direction){

                if(direction === 'down' && !this.element.classList.contains('animated')){

                    waypoint.classList.add('item-animate');
                    
                    setTimeout(() => {
                        let el = document.querySelectorAll('.animalo.item-animate');

                        el.forEach((e, index) =>{
                            
                            setTimeout( () => {
                                let effect = e.dataset.animateEffect;
                                e.classList.add(effect, 'animated');
                                e.classList.remove('item-animate');
                            },  index * 350 , 'easeInOutExpo');

                        })

                    }, 100);
                }
            }, offset: '95%'
        })
    } )
}


// ? Agrega o remueve la clase 'active' en los dropdown-toggles del Navbar 
export const menuRemoveClass = (clase) => {
    const _link1 = document.querySelectorAll('.dropdown-toggle');
    _link1.forEach( e => e.classList.remove('active') );
    if(clase) {
        const _link2 = document.querySelectorAll(clase);
        _link2.forEach( e => e.classList.add('active') );
    }
}


// ? Me lleva al inicio de la página si el scroll es mayor a cero 
export const goScrollUp = () => {

    return new Promise( ( resolve, reject ) => {

        if ( document.documentElement.scrollTop > 0 ) {
    
            window.scrollTo({
                top:0,
                left:0,
                behavior:"smooth"
            })
            resolve(1000);
        }else{
            resolve(100); 
        }
    } )

}