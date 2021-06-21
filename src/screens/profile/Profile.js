import React, {Component} from 'react';
import './Profile.css';
import Header from '../../common/header/Header';
import profile_pic from "../../assets/images/profile_pic.png";

class Profile extends Component { 
    constructor() {
        super();
    }
    render() {
        return (
            <div>
                <Header {...this.props} history={this.props.history} showProfilePic="true" />
            
            </div>
        )
    }
}

export default Profile;