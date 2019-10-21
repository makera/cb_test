import { hot } from 'react-hot-loader';
import React from 'react';
import './App.css';
import TreeItems from './tree';

const App = () => (
  <div className="App">
    <TreeItems />
  </div>
);

export default hot(module)(App);
