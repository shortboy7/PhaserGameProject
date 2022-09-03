import Phaser from "phaser";

export default class Collision{
	static bulletAndPlane(
		scene : Phaser.Scene,
		bullets : Phaser.Physics.Arcade.Group,
		airplane : Phaser.Physics.Arcade.Image | Phaser.Physics.Arcade.Group,
		bullet_state : string,
		plane_state : string) : 'gameOver' | 'gameContinue'
		{
			let result : 'gameOver' | 'gameContinue' = 'gameContinue';
			scene.physics.add.collider(bullets, airplane, (one, two)=>{
			if (one == undefined || two == undefined) return ;
			let plane : Phaser.Types.Physics.Arcade.GameObjectWithBody;
			let bullet : Phaser.Types.Physics.Arcade.GameObjectWithBody;
			if (one.state == plane_state)
				plane = one;
			else if (two.state == plane_state)
				plane = two;
			else return ;
			if (one.state == bullet_state)
				bullet = one;
			else if (two.state == bullet_state)
				bullet = two;
			else return ;
			const status = plane.getData('status');
			const damage = bullet.getData('damage');
			plane.body.velocity.x -= bullet.body.velocity.x;
			plane.body.velocity.y -= bullet.body.velocity.y;
			bullet.destroy();
			plane.setData('status', {
				...status,
				hp : status.hp - damage
			});
			if (status.hp - damage <= 0 && plane_state == 'enemy')
				plane.destroy();
		});
		return (result);
	}
};
