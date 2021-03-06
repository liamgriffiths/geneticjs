/**
 *
 *
 * References:
 * https://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)
 *
 */


/**
 * @class Genetic
 * @constructor
 * @param {Array} opts.target - is an array of values that represent what to learn
 * @param {Function} opts.fitnessFn - how a candidate is evaluated
 * @param {Function} opts.mutationFn - how we will modify dna during mutation
 * @param {Function} opts.selectionFn - how we will select parents
 * @param {Integer} opts.populationSize - how large the population will be
 * @param {Float} opts.mutationChance - how often to do mutation
 */
function Genetic(opts) {
  this.target = opts.target;
  this.fitnessFn = opts.fitnessFn || function (x, y) { return 1; };
  this.mutationFn = opts.mutationFn || function (dna) { return dna; };
  this.selectionFn = opts.selectionFn || Genetic.prototype.selectionFns.elitist;
  this.crossoverFn = opts.crossoverFn || Genetic.prototype.crossoverFns.uniform;
  // this.crossoverFn = opts.crossoverFn || Genetic.prototype.crossoverFns.npoint(3);

  this.populationSize = opts.populationSize || 3000;
  this.mutationChance = opts.mutationChance || 0.2;

  this.generation = 0; // keep track of current generation number
  this.population = []; // array contains all Beings of current generation
  this.avgError = 0.0; // keeps track of error-rate

  // use your own candidate constructor or use the Being object type
  this.candidateConstructor = opts.candidate || Being;
}

/**
 * Create a new population of Beings using the seeding function (seedFn)
 * @method seed
 * @param {Function} seedFn - how we will create the initial population
 */
Genetic.prototype.seed = function (seedFn) {
  this.population = [];
  for(var i = 0; i < this.populationSize; i++){
    var candidate = new this.candidateConstructor();
    candidate.dna = seedFn();
    this.population.push(candidate);
  }
};

/**
 * Applys the fitness function to all candidates in the generation
 * @method evaluate
 */
Genetic.prototype.evaluate = function () {
  var sumErrors = 0;
  for(var i = 0; i < this.population.length; i++){
    this.population[i].evaluate(this.fitnessFn, this.target);
    sumErrors += this.population[i].fitness;
  }
  this.avgError = sumErrors / this.populationSize;
};

/**
 * Create a new population using characteristics from parents
 * @method evolve
 */
Genetic.prototype.evolve = function () {
  // select parents (select the "most fit" of the population)
  var parents = this.selectionFn();

  // do crossover (create children using parents' features, heredity)
  this.population = this.crossoverParents(parents);

  // do mutation (randomly change children's features to introduce variation)
  this.population = this.mutateBeings(this.population);

  // we are now the next generation
  this.generation++;
};

/**
 * Creates a new population using dna from parents
 * @method crossoverParents
 * @param {Array} parents - array of Beings selected as parents
 * @returns {Array} - an array of Beings to replace the current population
 */
Genetic.prototype.crossoverParents = function (parents) {
  // recursively grow new population until it reaches our target population size
  var growPopulation = function (population) {
    for (var j = 0; j < parents.length; j++) {
      for (var k = 0; k < parents.length; k++) {

        var children = this.crossoverFn([parents[j], parents[k]]);
        for (var i = 0; i < children.length; i++) {
          var newBeing = new this.candidateConstructor();
          newBeing.dna = children[i];
          population.push(newBeing);
          if (population.length == this.populationSize) return population;
        }
      }
    }

    return growPopulation(population);
  }.bind(this);

  return growPopulation([]);
};

/**
 * Mutate candidates according to the mutate function and mutation chance
 * @method mutateBeings
 * @param {Array} candidates - an array of Beings to mutate
 * @returns {Array} - returns array of mutated Beings
 */
Genetic.prototype.mutateBeings = function (beings) {
  for(var i = 0; i < beings.length; i++){
    if(Math.random() < this.mutationChance){
      beings[i].mutate(this.mutationFn);
    }
  }
  return beings;
};

Genetic.prototype.crossoverFns = {
  uniform: function(parents) {
    // dna length of new being will have the avg length of all the parents's dna
    var sumParentsDNALength = 0;
    for(var i = 0; i < parents.length; i++){
      sumParentsDNALength += parents[i].dna.length;
    }
    var newLength = Math.round(sumParentsDNALength / parents.length);
    var children = [];

    for(var j = 0; j < newLength; j++){
      var parent = parents[Math.floor(Math.random() * parents.length)];
      if(parent.dna[j] !== undefined){
        children.push(parent.dna[j]);
      }else{
        // if the parent doesn't have a DNA value for this index, then pull one from
        // a random index
        var randDNA = parent.dna[Math.floor(Math.random() * parent.dna.length)];
        children.push(randDNA);
      }
    }
    return [children];
  },

  npoint: function(n) {
    n = n || 2;
    return function(parents) {
      var children = Array(parents.length);
      var points = [];
      while (n) {
        var rand = Math.floor(Math.random() * parents[0].length);
        if (! points[rand]) {
          points[rand] = true;
          n--;
        }
      }

      for (var i = 0; i < points.length; i++) {
        var start = 0;
        if (points[i]) {
          children[0].push(parent[0].slice(start, i));
          children[1].push(parent[1].slice(start, i));
          start = i;
        }
      }

      return children;
    };
  }
};



/**
 * Example parent selection functions to use
*/
Genetic.prototype.selectionFns = {
  // Use the top 1% as parents
  elitist: function () {
    var onePercent = Math.floor(this.population.length * 0.1);
    var sortedByFitness = this.population.sort(Being.prototype.compare);
    return sortedByFitness.slice(0, onePercent);
  },

  // Use top fifty percent of populatioon as mating pool and shuffle the results
  topFiftyPercent: function() {
    var sortedByFitness = this.population.sort(Being.prototype.compare);
    var topHalf = sortedByFitness.slice(0, Math.floor(this.population.length / 2));
    return topHalf.sort(function() { return Math.round(Math.random()) - 0.5; });
  },

  // weigh the selection by the fitness and choose n for the mating pool
  wheelOfFortune: function(n) {
    n = n || Math.floor(this.population.length * 0.25);
    var probPool = [];
    for (var i = 0 ; i < this.population.length; i++) {
      for (var j = 0; j < this.population[i].fitness; j++) {
        probPool.push(this.population[i]);
      }
    }

    var matingPool = [];
    while (n--) {
      matingPool.push(probPool[Math.floor(Math.random() * probPool.length)]);
    }
    return matingPool;
  }
};


/**
 * A being is a member of the population
 * @class Being
 * @constructor
 */
function Being() {
  this.dna = []; // features of the being
  this.fitness = 0;  // this is a measure of how good this being is compared to
                     // the target. the lower it is the more fit it is
}

/**
 * Updates this being's fitness using the provided fitnessFn in relation to the
 * target and returns the result
 * @method evaluate
 * @param {Funciton} fitnessFn - provided function to evaluate the Being
 * @param {Array} - is the target DNA to compare the Being' DNA to
 * @returns {Number} - returns the result of the fitness function
 */
Being.prototype.evaluate = function (fitnessFn, target) {
  this.fitness = fitnessFn(this, target);
  return this.fitness;
};

/**
 * Updates this being's DNA according to provided mutation function and returns
 * the result
 * @method mutate
 * @param {Function} mutationFn - function to mutate the this beings DNA
 * @returns {Array} - resulting DNA of the mutation function
 */
Being.prototype.mutate = function (mutationFn) {
  this.dna = mutationFn(this.dna);
  return this.dna;
};

/**
 * Compare function to sort by fitness level, used with Array.prototype.sort()
 * @method compare
 * @param {Being} a, b - two beings to compare
 * @returns {Number} - number used to sort
 */
Being.prototype.compare = function (a, b) {
  if (a.fitness < b.fitness) return -1;
  if (a.fitness > b.fitness) return 1;
  return 0;
};


if(typeof module !== 'undefined'){
  module.exports.Genetic = Genetic;
  module.exports.Being = Being;
}
