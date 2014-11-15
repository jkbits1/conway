/**
 * Created by jk on 14/11/14.
 */

"use strict";

(function (window, document) {

  var table = document.getElementById('gridArea');

  var button = document.getElementById('Run');

  var gameRows = 3;
  var gameCols = 3;

  var grid = {

    rows: gameRows,
    cols: gameCols,
    items: [],
    updateGrid: updateGrid,
    initGrid: initGrid
  };

  function initGame() {

    grid.initGrid();
    initTable(table, grid);

    button.addEventListener('click', (function () {

      return function(evt) {

        grid.updateGrid();
      };
    })(grid));
  }

  function updateGrid() {

    var grid = this;

    for (var row = 0; row < grid.rows; row++){
      for (var col = 0; col < grid.cols; col++) {

        grid.items[row][col].element.className = "cell alive";
      }
    }
  }

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

    for (var row = 0; row < gameRows; row++){

      tr = document.createElement('tr');

      for (var col = 0; col < gameCols; col++) {

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

    var grid = this;

    var items = grid.items;
//    grid.items = [];

    for (var row = 0; row < grid.rows; row++){

      items.push([]);

      for (var col = 0; col < grid.cols; col++) {

        items[row][col] = new Cell(grid, row, col);
      }
    }
  }

  initGame();

})(window, document);

