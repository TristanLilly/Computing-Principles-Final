// This sketch does not work well in JSMode: 3000 vehicles/particles at 12 FPS (on my not very fast laptop)
// Much better in  Java however: 20,000 particles at  35+ FPS
// Tweak of Exercise_6_08_FlowField3DNoise,
// from 'The Nature of Code' by Daniel Shiffman.
// flow field, grayscale, ArrayList, sin(), cos()
// Craig Reynolds, vehicle, noise(), particle system
let flowfield;
let vehicles = []; // or 'particles' if you like

function setup() {
  createCanvas(750, 300);

  flowfield = new FlowField(25);
  for (let i = 0; i < 500; i++) {
    // 20,000 in Java // 3000 in Js /////////////////////
    vehicles.push(
      new Vehicle(createVector(random(width), random(height)),random(2, 5),random(0.1, 0.5)));
  }
  print(vehicles);
}

function draw() {
  frameRate(30);
  //println(frameRate);
  fill(0, 30);
  noStroke();
  rect(0, 0, width, height);
  fill(255);

  flowfield.update();
  // flowfield.lookup();

  for (let v in vehicles) {
    vehicles[v].follow(flowfield);
    vehicles[v].update();
    vehicles[v].display();
    vehicles[v].borders();
  }
}

class FlowField {
  constructor(r) {
    this.resolution = r;
    this.cols = width / this.resolution;
    this.rows = height / this.resolution;
    this.field = new Array(this.cols);
    for (let i=0; i<this.cols; i++){
      this.field[i] = new Array(this.rows);
    }
    this.zoff =0.0;
    this.update();
  }

  update() {
    let xoff = 0;
    for (let i = 0; i < this.cols; i++) {
      let yoff = 0;
      for (let j = 0; j < this.rows; j++) {
        let theta = map(noise(xoff, yoff, this.zoff), 0, 1, 0, TWO_PI);
        // Make a vector from an angle
        this.field[i][j] = createVector(cos(theta), sin(theta));
        yoff += 0.1;
      }
      xoff += 0.1;
    }
    this.zoff += 0.01;
  }

  lookup(lookup) {
    let column = int(constrain(lookup.x / this.resolution, 0, this.cols - 1));
    let row = int(constrain(lookup.y / this.resolution, 0, this.rows - 1));
    return this.field[column][row];
  }
}

class Vehicle {
  constructor(l, ms, mf) {
    this.location = l;
    this.r = 3.0;
    this.maxspeed = ms;
    this.maxforce = mf;
    //acceleration = new PVector(0, 0);
    this.velocity = createVector(0, 0);
  }

  // Implementing Reynolds' flow field following algorithm
  // http://www.red3d.com/cwr/steer/FlowFollow.html
  follow(flow) {
    let desired = flow.lookup(this.location);
    desired.mult(this.maxspeed);
    //PVector steer = PVector.sub(desired, velocity);
    desired.sub(this.velocity); // desired is now 'steer'
    desired.limit(this.maxforce);
    //acceleration.add(desired);
    this.velocity.add(desired);
    //applyForce(desired);
    //steer.limit(maxforce);
    //applyForce(steer);
  }

  //void applyForce(PVector force) {
  //acceleration.add(force);
  // }

  update() {
    //velocity.add(acceleration);
    this.velocity.limit(this.maxspeed);
    this.location.add(this.velocity);
    //acceleration.mult(0);
  }

  display() {
    // rect seems to be (a lot) more efficient than point or ellipse....
    fill(5, 232, 232);
    rect(this.location.x, this.location.y, 2, 2);
  }

  borders() {
    if (this.location.x < -this.r) this.location.x = width + this.r;
    if (this.location.y < -this.r) this.location.y = height + this.r;
    if (this.location.x > width + this.r) this.location.x = -this.r;
    if (this.location.y > height + this.r) this.location.y = -this.r;
  }
}
