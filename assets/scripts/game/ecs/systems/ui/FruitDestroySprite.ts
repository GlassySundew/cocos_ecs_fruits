import { Node, UITransform, Vec3 } from "cc";
import { FruitTagComponent } from "db://assets/scripts/game/ecs/components/UnitTags";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { GameContext } from "db://assets/scripts/game/GameContext";
import { CocosNodeComponent, DestroyComponent, PositionComponent } from "db://assets/scripts/game/shared/ecs/components/Common";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';

export class FruitDestroySprite extends System<GameAspect> {

	private iterator!: proto.IIt;

	constructor() {

		super(GameAspect.name);
	}

	override init(systems: proto.ISystems): void {

		super.init(systems);

		this.iterator = this.filterInc([FruitTagComponent, CocosNodeComponent, DestroyComponent]);
	}

	override run(): void {

		super.run();

		for (this.iterator.begin(); this.iterator.next();) {

			const fruitEntity = this.iterator.entity();

			this.processFruit(fruitEntity);
		}
	}

	private processFruit(fruitEntity: proto.Entity) {

		const cocosNode = this.getComponent(fruitEntity, CocosNodeComponent);
		cocosNode?.node.removeFromParent();
	}
}