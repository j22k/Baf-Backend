const Message = require('../models/Message');

/**
 * Create a new message from contact form
 * @param {Object} messageData - Object containing name, email, message
 * @returns {Promise<Object>} Created message object with timestamps
 */
const createMessage = async (messageData) => {
  try {
    const { name, email, message } = messageData;

    // Validate required fields
    if (!name || !email || !message) {
      throw new Error('All fields are required (name, email, message)');
    }

    // Additional email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please provide a valid email address');
    }

    // Create new message (createdAt and updatedAt added automatically)
    const newMessage = new Message({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    });

    const savedMessage = await newMessage.save();
    return savedMessage;
  } catch (err) {
    throw new Error('Error creating message: ' + err.message);
  }
};

/**
 * Get all messages with optional filtering and pagination
 * @param {Object} options - Query options (status, page, limit, dateRange)
 * @returns {Promise<Object>} Messages with pagination info
 */
const getAllMessages = async (options = {}) => {
  try {
    const { status, page = 1, limit = 10, dateFrom, dateTo } = options;
    const skip = (page - 1) * limit;
    
    // Build filter
    let filter = {};
    if (status && ['unread', 'read', 'replied'].includes(status)) {
      filter.status = status;
    }

    // Add date range filter if provided
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Message.countDocuments(filter);

    return {
      messages,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: messages.length,
        totalMessages: total
      }
    };
  } catch (err) {
    throw new Error('Error fetching messages: ' + err.message);
  }
};

/**
 * Get a single message by ID
 * @param {string} messageId - Message ID
 * @returns {Promise<Object>} Message object with timestamps
 */
const getMessageById = async (messageId) => {
  try {
    const message = await Message.findById(messageId);
    if (!message) {
      throw new Error('Message not found');
    }
    return message;
  } catch (err) {
    throw new Error('Error fetching message: ' + err.message);
  }
};

/**
 * Update message status (updatedAt automatically updated)
 * @param {string} messageId - Message ID
 * @param {string} status - New status (unread, read, replied)
 * @returns {Promise<Object>} Updated message object
 */
const updateMessageStatus = async (messageId, status) => {
  try {
    if (!status || !['unread', 'read', 'replied'].includes(status)) {
      throw new Error('Valid status required (unread, read, replied)');
    }

    const updated = await Message.findByIdAndUpdate(
      messageId, 
      { status }, 
      { new: true } // updatedAt automatically updated by Mongoose[71]
    );
    
    if (!updated) {
      throw new Error('Message not found');
    }
    
    return updated;
  } catch (err) {
    throw new Error('Error updating message status: ' + err.message);
  }
};

/**
 * Delete a message by ID
 * @param {string} messageId - Message ID
 * @returns {Promise<Object>} Deleted message object
 */
const deleteMessage = async (messageId) => {
  try {
    const deleted = await Message.findByIdAndDelete(messageId);
    if (!deleted) {
      throw new Error('Message not found');
    }
    return deleted;
  } catch (err) {
    throw new Error('Error deleting message: ' + err.message);
  }
};

/**
 * Get message statistics with date breakdown
 * @returns {Promise<Object>} Statistics object with timestamps
 */
const getMessageStats = async () => {
  try {
    const total = await Message.countDocuments();
    const unread = await Message.countDocuments({ status: 'unread' });
    const read = await Message.countDocuments({ status: 'read' });
    const replied = await Message.countDocuments({ status: 'replied' });
    
    // Get messages from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentMessages = await Message.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });

    // Get today's messages
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayMessages = await Message.countDocuments({ 
      createdAt: { $gte: startOfDay } 
    });
    
    return {
      total,
      unread,
      read,
      replied,
      recentMessages, // Last 30 days
      todayMessages,
      lastUpdated: new Date().toISOString()
    };
  } catch (err) {
    throw new Error('Error fetching message statistics: ' + err.message);
  }
};

/**
 * Get recent messages with timestamp info
 * @param {number} limit - Number of messages to fetch (default: 10)
 * @returns {Promise<Array>} Array of recent messages
 */
const getRecentMessages = async (limit = 10) => {
  try {
    return await Message.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name email message status createdAt updatedAt');
  } catch (err) {
    throw new Error('Error fetching recent messages: ' + err.message);
  }
};

/**
 * Get messages by date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Array of messages in date range
 */
const getMessagesByDateRange = async (startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // End of day
    
    return await Message.find({
      createdAt: {
        $gte: start,
        $lte: end
      }
    }).sort({ createdAt: -1 });
  } catch (err) {
    throw new Error('Error fetching messages by date range: ' + err.message);
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
  getMessageStats,
  getRecentMessages,
  getMessagesByDateRange
};
