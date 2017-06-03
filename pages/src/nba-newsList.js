import React from 'react'
import ReactDOM from 'react-dom'
import '../src/newsList.css'
import ReactPullLoad,{STATS} from './index.js'
import './App.css'
var defaultStyle={
    width:"100%",
    textAlign:"center",
    fontSize:"20px",
    lineHeight:"1.5"
}
var loadMoreLimitNum=2;//最多可以加载新闻的次数
var num=5
var initDataNum=num; //初始显示的新闻数目
var newsDetailUrl=[];
var cData=[];
var initcData=[];
var App=React.createClass({
    getInitialState: function () {
        return {hasMore: true, data:cData, action: STATS.init, index:loadMoreLimitNum}
    },
    loadDataFromServer:function(){
        var that=this;
        $.ajax({
            url:that.props.url,
            dataType:'json',
            success:function(cData){
                var i;
                for(i=0;i<initDataNum;i++){
                    initcData[i]=cData[i];
                };
                that.setState({data:initcData});
            },
            err:function(xhr,status,err){
                console.log(err.toString());
            }
        });
        $.ajax({
            url:that.props.linkUrl,
            dataType:"json",
            async:false,
            success:function(urls){
                urls.map(function(url,index){
                    newsDetailUrl[index]=url;
                });
            }
        });
    },
    componentDidMount:function(){
        this.loadDataFromServer();
    },
    handleAction:function(action){
        /*console.log(action,this.state.action,action===this.state.action);*/
        //新的状态不能和旧的状态一样
        if(action===this.state.action||
            action===STATS.refreshing&&this.state.action===STATS.loading||
            action===STATS.loading&&this.state.action===STATS.refreshing){
            /*console.info("It's same action or on loading or on refreshing",action,this.state.action===this.state.action);*/
            return false
        }
        if(action===STATS.refreshing){
            var that=this;
            initDataNum=num;
            setTimeout(function(){
                //完全刷新
                length=cData.length;
                that.setState({
                    data:initcData,
                    hasMore:true,
                    action:STATS.refreshed,
                    index:loadMoreLimitNum,
                });
                var hour=new Date().getHours();
                var minute=new Date().getMinutes();
                var second=new Date().getSeconds();
                console.log(hour+":"+minute+":"+second);
                console.log(that.state.data);
            },2000);
        } else if(action===STATS.loading){//加载更多
            var that=this;
            setTimeout(function(){
                if(that.state.index===0){
                    that.setState({
                        action:STATS.reset,
                        hasMore:false
                    });
                }else{
                    $.ajax({
                        url:that.props.url,
                        dataType:"json",
                        async:false,
                        success:function(cData){
                            that.setState({
                                data:[...that.state.data,cData[initDataNum++],cData[initDataNum++]],
                            action:STATS.reset,
                                index:that.state.index-1

                        });
                            console.log(that.state.data);
                        },
                        err:function(xhr,status,err){
                            console.log(err.toString());
                        }
                    })
                }
            },2000);
        }
        this.setState({
            action:action
        })
    },
    render:function(){
        var data=this.state.data;
        var hasMore=this.state.hasMore;
        return (
            <div>
            <ReactPullLoad
        className="block"
        isBlockContainer={true}
        downEnough={150}
        action={this.state.action}
        handleAction={this.handleAction}
        hasMore={hasMore}
        distanceBottom={1000}>
            <div className="bg clearfix">
                <div className="header clearfix">
                    <div className="wrap clearfix">
                        <a href="/recommend" className="first-item">推荐</a>
                        <a href="/science">科技</a>
                        <a href="" className="active">NBA</a>
                    </div>
                </div>
            </div>
            <ul>
            {
                data.map(function(news,index){
                return <div className="content-box clearfix">
                    <a href={'/nba-newsDetail-'+(++index)}>
                        <div className="clearfix">
                    <img src={news.src} alt="" className="content-pic"/>
                    <div className="content-title">{news.title}</div>
                    </div>
                <div className="content-body">{news.content}</div>
                </a>
                </div>
            })
    }
        </ul>
        </ReactPullLoad>
        </div>
        )
    }

});
ReactDOM.render(
<App url="/newsList-nba"/>,
    document.getElementById("content")
);
