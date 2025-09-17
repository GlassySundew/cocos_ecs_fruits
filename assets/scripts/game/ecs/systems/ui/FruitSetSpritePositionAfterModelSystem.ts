import { FruitTagComponent } from 'db://assets/scripts/game/ecs/components/UnitTags';
import { GameAspect } from 'db://assets/scripts/game/GameAspect';
import { GameContext } from 'db://assets/scripts/game/GameContext';
import { CocosNodeComponent, PositionComponent } from 'db://assets/scripts/game/shared/ecs/components/Common';
import { System } from 'db://assets/scripts/import/ecs/extra';
import * as proto from 'db://assets/scripts/import/ecs/proto';

export class FruitSetSpritePositionAfterModelSystem extends System<GameAspect> {

	private _iterator!: proto.IIt;


	constructor() {

		super(GameAspect.name);
	}

	override init(systems: proto.ISystems): void {

		super.init(systems);

		this._iterator = this.filterInc([FruitTagComponent]);
	}

	override run(): void {

		super.run();

		for (this._iterator.begin(); this._iterator.next();) {

			const fruitEntity = this._iterator.entity();

			this.processFruit(fruitEntity);
		}
	}

	private processFruit(fruitEntity: proto.Entity) {

		const node = this.getComponent(fruitEntity, CocosNodeComponent)!;
		const position = this.getComponent(fruitEntity, PositionComponent)!;

		node.node.setPosition(position.x, position.y);
	}
}