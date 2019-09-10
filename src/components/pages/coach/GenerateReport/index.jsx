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
import { withApollo } from "react-apollo";
import gql from "graphql-tag";

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

class GenerateReport extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            template: undefined,
            userdata: undefined,
            articles: undefined,
            loading: false,
            operations: 0,
            userId: undefined,
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
                data.pages.map((page, i) => {
                    if(page.__typename === "ReportsReportsPage"){
                        template = data.pages[i];
                    }
                    return true;
                });
                this.setState({
                    template: template
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
        // Set variables
        let userdata = this.state.userdata;

        if(userdata !== undefined){
            let formData = userdata.formData;
            if(formData !== undefined){
                // Parse user data to JS Object
                let data = JSON.parse(formData);
                // Replace the first word with the value of the corresponding word ( age > 50 => 3 > 50 )
                let condNew = condition.replace(/^\S+/g, data[condition.replace(/ .*/,'')]);
                // Get the three parts of the condition
                let compareParts = condNew.split(' ');
                // Solve condition
                if(this.__convertType(compareParts[0]) === null || this.__convertType(compareParts[0]) === undefined){
                    return false;
                } else {
                    return this.__compare(this.__convertType(compareParts[0]), compareParts[1], compareParts[2]);
                }
            }
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

    createReport = () => {
        // Set variables
        let template = this.state.template;

        console.log(template);

        // For each chapter
        template.chapters.map((chapter, ckey) => {
            //> Extract useful information from chapter
            // Header
            let chapterHeader = chapter.chapterHeader;
            console.log(chapterHeader);

            // For each subchapter
            chapter.subChapters.map((subChapter, skey) => {

                //> Extract useful information from subchapter
                // Header
                let subChapterHeader = subChapter.value.sub_chapter_header;
                console.log(subChapterHeader);

                // For each paragraph
                subChapter.value.paragraphs.map((paragraph, pkey) => {

                    //> Extract useful information from paragraph
                    // Statement
                    let statement = paragraph.value.statement;
                    // Text
                    let text = paragraph.value.paragraph;

                    console.log(text);
                });
            });
        });
    }

    _redirect = () => {
        let sum = undefined;
        // First time
        if(sum === undefined){
            // If template has loaded
            if(this.state.template !== undefined){
                // if articles in template have loaded
                if(this.state.template.chapters !== undefined){
                    
                    // Count items in each article
                    let operations = this.state.template.chapters.map((a, i) => {
                        let items = 0;
                        a.subChapters.map((chapter, key) => {
                            chapter.value.paragraphs.map(() => {
                                items++;
                                return true;
                            })
                        });
                        return items;
                    });
                    // The the sum of all articles
                    sum = operations.reduce((a,b) => a + b, 0);
                    console.log(sum);
                    // Check if the sum of all articles is the same as the operation count
                    return this._redirectPermission(sum);
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            // Check if the sum of all articles is the same as the operation count
            return this._redirectPermission(sum);
        }
    }

    _redirectPermission = (sum) => {
        if(this.state.operations !== 0){
            if(this.state.operations === sum){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
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

        console.log(this.state);
        
        // Check if the data has been set
        if(this.state.template !== undefined && this.state.userdata !== undefined){
            this.createReport();
        }

        // Redirect to edit page
        /*if(this._redirect()){
            return(
                <Redirect to={{
                pathname: '/report/edit',
                state: { ...this.state }
                }}
                />
            )
        }*/
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
                                            <p className="lead mt-4">Download als</p>
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
                                        <p className="mb-3">Möglicherweiße wurden die Daten des Anamnese-Gesprächs noch 
                                        nicht in Charm übertragen.</p>
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
                        </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }
}

export default withApollo(GenerateReport);

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
