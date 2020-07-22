import React from 'react';
import {Form, Col, Button} from 'react-bootstrap/'

class Customform extends React.Component {
  constructor(props) {
    super(props);
     this.state = {
      meetingId:this.props.meetingId || '',
      meetingTitle: this.props.meetingTitle || '',
      startDate: this.props.startDate || '',
      startTime: this.props.startTime || '',
      attendees: this.props.attendees || '',
      topicsDiscussed: this.props.topicsDiscussed || '',
      status: this.props.status || '',
      action:this.props.action || '',
      type:this.props.type || ''
     }
  }
    // e here means event
  handleChange = e => {
    console.log(e.target.value)
    console.log(e.target.name)
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render (){
    console.log(this.state)
    return(
      <Form onSubmit={e => this.props.onSubmit(e,this.state)}>
          {/* <Form.Row> */}
            <Form.Group>
              <Form.Label>Meeting Title</Form.Label>
              <Form.Control onChange={this.handleChange} name="meetingTitle" type="text"  value={this.state.meetingTitle} placeholder="Update Title" />
            </Form.Group>
          {/* </Form.Row> */}

          {/* <Form.Row> */}
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control onChange={this.handleChange} name="startDate" type="date" value={this.state.startDate} placeholder="Start Date" />
            </Form.Group>
          {/* </Form.Row> */}

          {/* <Form.Row> */}
          <Form.Group>
            <Form.Label>Start Time</Form.Label>
            <Form.Control onChange={this.handleChange} name="startTime" type="time" value={this.state.startTime} placeholder="Start Time" />
          </Form.Group>
          {/* </Form.Row> */}

          {/* <Form.Row> */}
          <Form.Group>
            <Form.Label>Attendees</Form.Label>
            <Form.Control onChange={this.handleChange} name="attendees" type="text" value={this.state.attendees} placeholder="Attendees" />
          </Form.Group>
          {/* </Form.Row> */}
          
          {/* </Form.Row> */}
            <Form.Group>
              <Form.Label>Topics Discussed</Form.Label>
              <Form.Control onChange={this.handleChange} name="topicsDiscussed" type="text" value={this.state.topicsDiscussed} placeholder="Topics Discussed"/>
            </Form.Group>
          {/* </Form.Row> */}

          {/* </Form.Row> */}
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" onChange={this.handleChange} name="status" value = {this.state.status} > 
                <option value="Open">Open</option>
                <option value="Completed">Completed</option>
              </Form.Control>
            </Form.Group>
          {/* </Form.Row> */}


          <Button variant="primary" type="submit">
            Submit
          </Button>
      </Form>
    )
  }

}

export default Customform;