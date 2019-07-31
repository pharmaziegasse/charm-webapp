//> React
// Contains all the functionality necessary to define React components
import React from 'react';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBSideNav,
  MDBSideNavCat,
  MDBSideNavItem,
  MDBSideNavNav,
  MDBIcon,
  MDBAvatar,
} from 'mdbreact';

class Navbar extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        toggleStateA: false,
        breakWidth: 1300,
        windowWidth: 0
      };
    }

    componentDidMount() {
      this.handleResize();
      window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.handleResize);
    }

    handleResize = () =>
      this.setState({
        windowWidth: window.innerWidth
      });

    handleToggleClickA = () => {
      this.setState({
        toggleStateA: !this.state.toggleStateA
      });
    };

    render(){
      return(
        <>
          <MDBSideNav
            triggerOpening={this.state.toggleStateA}
            breakWidth={this.state.breakWidth}
            fixed
          >
            <MDBAvatar className="mx-5 mt-5 mb-3">
              <img
                src="https://mdbootstrap.com/img/Photos/Avatars/img%20(20).jpg"
                alt=""
                className="rounded-circle img-fluid"
              />
            </MDBAvatar>
            <h4 className="text-center">Erika Mustermann</h4>
            <li>
              <ul className="social">
                <li>
                  <a href="#!">
                    <MDBIcon fab icon="facebook-f" />
                  </a>
                </li>
                <li>
                  <a href="#!">
                    <MDBIcon fab icon="pinterest" />
                  </a>
                </li>
                <li>
                  <a href="#!">
                    <MDBIcon fab icon="google-plus-g" />
                  </a>
                </li>
                <li>
                  <a href="#!">
                    <MDBIcon fab icon="twitter" />
                  </a>
                </li>
              </ul>
            </li>
            <MDBSideNavNav>
              <MDBSideNavCat
                name="Submit blog"
                id="submit-blog-cat"
                icon="chevron-right"
              >
                <MDBSideNavItem>Submit listing</MDBSideNavItem>
                <MDBSideNavItem>Registration form</MDBSideNavItem>
              </MDBSideNavCat>
              <MDBSideNavCat
                iconRegular
                name="Instruction"
                id="instruction-cat"
                icon="hand-pointer"
              >
                <MDBSideNavItem>For bloggers</MDBSideNavItem>
                <MDBSideNavItem>For authors</MDBSideNavItem>
              </MDBSideNavCat>
              <MDBSideNavCat name="About" id="about-cat" icon="eye">
                <MDBSideNavItem>Instruction</MDBSideNavItem>
                <MDBSideNavItem>Monthly meetings</MDBSideNavItem>
              </MDBSideNavCat>
              <MDBSideNavCat
                name="Contact me"
                id="contact-me-cat"
                icon="envelope"
              >
                <MDBSideNavItem>FAQ</MDBSideNavItem>
                <MDBSideNavItem>Write a message</MDBSideNavItem>
              </MDBSideNavCat>
            </MDBSideNavNav>
            <MDBSideNavItem className="nav-settings"><MDBIcon icon="cog" className="pr-2" />Einstellungen</MDBSideNavItem>
          </MDBSideNav>
        </>
      )
    }
}

export default Navbar;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
