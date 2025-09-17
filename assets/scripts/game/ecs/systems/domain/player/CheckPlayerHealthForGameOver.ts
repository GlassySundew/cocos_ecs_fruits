import { GameOverComponent } from "db://assets/scripts/game/ecs/components/GameOver";
import { HealthComponent } from "db://assets/scripts/game/ecs/components/Stats";
import { PlayerTagComponent } from "db://assets/scripts/game/ecs/components/UnitTags";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';

export class CheckPlayerHealthForGameOver extends System<GameAspect> {

	private playerIterator!: proto.It;

	public constructor() {

		super(GameAspect.name);
	}

	public override init(systems: proto.ISystems): void {

		super.init(systems);

		const world = systems.world();

		this.playerIterator = this.filterInc([PlayerTagComponent], world);
	}

	public override run(): void {

		super.run();

		const playerEntity = this.getFirstEntity(this.playerIterator);

		if (playerEntity === null)
			return;

		if (this.getComponent(playerEntity, HealthComponent)!.value > 0)
			return;

		const gameOver = this.createEntity();
		this.addComponentAndSet(gameOver, { component: GameOverComponent });
	}
}