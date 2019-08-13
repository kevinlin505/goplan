import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import ButtonStyles from '@constants/ButtonStyles';
import { activityActions } from '@providers/activity/activity';
import { tripActions } from '@providers/trip/trip';
import Loading from '@components/loading/Loading';
import formAcitivityString from '@utils/formAcitivityString';
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

const TripActivities = ({ actions, activity, history, selectedTrip }) => {
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

  function handleLeaveTrip() {
    actions.trip.leaveTrip(selectedTrip.id).then(() => {
      history.push('/home');
    });
  }

  function constructActivityBoard() {
    return activity.actions.map((action, index) => {
      return (
        <Activity key={`activity-${index}`}>
          {formAcitivityString(action)}
        </Activity>
      );
    });
  }

  if (!activity) {
    return <Loading />;
  }

  return (
    <Container>
      <LeaveTripWrapper>
        <Button onClick={handleLeaveTrip} variant={ButtonStyles.BORDERED}>
          Leave
        </Button>
      </LeaveTripWrapper>
      <BoardContainer>
        <ActivityBoard ref={boardRef}>{constructActivityBoard()}</ActivityBoard>
      </BoardContainer>
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
  history: PropTypes.object.isRequired,
  selectedTrip: PropTypes.object.isRequired,
};

TripActivities.defaultProps = {
  activity: null,
};

const Container = styled.div`
  position: relative;
`;

const LeaveTripWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 16px 0;
`;

const BoardContainer = styled.div`
  padding: 16px;
`;

const ActivityBoard = styled.div`
  height: 500px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.contrastLight};
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
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.contrast};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
`;

const MessageInput = styled.input`
  flex: 1 1 auto;
  margin-right: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: 4px;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripActivities));
