var RUNNING = false;
var target = "hello world my name is liam!";
var fitnessFn = function (beingDNA, targetDNA) {
  // convert beingDNA to a string to compare with the target which is a string
  // in this example
  var beingDNAString = beingDNA.join('');
  return levDist(beingDNAString, targetDNA);
};
var mutationFn = function (dna) {
  // randomly mutate different letters in the DNA array to a random char a
  // random number of times between 1 and 4
  var possible ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 !.?,";
  // var timesToMutate = Math.round(Math.random() * 3) + 1;
  // for(var times = 0; times < timesToMutate; times++){ }
  var dnaToMutate = Math.floor(Math.random() * dna.length);
  dna[dnaToMutate] = possible.charAt(Math.floor(Math.random() * possible.length));
  return dna;
};

var geneticDemo = new Genetics(target, fitnessFn, mutationFn);

$(function() {
  var setup = function () {
    // Create a population where each being in the population's DNA is produced
    // initially by this function
    geneticDemo.seed(function(){
      // var randomDNAsize = Math.floor(Math.random() * target.length);
      var dnaSize = target.length;
      var randomDNA = [];
      for(var i = 0; i < dnaSize; i++){
        var possible ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 !.?,";
        randomDNA.push(possible.charAt(Math.floor(Math.random() * possible.length)));
      }
      return randomDNA;
    });
    geneticDemo.evaluate();
  };

  var draw = function () {
    $('#chart').html("<p>Avg. Error: " + geneticDemo.avgError + "</p>" +
                     "<p>Generation: " + geneticDemo.generation + "</p>");
    $('#output').prepend(geneticDemo.findBest().dna.join('') + "\n");
  };

  var update = function () {
    geneticDemo.evolve();
    geneticDemo.evaluate();
  };

  var main = function () {
    if(RUNNING){
      draw();
      update();
    }
    window.requestAnimationFrame(main);
  };

  window.addEventListener('keydown', function (event) {
    if(event.keyCode == 32) RUNNING = !RUNNING; // spacebar to pause
    event.preventDefault();
  });

  setup();
  main();
});
