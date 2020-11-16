import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import { useAuth } from "../../Contexts/AuthContext";
import styles from "./styles.module.scss";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();
  const { login } = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch {
      setError("Failed to log in");
    }
    setLoading(false);
  }

  return (
    <div className={styles.login_container}>
      <Card className={styles.login_card}>
        <Card.Header className={styles.login_card_header}>
          <img src={`${window.location.origin}/images/logo-black-svg.png`} />
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label className={styles.form_label}>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label className={styles.form_label}>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button
              className={styles.login_btn}
              disabled={loading}
              type="submit"
            >
              Log In
              {loading && (
                <Spinner
                  animation="grow"
                  variant="light"
                  size="sm"
                  className={styles.spinner}
                />
              )}
            </Button>
          </Form>
          <div className={styles.login_card_bottom_text}>
            Need an account?{" "}
            <Link className={styles.signup_link_text} to="/signup">
              Sign Up
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
