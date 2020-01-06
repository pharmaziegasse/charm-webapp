//> Backend Connection
// Apollo
import { graphql, withApollo } from "react-apollo";
import { gql } from "apollo-boost";
import * as compose from 'lodash.flowright';

const UPDATE_FORMS = gql`
    mutation createUser ($token: String!, $urlPath: String!, $values: GenericScalar!) {
        userUserFormPage(
            token: $token,
            url: $urlPath,
            values: $values
        ) {
            result
            errors {
            name
            errors
            }
        }
    }
`;

class NewCustomer {
  _createUser = () => {
      if(this.state.phone.trim() !== "" && this.state.coach.length >= 1  ){
          
          // Get all values and prepare them for API handling
          const values = {
              "title": this.state.title,
              "coach_id": this.state.coach[0],
              "first_name": this.state.firstName,
              "last_name": this.state.lastName,
              "email": this.state.email,
              "birthdate": this.state.birthdate,
              "telephone": this.state.phone,
              "address": this.state.address,
              "city": this.state.city,
              "postal_code": this.state.zip,
              "country": this.state.country.countryCode,
              "customer_id": this.state.customerid
          }

          let urlPath = this.state.urlPath[0];

          if(
              urlPath &&
              this.state.coach[0] &&
              this.state.firstName &&
              this.state.lastName
          ){
              this.setState({
                  loading: true,
                  errors: {}
              });
              this.props.update({
                  variables: { 
                      "token": localStorage.getItem("fprint"),
                      "urlPath": urlPath,
                      "values": values
                  }
              }).then(({data}) => {
                  this.setState({
                      loading: false
                  });
                  if(data.userUserFormPage.result === "OK"){
                      this.setState({
                          errors: {},
                          success: true
                      });
                  } else if (data.userUserFormPage.result === "FAIL"){
                      console.log("Errors",data.userUserFormPage.errors);
                  }
              })
              .catch(error => {
                  if(error){
                      console.log(error.graphQLErrors.map(x => x.message));
                      let errors = error.graphQLErrors;

                      let results = {};
                      errors.map((x) => {
                          //let msg = JSON.parse(x.message);
                          console.log(x);
                          if(x.message.includes("'telephone'")){
                              results = {
                                  telephone: true,
                              }
                          }
                          return true;
                      })

                      console.log(results);

                      if(results){
                          this.setState({
                              errors: {
                                  ...this.state.errors,
                                  ...results,
                              },
                              loading: false,
                          });
                      }
                  }
              })
          }

          //console.log(values);

      } else {
          this.setState({
              errors: {
                  ...this.state.errors,
                  required: true,
              },
              loading: false,
          });
      }
  }
}

export default compose(
    graphql(UPDATE_FORMS, { name: 'update' }),
)(withApollo(NewCustomer));

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
