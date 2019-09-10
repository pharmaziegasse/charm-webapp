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
import { graphql } from "react-apollo";
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

// Dummy data
const reports = [
    { title: "Beautyreport", timestamp: "13.08.2019" },
    { title: "Beautyreport", timestamp: "10.07.2019" },
]

class ReportList extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            userId: undefined,
        }
    }

    componentWillMount = () => {
        if(this.props.location){
            if(this.props.location.state){
                if(this.props.location.state.userId){
                    this.setState({
                        userId: this.props.location.state.userId
                    });
                }
            }
        }
    }

    fetchReports = () => {
        // Start loading animation
        this.setState({
            loading: true
        });
        // Fetch data required for creating a report
        this.fetchAllReports();
    }

    fetchAllReports = () => {

    }

    render() {
        // Get global state with login information
        const { globalState } = this.props;
        //> Route protection
        // Only logged in uses can access this page
        if(!globalState.logged) return <Redirect to="/login"/>
        // If logged in but not coach
        if(globalState.logged && !globalState.coach) return <Redirect to="/dashboard"/> 
        
        if(!this.state.userId) return <Redirect to="/coach"/>
        
        return (
            <MDBContainer className="text-center">
                <h2 className="text-center font-weight-bold">
                Beautyreports von Erika Mustermann
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
                        <MDBBtn
                        onClick={this.fetchReportData}
                        color="secondary"
                        rounded
                        >
                        <MDBIcon icon="plus" className="pr-2" />Neuen Report generieren
                        </MDBBtn>
                    </MDBCol>
                </MDBRow>
                    
                </div>
                <MDBListGroup className="text-left ml-auto mr-auto mb-4" style={{ width: "22rem" }}>
                    {reports.map((value, i) => {
                        return(
                            <MDBListGroupItem
                            key={i}
                            href="#"
                            hover
                            >
                            {value.title}<span className="float-right">{value.timestamp}</span>
                            </MDBListGroupItem>
                        );
                    })}
                </MDBListGroup>
            </MDBContainer>
        );
    }
}

export default graphql(GET_REPORTS, {
    options: (props) => ({ 
        variables: { 
            "id": props.location.state.userId,
            "token": localStorage.getItem('wca')
        } 
    })
})(ReportList);

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
