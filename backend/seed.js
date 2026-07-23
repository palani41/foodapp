import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

// Models
import User from './models/User.js';
import Category from './models/Category.js';
import MenuItem from './models/MenuItem.js';
import Coupon from './models/Coupon.js';
import Table from './models/Table.js';
import Review from './models/Review.js';
import Cart from './models/Cart.js';
import Order from './models/Order.js';

dotenv.config();

export const seedData = async (shouldCloseConnection = false) => {
  try {
    console.log('Clearing old database records...');
    await User.deleteMany();
    await Category.deleteMany();
    await MenuItem.deleteMany();
    await Coupon.deleteMany();
    await Table.deleteMany();
    await Review.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();

    console.log('Seeding default users...');
    const admin = await User.create({
      name: 'Restaurant Admin',
      email: 'admin@foodapp.com',
      password: 'password123',
      role: 'admin',
      phone: '1234567890'
    });

    const driver = await User.create({
      name: 'Speedy Delivery',
      email: 'driver@foodapp.com',
      password: 'password123',
      role: 'delivery',
      phone: '9876543210'
    });

    const customer = await User.create({
      name: 'Alice Customer',
      email: 'customer@foodapp.com',
      password: 'password123',
      role: 'customer',
      phone: '5551234567',
      addresses: [
        {
          label: 'Home',
          street: '742 Evergreen Terrace, Penthouse 4B',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          isDefault: true
        }
      ]
    });

    console.log('Seeding categories...');
    const southIndianCat = await Category.create({
      name: 'South Indian',
      description: 'Crispy dosas, idlis & Tamil Chettinad specialties',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80'
    });

    const starterCategory = await Category.create({
      name: 'Appetizers',
      description: 'Indian street food & crisp starters',
      image: 'https://images.unsplash.com/photo-1541014741259-df5290bec578?auto=format&fit=crop&w=600&q=80'
    });

    const mainCategory = await Category.create({
      name: 'Mains',
      description: 'Hearty biryanis, curries, & tandoori specials',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
    });

    const pizzaCategory = await Category.create({
      name: 'Pizza',
      description: 'Artisanal sourdough pizzas',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
    });

    const burgerCategory = await Category.create({
      name: 'Burgers',
      description: 'Charred gourmet patties',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
    });

    const dessertCategory = await Category.create({
      name: 'Desserts',
      description: 'Royal sweets & decadent treats',
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80'
    });

    const beverageCategory = await Category.create({
      name: 'Beverages',
      description: 'Lassis, masala chai, filter kaapi & artisan brews',
      image: 'https://images.unsplash.com/photo-1571006682858-a458b8a69212?auto=format&fit=crop&w=600&q=80'
    });

    console.log('Seeding South Indian & Authentic menu items...');
    const items = [
      {
        name: 'Crispy Masala Dosa & Sambar',
        description: 'Golden thin rice crepe stuffed with spiced potato masala, served with piping hot vegetable sambar & fresh coconut chutney.',
        price: 189,
        category: southIndianCat._id,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
        ingredients: ['Rice Batter', 'Potatoes', 'Mustard Seeds', 'Coconut'],
        allergens: ['Mustard'],
        tags: ['South Indian', 'Best Seller', 'Vegetarian'],
        ratings: 4.9,
        numReviews: 75
      },
      {
        name: 'Madurai Chettinad Chicken Curry',
        description: 'Fiery Tamil Nadu Chettinad-style chicken curry roasted with freshly ground star anise, fennel, black pepper & curry leaves.',
        price: 429,
        category: southIndianCat._id,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
        ingredients: ['Chicken', 'Fennel', 'Black Pepper', 'Curry Leaves'],
        allergens: [],
        tags: ['South Indian', 'Spicy'],
        ratings: 4.9,
        numReviews: 60
      },
      {
        name: 'Ghee Roast Paneer Podi Dosa',
        description: 'Crispy dosa roasted in rich desi ghee, dusted with spicy gun powder podi masala & filled with crumbled paneer.',
        price: 229,
        category: southIndianCat._id,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
        ingredients: ['Ghee', 'Paneer', 'Gun Powder Podi'],
        allergens: ['Dairy'],
        tags: ['South Indian', 'Vegetarian'],
        ratings: 4.8,
        numReviews: 45
      },
      {
        name: 'Kerala Malabar Parotta & Korma',
        description: 'Flaky layered Kerala Malabar parottas served with aromatic coconut milk chicken korma.',
        price: 389,
        category: southIndianCat._id,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
        ingredients: ['Maida', 'Coconut Milk', 'Chicken'],
        allergens: ['Gluten', 'Dairy'],
        tags: ['South Indian'],
        ratings: 4.9,
        numReviews: 50
      },
      {
        name: 'Authentic South Indian Filter Kaapi',
        description: 'Frothed chicory coffee brewed in a brass filter, poured with hot boiled whole milk in a traditional davarah.',
        price: 89,
        category: beverageCategory._id,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
        ingredients: ['Coffee', 'Chicory', 'Milk'],
        allergens: ['Dairy'],
        tags: ['South Indian', 'Beverages'],
        ratings: 4.9,
        numReviews: 80
      },
      {
        name: 'Hyderabadi Dum Chicken Biryani',
        description: 'Fragrant basmati rice layered with succulent marinated chicken, saffron, ghee, and dum spices.',
        price: 399,
        category: mainCategory._id,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1559528896-c5310744cce8?auto=format&fit=crop&w=600&q=80',
        ingredients: ['Basmati Rice', 'Chicken', 'Saffron', 'Mint', 'Dum Masala'],
        allergens: ['Dairy'],
        tags: ['Best Seller', 'Indian Special'],
        ratings: 5.0,
        numReviews: 88
      },
      {
        name: 'Authentic Butter Chicken & Garlic Naan',
        description: 'Tandoori chicken pieces simmered in a velvety buttery spiced tomato gravy, paired with garlic naan.',
        price: 449,
        category: mainCategory._id,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
        ingredients: ['Chicken', 'Butter', 'Cream', 'Tomato Puree', 'Kasoori Methi'],
        allergens: ['Dairy', 'Gluten'],
        tags: ['Best Seller', 'Indian Special'],
        ratings: 4.9,
        numReviews: 95
      },
      {
        name: 'Royal Shahi Paneer Butter Masala',
        description: 'Cottage cheese cubes bathed in a creamy cashew and tomato reduction, garnished with cardamom cream.',
        price: 379,
        category: mainCategory._id,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
        ingredients: ['Paneer', 'Cashew Paste', 'Butter', 'Tomato', 'Cream'],
        allergens: ['Dairy', 'Nuts'],
        tags: ['Indian Special', 'Vegetarian'],
        ratings: 4.8,
        numReviews: 64
      },
      {
        name: 'Slow-Cooked Dal Makhani',
        description: 'Black lentils and red kidney beans simmered overnight with butter, fresh cream, and select spices.',
        price: 279,
        category: mainCategory._id,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&w=600&q=80',
        ingredients: ['Black Lentils', 'Kidney Beans', 'Butter', 'Cream'],
        allergens: ['Dairy'],
        tags: ['Indian Special', 'Vegetarian'],
        ratings: 4.8,
        numReviews: 52
      },
      {
        name: 'Tandoori Paneer Tikka Skewers',
        description: 'Cubes of cottage cheese marinated in yogurt and Indian tandoori spices, charcoal grilled.',
        price: 249,
        category: starterCategory._id,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
        ingredients: ['Paneer', 'Yogurt', 'Bell Peppers', 'Tandoori Masala'],
        allergens: ['Dairy'],
        tags: ['Indian Special', 'Vegetarian'],
        ratings: 4.7,
        numReviews: 40
      },
      {
        name: 'Deluxe Samosa Chaat',
        description: 'Crushed spiced potato samosas topped with tangy chickpea curry, sweetened yogurt, mint & tamarind chutneys.',
        price: 189,
        category: starterCategory._id,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
        ingredients: ['Potatoes', 'Chickpeas', 'Yogurt', 'Tamarind', 'Spices'],
        allergens: ['Gluten', 'Dairy'],
        tags: ['Indian Special', 'Street Food'],
        ratings: 4.7,
        numReviews: 35
      },
      {
        name: 'Truffle Wild Mushroom Pizza',
        description: 'Neapolitan sourdough crust with forest mushrooms, fior di latte mozzarella & black truffle glaze.',
        price: 549,
        category: pizzaCategory._id,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        ingredients: ['Sourdough', 'Shiitake', 'Mozzarella', 'Truffle Oil'],
        allergens: ['Gluten', 'Dairy'],
        tags: ['Gourmet', 'Chef Special'],
        ratings: 4.9,
        numReviews: 42
      },
      {
        name: 'Shahi Gulab Jamun with Rabri',
        description: 'Deep-fried milk solids dumplings soaked in warm rose-cardamom sugar syrup, served with rabri.',
        price: 149,
        category: dessertCategory._id,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77?auto=format&fit=crop&w=600&q=80',
        ingredients: ['Khoa', 'Sugar Syrup', 'Cardamom', 'Rabri'],
        allergens: ['Dairy', 'Gluten'],
        tags: ['Indian Dessert', 'Sweet'],
        ratings: 4.9,
        numReviews: 50
      },
      {
        name: 'Royal Alphonso Mango Lassi',
        description: 'Thick, creamy yogurt shake blended with fresh Alphonso mango pulp and cardamom dust.',
        price: 129,
        category: beverageCategory._id,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1571006682858-a458b8a69212?auto=format&fit=crop&w=600&q=80',
        ingredients: ['Mango Pulp', 'Yogurt', 'Milk', 'Cardamom'],
        allergens: ['Dairy'],
        tags: ['Indian Special', 'Refreshing'],
        ratings: 4.9,
        numReviews: 40
      }
    ];

    await MenuItem.insertMany(items);
    console.log('Seeding coupons...');

    const coupons = [
      {
        code: 'SAVER20',
        discountType: 'percentage',
        discountValue: 20,
        expiryDate: new Date('2030-12-31'),
        minOrderValue: 200,
        isActive: true
      },
      {
        code: 'WELCOME50',
        discountType: 'fixed',
        discountValue: 100,
        expiryDate: new Date('2030-12-31'),
        minOrderValue: 300,
        isActive: true
      }
    ];

    await Coupon.insertMany(coupons);
    console.log('Database seeded successfully!');

    if (shouldCloseConnection) {
      mongoose.connection.close();
      process.exit(0);
    }
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    if (shouldCloseConnection) {
      process.exit(1);
    }
    throw error;
  }
};

const runSelf = async () => {
  const isDirect = process.argv[1] && (process.argv[1].endsWith('seed.js') || process.argv[1] === fileURLToPath(import.meta.url));
  if (isDirect) {
    try {
      console.log('Seeder run directly. Connecting...');
      const connectDBModule = await import('./config/db.js');
      await connectDBModule.default();
      await seedData(true);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
};

runSelf();
