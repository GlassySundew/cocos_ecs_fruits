import { Node } from "cc";
import { FruitEffectComponent } from "db://assets/scripts/game/ecs/components/Fruits";
import { HealthComponent, PointsComponent } from "db://assets/scripts/game/ecs/components/Stats";
import { BucketTagComponent, FruitTagComponent, PlayerTagComponent } from "db://assets/scripts/game/ecs/components/UnitTags";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { GameContext } from "db://assets/scripts/game/GameContext";
import { ActivateComponent, DestroyComponent, PositionComponent } from "db://assets/scripts/game/shared/ecs/components/Common";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';

export class FruitActivateSystem extends System<GameAspect> {

	private activatedFruitsIterator!: proto.It;
	private playerIterator!: proto.It;

	public constructor() {

		super(GameAspect.name);
	}

	public override init(systems: proto.ISystems): void {

		super.init(systems);

		this.activatedFruitsIterator = this.filterInc([FruitTagComponent, ActivateComponent]);
		this.playerIterator = this.filterInc([PlayerTagComponent]);
	}

	public override run(): void {

		super.run();

		const fruitEntity = this.getFirstEntity(this.activatedFruitsIterator);

		if (fruitEntity === null)
			return;

		const playerEntity = this.getFirstEntity(this.playerIterator);

		if (playerEntity === null)
			return;

		this.processFruitActivation(fruitEntity, playerEntity);
	}

	private processFruitActivation(fruitEntity: proto.Entity, playerEntity: proto.Entity) {

		const fruitType = this.getComponent(fruitEntity, FruitEffectComponent)!;
		switch (fruitType.effect.type) {
			case "Bad":
				this.getComponent(playerEntity, HealthComponent)!.value -= fruitType.effect.dmg;
				break;

			default:
				this.getComponent(playerEntity, PointsComponent)!.value += fruitType.effect.pts;
				break;
		}

		this.addComponentAndSet(fruitEntity, { component: DestroyComponent });
	}
}