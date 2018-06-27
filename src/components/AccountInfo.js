import React, { Component } from 'react'
import { TextField, Layout, Card, FormLayout, AccountConnection, Page, Button, Banner, List, FooterHelp, ChoiceList } from '@shopify/polaris'
import { Link } from 'react-router-dom'
import '../App.css'
import axios from 'axios'


export default class AccountInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            connected: true,
            customerId: "",
            customerFirstName: "",
            customerLastName: "",
            cutomerEmail: "",

            selected: ['hidden'],
            name: "",
            email: "",
            accountNumber: "",
            routingNumber: ""
        }
    }

    componentDidMount(){

        // axios.get('http://localhost:3001/customer').then(res => {
        //     console.log(res.data)
        //     this.setState({
        //         customerId: res.data.customer.id,
        //         customerFirstName: res.data.customer.first_name,
        //         customerLastName: res.data.customer.last_name,
        //         customerEmail: res.data.customer.email,
        //     })
        // })
    }

    toggleConnection() {
        if(this.state.connected === true){

            this.setState({
                connected: false,
                customerFirstName: "",
                customerLastName: ""
            })
        } else(
            axios.get('http://localhost:3001/customer').then(res => {
                this.setState({
                    connect:true,
                    customerId: res.data.customer.id,
                    customerFirstName: res.data.customer.first_name,
                    customerLastName: res.data.customer.last_name,
                    customerEmail: res.data.customer.email,
                })
            })

        )
        this.setState({
            connected: !this.state.connected
        })
    }

    handleBankAccountTypeChange = (value) => {
        this.setState({selected: value})
        console.log(this.state.selected)
    }

    handleAccountNameChange = (value) => {
        this.setState({name: value})
    }

    handleCustomerEmailChange = (value) => {
        this.setState({email: value})
    }

    handleAccountNumberChange = (value) => {
        this.setState({accountNumber: value})
    }

    handleRoutingNumberChange = (value) => {
        this.setState({routingNumber: value})
    }

    submit = () => {
        let obj = {
            name: this.state.name,
            email: this.state.email,
            bankType: this.state.selected,
            accountNumber: this.state.accountNumber,
            routingNumber: this.state.routingNumber
        }
        // axios.post(`http://localhost:3001/createCustomer`, obj).then((res) => {
        //     console.log(res.data)
        // })
        const stripe = window.Stripe('pk_test_xYzjDYZQlEaz1Ri1mcpwjUBj')
        stripe.createToken('bank_account', {
            country: 'US',
            currency: 'usd',
            routing_number: "110000000",
            account_number: "000123456789",
            account_holder_name: 'Jenny Rosen',
            account_holder_type: 'individual',
        }).then((res) => {
            const toSend = [res, obj]
            axios.post(`http://localhost:3001/createCustomer`, toSend).then((res) => {
                console.log(res.data, res.status)
                this.props.history.push("/verify")
            })
          });
    }

    accountConnectionMarkup() {
        const accountName = this.state.customerFirstName + " " + this.state.customerLastName
        const accountDetails = "Email: " + this.state.customerEmail + " ID: "  + this.state.customerId
        return this.state.connected ? 
        (
            <AccountConnection
                accountName={accountName}
                details={accountDetails}
                action={{content: 'Disconnect', onAction: this.toggleConnection.bind(this)}}
                connected={this.state.connected}
            />
        ):(
            <AccountConnection
                        title="Basised"
                        action={{content:'Connect', onAction: this.toggleConnection.bind(this)}}
                        details="No account connected"
                        termsOfService={<p>By clicking Connect, you agree to accept Basis <Link to="Example">Term and conditions</Link></p>} 
                        connected={this.state.connected}
                        />
        )
    }
    render() {
        const {selected} = this.state
        return (
            <div>
                <Page>
            <Layout>
                <Banner
                        title="Before you make a purchase using ACH, make sure you are aware of the following:"
                        status="warning"
                        >
                        <List>
                            <List.Item>
                                We can only accept funds in USD and only from U.S. bank accounts.
                            </List.Item>
                            <List.Item>
                                ACH payments take up to 5 business days to receive acknowledgement of their success or failure. 
                            </List.Item>
                            <List.Item>
                                After adding your bank account, it needs to be verified. Verification is done via two small deposits into the bank account that Stripe will automatically send. These deposits will take 1-2 business days to appear on your online statement. The statement description for these deposits will be AMNTS: and then the values of the two microdeposits that were sent. You will need to relay the value of the two deposits to us.
                            </List.Item>
                        </List>
                    </Banner>
                <Layout.AnnotatedSection
                    title="Connected User"
                    description="Shopify and your customers will use this information to contact you"
                    >
                    {this.accountConnectionMarkup()}
                    <Page title="ACH Payments" seperator>
                    <Card sectioned>
                        <FormLayout>
                            <TextField 
                                label="Account Holder Name"
                                onChange = {this.handleAccountNameChange}
                                value={this.state.name}
                            />
                            <TextField
                                type="email"
                                label="Account Email"
                                onChange = {this.handleCustomerEmailChange}
                                value={this.state.email}
                            />
                            <ChoiceList
                                title={'Bank Account Type'}
                                choices={[
                                    {label: 'Individual', value: 'Individual'},
                                    {label: 'Company', value: 'Company'},
                                ]}
                                selected={selected}
                                onChange={this.handleBankAccountTypeChange}
                            />
                            <TextField
                                label="Account Number"
                                onChange={this.handleAccountNumberChange}
                                value={this.state.accountNumber}
                            />
                            <TextField
                                label="Routing Number"
                                helpText={
                                    <span>
                                     All fields are absolutely neccessary
                                     <br />
                                    {'\xa0'}
                                    </span>
                                }
                                onChange={this.handleRoutingNumberChange}
                                value={this.state.routingNumber}
                            />
                        </FormLayout>
                        <Button ClassName="submitButton" primary onClick={this.submit}>Submit</Button>
                        </Card>
                        </Page>
                    </Layout.AnnotatedSection> 
                    <FooterHelp>
                        Have any questions?{' '}
                        <Link to="https://help.shopify.com/manual/orders/fulfill-orders">
                            Email us here
                        </Link>.
                    </FooterHelp>
            </Layout>
            </Page>
            </div>
        )
    }
}

