$(document).ready(function () {
    'use strict';

    const letters = [['a', 'b', 'c', 'd', 'e'],
                     ['d', 'e', 'f', 'g', 'h'],
                     ['i', 'j', 'k', 'l', 'm'],
                     ['n', 'o', 'p', 'q', 'r'],
                     ['s', 't', 'u', 'v', 'w'],
                     ['x', 'y', 'z']];
    let width;
    let height;
    let color = '#000000';
    let dragPixelColoring = false;
    let pixelTexting = false;
    let toolbarIsOpen = false;

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
    let toolbar = $('.toolbar');
    let toolbox = $('.toolbox');

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
    * @param {boolean} hide - If true hides the design area and builds live canvas else displays it
    */
    function hideDesignArea(hide) {
        hide ? designArea.hide() : designArea.show('fast');
    }

    /**
    * @description Builds and displays pixel canvas fullscreen live coloring
    * @param
    */
    function buildCanvas() {
        previewArea.first().addClass('col-md-12')
            .removeClass('hidden-xs')
            .removeClass('hidden-sm')
            .removeClass('col-md-8');

        previewArea.find('.section-title').hide();
        previewArea.prepend('<button class="btn reset-canvas" ' +
            'id="start-over-button" data-toggle="modal" ' +
            'data-target="#confirmStartOverModal">Start Over</button>');

        // $('.toolbar').css('display', 'initial');

        // This differentiate a preview canvas from the live canvas
        pixelCanvas.addClass('active');

        width = canvasWidth.val();
        height = canvasHeight.val();

        buildPreview(pixelCanvas, width, height, false);

        // May be best to move this to CSS file.
        $(pixelCanvas).css('cursor', 'cell');
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

    /**
* @description Toogles the display of the live pixel canvas toolbar 
* @param {boolean} hide - If true shows the toolbar else hides it
*/
    function showToolbar(show) {
        // Set the color on toolbar so it match color during designing
        $('.toolbar .color-picker').val(color);
        show ? $('.toolbar').show() : $('.toolbar').hide();
    }

    function colorPixel(target) {
        if (target.hasClass('colored')) {
            target.css('background-color', '#FFF')
                .removeClass('colored');
        } else {
            target.css('background-color', color)
                .addClass('colored');
        }
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
        showToolbar(true);
        pixelCanvas.empty();
        hideDesignArea(true);
        buildCanvas();
    });

    /**
    * @description Handler for updating the color from the color picker
    * @param
    */
    $('body').on('input', '.color-picker', function (evt) {
        color = $(evt.target).val();

        // If color is changed from the toolbar, we want to automatically close the toolbar after color selection.
        // The color picker in the toolbar, will have a parent with the tooling class.
        let toolbarParents = $(evt.target).parents('.tooling');
        if (toolbarParents.length > 0) {
            toolbarIsOpen = true;
            toolbarParents.first().trigger('click');
        }
    });

    /**
    * @description Resets the live canvas and returns user to initial design state
    * @param
    */
    $('#start-over').on('click', function () {
        $('#confirmStartOverModal').modal('hide');

        $('#reset').trigger('click');
    });

    /**
    * @description Resets preview and live pixel canvas when reset button is clicked
    * @param
    */
    $('body').on('click', '#reset', function () {
        width = undefined;
        height = undefined;
        color = '#000000';

        // Update the view
        $('.dimension-control-group').removeAttr('disabled');

        $('#start-over-button').remove();
        pixelCanvas.removeClass('active')
        pixelCanvas.empty();
        previewArea.find('.section-title').show();
        previewArea.addClass('hidden-xs')
            .addClass('hidden-sm')
            .removeClass('col-md-12')
            .addClass('col-md-8');
        hideDesignArea(false);
        showToolbar(false);

        colorPicker.val('#000');
        $(pixelCanvas).css('cursor', 'unset');
        canvasWidth.focus();

        enableCanvasBuild();
    });

    /**
    * @description Colors pixels when canvas in active mode
    * @param {Event} - The object to which event was triggered
    */
    //     $('body').on('click', '.active td', function (evt) {
    //         // TODO: Remove this listener - move pixel coloring to onmousedown event

    //         let target = $(evt.target);

    //         /* Important: We only want to color pixels on an original 'click' event not
    //          as an after effect of mousedown or any other event. Original click events
    //          will not have an originalEvent property.
    //         */
    //         if (!evt.originalEvent) {
    //             if (dragPixelColoring) {
    //               // Keep track of colored/uncolored pixels by presence of 'colored' class
    //               if (target.hasClass('colored')) {
    //                   target.css('background-color', '#FFF')
    //                       .removeClass('colored');
    //               } else {
    //                   target.css('background-color', color)
    //                       .addClass('colored');
    //               }
    //               console.log('coloring');
    //             } else {
    //                 target.append('<input type="text" size="1" class="pixel-text">');
    //                 console.log('should be texting'); 
    //           }
    //         }
    //     });

    /**
    * @description Allows coloring of multiple pixels with dragging
    * @param {Event} - The object to which event was triggered
    */
    $('body').on('mousedown', '.active td', function (evt5) {

        dragPixelColoring = !pixelTexting;
        let firstCell = $(evt5.target);

        if (dragPixelColoring) {
            // Color the first cell
            colorPixel(firstCell);

            // As we enter new cells, color them
            $('.active td').on('mouseenter', function (evt2) {
                //$(evt2.target).trigger('click');
                let targetCell = $(evt2.target);
                colorPixel(targetCell);
            });

            // Terminates the coloring of new cell, by by removing the listener
            $('.active td').on('mouseup', function (evt3) {
                //$(evt3.target).css('background-color', 'purple'); // Color last cell dragged to. Just a little extra magic
                $('.active td').off('mouseenter');
                dragPixelColoring = false;
            });
        }
        //else {
        //    // Enter a letter
        //    //firstCell.append('<input type="text" size="1" class="pixel-text">');
        //    debugger;
        //    // We want to get keypress and add letter to td
        //    $('.active td').keypress(function (evt) {
        //        console.log("got keypress: ", evt);
        //        firstCell.html("H");
        //    });
        //}
    });


    // Enter a letter
    //firstCell.append('<input type="text" size="1" class="pixel-text">');

    // We want to get keypress and add letter to td
    $(document).on('keydown', 'td', function (evt) {
        debugger;
        if (pixelTexting) {
            console.log("got keypress: ", evt);
            $(evt.target).html("H");
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

    /**
    * @description Animates showing/hiding toolbox while in live pixel coloring mode
    * @param {Event} - The object to which event was triggered
    */
    $('.tooling').on('click', function (evt) {
        // Use 'this' so that toolbox items don't toggle display of toolbar
        if (evt.target != this) { return };
        if (toolbarIsOpen) {
            toolbarIsOpen = false;

            $('.reset-canvas').animate({
                marginLeft: "0"
            }, 500);

            $('.tool-icon').animate({
                left: 0,
            }, 280, function () {
                $('.tool-icon').css('transform', 'rotate(-130deg)');
            });

            $('.toolbox').animate({
                left: -100,
            }, 300, function () {
                pixelCanvas.css({ 'background-color': 'transparent', 'filter': 'blur(0)' });
                $('.tool-icon').css('transform', 'rotate(-130deg)');
            });
        } else {

            toolbarIsOpen = true;

            pixelCanvas.css({ 'background-color': 'transparent', 'filter': 'blur(3px)' });
            $('.reset-canvas').animate({
                marginLeft: toolbox.width() + 'px'
            });

            $('.toolbox').animate({
                opacity: 1,
                left: -10,
            }, 300, function () {
                $('.tool-icon').css('transform', 'rotate(-30deg)');
            });

            $('.tool-icon').animate({
                left: toolbox.width() + 5,
            }, 280, function () {
                $('.tool-icon').css('transform', 'rotate(-30deg)');
            });
        }
    });

    // WIP: TODO: finish implementing toolbar input text tool for live pixel grid
    $('.text-tool').on('click', function (evt) {
        console.log('text tool selected. make input fields');

            if (pixelTexting) {
                $('.text-tool').css('color', 'grey');
                pixelTexting = false;
                dragPixelColoring = true;
                $('.letter-grid').remove();
            } else {
                $('.text-tool').css('color', 'green');
                dragPixelColoring = false;
                pixelTexting = true;

                let letterGrid = $('<table class="letter-grid">');
                $('.toolbox').append(letterGrid);

                //$.each(letters, function (index, letter) {
                //    letterGrid.append('<p>' + letter + '</p>');
                //});
                for (let row = 0; row < letters.length; row++) {
                    let newRow = '<tr>';
                    for (let col = 0; col < letters[row].length; col++) {
                        newRow += '<td class="letter">' + letters[row][col] + '</td>';
                    }
                    newRow += '</tr>';
                    letterGrid.append(newRow);
                }
            }
    });
});