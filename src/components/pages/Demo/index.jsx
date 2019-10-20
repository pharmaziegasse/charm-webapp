//> React
// Contains all the functionality necessary to define React components
import React from 'react';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBNavbar,
  MDBNavbarNav,
  MDBNavbarBrand,
  MDBCollapse,
  MDBNavLink,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBNavbarToggler,
  MDBFormInline,
  MDBCard,
  MDBCardHeader,
  MDBCardTitle,
  MDBCardText,
  MDBDropdown,
  MDBDropdownItem,
  MDBNavItem,
  MDBCardBody,
  MDBNav,
  MDBTabContent,
  MDBTabPane,
  MDBBadge,
  MDBBtn,
  MDBAlert,
  MDBIcon,
  MDBSpinner,
} from "mdbreact";

//> Axios
// For HTTP requests
import axios from 'axios';

//> CSS
import './demo.scss';

class Demo extends React.Component {
  state = {
    isOpen: false,
    activeItemClassicTabs3: "1",
    customGenerated: false,
  };

  getAirQuality = async (coordinates, apiKey, baseURL) => {
    // Configure type
    let apiVersion = "v2";
    let type = "/"+"air-quality"+"/"+apiVersion+"/";

    // Configure features
    let features = "&features="+
    "breezometer_aqi,local_aqi";

    let apiParams = "current-conditions?lat="+
    coordinates.lat+"&"+"lon="+
    coordinates.long+"&key="+apiKey;

    await axios({
      method: 'get',
      url: baseURL+type+apiParams+features
    })
    .then((response) => {
      if(response){
        let fetchData = response.data.data;
        if(fetchData.data_available){
          let indexes = fetchData.indexes;

          this.setState({
            airQuality: indexes
          });
        } else {
          console.log("No data available");
        }
      } else {
        console.log("No response from Breezometer API");
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }

  getWeather = async (coordinates, apiKey, baseURL) => {
    // Configure type
    let apiVersion = "v1";
    let type = "/"+"weather"+"/"+apiVersion+"/";

    let apiParams = "current-conditions?lat="+
    coordinates.lat+"&"+"lon="+
    coordinates.long+"&key="+apiKey;

    await axios({
      method: 'get',
      url: baseURL+type+apiParams
    })
    .then((response) => {
      if(response){
        let fetchData = response.data.data;
        this.setState({
          weather: fetchData
        });
      } else {
        console.log("No response from Breezometer API");
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }

  getWeatherForecast = async (coordinates, apiKey, baseURL) => {

    // Configure type
    let apiVersion = "v1";
    let type = "/weather/"+apiVersion+"/forecast/";
    let fetchedDays = 5;

    let apiParams = "daily?lat="+
    coordinates.lat+"&"+"lon="+
    coordinates.long+"&key="+apiKey+"&days="+fetchedDays;

    await axios({
      method: 'get',
      url: baseURL+type+apiParams
    })
    .then((response) => {
      if(response){
        let days = response.data.data;

        // Get average UV Index
        let avgUvIndex = 0;
        days.map((day, i) => {
          avgUvIndex += day.max_uv_index;
        });
        avgUvIndex = avgUvIndex / fetchedDays;

        this.setState({
          forecast: days,
          avgUvIndex: avgUvIndex
        });
      } else {
        console.log("No response from Breezometer API");
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }

  getAirQualityHistory = async (coordinates, apiKey, baseURL) => {
    // Configure type
    let apiVersion = "v2";
    let type = "/"+"air-quality"+"/"+apiVersion+"/";

    // Configure features
    let features = "&features="+
    "breezometer_aqi,local_aqi";
    let hours = 100;

    let apiParams = "historical/hourly?lat="+
    coordinates.lat+"&"+"lon="+
    coordinates.long+"&key="+apiKey+
    "&hours="+hours;

    await axios({
      method: 'get',
      url: baseURL+type+apiParams+features
    })
    .then((response) => {
      if(response){
        console.log(response);
      } else {
        console.log("No response from Breezometer API");
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }

  componentDidMount = () => {
    let apiKey;

    const baseURL = "https://api.breezometer.com";

    apiKey = process.env.REACT_APP_BREEZOMETER_APIKEY;
    
    // Basic user data
    let coordinates = {
      lat: "46.6086",
      long: "13.8506"
    }

    // Get Air Quality data
    this.getAirQuality(coordinates, apiKey, baseURL);
    // Get weather data
    this.getWeather(coordinates, apiKey, baseURL);
    // Get weather forecast
    this.getWeatherForecast(coordinates, apiKey, baseURL);
    // Get Air Quality history data
    //this.getAirQualityHistory(coordinates, apiKey, baseURL);
  }

  toggleClassicTabs3 = tab => () => {
    if (this.state.activeItemClassicTabs3 !== tab) {
    this.setState({
      activeItemClassicTabs3: tab
    });
    }
  }

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  calculateCustomResult = () => {
    let avgUvIndex = this.state.avgUvIndex;
    let airQuality = this.state.airQuality;
    let weather = this.state.weather;

    let data = {
      average: {
        uvIndex: avgUvIndex
      },
      current: {
        weather: {
          isDayTime: weather.is_day_time,
          temperature: weather.temperature,
          pressure: weather.pressure,
          humidity: weather.relative_humidity
        },
        airQuality: {
          local: {
            index: airQuality.baqi.aqi,
            color: airQuality.baqi.color,
            category: airQuality.baqi.category,
            dominantPollutant: airQuality.baqi.dominant_pollutant
          },
          environment: {
            index: airQuality.aut_umwelt.aqi,
            color: airQuality.aut_umwelt.color,
            category: airQuality.aut_umwelt.category,
            dominantPollutant: airQuality.aut_umwelt.dominant_pollutant
          }
        }
      },
    }

    console.log(data);
  }

  render() {

    console.log(this.state);

    const { avgUvIndex, airQuality, weather, customGenerated } = this.state;

    if(avgUvIndex && airQuality && weather && !customGenerated){
      console.log("Finished");
      this.calculateCustomResult();
    }

    return (
      <div id="demo">
        <MDBNavbar color="indigo" dark expand="md">
            <MDBRow className="w-100 flex-center">
              <MDBCol md="4">
                <MDBNavbarNav>
                  
                  <img
                  className="img-fluid"
                  style={{maxWidth: '200px'}}
                  src="https://www.pharmaziegasse.at/static/media/white.b858081a.png"
                  alt="Pharmaziegasse Logo"
                  />
                </MDBNavbarNav>
              </MDBCol>
              <MDBCol md="4">
                <input
                  type="text"
                  name="search"
                  placeholder="Search for people"
                  id="searchbox"
                  className="form-control"
                />
              </MDBCol>
              <MDBCol md="4">
                <MDBNavbarNav right>
                  <MDBNavItem>
                    <MDBDropdown>
                      <MDBDropdownToggle nav caret>
                        <MDBIcon icon="user" />
                      </MDBDropdownToggle>
                    </MDBDropdown>
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBNavLink className="waves-effect waves-light" to="#!">
                      <MDBIcon far icon="question-circle" />
                    </MDBNavLink>
                  </MDBNavItem>
                </MDBNavbarNav>
              </MDBCol>
            </MDBRow>
        </MDBNavbar>
        <MDBRow className="p-0 m-0 w-100">
          <MDBCol md="2" className="p-3">
            <MDBCard className="card-profile">
              <MDBCardHeader color="indigo">Customer</MDBCardHeader>
              <MDBCardBody className="text-center">
                <MDBCardTitle>Simone Prast</MDBCardTitle>
                <MDBCardText>
                  <MDBBadge color="primary" className="ml-1 mr-1">Primary</MDBBadge>
                  <MDBBadge color="primary" className="ml-1 mr-1">Primary</MDBBadge>
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
            <MDBCard className="mt-3 card-actions">
              <MDBCardHeader color="indigo">Quick actions</MDBCardHeader>
              <MDBCardBody className="text-center">
                <MDBBtn rounded outline><MDBIcon icon="phone" className="pr-2"/>Call</MDBBtn>
                <MDBBtn rounded outline><MDBIcon icon="envelope" className="pr-2"/>E-Mail</MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md="6">
            <div className="classic-tabs">
              <MDBNav classicTabs color="indigo" className="mt-5">
                <MDBNavItem>
                  <MDBNavLink 
                  to="#"
                  active={this.state.activeItemClassicTabs3==="1"}
                  onClick={this.toggleClassicTabs3("1")}
                  >
                    <MDBIcon icon="user" size="lg" />
                    <br />
                    Timeline
                  </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                  <MDBNavLink 
                  to="#"
                  active={this.state.activeItemClassicTabs3==="2"}
                  onClick={this.toggleClassicTabs3("2")}
                  >
                    <MDBIcon icon="heart" size="lg" />
                    <br />
                    Follow
                  </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                  <MDBNavLink 
                  to="#"
                  active={this.state.activeItemClassicTabs3==="3"}
                  onClick={this.toggleClassicTabs3("3")}
                  >
                    <MDBIcon icon="envelope" size="lg" />
                    <br />
                    Contact
                  </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                  <MDBNavLink 
                  to="#"
                  active={this.state.activeItemClassicTabs3==="4"}
                  onClick={this.toggleClassicTabs3("4")}
                  >
                    <MDBIcon icon="star" size="lg" />
                    <br />
                    Be Awesome
                  </MDBNavLink>
                </MDBNavItem>
              </MDBNav>
              <MDBTabContent className="card mb-5" activeItem={this.state.activeItemClassicTabs3}>
                <MDBTabPane tabId="1">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing
                    elit. Nihil odit magnam minima, soluta doloribus
                    reiciendis molestiae placeat unde eos molestias.
                    Quisquam aperiam, pariatur. Tempora, placeat ratione
                    porro voluptate odit minima.
                  </p>
                </MDBTabPane>
                <MDBTabPane tabId="2">
                  <p>
                    Quisquam aperiam, pariatur. Tempora, placeat ratione
                    porro voluptate odit minima. Lorem ipsum dolor sit amet,
                    consectetur adipisicing elit. Nihil odit magnam minima,
                    soluta doloribus reiciendis molestiae placeat unde eos
                    molestias.
                  </p>
                </MDBTabPane>
                <MDBTabPane tabId="3">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing
                    elit. Nihil odit magnam minima, soluta doloribus
                    reiciendis molestiae placeat unde eos molestias.
                    Quisquam aperiam, pariatur. Tempora, placeat ratione
                    porro voluptate odit minima.
                  </p>
                </MDBTabPane>
                <MDBTabPane tabId="4">
                  <p>
                    Quisquam aperiam, pariatur. Tempora, placeat ratione
                    porro voluptate odit minima. Lorem ipsum dolor sit amet,
                    consectetur adipisicing elit. Nihil odit magnam minima,
                    soluta doloribus reiciendis molestiae placeat unde eos
                    molestias.
                  </p>
                </MDBTabPane>
              </MDBTabContent>
            </div>
          </MDBCol>
          <MDBCol md="4">

          </MDBCol>
        </MDBRow>
      </div>
    );
  }
}

export default Demo;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
