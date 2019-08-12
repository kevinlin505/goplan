import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const PhotoAttribution = ({ photo, splashPage }) => {
  const photographer = `https://unsplash.com/${photo.handle}?utm_source=GoPlan&utm_medium=referral`;
  const source = `https://unsplash.com/?utm_source=GoPlan&utm_medium=referral`;

  return (
    <Attribution splashPage={splashPage}>
      {'Photo by '}
      <ReferenceLink href={photographer} target="_blank">
        {photo.name}
      </ReferenceLink>
      {' on '}
      <ReferenceLink href={source} target="_blank">
        Unsplash
      </ReferenceLink>
    </Attribution>
  );
};

PhotoAttribution.propTypes = {
  photo: PropTypes.object.isRequired,
  splashPage: PropTypes.bool.isRequired,
};

const Attribution = styled.div`
  position: absolute;
  right: ${({ splashPage }) => (splashPage ? '20px' : '10px')};
  bottom: ${({ splashPage }) => (splashPage ? '20px' : '5px')};

  color: ${({ theme }) => theme.colors.white};
  text-shadow: 1px 1px 2px ${({ theme }) => theme.colors.black};
`;

const ReferenceLink = styled.a`
  color: ${({ theme }) => theme.colors.white};

  &:active,
  &:focus,
  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

export default PhotoAttribution;
