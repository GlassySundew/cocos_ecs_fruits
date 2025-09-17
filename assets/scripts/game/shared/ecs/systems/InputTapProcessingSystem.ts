import * as proto from 'db://assets/scripts/import/ecs/proto';
import * as inputComponents from 'db://assets/scripts/game/shared/ecs/components/Input';
import { GameAspect } from 'db://assets/scripts/game/GameAspect';
import { System } from 'db://assets/scripts/import/ecs/extra';
import { EventTouch, game, input, Input, Vec2 } from 'cc';

export class InputMoveProcessingSystem
	extends System<GameAspect>
	implements proto.IInitSystem, proto.IRunSystem {

	constructor() {

		super(GameAspect.name);
	}

	public override init(systems: proto.ISystems): void {

		super.init(systems);

		input.on(Input.EventType.TOUCH_MOVE, this.input_touchMoveEventHandler, this);
	}

	public destroy(): void {

		input.off(Input.EventType.TOUCH_MOVE, this.input_touchMoveEventHandler, this);
	}

	private input_touchMoveEventHandler(event: EventTouch): void {

		const uiLocation = event.getUILocation();

		this.callOnRun(() => {

			this.createEntity(
				{
					component: inputComponents.InputMoveComponent,
					args: { worldPosition: uiLocation }
				}
			);
		});
	}
}