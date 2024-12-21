import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { sanitizeUsername } from "../../utils";
import useStore from "../../zustand/user/userStore";
import { Flex } from "../../Styles";
import { COLORS } from "../../Theme";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useStore();
  const navigate = useNavigate();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleSubmit = async () => {
    if (!username || !password) return;
    const sanitizedUsername = sanitizeUsername(username);
    const success = await login(sanitizedUsername, password);

    if (success) {
      navigate("/");
    } else {
      setError("Invalid username and/or password");
    }
  };

  return (
    <LoginContainer>
      <Title> Login</Title>
      {error && <ErrorMessage> {error} </ErrorMessage>}
      <InputContainer>
        <Label> Username: </Label>
        <StyledInput value={username} onChange={handleUsernameChange} />
      </InputContainer>

      <InputContainer>
        <Label> Password: </Label>
        <StyledInput
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </InputContainer>
      <LinkContainer>
        <Link to={"/signup"}>
          {" "}
          Dont have an account? Click here to register{" "}
        </Link>
      </LinkContainer>
      <LoginButton onClick={handleSubmit}> Login </LoginButton>
    </LoginContainer>
  );
}

const Title = styled.p`
  text-align: center;
  font-weight: bold;
  margin-top: 0;
`;

const LoginContainer = styled.div`
  margin: auto;
  padding: 24px;
  gap: 24px;
  margin-top: 20vh;
  border: 1px solid grey;
  border-radius: 8px;
  width: 400px;
  background: ${COLORS.pureWhite};
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const StyledInput = styled.input`
  height: 40px;
  width: 100%;
  padding: 0px 12px;
`;

const InputContainer = styled.div`
  margin: 12px 0px;
`;

const Label = styled.p`
  margin-bottom: 16px;
`;

const LinkContainer = styled.div`
  text-align: center;
  margin-top: 24px;
`;

const LoginButton = styled.button`
  margin-top: 24px;
  width: 100%;
  height: 40px;
  background: navy;
  color: white;
  border: none;
  border-radius: 4px;

  &:hover {
    background: blue;
    cursor: pointer;
  }
`;
