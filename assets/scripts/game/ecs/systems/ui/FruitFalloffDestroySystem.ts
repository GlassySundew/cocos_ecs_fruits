import { Node, UITransform, Vec3 } from "cc";
import { FruitTagComponent } from "db://assets/scripts/game/ecs/components/UnitTags";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { GameContext } from "db://assets/scripts/game/GameContext";
import { DestroyComponent, PositionComponent } from "db://assets/scripts/game/shared/ecs/components/Common";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';

export class FruitFalloffDestroySystem extends System<GameAspect> {

	private iterator!: proto.IIt;
	private fruitDestroyZone!: Node;
	private fruitParent!: Node;

	constructor() {

		super(GameAspect.name);
	}

	override init(systems: proto.ISystems): void {

		super.init(systems);

		this.iterator = this.filterInc([FruitTagComponent, PositionComponent]);

		const services = systems.services();
		const context = services.get(GameContext.name) as GameContext;
		this.fruitDestroyZone = context.fruitDestroyZone;
		this.fruitParent = context.fruitParent;
	}

	override run(): void {

		super.run();

		for (this.iterator.begin(); this.iterator.next();) {

			const fruitEntity = this.iterator.entity();

			this.processFruitFall(fruitEntity);
		}
	}

	private processFruitFall(fruitEntity: proto.Entity) {

		const pos = this.getComponent(fruitEntity, PositionComponent)!;

		const parentTransform = this.fruitParent.getComponent(UITransform)!;
		const destroyTransform = this.fruitDestroyZone.getComponent(UITransform)!;
		const worldPos = parentTransform?.convertToWorldSpaceAR(new Vec3(pos.x, pos.y, 0));

		if (destroyTransform.convertToNodeSpaceAR(worldPos).y < 0) {

			this.addComponentAndSet(fruitEntity, { component: DestroyComponent });
		}
	}
}