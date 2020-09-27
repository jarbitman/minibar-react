import React from 'react';
import {
  addToCart,
  removeFromCart,
  setDeliveryDate,
} from '../../redux/actions/actions';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import MenuGroup from './MenuGroup';
import Card from 'react-bootstrap/Card';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ScrollToTop from 'react-scroll-to-top';
import Cart from '../Cart';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { Cart4, Trash } from 'react-bootstrap-icons';
import Login from '../Login.js';
import { Link } from 'react-router-dom';
import '../../pbk.css';
import Cookies from 'universal-cookie';
import { decodeFormData } from '../../utils';

class Menu extends React.Component {
  constructor(props) {
    super(props);

    const cookies = new Cookies();
    const delivery = decodeFormData(cookies.get('delivery'));

    this.state = {
      error: false,
      location: { services: [] },
      menus: {},
      delivery: delivery,
    };

    if (!this.props.deliveryDate && delivery) {
      this.props.dispatch(setDeliveryDate(delivery));
    } else {
      // TODO: add default delivery date or force user to choose a new one
      console.log('need delivery date');
    }
  }

  componentDidMount() {
    this.componentDidUpdate({ locations: {}, location: { services: [] } });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.locations.length !== this.props.locations.length) {
      this.props.locations.forEach((entry, i) => {
        if (entry.link === this.props.match.params.miniBar) {
          this.setState({
            location: entry,
          });

          entry.services.forEach((service, i) => {
            if (service.name === this.props.match.params.service) {
              this.setState({
                menus: service.menus,
              });
            }
          });
        }
      });

      if (!this.state.location) {
        this.setState({
          error: 'Location Not Found',
        });
      }
    }
  }

  render() {
    let subTotal = 0.0;
    return (
      <Container style={{ paddingTop: '1em' }} fluid>
        <Row>
          <Col className="col-sm-8">
            <Container>
              <Tabs defaultActiveKey="tab0">
                {this.state.menus.length &&
                  this.state.menus
                    .sort((a, b) => a.sort > b.sort)
                    .map((entry, i) => {
                      return (
                        <Tab key={'tab_' + i} eventKey={'tab' + i} title={entry.menuName} className="">
                          <MenuGroup key={'menuGroup_' + i} menuGroups={entry.menuGroups}/>
                        </Tab>
                      );
                    })}
              </Tabs>
              <ScrollToTop smooth color="#F36C21" />
            </Container>
          </Col>
          <Col className="col-sm-4" style={{ position: 'fixed' }}>
            <Container
              style={{
                borderLeft: '1px solid #dee2e6',
                height: '100vh',
                paddingLeft: '2em',
                position: 'fixed',
                top: '100px',
                right: '10px',
                width: '25%',
              }}>
              <Row>
                <div className="site-nav" style={{ float: 'right' }}>
                  <ul className="site-nav-menu" style={{ display: 'inline' }}>
                    <li style={{ display: 'inline' }}>
                      <Link to="/">Home</Link>
                    </li>
                    <li style={{ display: 'inline' }}>
                      <Login />
                    </li>
                  </ul>
                </div>
              </Row>
              <h2>Your Order</h2>
              <hr />
              <Cart />
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return { delivery: state.delivery };
}

export default connect(mapStateToProps, null)(Menu);
