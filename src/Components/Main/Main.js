import React from "react";
import "./CSS/Main.css";
import API from "../../Auth/api";
import { Container, Row, Col } from "react-bootstrap";
import QRCode from 'qrcode.react';


export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: "",
      products: [],
      loadingState: false,
      imageSource: "",
      imageAlt: "",
      parentID: "",
      parent: [],
      collection: "",
      sizes: [],
      displayResult: false,
      ExtURL: "",
      Unitex: false,
      alertMessage: "",
      isVariable: false,
      qrLink: 'www.paylessflooring.com',
    };
  }

  handleResult = (status, message = "") => {
    this.setState(
      {
        displayResult: status,
      },
      this.handleLoading(!status, message)
    );
  };
  handleLoading = (status, message = "") => {
    this.setState({
      loadingState: status,
      alertMessage: message,
    });
  };
  handleChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };
  handleSearch = (e) => {
    if (this.state.searchQuery === "") {
      this.handleLoading(false, "Please search SKU in the search box");
    } else {
      this.handleResult(false, "Getting results from the server...");
      this.setState({
        products: [],
      });
      // const searchPhrase = "products/" + this.state.searchQuery;
      const searchPhrase = "products/?sku=" + this.state.searchQuery;
      // const searchPhrase = "products/?name=" + this.state.searchQuery;
      API.get(searchPhrase)
        .then((res) => {
          if (res.data === []) {
            this.handleLoading(
              false,
              "No result has been found, try another sku"
            );
          } else {
            const result = res.data[0];
            const link  = result.permalink.search("?");
            console.log(result);
            const qrText = result.permalink + ", "+ result.sku;
            this.setState({
              products: result,
              qrlink: result.permalink,
            });
            this.handleResult(true);
          }
        })
        .catch((err) => {
          this.handleLoading(
            false,
            "Error Getting results from the server, please try again"
          );
        });
    }
  };

  render() {
    return (
      <Container fluid id="main-wrapper" className="d-flex flex-column">
        <Row className="justify-content-md-center">
          <Col id="main-container" xl={5} lg={6} md={8} sm={10} xs={12}>
            <Row className="d-flex flex-column ">
              <Row>
                <Col>
                  <img
                    src="/images/logo.png"
                    id="main-logo"
                    alt="Payless Flooring logo"
                  />
                </Col>
              </Row>
              
              <Row className="d-flex flex-row align-items-center">
                <Col sm={9} xs={12}>
                  <input
                    type="text"
                    id="main-search-input"
                    placeholder=" Search SKU"
                    onChange={this.handleChange}
                  />
                </Col>

                <Col sm={3} xs={12}>
                  <button
                    id="main-search-button"
                    type="button"
                    className="btn btn-primary "
                    onClick={this.handleSearch}
                  >
                    {this.state.loadingState ? "Loading data.." : "Search"}
                  </button>
                </Col>
              </Row>
              <Row>
                <Col id="loading">
                  <div
                    className={`loader ${
                      this.state.loadingState ? "Visible" : "Hidden"
                    }`}
                  ></div>
                  <span className="loading-label">
                    {this.state.alertMessage}
                  </span>
                </Col>
              </Row>
            </Row>

            <Container
              className={`${
                this.state.displayResult ? "Visible" : "Hidden"
              } p-0`}
            >
              <hr />
              <Row>
                <Col>          
                 <QRCode value={this.state.qrLink} /> 
                <p>
                {this.state.qrLink}
                </p>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}
