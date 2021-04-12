// 初期表示
$(function () {
  const jsonFullName = getJsonPath("script.json");
  setArticleText(jsonFullName);
});

// クエリパラメータからJsonPathを取得する
function getJsonPath(fileName) {
  let str = "./";

  const queryValues = getQueryParameter();
  queryValues.forEach((value) => {
    str += `${value}/`;
  });

  return str + fileName;
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
    datas.forEach((data) => {
      const target = $("main")[0];
      const content = $("#scriptTemplate")[0].content;

      const clone = document.importNode(content, true);
      clone.querySelector("p.ja").textContent = data.ja;
      clone.querySelector("p.en").textContent = data.en;

      target.appendChild(clone);
    });
  });
}
