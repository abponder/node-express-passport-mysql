import React from 'react';
import axios from "axios";
import Modal from './Modal.js'
import {Table, Button} from 'react-bootstrap/'
import Customform from './Form.js'
import ConfirmModal from './Confirm.js'
import { Redirect } from "react-router-dom";


const DeleteModalBody = props => {
  return (
    <>
    <Button onClick={props.handleDelete} variant="danger">Delete</Button>
    <Button onClick={props.onHide} variant="primary">Close</Button>
    </>
  )
}

class Schedule extends React.Component {
  constructor(props) {
    super(props);
     this.state = {
       schedule:[],
       modal: false,
       confirm: {
         modal:false,
         meetingId:""
        },
      currentMeeting:{},
      isAuthenticated : false,
     redirect:'',
     action:'',
     type:''
     }
  }

  componentDidMount(){
    this.isAuthenticated()
  // here next time; promise all maybe
    axios.get('/api/schedule')
    .then(res => {
    console.log(res)
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

  deleteClicked = (e, meetingId)  => {
    e.preventDefault()
    this.setState({ 
      confirm: { 
        modal: true,
        meetingId: meetingId,
        body: (
          <DeleteModalBody
            handleDelete={(e) => this.handleDelete(e, this.state.confirm.meetingId)}
            onHide={() => this.setState({ confirm: { modal: false, meetingId:"" }} )}
          />
        )
      }

    })
  }


  handleDelete = (event, meetingId) => {
    event.preventDefault()
    axios.delete(`/api/delete`, {data:{meetingId}}) //added {data:} because its a requirement from axios
    .then(() => {
      let updatedSchedule = this.state.schedule.slice().filter(mtg => mtg.meetingId !== meetingId)
      this.setState({ 
        schedule:updatedSchedule,
        confirm:{modal:false}
      })
    })
  }


  handleSubmit = (event,data) => {
    event.preventDefault()
    // axios.put('/api/edit', data)
    axios[data.type](`/api/${data.action}`, data)
    .then(res => {
      data.startDate = data.startDate.slice(5,7) + '/' + data.startDate.slice(-2) + '/' + data.startDate.slice(0,2)
    let updatedSchedule = this.state.schedule.slice()
    console.log(updatedSchedule)
    let updatedmeeting = false
    for (let i =0; i<updatedSchedule.length; i++){
      if(updatedSchedule[i].meetingId===data.meetingId){
        updatedmeeting = true
      
        updatedSchedule[i]=data
      
      }
    }
    if(!updatedmeeting){
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

      meetings = this.state.schedule.map(meetingobject => (
        <tr key={meetingobject.meetingId} >
          <td>{meetingobject.meetingTitle}</td>
          <td>{meetingobject.startDate}</td>
          <td>{meetingobject.status}</td>
          <td>
            <button onClick={() => this.setState({ modal: true, action:'edit', type:'put', currentMeeting:meetingobject })} className="btn-primary">edit</button> &nbsp;&nbsp;
            <a href = "" style = {{color:"red"}} onClick={e => this.deleteClicked(e, meetingobject.meetingId)} >delete</a>
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
              department={this.state.currentMeeting.department}
              location={this.state.currentMeeting.location}
              onSubmit={this.handleSubmit}
              action={this.state.action}
              type={this.state.type}
            />
            
          )} 
          
        />
        <ConfirmModal
           show={this.state.confirm.modal}
           onHide={() => this.setState({ confirm: { modal: false, meetingId:"" }} )}
           body = {this.state.confirm.body}
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
