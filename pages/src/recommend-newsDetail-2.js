import React from 'react'
import ReactDOM from 'react-dom'
import '../src/newsDetail.css'
var initstyle= {
    display:'inline-block',
    padding:'6px 12px',
    'border-radius':'4px',
    color:'#333',
    background:'#fff',
    border:'1px solid #ccc',
    cursor:'pointer',
    float:'right'
};
var changestyle={
    display:'inline-block',
    padding:'6px 12px',
    'border-radius':'4px',
    color:'#fff',
    background:'#337ab7',
    border:'1px solid #ccc',
    cursor:'pointer',
    float:'right'
}
var Praise=React.createClass({
    getInitialState:function(){
        return {
            isLiked:false,
            num:0
        };
    },
    handleClick:function(){
        var style;
        this.setState({
            isLiked:!this.state.isLiked,
        });
        if(this.state.isLiked==false){
            this.state.num++;
        }else{
            this.state.num--;
        }
    },
    render:function(){
        var status=this.state.isLiked?'取消点赞':'点赞';
        var style;
        if(this.state.isLiked==true){
            style=changestyle;
        }else{
            style=initstyle;
        }
        return (
            <div onClick={this.handleClick} className="wrap" ref="wrap" style={style}>
            {status}
            <span style={{paddingLeft:"2px"}}>{this.state.num}</span>
        </div>

        )
    }
});
var News=React.createClass({
    render:function(){
        return (
            <div className="news">
            <div className="news-title">{this.props.title}</div>
        <div className='img-wrap'>
            <img src={this.props.src}/>
        </div>
        <div className="news-body">{this.props.content}</div>
        </div>
        )
    }
})
var NewsDetail=React.createClass({
    render:function(){
        var newsNode=this.props.content.map(function(news,index){
            return <News key={'news-'+index} title={news.title} src={news.src} content={news.content}></News>
        });
        return (
            <div>
            {newsNode}
            </div>
        )
    }
});
var Comment=React.createClass({
    render:function(){
        return (
            <div>
            <div className="comment-body">
            {this.props.children}
        </div>
        <div className="comment-author">
            -{this.props.author}
        </div>
        </div>
        )
    }
})
var CommentList=React.createClass({

    render:function(){
        var commentsNode=this.props.comments.map(function(comment,index){
            return <Comment key={'comment-'+index} author={comment.author}>{comment.body}</Comment>
        });
        return (
            <div className="comment-list">
            {commentsNode}
            </div>
        )
    }
});
var CommentBox=React.createClass({
    getInitialState:function(){
        return {comments:this.props.comments || [],
            newsDetail:this.props.newsDetail || []
        }
    },
    loadCommentsFromServer:function(){
        $.ajax({
            url:this.props.url,
            dataType:'json',
            success:function(comments){
                this.setState({comments:comments});
            }.bind(this),
            error:function(xhr,status,err){
                console.log(err.toString());
            }
        });
    },
    loadNewsFromServer:function(){
        var id2=localStorage.getItem('recommend-entry-2');
        $.ajax({
            url:this.props.newsurl,
            data:{id:id2},
            dataType:'json',
            success:function(news){
                this.setState({newsDetail:news});
            }.bind(this),
            error:function(xhr,status,err){
                console.log(err.toString());
            }
        })
    },
    componentDidMount:function(){
        this.loadCommentsFromServer();
        this.loadNewsFromServer();
    },
    render:function(){
        return (
            <div className="comment-box">
            <NewsDetail content={this.state.newsDetail}/>
        <Praise />
        <h1>评论</h1>
        <CommentList comments={this.state.comments}/>
        <a className="commentPage" href={'/recommend-comment-2'}>评论页</a>
            </div>
        );
    }
});
ReactDOM.render(
<CommentBox url="/news_comment_recommend_2" newsurl="/select-recommend-newsDetail-2" />,
    document.getElementById('content')

);

