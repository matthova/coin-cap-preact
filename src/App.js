import React, { Component } from 'react';
import SimpleSchema from 'simpl-schema';
import request from 'request-promise';

import Coin from './Coin';

class App extends Component {
  constructor(props) {
    super();

    this.state = {
      cash: 10000,
      coins: 10,
      coinData: [],
    };

    this.updateCoinData(this.state.coins);
    this.updateCoinDate = this.updateCoinData.bind(this);
    this.updateCash = this.updateCash.bind(this);
    this.updateCoins = this.updateCoins.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.coins !== this.state.coins) {
      this.updateCoinData(nextState.coins);
    }
  }

  async updateCoinData(nCoins = 10) {
    const coinData = await request(`https://api.coinmarketcap.com/v1/ticker/?limit=${nCoins}`, {
      json: true,
    }).catch((err) => {
      console.log('Request error', err);
    });

    this.setState({ coinData });
  }

  updateCash(event) {
    event.preventDefault();

    try {
      const schema = new SimpleSchema({
        cash: {
          type: Number,
          label: 'Cash',
        },
      });

      const cash = Number(event.target.value.replace('$', ''));
      if (Number.isNaN(cash)) {
        throw new Error(`Input is not a number "${cash}"`);
      }

      schema.validate({ cash });
      this.setState({ cash });
    } catch (ex) {}
  }

  updateCoins(event) {
    event.preventDefault();
    try {
      const schema = new SimpleSchema({
        coins: {
          type: Number,
          label: 'Coins',
        },
      });

      const coins = Number(event.target.value);
      if (Number.isNaN(coins)) {
        throw new Error(`Input is not a number "${coins}"`);
      }

      schema.validate({ coins });
      this.setState({ coins });
    } catch (ex) {}
  }

  getTotalCash() {
    let totalCash = 0;
    this.state.coinData.forEach((cc) => {
      totalCash += Number(cc.market_cap_usd);
    });

    return totalCash;
  }

  render() {
    const totalCash = this.getTotalCash();

    return (
      <div className="App">
        <div className="setup-form">
          <h3>Total amount to invest</h3>
          <input type="text" onChange={this.updateCash} value={`$${this.state.cash}`} />
          <br />
          <h3>Number of coins to invest in</h3>
          <input type="text" onChange={this.updateCoins} value={this.state.coins} />
        </div>
        <div className="coinData">
          {this.state.coinData.map(coin => (
            <Coin key={coin.id} cash={this.state.cash} totalCash={totalCash} {...coin} />
          ))}
        </div>
      </div>
    );
  }
}

export default App;
