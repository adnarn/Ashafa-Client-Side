import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Receipt.css';
import { useParams } from 'react-router-dom';
import logo from '../assets/ashLogs.jpg';
import ReactToPrint from 'react-to-print';

const Receipt = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [customer, setCustomer] = useState('');
  const [approoved, setApprooved] = useState('');
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState('');
  const [comment, setComment] = useState('');
  const [date, setDate] = useState('');
  const { id } = useParams();
  const [quants, setQuants] = useState('');
  const receiptRef = useRef();
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);

  useEffect(() => {
    axios.get(`https://cafe-working-server.vercel.app/${id}`)
      .then(result => {
        console.log(result);
        if (result.data) {
          setName(result.data.name || '');
          setPrice(result.data.price || '');
          setDate(result.data.date)
          setCustomer(result.data.customer || '');
          setQuantity(result.data.quantity || '');
          setComment(result.data.comment || '');
          setApprooved('APPROOVED');
          setMessage('Transaction Approoved');
          setIsReceiptVisible(true); // Set visibility to true after fetching data
        }
      })
      .catch(err => {
        console.error('Error fetching item:', err);
        setName('');
        setPrice('');
        setCustomer('');
        setApprooved('FAILED');
        setMessage('Transaction Failed.');
        setIsReceiptVisible(false); // Set visibility to false if there's an error
      });
  }, [id]);

  return (
    <div>
      {isReceiptVisible && (
        <div>
          <div ref={receiptRef} className="receipt">
            <div className="receipt-header">
              <img src={logo} alt='' className="company-logo" />
              <div className="company-name">AshafsLink Bussiness Center</div>
              <div className="company-address">17 College Road Ungwan Dosa, Kaduna</div>
              <div className="phone">09018181999</div>
            </div>
            <div className="receipt-body">
              <table>
                <tbody>
                  <tr>
                    <td>CLIENT NAME</td>
                    <td>{customer}</td>
                  </tr>
                  <tr>
                    <td>DATE</td>
                    <td>{new Date(date).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td>SERVICE NAME</td>
                    <td>{name}</td>
                  </tr>
                  <tr>
                    <td>PRICE</td>
                    <td>{price}</td>
                  </tr>
                  <tr>
                    <td>MESSAGE</td>
                    <td>{message}</td>
                  </tr>
                  <tr>
                    <td>QUANTITY</td>
                    <td>{quantity}</td>
                  </tr>
                  <tr>
                    <td>COMMENT</td>
                    <td>{comment}</td>
                  </tr>
                </tbody>
              </table>

              <div className="total">
                <div className="star">**********************</div>
                <p>NGN {price}</p>
                <div className="starr">**********************</div>
              </div>
              <div className='approoved'>{approoved}</div>
            </div>
            <div className="receipt-footer">
              <p>Thanks for working with us</p>
            </div>
          </div>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <ReactToPrint
              trigger={() => <button className='button' style={{ padding: '10px 20px', fontSize: '16px' }}>Print Receipt</button>}
              content={() => receiptRef.current}
              documentTitle={'INVOICE'}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Receipt;
