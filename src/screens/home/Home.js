import React, {Component} from 'react';
import Header from '../../common/header/Header';

class Home extends Component { 
    render() {
        return (
            <div>
                <Header {...this.props} history={this.props.history} showSearchbar="true" />
            </div>
        )
    }
}

export default Home;