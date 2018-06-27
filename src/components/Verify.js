import React, {Component} from 'react'
import { FormLayout, TextField, DisplayText, Button, Card, Layout, FooterHelp } from '@shopify/polaris'
import { Link } from 'react-router-dom'
import '../App.css';
import Axios from 'axios';

export default class Verify extends Component {
    constructor(props){
        super(props)
        this.state = {
            value1: '',
            value2: ''
        }
    }

    handleChange = value => {
        this.setState({value1: value})
    }

    handleChange2 = value => {
        this.setState({value2: value})
    }

    submitValue = () => {
        //"do verify function" .then charge the account and store data for future use
        let obj = {
            value1: this.state.value1,
            value2: this.state.value2
        }
        Axios.post('http://localhost:3001/verifyBank', obj).then((res) => {
            console.log(res.data, res.status)
            this.props.history.push("/cart")
        })
    }

    render(){
        return (
            <div>
                <Layout.AnnotatedSection
                    title="Your payment is processing"
                    description="After adding your bank account, it needs to be verified. Verification is done via two small deposits into the bank account that Stripe will automatically send. These deposits will take 1-2 business days to appear on your online statement. The statement description for these deposits will be AMNTS: and then the values of the two microdeposits that were sent. You will need to relay the value of the two deposits to us."
                    >
                    <div className="top-margin">
                        <Card sectioned>
                            <DisplayText size="small">Please verify your bank account by relaying the values of two microdeposites that were were sent to your bank account.</DisplayText>
                            <br />
                            <FormLayout>
                                <FormLayout.Group condensed>
                                    <TextField 
                                        label="Value 1" 
                                        value={this.state.value1}
                                        onChange={this.handleChange}
                                        maxLength={2}
                        
                                    />
                                    <TextField 
                                        label="Value 2" 
                                        value={this.state.value2}
                                        onChange={this.handleChange2}
                                        maxLength={2}
                                    />
                                    <div className="valueButton"><Button primary onClick={this.submitValue}>Submit</Button></div>
                                </FormLayout.Group>
                            </FormLayout>
                            </Card>
                    </div>
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