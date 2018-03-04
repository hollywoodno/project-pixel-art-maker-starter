$(document).ready(function () {
    'use strict';

    let width;
    let height;
    let color = '#000';
    let dragPixelColoring = false;

    // Previewing pixel canvas
    let start = 0;
    let end = 5;

    // Selectors
    let colorPicker = $('.color-picker');
    let pixelCanvas = $('#pixel-canvas');
    let designArea = $('.design-area');
    let previewArea = $('.preview-area');
    let canvasDimensions = $('#canvas-dimensions');
    let canvasWidth = $('#canvas-width');
    let canvasHeight = $('#canvas-height');

// --------------------------------
    /**
    * @description Dynamically builds a table that represents pixel grid
    * @param {number} w - The number of columns the table should have
    * @param {number} h - The number of rows the table should have
    * @param {boolean} pixelColoring - Whether to preview coloring cells
    */
    function buildPreview(table, w, h, pixelColoring) {
        for (let r = 0; r < h; r++) {

            // Initialize the row
            let newRow = '<tr>';

            for (let c = 0; c < width; c++) {

                newRow += '<td></td>';
            }

            newRow += '</tr>';
            table.append(newRow);
        }

        // Used to preview coloring of pixels
        if (pixelColoring) {
            colorPixels();
        }

    }

    /**
    * @description Toogles the display of the design area for pixel canvas
    * @param {boolean} hide - If true hides the display else displays it
    */
    function hideDesignArea(hide) {
        if (hide) {
            designArea.hide();
        } else {
            designArea.show();
        }
    }

    /**
    * @description Builds and displays pixel canvas fullscreen live coloring
    * @param
    */
    function buildCanvas() {
        previewArea.first().removeClass('col-md-8');
        previewArea.first().addClass('col-md-12');
        previewArea.first().removeClass('hidden-xs');
        previewArea.find('.section-title').css('display', 'none');

        // $('.toolbar').css('display', 'initial');

        // This differentiate a preview canvas from the live canvas
        pixelCanvas.addClass('active');
        width = canvasWidth.val();
        height = canvasHeight.val();

        buildPreview(pixelCanvas, width, height);

        previewArea.prepend('<br><button class="btn reset-canvas" ' +
            'id="start-over-button" data-toggle="modal" ' +
            'data-target="#confirmStartOverModal">Start Over</button>');

        // May be best to move this to CSS file.
        $('body').css('cursor', 'cell');
    }

    /**
    * @description Toggles ability to build a preview or live canvas
    * @param
    */
    function enableCanvasBuild() {
        if (width && height) {
            $('#preview').removeAttr('disabled');
            $('#build').removeAttr('disabled');
        } else {
            $('#preview').attr('disabled', true);
            $('#build').attr('disabled', true);
        }
    }

    /**
    * @description Color pixels by generating a random index from a list of table cells
    * @param
    */
    function colorPixels() {
        let cells = pixelCanvas.find('td');

        let randomIndices = setInterval(function () {

            // Single cell just needs index 0
            let index = cells.length == 1 ? 0 : Math.floor((Math.random() * cells.length) + 1);

            if (!(start < end)) {
                clearInterval(randomIndices); // If I want to keep coloring cells remove this
                start = 1;
            }

            $(cells[index]).css('background-color', color);

            start++;
        }, 1000);

    }

    /* Listeners */

    /**
    * @description Builds a preview of pixel canvas. Handler for when user submits canvas dimensions.
    * @param {Event} - The object to which event was triggered
    */
    canvasDimensions.on('submit', function (evt) {
        evt.preventDefault();

        // Disable the preview and dimension buttons otherwise table will build on top of old tables
        $('.dimension-control-group').attr('disabled', 'true');

        width = canvasWidth.val();
        height = canvasHeight.val();

        buildPreview(pixelCanvas, width, height, true);
    });

    /**
    * @description Builds the live pixel canvas. Handler for when user submits canvas dimensions.
    * @param
    */
    $('#build').on('click', function () {
        // TODO: Animate the transition of hiding preview area and going live fullscreen

        // First remove any existing preview then go live
        pixelCanvas.empty();
        hideDesignArea(true);

        buildCanvas();
    });

    /**
    * @description Handler for updating the color from the color picker
    * @param
    */
    colorPicker.on('input', function () {
        color = colorPicker.val();
    });

    /**
    * @description Resets the live canvas and returns user to initial design state
    * @param
    */
    $('#start-over').on('click', function () {
        $('#confirmStartOverModal').modal('hide');

        // Clear the pixel canvas table of it's cells
        pixelCanvas.empty();

        // Reset preview area
        previewArea.find('.section-title').css('display', 'initial');
        previewArea.first().addClass('col-md-6');
        $('#start-over-button').remove();

        hideDesignArea(false);

        $('#reset').trigger('click');
    });

    /**
    * @description Resets preview and live pixel canvas when reset button is clicked
    * @param
    */
    $('body').on('click', '#reset', function () {
        width = undefined;
        height = undefined;
        color = '#000';

        // Update the view
        $('.dimension-control-group').removeAttr('disabled');
        pixelCanvas.removeClass('active');
        colorPicker.val('#000');
        $('body').css('cursor', 'unset');

        enableCanvasBuild();
        pixelCanvas.empty();
    });

    /**
    * @description Colors pixels when canvas in active mode
    * @param {Event} - The object to which event was triggered
    */
    $('body').on('click', '.active td', function (evt) {
        // TODO: Remove this listener - move pixel coloring to onmousedown event

        let target = $(evt.target);

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

    /**
    * @description Allows coloring of multiple pixels with dragging
    * @param {Event} - The object to which event was triggered
    */
    $('body').on('mousedown', '.active td', function (evt5) {
    // TODO: This listener will have the coloring of pixels logic

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

    /**
    * @description Updates width of canvas based on user input changes
    * @param {Event} - The object to which event was triggered
    */
    canvasWidth.on('input', function (evt) {
        let target = $(evt.target);
        width = target.val();

        enableCanvasBuild();
    });

    /**
    * @description Updates height of canvas based on user input changes
    * @param {Event} - The object to which event was triggered
    */
    canvasHeight.on('input', function (evt) {
        let target = $(evt.target);
        height = target.val();

        enableCanvasBuild();
    });

});