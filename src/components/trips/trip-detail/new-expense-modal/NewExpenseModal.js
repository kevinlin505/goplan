import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import {
  Button,
  Chip,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Expense from '@constants/Expense';
import { expenseActions } from '@providers/expense/expense';
import Container from '@styles/modal/Container';
import FormHeader, { FormHeaderWrapper } from '@styles/modal/FormHeader';
import Overlay from '@styles/modal/Overlay';
import CloseButton from '@styles/modal/CloseButton';

const mapStateToProps = state => {
  return {
    members: state.trip.selectedTrip.members,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      expense: bindActionCreators(expenseActions, dispatch),
    },
  };
};

const NewExpenseModal = ({ actions, members, toggleCreateExpenseModal }) => {
  const [files, setFiles] = useState([]);
  const [previewImageSrcs, setPreviewImageSrcs] = useState([]);
  const [form, setValues] = useState({
    category: '',
    date: '',
    merchant: '',
    amount: '',
    payees: members,
    description: '',
  });

  const updateField = event => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = event => {
    event.preventDefault();

    actions.expense.submitExpense(form, files).then(() => {
      toggleCreateExpenseModal();
    });
  };

  const handleFileUpload = event => {
    const fileReader = new FileReader();
    const inputFile = event.target.files[0];

    // to allow re-upload of a same file
    event.target.value = '';

    fileReader.readAsDataURL(inputFile);
    fileReader.onload = loadEvent => {
      setPreviewImageSrcs([...previewImageSrcs, loadEvent.target.result]);
    };

    setFiles([...files, inputFile]);
  };

  const handleFileRemove = filePos => {
    setFiles([...files.slice(0, filePos), ...files.slice(filePos + 1)]);
    setPreviewImageSrcs([
      ...previewImageSrcs.slice(0, filePos),
      ...previewImageSrcs.slice(filePos + 1),
    ]);
  };

  function memberRenderValue(selectedValues) {
    return (
      <div>
        {selectedValues.map(value => {
          return (
            <Chip key={`selected-values-${value.id}`} label={value.name} />
          );
        })}
      </div>
    );
  }

  function constructPayees() {
    return Object.keys(members).map(memberId => {
      const member = members[memberId];

      return (
        <MenuItem key={`${member.name}-${member.id}`} value={member}>
          {member.name}
        </MenuItem>
      );
    });
  }

  return (
    <Overlay>
      <Container>
        <FormHeaderWrapper>
          <CloseButton onClick={toggleCreateExpenseModal}>
            <CloseIcon />
          </CloseButton>
          <FormHeader>New Expense</FormHeader>
        </FormHeaderWrapper>
        <form onSubmit={handleFormSubmit}>
          <FieldWrapper>
            <FullWidthField
              label="Merchant Name"
              name="merchant"
              onChange={updateField}
              required
              type="text"
              value={form.merchant}
            />
          </FieldWrapper>
          <FieldWrapper>
            <HalfWidthField
              InputLabelProps={{
                shrink: true,
              }}
              label="Date"
              name="date"
              onChange={updateField}
              required
              type="date"
              value={form.date}
            />
          </FieldWrapper>
          <FieldWrapper>
            <HalfWidthField
              label="Amount"
              name="amount"
              onChange={updateField}
              required
              type="number"
              value={form.amount}
            />
            <HalfWidthField
              label="Category"
              name="category"
              onChange={updateField}
              required
              select
              value={form.category}
            >
              {Expense.CATEGORIES.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </HalfWidthField>
          </FieldWrapper>
          <FieldWrapper>
            <InputLabel htmlFor="select-multiple-chip">Payees</InputLabel>
            <Select
              input={<MultiSelectField id="select-multiple-chip" />}
              multiple
              name="payees"
              onChange={updateField}
              renderValue={selected => memberRenderValue(selected)}
              value={form.payees}
            >
              {constructPayees()}
            </Select>
          </FieldWrapper>
          <FieldWrapper>
            <FullWidthField
              label="Description"
              name="description"
              onChange={updateField}
              type="text"
              value={form.description}
            />
          </FieldWrapper>
          <PreviewWrapper>
            {previewImageSrcs.map((previewImageSrc, index) => {
              return (
                <FileWrapper key={previewImageSrc}>
                  <CloseButton onClick={() => handleFileRemove(index)}>
                    <CloseIcon />
                  </CloseButton>
                  <ReceiptPreview src={previewImageSrc} />
                </FileWrapper>
              );
            })}
          </PreviewWrapper>
          <FieldWrapper>
            <FileInput
              accept="image/*"
              id="contained-button-file"
              multiple
              onChange={handleFileUpload}
              type="file"
            />
            <label htmlFor="contained-button-file">
              <Button component="span" variant="contained">
                Upload
              </Button>
            </label>
          </FieldWrapper>
          <ButtonWrapper>
            <Button color="primary" type="submit" variant="contained">
              Submit
            </Button>
          </ButtonWrapper>
        </form>
      </Container>
    </Overlay>
  );
};

NewExpenseModal.propTypes = {
  actions: PropTypes.object.isRequired,
  members: PropTypes.array.isRequired,
  toggleCreateExpenseModal: PropTypes.func.isRequired,
};

const FieldWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: row wrap;
  position: relative;
  padding: 10px 20px;
`;

const MultiSelectField = styled(Input)`
  width: 100%;
`;

const FullWidthField = styled(TextField)`
  width: 100%;
`;

const HalfWidthField = styled(TextField)`
  width: 45%;
`;

const FileInput = styled.input`
  display: none;
`;

const PreviewWrapper = styled(FieldWrapper)`
  justify-content: flex-start;
`;

const FileWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100px;
  height: 100px;
  margin: 5px;
  background: ${({ theme }) => theme.colors.background};
`;

const ReceiptPreview = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewExpenseModal);
