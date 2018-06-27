import React from 'react'
import {Route, Switch} from 'react-router-dom'
import AccountInfo from './components/AccountInfo.js'
import Verify from './components/Verify.js'
import Cart from './components/Cart.js'
import Header from './components/Header'

export default (
    <Switch>
        <Route exact path="/" component = { AccountInfo } />
        <Route path="/verify" component = { Verify } />
        <Route path="/cart" component = { Cart } />
        <Route path="/header" component = { Header } /> 
    </Switch>
    )