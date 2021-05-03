const page = "./page/script.html";
// const c1 = "c1=script-";
// const c2 = "c2=";

// 初期表示イベント登録
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);

/** 初期表示イベント */
function onDOMContentLoaded() {
  // IDと遷移先パスを設定する
  $(".category").each((i1, e1) => {
    $(e1)
      .find(".sub")
      .each((i2, e2) => {
        $(e2)
          .find("a")
          .each((i3, e3) => {
            $(e3).attr(
              "id",
              `script-${getId(i1 + 1)}_${i2 + 1}-${getId(i3 + 1)}`
            );
            $(e3).attr(
              "href",
              `${page}?c1=script-${getId(i1 + 1)}&c2=${i2 + 1}-${getId(i3 + 1)}`
            );
          });
      });
  });

  // 遷移元のリンクに目印をつける
  const $link = getFromLink();
  $link.addClass("from");
  // 目印のリンクのDetailsをOpenする
  const $details = $link.parent().parent().parent();
  $details.attr("open", "");
  // 目印のリンクの位置までスクロールを移動する
  const offsetTop = $link.offset().top - 300;
  $("html, body").animate({ scrollTop: offsetTop }, 100);
}

/** 遷移元のリンク取得 */
function getFromLink() {
  const params = getQueryParameter();
  return $(`#${params[0]}_${params[1]}`);
}

/** ID取得（数値２桁埋め） */
function getId(no) {
  return ("00" + no).slice(-2);
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
