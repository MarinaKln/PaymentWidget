import React, {Component} from 'react';

class PaymentItem extends Component {
    constructor() {
        super();
    }

    render() {
        let active = '';
        let props = this.props;

        if(props.currentPayment == props.id) {
            active = 'active';
        }

        return (
            <button value={props.id} disabled={!props.disabledClick} onClick={(e) => props.clickHandler(e, props.id)} className={`payment-method__item button ${active}`}>
                <img className="payment-method__img" src={props.imgUrl} alt=""/>
                <span className="payment-method__item-name">{props.name}</span>
            </button>
        )
    }
}

export default class PaymentsMethods extends Component {

    constructor() {
        super();

        this.state = {
            visibility: false
        };

        this.createPaymentList = this.createPaymentList.bind(this);
    }

    componentDidMount() {

    }

    createPaymentList(item, index) {
        return (
            <PaymentItem
                key = {index}
                name = {item.name}
                id = {item.id}
                imgUrl = {item.img_url}
                clickHandler = {this.props.handlerClick}
                currentPayment = {this.props.currentPayment}
                disabledClick = {this.props.disabledPick}
            />
        )
    }

    render() {

        return (
            <div className="payment-method__wrap">
                <p className="payment-method__label">Payment method</p>
                <div className={`payment-method__items-wrap ${this.props.disabledPick ? '' : 'disabled' }`}>
                    {this.props.paymentsMethods.map(this.createPaymentList)}
                </div>
            </div>
        )
    }
}
