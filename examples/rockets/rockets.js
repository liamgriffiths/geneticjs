var RUNNING = false;
var canvas, context;
var geneticDemo, target, populationSize, mutationChance, numParents, timeStart;
var cycles;
var currentCycle = 0;
var startPosition = {x: 0, y: 0};
var frames = {
  0: function(pos, amount){ pos.x += amount; return pos; },
  1: function(pos, amount){ pos.x -= amount; return pos; },
  2: function(pos, amount){ pos.y += amount; return pos; },
  3: function(pos, amount){ pos.y -= amount; return pos; }
};


// modify 'Being' object to add some Rocket specific properties
Being.prototype.position = startPosition;
Being.prototype.velocity = 0.2;
Being.prototype.live = true;

// dna is comprised on random floats to represent power of each frame of propulsion
var seedFn = function () {
  var randomDNA = [];
  for(var i = 0; i < cycles; i++){
    randomDNA.push(Math.floor(Math.random() * 10));

// modify 'Being' object to add some Rocket specific properties
Being.prototype.position = {x: 0, y: 0}; // set starting position
Being.prototype.velocity = 0.5; // set velocity
Being.prototype.color = Math.floor(Math.random() * 155) + 100;
Being.prototype.live = true;
Being.prototype.finished = false;
Being.prototype.age = 0;
Being.prototype.size = 5;
Being.prototype.update = function () {
  if(this.live && this.finished === false){
    var direction = this.dna[currentCycle];
    // apply direction vector
    this.position = {x: this.position.x + direction.x * this.velocity,
                     y: this.position.y + direction.y * this.velocity};
    // apply velocity vector
    // this.position = {x: this.position.x * this.velocity,
    //                  y: this.position.y * this.velocity};


    if(checkCollision(this, target)) this.finished = true;
  }
  this.age++;
};
Being.prototype.draw = function () {
  context.fillStyle = "rgba(0, "+this.color+", 200, 0.5)";
  context.fillRect(this.position.x, this.position.y, this.size, this.size);
};

// dna is comprised on random {x, y} vectors to represent the direction
var seedFn = function () {
  var randomDNA = [];
  for(var i = 0; i < cycles; i++){
    var randX = Math.floor((Math.random() * 2) - 1);
    var randY = Math.round((Math.random() * 2) - 1);
    randomDNA.push({x: randX, y: randY});
>>>>>>> master
  }
  return randomDNA;
};

<<<<<<< HEAD
var fitnessFn = function (being, target) {
  return Math.abs(target.x - being.position.x) + Math.abs(target.y - being.position.y);
=======
var fitnessFn = function (rocket, target) {
  var dist = Math.abs(target.x - rocket.position.x) + Math.abs(target.y - rocket.position.y);
  return Math.sqrt(dist);
>>>>>>> master
};

var mutationFn = function (dna) {
  var dnaToMutate = Math.floor(Math.random() * dna.length);
<<<<<<< HEAD
  dna[dnaToMutate] = Math.floor(Math.random() * 10);
  return dna;
};

var clearCanvas = function () {
  canvas.width = canvas.width;
};
=======
  dna[dnaToMutate] = {x: Math.round((Math.random() * 2) - 1),
                      y: Math.round((Math.random() * 2) - 1)};
  return dna;
};

function clearCanvas () {
  canvas.width = canvas.width;
}

function checkCollision (a, b) {
  // needs some work
  var x = a.position.x;
  var y = a.position.y;

  if(x > b.x && x < b.x + b.size &&
     y > b.y && y < b.y + b.size){
       return true;
  }
  return false;
}
>>>>>>> master

$(function() {
  canvas = document.getElementById('output');
  context = canvas.getContext('2d');
<<<<<<< HEAD
  target = {x: Math.floor(Math.random() * canvas.width),
            y: Math.floor(Math.random() * canvas.height)};
  context.fillStyle = "red";
  context.fillRect(target.x, target.y, 10, 10);
=======
  // set target and origin to random spots on map
  target = {x: Math.floor(Math.random() * canvas.width),
            y: Math.floor(Math.random() * canvas.height),
            size: 10};
  Being.prototype.position = {x: Math.floor(Math.random() * canvas.width),
                              y: Math.floor(Math.random() * canvas.height)};
  drawTarget();
>>>>>>> master

  function setup() {
    geneticDemo.seed(seedFn);
  }

  function draw() {
    clearCanvas();
    for(var i = 0; i < populationSize; i++){
      var rocket = geneticDemo.population[i];
<<<<<<< HEAD
      if(rocket.live) drawRocket(rocket);
    }
    drawTarget();


    $('#progress').text("Generation:    " + geneticDemo.generation + "\n" +
                        "Error rate:    " + geneticDemo.avgError + "\n" +
=======
      if(rocket.live) rocket.draw();
    }
    drawTarget();

    $('#progress').text("Generation:    " + geneticDemo.generation + "\n" +
                        "Error rate:    " + (geneticDemo.avgError/100) + "\n" +
>>>>>>> master
                        "Running time:  " + (((new Date()).getTime() - timeStart) / 1000) + "\n" +
                        "Current cycle: " + currentCycle);
  }

  function update() {
    for(var i = 0; i < populationSize; i++){
      var rocket = geneticDemo.population[i];
<<<<<<< HEAD
      var x = rocket.position.x;
      var y = rocket.position.y;
      if(rocket.live){
        if(x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height){
          var power = rocket.dna[currentCycle];
          var velocity = rocket.velocity;
          var newPostion = frames[(currentCycle) % 4]({x: x, y: y}, power * velocity);
          rocket.position = newPostion;
        }else{
          rocket.live = false;
        }
      }
=======
      rocket.update();
>>>>>>> master
    }
    currentCycle++;
  }

  function main() {
    if(RUNNING){
      if(currentCycle < cycles){
<<<<<<< HEAD
=======
        // loop through cycles in current generation
>>>>>>> master
        draw();
        update();
        window.requestAnimationFrame(main);
      }else{
<<<<<<< HEAD
=======
        // evaluate and evolve to next generation, then run next set of cycles
>>>>>>> master
        currentCycle = 0;
        geneticDemo.evaluate();
        geneticDemo.evolve();
        window.requestAnimationFrame(main);
      }
    }
  }

  function drawTarget() {
<<<<<<< HEAD
    context.fillStyle = "red";
    context.fillRect(target.x, target.y, 10, 10);
  }

  function drawRocket(rocket) {
    context.fillStyle = "blue";
    context.fillRect(rocket.position.x, rocket.position.y, 5, 5);
=======
    context.fillStyle = "rgba(255, 0, 0, 0.8)";
    context.fillRect(target.x, target.y, target.size, target.size);
>>>>>>> master
  }

  // User interface
  $('#startButton').on('click', function (e) {
    var form = $('#controls').serializeArray();
    for(var i = 0; i < form.length; i++){
      if(form[i].name == 'target') target = form[i].value;
      if(form[i].name == 'populationSize') populationSize = form[i].value;
      if(form[i].name == 'mutationChance') mutationChance = form[i].value;
      if(form[i].name == 'cycles') cycles = form[i].value;
    }

    RUNNING = true;
    timeStart = (new Date().getTime());
    cycles = cycles || 300;

    geneticDemo = new Genetic({
      target: target,
      fitnessFn: fitnessFn,
      mutationFn: mutationFn,
      populationSize: populationSize,
      mutationChance: mutationChance,
      selectionFn: Genetic.prototype.selectionFns.elitist
    });

    setup();
    main();
  });

  $('#stopButton').on('click', function (e) { RUNNING = false; });
<<<<<<< HEAD

  $('#output').on('click', function (e) {
    // var x = (e.clientX - $('#output').offset().left);
    // var y = e.clientY - $('#output').offset().top;
    // target = {x: x, y: y};
    // console.log(target);
    // // clearCanvas();
    // drawTarget();
  });
=======
  $('#output').on('click', function (e) { });
>>>>>>> master
});
