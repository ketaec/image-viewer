import React, {Component} from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Input, InputAdornment } from "@material-ui/core";
import './Header.css';
import ProfilePic from "../profilePic/ProfilePic";

class Header extends Component {
    constructor() {
        super();
    }

    onSearch = async (e) => {
        this.props.handleChange(e);
    }

    render() {
        return (
            <div className="app-header">
                <div className="app-title">Image Viewer</div>
                <div className="app-searchbar-icon">
                    {
                        this.props.showSearchbar ? 
                        <div>
                            <Input
                                className="search-box"
                                type="search"
                                placeholder="Search..."
                                disableUnderline
                                startAdornment={
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                                }
                                onChange={this.onSearch}
                            /> 
                            <ProfilePic {...this.props} />
                        </div>
                        : null
                    } 

                    {
                        this.props.showProfilePic ? 
                        <div>
                            <ProfilePic {...this.props} />
                        </div>
                        : null
                    }

                </div>

            </div>
        )
    }
}

export default Header;