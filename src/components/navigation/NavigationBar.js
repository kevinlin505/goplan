import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from '@material-ui/core';
import { AddPhotoAlternate, Edit } from '@material-ui/icons';
import { authActions } from '@providers/auth/auth';
import { tripActions } from '@providers/trip/trip';
import TripModal from '@components/trips/trip-modal/TripModal';
import Logo from '@components/icons/Logo';
import breakpointMin from '@styles/media';

const mapStateToProps = state => {
  return {
    profile: state.auth.profile,
    trip: state.trip,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      auth: bindActionCreators(authActions, dispatch),
      trip: bindActionCreators(tripActions, dispatch),
    },
  };
};

const NavigationBar = ({ actions, match, profile, trip }) => {
  return (
    <Container>
      <NavBar>
        <Brand>
          <LogoLink to="/home">
            <Logo />
          </LogoLink>
        </Brand>
        <RightNavBarItems>
          <TripButton onClick={actions.trip.clearTripForm}>
            <NewTripIcon />
            New Trip
          </TripButton>
          {match.params.tripId && (
            <TripButton onClick={actions.trip.populateTripForm}>
              <EditTripIcon />
              Edit Trip
            </TripButton>
          )}
          <HomeLink to="/home">Home</HomeLink>
          {profile.id && (
            <SignOutButton onClick={actions.auth.signOut}>
              {profile.profile_url && (
                <ProfileAvatar>
                  <Avatar src={profile.profile_url} />
                </ProfileAvatar>
              )}
              Sign Out
            </SignOutButton>
          )}
        </RightNavBarItems>
      </NavBar>
      {trip.isNewTripModalOpen && <TripModal />}
      {trip.isEditTripModalOpen && <TripModal editModal={true} />}
    </Container>
  );
};

NavigationBar.propTypes = {
  actions: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  trip: PropTypes.object.isRequired,
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 60px;
  background: ${({ theme }) => theme.colors.white};
`;

const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
`;

const Brand = styled.div`
  width: 120px;
  color: ${({ theme }) => theme.colors.primary};
`;

const LogoLink = styled(Link)`
  color: inherit;
`;

const RightNavBarItems = styled.div`
  display: flex;
  align-items: center;
`;

const TripButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3px 15px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};

  &:active,
  &:focus,
  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  ${breakpointMin(
    'small',
    css`
      padding: 3px 5px;
    `,
  )};
`;

const EditTripIcon = styled(Edit)`
  margin-right: 3px;
  ${breakpointMin(
    'small',
    css`
      display: none;
    `,
  )};
`;

const NewTripIcon = styled(AddPhotoAlternate)`
  margin-right: 3px;
  ${breakpointMin(
    'small',
    css`
      display: none;
    `,
  )};
`;

const ProfileAvatar = styled.div`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 50%;
  overflow: hidden;

  ${breakpointMin(
    'small',
    css`
      margin-right: 5px;
    `,
  )};
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
`;

const SignOutButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 15px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};

  &:active,
  &:focus,
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  ${breakpointMin(
    'small',
    css`
      padding-left: 5px;
      justify-content: space-around;
    `,
  )};
`;

const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  height: 30px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  letter-spacing: 0.02857em;
  text-transform: uppercase;
  line-height: 1.75;
  padding: 6px 15px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.textLight};
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &:active,
  &:focus,
  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background-color: rgba(0, 0, 0, 0.08);
  }

  ${breakpointMin(
    'small',
    css`
      padding: 6px 5px;
    `,
  )};
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(NavigationBar));
