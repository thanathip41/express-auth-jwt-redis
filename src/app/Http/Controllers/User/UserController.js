export const index = async (req, res ,next) => {
  try {
    const user = req.authUser
    delete user.password
    return res.json({ 
      success : true,
      user : req.authUser 
    })
  } catch (err) {
    next(err)
  }
}