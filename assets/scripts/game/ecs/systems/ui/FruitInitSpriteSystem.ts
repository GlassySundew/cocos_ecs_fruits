import { ImageAsset, Node, resources, Sprite, SpriteFrame, Texture2D } from "cc";
import { BAD_FRUITS_SPRITE_PATHS, FRUIT_SPRITE_SCALE, GOOD_FRUITS_SPRITE_PATHS, SPRITES_BASE_PATH } from "db://assets/scripts/game/Const";
import { FruitEffectComponent } from "db://assets/scripts/game/ecs/components/Fruits";
import { FruitTagComponent } from "db://assets/scripts/game/ecs/components/UnitTags";
import { GameAspect } from "db://assets/scripts/game/GameAspect";
import { GameContext } from "db://assets/scripts/game/GameContext";
import { CocosNodeComponent, CreateComponent } from "db://assets/scripts/game/shared/ecs/components/Common";
import { randomElement } from "db://assets/scripts/game/shared/utils";
import { System } from "db://assets/scripts/import/ecs/extra";
import * as proto from 'db://assets/scripts/import/ecs/proto';

export class FruitInitSpriteSystem extends System<GameAspect> {

	private iterator!: proto.IIt;
	private fruitParent!: Node;

	constructor() {

		super(GameAspect.name);
	}

	override init(systems: proto.ISystems): void {

		super.init(systems);

		this.iterator = this.filterInc([CreateComponent, FruitTagComponent, FruitEffectComponent]);

		const services = systems.services();
		const context = services.get(GameContext.name) as GameContext;

		this.fruitParent = context.fruitParent;
	}

	override run(): void {

		super.run();

		for (this.iterator.begin(); this.iterator.next();) {

			const newFruitEntity = this.iterator.entity();

			this.initFruit(newFruitEntity);
		}
	}

	private initFruit(fruitEntity: proto.Entity) {

		const node = new Node();
		const sprite = node.addComponent(Sprite);

		const fruitEffect = this.getComponent(fruitEntity, FruitEffectComponent);

		const randomSpr =
			SPRITES_BASE_PATH
			+ randomElement(
				fruitEffect?.effect.type == "Good"
					? GOOD_FRUITS_SPRITE_PATHS
					: BAD_FRUITS_SPRITE_PATHS
			);

		this.loadSpriteTexture(sprite, randomSpr);

		node.scale.set(FRUIT_SPRITE_SCALE, FRUIT_SPRITE_SCALE);
		this.fruitParent.addChild(node);

		this.addComponentAndSet(
			fruitEntity,
			{
				component: CocosNodeComponent,
				args: { node: node }
			}
		);
	}

	private loadSpriteTexture(sprite: Sprite, path: string) {

		resources.load(path, ImageAsset, (err, imageAsset) => {

			if (err) {

				console.error(err);
				return;
			}

			const texture = new Texture2D();
			texture.image = imageAsset;
			const spriteFrame = new SpriteFrame();
			spriteFrame.texture = texture;
			sprite.spriteFrame = spriteFrame;
		});

	}
}
