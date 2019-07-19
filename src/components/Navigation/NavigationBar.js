import React, { useState } from 'react';
import styled from 'styled-components';
import CreateTrip from '@components/UserPage/CreateTrip/CreateTrip';

const NavigationBar = ({ signOut }) => {
  const [isCreateTripModalOpen, setCreateTripModalOpen] = useState(false);
  const toggleCreateTripModal = () => {
    setCreateTripModalOpen(!isCreateTripModalOpen);
  };

  return (
    <Container>
        <Background>
            <Grid>
                <Button onClick={signOut}>Sign Out</Button>
                <Button onClick={toggleCreateTripModal}>Create Trip</Button>
                {isCreateTripModalOpen && (
                    <CreateTrip toggleCreateTripModal={toggleCreateTripModal} />
                )}
            </Grid>
        </Background>
    </Container>
  );
};

const Button = styled.button`
    font-size: 20px;
    box-shadow: none;
    color: white;
    text-rendering: optimizelegibility;
    padding: 8px 20px;
    border-radius: 10px;
    background: none;
    transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1.2) 0s;
`

const Grid = styled.div`
    max-width: 400px;
    padding-right: 25px;
    display: grid;
    grid-template-columns: auto auto 30px;
    margin: 0px auto;
    gap: 5px 5px;
`

const Container = styled.div`
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    z-index: 100;
    transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0s;
`

const Background = styled.div`
    height: 60px;
    width: 100%;
    position: relative;
    background: rgb(33, 44, 79);
`;



export default NavigationBar;
