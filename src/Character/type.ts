export type image = {
	key : string,
	path: string
};

export type side = 'player' | 'enemy' | 'boss';

export type status = {
	hp : number,
	attackSpeed : number,
	nextFire : number,
	moveSpeed : number,
	bulletSpeed : number,
	damage : number,
};

