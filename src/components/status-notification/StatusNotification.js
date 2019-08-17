import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CheckCircle, Close, Error, Info, Warning } from '@material-ui/icons';
import ButtonStyles from '@constants/ButtonStyles';
import Notification from '@constants/Notification';
import { notificationActions } from '@providers/notification/notification';
import Button from '@styles/Button';

const mapStateToProps = state => {
  return {
    notification: state.notification,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      notification: bindActionCreators(notificationActions, dispatch),
    },
  };
};

export const StatusNotification = ({ actions, notification }) => {
  function handleCloseNotification() {
    actions.notification.setNotification();
  }

  function constructNotificationIcon() {
    switch (notification.status) {
      case Notification.ERROR: {
        return <Error />;
      }

      case Notification.INFORMATION: {
        return <Info />;
      }

      case Notification.SUCCESS: {
        return <CheckCircle />;
      }

      case Notification.WARNING: {
        return <Warning />;
      }

      default:
        return null;
    }
  }

  if (!notification.message) {
    return null;
  }

  return (
    <Container status={notification.status}>
      <Wrapper>
        {constructNotificationIcon()}
        <Message>{notification.message}</Message>
      </Wrapper>
      <CloseButton
        onClick={handleCloseNotification}
        variant={ButtonStyles.TEXT}
      >
        <Close />
      </CloseButton>
    </Container>
  );
};

StatusNotification.propTypes = {
  actions: PropTypes.object.isRequired,
  notification: PropTypes.object.isRequired,
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
  margin: 0 auto 10px;
  padding: 8px 8px 8px 16px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ status, theme }) => theme.colors[status]};
  font-size: 14px;
  border-radius: 4px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Message = styled.div`
  margin: 0 10px;
`;

const CloseButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  color: ${({ theme }) => theme.colors.white};
  border-radius: 50%;

  &:active,
  &:focus,
  &:hover {
    background: rgba(0, 0, 0, 0.2);
    color: ${({ theme }) => theme.colors.white};
  }

  &:active,
  &:focus {
    &::after {
      border: 2px solid ${({ theme }) => theme.colors.white};
      border-radius: 50%;
    }
  }
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StatusNotification);
