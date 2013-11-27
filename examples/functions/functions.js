var Genetic = require('../../lib/genetic').Genetic;
var Being = require('../../lib/genetic').Being;
var util = require('util');


// attempt to find a series of functions that result in the correct answer
// test for how many functions


var target = {input: 1, output: 42};

var functions = [
  function identity(n){ return n; },
  function addone(n){ return n + 1; },
  function minusone(n){ return n - 1; },
  function square(n){ return n * n; },
  function cube(n){ return n * n * n; },
  function multten(n){ return n * 10; },
  function multtwo(n){ return n * 2; }
];

var seedFn = function(){
  var dna = [];
  for(var i = 0; i < 50; i++){
    var randFn = functions[Math.floor(Math.random() * functions.length)];
    dna.push(randFn);
  }
  return dna;
};

var fitnessFn = function (being, target) {
  var result = evaluateFunctions(target.input, being.dna);
  // use the amount of identity functions in the dna as a measure of how fit
  // this being is - in other words, the more identities the less number of
  // steps this being must take to reach the result
  var identityCount = 0;
  for(var i = 0; i < being.dna.length; i++){
    if(being.dna[i].name == 'identity') identityCount++;
  }
  if(target.output !== result){
    return Math.abs(target.output - result) * (being.dna.length - identityCount);
  }else{
    return being.dna.length - identityCount;
  }
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
  if(n < 1000){

    update();
    draw();
    main(n + 1);
  }else{
    var best = genetic.selectionFn()[0];
    console.log("done!");

    var fdna = best.dna.filter(function(fn){ return fn.name !== 'identity'; });
    var actual = evaluateFunctions(target.input, best.dna);
    console.log("fn(",target.input,  ",", target.output, ") =", actual,
                "(in",fdna.length,"steps)");

    // filter out identity functions in output
    console.log(util.inspect(fdna, false, 3));
  }
};

setup();
main(0);

