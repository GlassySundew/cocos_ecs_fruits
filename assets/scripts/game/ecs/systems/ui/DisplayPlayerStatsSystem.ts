import { Label, Node, Vec2 } from "cc";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { GameContext } from "db://assets/scripts/game/GameContext";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';
import * as input from 'db://assets/scripts/game/shared/ecs/components/Input';
import { PlayerTagComponent } from "db://assets/scripts/game/ecs/components/UnitTags";
import { HealthComponent, PointsComponent } from "db://assets/scripts/game/ecs/components/Stats";

export class DisplayPlayerStatsSystem extends System<GameAspect> {

	private _playerIterator!: proto.It;
	private _pointCounter!: Label;
	private _healthCounter!: Label;

	public constructor() {

		super(GameAspect.name);
	}

	public override init(systems: proto.ISystems): void {

		super.init(systems);

		const world = systems.world();
		const services = systems.services();
		const context = services.get(GameContext.name) as GameContext;

		this._playerIterator = this.filterInc([
			PlayerTagComponent,
			HealthComponent,
			PointsComponent
		], world);
		this._pointCounter = context.pointCounter;
		this._healthCounter = context.healthCounter;
	}

	public override run(): void {

		super.run();

		const entity = this.getFirstEntity(this._playerIterator);

		if (entity === null)
			return;

		const health = this.getComponent(entity, HealthComponent)!;
		this._healthCounter.string = `${health.value}`;

		const points = this.getComponent(entity, PointsComponent)!;
		this._pointCounter.string = `${points.value}`;
	}
}