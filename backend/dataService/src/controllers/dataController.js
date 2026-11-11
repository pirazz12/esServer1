const getProfileData = (req, res) => {
  const payload = {
    status: "ok",
    service: "data-service",
    profile: {
      id: 1,
      name: "Mario Rossi",
      role: "admin",
      email: "mario.rossi@example.com",
      city: "Roma"
    },
    timestamp: new Date().toISOString()
  };

  res.json(payload);
};

module.exports = {
  getProfileData
};
