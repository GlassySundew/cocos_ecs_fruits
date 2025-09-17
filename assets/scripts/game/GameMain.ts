
import { _decorator, Component, director } from 'cc';
import { BucketCreateSystem } from 'db://assets/scripts/game/ecs/systems/domain/bucket/BucketCreateSystem';
import { BucketSetPositionSystem } from 'db://assets/scripts/game/ecs/systems/domain/bucket/BucketSetPositionSystem';
import { CheckPlayerHealthForGameOver } from 'db://assets/scripts/game/ecs/systems/domain/player/CheckPlayerHealthForGameOver';
import { CheckTimerForGameOver } from 'db://assets/scripts/game/ecs/systems/domain/timer/CheckTimerForGameOver';
import { CountdownTimerUpdateSystem } from 'db://assets/scripts/game/ecs/systems/domain/timer/CountdownTimerUpdateSystem';
import { FruitActivateSystem } from 'db://assets/scripts/game/ecs/systems/domain/fruit/FruitActivateSystem';
import { FruitFalloffDestroySystem } from 'db://assets/scripts/game/ecs/systems/domain/fruit/FruitFalloffDestroySystem';
import { FruitFallProcessSystem } from 'db://assets/scripts/game/ecs/systems/domain/fruit/FruitFallProcessSystem';
import { FruitInitPlaceSystem } from 'db://assets/scripts/game/ecs/systems/ui/FruitInitPlaceSystem';
import { FruitInitTypeSystem } from 'db://assets/scripts/game/ecs/systems/domain/fruit/FruitInitTypeSystem';
import { FruitsCheckBucketCatch } from 'db://assets/scripts/game/ecs/systems/domain/fruit/FruitsCheckBucketCatch';
import { FruitSpawnSystem } from 'db://assets/scripts/game/ecs/systems/domain/fruit/FruitSpawnSystem';
import { GameOverSystem } from 'db://assets/scripts/game/ecs/systems/ui/GameOverSystem';
import { PlayerCreateSystem } from 'db://assets/scripts/game/ecs/systems/domain/player/PlayerCreateSystem';
import { TimerCreateSystem } from 'db://assets/scripts/game/ecs/systems/domain/timer/TimerCreateSystem';
import { BucketNodeSwipeSystem } from 'db://assets/scripts/game/ecs/systems/ui/BucketNodeSwipeSystem';
import { DisplayCountdownTimerSystem } from 'db://assets/scripts/game/ecs/systems/ui/DisplayCountdownTimerSystem';
import { DisplayPlayerStatsSystem } from 'db://assets/scripts/game/ecs/systems/ui/DisplayPlayerStatsSystem';
import { FruitDestroySprite } from 'db://assets/scripts/game/ecs/systems/ui/FruitDestroySprite';
import { FruitInitSpriteSystem } from 'db://assets/scripts/game/ecs/systems/ui/FruitInitSpriteSystem';
import { FruitSetSpritePositionAfterModelSystem } from 'db://assets/scripts/game/ecs/systems/ui/FruitSetSpritePositionAfterModelSystem';
import { GameAspect } from 'db://assets/scripts/game/GameAspect';
import { GameContext } from 'db://assets/scripts/game/GameContext';
import { CreateComponent, DestroyComponent } from 'db://assets/scripts/game/shared/ecs/components/Common';
import * as input from 'db://assets/scripts/game/shared/ecs/components/Input';
import { ComponentRecycleSystem } from 'db://assets/scripts/game/shared/ecs/systems/ComponentRecycleSystem';
import { EntityRecycleSystem } from 'db://assets/scripts/game/shared/ecs/systems/EntityDestroySystem';
import { InputMoveProcessingSystem } from 'db://assets/scripts/game/shared/ecs/systems/InputTapProcessingSystem';
import * as proto from 'db://assets/scripts/import/ecs/proto';

const { ccclass, property } = _decorator;

@ccclass('GameMain')
export class GameMain extends Component {

	@property({ type: GameContext, visible: true })
	private context!: GameContext;

	private world!: proto.World;
	private updateSystems!: proto.ISystems;

	public onLoad(): void {

		this.init();
	}

	public update(dt: number): void {

		if (!this.world?.isAlive())
			return;

		if (this.updateSystems != null)
			this.updateSystems.run();
	}

	private async init(): Promise<void> {

		this.createEcs();

		director.addPersistRootNode(this.node);
	}

	private createEcs(): void {

		const aspect = new GameAspect();
		const world = new proto.World(aspect);
		const updateSystems = new proto.Systems(world);

		updateSystems
			.addSystem(new InputMoveProcessingSystem())

			.addSystem(new PlayerCreateSystem())

			.addSystem(new TimerCreateSystem())

			.addSystem(new FruitSpawnSystem())
			.addSystem(new FruitInitPlaceSystem())
			.addSystem(new FruitInitTypeSystem())
			.addSystem(new FruitInitSpriteSystem())
			.addSystem(new FruitFallProcessSystem())
			.addSystem(new FruitSetSpritePositionAfterModelSystem())
			.addSystem(new FruitsCheckBucketCatch())
			.addSystem(new FruitActivateSystem())

			.addSystem(new BucketCreateSystem())
			.addSystem(new BucketNodeSwipeSystem())
			.addSystem(new BucketSetPositionSystem())

			.addSystem(new CountdownTimerUpdateSystem())
			.addSystem(new DisplayCountdownTimerSystem())

			.addSystem(new FruitFalloffDestroySystem())
			.addSystem(new FruitDestroySprite())

			.addSystem(new DisplayPlayerStatsSystem())
			.addSystem(new CheckPlayerHealthForGameOver())
			.addSystem(new CheckTimerForGameOver())
			.addSystem(new GameOverSystem())

			.addSystem(new ComponentRecycleSystem({ include: input.InputMoveComponent }))
			.addSystem(new ComponentRecycleSystem({ include: CreateComponent }))

			.addSystem(new EntityRecycleSystem(GameAspect.name, DestroyComponent))

			.addService(this.context)
			.init();

		this.updateSystems = updateSystems;
		this.world = world;
	}
}