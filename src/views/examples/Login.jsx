import React from "react";

import Api from "../../api/Api";

// reactstrap components
import { Button, Card, CardHeader, Col } from "reactstrap";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.api = new Api();
  }
  redirectToLogin = e => {
    e.preventDefault();
    this.api.redirectToSignin();
  };
  async componentDidMount() {
    const userLoggedIn = await this.api.initBlockstack();
    if (userLoggedIn) {
      window.location = "/admin/index";
    }
  }
  render() {
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-5">
              <div className="text-muted text-center mt-2 mb-3">
                <small>Sign in with</small>
              </div>
              <div className="btn-wrapper text-center">
                <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  onClick={e => this.redirectToLogin(e)}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/github.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Blockstack</span>
                </Button>
              </div>
            </CardHeader>
          </Card>
        </Col>
      </>
    );
  }
}

export default Login;
