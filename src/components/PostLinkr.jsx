import { useState } from "react";
import { useNavigate } from "react-router";

import axios from "axios";
import styled from "styled-components";

import { useUserData } from "../hooks/useUserData";
import UserPicture from "./UserPicture";

export default function PostLinkr() {
  const { userData } = useUserData();

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    link: "",
    text: "",
  });

  const navigate = useNavigate();

  function handleForm(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function publishLink(e) {
    e.preventDefault();
    setIsLoading(true);
    const body = {
      linkUrl: form.link,
      text: form.text,
    };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/linkrs`,
        body,
        userData?.requestConfig
      )
      .then((res) => {
        setIsLoading(false);
        setForm({
          link: "",
          text: "",
        });
        navigate(0);
      })
      .catch((err) => {
        alert("There was an error publishing your link");
        setIsLoading(false);
      });
  }
  return (
    <PostLinkrStyle>
      <UserPicture userPictureUrl={userData?.pictureUrl} size={"55px"} />
      <div data-test="publish-box" className="post-data">
        <p>What are you going to share today?</p>
        <Form onSubmit={publishLink}>
          <InputLink
            data-test="link"
            name="link"
            value={form.link}
            onChange={handleForm}
            type="text"
            placeholder="http://..."
            disabled={isLoading}
            required
          ></InputLink>
          <InputText
            data-test="description"
            name="text"
            value={form.text}
            onChange={handleForm}
            type="text"
            placeholder="Awesome article about #javascript"
            disabled={isLoading}
          ></InputText>
          <button data-test="publish-btn" className="btn" type="submit" disabled={isLoading}>
            {isLoading ? "Publishing..." : "Publish"}
          </button>
        </Form>
      </div>
    </PostLinkrStyle>
  );
}

const PostLinkrStyle = styled.div`
  width: 100%;
  background: #fff;
  color: #949494;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  padding: 22px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 15px;
  .post-data {
    flex-basis: 501px;
  }
  p {
    font-size: 20px;
    line-height: 24px;
    font-weight: 300;
  }
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 13px;
  margin-top: 13px;
  input {
    width: 100%;
    background-color: #efefef;
    color: #949494;
    font-size: 15px;
    line-height: 18px;
    font-weight: 300;
    border: none;
    border-radius: 5px;
  }
  .btn {
    width: 112px;
    height: 31px;
    background-color: #1877f2;
    color: #fff;
    font-size: 14px;
    line-height: 18px;
    font-weight: 700;
    border: none;
    border-radius: 5px;
    align-self: flex-end;
    cursor: pointer;
  }
`;

const InputLink = styled.input`
  text-indent: 0.5rem;
  height: 30px;
`;

const InputText = styled.input`
  text-indent: 0.5rem;
  height: 66px;
`;
