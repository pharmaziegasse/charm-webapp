//> React
// Contains all the functionality necessary to define React components
import React from 'react';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
    MDBContainer,
    MDBListGroup,
    MDBListGroupItem,
    MDBBtn,
    MDBIcon,
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
                articles {
                    ... on Reports_S_ArticleBlock {
                        articleHeader
                        paragraphs
                    }
                }
            }
        }
    }
`;
// Get user anamnsesis data
const GET_USERDATA = gql`
    query getUserData(
        $token: String!,
        $uid: String!
    ) {
        usersan (
            token: $token,
            uid: $uid
        ) {
            ... on AnamneseType {
                id
                uid
                anid
                formData
            }
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
                });
                return template;
            }
        })
        .catch(error => {
            console.error("Mutation error:",error);
        })
    }

    fetchUserData = () => {
        this.props.client.query({
            query: GET_USERDATA,
            variables: { "token": localStorage.getItem("wca"), "uid": "simon" }
        }).then(({data}) => {
            
            if(data.usersan !== undefined){
                console.log(data.usersan);
            }
        })
        .catch(error => {
            console.error("Mutation error:",error);
        })
    }

    createReport = () => {
        let template = this.fetchTemplate();
        let userdata = this.fetchUserData();
    }

    render() {
        const { data } = this.props;
        
        return (
            <MDBContainer className="text-center">
                <h2 className="mb-5">Beautyreports von Erika Mustermann</h2>
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
                <MDBBtn onClick={this.createReport} color="secondary" rounded><MDBIcon icon="plus" className="pr-2" />Neuen Report generieren</MDBBtn>
            </MDBContainer>
        );
    }
}

export default withApollo(ReportList);

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
