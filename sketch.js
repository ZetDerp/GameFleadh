// this class describes the properties of a single particle.
class Particle
{
// setting the co-ordinates, radius and the
// speed of a particle in both the co-ordinates axes.
  constructor(){
    this.x = random(0,width);
    this.y = random(0,height);
    this.r = random(1,8);
    this.xSpeed = random(-0.1,0.1);
    this.ySpeed = random(-0.1,0.1);
  }

// creation of a particle.
  createParticle()
  {
    noStroke();
    fill('rgba(200,200,169,0.3)');
    square(this.x,this.y,this.r);
  }

// setting the particle in motion.
  moveParticle() 
  {
    if(this.x < 0 || this.x > width)
      this.xSpeed*=-1;
    if(this.y < 0 || this.y > height)
      this.ySpeed*=-1;
    this.x+=this.xSpeed;
    this.y+=this.ySpeed;
  }

// this function creates the connections(lines)
// between particles which are less than a certain distance apart
  joinParticles(particles) {
    particles.forEach(element =>{
      let dis = dist(this.x,this.y,element.x,element.y);
      if(dis<85) 
      {
      }
    });
  }
}

// an array to add multiple particles
let particles = [];

// Resize function incase page is changed
// Might be needed for when it's a PWA

function windowResized()
 {
  //console.log('resized');
  resizeCanvas(windowWidth, windowHeight);
}

var canvas;
function setup()
{
  //canvas = createCanvas(1600, 900); // Cover only gameCanvas BG
  canvas = createCanvas(windowWidth, windowHeight); // Cover entire page
  canvas.position(0,0);
  canvas.style('z-index', '-1'); // Game's Canvas is at 0 we assume

  //let createCanvas = document.getElementById("gameCanvas");
  for(let i = 0; i<width/4; i++)
  {
    particles.push(new Particle());
  }
}



function draw() 
{
  background('#0f0f0f');
  for(let i = 0; i<particles.length; i++)
  {
    particles[i].createParticle();
    particles[i].moveParticle();
  }
}

  // Canvas Inputs
  window.removeEventListener("keyup", input);
  // canvas.removeEventListener("keydown", input);
  // canvas.removeEventListener("mousedown", input);
  // canvas.removeEventListener("mouseup", input);
  // canvas.removeEventListener("mousemove", input);
  // canvas.removeEventListener("click", input);

