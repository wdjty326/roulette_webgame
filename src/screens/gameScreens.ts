import Phaser from "phaser";

class GameScreen extends Phaser.Scene {
    constructor() {
        super({
            key: 'roulette',
        })
    }

    create() {
        this.add.text(100, 100, 'Hello World');
    }
}

export default GameScreen;