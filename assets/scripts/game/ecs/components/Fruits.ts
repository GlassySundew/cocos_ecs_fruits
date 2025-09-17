import { Component } from "db://assets/scripts/import/ecs/extra";

export type FruitEffect =
	| { type: "Good", pts: number }
	| { type: "Bad", dmg: number };

export class FruitEffectComponent extends Component {

	public effect!: FruitEffect;
}

export enum FruitMovement {

	ZIG_ZAG,
	LINEAR,
	ACCELERATION,
}

export class FruitMovementComponent extends Component {

	public type!: FruitMovement;
}