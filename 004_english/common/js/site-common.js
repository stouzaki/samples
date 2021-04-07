
// ブラウザバックで強制的に再読み込み
window.onpageshow = function (event) {
    let perfEntries = performance.getEntriesByType("navigation");
    perfEntries.forEach(function (pe) {
        switch (pe.type) {
            case 'back_forward':
                window.location.reload();
                break;
        }
    });
};


