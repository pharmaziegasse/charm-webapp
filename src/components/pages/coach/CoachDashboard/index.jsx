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
    MDBBtn,
    MDBIcon,
    MDBDataTable,
    MDBTooltip,
    MDBBadge,
} from 'mdbreact';

//> CSS
import './coachdashboard.scss';

class CoachDashboard extends React.Component{

    componentWillMount = () => {
        // Set page title
        document.title = "Your customers";
    }

    _getCoachUsers = () => {
        if(this.props.globalState){
            if(this.props.globalState.userdata){
                let userSet = this.props.globalState.userdata.userSet;
                if(userSet.length >= 1){
                    let users = userSet.map((user, i) => {
                        return({
                            'id': i+1,
                            'userid': user.customerId,
                            'first': user.firstName,
                            'last': user.lastName,
                            'email': <a href={"mailto:"+user.email} className="blue-text">{user.email}</a>,
                            'phone': user.telephone,
                            'actions':
                            <div className="user-action">
                                {user.beautyreportSet.length >= 1 ? (
                                    <Link 
                                    to={{
                                    pathname: '/report',
                                    state: {
                                        user: user
                                    }
                                    }}
                                    >
                                        <MDBTooltip
                                            placement="top"
                                        >
                                            <MDBBtn rounded outline color="green">
                                            <MDBIcon icon="signature" size="lg" />
                                            </MDBBtn>
                                            <div>
                                                Beautyreports einsehen
                                            </div>
                                        </MDBTooltip>
                                    </Link>
                                ) : (
                                    <Link 
                                    to={{
                                    pathname: '/report/add',
                                    state: {
                                        user: user
                                    }
                                    }}
                                    >
                                        <MDBTooltip
                                            placement="top"
                                        >
                                            <MDBBtn rounded outline color="danger">
                                            <MDBIcon icon="signature" size="lg" />
                                            </MDBBtn>
                                            <div>
                                                Beautyreport erstellen
                                            </div>
                                        </MDBTooltip>
                                    </Link>
                                )}
                                <Link 
                                to={{
                                pathname: '/anamnesis',
                                state: {
                                    user: user
                                }
                                }}
                                >
                                {
                                    user.anamneseSet.length >= 1 ? (
                                        <MDBTooltip
                                            placement="top"
                                        >
                                            <MDBBtn outline rounded color="purple">
                                                <MDBIcon icon="file" size="lg" />
                                            </MDBBtn>
                                            <div>
                                                Anamnese erneuern
                                            </div>
                                        </MDBTooltip>
                                    ) : (
                                        <MDBTooltip
                                            placement="top"
                                        >
                                            <MDBBtn outline rounded color="danger">
                                                <MDBIcon far icon="file" size="lg" />
                                            </MDBBtn>
                                            <div>
                                                Anamnese hinzufügen
                                            </div>
                                        </MDBTooltip>
                                    )
                                }
                                </Link>
                                <MDBTooltip
                                    placement="top"
                                >
                                <MDBBtn
                                href={"https://api.whatsapp.com/send?phone="+user.telephone.replace('+','')}
                                target="_blank"
                                className={true === false ? "btn-whatsapp-chat notification" : "btn-whatsapp-chat"}
                                outline
                                rounded
                                color="success"
                                >
                                    <MDBIcon fab icon="whatsapp" size="lg" />
                                </MDBBtn>
                                <div>
                                    Mit {user.firstName} chatten
                                </div>
                                </MDBTooltip>
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
                label: 'Customer ID',
                field: 'userid',
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
            <MDBContainer id="coach" className="pt-5">
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
                        <div className="table-labels">
                        <span><MDBIcon icon="cube" className="pr-1 pl-3 red-text"/>Keine Daten vorhanden</span>
                        <span><MDBIcon icon="cube" className="pr-1 pl-3 purple-text"/>Keine Aktion erforderlich</span>
                        <span><MDBIcon icon="cube" className="pr-1 pl-3 green-text"/>Daten optimal</span>
                        </div>
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
