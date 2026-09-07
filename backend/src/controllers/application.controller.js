const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const applyForCastingCall = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId, castingCallId } = req.body;

    if (!childId || !castingCallId) {
      return res.status(400).json({
        success: false,
        message: 'childId and castingCallId are required.'
      });
    }

    const childIdNum = parseInt(childId);
    const castingCallIdNum = parseInt(castingCallId);

    if (isNaN(childIdNum) || isNaN(castingCallIdNum)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid childId or castingCallId.'
      });
    }

    // 1. Verify child exists
    const child = await prisma.child.findUnique({
      where: { id: childIdNum }
    });

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child profile not found.'
      });
    }

    // 2. Verify child belongs to logged-in user
    if (child.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: This child profile does not belong to your account.'
      });
    }

    // 3. Verify casting call exists
    const castingCall = await prisma.castingCall.findUnique({
      where: { id: castingCallIdNum }
    });

    if (!castingCall) {
      return res.status(404).json({
        success: false,
        message: 'Casting call not found.'
      });
    }

    // 4. Check if child has already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        childId_castingCallId: {
          childId: childIdNum,
          castingCallId: castingCallIdNum
        }
      }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'This child profile has already applied for this casting call.'
      });
    }

    // 5. Create application
    const application = await prisma.application.create({
      data: {
        userId,
        childId: childIdNum,
        castingCallId: castingCallIdNum,
        status: 'APPLIED'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('applyForCastingCall error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while submitting application.'
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        child: true,
        castingCall: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('getMyApplications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve applications.'
    });
  }
};

module.exports = {
  applyForCastingCall,
  getMyApplications
};
