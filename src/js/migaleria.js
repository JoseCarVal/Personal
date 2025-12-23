const galeria = document.getElementById("galeria");
const modal = document.getElementById("modal");
const imgModal = document.getElementById("imgModal");

const imagenes = [];
for (let i = 1; i <= 18; i++) {
    imagenes.push(`imagenes/foto${i}.jpeg`);
}

let visibles = 4;
const incremento = 4;

function cargarImagenes() {
    galeria.innerHTML = "";
    for (let i = 0; i < visibles && i < imagenes.length; i++) {
        const contenedor = document.createElement("div");
        contenedor.className = "contenedor-img";

        const img = document.createElement("img");
        img.src = imagenes[i];
        img.onclick = () => abrirModal(imagenes[i]);

        contenedor.appendChild(img);
        galeria.appendChild(contenedor);
    }
}

function mostrarMas() {
    visibles += incremento;
    cargarImagenes();
}

function abrirModal(src) {
    imgModal.src = src;
    modal.style.display = "flex";
}

function cerrarModal() {
    modal.style.display = "none";
}

function irInicio() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

cargarImagenes();