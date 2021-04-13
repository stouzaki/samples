// グローバル変数
var audios = {};
var playNo = 1;
var maxPlayNo;
var $iconPlayPause;
var $iconAllPlay;
var $btnComplete;
var $speedSlider;
var cntChangeSpeed = 0;


// 初期表示
$(function () {
  // // 各部品をJQueryObjectとして取得
  // $iconPlayPause = $("#icon-play_pause");
  // $iconAllPlay = $("#icon-allplay");
  // $btnComplete = $("#btn-complete");
  // $speedSlider = $("#speed_slider");

  // Jsonから和文英文を設定する
  const jsonFullName = getJsonPath("script.json");
  setArticleText(jsonFullName);

  let $s = $(".script");
  $s.each(function (index, element) {
    let id = $(element).attr('id');
    let audio = new Audio();
    audio.preload = "auto";
    audio.src = getTargetFolder() + id + ".mp3";
    audio.load();
    audios[id] = audio;

    // 再生イベント（個別）
    $(element).off('click');
    $(element).on('click', function (e) {
      // playNo = parseInt(e.currentTarget.id);
      // indiviualPlay()
    });

    // 再生終了時イベント（個別）
    // audios[id].addEventListener('ended', onPlayEnded);
  })


});

// クエリパラメータから対象フォルダを取得する
function getTargetFolder() {
  let str = "./";
  const queryValues = getQueryParameter();
  queryValues.forEach((value) => {
    str += `${value}/`;
  });
  return str;
}


// クエリパラメータからJsonPathを取得する
function getJsonPath(fileName) {
  let str = "./";

  const queryValues = getQueryParameter();
  queryValues.forEach((value) => {
    str += `${value}/`;
  });

  return getTargetFolder() + fileName;
}

// クエリパラメータを取得する
function getQueryParameter() {
  let array = [];

  const queryString = location.search;
  const parameters = queryString.split("&");

  parameters.forEach((parameter) => {
    const value = parameter.split("=")[1];
    array.push(value);
  });

  return array;
}

// Jsonから本文を設定する
function setArticleText(name) {
  $.getJSON(name, (datas) => {
    datas.forEach((data, index) => {
      const target = $("main")[0];
      const content = $("#scriptTemplate")[0].content;

      const clone = document.importNode(content, true);
      clone.querySelector("article").setAttribute("id", ('00' + index).slice(-2));
      clone.querySelector("p.ja").textContent = data.ja;
      clone.querySelector("p.en").textContent = data.en;

      target.appendChild(clone);
    });
  });
}
