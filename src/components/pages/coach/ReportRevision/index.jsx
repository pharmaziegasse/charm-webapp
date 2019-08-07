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
} from 'mdbreact';

class ReportRevision extends React.Component{
    state={
        collapse1: true,
        collapse2: true,
        collapse3: true,
    }

    toggleCollapse = collapseID => () =>
    this.setState({
        [collapseID]: !(this.state[collapseID])
    });

render() {
    console.log(this.state);
  return (
    <MDBContainer>
      <MDBContainer className="mt-5">
        <h4>Review individual beauty report</h4>
        <MDBProgress material value={33} height="20px">
            33%
        </MDBProgress>
        <MDBCard className="mt-3">
          <MDBCollapseHeader>
            <MDBRow className="justify-content-center">
                <MDBCol md="6" className="align-self-center">
                    Intro
                </MDBCol>
                <MDBCol md="6" className="text-right">
                    <MDBInput label="Überprüft" filled type="checkbox" id="checkbox1" onClick={this.toggleCollapse("collapse1")} />
                </MDBCol>
            </MDBRow>
          </MDBCollapseHeader>
          <MDBCollapse id="collapse1" isOpen={this.state.collapse1}>
            <MDBCardBody>
              Pariatur cliche reprehenderit, enim eiusmod high life accusamus
              terry richardson ad squid. 3 wolf moon officia aute, non
              cupidatat skateboard dolor brunch. Food truck quinoa nesciunt
              laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a
              bird on it squid single-origin coffee nulla assumenda shoreditch
              et. Nihil anim keffiyeh helvetica, craft beer labore wes
              anderson cred nesciunt sapiente ea proident. Ad vegan excepteur
              butcher vice lomo. Leggings occaecat craft beer farm-to-table,
              raw denim aesthetic synth nesciunt you probably haven&apos;t
              heard of them accusamus labore sustainable VHS.
            </MDBCardBody>
          </MDBCollapse>
        </MDBCard>

        <MDBCard>
          <MDBCollapseHeader>
            <MDBRow className="justify-content-center">
                <MDBCol md="6" className="align-self-center">
                    Hautzustand
                </MDBCol>
                <MDBCol md="6" className="text-right">
                    <MDBInput label="Überprüft" filled type="checkbox" id="checkbox2" onClick={this.toggleCollapse("collapse2")} />
                </MDBCol>
            </MDBRow>
          </MDBCollapseHeader>
          <MDBCollapse id="collapse2" isOpen={this.state.collapse2}>
            <MDBCardBody>
              Anim pariatur cliche reprehenderit, enim eiusmod high life
              accusamus terry richardson ad squid. 3 wolf moon officia aute,
              non cupidatat skateboard dolor brunch. Food truck quinoa
              nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua
              put a bird on it squid single-origin coffee nulla assumenda
              shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore
              wes anderson cred nesciunt sapiente ea proident. Ad vegan
              excepteur butcher vice lomo. Leggings occaecat craft beer
              farm-to-table, raw denim aesthetic synth nesciunt you probably
              haven&apos;t heard of them accusamus labore sustainable VHS.
            </MDBCardBody>
          </MDBCollapse>
        </MDBCard>

        <MDBCard>
           <MDBCollapseHeader>
            <MDBRow className="justify-content-center">
                <MDBCol md="6" className="align-self-center">
                    Intro
                </MDBCol>
                <MDBCol md="6" className="text-right">
                    <MDBInput label="Überprüft" filled type="checkbox" id="checkbox3" onClick={this.toggleCollapse("collapse3")} />
                </MDBCol>
            </MDBRow>
          </MDBCollapseHeader>
          <MDBCollapse id="collapse3" isOpen={this.state.collapse3}>
            <MDBCardBody>
              Anim pariatur cliche reprehenderit, enim eiusmod high life
              accusamus terry richardson ad squid. 3 wolf moon officia aute,
              non cupidatat skateboard dolor brunch. Food truck quinoa
              nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua
              put a bird on it squid single-origin coffee nulla assumenda
              shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore
              wes anderson cred nesciunt sapiente ea proident. Ad vegan
              excepteur butcher vice lomo. Leggings occaecat craft beer
              farm-to-table, raw denim aesthetic synth nesciunt you probably
              haven&apos;t heard of them accusamus labore sustainable VHS.
            </MDBCardBody>
          </MDBCollapse>
        </MDBCard>
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
