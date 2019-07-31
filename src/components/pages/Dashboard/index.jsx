//> React
// Contains all the functionality necessary to define React components
import React, { Fragment } from 'react';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBCardBody,
  MDBIcon,
  MDBCard,
  MDBCardTitle,
  MDBCardText,
  MDBAnimation,
  MDBBtn,
  MDBAvatar,
} from 'mdbreact';
// Radar chart
import { Radar } from "react-chartjs-2";

class HomePage extends React.Component {
  state = {
    dataRadar: {
      labels: [
        'Große Poren',
        'Sensible Haut',
        'Hautalterung',
        'Ölige Haut',
        'Trockene Haut',
        'Unreine Haut',
        'Pigmentflecken',
        'Zeichen\noxidativen Stresses'
      ],
      datasets: [{
          label: '# of Votes',
          data: [10, 7, 10, 10, 4, 10, 2, 5],
          backgroundColor: [
              'rgba(150, 0, 150, 0.2)',
          ],
          borderColor: [
              'rgba(150, 0, 150, 1)',
          ],
          borderWidth: 1
      }]
    },
    dataRadarOptions: {
        responsive: true,
        elements: {
            line: {
                tension: 0.4
            }
        },
        legend: {
            display: false,
        },
        scale: {
            ticks: {
                beginAtZero: true,
                max: 10,
                min: 0
            }
        },
        scales: {
            yAxes: [{
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    display: false
                }
            }],
            xAxes: [{
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    beginAtZero: true,
                    display: false,
                    stepSize: 1,
                    min: 0,
                    max: 10
                }
            }]
        }
    },
    dataRadarPlugins: [{
        beforeInit: function (chart) {
        chart.data.labels.forEach(function (e, i, a) {
            if (/\n/.test(e)) {
            a[i] = e.split(/\n/)
            }
        })
        }
    }]
  }

  scrollToTop = () => window.scrollTo(0, 0);
  render() {
    return (
      <Fragment>
        <div className="support-card">
          <MDBBtn tag="a" size="lg" floating gradient="night-fade">
            <MDBIcon far icon="comments fa-2x" />
          </MDBBtn>
          <MDBBtn rounded outline color="secondary">Coach kontaktieren</MDBBtn>
        </div>
        <MDBContainer>
          <MDBRow>
            <MDBCol md="6">
              <MDBCard>
                <MDBCardBody>
                  <MDBCardTitle className="mb-4">Ihr Hautzustand</MDBCardTitle>
                  <Radar data={this.state.dataRadar} options={this.state.dataRadarOptions} plugins={this.state.dataRadarPlugins} />
                  <MDBCardText className="mt-4">
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
              <MDBCard className="coach-card">
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
      </Fragment>
    );
  }
}

export default HomePage;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
