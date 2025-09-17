import { _decorator, Component, game, Label, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('GameContext')
export class GameContext extends Component {

	@property({ type: Node, visible: true })
	private _bucket!: Node;

	@property({ type: Node, visible: true })
	private _bg!: Node;

	@property({ type: Node, visible: true })
	private _fruitSpawnZone!: Node;

	@property({ type: Node, visible: true })
	private _fruitDestroyZone!: Node;

	@property({ type: Node, visible: true })
	private _fruitParent!: Node;

	@property({ type: Label, visible: true })
	private _pointCounter!: Label;

	@property({ type: Label, visible: true })
	private _healthCounter!: Label;

	@property({ type: Label, visible: true })
	private _gameOverLabel!: Label;

	@property({ type: Label, visible: true })
	private _countdownTimerLabel!: Label;

	public get bucket(): Node {
		return this._bucket;
	}

	public get bg(): Node {
		return this._bg;
	}

	public get fruitSpawnZone(): Node {
		return this._fruitSpawnZone;
	}

	public get fruitDestroyZone(): Node {
		return this._fruitDestroyZone;
	}

	public get fruitParent(): Node {
		return this._fruitParent;
	}

	public get pointCounter(): Label {
		return this._pointCounter;
	}

	public get healthCounter(): Label {
		return this._healthCounter;
	}

	public get gameOverLabel(): Label {
		return this._gameOverLabel;
	}

	public get countdownTimerLabel(): Label {
		return this._countdownTimerLabel;
	}
}