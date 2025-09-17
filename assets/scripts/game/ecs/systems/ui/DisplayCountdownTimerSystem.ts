
import { game, Label } from "cc";
import { TimerTagComponent } from "db://assets/scripts/game/ecs/components/CountdownTimer";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { GameContext } from "db://assets/scripts/game/GameContext";
import { CountdownTimerComponent } from "db://assets/scripts/game/shared/ecs/components/Common";
import { formatCountdown } from "db://assets/scripts/game/shared/utils";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';

export class DisplayCountdownTimerSystem extends System<GameAspect> {

	private timerIterator!: proto.It;
	private timerLabel!: Label;

	public constructor() {

		super(GameAspect.name);
	}

	public override init(systems: proto.ISystems): void {

		super.init(systems);

		const services = systems.services();
		const context = services.get(GameContext.name) as GameContext;

		this.timerLabel = context.countdownTimerLabel;

		this.timerIterator = this.filterInc([TimerTagComponent, CountdownTimerComponent]);
	}

	public override run(): void {

		super.run();

		const timerEntity = this.getFirstEntity(this.timerIterator);

		if (timerEntity === null)
			return;

		this.timerLabel.string = formatCountdown(
			this.getComponent(timerEntity, CountdownTimerComponent)!.value * 1000
		);
	}
}