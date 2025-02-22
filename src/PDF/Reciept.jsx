"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import "./Receipt.css"
import { useParams } from "react-router-dom"
import logo from "../assets/logo.jpeg"
import ReactToPrint from "react-to-print"
import { PDFDownloadLink } from "@react-pdf/renderer"
import ReceiptPDF from "./ReceiptPDF"

const Receipt = () => {
  // ... (keep all your existing state variables and useEffect)
  const { id } = useParams()
  const [receipt, setReceipt] = useState(null)
  const receiptRef = useRef()
  const [isReceiptVisible, setIsReceiptVisible] = useState(false)

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await axios.get(`https://your-api-endpoint/receipts/${id}`)
        setReceipt(response.data)
        setIsReceiptVisible(true)
      } catch (error) {
        console.error("Error fetching receipt:", error)
        setIsReceiptVisible(false)
      }
    }

    fetchReceipt()
  }, [id])

  if (!receipt) {
    return <div>Loading...</div>
  }

  const refId = receipt.refId
  const date = receipt.date
  const customer = receipt.customer
  const formattedItems = receipt.items
  const subtotal = receipt.subtotal
  const discount = receipt.discount
  const payment = receipt.payment
  const comment = receipt.comment
  const total = receipt.total
  const approoved = receipt.approoved

  const receiptData = {
    logo,
    refId,
    date,
    customer,
    formattedItems,
    subtotal,
    discount,
    payment,
    comment,
    total,
    approoved,
  }

  return (
    <div>
      {isReceiptVisible && (
        <div>
          <div ref={receiptRef} className="receipt">
            <div className="receipt-header">
              <img src={logo || "/placeholder.svg"} alt="Logo" className="receipt-logo" />
              <h2>Receipt</h2>
            </div>
            <div className="receipt-details">
              <p>Ref ID: {refId}</p>
              <p>Date: {date}</p>
              <p>Customer: {customer}</p>
            </div>
            <table className="receipt-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {formattedItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="receipt-totals">
              <p>Subtotal: {subtotal}</p>
              <p>Discount: {discount}</p>
              <p>Total: {total}</p>
              <p>Payment Method: {payment}</p>
              <p>Comment: {comment}</p>
              <p>Approved: {approoved ? "Yes" : "No"}</p>
            </div>
          </div>
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <ReactToPrint
              trigger={() => (
                <button
                  className="print-button"
                  style={{ padding: "10px 20px", fontSize: "16px", marginRight: "10px" }}
                >
                  Print Receipt
                </button>
              )}
              content={() => receiptRef.current}
              documentTitle={"INVOICE"}
            />
            <PDFDownloadLink document={<ReceiptPDF receiptData={receiptData} />} fileName="receipt.pdf">
              {({ blob, url, loading, error }) =>
                loading ? (
                  "Loading document..."
                ) : (
                  <button className="pdf-button" style={{ padding: "10px 20px", fontSize: "16px" }}>
                    Download PDF
                  </button>
                )
              }
            </PDFDownloadLink>
          </div>
        </div>
      )}
    </div>
  )
}

export default Receipt

