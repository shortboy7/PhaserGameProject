import Phaser from 'phaser'

import MainGameScene from './scenes/MainGameScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			debug:true
		}
	},
	scene: [MainGameScene]
}

export default new Phaser.Game(config)
