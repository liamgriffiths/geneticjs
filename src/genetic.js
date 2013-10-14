
function Genetics(target, fitnessFn, mutationFn, populationSize, mutationChance, 
                  numParents) {

  this.target = target; // this is what we aim to learn
  this.populationSize = populationSize || 3000; // number of beings in a pop
  this.mutationChance = mutationChance || 0.2;   // percent
  this.generation = 0; // keep track of current generation number
  this.numParents = numParents || 10;
  this.fitnessFn = fitnessFn || function (x, y) { return 1; };
  this.mutationFn = mutationFn || function (dna) { return dna; };
  this.population = [];
  this.avgError = 0.0;
}


// Set up initial population
Genetics.prototype.seed = function (seedFn) {
  for(var i = 0; i < this.populationSize; i++){
    var being = new Being();
    being.dna = seedFn();
    this.population.push(being);
  }
};

// Assign a fitness level to all the beings in the population, also keeps track
// of the running error avg
Genetics.prototype.evaluate = function () {
  var sumErrors = 0;
  for(var i = 0; i < this.population.length; i++){
    this.population[i].evaluate(this.fitnessFn, this.target);
    sumErrors += this.population[i].fitness;
  }
  this.avgError = sumErrors / this.populationSize;
};

// Create a new population based on characteristics of the best in the current
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

// Returns an array of Beings that have the
Genetics.prototype.findParents = function () {
  var sortedByFitness = this.population.sort(Being.prototype.compare);
  // var numParents = Math.round(this.populationSize * this.percentParents);
  return sortedByFitness.slice(0, this.numParents);
};

// Returns the best Being of the current generations population
Genetics.prototype.findBest = function () {
  return this.findParents()[0];
};

// Create a new Population by doing crossover with parents that is the same size
// as the current population
Genetics.prototype.crossoverParents = function (parents) {
  var newPopulation = [];
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

// Mutate beings according to the mutate function and mutation chance
Genetics.prototype.mutateBeings = function (beings) {
  for(var i = 0; i < beings.length; i++){
    if(Math.random() * 100 < this.mutationChance){
      beings[i].mutate(this.mutationFn);
    }
  }
  return beings;
};


// A being is a member of the population
function Being() {
  this.dna = []; // features of the being
  this.fitness = 0;  // this is a measure of how good this being is compared to
                     // the target. the lower it is the more fit it is
};

// Take features from both parents to create a new being
// Returns a new Being
Being.prototype.crossover = function (parentA, parentB) {
  var being = new Being();
  var newLength = Math.round((parentA.dna.length + parentB.dna.length) / 2);

  for(var i = 0; i < newLength; i++){
    if(parentA.dna[i] !== undefined && parentB.dna[i] !== undefined){
      // do a coin flip to decide which parent DNA to use
      if(Math.random() * 1 < 0.5){
        being.dna.push(parentA.dna[i]);
      }else{
        being.dna.push(parentB.dna[i]);
      }
    }else{
      // when the length of the new DNA is less than length of A || B use a
      // random dna item from both A && B
      var combinedDNA = parentA.dna.concat(parentB.dna);
      var randDNA = combinedDNA[Math.round(Math.random() * combinedDNA.length - 1)];
      being.dna.push(randDNA);
    }
  }

  return being;
};

// Function to determine the fitness of this being
Being.prototype.evaluate = function (fitnessFn, target) {
  this.fitness = fitnessFn(this.dna, target);
};

// Function to mutate this being according the provided function
Being.prototype.mutate = function (mutationFn) {
  this.dna = mutationFn(this.dna);
};

// Compare function to sort by fitness level, used with Array.sort()
Being.prototype.compare = function (a, b) {
  if (a.fitness < b.fitness) return -1;
  if (a.fitness > b.fitness) return 1;
  return 0;
};
