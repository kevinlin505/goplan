import expense from '@data/expense';
import compressFile from '@utils/compressFile';

export const types = {
  REMOVE_EXPENSE: 'EXPENSE/REMOVE_EXPENSE',
  SUBMIT_EXPENSE: 'EXPENSE/SUBMIT_EXPENSE',
  UPLOAD_RECEIPT: 'EXPENSE/UPLOAD_RECEIPT',
};

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.UPLOAD_RECEIPT: {
      return { ...state };
    }
    case types.REMOVE_EXPENSE: {
      return { ...state };
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
      payer: { email: profile.email, id: profile.id, name: profile.name },
      tripId: selectedTrip.id,
    };

    // TODO: set a max on total file size
    if (files.length) {
      return Promise.all(
        files.map(file =>
          compressFile(file).then(reducedFile =>
            dispatch(expenseActions.uploadReceipts(reducedFile)),
          ),
        ),
      )
        .then(data => {
          data.forEach(dataUrl => {
            if (dataUrl) {
              const receipt = {
                url: dataUrl,
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

  removeExpense: (expenseId, expenseObject) => dispatch => {
    expense()
      .removeExpense(expenseId, expenseObject)
      .then(() => {
        const urls = expenseObject.receipts.map(receipt => {
          return receipt.url;
        });
        expense().deleteReceipts({ urls });
        dispatch({ type: types.REMOVE_EXPENSE });
      })
      .catch(err => {
        console.log(err);
      });
  },

  uploadReceipts: file => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
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
            return resolve(res.data);
          });
      };
      reader.onerror = error => {
        reject(error);
      };
    });
  },
};
