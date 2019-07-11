import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authActions } from '@providers/auth/auth';
import GoogleAuthButton from '@components/SignIn/AuthButton/GoogleAuthButton';
import FacebookAuthButton from '@components/SignIn/AuthButton/FacebookAuthButton';

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
  background-image: url('https://images.unsplash.com/photo-1462216150495-f0bac6474243?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
`;

const ContentContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
  transform: translateY(5px);
  width: 400px;
  background-color: white;
  box-shadow: rgba(198, 208, 235, 0.5) 0px 20px 40px;
  position: relative;
  text-align: center;
  box-sizing: border-box;
  max-height: 95%;
  animation: 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s 1 normal forwards running
    iHNdoB;
  overflow: auto;
  border-radius: 20px;
  transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1.2) 0s;
`;

const LoginButtonContainer = styled.div`
  margin: 0 auto;
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
