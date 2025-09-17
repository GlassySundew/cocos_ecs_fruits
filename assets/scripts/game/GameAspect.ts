import { TimerTagComponent } from "db://assets/scripts/game/ecs/components/CountdownTimer";
import * as fruits from "db://assets/scripts/game/ecs/components/Fruits";
import { GameOverComponent } from "db://assets/scripts/game/ecs/components/GameOver";
import { HealthComponent, PointsComponent } from "db://assets/scripts/game/ecs/components/Stats";
import * as unitTags from "db://assets/scripts/game/ecs/components/UnitTags";
import * as common from "db://assets/scripts/game/shared/ecs/components/Common";
import * as input from "db://assets/scripts/game/shared/ecs/components/Input";
import { Aspect } from "db://assets/scripts/import/ecs/extra";


export class GameAspect extends Aspect {

	protected registerComponents(): void {

		super.registerComponent(unitTags.PlayerTagComponent);
		super.registerComponent(unitTags.FruitTagComponent);
		super.registerComponent(unitTags.BucketTagComponent);
		super.registerComponent(TimerTagComponent);


		super.registerComponent(input.InputMoveComponent);

		super.registerComponent(HealthComponent);
		super.registerComponent(PointsComponent);

		super.registerComponent(GameOverComponent);

		super.registerComponent(common.ActivateComponent);
		super.registerComponent(common.CreateComponent);
		super.registerComponent(common.DestroyComponent);

		super.registerComponent(common.PositionComponent);
		super.registerComponent(common.AccelerationComponent);
		super.registerComponent(common.VelocityComponent);
		super.registerComponent(common.ZigZagOscComponent);

		super.registerComponent(common.CountdownTimerComponent);
		super.registerComponent(common.CocosNodeComponent);

		super.registerComponent(fruits.FruitEffectComponent);
		super.registerComponent(fruits.FruitMovementComponent);
	}
}