/* Configuraciones */
let sliderPlayState = false; // Estado del Slider
let sliderImagenActual = 1; // Imagen actual
let sliderTimer = 5000; // Slider default timer
const databaseUrl = "../site/database/"; // URL de las bases de datos
let AlbumId = "demo"; // ID del Album
let Album = null;
let Fotografo = null;
const debbugMode = true; // Modo desarrollo
const iconsUrl = "../site/images/iconos/";

/**
 ** Elementos del DOM
 */
const ventanas = [...document.querySelectorAll(".ventana")];
const ventanaInfo = document.getElementById("info");
const ventanaSlider = document.getElementById("slider");
const ventanaGaleria = document.getElementById("galeria");
const masOpciones = document.querySelector("#slider .opciones");

const btnToggle = document.getElementById("btnToggle");
const sliderImage = document.getElementById("imagen");

/* INICIA LA APP */
document.addEventListener("DOMContentLoaded", function () {
  if (debbugMode) console.log("Iniciando App");
  obtenerDatosDelAlbum();
  abrirVentana("info");

  // abrirVentana("galeria");
});

/**
 * ! Acciones del usuario
 */
/* Abre una ventana */
function abrirVentana(name) {
  name === "slider" ? Slider.Play() : Slider.Pausa();
  const ventana = document.getElementById(name);
  if (!ventana) {
    console.error(`No existe la ventana ${name}`);
    return false;
  }
  ventanas.forEach((item) => (item.style.display = "none"));
  ventana.style.display = "grid";
}
/* Mostrar más opciones */
function toggleOpciones() {
  let open = masOpciones.classList.contains("active");
  if (debbugMode) console.log(open);

  if (!open) {
    Slider.Pausa();
    masOpciones.classList.add("active");
  } else {
    Slider.Play();
    masOpciones.classList.remove("active");
  }
}
function descargarImage() {
  const imgSrc = `//${Album.cfg.url}${sliderImagenActual}${Album.cfg.tipo}`;
  const imgName = `${Album.titulo}_${sliderImagenActual}${Album.cfg.tipo}`;
  const link = document.createElement("a");
  link.setAttribute("href", imgSrc);
  link.setAttribute("target", "_blank");
  link.download = imgName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * ! Funciones del Slider
 */

const Slider = {
  Play: () => {
    if (debbugMode) console.info("sliderPlay()");
    sliderPlayState = true;
    btnToggle.children[0].src = iconsUrl + "pausa.svg";
  },

  Pausa: () => {
    if (debbugMode) console.info("sliderPausa()");
    sliderPlayState = false;
    btnToggle.children[0].src = iconsUrl + "play.svg";
  },

  Toggle: () => {
    if (sliderPlayState) Slider.Pausa();
    else Slider.Play();
  },

  ProximaImagen: () => {
    if (sliderImagenActual === Album.cfg.fotos) sliderImagenActual = 1;
    else sliderImagenActual++;
    Slider.CambiarImagen(sliderImagenActual);
  },

  CambiarImagen: (img) => {
    sliderImagenActual = img;
    const imgSrc = `//${Album.cfg.url}${sliderImagenActual}${Album.cfg.tipo}`;
    if (debbugMode) console.info(`Cambiando a imagen: ${imgSrc}`);
    sliderImage.src = imgSrc;
  },
};

// /**
//  *  ! Funciones del Slider
//  */
// /* Cambia estado de la Reproducción */
// function sliderToggle() {
//   if (sliderPlayState) sliderPausa();
//   else sliderPlay();
// }
// /* Inica Reproducción */
// function sliderPlay() {
//   if (debbugMode) console.info("sliderPlay()");
//   sliderPlayState = true;
//   btnToggle.children[0].src = iconsUrl + "pausa.svg";
// }

// /* Pausa Reproducción */
// function sliderPausa() {
//   if (debbugMode) console.info("sliderPausa()");
//   sliderPlayState = false;
//   btnToggle.children[0].src = iconsUrl + "play.svg";
// }
// /* Proxima imagen */
// function sliderProximaImagen() {
//   if (sliderImagenActual === Album.cfg.fotos) sliderImagenActual = 1;
//   else sliderImagenActual++;
//   sliderCambiarImagen(sliderImagenActual);
// }
// /* Cambia a una imagen */
// function sliderCambiarImagen(img) {
//   sliderImagenActual = img;
//   const imgSrc = `//${Album.cfg.url}${sliderImagenActual}${Album.cfg.tipo}`;
//   if (debbugMode) console.info(`Cambiando a imagen: ${imgSrc}`);
//   sliderImage.src = imgSrc;
// }

/**
 * ! Funciones del Album
 */
/* Carga Datos de la ventana Info */
function cargarDatosDelAlbum() {
  if (!Album.id) return false;
  // const primeraImagen = `//${Album.cfg.url}1${Album.cfg.tipo}`;
  //const primeraImagen = `https://storage.googleapis.com/mialbum.ga/${Album.id}/imgs/1${Album.cfg.tipo}`;
  //ventanaInfo.style.backgroundImage = `url(${primeraImagen})`;
  //sliderImage.src = primeraImagen;
  ventanaSlider.style.setProperty(
    "--fotografo",
    '"Ⓒ ' + Fotografo.nombre + '"'
  );

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
        <p class="alb-Fotos">
          ${Album.cfg.fotos} imágenes, 
          ${Math.round((Album.cfg.fotos * Album.cfg.timer) / 1000 / 60)}
          min. de reproducción</p>
        <button id="iniciarSlider" 
          class="shadow" 
          onclick="abrirVentana('slider');toggleFullScreen()">Iniciar álbum</button>
        <h1 class="fot-Nombre">${Fotografo.nombre}</h1>
        <p class="fot-web">
          <a href="${Fotografo.web}" target="_blank" rel="noopener noreferrer">
          ${Fotografo.web}</a>
        <p class="fot-Tel">
          <a href="tel:+${Fotografo.telelefono}">Tel:${Fotografo.telelefono}</a>
        </p>
        <p class="fot-email">
          <a href="mailto:${Fotografo.email}">${Fotografo.email}</a>
        </p>
        `;
  const container = document.querySelector("#info > div");
  container.innerHTML = html;
}

function cargarGaleria() {
  const urlImgs = `https://storage.googleapis.com/mialbum.ga/${Album.id}/imgs`;
  // Ventana Info
  const primeraImagen = `${urlImgs}/1${Album.cfg.tipo}`;
  ventanaInfo.style.backgroundImage = `url(${primeraImagen})`;
  sliderImage.src = primeraImagen;

  let container = document.querySelector("#galeria .container");

  for (let i = 1; i <= Album.cfg.fotos; i++) {
    const el = document.createElement("img");
    // el.setAttribute("src", `//${Album.cfg.url + i + Album.cfg.tipo}`);
    el.setAttribute(
      "src",
      `https://storage.googleapis.com/mialbum.ga/${Album.id}/imgs/${
        i + Album.cfg.tipo
      }`
    );
    el.setAttribute("alt", Album.titulo);
    el.setAttribute(
      "onclick",
      `Slider.CambiarImagen(${i});abrirVentana('slider')`
    );
    container.appendChild(el);
  }
}

/* Obtiene los datos del Album */
function obtenerDatosDelAlbum() {
  /*
  albumId = window.location.pathname
    .split("/")
    .filter((el) => !!el)
    .slice(-1)[0];
  */
  albumId = window.location.hash.replace("#", "");

  console.info(`Obteniendo datos del álbum ${albumId}`);

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
      if (debbugMode) console.info("Álbum", Album);
      // Datos del Fotografo
      if (Album.id !== albumId)
        throw new Error(`No existe el álbum ${albumId}`);
      Fotografo = data[1].filter((item) => item.id === Album.fid)[0];
      if (debbugMode) console.info("Fotógrafo:", Fotografo);
      cargarDatosDelAlbum();
      cargarGaleria();
    }
  );
}

/**
 ** Utilidades Varias
 */

/* Funcion Interval */
setInterval(() => {
  if (!Album) return false;
  if (sliderPlayState) Slider.ProximaImagen();
}, sliderTimer);

/* Regista mensajes en console */
/*
function log(msg) {
  if (debbugMode) console.log(msg);
}
*/
/* Get JSon */
async function getJson(db) {
  try {
    if (debbugMode)
      console.info(`Obteniendo base de datos: ${databaseUrl + db}`);
    let response = await fetch(databaseUrl + db);
    return await response.json();
  } catch (err) {
    console.error("database:" + databaseUrl + db);
    console.error(err);
  }
}

function toggleFullScreen() {
  if (debbugMode) return false;
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
