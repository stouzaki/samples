// グローバル変数
var audios = {};
var playNo = 1;
var maxPlayNo;

// 初期表示イベント登録
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
window.addEventListener("load", onLoad);

/** 初期表示 */
function onDOMContentLoaded() {
  // Jsonからスクリプトを設定する
  const jsonFullName = getSourcePath("script.json");
  setArticleText(jsonFullName);
}

/** 初期表示（描画完了後（TemplateタグのDom描画も完了した後）） */
function onLoad(e) {
  // スクリプトクリック
  setEvent(".script", "click", onClickScript);
  // 再生ボタンイベント
  setEvent("#btnPlayPause", "click", onClickBtnPlayPause);
  // 和文ボタンイベント
  setEvent("#btnJa", "change", (e) => onChangeBtnSwitch(e, "p.ja"));
  setEvent("#btnEn", "change", (e) => onChangeBtnSwitch(e, "p.en"));
  // 戻るボタンイベント
  setEvent("#btnEnd", "click", onClickBtnEnd);
  // 再生速度変更イベント
  setEvent("input[name='playBackSpeed']", "change", onChangePlaySpeed);
  // 再生速度をキャッシュから設定する
  $(`#${localStorage.playSpeedId}`).prop("checked", true);
}

/** 再生速度変更 */
function onChangePlaySpeed(e) {
  let value = parseFloat(e.currentTarget.value);
  Object.keys(audios).forEach((id) => {
    let audio = audios[id];
    audio.defaultPlaybackRate = value;
    audio.playbackRate = value;
  });
  // キャッシュする
  localStorage.playSpeedId = e.currentTarget.id;
  localStorage.playSpeed = value;
}

/** 戻るボタンクリック */
function onClickBtnEnd(e) {
  location.href = `./../index.html${location.search}`;
}

/** 再生ボタンクリック */
function onClickBtnPlayPause(e) {
  // 終了時に次を再生するイベント登録
  Object.keys(audios).forEach((key) => {
    audios[key].addEventListener("ended", onContinuousPlayEnded);
  });
  playPause();
}

/** スクリプトクリック */
function onClickScript(e) {
  playNo = parseInt(e.currentTarget.id);
  indiviualPlay();
}

/** 和文・英文ボタンクリック */
function onChangeBtnSwitch(e, pSelector) {
  $(pSelector).toggleClass("hidden");
}

/** イベントを設定する */
function setEvent(selector, eventName, func) {
  $(document).off(eventName, selector);
  $(document).on(eventName, selector, func);
}

/** 再生／一時停止 */
function playPause() {
  // 再生中は一時停止
  if (isPlay()) {
    pause();
    return;
  }

  play();
}

/** 再生（個別） */
function indiviualPlay() {
  // 再生中のものは全て停止
  Object.keys(audios).forEach((id) => {
    let audio = audios[id];
    let isPlaying = audio.currentTime > 0 && !audio.paused && !audio.ended;
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
    }
    let $div = $("#" + id);
    $div.removeClass("selected");
  });

  // 連続再生イベント削除
  removeContinuousPlaybackEndedEvent();
  // 再生
  play();
}

/** 再生中判定 */
function isPlay() {
  let isPlay = false;
  Object.keys(audios).forEach((id) => {
    let audio = audios[id];
    if (audio.currentTime > 0 && !audio.paused && !audio.ended) {
      isPlay = true;
      return;
    }
  });
  return isPlay;
}

/** 再生 */
function play() {
  const id = getId(playNo);
  const audio = getAudio(playNo);
  let $div = $("#" + id);
  $("body,html").animate({ scrollTop: $div.offset().top - 180 }, 400, "swing");
  $div.addClass("selected");
  changeDisplayToPlay(true);

  audio.play();
}

/** スクリプトのID取得 */
function getId(no) {
  return ("00" + no).slice(-2);
}

/** audio取得 */
function getAudio(no) {
  let id = getId(no);
  return $(`#${id} audio`)[0];
}

/** 一時停止 */
function pause() {
  let audio = getAudio(playNo);
  audio.pause();
}

/** 連続再生イベント削除 */
function removeContinuousPlaybackEndedEvent() {
  let audio = getAudio(playNo);
  audio.removeEventListener("ended", onContinuousPlayEnded);
}

/** クエリパラメータから対象フォルダを取得する */
function getTargetFolder() {
  let str = "./";
  const queryValues = getQueryParameter();
  queryValues.forEach((value) => {
    str += `${value}/`;
  });
  return str;
}

/** 再生終了時イベント（個別再生用） */
function onPlayEnded(e) {
  let id = ("00" + playNo).slice(-2);
  let $div = $("#" + id);
  $div.removeClass("selected");
  changeDisplayToPlay(false);
}

/** 再生終了時イベント（連続再生用） */
function onContinuousPlayEnded() {
  // 連続再生イベント削除
  removeContinuousPlaybackEndedEvent();

  if (playNo < maxPlayNo) {
    play(++playNo);
  } else {
    playNo = 1;
  }
}

/** 再生ボタンの切り替え(true=stopボタン、false=再生ボタン) */
function changeDisplayToPlay(is) {
  $("#btnPlayPause").prop("checked", is);
}

/** クエリパラメータからソースのパスを取得する */
function getSourcePath(fileName) {
  let str = "./";

  const queryValues = getQueryParameter();
  queryValues.forEach((value) => {
    str += `${value}/`;
  });

  return getTargetFolder() + fileName;
}

/** クエリパラメータを取得する */
function getQueryParameter() {
  let array = [];

  const queryString = location.search;
  const parameters = queryString.split("&");

  parameters.forEach((p) => {
    const value = p.split("=")[1];
    array.push(value);
  });

  return array;
}

// Jsonから本文を設定する
function setArticleText(name) {
  $.getJSON(name, (data) => {
    $("#title_no").text(data.title_no);
    $("#title").text(data.title);

    data.scripts.forEach((script, i) => {
      const target = $("main")[0];
      const content = $("#scriptTemplate")[0].content;
      const id = ("00" + (i + 1)).slice(-2);

      const clone = document.importNode(content, true);
      clone.querySelector("article").setAttribute("id", id);
      clone.querySelector("p.ja").textContent = script.ja;
      clone.querySelector("p.en").textContent = script.en;

      const audio = clone.querySelector("audio");
      audio.src = getSourcePath(`${id}.mp3`);
      audio.defaultPlaybackRate = localStorage.playSpeed;
      audio.playbackRate = localStorage.playSpeed;
      audio.addEventListener("ended", onPlayEnded);
      audios[id] = audio;

      target.appendChild(clone);
    });
    $("title").html(`${data.title}`);
    maxPlayNo = data.scripts.length;
  });
}
