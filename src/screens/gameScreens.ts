import Phaser from "phaser";
import { BallUnit } from '../models/unit';

export default class GameScreen extends Phaser.Scene {
    private players!: BallUnit[];
    private obstacles!: Phaser.GameObjects.Rectangle[];

    constructor() {
        super({
            key: 'roulette',
        })
    }

    create() {
        // 물리 시스템 설정
        this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
        
        // 회전하는 장애물 생성
        this.obstacles = [];
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // 십자가 형태의 회전하는 장애물
        const obstacleWidth = 400;
        const obstacleHeight = 20;
        
        const obstacle1 = this.add.rectangle(centerX, centerY, obstacleWidth, obstacleHeight, 0x4a4a4a);
        const obstacle2 = this.add.rectangle(centerX, centerY, obstacleHeight, obstacleWidth, 0x4a4a4a);
        
        [obstacle1, obstacle2].forEach(obstacle => {
            this.physics.add.existing(obstacle, false);
            const body = obstacle.body as Phaser.Physics.Arcade.Body;
            body.setImmovable(true);
            body.setAllowRotation(true);
            body.setAngularVelocity(90); // 초당 90도 회전
            this.obstacles.push(obstacle);
        });

        // tweens 대신 update에서 처리하도록 수정
        this.obstacles.forEach(obstacle => {
            obstacle.setData('rotationSpeed', 1); // 회전 속도 저장
        });
        
        // 플레이어 볼 생성
        this.players = [];
        const margin = 100;
        
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(margin, window.innerWidth - margin);
            const y = Phaser.Math.Between(margin, window.innerHeight - margin);
            
            this.players.push(new BallUnit(
                this,
                x,
                y,
                15
            ));
        }

        // 충돌 설정
        this.players.forEach((player, i) => {
            // 공들 사이의 충돌
            this.players.slice(i + 1).forEach(otherPlayer => {
                this.physics.add.collider(player.getBall(), otherPlayer.getBall());
            });
            
            // 장애물과의 충돌
            this.obstacles.forEach(obstacle => {
                this.physics.add.collider(player.getBall(), obstacle);
            });
        });
    }

    update() {
        // 장애물 회전 업데이트
        this.obstacles.forEach(obstacle => {
            obstacle.rotation += obstacle.getData('rotationSpeed') * 0.01;
            const body = obstacle.body as Phaser.Physics.Arcade.Body;
            body.setSize(obstacle.width, obstacle.height);
            // body.setAngularVelocity(obstacle.rotation * 60); // 각속도 설정
        });
    }
}