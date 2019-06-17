exports.auth = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!email || !password) {
        reject("Email & pass are required");
        return;
      }

      if (email !== "admin@admin.com" || password !== "admin") {
        reject("Unathorized");
        return;
      }

      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
