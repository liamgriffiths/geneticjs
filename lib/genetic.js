/**
 * @class Genetics
 * @constructor
 * @param {Array} target - is an array of values that represent what we want to learn
 * @param {Function} fitnessFn - how a candidate is evaluated should return  number
 * @param {Function} mutationFn - how we will modfy dna during mutation
 * @param {Integer} populationSize - how large the population will be
 * @param {Float} mutationChance - how often to do mutation
 * @param {Integer} numParents - how many parents to use to make next generation
 */
function Genetics(target, fitnessFn, mutationFn, populationSize, mutationChance, numParents) {
  this.target = target; // this is what we aim to learn
  this.fitnessFn = fitnessFn || function (x, y) { return 1; };
  this.mutationFn = mutationFn || function (dna) { return dna; };
  this.populationSize = populationSize || 3000; // number of beings in a pop
  this.mutationChance = mutationChance || 0.2;   // percent
  this.numParents = numParents || 10;
  this.generation = 0; // keep track of current generation number
  this.population = []; // array contains all Beings of current generation
  this.avgError = 0.0; // keeps track of error-rate
}


/**
 * Create a new population of Beings using the seeding function (seedFn)
 * @method seed
 * @param {Function} seedFn - how we will create the initial population
 */
Genetics.prototype.seed = function (seedFn) {
  this.population = [];
  for(var i = 0; i < this.populationSize; i++){
    var being = new Being();
    being.dna = seedFn();
    this.population.push(being);
  }
};

/**
 * Applys the fitness function to all beings in the generation
 * @method evaluate
 */
Genetics.prototype.evaluate = function () {
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
Genetics.prototype.evolve = function () {
  // find parents population
  var parents = this.findParents();

  // do crossover (create children using parents' features)
  this.population = this.crossoverParents(parents);

  // do mutation (randomly change some children's features)
  this.population = this.mutateBeings(this.population);

  // we are now the next generation
  this.generation++;
};

/**
 * Returns array of "most fit" beings in the population
 * @method findParents
 * @returns {Array}
 */
Genetics.prototype.findParents = function () {
  var sortedByFitness = this.population.sort(Being.prototype.compare);
  return sortedByFitness.slice(0, this.numParents);
};

/**
 * Returns the best Being of the current generations population
 * @method findBest
 * @returns {Being}
 */
Genetics.prototype.findBest = function () {
  return this.findParents()[0];
};

/**
 * Creates a new population using dna from parents
 * @method crossoverParents
 * @param {Array} parents - array of Beings selected as parents
 * @returns {Array} - an array of Beings to replace the current population
 */
Genetics.prototype.crossoverParents = function (parents) {
  var newPopulation = [];

  // recursively grow new population until it reaches our target population size
  // TODO: this might not work
  var growPopulation = function (population) {
    for(var j = 0; j < parents.length; j++){
      for(var k = 0; k < parents.length; k++){
        population.push(Being.prototype.crossover(parents[j], parents[k]));
        if(population.length == this.populationSize) return population;
      }
    }
    return population;
  };
  if(newPopulation.length == this.populationSize){
    return newPopulation;
  }else{
    return growPopulation(newPopulation);
  }
};

/** 
 * Mutate beings according to the mutate function and mutation chance
 * @method mutateBeings
 * @param {Array} beings - an array of Beings to mutate
 * @returns {Array} - returns array of mutated Beings
 */
Genetics.prototype.mutateBeings = function (beings) {
  for(var i = 0; i < beings.length; i++){
    if(Math.random() < this.mutationChance){
      beings[i].mutate(this.mutationFn);
    }
  }
  return beings;
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
 * Creates a new being using DNA from provided parents
 * @method crossover
 * @param {Being...} - accepts any number of beings to utilize their DNA
 * @returns {Being} - new being that is created
 */
Being.prototype.crossover = function () {
  var parents = Array.prototype.slice.call(arguments);
  var being = new Being();

  // dna length of new being will have the avg length of all the parents's dna
  var sumParentsDNALength = 0;
  for(var i = 0; i < parents.length; i++){
    sumParentsDNALength += parents[i].dna.length;
  }
  var newLength = Math.round(sumParentsDNALength / parents.length);

  for(var j = 0; j < newLength; j++){
    var parent = parents[Math.floor(Math.random() * parents.length)];
    if(parent.dna[j] !== undefined){
      being.dna.push(parent.dna[j]);
    }else{
      // if the parent doesn't have a DNA value for this index, then pull one from
      // a random index
      var randDNA = parent.dna[Math.floor(Math.random() * parent.dna.length)];
      being.dna.push(randDNA);
    }
  }

  return being;
};

/**
 * Updates this being's fitness using the provided fitnessFn in relation to the
 * target and returns the result
 * @method evaluate
 * @param {Funciton} fitnessFn - provided function to evaluate the Being
 * @param {Array} - is the target DNA to compare the Being' DNA to
 * @returns {Number} - returns the result of the fitness function
 */
Being.prototype.evaluate = function (fitnessFn, target) {
  this.fitness = fitnessFn(this.dna, target);
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