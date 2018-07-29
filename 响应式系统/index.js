class Dep {
    // 为目标对象存储相应的订阅者，并提供触发这些订阅者的方法notify
    constructor() {
        this.subscribers = []
    }

    depend() {
        if (target && !this.subscribers.includes(target))
            this.subscribers.push(target)
    }

    notify() {
        this.subscribers.forEach(sub => sub())
    }
}

let data = {
    price: 10,
    quality: 5
}

// 遍历data上所有的可枚举属性，并将这些属性定义为属性描述符
// 在get()时会通过dep.depend()将当前的target加入到dep的订阅者数组中
// 并返回当前的值，在set()时会改变interlnalValue，并notity通知所有的订阅者，
// 更新值。
Object.keys(data).forEach(key => {
    let internalValue = data[key]
    let dep = new Dep()
    Object.defineProperty(data, key, {
        set(newValue) {
            internalValue = newValue;
            dep.notify()
        },
        get() {
            dep.depend()
            return internalValue
        }
    })
})


// watcher()接受一个函数，这个函数会在被调用时，将会调用所依赖的属性的get访问器，并被添加到该属性的订阅者数组中

function watcher(xx) {
    target = xx
    target()
    target = null
}

watcher(() => {
    data.total = data.price * data.quality
    return data.total
})

console.log(data.total) //50
data.price = 100
console.log(data.total) // 500
data.quality = 20
console.log(data.total) // 2000