/**
 * Created by jk on 14/11/14.
 */

"use strict";

(function (window, document) {

  var table = document.getElementById('gridArea');

  var rows = 3;
  var cols = 3;

  var tr = undefined;
  var td = undefined;

  for (var row = 0; row < rows; row++){

    tr = document.createElement('tr');

    for (var col = 0; col < cols; col++) {

      td = document.createElement('td');

      tr.appendChild(td);
    }

    table.appendChild(tr);
  }

})(window, document);

