import React from 'react';

import API from './api';

export default class ProductSearch extends React.Component {
  state = {
    products: []
  }

  componentDidMount() {
    API.get(`products/?sku=SKAN-300-GREY-280X190`)
      .then(res => {
        const products = res.data;
        this.setState({ products });
      })
  }

  render() {
    return (
      <ul>
        { this.state.products.map(product => <li>{product.name} | {product.sku}</li>)}
      </ul>
    )
  }
}