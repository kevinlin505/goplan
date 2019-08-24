import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import deepEqual from 'fast-deep-equal';
import { CardMedia, IconButton } from '@material-ui/core';
import { Edit, Check } from '@material-ui/icons';
import { breakpointMin } from '@utils/styleUtils';
import CardContainer from '@styles/card/CardContainer';
import { Input } from '@styles/forms/Forms';

export const ProfileCard = ({ actions, profile }) => {
  const [profileForm, setProfileForm] = useState({
    ...profile,
  });

  const [enableEdit, setEnableEdit] = useState(false);

  function handleFormUpdate(event) {
    setProfileForm({
      ...profileForm,
      [event.target.name]: event.target.value,
    });
  }

  function handleEditProfile() {
    if (!enableEdit) {
      setEnableEdit(true);
    } else if (!deepEqual(profileForm, profile)) {
      actions.user
        .updateProfile(profileForm)
        .then(() => {
          setEnableEdit(false);
        })
        .catch(() => {
          setProfileForm(profile);
          setEnableEdit(false);
        });
    } else {
      setEnableEdit(false);
    }
  }

  return (
    <Container>
      <BackgroundImg imageUrl={profile.profile_url} />
      <Profile>
        <Avatar src={profile.profile_url} />
      </Profile>
      <ProfileInfo>
        <NameWrapper>
          <UserName>{profile.name}</UserName>
          <EditButton onClick={handleEditProfile}>
            {enableEdit ? <CheckIcon /> : <EditIcon />}
          </EditButton>
        </NameWrapper>
        <InfoField>Email: {profile.email}</InfoField>
        {(profileForm.phone_number || enableEdit) && (
          <EditInput
            disabled={!enableEdit}
            label={enableEdit && 'Phone number'}
            name="phone_number"
            onChange={handleFormUpdate}
            value={
              enableEdit
                ? `${profileForm.phone_number}`
                : `Phone: ${profileForm.phone_number}`
            }
            variant={enableEdit ? 'filled' : 'standard'}
          />
        )}
        {(profileForm.venmo || enableEdit) && (
          <EditInput
            disabled={!enableEdit}
            label={enableEdit && 'Venmo'}
            name="venmo"
            onChange={handleFormUpdate}
            value={
              enableEdit
                ? `${profileForm.venmo}`
                : `Venmo: ${profileForm.venmo}`
            }
            variant={enableEdit ? 'filled' : 'standard'}
          />
        )}
        {(profileForm.quickpay || enableEdit) && (
          <EditInput
            disabled={!enableEdit}
            label={enableEdit && 'Quickpay'}
            name="quickpay"
            onChange={handleFormUpdate}
            value={
              enableEdit
                ? `${profileForm.quickpay}`
                : `QuickPay: ${profileForm.quickpay}`
            }
            variant={enableEdit ? 'filled' : 'standard'}
          />
        )}
      </ProfileInfo>
    </Container>
  );
};

ProfileCard.propTypes = {
  actions: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const Container = styled(CardContainer)`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  ${({ theme }) =>
    breakpointMin(
      theme.sizes.smallPlus,
      css`
        margin-right: 20px;
      `,
    )};
`;

const BackgroundImg = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 150px;
  background-color: ${({ theme }) => theme.colors.accent};
  background-image: url(${({ imageUrl }) => imageUrl});
  background-size: cover;
  filter: blur(4px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.accent};
  overflow: hidden;
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
  width: 100%;
  padding: 0 20px 30px;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
`;

const NameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const EditButton = styled(IconButton)`
  position: absolute;
  left: 100%;
  width: 26px;
  height: 26px;
  margin-left: 3px;
  padding: 5px;
`;

const EditIcon = styled(Edit)`
  width: 100%;
  height: 100%;
`;

const CheckIcon = styled(Check)`
  width: 100%;
  height: 100%;
`;

const UserName = styled.div`
  margin: 2px 0;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
`;

const InfoField = styled.div`
  margin: 3px 0 3px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
`;

const EditInput = styled(Input)`
  padding: 0 10px;

  .MuiInput-underline {
    ${({ disabled }) =>
      disabled &&
      css`
        &::before,
        &::after {
          content: none;
        }
      `};
  }

  input {
    ${({ disabled }) =>
      disabled &&
      css`
        padding: 0;
        font-size: 14px;
        color: ${({ theme }) => theme.colors.textLight};
        text-align: center;

        &::before,
        &::after {
          content: '';
        }
      `};
  }
`;

export default ProfileCard;
