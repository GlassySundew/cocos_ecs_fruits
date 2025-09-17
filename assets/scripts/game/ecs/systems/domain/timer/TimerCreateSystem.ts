
import { TIMER_AMOUNT_S } from "db://assets/scripts/game/Const";
import { TimerTagComponent } from "db://assets/scripts/game/ecs/components/CountdownTimer";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { CountdownTimerComponent } from "db://assets/scripts/game/shared/ecs/components/Common";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';

export class TimerCreateSystem extends System<GameAspect> {

	public constructor() {

		super(GameAspect.name);
	}

	public override init(systems: proto.ISystems): void {

		super.init(systems);

		const timerEntity = this.createEntity();
		this.addComponentsAndSet(
			timerEntity,
			{ component: TimerTagComponent },
			{ component: CountdownTimerComponent, args: { value: TIMER_AMOUNT_S } },
		);
	}
}