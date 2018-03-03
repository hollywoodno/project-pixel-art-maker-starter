$(document).ready(function () {
    var width;
    var height;
    var color = '#000';
    var dragPixelColoring = false;

    // Previewing pixel canvas
    var colorPixels = colorPixels;
    var start = 0;
    var end = 5;

    // Selectors
    var pixelCanvas = $('#pixel-canvas');
    var designArea = $('.design-area');
    var previewArea = $('.preview-area');
    var canvasDimensions = $('#canvas-dimensions');
    var canvasWidth = $('#canvas-width');
    var canvasHeight = $('#canvas-height');

    // Functions
    var hideDesignArea = hideDesignArea;
    var buildPreview = buildPreview;
    var buildCanvas = buildCanvas;
    var enableCanvasBuild = enableCanvasBuild;

    /* Given a table element, builds it from provided width and height. */
    buildPreview = function (table, w, h, pixelColoring) {
        for (var r = 0; r < h; r++) {

            // Initialize the row
            var newRow = '<tr>';

            for (var c = 0; c < width; c++) {

                newRow += '<td></td>';
            }

            newRow += '</tr>';
            table.append(newRow);
        }

        // Used to preview coloring of pixels
        if (pixelColoring) {
            colorPixels();
        }

    };

    /* Displays or hides the design area */
    hideDesignArea = function (hide) {
        if (hide) {
            designArea.hide();
        } else {
            designArea.show();
        }
    };

    /* Builds and displays pixel canvas fullscreen for editing */
    buildCanvas = function () {
        previewArea.first().removeClass('col-md-8');
        previewArea.find('.section-title').css('display', 'none');

        // This differentiate a preview canvas from the live canvas
        pixelCanvas.addClass('active');
        w = canvasWidth.val();
        h = canvasHeight.val();

        buildPreview(pixelCanvas, w, h);

        previewArea.prepend('<br><button class="btn reset-canvas" id="start-over-button" data-toggle="modal" data-target="#confirmStartOverModal">Start Over</button>');

        // May be best to move this to CSS file.
        $('body').css('cursor', 'cell');
    };

    enableCanvasBuild = function () {
        if (width && height) {
            $('#preview').removeAttr('disabled');
            $('#build').removeAttr('disabled');
        } else {
            $('#preview').attr('disabled', true);
            $('#build').attr('disabled', true);
        }
    };

    /* Color pixels by generating a random index from a list of table cells */
    colorPixels = function()  {
        var cells = pixelCanvas.find('td');

        var randomIndices = setInterval(function () {

            var index = cells.length == 1 ? 0 : Math.floor((Math.random() * cells.length) + 1);

            if (!(start < end)) {
                clearInterval(randomIndices); // If I want to keep coloring cells remove this
                start = 1;
            }

            $(cells[index]).css('background-color', color);

            start++;
        }, 1000);

    };

    /* Listeners */

    /* Builds a preview of pixel canvas. Event handler for when user submits canvas dimensions. */
    canvasDimensions.on('submit', function (evt) {
        evt.preventDefault();

        // Disable the preview and dimension buttons otherwise table will build on top of old tables
        $('.dimension-control-group').attr('disabled', 'true');

        w = canvasWidth.val();
        h = canvasHeight.val();

        buildPreview(pixelCanvas, w, h, true);
    });

    /* Builds the live pixel canvas. */
    $('#build').on('click', function (v, h) {
        // First remove any existing preview and go live fullscreen
        pixelCanvas.empty();
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
        pixelCanvas.empty();

        // Reset preview area
        previewArea.find('.section-title').css('display', 'initial');
        previewArea.first().addClass('col-md-8');
        $('#start-over-button').remove();

        hideDesignArea(false);

        $('#reset').trigger("click");
    });

    /* Resets preview and live pixel canvas when reset button is clicked*/
    $('body').on('click', '#reset', function () {
        width = undefined;
        height = undefined;
        color = '#000';

        // Update the view
        $('.dimension-control-group').removeAttr('disabled');
        pixelCanvas.removeClass('active');
        $('#color-picker').val('#000');
        $('body').css('cursor', 'unset');

        enableCanvasBuild();

        pixelCanvas.empty();
    });

    /* Colors pixels by listening for cell activity when pixel canvas is set to active */
    $('body').on('click', '.active td', function (evt) {
        var target = $(evt.target);

      /* Important: We only want to color pixels on an original 'click' event not
         as an after effect of mousedown or any other event. Original click events
         will not have an originalEvent property.
         */
        if (!evt.originalEvent) {
            // Keep track of colored/uncolored pixels by presence of 'colored' class
            if (target.hasClass('colored')) {
                target.css('background-color', '#FFF');
                target.removeClass('colored');
            } else {
                target.css('background-color', color);
                target.addClass('colored');
            }
        }
    });

    /* Allows coloring of multiple pixels at once */
    $('body').on("mousedown", '.active td', function (evt5) {

        /* We color the cells by manually triggering their clicking */
        dragPixelColoring = true;
        $(evt5.target).trigger('click');

        // As we enter new cells, color them
        if (dragPixelColoring) {
            $('.active td').on('mouseenter', function(evt2) {
                $(evt2.target).trigger('click');
            });

            // Terminates the coloring of new cell, by by removing the listener
            $('.active td').on('mouseup', function(evt3) {
                //$(evt3.target).css('background-color', 'purple'); // Color last cell dragged to. Just a little extra magic
                $('.active td').off('mouseenter');
                dragPixelColoring = false;
            });
        }
    });

    /* Updates width of canvas based on user input changes */
    canvasWidth.on('input', function (evt) {
        var target = $(evt.target);
        width = target.val();

        enableCanvasBuild();
    });

    /* Updates height of canvas based on user input changes */
    canvasHeight.on('input', function (evt) {
        var target = $(evt.target);
        height = target.val();

        enableCanvasBuild();
    });

});