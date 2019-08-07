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

const TripAttendees = ({ users, attendees }) => {
  function renderAttendeeList() {
    return attendees.map((attendeeObj, idx) => {
      const user = users[attendeeObj.id];
      const divider =
        idx === attendees.length - 1 ? null : (
          <Divider component="li" variant="inset" />
        );

      return (
        <div key={`trip-attendee-${idx}`}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={user.name} src={user.profile_url} />
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              secondary={
                <AttendeeInfoText>
                  <AttendeePaymentInfo>
                    <AttendeePaymentLabel>Venmo:</AttendeePaymentLabel>
                    <span>{user.venmo}</span>
                  </AttendeePaymentInfo>
                  <AttendeePaymentInfo>
                    <AttendeePaymentLabel>Quickpay:</AttendeePaymentLabel>
                    <span>{user.quickpay}</span>
                  </AttendeePaymentInfo>
                </AttendeeInfoText>
              }
            />
          </ListItem>
          {divider}
        </div>
      );
    });
  }

  return <List>{renderAttendeeList()}</List>;
};

TripAttendees.propTypes = {
  attendees: PropTypes.array.isRequired,
  users: PropTypes.object.isRequired,
};

const AttendeeInfoText = styled.span`
  display: flex;
  flex-direction: column;
`;

const AttendeePaymentInfo = styled.span`
  line-height: 1.5em;
  display: flex;
`;

const AttendeePaymentLabel = styled.span`
  width: 80px;
`;

export default connect(mapStateToProp)(TripAttendees);
