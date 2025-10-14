// server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
// !! IMPORTANT: Replace this with your own connection string from MongoDB Atlas !!
const dbURI = 'mongodb+srv://akashbhunia303_db_user:Aakash%40303%23@arjun180.w43zpi2.mongodb.net/?retryWrites=true&w=majority&appName=Arjun180';

mongoose.connect(dbURI)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
        // Start the server only after the DB connection is successful
        app.listen(PORT, () => {
            console.log(`Server is running successfully on http://localhost:${PORT}`);
        });
        seedDatabase(); // Optional: Add initial data to the database
    })
    .catch(err => console.error('Could not connect to MongoDB Atlas:', err));


// --- Mongoose Schema & Model ---
const bikeSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
});

const Bike = mongoose.model('Bike', bikeSchema);


// --- API Routes ---
/**
 * @route   GET /api/bikes
 * @desc    Get all bikes, or search for bikes by name/type
 */
app.get('/api/bikes', async (req, res) => {
    try {
        const { search } = req.query; // Check for a 'search' query parameter
        let query = {};

        if (search) {
            // If a search term exists, create a query to search in 'name' and 'type' fields
            // The 'i' option makes the search case-insensitive
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { type: { $regex: search, $options: 'i' } }
                ]
            };
            console.log(`Performing search for: "${search}"`);
        } else {
            console.log('Fetching all bikes');
        }

        const bikes = await Bike.find(query);
        res.json(bikes);
    } catch (error) {
        console.error('Error fetching bikes:', error);
        res.status(500).json({ message: 'Server error while fetching bikes' });
    }
});


// --- Database Seeding (to add initial data) ---
async function seedDatabase() {
    try {
        const count = await Bike.countDocuments();
        if (count === 0) {
            console.log('No bikes found in DB, seeding initial data...');
            const initialBikes = [
                { id: 1, name: 'Royal Enfield Classic 350', type: 'Cruiser', price: 193000.00, image: 'Zclassic350.jpg' },
                { id: 2, name: 'Bajaj Pulsar NS200', type: 'Street', price: 158000.00, image: 'ZPulser NS200.jpg' },
                { id: 3, name: 'TVS Apache RR 310', type: 'Sport', price: 272000.00, image: 'ZApatchi RTR310.jpg' },
                { id: 4, name: 'Hero Splendor Plus', type: 'Commuter', price: 75000.00, image: 'https://5.imimg.com/data5/SELLER/Default/2023/9/342317924/BO/CH/WW/194639109/hero-splendor-plus-1000x1000.png' },
                { id: 5, name: 'Jawa Perak', type: 'Bobber', price: 213000.00, image: 'ZJawa.jpg' },
                { id: 6, name: 'Yezdi Roadster', type: 'Cruiser', price: 209000.00, image: 'https://images.timesdrive.in/photo/msid-151061276,thumbsize-100,width-175,height-85,resizemode-75/151061276.jpg' },
                { id: 7, name: 'Royal Enfield Interceptor 650', type: 'Cruiser', price: 333000.00, image: 'https://www.royalenfield.com/content/dam/royal-enfield/india/motorcycles/interceptor/new/colours/studio-shots/black-ray/black_ray_000.png' },
                { id: 8, name: 'Yamaha FZ-S FI', type: 'Sport', price: 163000.00, image: 'https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fz_series_all/fzs-fi/fzs-fi-std.webp' },
                { id: 9, name: 'Honda Hornet 2.0', type: 'Classic', price: 180000.00, image: 'https://imgd.aeplcdn.com/1056x594/n/cw/ec/156227/hornet-right-side-view-2.png?isig=0&q=80&wm=3' },
            ];
            await Bike.insertMany(initialBikes);
            console.log('Database seeded successfully!');
        }
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}