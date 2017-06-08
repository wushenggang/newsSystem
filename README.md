# newsSystem
----1.0版本


技术栈:react+webpack+express
简介:该系统为新闻系统。前台页面基于react搭建。类似于UC手机端新闻展示。前台新闻页面分为若干个分类。每个分类有若干条新闻。点击新闻进入其详情页。新闻详情页包含了新闻详情以及评论。经过此页面还可以进入评论页面。在评论页面显示评论以及可以发表评论。
	该系统还包含一个后台管理系统。后台代码用express书写。后台页面基于ace框架搭建。并用了百度的ueditor。功能包含新闻的增查改删以及对于前台页面评论的审查(评论的删除,还原,彻底删除)。
如何使用:在/pages     npm install ;   在/ueditor-master/example   npm install  node app.js  	前台页面:localhost:8888/recommend(移动端)   后台管理页面:localhost:8888/recommend-detail
ps:源文件中pages文件夹下包含着前台的页面;html文件夹下包含着后台管理系统的页面	;/ueditor-master/example  下的app.js为服务端代码

----2.0版本

新增后台管理系统登录权限。只有账号密码登录后才可以进入后台系统 入口为localhost:8888/login 账号为wsg  密码为wsgwsg