import { Node } from "cc";
import { BucketTagComponent } from "db://assets/scripts/game/ecs/components/UnitTags";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { GameContext } from "db://assets/scripts/game/GameContext";
import { PositionComponent } from "db://assets/scripts/game/shared/ecs/components/Common";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';

export class BucketSetPositionSystem extends System<GameAspect> {

	private bucketDomainIterator!: proto.It;
	private bucketNode!: Node;

	public constructor() {

		super(GameAspect.name);
	}

	public override init(systems: proto.ISystems): void {

		super.init(systems);

		const world = systems.world();
		const services = systems.services();
		const context = services.get(GameContext.name) as GameContext;

		this.bucketDomainIterator = this.filterInc([BucketTagComponent], world);
		this.bucketNode = context.bucket;
	}

	public override run(): void {

		super.run();

		const bucketEntity = this.getFirstEntity(this.bucketDomainIterator);

		if (bucketEntity === null)
			return;

		const posComp = this.getComponent(bucketEntity, PositionComponent);

		if (posComp === null)
			return;

		posComp.x = this.bucketNode.position.x;
		posComp.y = this.bucketNode.position.y;
	}
}