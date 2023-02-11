const MAX_TOTAL = 100;

const validateTotal = (total: number) => {
  if (total > MAX_TOTAL) {
    throw new Error('NOT IMPLEMENTED ERROR');
  }
};

export default { validateTotal };
