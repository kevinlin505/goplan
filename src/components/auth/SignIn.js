import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authActions } from '@providers/auth/auth';
import GoogleAuthButton from '@components/auth/auth-buttons/GoogleAuthButton';
import FacebookAuthButton from '@components/auth/auth-buttons/FacebookAuthButton';
import PhotoAttribution from '@components/photo-attribution/PhotoAttribution';
import CardContainer from '@styles/card/CardContainer';

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      auth: bindActionCreators(authActions, dispatch),
    },
  };
};

const RANDOM_NUMBER = Math.floor(Math.random() * 7);

const SignIn = ({ actions }) => {
  const backgrounds = [
    {
      handle: '@dinoreichmuth',
      name: 'Dino Reichmuth',
      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
    },
    {
      handle: '@nilsnedel',
      name: 'Nils Nedel',
      url: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96',
    },
    {
      handle: '@ranasawalha',
      name: 'Rana Sawalha',
      url: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4',
    },
    {
      handle: '@erwanhesry',
      name: 'Erwan Hesry',
      url: 'https://images.unsplash.com/photo-1479888230021-c24f136d849f',
    },
    {
      handle: '@marilark',
      name: 'Charlie Costello',
      url: 'https://images.unsplash.com/photo-1499123785106-343e69e68db1',
    },
    {
      handle: '@agent_illustrateur',
      name: 'Christine Roy',
      url: 'https://images.unsplash.com/photo-1502920514313-52581002a659',
    },
    {
      handle: '@an_ku_sh',
      name: 'Ankush Minda',
      url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3',
    },
  ];
  const background = backgrounds[RANDOM_NUMBER];

  return (
    <Background imageSource={background.url}>
      <ContentContainer>
        <Logo>
          <svg height="68" viewBox="0 0 281 68" width="281">
            <text
              fill="#e91e63"
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
      <PhotoAttribution photo={background} splashPage={true}></PhotoAttribution>
    </Background>
  );
};

SignIn.propTypes = {
  actions: PropTypes.object.isRequired,
};

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url(${({ imageSource }) => imageSource});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`;

const ContentContainer = styled(CardContainer)`
  padding: 40px;
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.75);
  text-align: center;
  overflow: hidden;
  border-radius: 4px;
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
