$(document).ready(function () {
    const canvas = new fabric.Canvas('whiteboard');
    const penSizeInput = $('#penSize');
    const penColorInput = $('#penColor');
    const eraserSizeInput = $('#eraserSize');
    const notification = $('#notification');
    const eraserPreviewElement = $('#eraser-preview');
    const history = [];
    const redoStack = [];

    const DEFAULT_PEN_SIZE = 5;
    const DEFAULT_ERASER_SIZE = 10;

    function initializeCanvas() {
        canvas.setWidth(window.innerWidth);
        canvas.setHeight(window.innerHeight);
        canvas.backgroundColor = 'white';
        canvas.renderAll();
    }

    function setupDrawingOptions() {
        if (canvas.isDrawingMode) {
            if (canvas.freeDrawingBrush.color === 'white') {
                canvas.freeDrawingBrush.width = parseInt(eraserSizeInput.val());
            } else {
                canvas.freeDrawingBrush.width = parseInt(penSizeInput.val());
                canvas.freeDrawingBrush.color = penColorInput.val();
            }
        }
    }

    function setupEventListeners() {
        $(window).resize(initializeCanvas);
        penSizeInput.on('input', updatePenOptions);
        eraserSizeInput.on('input', updateEraserOptions);
        penColorInput.on('input', updatePenColor);
        
        canvas.on('mouse:down', addToHistory);
        canvas.on('mouse:move', handleMouseMove);
        canvas.on('mouse:out', hideEraserPreview);
        
        $('.btn-tool').click(handleToolClick);
        $('#confirmAction').on('click', handleConfirmClearCanvas);
        
        $(document).keydown(handleKeyboardShortcuts);
    }

    function updatePenOptions() {
        const penSize = penSizeInput.val();
        $('#penSizePreview').css({
            background: penColorInput.val(),
            width: penSize + 'px',
            height: penSize + 'px',
            borderRadius: '50%'  // Make preview circular
        });
        if (canvas.isDrawingMode && canvas.freeDrawingBrush.color !== 'white') {
            setupDrawingOptions();
        }
    }

    function updateEraserOptions() {
        const eraserSize = eraserSizeInput.val();
        $('#eraserSizePreview').css({
            width: eraserSize + 'px',
            height: eraserSize + 'px',
            borderRadius: '50%',  // Make preview circular
            margin: '0 auto'      // Center it horizontally in its parent div
        });
        if (canvas.isDrawingMode && canvas.freeDrawingBrush.color === 'white') {
            setupDrawingOptions();
        }
        updateEraserPreview();
    }

    function updatePenColor() {
        $('#penSizePreview').css('background', penColorInput.val());
        if (canvas.isDrawingMode && canvas.freeDrawingBrush.color !== 'white') {
            setupDrawingOptions();
        }
    }

    function handleToolClick() {
        const tool = $(this).data('tool');
        const action = $(this).data('action');

        $('.btn-tool').removeClass('active');

        if (tool === 'pen') {
            enableDrawing();
            $('#pen-options').fadeIn(300).addClass('show');
            $(this).addClass('active');
        } else if (tool === 'eraser') {
            enableEraser();
            $('#eraser-options').fadeIn(300).addClass('show');
            $(this).addClass('active');
        } else if (action === 'clear') {
            showConfirmation("Are you sure you want to clear the canvas?");
        } else if (action === 'save') {
            saveCanvas();
        } else if (action === 'undo') {
            undo();
        } else if (action === 'redo') {
            redo();
        }

        $('.tool-options').not(`#${tool}-options`).fadeOut(300).removeClass('show');
    }

    function showConfirmation(message) {
        $('#modalMessage').text(message);
        $('#confirmationModal').modal('show');
    }

    function handleConfirmClearCanvas() {
        $('#confirmationModal').modal('hide');
        clearCanvas();
    }

    function enableDrawing() {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        setupDrawingOptions();
        hideEraserPreview();
    }

    function enableEraser() {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color = 'white';
        setupDrawingOptions();
        showEraserPreview();
    }

    function clearCanvas() {
        canvas.clear();
        canvas.backgroundColor = 'white';
        canvas.renderAll();
        showNotification("Canvas cleared!");
        resetHistory();
    }

    function resetHistory() {
        history.length = 0;
        redoStack.length = 0;
    }

    function saveCanvas() {
        const link = document.createElement('a');
        link.download = 'whiteboard.png';
        link.href = canvas.toDataURL();
        link.click();
        showNotification("Canvas saved as image!");
    }

    function addToHistory() {
        if (history.length === 10) history.shift();
        history.push(canvas.toDataURL());
        redoStack.length = 0;
    }

    function undo() {
        if (history.length > 0) {
            redoStack.push(canvas.toDataURL());
            const lastState = history.pop();
            fabric.Image.fromURL(lastState, function(img) {
                canvas.clear();
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
            });
        }
    }

    function redo() {
        if (redoStack.length > 0) {
            const lastRedo = redoStack.pop();
            history.push(canvas.toDataURL());
            fabric.Image.fromURL(lastRedo, function(img) {
                canvas.clear();
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
            });
        }
    }

    function updateEraserPreview() {
        const eraserSize = parseInt(eraserSizeInput.val());
        eraserPreviewElement.css({
            width: eraserSize + 'px',
            height: eraserSize + 'px',
            border: '2px dotted black',
            position: 'absolute',
            display: 'block',
            borderRadius: '50%'  // Make eraser preview circular
        });
    }

    function showEraserPreview() {
        $(document).on('mousemove', function (e) {
            const eraserSize = parseInt(eraserSizeInput.val());
            eraserPreviewElement.css({
                left: e.pageX - eraserSize / 2,
                top: e.pageY - eraserSize / 2,
            }).fadeIn(100);
        });
    }

    function hideEraserPreview() {
        eraserPreviewElement.fadeOut(100);
        $(document).off('mousemove');
    }

    function handleMouseMove(e) {
        if (canvas.isDrawingMode && canvas.freeDrawingBrush.color === 'white') {
            showEraserPreview();
        }
    }

    function handleKeyboardShortcuts(e) {
        switch (e.key) {
            case 'p':
                enableDrawing();
                break;
            case 'z':
                if (e.ctrlKey) undo();
                break;
            case 'y':
                if (e.ctrlKey) redo();
                break;
        }
    }

    function showNotification(message) {
        notification.text(message).fadeIn(300).delay(2000).fadeOut(300);
    }

    penSizeInput.val(DEFAULT_PEN_SIZE).trigger('input');
    eraserSizeInput.val(DEFAULT_ERASER_SIZE).trigger('input');
    $('.btn-tool[data-tool="pen"]').click();

    setupEventListeners();
    initializeCanvas();
});
