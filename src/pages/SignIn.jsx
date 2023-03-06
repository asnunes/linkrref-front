import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { decodeToken } from "react-jwt";

import axios from "axios";
import styled from "styled-components";

import { useUserData } from "../hooks/useUserData";

export default function SignIn(props) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUserData } = useUserData();

  function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);

    const body = {
      email,
      password,
    };

    const promise = axios.post(
      `${process.env.REACT_APP_API_URL}/signin`,
      body
    );

    promise.then((res) => {
      const newUserData = {
        ...decodeToken(res.data.token),
        requestConfig: {
          headers: { Authorization: `Bearer ${res.data.token}` },
        },
      };

      setUserData({
        ...newUserData,
      });

      window.localStorage.setItem("userData", JSON.stringify(newUserData));

      setIsLoading(false);
      navigate("/timeline");
    });
    promise.catch((erro) => {
      console.log(erro.response.data);
      if (erro.response.status === 401) {
        alert("Acesso negado");
      }
      setIsLoading(false);
    });
  }

  return (
    <>
      <Container>
        <SideLeft>
          <h1>Linkr</h1>
          <h2>
            save, share and discover<br></br>
            the best links on the web
          </h2>
        </SideLeft>

        <SideRight>
          <form onSubmit={handleSubmit}>
            <input
              data-test="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              disabled={isLoading}
              placeholder="e-mail"
              name="email"
              type="email"
              required
            ></input>

            <input
              data-test="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              disabled={isLoading}
              placeholder="password"
              name="password"
              type="password"
              required
            ></input>

            <button data-test="login-btn" type="submit" disabled={isLoading}>
              Log in
            </button>
            <Link data-test="sign-up-link" to="/sign-up">First time? Create an account!</Link>
          </form>
        </SideRight>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100vh;

  @media (max-width: 600px) {
    display: initial;
    height: 100%;
  }
`;
const SideLeft = styled.div`
  width: 100%;
  background-color: #151515;

  color: white;

  display: flex;
  flex-direction: column;
  justify-content: center;

  padding-left: 144px;

  h1 {
    font-size: 106px;
    font-family: "Passion One", cursive;
    line-height: 117px;
  }

  h2 {
    font-family: "Oswald";
    font-weight: 700;
    font-size: 43px;
    line-height: 64px;
  }

  @media (max-width: 600px) {
    height: 175px;
    align-items: center;
    padding-left: 0;
    h1 {
      font-size: 76px;
      line-height: 84px;
    }

    h2 {
      font-size: 23px;
      line-height: 34px;
    }
  }
`;
const SideRight = styled.div`
  background-color: #333333;

  display: flex;
  flex-direction: column;
  justify-content: center;

  padding-left: 52px;
  padding-right: 54px;

  form {
    display: flex;
    flex-direction: column;
    a {
      color: white;
      font-family: "Lato", sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 24px;
      text-decoration-line: underline;
      margin: 0 auto;
    }
  }

  input {
    width: 100%;
    height: 65px;
    border-radius: 6px;
    border: none;
    margin-bottom: 13px;

    @media (max-width: 600px) {
      height: 55px;
    }
  }

  button {
    color: white;
    width: 433px;
    height: 65px;
    font-family: "Oswald", sans-serif;
    font-weight: 700;
    font-size: 27px;
    line-height: 40px;
    background: #1877f2;
    border-radius: 6px;
    border: none;
    margin-bottom: 14px;
    cursor: pointer;

    @media (max-width: 600px) {
      height: 55px;
    }
  }

  @media (max-width: 600px) {
    height: 100vh;
    flex-direction: initial;
    padding-top: 40px;

    padding-left: 0;
    padding-right: 0;
  }
`;
