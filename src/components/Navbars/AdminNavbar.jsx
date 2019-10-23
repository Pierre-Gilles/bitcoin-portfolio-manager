import React from "react";
import { Link } from "react-router-dom";
import Api from "../../api/Api";

// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media
} from "reactstrap";

class AdminNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.state = {
      profile: {}
    };
  }
  signout = e => {
    e.preventDefault();
    this.api.signout();
    window.location = "/auth/login";
  };
  async componentDidMount() {
    const profile = await this.api.initBlockstack();
    if (profile) {
      this.setState({
        profile
      });
    }
  }
  render() {
    const { profile } = this.state;
    return (
      <>
        <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
          <Container className="pl-2 pr-2">
            <Link className="h4 mb-0 text-white text-uppercase" to="/">
              {this.props.brandText}
            </Link>
            <Nav className="align-items-center" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    {false && (
                      <span className="avatar avatar-sm rounded-circle">
                        <img
                          alt="..."
                          src={require("assets/img/theme/team-4-800x800.jpg")}
                        />
                      </span>
                    )}
                    <Media className="ml-2">
                      <span className="mb-0 text-sm text-white font-weight-bold">
                        {profile.username}
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={this.signout}>
                    <i className="ni ni-user-run" />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default AdminNavbar;
