import Phaser from 'phaser'
import MainScene from './scenes/MenuScene'
import MainGameScene from './scenes/MainGameScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 400,
	height: 400,
	physics: {
		default: 'arcade',
		arcade:
		{
			// debug:true
		}
	},
	scene: [MainGameScene, MainScene]
}

export default new Phaser.Game(config)
