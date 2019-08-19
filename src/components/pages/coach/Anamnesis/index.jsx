//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Redirect from Router
import { Redirect } from 'react-router-dom';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBInput,
    MDBFormInline,
} from 'mdbreact';

//> Backend Connection
// Apollo
import { graphql, Query } from "react-apollo";
import gql from 'graphql-tag';

//> Helpers
// Authentication
import { isAuthed } from '../../../helpers/auth.js';

//> Queries
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

class Anamnesis extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    _handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    _handleCheckBoxChange = (e) => {
        this.setState({
            [e.target.name]: e.target.checked 
        })
    }

    _handleNumberClick = (name, type) => {
        // Check if state is empty
        if(this.state[name]){
            this.setState({
                [name] : parseInt(this.state[name],10) + parseInt(type,10)
            });
        } else {
            this.setState({
                [name] : 0 + parseInt(type,10)
            });
        }
        
    }

    printCheckboxes = (choices, i) => {
        let arr = choices.split(',');
        console.log(arr);
        return arr.map((name, key) => {
            let n = name.trim().toLowerCase().replace(/ /g,'');
            let display = name.trim();
            return(
                <MDBInput
                checked={this.state[n]}
                name={n}
                onChange={this._handleCheckBoxChange}
                label={display}
                filled
                type="checkbox"
                id={"fromGroupInput"+i+""+key}
                />
            );
        })
    }

    render() {
        console.log(this.state);
        // Route protection
        if(isAuthed() === false) return <Redirect to="/login"/> 

        return (
            <MDBContainer className="text-center">
                <h2 className="mb-5">Anamnese für Erika Mustermann</h2>
                <MDBRow className="flex-center">
                    <MDBCol md="6">
                        {
                        <Query query={GET_FORMS} variables={{ "token": localStorage.getItem('wca') }}>
                        {({ loading, error, data, client}) => {
                            if (loading) {
                            return (<div>Loading...</div>);
                            }
                            if (error) {
                            console.error(error);
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
                                        let formfields = data.pages[key].formFields;
                                        return formfields.map((item, i) => {
                                            console.log(item);
                                            switch(item.fieldType.toLowerCase()){
                                                case "singleline":
                                                    // TEXT Input
                                                    return(
                                                        <div key={i} className="form-group">
                                                            <label htmlFor={"fromGroupInput"+i}>
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
                                                case "number":
                                                    // NUMBER Input
                                                    return(
                                                        <div key={i} >
                                                            <label htmlFor={"fromGroupInput"+i}>
                                                                {item.helpText && item.helpText}
                                                            </label>
                                                            <div className="def-number-input number-input ml-auto mr-auto mb-3">
                                                                <button onClick={() => this._handleNumberClick(item.name,-1)} className="minus"></button>
                                                                <input
                                                                name={item.name}
                                                                id={"fromGroupInput"+i}
                                                                value={this.state[item.name]}
                                                                onChange={this._handleChange}
                                                                type="number"
                                                                />
                                                                <button onClick={() => this._handleNumberClick(item.name,1)}className="plus"></button>
                                                            </div>
                                                        </div>
                                                    );
                                                case "checkbox":
                                                    // CHECKBOX Input
                                                    return(
                                                        <div key={i} >
                                                            <label htmlFor={"fromGroupInput"+i}>
                                                                {item.helpText && item.helpText}
                                                            </label>
                                                            <MDBInput checked={this.state[item.name]} name={item.name} onChange={this._handleCheckBoxChange} label={item.label && item.label} filled type="checkbox" id={"fromGroupInput"+i} />
                                                        </div>
                                                    );
                                                case "checkboxes":
                                                    // CHECKBOXS Input
                                                    return (
                                                        <div key={i} >
                                                            <label htmlFor={"fromGroupInput"+i}>
                                                                {item.helpText && item.helpText}
                                                            </label>
                                                                <MDBFormInline className="justify-content-center">
                                                                {this.printCheckboxes(item.choices, i)}
                                                                </MDBFormInline>
                                                        </div>
                                                        );
                                                default:
                                                    return(
                                                        <div key={i} className="form-group">
                                                            <label htmlFor={"fromGroupInput"+i}>
                                                            {item.helpText && item.helpText}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name={item.name}
                                                                className="form-control"
                                                                id={"fromGroupInput"+i}
                                                                required={item.required}
                                                            />
                                                        </div>
                                                    )
                                            }

                                            console.log(item);
                                            
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
                            
                        }}
                        </Query>
                        }
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }
}

export default graphql(GET_FORMS)(Anamnesis);

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
