$(document).ready(function () {
    var w;
    var h;
    var color = '#000';
    var selector;
    var hideDesignArea = hideDesignArea;
    var buildPreview = buildPreview;
    var buildCanvas = buildCanvas;

    /* Given a table element, builds it from provided width and height. */
    buildPreview = function (selector, w, h) {

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

        buildPreview(selector, w, h);

        // This differeiante a preview canvas from the live canvas
        $('#pixel-canvas').addClass('active');
        $('.preview-area').prepend('<br><button class="btn reset-canvas" id="start-over-button" data-toggle="modal" data-target="#confirmStartOverModal" style="width: 80%">Start Over</button>');

        // May be best to move this to CSS file.
        $('body').css('cursor', 'cell');
    }

    /* Listeners */

    /* Builds a preview of pixel canvas. Event handler for when user submits canvas dimensions. */
    $('#canvas-dimensions').on('submit', function (evt) {
        evt.preventDefault();

        var table = $('#pixel-canvas');
        selector = table; // Store for building live pixel canvas

        w = $('#canvas-width').val();
        h = $('#canvas-height').val();

        buildPreview(table, w, h);
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
        color = '#000';

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
});