import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import {
    Avatar,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Container,
    Divider,
    FormControl,
    Grid,
    TextField, Typography
} from '@material-ui/core'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Header from '../../common/header/Header';
import profile_pic from "../../assets/images/profile_pic.png";
import './Home.css'

class Home extends Component { 
    constructor() {
        super();
        this.state = {
            searchText: "",
            userPosts: [],
            filteredImages: [],
            username: '', 
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true
        }
    }

    async componentDidMount() {
        let getUserImages = this.props.baseUrl + "me/media?fields=id,caption&access_token=" + sessionStorage.getItem("access-token");
        let getPostDetails = this.props.baseUrl + "$postId?fields=id,media_type,media_url,username,timestamp&access_token=" + sessionStorage.getItem("access-token");

        let response = await fetch(getUserImages);
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
        this.setState({ filteredImages: posts.filter(x => true) }); 

    }

    likeHandler = (details) => {
        let index = details.index;
        let likedImages = this.state.userPosts;
        likedImages[index].isLiked = !likedImages[index].isLiked;
        this.setState({'userPosts': likedImages})
    }

    commentHandler = (details, pos) => {
        let index = details.index;
        var textField = document.getElementById("textfield-" + pos);
        if (textField.value == null || textField.value.trim() === "") {
            return;
        }
        let userImagesTemp = this.state.userPosts;
        if (userImagesTemp[index].comments === undefined) {
            userImagesTemp[index].comments = [textField.value];
        } else {
            userImagesTemp[index].comments = userImagesTemp[index].comments.concat([textField.value]);
        }

        textField.value = "";

        this.setState({'userPosts': userImagesTemp})
    }

    searchHandler = (e) => {
        if (this.state.searchText == null || this.state.searchText.trim() === "") {
            this.setState({filteredImages: this.state.userPosts});
        } else {
            let filteredForSearch = this.state.userPosts.filter((element) => {
                return element.caption !== undefined && (element.caption.toLowerCase().split("\n")[0].indexOf(e.target.value.toLowerCase())) > -1
            });
            this.setState({filteredImages: filteredForSearch});
        }
    }

    handleChange = (e) => {
        this.setState({'searchText': e.target.value}, () => {
            this.searchHandler(e);
        });
    };

    render() {
        if (sessionStorage.getItem("access-token") == null) return <Redirect to="/" />
        else
            return (
                <div>
                    <Header {...this.props} history={this.props.history} showSearchbar="true" handleChange={this.handleChange} />
                    <Container className='posts-container'>
                        <Grid container alignContent='center' justify='flex-start' direction='row' spacing={2}>
                            {
                                (this.state.filteredImages || []).map((details, index) => (
                                    <Grid item xs={6} key={details.id+"_img"}>
                                        <Card key={details.id}>

                                            <CardHeader
                                                avatar={<Avatar variant="circle" src={profile_pic} className='avatar' />}
                                                title={details.username}
                                                subheader={new Date(details.timestamp).toLocaleString().replace(",","")} />

                                            
                                            <CardMedia style={{ height: 0, paddingTop: '80%', marginBottom: 10 }} image={details.url} />
                                            <Divider variant="middle" />
                                            <CardContent>
                                                <div className='caption'>{details.caption}</div>
                                                <div className='tags'> {details.tags} </div>
                                                <br />
                                                <div className='likes'>
                                                    {
                                                        details.isLiked ?
                                                            <FavoriteIcon fontSize='default' style={{ color: "red" }} onClick={() => this.likeHandler(details)} />
                                                            :
                                                            <FavoriteBorderIcon fontSize='default' onClick={() => this.likeHandler(details)} />
                                                    }
                                                    <Typography>
                                                        <span>&nbsp;{details.isLiked ? (details.likes+1) + ' likes' : details.likes + ' likes'}</span>
                                                    </Typography>
                                                </div>

                                                <div id='comments-container'>
                                                    {
                                                        details.comments ?
                                                            details.comments.map((comment, index) => (
                                                                <p key={index}>
                                                                    <b>{this.state.username}</b> : {comment}
                                                                </p>
                                                            ))
                                                            :
                                                            <p></p>
                                                    }
                                                </div>

                                                <div className='post-comment-container'>
                                                    <FormControl className='post-comment-form-control'>
                                                        <TextField id={'textfield-' + index} label="Add a comment" />
                                                    </FormControl>
                                                    <FormControl className="add-button">
                                                        <Button variant='contained' color='primary' onClick={() => this.commentHandler(details, index)}>ADD</Button>
                                                    </FormControl>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Container>
                </div>
            )
    }
}

export default Home;