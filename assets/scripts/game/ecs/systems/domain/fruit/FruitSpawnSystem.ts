import { FRUIT_SPAWN_RATE } from "db://assets/scripts/game/Const";
import { FruitTagComponent } from "db://assets/scripts/game/ecs/components/UnitTags";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { CreateComponent } from "db://assets/scripts/game/shared/ecs/components/Common";
import { System } from "db://assets/scripts/import/ecs/extra";

export class FruitSpawnSystem extends System<GameAspect> {

	constructor() {

		super(GameAspect.name);
	}

	public override run(): void {

		super.run();

		if (Math.random() < FRUIT_SPAWN_RATE)
			return;

		this.createEntity(
			{ component: CreateComponent },
			{ component: FruitTagComponent }
		);
	}
}