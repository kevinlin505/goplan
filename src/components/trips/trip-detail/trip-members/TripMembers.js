import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const mapStateToProp = state => {
  return {
    users: state.user.users,
  };
};

const TripMembers = ({ users, members }) => {
  function renderMemberList() {
    return Object.keys(members).map((memberId, idx) => {
      const user = users[memberId];
      const divider =
        idx === members.length - 1 ? null : (
          <Divider component="li" variant="inset" />
        );

      return (
        <div key={`trip-member-${idx}`}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={user.name} src={user.profile_url} />
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              secondary={
                <MemberInfoText>
                  <MemberPaymentInfo>
                    <MemberPaymentLabel>Venmo:</MemberPaymentLabel>
                    <span>{user.venmo}</span>
                  </MemberPaymentInfo>
                  <MemberPaymentInfo>
                    <MemberPaymentLabel>Quickpay:</MemberPaymentLabel>
                    <span>{user.quickpay}</span>
                  </MemberPaymentInfo>
                </MemberInfoText>
              }
            />
          </ListItem>
          {divider}
        </div>
      );
    });
  }

  return <List>{renderMemberList()}</List>;
};

TripMembers.propTypes = {
  members: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
};

const MemberInfoText = styled.span`
  display: flex;
  flex-direction: column;
`;

const MemberPaymentInfo = styled.span`
  line-height: 1.5em;
  display: flex;
`;

const MemberPaymentLabel = styled.span`
  width: 80px;
`;

export default connect(mapStateToProp)(TripMembers);
