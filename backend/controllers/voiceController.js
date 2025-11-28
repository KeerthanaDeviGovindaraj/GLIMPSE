const VoiceSettings = require('../models/VoiceSettings');
const ResponseHandler = require('../utils/responseHandler');
const speechService = require('../services/speechService');

// @desc    Get voice settings for user
// @route   GET /api/voice/settings
// @access  Private
exports.getVoiceSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    let settings = await VoiceSettings.findOne({ userId });

    // Create default settings if none exist
    if (!settings) {
      settings = await VoiceSettings.create({
        userId,
        enabled: false,
        voice: 'professional',
        rate: 0.95,
        pitch: 0.95,
        volume: 0.95,
        language: 'en-US'
      });
    }

    ResponseHandler.success(res, settings);

  } catch (error) {
    console.error('Get voice settings error:', error);
    ResponseHandler.error(res, 'Failed to fetch voice settings', 500);
  }
};

// @desc    Update voice settings
// @route   PUT /api/voice/settings
// @access  Private
exports.updateVoiceSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { enabled, voice, rate, pitch, volume, language, autoSpeak } = req.body;

    // Validate rate, pitch, volume ranges
    if (rate && (rate < 0.1 || rate > 2.0)) {
      return ResponseHandler.badRequest(res, 'Rate must be between 0.1 and 2.0');
    }
    if (pitch && (pitch < 0 || pitch > 2.0)) {
      return ResponseHandler.badRequest(res, 'Pitch must be between 0 and 2.0');
    }
    if (volume && (volume < 0 || volume > 1.0)) {
      return ResponseHandler.badRequest(res, 'Volume must be between 0 and 1.0');
    }

    const updateData = {
      ...(enabled !== undefined && { enabled }),
      ...(voice && { voice }),
      ...(rate !== undefined && { rate }),
      ...(pitch !== undefined && { pitch }),
      ...(volume !== undefined && { volume }),
      ...(language && { language }),
      ...(autoSpeak !== undefined && { autoSpeak })
    };

    const settings = await VoiceSettings.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    ResponseHandler.success(res, settings, 'Voice settings updated successfully');

  } catch (error) {
    console.error('Update voice settings error:', error);
    ResponseHandler.error(res, 'Failed to update voice settings', 500);
  }
};

// @desc    Get available voices
// @route   GET /api/voice/available
// @access  Public
exports.getAvailableVoices = async (req, res) => {
  try {
    const voices = [
      {
        id: 'professional',
        name: 'Professional',
        description: 'Clear, professional tone for business use',
        language: 'en-US',
        gender: 'neutral',
        rate: 0.95,
        pitch: 0.95
      },
      {
        id: 'enthusiastic',
        name: 'Enthusiastic',
        description: 'Energetic and exciting for sports commentary',
        language: 'en-US',
        gender: 'male',
        rate: 1.1,
        pitch: 1.2
      },
      {
        id: 'analytical',
        name: 'Analytical',
        description: 'Measured and thoughtful for detailed analysis',
        language: 'en-US',
        gender: 'neutral',
        rate: 0.9,
        pitch: 0.9
      },
      {
        id: 'casual',
        name: 'Casual',
        description: 'Friendly and relaxed tone',
        language: 'en-US',
        gender: 'female',
        rate: 1.0,
        pitch: 1.0
      }
    ];

    ResponseHandler.success(res, voices);

  } catch (error) {
    console.error('Get available voices error:', error);
    ResponseHandler.error(res, 'Failed to fetch available voices', 500);
  }
};

// @desc    Test voice output
// @route   POST /api/voice/test
// @access  Private
exports.testVoice = async (req, res) => {
  try {
    const { text, voice, rate, pitch, volume, language } = req.body;

    if (!text) {
      return ResponseHandler.badRequest(res, 'Text is required for testing');
    }

    // Validate parameters
    const voiceConfig = {
      voice: voice || 'professional',
      rate: rate || 0.95,
      pitch: pitch || 0.95,
      volume: volume || 0.95,
      language: language || 'en-US'
    };

    // In a real implementation, this would generate audio
    // For now, we'll return the configuration that would be used
    const response = {
      success: true,
      message: 'Voice test configuration',
      config: voiceConfig,
      text: text.substring(0, 100), // Limit text in response
      preview: `Text will be spoken with ${voiceConfig.voice} voice at ${voiceConfig.rate}x speed`
    };

    ResponseHandler.success(res, response, 'Voice test ready');

  } catch (error) {
    console.error('Test voice error:', error);
    ResponseHandler.error(res, 'Failed to test voice', 500);
  }
};

// @desc    Convert text to speech
// @route   POST /api/voice/synthesize
// @access  Private
exports.synthesizeText = async (req, res) => {
  try {
    const { text, options } = req.body;
    const userId = req.user.id;

    if (!text) {
      return ResponseHandler.badRequest(res, 'Text is required');
    }

    // Get user's voice settings or use defaults
    let voiceSettings = await VoiceSettings.findOne({ userId });
    
    if (!voiceSettings) {
      voiceSettings = {
        voice: 'professional',
        rate: 0.95,
        pitch: 0.95,
        volume: 0.95,
        language: 'en-US'
      };
    }

    // Merge with provided options
    const synthesisOptions = {
      voice: options?.voice || voiceSettings.voice,
      rate: options?.rate || voiceSettings.rate,
      pitch: options?.pitch || voiceSettings.pitch,
      volume: options?.volume || voiceSettings.volume,
      language: options?.language || voiceSettings.language
    };

    // In production, this would call an actual TTS service
    // For now, return configuration
    const result = {
      text,
      config: synthesisOptions,
      duration: Math.ceil(text.length / 15), // Rough estimate in seconds
      timestamp: new Date().toISOString()
    };

    ResponseHandler.success(res, result, 'Text synthesized successfully');

  } catch (error) {
    console.error('Synthesize text error:', error);
    ResponseHandler.error(res, 'Failed to synthesize text', 500);
  }
};

// @desc    Get voice usage statistics
// @route   GET /api/voice/stats
// @access  Private
exports.getVoiceStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // In production, this would fetch from a usage tracking collection
    const stats = {
      totalSynthesized: 245,
      totalDuration: 1820, // seconds
      mostUsedVoice: 'professional',
      averageRate: 0.95,
      dailyUsage: [
        { date: '2024-11-25', count: 45 },
        { date: '2024-11-26', count: 52 },
        { date: '2024-11-27', count: 38 }
      ],
      languageDistribution: {
        'en-US': 85,
        'en-GB': 10,
        'es-ES': 5
      }
    };

    ResponseHandler.success(res, stats);

  } catch (error) {
    console.error('Get voice stats error:', error);
    ResponseHandler.error(res, 'Failed to fetch voice statistics', 500);
  }
};

// @desc    Save voice preset
// @route   POST /api/voice/presets
// @access  Private
exports.savePreset = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, voice, rate, pitch, volume, language } = req.body;

    if (!name) {
      return ResponseHandler.badRequest(res, 'Preset name is required');
    }

    const settings = await VoiceSettings.findOne({ userId });

    if (!settings) {
      return ResponseHandler.notFound(res, 'Voice settings not found. Please create settings first.');
    }

    // Check if preset name already exists
    const existingPreset = settings.customPresets.find(p => p.name === name);
    if (existingPreset) {
      return ResponseHandler.badRequest(res, 'Preset name already exists');
    }

    // Add new preset
    settings.customPresets.push({
      name,
      voice: voice || settings.voice,
      rate: rate || settings.rate,
      pitch: pitch || settings.pitch,
      volume: volume || settings.volume,
      language: language || settings.language
    });

    await settings.save();

    ResponseHandler.success(res, settings, 'Preset saved successfully');

  } catch (error) {
    console.error('Save preset error:', error);
    ResponseHandler.error(res, 'Failed to save preset', 500);
  }
};

// @desc    Delete voice preset
// @route   DELETE /api/voice/presets/:presetId
// @access  Private
exports.deletePreset = async (req, res) => {
  try {
    const userId = req.user.id;
    const { presetId } = req.params;

    const settings = await VoiceSettings.findOne({ userId });

    if (!settings) {
      return ResponseHandler.notFound(res, 'Voice settings not found');
    }

    // Remove preset
    settings.customPresets = settings.customPresets.filter(
      p => p._id.toString() !== presetId
    );

    await settings.save();

    ResponseHandler.success(res, settings, 'Preset deleted successfully');

  } catch (error) {
    console.error('Delete preset error:', error);
    ResponseHandler.error(res, 'Failed to delete preset', 500);
  }
};

// @desc    Apply voice preset
// @route   PUT /api/voice/presets/:presetId/apply
// @access  Private
exports.applyPreset = async (req, res) => {
  try {
    const userId = req.user.id;
    const { presetId } = req.params;

    const settings = await VoiceSettings.findOne({ userId });

    if (!settings) {
      return ResponseHandler.notFound(res, 'Voice settings not found');
    }

    // Find preset
    const preset = settings.customPresets.id(presetId);

    if (!preset) {
      return ResponseHandler.notFound(res, 'Preset not found');
    }

    // Apply preset settings
    settings.voice = preset.voice;
    settings.rate = preset.rate;
    settings.pitch = preset.pitch;
    settings.volume = preset.volume;
    settings.language = preset.language;

    await settings.save();

    ResponseHandler.success(res, settings, 'Preset applied successfully');

  } catch (error) {
    console.error('Apply preset error:', error);
    ResponseHandler.error(res, 'Failed to apply preset', 500);
  }
};

// @desc    Toggle voice auto-speak
// @route   PUT /api/voice/auto-speak
// @access  Private
exports.toggleAutoSpeak = async (req, res) => {
  try {
    const userId = req.user.id;
    const { autoSpeak } = req.body;

    if (autoSpeak === undefined) {
      return ResponseHandler.badRequest(res, 'autoSpeak value is required');
    }

    const settings = await VoiceSettings.findOneAndUpdate(
      { userId },
      { $set: { autoSpeak } },
      { new: true, upsert: true }
    );

    ResponseHandler.success(
      res, 
      settings, 
      `Auto-speak ${autoSpeak ? 'enabled' : 'disabled'} successfully`
    );

  } catch (error) {
    console.error('Toggle auto-speak error:', error);
    ResponseHandler.error(res, 'Failed to toggle auto-speak', 500);
  }
};

module.exports = exports;