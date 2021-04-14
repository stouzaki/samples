// グローバル変数
var audios = {};
var playNo = 1;
var maxPlayNo;
var $btnPlayPause;
var $iconAllPlay;
var $btnComplete;
// var $speedSlider;
var cntChangeSpeed = 0;

// 初期表示
$(function () {
  // 各部品をJQueryObjectとして取得
  $btnPlayPause = $("#btnPlayPause");
  // $iconAllPlay = $("#icon-allplay");
  // $btnComplete = $("#btn-complete");
  // $speedSlider = $("#speed_slider");

  // Jsonからスクリプトを設定する
  const jsonFullName = getJsonPath("script.json");
  setArticleText(jsonFullName);
});

// 描画完了後（TemplateタグのDom描画も完了した後）
window.onload = function () {
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
      playNo = parseInt(e.currentTarget.id);
      indiviualPlay()
    });

    // 再生終了時イベント（個別）
    audios[id].addEventListener('ended', onPlayEnded);

    // 最後の番号
    maxPlayNo = Object.keys(audios).length;

    // // 最初から全て再生
    // $iconAllPlay.off('click');
    // $iconAllPlay.on('click', function (e) {
    //   // 終了時に次を再生するイベント登録
    //   Object.keys(audios).forEach(key => {
    //     audios[key].addEventListener('ended', onContinuousPlayEnded);
    //   });
    //   // 再生中のものは全て停止
    //   Object.keys(audios).forEach(id => {
    //     let audio = audios[id]
    //     let isPlaying = audio.currentTime > 0 && !audio.paused && !audio.ended;
    //     if (isPlaying) {
    //       audio.pause();
    //       audio.currentTime = 0;
    //     }
    //     let $div = $("#" + id);
    //     $div.removeClass('script-selected');
    //   });

    //   // 最初の音声を再生
    //   playNo = 1;
    //   play();
    // });

    // 再生ボタンイベント
    $btnPlayPause.off('click');
    $btnPlayPause.on('click', function (e) {
      // 終了時に次を再生するイベント登録
      Object.keys(audios).forEach(key => {
        audios[key].addEventListener('ended', onContinuousPlayEnded);
      });
      playPause();
    });


  })
}

// 再生／一時停止
function playPause() {
  if (isPlay()) {
    pause();
  } else {
    play();
  }
  // if ($btnPlayPause.hasClass('play')) {
  //   play();
  // } else {
  //   pause();
  // }
}


// 再生（個別）
function indiviualPlay() {
  // 再生中のものは全て停止
  Object.keys(audios).forEach(id => {
    let audio = audios[id]
    let isPlaying = audio.currentTime > 0 && !audio.paused && !audio.ended;
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
    }
    let $div = $("#" + id);
    $div.removeClass('selected');
  });
  // 連続再生イベント削除
  removeContinuousPlaybackEndedEvent();
  // 再生
  play();
}

// 再生中判定
function isPlay() {
  Object.keys(audios).forEach(id => {
    let audio = audios[id]
    if (audio.currentTime > 0 && !audio.paused && !audio.ended) {
      return true;
    };
  });
  return false;
}

// 再生
function play() {
  let id = ('00' + playNo).slice(-2);
  let audio = audios[id];
  let $div = $("#" + id);
  $('body,html').animate({ scrollTop: $div.offset().top - 180 }, 400, 'swing');
  $div.addClass('selected');
  audio.play();
  // changeDisplayToPause();
}

// 一時停止
function pause() {
  let id = ('00' + playNo).slice(-2);
  let audio = audios[id];
  audio.pause();
  // changeDisplayToPlay();
}

// 連続再生イベント削除
function removeContinuousPlaybackEndedEvent() {
  let id = ('00' + playNo).slice(-2);
  let audio = audios[id];
  audio.removeEventListener('ended', onContinuousPlayEnded)
}

// クエリパラメータから対象フォルダを取得する
function getTargetFolder() {
  let str = "./";
  const queryValues = getQueryParameter();
  queryValues.forEach((value) => {
    str += `${value}/`;
  });
  return str;
}

// 再生終了時イベント（個別再生用）
function onPlayEnded(e) {
  let id = ('00' + playNo).slice(-2);
  let $div = $("#" + id);
  $div.removeClass('selected');
  // changeDisplayToPlay();
}

// 再生終了時イベント（連続再生用）
function onContinuousPlayEnded() {
  // 連続再生イベント削除
  removeContinuousPlaybackEndedEvent();

  if (playNo < maxPlayNo) {
    play(++playNo);
  } else {
    playNo = 1;
    // changeDisplayToPlay();
  }
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
    datas.forEach((data, i) => {
      const target = $("main")[0];
      const content = $("#scriptTemplate")[0].content;

      const clone = document.importNode(content, true);
      clone.querySelector("article").setAttribute("id", ('00' + (i + 1)).slice(-2));
      clone.querySelector("p.ja").textContent = data.ja;
      clone.querySelector("p.en").textContent = data.en;

      target.appendChild(clone);
    });
  });
}
