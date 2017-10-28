import { tween, easing } from 'popmotion';

const randomInt = (min, max) => {
  return Math.round(Math.random() * (max - min)) + min;
};
const random = (min, max) => {
  return Math.random() * (max - min) + min;
};

class Particle {
  constructor(x, y, dx, dy, duration){
    this._x = x;
    this.initialX = x;
    this.initialY = y;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.duration = duration;
    this.alpha = 1;

    this.rotation = randomInt(4,6);
    this.depth = randomInt(15,25);
    this.color = {
      r: randomInt(30,254),
      g: randomInt(30,230),
      b: randomInt(30,230)
    };
    this.tilt = randomInt(-10, 10);
    this.tiltAngleIncrement = random(0.05, 0.07);
    this.tiltAngle = 0;
    this.render = null;

    let distance = randomInt(Particle.MIN_DISTANCE, Particle.MIN_DISTANCE + 300);
    if(this.dx < 0){
      distance *= -1;
    }
    this.distance = distance;
  }

  get x(){
    return this._x;
  }
  set x(val) {
    if(isNaN(val)){
      throw new Error('here');
    }
    this._x = val;
  }

  static get MIN_DISTANCE() { return 400; }

  getColor(){
    return `rgba(${this.color.r},${this.color.g},${this.color.b},${this.alpha})`;
  }
  tick(v){
    const eased = easing.easeOut(v);
    
    const tiltAngle = 0.0005 * this.depth;
    this.tiltAngle += tiltAngle;
    this.tiltAngle += this.tiltAngleIncrement;
    this.tilt = Math.sin(this.tiltAngle - this.rotation / 2) * this.rotation * 2;
    
    this.alpha = 1 - eased;
    this.x = this.initialX + this.distance * eased;
    this.y -= this.dy;
    this.dy -= 0.1;

    if(this.render){
      this.render(this);
    }
  }
}

class Cannon{
  constructor(canvasId){
    this.canvas = document.getElementById(canvasId);
    const ctx = this.canvas.getContext('2d');
    this.renderer = (particle) => {
      ctx.beginPath();
      ctx.lineWidth = particle.depth / 2;
      ctx.strokeStyle = particle.getColor();
      ctx.moveTo(particle.x + particle.tilt + particle.rotation, particle.y);
      ctx.lineTo(particle.x + particle.tilt, particle.y + particle.tilt + particle.rotation);
      ctx.stroke();
    };
    this.ctx = ctx;
  }
  shoot(config){
    const particles = [];
    config.forEach(cfg => {
      for(let idx = 0; idx < cfg.count; idx++){
        let p = null;
        if(cfg.isLeft){
          p = new Particle(cfg.x, cfg.y, random(-6, -14), random(-1, 6));
        } else {
          p = new Particle(cfg.x, cfg.y, random(6, 14), random(-1, 6));
        }
        p.render = this.renderer;
        particles.push(p);
      }
    });
    return tween({
      from: 0,
      to: 1,
      duration: 3000,
      onUpdate: v => {
        this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
        particles.forEach(p => p.tick(v));
      }
    }).start();
  }
}

export default Cannon;