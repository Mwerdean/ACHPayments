import React, { Component } from 'react'
import router from './router'
import { AppProvider } from '@shopify/polaris'

class App extends Component {
  render() {
    return (
        <AppProvider>
          {/* <Page> */}
            {router}
          {/* </Page> */}
        </AppProvider>
    );
  }
}

export default App;
