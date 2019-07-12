import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authActions } from '@providers/auth/auth';
import GoogleAuthButton from '@components/SignIn/AuthButton/GoogleAuthButton';
import FacebookAuthButton from '@components/SignIn/AuthButton/FacebookAuthButton';
import backgroundImg from '@assets/images/background.jpg';
import GoPlan from '@assets/images/GoPlan.svg';

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
        <Logo>
          <svg height="68" viewBox="0 0 281 68" width="281">
            <text
              fill="#E86060"
              fillRule="evenodd"
              fontFamily="JCfg, PilGi"
              fontSize="100"
            >
              <tspan x="-3.871" y="67">
                GoPlan
              </tspan>
            </text>
          </svg>
        </Logo>
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
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: rgba(198, 208, 235, 0.5) 0px 20px 40px;
  box-sizing: border-box;
  text-align: center;
  overflow: auto;
`;

const LoginButtonContainer = styled.div`
  margin: 5px auto;
`;

const Logo = styled.div`
  width: 150px;
  margin: 0 auto;

  svg {
    width: 100%;
  }
`;

export default connect(
  null,
  mapDispatchToProps,
)(SignIn);
