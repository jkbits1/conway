/**
 * Created by jk on 14/11/14.
 */

"use strict";

(function (window, document) {

  var table = document.getElementById('gridArea');

  var grid = {};

  var rows = 3;
  var cols = 3;

  initGrid(grid);
  initTable(table, grid);

  function Cell(grid, row, col) {

    this.grid = grid;
    this.row = row;
    this.col = col;

    this.element = undefined;

    this.alive = false;

    this.toggleState = function(evt) {

      this.alive = !this.alive;

      this.element.className = "cell alive";
    };
  }

  // create DOM element and attach to grid
  function initTable(table, grid) {

    var tr = undefined;
    var td = undefined;

    for (var row = 0; row < rows; row++){

      tr = document.createElement('tr');

      for (var col = 0; col < cols; col++) {

        td = document.createElement('td');

        td.className = "cell dead";

        grid.items[row][col].element = td;

        td.addEventListener('click', (function (cell) {

          return function(evt) {
            cell.toggleState();
            // refresh grid
          };
        })(grid.items[row][col]));

        tr.appendChild(td);
      }

      table.appendChild(tr);
    }
  }

  function initGrid(grid) {

    grid.items = [];

    for (var row = 0; row < rows; row++){

      grid.items.push([]);

      for (var col = 0; col < cols; col++) {

        grid.items[row][col] = new Cell(grid, row, col);
      }
    }
  }

})(window, document);

