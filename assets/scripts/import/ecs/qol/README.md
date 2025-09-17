<p align="center">
    <img src="./logo.png" alt="Proto">
</p>

# LeoECS Proto QoL
Набор расширений для `LeoECS Proto`, призванных улучшить "качество жизни" (Quality of Life) разработчика.

> **ВАЖНО!** Не забывайте включать `DEBUG`-режим - по умолчанию используется `RELEASE`-режим без дополнительных проверок:
> ```ts
> import * as proto from './leopotam.ecsproto'
> proto.setDebug()
> ```

> **ВАЖНО!** Требует TypeScript >=4.1.0 с опцией `experimentalDecorators: true`.


# Социальные ресурсы
[Официальный блог](https://leopotam.com)


# Установка


## В виде исходников
Поддерживается установка в виде исходников из архива, который надо распаковать в проект.


## Прочие источники
Официальные версии выпускаются для активных подписчиков в виде ссылок на актуальные версии.


# Итераторы


## Поддержка for-of-циклов
Итераторы получили возможность использования в for-of-циклах:
```ts
const it1 = new proto.It([C1]).init(world)
const it2 = new proto.ItExc([C1], [C2]).init(world)
 
for (const entity of qol.itOf(it1)) {
    const c1 = aspect1.c1Pool.get(entity)
}
foreach (const entity of qol.itOf(it2)) {
    const c1 = aspect1.c1Pool.get(entity)
}
```
> **ВАЖНО!** Вызов `it.end()` при досрочном прерывании цикла **обязателен**, это отличие от C#-версии.


## Подсчет сущностей в итераторе
> **ВАЖНО!** Не рекомендуется к использованию если сущностей может быть больше
> пары десятков - подсчет ведется полным перебором.

```ts
const it = new proto.It([C1]).init(world)

const entitiesCount: number = qol.itLen(it)
```


# Сущности


## Упаковка сущностей
Сущности отдаются в пользовательский код в виде `number`-идентификаторов и валидны только в пределах
текущего метода - **нельзя** хранить ссылки на сущности если нет уверенности, что они не могут быть
уничтожены где-то в коде.
Если требуется сохранять сущности, то их следует упаковать:
```ts
import * as qol from './leopotam.ecsproto/qol'
// Создаем новую сущность в мире.
const entity = world.wewEntity()
// Упаковываем ее для долгосрочного хранения за пределами текущего метода.
const packed = new qol.PackedEntity(entity, world)
// Когда придет время - мы можем распаковать ее с одновременной проверкой на ее существование.
// Поддерживается как работа через объект, так и через деконструкцию.
const unpacked = packed.unpack(world)
if (unpacked.valid) {
    // Если условие истинно - сущность валидна, можем с ней работать. 
    world.delEntity(unpacked.entity)
}
```
Если используется несколько миров и важно сохранять привязку к ним, то можно упаковывать другим способом:
```ts
import * as qol from './leopotam.ecsproto/qol'
// Создаем новую сущность в мире.
const entity = world.wewEntity()
// Упаковываем ее для долгосрочного хранения за пределами текущего метода.
const packed = new qol.PackedEntityWithWorld(entity, world)
// Когда придет время - мы можем распаковать ее с одновременной проверкой на ее существование.
// Поддерживается как работа через объект, так и через деконструкцию.
const unpacked = packed.unpack(world)
if (unpacked.valid) {
    // Если условие истинно - сущность валидна, можем с ней работать. 
    unpacked.world.delEntity(unpacked.entity)
}
```
Для сравнения двух упакованных сущностей следует применять метод `equalsTo`:
```ts
const packedA = new qol.PackedEntity(entity, world)
const packedB = new qol.PackedEntity(entity, world)
if (packedA.equalsTo(packedB)) {
    // Упакованные сущности идентичны.
}
```
То же самое касается и упаковки сущности с миром:
```ts
const packedA = new qol.PackedEntityWithWorld(entity, world)
const packedB = new qol.PackedEntityWithWorld(entity, world)
if (packedA.equalsTo(packedB)) {
    // Упакованные сущности идентичны.
}
```

# Миры


## Инъекции полей в аспекте
Для сокращения количества кода инициализации аспекта мира можно использовать наследование от специального типа и атрибуты:
```ts
import * as proto from './leopotam.ecsproto/proto'
import * as qol from './leopotam.ecsproto/qol'
class Aspect1 extends qol.AspectInject {
    @qol.diAspect(Aspect2) aspect2!: Aspect2
    @qol.diPool(C1) c1Pool!: ProtoPool<C1>
    @qol.diPool(C2) c2Pool!: ProtoPool<C2>
}
```
Это идентично следующему коду:
```ts
class Aspect1 implements IProtoAspect {
    aspect2!: Aspect2
    c1Pool!: ProtoPool<C1>
    c2Pool!: ProtoPool<C2>

    init(world: proto.World) {
        world.addAspect(this)
        this.aspect2 = new Aspect2()
        this.aspect2.init(world)
        if (!world.hasPool(C1.name)) {
            this.c1Pool = new proto.Pool(C1)
            world.addPool(this.c1Pool)
        } else {
            this.c1Pool = world.pool(C1.name)
        }
        if (!world.hasPool(C2.name)) {
            this.c2Pool = new proto.Pool(C2)
            world.addPool(this.c2Pool)
        } else {
            this.c2Pool = world.pool(C2.name)
        }
    }
}
```
Поддерживается автоинициализация полей, реализующих `IAspect` и `IPool` и размеченных соответствующими атрибутами.
Поля могут быть проинициализированы экземплярами данных до начала инъекции - в этом случае они будут
использоваться для дальнейшей настройки, это один из способов вызова кастомных конструкторов.

> **ВАЖНО!** Инъекция требует одновременно и наследования от специального класса и разметки атрибутами. Тип атрибута должен совпадать с типом поля (пул, аспект).

Для **всех** пулов аспекта автоматически создается итератор, доступный через метод `AspectInject.iter()`:
```ts
class Aspect1 extends qol.AspectInject {
    @qol.diPool(C1) c1Pool!: ProtoPool<C1>
    @qol.diPool(C2) c2Pool!: ProtoPool<C2>
}

const world = new proto.World(new Aspect1())
const aspect: Aspect1 = world.aspect(Aspect1.name) as Aspect1
for (const entity of qol.itOf(aspect.iter())) {
    // Можем работать с данными из аспекта.
}
```
> **ВАЖНО!** Итератор не учитывает пулы вложенных аспектов.

> **ВАЖНО!** Использовать этот итератор следует только в том случае, если в аспект не планируется добавлять
> новые пулы, иначе это может поломать логику использования итератора (он всегда строится по **всем** пулам аспекта).
> Если требуется итератор не по всем пулам - следует его создавать отдельно. 

Для получения ссылки на мир аспекта можно воспользоваться специальным методом:
```ts
const world = new proto.World(new Aspect1())
var aspect: Aspect1 = world.aspect(Aspect1.name) as Aspect1
const aspectWorld = aspect.world()
// aspectWorld и world содержат ссылку на один и тот же экземпляр.
```


## Список активных сущностей
```ts
const items = new proto.Slice<number>()
qol.entityAlives(world, items)
for (int i = 0; i < items.Len (); i++) {
    const entity = items.get (i)
}
```


## Список компонентов на сущности
```ts
const items = new proto.Slice<any>()
qol.entityComponents(world, entity, items)
for (let i = 0; i < items.len(); i++) {
    const c = items.get(i)
}
```


# Системы


## Инъекции полей в системы
Для инъекции в поля систем их достаточно пометить специальным атрибутом, специфичным для типа поля:
```ts
class TestSystem : IProtoInitSystem {
    // Поле будет проинициализировано экземпляром аспекта с типом Aspect1.
    @qol.diAspect(Aspect1) private _aspectDef!: Aspect1
    // Поле будет проинициализировано экземпляром аспекта с типом Aspect1 из мира "events".
    @qol.diAspect(Aspect1, 'events') private _aspectEvt!: Aspect1
    // Поле будет проинициализировано экземпляром итератора
    // для компонентов из мира по умолчанию.
    @qol.diIt() private _itDef = new proto.It([C1])
    // Поле будет проинициализировано экземпляром итератора
    // для компонентов из мира "events".
    @qol.diIt('events') private _itEvt = new proto.It([C1])
    // Поле будет проинициализировано экземпляром сервиса с типом Service.
    @qol.diService(Service1) private _svc!:S ervice1

    init(systems: proto.ISystems) {
        // Все поля проинициализированы, можно работать с ними.
    }
}
```

> **ВАЖНО!** Инъекция итератора подразумевает, что его экземпляр уже создан через инициализатор поля.

Для корректной работы инъекции в поля систем необходимо подключить специальный модуль:
```ts
const world1 = new proto.World(new Aspect1())
const world2 = new proto.World(new Aspect2())
const systems = new proto.Systems(world1)
systems
    .addModule(new AutoInjectModule ())
    .addWorld(world2, 'events')
    .addSystem(new TestSystem())
    .addService(new Service1())
    .init()
```

> **ВАЖНО!** Модуль инъекций должно идти первым, до регистрации остальных модулей и систем.
> Подключать модуль нужно только один раз для каждой `ISystems`-группы систем.


## Удаление всех компонентов нужного типа
Можно автоматизировать удаление компонентов определенного типа в нужном месте через подключение системы `qol.DelHere`:
```ts
const world1 = new proto.World(new Aspect1())
const systems = new proto.Systems(world1)
systems
    .addSystem(new TestSystem())
    // Все компоненты c типом C1 будут удалены тут
    // со всех активных сущностей.
    .addSystem(new qol.DelHere(C1))
    .addSystem(new TestSystem2())
    .init()
```


# Пулы


## Запрос или добавление
Для того, чтобы запросить существующий компонент или добавить новый в случае его отсутствия, можно воспользоваться следующим методом:
```ts
const req = qol.poolGetOrAdd(aspect1.c1Pool)
// req.value: C1 - ссылка на экземпляр компонента C1.
// req.added: boolean - признак того, что компонент был добавлен, либо возвратился существующий.
```


## Создание сущности с компонентом
Для быстрого создания новой сущности с одним компонентом (например, событие) можно воспользоваться следующим методом:
```ts
const c1: C1 = qol.poolNewEntity(aspect1.c1Pool)
```


# Модули

## Инициализация
По умолчанию аспекты модуля регистрируются в мире отдельно. Для упрощения одновременной регистрации аспектов, систем и сервисов модуля можно использовать специальный класс:
```cs
// Все модули можно передать в конструктор класса.
const modules = new qol.Modules (
    new Module1(),
    new Module2(),
    new Module3())
// Или через отдельный метод.
modules.addModule(new Module4())
// Также возможно подключать отдельные аспекты вне модулей.
modules.addAspect(new Aspect1())
// В конструктор мира передаем композитный аспект, в который автоматически
// включены аспекты всех подключенных модулей.
const world = new proto.World(modules.buildAspect())
const systems = new ProtoSystems(world)
systems
    // Выполняем подключение композитный модуля, который автоматически
    // выполнит регистрацию всех подключенных в него модулей.
    .addModule(modules.buildModule())
    .init()
```
> **ВАЖНО!** Если используется `Modules` - регистрация отдельных модулей
> через `ISystems.addModule()` не рекомендуется, все модули должны проходить через `Modules` единообразно.


# Лицензия
Расширение выпускается под коммерческой лицензией, [подробности тут](./LICENSE.md).
