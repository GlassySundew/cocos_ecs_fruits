import * as proto from 'db://assets/scripts/import/ecs/proto';
import { GameAspect } from 'db://assets/scripts/game/GameAspect';
import { Component, ComponentConstructor, System } from 'db://assets/scripts/import/ecs/extra';

export class EntityRecycleSystem extends System<GameAspect> {

	private iterator!: proto.IIt;
	private sourceCtor: ComponentConstructor<Component>;

	public constructor(aspectName: string, ctor: ComponentConstructor<Component>) {

		super(aspectName);

		this.sourceCtor = ctor;
	}

	public override init(systems: proto.ISystems): void {

		super.init(systems);

		const world = systems.world();

		this.iterator = this.filterInc([this.sourceCtor], world);
	}

	public override run(): void {

		super.run();

		for (this.iterator.begin(); this.iterator.next();) {

			const world = this.iterator.world();
			const entity = this.iterator.entity();

			world.delEntity(entity);
		}
	}
}
