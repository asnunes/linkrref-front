/* eslint-disable react-hooks/exhaustive-deps */
import styled from "styled-components";
import axios from "axios";

import { useEffect, useState } from "react";
import { useUserData } from "../hooks/useUserData";
import { useNavigate } from "react-router-dom";

export default function Trending() {
  const [trending, setTrending] = useState([]);
  const { userData } = useUserData();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/hashtag`, userData.requestConfig)
      .then((res) => {
        setTrending(res.data);
      })
      .catch((err) => {
        alert(
          "An error occurred while trying to fetch the hashtags, please refresh the page"
        );
      });
  }, []);

  return (
    <>
      <TrendingContainer data-test='trending'>
        <TrendingTitle>trending</TrendingTitle>
        <TrendingLine></TrendingLine>
        {trending.map(({ hashtag }, index) => (
          <TrendingHashtags data-test='hashtag' onClick={() => navigate(`/hashtag/${hashtag}`)} key={index}>
              {"#" + hashtag}
          </TrendingHashtags>
        ))}
      </TrendingContainer>
    </>
  );
}

const TrendingContainer = styled.div`
  height: 406px;
  width: 301px;
  left: 877px;
  top: 232px;
  border-radius: 16px;
  background: #171717;
`;
const TrendingTitle = styled.h1`
  font-family: Oswald;
  font-size: 27px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: 0em;
  text-align: left;
  color: #ffffff;
  margin-left: 16px;
`;
const TrendingLine = styled.div`
  width: 301px;
  height: 1px;
  left: 877px;
  top: 232px;
  border: 1px solid #484848;
  margin-top: 10px;
  margin-bottom: 22px;
`;
const TrendingHashtags = styled.button`
  font-family: "Lato", sans-serif;
  font-size: 19px;
  font-weight: 700;
  line-height: 23px;
  letter-spacing: 0.05em;
  text-align: left;
  color: #ffffff;
  margin-left: 16px;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
`;
