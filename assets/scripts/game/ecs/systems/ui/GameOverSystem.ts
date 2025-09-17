import { Label } from "cc";
import { GAME_OVER_LOCALE } from "db://assets/scripts/game/Const";
import { GameOverComponent } from "db://assets/scripts/game/ecs/components/GameOver";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { GameContext } from "db://assets/scripts/game/GameContext";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';

export class GameOverSystem extends System<GameAspect> {

	private gameOverIterator!: proto.It;
	private world!: proto.World;
	private gameOverLabel!: Label;

	public constructor() {

		super(GameAspect.name);
	}

	public override init(systems: proto.ISystems): void {

		super.init(systems);

		this.world = systems.world();
		const services = systems.services();
		const context = services.get(GameContext.name) as GameContext;

		this.gameOverLabel = context.gameOverLabel;
		this.gameOverIterator = this.filterInc([GameOverComponent], this.world);
	}

	public override run(): void {

		super.run();

		const gameOverEntity = this.getFirstEntity(this.gameOverIterator);

		if (gameOverEntity === null)
			return;

		this.world.destroy();
		this.gameOverLabel.string = GAME_OVER_LOCALE;
	}
}