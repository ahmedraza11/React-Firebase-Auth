import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import { useAuth } from "../../Contexts/AuthContext";
import styles from "./styles.module.scss";

export const UpdateProfile = () => {
  const displayNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const {
    userObject,
    updatePassword,
    updateEmail,
    updateDisplayName,
  } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    const promises = [];
    setLoading(true);
    setError("");

    // if (emailRef.current.value !== userObject.email) {
    //   promises.push(updateEmail(emailRef.current.value));
    // }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    if (displayNameRef.current.value) {
      promises.push(updateDisplayName(displayNameRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        history.push("/");
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className={styles.update_user_container}>
      <Card className={styles.update_user_card}>
        <Card.Header className={styles.update_user_card_header}>
          <img src={`${window.location.origin}/images/logo-black-svg.png`} />
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="displayName">
              <Form.Label className={styles.form_label}>
                Display Name
              </Form.Label>
              <Form.Control
                type="text"
                ref={displayNameRef}
                required
                defaultValue={userObject.displayName}
              />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label className={styles.form_label}>Email</Form.Label>
              <Form.Control
                disabled
                type="email"
                ref={emailRef}
                required
                defaultValue={userObject.email}
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label className={styles.form_label}>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label className={styles.form_label}>
                Password Confirmation
              </Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>
            <Button
              disabled={loading}
              className={styles.submit_btn}
              type="submit"
            >
              Update
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
          <div className={styles.update_user_card_bottom_text}>
            <Link className={styles.update_user_link_text} to="/">
              Cancel
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
