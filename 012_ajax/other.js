"use strict";
var others;
(function (others) {
    var other = /** @class */ (function () {
        function other() {
        }
        other.prototype.start = function () {
            console.log("a");
        };
        return other;
    }());
    others.other = other;
})(others || (others = {}));
