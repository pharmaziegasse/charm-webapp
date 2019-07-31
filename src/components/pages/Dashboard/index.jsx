//> React
// Contains all the functionality necessary to define React components
import React from 'react';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBEdgeHeader,
  MDBFreeBird,
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBCardBody,
  MDBIcon,
  MDBCard,
  MDBCardTitle,
  MDBCardImage,
  MDBCardText,
  MDBAnimation,
} from 'mdbreact';

//> Images
// Logo of MDB React
import MDBLogo from '../../../assets/mdb-react-small.png';
// Logo of Advertisement Agency Christian Aichner
import AgencyLogo from '../../../assets/agency-small.png';
// Image of a handshake
import HireUs from '../../../assets/content/hire-us.jpg';
// Logo of the React Bootstrap (outrun) project
// Ref: https://github.com/aichner/React-Outrun
import Outrun from '../../../assets/content/outrun.jpg';
// Image of someone coding
import Projects from '../../../assets/content/projects.jpg';

class HomePage extends React.Component {
  scrollToTop = () => window.scrollTo(0, 0);
  render() {
    return (
      <>
        <MDBCard className="support-card">
          <MDBCardBody>
            <MDBCardTitle>Card title</MDBCardTitle>
            <MDBCardText>
              Some quick example text to build on the card title and make
              up the bulk of the card&apos;s content.
            </MDBCardText>
          </MDBCardBody>
        </MDBCard>
        <MDBContainer>
          <MDBRow>
            <MDBCol md="6">
              <MDBCard>
                <MDBCardBody>
                  <MDBCardTitle>Card title</MDBCardTitle>
                  <MDBCardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md="6">
              <MDBCard>
                <MDBCardBody>
                  <MDBCardTitle>Card title</MDBCardTitle>
                  <MDBCardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md="12" className="my-4">
              <MDBCard>
                <MDBCardBody>
                  <MDBCardTitle>Card title</MDBCardTitle>
                  <MDBCardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </>
    );
  }
}

export default HomePage;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
