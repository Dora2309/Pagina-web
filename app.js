// Este evento se dispara cuando el contenido HTML ha sido completamente cargado
document.addEventListener('DOMContentLoaded', function() {

    // Obtener referencias a los elementos del DOM
    const contenedorRompecabezas = document.getElementById('puzzle');
    const Mensajes = document.getElementById('mensaje');
    const botonRompecabezas = document.getElementById('puzzle-button');
    const selectorDificultad = document.getElementById('dificultad-selector');

    // Inicializar variables
    let indiceImagenActual = 0;
    let ordenRompecabezas;
    let tamanioRompecabezas = parseInt(selectorDificultad.value, 10);

    // Arreglo de imágenes para el rompecabezas
    const imagenes = ['https://i.pinimg.com/280x280_RS/8e/9c/37/8e9c37c4d9ac23a3ffa82a1010caaa25.jpg', 
                    'https://i.pinimg.com/originals/d6/a0/8d/d6a08d18a260148ccd38dbbaf7159e71.png'];

    // Crear un nuevo rompecabezas al cargar la página
    crearNuevoRompecabezas();

    // Evento que se ejecuta cuando cambia la seleccion de dificultad
    selectorDificultad.addEventListener('change', function() {
        tamanioRompecabezas = parseInt(selectorDificultad.value, 10); //Actualiza el tamaño de las piezas
        contenedorRompecabezas.innerHTML = '';  // Limpiar el contenido actual del contenedor del rompecabezas
        crearNuevoRompecabezas(); // Crear un nuevo con el tamaño actualizado
    });

    // Evento para generar un nuevo rompecabezas con una imagen diferente
    botonRompecabezas.addEventListener('click', function() {
        indiceImagenActual = (indiceImagenActual + 1) % imagenes.length;  // Incrementar el indice de la imagen actual, circular a la siguiente imagen
        contenedorRompecabezas.innerHTML = ''; 
        crearNuevoRompecabezas();
    });

    // Función para crear un nuevo rompecabezas
    function crearNuevoRompecabezas() {
        // Mezclar el orden de las piezas del rompecabezas
        ordenRompecabezas = mezclarArray([...Array(tamanioRompecabezas * tamanioRompecabezas).keys()]);
        const rutaImagen = imagenes[indiceImagenActual]; //Obtiene la ruta de la imagen

        // Establecer el tamaño del rompecabezas dinamicamente
        contenedorRompecabezas.style.gridTemplateColumns = `repeat(${tamanioRompecabezas}, 75px)`;
        contenedorRompecabezas.style.gridTemplateRows = `repeat(${tamanioRompecabezas}, 75px)`;
        document.documentElement.style.setProperty('--tamano-rompecabezas', tamanioRompecabezas);

        // Crear las piezas del rompecabezas
        for (let i = 0; i < tamanioRompecabezas * tamanioRompecabezas; i++) {
            const piezaRompecabezas = document.createElement('div');
            piezaRompecabezas.classList.add('puzzle-piece');
            piezaRompecabezas.style.backgroundImage = `url(${rutaImagen})`;
            piezaRompecabezas.style.backgroundSize = `${75 * tamanioRompecabezas}px ${75 * tamanioRompecabezas}px`;
            piezaRompecabezas.style.backgroundPosition = `-${ordenRompecabezas[i] % tamanioRompecabezas * 75}px -${Math.floor(ordenRompecabezas[i] / tamanioRompecabezas) * 75}px`;
            piezaRompecabezas.setAttribute('draggable', 'true');
            piezaRompecabezas.addEventListener('dragstart', (e) => manejarInicioArrastre(e, i));
            piezaRompecabezas.addEventListener('dragover', (e) => manejarArrastreSobre(e));
            piezaRompecabezas.addEventListener('drop', (e) => manejarSoltar(e, i));
            contenedorRompecabezas.appendChild(piezaRompecabezas);
        }
        Mensajes.textContent = ''; // Limpia mensaje en el contenedor de mensajes
    }

    // Funcion para mezclar un arreglo
    function mezclarArray(arreglo) {
        let indiceActual = arreglo.length;
        let indiceAleatorio;

        while (indiceActual !== 0) {
             // Seleccionar un indice aleatorio
            indiceAleatorio = Math.floor(Math.random() * indiceActual);
            indiceActual--;

             // Intercambiar elementos en las posiciones actuales
            [arreglo[indiceActual], arreglo[indiceAleatorio]] = [arreglo[indiceAleatorio], arreglo[indiceActual]];
        }

        return arreglo;
    }

    // Funcion para manejar el inicio del arrastre de una pieza
    function manejarInicioArrastre(e, indice) {
        // Configurar la informacion que se va a transferir durante el arrastre
        e.dataTransfer.setData('text/plain', indice.toString());
    }

    // Funcion para manejar el evento de arrastre sobre una pieza
    function manejarArrastreSobre(e) {
        e.preventDefault();   // Prevenir el comportamiento predeterminado del navegador durante el arrastre
    }

    // Función para manejar el evento de soltar una pieza
    function manejarSoltar(e, indice) {
        //e.preventDefault();
        const indiceArrastrado = parseInt(e.dataTransfer.getData('text/plain'), 10); // Indice de la pieza arrastrada

        intercambiarPiezas(indiceArrastrado, indice);
        actualizarRompecabezas();

        if (esRompecabezasCompleto()) {
            mostrarMensaje('¡Rompecabezas completado!');
        }
    }

    // Funcion para intercambiar dos piezas del rompecabezas
    function intercambiarPiezas(indice1, indice2) {
        const temp = ordenRompecabezas[indice1]; //Almacena temporalmente el valor de la primera posicion

        //Intercambio de piezas
        ordenRompecabezas[indice1] = ordenRompecabezas[indice2];
        ordenRompecabezas[indice2] = temp;
    }

    // Funcion para actualizar la posicion de las piezas en el rompecabezas
    function actualizarRompecabezas() {
        const Obtenerpiezas = document.querySelectorAll('.puzzle-piece'); 
        Obtenerpiezas.forEach((pieza, indice) => { //Actualiza cada pieza
            pieza.style.backgroundPosition = `-${ordenRompecabezas[indice] % tamanioRompecabezas * 75}px -${Math.floor(ordenRompecabezas[indice] / tamanioRompecabezas) * 75}px`;
        });
    }

    // Funcion para verificar si el rompecabezas esta completo
    function esRompecabezasCompleto() {
        return ordenRompecabezas.every((valor, indice) => valor === indice);
    }

    // Funcion para mostrar un mensaje en el contenedor de mensajes
    function mostrarMensaje(mensaje) {
        Mensajes.textContent = mensaje;
    }
});
