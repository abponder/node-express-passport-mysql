import React from 'react';
import axios from "axios";
import Button from 'react-bootstrap/Button'
import Modal from './Modal.js'
import Table from 'react-bootstrap/Table'
import Customform from './Form.js'
import { Redirect } from "react-router-dom";




class Schedule extends React.Component {
  constructor(props) {
    super(props);
     this.state = {
       schedule:[],
       modal: false,
      currentMeeting:{},
      isAuthenticated : false,
     redirect:'',
     action:'',
     type:''
     }
  }

  componentDidMount(){
    this.isAuthenticated()
  
    axios.get('/api/schedule')
    .then(res => {
    
      this.setState({
        schedule:res.data
      })
    })
  }

  isAuthenticated = (e) => {
    
    axios.get('/api/welcome', { withCredentials: true })
    .then(res => {
    
      
      if(res.data.user) { 
        this.setState({
          isAuthenticated:true
        })
   
      localStorage.setItem("username", res.data.user.username)
        
      }else{
        this.setState({
          redirect:'/'
        })
      }
      
    })
  }

  handleDelete = (event, meetingId) => {
    event.preventDefault()
    console.log({meetingId})
    axios.delete(`/api/delete`, {data:{meetingId}}) //added {data:} because its a requirement from axios
    .then(() => {
      let updatedSchedule = this.state.schedule.slice().filter(mtg => mtg.meetingId !== meetingId)
      this.setState({ 
        schedule:updatedSchedule
      })
    })
  }


  handleSubmit = (event,data) => {
    event.preventDefault()
  

    // axios.put('/api/edit', data)
    axios[data.type](`/api/${data.action}`, data)
    .then(res => {
      data.startDate = data.startDate.slice(5,7) + '/' + data.startDate.slice(-2) + '/' + data.startDate.slice(0,2)
    console.log('this is data', data)
    let updatedSchedule = this.state.schedule.slice()
    let updatedmeeting = false
    for (let i =0; i<updatedSchedule.length; i++){
      if(updatedSchedule[i].meetingId===data.meetingId){
        updatedmeeting = true
      
        updatedSchedule[i]=data
      
      }
    }
    if(!updatedmeeting){
      console.log(res.data.insertId)
      data.meetingId = res.data.insertId
      updatedSchedule.push(data)
    }
  
    this.setState({ 
      modal: false, 
      schedule:updatedSchedule
    })
    })
  }



  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    
    
    let meetings 
    if (this.state.schedule.length) {
      const datex = new Date(this.state.schedule[0].startDate)
    
    
      meetings = this.state.schedule.map(meetingobject => (
        <tr key={meetingobject.meetingId} >
          <td>{meetingobject.meetingTitle}</td>
          <td>{meetingobject.startDate}</td>
          <td>{meetingobject.status}</td>
          <td>
            <button onClick={() => this.setState({ modal: true, action:'edit', type:'put', currentMeeting:meetingobject })} className="btn-primary">edit</button> &nbsp;&nbsp;
            <a href = "" style = {{color:"red"}} onClick={e => this.handleDelete(e, meetingobject.meetingId)} >delete</a>
          </td>
        </tr>
      ))
    }
//  notes change to links that will bring utr a pre populated form; creating a form component with all the inputs: any additional fields?
if(this.state.isAuthenticated){
return (
      <div>
        <h2>Schedule</h2>
        <Button onClick={() => this.setState({ modal: true, action:'add', type:'post' })}>New Meeting</Button>
        <Modal 
          show={this.state.modal}
          onHide={() => this.setState({ modal: false, currentMeeting:{} })}
          modalbody={(
            <Customform
              meetingId={this.state.currentMeeting.meetingId}
              meetingTitle={this.state.currentMeeting.meetingTitle}
              startDate={this.state.currentMeeting.startDate}
              startTime={this.state.currentMeeting.startTime}
              attendees={this.state.currentMeeting.attendees}
              topicsDiscussed={this.state.currentMeeting.topicsDiscussed}
              status={this.state.currentMeeting.status}
              onSubmit={this.handleSubmit}
              action={this.state.action}
              type={this.state.type}
            />
            
          )} 
          
        />
        {/* {this.state.schedule.length && meetings} */}
        {this.state.schedule.length && (
          <Table responsive="md">
             <thead>
              <tr >
                <th>Meeting Description</th>
                <th>Meeting Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
                {meetings}
            </tbody>

          </Table>
        )}

    
        
      </div>
    );
  }
  return <div></div>
 }
}


export default Schedule;
