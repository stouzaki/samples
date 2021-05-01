const page = "./page/script.html";
// const c1 = "c1=script-";
// const c2 = "c2=";

// 初期表示イベント登録
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);

/** 初期表示イベント */
function onDOMContentLoaded() {
  $(".category").each((i1, e1) => {
    $(e1)
      .find(".sub")
      .each((i2, e2) => {
        $(e2)
          .find("a")
          .each((i3, e3) => {
            $(e3).attr(
              "href",
              `${page}?c1=script-${getId(i1 + 1)}&c2=${i2 + 1}-${getId(i3 + 1)}`
            );
          });
      });
  });
}

/** ID取得（数値２桁埋め） */
function getId(no) {
  return ("00" + no).slice(-2);
}
