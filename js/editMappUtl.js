/**
 * Общие функции для работы с картами
 * Версия 1.0
 */

function mapsUrl(g_lat, g_lon) {
  /*Блок с ссылками на ресурсы с картами*/
  var C_TARGET = 'target = "_blank"';
  var C_ICON_W = 'width="20"';
  var C_SCALE = 16;
  var urlGoogle =
    '<a href = "http://www.google.com/maps?q=' +
    g_lat +
    "," +
    g_lon +
    '" ' +
    C_TARGET +
    '><img src="http://www.google.com/favicon.ico"' +
    C_ICON_W +
    " ></a>";
  var urlOstreet =
    '<a href = "https://www.openstreetmap.org/#map=' +
    C_SCALE +
    "/" +
    g_lat +
    "/" +
    g_lon +
    '" ' +
    C_TARGET +
    '><img src="https://openstreetmap.org/favicon.ico" ' +
    C_ICON_W +
    " ></a>";
  var urlOSMAND =
    '<a href = "https://osmand.net/go?lat=' +
    g_lat +
    "&lon=" +
    g_lon +
    "&z=" +
    C_SCALE +
    '" ' +
    C_TARGET +
    '><img src="https://osmand.net/images/favicons/favicon.ico" ' +
    C_ICON_W +
    " ></a>";
  var urlYandex =
    '<a href = "https://yandex.ru/maps?pt=' +
    g_lon +
    "," +
    g_lat +
    "&z=" +
    C_SCALE +
    '" ' +
    C_TARGET +
    '><img src="https://yandex.ru/maps/favicon.ico" ' +
    C_ICON_W +
    " ></a>";
  var urlYandexW =
    '<a href = "https://yandex.ru/pogoda/maps/nowcast?lat=' +
    g_lat +
    "&lon=" +
    g_lon +
    '"' +
    C_TARGET +
    '><img src="https://yandex.ru/pogoda/favicon.ico" ' +
    C_ICON_W +
    " ></a>";
  var urlWindy =
    '<a href = "https://windy.com/' +
    g_lat +
    "/" +
    g_lon +
    "&z=" +
    C_SCALE +
    '" ' +
    C_TARGET +
    '><img src="https://windy.com/favicon.ico" ' +
    C_ICON_W +
    " ></a>";

  var url =
    urlGoogle + urlOstreet + urlOSMAND + urlYandex + urlYandexW + urlWindy;
  return decodeURI(url);
}
