import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Alert, Platform } from 'react-native';

/**
 * Image Service - Handles camera, gallery access, and image processing
 * Manages permissions, compression, and validation
 */
class ImageService {
  /**
   * Request camera permissions
   * @returns {Promise<boolean>} True if permission granted
   */
  async requestCameraPermission() {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access to capture photos for your incident reports.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  }

  /**
   * Request photo library permissions
   * @returns {Promise<boolean>} True if permission granted
   */
  async requestGalleryPermission() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Photo Library Permission Required',
          'Please allow photo library access to select photos for your incident reports.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting gallery permission:', error);
      return false;
    }
  }

  /**
   * Capture photo from camera
   * @returns {Promise<Object|null>} Image result or null if cancelled
   */
  async pickFromCamera() {
    try {
      // Request permission first
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) {
        return null;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8, // Initial quality
        base64: true,
      });

      if (result.canceled) {
        return null;
      }

      return await this._processImageResult(result.assets[0]);
    } catch (error) {
      console.error('Error picking from camera:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
      return null;
    }
  }

  /**
   * Select photo from gallery
   * @returns {Promise<Object|null>} Image result or null if cancelled
   */
  async pickFromGallery() {
    try {
      // Request permission first
      const hasPermission = await this.requestGalleryPermission();
      if (!hasPermission) {
        return null;
      }

      // Launch gallery
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8, // Initial quality
        base64: true,
      });

      if (result.canceled) {
        return null;
      }

      return await this._processImageResult(result.assets[0]);
    } catch (error) {
      console.error('Error picking from gallery:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
      return null;
    }
  }

  /**
   * Process image result from picker
   * @private
   * @param {Object} asset - Image asset from picker
   * @returns {Promise<Object>} Processed image data
   */
  async _processImageResult(asset) {
    try {
      const { uri, width, height, base64: pickerBase64 } = asset;
      
      // Get file info (best effort, do not fail whole flow if this errors)
      let fileSizeBytes = null;
      try {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        fileSizeBytes = fileInfo.size;
      } catch (infoError) {
        // On some platforms cropped/temp URIs don't have file info; this is expected.
        // Keep quiet in production and only log a lightweight note in development.
        if (__DEV__) {
          console.log('File info not available for image URI; falling back to base64 length.', infoError?.message || infoError);
        }
      }

      // Prefer base64 provided by ImagePicker; fall back to manual conversion only if needed
      let finalBase64 = pickerBase64;
      if (!finalBase64) {
        finalBase64 = await this.convertToBase64(uri);
      }

      // When FileSystem didn't give size (e.g. cropped/temp URI), derive from base64 length
      if (fileSizeBytes == null && typeof finalBase64 === 'string') {
        const b64 = finalBase64.replace(/^data:image\/\w+;base64,/, '');
        fileSizeBytes = Math.ceil((b64.length * 3) / 4);
      }

      return {
        uri,
        base64: finalBase64,
        fileSize: fileSizeBytes,
        width,
        height,
      };
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  }

  /**
   * Compress image if it exceeds max size
   * @param {string} uri - Image URI
   * @param {number} maxSizeBytes - Maximum size in bytes (default 2MB)
   * @returns {Promise<Object>} Compressed image result
   */
  async compressImage(uri, maxSizeBytes = 2 * 1024 * 1024) {
    try {
      // Get current file size
      const fileInfo = await FileSystem.getInfoAsync(uri);
      let currentSize = fileInfo.size;

      // If already under limit, return as is
      if (currentSize <= maxSizeBytes) {
        return await this._processImageResult({ uri });
      }

      // Calculate compression quality needed
      // Start with quality based on size ratio
      let quality = Math.min(0.9, maxSizeBytes / currentSize);
      let attempts = 0;
      const maxAttempts = 5;

      while (currentSize > maxSizeBytes && attempts < maxAttempts) {
        // Use ImagePicker to compress
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: quality,
        });

        if (result.canceled) {
          throw new Error('Compression cancelled');
        }

        const newFileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
        currentSize = newFileInfo.size;

        // Reduce quality for next attempt
        quality *= 0.8;
        attempts++;
      }

      if (currentSize > maxSizeBytes) {
        throw new Error('Unable to compress image to required size');
      }

      return await this._processImageResult({ uri });
    } catch (error) {
      console.error('Error compressing image:', error);
      throw error;
    }
  }

  /**
   * Validate image size
   * @param {string} uri - Image URI
   * @param {number} maxBytes - Maximum size in bytes (default 2MB)
   * @returns {Promise<boolean>} True if size is valid
   */
  async validateImageSize(uri, maxBytes = 2 * 1024 * 1024) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      return fileInfo.size <= maxBytes;
    } catch (error) {
      console.error('Error validating image size:', error);
      return false;
    }
  }

  /**
   * Convert image to base64
   * @param {string} uri - Image URI
   * @returns {Promise<string>} Base64 encoded string
   */
  async convertToBase64(uri) {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Return with data URI prefix for web compatibility
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Error converting to base64:', error);
      throw new Error('Failed to convert image to base64');
    }
  }

  /**
   * Get image dimensions
   * @param {string} uri - Image URI
   * @returns {Promise<Object>} Width and height
   */
  async getImageDimensions(uri) {
    try {
      // This would require additional library or native module
      // For now, return from picker result
      return { width: 0, height: 0 };
    } catch (error) {
      console.error('Error getting image dimensions:', error);
      return { width: 0, height: 0 };
    }
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted size string
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Check if image size exceeds limit and show alert
   * @param {number} sizeBytes - File size in bytes
   * @param {number} maxBytes - Maximum allowed size
   * @returns {boolean} True if size is valid
   */
  checkSizeAndAlert(sizeBytes, maxBytes = 2 * 1024 * 1024) {
    if (sizeBytes > maxBytes) {
      Alert.alert(
        'Image Too Large',
        `The selected image (${this.formatFileSize(sizeBytes)}) exceeds the maximum size of ${this.formatFileSize(maxBytes)}. Please select a smaller image or try compressing it.`,
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  }
}

// Export singleton instance
export default new ImageService();
