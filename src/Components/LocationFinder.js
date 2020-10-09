import React from 'react';
import BeatLoader from 'react-spinners/ClipLoader';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import Location from './Location';
import { Marker } from '@react-google-maps/api';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import PropTypes from 'prop-types';
import * as utils from '../utils.js';
import Alert from 'react-bootstrap/Alert'
import Messages from './Messages.js'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { CartCss } from '../utils';

const containerStyle = {
  width: '100%',
  height: '600px',
};
const center = {
  lat: 41.881832,
  lng: -87.623177,
};

class LocationFinder extends React.Component {
  constructor(props) {
    super(props);
    const Config = require('../config.json');

    this.state = {
      Config,
      API: props.API,
      error: '',
      locations: {},
      variantClass:"",
      show: false,
      validated: false,
      email: '',
      name: '',
      phone: '',
      company: '',
      address: '',
      size: '',
      emailConsent:true,
      formSubmitted:false,

    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleRequestMB = this.handleRequestMB.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearValidated = this.clearValidated.bind(this);
    this.setValidated = this.setValidated.bind(this);
  }
  handleClose() {
    this.setState({
      show: false,
      error: '',
      variantClass: '',
      validated: false,
     });
  }
  handleChange(e){
    const name = e.target.name;
    const value = (e.target.type === "checkbox") ? e.target.checked : e.target.value;
    let newState = {};

    newState[name] = value;
    this.setState(newState);
  }
  clearValidated() {
    this.setState({ validated: false });
  }

  setValidated() {
    this.setState({ validated: true });
  }

  handleShow() {
    this.setState({ show: true });
  }

  componentDidMount() {
    if(this.props.match.params.linkHEX){
      let confirm = {"f":"confirm",
      "linkHEX":this.props.match.params.linkHEX
    }
      utils.ApiPostRequest(this.state.API+'auth',confirm).then((data) => {
        if (data) {
          this.setState({
            error: data.message,
            variantClass: data.Variant,
          });
        } else {
          this.setState({
            error: 'Sorry, an unexpected error occurred',
            variantClass: 'danger',
          });
        }
      });
    }

    if ((!this.state.locations || !this.state.locations.length) && this.props.locations && this.props.locations.length > 0) {
      this.setState({
        locations: this.props.locations,
      })
    }

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.locations.length !== this.props.locations.length) {
      this.setState({
        locations: this.props.locations,
      });
    }
  }

  setError(e) {
    this.setState({
      error: e,
    });
  }
  handleRequestMB(event) {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      return;
    } else {
      this.setValidated();

      let request = {
        "f":"requestmb",
        "name":this.state.name,
        "email":this.state.email,
        "phone":this.state.phone,
        "company":this.state.company,
        "address":this.state.address,
        "size":this.state.size,
        "emailConsent":this.state.emailConsent
      }
      utils.ApiPostRequest(this.state.API + "general",request).then((data) => {
        if (data) {
          this.setState({
            formSubmitted: true,
            error: data.message,
            variantClass: data.Variant,
          });
        } else {
          this.setState({
            message: '<div className="error">Sorry, an unexpected error occurred</div>',
          });
        }
      });
    }
  }

  NoMatch({ location }) {
    return (
      <div className="error">
        Could not find <code>{location.pathname.substring(1)}</code>
      </div>
    );
  }

  render() {
    console.log(this.props);
    if (this.state.locations.length && this.props.Config) {
      return (
        <>
        {this.state.error?(<Messages variantClass={this.state.variantClass} alertMessage={this.state.error} />):(<></>)}
        <CartCss />
        <Container className="main-content" style={{ paddingTop: '1em' }} fluid>
          <Row className="mapContainer">
            <Col className="col-sm-2" style={{ height: '600px' }}>
              <div className="locationList" style={{ height: '500px', overflowY: 'auto' }}>
                {this.state.locations.map((entry, i) => (
                  <Location key={'location_' + i} location={entry} />
                ))}
              </div>
            </Col>
            <Col className="col-sm-10" style={{ height: '600px' }}>
              <LoadScript googleMapsApiKey={this.props.Config.mapAPI}>
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
                  {this.state.locations.map((entry, i) => {
                    return (
                      <Marker key={'marker_' + i} position={{ lat: parseFloat(entry.lat), lng: parseFloat(entry.long) }} icon="/assets/images/38638pbkmrk.png" />
                    );
                  })}
                </GoogleMap>
              </LoadScript>
            </Col>
          </Row>
          <Row style={{ paddingTop: '1em', textAlign: 'center' }}>
            <Col>
              <h4 style={{fontFamily:"Lora"}}>
                Don't see your building listed?
                <span style={{paddingLeft:"1.5em"}}>
                <Button variant="brand-alt" onClick={this.handleShow} >
                  Request a Minibar
                </Button>
                </span>
              </h4>
              <Modal show={this.state.show} onHide={this.handleClose} size="lg">
                <Modal.Header closeButton>
                  <Modal.Title as="h2">
                    Protein Bar & Kitchen - MiniBar Request
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {this.state.error && this.state.formSubmitted ?
                (<Messages variantClass={this.state.variantClass} alertMessage={this.state.error} />) :
                (<Container>
                  <div>
                    Interested in having Protein Bar & Kitchen delivered to your
                    office for free? Let us know more about you and we'll be in
                    touch shortly!
                  </div>
                  <br />
                  <Form validated={this.state.validated} onSubmit={this.handleRequestMB}>
                    <Form.Group controlId="email">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control type="email" name="email" required onChange={this.handleChange} />
                      <Form.Control.Feedback type="invalid">
                        This is required
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="name">
                      <Form.Label>Your Name</Form.Label>
                      <Form.Control type="text" name="name" required onChange={this.handleChange} />
                      <Form.Control.Feedback type="invalid">
                        This is required
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="phone">
                      <Form.Label>Contact Phone Number</Form.Label>
                      <Form.Control type="text" name="phone" required onChange={this.handleChange} />
                      <Form.Control.Feedback type="invalid">
                        This is required
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="company">
                      <Form.Label>
                        Proposed MiniBar Location (e.g., Company Name)
                      </Form.Label>
                      <Form.Control type="text" name="company" required  onChange={this.handleChange} />
                      <Form.Control.Feedback type="invalid">
                        This is required
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="address">
                      <Form.Label>Location Address</Form.Label>
                      <Form.Control type="text" name="address" as="textarea" required onChange={this.handleChange} />
                      <Form.Control.Feedback type="invalid">
                        This is required
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="size">
                      <Form.Label>
                        Approximate Number of People at your Location
                      </Form.Label>
                      <Form.Control as="select" name="size" onChange={this.handleChange} >
                        <option value=""></option>
                        <option value="100">&lt; 100 People</option>
                        <option value="100-250">100-250 People</option>
                        <option value="250-500">250-500 People</option>
                        <option value="500">&gt; 500 People</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        This is required
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                      <Form.Check name="emailConsent" label="I consent to receive marketing emails from Protein Bar & Kitchen" checked={this.state.emailConsent} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group>
                    {this.state.error && this.state.formSubmitted ?
                    (<></>):
                    (<Button variant="brand" type="submit" disabled={this.state.validated}>Send Request!</Button>)
                  }
                  </Form.Group>
                  </Form>
                  </Container>
                )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </Col>
          </Row>
        </Container>
        </>
      );
    }
    return (
      <div className="sweet-loading" style={{ textAlign: 'center' }}>
        <BeatLoader sizeUnit={'px'} size={150} color={'#123abc'} loading={!this.state.locations.length} />
      </div>
    );
  }
}

LocationFinder.propTypes = {
  API: PropTypes.string.isRequired,
  Config: PropTypes.object.isRequired,
  locations: PropTypes.array.isRequired,
};

export default LocationFinder;
