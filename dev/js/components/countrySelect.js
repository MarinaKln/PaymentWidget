import React, {Component} from 'react';
import countries from '../jsons/countries.json';

class CountrySelectItem extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <option value={this.props.code} >
                {this.props.name}
            </option>
        )
    }
}

export default class CountrySelect extends Component {

    constructor(props) {
        super(props);

        this.createCountriesList = this.createCountriesList.bind(this);
    }

    componentDidMount() {

    }

    createCountriesList(item, index) {
        return (
            <CountrySelectItem
                key = {index}
                name = {item.name}
                code = {item.code}
            />
        )
    }

    render() {
        let props = this.props;

        return (
            <div className="country-select__wrap">
                <p className="country-select__label">Country</p>
                <div className="country-select__holder">
                    <select value={props.countryCode} className="country-select" name="country" id="country-select" onChange={props.handlerSelect}>
                        {countries.map(this.createCountriesList)}
                    </select>
                </div>
            </div>
        )
    }
}
