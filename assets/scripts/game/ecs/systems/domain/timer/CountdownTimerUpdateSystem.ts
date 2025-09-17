
import { game } from "cc";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { CountdownTimerComponent } from "db://assets/scripts/game/shared/ecs/components/Common";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';

export class CountdownTimerUpdateSystem extends System<GameAspect> {

	private _timerIterator!: proto.It;

	public constructor() {

		super(GameAspect.name);
	}

	public override init(systems: proto.ISystems): void {

		super.init(systems);

		this._timerIterator = this.filterInc([CountdownTimerComponent]);
	}

	public override run(): void {

		super.run();

		const timerEntity = this.getFirstEntity(this._timerIterator);

		if (timerEntity === null)
			return;

		this.getComponent(timerEntity, CountdownTimerComponent)!.value -= game.deltaTime;
	}
}