import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import './Login.css';
import Header from '../../common/header/Header';

class Login extends Component { 
    constructor() {
        super();
        this.state = {
            usernameRequired: "dispNone",
            username: "",
            loginPasswordRequired: "dispNone",
            loginPassword: "",
            loginFailed: false
        }
    }

    inputUsernameChangeHandler = (e) => {
        this.setState({ username: e.target.value });
    }

    inputLoginPasswordChangeHandler = (e) => {
        this.setState({ loginPassword: e.target.value });
    }

    loginClickHandler = () => {
        let username = "upgrad";
        let password = "upgrad";
        let access_token = "set access token";

        this.state.username === "" ? this.setState({ usernameRequired: "dispBlock" }) : this.setState({ usernameRequired: "dispNone" });
        this.state.loginPassword === "" ? this.setState({ loginPasswordRequired: "dispBlock" }) : this.setState({ loginPasswordRequired: "dispNone" });

        if( this.state.username !== "" && this.state.loginPassword !== "" ) {
            if(this.state.username !== username || this.state.loginPassword !== password ) {
                this.setState({loginFailed: true});
            } else {
                this.setState({loginFailed: false});
                sessionStorage.setItem("access-token", access_token);
                this.props.history.push("/home");
            }
        }
        
    }

    render() {
        return (
            <div>
                <Header {...this.props} />
                <div className="loginForm">
                    <Card className="login-card">
                        <CardContent>
                            <Typography variant="h5">LOGIN</Typography>
                            <br />
                            <FormControl required className="form-control">
                                <InputLabel htmlFor="username">Username</InputLabel>
                                <Input id="username" type="text" username={this.state.username} onChange={this.inputUsernameChangeHandler} />
                                <FormHelperText className={this.state.usernameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required className="form-control">
                                <InputLabel htmlFor="loginPassword">Password</InputLabel>
                                <Input id="loginPassword" type="password" loginpassword={this.state.loginPassword} onChange={this.inputLoginPasswordChangeHandler} />
                                <FormHelperText className={this.state.loginPasswordRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            {this.state.loginFailed === true &&
                                    <FormControl>
                                        <span className="red">
                                            Incorrect username and/or password
                                        </span>
                                    </FormControl>
                            }
                            <br /><br />
                            <Button variant="contained" color="primary" onClick={this.loginClickHandler}>LOGIN</Button>
                        </CardContent>
                    </Card>
                </div>

            </div>

        );
    }
}

export default Login;