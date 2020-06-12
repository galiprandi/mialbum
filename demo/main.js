/* Configuraciones */
let sliderPlayState = false; // Estado del Slider
let sliderImagenActual = 1; // Imagen actual
let sliderTimer = 5000; // Slider default timer
const databaseUrl = "../site/database/"; // URL de las bases de datos
let AlbumId = "09102005"; // ID del Album
let Album = null;
let Fotografo = null;
const debbugMode = true; // Modo desarrollo
const iconsUrl = "/site/images/iconos/";

/**
 ** Elementos del DOM
 */
const ventanas = [...document.querySelectorAll(".ventana")];
const ventanaInfo = document.getElementById("info");
const ventanaSlider = document.getElementById("slider");
const ventanaGaleria = document.getElementById("galeria");

const btnToggle = document.getElementById("btnToggle");
const sliderImage = document.getElementById("imagen");

/* INICIA LA APP */
document.addEventListener("DOMContentLoaded", function () {
  log("Iniciando App");
  obtenerDatosDelAlbum();
  abrirVentana("info");

  abrirVentana("slider");
});

/**
 * ! Acciones del usuario
 */
/* Abre una ventana */
function abrirVentana(name) {
  name === "slider" ? sliderPlay() : sliderPausa();
  const ventana = document.getElementById(name);
  if (!ventana) {
    console.error(`No existe la ventana ${name}`);
    return false;
  }
  ventanas.forEach((item) => (item.style.display = "none"));
  ventana.style.display = "grid";
}

/**
 *  ! Funciones del Slider
 */
/* Cambia estado de la Reproducción */
function sliderToggle() {
  if (sliderPlayState) sliderPausa();
  else sliderPlay();
}
/* Inica Reproducción */
function sliderPlay() {
  log("sliderPlay");
  sliderPlayState = true;
  btnToggle.src = iconsUrl + "play.svg";
}

/* Pausa Reproducción */
function sliderPausa() {
  log("sliderPausa");
  sliderPlayState = false;
  btnToggle.src = iconsUrl + "pause.svg";
}
/* Proxima imagen */
function sliderProximaImagen() {
  if (sliderImagenActual === Album.cfg.fotos) sliderImagenActual = 1;
  else sliderImagenActual++;
  sliderCambiarImagen(sliderImagenActual);
}
/* Cambia a una imagen */
function sliderCambiarImagen(img) {
  sliderImagenActual = img;
  const imgSrc = `//${Album.cfg.url}${sliderImagenActual}${Album.cfg.tipo}`;
  log(`Cambiando a imagen: ${imgSrc}`);
  sliderImage.src = imgSrc;
}

/**
 * ! Funciones del Album
 */
/* Carga Datos de la ventana Info */
function cargarDatosDelAlbum() {
  if (!Album.id) return false;
  const primeraImagen = `//${Album.cfg.url}1${Album.cfg.tipo}`;
  ventanaInfo.style.backgroundImage = `url(${primeraImagen})`;
  sliderImage.src = primeraImagen;

  sliderTimer = Album.cfg.timer;
  let fecha = new Date(Album.fecha);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const html = `
        <h1 class="alb-Titulo">${Album.titulo}</h1>
        <p class="alb-Fecha">${fecha.toLocaleDateString("es-AR", options)}</p>
        <p class="alb-Lugar">${Album.lugar}</p>
        <p class="alb-Fotos">${Album.cfg.fotos} imágenes, ${
    (Album.cfg.fotos * Album.cfg.timer) / 1000 / 60
  } min. de reproducción</p>
        <button id="iniciarSlider" class="shadow" onclick="abrirVentana('slider')">Iniciar álbum</button>
        <h1 class="fot-Nombre">${Fotografo.nombre}</h1>
        <p class="fot-web"><a href="${Fotografo.web}">${Fotografo.web}</a></p>
        <p class="fot-Tel"><a href="tel:${Fotografo.telelefono}">Tel: ${
    Fotografo.telelefono
  }</a></p>
        <p class="fot-email"><a class="fot-email" href="mailto:${
          Fotografo.email
        }">${Fotografo.email}</a></p>
  `;
  const container = document.querySelector("#info > div");
  container.innerHTML = html;
}

/* Obtiene los datos del Album */
function obtenerDatosDelAlbum() {
  albumId = window.location.pathname.replaceAll("/", "");
  console.info(`Obtener Datos del Album ${albumId}`);

  Promise.all([getJson("albumes.json"), getJson("fotografos.json")]).then(
    (data) => {
      // Datos del Album

      Album = data[0].filter((item) => item.id === albumId)[0];
      if (!Album) {
        console.error("No se encuentra el álbum ID: " + albumId);
        const container = document.querySelector("#info > div");
        container.innerHTML = `<h1>No existe el álbum ${albumId}</h1>`;
        abrirVentana("info");
        return false;
      }
      console.log("Album", Album);
      // Datos del Fotografo
      if (Album.id !== albumId)
        throw new Error(`No existe el álbum ${albumId}`);
      Fotografo = data[1].filter((item) => item.id === Album.fid)[0];
      log(Fotografo);
      cargarDatosDelAlbum();
    }
  );
}

/**
 ** Utilidades Varias
 */

/* Funcion Interval */
setInterval(() => {
  if (!Album) return false;
  if (sliderPlayState) sliderProximaImagen();
}, sliderTimer);

/* Regista mensajes en console */
function log(msg) {
  if (debbugMode) console.log(msg);
}

/* Get JSon */
async function getJson(db) {
  try {
    log(`Obteniendo base de datos: ${databaseUrl + db}`);
    let response = await fetch(databaseUrl + db);
    return await response.json();
  } catch (err) {
    console.error("database:" + databaseUrl + db);
    console.error(err);
  }
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
