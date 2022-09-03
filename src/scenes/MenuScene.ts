import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene{
	graphics? : Phaser.GameObjects.Graphics;
	start? : Phaser.GameObjects.Graphics;
	constructor(){
		super('MenuScene');

	}
	preload(){
		this.load.image('sky', 'assets/sky.png');
	}
	create(){
		this.add.image(400, 300, 'sky');
		let startBtn = this.add.text(200, 200, 'Start game').setInteractive({ useHandCursor: true })
		.on('pointerdown', () => {
			this.scene.start('MainGameScene');
		})
		.on('pointerover', () => startBtn.setStyle({ fill: '#f39c12' }))
		.on('pointerout', () => startBtn.setStyle({ fill: '#FFF' }))
	}
};
