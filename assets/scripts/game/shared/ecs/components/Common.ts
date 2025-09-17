import { Node } from "cc";
import { Component } from "db://assets/scripts/import/ecs/extra";

export class PositionComponent extends Component {

	public x!: number;
	public y!: number;
}

export class VelocityComponent extends Component {

	public vx = 0;
	public vy = 0;
}

export class AccelerationComponent extends Component {

	public ax = 0;
	public ay = 0;
}

export class ZigZagOscComponent extends Component {
	public amplitude = 40;     // px
	public frequency = 1.2;    // Hz
	public time = 0;           // seconds accumulator
	public baselineX = 0;      // set on attach from current Position.x
}

export class ActivateComponent extends Component { }

export class CreateComponent extends Component { }

export class DestroyComponent extends Component { }

export class CocosNodeComponent extends Component {

	public node!: Node;
}

export class CountdownTimerComponent extends Component {

	public value!: number;
}