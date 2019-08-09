//> React
// Contains all the functionality necessary to define React components
import React from 'react';

//> Additional libraries
// Rich-Text Editor
import RichTextEditor from 'react-rte';

//> Connect to backend
// Apollo
import { graphql } from 'react-apollo';
import { gql } from "apollo-boost";
// Previously in react-apollo { compose } 
import * as compose from 'lodash.flowright';

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

//> Mutations
// Update sections
const UPDATE_SECTIONS_MUTATION = gql`
    mutation register($token: String!, $values: GenericScalar!) {
        registrationFormPage(token: $token, url: "/registration", values: $values) {
            result
            errors {
            name
            errors
            }
        }
    }
`;

//> Queries
// Get sections
const GET_SECTIONS_DATA = gql`
    query modal(
        $token: String!
    ){
        pages(
            token: $token
        ){
            ... on RegistrationFormPage{
            registrationHead
            registrationInfoText
            registrationNewsletterText
            registrationPrivacyText
            registrationStepText
            thankYouText
            registrationButton{
                buttonTitle
                buttonPage{
                    id
                    urlPath
                }
            }
            }
        }
    }
`;

// Dummy data
const report = {
    customer: "Erika Mustermann",
    coach: "Monika Mustermann",
    sections: {
        intro: "ABER…! In diesem Thema müssen wir etwas ausholen, da es essentiell für deine Haut ist:<br/>Es gibt oft Verwirrung darüber, ob neben Produkten wie einer Feuchtigkeitscreme oder Grundierung mit Lichtschutzfaktor zusätzlich ein Sonnenschutzmittel verwendet werden sollte. Die Wahrheit ist, dass die meisten von uns nicht genug von unserem Kosmetikprodukt verwenden, um den gleichen Lichtschutzfaktor zu erzielen wie ein Sonnenschutzmittel allein. Im Frühjahr und Sommer lohnt es sich, ein separates Sonnenschutzmittel zu verwenden.<br/>Es ist jedoch nicht so, dass ein einheitliches Modell für alle gilt. Es muss bei der Auswahl eines Sonnenschutzes vielmehr auch ein gesunder Menschenverstand eingesetzt werden. Wenn du beispielsweise im Winter regelmäßig Peeling-Produkte wie Alpha-Hydroxy-Säuren (AHAs)  und Beta-Hydroxysäuren (BHAs)  verwendest, ist ein separater Sonnenschutz besser geeignet. Wenn du an Outdoor-Aktivitäten teilnimmst oder beruflich länger als zwanzig Minuten im Freien bist, solltest du einen täglichen Sonnenschutz verwenden. Gleiches gilt, wenn du dich in einem sonnigen Klima oder in der Nähe des Äquators befindest: Das Tragen eines regelmäßigen täglichen ",
        hautzustand: "die Verwendung eines LSF 30 keinen doppelt so hohen Schutz bietet, wie die Verwendung von LSF 15? Ebenso ist ein Faktor 20 nicht doppelt so gut wie ein Faktor 10. Ein LSF 15 blockiert etwa 93% der UVB Strahlung. Ein LSF 30 blockiert etwa 97% und LSF 50 blockiert etwa 98% der UVB Strahlung. Du siehst also, dass zwischen einem LSF von 30 und 50 tatsächlich kaum Unterschiede bestehen. Es gibt keinen Sonnenschutz, der 100% igen Schutz vor der Sonne bietet.",
        ending: "Das sagen unsere Experten<br/>Das natürliche Altern der Haut steht in direkter Verbindung mit der Sauerstoffversorgung. Schon ab dem 20. Lebensjahr beginnen die Kapillaren dem Gewebe immer weniger Sauerstoff zuzuführen, wofür eine altersbedingte Verengung der Gefäße verantwortlich ist (der Aufenthalt in geschlossenen Räumen kann diese Tendenz verstärken). Durch die verminderte Sauerstoffzufuhr werden nicht genügend Nährstoffe zu den Zellen transportiert, so dass diese allmählich „verhungern“. Wer sich regelmäßig an der frischen Luft aufhält, pumpt jede Menge Sauerstoff in seine Lungen: 95 Prozent über die Atmung und fünf Prozent über die Haut. In den Zellen bewirkt der Sauerstoff einen Teilungsimpuls, der die Haut jünger und frischer aussehen lässt.",
    }
}

class ReportRevision extends React.Component{

    componentWillMount = () => {
        Object.keys(report.sections).map((name, i) => {
            // Generate states for every section
            this.setState({ ["collapse"+i]: true })
            // Text Editor
            if(report.sections[name] !== "" && report.sections[name] !== undefined){
                // Save current section to text editor
                this.setState({ ["value"+i]: RichTextEditor.createValueFromString(report.sections[name], 'html') })
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
        let count = Object.keys(report.sections).length;
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

    render() {
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
        return (
            <MDBContainer>
                <MDBContainer className="mt-5">
                    <h3>Review individual beauty report</h3>
                    <p>Von {report.customer}</p>

                    <MDBProgress material color={this.getStatus() === 100 ? ("success") : ("secondary")} value={this.getStatus()} height="20px">
                    {this.getStatus() > 0 &&
                        <>{Math.round(this.getStatus())}% abgeschlossen</>
                    }
                        
                    </MDBProgress>
                    {Object.keys(report.sections).map((name, i) => {
                        return(
                            <MDBCard key={i} className="mt-3">
                                <MDBCollapseHeader>
                                    <MDBRow className="justify-content-center">
                                        <MDBCol md="6" className="align-self-center section-title">
                                            {name}
                                        </MDBCol>
                                        <MDBCol md="6" className="text-right">
                                            <MDBInput label="Überprüft" filled type="checkbox" id={"checkbox"+i} onClick={this.toggleCollapse("collapse"+i)} />
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
                            <MDBBtn color="danger"><MDBIcon icon="times" className="pr-2" />Verwerfen</MDBBtn>
                        </MDBCol>
                        <MDBCol md="6" className="text-right">
                            <MDBBtn color="success" disabled={this.isFinished()}><MDBIcon icon="save" className="pr-2" />Speichern</MDBBtn>
                            <MDBBtn color="green" disabled={this.isFinished()}><MDBIcon far icon="file-pdf" className="pr-2" />Speichern + PDF</MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </MDBContainer>
        );
    }
}

export default compose(
    graphql(UPDATE_SECTIONS_MUTATION, {
        name: 'register'
    }),
    graphql(GET_SECTIONS_DATA, {
        options: (props) => ({ variables: { "token": props.token } })
    })
)(ReportRevision);

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
