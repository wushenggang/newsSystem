import React from 'react'
import ReactDOM from 'react-dom'
import '../src/newsComment.css'
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
var CommentForm=React.createClass({
    handleSubmit:function(event){
        event.preventDefault();
        var author=ReactDOM.findDOMNode(this.refs.author).value.trim();
        var body=ReactDOM.findDOMNode(this.refs.body).value.trim();
        var form=ReactDOM.findDOMNode(this.refs.form);
        this.props.onSubmit({author:author,body:body});
        form.reset();
    },
    render:function(){
        return (
            <form className="comment-form" ref="form" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="your name" ref="author"/>
            <input type="text" placeholder="Input your comment" ref="body"/>
            <input type="submit" value="Add Comment"/>
            </form>
        )
    }
});
var CommentBox=React.createClass({
    getInitialState:function(){
        return {comments:this.props.comments || []}
    },
    loadDataFromServer:function(){
        $.ajax({
            url:this.props.url,
            dataType:'json',
            success:function(comments){
                this.setState({comments:comments})
            }.bind(this),
            error:function(xhr,status,err){
                console.log(err.toString());
            }
        });
    },
    componentDidMount:function(){
        this.loadDataFromServer();
    },
    handleNewComment(comment){
        $.ajax({
            url:this.props.url,
            dataType:'json',
            type:'POST',
            data:comment,
            success:function(comments){
                this.setState({comments:comments});
            }.bind(this),
            error:function(xhr,status,err){
                console.log(err.toString());
            }
        });
    },
    render:function(){
        return (
            <div className="comment-box">
            <h1>comments</h1>
            <CommentList comments={this.state.comments}/>
        <CommentForm onSubmit={this.handleNewComment}/>
        </div>
        );
    }
});
ReactDOM.render(
<CommentBox url="/news_comment_science_3"/>,
    document.getElementById('content')

);

