const fs = require("fs");
const util = require("util");
const path = require("path");

const productsPath = path.join(__dirname, "../models/products.json");

const access = util.promisify(fs.access);
const mkdir = util.promisify(fs.mkdir);
const unlink = util.promisify(fs.unlink);
const readFile = util.promisify(fs.readFile);
const rename = util.promisify(fs.rename);
const writeFile = util.promisify(fs.writeFile);

exports.get = () =>
  new Promise(async (resolve, reject) => {
    try {
      let products = [];
      await access(productsPath, fs.constants.F_OK);
      products = await readFile(productsPath, "utf-8");
      products = JSON.parse(products);
      resolve(products);
    } catch (err) {
      reject({
        status: 500,
        message: "products not found",
        error: err
      });
    }
  });

exports.add = ({ photo, name, price }) =>
  new Promise(async (resolve, reject) => {
    try {
      const { name: photoName, path: tempPhotoPath, size } = photo;
      const uploadDir = path.join(
        process.cwd(),
        "/server",
        "static",
        "assets",
        "img",
        "products"
      );

      try {
        await access(uploadDir, fs.constants.F_OK);
      } catch (err) {
        await mkdir(uploadDir);
      }
      if (!name || !price) {
        await unlink(tempPhotoPath);
        reject({
          status: 500,
          message: "All fields are required",
          error: err
        });
        return;
      }
      if (!photoName || !size) {
        await unlink(tempPhotoPath);
        reject({
          status: 500,
          message: "File not saved",
          error: err
        });
        return;
      }

      rename(tempPhotoPath, path.join(uploadDir, photoName));

      let products = [];
      await access(productsPath, fs.constants.F_OK);
      products = await readFile(productsPath, "utf-8");
      products = JSON.parse(products);

      let newProducts = products.slice();
      newProducts.push({
        src: "./assets/img/products/" + photoName,
        name: name,
        price: price
      });
      await writeFile(
        path.join(process.cwd(), "/server/models/products.json"),
        JSON.stringify(newProducts)
      );

      resolve(true);
    } catch (err) {
      reject({
        status: 500,
        message: "can not upload",
        error: err
      });
    }
  });
