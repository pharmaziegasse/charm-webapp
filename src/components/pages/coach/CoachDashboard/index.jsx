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

//> Dummy table data
const TableData = {
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
            label: 'Aktionen',
            field: 'actions',
            sort: 'asc'
        }
    ],
    rows: [
        {
            'id': 1,
            'first': 'Mathea',
            'last': 'Kuttnig',
            'actions':
            <div>
            <Link to="/report"><MDBBtn outline color="purple" size="md">Beauty Reports</MDBBtn></Link>
            <MDBBtn color="purple" size="md"><MDBIcon icon="user" className="pr-2" />Profil anzeigen</MDBBtn>
            </div>
        }/*,
        {
            'id': 2,
            'first': 'Stefan',
            'last': 'Santer',
            'actions':
            <div>
            <MDBBtn color="purple" size="sm">Beauty Reports</MDBBtn>
            <MDBBtn color="purple" size="sm"><MDBIcon icon="user" className="pr-2" />Profil anzeigen</MDBBtn>
            </div>
        },
        {
            'id': 3,
            'first': 'Kurt',
            'last': 'Gasser',
            'actions':
            <div>
            <MDBBtn color="purple" size="sm">Beauty Reports</MDBBtn>
            <MDBBtn color="purple" size="sm"><MDBIcon icon="user" className="pr-2" />Profil anzeigen</MDBBtn>
            </div>
        }*/
    ]
};

class CoachDashboard extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            
        }
    }

    componentWillMount = () => {
        
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
                <h2 className="text-center font-weight-bold">Willkommen zurück, <span>{globalState.username}</span>!</h2>
                <div className="mt-5 mb-3 text-right">
                    <MDBBtn color="green"><MDBIcon icon="plus-circle" className="pr-2" />Add customer</MDBBtn>
                </div>
                <MDBRow className="text-center">
                    <MDBCol md="12">
                        <h3>Deine KundInnen</h3>
                        <MDBDataTable
                        striped
                        bordered
                        small
                        data={TableData}
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
