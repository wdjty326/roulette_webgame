import Phaser from "phaser";
import { BallUnit } from "../models/unit";
import Obstacle from "../models/obstacle";
export default class GameScreen extends Phaser.Scene {
    private players: BallUnit[] = [];
    private obstacles: Obstacle[] = [];
    private minimap!: Phaser.Cameras.Scene2D.Camera;

    constructor() {
        super({ key: 'roulette' });
    }

    create() {
        // 물리 세계 설정
        this.matter.world.setBounds(0, 0, window.innerWidth, 8000);
        this.matter.world.setGravity(0, 1);

        // 회전하는 장애물 생성
        const obstacleWidth = 400;
        const obstacleHeight = 20;
        
        // 10개의 회전하는 장애물을 랜덤 위치에 생성
        const margin = 200; // 화면 가장자리 여백
        const verticalGap = 8000 / 12; // 수직 간격 (약간의 여유 공간)

        this.obstacles = [];
        
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(margin, window.innerWidth - margin);
            const y = verticalGap * (i + 1); // 수직 간격을 두고 배치
            
            this.obstacles.push(
                new Obstacle(this, x, y, obstacleWidth, obstacleHeight)
            );
        }

        // 첫 번째 공을 카메라가 따라가도록 설정
        // this.cameras.main.setBounds(0, 0, window.innerWidth, 8000);

        // 공들 생성
        const ballMargin = 100;
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(ballMargin, window.innerWidth - ballMargin);
            const y = Phaser.Math.Between(ballMargin, window.innerHeight - ballMargin);
            
            const ball = new BallUnit(this, x, y, 15);
            this.players.push(ball);
        }

        // 미니맵 카메라 설정
        const minimapWidth = 200;  // 미니맵 너비
        const minimapHeight = 400; // 미니맵 높이
        const minimapMargin = 10;  // 화면 가장자리와의 여백

        this.minimap = this.cameras.add(
            window.innerWidth - minimapWidth - minimapMargin,  // x 위치
            window.innerHeight - minimapHeight - minimapMargin, // y 위치
            minimapWidth,
            minimapHeight
        );

        // 미니맵 카메라 설정
        this.minimap.setBounds(0, 0, window.innerWidth, 8000);
        this.minimap.setZoom(minimapHeight / 8000); // 전체 높이가 미니맵에 맞도록 줌 설정
        this.minimap.setBackgroundColor(0x002244); // 미니맵 배경색
        this.minimap.scrollX = 0;
        
        // 미니맵 테두리 추가
        const border = this.add.rectangle(
            window.innerWidth - minimapWidth - minimapMargin,
            window.innerHeight - minimapHeight - minimapMargin,
            minimapWidth,
            minimapHeight,
            0x000000,
            0
        );
        border.setStrokeStyle(2, 0xffffff);
        border.setOrigin(0, 0);
        border.setScrollFactor(0);
        border.setDepth(100);

        // 메인 카메라에서만 테두리가 보이도록 설정
        this.minimap.ignore(border);
    }

    update() {
        this.obstacles.forEach(obstacle => {
            obstacle.rotate();
        });

        // 가장 아래에 있는 공 찾기
        let lowestBall = this.players[0]?.getBall();
        this.players.forEach(player => {
            const ball = player.getBall();
            if (ball.y > (lowestBall?.y || 0)) {
                lowestBall = ball;
            }
        });

        // 가장 아래에 있는 공을 카메라가 따라가도록 설정
        if (lowestBall) {
            this.cameras.main.setLerp(0.1, 0.1);
            this.cameras.main.startFollow(lowestBall);
        }

        // 공이 맵 끝에 도달하면 위로 리셋
        this.players.forEach(player => {
            if (player.getBall().y >= 7999) {
                // player.destroy();
                // player.setPosition(player.getBall().x, 0);
            }
        });
    }
}