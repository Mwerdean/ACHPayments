import React, {Component} from 'react'
import {Button, Modal, Stack, Card} from '@shopify/polaris'
import axios from 'axios'

export default class ModalExample extends Component {
    state = {
      active: false,
      checked: false,
    };
  
    render() {
      const {active, checked} = this.state;
  
      return (
        <div className="right-align">
          <Button onClick={this.handleCheckout}>Submit Payment</Button>
          <Modal
            large
            open={active}
            onClose={this.handleChange}
            title="Thank you for your purchase!"
            primaryAction={{
              content: 'Back to Shopify',
              onAction: this.handleChange,
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                onAction: this.handleChange,
              },
            ]}
          >
            <Modal.Section vertical>
                <Card title="Receipt" sectioned>
                   <p>Receipt goes here.</p>
                </Card>
            </Modal.Section>
          </Modal>
        </div>
      );
    }
  
    handleCheckout = () => {
           // confirm checkout and show receipt
           axios.post("http://localhost:3001/charge").then((res) => {
            console.log(res.data, res.status)
            this.setState(({active}) => ({active: !active}));
        })
    };

    handleChange = () => {
        this.setState(({active}) => ({active: !active}))
    }
  
    handleCheckbox = (value) => {
      this.setState({checked: value});
    };
  }