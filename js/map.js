/**
 * Скрипт для создания карты
 * Версия 2.0
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
  let val = urlDopEncode(resultList[key]["foto"]);
  cimg.src = val;
  cbtn.style.visibility = "hidden";
}

/*Иконка для точки */

function getIcon(path) {
  var icon_ = L.icon({
    iconUrl: path,
    iconSize: [50, "auto"], // size of the icon
    iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor: [25, 25], // point from which the popup should open relative to the iconAnchor
  });
  return icon_;
}
function getIconStaticFoto() {
  var icon_ = L.icon({
    iconUrl: "./src/foto32.png",
    iconSize: [32, 32], // size of the icon
    iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor: [16, 16], // point from which the popup should open relative to the iconAnchor
  });
  return icon_;
}

/* Добавление точки на карту */
function pointadd(lat, lon, path, iconpath, key) {
  if (!(isNaN(lat) || isNaN(lon))) {
    var marker_ = L.marker([lat, lon], {}).addTo(visiomap);
    var icon_ = getIcon(iconpath);
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
      ')"><div class="text_link">Показать фото</div></button> <img class="foto" id="foto_' +
      key +
      '" src="" </img>';
    if (LOADFOTO) {
      blockimg =
        '<img class="foto" src="' + path + '" alt="' + path + '" </img>';
    }
    var blockfile =
      '<div class="foto_link"><a href = "' +
      path +
      '" target = "_blank">Просмор в полном размере</a></div>';
    var popupbox = $(
      '<div class="boxFoto" id="popup_' +
        key +
        '" >' +
        blockimg +
        blockfile +
        blockurl +
        "</div>"
    )[0];
    popup_.setLatLng([lat, lon]);
    popup_.setContent(popupbox);
    marker_.bindPopup(popup_);
  }
}

/*Создани групп с треком*/
function setFeature_groups() {
  var overlays = {};
  if (typeof maptracks !== "undefined") {
    for (key in maptracks) {
      // Группа
      var fg = L.featureGroup({}).addTo(visiomap);
      //  Трек
      var track = maptracks[key]["track"];
      var track_line = L.polyline(track["location"], {
        bubblingMouseEvents: true,
        color: track["color"],
        dashArray: null,
        dashOffset: null,
        fill: false,
        fillColor: track["color"],
        fillOpacity: 0.2,
        fillRule: "evenodd",
        lineCap: "round",
        lineJoin: "round",
        noClip: false,
        opacity: track["opacity"],
        smoothFactor: 1.0,
        stroke: true,
        weight: track["weight"],
      }).addTo(fg);
      // Маркеры
      var markers = maptracks[key]["markers"];
      if (typeof markers !== "undefined") {
        for (mkey in markers) {
          if (mkey === "circlemarkers") {
            var points = markers[mkey]["points"];
            var i = 0;
            for (p in points) {
              var circle_marker = L.circleMarker(points[p]["location"], {
                bubblingMouseEvents: true,
                color: markers[mkey]["color"],
                dashArray: null,
                dashOffset: null,
                fill: true,
                fillColor: markers[mkey]["fill_color"],
                fillOpacity: markers[mkey]["fill_opacity"],
                fillRule: "evenodd",
                lineCap: "round",
                lineJoin: "round",
                opacity: 1.0,
                radius: markers[mkey]["radius"],
                stroke: true,
                weight: 3,
              }).addTo(fg);
              var cmpopup = L.popup({ maxWidth: "100%" });
              i += 1;
              var htmlPop = $(
                `<div id="html_` +
                  i +
                  `" style="width: 100.0%; height: 100.0%;">` +
                  points[p]["popup"] +
                  `</div>`
              )[0];
              cmpopup.setContent(htmlPop);
              circle_marker.bindPopup(cmpopup);
            }
          }
          if (mkey === "markers") {
            var points = markers[mkey]["points"];
            var i = 0;
            for (p in points) {
              var marker = L.marker(points[p]["location"], {}).addTo(fg);
              var icon = L.AwesomeMarkers.icon({
                extraClasses: "fa-rotate-0",
                icon: markers[mkey]["icon"],
                iconAnchor: markers[mkey]["icon_anchor"],
                iconColor: markers[mkey]["icon_color"],
                iconSize: markers[mkey]["icon_size"],
                markerColor: markers[mkey]["color"],
                prefix: markers[mkey]["prefix"],
                shadowSize: markers[mkey]["shadow_size"],
              });
              marker.setIcon(icon);

              var cmpopup = L.popup({ maxWidth: "100%" });
              i += 1;
              var htmlPop = $(
                `<div id="html_` +
                  i +
                  `" style="width: 100.0%; height: 100.0%;">` +
                  points[p]["popup"] +
                  `</div>`
              )[0];
              cmpopup.setContent(htmlPop);
              marker.bindPopup(cmpopup);
            }
          }
        }
      }

      overlays[maptracks[key]["caption"]] = fg;
    }
  }
  return overlays;
}
/* Создание карты с меткой*/
function visiomapadd(lat, lon, path, iconpath, mapId) {
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
  //Добавляю панели
  visiomaplayerCylosm.addTo(visiomap);
  visiomaplayerGoogle.addTo(visiomap);
  visiomaplayerOSN.addTo(visiomap);
  // Панель полный экран
  L.control
    .fullscreen({
      forceSeparateButton: true,
      position: "topright",
      title:
        "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u043d\u0430 \u043f\u043e\u043b\u043d\u043e\u043c \u044d\u043a\u0440\u0430\u043d\u0435",
      titleCancel:
        "\u041d\u0430\u0436\u043c\u0438 \u0434\u043b\u044f \u0432\u044b\u0445\u043e\u0434\u0430",
    })
    .addTo(visiomap);

  // Панель управления
  var layer_control = {
    // Панель управления слоями из layers.js
    base_layers: {
      OpenStreet: visiomaplayerOSN,
      CyclOSM: visiomaplayerCylosm,
      Google: visiomaplayerGoogle,
    },
    overlays: {},
  };
  layer_control.overlays = setFeature_groups();
  L.control
    .layers(layer_control.base_layers, layer_control.overlays, {
      autoZIndex: true,
      collapsed: true,
      position: "topright",
    })
    .addTo(visiomap);
  visiomaplayerCylosm.remove();
  visiomaplayerGoogle.remove();

  if (!isEmpty) {
    // Добавляю метку
    pointadd(lat, lon, path, iconpath, 0);
  }
}
