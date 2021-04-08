$(function () {


    // document.getElementById("inputparam").value = param;


    setArticleText("./script-01/1-01/script.json")
});

function getJsonPath {
    let str = "./";

    const queryValues = getQueryParameter();
    queryValues.forEach(value => {
        // ココ書く
    });

}


function getQueryParameter() {

    let array = [];

    const queryString = location.search;
    console.log(`param: ${param}`);

    const parameters = queryString.split('&');
    parameters.forEach(parameter => {
        const value = parameter.split("=")[1];
        array.push(value)
    });
}


function setArticleText(name) {
    $.getJSON(name, datas => {
        datas.forEach(data => {

            let target = document.querySelector("main");
            let content = document.querySelector("#scriptTemplate").content;

            const clone = document.importNode(content, true);
            clone.querySelector("p.ja").textContent = data.ja;
            clone.querySelector("p.en").textContent = data.en;

            target.appendChild(clone);

            console.log(`id=${data.id}, ja=${data.ja}, en=${data.en}`);
        });
    })
}