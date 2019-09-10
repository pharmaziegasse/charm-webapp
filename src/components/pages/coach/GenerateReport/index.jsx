//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Redirect
import { Link, Redirect } from 'react-router-dom';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBListGroup,
    MDBListGroupItem,
    MDBBtn,
    MDBIcon,
    MDBAlert,
    MDBProgress,
} from 'mdbreact';

//> Connection
import { graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";
import * as compose from 'lodash.flowright';

//> Queries
// Get template
const GET_TEMPLATE = gql`
    query getTemplate($token: String!) {
        pages(token: $token) {
            ... on ReportsReportsPage {
                id
                chapters{
                    __typename
                    ... on Reports_S_ChapterBlock{
                        chapterHeader
                        subChapters
                    }
                }
            }
        }
        pages(token: $token) {
            ... on BeautyreportBrFormPage {
                urlPath
                formFields {
                    name
                    fieldType        
                }
            }
        }
    }
`;
// Get user anamnsesis data
const GET_USERDATA = gql`
    query getAnamneseData_byUid($token: String!, $id: Int!) {
        anLatestByUid(token: $token, uid: $id) {
            id
            date
            formData
            user {
                id
                username
            }
        }
    }
`;
// Send
const SEND_DATA = gql`
    mutation sendbr (
        $token: String!
        $urlPath: String!
        $values: GenericScalar!
    ){
        beautyreportBrFormPage(
            token: $token
            url: $urlPath
            values: $values
        ) {
            result
            errors {
                errors
                name
            }
        }
    }
`;

class GenerateReport extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            template: undefined,
            userdata: undefined,
            result: {},
            loading: false,
            operations: 0,
            userId: undefined,
            error: undefined,
        }
    }

    componentDidMount = () => {
        if(this.props.location){
            if(this.props.location.state){
                if(this.props.location.state.user.id){
                    this.setState({
                        user: this.props.location.state.user,
                        loading: true
                    }, () => this.fetchData());
                }
            }
        }
    }

    fetchTemplate = () => {
        this.props.client.query({
            query: GET_TEMPLATE,
            variables: { "token": localStorage.getItem("wca") }
        }).then(({data}) => {
            if(data.pages !== undefined){
                let template = undefined;
                let urlPath = undefined;
                data.pages.map((page, i) => {
                    if(page.__typename === "ReportsReportsPage"){
                        template = data.pages[i];
                    }
                    if(page.__typename === "BeautyreportBrFormPage"){
                        urlPath = data.pages[i].urlPath
                    }
                    return true;
                });
                this.setState({
                    template: template,
                    urlPath: urlPath
                });
            }
        })
        .catch(error => {
            console.error("Query error:",error);
        })
    }

    fetchUserData = async () => {
        await this.props.client.query({
            query: GET_USERDATA,
            variables: { "token": localStorage.getItem("wca"), "id": this.state.user.id }
        }).then(({data}) => {
            if(data.anLatestByUid !== undefined){
                this.setState({
                    userdata: data.anLatestByUid
                });
            }
        })
        .catch(error => {
            console.error("Query error:",error);
        })
    }

    fetchData = () => {
        // Check if there is anamnesis data
        if(this.state.user.anamneseSet.length >= 1){
            // Fetch data required for creating a report
            this.fetchTemplate();
            this.fetchUserData();
        }
    }

    _normalizeStatement = (condition, key) => {
        
        // Get user anamnesis data
        let formData = this.state.userdata.formData;

        //console.log(condition);
        
        // Check if there is a condition
        if(condition.trim() !== ""){
            // Parse user data to JS Object
            let data = JSON.parse(formData);

            // Check if there are multiple conditions
            if(!condition.includes(', ')){
                // There is only one condition

                // Replace the first word with the value of the corresponding word ( age > 50 => 3 > 50 )
                let condNew = condition.replace(/^\S+/g, data[condition.replace(/ .*/,'').toLowerCase()]);

                let condNewPure = condNew.replace(/"/g,'');
                
                let compareParts = condNewPure.split(' ');
                
                //console.log(compareParts);

                if(this.__convertType(compareParts[0]) === null || this.__convertType(compareParts[0]) === undefined){
                    return false;
                } else {
                    return this.__compare(this.__convertType(compareParts[0]), compareParts[1], compareParts[2]);
                }
            } else {
                // There are multiple conditions
                let conditions = condition.split(', ');
                // For each condition
                let results = conditions.map((condition, i) => {
                    // Replace the first word with the value of the corresponding word ( age > 50 => 3 > 50 )
                    let condNew = condition.replace(/^\S+/g, data[condition.replace(/ .*/,'').toLowerCase()]);

                    let condNewPure = condNew.replace(/"/g,'');
                    
                    let compareParts = condNewPure.split(' ');
                    
                    //console.log(compareParts);

                    if(this.__convertType(compareParts[0]) === null || this.__convertType(compareParts[0]) === undefined){
                        return false;
                    } else {
                        return this.__compare(this.__convertType(compareParts[0]), compareParts[1], compareParts[2]);
                    }
                });
                // Check if one of the conditions returned false
                if(results.includes(false)){
                    // The AND condition block is false
                    return false;
                } else {
                    // The AND condition block is true
                    return true;
                }
            }
        } else {
            return true;
        }
    }
    
    // convertType('null'); => null
    __convertType = (value) => {
        try {
            return (new Function("return " + value + ";"))();
        } catch(e) {
            return value;
        }
    }

    // compare(5, '<', 10); // true
    __compare = (post, operator, value) => {
        switch (operator) {
            case '>':   return post > parseInt(value);
            case '<':   return post < parseInt(value);
            case '>=':  return post >= parseInt(value);
            case '<=':  return post <= parseInt(value);
            case '==':  return post == value;
            case '!=':  return post != value;
            case '===': return post === value;
            case '!==': return post !== value;
        }
    }

    sendData = (result) => {
        let values = {
            "uid": this.state.user.id,
            "data": result
        }
        this.props.send({
            variables: { 
                "token": localStorage.getItem("wca"),
                "urlPath": this.state.urlPath,
                "values": values
            }
        }).then(({data}) => {
            if(data.beautyreportBrFormPage.result === "OK"){
                this.setState({
                    loading: false,
                    error: undefined
                });
            } else if(data.beautyreportBrFormPage.result === "FAIL") {
                this.setState({
                    loading: false,
                    error: data.beautyreportBrFormPage.errors
                });
            }
        })
        .catch(error => {
            this.setState({
                loading: false,
                error: error
            });
        })
    }

    createReport = () => {
        // Set variables
        let template = this.state.template;
        let result = undefined;

        //console.log(template);

        // For each chapter
        template.chapters.map((chapter, ckey) => {
            //> Extract useful information from chapter
            // Header
            let chapterHeader = chapter.chapterHeader;

            // Create header items in object
            if(result){
                result = {
                    ...result,
                    ["chapter"+ckey]: {
                        ...result["chapter"+ckey],
                        chapterHeader: chapterHeader
                    }
                }
            } else {
                result = {
                    ["chapter"+ckey]: {
                        chapterHeader: chapterHeader
                    }
                }
            }
            
            //console.log(chapterHeader);

            // For each subchapter
            chapter.subChapters.map((subChapter, skey) => {

                //> Extract useful information from subchapter
                // Header
                let subChapterHeader = subChapter.value.sub_chapter_header;

                // Create sub header items in object
                result = {
                    ...result,
                    ["chapter"+ckey]: {
                        ...result["chapter"+ckey],
                        ["subchapter"+skey]: {
                            ...result["chapter"+ckey]["subchapter"+skey],
                            subChapterHeader: subChapterHeader
                        }
                    }
                }
                //console.log(subChapterHeader);

                // For each paragraph
                subChapter.value.paragraphs.map((paragraph, pkey) => {

                    //> Extract useful information from paragraph
                    // Statement
                    let statement = paragraph.value.statement;
                    // Text
                    let text = paragraph.value.paragraph;

                    if(this._normalizeStatement(statement)){
                        // Create paragraph items in object
                        result = {
                            ...result,
                            ["chapter"+ckey]: {
                                ...result["chapter"+ckey],
                                ["subchapter"+skey]: {
                                    ...result["chapter"+ckey]["subchapter"+skey],
                                    ["paragraph"+pkey]: {
                                        ...result["chapter"+ckey]["subchapter"+skey]["paragraph"+pkey],
                                        text: text
                                    }
                                }
                            }
                        }
                    }
                    

                    //console.log(text);
                    // Check if finished
                    if(
                        ckey + 1 === template.chapters.length  && 
                        skey + 1 === chapter.subChapters.length && 
                        pkey + 1 === subChapter.value.paragraphs.length 
                    ){
                        // Finished
                        this.sendData(result);
                    }
                });
            });
        });
    }

    render() {
        // Get global state with login information
        const { globalState, location } = this.props;
        //> Route protection
        // Only logged in uses can access this page
        if(!globalState.logged) return <Redirect to="/login"/>
        // If logged in but not coach
        if(globalState.logged && !globalState.coach) return <Redirect to="/dashboard"/> 
        
        if(!location.state) return <Redirect to="/coach"/>
        
        // Check if the data has been set
        if(
            this.state.template !== undefined && 
            this.state.userdata !== undefined && 
            this.state.loading
        ){
            this.createReport();
        }
        return (
            <MDBContainer className="text-center">
                <h2 className="text-center font-weight-bold">
                Beautyreport erstellen
                </h2>
                <div className="mt-4">
                    <MDBRow>
                        <MDBCol md="12" className="text-left">
                            <Link 
                            to={{
                            pathname: '/report',
                            state: {
                                user: location.state.user
                            }
                            }}
                            >
                                <MDBBtn color="red">
                                    <MDBIcon icon="angle-left" className="pr-2" />Zurück
                                </MDBBtn>
                            </Link>
                        </MDBCol>
                    </MDBRow>
                </div>
                <MDBRow className="flex-center mt-4">
                        <MDBCol md="6">
                        { !this.state.error ? (
                            <MDBCard>
                            { this.state.user && this.state.user.anamneseSet.length >= 1 ? (
                                <MDBCardBody>
                                    { this.state.loading ? (
                                        <>
                                            <MDBProgress material preloader />
                                            
                                            <p className="lead">Beautyreport wird erstellt...</p>
                                        </>
                                    ) : (
                                        <>
                                            { true === false &&
                                            <>
                                                <MDBAlert color="danger">
                                                    <p>Qualitäts-Kontrolle ausstehend!</p>
                                                    <MDBBtn color="danger" size="md" rounded>
                                                        Jetzt kontrollieren
                                                    </MDBBtn>
                                                </MDBAlert>
                                                <MDBAlert color="success">
                                                    <p><MDBIcon icon="check" className="pr-2"/>Von Christian 
                                                    Aichner kontrolliert</p>
                                                </MDBAlert>
                                            </>
                                            }
                                            <MDBAlert color="success" className="mb-4">
                                                <p>
                                                <MDBIcon
                                                icon="check"
                                                className="pr-2"
                                                />
                                                Beautyreport erstellt und gespeichert!
                                                </p>
                                            </MDBAlert>
                                            <p className="lead">Download als</p>
                                            <MDBBtn color="primary">
                                                <MDBIcon icon="file-word" className="pr-2"/>Word
                                            </MDBBtn>
                                            <MDBBtn color="red">
                                                <MDBIcon icon="file-pdf" className="pr-2"/>PDF
                                            </MDBBtn>
                                        </>
                                    ) }
                                </MDBCardBody>
                            ) : (
                                <MDBCardBody>
                                    <MDBAlert color="info" className="mb-0">
                                        <p className="lead">Es wurden keine Anamnesedaten gefunden!</p>
                                        <p className="mb-3">Möglicherweiße wurden die Daten des Anamnese-Gesprächs 
                                        noch nicht in Charm übertragen.</p>
                                        <Link 
                                        to={{
                                        pathname: '/anamnesis',
                                        state: {
                                            user: this.state.user
                                        }
                                        }}
                                        >
                                            <MDBBtn color="info" size="md" rounded>
                                                Anamnesedaten eintragen
                                            </MDBBtn>
                                        </Link>
                                    </MDBAlert>
                                </MDBCardBody>
                            )}
                            </MDBCard>
                        ) : (
                            <MDBCard>
                                <MDBCardBody>
                                    {this.state.error.length >= 1 ? (
                                        <>
                                        {this.state.error.map((error, i) => {
                                            return(
                                                <MDBAlert key={i} color="danger">
                                                    {error.errors[0]}
                                                </MDBAlert>
                                            )
                                        })}
                                        </>
                                    ) : (
                                        <MDBAlert color="danger">
                                            Ein unerwarteter Fehler ist aufgetreten. Bitte kontaktieren Sie den 
                                            Support der Werbeagentur Christian Aichner.
                                        </MDBAlert>
                                    )
                                    }
                                </MDBCardBody>
                            </MDBCard>
                        )}
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }
}

export default compose(
    graphql(SEND_DATA, { name: 'send' }),
)(withApollo(GenerateReport));

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
