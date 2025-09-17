// –‒‒––––‒–‒‒–‒––‒–‒–––‒‒––‒‒‒–‒‒––––‒
// Коммерческая лицензия подписчика
// (c) 2023 Leopotam <leopotam@yandex.ru>
// –‒‒––––‒–‒‒–‒––‒–‒–––‒‒––‒‒‒–‒‒––––‒

import * as proto from '../proto'

export class PackedEntity {
    id: proto.Entity
    gen: number

    constructor(entity: proto.Entity, world: proto.World) {
        this.id = entity
        this.gen = world.entityGen(entity)
    }

    unpack(world: proto.World): { entity: proto.Entity, valid: boolean } {
        return { entity: this.id, valid: world && world.isAlive() && world.entityGen(this.id) == this.gen }
    }

    equalsTo(e: PackedEntity): boolean {
        return this.id == e.id && this.gen == e.gen
    }
}

export class PackedEntityWithWorld {
    id: proto.Entity
    gen: number
    world: proto.World

    constructor(entity: proto.Entity, world: proto.World) {
        this.id = entity
        this.gen = world.entityGen(entity)
        this.world = world
    }

    unpack(): { entity: proto.Entity, world: proto.World, valid: boolean } {
        const w = this.world
        return { entity: this.id, world: w, valid: w && w.isAlive() && w.entityGen(this.id) == this.gen }
    }

    equalsTo(e: PackedEntityWithWorld): boolean {
        return this.id == e.id && this.gen == e.gen && this.world == e.world
    }
}
