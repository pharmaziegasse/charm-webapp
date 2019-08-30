//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Redirect from Router
import { Link, Redirect } from 'react-router-dom';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
    MDBContainer,
    MDBCollapse,
    MDBCard,
    MDBCardBody,
    MDBCollapseHeader,
    MDBProgress,
    MDBRow,
    MDBCol,
    MDBInput,
    MDBBtn,
    MDBIcon,
    MDBDataTable
} from 'mdbreact';

//> CSS
import './coachdashboard.scss';

class CoachDashboard extends React.Component{
    constructor(props){
        super(props);
    }

    _getCoachUsers = () => {
        if(this.props.globalState){
            if(this.props.globalState.userdata){
                let userSet = this.props.globalState.userdata.userSet;
                if(userSet.length >= 1){
                    let users = userSet.map((user, i) => {
                        return({
                            'id': i+1,
                            'first': user.firstName,
                            'last': user.lastName,
                            'email': <a href={"mailto:"+user.email} className="blue-text">{user.email}</a>,
                            'phone': user.telephone,
                            'actions':
                            <div>
                                <Link 
                                to={{
                                pathname: '/report',
                                state: {
                                    userId: user.id
                                }
                                }}
                                >
                                    <MDBBtn outline color="purple" size="md">
                                    Beauty Reports
                                    </MDBBtn>
                                </Link>
                                <MDBBtn
                                color="purple"
                                size="md"
                                >
                                <MDBIcon icon="user" className="pr-2" />Profil anzeigen
                                </MDBBtn>
                            </div>
                        })
                    });
                    return users;
                } else {
                    console.log("No users for this coach");
                }
            }
        }
    }

    _getTable = () => {
        return({
                columns: [
            {
                label: '#',
                field: 'id',
                sort: 'asc'
            },
            {
                label: 'First',
                field: 'first',
                sort: 'asc'
            },
            {
                label: 'Last',
                field: 'last',
                sort: 'asc'
            },
            {
                label: 'E-Mail',
                field: 'email',
                sort: 'disabled'
            },
            {
                label: 'Phone',
                field: 'phone',
                sort: 'disabled'
            },
            {
                label: 'Quick actions',
                field: 'actions',
                sort: 'disabled'
            }
        ],
        rows: this._getCoachUsers()
        })
    }

    render() {
        // Get global state with login information
        const { globalState } = this.props;

        //> Route protection
        // Only logged in uses can access this page
        if(!globalState.logged) return <Redirect to="/login"/>
        // If logged in but not coach
        if(globalState.logged && !globalState.coach) return <Redirect to="/dashboard"/> 

        return(
            <MDBContainer id="coach">
                <h2 className="text-center font-weight-bold">
                Willkommen zurück, <span>{globalState.userdata.firstName}</span>!
                </h2>
                <div className="mt-4 mb-3 text-right">
                    <Link to="/add">
                        <MDBBtn color="green">
                            <MDBIcon icon="plus-circle" className="pr-2" />Add customer
                        </MDBBtn>
                    </Link>
                </div>
                <MDBRow className="text-center">
                    <MDBCol md="12">
                        <h3>Deine KundInnen</h3>
                        <MDBDataTable
                        striped
                        bordered
                        small
                        data={this._getTable()}
                        />
                    </MDBCol>
                    <MDBCol md="6">

                    </MDBCol>
                    <MDBCol md="6">

                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }
}

export default CoachDashboard;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
