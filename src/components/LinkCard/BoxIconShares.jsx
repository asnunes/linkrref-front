/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

import styled from "styled-components";
import axios from "axios";

import { useUserData } from "../../hooks/useUserData";

import { ReactComponent as ShareIcon } from "../../assets/ShareIcon.svg";

export default function BoxIconShares({
  id,
  shares,
  setIsSharing,
  yesShare,
  setYesShare,
}) {
  const { userData } = useUserData();

  useEffect(() => {
    if (yesShare === true) {
      const body = { postId: id };

      const promise = axios.post(
        `${process.env.REACT_APP_API_URL}/linkrs/repost`,
        body,
        userData?.requestConfig
      );
      promise.then((res) => {
        setIsSharing(false);
        alert("Re-posted");
        window.location.reload();
      });
      promise.catch((erro) => {
        console.log(erro.response.data);
        if (erro.response.status === 401) {
          alert(erro.response.data);
        }
      });
      setIsSharing(false);
      setYesShare(false);
    } else {
    }
  }, [yesShare]);

  function handleShareClick() {
    setIsSharing(true);
  }

  return (
    <BoxSharesStyle>
      <StyledShareIcon onClick={() => handleShareClick()} />
      <SharesCount>{shares} re-post</SharesCount>
    </BoxSharesStyle>
  );
}

const BoxSharesStyle = styled.div``;

const StyledShareIcon = styled(ShareIcon)`
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

const SharesCount = styled.p`
  color: #fff;
  font-size: 11px;
  line-height: 13.2px;
  font-weight: 400;
  margin-top: 8px;
  text-align: center;
`;
