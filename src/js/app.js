var stage;
var points = [];
var lines = [];
var lastpoint, lastline;
var point_is_moving = false;
var frames = [];
var actualframe = 0;
var is_animating = false;
var tools = {
    move: {
        active: false
    },
    create_point: {
        active: false
    },
    select: {
        active: false
    },
    remove: {
        active: false
    },
};

$(document).ready(function () {
    stage = new createjs.Stage('app-main');
    set100();
    createjs.Ticker.addEventListener($('body')[0]);
    // addNewPoint(0, 0);

    stage.on("stagemousedown", function (evt) {
        if (tools.create_point.active === true) {
            addNewPoint(evt.stageX, evt.stageY);
        }
        point_is_moving = false;
    });
    stage.update();
    stage.enableMouseOver();

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);

    bindUIEvents();
});

var hover = false;
function addNewPoint(x, y) {
    console.log(x, y);
    if (hover === false) {
        var circle = new createjs.Shape();
        circle.graphics.beginStroke("#00FF00").beginFill('rgba(0,0,0)').drawCircle(0, 0, 2);
        circle.x = x;
        circle.y = y;
        stage.addChild(circle);

        circle.on('pressmove', handleMousePressMove);
        circle.on('click', handleMouseClick);
        circle.on('mouseover', handleMouseIn);
        circle.on("mouseout", handleMouseOut);
        var index = points.push(circle);
        index = index - 1;
        console.log(index);
        points[index].array_index = index;
        if (lastpoint !== undefined) {
            points[index].parent_node = lastpoint;
        }
        lastpoint = index;
        console.log(points);
        drawLines(points[index]);
        stage.update();
    }
}

function handleMousePressMove(evt) {
    if (tools.move.active === true) {
        evt.target.x = evt.stageX;
        evt.target.y = evt.stageY;
        point_is_moving = true;
    }
    stage.update();
}

function handleMouseClick(evt) {
    if (tools.create_point.active === true) {
        lastpoint = evt.currentTarget.array_index;
        console.log(lastpoint);
    }
    stage.update();
}

function drawLines(point) {
    if (point.parent_node !== undefined) {
        var parent = points[point.parent_node];
        var line = new createjs.Shape();
        stage.addChild(line);
        line.graphics.setStrokeStyle(1).beginStroke("rgba(0,255,0,0.7)");
        line.graphics.moveTo(point.x, point.y);
        line.graphics.lineTo(parent.x, parent.y);
        var index = lines.push(line);
        index = index - 1;
        lines[index].index = index;
        lines[index].point = point.array_index;
        lines[index].point_parent = parent.array_index;
        if (lastline !== undefined) {
            lastline.parent_line = lastline
        }
        lastline = index;
    }
}

function handleMouseIn(e, b) {
    hover = true;
    e.currentTarget.graphics.command.radius = 10;
    stage.update();
}

function handleMouseOut(e, b) {
    e.currentTarget.graphics.command.radius = 2;
    stage.update();
    hover = false;
}

function tick() {
    stage.update();
}

function set100() {
    // var canvas = document.getElementById('app-main'),
    //     context = canvas.getContext('2d');
    // window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        // canvas.width = window.innerWidth;
        // canvas.height = window.innerHeight;
        stage.canvas.width = window.innerWidth;
        stage.canvas.height = window.innerHeight;
    }
    resizeCanvas();
}

function redrawLines(point, index) {
    if (point.parent_node !== undefined) {
        var parent = points[point.parent_node];
        var line = new createjs.Shape();
        stage.addChild(line);
        line.graphics.setStrokeStyle(1).beginStroke("rgba(0,255,0,0.7)");
        line.graphics.moveTo(point.x, point.y);
        line.graphics.lineTo(parent.x, parent.y);
        line.index = index;
        line.point = point.array_index;
        line.point_parent = parent.array_index;
        lines[index] = line;
    }
}

function recalculateLines() {
    for (var l = 0; l < lines.length; l++) {
        var line = lines[l];
        var point = points[line.point];
        stage.removeChild(line);
        redrawLines(point, l);
        // drawLines(point);
    }
}

function update() {
    if (point_is_moving === true) {
        recalculateLines();
    }
    if (is_animating === true) {
        drawAnimation();
    }
}

var actual_anim_frame = 0;
var last_frame;

function drawAnimation() {
    cleanCanvas();
    startAnimation();
}

function startAnimation() {
    var actual = copy(frames[1]);
    var last = copy(frames[0]);

    interpolateAndUpdate(actual, last);
}

function interpolateAndUpdate(actual, last) {
    console.log(actual, last, actual_anim_frame);

    stage.removeAllChildren();
    var next_frame = true;

    for (var l = 0; l < last.length; l++) {
        var lastframepoint = last[l];
        var circle = new createjs.Shape();
        circle.graphics.beginStroke('rgba(0, 255, 0, 1)').beginFill('rgba(0, 255, 0, 0.2)').drawCircle(0, 0, 2);
        last[l].x += (actual[l].x - last[l].x) * .1;
        last[l].y += (actual[l].y - last[l].y) * .1;
        circle.x = last[l].x;
        circle.y = last[l].y;
        stage.addChild(circle);

        if(actual[last[l].parent_node] !== undefined){
            var line = new createjs.Shape();
            line.graphics.setStrokeStyle(1).beginStroke("rgba(0, 255, 0, 1)");
            line.graphics.moveTo(lastframepoint.x, lastframepoint.y);
            line.graphics.lineTo(last[lastframepoint.parent_node].x, last[lastframepoint.parent_node].y);
            stage.addChild(line);
        }

        var x = circle.x;
        var y = circle.y;
        var tx = actual[l].x;
        var ty = actual[l].y;

        var ok = true;
        var xdiff = parseInt(x - tx);
        var ydiff = parseInt(y - ty);

        // console.log(xdiff, 'x');
        // console.log(ydiff, 'y');
    
        if(xdiff >= -1 && xdiff <= 1){

        }
        else{
            next_frame = false;
        }
        
        if(ydiff >= -1 && ydiff <= 1){

        }
        else{
            next_frame = false;
        }
    }

    if (next_frame === true) {
        setTimeout(function () {
            actual_anim_frame++;
            console.log(actual_anim_frame >= frames.length);

            if (actual_anim_frame >= frames.length) {
                console.log('if');
                actual_anim_frame = 0;
                actual = copy(frames[1]);
                last = copy(frames[0]);
            }
            else{
                console.log('else');
                actual = copy(frames[actual_anim_frame]);
                last = copy(frames[actual_anim_frame - 1]);
            }            

            interpolateAndUpdate(actual, last);
        }, 16);
    }
    else {
        setTimeout(function () {
            interpolateAndUpdate(actual, last);
        }, 16);
    }

    stage.update();
}

function checkPosition(x, y, tx, ty){
    var ok = true;
    var xdiff = parseInt(x - tx);
    var ydiff = parseInt(y - ty);

    if(xdiff <= -1 && xdiff >= 1){
        ok = false;
    }
    
    if(ydiff <= -1 && ydiff >= 1){
        ok = false;
    }

    return ok;
}

function copy(arr){
    return JSON.parse(JSON.stringify(arr));
}

function animateToNextFrame(actualf, nextf) {
    removeLastLastFrame();
    var difftotal = 0;
    var minvelocity = 0.5;
    for (var af = 0; af < actualf.length; af++) {
        var actualpoint = actualf[af];
        var nextpoint = nextf[af];
        if (nextpoint !== undefined) {
            var diffx;
            var diffy;

            if (actualpoint.x <= nextpoint.x) {
                diffx = (nextpoint.x - actualpoint.x) / 60;
            }
            else {
                diffx = (actualpoint.x - nextpoint.x) / 60;
            }

            if (actualpoint.y <= nextpoint.y) {
                diffy = (nextpoint.y - actualpoint.y) / 60;
            }
            else {
                diffy = (actualpoint.y - nextpoint.y) / 60;
            }

            var diffxcopy = diffx;
            var diffycopy = diffy;

            if (diffx < 1) { diffx = diffx * 60; }
            if (diffy < 1) { diffy = diffy * 60; }

            if (diffxcopy < 0) { diffxcopy = diffxcopy * -1; }
            if (diffycopy < 0) { diffycopy = diffycopy * -1; }

            if (diffxcopy > 0.1) {
                actualf[af].x += diffx;
            }
            if (diffycopy > 0.1) {
                actualf[af].y += diffy;
            }

            console.log(diffx, diffy);
            console.log(parseInt(diffxcopy), parseInt(diffycopy));

            var point = actualpoint;
            var circle = new createjs.Shape();
            circle.graphics.beginStroke('rgba(0, 255, 0, 1)').beginFill('rgba(0, 255, 0, 0.2)').drawCircle(0, 0, 2);
            circle.x = point.x;
            circle.y = point.y;
            stage.addChild(circle);
            lastFramePoints.push(circle);
            var parent = actualf[point.parent_node];
            if (parent !== undefined) {
                var line = new createjs.Shape();
                stage.addChild(line);
                line.graphics.setStrokeStyle(1).beginStroke("rgba(0, 255, 0, 1)");
                line.graphics.moveTo(point.x, point.y);
                line.graphics.lineTo(parent.x, parent.y);
                lastFrameLines.push(line);
            }

            difftotal += diffx + diffy;
        }
    }

    if (difftotal < 0) {
        difftotal = difftotal * -1;
    }
    console.log(difftotal, 'difftotal')
    stage.update();

    if (difftotal === 0) {
        is_animating = true;
    }
    else {
        setTimeout(function () {
            animateToNextFrame(actualf, nextf);
        }, 16);
    }
}

function deepClone(obj, hash = new WeakMap()) {
    if (Object(obj) !== obj) return obj; // primitives
    if (hash.has(obj)) return hash.get(obj); // cyclic reference
    try {
        var result = Array.isArray(obj) ? []
            : obj.constructor ? new obj.constructor() : {};
    } catch (e) {  // The constructor failed, create without running it
        result = Object.create(Object.getPrototypeOf(obj));
    }
    hash.set(obj, result);
    if (obj instanceof Map)
        Array.from(obj, ([key, val]) => result.set(key, deepClone(val, hash)));
    return Object.assign(result, ...Object.keys(obj).map(
        key => ({ [key]: deepClone(obj[key], hash) })));
}

function createActualCopy() {
    var pointscopy = [];
    for (var p = 0; p < points.length; p++) {
        var realpoint = points[p];
        var newpoint = points[p].clone();
        newpoint.array_index = realpoint.array_index;
        newpoint.parent_node = realpoint.parent_node;

        pointscopy.push(newpoint);
    }
    return pointscopy;
}

function addNewFrame() {
    addNewFrameUI();
    frames[actualframe] = createActualCopy();
    actualframe++;
    removeLastLastFrame();
    drawFrame(actualframe - 1);
}

function addNewFrameUI() {
    var canvas = $('#app-main')[0];
    var dataURLstring = canvas.toDataURL();
    $('[data-frame="' + actualframe + '"]').css('background-image', 'url(' + dataURLstring + ')');
    var nextframe = actualframe + 1;
    $('.js-add-frame').before('<div class="frame js-goto-frame" data-frame="' + nextframe + '"> <p>' + nextframe + '</p> </div>');
}

function cleanCanvas() {

}

function removeLastLastFrame() {
    for (var lfp = 0; lfp < lastFramePoints.length; lfp++) {
        var point = lastFramePoints[lfp];
        stage.removeChild(point);
    }
    for (var lfl = 0; lfl < lastFrameLines.length; lfl++) {
        var line = lastFrameLines[lfl];
        stage.removeChild(line);
    }
}

var lastFramePoints = [];
var lastFrameLines = [];
function drawFrame(frameindex) {
    for (var lp = 0; lp < frames[frameindex].length; lp++) {
        var point = frames[frameindex][lp];
        var circle = new createjs.Shape();
        circle.graphics.beginStroke('rgba(255, 255, 255, 0.5)').beginFill('rgba(255, 255, 255, 0.5)').drawCircle(0, 0, 2);
        circle.x = point.x;
        circle.y = point.y;
        stage.addChild(circle);
        lastFramePoints.push(circle);
        if (point.parent_node !== undefined) {
            var parent = points[point.parent_node];
            var line = new createjs.Shape();
            stage.addChild(line);
            line.graphics.setStrokeStyle(1).beginStroke("rgba(255,255,255,0.5)");
            line.graphics.moveTo(point.x, point.y);
            line.graphics.lineTo(parent.x, parent.y);
            lastFrameLines.push(line);
        }
    }
    stage.update();
}

function resetAllTools() {

    for (var tool in tools) {
        tools[tool].active = false;
    }
}

function bindUIEvents() {
    $('.js-add-frame').click(function () {
        addNewFrame();
    });

    $('.js-play').click(function () {
        is_animating = true;
    });

    $('.js-pause').click(function () {
        is_animating = false;
    });

    $('.js-add-new').click(function () {
        resetAllTools();
        tools.create_point.active = true;
    });

    $('.js-move').click(function () {
        resetAllTools();
        tools.move.active = true;
    });

    $('.js-select-area').click(function () {
        resetAllTools();
    });

    $('.js-remove-point').click(function () {
        resetAllTools();
    });
}

setInterval(update, 16);