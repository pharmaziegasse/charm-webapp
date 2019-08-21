//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Redirect
import { Redirect } from 'react-router-dom';

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
                date
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

        this.state = {
            template: undefined,
            userdata: undefined,
            articles: undefined,
            loading: false,
            operations: 0,
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
                });
                this.setState({
                    template: template
                });
            }
        })
        .catch(error => {
            console.error("Mutation error:",error);
        })
    }

    fetchUserData = async () => {
        await this.props.client.query({
            query: GET_USERDATA,
            variables: { "token": localStorage.getItem("wca"), "uid": "Yeeeeeeeee" }
        }).then(({data}) => {
            if(data.usersan !== undefined){
                if(data.usersan.length > 1){
                    let date_sort_desc = function (item1, item2) {
                        // DESCENDING order
                        if (item1.date > item2.date) return -1;
                        if (item1.date < item2.date) return 1;
                        return 0;
                    };
                }
                this.setState({
                    userdata: data.usersan[0]
                });
            }
        })
        .catch(error => {
            console.error("Mutation error:",error);
        })
    }

    fetchReportData = () => {
        // Start loading animation
        this.setState({
            loading: true
        });
        // Fetch data required for creating a report
        this.fetchTemplate();
        this.fetchUserData();
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
        // Stop loading animation if active
        if(!this.state.loading){
            this.setState({
                loading: false
            });
        }
        // Set variables
        let template = this.state.template;
        let operations = 0;
        let result = {};

        // For each article
        template.articles.map((article, key) => {
            article.paragraphs.map((paragraph, i) => {
                operations = operations + 1;
                let statement = paragraph.value.statement;
                let text = paragraph.value.paragraph;

                let showParagraph = false;
                if(statement.includes(', ')){
                    let conditions = statement.split(', ')
                    let normalizeResults = conditions.map((condition, i) => {
                        return this._normalizeStatement(condition, i);
                    })
                    if(!normalizeResults.includes(false)){
                        showParagraph = true;
                    }
                } else {
                    let condition = statement.trim();
                    showParagraph = this._normalizeStatement(condition, i);
                }
                // If the paragraph should be displayed
                if(showParagraph){
                    if(result.length !== 0){
                        //There are already articles in state
                        if(!result["report_article_"+key]){
                            // There is no state for the article
                            result = {
                                ...result,
                                ["report_article_"+key]: {
                                    heading: article.articleHeader,
                                    text: text
                                }
                            }
                            
                        } else {
                            // There is already a state for the article
                            if(!result["report_article_"+key].text.includes(text)){
                                // If the text is not already included
                                result = { 
                                    ...result,
                                    ["report_article_"+key]: {
                                        heading: article.articleHeader,
                                        text: result["report_article_"+key].text + text
                                    }
                                }
                            }
                        }
                    } else {
                        // Create the first article
                        result = { 
                            ["report_article_"+key]: {
                                heading: article.articleHeader,
                                text: text
                            }
                        }
                    }
                }         
            });
        });
        if(this.state.operations === 0 && result.length !== 0){
            this.setState({
                articles: result,
                operations: operations
            })
        }
    }

    _redirect = () => {
        let sum = undefined;
        // First time
        if(sum === undefined){
            // If template has loaded
            if(this.state.template !== undefined){
                // if articles in template have loaded
                if(this.state.template.articles !== undefined){
                    // Count items in each article
                    let operations = this.state.template.articles.map((a, i) => {
                        let items = 0;
                        a.paragraphs.map(() => {
                            items++;
                        });
                        return items;
                    });
                    // The the sum of all articles
                    sum = operations.reduce((a,b) => a + b, 0);
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
        console.log(this.state);
        // Check if the data has been set
        if(this.state.template !== undefined && this.state.userdata !== undefined){
            this.createReport();
        }

        // Redirect to edit page
        if(this._redirect()){
            return(
                <Redirect to={{
                pathname: '/report/edit',
                state: { ...this.state }
                }}
                />
            )
        }

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
                <MDBBtn onClick={this.fetchReportData} color="secondary" rounded><MDBIcon icon="plus" className="pr-2" />Neuen Report generieren</MDBBtn>
            </MDBContainer>
        );
    }
}

export default withApollo(ReportList);

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
