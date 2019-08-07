//> React
// Contains all the functionality necessary to define React components
import React from 'react';

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

// Dummy data
const report = {
    customer: "Erika Mustermann",
    coach: "Monika Mustermann",
    sections: {
        intro: "Pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.",
        hautzustand: "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.",
        ending: "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS."
    }
}

class ReportRevision extends React.Component{

    // Generate states for every section
    componentWillMount = () => {
        Object.keys(report.sections).map((name, i) => 
            this.setState({["collapse"+i]: true})
        );
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

    render() {
        return (
            <MDBContainer>
                <MDBContainer className="mt-5">
                    <h3>Review individual beauty report</h3>
                    <p>Von {report.customer}</p>

                    <MDBProgress material value={this.getStatus()} height="20px">
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
                                    {report.sections[name]}
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

export default ReportRevision;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
