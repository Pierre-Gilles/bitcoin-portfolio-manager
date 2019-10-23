import React from "react";

// node.js library that concatenates classes (strings)
import classnames from "classnames";
import qs from "querystringify";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line } from "react-chartjs-2";
import Api from "../api/Api";
import { formatMoney } from "../utils/formatMoney";
import { withRouter } from "react-router";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Input,
  InputGroup,
  InputGroupAddon,
  Table,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1
} from "variables/charts.jsx";

import Header from "components/Headers/Header.jsx";

class Index extends React.Component {
  state = {
    activeNav: 1,
    chartExample1Data: "data1",
    newBtcAdress: ""
  };
  constructor(props) {
    super(props);
    this.api = new Api();
  }
  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
      chartExample1Data:
        this.state.chartExample1Data === "data1" ? "data2" : "data1"
    });
    let wow = () => {
      console.log(this.state);
    };
    wow.bind(this);
    setTimeout(() => wow(), 1000);
    // this.chartReference.update();
  };
  formatChatBtcPrice = bitcoin_price_history => {
    const bitcoin_price_history_chart_data = {
      labels: [],
      datasets: [
        {
          label: "Bitcoin Price",
          data: []
        }
      ]
    };
    bitcoin_price_history.forEach(month => {
      bitcoin_price_history_chart_data.labels.push(month.date);
      bitcoin_price_history_chart_data.datasets[0].data.push(
        Math.round(month.price)
      );
    });
    return bitcoin_price_history_chart_data;
  };
  refreshData = async () => {
    const {
      bitcoin_current_price_usd,
      bitcoin_price_history
    } = await this.api.syncBitcoinPrice();
    const bitcoin_price_history_chart_data = this.formatChatBtcPrice(
      bitcoin_price_history
    );
    const portfolio = await this.api.getPortfolio();
    this.setState({
      portfolio,
      bitcoin_current_price_usd,
      bitcoin_price_history,
      bitcoin_price_history_chart_data
    });
  };
  addNewBtcAddress = async () => {
    this.api.addBitcoinAddress(this.state.newBtcAdress);
    await this.refreshData();
    this.setState({
      newBtcAdress: ""
    });
  };
  removeBitcoinAddress = async address => {
    this.api.removeBitcoinAddress(address);
    await this.refreshData();
  };
  cleanUrl = () => {
    const url = new URL(window.location);
    url.searchParams.delete("authResponse");
    this.props.history.push(url.pathname + url.search);
  };
  async componentWillMount() {
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
    const userProfile = await this.api.initBlockstack();
    if (!userProfile) {
      window.location = "/auth/login";
    } else {
      this.setState({
        userProfile
      });
    }
    await this.api.refreshAddressesFromLocalstorage();
    this.refreshData();
    const { authResponse } = qs.parse(this.props.location.search);
    if (authResponse) {
      this.cleanUrl();
    }
  }
  render() {
    const {
      portfolio,
      userProfile,
      bitcoin_current_price_usd,
      bitcoin_price_history_chart_data,
      newBtcAdress
    } = this.state;

    return (
      <>
        <Header
          portfolio={portfolio}
          bitcoin_current_price_usd={bitcoin_current_price_usd}
          userProfile={userProfile}
        />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">
                        Overview
                      </h6>
                      <h2 className="text-white mb-0">Bitcoin price</h2>
                    </div>
                    {false && (
                      <div className="col">
                        <Nav className="justify-content-end" pills>
                          <NavItem>
                            <NavLink
                              className={classnames("py-2 px-3", {
                                active: this.state.activeNav === 1
                              })}
                              href="#pablo"
                              onClick={e => this.toggleNavs(e, 1)}
                            >
                              <span className="d-none d-md-block">Month</span>
                              <span className="d-md-none">M</span>
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames("py-2 px-3", {
                                active: this.state.activeNav === 2
                              })}
                              data-toggle="tab"
                              href="#pablo"
                              onClick={e => this.toggleNavs(e, 2)}
                            >
                              <span className="d-none d-md-block">Week</span>
                              <span className="d-md-none">W</span>
                            </NavLink>
                          </NavItem>
                        </Nav>
                      </div>
                    )}
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  {bitcoin_price_history_chart_data && (
                    <div className="chart">
                      <Line
                        data={bitcoin_price_history_chart_data}
                        options={chartExample1.options}
                        getDatasetAtEvent={e => console.log(e)}
                      />
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
            <Col className="mb-5 mb-xl-0" xl="4">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Addresses</h3>
                    </div>
                    <div className="col text-right">
                      <InputGroup>
                        <Input
                          bsSize="sm"
                          placeholder="BTC address"
                          value={newBtcAdress}
                          onChange={e =>
                            this.setState({
                              newBtcAdress: e.target.value
                            })
                          }
                        />
                        <InputGroupAddon addonType="append">
                          <Button
                            size="sm"
                            color="primary"
                            onClick={this.addNewBtcAddress}
                          >
                            Add
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Address</th>
                      <th scope="col">Balance</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio &&
                      portfolio.addresses.map(address => (
                        <tr key={address.address}>
                          <th
                            scope="row"
                            style={{ maxWidth: "200px", overflow: "scroll" }}
                          >
                            {address.address}
                          </th>
                          <td>{formatMoney(address.balance_usd)} $</td>
                          <td>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() =>
                                this.removeBitcoinAddress(address.address)
                              }
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default withRouter(Index);
