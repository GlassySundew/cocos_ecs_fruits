// –‒‒––––‒–‒‒–‒––‒–‒–––‒‒––‒‒‒–‒‒––––‒
// Коммерческая лицензия подписчика
// (c) 2023 Leopotam <leopotam@yandex.ru>
// –‒‒––––‒–‒‒–‒––‒–‒–––‒‒––‒‒‒–‒‒––––‒

import * as proto from '../proto'

export const DI_META_ASPECT_KEY: string = '__proto_di_aspect__'
export const DI_META_IT_KEY: string = '__proto_di_it__'
const DI_META_SRV_KEY: string = '__proto_di_srv__'

export class DIMetaAspect {
    world?: string
    userType: proto.ICtor
    field!: string
    constructor(f: string, uType: proto.ICtor, world?: string) {
        this.field = f
        this.userType = uType
        this.world = world
    }
}

export class DIMetaIt {
    world?: string
    field!: string
    constructor(f: string, world?: string) {
        this.field = f
        this.world = world
    }
}

class DIMetaSrv {
    userType: string
    field!: string
    constructor(f: string, uType: string) {
        this.field = f
        this.userType = uType
    }
}

export function diAspect(uType: proto.ICtor, worldName?: string) {
    return (target: any, memberName: string) => {
        let list: DIMetaAspect[] | undefined = target[DI_META_ASPECT_KEY]
        if (!list) { list = []; target[DI_META_ASPECT_KEY] = list }
        list.push(new DIMetaAspect(memberName, uType, worldName))
    }
}

export function diIt(worldName?: string) {
    return (target: any, memberName: string) => {
        let list: DIMetaIt[] | undefined = target[DI_META_IT_KEY]
        if (!list) { list = []; target[DI_META_IT_KEY] = list }
        list.push(new DIMetaIt(memberName, worldName))
    }
}

export function diService(uType: proto.ICtor) {
    return (target: any, memberName: string) => {
        let list: DIMetaSrv[] | undefined = target[DI_META_SRV_KEY]
        if (!list) { list = []; target[DI_META_SRV_KEY] = list }
        list.push(new DIMetaSrv(memberName, uType.name))
    }
}

class AutoInjectSystem implements proto.IPreInitSystem {
    preInit(systems: proto.ISystems): void {
        const allSystems = systems.systems()
        for (let i = 0, iMax = allSystems.len(); i < iMax; i++) {
            const s = allSystems.get(i)
            injectAspects(s, systems)
            injectIts(s, systems)
            injectServices(s, systems)
        }
    }
}

export class AutoInjectModule implements proto.IModule {
    init(systems: proto.ISystems): void {
        systems.addSystem(new AutoInjectSystem())
    }

    aspects(): proto.IAspect[] {
        return []
    }

    modules(): proto.IModule[] {
        return []
    }
}

function injectAspects(obj: any, systems: proto.ISystems) {
    const list: DIMetaAspect[] | undefined = obj[DI_META_ASPECT_KEY]
    if (list) {
        for (const item of list) {
            const world = systems.world(item.world)
            const objInst = world.aspect(item.userType.name)
            if (proto.isDebug()) {
                if (!objInst) { throw new Error(`аспект для поля "${item.field}" в системе "${obj.constructor.name}" не найден`) }
            }
            obj[item.field] = objInst
        }
    }
}

function injectIts(obj: any, systems: proto.ISystems) {
    const list: DIMetaIt[] | undefined = obj[DI_META_IT_KEY]
    if (list) {
        for (const item of list) {
            const world = systems.world(item.world)
            if (proto.isDebug()) {
                if (!obj[item.field]) { throw new Error(`поле итератора "${item.field}" в системе "${obj.constructor.name}" не инициализировано`) }
            }
            (<proto.IIt>obj[item.field]).init(world)
        }
    }
}

function injectServices(obj: any, systems: proto.ISystems) {
    const list: DIMetaSrv[] | undefined = obj[DI_META_SRV_KEY]
    if (list) {
        const services = systems.services()
        for (const item of list) {
            const objInst = services.get(item.userType)
            if (proto.isDebug()) {
                if (!objInst) { throw new Error(`сервис для поля "${item.field}" в системе "${obj.constructor.name}" не найден`) }
            }
            obj[item.field] = objInst
        }
    }
}

export class DelHere implements proto.IInitSystem, proto.IRunSystem {
    private _cType: proto.ICtor
    private _worldName?: string
    private _it!: proto.It
    private _pool!: proto.IPool

    constructor(cType: proto.ICtor, worldName?: string) {
        this._cType = cType
        this._worldName = worldName
    }

    init(systems: proto.ISystems) {
        const world = systems.world(this._worldName)
        this._pool = world.pool(this._cType.name)
        this._it = new proto.It([this._cType])
        this._it.init(world)
    }

    run() {
        for (this._it.begin(); this._it.next();) {
            this._pool.del(this._it.entity())
        }
    }
}

class ComposedAspect implements proto.IAspect {
    private _modules: proto.IModule[]
    private _aspects: proto.IAspect[]

    constructor(modules: proto.IModule[], aspects: proto.IAspect[]) {
        this._modules = modules
        this._aspects = aspects
    }

    init(world: proto.World) {
        for (const mod of this._modules) {
            const aspects = mod.aspects()
            if (aspects) {
                for (const aspect of aspects) {
                    this._aspects.push(aspect)
                }
            }
        }
        for (const aspect of this._aspects) {
            aspect.init(world)
        }
    }

    postInit() {
        for (const aspect of this._aspects) {
            aspect.postInit()
        }
    }
}

class ComposedModule implements proto.IModule {
    private _modules: proto.IModule[]

    constructor(modules: proto.IModule[]) {
        this._modules = modules
    }

    init(systems: proto.ISystems) {
        for (const mod of this._modules) {
            systems.addModule(mod)
        }
    }

    aspects(): proto.IAspect[] {
        return []
    }

    modules(): proto.IModule[] {
        return []
    }
}

export class Modules {
    private _modules: proto.IModule[]
    private _aspects: proto.IAspect[]

    constructor(...modules: proto.IModule[]) {
        this._aspects = []
        this._modules = []
        if (modules) {
            for (const mod of modules) {
                this.addModule(mod)
            }
        }
    }

    addModule(module: proto.IModule): Modules {
        if (proto.isDebug()) {
            if (!module) { throw new Error('экземпляр модуля должен существовать') }
        }
        this._modules.push(module)
        for (const subMod of module.modules()) {
            this.addModule(subMod)
        }
        return this
    }

    addAspect(aspect: proto.IAspect): Modules {
        this._aspects.push(aspect)
        return this
    }

    buildAspect(): proto.IAspect {
        return new ComposedAspect(this._modules, this._aspects)
    }

    buildModule(): proto.IModule {
        return new ComposedModule(this._modules)
    }

    init(systems: proto.ISystems) {
        systems.addModule(this.buildModule())
    }

    modules(): proto.IModule[] {
        return this._modules
    }
}
