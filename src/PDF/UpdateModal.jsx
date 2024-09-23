import React from 'react'

const UpdateModal = () => {
    const [showModal, setShowModal] = useState(false);
  const [editField, setEditField] = useState(''); // To store the field being edited
  const [newValue, setNewValue] = useState(''); // New value input

  const { id } = useParams(); // Assuming you are using route params for item id

  const handleShowModal = (field) => {
    setEditField(field);
    setShowModal(true);
    if (field === 'name') setNewValue(name);
    else if (field === 'price') setNewValue(price);
    else if (field === 'customer') setNewValue(customer);
  };

  const handleClose = () => setShowModal(false);

  const handleSave = () => {
    // Create an object with the field to update
    const updatedField = { [editField]: newValue };

    // Make the PUT request to update the database
    axios.put(`http://localhost:4000/api/items/${id}`, updatedField)
      .then((response) => {
        console.log('Updated successfully:', response.data);

        // Update the frontend state with the new value
        if (editField === 'name') setName(newValue);
        else if (editField === 'price') setPrice(newValue);
        else if (editField === 'customer') setCustomer(newValue);

        handleClose();
      })
      .catch(err => {
        console.error('Error updating field:', err);
        alert('Failed to update. Please try again.');
      });
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Update {editField.toUpperCase()}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>New {editField}</Form.Label>
          <Form.Control
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={`Enter new ${editField}`}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSave}>
        Save Changes
      </Button>
    </Modal.Footer>
  </Modal>

  )
}

export default UpdateModal