import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import CardContainer from '@styles/card/CardContainer';

const TripMembers = ({ members }) => {
  function renderMemberList() {
    return Object.keys(members).map((memberId, idx) => {
      const member = members[memberId];

      return (
        <ListItem key={`trip-member-${idx}`}>
          <AvatarWrapper>
            <Avatar alt={member.name} src={member.profile_url} />
          </AvatarWrapper>
          <ListItemDetails>
            <MemberName>{member.name}</MemberName>
            <MemberInfoText>
              <MemberPaymentInfo>
                <MemberPaymentLabel>Email:</MemberPaymentLabel>
                <span>{member.email}</span>
              </MemberPaymentInfo>
              <MemberPaymentInfo>
                <MemberPaymentLabel>Phone:</MemberPaymentLabel>
                <span>{member.phone_number}</span>
              </MemberPaymentInfo>
              <MemberPaymentInfo>
                <MemberPaymentLabel>Venmo:</MemberPaymentLabel>
                <span>{member.venmo}</span>
              </MemberPaymentInfo>
              <MemberPaymentInfo>
                <MemberPaymentLabel>QuickPay:</MemberPaymentLabel>
                <span>{member.quickpay}</span>
              </MemberPaymentInfo>
            </MemberInfoText>
          </ListItemDetails>
        </ListItem>
      );
    });
  }

  return (
    <CardContainer>
      <MemberList>{renderMemberList()}</MemberList>
    </CardContainer>
  );
};

TripMembers.propTypes = {
  members: PropTypes.object.isRequired,
};

const MemberList = styled(List)`
  padding: 10px 0;
`;

const ListItem = styled.li`
  display: flex;
  padding: 8px 16px;
`;

const AvatarWrapper = styled(ListItemAvatar)`
  margin-top: 2px;
`;

const ListItemDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const MemberName = styled.div`
  font-size: 18px;
  padding-bottom: 3px;
`;

const MemberInfoText = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.textLight};
`;

const MemberPaymentInfo = styled.div`
  padding-bottom: 3px;
  display: flex;
  flex-wrap: wrap;
`;

const MemberPaymentLabel = styled.div`
  display: inline-block;
  margin-right: 5px;
`;

export default TripMembers;
