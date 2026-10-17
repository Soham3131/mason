const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // One-time cleanup: older documents may have vendorProfile.storeSlug set to ""
    // from a previous schema default. An empty string collides with the unique
    // sparse index on that field (E11000 duplicate key error on registration).
    // Unset it so only real vendor slugs occupy the index.
    try {
      const result = await conn.connection.db.collection('users').updateMany(
        { 'vendorProfile.storeSlug': '' },
        { $unset: { 'vendorProfile.storeSlug': '' } }
      );
      if (result.modifiedCount > 0) {
        console.log(`🧹 Cleaned up empty storeSlug on ${result.modifiedCount} user(s)`);
      }
    } catch (cleanupErr) {
      console.error('⚠️  storeSlug cleanup skipped:', cleanupErr.message);
    }

    // Seed default categories for Catalogue
    try {
      const Category = require('../models/Category');
      const REQUIRED_CATEGORIES = [
        'Dresses', 'Ethnics', 'Tops', 'Trousers'
      ];

      for (const catName of REQUIRED_CATEGORIES) {
        const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const exists = await Category.findOne({
          $or: [
            { name: { $regex: `^${catName}$`, $options: 'i' } },
            { slug: slug }
          ]
        });

        if (!exists) {
          await Category.create({
            name: catName,
            slug: slug,
            gender: 'all',
            isActive: true
          });
          console.log(`🌱 Seeded category: ${catName}`);
        }
      }
    } catch (seedErr) {
      console.error('⚠️ Category seeding failed:', seedErr.message);
    }

    // Auto-seed or verify Admin user
    try {
      const User = require('../models/User');
      const bcrypt = require('bcryptjs');

      const adminEmail = (process.env.ADMIN_EMAIL || 'admin@clothingweb.com').toLowerCase().trim();
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
      const adminAccessCode = String(process.env.ADMIN_ACCESS_CODE || '31082005');

      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      const hashedCode = await bcrypt.hash(adminAccessCode, 12);

      const existingAdmin = await User.findOne({ email: adminEmail }).select('+accessCode');

      if (existingAdmin) {
        await User.updateOne(
          { email: adminEmail },
          {
            name: 'Admin',
            password: hashedPassword,
            role: 'admin',
            accessCode: hashedCode,
            adminCodeAttempts: 0,
            adminCodeLockUntil: null,
            loginAttempts: 0,
            loginLockUntil: null,
          }
        );
        console.log(`👑 Admin verified and updated in MongoDB: ${adminEmail}`);
      } else {
        await User.create({
          name: 'Admin',
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
          adminCodeAttempts: 0,
          adminCodeLockUntil: null,
          loginAttempts: 0,
          loginLockUntil: null,
        });
        await User.updateOne({ email: adminEmail }, { accessCode: hashedCode });
        console.log(`👑 Admin user auto-seeded in MongoDB: ${adminEmail}`);
      }
    } catch (adminSeedErr) {
      console.error('⚠️ Admin auto-seeding failed:', adminSeedErr.message);
    }

    // Auto-seed or verify Vendor user
    let vendorUser = null;
    try {
      const User = require('../models/User');
      const bcrypt = require('bcryptjs');

      const vendorEmail = (process.env.VENDOR_SEED_EMAIL || 'vendor@mason.com').toLowerCase().trim();
      const vendorPassword = process.env.VENDOR_SEED_PASSWORD || 'password123';
      const vendorAccessCode = String(process.env.VENDOR_ACCESS_CODE || '20050831');

      const hashedVendorPassword = await bcrypt.hash(vendorPassword, 12);
      const hashedVendorCode = await bcrypt.hash(vendorAccessCode, 12);

      const existingVendor = await User.findOne({ email: vendorEmail }).select('+accessCode');
      if (existingVendor) {
        await User.updateOne(
          { email: vendorEmail },
          {
            role: 'vendor',
            vendorStatus: 'approved',
            accessCode: hashedVendorCode,
            vendorCodeAttempts: 0,
            vendorCodeLockUntil: null,
            loginAttempts: 0,
            loginLockUntil: null,
          }
        );
        vendorUser = existingVendor;
        console.log(`🏪 Vendor verified in MongoDB: ${vendorEmail}`);
      } else {
        vendorUser = await User.create({
          name: 'Mason Vendor',
          email: vendorEmail,
          password: vendorPassword,
          role: 'vendor',
          vendorStatus: 'approved',
          vendorCodeAttempts: 0,
          vendorCodeLockUntil: null,
          loginAttempts: 0,
          loginLockUntil: null,
        });
        await User.updateOne({ _id: vendorUser._id }, { accessCode: hashedVendorCode });
        console.log(`🏪 Vendor user auto-seeded in MongoDB: ${vendorEmail}`);
      }
    } catch (vendorSeedErr) {
      console.error('⚠️ Vendor auto-seeding failed:', vendorSeedErr.message);
    }

    // Auto-seed initial catalogue products if database is empty
    try {
      const Product = require('../models/Product');
      const Category = require('../models/Category');
      const productCount = await Product.countDocuments();

      if (productCount === 0) {
        const { products } = require('../../seed');
        const allCategories = await Category.find();

        const TYPE_TO_CATEGORY = {
          dress: 'Dresses',
          top: 'Tops',
          trouser: 'Trousers',
          trousers: 'Trousers',
          ethnic: 'Ethnics',
        };

        const createdProducts = await Promise.all(
          products.map(p => {
            const categoryName = TYPE_TO_CATEGORY[p.type] || 'Dresses';
            const catObj =
              allCategories.find(c => c.name.toLowerCase() === categoryName.toLowerCase() && c.gender === p.gender) ||
              allCategories.find(c => c.name.toLowerCase() === categoryName.toLowerCase()) ||
              allCategories[0];

            return Product.create({
              ...p,
              category: catObj ? catObj._id : null,
              slug: null,
              vendor: vendorUser ? vendorUser._id : null,
            });
          })
        );
        console.log(`👕 Initial catalog auto-seeded: ${createdProducts.length} products`);
      }
    } catch (prodSeedErr) {
      console.error('⚠️ Initial products auto-seeding failed:', prodSeedErr.message);
    }
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
