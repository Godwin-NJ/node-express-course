const createToken = (user) => {
  return {
    name: user.name,
    email: user.email,
    role: user.role,
    id: user._id,
  };
};

module.exports = createToken;
