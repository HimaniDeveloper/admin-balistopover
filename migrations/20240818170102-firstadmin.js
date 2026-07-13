const bcrypt = require("bcryptjs");

module.exports = {
  async up(db, client) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Baalistopover@9845", salt);

    await db.collection("users").insertOne({
      name: "Baalistopover Admin",
      username: "baalistopover",
      password: hashedPassword,
      email: "baalistopover@example.com",
      phone: "1234567890",
      isDefaultPassword: true,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async down(db, client) {
    await db.collection("users").deleteOne({ username: "baalistopover" });
  },
};

// end
