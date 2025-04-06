const bcrypt = require("bcrypt");

(async () => {
  const hashedPassword = await bcrypt.hash("admin", 10);
  console.log(hashedPassword);
})();
