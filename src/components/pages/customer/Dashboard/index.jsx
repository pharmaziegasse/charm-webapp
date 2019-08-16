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
  MDBBtn,
  MDBAvatar,
} from 'mdbreact';
// Radar chart
import { Radar } from "react-chartjs-2";

//> Components
/**
 * Navbar: User navigation bar
 */
import {
  Navbar,
} from '../../../molecules';

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
      <Navbar />
        <div className="support-card">
          <MDBBtn tag="a" size="lg" floating gradient="night-fade">
            <MDBIcon far icon="comments fa-2x" />
          </MDBBtn>
          <MDBBtn rounded outline color="secondary">Coach kontaktieren</MDBBtn>
        </div>
        <MDBContainer>
          <MDBRow className="justify-content-center">
            <MDBCol md="6">
              <MDBCard className="chart-card">
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
              <MDBCard className="timeline-card">
                <MDBCardBody className="py-0">
                  <MDBRow>
                    <div className="mdb-feed">
                      <div className="news">
                        <div className="label">
                          <img
                            src="https://mdbootstrap.com/img/Photos/Avatars/img%20(18)-mini.jpg"
                            alt=""
                            className="rounded-circle z-depth-1-half"
                          />
                        </div>
                        <div className="excerpt">
                          <div className="brief">
                            <a href="#!" className="name">
                              Monika
                            </a> hat Ihr neues Programm <a href="#!">versendet</a>
                            <div className="date">Vor 10 Stunden</div>
                          </div>
                          <div className="added-images">
                            <img
                              src="https://pharmaziegasse.at/media/images/IMG_9948.original.jpg"
                              alt=""
                              className="z-depth-1 rounded mb-md-0 mb-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="news">
                        <div className="label">
                          <img
                            src="https://mdbootstrap.com/img/Photos/Avatars/img%20(20)-mini.jpg"
                            alt=""
                            className="rounded-circle z-depth-1-half"
                          />
                        </div>
                        <div className="excerpt">
                          <div className="brief">
                            Sie haben sich die Verbesserungen angesehen
                            <div href="#!" className="date">
                              Vor 14 Stunden
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="news">
                        <div className="label">
                          <img
                            src="https://mdbootstrap.com/img/Photos/Avatars/img%20(18)-mini.jpg"
                            alt=""
                            className="rounded-circle z-depth-1-half"
                          />
                        </div>
                        <div className="excerpt">
                          <div className="brief">
                            <a href="#!" className="name">
                              Monika
                            </a> hat Ihr Programm verbessert
                            <div className="date">Vor 2 Tagen</div>
                          </div>
                          <div className="added-text">
                            Da Ihre unreine Haut am meisten Potential für Verbesserungen bietet, habe ich Ihr individuelles Programm genau auf Ihre Bedürfnisse hin angepasst.
                          </div>
                        </div>
                      </div>

                      <div className="news">
                        <div className="label">
                          <img
                            src="https://mdbootstrap.com/img/Photos/Avatars/img%20(20)-mini.jpg"
                            alt=""
                            className="rounded-circle z-depth-1-half"
                          />
                        </div>
                        <div className="excerpt">
                          <div className="brief">
                            Sie haben Ihren <a href="#!">Hautzustand</a> aktualisiert
                            <div className="date">Vor 3 Tagen</div>
                          </div>
                          <div className="added-images">
                            <img
                              src="https://pixnio.com/free-images/2017/11/30/2017-11-30-18-11-20-1200x800.jpg"
                              alt=""
                              className="z-depth-1 rounded"
                            />
                          </div>
                        </div>
                      </div>
                      <a href="!#">Gesamte Timeline anzeigen</a>
                    </div>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md="10" className="my-5">
              <MDBCard className="coach-card">
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol md="auto pl-5">
                      <MDBAvatar>
                        <img
                          src="https://mdbootstrap.com/img/Photos/Avatars/img%20(18).jpg"
                          alt=""
                          className="rounded-circle img-fluid"
                        />
                      </MDBAvatar>
                    </MDBCol>
                    <MDBCol className="align-self-center">
                      <h4>Monika Mustermann</h4>
                      <p className="text-muted m-0">Ihr persölicher Beauty Coach</p>
                    </MDBCol>
                    <MDBCol className="align-self-center text-right pr-5">
                      <MDBBtn rounded outline color="secondary">Coach kontaktieren</MDBBtn>
                    </MDBCol>
                  </MDBRow>
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
