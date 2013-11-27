var canvas, context;

function clearCanvas () {
  canvas.width = canvas.width;
}

function Particle(position, size) {
  this.position = position;
  this.size = size || (Math.random() * 10) + 10;
  this.velocity = this.randomVelocity();
  this.timeInDirection = 0;

  var types = [0, 0, 0];
  this.type = Math.floor(Math.random() * 3);
  types[this.type] = 1;

  this.color = [Math.floor(Math.random() * 255) * types[0],
                Math.floor(Math.random() * 255) * types[1],
                Math.floor(Math.random() * 255) * types[2]];

  this.alpha = Math.random();
  this.direction = {x: 0, y: 0};
  this.direction = this.randomDirection();
  this.age = 0;
  this.isDead = false;
}

Particle.prototype = {
  draw: function() {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false);
    var c ='rgba(' + this.color.join(',') + ',' + this.alpha + ')';
    context.fillStyle = c;
    context.fill();
  },

  update: function() {
    this.age++;
    this.timeInDirection++;

    if (Math.random() * 10 < 0.05) {
      this.direction = this.randomDirection();
      this.timeInDirection = 0;
    }
    this.velocity = this.velocity + this.timeInDirection * 0.005;
    // this.alpha = this.alpha - this.age  * 0.00002;

    if (this.position.x + this.size < 0 || this.position.x - this.size > canvas.width) {
      this.isDead = true;

    } else if (this.position.y + this.size < 0 || this.position.y - this.size > canvas.height) {
      this.isDead = true;

    } else if (this.alpha === 0) {
      this.isDead = true;

    } else if (this.size > (canvas.width / 4) || this.size > (canvas.height / 4)) {
      this.isDead = true;

    } else {
      this.position.x += this.direction.x * this.velocity;
      this.position.y += this.direction.y * this.velocity;
    }
  },

  randomDirection: function() {
    return {x: (this.direction.x * 9 + (Math.random() * 2) - 1) / 10,
            y: (this.direction.y * 9 + (Math.random() * 2) - 1) / 10};
  },

  randomVelocity: function() {
    return Math.random() * 5;
  },

  combineWith: function(particle) {
    // for (var c = 0; c < 2; c++) {
    //   var newColor = this.color[c] + particle.color[c];
    //   if (newColor > 255) {
    //     this.color[c] = newColor - 255;
    //   } else {
    //     this.color[c] = newColor;
    //   }
    // }
    this.size += particle.size * 0.25;
    this.alpha += 0.5;
  },

  reactTo: function(particle) {
    switch (this.type) {
      case 0: // red
        break;
      case 1: // green
        console.log('avoid!');
        if (particle.type != 1) {
          this.direction = {x: -this.direction.x, y: -this.direction.y };
          this.timeInDirection = 0;
        }
        break;
      case 2: // blue
        // this.direction = {x: particle.direction.x, y: particle.direction.y };
        break;
      default:
    }
  }
};

function Particles(n) {
  this.particles = [];
  for (var i = 0; i < n; i++) {
    this.add();
  }
}

Particles.prototype = {
  add: function() {
    this.particles.push(new Particle({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    }));
  },

  update: function() {
    for (var i = 0; i < this.particles.length; i++) {
      var particle = this.particles[i];
      particle.update();


      if (particle.isDead) {
        // remove dead
        this.particles.splice(i,1);
        // add new
        this.add();
      }

      var particlesByDistance = [];

      for (var j = 0; j < this.particles.length; j++) {
        if (j != i) {
          var otherParticle = this.particles[j];
          var dist = Math.sqrt(Math.pow((particle.position.x - otherParticle.position.x), 2) +
                               Math.pow((particle.position.y - otherParticle.position.y), 2));
          if (dist < 100) {
            particlesByDistance[Math.floor(dist)] = otherParticle;
          }

          if (dist < (particle.size + otherParticle.size)) {
            // boom
            if (particle.type != otherParticle.type) {
              if (particle.size > otherParticle.size) {
                  particle.combineWith(otherParticle);
                  otherParticle.isDead = true;
              } else {
                otherParticle.combineWith(particle);
                particle.isDead = true;
              }
            }
          }
        }
      }
      var arr = particlesByDistance.filter(function(n){return n;});
      // if (particlesByDistance.length) debugger;
      if(arr.length){
        particle.reactTo(arr[0]);
      }

    }
  },

  draw: function() {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].draw();
    }
  }
};





var particles;

window.onload = function() {
  canvas = document.getElementById('output');
  context = canvas.getContext('2d');
  canvas.height = $(window).height();
  canvas.width = $(window).width();

  function setup() {
    var x = canvas.width / 2;
    var y = canvas.height / 2;
    particles = new Particles(20);
  }

  function draw() {
    clearCanvas();
    particles.draw();
  }

  function update() {
    particles.update();
  }

  function main() {
    draw();
    update();
    window.requestAnimationFrame(main);
  }

  setup();
  main();
};
