import React from 'react';
import { usePaymentInputs } from 'react-payment-inputs';
import images from 'react-payment-inputs/images';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import PropTypes from 'prop-types';

export default function PaymentInputs(props) {
  const {
    meta,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    getCardImageProps,
  } = usePaymentInputs();

  const { erroredInputs, touchedInputs } = meta;

  return (
      <Form.Row>
        <Form.Group as={Col} style={{ maxWidth: '15rem' }}>
          <Form.Label style={{ fontWeight: 'bold' }}>Card Number <svg {...getCardImageProps({ images, onChange: props.setCard })} /></Form.Label>
          <Form.Control
            {...getCardNumberProps({ onChange: props.setCard })}
            required
            isInvalid={touchedInputs.cardNumber && erroredInputs.cardNumber}
            placeholder={'0000 0000 0000 0000 '} />
          <Form.Control.Feedback type="invalid">{erroredInputs.cardNumber}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} style={{ maxWidth: '10rem' }}>
          <Form.Label style={{ fontWeight: 'bold' }}>Expiration Date</Form.Label>
          <Form.Control
            {...getExpiryDateProps({ onChange: props.setCard })}
            required
            isInvalid={touchedInputs.expiryDate && erroredInputs.expiryDate} />
          <Form.Control.Feedback type="invalid">{erroredInputs.expiryDate}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} style={{ maxWidth: '7rem' }}>
          <Form.Label style={{ fontWeight: 'bold' }}>CVC</Form.Label>
          <Form.Control
            {...getCVCProps({ onChange: props.setCard })}
            isInvalid={touchedInputs.cvc && erroredInputs.cvc}
            required
            placeholder="123" />
          <Form.Control.Feedback type="invalid">{erroredInputs.cvc}</Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
  );
}

PaymentInputs.propTypes = {
  setCard: PropTypes.func.isRequired,
};
