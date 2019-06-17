const fs = require("fs");
const util = require("util");
const path = require("path");

const countersPath = path.join(__dirname, "../models/counters.json");

const access = util.promisify(fs.access);
const mkdir = util.promisify(fs.mkdir);
const unlink = util.promisify(fs.unlink);
const readFile = util.promisify(fs.readFile);
const rename = util.promisify(fs.rename);
const writeFile = util.promisify(fs.writeFile);

exports.get = () =>
  new Promise(async (resolve, reject) => {
    try {
      let counters = [];
      await access(countersPath, fs.constants.F_OK);
      counters = await readFile(countersPath, "utf-8");
      counters = JSON.parse(counters);
      resolve(counters);
    } catch (err) {
      reject({
        status: 500,
        message: "counters not found",
        error: err
      });
    }
  });

exports.set = ({ age, concerts, cities, years }) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!age || !concerts || !cities || !years) {
        reject({
          status: 500,
          message: "All fields are required",
          error: err
        });
      }

      await writeFile(
        countersPath,
        `[
                {
                  "number": ${age},
                  "text": "Возраст начала занятий на скрипке"
                },
                {
                  "number": ${concerts},
                  "text": "Концертов отыграл"
                },
                {
                  "number": ${cities},
                  "text": "Максимальное число городов в туре"
                },
                {
                  "number": ${years},
                  "text": "Лет на сцене в качестве скрипача"
                }
            ]`
      );

      resolve(true);
    } catch (err) {
      reject({
        status: 500,
        message: "can not renew counters",
        error: err
      });
    }
  });
