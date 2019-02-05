import React, { Component } from 'react';

import ChatScreen from "./components/chatscreen";
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ChatScreen></ChatScreen>
      </div>
    );
  }
}


export default App;
