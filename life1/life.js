/**
 * Conway in plain JS
 * (c) 2014 Ben Lesh
 * MIT License
 */

// Clear the console, just because I hate it getting
// junked up while I'm playing in JSFiddle
console.clear();

(function (window, document) {
    
    // The Controller for our game;
    function Grid(w, h) {
        var grid = this;
        grid.width = w;
        grid.height = h;
        
        // this is the Model, really
        grid.rows = null;

        // use this to initialize or reset the grid
        grid.reset = function () {
            var x, y, row;
            grid.rows = [];

            for (y = 0; y < h; y++) {
                row = [];
                for (x = 0; x < w; x++) {
                    row.push(new Cell(x, y));
                }
                grid.rows.push(row);
            }
        }
        
        // call it right away to initialize the grid
        grid.reset();

        // utility to run through all of the cells 
        // in the grid's rows.
        grid.traverse = function (fn) {
            var x, y;
            var context = {
                stop: false
            };
            outer: for (y = 0; y < grid.height; y++) {
                for (x = 0; x < grid.width; x++) {
                    fn(context, grid.rows[y][x], x, y);
                    if (context.stop) {
                        break outer;
                    }
                }
            }
        }

        grid.step = function () {
            // first go trough and count live neighbors
            // *before* you update each cell.
            // Otherwise you'll ruin the live neighbor count 
            // for the next one.
            grid.traverse(function (ctxt, cell) {
                cell.examine();
            });
            
            // *Now* let's update the cells life status.
            grid.traverse(function (ctxt, cell) {
                cell.update();
            });
        };


        // The model for an individual cell
        function Cell(x, y) {
            var cell = this;
            cell.x = x;
            cell.y = y;
            cell.live = false;
            cell.grid = grid;
        }

        // counts nearby living neighbors 
        // and updates cell.liveNeighbors
        Cell.prototype.examine = function () {
            var cell = this;
            cell.liveNeighbors = 0;

            cell.traverseNearby(function (ctxt, neighbor) {
                if (neighbor.live) {
                    cell.liveNeighbors++;
                }
            });
        };

        // The actual, important logic for CGL is
        // done here. Update the live status based
        // on current status and living neighbor count.
        Cell.prototype.update = function () {
            var cell = this,
                liveNeighbors = cell.liveNeighbors;

            if (cell.live) {
                if (liveNeighbors <= 1 || liveNeighbors >= 4) {
                    cell.live = false;
                }
            } else if (liveNeighbors === 3) {
                cell.live = true;
            }
        }

        // A utility function to traverse the 8 nearby cells.
        Cell.prototype.traverseNearby = function (fn) {
            var cell = this;
            var context = {
                stop: false
            };
            var grid = cell.grid;
            var x, y, n;
            outer: for (y = Math.max(0, cell.y - 1); y <= Math.min(grid.height - 1, cell.y + 1); y++) {
                for (x = Math.max(0, cell.x - 1); x <= Math.min(grid.width - 1, cell.x + 1); x++) {
                    if (x !== cell.x || y !== cell.y) {
                        var neighbor = grid.rows[y][x];
                        fn(context, neighbor);
                        if (context.stop) {
                            break outer;
                        }
                    }
                }
            }
        }

        // toggles life status
        Cell.prototype.toggle = function () {
            this.live = !this.live;
        }
    }


    // ViewModel to do the binding
    function ViewModel(view, grid) {
        var table = view.table;
        var speedRange = view.speedRange;
        var viewModel = this;

        viewModel.update = function () {
            grid.traverse(function (e, cell) {
                if (cell.live) {
                    addClass(cell.element, 'live');
                } else {
                    removeClass(cell.element, 'live');
                }
            });
        };

        // update the grid, and then update the view
        viewModel.tick = function () {
            grid.step();
            viewModel.update();
        };

        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (fn) {
                setTimeout(fn, 1000 / 60);
            };


        // The animation loop
        var frame = 0;

        viewModel.animate = function () {
            var speed = +speedRange.max - +speedRange.value;
            // we'll let it play as fast as it likes for now,
            // even though there's more efficient ways to do this,
            // but we'll use the input speed to trottle how
            // often the grid updates.
            if(speed === 0 || speed < 180 && (frame++ % speed) === 0) {
                console.log(speed);
                viewModel.tick();
            }
            requestAnimationFrame(viewModel.animate);
        }
//        requestAnimationFrame(viewModel.animate);

        // set up the bindings
        viewModel.init = function () {
            table.className = 'conway';
            var x, y, tr, td, cell;
            allCells = [];
            var toggleCell = function (cell) {
                return function (e) {
                    cell.live = !cell.live;
                }
            };

            for (y = 0; y < grid.height; y++) {
                tr = document.createElement('tr');
                for (x = 0; x < grid.width; x++) {
                    td = document.createElement('td');
                    td.className = 'cell';

                    cell = grid.rows[y][x];
                    cell.element = td;

                    td.addEventListener('click', (function (cell) {
                        return function (e) {
                            cell.toggle();
                            viewModel.update();
                        };
                    }(cell)));

                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
        };
        // ... and go!
        viewModel.init();
    }
    
    function View(elem) {
       var view = this;
        view.speedRange = elem.querySelector('#speed');
        view.table = elem.querySelector('#conway');
    }

    function addClass(el, className) {
        var classRegexp = new RegExp('\\b' + className + '\\b', 'g');
        if (!classRegexp.test(el.className)) {
            el.className += ' ' + className;
        }
    }

    function removeClass(el, className) {
        var classRegexp = new RegExp('\\b' + className + '\\b', 'g');
        el.className = el.className.replace(classRegexp, '');
    }

    function Conway(gridWidth, gridHeight) {
        var conway = this;
        conway.grid = new Grid(gridWidth, gridHeight);
        var viewElem = document.getElementById('view');
        conway.view = new View(viewElem);
      conway.viewModel = new ViewModel(conway.view, conway.grid);


      var buttonRun = document.getElementById('buttonRun');

      buttonRun.addEventListener('click',
//        function ()
//        {
//
//        requestAnimationFrame(viewModel.animate);
//      }

        (function () {
          return function (e) {
//            cell.toggle();
//            viewModel.update();
            requestAnimationFrame(conway.viewModel.animate);
          };
        }())

//        (function (cell) {
//          return function (e) {
//            cell.toggle();
//            viewModel.update();
//          };
//        }(cell))

      );
    }

    window.Conway = Conway;
}(window, document));

window.conway = new Conway(40, 50);