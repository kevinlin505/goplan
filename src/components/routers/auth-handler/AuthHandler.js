import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthState from '@constants/AuthState';
import { tripActions } from '@providers/trip/trip';
import NavigationBar from '@components/navigation/NavigationBar';
import Rainy from '@components/icons/Rainy';

const mapStateToProps = state => {
  return {
    auth: state.auth.isAuthenticated,
    profile: state.auth.profile,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      trip: bindActionCreators(tripActions, dispatch),
    },
  };
};

const Render = ({ auth, component: Component, match, profile, ...props }) => {
  if (auth === AuthState.UNKNOWN) {
    return (
      <LoadingWrapper>
        <Rainy />
      </LoadingWrapper>
    );
  }
  if (auth === AuthState.LOGOUT) {
    return (
      <Redirect
        to={{
          pathname: '/',
          state: {},
        }}
      />
    );
  }

  const authenticatedViews = profile ? (
    <React.Fragment>
      <NavigationBar />
      <Component match={match} {...props} />
    </React.Fragment>
  ) : (
    <LoadingWrapper>
      <Rainy />
    </LoadingWrapper>
  );

  return auth === AuthState.AUTHENTICATED ? (
    authenticatedViews
  ) : (
    <Redirect
      to={{
        pathname: '/',
        state: {
          originalMatchUrl: match.url,
        },
      }}
    />
  );
};

Render.propTypes = {
  actions: PropTypes.object.isRequired,
  auth: PropTypes.number.isRequired,
  component: PropTypes.any.isRequired,
  match: PropTypes.object.isRequired,
  profile: PropTypes.object,
};

Render.defaultProps = {
  profile: null,
};

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Render);
