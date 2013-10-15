var RUNNING = false;
var geneticDemo, target, populationSize, mutationChance, numParents, timeStart;

var seedFn = function () {
  var dnaSize = target.length;
  var randomDNA = [];
  for(var i = 0; i < dnaSize; i++){
    var possible ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 !.?,";
    randomDNA.push(possible.charAt(Math.floor(Math.random() * possible.length)));
  }
  return randomDNA;
};

var fitnessFn = function (beingDNA, targetDNA) {
  // convert beingDNA to a string to compare with the target which is a string
  // in this example
  var beingDNAString = beingDNA.join('');
  return levDist(beingDNAString, targetDNA);
};

var mutationFn = function (dna) {
  var possible ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 !.?,";
  var dnaToMutate = Math.floor(Math.random() * dna.length);
  dna[dnaToMutate] = possible.charAt(Math.floor(Math.random() * possible.length));
  return dna;
};

var geneticDemo;

$(function() {
  function setup() {
    // Create a population where each being in the population's DNA is produced
    // initially by this function
    geneticDemo.seed(function(){
      var dnaSize = target.length;
      var randomDNA = [];
      for(var i = 0; i < dnaSize; i++){
        var possible ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 !.?,";
        randomDNA.push(possible.charAt(Math.floor(Math.random() * possible.length)));
      }
      return randomDNA;
    });
    geneticDemo.evaluate();
  }

  function draw() {
    var parent = geneticDemo.selectionFn()[0];
    $('#output').prepend(parent.dna.join('') + "\n");
  }

  function update() {
    geneticDemo.evolve();
    geneticDemo.evaluate();
  }

  function main() {
    if(RUNNING){
      draw();
      update();
      window.requestAnimationFrame(main);
    }
  }

  $('#startButton').on('click', function (e) {
    var form = $('#controls').serializeArray();
    for(var i = 0; i < form.length; i++){
      if(form[i].name == 'target') target = form[i].value;
      if(form[i].name == 'populationSize') populationSize = form[i].value;
      if(form[i].name == 'mutationChance') mutationChance = form[i].value;
      if(form[i].name == 'numParents') numParents = form[i].value;
    }
    RUNNING = true;
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

  $('#stopButton').on('click', function (e) {
    RUNNING = false;
  });


});
