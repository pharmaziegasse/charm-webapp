//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Redirect from Router
import { Link, Redirect } from 'react-router-dom';

//> Additional
// Fetching API
import axios from 'axios';
// Validator
import validator from 'validator';

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
} from 'mdbreact';

//> CSS
import './coachdashboard.scss';

//> Images
import { ReactComponent as MorningImg } from  '../../../../assets/icons/morning.svg';
import { ReactComponent as DayImg } from  '../../../../assets/icons/day.svg';
import { ReactComponent as NightImg } from  '../../../../assets/icons/night.svg';

//> Backend Connection
// Apollo
import { graphql, withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import * as compose from 'lodash.flowright';
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

//> Queries
// Get data
const GET_DATA = gql`
    query ($token: String!) {
        userSelf(token: $token) {
            id
            userSet{
                anamneseSet{
                    id
                }
                beautyreportSet{
                    id
                }
                id
                customerId
                dateJoined
                firstName
                lastName
                email
                telephone
            }
        }
    }
`;
// Get all users
const GET_USERS_ALL = gql`
    query ($token: String!) {
        userAll(token: $token) {
        id
        telephone
        email
        firstName
        lastName
        address
        dateJoined
        city
        country
        postalCode
        newsletter
        isCustomer
        userSet{
            anamneseSet{
            id
            }
            beautyreportSet{
                id
                }
                id
                customerId
                firstName
                lastName
                email
                telephone
            }
        }
    }
`;
// Create new user
const CREATE_USER = gql`
    mutation createUser ($token: String!, $urlPath: String!, $values: GenericScalar!) {
        userUserFormPage(
            token: $token,
            url: $urlPath,
            values: $values
        ) {
            result
            errors {
            name
            errors
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
const clientOnlyCache = new ApolloClient({
    link: new HttpLink({
        uri: 'https://manage.pharmaziegasse.at/api/graphql'
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
    }
});

class CoachDashboard extends React.Component{

    state = {}

    componentDidMount = () => {
        // Set page title
        document.title = "Your customers";
        // Refetch users
        this._loginUser();
        this._fetchUsersFirstTime();

        // Get custom greeting info
        this.getGreetingImg();
        this.getGreetingQuote();
    }

    syncManually = () => {
        this.setState({
            syncing: true
        });
        this._fetchUsersWithoutCache();
        this._fetchNodeUsers(this.state.jwt);
    }

    _fetchNodeUsers = (token) => {
        const config = {
            headers: {'Authorization': "bearer " + token}
        };

        axios.get( 
        'https://charmnode.herokuapp.com/users',
        config
        ).then((response) => {
            if(response.status === 200){
                let customers = response.data.customers;
                // Fetch all Charm users and pass shopify users
                this._fetchAllUsers(customers);
            } else if(response.status === 401 || response.status === 403){
                // Forbidden (token invalid)
                this._loginUser();
            } else {
                this.setState({
                    syncing: false
                }, () => console.log("Error",response));
            }
        }).catch((error) => {
            this.setState({
                syncing: false
            }, () => console.log("Error",error));
        });
    }

    _loginUser = () => {
        // Start syncing animation
        if(!this.state.syncing){
            this.setState({
                syncing: true
            });
        }

        // Login to get JWT
        axios.post("https://charmnode.herokuapp.com/login", {
            "username": process.env.REACT_APP_NODE_USER,
            "password": process.env.REACT_APP_NODE_PASS
        })
        .then((response) => {
            if(response.status === 200){
                this.setState({
                    jwt: response.data.token
                }, () => this._fetchNodeUsers(response.data.token));
            } else {
                this.setState({
                    syncing: false
                }, () => console.log("Error",response));
            }
        }, (error) => {
            this.setState({
                syncing: false
            }, () => console.log("Error",error));
        });
    }

    _fetchUsersWithoutCache = () => {
        clientNoCache.query({
            query: GET_DATA,
            variables: { "token": localStorage.getItem("fprint") }
        }).then(({data}) => {
            console.log("Fetched data directly from server.");
            if(data.userSelf){
                this.setState({
                    coachusers: {
                        userdata: data.userSelf
                    }
                });
            }
        })
        .catch(error => {
            this.setState({
                syncing: false
            }, () => console.log("Error",error));
        })
    }

    _fetchUsersFirstTime = () => {
        clientOnlyCache.query({
            query: GET_DATA,
            variables: { "token": localStorage.getItem("fprint") }
        }).then(({data}) => {
            console.log("Fetched data from cache.");
            if(data.userSelf){
                this.setState({
                    coachusers: {
                        userdata: data.userSelf
                    }
                }, () => this._fetchUsersWithoutCache());
            }
        })
        .catch(error => {
            this.setState({
                syncing: false
            }, () => console.log("Error",error));
        })
    }
    
    _fetchAllUsers = (customers) => {
        this.props.client.query({
            query: GET_USERS_ALL,
            variables: { "token": localStorage.getItem("fprint") }
        }).then(({data}) => {
            let users = data.userAll;
            this._getDifference(users, customers);
        })
        .catch(error => {
            this.setState({
                syncing: false
            }, () => console.log("Error",error));
        })
    }

    _getDifference = (users, customers) => {
        // Check if user is in Shopify but not in Charm
        let selection = customers.map((customer, i) => {
            if(users.some(user => user.telephone === customer.phone)){
                // User already exists
                return undefined;
            } else{
                // User does not exist
                return customer;
            }
        })

        // Remove all undefined entries from array
        selection = selection.filter(function(item){
            return typeof item !== 'undefined';  
        });

        selection.map((customer, i) => {
            this._createUser(customer);
        });

        this.setState({
            syncing: undefined
        });
    }

    _createUser = (data) => {
        // Get all values and prepare them for API handling
        const values = {
            "title": undefined,
            "coach_id": 2,
            "first_name": data.first_name,
            "last_name": data.last_name,
            "email": data.email ? data.email : undefined,
            "birthdate": undefined,
            "telephone": data.phone ? data.phone : undefined,
            "address": data.default_address.address1 ? data.default_address.address1 : undefined,
            "city": data.default_address.city ? data.default_address.city : undefined,
            "postal_code": data.default_address.province_code ? data.default_address.province_code : undefined,
            "country": data.default_address.country_code ? data.default_address.country_code : undefined,
            "newsletter": data.accepts_marketing ? true : false,
            "verified": data.verified_email ? true : false,
            "customer_id": data.id
        }
            this.props.create({
                variables: { 
                    "token": localStorage.getItem("fprint"),
                    "urlPath": "/internal/user-registration-page",
                    "values": values
                }
            }).then(({data}) => {
                console.log(data);
                
                // Check if selected coach is current coach
                if(true){
                    // Refetch users so the list is up to date
                    this._fetchUsersWithoutCache();
                }
            })
            .catch((error) => {
                console.log("Error",error);
            })
    }

    getGreetingImg = () => {
        // Get date
        let today = new Date()
        // Get current hours
        let curHr = today.getHours()

        if (curHr < 11) {
            this.setState({greetingImage: <MorningImg className="img-fluid" />});
        } else if (curHr < 18) {
            this.setState({greetingImage: <DayImg className="img-fluid" />});
        } else {
            this.setState({greetingImage: <NightImg className="img-fluid" />});
        }
    }

    getGreetingQuote = () => {
        const quotes = [
            {
                text: `Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought 
                to a focus.`,
                author: "Alexander Graham Bell"
            },
            {
                text: `Either you run the day or the day runs you.`,
                author: "Jim Rohn"
            },
            {
                text: `When we strive to become better than we are, everything around us becomes better too.`,
                author: "Paulo Coelho"
            },
            {
                text: `Opportunity is missed by most people because it is dressed in overalls and looks like work.`,
                author: "Thomas Edison"
            },
            {
                text: `Just one small positive thought in the morning can change your whole day.`,
                author: "Dalai Lama"
            },
            {
                text: `The future depends on what you do today.`,
                author: "Mahatma Gandhi"
            }
        ];

        const random = Math.floor(Math.random() * ((quotes.length - 1)));

        this.setState({
            greetingQuote: (
                <div className="text-center">
                    <small>
                        <q>{quotes[random].text}</q>
                    </small>
                    <small className="pl-2">
                        —{quotes[random].author}
                    </small>
                </div>
            )
        });
    }

    getGreetingTxt = () => {
        // Get date
        let today = new Date()
        // Get current hours
        let curHr = today.getHours()

        // Store selected greeting
        let selected = null;

        if (curHr < 11) {
            selected = <span>Guten Morgen</span>;
        } else if (curHr < 18) {
            selected = <span>Willkommen zurück</span>;
        } else {
            selected = <span>Guten Abend</span>;
        }

        return selected;
    }

    _getCoachUsers = () => {
        let coach = this.state.coachusers;

        console.log("State",coach);
        
        if(coach){
            if(coach.userdata){
                let userSet = coach.userdata.userSet;
                if(userSet.length >= 1){

                    userSet.sort((a, b) => (a.dateJoined < b.dateJoined) ? 1 : -1)

                    let users = userSet.map((user, i) => {
                        return({
                            'userid': user.customerId ? user.customerId : "00000",
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
                                    user: user,
                                    userdata: this.props.globalState.userdata
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
            <div id="coach">
                <div className="greeting py-5">
                    {this.state.greetingImage}
                    <h2 className="text-center font-weight-bold">
                    {this.getGreetingTxt()}, <span>{globalState.userdata.firstName}</span>!
                    </h2>
                    {this.state.greetingQuote}
                </div>
                <div className="mb-4 py-4 greeting-actions">
                    <MDBContainer>
                        <MDBRow className="flex-center text-center">
                            <MDBCol md="6">
                                <p className="lead">
                                <MDBIcon icon="bolt" className="pr-2 orange-text"/>
                                Quick actions
                                </p>
                            </MDBCol>
                            <MDBCol md="6">
                                <MDBBtn 
                                color={!this.state.syncing ? ( 
                                    this.state.syncing === false ? "danger" : "blue" 
                                ) : "cyan"} 
                                onClick={this.syncManually}
                                disabled={this.state.syncing ? true : false}
                                >
                                {!this.state.syncing ? (
                                    <>
                                    {this.state.syncing === false ? (
                                        <MDBIcon icon="times-circle" className="mr-2"/>
                                    ) : (
                                        <MDBIcon icon="sync-alt" className="pr-2"/>
                                    )}
                                    </>
                                    
                                ) : (
                                    <MDBIcon icon="sync-alt fa-spin" className="mr-2"/>
                                )}
                                {!this.state.syncing ? ( 
                                    this.state.syncing === false ? "Try again" : "Sync" 
                                ): ( 
                                    "Syncing" 
                                )}
                                </MDBBtn>
                                {globalState.userdata.email === "s.santer@pharmaziegasse.at" &&
                                <a href="https://manage.pharmaziegasse.at" rel="noopener noreferrer" target="_blank">
                                    <MDBBtn color="primary">
                                        <MDBIcon icon="dove" className="pr-2"/>Wagtail CMS
                                    </MDBBtn>
                                </a>
                                }
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </div>
                <MDBContainer>
                    <MDBRow className="text-center">
                        <MDBCol md="12">
                            <h3>Deine KundInnen</h3>
                            <div className="table-labels">
                            <span><MDBIcon icon="cube" className="pr-1 pl-3 red-text"/>
                            Keine Daten vorhanden
                            </span>
                            <span><MDBIcon icon="cube" className="pr-1 pl-3 purple-text"/>
                            Keine Aktion erforderlich
                            </span>
                            <span><MDBIcon icon="cube" className="pr-1 pl-3 green-text"/>
                            Daten vorhanden
                            </span>
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
            </div>
        )
    }
}

export default compose(
    graphql(CREATE_USER, { name: 'create' }),
)(withApollo(CoachDashboard));

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
