import React from 'react';
import { usePaymentInputs } from 'react-payment-inputs';
import images from 'react-payment-inputs/images';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

export default function PaymentInputs() {
  const {
    meta,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps
  } = usePaymentInputs();
  const { erroredInputs, touchedInputs } = meta;

  return (
      <Form.Row>
        <Form.Group as={Col} style={{ maxWidth: '15rem' }}>
          <Form.Label>Card number</Form.Label>
          <Form.Control
            // Here is where React Payment Inputs injects itself into the input element.
            {...getCardNumberProps()}
            // You can retrieve error state by making use of the error & touched attributes in `meta`.
            isInvalid={touchedInputs.cardNumber && erroredInputs.cardNumber}
            placeholder="0000 0000 0000 0000"
          />
          <Form.Control.Feedback type="invalid">{erroredInputs.cardNumber}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} style={{ maxWidth: '10rem' }}>
          <Form.Label>Expiry date</Form.Label>
          <Form.Control
            {...getExpiryDateProps()}
            isInvalid={touchedInputs.expiryDate && erroredInputs.expiryDate}
          />
          <Form.Control.Feedback type="invalid">{erroredInputs.expiryDate}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} style={{ maxWidth: '7rem' }}>
          <Form.Label>CVC</Form.Label>
          <Form.Control
            {...getCVCProps()}
            isInvalid={touchedInputs.cvc && erroredInputs.cvc}
            placeholder="123"
          />
          <Form.Control.Feedback type="invalid">{erroredInputs.cvc}</Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
  );
}