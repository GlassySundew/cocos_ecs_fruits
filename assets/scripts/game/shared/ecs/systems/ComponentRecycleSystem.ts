import * as proto from 'db://assets/scripts/import/ecs/proto';
import { GameAspect } from 'db://assets/scripts/game/GameAspect';
import { Component, ComponentConstructor, System } from 'db://assets/scripts/import/ecs/extra';

interface ICompponentRecycleOptions {

	include: ComponentConstructor<Component>;
	exclude?: ComponentConstructor<Component>;
	isDelayed?: boolean;
}

export class ComponentRecycleSystem
	extends System<GameAspect>
	implements proto.IInitSystem, proto.IRunSystem {

	private _iterator!: proto.IIt;
	private readonly _includeCtor!: ComponentConstructor<Component>;
	private readonly _exceptCtor?: ComponentConstructor<Component>;

	public constructor(options: ICompponentRecycleOptions) {

		super(GameAspect.name);

		this._includeCtor = options.include;
		this._exceptCtor = options.exclude;
	}

	public override init(systems: proto.ISystems): void {

		super.init(systems);

		if (this._exceptCtor == null) {

			this._iterator = this.filterInc([this._includeCtor])

		} else {

			let exclusions = [this._exceptCtor];

			this._iterator = this.filterIncExc([this._includeCtor], exclusions);
		}
	}

	public override run(): void {

		super.run();

		for (this._iterator.begin(); this._iterator.next();) {

			const entity = this._iterator.entity();

			this.removeComponent(entity, this._includeCtor);
		}
	}
}
