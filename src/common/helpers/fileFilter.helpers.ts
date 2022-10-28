//the validations here are only for permission to pass, not for errors in the server.
export const fileFilter = async (
  req: Express.Request,
  file: Express.Multer.File,
  // eslint-disable-next-line @typescript-eslint/ban-types
  callback: Function,
) => {
  //here you put the validations of the files
  if (!file) return callback(new Error('file is empty'), false);

  //catch file extension
  const FIlE_EXTENSION = file.mimetype.split('/')[1];
  const validateExtensions = ['jpg', 'png', 'svg', 'jpeg', 'gif'];

  if (validateExtensions.includes(FIlE_EXTENSION)) return callback(null, true);

  callback(null, true);
};
