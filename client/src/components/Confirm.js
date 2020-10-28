import React from 'react';
import {Modal, Button} from 'react-bootstrap/'



export default function ConfirmModal(props) {
  const test = props.body
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Are you sure you want to delete this record?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.body}
      </Modal.Body>
    </Modal>
  );
}