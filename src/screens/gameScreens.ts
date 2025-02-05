// import Phaser from "phaser";
// import { BallUnit } from "../models/unit";
// import Obstacle from "../models/obstacle";
// export default class GameScreen extends Phaser.Scene {
//     private players: BallUnit[] = [];
//     private obstacles: Obstacle[] = [];
//     private minimap!: Phaser.Cameras.Scene2D.Camera;

//     constructor() {
//         super({ key: 'roulette' });
//     }

//     create() {
//         const width = 2880;
//         const height = 9000;
//         // 물리 세계 설정
//         this.matter.world.setBounds(0, 0, width, height);
//         this.matter.world.setGravity(0, 1);

//         this.cameras.main.setBounds(0, 0, width, height);

//         // 벽 설정
//         const wallThickness = 60;
//         const wallSegmentHeight = 1000;  // 각 벽 조각의 높이
//         const wallAngle = 1;          // 기울기 각도 (라디안)
//         const segments = Math.ceil(height / wallSegmentHeight);  // 필요한 벽 조각 수

//         // 시각적 벽
//         this.add.rectangle(
//             width / 2 - 720,
//             0,
//             wallThickness,
//             wallSegmentHeight,
//             0x4a4a4a
//         ).setRotation(0);

//         // 물리 벽
//         this.matter.add.rectangle(
//             width / 2 - 720,
//             0,
//             wallThickness,
//             wallSegmentHeight,
//             {
//                 isStatic: true,
//                 angle: 0,
//                 render: {
//                     fillColor: 0xFFFFFFFF
//                 }
//             }
//         );
//         // 시각적 벽
//         this.add.rectangle(
//             width / 2 + 720,
//             0,
//             wallThickness,
//             wallSegmentHeight,
//             0x4a4a4a
//         ).setRotation(0);

//         // 물리 벽
//         this.matter.add.rectangle(
//             width / 2 + 720,
//             0,
//             wallThickness,
//             wallSegmentHeight,
//             {
//                 isStatic: true,
//                 angle: 0,
//                 render: {
//                     fillColor: 0xFFFFFFFF
//                 }
//             }
//         );

//         // 왼쪽 지그재그 벽 생성
//         // for (let i = 0; i < segments; i++) {
//         //     const y = i * wallSegmentHeight + wallSegmentHeight / 2;
//         //     const angle = (i % 2 === 0) ? wallAngle : -wallAngle;  // 번갈아가며 각도 변경

//         //     // 시각적 벽
//         //     this.add.rectangle(
//         //         width / 2 - 720,
//         //         y,
//         //         wallThickness,
//         //         wallSegmentHeight,
//         //         0x4a4a4a
//         //     ).setRotation(angle);

//         //     // 물리 벽
//         //     this.matter.add.rectangle(
//         //         width / 2 - 720,
//         //         y,
//         //         wallThickness,
//         //         wallSegmentHeight,
//         //         {
//         //             isStatic: true,
//         //             angle: angle,
//         //             render: {
//         //                 fillColor: 0xFFFFFFFF
//         //             }
//         //         }
//         //     );
//         // }

//         // 오른쪽 지그재그 벽 생성
//         // for (let i = 0; i < segments; i++) {
//         //     const y = i * wallSegmentHeight + wallSegmentHeight / 2;
//         //     const angle = (i % 2 === 0) ? wallAngle : -wallAngle;  // 왼쪽과 반대로

//         //     // 시각적 벽
//         //     this.add.rectangle(
//         //         width / 2 + 720,
//         //         y,
//         //         wallThickness,
//         //         wallSegmentHeight,
//         //         0x4a4a4a
//         //     ).setRotation(angle);

//         //     // 물리 벽
//         //     this.matter.add.rectangle(
//         //         width / 2 + 720,
//         //         y,
//         //         wallThickness,
//         //         wallSegmentHeight,
//         //         {
//         //             isStatic: true,
//         //             angle: angle,
//         //             render: {
//         //                 fillColor: 0xFFFFFFFF
//         //             }
//         //         }
//         //     );
//         // }

//         // 회전하는 장애물 생성
//         const obstacleWidth = 400;
//         const obstacleHeight = 20;

//         // 10개의 회전하는 장애물을 랜덤 위치에 생성
//         const margin = 200; // 화면 가장자리 여백
//         const verticalGap = 8000 / 12; // 수직 간격 (약간의 여유 공간)

//         this.obstacles = [];

//         // for (let i = 0; i < 30; i++) {
//         //     const x = Phaser.Math.Between(margin, window.innerWidth - margin);
//         //     const y = verticalGap * (i + 1); // 수직 간격을 두고 배치

//         //     this.obstacles.push(
//         //         new Obstacle(this, x, y, obstacleWidth, obstacleHeight)
//         //     );
//         // }

//         // 첫 번째 공을 카메라가 따라가도록 설정
//         // this.cameras.main.setBounds(0, 0, window.innerWidth, 8000);

//         // 공들 생성
//         const ballMargin = 100;
//         for (let i = 0; i < 1; i++) {
//             const x = Phaser.Math.Between(ballMargin, window.innerWidth - ballMargin);
//             const y = Phaser.Math.Between(ballMargin, window.innerHeight - ballMargin);

//             const ball = new BallUnit(this, x, y, 15);
//             this.players.push(ball);
//         }

//         const ratio = height / width;

//         // 미니맵 카메라 설정
//         const minimapWidth = width / 12;  // 미니맵 너비
//         const minimapHeight = minimapWidth * ratio; // 미니맵 높이
//         const minimapMargin = 10;  // 화면 가장자리와의 여백

//         this.minimap = this.cameras.add(
//             window.innerWidth - minimapWidth - minimapMargin,  // x 위치
//             window.innerHeight - minimapHeight - minimapMargin, // y 위치
//             minimapWidth,
//             minimapHeight
//         );

//         // 미니맵 카메라 설정
//         this.minimap.setBounds(0, 0, window.innerWidth, 8000);
//         this.minimap.setZoom(minimapHeight / 8000); // 전체 높이가 미니맵에 맞도록 줌 설정
//         this.minimap.setBackgroundColor(0x002244); // 미니맵 배경색
//         this.minimap.scrollX = 0;

//         // 미니맵 테두리 추가
//         const border = this.add.rectangle(
//             window.innerWidth - minimapWidth - minimapMargin,
//             window.innerHeight - minimapHeight - minimapMargin,
//             minimapWidth,
//             minimapHeight,
//             0x000000,
//             0
//         );
//         border.setStrokeStyle(2, 0xffffff);
//         border.setOrigin(0, 0);
//         border.setScrollFactor(0);
//         border.setDepth(100);

//         // 미니맵 상호작용을 위한 투명한 버튼 영역 생성
//         const minimapInteractive = this.add.rectangle(
//             window.innerWidth - minimapWidth - minimapMargin,
//             window.innerHeight - minimapHeight - minimapMargin,
//             minimapWidth,
//             minimapHeight,
//             0x000000,
//             0
//         );
//         minimapInteractive.setOrigin(0, 0);
//         minimapInteractive.setScrollFactor(0);
//         minimapInteractive.setInteractive();
//         minimapInteractive.setDepth(99);

//         // 미니맵 호버/클릭 이벤트
//         minimapInteractive.on('pointermove', (pointer: Phaser.Input.Pointer) => {
//             const relativeX = pointer.x - (window.innerWidth - minimapWidth - minimapMargin);
//             const relativeY = pointer.y - (window.innerHeight - minimapHeight - minimapMargin);
//             const targetX = (relativeX / minimapWidth) * width;
//             const targetY = (relativeY / minimapHeight) * height;

//             // 메인 카메라 위치 업데이트
//             this.cameras.main.scrollX = targetX - (window.innerWidth / 2);
//             this.cameras.main.scrollY = targetY - (window.innerHeight / 2);
//         });

//         // 미니맵에서만 보이는 현재 뷰포트 영역 표시
//         const viewportRect = this.add.rectangle(
//             window.innerWidth - minimapWidth - minimapMargin,
//             window.innerHeight - minimapHeight - minimapMargin,
//             minimapWidth * (window.innerWidth / width),  // 미니맵 비율에 맞게 조정
//             minimapHeight * (window.innerHeight / height), // 미니맵 비율에 맞게 조정
//             0xffffff,
//             0.2
//         );
//         viewportRect.setOrigin(0, 0);
//         viewportRect.setScrollFactor(0);
//         viewportRect.setDepth(98);

//         // 뷰포트 영역 업데이트
//         this.events.on('update', () => {
//             const minimapX = window.innerWidth - minimapWidth - minimapMargin;
//             const minimapY = window.innerHeight - minimapHeight - minimapMargin;
//             const relativeX = (this.cameras.main.scrollX / width) * minimapWidth;
//             const relativeY = (this.cameras.main.scrollY / height) * minimapHeight;
//             viewportRect.setPosition(minimapX + relativeX, minimapY + relativeY);
//         });

//         // 메인 카메라에서는 뷰포트 영역을 보이지 않게
//         this.minimap.ignore(viewportRect);
//     }

//     update() {
//         this.obstacles.forEach(obstacle => {
//             obstacle.rotate();
//         });

//         // 가장 아래에 있는 공 찾기
//         let lowestBall = this.players[0]?.getBall();
//         this.players.forEach(player => {
//             const ball = player.getBall();
//             if (ball.y > (lowestBall?.y || 0)) {
//                 lowestBall = ball;
//             }
//         });

//         // 가장 아래에 있는 공을 카메라가 따라가도록 설정
//         // if (lowestBall) {
//         //     this.cameras.main.setLerp(0.1, 0.1);
//         //     this.cameras.main.startFollow(lowestBall);
//         // }

//         // 공이 맵 끝에 도달하면 위로 리셋
//         this.players.forEach(player => {
//             if (player.getBall().y >= 7999) {
//                 // player.destroy();
//                 // player.setPosition(player.getBall().x, 0);
//             }
//         });
//     }
// }