import { useState } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import axios from "axios";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 40%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0px 0px;
  padding: 10px;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
  &:disabled {
    color: green;
    cursor: not-allowed;
  }
`;

const Error = styled.span`
  color: red;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("User created successfully", res.data);
      alert(
        "User created successfully. A confirmation email has been sent to your email address."
      );
      setIsSubmitting(false);
      window.location.href = "/login";
    } catch (err) {
      console.error("Error creating user", err);
      setError(err.response?.data?.message || "Error creating user");
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            name="name"
            placeholder="name"
            onChange={handleChange}
            value={formData.name}
          />
          <Input
            name="lastName"
            placeholder="last name"
            onChange={handleChange}
            value={formData.lastName}
          />
          <Input
            name="username"
            placeholder="username"
            onChange={handleChange}
            value={formData.username}
          />
          <Input
            name="email"
            placeholder="email"
            type="email"
            onChange={handleChange}
            value={formData.email}
          />
          <Input
            name="password"
            placeholder="password"
            type="password"
            onChange={handleChange}
            value={formData.password}
          />
          <Input
            name="confirmPassword"
            placeholder="confirm password"
            type="password"
            onChange={handleChange}
            value={formData.confirmPassword}
          />
          <Agreement>
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "CREATE"}
          </Button>
          {error && <Error>{error}</Error>}
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;
