var RUNNING = null;

var run = function () {
  var goal = "hello world!";

  var gen = new Generation(goal, 1000, levDist);
  gen.randomize();

  var gloop = function () {
    if(RUNNING){
      gen.evaluate();
      gen.drawBest();
      gen.evolve();
    }

    window.requestAnimationFrame(gloop);
  };

  gloop();
};



var Generation = function (goal, popSize, costFn) {
  this.goal = goal;
  this.costFn = costFn;
  this.beings = [];
  for(var i = 0; i < popSize; i++){
    this.beings.push(new Being(Math.floor(Math.random() * goal.length) + 5));
  }
};

Generation.prototype.randomize = function () {
  // randomize all the dna of all the beings in this generation
  for(var i = 0; i < this.beings.length; i++){
    this.beings[i].randomize();
  }
};

Generation.prototype.evaluate = function () {
  for(var i = 0; i < this.beings.length; i++){
    this.beings[i].cost = this.costFn(this.beings[i].dna.join(''), this.goal);
  }
};

Generation.prototype.evolve = function () {
  // use best current beings to generate new beings array
  // var currentBeings = this.beings;
  var parents = this.findParents(Math.floor(this.beings.length / 20));

  var goodDNA = [];
  for(var i = 0; i < parents.length; i++){
    goodDNA = goodDNA.concat(parents[i].dna);
  }
  goodDNA = goodDNA.unique();

  // replace beings with beings made from set of parents dna
  for(var j = 0; j < this.beings.length; j++){
    this.beings[j].randomize(goodDNA.join(''));
  }

  // randomly mutate some of the beings
  for(var k = 0; k < this.beings.length; k++){
    // 2% chance of mutation
    if(Math.floor(Math.random() * 100) < 20){
      // randomly change a dna value
      var dnaIndex = Math.floor(Math.random() * this.beings[k].dna.length);
      this.beings[k].dna[dnaIndex] = this.beings[k].randomChar();
    }
  }

};

Generation.prototype.findParents = function (n) {
  this.beings.sort(Being.prototype.compareByCost);
  var parents = [];
  for(var i = 0; i < n; i++){
    parents[i] = this.beings[i];
  }
  return parents;
};

Generation.prototype.drawBest = function () {
  var output = document.getElementById('output');

  this.beings.sort(Being.prototype.compareByCost);
  var text = document.createTextNode(this.beings[0].dna.join('') + "\n");
  if(output.firstChild !== null){
    output.insertBefore(text,output.firstChild);
  }else{
    output.appendChild(text);
  }
  console.log(this.beings[0].cost);
};

var Being = function (size) {
  this.dna = new Array(size);
  this.cost = 0;
};

Being.prototype.randomize = function (set) {
  // randomize the dna of this being
  for(var i = 0; i < this.dna.length; i++){
    this.dna[i] = this.randomChar(set);
  }
};

Being.prototype.randomChar = function (set) {
  var possible = set || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 !.?,";
  return possible.charAt(Math.floor(Math.random() * possible.length));
};

Being.prototype.compareByCost = function (a, b) {
  if (a.cost < b.cost) return -1;
  if (a.cost > b.cost) return 1;
  return 0;
};



// window.onload = run();

window.addEventListener('keydown', function (event) {
  switch (event.keyCode) {
    case 32: //spacebar
      if(RUNNING === null){
        RUNNING = true;
        run();
      }else{
        RUNNING = !RUNNING;
      }
      break;
  }
  event.preventDefault();
});

Array.prototype.unique= function() {
  var unique= [];
  for (var i = 0; i < this.length; i += 1) {
    if (unique.indexOf(this[i]) == -1) {
      unique.push(this[i]);
    }
  }
  return unique;
};
