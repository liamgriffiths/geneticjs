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
  }
  return randomDNA;
};

var fitnessFn = function (being, target) {
  return Math.abs(target.x - being.position.x) + Math.abs(target.y - being.position.y);
};

var mutationFn = function (dna) {
  var dnaToMutate = Math.floor(Math.random() * dna.length);
  dna[dnaToMutate] = Math.floor(Math.random() * 10);
  return dna;
};

var clearCanvas = function () {
  canvas.width = canvas.width;
};

$(function() {
  canvas = document.getElementById('output');
  context = canvas.getContext('2d');
  target = {x: Math.floor(Math.random() * canvas.width),
            y: Math.floor(Math.random() * canvas.height)};
  context.fillStyle = "red";
  context.fillRect(target.x, target.y, 10, 10);

  function setup() {
    geneticDemo.seed(seedFn);
  }

  function draw() {
    clearCanvas();
    for(var i = 0; i < populationSize; i++){
      var rocket = geneticDemo.population[i];
      if(rocket.live) drawRocket(rocket);
    }
    drawTarget();


    $('#progress').text("Generation:    " + geneticDemo.generation + "\n" +
                        "Error rate:    " + geneticDemo.avgError + "\n" +
                        "Running time:  " + (((new Date()).getTime() - timeStart) / 1000) + "\n" +
                        "Current cycle: " + currentCycle);
  }

  function update() {
    for(var i = 0; i < populationSize; i++){
      var rocket = geneticDemo.population[i];
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
    }
    currentCycle++;
  }

  function main() {
    if(RUNNING){
      if(currentCycle < cycles){
        draw();
        update();
        window.requestAnimationFrame(main);
      }else{
        currentCycle = 0;
        geneticDemo.evaluate();
        geneticDemo.evolve();
        window.requestAnimationFrame(main);
      }
    }
  }

  function drawTarget() {
    context.fillStyle = "red";
    context.fillRect(target.x, target.y, 10, 10);
  }

  function drawRocket(rocket) {
    context.fillStyle = "blue";
    context.fillRect(rocket.position.x, rocket.position.y, 5, 5);
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

  $('#output').on('click', function (e) {
    // var x = (e.clientX - $('#output').offset().left);
    // var y = e.clientY - $('#output').offset().top;
    // target = {x: x, y: y};
    // console.log(target);
    // // clearCanvas();
    // drawTarget();
  });
});
