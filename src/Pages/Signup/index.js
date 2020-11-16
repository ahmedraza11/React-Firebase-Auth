import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import { useAuth } from "../../Contexts/AuthContext";
import styles from "./styles.module.scss";

export const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup, generateUserDocument } = useAuth();
  const passwordConfirmRef = useRef();
  const history = useHistory();
  const passwordRef = useRef();
  const emailRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }
    if (emailRef.current.value.split("@")[1] !== "mikaels.com") {
      return setError("Only Mikaels folks are welcome: 😊");
    }
    try {
      setError("");
      setLoading(true);
      let userData = await signup(
        emailRef.current.value,
        passwordRef.current.value
      );
      await generateUserDocument(userData.user);
      history.push("/");
    } catch (err) {
      console.log("Error", err);
      setError("Failed to create an account", err);
    }
    setLoading(false);
  }

  return (
    <div className={styles.signup_container}>
      <Card className={styles.signup_card}>
        <Card.Header className={styles.signup_card_header}>
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
            <Form.Group id="password-confirm">
              <Form.Label className={styles.form_label}>
                Password Confirmation
              </Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button
              className={styles.signup_btn}
              disabled={loading}
              type="submit"
            >
              Sign Up
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
          <div className={styles.signup_card_bottom_text}>
            Already have an account?{" "}
            <Link className={styles.signup_link_text} to="/login">
              Log In
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
