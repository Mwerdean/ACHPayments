import React, { Component } from 'react'
import '../App.css'

export default class Header extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    render(){
        return(
            <div className="nav">
                <div>
                    Cart
                </div>
                <div>
                    Log out
                </div>
                <div>
                    My Account
                </div>
            </div>
        )
    }
} 