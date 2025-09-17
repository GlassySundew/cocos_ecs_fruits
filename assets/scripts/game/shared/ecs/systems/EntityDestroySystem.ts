import * as proto from 'db://assets/scripts/import/ecs/proto';
import { GameAspect } from 'db://assets/scripts/game/GameAspect';
import { Component, ComponentConstructor, System } from 'db://assets/scripts/import/ecs/extra';

export class EntityRecycleSystem
	extends System<GameAspect>
	implements proto.IInitSystem, proto.IRunSystem {

	private _iterator!: proto.IIt;
	private _sourceCtor: ComponentConstructor<Component>;

	public constructor(aspectName: string, ctor: ComponentConstructor<Component>) {

		super(aspectName);

		this._sourceCtor = ctor;
	}

	public override init(systems: proto.ISystems): void {

		super.init(systems);

		const world = systems.world();

		this._iterator = this.filterInc([this._sourceCtor], world);
	}

	public override run(): void {

		super.run();

		for (this._iterator.begin(); this._iterator.next();) {

			const world = this._iterator.world();
			const entity = this._iterator.entity();

			world.delEntity(entity);
		}
	}
}
