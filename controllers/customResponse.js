const responseSuccess = (data = [], mess = "") => {
  return {
    errorCode: 0,
    message: mess,
    data,
  };
};

const responseError = (err, mess) => {
  return {
    errorCode: err,
    message: mess,
    data: [],
  };
};

const responseWithPaging = (data, mess, pagination) => {
  return {
    errorCode: 0,
    message: mess,
    data,
    pagination,
  };
};

module.exports = {
  responseSuccess,
  responseError,
  responseWithPaging,
};
