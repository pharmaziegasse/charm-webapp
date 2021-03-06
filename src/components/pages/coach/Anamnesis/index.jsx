//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Redirect from Router
import { Link, Redirect } from 'react-router-dom';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBInput,
    MDBFormInline,
    MDBBtn,
    MDBIcon,
    MDBSpinner,
} from 'mdbreact';

//> Backend Connection
// Apollo
import { graphql, withApollo } from "react-apollo";
import gql from 'graphql-tag';

//> Fetch
// Get lag long from city name
import getLatLongByCityname from '../../../../utilities/intel/getLatLongByCity.js';
// Get weather by lat/lng
import getWeatherbyLatLng from '../../../../utilities/intel/getWeatherbyLatLng.js';

//> CSS
import './anamnesis.scss';

//> Queries
// Get forms
const GET_FORMS = gql`
    query getAnamneseFields($token: String!) {
        pages (token: $token) {
            ... on AnamneseAnFormPage {
                urlPath
                formFields {
                    name
                    fieldType
                    helpText
                    required
                    choices
                    defaultValue
                    label
                }
            }
        }
    }
`;
// Update data
const UPDATE_FORMS = gql`
    mutation createAn ($token: String!, $values: GenericScalar!, $urlpath: String!) {
        anamneseAnFormPage(
            token: $token,
            url: $urlpath,
            values: $values
        ) {
            result
            errors {
                name
                errors
            }
        }
    }
`;
// Update data
const GET_BASIC_USERDATA = gql`
    query getBasicData($token: String!, $id: Int!) {
        userById(token: $token, id: $id) {
            id
            firstName
            lastName
            username
            city
            country
        }
    }
`;
// Get anamnesis data
const GET_DATA = gql`
    query getAnamneseData_byUid($token: String!, $id: Int!) {
        anLatestByUid(token: $token, uid: $id) {
            id
            date
            formData
            user {
                id
                username
            }
            document{
                id
                link
            }
        }
    }
`;

class Anamnesis extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            urlPath: undefined,
            errors: [],
            refNames: [],
            data: undefined,
            user: undefined,
            success: false,
        }
    }

    componentDidMount = () => {
        // Set page title
        document.title = "Anamnese";
        console.log(this.props);
        if(this.props.match){
            if(this.props.match.params){
                if(this.props.match.params.uid){
                    this.setState({
                        uid: this.props.match.params.uid
                    }, () => this.initialize());
                }
            }
        }
    }

    initialize = async () => {
        // Get the types and names of the anamnesis fields
        this.getAnamneseFields();
    }

    //> Fetching customer data
    __init = () => {
        this.getBasicUserData();
    }
    __initExternal = (user) => {
        // Here I need to get the user city and convert it to lag/long
        // We use: https://opencagedata.com/
        if(user.city && user.country){
            this.__getCityLatLng(user.city, user.country);
        }
    }
    __getCityLatLng = async (city, country) => {
        console.log(city, country);
        let res = await getLatLongByCityname(city, country);
        if(res){
            console.log("Result", res);
            if(res.status === 200){
                if(res.lat && res.lng){
                    console.log("Get weather data");
                    this.__getWeatherData(res.lat, res.lng);
                }
            }
        }        
    }
    __getWeatherData = async (lat, lng) => {
        console.log(lat, lng);
        // Get the history data
        // We use: https://darksky.net/
        let res = await getWeatherbyLatLng(lat, lng);
        console.log(res);
        this.setState({
            weatherAPI: res
        });
    } 

    resetButton = () => {
        // Get the button back to the initial state ready for submit
        if(this.state.success){
            this.setState({
                success: false,
            });
        }
    }

    getBasicUserData = () => {
        this.props.client.query({
        query: GET_BASIC_USERDATA,
        variables: { "token": localStorage.getItem('fprint'), "id": this.state.uid }
        }).then(({data}) => {
            console.log(data);
            this.setState({
                user: data.userById
            }, () => this.__initExternal(data.userById));
        })
        .catch(error => {
            this.setState({
                user: false
            }, () => console.error(error));
        });
    }

    getAnamneseFields = () => {
        this.props.client.query({
        query: GET_FORMS,
        variables: { "token": localStorage.getItem('fprint') }
        }).then(({data}) => {
            this.setState({
                data: data
            }, () => this.getAnmaneseData());
        })
        .catch(error => {
            this.setState({
                data: false
            }, () => console.error(error));
        });
    }

    getAnmaneseData = () => {
        console.log("called");
        this.props.client.query({
        query: GET_DATA,
        variables: { 
            "token": localStorage.getItem('fprint'),
            "id": this.state.uid
        }
        }).then(({data}) => {
            console.log("Get anamnesis data");
            console.log(data);
            
            // Set the Excel document link
            let documentLink = undefined;
            if(data.anLatestByUid.document){
                if(data.anLatestByUid.document.link){
                    documentLink = "https://manage.pharmaziegasse.at/"+data.anLatestByUid.document.link;
                }
            }
            if(data.anLatestByUid){
                let fD = JSON.parse(data.anLatestByUid.formData);
                let res = {};
                console.log(fD);
                // Check if the data type is old
                if(fD.uid.value === undefined){
                    Object.keys(fD).map((field, i) => {
                        res = {
                            ...res,
                            [field]: fD[field] !== null ? fD[field] : undefined
                        }
                        return i;
                    });
                } else {
                    // Convert null to undefined
                    Object.keys(fD).map((field, i) => {
                        res = {
                            ...res,
                            [field]: fD[field] !== null ? fD[field].value : undefined
                        }
                        return i;
                    });
                }
                this.setState({
                    ...this.state,
                    ...res,
                    documentLink,
                }, () => this.__init());
            }
        })
        .catch(error => {
            console.log(error);
            this.setState({
                formdata: false
            }, () => this.__init());
        });
    }

    sendData = async () => {
        // Set values that will be set
        // Normalize data
        let rtn = {};
        this.state.data.pages.map((page, i) => {
            if(page.__typename === "AnamneseAnFormPage"){
                page.formFields.map((field, key) => {
                    if(this.state[field.name]){
                        rtn[field.name] = JSON.stringify({
                            helpText: field.helpText,
                            fieldType: field.fieldType,
                            value: this.state[field.name]
                        });
                    } else {
                        rtn[field.name] = JSON.stringify({
                            helpText: field.helpText,
                            fieldType: "",
                            value: ""
                        })
                    }
                });
            }
        });
        console.log(rtn);

        //rtn = null;
        
        // Check if the form values have been set
        if(rtn !== null && rtn !== undefined && this.state.urlPath !== undefined){
            // Call graphQL mutation
            await this.props.update({
                variables: {
                    "token": localStorage.getItem('fprint'),
                    "values": rtn,
                    "urlpath": this.state.urlPath
                }
            })
            .then(({data}) => {
                console.log(data);
                if(data){
                    if(data.anamneseAnFormPage){
                        let page = data.anamneseAnFormPage;
                        if(page.result === "OK, parsed special input" || page.result === "OK"){
                            this.setState({
                                success: true,
                                errors: [],
                            });
                            // Remove all error messages
                            [].forEach.call(document.querySelectorAll('.alert-error'),function(e){
                                e.parentNode.removeChild(e);
                            });
                        } else if(page.result === "FAIL"){
                            console.log("Error");
                            // Write error messages
                            this.setState({
                                success: false,
                            }, () => this.handleError(page.errors));
                        }
                    }
                }
            })
            .catch(error => {
                console.error("Mutation error:",error);
            })
        }
    };

    handleError = (errors) => {
        // Clear all previous errors
        this.state.refNames.map((item, i) => {
            const refNode = this[`${item}_ref`].current;
            //refNode.parentNode.removeChild(refNode);
            let refAlert = refNode.querySelector('.alert');
            if(refAlert !== null){
                refNode.removeChild(refAlert);
            }
            return true;
        });

        if(errors !== undefined){
            if(errors.length >= 1){
                this[`${errors[0].name}_ref`].current.scrollIntoView();
                errors.map((error, i) => {
                    if(error.__typename === "FormError"){
                        const node = this[`${error.name}_ref`].current;
                        let elChild = document.createElement('div');
                        elChild.className = 'alert alert-danger alert-error mt-2';
                        elChild.innerHTML = `<i class="fa fa-angle-up pr-2"></i>${error.errors[0]}`;
                        node.appendChild(elChild);
                    }
                    return true;
                });
            }
        }
    }

    _handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        }, () => this.resetButton());
    }

    _handleCheckBoxChange = (e) => {
        this.setState({
            [e.target.name]: e.target.checked 
        }, () => this.resetButton());
    }

    _handleCheckBoxesChange = (e, name, label) => {
        // Get current active checkboxes
        let current = this.state[name];
        // Check if there currently are active checkboxes
        if(current !== undefined){
            if(current.includes(label)){
                // Remove
                let filtered = current.filter(function(ele){
                    // eslint-disable-next-line
                    return ele != label;
                });
                // Update state
                this.setState({
                    [name]: filtered
                }, () => this.resetButton());
            } else {
                // Add to array
                current.push(label);
                // Update state
                this.setState({
                    [name]: current
                }, () => this.resetButton());
            }
        } else {
            // No active checkboxes - we can only add to the state
            let newCB = [label];
            this.setState({
                [name]: newCB
            }, () => this.resetButton());
        }
    }

    _handleSelectChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        }, () => this.resetButton());
    }

    _setDefaultValue = (item, i) => {
        if(item.defaultValue !== "" && item.defaultValue !== undefined){
            // CHeck if the state is currently empty - to prevent over writing
            if(this.state[item.fieldType] === undefined
            || this.state[item.fieldType] === "" 
            || this.state[item.fieldType] === null){
                switch(item.fieldType){
                    case 'multiselect':
                        let multiselect = [];
                        if(item.defaultValue.includes(', ')){
                            multiselect = item.defaultValue.split(', ');
                        } else {
                            multiselect = [item.defaultValue]
                        }
                        if(!this.state[item.name]){
                            this.setState({
                                [item.name]: multiselect
                            })
                        }
                        break;
                    case 'checkboxes':
                        let checkboxes = [];
                        if(item.defaultValue.includes(', ')){
                            checkboxes = item.defaultValue.split(', ');
                        } else {
                            checkboxes = [item.defaultValue]
                        }
                        if(this.state[item.name] === null || this.state[item.name] === undefined){
                            this.setState({
                                [item.name]: checkboxes
                            });
                        }
                        break;
                    case 'checkbox':
                        if(!this.state[item.name]){
                            if(item.defaultValue){
                                this.setState({
                                    [item.name]: true
                                });
                            } else {
                                this.setState({
                                    [item.name]: false
                                });
                            }
                        }
                        break;
                    default:
                        if(!this.state[item.name]){
                            this.setState({
                                [item.name]: item.defaultValue
                            });
                        }
                }
                
            }
        }
    }

    getSelectValues = (select) => {
        var result = [];
        var options = select && select.options;
        var opt;

        for (var i=0, iLen=options.length; i<iLen; i++) {
            opt = options[i];

            if (opt.selected) {
            result.push(opt.value || opt.text);
            }
        }
        return result;
    }

    _handleMultiSelectChange = (e) => {
        this.setState({
            [e.target.name]: this.getSelectValues(e.target)
        }, () => this.resetButton());
    }

    _handleNumberClick = (name, type) => {
        // Check if state is empty
        if(this.state[name]){
            this.setState({
                [name] : parseInt(this.state[name],10) + parseInt(type,10)
            }, () => this.resetButton());
        } else {
            this.setState({
                [name] : 0 + parseInt(type,10)
            }, () => this.resetButton());
        }
    }

    printCheckboxes = (item, i) => {
        let arr = item.choices.split(',');
        return arr.map((name, key) => {
            let n = name.trim().toLowerCase().replace(/ /g,'');
            let display = name.trim();
                return(
                    <MDBInput
                    key={key}
                    checked={this.state[item.name] && this.state[item.name].includes(display) ? (true) : (false)}
                    name={n}
                    onChange={(e) => this._handleCheckBoxesChange(e, item.name, display)}
                    label={display}
                    filled
                    type="checkbox"
                    id={"fromGroupInput"+i+""+key}
                    />
                );
        });
    }

    printRadio = (choices, container, required, i) => {
        let arr = choices.split(',');
        return arr.map((name, key) => {
            let n = name.trim().toLowerCase().replace(/ /g,'');
            let display = name.trim();
            return(
                <MDBInput
                onClick={() => this.setState({[container]: display}, () => this.resetButton())}
                checked={this.state[container] && this.state[container] === display ? true : false}
                label={display}
                key={key}
                name={n}
                type="radio"
                id={"radio"+i+""+key}
                required={required}
                />
            );
        });
    }

    printOptions = (choices, i) => {
        let arr = choices.split(',');
        return arr.map((name, key) => {
            //let n = name.trim().toLowerCase().replace(/ /g,'');
            let display = name.trim();
            return(
                <option key={key} value={display}>{display}</option>
            );
        });
    }

    renderFields = () => {
        let data = this.state.data;

        // Loading
        if (data === undefined) {
            console.log("Loading");
            return (<div className="text-center"><MDBSpinner /></div>);
        }
        // Error
        if (data === false) {
            return (<div>Error!</div>);
        }

        if(data !== undefined){
            if(data.pages !== undefined){
                // Get key
                let key = undefined;
                data.pages.map((item, i) => {
                    if(item.__typename === "AnamneseAnFormPage"){
                        key = i;
                    }
                    return true;
                });
                
                // Check if the FormPage exists
                if(key !== undefined){
                    // Set urlpath (where to send data)
                    if(this.state.urlPath === undefined){
                        this.setState({
                            urlPath: data.pages[key].urlPath
                        });
                    }

                    let formfields = data.pages[key].formFields;
                    
                    return formfields.map((item, i) => {
                        this[`${item.name}_ref`] = React.createRef();

                        // Debugging
                        //console.log(item);

                        // Store the names of all items for refs
                        if(!this.state.refNames.includes(item.name)){
                            this.setState(previousState => ({
                                refNames: [...previousState.refNames, item.name]
                            }));
                        }

                        this._setDefaultValue(item, i);
                        switch(item.fieldType.toLowerCase()){
                            case "singleline":
                                // TEXT Input
                                return(
                                    <div 
                                    ref={this[`${item.name}_ref`]}
                                    key={i}
                                    className="form-group my-3"
                                    >
                                        <label className="heading" htmlFor={"fromGroupInput"+i}>
                                        {item.helpText && item.helpText}
                                        </label>
                                        <input
                                            type="text"
                                            value={this.state[item.name]}
                                            onChange={this._handleChange}
                                            name={item.name}
                                            className="form-control"
                                            id={"fromGroupInput"+i}
                                            required={item.required}
                                        />
                                    </div>
                                );
                            case "hidden":
                                // HIDDEN Input
                                return(
                                    <div 
                                    ref={this[`${item.name}_ref`]}
                                    key={i}
                                    className="form-group my-3 d-none"
                                    >
                                        <label className="heading" htmlFor={"fromGroupInput"+i}>
                                        {item.helpText && item.helpText}
                                        </label>
                                        <input
                                            type="text"
                                            value={this.state[item.name]}
                                            name={item.name}
                                            className="form-control"
                                            id={"fromGroupInput"+i}
                                            disabled
                                        />
                                    </div>
                                );
                            case "number":
                                // NUMBER Input
                                return(
                                    <div ref={this[`${item.name}_ref`]} key={i} className="my-3">
                                        <label className="heading" htmlFor={"fromGroupInput"+i}>
                                            {item.helpText && item.helpText}
                                        </label>
                                        <div
                                        className="
                                        def-number-input
                                        number-input
                                        mb-3"
                                        >
                                            <button
                                            onClick={() => this._handleNumberClick(item.name,-1)}
                                            className="minus">
                                            </button>
                                            <input
                                            name={item.name}
                                            id={"fromGroupInput"+i}
                                            value={this.state[item.name]}
                                            onChange={this._handleChange}
                                            type="number"
                                            />
                                            <button
                                            onClick={() => this._handleNumberClick(item.name,1)}
                                            className="plus">
                                            </button>
                                        </div>
                                    </div>
                                );
                            case "checkbox":
                                // CHECKBOX Input
                                return(
                                    <div ref={this[`${item.name}_ref`]} key={i} className="my-3">
                                        <label className="heading" htmlFor={"fromGroupInput"+i}>
                                            {item.helpText && item.helpText}
                                        </label>
                                        <MDBInput
                                        checked={this.state[item.name]}
                                        name={item.name}
                                        onChange={this._handleCheckBoxChange}
                                        label={item.label && item.label}
                                        filled
                                        type="checkbox"
                                        id={"fromGroupInput"+i}
                                        />
                                    </div>
                                );
                            case "checkboxes":
                                // CHECKBOXES Input
                                return (
                                    <div ref={this[`${item.name}_ref`]} key={i} className="my-3">
                                        <label className="heading" htmlFor={"fromGroupInput"+i}>
                                            {item.helpText && item.helpText}
                                        </label>
                                            <MDBFormInline>
                                            {this.printCheckboxes(item, i)}
                                            </MDBFormInline>
                                    </div>
                                );
                            case "dropdown":
                                // SELECT Input
                                return (
                                    <div ref={this[`${item.name}_ref`]} key={i} className="my-3">
                                        <label className="heading" htmlFor={"fromGroupInput"+i}>
                                            {item.helpText && item.helpText}
                                        </label>
                                        <div>
                                            <select
                                            name={item.name}
                                            selected={this.state[item.name]}
                                            onChange={this._handleSelectChange}
                                            className="browser-default custom-select">
                                            <option>Choose your option</option>
                                            {this.printOptions(item.choices, i)}
                                            </select>
                                        </div>
                                    </div>
                                );
                            case "multiselect":
                                // MULTI SELECT Input
                                return (
                                    <div ref={this[`${item.name}_ref`]} key={i} className="my-3">
                                        <label className="heading" htmlFor={"fromGroupInput"+i}>
                                            {item.helpText && item.helpText}
                                        </label>
                                        <div>
                                            <select
                                            multiple name={item.name}
                                            selected={this.state[item.name]}
                                            onChange={this._handleMultiSelectChange}
                                            className="browser-default custom-select"
                                            >
                                            <option>Choose your option</option>
                                            {this.printOptions(item.choices, i)}
                                            </select>
                                        </div>
                                    </div>
                                );
                            case "radio":
                                // RADIO Input
                                return (
                                    <div ref={this[`${item.name}_ref`]} key={i} className="my-3">
                                        <label className="heading" htmlFor={"fromGroupInput"+i}>
                                            {item.helpText && item.helpText}
                                        </label>
                                        {item.name === "temperatur" &&
                                        <>
                                        {this.state.weatherAPI && this.state.weatherAPI.status === 200 &&
                                        <span className="text-muted">
                                        Durchschnittstemperatur am 
                                        Kundenstandort: {this.state.weatherAPI.avgTemp.toFixed(2)} °C
                                        <br/>
                                        <small>Powered by Dark Sky</small>
                                        </span>
                                        }
                                        </>
                                        }
                                        {item.name === "luftfeuchtigkeit" &&
                                        <>
                                        {this.state.weatherAPI && this.state.weatherAPI.status === 200 &&
                                        <span className="text-muted">
                                        Absolute Luftfeuchtigkeit am 
                                        Kundenstandort: {this.state.weatherAPI.humidity.toFixed(2)} g/m<sup>3</sup>
                                        <br/>
                                        <small>Powered by Dark Sky</small>
                                        </span>
                                        }
                                        </>
                                        }
                                        {item.name === "uv-index" &&
                                        <>
                                        {this.state.weatherAPI && this.state.weatherAPI.status === 200 &&
                                        <span className="text-muted">
                                        UV Index am 
                                        Kundenstandort: {this.state.weatherAPI.uvIndex} 
                                        <br/>
                                        <small>Powered by Dark Sky</small>
                                        </span>
                                        }
                                        </>
                                        }
                                        <MDBFormInline>
                                            {this.printRadio(
                                                item.choices,
                                                item.name,
                                                item.required,
                                                i
                                            )}
                                        </MDBFormInline>
                                    </div>
                                );
                            case "multiline":
                                // MULTILINE TEXT Input
                                return (
                                    <div 
                                    ref={this[`${item.name}_ref`]}
                                    key={i}
                                    className="form-group"
                                    >
                                        <label className="heading" htmlFor={"fromGroupInput"+i}>
                                            {item.helpText && item.helpText}
                                        </label>
                                        <textarea
                                        className="form-control"
                                        value={this.state[item.name]}
                                        onChange={this._handleChange}
                                        name={item.name}
                                        id={"fromGroupInput"+i}
                                        rows="5"
                                        required={item.required}
                                        />
                                    </div>
                                );
                            default:
                                return(
                                    <div 
                                    ref={this[`${item.name}_ref`]}
                                    key={i}
                                    className="form-group"
                                    >
                                        <label className="heading" htmlFor={"fromGroupInput"+i}>
                                        {item.helpText && item.helpText}
                                        </label>
                                        <input
                                            type="text"
                                            value={this.state[item.name]}
                                            onChange={this._handleChange}
                                            name={item.name}
                                            className="form-control"
                                            id={"fromGroupInput"+i}
                                            required={item.required}
                                        />
                                    </div>
                                )
                        }
                    });
                }else {
                    return null;
                }
                
            }else {
                return null;  
            }
        }else {
            return null;
        }
    }

    render() {
        // Get global state with login information
        const { globalState } = this.props;

        //> Route protection
        // Only logged in uses can access this page
        if(!globalState.logged) return <Redirect to="/login"/>
        // If logged in but not coach
        if(globalState.logged && !globalState.coach) return <Redirect to="/dashboard"/> 

        // Check if the state has been set in the parent component


        console.log(this.state);

        if(!this.state.user){
            return(
                <div className="text-center"><MDBSpinner /></div>
            );
        } else {
            return (
                <MDBContainer id="anamnesis" className="text-left pt-5">
                    <h2 className="mb-5 text-center">Anamnese für{" "}
                    {this.state.user.firstName+" "+this.state.user.lastName}
                    </h2>
                    <MDBRow className="mt-4">
                    <MDBCol md="6" className="text-left">
                        <Link to="/coach">
                            <MDBBtn color="red">
                                <MDBIcon icon="angle-left" className="pr-2" />Dashboard
                            </MDBBtn>
                        </Link>
                        {!this.state.success ? (
                            <MDBBtn
                            color="primary"
                            onClick={this.sendData}
                            >
                                <MDBIcon icon="save" className="pr-2" />
                                Save
                            </MDBBtn>
                        ) : (
                            <MDBBtn
                            color="success"
                            disabled
                            >
                                <MDBIcon icon="check" className="pr-2" />
                                Saved successfully
                            </MDBBtn>
                        )}
                    </MDBCol>
                    <MDBCol md="6" className="text-right">
                        {this.state.success &&
                            <Link 
                            to={{
                            pathname: '/create/'+this.state.uid
                            }}
                            >
                                <MDBBtn
                                color="green"
                                outline
                                >
                                    <MDBIcon fa icon="signature" className="pr-2" />
                                    Create Beautyreport
                                </MDBBtn>
                            </Link>
                        }
                        {this.state.documentLink &&
                            <MDBBtn
                            color="green"
                            onClick={this.sendData}
                            href={this.state.documentLink}
                            tag="a"
                            target="_blank"
                            >
                                <MDBIcon far icon="file-excel" className="pr-2" />
                                Download Excel
                            </MDBBtn>
                        }
                    </MDBCol>
                    </MDBRow>
                    <MDBRow className="mb-4">
                        <MDBCol md="8">
                            {this.renderFields()}
                        </MDBCol>
                    </MDBRow>
                    
                    {!this.state.success ? (
                        <MDBBtn
                        color="primary"
                        onClick={this.sendData}
                        >
                            <MDBIcon icon="save" className="pr-2" />
                            Save
                        </MDBBtn>
                    ) : (
                        <>
                        <MDBBtn
                        color="success"
                        disabled
                        >
                            <MDBIcon icon="check" className="pr-2" />
                            Saved successfully
                        </MDBBtn>
                        <Link 
                        to={{
                        pathname: '/create/'+this.state.uid
                        }}
                        >
                            <MDBBtn
                            color="green"
                            outline
                            >
                                <MDBIcon fa icon="signature" className="pr-2" />
                                Create Beautyreport
                            </MDBBtn>
                        </Link>
                        <Link
                        to={{
                        pathname: '/coach'
                        }}
                        >
                            <MDBBtn color="red">
                                <MDBIcon icon="angle-left" className="pr-2" />Dashboard
                            </MDBBtn>
                        </Link>
                        </>
                    )}
                </MDBContainer>
            );
        }
    }
}

export default graphql(UPDATE_FORMS, {
    name: 'update'
})(withApollo(Anamnesis));

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
