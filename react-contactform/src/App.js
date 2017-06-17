import React, { Component, PropTypes} from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import fetch from 'isomorphic-fetch';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


const muiTheme = getMuiTheme({
  stepper: {
    iconColor: "black"
  },
  raisedButton: {
    primaryColor: "black",
  }
});

const buttonStyle = {
  margin: 12,
};

injectTapEventPlugin();

class App extends Component {

  constructor(props){
    super(props);
    this.storeName = this.storeName.bind(this);
    this.storeEmail = this.storeEmail.bind(this);
    this.storeMessage = this.storeMessage.bind(this);
    this.sendSupportRequest = this.sendSupportRequest.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      name: "",
      email: "",
      message: "",
      response: "",
      dialog: false
    }
  }

  storeName(e){
    console.log(e.target.value);
    this.setState({name: e.target.value});
  }

  storeEmail(e){
    console.log(e.target.value);
    this.setState({email: e.target.value});
  }

  storeMessage(e){
    console.log(e.target.value);
    this.setState({message: e.target.value});
  }

  handleClose(){
    console.log("dialog close invoked");
    this.setState({dialog: false});
  }

  sendSupportRequest() {
    console.log("submit pressed");
    console.log(this.state);

    fetch('https://848uuemz8k.execute-api.ap-northeast-1.amazonaws.com/development/sendMail', {credentials: 'omit',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "bccEmailAddresses": [],
      	"ccEmailAddresses": [],
      	"toEmailAddresses": ["support@nj2jp.com"],
      	"bodyData": this.state.message,
      	"bodyCharset": "UTF-8",
      	"subjectdata": "Customer Name: " + this.state.name + " - Support Required!!",
      	"subjectCharset": "UTF-8",
      	"sourceEmail": "support@nj2jp.com",
      	"replyToAddresses": [this.state.email]
      })})
      .then(res => {
        if (res.status !== 200) {
          console.log("not fetch");
          this.setState({response:"Error in sending the support request!!", dialog: true});
        }
        console.log("fetch successfully");
        console.log(JSON.stringify(res));
        return res.json();
      })
      .then(json => {
        console.log(json);
        this.setState({response:"Support Request sent to NJ2JP Team. We will follow up ASAP!!", dialog: true});
      })
  }

  render() {

    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ];

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <header>
            <AppBar
              title={<center> NJ2JP Support Form </center>}
              style={{backgroundColor: 'black'}}
              showMenuIconButton={false}
            />
          </header>
          <center>
            <TextField
              hintText="Enter your Name"
              floatingLabelText="Name"
              onChange={this.storeName}
            />
            <br />
            <TextField
              hintText="Enter your E-mail ID"
              floatingLabelText="E-mail ID"
              onChange={this.storeEmail}
            />
            <br />
            <TextField
              hintText="Enter your Support Message"
              floatingLabelText="Support Message"
              onChange={this.storeMessage}
            />
            <br />
            <RaisedButton label="Submit" primary={true} style={buttonStyle} onTouchTap={this.sendSupportRequest} />
            <Dialog
              title="Support Request"
              actions={actions}
              modal={false}
              open={this.state.dialog}
              onRequestClose={this.handleClose}
            >
              {this.state.response}
            </Dialog>
          </center>

        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  message: PropTypes.string
};

export default App;
