import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "./LogReg.css"


const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      email: '',
      name: '',
      password: ''
    });
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        const result = await response.json();
        console.log(result);
  
        if (response.ok) {
          navigate('/login');
        } else {
          console.error('Signup failed:', result.message);
        }
      } catch (error) {
        console.error('Error:', error.message);
      } finally {
        setFormData({
          email: '',
          name: '',
          password: ''
        });
      }
    };

    
  return (
    <Form onSubmit={handleSubmit}>
    <h2>Sign Up</h2>
    <Form.Group controlId="formBasicEmail">
      <Form.Label className='form-label' >Email address</Form.Label>
      <Form.Control
        type="email"
        name="email"
        className='form-control' 
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
      />
    </Form.Group>

    <Form.Group controlId="formBasicName">
      <Form.Label>Name</Form.Label>
      <Form.Control
        type="text"
        name="name"
        placeholder="Enter Name"
        value={formData.name}
        onChange={handleChange}
      />
    </Form.Group>

    <Form.Group controlId="formBasicPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control
        type="password"
        name="password"
        placeholder="Enter password"
        value={formData.password}
        onChange={handleChange}
      />
    </Form.Group>

    <Button variant="dark" type="submit" className="w-100">
      Signup
    </Button>
  </Form>  )
}

export default Signup