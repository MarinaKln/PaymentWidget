import React, {Component} from 'react';


export default class errorScreen extends Component {

    constructor() {
        super();

        this.state = {
            visibility: false
        };
    }

    componentDidMount() {

    }

    render() {
        let screen;
        if (this.state.visibility) {
            screen = (
                <div className="error-screen_inner">

                </div>
            )
        }
        return (
            <div className="error-screen">
                {screen}
            </div>

        )
    }
}
