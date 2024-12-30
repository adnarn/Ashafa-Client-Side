import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "./LogReg.css"

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
  
    setLoading(true);
    setError('');
    setPasswordError(false);
  
    try {
      const response = await fetch('https://cafe-working-server.vercel.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        const token = result.token;
        localStorage.setItem('token', token);
  
        // Manually decode the JWT to extract the payload
        const base64Url = token.split('.')[1]; // Get the payload part (second part of the token)
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-unsafe characters
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
  
        const decodedToken = JSON.parse(jsonPayload);
        const role = decodedToken.role;
  
        // Store the role in local storage
        localStorage.setItem('role', role);
  
        navigate('/');
        
        swal({
          title: "Logged in successfully",
          icon: "success",
          button: "OK",
        });

      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
      setFormData({ email: '', password: '' });
    }
  };
  

  return (
    <Form onSubmit={handleSubmit}>
    <h2>Login</h2>

    {error && <Alert variant="danger">{error}</Alert>}
    {loading && <Spinner animation="border" role="status"><span className="sr-only"></span></Spinner>}

    <Form.Group controlId="formBasicEmail">
      <Form.Label>Email address</Form.Label>
      <Form.Control
        type="email"
        name="email"
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
        required
        style={{ borderColor: passwordError ? 'red' : '' }}
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
        required
        style={{ borderColor: passwordError ? 'red' : '' }}
      />
    </Form.Group>

    <Button variant="dark" type="submit" className="w-100">
      Login
    </Button>
  </Form>
 )};

export default Login;
