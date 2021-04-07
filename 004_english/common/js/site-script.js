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
$(document).ready(function () {

    // 各部品をJQueryObjectとして取得
    $iconPlayPause = $("#icon-play_pause");
    $iconAllPlay = $("#icon-allplay");
    $btnComplete = $("#btn-complete");
    $speedSlider = $("#speed_slider");

    let $s = $(".script");
    $s.each(function (index, element) {
        let id = $(element).attr('id');
        let audio = new Audio();
        audio.preload = "auto";
        audio.src = "../../static/data/script/" + scriptName + "/" + scriptName + "-" + id + ".mp3";
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
    })

    // 再生速度変更用レンジスライダー
    $speedSlider.jRange({
        from: 0.5,
        to: 2.0,
        step: 0.25,
        scale: [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0],
        format: '%s',
        width: 150,
        showLabels: true,
        snap: true,
        onstatechange: (value) => changePlaySpeed(value),
    });

    // 最後の番号
    maxPlayNo = Object.keys(audios).length;

    // 最初から全て再生
    $iconAllPlay.off('click');
    $iconAllPlay.on('click', function (e) {
        // 終了時に次を再生するイベント登録
        Object.keys(audios).forEach(key => {
            audios[key].addEventListener('ended', onContinuousPlayEnded);
        });
        // 再生中のものは全て停止
        Object.keys(audios).forEach(id => {
            let audio = audios[id]
            let isPlaying = audio.currentTime > 0 && !audio.paused && !audio.ended;
            if (isPlaying) {
                audio.pause();
                audio.currentTime = 0;
            }
            let $div = $("#" + id);
            $div.removeClass('script-selected');
        });

        // 最初の音声を再生
        playNo = 1;
        play();
    });

    // 再生ボタンイベント
    $iconPlayPause.off('click');
    $iconPlayPause.on('click', function (e) {
        // 終了時に次を再生するイベント登録
        Object.keys(audios).forEach(key => {
            audios[key].addEventListener('ended', onContinuousPlayEnded);
        });
        playPause();
    });

    // 再生速度が保存されていれば設定
    if (localStorage.playSpeed != undefined && localStorage.playSpeed != null) {
        // $speedSlider.val(localStorage.playSpeed);
        $speedSlider.jRange('setValue', localStorage.playSpeed);
        // changePlaySpeed($speedSlider.val());
    }

});

// 再生／一時停止表示切替
function changeDisplayPlayPause() {
    if ($iconPlayPause.hasClass('fa-play-circle-o')) {
        changeDisplayToPause();
    } else {
        changeDisplayToPlay();
    }
}

// 再生へ表示切替
function changeDisplayToPlay() {
    $iconPlayPause.removeClass('fa-pause-circle');
    $iconPlayPause.addClass('fa-play-circle-o');
}

// 一時停止へ表示切替
function changeDisplayToPause() {
    $iconPlayPause.removeClass('fa-play-circle-o');
    $iconPlayPause.addClass('fa-pause-circle');
}

// 再生／一時停止
function playPause() {
    if ($iconPlayPause.hasClass('fa-play-circle-o')) {
        play();
    } else {
        pause();
    }
}

// 再生終了時イベント（個別再生用）
function onPlayEnded(e) {
    let id = ('00' + playNo).slice(-2);
    let $div = $("#" + id);
    $div.removeClass('script-selected');
    changeDisplayToPlay();
}

// 再生終了時イベント（連続再生用）
function onContinuousPlayEnded() {
    // 連続再生イベント削除
    removeContinuousPlaybackEndedEvent();

    if (playNo < maxPlayNo) {
        play(++playNo);
    } else {
        playNo = 1;
        changeDisplayToPlay();
    }
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
        $div.removeClass('script-selected');
    });
    // 連続再生イベント削除
    removeContinuousPlaybackEndedEvent();
    // 再生
    play();
}

// 再生
function play() {
    let id = ('00' + playNo).slice(-2);
    let audio = audios[id];
    let $div = $("#" + id);
    $('body,html').animate({ scrollTop: $div.offset().top - 180 }, 400, 'swing');
    $div.addClass('script-selected');
    audio.play();
    changeDisplayToPause();
}

// 一時停止
function pause() {
    let id = ('00' + playNo).slice(-2);
    let audio = audios[id];
    audio.pause();
    changeDisplayToPlay();
}

// 連続再生イベント削除
function removeContinuousPlaybackEndedEvent() {
    let id = ('00' + playNo).slice(-2);
    let audio = audios[id];
    audio.removeEventListener('ended', onContinuousPlayEnded)
}

// 再生速度変更
function changePlaySpeed(value) {
    // 初期表示時は実行しない
    if (cntChangeSpeed > 0) {
        Object.keys(audios).forEach(id => {
            let audio = audios[id]
            audio.defaultPlaybackRate = value;
            audio.playbackRate = value;
        });
        // キャッシュする
        localStorage.playSpeed = value;
    }

    // 初期表示対応のため追加
    cntChangeSpeed++;
}
