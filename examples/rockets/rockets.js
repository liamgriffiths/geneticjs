window.requestAnimFrame = (function(){
  return window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         function( callback ){
           window.setTimeout(callback, 1000 / 60);
         };
})();

// set up the rocket
function Rocket(settings) {
  settings = settings || {};
  this.position = settings.position || {x: 0, y: 0};
  this.acceleration = settings.acceleration || {x: Math.random() * 0.1, y: Math.random() * 0.1};
  this.velocity = settings.velocity || {x: 1, y: 1};
  this.color = settings.color || Math.floor(Math.random() * 255);
  this.live = true;
  this.finished = false;
  this.age = settings.age || 0;
  this.size = settings.size || 10;
}

// rockets will be based on beings
Rocket.prototype = new Being();

Rocket.prototype.update = function (currentCycle, target, delta) {
  if(this.live && !this.finished) {
    var direction = this.dna[currentCycle];
    // update acceleration
    if (this.velocity.x > 5) this.velocity.x = 1;
    if (this.velocity.y > 5) this.velocity.y = 1;

    // apply acceleration
    this.velocity = {x: this.velocity.x + this.acceleration.x,
                     y: this.velocity.y + this.acceleration.y};

    // apply direction vector
    var x = this.position.x + direction.x * this.velocity.x;
    var y = this.position.y + direction.y * this.velocity.y;
    this.position = {x: x, y: y};
  }

  this.age++;
};

Rocket.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.fillStyle = "rgba(0, "+this.color+", 200, 0.5)";
  ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false);
  ctx.fill();
};

// create the target
function Target(settings) {
  settings = settings || {};
  this.position = settings.position || {x: 100, y: 100};
  this.size = 10;
}

Target.prototype = {
  update: function() {
  },

  draw: function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "rgb(200, 0, 0)";
    ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false);
    ctx.fill();
  }
};

function linearTween(delta, current, target, duration, thresh) {
  // idea nabbed from: http://jessefreeman.com/game-dev/intro-to-math-for-game-development/
  var change = target - current;
  thresh = thresh || 0.01;
  if (Math.abs(change) < thresh) return target;
  return change * delta / duration + current;
}

window.onload = function() {
  var canvas = document.getElementById('output');
  var ctx = canvas.getContext('2d');
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;

  var genetic;
  var delta = 0; 
  var lastFrameTime = new Date().getTime();
  var cycles = 50;
  var currentCycle = 0;
  var deltaCount = 0;
  var target = new Target({
    position: {x: Math.random() * canvas.width, y: Math.random() * canvas.height}
  });

  function fitness(rocket, target) {
    // fitness is the distance from the target
    var dist = Math.abs(target.position.x - rocket.position.x) +
               Math.abs(target.position.y - rocket.position.y);
    return Math.sqrt(dist);
  }

  function mutate(dna) {
    // randomly change one of the directions in the dna array
    var dnaToMutate = Math.floor(Math.random() * dna.length);
    dna[dnaToMutate] = {x: Math.random() * 2 - 1,
                        y: Math.random() * 2 - 1};
    return dna;
  }

  function setup() {
    genetic = new Genetic({
      target: target,
      fitnessFn: fitness,
      mutationFn: mutate,
      populationSize: 100,
      mutationChance: 0.2,
      selectionFn: Genetic.prototype.selectionFns.elitist,
      candidate: Rocket
    });

    genetic.seed(function() {
      // initialize dna with random directions
      var dna = [];
      for (var i = 0; i < cycles; i++) {
        var randX = Math.random() * 2 - 1;
        var randY = Math.random() * 2 - 1;
        dna.push({x: randX, y: randY});
      }
      return dna;
    });

  }

  function initRockets() {
    var startPosition = {x: canvas.width / 2, y: canvas.height / 2};
    for (var j = 0; j < genetic.population.length; j++) {
      genetic.population[j].position = startPosition;
    }
  }

  function update(delta) {
    for (var i = 0; i < genetic.population.length; i++) {
      genetic.population[i].update(currentCycle, target, delta);
    }
    target.update();
    if (deltaCount > 100) {
      currentCycle++;
      deltaCount = 0;
    } else {
      deltaCount += delta;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, $('#output').width(), $('#output').height());
    for (var i = 0; i < genetic.population.length; i++) {
      genetic.population[i].draw(ctx);
    }
    target.draw(ctx);
  }

  function main() {
    var currentTime = new Date().getTime();
    delta = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    if(currentCycle < cycles){
      // loop through cycles in current generation
      draw();
      update(delta);
    }else{
      // evaluate and evolve to next generation, then run next set of cycles
      currentCycle = 0;
      genetic.evaluate();
      genetic.evolve();
      initRockets();
    }
    window.requestAnimFrame(main);
  }

  // start the simulation
  setup();
  initRockets();
  main();
};
