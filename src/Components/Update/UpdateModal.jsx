import React from 'react';
import { Modal, Button } from 'react-bootstrap';


const UpdateModal = ({ show, handleClose, handleConfirm }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      keyboard={false}
      style={{paddingTop: '10rem', backgroundColor: 'rgba(0, 0, 0, 0.5)'}} 
    >
      

      <Modal.Header >
        <Modal.Title>Update Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>Do you want to update this item?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Yes
        </Button>
      </Modal.Footer>

    </Modal>
  );
};

export default UpdateModal;
