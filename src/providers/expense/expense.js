import expense from '@data/expense';

export const types = {
  SUBMIT_EXPENSE: 'EXPENSE/SUBMIT_EXPENSE',
  UPLOAD_RECEIPT: 'EXPENSE/UPLOAD_RECEIPT',
};

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.UPLOAD_RECEIPT: {
      return {
        ...state,
      };
    }
    default:
      return state;
  }
}

export const expenseActions = {
  submitExpense: (form, files) => (dispatch, getState) => {
    const {
      auth: { profile },
      trip: { selectedTrip },
    } = getState();

    const expenseForm = {
      ...form,
      date: new Date(form.date),
      receipts: [],
      payer: { userId: profile.id, userName: profile.name },
      tripId: selectedTrip.id,
    };

    // TODO: set a max on total file size
    if (files.length) {
      return Promise.all(
        files.map(file => dispatch(expenseActions.uploadReceipts(file))),
      )
        .then(data => {
          data.forEach(request => {
            const response = request && request.params;
            if (response) {
              // https://goplan-assets-management.s3.amazonaws.com/expense/Gq0IaPgr4moOE0OS4CgM/9a05a01b-35ed-3ee5-8544-58962d445d74
              const receipt = {
                contentType: request.params.ContentType,
                date: request.signedAt || new Date(),
                key: request.params.Key,
                url: `https://${request.params.Bucket}.s3.amazonaws.com/${request.params.Key}`,
              };
              expenseForm.receipts.push(receipt);
            }
          });

          return expense()
            .submitExpense(expenseForm)
            .then(() => {
              dispatch({
                type: types.SUBMIT_EXPENSE,
              });
            });
        })
        .catch(err => {
          // handle form submit error
          console.log(err);
        });
    }

    return expense()
      .submitExpense(expenseForm)
      .then(() => {
        dispatch({
          type: types.SUBMIT_EXPENSE,
        });
      })
      .catch(err => {
        // handle form submit error
        console.log(err);
      });
  },

  uploadReceipts: file => (dispatch, getState) => {
    console.log('upload called');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const { selectedTrip } = getState().trip;
      const options = {
        data: reader.result,
        type: file.type,
        name: file.name,
        tripId: selectedTrip.id,
      };
      expense()
        .uploadReceipt(options)
        .then(res => {
          dispatch({
            type: types.UPLOAD_RECEIPT,
          });
          console.log(res.data);
          return Promise.resolve(res.data);
        });
    };
    reader.onerror = error => {
      console.log('Error: ', error);
    };
  },
};
