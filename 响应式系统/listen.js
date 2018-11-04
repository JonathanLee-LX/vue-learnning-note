// target 全局指针，用来指向当前调用的函数对象
var target,
// state 全局数据对象，所有响应式的数据都应该定义在state上面
    state = {}
    computed = {};

/**
 *判断参数val的类型是否为除null以外的对象数据类型
 * @param {*} val
 * @returns Boolean
 */
function isObject(val) {
    var type = typeof val;
    if((type === 'object' && val !== null  ) || type === 'function' ){
        return true;
    }
    return false;
}

/**
 *将数据对象data中的所有可枚举对象转换为Getter和Setter形式
 * @param {Object} data
 * @param {String} key
 * @param {*} val
 */
function (data, key, val){
    let deps = [];
    function isExist(target){
        return deps.some(function (item){
            return item === target
        })
    }
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function(){
            if (typeof target === 'function' && !isExist(target)){
                deps.push(target);
            } 
            return val;
        },
        set: function(newValue){
            if(newValue !== val){
                val = newValue;
                // notify更新依赖中的数据
                for (var i = 0; i < deps.length; i++) {
                    deps[i]();
                }
            }
            // console.log(`has set ${key}'s value as ${newValue}`)
        }
    })
}

/**
 *将数据对象的所有可枚举的属性遍历出来，
 *并调用函数使这些属性
 *变为Setter和Getter形式，检查该值是否
 *是对象数据类型，如果是就继续递归转化这个
 *对象。
 * @param {Object} data
 */
function transformReactive(data){
    var keys = Object.keys(data);

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i],
            val = data[key];
        defineReactive(data, key, val)
        if(isObject(val)){
            transformReactive(val)
        }
    }
}

/**
 *将一个函数变成响应式
 * @param {Function} exp
 */
function makeResponsive(exp) {
    var type = typeof exp;
    if(type === 'function'){
        target = exp;
        exp();
    }else if(type === 'string'){
        var expFunc = function () {
            return eval(exp);
        }
        target = expFunc
        var result = expFunc();
        // 如果result===exp就说明这个字符串表达式exp不是一个合法的字符串表达式
        if(result === exp){
            console.error(`${exp} is not a valid expression`);
            return;
        }
    }else{
        console.error(`${exp} is not a function or a valid expression`);
    }
    target = undefined
}

var exp_str = "console.log(state.p.name + state.p.age)";
var exp = function () {
    console.log(`${state.p.name} is ${state.p.age} years old ${state.p.sex}, his interest in ${state.p.interest.learn}
    in addition, he like eat ${state.p.interest.eat}，his favorite movies is ${state.p.movies}
    `)
};

state.p = {
    name: 'lixiang',
    age: 22,
    sex: 'man',
    interest: {
        learn: 'programming',
        eat: 'hot pot'
    },
    movies: ['肖申克的救赎', '不能说的秘密'],
}

var xx = function () {
    return state.p.age + state.p.name
}

computed = {
    result: (function () {
        var self = this
        return function () {
            debugger
            self = xx()
        }
    }).apply(computed.result)
}

transformReactive(state);

// makeResponsive(exp);
// makeResponsive(exp_str)

makeResponsive(computed.result);
