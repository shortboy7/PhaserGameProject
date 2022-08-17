import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene{
	graphics? : Phaser.GameObjects.Graphics;
	start? : Phaser.GameObjects.Graphics;
	constructor(){
		super('menu-scene');

	}
	preload(){
		this.load.image('sky', 'assets/sky.png');
	}
	create(){
		this.add.image(400, 300, 'sky');
		this.graphics = this.add.graphics();
		this.graphics.fillStyle(0xdeeb34, 100);
		this.start = this.graphics.fillRect(100, 100, 200, 100).setInteractive();
		this.start.on('pointerdown', (pointer) => {
			console.log('click');
		});
		this.graphics.fillRect(100, 250, 200, 100);
	}
};
