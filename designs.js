$(document).ready(function () {
    var w;
    var h;
    var buildCanvas = buildCanvas;

    /* Given a table element builds it of provided width and height. */
    buildCanvas = function (selector, w, h) {

        console.log('height: ' + h + ' width ' + w);

        for (var r = 0; r < h; r++) {

            // Initialize the row
            var newRow = '<tr>';

            for (var c = 0; c < w; c++) {

                newRow += '<td></td>';
            }

            newRow += '</tr>';
            selector.append(newRow);

            console.log("A individual pixel dimension: (" + r + ", " + c + ")");
        }

    };

    /* Event Handler for user clicking submit canvas dimensions */
    $('#canvas-dimensions').on('submit', function (evt) {
        console.log("evt: ", evt);
        evt.preventDefault();

        var table = $('#pixel-canvas');
        w = $('#canvas-width').val();
        h = $('#canvas-height').val();

        buildCanvas(table, w, h);

    });


});