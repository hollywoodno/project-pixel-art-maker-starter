$(document).ready(function () {
    var w;
    var h;
    var color = '#000';
    var selector = $('#pixel-canvas');
    var hideDesignArea = hideDesignArea;
    var buildPreview = buildPreview;
    var buildCanvas = buildCanvas;
    var enableCanvasBuild = enableCanvasBuild;

    // Previewing pixel canvas
    var colorPixels = colorPixels;
    var start = 1;
    var end = 5;

    /* Given a table element, builds it from provided width and height. */
    buildPreview = function (selector, w, h, pixelColoring) {
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

        //Used for preview of coloring pixels
        if (pixelColoring) {
            colorPixels();
        }

    };

    /* Displays or hides the design area */
    hideDesignArea = function (hide) {
        var designArea = $('.design-area');

        if (hide) {
            designArea.hide();
        } else {
            designArea.show();
        }
    }

    /* Builds and displays pixel canvas fullscreen for editing */
    buildCanvas = function () {
        $('.preview-area').first().removeClass('col-md-8');
        $('.preview-area').find('.section-title').css('display', 'none');

        //var table = $('#pixel-canvas');
        //selector = table; // Store for building live pixel canvas

        // This differeiante a preview canvas from the live canvas
        $('#pixel-canvas').addClass('active');
        w = $('#canvas-width').val();
        h = $('#canvas-height').val();

        buildPreview($('#pixel-canvas'), w, h);
        $('.preview-area').prepend('<br><button class="btn reset-canvas" id="start-over-button" data-toggle="modal" data-target="#confirmStartOverModal" style="width: 80%">Start Over</button>');

        // May be best to move this to CSS file.
        $('body').css('cursor', 'cell');
    }

    enableCanvasBuild = function () {
        if (w && h) {
            console.log('enable live build');
            $('#preview').removeAttr('disabled');
            $('#build').removeAttr('disabled');
        } else {
            console.log('disable live build');
            $('#preview').attr('disabled', true);
            $('#build').attr('disabled', true);
        }
    };

    /* Color pixels by generating a random index from a list of table cells */
    colorPixels = function () {
        var cells = selector.find('td');

        var randomIndices = setInterval(function () {

            var index = Math.floor((Math.random() * cells.length) + 1);

            if (!(start < end)) {
                clearInterval(randomIndices); // If I want to keep coloring cells remove this
                start = 1
            }

            $(cells[index]).css('background-color', color);

            start++;
        }, 1000);

    }

    /* Listeners */

    /* Builds a preview of pixel canvas. Event handler for when user submits canvas dimensions. */
    $('#canvas-dimensions').on('submit', function (evt) {
        evt.preventDefault();

        var table = $('#pixel-canvas');
        selector = table; // Store for building live pixel canvas

        w = $('#canvas-width').val();
        h = $('#canvas-height').val();

        buildPreview(table, w, h, true);
    });

    /* Builds the live pixel canvas. */
    $('#build').on('click', function (v, h) {
        // First remove any existing preview and go live fullscreen
        $('#pixel-canvas').empty();
        hideDesignArea(true);

        buildCanvas();
    });

    /* Manages the color picker */
    $('#color-picker').on('input', function () {
        console.log('color picker choose: ', $('#color-picker').val());
        color = $('#color-picker').val();
    });

    /* Resets the live canvas and returns user to initial design state */
    $('#start-over').on('click', function () {
        $('#confirmStartOverModal').modal('hide');

        // Ckear the pixel canvas table of it's cells
        $('#pixel-canvas').empty();

        // Reset preview area
        $('.preview-area').find('.section-title').css('display', 'initial');
        $('.preview-area').first().addClass('col-md-8');
        $('#start-over-button').remove();

        hideDesignArea(false);

        $('#reset').trigger("click");
    });

    /* Resets preview and live pixel canvas when reset button is clicked*/
    $('body').on('click', '#reset', function () {
        w = undefined;
        h = undefined;
        selector = undefined;
        $('#pixel-canvas').removeClass('active');
        color = '#000';
        $('#color-picker').val('#000');
        enableCanvasBuild();
        $('#pixel-canvas').empty();
    });

    /* Colors pixels by listening for cell activity when pixel canvas is set to active */
    // Listen for the cell that is being tapped
    $('body').on('click', '.active td', function (evt) {
        var target = $(evt.target);

        // Keep track of colored/uncolored pixels by presence of 'colored' class
        if (target.hasClass('colored')) {
            target.css('background-color', '#FFF');
            target.removeClass('colored');
        } else {
            target.css('background-color', color);
            target.addClass('colored');
        }
    });

    /* Updates width of canvas based on user input changes */
    $('#canvas-width').on('input', function (evt) {
        var target = $(evt.target);
        w = target.val();

        enableCanvasBuild();
    });

    /* Updates height of canvas based on user input changes */
    $('#canvas-height').on('input', function (evt) {
        var target = $(evt.target);
        h = target.val();

        enableCanvasBuild();
    });

});