var assert = require("assert");
var Genetic = require('../lib/genetic').Genetic;
var Being = require('../lib/genetic').Being;

describe('Genetic', function(){
  var target = [true, false, true, false];
  var fitnessFn = function (testDNA, targetDNA) { return 2; };
  var mutationFn = function (dna) { return ['mutated']; };
  var seedFn = function () {
    var things = [true, false];
    var seedDNA = [];
    for(var i = 0; i < 4; i++){
      var randDNA = things[Math.floor(Math.random() * things.length)];
      seedDNA.push(randDNA);
    }
    return seedDNA;
  };
  var populationSize = 200;
  var mutationChance = 0.15;
  var numParents = 8;
  var genetic;

  beforeEach(function(){
    // create a instance of the GA before each test
    genetic = new Genetic(target,
                          fitnessFn,
                          mutationFn,
                          populationSize,
                          mutationChance,
                          numParents);
  });

  describe('#seed()', function(){
    it("should build a population the size specified", function(){
      genetic.seed(seedFn);
      assert.equal(genetic.population.length, populationSize);
    });
  });

  describe('#evaluate()', function(){
    it("should assign a fitness value to each member of the population", function(){
      genetic.seed(seedFn);
      genetic.evaluate();
      for(var i = 0; i < genetic.population.length; i++){
        assert.notEqual(genetic.population[i].fitness, 0);
      }
    });
  });

  describe('#findParents()', function(){
    it("should find the parents with the lowest cost", function(){
      genetic.seed(seedFn);
      genetic.evaluate();

      // give some of the population a lower cost than the rest
      var shouldBeParents = [];
      for(var i = 0; i < numParents; i++){
        var p = genetic.population[i];
        p.fitness = 1;
        shouldBeParents.push(p);
      }

      // verify that findParents returns those with the lowest cost
      var parents = genetic.findParents();
      for(var j = 0; i < parents.length; j++){
        assert.equal(shouldBeParents[j].dna.toString(), parents[j].dna.toString());
      }
    });
  });

  describe('#crossoverParents()', function(){
    it("should create a new population with only values from the parents", function(){
      genetic.seed(seedFn);
      genetic.evaluate();
      // set parents
      var shouldBeParents = [];
      for(var i = 0; i < numParents; i++){
        var p = genetic.population[i];
        p.fitness = 1;
        p.dna = [0,1];
        shouldBeParents.push(p);
      }

      var parents = genetic.findParents();
      var newPopulation = genetic.crossoverParents(parents);
      // new population's dna after crossover should only consist of 1's and 0's
      for(var j = 0;  j < newPopulation.length; j++){
        assert.equal('0,1',newPopulation[j].dna.sort().toString());
      }
    });

    it("should should make a new population the same size as the previous one", function(){
      genetic.seed(seedFn);
      genetic.evaluate();
      var parents = genetic.findParents();
      var newPopulation = genetic.crossoverParents(parents);
      assert.equal(populationSize, newPopulation.length);
    });
  });

  describe('#findBest()', function(){ 
    it("should find the best candidate", function(){
      genetic.seed(seedFn);
      genetic.evaluate();
      // set first one to be the best one
      var shouldBeBest = genetic.population[0];
      shouldBeBest.fitness = 1;
      var best = genetic.findBest();
      assert.equal(shouldBeBest.dna.toString(), best.dna.toString());
    });
  });

  describe('#mutateBeings()', function(){
    it("should mutate all if the chance is 100%", function(){
      genetic.seed(seedFn);
      genetic.evaluate();
      genetic.mutationChance = 1.0;
      var mutatedPopulation = genetic.mutateBeings(genetic.population);
      for(var i = 0; i < mutatedPopulation.length; i++){
        assert.equal(['mutated'].toString(), mutatedPopulation[i].dna.toString());
      }
    });
  });

  describe('#evolve()', function(){
    it("should replace the previous populaton with a new one", function(){
      genetic.seed(seedFn);
      genetic.evaluate();
      var currentPopulation = genetic.population;
      genetic.evolve();

      // compare the old DNAs with new ones
      var oldDNA = [];
      for(var i = 0; i < currentPopulation.length; i++){
        oldDNA.push(currentPopulation[i].dna.toString());
      }

      var newDNA = [];
      for(var j = 0; j < genetic.population.length; j++){
        newDNA.push(genetic.population[j].toString());
      }
      assert.notEqual(oldDNA.join(''), newDNA.join(''));
    });

    it("should increment the generation count", function(){
      var oldCount = genetic.generation;
      genetic.seed(seedFn);
      genetic.evaluate();
      var currentPopulation = genetic.population;
      genetic.evolve();
      assert.equal(oldCount + 1, genetic.generation);
    });

    it("should evolve a population that is the same size as the previous one", function(){
      genetic.seed(seedFn);
      genetic.evaluate();
      var currentPopulation = genetic.population;
      genetic.evolve();
      assert.equal(currentPopulation.length, genetic.population.length);
    });
  });
});

describe('Being', function(){
  describe('#crossover()', function(){ });
  describe('#evaluate()', function(){ });
  describe('#mutate()', function(){ });
  describe('#compare()', function(){ });
});
