$(document).ready(function () {
    'use strict';

    let letters = [['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
    ['j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r'],
    ['s', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ABC']];

    let width;
    let height;
    let letter;
    let color = '#000000';
    let activity;
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
    let toolContainer = $('.tool-container');

    function Cell(element) {
        this.html = element;
        this.selector = $(element);
        this.color = function () {
            this.selector.css('background-color', color)
                .addClass('colored');
        };
        this.uncolor = function () {
            // Remove the sparkles and cell color
            this.selector.find('span').remove();
            this.selector.css('background-color', '#fff')
                .removeClass('colored');
        };
        this.addText = function (text) {
            this.selector.css('color', color);
            this.selector.html(text);
        };
        this.removeText = function () {
            this.selector.text('');
        }
    }

    let cellOptions = {
        icon: $('.color-cells'),
        option: this.dragPixelColoring,
        sparkles: { name: 'sparkles', selected: false, selector: $('.sparkles') },
        isErasing: { name: 'erase', selected: false, selector: $('.erase') },
        dragPixelColoring: { name: 'dragPixelColoring', 'selected': true, selector: $('.color-cell') },
        html: '<div class="col-xs-auto tool-options">' +
        '<button style="background-color: #b03a2e; margin-right: 10px;"><span class="glyphicon glyphicon-th-large cell-tool" style="display: inline-block; margin: 10px;"></span></button>' +
        '<button class="btn btn-default tool-button" style="margin: 5px;"><span class="glyphicon glyphicon-tint trigger-color-picker color-cell tool-option" style="display: inline-block; margin: 10px;"></span></button>' +
        '<button class="btn btn-default tool-button" style="margin: 5px;"><span class="glyphicon glyphicon-asterisk sparkles tool-option" style="display: inline-block; margin: 10px;"></span></button>' +
        '<button class="btn btn-default tool-button" style="margin: 5px;"><span class="glyphicon glyphicon-erase erase tool-option" style="display: inline-block; margin: 10px;"></span></button></div>',
        show: function () {
            toolContainer.empty();
            toolContainer.prepend(this.html);
            this.icon.attr('disabled', true);
            this.setOption(this.dragPixelColoring.selector);
        },
        setOption: function (selector) {
            this.resetOptions();
            selector.parent().first().attr('disabled', true);

            if (selector.hasClass('sparkles')) {
                this.sparkles.selected = true;
                this.option = this.sparkles;
            } else if (selector.hasClass('color-cell') || selector.hasClass('cell-tool')) {
                if (selector.hasClass('cell-tool')) {
                    $('.color-cell').parent().first().attr('disabled', true);
                }
                this.dragPixelColoring.selected = true;
                this.option = this.dragPixelColoring;
            } else if (selector.hasClass('erase')) {
                this.isErasing.selected = true;
                this.option = this.isErasing;
            } else {
                console.log('invalid cell option');
            }
        },
        resetOptions: function () {
            $('.tool-button').attr('disabled', false);
            this.isErasing.selected = false;
            this.dragPixelColoring.selected = false;
            this.sparkles.selected = false;
        }
    }

    let keyboardOptions = {
        icon: $('.add-text'),
        option: this.texting,
        texting: { name: 'colorText', selected: false, selector: $('.color-text') },
        isErasing: { name: 'erase', selected: false, selector: $('.erase') },
        html: '<div class="col-xs-auto tool-options">' +
        '<button style="background-color: #b03a2e; margin-right: 10px;"><span class="glyphicon glyphicon-text-size cell-tool" style="display: inline-block; margin: 10px;"></span></button>' +
        '<table id="keyboard" class="keyboard" style="display: inline-block;"></table>' +
        '<button class="btn btn-default tool-button" style="margin: 5px;"><span class="glyphicon glyphicon-tint trigger-color-picker color-text tool-option" style="display: inline-block; margin: 10px;"></span></button>' +
        '<button class="btn btn-default tool-button" style="margin: 5px;"><span class="glyphicon glyphicon-erase erase" style="display: inline-block; margin: 10px;"></span></button></div>',
        show: function () {
            toolContainer.empty();
            toolContainer.prepend(this.html);
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
        },
        setOption: function (selector) {
            this.resetOptions();
            debugger;
            selector.parent().first().attr('disabled', true);

            if (selector.hasClass('color-text') || selector.hasClass('cell-tool')) {
                if (selector.hasClass('cell-tool')) {
                    $('.color-text').parent().first().attr('disabled', true);
                }
                this.texting.selected = true;
                this.option = this.texting;
            } else if (selector.hasClass('erase')) {
                this.isErasing.selected = true;
                this.option = this.isErasing;
            } else {
                console.log('invalid keyboard option');
            }
        },
        resetOptions: function () {
            $('.tool-button').attr('disabled', false);
            this.texting.selected = false;
            this.isErasing.selected = false;
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


        toolContainer.append('<table id="keyboard" class="keyboard"></table>');

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
        cellOptions.setOption($('.color-cell'));
        activity = "pixelColoring";

        // Update current color
        $('.trigger-color-picker').css('color', color);

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
        debugger;
        let pixelLetters = $('.letter');

        if ($(evt.target).text() === 'abc') {
            pixelLetters.not(":last").css('text-transform', 'lowercase');
            $.each(pixelLetters, function (index, value) {
                let currentText = $(pixelLetters[index]).text();
                $(pixelLetters[index]).text(currentText.toLowerCase());

                if (index === pixelLetters.length - 1) {
                    $(pixelLetters[index]).text(currentText.toUpperCase());
                }
            });

        } else if ($(evt.target).text() === 'ABC') {
            $('.letter').not(":last").css('text-transform', 'uppercase');
            $.each(pixelLetters, function (index, value) {
                let currentText = $(pixelLetters[index]).text();
                $(pixelLetters[index]).text(currentText.toUpperCase());

                if (index === pixelLetters.length - 1) {
                    $(pixelLetters[index]).text(currentText.toLowerCase());
                }
            });
        } else {
            // Deselect current letter
            if (letter) {
                letter.css('background-color', '#fff');
            }

        letter = $(evt.target);
            // Assign new letter
            letter.css('background-color', '#eee');
        }
    });

    /**
    * @description Resets the live canvas and returns user to initial design state
    * @param
    */
    $('body').on('click', '#confirm-start-over', function () {
        $('#confirmStartOverModal').modal('hide');
        $('#reset').trigger('click');
    });

    /**
    * @description Clears any pixel art in the grid
    * @param
    */
    $('body').on('click', '#confirm-reset', function () {
        $('#confirmResetModal').modal('hide');
        const cells = pixelCanvas.find('td')
        cells.html('');
        cells.empty();

        cells.css('background-color', '#fff');
    });

    /**
    * @description Resets preview and live pixel canvas when reset button is clicked
    * @param
    */
    $('body').on('click', '#reset', function () {
        debugger;
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
        toolContainer.empty();
        //$('.tooling').trigger('click');
        showToolbar(false);
        $('.actions').hide();
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
        let activeTds = $('.active td');
        let cell = new Cell(this);
        if (activity === "pixelColoring") {
            switch (cellOptions.option.name) {
                case 'sparkles':
                    cell.selector.append('<span class="sparkle" style="position: absolute; overflow: hidden; top: 0; left: 10px; animation: spin 2s linear infinite reverse;"></span>' +
                        '<span class="sparkle" style="position: absolute; top: 8; left: 7px; overflow: hidden; animation: reverseSpin 2s linear infinite reverse;"></span>' +
                        '<span class="sparkle" style="position: absolute; top: 0; left: 2px; overflow: hidden;"></span>' +
                        '<span class="sparkle" style="position: absolute; overflow: hidden; animation: reverseSpin 2s linear infinite; top: 2px; left: 7px;"></span>' +
                        '<span class="sparkle" style="position: absolute; overflow: hidden; animation: spin 2s linear infinite; top: 11; right: 10px;"></span>' +
                        '<span class="sparkle" style="position: absolute; top: 0;  overflow: hidden;right: 2px;"></span>'
                    );
                    break;
                case 'dragPixelColoring':
                    activeTds.css('cursor', 'cell');
                    cell.color();

                    // As we enter new cells, color them
                    $('.active td').on('mouseenter', function (evt2) {
                        let targetCell = new Cell(evt2.currentTarget);
                        targetCell.color()
                    });

                    // Terminates the coloring of new cell, by by removing the listener
                    $('.active td').on('mouseup', function (evt3) {
                        //$(evt3.target).css('background-color', 'purple'); // Color last cell dragged to. Just a little extra magic
                        $('.active td').off('mouseenter');
                    });
                    break;
                case 'erase':
                    debugger;
                    cell.uncolor();
                    $('.active td').on('mouseenter', function (evt2) {
                        // we want to make sure to get just the td and not it's child (span sparkle element for example)
                        let targetCell = new Cell(evt2.currentTarget);
                        targetCell.uncolor();
                    });

                    // Terminates the coloring of new cell, by by removing the listener
                    $('.active td').on('mouseup', function (evt3) {
                        //$(evt3.target).css('background-color', 'purple'); // Color last cell dragged to. Just a little extra magic
                        $('.active td').off('mouseenter');
                    });
                    break;

                default:
                    console.log('invalid option');
            }
        } else {
            // Enter a letter
            switch (keyboardOptions.option.name) {
                case 'colorText':
                    activeTds.css('cursor', 'text');
                    activeTds.addClass('pixel-text');
                    cell.selector.addClass('pixel-text');
                    if (letter) {
                        console.log('letter text: ', letter.text());
                        if (letter.text() !== 'abc' && letter.text() !== 'ABC') {
                            cell.addText(letter.text());
                            console.log('THIS IS THE TEXT IM PUTTING IN LETTER: ', letter.prop('outerHTML'));
                        }
                    }
                    break;
                case 'erase':
                    cell.removeText();
            }

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

        $('.tooling').first().trigger('click');

        let action = $(this);

        // Determine which action tool to display in tool container
        if (action.hasClass('color-cells')) {
            $('.action-button').removeAttr('disabled');
            action.attr('disabled', true);
            activity = "pixelColoring";
            cellOptions.show();
        } else if (action.hasClass('add-text')) {
            $('.action-button').removeAttr('disabled');
            action.attr('disabled', true);
            activity = "pixelTexting";
            keyboardOptions.show();
            keyboardOptions.setOption($('.color-text'));
        } else if (action.hasClass('start-over')) {
            activity = "startOver";
            $('#confirmStartOverModal').modal('show');
        } else if (action.hasClass('reset')) {
            //activity = "reset";
            $('#confirmResetModal').modal('show');
        } else {
            console.log('Should show help info about the options');
        }

        $('.trigger-color-picker').css('color', color);
    });

    $('body').on('click', '.tool-options span', function (evt) {
        let target = $(evt.target);

        if (activity === "pixelColoring") {
            cellOptions.setOption(target);
        } else {
            keyboardOptions.setOption(target);
        }
    });
});