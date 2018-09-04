import React, {Component} from 'react';

export default class AmountInput extends Component {

    constructor() {
        super();

        this.state = {
            visibility: false,
            currency: [
                {
                    name: 'USD',
                    code: ''
                }
            ]
        };
    }

    render() {
        let state = this.state;
        let props = this.props;
        let currency = null;

        if(state.currency.length == 1) {
           currency = (
               <p className="amount__currency-text">
                   {state.currency[0].name}
               </p>
           )
        }

        return (
            <div className="amount__wrap">
                <label className="amount__input-wrap">
                    <span className="amount__input-label">Amount</span>
                    <input type="number" className="amount__input" name="amount" value={props.formData.amount} onChange={props.handlerInput}/>
                </label>
                <div className="amount__currency-wrap">
                    {currency}
                </div>
            </div>

        )
    }
}
