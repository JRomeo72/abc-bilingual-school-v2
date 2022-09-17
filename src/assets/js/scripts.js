// ? Animacion de los elementos con el Scroll 
export const contentWayPointAnimalo = () => {

    function easeInOutExpo(t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	}

    var waypoints = document.querySelectorAll('.animalo');
    waypoints.forEach( waypoint => {
        let _waypoint = new Waypoint ({
            element: waypoint,
            handler: function(direction){

                if(direction === 'down' && !this.element.classList.contains('animated')){

                    waypoint.classList.add('item-animate');
                    
                    setTimeout(() => {
                        let el = document.querySelectorAll('.animalo.item-animate');
                        let largo = el.length;
                        el.forEach((e, index) =>{
                            setTimeout( () => {
                                let effect = e.dataset.animateEffect;
                                e.classList.add(effect, 'animated');
                                e.classList.remove('item-animate');
                            }, (index + 1) * 350 , easeInOutExpo(index, 1, 100, largo));

                        })

                    }, 300);
                }
            }, offset: '90%'
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

            setInterval(() => {
                if ( document.documentElement.scrollTop == 0 ) resolve(true);
            }, 10);

            
        }else{
            resolve(true);
        }

    } )

}