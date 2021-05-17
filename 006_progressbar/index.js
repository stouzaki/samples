var ajax = new XMLHttpRequest();

ajax.responseType = "blob";
ajax.open("GET", "./data/dummy.txt", true);
ajax.send();

function onClick() {}

ajax.onreadystatechange = () => {
  if (this.readyState == 4 && this.status == 200) {
    const obj = window.URL.createObjectURL(this.response);
    document.getElementById("anchor").setAttribute("href", obj);

    setTimeout(() => {
      window.URL.revokeObjectURL(obj);
    }, 60 * 1000);
  }
};

ajax.onprogress = (e) => {
  const p = (e.loaded / e.total) * 100;
  const bar = document.getElementById("progressBarInner");
  bar.style.width = `${p}%`;
};
