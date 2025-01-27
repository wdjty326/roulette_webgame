import Phaser from "phaser";
import { BallUnit } from "../models/unit";
import Obstacle from "../models/obstacle";
export default class GameScreen extends Phaser.Scene {
    private players: BallUnit[] = [];
    private obstacles: Obstacle[] = [];

    constructor() {
        super({ key: 'roulette' });
    }

    create() {
        // 물리 세계 설정
        this.matter.world.setBounds(0, 0, window.innerWidth, window.innerHeight + 30);
        this.matter.world.setGravity(0, 1);

        // 회전하는 장애물 생성
        const centerX1 = 300;
        const centerY1 = window.innerHeight / 2;
        const centerX2 = window.innerWidth - 300;
        const centerY2 = window.innerHeight / 2;

        // 십자가 형태의 회전하는 장애물
        const obstacleWidth = 400;
        const obstacleHeight = 20;

        this.obstacles = [
            new Obstacle(this, centerX1, centerY1, obstacleWidth, obstacleHeight),
            new Obstacle(this, centerX2, centerY2, obstacleHeight, obstacleWidth)
        ];

        // 공들 생성
        const margin = 100;
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(margin, window.innerWidth - margin);
            const y = Phaser.Math.Between(margin, window.innerHeight - margin);

            const ball = new BallUnit(this, x, y, 15);
            this.players.push(ball);
        }
    }

    update() {
        this.obstacles.forEach(obstacle => {
            obstacle.rotate();
        });

        this.players.forEach(player => {
            if (player.getBall().y >= window.innerHeight) {
                player.setPosition(player.getBall().x, 0);
            }
        });
    }
}