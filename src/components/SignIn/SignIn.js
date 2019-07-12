import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authActions } from '@providers/auth/auth';
import GoogleAuthButton from '@components/SignIn/AuthButton/GoogleAuthButton';
import FacebookAuthButton from '@components/SignIn/AuthButton/FacebookAuthButton';
import backgroundImg from '@assets/images/background.jpg';

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      auth: bindActionCreators(authActions, dispatch),
    },
  };
};

const SignIn = ({ actions }) => {
  useEffect(() => {
    actions.auth.checkAuth();
  }, []);

  return (
    <Background>
      <ContentContainer>
        <Header>GoPlan</Header>
        <LoginButtonContainer>
          <GoogleAuthButton handleSignIn={actions.auth.signInWithGoogleAuth} />
        </LoginButtonContainer>
        <LoginButtonContainer>
          <FacebookAuthButton
            handleSignIn={actions.auth.signInWithFacebookAuth}
          />
        </LoginButtonContainer>
      </ContentContainer>
    </Background>
  );
};

SignIn.propTypes = {
  actions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url(${backgroundImg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`;

const ContentContainer = styled.div`
  position: relative;
  padding: 40px;
  width: 400px;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: rgba(198, 208, 235, 0.5) 0px 20px 40px;
  box-sizing: border-box;
  text-align: center;
  overflow: auto;
`;

const LoginButtonContainer = styled.div`
  margin: 5px auto;
`;

const Header = styled.div`
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
`;

export default connect(
  null,
  mapDispatchToProps,
)(SignIn);
