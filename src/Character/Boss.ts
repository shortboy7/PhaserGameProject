import Phaser from 'phaser'
import MenuScene from './../scenes/MenuScene';

export default class Boss{
	private static imgKey : string = 'boss';
	private static imgPath? : string;
	boss? : Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
	bullets? :  Phaser.Physics.Arcade.Group;
	private nextPattern : number = 500;
	private razorOn : number = -1;
	private razorOff : number = 0;
	constructor(imgPath : string){
		Boss.imgPath = imgPath;
	}

	preload(curScene : Phaser.Scene)
	{
		curScene.load.image(Boss.imgKey, Boss.imgPath);
	}
	create(curScene : Phaser.Scene)
	{
		this.boss = curScene.physics.add.image(300, 100, Boss.imgKey);
		this.boss.setScale(6,6);
		this.boss.setData('status',{
			hp:5,
		});
		this.boss.setState('enemy');
		this.bullets = curScene.physics.add.group({
			velocityY: 100
		});

		curScene.physics.world.on('worldbounds', (body) => {
			const obj = body.gameObject as Phaser.Physics.Arcade.Body;
			obj.destroy();
		});
	}
	private shotBullets(x : number, y : number, imgKey : string) : Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
		const newBullet = this.bullets?.create(x, y, imgKey) as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
		newBullet.setCollideWorldBounds(true);
		newBullet.body.onWorldBounds = true;
		newBullet.setState('enemy_bullet');
		return newBullet;
	}
	private shotlines(lines : number) : void {
		if (this.boss == undefined || lines <= 0) return ;
		const head = this.boss?.getBottomCenter().y;
		const l = this.boss?.getBottomLeft().x, r = this.boss.getBottomRight().x;
		for (let y = head ; y >= head - 10; y -= 5)
		{
			for (let x = l; x < r; x += (r - l) / lines)
			{
				if (x == l || x == r - 1) continue;
				this.shotBullets(x, y + 10, 'bullet_player');
			}
		}
	}
	private shotRoundOneTime(ways:number = 8) : void {
		if (this.boss == undefined) return ;
		const center : Phaser.Math.Vector2 = this.boss.getCenter();
		const round : number = 50;
		const speed : number = 100;
		console.log("one loop");
		for (let i = 0 ; i < ways ; i++) {
			const newBullet = this.shotBullets(center.x + round * Math.cos(2 * i * Math.PI / ways),
			center.y + round * Math.sin(2 * i * Math.PI / ways), 'bullet_player');
			newBullet.setVelocity(speed * Math.cos(2 * i * Math.PI / ways), speed * Math.sin(2 * i * Math.PI / ways))
		}
	}
	private initRazor(time : number) : void {
		if (this.boss == undefined) return ;
		this.razorOn = time;
		this.razorOff = time + 3000;
	}
	private shotRazer(time : number, ways:number = 4) : void {
		if (this.boss == undefined) return ;
		const l = this.boss?.getTopLeft().x, r = this.boss?.getTopRight().x;
		const b = this.boss?.getBottomCenter().y;
		const convertTime = Math.floor(6000 / ways);
		let i = Math.floor((time - this.razorOn) / convertTime) + 1;
		const step = (r - l) / (ways + 2);
		this.shotBullets(l + step * i, b, 'bullet_player');
		this.shotBullets(r - step * i, b, 'bullet_player');
		if (time > this.razorOff){
			this.razorOn = -1;
		}
	}
	private randomPattern(time : number) : void {
		const id = (Phaser.Math.RND.integer() % 10);
		if (0<= id && id <= 4)
			this.shotlines(8);
		else if (5 <= id && id <= 8)
			this.shotRoundOneTime(16);
		else
			this.initRazor(time);
	}
	update(curScene: Phaser.Scene, time : number, delta : number)
	{
		if (this.boss == undefined) return;
		const status = this.boss.getData('status');
		console.log(status);
		if (status.hp <= 0)
		{
			this.boss.destroy();
			curScene.scene.start('MenuScene');
			return ;
		}
		if (this.razorOn >= 0) {
			this.shotRazer(time, 4);
		}
		else if (this.nextPattern < time){
			this.randomPattern(time);
			this.nextPattern += 500;
		}
	}

};
