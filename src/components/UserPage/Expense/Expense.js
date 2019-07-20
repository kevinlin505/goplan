import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

const mapStateToProps = state => {
  return {
    expenseSummary: state.user.expenseSummary,
    expenseTotal: state.user.expenseTotal,
  };
};

export const Expense = ({ expenseSummary, expenseTotal }) => {
  return (
    <Container>
      <Categories></Categories>
      <Trips></Trips>
    </Container>
  );
};

Expense.propTypes = {
  expenseSummary: PropTypes.object.isRequired,
  expenseTotal: PropTypes.number.isRequired,
};

const Container = styled.div``;

const Categories = styled.div``;

const Trips = styled.div``;

export default connect(mapStateToProps)(Expense);
