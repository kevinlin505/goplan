import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import convertNumberToCurrency from '@utils/convertNumberToCurrency';
import { Collapse, List, ListItem } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

const mapStateToProps = state => {
  return {
    tripExpenses: state.trip.tripExpenses,
  };
};

const TripExpenseSummary = ({ tripExpenses, expenseList }) => {
  const [detailExpenseList, setDetailExpenseList] = useState({});

  const defaultExpenseExpandList = expenseList.reduce((obj, expenseId) => {
    obj[expenseId] = false;

    return obj;
  }, {});
  const [isExpenseExpanded, setExpenseExpanded] = useState(
    defaultExpenseExpandList,
  );

  function toggleExpenseDetail(expenseId) {
    return () => {
      const copy = { ...isExpenseExpanded };
      copy[expenseId] = !copy[expenseId];
      setExpenseExpanded(copy);
    };
  }

  useEffect(() => {
    const list = {};
    expenseList.forEach(expenseId => {
      if (tripExpenses[expenseId]) {
        const {
          date,
          amount,
          description,
          merchant,
          payer,
          receipts,
        } = tripExpenses[expenseId];

        list[expenseId] = (
          // <DetailContentList>
          //   <DetailContentListItem>
          //     <div>Date</div>
          //     <div>{date.toDate().toLocaleDateString()}</div>
          //   </DetailContentListItem>
          //   <DetailContentListItem>
          //     <div>Amount</div>
          //     <div>{convertNumberToCurrency(parseFloat(amount))}</div>
          //   </DetailContentListItem>
          //   <DetailContentListItem>
          //     <div>Merchant</div>
          //     <div>{merchant}</div>
          //   </DetailContentListItem>
          //   <DetailContentListItem>
          //     <div>Description</div>
          //     <div style={{ textAlign: 'right' }}>{description}</div>
          //   </DetailContentListItem>
          //   <DetailContentListItem>
          //     <div>Who paid</div>
          //     <div>{payer.name}</div>
          //   </DetailContentListItem>
          //   <DetailContentListItem>
          //     {receipts[0] ? (
          //       <a href={receipts[0].url} target="_blank">
          //         Receipt
          //       </a>
          //     ) : null}
          //   </DetailContentListItem>
          // </DetailContentList>
          <List>
            <DetailContentListItem>
              <ListItemText>Date</ListItemText>
              <ItemCost>{date.toDate().toLocaleDateString()}</ItemCost>
            </DetailContentListItem>
            <DetailContentListItem>
              <ListItemText>Amount</ListItemText>
              <ItemCost>{convertNumberToCurrency(parseFloat(amount))}</ItemCost>
            </DetailContentListItem>
            <DetailContentListItem>
              <ListItemText>Merchant</ListItemText>
              <ItemCost>{merchant}</ItemCost>
            </DetailContentListItem>
            <DetailContentListItem>
              <ListItemText>Description</ListItemText>
              <ItemCost style={{ textAlign: 'right' }}>{description}</ItemCost>
            </DetailContentListItem>
            <DetailContentListItem>
              <ListItemText>Who paid</ListItemText>
              <ItemCost>{payer.name}</ItemCost>
            </DetailContentListItem>
            <DetailContentListItem>
              {receipts[0] ? (
                <a href={receipts[0].url} target="_blank">
                  Receipt
                </a>
              ) : null}
            </DetailContentListItem>
          </List>
        );
      }
    });

    setDetailExpenseList(list);
  }, [Object.keys(tripExpenses).length]);

  const renderExpenseList = expenseList.map((expenseId, idx) => {
    if (!detailExpenseList[expenseId]) {
      return null;
    }

    return (
      <DetailExpenseContent key={`trip-expense-detail-${idx}`}>
        <DetailContentListHeader onClick={toggleExpenseDetail(expenseId)}>
          <div>Expense #{idx + 1}</div>
          {isExpenseExpanded[expenseId] ? <ExpandLess /> : <ExpandMore />}
        </DetailContentListHeader>
        <Collapse
          in={isExpenseExpanded[expenseId]}
          timeout="auto"
          unmountOnExit
        >
          {detailExpenseList[expenseId]}
        </Collapse>
      </DetailExpenseContent>
    );
  });

  return (
    <Container>
      <DetailContentCotainer>{renderExpenseList}</DetailContentCotainer>
    </Container>
  );
};

TripExpenseSummary.propTypes = {
  expenseList: PropTypes.array.isRequired,
  totalExpense: PropTypes.object.isRequired,
  tripExpenses: PropTypes.object,
};

const Container = styled.div`
  width: 100%;
`;

const DetailContentCotainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const DetailExpenseContent = styled.div`
  width: 25%;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 4px;
  box-shadow: 0px 1px 3px 0px ${({ theme }) => theme.colors.divider};
  margin: 10px 15px;
`;

const ListItemText = styled.div`
  flex: 1 1 auto;
  margin: 0 15px 0 0;
  font-weight: 400;
  text-transform: capitalize;
`;

const ItemCost = styled.div`
  display: inline-block;
`;

// const DetailContentList = styled.ul`
//   list-style: none;
//   padding: 0;
//   margin: 0;
// `;

const DetailContentListItem = styled.li`
  font-size: 14px;
  padding: 0px 20px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
`;

const DetailContentListHeader = styled.div`
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 10px;
  margin: 5px 0;
  border-radius: 4px;

  &:active,
  &:focus,
  &:hover {
    cursor: pointer;
  }
`;

export default connect(mapStateToProps)(TripExpenseSummary);
