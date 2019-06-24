let game = {

}

let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.addEventListener('mousemove', mouseMove);
window.addEventListener('mousedown', mouseDown);
window.addEventListener('mouseup', mouseUp);

input = {
    key: {

    },
    mouse: {
        x: -1,
        y: -1
    }
}

function keyDown(e) {
    const currentData = input.key[e.keyCode];
    if (currentData) {
        input.key[e.keyCode].firstPress = false;
    } else {
        input.key[e.keyCode] = {firstPress: true, startTime: Date.now()};
    }
}
function keyUp(e) {
    delete currentData[e.keyCode]
}
function mouseMove(e) {
    input.mouse.x = e.x;
    input.mouse.y = e.y;
}
function mouseDown(e) {
    if (input.mouse.left) {
        input.mouse.left.firstPress = false;
    } else {
        input.mouse.left = {firstPress: true, startTime: Date.now()};
    }
}
function mouseUp(e) {
    delete input.mouse.left;
}


function render() {

}
function update() {

}

setInterval(() => {
    update();
    render();
}, 1000/60);