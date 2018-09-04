import React, {Component} from 'react';


export default class SuccessScreen extends Component {

    constructor() {
        super();
    }

    componentDidMount() {

    }

    render() {

        return (
            <div className="success-screen">
                <div className="success-screen__inner">
                    <p>Your payment was success!</p>
                </div>
            </div>
        )
    }
}
