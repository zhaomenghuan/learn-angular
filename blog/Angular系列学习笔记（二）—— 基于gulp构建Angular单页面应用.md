> **文章来源：小青年原创**

> **发布时间：2017-4-1**

> **关键词：gulp，angular，angular-ui-router，angular-material**

> **转载需标注本文原始地址: <http://zhaomenghuan.github.io/#!/blog/20170401>**

## 前言

构建打包工具之前一直是使用 webpack（歪脖帕克，毕竟尤大推荐的工具），由于公司这边是使用gulp，为了和公司同步，私下还是要学习学习，毕竟懂点万一需要和老大交流也不至于说有啥问题，这篇文章将会以零基础的角度去写一下基于gulp搭建angular的工程，借这个机会顺便重构一下自己的博客。

## gulp基础入门

在开工之前确保自己已经安装了node环境，没有安装的自行安装好node，安装的时候默认会安装npm包管理器。安装好了通过下列的命令检查版本：
```
$ node -v
v7.5.0
$ npm -v
4.1.2
```
然后看看gulp的文档和文章取取经开始我们今天的工作：
[node官网](https://nodejs.org/en/)
[npm官网](https://www.npmjs.com/)
[gulp中文网入门指南](http://www.gulpjs.com.cn/docs/getting-started/)
[Gulp开发教程（翻译）](https://www.w3ctech.com/topic/134)

### 基本流程
#### 创建package.json文件
新建一个文件夹开始，这里我以zhaomenghuan-blog，然后然后命令行进入项目目录：
```
# 创建 package.json 文件，直接一路回车就好
npm init
```
这是在创建一个 package.json 文件，定义了这个项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等元数据）。详细介绍可以看阮一峰老师的这篇文章：[package.json文件](http://javascript.ruanyifeng.com/nodejs/packagejson.html)。

#### 安装 gulp
全局安装 gulp
```
npm install gulp -g
```
作为项目的开发依赖（devDependencies）安装：
```
npm install gulp -D
```
这两者的区别可以看看这篇文章：[npm 常用命令详解](http://zhaomenghuan.github.io/#!/blog/20161115)。执行完这一步，目录下就多了一个node_modules文件夹，里面都是依赖的模块。一般来说，我们可能会在其它项目中使用的工具，如这里的gulp我们会先进行全局按照，这样会在本地有一个“仓库”，以后再用的时候直接下载到项目中岂可，避免每次不必要的下载等待。另外，dependencies字段指定了项目运行所依赖的模块，devDependencies指定项目开发所需要的模块。下载模块的时候注意区分，分清楚依赖模块的差异有助于我们后期优化代码，避免不必要的模块引入到项目最终源码中，造成代码打包过大的问题。

#### 创建 gulpfile.js 文件
在项目根目录下创建一个名为 gulpfile.js 的文件：
```
var gulp = require('gulp');

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
});
```

#### 运行gulp
```
gulp 或 gulp default
```
默认的名为 default 的任务（task）将会被运行，在这里，这个任务并未做任何事情。
想要单独执行特定的任务（task），请输入 gulp <task> <othertask>，例如在gulpfile.js里面添加如下代码：
```
gulp.task('console', function() {
  console.log('hello gulp');
});
```
然后执行`gulp console`就会输入`hello gulp`。

很显然我们通过一些命令就可以执行一下任务（task），那么接下来的重点就是写task相关的代码。

### gulpfile.js配置说明

上面的流程只是对gulp基本流程入门，但是对于gulp的强大功能还没有直观的感觉，下面我们通过常用的几段配置看看配置的基本方法。需要说明的是，在使用插件之前我们都需要先安装相关的模块。

#### 创建具有热更新的本地服务 —— browser-sync

参考文档[拥有实时重载（live-reloading）和 CSS 注入的服务器](http://www.gulpjs.com.cn/docs/recipes/server-with-livereload-and-css-injection/)这篇文章可知，使用 [BrowserSync](http://browsersync.io/) 和 gulp，你可以轻松地创建一个开发服务器，然后同一个 WiFi 中的任何设备都可以方便地访问到。BrowserSync 同时集成了 live-reload 所以不需要另外做配置了。

安装browser-sync模块：
```
npm install browser-sync -D
```
可以通过gulp.watch监听文件变动并且自动刷新，如下：
```
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('sass', function() {
  return sass('scss/styles.scss')
    .pipe(gulp.dest('app/css'))
    .pipe(reload({ stream:true }));
});

// 监视 Sass 文件的改动，如果发生变更，运行 'sass' 任务，并且重载文件
gulp.task('serve', ['sass'], function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

  gulp.watch('app/scss/*.scss', ['sass']);
});
```

#### Jade 模板文件转换为 HTML 文件 —— gulp-jade

我们可以通过gulp-jade插件将jade模板转成html文件，如下：
```
var source = {
    templates: [
        { src: './src/index.jade', dist: './app/'},
        { src: './src/components/**/*.jade', dist: './app/components/'}
    ]
};

gulp.task('templates', function(){
    source.templates.forEach(function (item) {
        gulp.src(item.src)
            .pipe(jade({
                pretty: true
            }))
            .pipe(gulp.dest(item.dist))
            .pipe(reload({
                stream:true
             }));
    })
});
```

#### less 文件转换成css文件 —— gulp-less

```
var gulp = require('gulp');
var less = require('gulp-less');             // 解析less
var minifycss = require('gulp-minify-css'); // 压缩css
var uglify = require("gulp-uglify");         // 压缩代码
var concat = require("gulp-concat");         // 合并文件

var source = {
    styles: [
        './src/index.less',
        './src/components/**/*.less',
        './src/pages/**/*.less'
    ]
};

gulp.task('styles:source', function () {
    return gulp.src(source.styles) // 压缩的文件
        .pipe(less())
        .pipe(minifycss()) // 执行压缩
        .pipe(concat('all.min.css'))
        .pipe(gulp.dest('./app/css/')) //输出到指定目录
        .pipe(reload({
            stream:true
        }));
});
```

#### 压缩图片——gulp-imagemin

```
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');     // 图片压缩
var source = {
    images: {
        src: './src/assets/images/*',
        dist: './app/assets/images'
    }
};

gulp.task('images', function () {
    gulp.src(source.images.src)
        .pipe(imagemin({
            optimizationLevel: 7
        }))
        .pipe(gulp.dest(source.images.dist));
});
```

#### 从命令行传递参数设置项目开发模式

项目开发环境下我们经常写很多`console.log`调试程序，在上线的时候我们又不想手动删除这些调试日志，这时候我们可以通过插件来完成。我们需要来配置两个环境：
- DEV 模式：在开发环境中，为了方便 debug，JavaScript 通常不做压缩和混淆；
- PROD 模式：上生产环境时，JavaScript 必须并合压缩、混淆并成一个文件，同时需要去除所有的 log 输出语句。

我们可以通过命令行传递参数说明是什么模式，我们可以通过官方的例子[从命令行传递参数](http://www.gulpjs.com.cn/docs/recipes/pass-arguments-from-cli/)学习如何使用。

```
// npm install --save-dev gulp gulp-if gulp-uglify minimist gulp-strip-debug

var gulp = require('gulp');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var stripDebug = require('gulp-strip-debug');

var minimist = require('minimist');

var knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'production' }
};

var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('scripts', function() {
  return gulp.src('**/*.js')
    .pipe(gulpif(options.env === 'production', uglify())) // 仅在生产环境时候进行压缩
    .pipe(gulpif(options.env === 'production', stripDebug())) // 去掉console.log
    .pipe(gulp.dest('dist'));
});
```
默认是development环境下，如果想使用production环境可以通过如下命令运行 gulp：
```
$ gulp scripts --env development
```

每次在命令行输入参数容易出错，为了方便我们可以将脚本写在package.json中的scripts字段里面：
```
"scripts": {
    "dev": "gulp serve --env development",
    "build": "gulp serve --env production"
 },
```

然后执行`npm run dev`和`npm run build`命令就可以。

对于新手而言，可能理解这个流程更重要，这个流程跑通了，接下来无非就是看文档入门了，关于gulp后文不再一步步赘述，而是直接给出gulpfile.js的代码。这里我们可以看出来gulp强大的功能得以实现，依赖于各种方便的插件，与webpack中提供的各种loader十分类似。可见要想完成各种负责的功能，需要对常用插件进行学习，我们可以通过这里的例子学习相关的插件使用方法：[gulp 技巧集](http://www.gulpjs.com.cn/docs/recipes/)。

## 项目实战

上面的例子对于我们搭建一个基础工程足够了，下面我们通过一个实际例子来说明。

项目结构：
 ```
├── node_modules // 打包过程中依赖的包
├── package.json // 包含各种所需模块以及项目的配置信息
├── gulpfile.js // 打包配置文件
├── app // 打包之后最终部署到服务器上的文件（名称自定义）
├── src  // 资源文件（名称自定义）
    ├── components // 自定义全局组件
        ├── pageloading （如：页面切换loading）
        ...
    ├── pages // 页面路由组件
        ├── index
            ├── index.jade 默认路由视图
            ├── index.controller.js 默认路由控制器
            └── index.config.js 默认视图路由配置
        ├── blog
        ···
    ├── assets // 静态资源
        ├── images // 图片资源
    ├── app.module.js // 全局模块
    ├── index.jade // 入口视图模板
    └── index.less // 入口视图样式
└── vendor.config.js // 依赖的库配置文件（自定义）
```
本文工程地址：[learn-angular => angular-material](https://github.com/zhaomenghuan/learn-angular/tree/master/project/angular-material)

### ui-router使用指南

我们知道一个大型的单页面应用离不开路由，angular自带了ngRouter，但是我们常用的是angularUI的ui-router，这是因为UI-Router有两个重要的特性：
- 多样化视图
- 嵌入式视图

ui-router支持多样化视图，并且每一个视图都有自己相应的控制，所以每个区块都是封装好，可以复用到整个应用程序需要的地方，这就意味着我们可以实现视图的复用和分治。ui-router 引进了状态机设计模式，抽象高于传统的路由。路由成了状态，URL就成了状态的一个简单属性。

对于ui-router最好的学习教程就是[ui-router 官方wiki](https://github.com/angular-ui/ui-router/wiki)，我们下面会来讲解一下新手常见的几个问题。

下载：
```
npm install angular-ui-router -S
```
引入依赖:
```
var app = angular.module('app', ['ui.router']);
```
> 注意：是ui.router不是ui-router!

#### $stateProvider

> 处理路由状态的服务，路由的状态反映了该项在应用程序中的位置，描述了在当前状态下UI是应该怎么样的，并且该做什么。

**依赖：**$urlRouterProvider $urlMatcherFactoryProvider

**decorator(name,func)：**通过内部的$stateProvider以扩展或者重写状态生成器。可用于添加ui-router的自定义功能，例如，基于状态名称推断templateUrl。
**警告：**因为生成器的函数执行顺序的不确定，decorator不应该相互依赖。
**参数：**
name：需要修改的生成函数名称。
func：负责修改生成器函数的函数。

**state(name,stateConfig)：**注册一个状态，并给定其配置。
**参数：**
name：状态的名称。
stateConfig：状态配置对象。配置具有以下各项属性：
template： string/function，html模板字符串，或者一个返回html模板字符串的函数；
templateUrl：string/function，模板路径的字符串，或者返回模板路径字符串的函数；
templateProvider：function，返回html模板字符串或模板路径的服务；
controller：string/function，新注册一个控制器函数或者一个已注册的控制器的名称字符串；
controllerProvider：function，返回控制器或者控制器名称的服务；
controllerAs：string，控制器别名；
parent：string/object，手动指定该状态的父级；
resolve：object，将会被注入controller去执行的函数，<string,function>形式。
url：string，当前状态的对应url；
views：object，视图展示的配置，<string,object>形式；
abstract：boolean，一个永远不会被激活的抽象的状态，但可以给其子级提供特性的继承。默认是true；
onEnter：function，当进入一个状态后的回调函数；
onExit：function，当退出一个状态后的回调函数；
reloadOnSearch：boolean，如果为false，那么当一个search/query参数改变时不会触发相同的状态，用于当你修改$location.search()的时候不想重新加载页面。默认为true；
data：object，任意对象数据，用于自定义配置。继承父级状态的data属性。换句话说，通过原型继承可以达到添加一个data数据从而整个树结构都能获取到；
params：url里的参数值，通过它可以实现页面间的参数传递。

#### $urlRouterProvider

> $urlRouterProvider 在这里有两个主要目的：一是建立一个默认路由，用于管理未知的URL（统一跳转到某处）；二是监听浏览器地址栏URL的变化，重定向到路由定义的状态中。总之，$urlRouterProvider让我们处理状态机抽象的$stateProvider没有检测到的情况。

$urlRouterProvider负责监听$location.当$location变化的时候，$urlRouterProvider开始在一个规则的列表中一个个的查找，直到找到匹配的值。$urlRouterProvider用于在后端指定url的状态配置。所有的url被编译成UrlMatcher对象。
**依赖：** $urlMatcherFactoryProvider   $locationProvider

**deferIntercept(defer) ：**禁用（或启用）延迟location变化的拦截。
如果你想定制与URL同步的行为（例如，你需要保持当前的URL去并且推迟一个变化），那么在配置的时候使用这个方法。
**参数：**
defer：boolean，确定是禁止还是启用该拦截。
```
angular.module('app',['ui.router']).config(["$urlRouterProvider",function(){
     $urlRouterProvider.deferIntercept(defer); // defer = true/false
}])
```

**otherwise(rule)：**定义一个当请求的路径是无效路径时跳转的路径。
 **参数：**
rule：你想重定向的url路径或一个返回的网址路径的规则函数。函数传入两个参数：$injector和$location服务，而且必须返回一个string的url。
```
angular.module('app',['ui.router']).config(["$urlRouterProvider",function(){
     $urlRouterProvider.otherwise(rule); // rule = 重定向的url规则
}])
```
 **rule(rule)： **定义使用$urlRouterProvider来匹配指定的URL的规则。
 **参数： **
rule：将$injector和$location作为arguments传入的处理函数。用来返回一个string类型的url路径。
```
angular.module('app',['ui.router']).config(["$urlRouterProvider",function($urlRouterProvider){
     $urlRouterProvider.rule(function ($injector, $location) {
        var path = $location.path(),
        normalized = path.toLowerCase();
        if (path !== normalized) {
           return normalized;
        }
    });
}])
```
**when(what,handler)：**为给定的URL匹配注册一个处理程序。
**参数：**
what：需要重定向的传入路径。
handler：你想要重定向的路径/处理程序。
```
  angular.module('Demo', ['ui.router']);
  .config(["$urlRouterProvider",function ($urlRouterProvider) {
    $urlRouterProvider.when($state.url, function ($match, $stateParams) {
      if ($state.$current.navigable !== state || !equalForKeys($match, $stateParams) {
       $state.transitionTo(state, $match, false);
      }
    });
  }]);
```

#### $urlRouter

**依赖：**$location $rootScope $injector $browser

**href(urlMacther,params,options)：**一个生成URL的方法，为给定的UrlMatcher返回编译后的URL，并且用提供的参数填充。
**参数：**
urlMacther：用于当作生成URL的模板的UrlMacther对象。
params：一个参数值的对象用来填补所需的匹配参数。
options：option对象，absolute-boolean，如果为true，将会生成一个绝对地址。
```
  $bob = $urlRouter.href(new UrlMatcher("/about/:person"), {
    person: "bob"
  });
  // $bob == "/about/bob";
```
触发更新：发生在地址栏URL变化时执行相同的更新。

#### $state

> $state服务负责代表状态及提供状态之间的转换。它还提供你当前的状态及上一个状态。

**依赖：**$rootScope $q $view $injector $resolve $stateParams $urlRouter

**get(stateOrName,context)：**返回任何指定的状态或所有状态的配置对象。
**参数：**
stateOrName：如果提供此参数，返回的是指定状态的配置对象；如果不提供此参数，则返回全部状态的配置对象。
context：当context是一个相对的参考状态，状态会在相关上下文中检索。

**go(to,params,options)：**
**参数：**
to：string，即将跳转的状态。
params:object，跳转所带的参数。
options：object，可选配置对象。有 location(是否更新地址栏的url，或以什么字符串替换url)，inherit(是否继承当前url的参数)，relative(当变化相对路径：如"^,定义的状态是相对的)，notify(是否广播$stateChangeStart和$stateChangeSuccess事件)，reload(是否重新载入)。
```
$state.go('contact.detail');
```

**href(stateOeName,params,options)：**一个URL生成方法，返回为给定的状态填充指定的参数编译后的链接。
**参数：**
stateOeName：string，你想要生成的url的状态或者状态对象。
params：object，一个用于填充状态需要的参数的对象。
options：可选配置对象。有lossy(当第一个参数url未被提供时是否继承导航的url进行构建href),inherit(是否继承当前url的参数),relative(当变化相对路径：如"^,定义的状态是相对的),absolute(是否生成绝对url)。
```
$state.href("about.person", { person: "bob" })
```

**include(stateOrName,params,options)：**一个确定当前有效的状态是不是与stateOrName平级的还是其子状态。
**参数：**
stateOeName：string，部分名称，相对名称，或者通过当前状态进行全局模式查找。
params：object，一个参数对象。
options：可选配置对象。有relative。

**is(stateOrName,params,options)：**与$state.include相似，只是这个针对的是全名。参数性质同上。

**reload(state)：**重新载入当前状态的方法。
**参数：**
state：一个状态名称或者状态对象。
```
$state.reload('contact.detail');
```

**transitionTo(to,toParams,options)：**过渡到一个新状态的方法。
**参数：**
to：状态名称。
toParams：将会发送到下一个状态的参数。
options：可选参数。有location，inherit，relative，notify，reload。
```
$state.transitionTo($state.current, $stateParams, {
    reload: true, inherit: false, notify: true
});
```

**current：**获取当前路由

**$stateChangeError：**路由状态变化发生错误时触发的事件。
**参数：**
event，toState，toParams，fromState，fromParams，error。

**$stateChangeStart：**路由状态变化发生前触发的事件。
**参数：**event，toState，toParams，fromState，fromParams。

**$stateChangeSuccess：**路由状态变化正确时触发的事件。
**参数：**event，toState，toParams，fromState，fromParams。

**$stateNotFound：**路由状态没找到的时候触发的事件。
**参数：**event，unfoundState，fromState，fromParams。

#### 三种常用的方式激活路由状态
- $state.go()：优先级较高的便利方式 
- ui-sref：点击包含此指令跳转
- url：url导航

**ui-sref：**一种将链接（`<a>`标签）绑定到一个状态的指令。点击该链接将触发一个可以带有可选参数的状态转换。ui-sref此指令必须绑定到`<a>`标签，如果该路由有对应的关联URL，其通过$state.href()自动生成和更新href属性。
```
<a ui-sref="blog" ui-sref-active="active">博客</a>
<a ui-sref="blog({id: pageId})">博客-2017</a>
```
ui-sref-active="active" 该路由激活，则对应增加active样式名称，ui-sref-opts 传递参数。

#### html5模式 or Hashbang

$location服务有两种用来控制地址栏URL格式的配置：Hashbang模式（默认）和HTML5模式（使用HTML5历史API）。应用会使用两种模式中相同的API，并且$location服务会使用需要的URL片段和浏览器API来帮助改变URL或者进行历史管理。

![html5模式 or Hashbang](http://upload-images.jianshu.io/upload_images/1945738-78637b3f92e3df9c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

|对比|Hashbang模式|HTML5模式|
|:-------------:|:-------------:|:-------------:|
|配置 |默认|{ html5Mode: true }|
|URL格式|所有浏览器都支持|hashbang URLs在高级浏览器中使用regular URLs，低级浏览器使用hashbang URLs|
|`<a href="">` 链接重写|否|是|
|需要服务器端配置|否|是|

> Hashbang模式(默认mode)

使用这个模式的话，$location会在所有浏览器中使用Hashbang URLs。
```
$locationProvider.html5mode = false;
$locationProvider.hashPrefix = '!';
```
支持网络爬虫

你需要添加特别的meta标记在你的文档的头部才能支持对你的AJAX应用的索引。
```
<meta name="fragment" content="!" />
```
这能让网络爬虫请求带有_escaped_fragment_形式的参数链接，这样你就能识别爬虫并且返回一个HTML的快照了。

> HTML5模式

在HTML5模式中，$location服务的读写器和浏览器的URL地址通过HTML5历史API交互，这使你能用regular URL path并且搜索各组成部分，和hashbang是等效的。 如果浏览器不支持HTML5 历史API， $location服务会自动回退成使用hashbang URLs。你就不用担心浏览器的支持性了。$location服务总是会用最好的选择。

在低级浏览器中使用了regular URL -> 重定向成hashbang URL
在现代浏览器中打开了一个hashbang URL -> 重写成regular URL
```
 $locationProvider.html5mode = true;
```

**服务器端：**使用这种模式需要开启服务器端的URL重写功能，基本上你需要重写所有指向你应用的链接(如index.html)。

**相对链接：**记住要检查所有的相对连接、图片、脚本等。你必须指定你主页面的base url(<base href="/my-base">)，或者你使用绝对路径也行，因为相对路径会结合文档的初始绝对路径转换成绝对路径。文档初始路径通常和应用的根路径不一样。

## 参考

[gulp 技巧集](http://www.gulpjs.com.cn/docs/recipes/)
[ui-router wiki](https://github.com/angular-ui/ui-router/wiki/Quick-Reference)
[UI-Router:为什么开发者都不喜欢Angular.js内置的路由](http://www.jianshu.com/p/35c0acdea86c)
[AngularJs ui-router 路由的简单介绍](http://www.cnblogs.com/ys-ys/p/5052660.html)
[AngularJS开发指南27：使用$location](http://www.angularjs.cn/A00M)