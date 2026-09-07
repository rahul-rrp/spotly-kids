const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCastingCalls = async (req, res) => {
  try {
    const { search, city, language, age, category } = req.query;

    const where = {};

    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { agencyName: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    if (city && city.trim() !== '' && city.trim().toLowerCase() !== 'all') {
      where.city = { equals: city.trim(), mode: 'insensitive' };
    }

    if (language && language.trim() !== '' && language.trim().toLowerCase() !== 'all') {
      where.language = { equals: language.trim(), mode: 'insensitive' };
    }

    if (category && category.trim() !== '' && category.trim().toLowerCase() !== 'all') {
      where.category = { equals: category.trim(), mode: 'insensitive' };
    }

    if (age && !isNaN(parseInt(age))) {
      const ageNum = parseInt(age);
      where.ageMin = { lte: ageNum };
      where.ageMax = { gte: ageNum };
    }

    const castingCalls = await prisma.castingCall.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      success: true,
      data: castingCalls
    });
  } catch (error) {
    console.error('getCastingCalls error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve casting calls.'
    });
  }
};

const getCastingCallById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid casting call ID.'
      });
    }

    const castingCall = await prisma.castingCall.findUnique({
      where: { id }
    });

    if (!castingCall) {
      return res.status(404).json({
        success: false,
        message: 'Casting call not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: castingCall
    });
  } catch (error) {
    console.error('getCastingCallById error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve casting call details.'
    });
  }
};

module.exports = {
  getCastingCalls,
  getCastingCallById
};
