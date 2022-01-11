import React from "react";
import "./CSS/Main.css";
import API from "../../Auth/api";
import { Container, Row, Col } from "react-bootstrap";

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
            const products = res.data[0];
            //console.log(products);
            const parent = products._links.up;
            this.setState({
              products,
              parent,
            });
            if (products.type === "variable") {
              this.setState(
                {
                  isVariable: true,
                  parentID: products.id,
                },
                this.handleVariable(products)
              );
            } else {
              this.setState(
                {
                  isVariable: false,
                  parentID: products.parent_id,
                },
                this.handleProduct(products)
              );
            }
          }
        })
        .catch((err) => {
          this.handleLoading(
            false,
            "Error Getting results from the server, please try again"
          );
          console.log(err.response);
        });
    }
  };

  handleProduct = (product) => {
    //generate the link for supplier website
    const SKU = product.sku;
    const imageSource= product.images[0].src;
    const imageAlt= product.images[0].alt;
    const metaData = product.meta_data;
    const originalCollectionName = metaData.filter( meta =>meta.key === 'ExCollectionName')
    const collection  = originalCollectionName[0].value;
    let ExtURL = "";
    let Unitex = false;
    if (product.sku.substring(3, 4) === "-") {
      Unitex = true;
      ExtURL =
        "https://b2b.unitexint.com/" +
        product.sku.replace(/-/g, "_dash_") +
        "/sf/pl.php?resetbrand=1";
    } else {
      Unitex = false;
      ExtURL =
        "https://retailers.sarayrugs.com.au/product-listing.aspx?search=&searchText=" +
        product.sku;
    }

    let sizes = [];

    if (product.type === "variable") {
      sizes = product.attributes.filter(
        (atr) => atr.name === "Size" || "Size"
      );
      sizes = sizes.options;
    }

    // if (product.type === "simple"){
    //   productSize = product.name.substring(product.name.indexOf('-' , product.name.length-15)+1).trim();
    // }

    this.setState({
      imageSource,
      imageAlt,
      SKU,
      ExtURL,
      Unitex,
      sizes,
      collection,
    }, this.handleResult(true));
  };

  handleParent = (parentID) => {
    console.log(parentID);
    const searchParentPhrase = "products/" + parentID;
    API.get(searchParentPhrase)
      .then((res) => {
        const result = res.data;
        this.setState({
          parent: result,
        });
      })
      .catch((err) => {
        this.handleLoading(
          false,
          "Error Getting results of ther parent product the server, please try again"
        );
        console.log(err.response);
      });
    const collectionName = this.state.parent.categories[0].name;
    const results = this.state.parent.attributes.filter(
      (attr) => attr.name === "Size"
    );
    const sizes = results[0].options;
    this.setState(
      {
        collection: collectionName,
        sizes: sizes,
      },
      this.handleResult(true)
    );
  };
  getCurrentYear = () => {
    const curDate = new Date();
    return curDate.getFullYear();
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
                <Col md={2} sm={3} xs={12}>
                  <img
                    src={this.state.imageSource}
                    alt={this.state.imagesAlt}
                    className="product-image"
                  />
                </Col>
                <Col md={10} sm={9} xs={12} className="text-left">
                  <p className="p-xs-0 p-m-1">
                    <span className="results-label">Payless:</span>
                    <a
                      href={this.state.products.permalink}
                      target="_blank"
                      rel="noreferrer"
                      className="results-link"
                    >
                      {this.state.products.name}
                    </a>
                  </p>
                  <p>
                    <span className="results-label">Collection:</span>
                    <span className="results-result">
                      {this.state.collection}
                    </span>
                  </p>

                  <p
                    className= {this.state.isVariable ? "Hidden" : "Visible"}
                  >
                    <span className="results-label">Available Stock:</span>
                    <span className="results-result">
                      {this.state.products.stock_quantity}
                    </span>
                  </p>
                  <p
                    className={`${
                      this.state.isVariable ? "Hidden" : "Visible"
                    }`}
                  >
                    <span className="results-label">Sale Price:</span>
                    <span className="results-result">
                      ${this.state.products.sale_price}
                    </span>
                    <span className="results-label">| RRP:</span>
                    <span className="results-result">
                      ${this.state.products.regular_price}
                    </span>
                  </p>
                  <span
                    className={`${
                      this.state.isVariable ? "Visible" : "Hidden"
                    }`}
                  >
                    <span className="results-label">Available Sizes:</span>
                    <span className="results-result">
                      <ul>
                      {this.state.sizes.length >1 ? this.state.sizes.map((item) => (
                        <li key={item}>{item}</li>
                      )): ""}
                      </ul>
                    </span>
                  </span>
                  <p>
                    <a
                      href={this.state.ExtURL}
                      target="_blank"
                      rel="noreferrer"
                      className="results-button"
                    >
                      Product on {this.state.Unitex ? " Unitex " : " Saray "}{" "}
                      website
                    </a>
                  </p>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
        <Row id="footer">
          <Col>
            <span>Copyright © {this.getCurrentYear()} - Milad Norati</span>
          </Col>
        </Row>
      </Container>
    );
  }
}
