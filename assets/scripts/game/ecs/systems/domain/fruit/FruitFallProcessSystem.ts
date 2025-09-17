import { game } from "cc";
import { FruitTagComponent } from "db://assets/scripts/game/ecs/components/UnitTags";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { GameContext } from "db://assets/scripts/game/GameContext";
import { AccelerationComponent, PositionComponent, VelocityComponent, ZigZagOscComponent } from "db://assets/scripts/game/shared/ecs/components/Common";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';

export class FruitFallProcessSystem extends System<GameAspect> {

	private iterator!: proto.IIt;

	constructor() {

		super(GameAspect.name);
	}

	override init(systems: proto.ISystems): void {

		super.init(systems);

		this.iterator = this.filterInc([FruitTagComponent, PositionComponent, VelocityComponent]);

		const services = systems.services();
		const context = services.get(GameContext.name) as GameContext;
	}

	override run(): void {

		super.run();

		for (this.iterator.begin(); this.iterator.next();) {

			const fruitEntity = this.iterator.entity();

			this.processFruitFall(fruitEntity);
		}
	}

	private processFruitFall(fruitEntity: proto.Entity) {

		const dt = game.deltaTime;

		const pos = this.getComponent(fruitEntity, PositionComponent)!;
		const vel = this.getComponent(fruitEntity, VelocityComponent)!;

		if (this.hasComponent(fruitEntity, AccelerationComponent)) {

			const acc = this.getComponent(fruitEntity, AccelerationComponent)!;
			vel.vx += acc.ax * dt;
			vel.vy += acc.ay * dt;
		}

		pos.y += vel.vy * dt;

		if (this.hasComponent(fruitEntity, ZigZagOscComponent)) {

			const osc = this.getComponent(fruitEntity, ZigZagOscComponent)!;
			osc.time += dt;
			const offset = Math.sin(osc.time * Math.PI * 2 * osc.frequency) * osc.amplitude;
			pos.x = osc.baselineX + offset;
		} else {
			pos.x += vel.vx * dt;
		}
	}
}