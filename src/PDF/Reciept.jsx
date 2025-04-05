import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Receipt.css';
import { useParams } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import { useReactToPrint } from 'react-to-print';

const Receipt = () => {
  const [name, setName] = useState([]);
  const [price, setPrice] = useState([]);
  const [customer, setCustomer] = useState('');
  const [approoved, setApprooved] = useState('');
  const [message, setMessage] = useState('');
  const [payment, setPayment] = useState('');
  const [refId, setRefId] = useState('');
  const [quantity, setQuantity] = useState([]);
  const [discount, setDiscount] = useState("");
  const [comment, setComment] = useState('');
  const [date, setDate] = useState('');
  const { id } = useParams();
  const receiptRef = useRef();
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    axios.get(`https://cafe-working-server.vercel.app/getItem/${id}`)
      .then(result => {
        console.log('Fetched Data:', result.data);
        setName(result.data.items.map(item => item.name));
        setPrice(result.data.items.map(item => item.price));
        setQuantity(result.data.items.map(item => item.quantity));
        setDate(result.data.date);
        setPayment(result.data.payment);
        setDiscount(result.data.discount);
        setCustomer(result.data.customer || 'N/A');
        setRefId(result.data.referenceId || 'N/A');
        setComment(result.data.comment || '');
        setApprooved('APPROOVED');
        setMessage('Transaction Approved');
        setIsReceiptVisible(true);
      })
      .catch(err => {
        console.error('Error fetching item:', err);
        setName([]);
        setPrice([]);
        setCustomer('');
        setApprooved('FAILED');
        setMessage('Transaction Failed.');
        setIsReceiptVisible(false);
      });
  }, [id]);

  const formattedItems = name
    .map((itemName, index) => `${itemName} x ${quantity[index]}`)
    .join(', ');

  const subtotal = price.reduce((total, itemPrice) => total + itemPrice, 0);
  const total = discount > 5 ? subtotal - discount : subtotal;

  // Handle printing functionality
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    onBeforeGetContent: () => {
      setIsPrinting(true);
      return new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
    // Thermal printer settings
    pageStyle: `
      @page {
        size: 80mm auto;
        margin: 0mm;
      }
      @media print {
        body {
          width: 80mm;
          font-size: 12px;
        }
        .receipt {
          width: 100%;
          padding: 5px;
        }
        .print-button {
          display: none;
        }
      }
    `,
  });

  // Auto-print when receipt is loaded
  useEffect(() => {
    if (isReceiptVisible && !isPrinting) {
      // Optional: Auto-print when receipt loads
      // setTimeout(handlePrint, 1000);
    }
  }, [isReceiptVisible, isPrinting]);

  return (
    <div>
      {isReceiptVisible && (
        <div>
          <div className="print-controls">
            <button className="print-button" onClick={handlePrint}>
              Print Receipt
            </button>
          </div>
          
          <div ref={receiptRef} className="receipt thermal-receipt">
            <div className="receipt-header">
              <img src={logo} alt='' className="company-logo" />
              <div className="company-name">DosaClick Global Concept</div>
              <div className="company-address">17 College Road Ungwan Dosa, Kaduna</div>
              <div className="phone">dosaclickglobal@gmail.com</div>
              <div className="phone">09018181999</div>
            </div>
            <div className="receipt-body">
              <div id='date'>
                <div>{refId}</div>
                <div> {new Date(date).toLocaleDateString()}</div>
              </div>
              <table>
                <tbody>
                  <tr>
                    <td>CLIENT NAME</td>
                    <td>{customer}</td>
                  </tr>
                  <tr>
                    <td>SERVICE NAME</td>
                    <td>{formattedItems}</td>
                  </tr>
                  <tr>
                    <td>PRICE</td>
                    <td>&#8358;{price.reduce((total, itemPrice) => total + itemPrice, 0)}</td>
                  </tr>
                  {discount > 5 && (
                    <tr>
                      <td>DISCOUNT</td>
                      <td>&#8358;{discount}</td>
                    </tr>
                  )}
                  <tr>
                    <td>PAYMENT</td>
                    <td>{payment}</td>
                  </tr>
                  <tr>
                    <td>COMMENT</td>
                    <td>{comment}</td>
                  </tr>
                </tbody>
              </table>
              {discount > 5 && (
                <div className='discount'>
                  TOTAL = SUB-TOTAL - DISCOUNT
                  <p>= &#8358;{price.reduce((total, itemPrice) => total + itemPrice, 0)} - &#8358;{discount}</p>
                </div>
              )}
              <div className="total">
                <div className='total-price'>
                  <div className="star">**********************</div>
                  &#8358;{total} <br /> <br />
                  <div className="starr">**********************</div>
                  <div className='approoved'>{approoved}</div>
                </div>
              </div>
            </div>
            <div className="receipt-footer">
              <p>For more enquiries, visit: <b>dosaclick.com.ng</b><br /> Thank you for your patronization</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receipt;
