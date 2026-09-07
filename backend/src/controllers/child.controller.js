const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULT_CHILD_IMAGES = [
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=400&q=80',
];

const getMyChildren = async (req, res) => {
  try {
    const userId = req.user.id;

    const children = await prisma.child.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: children
    });
  } catch (error) {
    console.error('getMyChildren error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve child profiles.'
    });
  }
};

const getLatestJoinedKids = async (req, res) => {
  try {
    const dbChildren = await prisma.child.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const defaultSeedKids = [
      { id: 'seed-1', name: 'Vinik', age: 1, city: 'Delhi', image: DEFAULT_CHILD_IMAGES[0], isStar: true },
      { id: 'seed-2', name: 'Mihik', age: 0, city: 'Ahmedabad', image: DEFAULT_CHILD_IMAGES[1], isStar: true },
      { id: 'seed-3', name: 'Shivay', age: 2, city: 'Remote', image: DEFAULT_CHILD_IMAGES[2], isStar: false },
      { id: 'seed-4', name: 'Ananya', age: 3, city: 'Mumbai', image: DEFAULT_CHILD_IMAGES[3], isStar: true },
      { id: 'seed-5', name: 'Aarav', age: 5, city: 'Bangalore', image: DEFAULT_CHILD_IMAGES[4], isStar: false },
      { id: 'seed-6', name: 'Riya', age: 4, city: 'Hyderabad', image: DEFAULT_CHILD_IMAGES[5], isStar: true },
    ];

    const formattedDbKids = dbChildren.map((ch, idx) => ({
      id: ch.id,
      name: ch.name,
      age: ch.age,
      city: ch.city,
      image: DEFAULT_CHILD_IMAGES[idx % DEFAULT_CHILD_IMAGES.length],
      isStar: idx % 2 === 0,
      createdAt: ch.createdAt
    }));

    const combined = [...formattedDbKids, ...defaultSeedKids];

    return res.status(200).json({
      success: true,
      data: combined
    });
  } catch (error) {
    console.error('getLatestJoinedKids error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve latest joined kids.'
    });
  }
};

const createChild = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, age, city } = req.body;

    if (!name || age === undefined || !city) {
      return res.status(400).json({
        success: false,
        message: 'Name, age, and city are required.'
      });
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 18) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid age between 0 and 18.'
      });
    }

    const child = await prisma.child.create({
      data: {
        userId,
        name: name.trim(),
        age: ageNum,
        city: city.trim()
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Child profile created successfully',
      data: child
    });
  } catch (error) {
    console.error('createChild error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create child profile.'
    });
  }
};

module.exports = {
  getMyChildren,
  getLatestJoinedKids,
  createChild
};
