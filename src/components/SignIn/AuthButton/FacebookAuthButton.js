import React from 'react';
import Button from '@styles/Button';
import PropTypes from 'prop-types';

const FacebookAuthButton = ({handleSignIn}) => {
    return (
        <Button 
            onClick={() => handleSignIn("facebook")}
            style={{
                border: "1px solid black",
                padding: "10px 20px"
                }}>
            Facebook
        </Button>
    )
}

FacebookAuthButton.propTypes = {
    handleSignIn: PropTypes.func.isRequired,
};

export default FacebookAuthButton;