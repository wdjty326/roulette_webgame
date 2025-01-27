class Obstacle {
    private obstacles: { visual: Phaser.GameObjects.Rectangle, body: MatterJS.BodyType }[] = [];
    private rotationSpeed = 0.02; // 회전 속도
    private scene: Phaser.Scene;
    private x: number;
    private y: number;
    private width: number;
    private height: number;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // 장애물 생성
        const obstacle1Visual = scene.add.rectangle(x, y, width, height, 0x4a4a4a);
        const obstacle1Body = scene.matter.add.rectangle(x, y, width, height, {
            isStatic: true,
            angle: 0,
            friction: 0.2,
            restitution: 0.8
        });

        const obstacle2Visual = scene.add.rectangle(x, y, height, width, 0x4a4a4a);
        const obstacle2Body = scene.matter.add.rectangle(x, y, height, width, {
            isStatic: true,
            angle: 0,
            friction: 0.2,
            restitution: 0.8
        });

        this.obstacles = [
            { visual: obstacle1Visual, body: obstacle1Body },
            { visual: obstacle2Visual, body: obstacle2Body }
        ];
    }

    rotate() {
        this.obstacles.forEach(obstacle => {
            this.scene.matter.body.rotate(obstacle.body, this.rotationSpeed);
            obstacle.visual.rotation += this.rotationSpeed;
        });
    }
}
export default Obstacle;