> **文章来源：小青年原创**
> **发布时间：2017-3-6**
> **关键词：angular，vue，模块化，$scope，依赖注入，service**
> **转载需标注本文原始地址: <http://zhaomenghuan.github.io/#!/blog/20170306>**

## 前言

近来换工作了，由于团队技术需要，不得不从vue.js迁移到angular.js，不过这也是一个学习angular的机会，顺便也将这两个框架做一些对比，为了方便其他小伙伴，将学习过程中的内容记录下来。由开始的不太习惯到现在也能够习惯angular的写法，着实在思维上有很大的改变，所以这个系列的文章会记录一下自己的学习过程，本文会由浅及深一步步去解读vue.js和angular.js的区别。由于时间关系，这篇文章断断续续耗时几周，不求什么，只希望在这个过程中将angular相关的一些特性去梳理一下，由于是系列开篇，文章并没有深入探讨源码和原理，后续会写更多个人的思考和探索。

## vuejs  vs  angular之初相见

对于vue.js我们都需要通过创建一个Vue实例指定作用范围，对于angular只需要ng-app指令就可以。

vue.js的姿势：
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
<div id="app">
    {{ message }}
    <button v-on:click="changeView">changeView</button>
</div>
<script src="//cdn.bootcss.com/vue/2.1.10/vue.js"></script>
<script type="text/javascript">
    var app = new Vue({
        el: '#app',
        data: {
            message: 'Hello world!'
        },
        methods: {
            changeView: function(){
                this.message = 'hello vuejs!';
                // 或 app.$data.message = 'hello vuejs!'
            }
        }
    })
</script>
</body>
</html>
```
angular的姿势：
```
<!DOCTYPE html>
<html ng-app="app">
<head>
    <meta charset="utf-8">
</head>
<body>
    <div ng-controller="helloCtrl">
        {{message}}
        <button ng-click="changeView()">changeView</button>
    </div>
    <script src="//cdn.bootcss.com/angular.js/1.6.0/angular.js"></script>
    <script type="application/javascript">
        var app = angular.module('app', []);
        app.controller('helloCtrl', function ($scope) {
            $scope.message = 'hello world';
            $scope.changeView = function () {
                $scope.message = 'hello angular.js!';
            }
        })
    </script>
</body>
</html>
```
这个例子虽然再简单不过，对于项目开发没有半点用处，但是对于理解vue.js和angular.js的区别有一定的借鉴意义，vue.js中总体的思路是实例化Vue对象，我们通过el属性指定控制的dom范围，data是数据模型，可以通过实例化后的对象app.$data访问数据，在方法中或者[生命周期钩子](http://cn.vuejs.org/v2/guide/instance.html#生命周期图示)如mounted中可以使用this获取实例上下文，vuejs中没有控制器的概念，属于典型的MVVM架构。然而我们这篇文章不是讲vue.js，因为如果你使用vue.js，那么直接看文档很好理解，无需我多言，这里我们想重点说说angular。

经常听人说vue.js语法优雅，我想应该是由于vue.js结构更加清晰吧，数据模型和操作分得更清晰，就从命名出发更简单吧，$scope是什么鬼。好吧，查了一下：scope（范围），我们姑且先从字面含义这么理解吧，但是从这例子中发现$scope多次使用，另外不能被改名，不然不能用，我们姑且认为是个神奇的玩意。angular中ng-click的指令和vue.js无大的区别，这里不多言，这里重点想谈谈模块化和angular的依赖注入。

## vuejs vs angular之数据模型共享

在vue.js中是通过组件树实现模块化的，而angular通过作用域$scope实现模块化。对于vue.js中模块化的最佳实践是：

** .vue单文件组件 + 模块化标准（common.js或者es6 module) + webpack(或Browserify）。**

而其中核心部分就是组件，用官方的话说就是，组件（Component）是 Vue.js 最强大的功能之一，组件可以扩展 HTML 元素，封装可重用的代码，在较高层面上，组件是自定义元素， Vue.js 的编译器为它添加特殊功能，在有些情况下，组件也可以是原生 HTML 元素的形式，以 is 特性扩展。

如何构建一个组件，组件之前数据如何共享，这是开发中必须要学习的内容。vue.js组件实例的作用域是孤立的，这意味着不能并且不应该在子组件的模板内直接引用父组件的数据，可以使用 props 把数据传给子组件。另外vue.js中提倡单向数据流：当父组件的属性变化时，将传导给子组件，但是不会反过来。这是为了防止子组件无意修改了父组件的状态——这会让应用的数据流难以理解。当子组件需要更新父组件的状态时，我们可以通过事件触发。下面是一个利用props传递数据和使用事件触发父组件状态的典型例子：
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
	<div id="app">
	    {{ message }}
	    <button v-on:click="parentAtion">parentAtion</button>
	    <child v-bind:param="message"  v-on:childfn="fromChild"></child>
	</div>
	
	<script type="text/x-template" id="child-tpl">
		<div>
			<span>{{param}}</span>
			<button v-on:click="childAtion">childAtion</button>
		</div>
	</script>
	
	<script src="//cdn.bootcss.com/vue/2.1.10/vue.js"></script>
	<script type="text/javascript">
		Vue.component('child', {
			template: '#child-tpl',
		  	props: ['param'],
		  	methods: {
		  		childAtion: function(){
		  			// 触发事件
		  			this.$emit('childfn', 'child component');
		  		}
		  	}
		});
		
	    var app = new Vue({
	        el: '#app',
	        data: {
	            message: 'Hello vuejs!'
	        },
	        methods: {
	            parentAtion: function(){
	            	this.message = 'parent component';
	            },
	            fromChild: function(msg){
	            	this.message = msg;
	            }
	        }
	    })
	</script>
</body>
</html>
```

每个 Vue 实例都实现了[事件接口(Events interface)](https://cn.vuejs.org/v2/api/#Instance-Methods-Events)，即：
- 使用 $on(eventName) 监听事件
- 使用 $emit(eventName) 触发事件
> Vue的事件系统分离自浏览器的[EventTarget API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)。尽管它们的运行类似，但是$on和 $emit **不是**addEventListener和 dispatchEvent的别名。

父组件可以在使用子组件的地方直接用 v-on 来监听子组件触发的事件。对于非父子组件通信的通信，在简单的场景下，使用一个空的 Vue 实例作为中央事件总线：
```
var bus = new Vue()
// 触发组件 A 中的事件
bus.$emit('id-selected', 1)
// 在组件 B 创建的钩子中监听事件
bus.$on('id-selected', function (id) {
  // ...
})
```
在更多复杂的情况下，你应该考虑使用专门的[状态管理](https://cn.vuejs.org/v2/guide/state-management.html#类-Flux-状态管理的官方实现)。

对于angular 而言，ng-controller指令指定了作用范围，通过$scope对象控制作用域，$scope层层嵌套形成父子关系或者兄弟并列关系，而父子作用域是通过原型继承实现，子作用域可以访问父作用域的数据模型，反过来不行，同理如果父级作用域中的状态改变会影响子作用域，反过来子作用域中的状态改变不会影响父级作用域。

```
<!DOCTYPE html>
<html ng-app="app">
<head>
    <meta charset="utf-8">
</head>
<body>
    <div ng-controller="parentCtrl">
        {{message}}
        <button ng-click="parentAtion()">parentAtion</button>
        <div ng-controller="childCtrl">
        	{{message}}
        	<button ng-click="childAtion()">childAtion</button>
        </div>
    </div>
    <script src="js/angular.min.js"></script>
    <script type="application/javascript">
        var app = angular.module('app', []);
        app.controller('parentCtrl', function ($scope) {
            $scope.message = 'hello angular';
            $scope.parentAtion = function () {
                $scope.message = 'parent scope';
            }
        })
        
        app.controller('childCtrl', function ($scope) {
            $scope.childAtion = function () {
                $scope.message = 'child scope';
            }
        })
    </script>
</body>
</html>
```
由于原型继承的关系，修改父级对象中的message会同时修改子对象中的值，但反之则不行。如果我们想在子级控制器中改变父对象中的值，则需要通过引用进行共享。
```
<!DOCTYPE html>
<html ng-app="app">
<head>
    <meta charset="utf-8">
</head>
<body>
    <div ng-controller="parentCtrl">
        {{dataModal.message}}
        <button ng-click="parentAtion()">parentAtion</button>
        <div ng-controller="childCtrl">
        	{{dataModal.message}}
        	<button ng-click="childAtion()">childAtion</button>
        </div>
    </div>
    <script src="js/angular.min.js"></script>
    <script type="application/javascript">
        var app = angular.module('app', []);
        app.controller('parentCtrl', function ($scope) {
            $scope.dataModal = {
            	message: 'hello angular'
            }
            $scope.parentAtion = function () {
                $scope.dataModal.message = 'parent scope';
            }
        })
        
        app.controller('childCtrl', function ($scope) {
            $scope.childAtion = function () {
                $scope.dataModal.message = 'child scope';
            }
        })
    </script>
</body>
</html>
```

问题的本质在于字符串、数字和布尔型变量是值复制，数组、对象和函数则是引用复制，通过引用共享可以在子级作用域内部改变它会影响父级作用域的数据模型状态。

另外我们通过chrome的一个插件AngularJS Batarang可以很清晰的看出$scope对象的继承关系，会发现每个$scope对象都会有个$id，以及对于作用域$scope下的数据模型，如下：

![AngularJS Batarang插件效果](http://upload-images.jianshu.io/upload_images/1945738-cb548da6849ab98e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

需要说明的是ng-app对应的作用域是全局的，我们一般使用$rootScope对象表示，对应的$id等于1。

除了通过引用复制实现数据共享，我们也可以使用类似vue.js中的事件机制。

**angular事件广播：**
- $broadcast：只能向child controller传递event与data
- $emit：只能向parent controller传递event与data

```
$scope.$broadcast(name, data);
$scope.$emit(name, data);
```

**angular事件监听：**
- $on：接收event与data

```
$scope.$on(eventName, function(event, data){
  // 这里写监听逻辑...
})
```
在$on的方法中的event事件参数，其对象的属性和方法如下：

| 事件属性| 含义 |
| ------------- |:-------------:|
| event.targetScope	| 发出或者传播原始事件的作用域 | 
| event.currentScope| 目前正在处理的事件的作用域 |
| event.name | 事件名称 |
| event.stopPropagation() | 一个防止事件进一步传播(冒泡/捕获)的函数(这只适用于使用`$emit`发出的事件)|
|event.preventDefault()|这个方法实际上不会做什么事，但是会设置`defaultPrevented`为true。直到事件监听器的实现者采取行动之前它才会检查`defaultPrevented`的值。|
|event.defaultPrevented|如果调用了`preventDefault`则为true|

上述的例子可以改写为：
```
var app = angular.module('app', []);
app.controller('parentCtrl', function ($scope) {
    $scope.message = 'hello angular';
    $scope.parentAtion = function () {
        $scope.message = 'parent scope';
    }
    
    // 监听事件
    $scope.$on('sendMsg', function(event, data){	
    	$scope.message = data;
    })
})

app.controller('childCtrl', function ($scope) {
    $scope.childAtion = function () {
    	// 触发事件
    	$scope.$emit('sendMsg', 'child scope');
    }
})
```

## angular 依赖注入

前面我们对比了angular和vue对于数据模型共享的处理方式，发现两个框架在整体上大致相同，在细微上有所区别。对于一个大型模块化工程而言，除了需要处理数据模型数据流的问题，插件和依赖的处理同样也是实现模块化必不可少的一部分。我们如何将我们的应用分成一个个小模块，互不干扰高度自治，但是却又能够相互依赖。在vue中我们是通过构建工具例如webpack+模块化标准来实现，在angular中是通过依赖注入（Dependency Injection）实现的。

这里我们先来看一下知乎上的一个问题：[AngularJS中的依赖注入实际应用场景？](https://www.zhihu.com/question/28097646)依赖注入是一个设计模式,遵循**依赖倒转原则(Dependence Inversion Priciple, DIP)**。关于依赖注入的实现原理后面再做深入探讨，我们先可以认为angular提供了一套机制可以很好的解决模块之间相互依赖的问题。

angular是用$provider对象来实现自动依赖注入机制，注入机制通过调用一个provide的$get()方法，把得到的对象作为参数进行相关调用。例如：
```
<div ng-controller="serveCtrl">
    {{message}}
</div>

<script type="application/javascript">
	var app = angular.module('app', []);	
	//  使用provider方法创建服务
	app.provider('dataServe',{  
	    $get: function() {  
	        return {  
	            message:"dataServe Provide"  
	        };  
	    }  
	}); 
	
	app.controller('serveCtrl', function ($scope, dataServe) {
		// 调用服务
	    $scope.message = dataServe.message;
	})
</script>
```

这里我们演示了angular中依赖注入的一个简单例子，在serveCtrl控制器中我们通过将dataServe作为函数参数名写入，就可以访问dataServe服务的内容，从而实现模块解耦。

上面是一种实现方法，但不是最佳实践，我们一步步说明其他写法。

首先我们需要知道在angular中声明和引用一个模块的方法：
声明模块的写法如下：
```
angular.module(name, [requires], [configFn]);

name：字符串类型，代表模块的名称；
requires：字符串的数组，代表该模块依赖的其他模块列表，如果不依赖其他模块，用空数组即可；
configFn：用来对该模块进行一些配置。

函数返回模块的引用
```
使用模块的方法：
```
angular.module(name)
```

上面创建服务，我们可以通过$provide服务实现：
```
angular.module('app', [], function($provide){
	$provide.provider('dataServe', function(){
		this.$get = function(){
			return {
				message:"dataServe Provide"  
			}
		}
	})
}).controller('serveCtrl', function ($scope, dataServe) {
	// 调用服务
    $scope.message = dataServe.message;
})

或

var app = angular.module('app', []);
app.config(function($provide){
	$provide.provider('dataServe', function(){
		this.$get = function(){
			return {
				message:"dataServe Provide"  
			}
		}
	})
})
app.controller('serveCtrl', function ($scope, dataServe) {
    $scope.message = dataServe.message;
})
```

### 创建服务的几种常用方法

上述我们使用provider和$provide.provider两种不同的写法，但是都是需要写$get函数，为了简化创建服务的过程，angualr提供了其他的五种方法：

> constant：定义常量，定义的值不能被改变，可以被注入到任何地方，但是不能被装饰器(decorator)装饰；

```
<div ng-controller="serveCtrl">
	{{message}}
</div>

<script type="application/javascript">
	var app = angular.module('app', []);
	app.config(function($provide) {
		$provide.constant('constantServe', 'constant serve');
	})
	app.controller('serveCtrl', function($scope, constantServe) {
		$scope.message = constantServe;
	}) 
</script>
```
语法糖：
```
app.constant('constantServe', 'constant serve');
```

> value：可以是string,number甚至function,和constant的不同之处在于，它可以被修改，不能被注入到config中，可以被decorator装饰

```
<div ng-controller="serveCtrl">
    <button ng-click="showTips()">show tips</button>
</div>

<script type="application/javascript">
	var app = angular.module('app', []);	
	app.value('valueServe', function(){
		alert("哈哈");
	})
	app.controller('serveCtrl', function ($scope, valueServe) {
	    $scope.showTips = valueServe;
	})
</script>
```

> factory：factory为自定义工厂，是注册服务的最常规方式，它可返回任何对象，包括基本的数据类型。

```
<div ng-controller="serveCtrl">
	{{message}}
</div>

<script type="application/javascript">
	var app = angular.module('app', []);
	app.config(function($provide){
		$provide.factory('factoryServe', function(){
			return {
				message: 'factory serve'
			}
		})
	})
	app.controller('serveCtrl', function ($scope, factoryServe) {
		$scope.message = factoryServe.message
	})
</script>
```
语法糖：
```
app.factory('factoryServe', function(){
	return {
		message: 'factory serve'
	}
})
```
 factory就是通过provider第二个参数为对象的方法实现，factory底层通过调用$provide.provider(name, {$get: $getFn})，而$getFn就是自定义factory的参数，即factory所传的方法需返回一个对象，这个对象会绑定到provider的$get属性上。

> service：当使用service创建服务的时候，相当于使用new关键词进行了实例化。因此，你只需要在this上添加属性和方法，然后，服务就会自动的返回this。当把这个服务注入控制器的时候，控制器就可以访问在那个对象上的属性了。

```
<div ng-controller="serveCtrl">
	{{message}}
</div>

<script type="application/javascript">
	var app = angular.module('app', []);
	app.config(function($provide){
		$provide.service('serviceServe', function(){
			this.message = 'factory serve';
		})
	})
	app.controller('serveCtrl', function ($scope, serviceServe) {
		$scope.message = serviceServe.message
	})
</script>
```
语法糖：
```
app.service('serviceServe', function(){
	this.message = 'factory serve';
})
```

> decorator：provider里面的装饰器——锦上添花神器

**为什么使用decorator?**
我们经常在使用某些Service的时候，更希望它能具备一些额外的功能，这时我们难道改这个Service吗？如果是系统自带的呢，改吗？这当然不现实吧。所以我们的装饰器decorator就发挥作用了，它能让已有的功能锦上添花。我们在config里面使用装饰器。
```
<div ng-controller="serveController">
	{{message}}
</div>

<script type="application/javascript">
	var app = angular.module("app", []);
	
	app.config(['$provide', function($provide) {
		$provide.decorator('infoService', function($delegate) {
			$delegate.email = "1028317108@qq.com";
			return $delegate;
		})
	}]);

	app.service('infoService', function() {
		this.name = 'zhaomenghuan';
	})

	app.controller('serveController', ['$scope', 'infoService', function($scope, infoService) {
		$scope.message = 'name：'+infoService.name + '<=>Emil：'+infoService.email;
	}]);
</script>
```
我们开始写的infoService没有Emil，我们通过装饰器decorator在不修改infoService代码的情况下添加了email新属性。

源码部分：
```
function provider(name, provider_) {
	if(isFunction(provider_)) {
		provider_ = providerInjector.instantiate(provider_);
	}
	if(!provider_.$get) {
		throw Error('Provider ' + name + ' must define $get factory method.');
	}
	return providerCache[name + providerSuffix] = provider_;
}

function factory(name, factoryFn) {
	return provider(name, { $get: factoryFn });
}

function service(name, constructor) {
	return factory(name, ['$injector', function($injector) {
		return $injector.instantiate(constructor);
	}]);
}

function value(name, value) { return factory(name, valueFn(value)); }

function constant(name, value) {
	providerCache[name] = value;
	instanceCache[name] = value;
}

function decorator(serviceName, decorFn) {
	var origProvider = providerInjector.get(serviceName + providerSuffix),
		orig$get = origProvider.$get;
	origProvider.$get = function() {
		var origInstance = instanceInjector.invoke(orig$get, origProvider);
		return instanceInjector.invoke(decorFn, null, { $delegate: origInstance });
	};
}
```
**注意：**所有的供应商都只被实例化一次，也就说他们都是单例的，除了constant，所有的供应商都可以被装饰器(decorator)装饰。模块的config方法只能注入 provider 和 constant；模块的run方法中可被注入的依赖包括服务(service)、值(value)和参量(constant)，不能注入"provider"类型的依赖。

### 注入依赖的几种方法

> 通过数组标注在方法的参数中声明依赖（优先考虑）

```
app.controller('serveCtrl', ['$scope', 'factoryServe', function ($scope, factoryServe) {
	$scope.message = factoryServe.message;
}])
```

> 定义在控制器构造方法的$inject属性中

```
app.$inject = ['$scope', 'factoryServe']
app.controller('serveCtrl', function ($scope, factoryServe) {
	$scope.message = factoryServe.message;
})
```

> 隐式声明依赖

```
app.controller('serveCtrl', function ($scope, factoryServe) {
	$scope.message = factoryServe.message;
})
```
注入器可以从函数的参数名中推断所依赖的服务。上面的函数中声明了$scope和factoryServe服务作为依赖。 这种方式可是代码更加简洁，但这种方式不能和JavaScript的代码混淆器一起使用。可以通过ng-annotate在minifying之前隐式的添加依赖。

通过在ng-app所在的DOM元素中添加ng-strict-di切换到严格的依赖注入模式，strict模式下使用隐式的标注会报错，如果用angular.bootstrap手动启动angular应用，我们可以通过设置config中的strictDi属性，启动strict模式。
```
angular.bootstrap(document, ['myApp'], {
  strictDi: true
});
```

### 注入器（$injector）

angular注入器（$injector类似于spring容器）负责创建、查找注入依赖, 每个module都会有自己的注入器。注入器负责从我们通过$provide创建的服务中创建注入的实例。只要你编写了一个带有可注入性的参数，你都能看到注入器是如何运行的。每一个AngularJS应用都有唯一一个$injector，当应用启动的时候它被创造出来，你可以通过将$injector注入到任何可注入函数中来得到它（$injector知道如何注入它自己！）。

一旦你拥有了$injector，你可以动过调用get函数来获得任何一个已经被定义过的服务的实例。例如：
```
<div ng-controller="serveController">
	{{message}}
</div>

<script type="application/javascript">
	var app = angular.module('app', []);
	
	app.factory('factoryServe', function(){
	    return {
	        message: 'factory serve'
	    }
	})
	
	var injector = angular.injector(['app']);
	app.controller('serveController', ['$scope', function ($scope) {
		var factoryServe = injector.get('factoryServe');
		$scope.message = factoryServe.message;
	}])
</script>
```
这是因为Angular在编译模板阶段为ng-controller指令以及实例化serveController注入相关的依赖。
```
injector.instantiate(serveController);
```

## 总结

react，angular，vue这三大框架带给前端变化，远远不只是让我们放弃jQuery这种直接操作dom的方式，也不仅仅是解决数据绑定的问题，我想更多的是改变我们的思维方式，用数据驱动的方式去更新视图，通过划分组件或者作用域，来实现整体的颗粒化，实现模块间分治，同时也改变了前后端协作的工作模式。

## 参考

[vue.js组件](https://cn.vuejs.org/v2/guide/components.html)
[AngularJS的学习--$on、$emit和$broadcast的使用](http://www.cnblogs.com/CraryPrimitiveMan/p/3679552.html)
[前端需要知道的 依赖注入(Dependency Injection, DI)](http://imweb.io/topic/571b567505637d4c67ae3f64)
[理解AngularJS中的依赖注入](http://sentsin.com/web/663.html)
[AngularJs中的provide](https://segmentfault.com/a/1190000007019476)

## 关注打赏

博客：http://zhaomenghuan.github.io
github：https://github.com/zhaomenghuan
segmentfault：https://segmentfault.com/u/zhaomenghuan

![赞赏](http://upload-images.jianshu.io/upload_images/1945738-46716861d484d25d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)