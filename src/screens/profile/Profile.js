import React, {Component} from 'react';
import { 
    Grid,
    Typography,
    Avatar,
    Button,
    Paper,
    Modal
 } from '@material-ui/core/';
 import EditIcon from "@material-ui/icons/Edit";
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
            filteredImages: [],
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

        }
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
    

    render() {
        return (
            <div>
                <Header {...this.props} history={this.props.history} showProfilePic="true" />
                <div className="profile-information">
                        <Grid container spacing={4}>
                            <Grid item>
                                <Avatar variant="circle" src={profile_pic} className='avatar' />
                            </Grid>
                            <Grid item xs={12} sm container>
                                <Grid container item xs={12} style={{ alignItems: "center"}}>
                                    <Typography variant="h5">
                                        EswarchandKeta
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
            </div>
        )
    }
}

export default Profile;