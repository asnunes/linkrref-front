/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import axios from "axios";
import styled from "styled-components";
import { Tooltip } from "react-tooltip";
import "../../../node_modules/react-tooltip/dist/react-tooltip.css";

import { useUserData } from "../../hooks/useUserData";

import { ReactComponent as UnlikeIcon } from "../../assets/HeartIcon.svg";
import { ReactComponent as LikedIcon } from "../../assets/HeartIconFilled.svg";

export default function BoxLikes({ id, likes }) {
  const { userData } = useUserData();
  const usernameLogged = userData?.username;

  const [isLiked, setIsLiked] = useState(likes.linkIsLikedByUser);
  const [likesCount, setLikesCount] = useState(likes.count);
  const [likeMessage, setLikeMessage] = useState("");

  useEffect(() => {
    if (likesCount === 0) {
      setLikeMessage(``);
    } else if (isLiked && likesCount > 0) {
      const otherUser = likes.usersLiked.find(
        (user) => user !== usernameLogged
      );
      if (likesCount === 1) {
        setLikeMessage(`Você`);
      } else if (likesCount === 2) {
        setLikeMessage(`Você e ${otherUser}`);
      } else {
        setLikeMessage(`Você, ${otherUser} e outras ${likesCount - 2}`);
      }
    } else if (!isLiked && likesCount > 0) {
      if (likesCount === 1) {
        setLikeMessage(`${likes.usersLiked[0]}`);
      } else {
        setLikeMessage(
          `${likes.usersLiked[0]}, ${likes.usersLiked[1]} e outras ${
            likesCount - 2
          }`
        );
      }
    }
  }, [likesCount, likeMessage]);

  function LikeLink() {
    if (!isLiked) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/linkrs/like/${id}`,
          {},
          userData?.requestConfig
        )
        .then((res) => {
          setIsLiked(!isLiked);
          setLikesCount(likesCount + 1);
        })
        .catch((err) => {
          alert("An error occurred while trying to like post");
        });
    } else {
      axios
        .delete(
          `${process.env.REACT_APP_API_URL}/linkrs/like/${id}`,
          userData?.requestConfig
        )
        .then((res) => {
          setIsLiked(!isLiked);
          setLikesCount(likesCount - 1);
        })
        .catch((err) => {
          alert("An error occurred while trying to dislike post");
        });
    }
  }

  return (
    <BoxLikesStyle>
      <div id={`box-like-${id}`}>
        {isLiked ? (
          <StyledLikedIcon data-test="like-btn" onClick={LikeLink} />
        ) : (
          <StyledUnlikeIcon data-test="like-btn" onClick={LikeLink} />
        )}
        <LikeCount data-test="counter">
          {likesCount} {likesCount > 1 ? "likes" : "like"}
        </LikeCount>
      </div>
      <Tooltip
        html={`<p data-test="tooltip">${likeMessage}</p>`}
        anchorId={`box-like-${id}`}
        place="bottom"
        variant="light"
      />
    </BoxLikesStyle>
  );
}

const BoxLikesStyle = styled.div``;

const StyledUnlikeIcon = styled(UnlikeIcon)`
  display: block;
  width: 100%;
  margin-top: 20px;
  path {
    fill: #fff;
    stroke-width: 48;
  }
  &:hover {
    cursor: pointer;
  }
`;

const StyledLikedIcon = styled(LikedIcon)`
  display: block;
  width: 100%;
  margin-top: 20px;
  path {
    stroke-width: 48;
  }
  &:hover {
    cursor: pointer;
  }
`;

const LikeCount = styled.p`
  color: #fff;
  font-size: 11px;
  line-height: 13.2px;
  font-weight: 400;
  margin-top: 8px;
  text-align: center;
`;
