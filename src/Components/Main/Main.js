import React from 'react'
import './CSS/Main.css';
import API from '../../Auth/api';
import { Container, Row, Col } from 'react-bootstrap';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            searchQuery: "",
            products: [],
            loadingState: false,
            imageSource: '',
            imageAlt: '',
            parentID: '',
            parent: [],
            collection: '',
            sizes: [],
            displayResult: false,
            ExtURL: '',
            Unitex: false,
            alertMessage: ''
        }
    }

    handleResult = (status) => {
        this.setState({
            displayResult: status
        }, this.handleLoading(!status));
    }
    handleLoading = (status) => {
        this.setState({
            loadingState: status
        })
    }
    handleChange = (e) => {
        this.setState({ searchQuery: e.target.value });
    }
    handleSearch = (e) => {
        if(this.state.searchQuery === ''){
          alert("Please search SKU in the search box");
          this.handleLoading(false);
        }else{
            this.handleResult(false);
            this.setState({
                products: []
            });
            
            const searchPhrase = 'products/?sku=' + this.state.searchQuery
            API.get(searchPhrase)
            .then(res => {
                console.log(res)
                if(res.data ===[]){
                    alert("No result has been found, try another sku");

                }else{
                    const results = res.data;
                    this.setState({ products: results[0] }, this.handleProduct(results[0]));
                }
                
            })
        }        
    }
    handleProduct = (product) => {
        let ExtLink = '';
        let unitexCheck = false;
        if (product.sku.substring(3, 4) === "-") {
            unitexCheck = true;
            ExtLink = "https://b2b.unitexint.com/" + product.sku.replace(/-/g, "_dash_") + "/sf/pl.php?resetbrand=1";
        } else {
            unitexCheck = false;
            ExtLink = "https://retailers.sarayrugs.com.au/product-listing.aspx?search=&searchText=" + product.sku;
        }
        this.setState({
            imageSource: product.images[0].src,
            imageAlt: product.images[0].alt,
            parentID: product.parent_id,
            SKU: product.sku,
            ExtURL: ExtLink,
            Unitex: unitexCheck,
        })
        
        const searchParentPhrase = 'products/' + product.parent_id;
        API.get(searchParentPhrase)
        .then(res => {
            const parentResults = res.data;
            this.setState({
                parent: parentResults
            }, this.handleParent(parentResults));
        })
    }
    handleParent = (parent) => {
        const collectionName = parent.categories[0].name;
        const results = parent.attributes.filter(attr => attr.name === "Size");
        const sizes = results[0].options;
        this.setState({
            collection: collectionName,
            sizes: sizes,
        }, this.handleResult(true));
    }
    
    render() {
        return (
            
            <Container fluid id='main-wrapper' className="d-flex flex-column">
                <Row className="justify-content-md-center">
                    <Col id="main-container" xl={5} lg={6} md={8} sm={10}  xs={12}>
                        <Row className="d-flex flex-column ">
                            <Row>
                                <Col>
                                    <img src='/images/logo.png'
                                    id="main-logo"
                                    alt='Payless Flooring logo' />
                                </Col>
                            </Row>
                            <Row className="d-flex flex-row align-items-center">
                                <Col   sm ={9} xs={12}>
                                    <input type="text"
                                    id="main-search-input"
                                    placeholder=' Search SKU'
                                    onChange={this.handleChange} />
                                </Col>
                                <Col  sm={3} xs={12}>
                                    <button id='main-search-button'
                                    type="button"
                                    className="btn btn-primary "
                                    onClick={this.handleSearch}>
                                    {this.state.loadingState ? 'Loading data..' : 'Search'}
                                    </button>
                                </Col>
                            </Row>
                            <Row>
                                <Col id='loading' className={`${this.state.loadingState ? "Visible" : "Hidden"}`}>
                                    <div className="loader"></div>
                                    <span className="loading-label">
                                    Waiting for the server response
                                    </span>
                                </Col>
                            </Row>
                        </Row>
            
                        <Container className={`${this.state.displayResult ? "Visible" : "Hidden"} p-0`}>
                            <hr />
                            <Row>
                                <Col md={2} sm={3} xs={12}>
                                    <img src={this.state.imageSource}
                                    alt={this.state.imagesAlt}
                                    className="product-image" />
                                </Col>
                                <Col md={10} sm = {9} xs={12} className="text-left">
                                    <p className="p-xs-0 p-m-1">
                                        <span className="results-label">
                                        Payless: 
                                        </span>
                                        <a href={this.state.products.permalink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="results-link">
                                        {this.state.products.name}
                                        </a>
                                    </p>
                                    <p>
                                        <span className="results-label">
                                        Collection:
                                        </span>
                                        <span className="results-result">
                                        {this.state.collection}
                                        </span>
                                        </p>
                                        <p>
                                        <span className="results-label">
                                        Available Stock: 
                                        </span>
                                        <span className="results-result">
                                        {this.state.products.stock_quantity}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="results-label">
                                        Sale Price:
                                        </span>
                                        <span className="results-result">
                                        ${this.state.products.sale_price}
                                        </span>
                                        <span className="results-label">
                                        | RRP:
                                        </span>
                                            <span className="results-result">
                                        ${this.state.products.regular_price}
                                        </span>
                                    </p>
                                    <p>
                                        <a href={this.state.ExtURL}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="results-button">
                                        Product on {this.state.Unitex ? ' Unitex ' : " Saray "} website
                                        </a>
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
    