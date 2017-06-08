var express = require('express');
var ejs = require('ejs');
var path = require('path');
var fs=require('fs');
var ueditor = require("../");
var bodyParser = require('body-parser');
var mysql=require('mysql');
var url=require('url');
var urlencodedParser=bodyParser.urlencoded({extended:false});
var logger=require('morgan');
var session=require('express-session');
var cookieParser=require('cookie-parser');
var app = express();
app.use(cookieParser());
app.use(session({
    resave:true,
    saveUninitialized:false,
    secret:'wsg'
}))
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// view engine setup

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('../../pages/build'));
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
    //客户端上传文件设置
    var imgDir = '/img/ueditor/'
    var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = imgDir;//默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/file/ueditor/'; //附件
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/video/ueditor/'; //视频
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = imgDir;
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));





//后台管理页面
app.get('/backstage',function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/index.html', function (err, file) {
            if (err) {
                console.log(err);
            } else {
                res.end(file);
            }
        })
    }else{
        res.redirect('/login');
    }
});

//进入后台管理系统新闻列表页
app.get('/recommend-detail',function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-detail.html', function (err, rs) {
            if (err) {
                console.log(err);
            } else {
                res.end(rs);
            }
        });
    }else{
        res.redirect('/login');
    }
});
app.get('/science-detail',function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-detail.html', function (err, rs) {
            if (err) {
                console.log(err);
            } else {
                res.end(rs);
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get('/nba-detail',function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-detail.html', function (err, rs) {
            if (err) {
                console.log(err);
            } else {
                res.end(rs);
            }
        })
    }else{
        res.redirect('/login')
    }
})



//进入录入页面
app.get('/recommend-entry', function (req, res) {
    if(req.session.user) {
        res.render('recommend-entry.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/science-entry',function(req,res){
    if(req.session.user) {
        res.render('science-entry.html');
    }else{
        res.redirect('/login');
    }
})
app.get('/nba-entry',function(req,res){
    if(req.session.user) {
        res.render('nba-entry.html');
    }else{
        res.redirect('/login');
    }
})



//读取数据库里的新闻消息显示在后台管理系统
app.get('/read-news-recommend',function(req,res){
    selectMysql('news_recommend',res);
});
app.get('/read-news-science',function(req,res){
    selectMysql('news_science',res);
})
app.get('/read-news-nba',function(req,res){
    selectMysql('news_nba',res);
})

app.get('/recommend-revise',function(req,res){
   res.render('recommend-revise.html');
});



//录入页面提交消息  post方法
app.post('/recommend-news',urlencodedParser,function(req,res){
    var param = [req.body.id,req.body.title, req.body.content, req.body.src];
    insertMysql('news_recommend',param);
});
app.post('/science-news',urlencodedParser,function(req,res){
    var param = [req.body.id,req.body.title, req.body.content, req.body.src];
    insertMysql('news_science',param);
});
app.post('/nba-news',urlencodedParser,function(req,res){
    var param = [req.body.id,req.body.title, req.body.content, req.body.src];
    insertMysql('news_nba',param);
});





//修改每一条新闻的消息
app.post("/update-recommend-news-1",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_recommend',param);
})
app.post("/update-recommend-news-2",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_recommend',param);
})
app.post("/update-recommend-news-3",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_recommend',param);
})
app.post("/update-recommend-news-4",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_recommend',param);
})
app.post("/update-recommend-news-5",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_recommend',param);
})
app.post("/update-recommend-news-6",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_recommend',param);
})
app.post("/update-recommend-news-7",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_recommend',param);
})
app.post("/update-recommend-news-8",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_recommend',param);
})
app.post("/update-recommend-news-9",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_recommend',param);
})


app.post("/update-science-news-1",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_science',param);
})
app.post("/update-science-news-2",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_science',param);
})
app.post("/update-science-news-3",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_science',param);
})
app.post("/update-science-news-4",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_science',param);
})
app.post("/update-science-news-5",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_science',param);
})
app.post("/update-science-news-6",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_science',param);
})
app.post("/update-science-news-7",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_science',param);
})
app.post("/update-science-news-8",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_science',param);
})
app.post("/update-science-news-9",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_science',param);
})





app.post("/update-nba-news-1",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_nba',param);
})
app.post("/update-nba-news-2",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_nba',param);
})
app.post("/update-nba-news-3",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_nba',param);
})
app.post("/update-nba-news-4",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_nba',param);
})
app.post("/update-nba-news-5",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_nba',param);
})
app.post("/update-nba-news-6",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_nba',param);
})
app.post("/update-nba-news-7",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_nba',param);
})
app.post("/update-nba-news-8",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_nba',param);
})
app.post("/update-nba-news-9",urlencodedParser,function(req,res){
    var param=[req.body.title,req.body.content,req.body.src,req.body.id];
    updateNews('news_nba',param);
})


//通过后台管理系统操作删除数据库里的数据
app.post('/delete-news-recommend',function(req,res){
    var param=[req.body.id];
    deleteMysql("news_recommend",param);
});
app.post('/delete-news-science',function(req,res){
    var param=[req.body.id];
    deleteMysql("news_science",param);
})
app.post('/delete-news-nba',function(req,res){
    var param=[req.body.id];
    deleteMysql("news_nba",param);
})


//删除后台系统新闻列表里的新闻
app.post('/recommend-deletenews',urlencodedParser,function(req,res){
    param=[req.body.id];
    deleteMysql('news_recommend',param);
})
app.post('/science-deletenews',urlencodedParser,function(req,res){
    param=[req.body.id];
    deleteMysql('news_science',param);
})
app.post('/nba-deletenews',urlencodedParser,function(req,res){
    param=[req.body.id];
    deleteMysql('news_nba',param);
})




//显示前台recommendList页面
app.get('/recommend',function(req,res){
    fs.readFile('../../pages/newsList/recommend-newsList.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    });
});
//显示前台scienceList页面
app.get('/science',function(req,res){
    fs.readFile('../../pages/newsList/science-newsList.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})


//显示前台nbaList页面
app.get('/nba',function(req,res){
    fs.readFile('../../pages/newsList/nba-newsList.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})


//查询newsList-recommend的消息路径
app.get('/newsList-recommend',function(req,res){
    selectMysql('news_recommend',res);
});

//查询newsList-science的消息路径
app.get('/newsList-science',function(req,res){
    selectMysql('news_science',res);
})



//查询newsList-nba的消息路径
app.get('/newsList-nba',function(req,res){
    selectMysql('news_nba',res);
})


//前台显示recommend-news详情页
app.get('/recommend-newsDetail-1',function(req,res){
    fs.readFile('../../pages/recommend-newsDetail/recommend-newsDetail-1.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    });
})
app.get('/recommend-newsDetail-2',function(req,res){
    fs.readFile('../../pages/recommend-newsDetail/recommend-newsDetail-2.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/recommend-newsDetail-3',function(req,res){
    fs.readFile('../../pages/recommend-newsDetail/recommend-newsDetail-3.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/recommend-newsDetail-4',function(req,res){
    fs.readFile('../../pages/recommend-newsDetail/recommend-newsDetail-4.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/recommend-newsDetail-5',function(req,res){
    fs.readFile('../../pages/recommend-newsDetail/recommend-newsDetail-5.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/recommend-newsDetail-6',function(req,res){
    fs.readFile('../../pages/recommend-newsDetail/recommend-newsDetail-6.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/recommend-newsDetail-7',function(req,res){
    fs.readFile('../../pages/recommend-newsDetail/recommend-newsDetail-7.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/recommend-newsDetail-8',function(req,res){
    fs.readFile('../../pages/recommend-newsDetail/recommend-newsDetail-8.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/recommend-newsDetail-9',function(req,res){
    fs.readFile('../../pages/recommend-newsDetail/recommend-newsDetail-9.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})







//前台显示science-news详情页
app.get('/science-newsDetail-1',function(req,res){
    fs.readFile('../../pages/science-newsDetail/science-newsDetail-1.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    });
})
app.get('/science-newsDetail-2',function(req,res){
    fs.readFile('../../pages/science-newsDetail/science-newsDetail-2.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/science-newsDetail-3',function(req,res){
    fs.readFile('../../pages/science-newsDetail/science-newsDetail-3.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/science-newsDetail-4',function(req,res){
    fs.readFile('../../pages/science-newsDetail/science-newsDetail-4.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/science-newsDetail-5',function(req,res){
    fs.readFile('../../pages/science-newsDetail/science-newsDetail-5.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/science-newsDetail-6',function(req,res){
    fs.readFile('../../pages/science-newsDetail/science-newsDetail-6.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/science-newsDetail-7',function(req,res){
    fs.readFile('../../pages/science-newsDetail/science-newsDetail-7.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/science-newsDetail-8',function(req,res){
    fs.readFile('../../pages/science-newsDetail/science-newsDetail-8.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/science-newsDetail-9',function(req,res){
    fs.readFile('../../pages/science-newsDetail/science-newsDetail-9.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})








//前台显示nba-news详情页
app.get('/nba-newsDetail-1',function(req,res){
    fs.readFile('../../pages/nba-newsDetail/nba-newsDetail-1.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    });
})
app.get('/nba-newsDetail-2',function(req,res){
    fs.readFile('../../pages/nba-newsDetail/nba-newsDetail-2.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/nba-newsDetail-3',function(req,res){
    fs.readFile('../../pages/nba-newsDetail/nba-newsDetail-3.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/nba-newsDetail-4',function(req,res){
    fs.readFile('../../pages/nba-newsDetail/nba-newsDetail-4.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/nba-newsDetail-5',function(req,res){
    fs.readFile('../../pages/nba-newsDetail/nba-newsDetail-5.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/nba-newsDetail-6',function(req,res){
    fs.readFile('../../pages/nba-newsDetail/nba-newsDetail-6.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/nba-newsDetail-7',function(req,res){
    fs.readFile('../../pages/nba-newsDetail/nba-newsDetail-7.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/nba-newsDetail-8',function(req,res){
    fs.readFile('../../pages/nba-newsDetail/nba-newsDetail-8.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/nba-newsDetail-9',function(req,res){
    fs.readFile('../../pages/nba-newsDetail/nba-newsDetail-9.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})








//前台显示recommend-comment页面

app.get('/recommend-comment-1',function(req,res){
    fs.readFile('../../pages/newsComment/recommend-newsComment-1.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
});
app.get('/recommend-comment-2',function(req,res){
    fs.readFile('../../pages/newsComment/recommend-newsComment-2.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/recommend-comment-3',function(req,res){
    fs.readFile('../../pages/newsComment/recommend-newsComment-3.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/recommend-comment-4',function(req,res){
    fs.readFile('../../pages/newsComment/recommend-newsComment-4.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/recommend-comment-5',function(req,res){
    fs.readFile('../../pages/newsComment/recommend-newsComment-5.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/recommend-comment-6',function(req,res){
    fs.readFile('../../pages/newsComment/recommend-newsComment-6.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/recommend-comment-7',function(req,res){
    fs.readFile('../../pages/newsComment/recommend-newsComment-7.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/recommend-comment-8',function(req,res){
    fs.readFile('../../pages/newsComment/recommend-newsComment-8.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/recommend-comment-9',function(req,res){
    fs.readFile('../../pages/newsComment/recommend-newsComment-9.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})







//前台显示science-comment页面

app.get('/science-comment-1',function(req,res){
    fs.readFile('../../pages/newsComment/science-newsComment-1.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
});
app.get('/science-comment-2',function(req,res){
    fs.readFile('../../pages/newsComment/science-newsComment-2.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/science-comment-3',function(req,res){
    fs.readFile('../../pages/newsComment/science-newsComment-3.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/science-comment-4',function(req,res){
    fs.readFile('../../pages/newsComment/science-newsComment-4.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/science-comment-5',function(req,res){
    fs.readFile('../../pages/newsComment/science-newsComment-5.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/science-comment-6',function(req,res){
    fs.readFile('../../pages/newsComment/science-newsComment-6.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/science-comment-7',function(req,res){
    fs.readFile('../../pages/newsComment/science-newsComment-7.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/science-comment-8',function(req,res){
    fs.readFile('../../pages/newsComment/science-newsComment-8.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/science-comment-9',function(req,res){
    fs.readFile('../../pages/newsComment/science-newsComment-9.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})









//前台显示nba-comment页面

app.get('/nba-comment-1',function(req,res){
    fs.readFile('../../pages/newsComment/nba-newsComment-1.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
});
app.get('/nba-comment-2',function(req,res){
    fs.readFile('../../pages/newsComment/nba-newsComment-2.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/nba-comment-3',function(req,res){
    fs.readFile('../../pages/newsComment/nba-newsComment-3.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/nba-comment-4',function(req,res){
    fs.readFile('../../pages/newsComment/nba-newsComment-4.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/nba-comment-5',function(req,res){
    fs.readFile('../../pages/newsComment/nba-newsComment-5.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/nba-comment-6',function(req,res){
    fs.readFile('../../pages/newsComment/nba-newsComment-6.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/nba-comment-7',function(req,res){
    fs.readFile('../../pages/newsComment/nba-newsComment-7.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/nba-comment-8',function(req,res){
    fs.readFile('../../pages/newsComment/nba-newsComment-8.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})
app.get('/nba-comment-9',function(req,res){
    fs.readFile('../../pages/newsComment/nba-newsComment-9.html',function(err,rs){
        if(err){
            console.log(err);
        }else{
            res.end(rs);
        }
    })
})







//recommend 评论表单上传数据post方法
app.post('/news_comment_science_1',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_science_1',param);
})
app.post('/news_comment_science_2',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_science_2',param);
})
app.post('/news_comment_science_3',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_science_3',param);
})
app.post('/news_comment_science_4',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_science_4',param);
})
app.post('/news_comment_science_5',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_science_5',param);
})
app.post('/news_comment_science_6',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_science_6',param);
})
app.post('/news_comment_science_7',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_science_7',param);
})
app.post('/news_comment_science_8',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_science_8',param);
})
app.post('/news_comment_science_9',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_science_9',param);
})




//recommend 评论表单上传数据post方法
app.post('/news_comment_recommend_1',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_recommend_1',param);
})
app.post('/news_comment_recommend_2',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_recommend_2',param);
})
app.post('/news_comment_recommend_3',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_recommend_3',param);
})
app.post('/news_comment_recommend_4',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_recommend_4',param);
})
app.post('/news_comment_recommend_5',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_recommend_5',param);
})
app.post('/news_comment_recommend_6',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_recommend_6',param);
})
app.post('/news_comment_recommend_7',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_recommend_7',param);
})
app.post('/news_comment_recommend_8',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_recommend_8',param);
})
app.post('/news_comment_recommend_9',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_recommend_9',param);
})








//查询recommend-news评论
app.get('/news_comment_recommend_1',function(req,res){
    selectMysql('news_comment_recommend_1',res);
})

app.get('/news_comment_recommend_2',function(req,res){
    selectMysql('news_comment_recommend_2',res);
})
app.get('/news_comment_recommend_3',function(req,res){
    selectMysql('news_comment_recommend_3',res);
})
app.get('/news_comment_recommend_4',function(req,res){
    selectMysql('news_comment_recommend_4',res);
})
app.get('/news_comment_recommend_5',function(req,res){
    selectMysql('news_comment_recommend_5',res);
})
app.get('/news_comment_recommend_6',function(req,res){
    selectMysql('news_comment_recommend_6',res);
})
app.get('/news_comment_recommend_7',function(req,res){
    selectMysql('news_comment_recommend_7',res);
})
app.get('/news_comment_recommend_8',function(req,res){
    selectMysql('news_comment_recommend_8',res);
})
app.get('/news_comment_recommend_9',function(req,res){
    selectMysql('news_comment_recommend_9',res);
})


//查询recommend在回收站中的评论
app.get('/news_comment_recommend_recycle_1',function(req,res){
    selectMysql('news_comment_recommend_recycle_1',res);
})
app.get('/news_comment_recommend_recycle_2',function(req,res){
    selectMysql('news_comment_recommend_recycle_2',res);
})
app.get('/news_comment_recommend_recycle_3',function(req,res){
    selectMysql('news_comment_recommend_recycle_3',res);
})
app.get('/news_comment_recommend_recycle_4',function(req,res){
    selectMysql('news_comment_recommend_recycle_4',res);
})
app.get('/news_comment_recommend_recycle_5',function(req,res){
    selectMysql('news_comment_recommend_recycle_5',res);
})
app.get('/news_comment_recommend_recycle_6',function(req,res){
    selectMysql('news_comment_recommend_recycle_6',res);
})
app.get('/news_comment_recommend_recycle_7',function(req,res){
    selectMysql('news_comment_recommend_recycle_7',res);
})
app.get('/news_comment_recommend_recycle_8',function(req,res){
    selectMysql('news_comment_recommend_recycle_8',res);
})
app.get('/news_comment_recommend_recycle_9',function(req,res){
    selectMysql('news_comment_recommend_recycle_9',res);
})






//查询science在回收站中的评论
app.get('/news_comment_science_recycle_1',function(req,res){
    selectMysql('news_comment_science_recycle_1',res);
})
app.get('/news_comment_science_recycle_2',function(req,res){
    selectMysql('news_comment_science_recycle_2',res);
})
app.get('/news_comment_science_recycle_3',function(req,res){
    selectMysql('news_comment_science_recycle_3',res);
})
app.get('/news_comment_science_recycle_4',function(req,res){
    selectMysql('news_comment_science_recycle_4',res);
})
app.get('/news_comment_science_recycle_5',function(req,res){
    selectMysql('news_comment_science_recycle_5',res);
})
app.get('/news_comment_science_recycle_6',function(req,res){
    selectMysql('news_comment_science_recycle_6',res);
})
app.get('/news_comment_science_recycle_7',function(req,res){
    selectMysql('news_comment_science_recycle_7',res);
})
app.get('/news_comment_science_recycle_8',function(req,res){
    selectMysql('news_comment_science_recycle_8',res);
})
app.get('/news_comment_science_recycle_9',function(req,res){
    selectMysql('news_comment_science_recycle_9',res);
})









//查询nba在回收站中的评论
app.get('/news_comment_nba_recycle_1',function(req,res){
    selectMysql('news_comment_nba_recycle_1',res);
})
app.get('/news_comment_nba_recycle_2',function(req,res){
    selectMysql('news_comment_nba_recycle_2',res);
})
app.get('/news_comment_nba_recycle_3',function(req,res){
    selectMysql('news_comment_nba_recycle_3',res);
})
app.get('/news_comment_nba_recycle_4',function(req,res){
    selectMysql('news_comment_nba_recycle_4',res);
})
app.get('/news_comment_nba_recycle_5',function(req,res){
    selectMysql('news_comment_nba_recycle_5',res);
})
app.get('/news_comment_nba_recycle_6',function(req,res){
    selectMysql('news_comment_nba_recycle_6',res);
})
app.get('/news_comment_nba_recycle_7',function(req,res){
    selectMysql('news_comment_nba_recycle_7',res);
})
app.get('/news_comment_nba_recycle_8',function(req,res){
    selectMysql('news_comment_nba_recycle_8',res);
})
app.get('/news_comment_nba_recycle_9',function(req,res){
    selectMysql('news_comment_nba_recycle_9',res);
})











//查询science-news评论
app.get('/news_comment_science_1',function(req,res){
    selectMysql('news_comment_science_1',res);
})

app.get('/news_comment_science_2',function(req,res){
    selectMysql('news_comment_science_2',res);
})
app.get('/news_comment_science_3',function(req,res){
    selectMysql('news_comment_science_3',res);
})
app.get('/news_comment_science_4',function(req,res){
    selectMysql('news_comment_science_4',res);
})
app.get('/news_comment_science_5',function(req,res){
    selectMysql('news_comment_science_5',res);
})
app.get('/news_comment_science_6',function(req,res){
    selectMysql('news_comment_science_6',res);
})
app.get('/news_comment_science_7',function(req,res){
    selectMysql('news_comment_science_7',res);
})
app.get('/news_comment_science_8',function(req,res){
    selectMysql('news_comment_science_8',res);
})
app.get('/news_comment_science_9',function(req,res){
    selectMysql('news_comment_science_9',res);
})






//查询nba-news评论
app.get('/news_comment_nba_1',function(req,res){
    selectMysql('news_comment_nba_1',res);
})

app.get('/news_comment_nba_2',function(req,res){
    selectMysql('news_comment_nba_2',res);
})
app.get('/news_comment_nba_3',function(req,res){
    selectMysql('news_comment_nba_3',res);
})
app.get('/news_comment_nba_4',function(req,res){
    selectMysql('news_comment_nba_4',res);
})
app.get('/news_comment_nba_5',function(req,res){
    selectMysql('news_comment_nba_5',res);
})
app.get('/news_comment_nba_6',function(req,res){
    selectMysql('news_comment_nba_6',res);
})
app.get('/news_comment_nba_7',function(req,res){
    selectMysql('news_comment_nba_7',res);
})
app.get('/news_comment_nba_8',function(req,res){
    selectMysql('news_comment_nba_8',res);
})
app.get('/news_comment_nba_9',function(req,res){
    selectMysql('news_comment_nba_9',res);
})







//nba评论表单上传数据post方法
app.post('/news_comment_nba_1',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_nba_1',param);
})
app.post('/news_comment_nba_2',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_nba_2',param);
})
app.post('/news_comment_nba_3',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_nba_3',param);
})
app.post('/news_comment_nba_4',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_nba_4',param);
})
app.post('/news_comment_nba_5',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_nba_5',param);
})
app.post('/news_comment_nba_6',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_nba_6',param);
})
app.post('/news_comment_nba_7',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_nba_7',param);
})
app.post('/news_comment_nba_8',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_nba_8',param);
})
app.post('/news_comment_nba_9',function(req,res){
    var author=req.body.author;
    var body=req.body.body;
    var param=[author,body];
    insertComment('news_comment_nba_9',param);
})





//查询recommend-news页面的详情消息
app.get('/select-recommend-newsDetail-1',urlencodedParser,function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_recommend',param,res);
});
app.get('/select-recommend-newsDetail-2',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_recommend',param,res);
})
app.get('/select-recommend-newsDetail-3',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_recommend',param,res);
})
app.get('/select-recommend-newsDetail-4',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_recommend',param,res);
})
app.get('/select-recommend-newsDetail-5',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_recommend',param,res);
})
app.get('/select-recommend-newsDetail-6',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_recommend',param,res);
})
app.get('/select-recommend-newsDetail-7',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_recommend',param,res);
})
app.get('/select-recommend-newsDetail-8',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_recommend',param,res);
})
app.get('/select-recommend-newsDetail-9',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_recommend',param,res);
})




//查询science-news页面的详情消息
app.get('/select-science-newsDetail-1',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_science',param,res);
});
app.get('/select-science-newsDetail-2',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_science',param,res);
})
app.get('/select-science-newsDetail-3',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_science',param,res);
})
app.get('/select-science-newsDetail-4',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_science',param,res);
})
app.get('/select-science-newsDetail-5',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_science',param,res);
})
app.get('/select-science-newsDetail-6',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_science',param,res);
})
app.get('/select-science-newsDetail-7',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_science',param,res);
})
app.get('/select-science-newsDetail-8',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_science',param,res);
})
app.get('/select-science-newsDetail-9',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_science',param,res);
})







//查询nba-news页面的详情消息
app.get('/select-nba-newsDetail-1',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_nba',param,res);
});
app.get('/select-nba-newsDetail-2',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_nba',param,res);
})
app.get('/select-nba-newsDetail-3',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_nba',param,res);
})
app.get('/select-nba-newsDetail-4',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_nba',param,res);
})
app.get('/select-nba-newsDetail-5',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_nba',param,res);
})
app.get('/select-nba-newsDetail-6',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_nba',param,res);
})
app.get('/select-nba-newsDetail-7',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_nba',param,res);
})
app.get('/select-nba-newsDetail-8',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_nba',param,res);
})
app.get('/select-nba-newsDetail-9',function(req,res){
    var param=[req.query.id];
    selectMysqloneData('news_nba',param,res);
})






//从数据库中查询recommend-entry中的内容
app.post('/select-recommend-entry-1',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_recommend',param,res);
});
app.post('/select-recommend-entry-2',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_recommend',param,res);
})
app.post('/select-recommend-entry-3',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_recommend',param,res);
})
app.post('/select-recommend-entry-4',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_recommend',param,res);
})
app.post('/select-recommend-entry-5',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_recommend',param,res);
})
app.post('/select-recommend-entry-6',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_recommend',param,res);
})
app.post('/select-recommend-entry-7',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_recommend',param,res);
})
app.post('/select-recommend-entry-8',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_recommend',param,res);
})
app.post('/select-recommend-entry-9',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_recommend',param,res);
})


//recommend-detail的修改页面
app.get('/recommend-entry-1',function(req,res){
    if(req.session.user) {
        res.render('recommend-entry-1.html');
    }else{
        res.redirect('/login')
    }
});
app.get('/recommend-entry-2',function(req,res){
    if(req.session.user) {
        res.render('recommend-entry-2.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/recommend-entry-3',function(req,res){
    if(req.session.user) {
        res.render('recommend-entry-3.html');
    }else{
    res.redirect('/login');
}
});
app.get('/recommend-entry-4',function(req,res){
    if(req.session.user) {
        res.render('recommend-entry-4.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/recommend-entry-5',function(req,res){
    if(req.session.user) {
        res.render('recommend-entry-5.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/recommend-entry-6',function(req,res){
    if(req.session.user) {
        res.render('recommend-entry-6.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/recommend-entry-7',function(req,res){
    if(req.session.user) {
        res.render('recommend-entry-7.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/recommend-entry-8',function(req,res){
    if(req.session.user) {
        res.render('recommend-entry-8.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/recommend-entry-9',function(req,res){
    if(req.session.user) {
        res.render('recommend-entry-9.html');
    }else{
        res.redirect('/login');
    }
})







//从数据库中查询science-entry中的内容
app.post('/select-science-entry-1',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_science',param,res);
});
app.post('/select-science-entry-2',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_science',param,res);
})
app.post('/select-science-entry-3',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_science',param,res);
})
app.post('/select-science-entry-4',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_science',param,res);
})
app.post('/select-science-entry-5',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_science',param,res);
})
app.post('/select-science-entry-6',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_science',param,res);
})
app.post('/select-science-entry-7',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_science',param,res);
})
app.post('/select-science-entry-8',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_science',param,res);
})
app.post('/select-science-entry-9',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_science',param,res);
})






//science-detail的修改页面
app.get('/science-entry-1',function(req,res){
    if(req.session.user) {
        res.render('science-entry-1.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/science-entry-2',function(req,res){
    if(req.session.user) {
        res.render('science-entry-2.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/science-entry-3',function(req,res){
    if(req.session.user){
        res.render('science-entry-3.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/science-entry-4',function(req,res){
    if(req.session.user) {
        res.render('science-entry-4.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/science-entry-5',function(req,res){
    if(req.session.user) {
        res.render('science-entry-5.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/science-entry-6',function(req,res){
    if(req.session.user) {
        res.render('science-entry-6.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/science-entry-7',function(req,res){
    if(req.session.user) {
        res.render('science-entry-7.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/science-entry-8',function(req,res){
    if(req.session.user) {
        res.render('science-entry-8.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/science-entry-9',function(req,res){
    if(req.session.user) {
        res.render('science-entry-9.html');
    }else{
        res.redirect('/login');
    }
})





//从数据库中查询nba-entry中的内容
app.post('/select-nba-entry-1',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_nba',param,res);
});
app.post('/select-nba-entry-2',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_nba',param,res);
})
app.post('/select-nba-entry-3',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_nba',param,res);
})
app.post('/select-nba-entry-4',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_nba',param,res);
})
app.post('/select-nba-entry-5',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_nba',param,res);
})
app.post('/select-nba-entry-6',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_nba',param,res);
})
app.post('/select-nba-entry-7',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_nba',param,res);
})
app.post('/select-nba-entry-8',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_nba',param,res);
})
app.post('/select-nba-entry-9',urlencodedParser,function(req,res){
    var param=[req.body.id];
    selectOneNews('news_nba',param,res);
})






//nba-detail的修改页面
app.get('/nba-entry-1',function(req,res){
    if(req.session.user) {
        res.render('nba-entry-1.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/nba-entry-2',function(req,res){
    if(req.session.user) {
        res.render('nba-entry-2.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/nba-entry-3',function(req,res){
    if(req.session.user) {
        res.render('nba-entry-3.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/nba-entry-4',function(req,res){
    if(req.session.user) {
        res.render('nba-entry-4.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/nba-entry-5',function(req,res){
    if(req.session.user) {
        res.render('nba-entry-5.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/nba-entry-6',function(req,res){
    if(req.session.user) {
        res.render('nba-entry-6.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/nba-entry-7',function(req,res){
    if(req.session.user) {
        res.render('nba-entry-7.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/nba-entry-8',function(req,res){
    if(req.session.user) {
        res.render('nba-entry-8.html');
    }else{
        res.redirect('/login');
    }
});
app.get('/nba-entry-9',function(req,res){
    if(req.session.user) {
        res.render('nba-entry-9.html');
    }else{
        res.redirect('/login');
    }
})







//进入评论recommend板块的正常评论审核页面
app.get("/recommend-normal-comment-review",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-normal-comment-review.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/recommend-normal-comment-review-1",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-normal-comment-review-1.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login')
    }
})
app.get("/recommend-normal-comment-review-2",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-normal-comment-review-2.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/recommend-normal-comment-review-3",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-normal-comment-review-3.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/recommend-normal-comment-review-4",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-normal-comment-review-4.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/recommend-normal-comment-review-5",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-normal-comment-review-5.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/recommend-normal-comment-review-6",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-normal-comment-review-6.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/recommend-normal-comment-review-7",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-normal-comment-review-7.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/recommend-normal-comment-review-8",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-normal-comment-review-8.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/recommend-normal-comment-review-9",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-normal-comment-review-9.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})




//进入评论science板块的正常评论审核页面
app.get("/science-normal-comment-review",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-normal-comment-review.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/science-normal-comment-review-1",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-normal-comment-review-1.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/science-normal-comment-review-2",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-normal-comment-review-2.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/science-normal-comment-review-3",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-normal-comment-review-3.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/science-normal-comment-review-4",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-normal-comment-review-4.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/science-normal-comment-review-5",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-normal-comment-review-5.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/science-normal-comment-review-6",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-normal-comment-review-6.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/science-normal-comment-review-7",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-normal-comment-review-7.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/science-normal-comment-review-8",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-normal-comment-review-8.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/science-normal-comment-review-9",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-normal-comment-review-9.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})








//进入评论nba板块的正常评论审核页面
app.get("/nba-normal-comment-review",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-normal-comment-review.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/nba-normal-comment-review-1",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-normal-comment-review-1.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/nba-normal-comment-review-2",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-normal-comment-review-2.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/nba-normal-comment-review-3",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-normal-comment-review-3.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/nba-normal-comment-review-4",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-normal-comment-review-4.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/nba-normal-comment-review-5",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-normal-comment-review-5.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/nba-normal-comment-review-6",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-normal-comment-review-6.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/nba-normal-comment-review-7",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-normal-comment-review-7.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/nba-normal-comment-review-8",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-normal-comment-review-8.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/nba-normal-comment-review-9",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-normal-comment-review-9.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})


//进入评论recommend板块的回收站的审核页面
app.get("/recommend-recycle-comment-review-1",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-recycle-comment-review-1.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/recommend-recycle-comment-review-2",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-recycle-comment-review-2.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/recommend-recycle-comment-review-3",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-recycle-comment-review-3.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/recommend-recycle-comment-review-4",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-recycle-comment-review-4.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/recommend-recycle-comment-review-5",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-recycle-comment-review-5.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/recommend-recycle-comment-review-6",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-recycle-comment-review-6.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/recommend-recycle-comment-review-7",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-recycle-comment-review-7.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/recommend-recycle-comment-review-8",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-recycle-comment-review-8.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/recommend-recycle-comment-review-9",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/recommend-recycle-comment-review-9.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})










//进入评论science板块的回收站的审核页面
app.get("/science-recycle-comment-review-1",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-recycle-comment-review-1.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/science-recycle-comment-review-2",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-recycle-comment-review-2.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/science-recycle-comment-review-3",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-recycle-comment-review-3.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/science-recycle-comment-review-4",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-recycle-comment-review-4.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/science-recycle-comment-review-5",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-recycle-comment-review-5.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/science-recycle-comment-review-6",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-recycle-comment-review-6.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/science-recycle-comment-review-7",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-recycle-comment-review-7.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/science-recycle-comment-review-8",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-recycle-comment-review-8.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/science-recycle-comment-review-9",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/science-recycle-comment-review-9.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})











//进入评论nba板块的回收站的审核页面
app.get("/nba-recycle-comment-review-1",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-recycle-comment-review-1.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/nba-recycle-comment-review-2",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-recycle-comment-review-2.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/nba-recycle-comment-review-3",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-recycle-comment-review-3.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/nba-recycle-comment-review-4",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-recycle-comment-review-4.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/nba-recycle-comment-review-5",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-recycle-comment-review-5.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/nba-recycle-comment-review-6",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-recycle-comment-review-6.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/nba-recycle-comment-review-7",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-recycle-comment-review-7.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/nba-recycle-comment-review-8",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-recycle-comment-review-8.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})
app.get("/nba-recycle-comment-review-9",function(req,res){
    if(req.session.user) {
        fs.readFile('../../html/nba-recycle-comment-review-9.html', function (err, fs) {
            if (err) {
                console.log(err);
            } else {
                res.end(fs.toString());
            }
        })
    }else{
        res.redirect('/login');
    }
})















//recommend板块将正常评论从正常数据库上删除的操作
app.post('/delete-normal-recommend-comment-1',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_1',param);
})
app.post('/delete-normal-recommend-comment-2',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_2',param);
})
app.post('/delete-normal-recommend-comment-3',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_3',param);
})
app.post('/delete-normal-recommend-comment-4',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_4',param);
})
app.post('/delete-normal-recommend-comment-5',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_5',param);
})
app.post('/delete-normal-recommend-comment-6',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_6',param);
})
app.post('/delete-normal-recommend-comment-7',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_7',param);
})
app.post('/delete-normal-recommend-comment-8',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_8',param);
})
app.post('/delete-normal-recommend-comment-9',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_9',param);
})










//science板块将正常评论从正常数据库上删除的操作
app.post('/delete-normal-science-comment-1',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_1',param);
})
app.post('/delete-normal-science-comment-2',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_2',param);
})
app.post('/delete-normal-science-comment-3',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_3',param);
})
app.post('/delete-normal-science-comment-4',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_4',param);
})
app.post('/delete-normal-science-comment-5',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_5',param);
})
app.post('/delete-normal-science-comment-6',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_6',param);
})
app.post('/delete-normal-science-comment-7',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_7',param);
})
app.post('/delete-normal-science-comment-8',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_8',param);
})
app.post('/delete-normal-science-comment-9',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_9',param);
})







//nba板块将正常评论从正常数据库上删除的操作
app.post('/delete-normal-nba-comment-1',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_1',param);
})
app.post('/delete-normal-nba-comment-2',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_2',param);
})
app.post('/delete-normal-nba-comment-3',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_3',param);
})
app.post('/delete-normal-nba-comment-4',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_4',param);
})
app.post('/delete-normal-nba-comment-5',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_5',param);
})
app.post('/delete-normal-nba-comment-6',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_6',param);
})
app.post('/delete-normal-nba-comment-7',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_7',param);
})
app.post('/delete-normal-nba-comment-8',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_8',param);
})
app.post('/delete-normal-nba-comment-9',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_9',param);
})










//将recommend回收站中的评论从回收站的数据库上删除的操作
app.post('/delete-recycle-recommend-comment-1',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_recycle_1',param);
})
app.post('/delete-recycle-recommend-comment-2',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_recycle_2',param);
})
app.post('/delete-recycle-recommend-comment-3',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_recycle_3',param);
})
app.post('/delete-recycle-recommend-comment-4',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_recycle_4',param);
})
app.post('/delete-recycle-recommend-comment-5',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_recycle_5',param);
})
app.post('/delete-recycle-recommend-comment-6',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_recycle_6',param);
})
app.post('/delete-recycle-recommend-comment-7',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_recycle_7',param);
})
app.post('/delete-recycle-recommend-comment-8',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_recycle_8',param);
})
app.post('/delete-recycle-recommend-comment-9',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_recommend_recycle_9',param);
})











//将science回收站中的评论从回收站的数据库上删除的操作
app.post('/delete-recycle-science-comment-1',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_recycle_1',param);
})
app.post('/delete-recycle-science-comment-2',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_recycle_2',param);
})
app.post('/delete-recycle-science-comment-3',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_recycle_3',param);
})
app.post('/delete-recycle-science-comment-4',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_recycle_4',param);
})
app.post('/delete-recycle-science-comment-5',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_recycle_5',param);
})
app.post('/delete-recycle-science-comment-6',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_recycle_6',param);
})
app.post('/delete-recycle-science-comment-7',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_recycle_7',param);
})
app.post('/delete-recycle-science-comment-8',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_recycle_8',param);
})
app.post('/delete-recycle-science-comment-9',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_science_recycle_9',param);
})











//将nba回收站中的评论从回收站的数据库上删除的操作
app.post('/delete-recycle-nba-comment-1',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_recycle_1',param);
})
app.post('/delete-recycle-nba-comment-2',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_recycle_2',param);
})
app.post('/delete-recycle-nba-comment-3',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_recycle_3',param);
})
app.post('/delete-recycle-nba-comment-4',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_recycle_4',param);
})
app.post('/delete-recycle-nba-comment-5',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_recycle_5',param);
})
app.post('/delete-recycle-nba-comment-6',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_recycle_6',param);
})
app.post('/delete-recycle-nba-comment-7',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_recycle_7',param);
})
app.post('/delete-recycle-nba-comment-8',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_recycle_8',param);
})
app.post('/delete-recycle-nba-comment-9',urlencodedParser,function(req,res){
    var param=[req.body.author];
    deleteMysqlComment('news_comment_nba_recycle_9',param);
})










//recommend板块将正常评论删除后存入回收站数据库的操作
app.post('/save-recommend-recycle-1',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_recycle_1',param);
})
app.post('/save-recommend-recycle-2',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_recycle_2',param);
})
app.post('/save-recommend-recycle-3',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_recycle_3',param);
})
app.post('/save-recommend-recycle-4',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_recycle_4',param);
})
app.post('/save-recommend-recycle-5',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_recycle_5',param);
})
app.post('/save-recommend-recycle-6',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_recycle_6',param);
})
app.post('/save-recommend-recycle-7',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_recycle_7',param);
})
app.post('/save-recommend-recycle-8',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_recycle_8',param);
})
app.post('/save-recommend-recycle-9',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_recycle_9',param);
})










//science板块将正常评论删除后存入回收站数据库的操作
app.post('/save-science-recycle-1',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_recycle_1',param);
})
app.post('/save-science-recycle-2',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_recycle_2',param);
})
app.post('/save-science-recycle-3',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_recycle_3',param);
})
app.post('/save-science-recycle-4',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_recycle_4',param);
})
app.post('/save-science-recycle-5',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_recycle_5',param);
})
app.post('/save-science-recycle-6',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_recycle_6',param);
})
app.post('/save-science-recycle-7',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_recycle_7',param);
})
app.post('/save-science-recycle-8',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_recycle_8',param);
})
app.post('/save-science-recycle-9',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_recycle_9',param);
})









//nba板块将正常评论删除后存入回收站数据库的操作
app.post('/save-nba-recycle-1',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_recycle_1',param);
})
app.post('/save-nba-recycle-2',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_recycle_2',param);
})
app.post('/save-nba-recycle-3',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_recycle_3',param);
})
app.post('/save-nba-recycle-4',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_recycle_4',param);
})
app.post('/save-nba-recycle-5',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_recycle_5',param);
})
app.post('/save-nba-recycle-6',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_recycle_6',param);
})
app.post('/save-nba-recycle-7',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_recycle_7',param);
})
app.post('/save-nba-recycle-8',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_recycle_8',param);
})
app.post('/save-nba-recycle-9',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_recycle_9',param);
})












//将recommend回收站的评论还原后存入正常评论数据库的操作
app.post('/save-recommend-normal-1',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_1',param);
})
app.post('/save-recommend-normal-2',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_2',param);
})
app.post('/save-recommend-normal-3',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_3',param);
})
app.post('/save-recommend-normal-4',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_4',param);
})
app.post('/save-recommend-normal-5',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_5',param);
})
app.post('/save-recommend-normal-6',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_6',param);
})
app.post('/save-recommend-normal-7',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_7',param);
})
app.post('/save-recommend-normal-8',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_8',param);
})
app.post('/save-recommend-normal-9',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_recommend_9',param);
})










//将science回收站的评论还原后存入正常评论数据库的操作
app.post('/save-science-normal-1',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_1',param);
})
app.post('/save-science-normal-2',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_2',param);
})
app.post('/save-science-normal-3',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_3',param);
})
app.post('/save-science-normal-4',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_4',param);
})
app.post('/save-science-normal-5',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_5',param);
})
app.post('/save-science-normal-6',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_6',param);
})
app.post('/save-science-normal-7',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_7',param);
})
app.post('/save-science-normal-8',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_8',param);
})
app.post('/save-science-normal-9',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_science_9',param);
})











//将nba回收站的评论还原后存入正常评论数据库的操作
app.post('/save-nba-normal-1',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_1',param);
})
app.post('/save-nba-normal-2',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_2',param);
})
app.post('/save-nba-normal-3',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_3',param);
})
app.post('/save-nba-normal-4',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_4',param);
})
app.post('/save-nba-normal-5',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_5',param);
})
app.post('/save-nba-normal-6',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_6',param);
})
app.post('/save-nba-normal-7',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_7',param);
})
app.post('/save-nba-normal-8',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_8',param);
})
app.post('/save-nba-normal-9',urlencodedParser,function(req,res){
    var param=[req.body.author,req.body.body];
    insertComment('news_comment_nba_9',param);
})














//进入后台登录页面
app.get('/login',function(req,res){
    if(req.session.user) {
        res.render('login', {tip: ''})
    }else{
        if(req.session.visited){
            res.render('login',{tip:'请输入正确信息'});
        }else{
            res.render('login',{tip:''});
        }
    }
})
app.post('/login',urlencodedParser,function(req,res){
if(req.body.username=='wsg'&&req.body.password=='wsgwsg'){
    var user={'username':'wsg'};
    req.session.user=user;
    res.redirect('/backstage')
}else{
    var visited={isVisited:true};
    req.session.user=null;
    req.session.visited=visited;
res.redirect('/login');
}
})


//后台连接数据库删除评论操作
function deleteMysqlComment(tableName,param){
    var connection=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'wsgtom1121',
        database:'news',
        port:'3306'
    });
    connection.connect(function(err){
        if(err){
            console.log(err);
        }else{
            console.log(tableName+'数据库连接成功');
        }
    });
    connection.query('delete from '+tableName+' where author=?',param,function(err,rs){
        if(err){
            console.log(err);
        }else{
            console.log('正常评论删除成功');
        }
    });
    connection.end(function(err){
        if(err){
            console.log(err);
        }else{
            console.log(tableName+'关闭成功');
        }
    })
}



//查询单条数据操作
function selectMysqloneData(tableName,param,res){
    var connection=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'wsgtom1121',
        database:'news',
        port:'3306'
    });
    connection.connect(function(err){
        if(err){
            console.log(err);
        }else{
            console.log(tableName+'数据库连接成功');
        }
    });
    connection.query('select * from '+tableName +' where id=?',param,function(err,rs){
        if(err){
            console.log(err);
        }else{
            var data=JSON.stringify(rs);
            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
            res.end(data);
            console.log(tableName+'查询数据成功');
        }
    });
    connection.end(function(err){
        if(err){
            console.log(err);
        }else{
            console.log(tableName+'数据库关闭成功');
        }
    })
}


//查询整个数据库操作



function selectMysql(tableName,res){
    var connection=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'wsgtom1121',
        database:'news',
        port:'3306'
    });
    connection.connect(function(err){
        if(err){
            console.log(err);
        }else{
            console.log(tableName+'数据库连接成功');
        }
    });
    connection.query('select * from '+tableName,function(err,rs){
        if(err){
            console.log('select'+err);
        }else{
            var data=JSON.stringify(rs);
            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
            res.end(data);
        }
    });
    connection.end(function(err){
        if(err){
            console.log(err);
        }else{
            console.log(tableName+'数据库关闭成功');
        }
    })
}
//删除数据库数据操作



function deleteMysql(tableName,param){
    var connection=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'wsgtom1121',
        database:'news',
        port:'3306'
    });
    connection.connect(function(err){
        if(err){
            console.log(err);
        }else{
            console.log(tableName+'数据库连接成功');
        }
    });
    connection.query('delete from '+tableName+' where id=?',param,function(err,rs){
        if(err){
            console.log('delete-'+err);
        }else{
            console.log(tableName+'数据删除成功');
        }
    });
    connection.end(function(err){
        if(err){
            console.log(err);
        }else{
            console.log(tableName+'数据库关闭成功');
        }
    })
}
//插入数据库操作


function insertMysql(tableName,param){
    var connection=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'wsgtom1121',
        database:'news',
        port:'3306'
    });
    connection.connect(function(err){
        if(err){
            console.log(err);
        }else{
            console.log(tableName+'数据库连接成功');
        }
    });

    connection.query('insert into '+tableName+ '(id,title,content,src) values (?,?,?,?)',param,function (err,rs) {
            if (err) {
                console.log(tableName + 'insert err' + err);
            } else {
                console.log(tableName + 'insert success');
            }
        });

    connection.end(function(err){
        if(err){
            console.log(tableName+'数据库关闭失败');
        }else{
            console.log(tableName+'数据库关闭成功');
        }
    })
}


//评论插入数据库操作

function insertComment(tableName,param){
    var connection=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'wsgtom1121',
        database:'news',
        port:'3306'
    });
    connection.connect(function(err){
        if(err){
            console.log(err);
        }else{
            console.log(tableName+'连接成功')
        }
    });
    connection.query('insert into '+tableName+' (author,body) values (?,?)',param,function(err){
        if(err){
            console.log('insert '+err);
        }else{
            console.log('insert success');
        }
    });
    connection.end(function(err){
        if(err){
            console.log(tableName+'关闭失败');
        }else{
            console.log(tableName+'关闭成功')
        }
    })
}


//更新数据库的内容
function updateNews(tableName,param){
    var connection=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'wsgtom1121',
        database:'news',
        port:'3306'
    });
    connection.connect(function(err){
        if(err){
            console.log(err);
        }else{
            console.log(tableName+'连接成功');
        }
    });
    connection.query('update '+tableName+' set title=?,content=?,src=? where id=?',param,function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log(tableName+'信息更新成功');
        }
    });
    connection.end(function(err){
        if(err){
            console.log(err);
        }else{
            console.log(tableName+'更新信息完毕');
        }
    })
};

function selectOneNews(tableName,param,res){
    var connection=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'wsgtom1121',
        database:'news',
        port:'3306'
    });
    connection.connect(function(err){
        if(err){
            console.log(err);
        }else{
            console.log(tableName+'连接成功');
        }
    });
    connection.query('select * from '+tableName+' where id=?',param,function(err,fs){
        if(err){
            console.log(err);
        }else{
            res.end(JSON.stringify(fs[0]));
        }
    });
    connection.end(function(err){
        if(err){
            console.log(err);
        }else{
            console.log(tableName+'关闭成功');
        }
    })
}



app.listen(8888, function () {
    console.log('app listen : 8888');
});


module.exports = app;
