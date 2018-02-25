$(document).ready(function () {
    var w;
    var h;
    var selector;
    var hideDesignArea = hideDesignArea;
    var buildPreview = buildPreview;
    var buildCanvas = buildCanvas;

    /* Given a table element builds it of provided width and height. */
    buildPreview = function (selector, w, h) {

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

    hideDesignArea = function (hide) {
        var designArea = $('.design-area');

        if (hide) {
            designArea.css('margin-left', '-1000px');
        } else {
            designArea.css('margin-left', '0');
        }
    }

    /* Builds and displays pixel canvas fullscreen for editing */
    buildCanvas = function() {
        $('.preview-area').first().removeClass('col-md-8');
        //$('.preview-area').find('.section-title').first().remove();
        $('.preview-area').find('.section-title').css('display', 'none');
        buildPreview(selector, w, h);
        $('.preview-area').prepend('<br><button class="btn reset-canvas" id="start-over-button" data-toggle="modal" data-target="#confirmStartOverModal" style="width: 80%">Start Over</button>');
        $('body').css('cursor', 'cell');
    }

    /* Listeners */

    /* Event Handler for user clicking submit canvas dimensions */
    $('#canvas-dimensions').on('submit', function (evt) {
        console.log("evt: ", evt);
        evt.preventDefault();

        var table = $('#pixel-canvas');
        w = $('#canvas-width').val();
        h = $('#canvas-height').val();
        selector = table;

        buildPreview(table, w, h);

    });

    $('#build').on('click', function (v, h) {
        $('#pixel-canvas').empty();
        console.log('Should build real grid');
        hideDesignArea(true);
        buildCanvas();

    });

    $('.preview-area').on('click', '.reset-canvas', function () {
        console.log('should show modal to confirm if clear canvas canvas');
    });

    $('#start-over').on('click', function () {
        console.log('confirmation given to reset canvas');
        $('#confirmStartOverModal').modal('hide');
        $('#pixel-canvas').empty();

        //$('.preview-area').find('.section-title').first().remove();

        $('.preview-area').find('.section-title').css('display', 'initial');
        $('.preview-area').first().addClass('col-md-8');
        $('#start-over-button').remove();
        hideDesignArea(false);
        $('#reset').trigger("click");
    });

    $('body').on('click', '#reset', function () {
        $('#pixel-canvas').empty();
    });
});