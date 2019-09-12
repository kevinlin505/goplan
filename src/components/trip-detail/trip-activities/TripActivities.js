import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled, { css } from 'styled-components';
import ActivityType from '@constants/ActivityType';
import { activityActions } from '@providers/activity/activity';
import { tripActions } from '@providers/trip/trip';
import { breakpointMin } from '@utils/styleUtils';
import Loading from '@components/loading/Loading';
import formAcitivityString from '@utils/formAcitivityString';
import formatTimestamp from '@utils/formatTimestamp';
import Button from '@styles/Button';

const getTripActivity = state =>
  state.activity.tripsActivityList[state.trip.selectedTrip.id];

const mapStateToProps = state => {
  return {
    activity: getTripActivity(state),
    selectedTrip: state.trip.selectedTrip,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      activity: bindActionCreators(activityActions, dispatch),
      trip: bindActionCreators(tripActions, dispatch),
    },
  };
};

const TripActivities = ({ actions, activity, selectedTrip }) => {
  const [message, setMessage] = useState('');
  const boardRef = useRef(null);

  const activityLength = (activity && activity.actions.length) || 0;

  useEffect(() => {
    if (boardRef.current) {
      boardRef.current.scrollTop = boardRef.current.scrollHeight;
    }
  }, [activityLength]);

  function handleMessageInput(event) {
    setMessage(event.target.value);
  }

  function handleKeyEnter(event) {
    if (event.keyCode === 13 || event.key === 'Enter') {
      event.preventDefault();

      if (message.trim()) {
        actions.activity
          .sendMessage(selectedTrip.id, message)
          .then(() => setMessage(''));
      }
    }
  }

  function handleSendMessage() {
    if (message.trim()) {
      actions.activity
        .sendMessage(selectedTrip.id, message)
        .then(() => setMessage(''));
    }
  }

  function constructActivityBoard() {
    return activity.actions.map((action, index) => {
      if (action.type !== ActivityType.MESSAGE) {
        return (
          <Activity key={`activity-${index}`}>
            {formAcitivityString(action)}
          </Activity>
        );
      }

      return (
        <MessageWrapper key={`activity-${index}`}>
          <Avatar alt={action.creator.name} src={action.creator.avatar} />
          <DetailWrapper>
            <CreatorInfo>
              <Name>{action.creator.name}</Name>
              <Time>{formatTimestamp(action.timestamp)}</Time>
            </CreatorInfo>
            <div>{action.data.message}</div>
          </DetailWrapper>
        </MessageWrapper>
      );
    });
  }

  if (!activity) {
    return <Loading />;
  }

  return (
    <Container>
      <ActivityBoard ref={boardRef}>{constructActivityBoard()}</ActivityBoard>
      <MessageContainer>
        <MessageInput
          onChange={handleMessageInput}
          onKeyPress={handleKeyEnter}
          placeholder="Enter a message"
          value={message}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </MessageContainer>
    </Container>
  );
};

TripActivities.propTypes = {
  actions: PropTypes.object.isRequired,
  activity: PropTypes.object,
  selectedTrip: PropTypes.object.isRequired,
};

TripActivities.defaultProps = {
  activity: null,
};

const Container = styled.div`
  position: relative;
`;

const ActivityBoard = styled.div`
  height: 500px;
  padding: 0 25px;
  overflow-y: auto;
`;

const Activity = styled.div`
  margin: 20px 0;
  color: ${({ theme }) => theme.colors.textLight};
`;

const MessageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.background};

  ${({ theme }) =>
    breakpointMin(
      theme.sizes.smallPlus,
      css`
        padding: 10px 16px;
      `,
    )};
`;

const MessageInput = styled.input`
  flex: 1 1 auto;
  margin-right: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: 4px;
`;

const MessageWrapper = styled.div`
  display: flex;
  padding: 10px 0;
`;

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 8px;
  border-radius: 4px;
`;

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const CreatorInfo = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 5px;
`;

const Name = styled.div`
  margin-right: 5px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
`;

const Time = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 11px;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TripActivities);
