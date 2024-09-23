import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './MainContent.module.css';

const ConfirmModal = ({ show, handleClose, handleConfirm }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      keyboard={false}
      className={styles.modalContent}
      style={{paddingTop: '10rem', backgroundColor: 'rgba(0, 0, 0, 0.5)'}} 
    >
      

      <Modal.Header >
        <Modal.Title>Delete Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>Do you want to delete this item?</Modal.Body>
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

export default ConfirmModal;
