const axios = require('axios');
const Media = require('../models/Media');
const FormData = require('form-data');

const MEDIA_API_BASE_URL = 'https://api.whatsapp.com/v1';

// WhatsApp API endpoint
// https://graph.facebook.com/v20.0/424680094053343/messages `
const WHATSAPP_API_BASE_URL = 'https://graph.facebook.com/v20.0';
const ACCESS_TOKEN = 'EAAFJVZCHALdUBO6xq2wd1bb32aZAHqb4Okm56H8jg4mi9o6LytXNZAOCUfLNgizvEdMo0kWN4C9V3wSenyzfkoMaOeTOU1Ew0Xq8yFjMNNunzG6WFFMyu4p8xa9AQZBTrwO1u7kUdowobz7kM8cRnRLtjjlDCFOgMQC82v0wvRidMnl5geZAry1IfRsXIsvel2bdcjQAsZA4ZCcAXR6IXUZD';

// Upload media to WhatsApp
exports.uploadMedia = async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;
    const file = req.file;

    // Construct form data for the request
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype // Ensure content type is specified
    });
    formData.append('type', file.mimetype);
    formData.append('messaging_product', 'whatsapp');
    // formData.append('to', '917567219894');

    // Send POST request to WhatsApp API
    const response = await axios.post(`${WHATSAPP_API_BASE_URL}/${phoneNumber}/media`, formData, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        ...formData.getHeaders() // Set headers for FormData including boundary
      },
    });

    // Assuming WhatsApp API response provides mediaId and mediaUrl
    const { id } = response.data;

    // Save media info to MongoDB
    const newMedia = new Media({
      mediaId : id
    });
    await newMedia.save();

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error uploading media to WhatsApp:', error);
    res.status(500).json({ error: 'Error uploading media to WhatsApp' });
  }
};

// Retrieve media URL by media ID
exports.getMediaUrl = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    // Send POST request to WhatsApp API
    const response = await axios.get(`${WHATSAPP_API_BASE_URL}/${mediaId}`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching media URL:', error);
    res.status(500).json({ error: 'Error fetching media URL' });
  }
};

// Delete media by media ID
exports.deleteMedia = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

     // Send POST request to WhatsApp API
     await axios.delete(`${WHATSAPP_API_BASE_URL}/${mediaId}`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
    });

    res.status(200).json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Error deleting media' });
  }
};

// Download
exports.downloadMedia = async (req, res) => {
  try {
    const url = req.params.mediaUrl;

     // Send POST request to WhatsApp API
     const response =   await axios.get(`${WHATSAPP_API_BASE_URL}/${url}`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
    });

    res.status(200).json(response.data);  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Error deleting media' });
  }
};
