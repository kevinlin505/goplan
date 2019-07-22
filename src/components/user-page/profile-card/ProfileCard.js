import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CardContainer from '@styles/card/CardContainer';
import dockImg from '@assets/images/dock.jpg';

export const ProfileCard = ({ profile }) => {
  return (
    <Container>
      <BackgroundImg />
      <Profile>
        <Avatar src={profile.profile_url} />
      </Profile>
      <ProfileInfo>
        <UserName>{profile.name}</UserName>
        <Email>{profile.email}</Email>
        <Email>{profile.phone_number}</Email>
        {profile.venmo && <Email>Venmo: {profile.venmo}</Email>}
        {profile.quickpay && <Email>Venmo: {profile.quickpay}</Email>}
      </ProfileInfo>
    </Container>
  );
};

ProfileCard.propTypes = {
  profile: PropTypes.object.isRequired,
};

const Container = styled(CardContainer)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BackgroundImg = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 150px;
  background-image: url(${dockImg});
  background-size: cover;
  background-position: center;
`;

const Profile = styled.div`
  width: 90px;
  height: 90px;
  margin: 100px auto 10px;
  border-radius: 50%;
  overflow: hidden;
  z-index: 1;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
`;

const UserName = styled.div``;
const Email = styled.div``;

export default ProfileCard;
