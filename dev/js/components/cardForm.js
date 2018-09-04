import React, {Component} from 'react';
import months from '../jsons/months.json';
import years from '../jsons/years.json';

class WarningMsg extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let message = this.props.message;

        return (
            <span className="card-form__warning">
                {message}
            </span>
        )
    }
}

class OptionItem extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <option value={this.props.count}>
                {this.props.text}
            </option>
        )
    }
}

export default class CardForm extends Component {

    constructor() {
        super();

        this.state = {

        };
    }

    createOptionsList(item, index) {
        return (
            <OptionItem
                key = {index}
                count = {item.count}
                text = {item.text}
            />
        )
    }

    errorMessage (message) {
        return message.length === 0 ? null : < WarningMsg message = {message} />;
    }

    errorClass (error) {
        console.log('error', error);

        return(error.length === 0 ? '' : 'has-error');
    }

    render() {
        let form;
        let props = this.props;
        let payText = (props.formData.amount > 0 && props.formData.amount.length > 0) ? `Pay ${props.formData.amount} ${props.currency}` : `Check amount for pay`;

        if (props.currentPayment.length > 0 && props.id == props.currentPayment) {
            form = (
                <form id={props.id} className="card-form" onSubmit={props.handleSubmit}>
                    <div className="card-form__inner">
                        <label className={`card-form__label card-form__number-holder ${this.errorClass(props.formErrors.card)}`}>
                            <span className="card-form__placeholder">Card number</span>
                            <input placeholder="**** **** **** ****" type="numbers" className="card-form__input card-form__number" name="card" value={props.formData.card} onChange={props.handlerInput} />
                            {this.errorMessage(props.formErrors.card)}
                        </label>
                        <label className={`card-form__label card-form__name-holder ${this.errorClass(props.formErrors.name)}`}>
                            <span className="card-form__placeholder">Cardholder name</span>
                            <input placeholder="John Johns" type="text" className="card-form__input card-form__name" name="name" onChange={props.handlerInput} />
                            {this.errorMessage(props.formErrors.name)}
                        </label>
                        <div className="card-form__items-holder">
                            <label className={`card-form__label card-form__date-holder ${this.errorClass(props.formErrors.month)}`}>
                                <span className="card-form__placeholder">Exp. date</span>
                                <select name="month" id="" onChange={props.handlerSelect}>
                                    {months.map(this.createOptionsList)}
                                </select>
                                <select name="year" id="" onChange={props.handlerSelect}>
                                    {years.map(this.createOptionsList)}
                                </select>
                                {this.errorMessage(props.formErrors.month)}
                            </label>
                            <label className={`card-form__label card-form__cvv-holder ${this.errorClass(props.formErrors.cvv)}`}>
                                <span className="card-form__placeholder">CVV</span>
                                <input placeholder="&bull; &bull; &bull;" type="text" className="card-form__input card-form__cvv" name="cvv" onChange={props.handlerInput} />
                                {this.errorMessage(props.formErrors.cvv)}
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="button button__success card-form__submit" disabled={!props.formValid}>
                        <span> {payText} </span>
                    </button>
                </form>
            )
        }
        return (
            <div className="card-form__wrap">
                {form}
            </div>

        )
    }
}
