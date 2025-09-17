import { BUCKET_CATCH_RANGE } from "db://assets/scripts/game/Const";
import { BucketTagComponent, FruitTagComponent } from "db://assets/scripts/game/ecs/components/UnitTags";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { ActivateComponent, PositionComponent } from "db://assets/scripts/game/shared/ecs/components/Common";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';

export class FruitsCheckBucketCatch extends System<GameAspect> {

	private _fruitsIterator!: proto.IIt;
	private _bucketIterator!: proto.IIt;

	constructor() {

		super(GameAspect.name);
	}

	override init(systems: proto.ISystems): void {

		super.init(systems);

		this._fruitsIterator = this.filterInc([FruitTagComponent, PositionComponent]);
		this._bucketIterator = this.filterInc([BucketTagComponent, PositionComponent]);
	}

	override run(): void {

		super.run();

		const bucketEntity = this.getFirstEntity(this._bucketIterator);

		if (!bucketEntity)
			return;

		for (this._fruitsIterator.begin(); this._fruitsIterator.next();) {

			const fruitEntity = this._fruitsIterator.entity();

			this.checkFruit(bucketEntity, fruitEntity);
		}
	}

	private checkFruit(bucketEntity: proto.Entity, fruitEntity: proto.Entity) {

		const bucketPos = this.getComponent(bucketEntity, PositionComponent)!;
		const fruitPos = this.getComponent(fruitEntity, PositionComponent)!;

		const dist = Math.hypot(bucketPos.x - fruitPos.x, bucketPos.y - fruitPos.y)

		if (dist < BUCKET_CATCH_RANGE)
			this.addComponent(fruitEntity, ActivateComponent);
	}
}