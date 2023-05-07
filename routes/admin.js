const AdminBroExpress = require("@admin-bro/express");
const AdminBro = require("admin-bro");
const AdminBroMongoose = require("@admin-bro/mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const express = require("express");
const router1 = express.Router();

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
        properties: {
          password: { isVisible: true },
          _id: { isVisible: false },
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

// متد ورود ادمین به پنل
const login = async (email, password) => {
  const user = await User.findByCredentials(email, password);
  const token = await user.generateAuthToken();
  return token;
};

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await User.authenticate(email, password);
    if (user) {
      return { email: user.email, role: user.role };
    }
    return null;
  },
  cookieName: "adminbro",
  cookiePassword: "1234",
});

const adminRouter = AdminBroExpress.buildAuthenticatedRouter(
  adminBro,
  {
    authenticate: async (email, password) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid email or password");
      }
      if (!user.admin == true) throw new Error("تو ادمین نیستی");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid email or password");
      }
      return user;
    },
    cookiePassword: "some-secret-password-used-to-secure-cookie",
    cookieName: "admin-bro",
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
  }
);

module.exports = { router, adminBro, adminRouter };
