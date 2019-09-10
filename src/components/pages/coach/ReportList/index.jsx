//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Redirect
import { Link, Redirect } from 'react-router-dom';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
    MDBContainer,
    MDBListGroup,
    MDBListGroupItem,
    MDBBtn,
    MDBIcon,
    MDBRow,
    MDBCol,
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
    }
`;

class ReportList extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            userId: undefined,
            reports: [],
        }
    }

    componentDidMount = () => {
        if(this.props.location){
            if(this.props.location.state){
                if(this.props.location.state.user.id){
                    this.setState({
                        user: this.props.location.state.user
                    }, () => this.fetchReports(this.props.location.state.user.id));
                }
            }
        }
    }

    fetchReports = (uid) => {
        // Start loading animation
        this.setState({
            loading: true
        });
        // Fetch data required for creating a report
        this.fetchAllReports(uid);
    }

    fetchAllReports = (uid) => {
        this.props.client.query({
        query: GET_REPORTS,
        variables: { "id": uid, "token": localStorage.getItem("wca") }
        }).then(({data}) => {
            if(data.brByUid){
                console.log("Beautyreports exist for this user");
                // If there are reports, set dummy data
                let reports = [
                    { timestamp: "13.08.2019" },
                    { timestamp: "10.07.2019" }
                ];
                this.setState({
                    reports: reports
                })
            } else {
                console.log("There are no Beautyreports for this user");
            }
        })
        .catch(error => {
            console.log("Error",error);
        })
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
                <div className="mt-4">
                
                    {this.state.reports.length >= 1 ? 
                    (
                        <MDBListGroup className="text-left ml-auto mr-auto mb-4" style={{ width: "22rem" }}>
                            {this.state.reports.map((value, i) => {
                                return(
                                    <MDBListGroupItem
                                    key={i}
                                    href="#"
                                    hover
                                    >
                                    Beauty Report<span className="float-right">{value.timestamp}</span>
                                    </MDBListGroupItem>
                                );
                            })}
                        </MDBListGroup>
                    ) : (
                        <h3>Noch kein Beauty-Report vorhanden</h3>
                    )
                    }
                </div>
            </MDBContainer>
        );
    }
}

export default withApollo(ReportList);

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
