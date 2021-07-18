export default async (err, req, res ,next) => {
  console.log(err)
  return res
    .status(err.code || 500)
    .json({
        success : false,
        message : err.message || 'error',
        code : err.code || 500
    })
}