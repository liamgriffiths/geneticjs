var Genetic = require('../../lib/genetic').Genetic;
var Being = require('../../lib/genetic').Being;
var util = require('util');


// attempt to find a series of functions that result in the correct answer
// test for how many functions


var target = {input: 1, output: 10};

var functions = [
  function addone(n){ return n + 1; },
  function minusone(n){ return n - 1; },
  function square(n){ return n * n; },
  function multten(n){ return n * 10; },
  function double(n){ return n * 2; }
];

var seedFn = function(){
  var dna = [];
  for(var i = 0; i < 21; i++){
    var randFn = functions[Math.floor(Math.random() * functions.length)];
    dna.push(randFn);
  }
  return dna;
};

var fitnessFn = function (being, target) {
  var result = evaluateFunctions(target.input, being.dna);
  return Math.abs(target.output - result);
};

var evaluateFunctions = function (input, fns) {
  var result = fns[0](input);
  for(var i = 1; i < fns.length; i++){
    result = fns[i](result);
  }
  return result;
};

var mutationFn = function (dna) {
  var dnaToMutate = Math.floor(Math.random() * dna.length);
  var randFn = functions[Math.floor(Math.random() * functions.length)];
  dna[dnaToMutate] = randFn;
  return dna;
};

var genetic = new Genetic({
  target: target,
  fitnessFn: fitnessFn,
  mutationFn: mutationFn,
  populationSize: 100,
  mutationChance: 0.25,
  selectionFn: Genetic.prototype.selectionFns.elitist
});

var setup = function () {
  genetic.seed(seedFn);
  genetic.evaluate();
};

var update = function () {
  genetic.evolve();
  genetic.evaluate();
};

var draw = function () {
  var best = genetic.selectionFn()[0];
  // console.log(best.fitness);
};

var main = function (n) {
  if(n < 200){
    update();
    draw();
    main(n + 1);
  }else{
    var best = genetic.selectionFn()[0];
    console.log("done");
    console.log(evaluateFunctions(target.input, best.dna));
    console.log(util.inspect(best.dna, false, 3));
  }
};

setup();
main(0);

