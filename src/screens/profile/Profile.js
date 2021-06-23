import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import { 
    Grid,
    Typography,
    Avatar,
    Button,
    Modal,
    GridListTile,
    GridList,
    Divider,
    TextField
 } from '@material-ui/core/';
import EditIcon from "@material-ui/icons/Edit";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import './Profile.css';
import Header from '../../common/header/Header';
import profile_pic from "../../assets/images/profile_pic.png";

class Profile extends Component { 
    constructor() {
        super();
        this.state = {
            userPosts: [],
            // filteredImages: [],
            username: '', 
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            followed_by: 6,
            follows: 4,
            mediaCount: 6, // get it from api
            fullName: "Eswar chand Keta",
            editModal: false,
            name: "",
            fullnameRequired: "dispNone",
            editfullname: "",
            openPostModal: false,
            selectedPost: {},

        }
    }

    async componentDidMount() {
        let getUserPosts = this.props.baseUrl + "me/media?fields=id,caption&access_token=" + sessionStorage.getItem("access-token");
        let getPostDetails = this.props.baseUrl + "$postId?fields=id,media_type,media_url,username,timestamp&access_token=" + sessionStorage.getItem("access-token");

        let response = await fetch(getUserPosts);
        let posts = await response.json();
        posts = posts.data;

        for (let i = 0; i < posts.length; i++) {
            response = await fetch(getPostDetails.replace('$postId', posts[i].id));
            let details = await response.json();
            posts[i].index = i;
            posts[i].url = details.media_url;
            posts[i].username = details.username;
            posts[i].timestamp = details.timestamp;
            posts[i].comments = [];
            posts[i].likes = Math.round(Math.random() * 100); 
            posts[i].isLiked = false; 

            let captionAndTags = posts[i].caption.split("\n");
            for(let captionAndTag of captionAndTags) {
                if(captionAndTag.charAt(0) === "#") {
                    posts[i].tags = captionAndTag; 
                } else {
                    posts[i].caption = captionAndTag;
                }
            }
            this.setState({ username: details.username });
        }
        this.setState({ userPosts: posts });
        this.setState({ mediaCount: posts.length });

    }

    editModalHandler = () => {
        this.setState({ editModal: true, editfullname: "" });
    };

    modalCloseHandler = () => {
        this.setState({ editModal: false });
    };

    submitModalHandler = () => {
        this.state.editfullname === "" 
        ? this.setState({ fullnameRequired: "dispBlock" }) 
        : this.setState({ fullName: this.state.editfullname, editModal: false, fullnameRequired: "dispNone" });
    }

    inputFullnameChangeHandler =(e) => {
        this.setState({ editfullname: e.target.value });
    }

    postModalOpenHandler = (postId) => { 
        let selectPost = this.state.userPosts.filter((post) => {
            return post.id === postId;
        })[0];
        console.log(postId, selectPost);
        this.setState({ openPostModal: true, selectedPost: selectPost });
    }

    postModalCloseHandler = () => {
        this.setState({ openPostModal: false });
    }

    likeHandler = (details) => {
        details.isLiked = !details.isLiked;
        this.setState({selectedPost: details})
    }

    commentHandler = (details, pos) => {
        var textField = document.getElementById("textfield-" + pos);
        if (textField.value == null || textField.value.trim() === "") {
            return;
        }

        details.comments = details.comments.concat([textField.value]);
        textField.value = "";

        this.setState({selectedPost: details})
    }
    

    render() {
        if (this.state.loggedIn === false) return <Redirect to="/" />
        else
            return (
                <div>
                    <Header {...this.props} history={this.props.history} showProfilePic="true" />
                    <div className="profile-information">
                        <Grid container spacing={4}>
                            <Grid item>
                                <Avatar variant="circle" src={profile_pic} className='profile-avatar' />
                            </Grid>
                            <Grid item xs={12} sm container>
                                <Grid container item xs={12} style={{ alignItems: "center"}}>
                                    <Typography variant="h5">
                                        {this.state.username}
                                    </Typography>
                                </Grid>
                                <Grid item container xs={4}>
                                    <Typography variant="body2" >
                                        Posts: {this.state.mediaCount}
                                    </Typography>
                                </Grid>
                                <Grid item container  xs={4}>
                                    <Typography variant="body2" gutterBottom>
                                        Follows: {this.state.follows}
                                    </Typography>
                                </Grid>
                                <Grid item container xs={4}>
                                    <Typography variant="body2" gutterBottom>
                                        Followed By: {this.state.followed_by}
                                    </Typography>
                                </Grid>
                                <Grid item container xs={12}>
                                    <Typography variant="h6" gutterBottom style={{marginTop: 15}}>
                                        {this.state.fullName}
                                    </Typography>
                                    <Button className="edit-button" color="secondary" style={{background:"#f50057"}} onClick={this.editModalHandler}>
                                        <EditIcon />
                                    </Button>
                                </Grid>
                                <Modal open={this.state.editModal} onClose={this.modalCloseHandler} >
                                    <div className="modal-div">
                                        <div style={{fontSize:24, fontWeight:600}}>Edit</div>
                                        <br />
                                        <FormControl required className="form-control">
                                            <InputLabel htmlFor="fullname">Full Name</InputLabel>
                                            <Input id="fullname" type="text" fullname={this.state.editfullname} onChange={this.inputFullnameChangeHandler} />
                                            <FormHelperText className={this.state.fullnameRequired}>
                                                <span className="red">required</span>
                                            </FormHelperText>
                                        </FormControl>
                                        <br /> <br /> <br />
                                        <Button className="modal-button" color="primary" variant="contained" onClick={this.submitModalHandler}>
                                            UPDATE
                                        </Button>
                                    </div>
                                </Modal>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="profile-grid">
                        <GridList cellHeight={400} cols={3}>
                            {this.state.userPosts.map((post) => (
                                <GridListTile key={"grid" + post.id}
                                    onClick={() => this.postModalOpenHandler(post.id)}>
                                    <img src={post.url} alt={this.state.fullName} />
                                </GridListTile>
                            ))}
                        </GridList>
                        <Modal open={this.state.openPostModal} onClose={this.postModalCloseHandler} >
                            <div className="post-modal-div">
                                <Grid container spacing={4} className="post-modal-grid">
                                    <Grid item>
                                        <img src={this.state.selectedPost.url} alt={this.state.fullName} height="400" />
                                    </Grid>
                                    <Grid item sm>
                                        <div className="post-header">
                                            <div className="post-avatar"> 
                                                <Avatar variant="circle" src={profile_pic} />
                                            </div>
                                            <div className="post-user">{this.state.selectedPost.username}</div>
                                        </div>

                                        <Grid item xs={12}>
                                            <Divider variant="middle" style={{height:1, margin:0}} />
                                        </Grid>
                                        <Grid item xs={12} style={{marginTop:10}}>
                                            <Typography variant="body2">
                                                {this.state.selectedPost.caption}
                                            </Typography>
                                            <Typography variant="body2" className="tags">
                                                {this.state.selectedPost.tags}
                                            </Typography>
                                        </Grid>
                                            <div className='comments-container'>
                                                {
                                                    this.state.selectedPost.comments ?
                                                        this.state.selectedPost.comments.map((comment, index) => (
                                                            <p key={index}>
                                                                <b>{this.state.username}</b> : {comment}
                                                            </p>
                                                        ))
                                                        :
                                                        <p></p>
                                                }
                                            </div>
                                            <div className='likes'>
                                                    {
                                                        this.state.selectedPost.isLiked ?
                                                            <FavoriteIcon fontSize='default' style={{ color: "red" }} onClick={() => this.likeHandler(this.state.selectedPost)} />
                                                            :
                                                            <FavoriteBorderIcon fontSize='default' onClick={() => this.likeHandler(this.state.selectedPost)} />
                                                    }
                                                    <Typography>
                                                        <span>&nbsp;{this.state.selectedPost.isLiked ? (this.state.selectedPost.likes+1) + ' likes' : this.state.selectedPost.likes + ' likes'}</span>
                                                    </Typography>
                                            </div>
                                            <div className='post-comment-container'>
                                                    <FormControl className='post-comment-form-control'>
                                                        <TextField id={'textfield-' + this.state.selectedPost.index} label="Add a comment" />
                                                    </FormControl>
                                                    <FormControl className="add-button">
                                                        <Button variant='contained' color='primary' onClick={() => this.commentHandler(this.state.selectedPost, this.state.selectedPost.index)}>ADD</Button>
                                                    </FormControl>
                                            </div>
                                    </Grid>
                                </Grid>
                            </div>

                        </Modal>
                    </div>
                </div>
            )
    }
}

export default Profile;