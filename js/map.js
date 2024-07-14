/**
 * Скрипт для создания карты
 * Версия 1.0
 */
var visiomap;
var defZoom = 3;
var defLat = 49;
var defLon = 69;

L_NO_TOUCH = false;
L_DISABLE_3D = false;

LOADFOTO = true;

/*Дополнительное кодирование файлов */
function urlDopEncode(val) {
  return val.replace("#", "%23");
}

/*Загрузка фото в отложенном режиме */
function showfoto(key) {
  const cimg = document.getElementById("foto_" + key);
  const cbtn = document.getElementById("btnloadfoto_" + key);
  let val = urlDopEncode(resultList[key]["file"]);
  cimg.src = val;
  cbtn.style.visibility = "hidden";
}

/*Иконка для точки */

function getIcon(path) {
  var icon_ = L.icon({
    iconUrl: path,
    iconSize: [32], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
  });
  return icon_;
}
function getIconStaticFoto() {
  var icon_ = L.icon({
    iconUrl: "./src/foto32.png",
    iconSize: [32, 32], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
  });
  return icon_;
}

/* Добавление точки на картку */
function pointadd(lat, lon, path, key) {
  var marker_ = L.marker([lat, lon], {}).addTo(visiomap);
  var icon_ = getIconStaticFoto();
  marker_.setIcon(icon_);
  var popup_ = L.popup({ maxWidth: "100%" });
  var urls = mapsUrl(lat, lon);
  var blockurl =
    '<div class="text_link"><span>На картах:</span><br><nobr>' +
    urls +
    "</nobr></div>";
  var blockimg =
    '<button  id="btnloadfoto_' +
    key +
    '" onClick="showfoto(' +
    key +
    ')"><div class="text_link">Загрузить фото</div></button> <img class="foto" id="foto_' +
    key +
    '" src="" </img>';
  if (LOADFOTO) {
    blockimg =
      '<img class="foto" src="file:/' + path + '" alt="' + path + '" </img>';
  }
  var blockfile =
    '<div class="foto_link"><a href = "' +
    path +
    '" target = "_blank">Просмотр</a></div>';
  var html_ = $(
    '<div onload="showfoto(' +
      key +
      ')"  class="boxFoto" id="html_' +
      key +
      '" >' +
      blockimg +
      blockfile +
      blockurl +
      "</div>"
  )[0];
  popup_.setContent(html_);
  marker_.bindPopup(popup_);
}

/* Создание карты с меткой*/
function visiomapadd(lat, lon, path, mapId) {
  var startlat = defLat;
  var startlon = defLon;
  var zoom_ = defZoom;
  var isEmpty = true;
  if (lat !== 0 && lon !== 0) {
    startlat = lat;
    startlon = lon;
    zoom_ = 12;
    isEmpty = false;
  }

  if (visiomap) {
    visiomap.invalidateSize();
    visiomap.off();
    visiomap.remove();
  }
  // Создаю карту
  visiomap = L.map(mapId, {
    center: [startlat, startlon],
    crs: L.CRS.EPSG3857,
    zoom: zoom_,
    zoomControl: true,
    preferCanvas: false,
  });
  // Добавляем слой
  var visiomaplayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        'Data by \u0026copy; \u003ca href="http://openstreetmap.org"\u003eOpenStreetMap\u003c/a\u003e, under \u003ca href="http://www.openstreetmap.org/copyright"\u003eODbL\u003c/a\u003e.',
      detectRetina: false,
      maxNativeZoom: 18,
      maxZoom: 18,
      minZoom: 0,
      noWrap: false,
      opacity: 1,
      subdomains: "abc",
      tms: false,
    }
  ).addTo(visiomap);
  if (!isEmpty) {
    // Добавляю метку
    pointadd(lat, lon, path, 0);
  }
}
