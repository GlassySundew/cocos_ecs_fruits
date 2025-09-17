// –‒‒––––‒–‒‒–‒––‒–‒–––‒‒––‒‒‒–‒‒––––‒
// Коммерческая лицензия подписчика
// (c) 2023 Leopotam <leopotam@yandex.ru>
// –‒‒––––‒–‒‒–‒––‒–‒–––‒‒––‒‒‒–‒‒––––‒

import * as proto from '../proto'

export function itLen(it: proto.IIt): number {
    let count = 0
    for (it.begin(); it.next();) {
        count++
    }
    return count
}

export function itOf(it: proto.IIt) {
    it.begin()
    const iter = {
        next() {
            const isValid = it.next()
            return { value: it.entity(), done: !isValid }
        },
        [Symbol.iterator]() { return iter }
    }
    return iter
}
