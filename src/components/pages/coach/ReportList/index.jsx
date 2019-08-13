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
  MDBListGroup,
  MDBListGroupItem,
} from 'mdbreact';

// Dummy data
const reports = [
    { title: "Beautyreport", timestamp: "13.08.2019" },
    { title: "Beautyreport", timestamp: "10.07.2019" },
]

class ReportList extends React.Component{

    render() {
        return (
            <MDBContainer className="text-center">
                <h2 className="mb-5">Beautyreports von Erika Mustermann</h2>
                <MDBListGroup className="text-left m-auto" style={{ width: "22rem" }}>
                {reports.map((value, i) => {
                    return(
                        <MDBListGroupItem href="#" hover>{value.title}<span className="float-right">{value.timestamp}</span></MDBListGroupItem>
                    );
                })}
                </MDBListGroup>
            </MDBContainer>
        );
    }
}

export default ReportList;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
