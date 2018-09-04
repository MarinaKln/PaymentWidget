import React, {Component} from 'react';
import CardForm from "./cardForm";
import AmountInput from "./amountInput";
import CountrySelect from "./countrySelect";
import PaymentMethod from "./peymentMethod";
import SuccessScreen from "./successScreen";

export default class Main extends Component {

    constructor() {
        super();

        this.state = {
            currency: 'USD',
            currentPayment: '',
            countryCode: '',
            geolocationData: {},
            disablePickPayment: true,
            paymentsMethods: [],
            formValid: false,
            formSuccess: false,
            formErrors: {
                card: '',
                name: '',
                year: '',
                month: '',
                cvv: ''
            },
            formData: {
                amount: '5',
                card: '',
                name: null,
                cvv: null,
                year: 2018,
                month: 0,
            },
            cardValid: false,
            nameValid: false,
            dateValid: false,
            cvvValid: false,
            isLoading: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleUserSelect = this.handleUserSelect.bind(this);
        this.handlerUserClick = this.handlerUserClick.bind(this);
        this.validateField = this.validateField.bind(this);
        this.addSpaces = this.addSpaces.bind(this);
        this.getPaymentMethods = this.getPaymentMethods.bind(this);
        this.handleDateSelect = this.handleDateSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createCardForms = this.createCardForms.bind(this);
    }

    componentDidMount() {
        fetch('http://ip-api.com/json')
            .then(response => response.json())
            .then(data => this.setState({
                geolocationData: data,
                countryCode: data.countryCode
            }));

        this.getPaymentMethods(this.state.countryCode);
    }

    getPaymentMethods (countryCode) {
        this.setState({ isLoading: true });

        fetch(`https://api.paymentwall.com/api/payment-systems/?key=e42b6ee3b032c8075b893ca5710bac5c&country_code=${countryCode}`)
            .then(response => response.json())
            .then(data => this.setState({
                paymentsMethods: data,
                isLoading: false
            }));
    }

    addSpaces(value) {
        let formData = this.state.formData;
        let cardCode = value.replace(/[^\d]/g, '').substring(0,16);
        cardCode = cardCode != '' ? cardCode.match(/.{1,4}/g).join(' ') : '';

        let data = Object.assign(formData, {card: cardCode});

        this.setState({
            formData: data
        })
    }

    checkDate() {
        let formData = this.state.formData;
        let formErrors = this.state.formErrors;
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        let dateValid = parseInt(formData.year) == currentYear ? parseInt(formData.month) >= currentMonth : true;
        let error = {month: dateValid ? '' : 'Date in past'};

        this.setState({
            dateValid: dateValid,
            formErrors: Object.assign(formErrors, error)
        }, this.validateForm);
    }

    checkCardNumber(value) {
        if (/[^0-9-\s]+/.test(value)) {
            return false;
        }

        let nCheck = 0;
        let nDigit = 0;
        let bEven = false;
        value = value.replace(/\D/g, "");

        for (let n = value.length - 1; n >= 0; n--) {
            let cDigit = value.charAt(n),
                nDigit = parseInt(cDigit, 10);

            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }

            nCheck += nDigit;
            bEven = !bEven;
        }

        return (nCheck % 10) == 0;
    }

    handleUserInput (e) {
        const state = this.state;
        const name = e.target.name;
        const value = e.target.value;

        let data = Object.assign(state.formData, {[name]: value});

        this.setState({
            formData: data,
            disablePickPayment: state.formData.amount > 0 && state.countryCode.length > 0
        }, this.validateField(name, value));
    }

    handleUserSelect (e) {
        const state = this.state;
        const value = e.target.value;

        this.setState({
            countryCode: value,
            disablePickPayment: state.formData.amount > 0 && this.state.countryCode.length > 0
        }, this.getPaymentMethods(value));
    }

    handleDateSelect (e) {
        const value = parseInt(e.target.value);
        const name = e.target.name;

        let data = Object.assign(this.state.formData, {[name]: value});

        this.setState({
            formData: data
        }, this.checkDate());
    }

    handlerUserClick (e, value) {
        let data = Object.assign(this.state.formData, {card: ''});
        let dataErrors = Object.assign(this.state.formErrors, {card: ''});

       if(this.state.currentPayment != value) {
            this.setState({
                currentPayment: value,
                formData: data,
                formErrors: dataErrors,
                cardValid: false,
                nameValid: false,
                cvvValid: false,
                dateValid: false
            });
        }
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let newErrors;
        let cardValid = this.state.cardValid;
        let nameValid = this.state.nameValid;
        let cvvValid = this.state.cvvValid;
        let error;

        let errors = {
            short: 'Value is too short.',
            long: 'Value is too long.',
            valid: 'Value not valid. Please, check entering value.',
            cardNumber: 'Card number not valid. Please, check entering value.',
            numbers: 'Please, use numbers for this field.',
            words: 'Please, use words for this field.',
            required: 'This field is required'
        };

        let rules = {
            cvv: /^\d+$/,
            words: /^[a-zA-Zа-яА-ЯіІїЇєёЁЄґҐ\'\`\- ]*$/,
            date: ''
        };

        switch(fieldName) {
            case 'card':
                this.addSpaces(value);
                cardValid = this.checkCardNumber(this.state.formData.card);

                if (value.length == 0) {
                    error = errors.required;
                } else if(!cardValid) {
                    error = errors.cardNumber;
                } else {
                    error = errors.valid;
                }
                newErrors = Object.assign(fieldValidationErrors, {card: cardValid ? '' : error});
                break;
            case 'name':
                nameValid = value.length >= 6 && value.match(rules.words) != null;
                if(value.match(rules.words) == null) {
                    error = errors.words;
                } else if (value.length == 0) {
                    error = errors.required;
                } else {
                    error = value.length < 6 ? errors.short : '';
                }
                newErrors = Object.assign(fieldValidationErrors, {name: nameValid ? '' : error});
                break;
            case 'cvv':
                cvvValid = value.length == 3 && value.match(rules.cvv) != null;
                if(value.length == 0 ) {
                    error = errors.required;
                } else if (value.match(rules.cvv) == null) {
                    error = errors.numbers ;
                } else {
                    error = value.length > 3 ? errors.long : errors.short;
                }

                newErrors = Object.assign(fieldValidationErrors, {cvv: cvvValid ? '' : error});
                break;
            default:
                newErrors = fieldValidationErrors;
                break;
        }

        this.setState({
            formErrors: newErrors,
            cardValid: cardValid,
            nameValid: nameValid,
            cvvValid: cvvValid
        }, this.validateForm);
    }

    validateForm() {
        let state = this.state;

        this.setState({
            formValid: state.cardValid && state.nameValid && state.dateValid && state.cvvValid
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        if(this.state.formValid && this.state.formData.amount > 0) {
            this.setState({
                formSuccess: true
            })
        }
    }

    createCardForms(item, index) {
        let state = this.state;

        return (
            <CardForm
                key = {index}
                id = {item.id}
                currency = {state.currency}
                handlerInput = {this.handleUserInput}
                formErrors = {state.formErrors}
                formValid = {state.formValid}
                formData = {state.formData}
                currentPayment = {state.currentPayment}
                handleSubmit = {this.handleSubmit}
                handlerSelect = {this.handleDateSelect}
            />
        )
    }

    render() {
        let state = this.state;
        let success = null;
        let cardForm = state.paymentsMethods.map(this.createCardForms);

        if(state.formSuccess) {
            success = <SuccessScreen />
        }

        return (
            <div className={`main payment-widget ${state.isLoading ? 'loading' : ''}`}>
                <AmountInput
                    handlerInput = {this.handleUserInput}
                    formData = {state.formData}
                />
                <CountrySelect
                    countryCode = {state.countryCode}
                    handlerSelect = {this.handleUserSelect}
                />
                <PaymentMethod
                    handlerClick = {this.handlerUserClick}
                    currentPayment = {state.currentPayment}
                    paymentsMethods = {state.paymentsMethods}
                    disabledPick = {state.disablePickPayment}
                />
                {cardForm}
                {success}
            </div>
        )
    }
}