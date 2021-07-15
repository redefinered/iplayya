export const checkIfIsInitialSignIn = (val) => {
  /// if not set/undefined
  if (typeof val === 'undefined') return false;

  /// if defined but false
  if (!val) return false;

  return true;
};
