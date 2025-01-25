export class BallUnit {
  private ball: Phaser.GameObjects.Arc;
  private scene: Phaser.Scene;
  private radius: number;
  private speed: number;
  
  private static getRandomColor(): number {
    return Phaser.Display.Color.GetColor(
      Math.floor(Math.random() * 256),  // R
      Math.floor(Math.random() * 256),  // G
      Math.floor(Math.random() * 256)   // B
    );
  }
  
  constructor(scene: Phaser.Scene, x: number, y: number, radius: number = 20, color?: number) {
    this.scene = scene;
    this.radius = radius;
    this.speed = 5;
    
    // 공 생성 (color가 없으면 랜덤 색상 사용)
    this.ball = scene.add.circle(x, y, radius, color ?? BallUnit.getRandomColor(), 1);
    
    // 물리 속성 추가
    scene.physics.add.existing(this.ball);
    const body = this.ball.body as Phaser.Physics.Arcade.Body;
    body.setCircle(radius);
    body.setBounce(1);           // 완전 탄성 충돌 (1.0)
    body.setCollideWorldBounds(true);
    body.setDrag(10);           // 마찰 감소
    body.setMass(1);            // 질량 설정
    body.setMaxVelocity(300);   // 최대 속도 제한
    body.setGravityY(300);
  }

  move(direction: { x: number; y: number }) {
    const body = this.ball.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(
      direction.x * this.speed * 100,
      direction.y * this.speed * 100
    );
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

  destroy() {
    this.ball.destroy();
  }
}