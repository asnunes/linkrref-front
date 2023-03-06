/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import styled from "styled-components";
import axios from "axios";

import { useUserData } from "../../hooks/useUserData";

import UserPicture from "./../UserPicture";
import Comment from "./Comment";
import { ReactComponent as SendCommentIcon } from "../../assets/SendCommentIcon.svg";

export default function Comments({
  linkId,
  userOwnerId,
  setCommentsCountState,
}) {
  const { userData } = useUserData();

  const [isLoading, setIsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");

  const [commentsList, setCommentsList] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/comments/linkr/${linkId}`,
        userData?.requestConfig
      )
      .then((res) => {
        setCommentsList(res.data);
        setCommentsCountState(res.data.length);
      })
      .catch((err) => {
        alert(
          "An error occurred while trying to fetch the comments, please refresh the page"
        );
      });
  }, []);

  function sendComment() {
    if (commentText.length < 3) {
      alert("Comentário deve ter mais do que 3 caracteres!");
      return;
    }

    setIsLoading(true);
    const body = {
      commentText,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/comments/linkr/${linkId}`,
        body,
        userData?.requestConfig
      )
      .then((res) => {
        setIsLoading(false);
        const newCommentsList = [
          {
            commentText,
            commenterName: userData.username,
            commenterPicture: userData.pictureUrl,
          },
          ...commentsList,
        ];
        setCommentsList([...newCommentsList]);
        setCommentsCountState(newCommentsList.length);
        setCommentText("");
      })
      .catch((err) => {
        setIsLoading(false);
        alert("An error occurred while trying to comment post");
      });
  }

  return (
    <CommentsStyle>
      {commentsList.map((c, index) => (
        <Comment
          key={index}
          commentText={c.commentText}
          commenterName={c.commenterName}
          commenterPicture={c.commenterPicture}
          commenterId={c.commenterId}
          userOwnerId={userOwnerId}
        />
      ))}
      <CommentEntry>
        <UserPicture userPictureUrl={userData.pictureUrl} size={"50px"} />
        <BoxInput>
          <input
            onChange={(e) => setCommentText(e.target.value)}
            value={commentText}
            disabled={isLoading}
            placeholder="write a comment..."
            name="comment"
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") sendComment();
            }}
            tabIndex={-1}
            required
          ></input>
          <StyledSendCommentIcon onClick={sendComment} />
        </BoxInput>
      </CommentEntry>
    </CommentsStyle>
  );
}

const CommentsStyle = styled.div`
  width: 100%;
  padding: 20px;
  background: #1e1e1e;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 0 0 16px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  translate: 0 -25px;
  z-index: 1;
`;

const CommentEntry = styled.div`
  width: 100%;
  padding: 15px 5px 0px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
`;

const BoxInput = styled.form`
  width: 100%;
  position: relative;
  input {
    width: 100%;
    height: 39px;
    font-family: "Lato", sans-serif;
    font-style: italic;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    padding: 0 10px;
    padding-right: 40px;
    margin-left: 10px;
    color: #575757;
    font-style: italic;
    background-color: #252525;
    border-radius: 8px;
    border: none;
  }
`;

const StyledSendCommentIcon = styled(SendCommentIcon)`
  position: absolute;
  height: 100%;
  z-index: 2;
  right: 0px;
  top: 0;
  &:hover {
    cursor: pointer;
  }
`;
