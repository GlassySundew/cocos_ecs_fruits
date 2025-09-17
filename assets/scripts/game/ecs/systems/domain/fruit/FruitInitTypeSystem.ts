import { FruitEffect, FruitEffectComponent, FruitMovement, FruitMovementComponent } from "db://assets/scripts/game/ecs/components/Fruits";
import { FruitTagComponent } from "db://assets/scripts/game/ecs/components/UnitTags";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { CreateComponent, PositionComponent, VelocityComponent, ZigZagOscComponent } from "db://assets/scripts/game/shared/ecs/components/Common";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';
import { ISystems } from "db://assets/scripts/import/ecs/proto";
import { AccelerationComponent } from "../../../../shared/ecs/components/Common";
import { BAD_FRUIT_DEFAULT_DMG, BAD_FRUIT_SPAWN_RATE, FALL_ACCEL, GOOD_FRUIT_DEFAULT_PTS, MAX_FALL_SPEED, MIN_FALL_SPEED, ZIG_AMP_RANGE, ZIG_FREQ_RANGE } from "db://assets/scripts/game/Const";
import { randomEnum } from "db://assets/scripts/game/shared/utils";

export class FruitInitTypeSystem extends System<GameAspect> {

	private _iterator!: proto.IIt;

	constructor() {

		super(GameAspect.name);
	}

	override init(systems: ISystems): void {

		super.init(systems);

		this._iterator = this.filterInc([CreateComponent, FruitTagComponent]);
	}

	override run(): void {

		super.run();

		for (this._iterator.begin(); this._iterator.next();) {

			const newFruitEntity = this._iterator.entity();

			this.initFruit(newFruitEntity);
		}
	}

	private initFruit(fruitEntity: proto.Entity) {

		this.createFruitEffect(fruitEntity);
		this.createFruitMovementType(fruitEntity);
	}

	private createFruitEffect(fruitEntity: proto.Entity) {

		let effect: FruitEffect;

		if (Math.random() > BAD_FRUIT_SPAWN_RATE) {

			effect = { type: "Bad", dmg: BAD_FRUIT_DEFAULT_DMG };
		} else {

			effect = { type: "Good", pts: GOOD_FRUIT_DEFAULT_PTS };
		}

		this.addComponentAndSet(
			fruitEntity,
			{ component: FruitEffectComponent, args: { effect: effect } }
		);
	}

	private randRange(a: number, b: number) {
		return a + Math.random() * (b - a);
	}

	private createFruitMovementType(fruitEntity: proto.Entity) {

		const movementType = randomEnum(FruitMovement);
		let startVelocityY = -this.randRange(MIN_FALL_SPEED, MAX_FALL_SPEED);

		switch (movementType) {
			case FruitMovement.ACCELERATION: {
				startVelocityY = startVelocityY * 0.5;
				this.addComponentAndSet(
					fruitEntity,
					{ component: AccelerationComponent, args: { ax: 0, ay: -FALL_ACCEL } }
				);
				break;
			}
			case FruitMovement.ZIG_ZAG: {
				const pos = this.getComponent(fruitEntity, PositionComponent);
				this.addComponentAndSet(
					fruitEntity,
					{
						component: ZigZagOscComponent, args: {
							amplitude: this.randRange(ZIG_AMP_RANGE[0], ZIG_AMP_RANGE[1]),
							frequency: this.randRange(ZIG_FREQ_RANGE[0], ZIG_FREQ_RANGE[1]),
							time: 0,
							baselineX: pos?.x ?? 0
						}
					}
				);
				break;
			}
		}

		this.addComponentAndSet(
			fruitEntity,
			{ component: VelocityComponent, args: { vx: 0, vy: startVelocityY } }
		);

		this.addComponentAndSet(
			fruitEntity,
			{ component: FruitMovementComponent, args: { type: movementType } }
		);
	}
}