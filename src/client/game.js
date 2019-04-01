let game = {
    player: {color: '#ff0000', mass: 5, radius: 5, position: {x: 10, y: 10}, velocity: {x: 0, y: 0}},
    planets: [
        {name: 'earth', velocity: {x: 0, y: 10}, position: {x: 400, y: 250}, radius: 25, density: 1, color: '#00dd00'},
        {name: 'sun', velocity: {x: 0, y: 0}, position: {x: 250, y: 250}, radius: 50, density: 5, color: '#ff9900'}
    ]
}

let canvas = document.getElementById("game");
let ctx = canvas.getContext('2d');
const pi = Math.PI;
let G = 2.76;
let jumpForce = 1/3;

window.addEventListener("keydown", keyDown);

function keyDown(e) {
    console.log(e.keyCode);
    if (e.keyCode == 38 || e.keyCode == 87) {
        if (game.player.stuck) {
            game.player.velocity = vecAdd(game.player.stuck.velocity, {x: jumpForce * (game.player.position.x - game.player.stuck.position.x), y: jumpForce * (game.player.position.y - game.player.stuck.position.y)});
            game.player.position = vecAdd(game.player.position, game.player.velocity);
            game.player.stuck = null;
        }
    }
}

function drawCircle(center, radius, color = '#000000') {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2*pi);
    ctx.stroke();
    ctx.fill();
}
function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}
function getMass(planet) {
    return planet.mass || Math.pow(planet.radius, 2) * pi * planet.density;
}
function applyForce(planet, force) {
    const mass = getMass(planet);
    planet.velocity.x += force.x / mass;
    planet.velocity.y += force.y / mass;
}
function vecAdd(v1, v2) {
    return {x: v1.x + v2.x, y: v1.y + v2.y}
}
function calculateGravityForce(obj1, obj2) {
    const distance = getDistance(obj1.position, obj2.position);
    const force = getMass(obj1) * getMass(obj2) / (distance*distance*G);
    const forceY = force * (obj1.position.y - obj2.position.y) / distance;
    const forceX = force * (obj1.position.x - obj2.position.x) / distance;
    return {x: forceX, y: forceY};
}





function render() {
    let offset = {x: 250 - game.planets[1].position.x, y: 250 - game.planets[1].position.y}
    ctx.clearRect(0,0,canvas.width, canvas.height);
    let objects = game.planets.concat([game.player]);
    objects.forEach(planet => {
        drawCircle(vecAdd(planet.position, offset), planet.radius, planet.color);
    });
}
function update() {
    let objects = game.planets;
    if (!game.player.stuck) {
        objects = game.planets.concat(game.player);
    }
    if (objects.length > 1) {
        for (let i=0;i<objects.length - 1;i++) {
            for (let j=i+1;j<objects.length;j++) {
                const p1 = objects[i];
                const p2 = objects[j];
                let gravityForce = calculateGravityForce(p1,p2);
                applyForce(p2, gravityForce);
                gravityForce.x = -gravityForce.x;
                gravityForce.y = -gravityForce.y;
                applyForce(p1, gravityForce);
            }
        }
    }
    if (!game.player.stuck) {
        for (let i=0;i<objects.length - 1;i++) {
            let minDistance = game.player.radius + objects[i].radius;
            let currentDistance = getDistance(game.player.position, objects[i].position);
            if (currentDistance < minDistance) {
                game.player.stuck = objects[i];
                game.player.position.x = objects[i].position.x + (game.player.position.x - objects[i].position.x) * minDistance / currentDistance;
                game.player.position.y = objects[i].position.y + (game.player.position.y - objects[i].position.y) * minDistance / currentDistance;
            }
        }
    }
    for (let i=0;i<objects.length;i++) {
        let p = objects[i];
        if (game.player.stuck == p) {
            game.player.velocity = p.velocity;
            game.player.position = vecAdd(game.player.position, p.velocity);
        }
        p.position = vecAdd(p.position, p.velocity);
    }
}

setInterval(() => {
    update();
    render();
}, 1000/60);