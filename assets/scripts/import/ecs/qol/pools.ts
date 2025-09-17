// –‒‒––––‒–‒‒–‒––‒–‒–––‒‒––‒‒‒–‒‒––––‒
// Коммерческая лицензия подписчика
// (c) 2023 Leopotam <leopotam@yandex.ru>
// –‒‒––––‒–‒‒–‒––‒–‒–––‒‒––‒‒‒–‒‒––––‒

import * as proto from '../proto'

export function poolGetOrAdd<T>(pool: proto.Pool<T>, entity: proto.Entity): { value: T, added: boolean } {
    const added = !pool.has(entity)
    return { value: added ? pool.add(entity) : pool.get(entity), added }
}

export function poolNewEntity<T>(pool: proto.Pool<T>) {
    return pool.add(pool.world().newEntity())
}
