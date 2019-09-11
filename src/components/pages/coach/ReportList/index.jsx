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
    MDBAlert,
    MDBListGroup,
    MDBListGroupItem,
    MDBBtn,
    MDBIcon,
    MDBSpinner,
} from 'mdbreact';

//> Connection
import { withApollo } from "react-apollo";
import gql from "graphql-tag";

//> Queries
// Get all beauty reports
const GET_REPORTS = gql`
    query getBeautyReports_byUid($token: String!, $id: Int!) {
        brByUid(token: $token, uid: $id) {
            id
            date
        }
        brLatestByUid(token: $token, uid: $id) {
            id
            date
        }
    }
`;

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
        if(this.props.location){
            if(this.props.location.state){
                if(this.props.location.state.user.id){
                    this.setState({
                        user: this.props.location.state.user,
                        loading: true
                    }, () => this.fetchReports(this.props.location.state.user.id));
                }
            }
        }
    }

    fetchReports = (uid) => {
        // Fetch data required for creating a report
        this.fetchAllReports(uid);
    }

    fetchAllReports = (uid) => {
        this.props.client.query({
        query: GET_REPORTS,
        variables: { "id": uid, "token": localStorage.getItem("wca") }
        }).then(({data}) => {
            console.log(data);
            if(data.brLatestByUid){
                this.setState({
                    reports: { 
                        ...this.state.reports,
                        latest: data.brLatestByUid
                    },
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
                    loading: false
                });
            } else {
                console.log("There are no Beautyreports for this user");
            }
        })
        .catch(error => {
            this.setState({
                reports: { 
                    legacy: [],
                    latest: undefined
                },
                loading: false
            }, () => console.log("Error",error));
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

        return (
            <MDBContainer className="text-center">
                <h2 className="text-center font-weight-bold">
                Beautyreports von {location.state.user.firstName + " " + location.state.user.lastName}
                </h2>
                <div className="mt-4">
                <MDBRow>
                    <MDBCol md="6" className="text-left">
                        <Link to="/coach">
                            <MDBBtn color="red">
                                <MDBIcon icon="angle-left" className="pr-2" />Zurück
                            </MDBBtn>
                        </Link>
                    </MDBCol>
                    <MDBCol md="6" className="text-right">
                        <Link 
                        to={{
                        pathname: '/report/add',
                        state: {
                            user: this.props.location.state.user
                        }
                        }}
                        >
                            <MDBBtn
                            color="secondary"
                            rounded
                            >
                            <MDBIcon icon="plus" className="pr-2" />Neuen Report generieren
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
                                    <MDBCardBody>
                                        <p className="lead font-weight-bold">Neuester Beautyreport</p>
                                        <small>{this.getDate(this.state.reports.latest.date)}</small>
                                        <p className="lead mt-3">Download als</p>
                                        <MDBBtn color="primary">
                                            <MDBIcon icon="file-word" className="pr-2"/>Word
                                        </MDBBtn>
                                        <MDBBtn color="red">
                                            <MDBIcon icon="file-pdf" className="pr-2"/>PDF
                                        </MDBBtn>
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
                                    <MDBListGroup className="text-left ml-auto mr-auto mb-4" style={{ width: "22rem" }}>
                                        {this.state.reports.legacy.map((report, i) => {
                                            return(
                                                <MDBListGroupItem
                                                key={i}
                                                href="#"
                                                hover
                                                >
                                                Beauty Report<span className="float-right">{this.getDate(report.date)}</span>
                                                </MDBListGroupItem>
                                            );
                                        })}
                                    </MDBListGroup>
                                ) : (
                                    <span
                                    onClick={() => {this.setState({showLegacy: true})}}
                                    className="blue-text clickable"
                                    >
                                    Ältere Versionen anzeigen
                                    </span>
                                )}
                                
                            </>
                        ) : (
                            <h3>Noch kein Beauty-Report vorhanden</h3>
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
