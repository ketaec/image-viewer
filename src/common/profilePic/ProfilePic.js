import React, { Component } from "react";
import "./ProfilePic.css";
import { Avatar, IconButton,  Menu,  MenuItem,  Typography, Divider} from "@material-ui/core";
import profile_pic from "../../assets/images/profile_pic.png";

class ProfilePic extends Component {
    constructor(props) {
        super();
        this.state = {
            menuState: false,
            anchorEl: null
        };
    }

    onProfileIconClick = (e) => {
        this.setState({menuState: !this.state.menuState,anchorEl: e.currentTarget });
    };
    
    onMenuClose = () => {
        this.setState({ menuState: !this.state.menuState, anchorEl: null });
    };

    onLogoutHandler = () => {
        sessionStorage.clear();
        this.props.history.push("/");
    };

    myAccountHandler = () => {
        this.props.history.replace("/profile");
    };

    render() { 
        return (
            <>
                <IconButton id="profile-icon" onClick={this.onProfileIconClick} style={{"marginBottom": 15}}>
                    <Avatar
                    alt="profile_picture"
                    src={profile_pic}
                    />
                </IconButton>
                <div>
                    <Menu
                        open={this.state.menuState}
                        onClose={this.onMenuClose}
                        anchorEl={this.state.anchorEl}
                        getContentAnchorEl={null}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        keepMounted
                    >
                        <MenuItem onClick={this.myAccountHandler}>
                            <Typography>My Account</Typography>
                        </MenuItem>
                        <Divider variant="middle" />
                        <MenuItem onClick={this.onLogoutHandler}>
                            <Typography>Logout</Typography>
                        </MenuItem>
                    </Menu>
                </div>
            </>
        )
    }
}

export default ProfilePic;