import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Import types
import { UserRole, ROLE_PERMISSIONS } from '../src/types/models.types';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Define schemas inline to avoid module resolution issues
const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: { type: [String], required: true, default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const ParishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    foundingDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    parish: { type: mongoose.Schema.Types.ObjectId, ref: 'Parish' },
    isActive: { type: Boolean, default: true },
    mustChangePassword: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create models
const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema);
const Parish = mongoose.models.Parish || mongoose.model('Parish', ParishSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed(): Promise<void> {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Role.deleteMany({});
    await Parish.deleteMany({});
    await User.deleteMany({});

    // Seed Roles
    console.log('Seeding roles...');
    const roles = await Role.insertMany(
      Object.values(UserRole).map((roleName) => ({
        name: roleName,
        permissions: ROLE_PERMISSIONS[roleName],
      }))
    );
    console.log(`Created ${roles.length} roles`);

    // Find Super Admin role
    const superAdminRole = roles.find((r) => r.name === UserRole.SUPER_ADMIN);
    if (!superAdminRole) {
      throw new Error('Super Admin role not found');
    }

    // Seed Parishes
    console.log('Seeding parishes...');
    const parishes = await Parish.insertMany([
      {
        name: 'Nhà Thờ Chính Tòa Ban Mê Thuột',
        address: '104 Phan Chu Trinh, TP. Buôn Ma Thuột, Đắk Lắk',
        phone: '0262 3852 123',
        email: 'nhathochinh@gpbmt.org',
        foundingDate: new Date('1954-01-01'),
        isActive: true,
      },
      {
        name: 'Giáo Xứ Thánh Tâm',
        address: '15 Nguyễn Công Trứ, TP. Buôn Ma Thuột, Đắk Lắk',
        phone: '0262 3851 456',
        email: 'thanhtam@gpbmt.org',
        foundingDate: new Date('1960-06-15'),
        isActive: true,
      },
      {
        name: 'Giáo Xứ Fatima',
        address: '88 Lê Duẩn, TP. Buôn Ma Thuột, Đắk Lắk',
        phone: '0262 3853 789',
        email: 'fatima@gpbmt.org',
        foundingDate: new Date('1970-10-13'),
        isActive: true,
      },
    ]);
    console.log(`Created ${parishes.length} parishes`);

    // Seed Super Admin User
    console.log('Seeding super admin user...');
    const passwordHash = await bcrypt.hash('admin@gpbmt.org', 12);
    const superAdmin = await User.create({
      email: 'admin@gpbmt.org',
      passwordHash,
      name: 'Super Admin',
      phone: '0262 3850 000',
      role: superAdminRole._id,
      isActive: true,
      mustChangePassword: true, // Force password change on first login
    });
    console.log(`Created super admin user: ${superAdmin.email}`);

    console.log('\n=== Seed completed successfully ===');
    console.log('\nCreated:');
    console.log(`  - ${roles.length} roles`);
    console.log(`  - ${parishes.length} parishes`);
    console.log(`  - 1 super admin user`);
    console.log('\nSuper Admin Credentials:');
    console.log('  Email: admin@gpbmt.org');
    console.log('  Password: admin@gpbmt.org');
    console.log('  (Password change required on first login)');
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run seed
seed()
  .then(() => {
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
