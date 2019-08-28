//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Redirect from Router
import { Redirect } from 'react-router-dom';

//> Additional libraries
// Rich-Text Editor
import RichTextEditor from 'react-rte';

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
} from 'mdbreact';

// Rich Text Box editor config
const toolbarConfig = {
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
        {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
        {label: 'Italic', style: 'ITALIC'},
        {label: 'Underline', style: 'UNDERLINE'}
    ],
    BLOCK_TYPE_DROPDOWN: [
        {label: 'Normal', style: 'unstyled'},
        {label: 'Heading Large', style: 'header-one'},
        {label: 'Heading Medium', style: 'header-two'},
        {label: 'Heading Small', style: 'header-three'}
    ],
    BLOCK_TYPE_BUTTONS: [
        {label: 'UL', style: 'unordered-list-item'},
        {label: 'OL', style: 'ordered-list-item'}
    ]
};

class ReportRevision extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            test: ""
        }
    }

    componentWillMount = () => {
        Object.keys(this.props.location.state.articles).map((name, i) => {
            // Generate states for every section
            this.setState({ ["collapse"+i]: true })
            // Text Editor
            if(this.props.location.state.articles[name].text !== "" &&
            this.props.location.state.articles[name].text !== undefined){
                // Save current section to text editor
                this.setState({ 
                    ["value"+i]: RichTextEditor.createValueFromString(
                            this.props.location.state.articles[name].text, 'html'
                        ) 
                    })
                return true;
            } else {
                // Create empty value if the section has no text
                this.setState({ ["value"+i]: RichTextEditor.createEmptyValue() })
                return false;
            }
        });
    }

    // Toggle the visibility of the sections
    toggleCollapse = collapseID => () =>
    this.setState({
        [collapseID]: !(this.state[collapseID])
    });

    // Get how many % of the sections are finished
    getStatus = () => {
        let reviewed = 0;
        Object.keys(this.state).map((item, i) => {
            // Get how many collapse items are reviewed
            if(this.state[item] === false){
                reviewed++;
            }
            return true;
        })
        let count = Object.keys(this.props.location.state.articles).length;
        return (reviewed / count) * 100;
    }

    // Get if its finished
    isFinished = () => {
        if(this.getStatus() === 100){
            // Is enabled
            return false;
        } else {
            // Is disabled
            return true;
        }
    }

    // Change text in box
    onChange = (i,e) => {
        // e contains the value and additional information about the editor
        this.setState({["value"+i]: e});
    }

    goBack = () => {
        let path = `../report`;
        this.props.history.push(path);
    }

    render() {
        // Get global state with login information
        const { globalState } = this.props;

        //> Route protection
        // Only logged in uses can access this page
        if(!globalState.logged) return <Redirect to="/login"/>
        // If logged in but not coach
        if(globalState.logged && !globalState.coach) return <Redirect to="/dashboard"/> 
        
        console.log(this.state);
        // Secure this page - Make sure there is an active state
        const { location } = this.props; 
        if(location !== undefined){
            if(location.state !== undefined){
                return (
                    <MDBContainer>
                        <MDBContainer className="mt-5">
                            <h3>Review individual beauty report</h3>
                            <p>Von Max</p>

                            <MDBProgress
                            material
                            color={this.getStatus() === 100 ? ("success") : ("secondary")}
                            value={this.getStatus()}
                            height="20px">
                            {this.getStatus() > 0 &&
                                <>{Math.round(this.getStatus())}% abgeschlossen</>
                            }
                                
                            </MDBProgress>
                            {Object.keys(location.state.articles).map((name, i) => {
                                let article = location.state.articles[name];
                                return(
                                    <MDBCard key={i} className="mt-3">
                                        <MDBCollapseHeader>
                                            <MDBRow className="justify-content-center">
                                                <MDBCol md="6" className="align-self-center section-title">
                                                    {article.heading}
                                                </MDBCol>
                                                <MDBCol md="6" className="text-right">
                                                    <MDBInput
                                                    label="Überprüft"
                                                    filled
                                                    type="checkbox"
                                                    id={"checkbox"+i}
                                                    onClick={this.toggleCollapse("collapse"+i)}
                                                    />
                                                </MDBCol>
                                            </MDBRow>
                                        </MDBCollapseHeader>
                                        <MDBCollapse id="collapse1" isOpen={this.state["collapse"+i]}>
                                            <MDBCardBody>
                                                <RichTextEditor
                                                    value={this.state["value"+i]}
                                                    className="textfield"
                                                    onChange={(e) => this.onChange(i, e)}
                                                    readOnly={!this.state["collapse"+i]}
                                                    toolbarConfig={toolbarConfig}
                                                />
                                            </MDBCardBody>
                                        </MDBCollapse>
                                    </MDBCard>
                                )
                            })
                            }
                            <MDBRow className="my-4">
                                <MDBCol md="6" className="text-left">
                                    <MDBBtn
                                    color="danger"
                                    onClick={this.goBack}
                                    ><MDBIcon icon="times" className="pr-2" />Verwerfen</MDBBtn>
                                </MDBCol>
                                <MDBCol md="6" className="text-right">
                                    <MDBBtn
                                    color="success"
                                    disabled={this.isFinished()}
                                    >
                                    <MDBIcon icon="save" className="pr-2" />Speichern
                                    </MDBBtn>
                                    <MDBBtn
                                    color="green"
                                    disabled={this.isFinished()}
                                    >
                                    <MDBIcon far icon="file-pdf" className="pr-2" />Speichern + PDF
                                    </MDBBtn>
                                </MDBCol>
                            </MDBRow>
                        </MDBContainer>
                    </MDBContainer>
                );
            } else {
                return null;
            }
        } else {
            return <Redirect to="/login"/> 
        }
    }
}

export default ReportRevision;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
