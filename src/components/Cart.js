import React, { Component } from 'react'
import axios from 'axios'
import { DescriptionList, Card, Layout, Button, FooterHelp } from '@shopify/polaris'
import { Link } from 'react-router-dom'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import ModalExample from './Modal'

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

  Modal.setAppElement('#root')

export default class Cart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cartItems: ["item1", "item2", "item3"],
            cartPrice: ["price1", "price2", "price3"],

            modalIsOpen: false
        }
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount(){
        //Here we will pull the cart information
        // axios.get('http://localhost:3001/cart').then(res => {
        //     console.log("cart data", res.data)
        // })
    }

    checkout = () => {
        // confirm checkout and show receipt
        axios.post("http://localhost:3001/charge").then((res) => {
            console.log(res.data, res.status)
        })
    }

    return = () => {
        //return to shopify
    }

    displayCart = () => {
        //loop through cart 

    }

    openModal() {
        this.setState({modalIsOpen: true});
      }
     
    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
    }
     
    closeModal() {
        this.setState({modalIsOpen: false});
    }

    render(){
        let displayCart = [
            {
            term: this.state.cartItems[0],
            description:
                'price',
            },
            {
            term: 'item two',
            description:
                'price two',
            },
            {
            term: 'item three',
            description:
                'price three',
            },
            {
            term: 'total',
            description:
                'total price'
            }
        ]
        return (
            <div>
                {/* Here we will display the cart, total price and confirm payment button */}
                <Layout.AnnotatedSection
                    title="Checkout"
                    description="With your ACH account set up, all you need to do is confirm your order. If there is something you wish to change please return to shopify and adjust your cart."
                    >
                <Card title="Cart" sectioned>
                <DescriptionList
                    items={displayCart}
                    />
                    <br />
                    <div className="align-right">
                        <ModalExample checkout={this.state.checkout}/>
                    </div>
                    <div>
                        <br />
                        <Button plain onClick={this.return}>Return to Shopify</Button>
                    </div>
                    </Card>
                    </Layout.AnnotatedSection>
                    <FooterHelp>
                        Have any questions?{' '}
                        <Link to="https://help.shopify.com/manual/orders/fulfill-orders">
                            Email us here
                        </Link>.
                    </FooterHelp>
                </div>
        )
    }
}