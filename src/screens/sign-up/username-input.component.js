import React from 'react';
import PropTypes from 'prop-types';
import TextInput from 'components/text-input/text-input.component';
import { selectError, selectIsValidUsername } from 'modules/ducks/auth/auth.selectors';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/auth/auth.actions';
import debounce from 'lodash/debounce';

const UsernameInput = ({
  error,
  formFields,
  styles,
  handleOnFocus,
  handleChange,
  errors,
  setError,
  validateUsernameAction
}) => {
  // const validate = React.useCallback(debounce(formFields.username) => {}, []);
  const handleChangeText = (value, name) => {
    // setError('username', 'gago ka ba?');
    // console.log({ value, name });
    handleChange(value, name);

    validateUsername(value);
  };

  React.useEffect(() => {
    setError('username', null);

    if (!error) return;

    if (error === 'USERNAME_ERROR') return setError('username', 'Username is not available.');
  }, [error]);

  const validateUsername = React.useCallback(
    debounce((username) => validateUsernameAction({ username }), 600),
    []
  );

  return (
    <TextInput
      autoCapitalize="none"
      value={formFields.username}
      style={styles.textInput}
      name="username"
      placeholder="Username"
      focusAction={handleOnFocus}
      handleChangeText={handleChangeText}
      error={errors.username || errors.commonError}
      maxLength={20}
    />
  );
};

UsernameInput.propTypes = {
  error: PropTypes.string,
  formFields: PropTypes.object,
  styles: PropTypes.object,
  handleOnFocus: PropTypes.func,
  handleChange: PropTypes.func,
  errors: PropTypes.object,
  setError: PropTypes.func,
  validateUsernameAction: PropTypes.func
};

const actions = {
  validateUsernameAction: Creators.validateUsername
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isValidUsername: selectIsValidUsername
});

export default connect(mapStateToProps, actions)(UsernameInput);
