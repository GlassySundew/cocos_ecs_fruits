import * as proto from 'db://assets/scripts/import/ecs/proto';
import { Queue } from 'db://assets/scripts/import/typescript-collections';

export type ComponentConstructor<T extends Component> = {

	new(...args: any[]): T;
	typeId: number;
	getTypeIdStr(): string;
};

export type ComponentInitializator<T extends Component> = {

	component: ComponentConstructor<T>;
	args?: Partial<T>;
};

export class Component {

	public static readonly typeId: number = -1;
	public static getTypeIdStr(): string { return this.name + this.typeId.toString(); }
}

export abstract class Aspect implements proto.IAspect {

	private _componentPools!: Array<proto.Pool<Component>>;
	private _world!: proto.World;

	public get world(): proto.World { return this._world; }

	public init(world: proto.World): void {

		this._world = world;
		this._world.addAspect(this);
		this._componentPools = new Array<proto.Pool<Component>>();
		this.registerComponents();
	}

	public postInit(): void {
	}

	public getPool<T extends Component>(ctor: ComponentConstructor<T>): proto.Pool<T> | null {

		let pool: proto.Pool<T> | null = null;

		if (this._componentPools !== null && ctor.typeId < this._componentPools.length)
			pool = this._componentPools[ctor.typeId] as unknown as proto.Pool<T>;

		return pool;
	}

	protected registerComponent<T extends Component>(ctor: ComponentConstructor<T>): void {

		ctor.typeId = this._componentPools.length;

		console.log("registering a component of type " + ctor.name + " and id = " + ctor.typeId + ", pools count = " + this._componentPools.length, ctor);

		const pool: proto.Pool<Component> = new proto.Pool(ctor);

		this._componentPools.push(pool);
		this._world.addPool(pool);
	}

	protected abstract registerComponents(): void;
}

export class System<TAspect extends Aspect> implements proto.IInitSystem, proto.IRunSystem {

	private _callQueue: Queue<() => void>;
	private _aspectName: string;

	protected aspect!: TAspect;

	public constructor(aspectName: string) {

		this._aspectName = aspectName;
		this._callQueue = new Queue<() => void>();
	}

	public init(systems: proto.ISystems): void {

		const world = systems.world();

		this.aspect = world.aspect(this._aspectName) as TAspect;
	}

	public run(): void {

		this.processCallQueue();
	}

	protected filterInc(iTypes: proto.ICtor[], world?: proto.World): proto.It {

		const iterator = new proto.It(iTypes);

		iterator.init(world === undefined ? this.aspect.world : world);

		return iterator;
	}

	protected filterIncExc(iTypes: proto.ICtor[], eTypes: proto.ICtor[], world?: proto.World): proto.ItExc {

		const iterator = new proto.ItExc(iTypes, eTypes);

		iterator.init(world === undefined ? this.aspect.world : world);

		return iterator;
	}

	protected createEntity<T extends Component[]>(
		...initializators: { [K in keyof T]: ComponentInitializator<T[K]> }
	): proto.Entity {

		const entity = this.aspect.world.newEntity();

		if (initializators.length > 0) {
			this.addComponentsAndSet(entity, ...initializators);
		}

		return entity;
	}

	protected removeEntity(entity: proto.Entity): void {

		this.aspect.world.delEntity(entity);
	}

	protected getComponent<T extends Component>(
		entity: proto.Entity,
		ctor: ComponentConstructor<T>
	): T | null {

		const pool = this.aspect.getPool<T>(ctor);

		if (pool === null)
			return null;

		return pool.get(entity);

	}

	protected hasComponent<T extends Component>(
		entity: proto.Entity,
		ctor: ComponentConstructor<T>
	): boolean {

		const pool = this.aspect.getPool<T>(ctor);

		if (pool === null)
			return false;

		return pool.has(entity);

	}

	protected addComponentAndSet<T extends Component>(
		entity: proto.Entity,
		initializator: ComponentInitializator<T>
	): T {

		const pool = this.aspect.getPool<T>(initializator.component);

		if (pool === null)
			throw new Error("Component '" + initializator.component.toString() + "' is not registered!");

		const component = pool.add(entity);

		if (initializator.args != null)
			Object.assign(component, initializator.args);

		return component;
	}

	protected addComponent<T extends Component>(
		entity: proto.Entity,
		ctor: ComponentConstructor<T>
	): T | null {

		const pool = this.aspect.getPool<T>(ctor);

		if (pool === null)
			return null;

		return pool.add(entity);
	}

	protected addComponentsAndSet<T extends Component[]>(
		entity: proto.Entity,
		...initializators: { [K in keyof T]: ComponentInitializator<T[K]> }
	): proto.Entity {

		for (const initializator of initializators) {
			const pool = this.aspect.getPool(initializator.component);

			if (pool === null)
				throw new Error("Component '" + initializator.component.toString() + "' is not registered!");

			const component = pool.add(entity);

			if (initializator.args != null)
				Object.assign(component, initializator.args);
		}

		return entity;
	}

	protected addComponents(
		entity: proto.Entity,
		...constructors: ComponentConstructor<Component>[]
	): proto.Entity {

		for (const ctor of constructors) {

			const pool = this.aspect.getPool(ctor);

			if (pool === null)
				throw new Error("Component '" + ctor.toString() + "' is not registered!");

			pool.add(entity);
		}

		return entity;
	}

	protected removeComponent<T extends Component>(
		entity: proto.Entity,
		ctor: ComponentConstructor<T>
	): void {

		const pool = this.aspect.getPool<T>(ctor);

		if (pool === null)
			return;

		pool.del(entity);
	}

	protected getFirstEntity(iterator: proto.IIt): proto.Entity | null {

		let entity: proto.Entity | null = null;

		iterator.begin();

		if (iterator.next()) {

			entity = iterator.entity();
			iterator.end();
		}

		return entity;
	}

	protected hasEntities(iterator: proto.IIt): boolean {

		iterator.begin();

		if (!iterator.next())
			return false;

		iterator.end();

		return true;
	}

	protected callOnRun(call: () => void): void {

		this._callQueue.enqueue(call);
	}

	private processCallQueue(): void {

		while (this._callQueue.size() > 0) {

			const action = this._callQueue.dequeue();
			action?.call(this);
		}
	}
}