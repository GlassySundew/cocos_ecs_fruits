import { Node, Vec2 } from "cc";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { GameContext } from "db://assets/scripts/game/GameContext";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';
import * as input from 'db://assets/scripts/game/shared/ecs/components/Input';

export class BucketNodeSwipeSystem extends System<GameAspect> {

	private _inputIterator!: proto.It;
	private _bucketNode!: Node;
	private _bgNode!: Node;

	public constructor() {

		super(GameAspect.name);
	}

	public override init(systems: proto.ISystems): void {

		super.init(systems);

		const world = systems.world();
		const services = systems.services();
		const context = services.get(GameContext.name) as GameContext;

		this._inputIterator = this.filterInc([input.InputMoveComponent], world);
		this._bucketNode = context.bucket;
		this._bgNode = context.bg;
	}

	public override run(): void {

		super.run();

		const entity = this.getFirstEntity(this._inputIterator);

		if (entity === null)
			return;

		const moveInputComponent = this.getComponent(entity, input.InputMoveComponent);

		if (!moveInputComponent)
			return;

		const mat = this._bgNode.getWorldMatrix().invert();
		const worldPosition = Vec2.transformMat4(new Vec2(), moveInputComponent?.worldPosition, mat);

		this._bucketNode.setPosition(
			worldPosition.x,
			this._bucketNode.position.y
		);
	}
}