import { BucketTagComponent } from "db://assets/scripts/game/ecs/components/UnitTags";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { PositionComponent } from "db://assets/scripts/game/shared/ecs/components/Common";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';

export class BucketCreateSystem extends System<GameAspect>
	implements proto.IInitSystem {

	constructor() {

		super(GameAspect.name);
	}

	public override init(systems: proto.ISystems): void {

		super.init(systems);

		this.createEntity(
			{
				component: BucketTagComponent,
			},
			{
				component: PositionComponent,
				args: { x: 0, y: 0 }
			}
		);
	}
}