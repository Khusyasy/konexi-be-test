/**
 *
 * @param {*} data
 * @param {"success" | "fail" | "error" | null} status
 * @param {string?} message
 * @returns
 */
module.exports.formatRes = function (
  data = null,
  status = 'success',
  message = null
) {
  if (status !== 'success' && status !== 'fail' && status !== 'error') {
    throw new Error('Invalid status');
  }

  if (status === 'error' && !message) {
    throw new Error('message is required on error');
  }

  if (status === 'success' || status === 'fail') {
    return {
      status,
      data,
    };
  } else {
    return {
      status,
      message,
      data,
    };
  }
};
