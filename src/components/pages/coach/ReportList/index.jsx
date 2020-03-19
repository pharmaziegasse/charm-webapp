//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Redirect
import { Link, Redirect } from 'react-router-dom';

//> Additional libraries
// Moment.js for time handling
//import moment from 'moment';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBDataTable,
    MDBBtn,
    MDBIcon,
    MDBSpinner,
    MDBFileInput,
    MDBInput,
} from 'mdbreact';

//> Connection
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
//> Backend Connection
// Apollo
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

//> CSS
import './reportlist.scss';

//> Queries
// Get all beauty reports
const GET_REPORTS = gql`
    query getBeautyReports_byUid($token: String!, $id: Int!) {
        brByUid(token: $token, uid: $id) {
            __typename
            id
            date
            document{
                __typename
                id
                link
            }
        }
        brLatestByUid(token: $token, uid: $id) {
            __typename
            id
            date
            user{
                firstName
                lastName
                customerId
            }
            document{
                __typename
                id
                link
            }
        }
    }
`;

const clientNoCache = new ApolloClient({
    link: new HttpLink({
        uri: 'https://manage.pharmaziegasse.at/api/graphql'
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
    }
});

class ReportList extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            userId: undefined,
            reports: {
                latest: undefined,
                legacy: []
            },
            showLegacy: false,
        }
    }

    componentDidMount = () => {
        // Set page title
        document.title = "Beautyreport List";
        if(this.props.match){
            if(this.props.match.params){
                if(this.props.match.params.uid){
                    this.setState({
                        uid: this.props.match.params.uid,
                        loading: true,
                    }, () => this.fetchReports(this.props.match.params.uid));
                }
            }
        }
    }

    fetchReports = (uid) => {
        //this.interval = setInterval(() => this.fetchAllReports(uid), 5000);
        // Fetch data required for creating a report
        this.fetchAllReports(uid);
    }

    fetchAllReports = (uid) => {;
        clientNoCache.query({
        query: GET_REPORTS,
        variables: { "id": uid, "token": localStorage.getItem("fprint") }
        }).then(({data}) => {
            if(data.brLatestByUid){
                console.log("Data");
                console.log(data);
                this.setState({
                    user: data.brLatestByUid.user,
                    reports: { 
                        ...this.state.reports,
                        latest: data.brLatestByUid
                    },
                    exists: true,
                    loading: false
                });
            }
            if(data.brByUid){
                console.log("Beautyreports exist for this user");
                // If there are reports, set dummy data
                this.setState({
                    reports: { 
                        ...this.state.reports,
                        legacy: data.brByUid
                    },
                    exists: true,
                    loading: false
                });
            } else {
                console.log("There are no Beautyreports for this user");
            }
            if(data.brLatestByUid === null){
                this.setState({
                    exists: false,
                })
            }
        })
        .catch(error => {
            this.setState({
                reports: { 
                    legacy: [],
                    latest: undefined
                },
                loading: false
            }, () => console.error("Error",error));
        });
    }
    
    getDate = (date) => {
        // Note: Handling dates in JavaScript is like hunting K'lor'slugs on Korriban. A huge waste of time.
        let dateS = new Date(date);

        // Get the year
        let year = dateS.getFullYear();
        // Get the month ( January is 0! )
        let month = ("0" + (dateS.getMonth() + 1)).slice(-2);
        // Get the day of the month
        let day = ("0" + (dateS.getDate())).slice(-2);
        //> Time
        // Get hours
        let hours = ("0" + (dateS.getHours())).slice(-2);
        // Get minutes
        let minutes = ("0" + (dateS.getMinutes())).slice(-2);
        // Get minutes
        let seconds = ("0" + (dateS.getSeconds())).slice(-2);

        /**
         * Combine to achieve YYYY-MM-DD format like Captain Planet.
         * LET OUR POWERS COMBINE!
         * You certainly feel like Captain Planet when you get it to work.
         */ 
        return day+"."+month+"."+year+" "+hours+":"+minutes+":"+seconds;
    }

    _getTable = () => {
        return({
                columns: [
            {
                label: '#',
                field: 'id',
                sort: 'desc'
            },
            {
                label: 'Date',
                field: 'date',
                sort: 'asc'
            },
            {
                label: 'Visible',
                field: 'visible',
                sort: 'disabled'
            },
            {
                label: 'PDF Upload',
                field: 'pdf',
                sort: 'disabled'
            },
            {
                label: 'Download',
                field: 'download',
                sort: 'disabled'
            },
            {
                label: 'Quick actions',
                field: 'actions',
                sort: 'disabled'
            }
        ],
        rows: this._getBeautyReports()
        })
    }

    _getBeautyReports = () => {
        let reports = this.state.reports.legacy.map((report, i) => {
            return({
                'id': i+1,
                'date': this.getDate(report.date),
                'visible': <MDBInput 
                            label="Für Kunden sichtbar"
                            filled
                            type="checkbox"
                            disabled
                            id={"show_latest_"+i}
                            />,
                'pdf': <MDBFileInput
                        btnTitle="File auswählen"
                        btnColor="purple"
                        textFieldTitle="Lade das PDF hoch"
                        />,
                'download': <>
                {report.document !== null ? (
                    <a
                    href={"https://manage.pharmaziegasse.at/"+report.document.link}
                    >
                        <MDBBtn 
                        size="md"
                        color="primary"
                        >
                            <MDBIcon 
                            icon="file-word"
                            className="pr-2"
                            />
                            Download
                        </MDBBtn>
                    </a>
                ) : (
                    <p>No download</p>
                )}
                            </>,
                'actions': <MDBBtn 
                            size="md"
                            color="danger"
                            disabled
                            >
                                <MDBIcon 
                                icon="trashcan"
                                className="pr-2"
                                />
                                Remove
                            </MDBBtn>
            });
        });
        return reports;
    }

    render() {
        // Get global state with login information
        const { globalState, match } = this.props;
        //> Route protection
        // Only logged in uses can access this page
        if(!globalState.logged) return <Redirect to="/login"/>
        // If logged in but not coach
        if(globalState.logged && !globalState.coach) return <Redirect to="/dashboard"/> 
        
        if(this.state.uid === false || this.state.exists === false) return <Redirect to="/coach"/>

        console.log(this.state);

        return (
            <MDBContainer className="text-center pt-5" id="reportlist">
                
                {this.state.user ? (
                    <h2 className="text-center font-weight-bold">
                    Beauty reports of {this.state.user.firstName + " " +this.state.user.lastName}
                    </h2>
                ) : (
                    <p>Loading..</p>
                )}
                <div className="mt-4">
                <MDBRow>
                    <MDBCol md="6" className="text-left">
                        <Link to="/coach">
                            <MDBBtn color="red">
                                <MDBIcon icon="angle-left" className="pr-2" />Dashboard
                            </MDBBtn>
                        </Link>
                    </MDBCol>
                    <MDBCol md="6" className="text-right">
                        <Link 
                        to={{
                        pathname: '/create/' + this.state.uid
                        }}
                        >
                            <MDBBtn
                            color="green"
                            
                            >
                                <MDBIcon fa icon="signature" className="pr-2" />
                                Create Beautyreport
                            </MDBBtn>
                        </Link>
                    </MDBCol>
                </MDBRow>
                    
                </div>
                {!this.state.loading ? (
                    <div className="mt-4">
                        <MDBRow className="flex-center mb-4">
                            <MDBCol md="6">
                                <MDBCard>
                                {this.state.reports.latest ? (
                                    <MDBCardBody className="active-report">
                                        <p className="lead font-weight-bold">Latest beautyreport</p>
                                        <small>{this.getDate(this.state.reports.latest.date)}</small>
                                        <p className="lead mt-3 mb-2">Download</p>
                                        {this.state.reports.latest.document &&
                                            <a
                                            href={
                                                "https://manage.pharmaziegasse.at/"+
                                                this.state.reports.latest.document.link
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            >
                                            <MDBBtn color="primary" className="d-block m-auto">
                                                <MDBIcon icon="file-word" className="pr-2"/>MS Word
                                            </MDBBtn>
                                            </a>
                                        }
                                        
                                        <hr/>
                                        <p className="lead my-3">Upload latest version</p>
                                        <MDBFileInput
                                        btnTitle="File auswählen"
                                        btnColor="purple"
                                        textFieldTitle="Lade das neueste PDF hoch"
                                        />
                                        <p className="lead mt-3">Current report</p>
                                        <small>Uploaded: 19.09.2019 12:42:22</small>
                                        <MDBBtn color="red" disabled className="d-block mt-3 ml-auto mr-auto">
                                            <MDBIcon icon="file-pdf" className="pr-2"/>PDF anzeigen
                                        </MDBBtn>
                                        <MDBInput 
                                        disabled
                                        label="Visible for customers"
                                        filled
                                        type="checkbox"
                                        id="show_latest"
                                        />
                                    </MDBCardBody>
                                ) : (
                                    null
                                )}
                                </MDBCard>
                            </MDBCol>
                        </MDBRow>
                        
                        {this.state.reports.legacy.length >= 1 ? 
                        (
                            <>
                                {this.state.showLegacy ? (
                                    <MDBDataTable
                                    striped
                                    bordered
                                    small
                                    exportToCSV
                                    data={this._getTable()}
                                    paginationLabel={[
                                        <MDBIcon icon="angle-left" size="lg" className="pl-3 pr-3" />,
                                        <MDBIcon icon="angle-right" size="lg" className="pl-3 pr-3" />
                                    ]}
                                    />
                                ) : (
                                    <span
                                    onClick={() => {this.setState({showLegacy: true})}}
                                    className="blue-text clickable"
                                    >
                                    Show older versions
                                    </span>
                                )}
                                
                            </>
                        ) : (
                            <h3>No beautyreports yet.</h3>
                        )
                        }
                    </div>
                ) : (
                    <div className="text-center w-100 h-100">
                        <MDBSpinner/>
                    </div>
                )}
            </MDBContainer>
        );
    }
}

export default withApollo(ReportList);

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
