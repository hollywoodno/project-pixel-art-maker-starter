$(document).ready(function () {
    'use strict';

    const letters = [['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
    ['j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r'],
    ['s', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' ']];

    let width;
    let height;
    let letter;
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
    const toolContainer = $('.tool-container');

    const cellOptions = {
        selected: false,
        icon: $('.color-cells'),
        html: '<div class="col-xs-auto tool-options">' +
        '<span class="glyphicon glyphicon-tint trigger-color-picker"></span></div>',
        show: function () {
            $('.tool-container').empty();
            $('.tool-container').prepend(this.html);
            this.icon.attr('disabled', true);
        }
    }

    const keyboardOptions = {
        selected: false,
        icon: $('.add-text'),
        html: '<table id="keyboard" class="keyboard"></table>',
        show: function () {
            $('.tool-container').empty();

            $('.tool-container').prepend(this.html);
            this.icon.attr('disabled', true);

            let keyboard = $('#keyboard');
            for (let r = 0; r < letters.length; r++) {
                let newRow = '<tr>';
                for (let c = 0; c < letters[r].length; c++) {
                    newRow += '<td class="letter">' + letters[r][c] + '</td>';
                }
                newRow += '<tr>';
                keyboard.append(newRow);
            }
        }
    }

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
    * @description Dynamically builds a table/keyboard to write letters on pixel canvas
    * @param {boolean} pixelColoring - If true, builds the keyboard  else removes it
    */
    function showKeyboard(show) {
        //$('.tool-title').html("Keyboard");

        dragPixelColoring = false;
        pixelTexting = true;

        // Automatically closes toolbar
        $('.tooling').first().trigger('click');

       
        $('.tool-container').empty();


            //$('.action-item').empty();
            //$('.tool-container').append('<span class="tool-title" style="font-size: 20px;">Keyboard</span>');
            $('.tool-container').append('<table id="keyboard" class="keyboard"></table>');
            //$('.tool-container').append('<table id="keyboard" class="text-center"></table>');

            let keyboard = $('#keyboard');
            for (let r = 0; r < letters.length; r++) {
                let newRow = '<tr>';
                for (let c = 0; c < letters[r].length; c++) {
                    newRow += '<td class="letter">' + letters[r][c] + '</td>';
                }
                newRow += '<tr>';
                keyboard.append(newRow);
            }

    }

    /**
    * @description Toggles the display of the design area for pixel canvas
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
        $('.actions').show();

        // We start with cell coloring so display cell coloring options in tool area
        cellOptions.show();

        // Update current color
        $('.trigger-color-picker').css('color', color);

        //previewArea.prepend('<div class="container actions"><div class="row action-item">' +
        //    '<div class="col-xs-12"><h6 class="tool-title">Color Pixels</h6>' +
        //    '<span class="glyphicon glyphicon-tint trigger-color-picker" style="color: ' + color + '"></span>' +
        //    '<label for="color-picker-3" class="sr-only">Pick your color</label>' +
        //    '<input type="color" id="color-picker-3" class="color-picker" value="' + color + '"/>' +
        //    '</div></div></div>');

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
    * @param {boolean} show - If true shows the toolbar else hides it
    */
    function showToolbar(show) {
        // Set the color on toolbar so it match color during designing
        $('.toolbar .color-picker').val(color);
        show ? $('.toolbar').show() : $('.toolbar').hide();
    }

    /**
    * @description Toggles coloring of a pixel  
    * @param {JQueryObject} target - Target cell to color/uncolor
    */
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
    * @description Allows hiding default input type="color" element so we can use icon instead.
    * When clicking on the icon, it triggers a click on the first all the color picker input fields
    * @param
    */
    $('body').on('click', '.trigger-color-picker', function (evt) {
        $('.color-picker').first().trigger('click');
    });

    /**
    * @description Handler for updating the color from the color picker
    * @param
    */
    $('body').on('input', '.color-picker', function (evt) {
        color = $(evt.target).val();
        $('.color-picker').val(color);
        $('.trigger-color-picker').css('color', color); // color the icon so user know color has change

        // If color is changed from the toolbar, we want to automatically close the toolbar after color selection.
        // The color picker in the toolbar, will have a parent with the tooling class.
        let toolbarParents = $(evt.target).parents('.tooling');
        if (toolbarParents.length > 0) {
            toolbarIsOpen = true;
            toolbarParents.first().trigger('click');
        }
    });

    /**
    * @description Handler for updating the text
    * @param
    */
    $('body').on('click', '#keyboard td', function (evt) {
        // Deselect current letter
        if (letter) {
            letter.css('background-color', '#fff');
        }

        // Assign new letter
        letter = $(evt.target);
        letter.css('background-color', '#eee');
    });

    /**
    * @description Handler for showing cell options
    * @param
    */
    function showCellOptions(target) {
        dragPixelColoring = true;
        pixelTexting = false;

        cellOptions.show();

        // Update current selected color
        $('.trigger-color-picker').css('color', color);

        // Automatically close toolbar after activating cell options
        $('.tooling').first().trigger('click');
    };

    /**
    * @description Resets the live canvas and returns user to initial design state
    * @param
    */
    $('body').on('click', '#confirm-start-over', function (evt) {
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

        $('.current-tool').remove();
        pixelCanvas.removeClass('active')
        pixelCanvas.empty();
        previewArea.find('.section-title').show();
        previewArea.addClass('hidden-xs')
            .addClass('hidden-sm')
            .removeClass('col-md-12')
            .addClass('col-md-8');
        hideDesignArea(false);
        $('.tool-container').empty();
        $('.tooling').trigger('click');
        showToolbar(false);
        $('.actions').hide();
        dragPixelColoring = false;
        pixelTexting = false;
        colorPicker.val('#000');
        $(pixelCanvas).css('cursor', 'unset');
        canvasWidth.focus();
        $('.action-button').removeAttr('disabled');
        enableCanvasBuild();
    });

    /**
    * @description Coloring of multiple pixels or entering pixel text
    * @param {Event} - The object to which event was triggered
    */
    $('body').on('mousedown', '.active td', function (evt5) {

        dragPixelColoring = !pixelTexting;
        let activeTds = $('.active td');
        let firstCell = $(evt5.target);

        if (dragPixelColoring) {
            activeTds.css('cursor', 'cell');

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
        } else {
            // Enter a letter
            activeTds.css('cursor', 'text');
            activeTds.addClass('pixel-text');
            firstCell.addClass('pixel-text').html(letter.html());
        }
    });

    /**
   * @description Allows coloring of multiple pixels with dragging
   * @param {Event} - The object to which event was triggered
   */
    $('body').on('dblclick', '.active td', function (evt) {
        $(evt.target).html('');
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

            $('.tool-icon').animate({
                left: 0,
            }, 500, function () {
                //$('.tool-icon').css('transform', 'rotate(-130deg)');
                $('.actions').css('margin', '0 auto')
            });

            $('.toolbox').animate({
                left: -100,
            }, 300, function () {
                pixelCanvas.css({ 'background-color': 'transparent', 'filter': 'blur(0)' });
                // $('.tool-icon').css('transform', 'rotate(-130deg)');
            });
        } else {

            toolbarIsOpen = true;

            pixelCanvas.css({ 'background-color': 'transparent', 'filter': 'blur(3px)' });
            $('.actions').animate({
                marginLeft: toolbox.width() + 'px',
            });

            $('.toolbox').animate({
                opacity: 1,
                left: -10,
            }, 300, function () {
                //$('.tool-icon').css('transform', 'rotate(-30deg)');
            });

            $('.tool-icon').animate({
                left: toolbox.width() + 5,
            }, 280, function () {
                //$('.tool-icon').css('transform', 'rotate(-30deg)'); 
            });
        }
    });

    /**
    * @description While in active pixel coloring mode, displays tool options based on selected tool
    * @param {Event} - The object to which event was triggered
    */
    $('.action-button').on('click', function (evt) {
        // Determine which action tool to display in tool container
        if ($(this).hasClass('color-cells')) {
            console.log('Should show cell color options');
            $('.action-button').removeAttr('disabled');
            $(this).attr('disabled', true);
            showCellOptions($(this));
        } else if ($(this).hasClass('add-text')) {
            console.log('Should show keyboard');
            $('.action-button').removeAttr('disabled');
            $(this).attr('disabled', true);
            showKeyboard();
        } else if ($(this).hasClass('start-over')) {
            console.log('Should start over');
            $('#confirmStartOverModal').modal('show');
        } else {
            console.log('Should show help info about the options');
        }
    });
});