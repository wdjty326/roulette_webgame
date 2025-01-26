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
        const centerY = window.innerHeight - 200;

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
            body.setBounce(1, 1);
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

        // 장애물 설정
        this.obstacles.forEach(obstacle => {
            const body = obstacle.body as Phaser.Physics.Arcade.Body;
            body.setImmovable(true);
            body.setAllowRotation(true);
            body.setAngularVelocity(90);
            
            // 장애물과 공 충돌
            this.players.forEach(player => {
                this.physics.add.collider(player.getBall(), obstacle, (ball, obstacle) => {
                    const playerBall = ball as Phaser.GameObjects.Arc;
                    const playerBody = playerBall.body as Phaser.Physics.Arcade.Body;
                    const obstacleObj = obstacle as Phaser.GameObjects.Rectangle;
                    
                    // 장애물의 회전 각도 (라디안)
                    const rotationRad = obstacleObj.rotation;
                    
                    // 회전 방향으로의 속도 벡터 계산
                    const speed = 400; // 튕기는 속도
                    const velocityX = Math.cos(rotationRad) * speed;
                    const velocityY = Math.sin(rotationRad) * speed;
                    
                    // 공의 속도 설정
                    playerBody.setVelocity(velocityX, velocityY);
                });
            });
        });

        // 플레이어 공들 간의 충돌 설정
        for (let i = 0; i < this.players.length; i++) {
            const ball1 = this.players[i].getBall();
            const ballBody = ball1.body as Phaser.Physics.Arcade.Body;
            ballBody.setBounce(1);
            
            for (let j = i + 1; j < this.players.length; j++) {
                const ball2 = this.players[j].getBall();
                this.physics.add.collider(ball1, ball2);
            }
        }

        this.physics.world.setBoundsCollision(true, true, true, true);
    }

    update() {
        // 장애물 회전만 처리
        this.obstacles.forEach(obstacle => {
            const body = obstacle.body as Phaser.Physics.Arcade.Body;
            body.setAngularVelocity(90);
        });
    }
}