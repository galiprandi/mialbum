console.clear();

let Albumes, Fotografos;

var app = new Vue({
  el: "#app",
  data: {
    Albumes: false,
    Fotografos: false,
    album: {
      fecha: new Date().toISOString().slice(0, 10),
      id: this.generarID,
      fid: "1",
      titulo: "Título del evento",
      lugar: "Lugar",
      cfg: {
        activo: true,
        alta: new Date().toISOString().slice(0, 10),
        fotos: 500,
        tipo: ".jpg",
        url: this.urlGen,
        borde: true,
        timer: 6000,
      },
    },
  },
}); // Vue

async function getJson(url) {
  try {
    let response = await fetch(url);
    return await response.json();
  } catch (err) {
    console.error(err);
  }
}

Promise.all([
  getJson("../site/database/albumes.json"),
  getJson("../site/database/fotografos.json"),
]).then((data) => {
  console.info(data);
  app.Albumes = data[0];
  app.Fotografos = data[1];
});

/**
 * !
 * ! Utilidades
 * !
 */
// Devuelve True / False si existe el album id
const isAlbumId = (id) => !!app.Albumes.find((item) => item.id === id);

// Convierte fecha (YYY-MM-DD) a DDMMYYY
const fechaToId = (fecha) => fecha.split("-").reverse().join("");
const copyToClipboard = (str) => {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};
