const AdminBroExpress = require("@admin-bro/express");
const AdminBro = require("admin-bro");
const AdminBroMongoose = require("@admin-bro/mongoose");
const User = require("../models/user");
const Product = require("../models/product");
const Category = require("../models/category");
const mongoose = require("mongoose");

AdminBro.registerAdapter(AdminBroMongoose);
const adminBro = new AdminBro({
  assets: {
    styles: ["/css/admin.css"],
  },
  databases: [mongoose],
  rootPath: "/admin",
  resources: [
    {
      resource: User,
      options: {
        name: "کاربران",
        parent: {
          name: "کاربران",

          icon: "fa-solid fa-users",
        },
      },
    },
    { resource: Product, options: { label: "محصولات" } },
    { resource: Category, options: { label: "دسته بندی ها" } },
  ],
  locale: {
    translations: {
      labels: {
        User: "کاربران",
        Product: "محصولات",
        Category: "دسته بندی ها",
      },
    },
  },
  branding: {
    companyName: "فروشگاه اینترنتی دیجیتالی شو",
    logo: "/logo.png",
  },
});

const router = AdminBroExpress.buildRouter(adminBro);

module.exports = { router, adminBro };
