import Phaser from "phaser";
import { BallUnit } from "../models/unit";
export default class GameScreen extends Phaser.Scene {
    private players: BallUnit[] = [];
    private obstacles: { visual: Phaser.GameObjects.Rectangle, body: MatterJS.BodyType }[] = [];
    private rotationSpeed = 0.02; // 회전 속도

    constructor() {
        super({ key: 'roulette' });
    }

    create() {
        // 물리 세계 설정
        this.matter.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
        this.matter.world.setGravity(0, 1);

        // 회전하는 장애물 생성
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight - 100;

        // 십자가 형태의 회전하는 장애물
        const obstacleWidth = 400;
        const obstacleHeight = 20;

        // 장애물 생성
        const obstacle1Visual = this.add.rectangle(centerX, centerY, obstacleWidth, obstacleHeight, 0x4a4a4a);
        const obstacle1Body = this.matter.add.rectangle(centerX, centerY, obstacleWidth, obstacleHeight, {
            isStatic: true,
            angle: 0,
            friction: 0.2,
            restitution: 0.8
        });

        const obstacle2Visual = this.add.rectangle(centerX, centerY, obstacleHeight, obstacleWidth, 0x4a4a4a);
        const obstacle2Body = this.matter.add.rectangle(centerX, centerY, obstacleHeight, obstacleWidth, {
            isStatic: true,
            angle: 0,
            friction: 0.2,
            restitution: 0.8
        });

        this.obstacles = [
            { visual: obstacle1Visual, body: obstacle1Body },
            { visual: obstacle2Visual, body: obstacle2Body }
        ];

        // 공들 생성
        const margin = 100;
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(margin, window.innerWidth - margin);
            const y = Phaser.Math.Between(margin, window.innerHeight - margin);

            const ball = new BallUnit(this, x, y, 15);
            this.players.push(ball);
        }

        // 장애물 회전 설정
        // this.obstacles.forEach(obstacle => {
        //     this.matter.body.rotate(obstacle.body, this.rotationSpeed);
        // });
    }

    update() {
        // 장애물 회전 유지
        this.obstacles.forEach(obstacle => {
            this.matter.body.rotate(obstacle.body, this.rotationSpeed);
            // 시각적 요소 회전
            obstacle.visual.rotation += this.rotationSpeed;
        });
    }
}