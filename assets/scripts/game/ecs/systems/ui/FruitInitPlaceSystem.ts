import { Node, UITransform, Vec2, Vec3 } from "cc";
import { FruitTagComponent } from "db://assets/scripts/game/ecs/components/UnitTags";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { GameContext } from "db://assets/scripts/game/GameContext";
import { CreateComponent, PositionComponent } from "db://assets/scripts/game/shared/ecs/components/Common";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';

export class FruitInitPlaceSystem extends System<GameAspect> {

	private _iterator!: proto.IIt;
	private _fruitPlacerNode!: Node;
	private _fruitParent!: Node;

	constructor() {

		super(GameAspect.name);
	}

	override init(systems: proto.ISystems): void {

		super.init(systems);

		this._iterator = this.filterInc([CreateComponent, FruitTagComponent]);

		const services = systems.services();
		const context = services.get(GameContext.name) as GameContext;

		this._fruitPlacerNode = context.fruitSpawnZone;
		this._fruitParent = context.fruitParent;
	}

	override run(): void {

		super.run();

		for (this._iterator.begin(); this._iterator.next();) {

			const newFruitEntity = this._iterator.entity();

			this.initFruit(newFruitEntity);
		}
	}

	private initFruit(fruitEntity: proto.Entity) {

		const size = this._fruitPlacerNode.getComponent(UITransform);

		if (size == null)
			return;

		const localPoint = new Vec3(
			-size.anchorX * size.width + Math.random() * size.width,
			-size.anchorY * size.height + Math.random() * size.height,
			0
		);
		const globalPos = size.convertToWorldSpaceAR(localPoint);

		const parentUI = this._fruitParent.getComponent(UITransform)!;
		const posInParent = parentUI.convertToNodeSpaceAR(globalPos);

		this.addComponentAndSet(
			fruitEntity,
			{
				component: PositionComponent,
				args: { x: posInParent.x, y: posInParent.y }
			});
	}
}