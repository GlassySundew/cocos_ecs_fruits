import { PLAYER_INITIAL_HEALTH, PLAYER_INITIAL_PTS } from "db://assets/scripts/game/Const";
import { HealthComponent, PointsComponent } from "db://assets/scripts/game/ecs/components/Stats";
import { PlayerTagComponent } from "db://assets/scripts/game/ecs/components/UnitTags";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';

export class PlayerCreateSystem extends System<GameAspect> {

	constructor() {

		super(GameAspect.name);
	}

	public override init(systems: proto.ISystems): void {

		super.init(systems);

		this.createEntity(
			{ component: PlayerTagComponent, },
			{
				component: HealthComponent,
				args: { value: PLAYER_INITIAL_HEALTH }
			},
			{
				component: PointsComponent,
				args: { value: PLAYER_INITIAL_PTS }
			}
		);
	}
}