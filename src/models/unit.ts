export class BallUnit {
  private ball: Phaser.GameObjects.Arc;
  private object: Phaser.GameObjects.GameObject;
  private scene: Phaser.Scene;
  private speed: number;
  
  private static getRandomColor(): number {
    return Phaser.Display.Color.GetColor(
      Math.floor(Math.random() * 256),  // R
      Math.floor(Math.random() * 256),  // G
      Math.floor(Math.random() * 256)   // B
    );
  }
  
  constructor(scene: Phaser.Scene, x: number, y: number, radius: number = 20) {
    this.scene = scene;
    this.speed = 5;
    this.ball = scene.add.circle(x, y, radius, BallUnit.getRandomColor());
    this.object = scene.matter.add.gameObject(this.ball, {
      restitution: 1,
      friction: 0,
      density: 0.001,
      render: {
        sprite: {
          tint: BallUnit.getRandomColor()
        }
      }
    });
  }

  move(direction: { x: number; y: number }) {
    this.scene.matter.body.setVelocity(this.object.body as MatterJS.BodyType, {
        x: direction.x * this.speed * 100,
        y: direction.y * this.speed * 100
    });
  }

  setPosition(x: number, y: number) {
    this.ball.setPosition(x, y);
  }

  getPosition() {
    return {
      x: this.ball.x,
      y: this.ball.y
    };
  }

  getBall() {
    return this.ball;
  }

  getObject() {
    return this.object;
  }

  destroy() {
    this.scene.matter.world.remove(this.object);
    this.ball.destroy();
  }
}