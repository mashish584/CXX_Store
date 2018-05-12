/*
    I'm going to use async await in my controller functions so for
    handling any type of exception on those specific functions
    we suppose to use try {}catch(e){}.
    But instead of using try/catch block inside of each function for
    catching any type of exception we can use a highorder function wrapper
    which will work as a error catcher for us.

    @param - is a controller function we want to wrap for catching exception in
    function execution

    @return - the first set of return have
        @param1 - request object
        @param2 - response object
        @param3 - next method

    @return - the second set of return call the our controller function and will
              pass request,response object and next method and chain it with catch in
              case the function execution fail

*/

exports.catchAsyncError = controllerFn => {
  return (req, res, next) => {
    return controllerFn(req, res, next).catch(next);
  };
};

/*
    Create 404 error in case the requested route not
    exist in our application
*/

exports.catch404Error = (req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
};

/*
   Send error reports to user.
   In case of production environment send only message instead
   of complete error stack.
*/

exports.reportError = (err, req, res, next) => {
  console.log(err);
  const message = parseInt(process.env.production, 10)
    ? 'Something went wrong'
    : err.stack;
  return res
    .status(err.status || 500)
    .json({ type: 'error', errors: { msg: message } });
};
