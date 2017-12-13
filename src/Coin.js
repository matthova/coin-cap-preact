import React, { Component } from 'react';

const Coin = props => (
  <div className="coin">
    <h1>{props.name}</h1>
    <div>Market cap: ${Number(props.market_cap_usd)}</div>
    <div>Percent of total cap: %{Number(props.market_cap_usd) / props.totalCash}</div>
    <div>Amount to invest: ${Number(props.market_cap_usd) / props.totalCash * props.cash}</div>
  </div>
);

export default Coin;
