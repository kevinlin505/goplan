import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authActions } from '@providers/auth/auth';
import Logo from '@components/icons/Logo';
import Button from '@styles/Button';

const mapStateToProps = state => {
  return {
    profile: state.auth.profile,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      auth: bindActionCreators(authActions, dispatch),
    },
  };
};

const NavigationBar = ({ actions, profile }) => {
  return (
    <Container>
      <NavBar>
        <Brand>
          <Logo />
        </Brand>
        <UserProfile>
          <ProfileAvatar>
            <Avatar src={profile.profile_url} />
          </ProfileAvatar>
          <SignOutButton onClick={actions.auth.signOut}>Sign Out</SignOutButton>
        </UserProfile>
      </NavBar>
    </Container>
  );
};

NavigationBar.propTypes = {
  actions: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 60px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 0 5px ${({ theme }) => theme.colors.accent};
  z-index: 100;
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

const UserProfile = styled.div`
  display: flex;
`;

const ProfileAvatar = styled.div`
  width: 40px;
  height: 40px;
  margin: 0 15px;
  border-radius: 50%;
  overflow: hidden;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
`;

const SignOutButton = styled(Button)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textLight};

  &:active,
  &:focus,
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationBar);
