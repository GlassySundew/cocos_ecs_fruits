import { TimerTagComponent } from "db://assets/scripts/game/ecs/components/CountdownTimer";
import { GameOverComponent } from "db://assets/scripts/game/ecs/components/GameOver";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { CountdownTimerComponent } from "db://assets/scripts/game/shared/ecs/components/Common";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';

export class CheckTimerForGameOver extends System<GameAspect> {

	private timerIterator!: proto.It;

	public constructor() {

		super(GameAspect.name);
	}

	public override init(systems: proto.ISystems): void {

		super.init(systems);

		const world = systems.world();

		this.timerIterator = this.filterInc([TimerTagComponent, CountdownTimerComponent], world);
	}

	public override run(): void {

		super.run();

		const tagEntity = this.getFirstEntity(this.timerIterator);

		if (tagEntity === null)
			return;

		if (this.getComponent(tagEntity, CountdownTimerComponent)!.value > 0)
			return;

		const gameOver = this.createEntity();
		this.addComponentAndSet(gameOver, { component: GameOverComponent });
	}
}