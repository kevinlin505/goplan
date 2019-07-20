import user from '@data/user';

export const types = {
  SUMMARIZE_EXPENSE_REPORT: 'USER/SUMMARIZE_EXPENSE_REPORT',
  GET_ALL_ATTENDEES: 'USER/GET_ALL_ATTENDEES',
  GET_USER_EXPENSE_REPORTS: 'USER/GET_USER_EXPENSE_REPORTS',
  UPDATE_USER_DETAILS: 'USER/UPDATE_USER_DETAILS',
};

const initialState = {
  users: [],
  expenses: [],
  expenseSummary: null,
  expenseTotal: 0,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_ALL_ATTENDEES: {
      return {
        ...state,
        users: action.attendees,
      };
    }

    case types.GET_USER_EXPENSE_REPORTS: {
      return {
        ...state,
        expenses: action.reports,
      };
    }

    case types.SUMMARIZE_EXPENSE_REPORT: {
      return {
        ...state,
        expenseSummary: action.expenseSummary,
        expenseTotal: action.expenseTotal,
      };
    }

    default:
      return state;
  }
}

export const userActions = {
  // fetch all attendee of a trip and dispatch it to the store
  getAllAttendees: attendeeObjects => dispatch => {
    user()
      .getAllAttendees(attendeeObjects)
      .then(docs => {
        const attendees = docs.map(doc => {
          const data = doc.data();
          data.id = doc.id;
          return data;
        });

        dispatch({
          type: types.GET_ALL_ATTENDEES,
          attendees,
        });
      });
  },

  getUserExpenseReports: () => (dispatch, getState) => {
    const { profile } = getState().auth;

    return user()
      .getUserExpenseReports(profile.expenses)
      .then(reportDocs => {
        const reports = reportDocs.map(doc => doc.data());

        dispatch({
          type: types.GET_USER_EXPENSE_REPORTS,
          reports,
        });

        return dispatch(userActions.summarizeAllExpenses(reports));
      })
      .catch(err => {
        console.log(err);
      });
  },

  summarizeAllExpenses: reports => (dispatch, getState) => {
    const expenseSummary = reports.reduce((list, report) => {
      const cost = report.amount / report.payees.length;
      list[report.category] = list[report.category]
        ? list[report.category] + cost
        : cost;

      return list;
    }, {});

    const expenseTotal = Object.values(expenseSummary).reduce(
      (sum, cost) => sum + cost,
    );

    return dispatch({
      type: types.SUMMARIZE_EXPENSE_REPORT,
      expenseSummary,
      expenseTotal,
    });
  },

  updateProfile: profile => dispatch => {
    user()
      .updateUserProfile(profile)
      .then(
        dispatch({
          type: types.UPDATE_USER_DETAILS,
        }),
      );
  },
};
