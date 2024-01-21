// Variables
const buscador = document.querySelector('#termino');
const buttonBuscar = document.querySelector('#buscar');
const resultado = document.querySelector('#resultado');
const paginacion = document.querySelector('#paginacion');
const p = document.createElement('p');

let datosAPI = [];
const elementosPagina = 5;
let numPaginas = 1;

// Eventos
buttonBuscar.addEventListener('click', validar);

// Valida si el campo búsqueda esta relleno
function validar(){
    if(buscador.value == ''){
        // Si está vacío muestra un mensaje de error
        p.classList.add('msgError');
        p.textContent = 'Error!! Introduzca un valor de búsqueda';

        resultado.append(p);

        // Elimina el mensaje de error
        setTimeout(function(){
            p.remove();
        }, 3000);
    } else{
        limpiarHTML();
        datosApi();
    }
}

// Recoge los datos de la api
function datosApi(){
    // API
    const key = '24676213-ef11e2232ab789b6115bc130d';
    const api = `https://pixabay.com/api/?key=${key}&q=${buscador.value}&per_page=${elementosPagina}&page=${numPaginas}`;

    fetch(api)
    .then(respuesta => respuesta.json())
    .then(resultado => {
        datosAPI = resultado.hits; // Almacena los datos de la API en la variable global
        const totalPaginas = Math.ceil(datosAPI.length / elementosPagina);
        mostrarBotonesPaginacion(totalPaginas, datosAPI); 
        functionPaginacion(1); // Mostrar la primera página inialmente
    });
}

// Muestra el resultado de la búsqueda en el html
function mostrarHTML(paginaActual) {
    limpiarHTML();

    paginaActual.forEach(e => {
        resultado.innerHTML += `
            <div class='busqueda'>
                <img src='${e.webformatURL}' class='imgPrincipal'>
                <p class='likes'><strong>Me gusta:</strong> ${e.likes}</p>
                <p class='views'><strong>Veces vista:</strong> ${e.views}</p>
                <button type='button' class='verImagen' onclick='verImagen(${e.id})'>Ver imagen</button>
            </div>
        `;
    });
}

// Muesta la imagen seleccionada en otra ventana
function verImagen(id){
    limpiarHTML();

    // API
    const key = '24676213-ef11e2232ab789b6115bc130d';
    const api = `https://pixabay.com/api/?key=${key}&q=${buscador.value}&per_page=${elementosPagina}&page=${numPaginas}`;

    fetch(api)
    .then(respuesta => respuesta.json())
    .then(resultado => {
        resultado.hits.forEach(e => {
            if(e.id === id){
                window.open(e.largeImageURL);
            }
        })
    });
}

// Funcionamiento de la paginación
function functionPaginacion(pagina) { 
    const indiceInicial = (pagina - 1) * elementosPagina;
    const indiceFinal = indiceInicial + elementosPagina;
    const paginaActual = datosAPI.slice(indiceInicial, indiceFinal); 
    
    limpiarHTML(); 
    mostrarHTML(paginaActual);

    // Actualiza el número de página actual
    numPaginas = pagina; 
}

// Muestra los botones con el número de cada página
function mostrarBotonesPaginacion(totalPaginas, datos) { 
    const botonesPaginacion = document.querySelector('#paginacion');
    botonesPaginacion.innerHTML = ''; 

    for (let i = 1; i <= totalPaginas; i++) {
        const boton = document.createElement('button');
        
        boton.type = 'button';
        boton.classList.add('paginacion');
        boton.textContent = i;

        boton.addEventListener('click', () => {
            functionPaginacion(i);
            // Actualiza los botones de paginación
            mostrarBotonesPaginacion(totalPaginas, datos); 
        });

        botonesPaginacion.appendChild(boton);
    }
}

// Limpia el html
function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}
