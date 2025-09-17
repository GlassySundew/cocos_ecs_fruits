// –‒‒––––‒–‒‒–‒––‒–‒–––‒‒––‒‒‒–‒‒––––‒
// Коммерческая лицензия подписчика
// (c) 2023 Leopotam <leopotam@yandex.ru>
// –‒‒––––‒–‒‒–‒––‒–‒–––‒‒––‒‒‒–‒‒––––‒

import * as proto from '../proto'
import { DI_META_ASPECT_KEY, DI_META_IT_KEY, DIMetaAspect, DIMetaIt } from './systems'

const DI_META_POOL_KEY: string = '__proto_di_pool__'

class DiMetaPool {
    userType: proto.ICtor
    field!: string
    constructor(f: string, uType: proto.ICtor) {
        this.field = f
        this.userType = uType
    }
}

export function diPool(uType: proto.ICtor) {
    return (target: any, memberName: string) => {
        let list: DiMetaPool[] | undefined = target[DI_META_POOL_KEY]
        if (!list) { list = []; target[DI_META_POOL_KEY] = list }
        list.push(new DiMetaPool(memberName, uType))
    }
}

export class AspectInject implements proto.IAspect {
    private _it?: proto.It
    private _world!: proto.World
    private _aspects!: proto.IAspect[]
    private _poolTypes!: proto.ICtor[]
    private _its!: proto.IIt[]

    init(world: proto.World) {
        this._world = world
        this._world.addAspect(this)
        this._aspects = []
        this._poolTypes = []
        this._its = []
        this.injectAspects(world)
        this.injectPools(world)
        this.injectIts(world)
    }

    postInit() {
        for (const aspect of this._aspects) {
            aspect.postInit()
        }
        for (const it of this._its) {
            it.init(this._world)
        }
        if (this._poolTypes.length > 0) {
            this._it = new proto.It(this._poolTypes)
            this._it.init(this._world)
        }
    }

    iter(): proto.It | undefined {
        return this._it
    }

    world(): proto.World {
        return this._world
    }

    private injectAspects(world: proto.World) {
        const obj: any = this
        const list: DIMetaAspect[] | undefined = obj[DI_META_ASPECT_KEY]
        if (list) {
            for (const item of list) {
                if (world.hasAspect(item.userType.name)) {
                    obj[item.field] = world.aspect(item.userType.name)
                    continue
                }
                let objInst: proto.IAspect = obj[item.field] || new item.userType()
                objInst!.init(world)
                obj[item.field] = objInst
                this._aspects.push(objInst)
            }
        }
    }

    private injectPools(world: proto.World) {
        const obj: any = this
        const list: DiMetaPool[] | undefined = obj[DI_META_POOL_KEY]
        if (list) {
            for (const item of list) {
                let objInst: proto.IPool | undefined
                let userTypeName = item.userType.name
                if (world.hasPool(userTypeName)) {
                    objInst = world.pool(userTypeName)
                } else {
                    objInst = new proto.Pool(item.userType)
                    world.addPool(objInst!)
                }
                obj[item.field] = objInst
                this._poolTypes.push(item.userType)
            }
        }
    }

    private injectIts(world: proto.World) {
        const obj: any = this
        const list: DIMetaIt[] | undefined = obj[DI_META_IT_KEY]
        if (list) {
            for (const item of list) {
                if (proto.isDebug()) {
                    if (!obj[item.field]) { throw new Error(`поле итератора "${item.field}" в системе "${obj.constructor.name}" не инициализировано`) }
                }
                let objInst: proto.IIt = obj[item.field]
                objInst.init(world)
                this._its.push(objInst)
            }
        }
    }
}

export function entityAlives(world: proto.World, result: proto.Slice<number>) {
    result.clear(false)
    const entities = world.entityGens()
    for (let i = 0, iMax = entities.len(); i < iMax; i++) {
        if (entities.get(i) > 0) {
            result.add(i)
        }
    }
}

export function entityComponents(world: proto.World, entity: proto.Entity, result: proto.Slice<any>) {
    result.clear(false)
    if (world.entityGens().get(entity) < 0) { return }
    const pools = world.pools()
    const maskData = world.entityMasks().data()
    const maskLen = world.entityMaskItemLen()
    let maskOffset = entity * maskLen
    for (let i = 0, offset = 0; i < maskData.length; i++, offset += 32, maskOffset++) {
        let v = maskData[maskOffset]
        for (let j = 0; v != 0 && j < 32; j++) {
            const mask = 1 << j
            if ((v & mask) !== 0) {
                v &= ~mask
                result.add(pools.get(offset + j).raw(entity))
            }
        }
    }
}
