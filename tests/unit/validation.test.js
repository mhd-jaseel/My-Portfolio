const {
  isValidEmail,
  isValidUrl,
  validateObjectId,
  validateQueryParams,
  validateContactMessage,
  validateLoginInput,
  validateProjectInput,
  validateSkillInput,
  validateExperienceInput,
} = require('../../server/middleware/validateMiddleware');

describe('Unit Testing: Backend Validation Utilities', () => {
  describe('isValidEmail()', () => {
    test('accepts valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('mohammejaseel90@gmail.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    test('rejects invalid email formats', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('plainaddress')).toBe(false);
      expect(isValidEmail('@missingusername.com')).toBe(false);
      expect(isValidEmail('username@.com')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
      expect(isValidEmail(12345)).toBe(false);
    });
  });

  describe('isValidUrl()', () => {
    test('accepts valid HTTP/HTTPS URLs and relative anchors', () => {
      expect(isValidUrl('https://github.com/mhd-jaseel')).toBe(true);
      expect(isValidUrl('http://localhost:5173')).toBe(true);
      expect(isValidUrl('#')).toBe(true);
      expect(isValidUrl('/projects')).toBe(true);
      expect(isValidUrl('mailto:test@example.com')).toBe(true);
      expect(isValidUrl('tel:9846644092')).toBe(true);
    });

    test('rejects invalid or unsafe URL strings', () => {
      expect(isValidUrl('javascript:alert(1)')).toBe(false);
      expect(isValidUrl('ftp://invalid.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl(null)).toBe(false);
    });
  });

  describe('Skill Proficiency Validation', () => {
    test('validates percentage boundaries between 0 and 100', () => {
      const mockReqValid = {
        method: 'POST',
        body: {
          name: 'React',
          proficiencyPercentage: 85,
          category: '507f1f77bcf86cd799439011',
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      validateSkillInput(mockReqValid, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();

      // Test negative percentage
      const mockReqNegative = {
        method: 'POST',
        body: {
          name: 'React',
          proficiencyPercentage: -10,
          category: '507f1f77bcf86cd799439011',
        },
      };
      validateSkillInput(mockReqNegative, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);

      // Test percentage > 100
      const mockReqOver100 = {
        method: 'POST',
        body: {
          name: 'React',
          proficiencyPercentage: 150,
          category: '507f1f77bcf86cd799439011',
        },
      };
      validateSkillInput(mockReqOver100, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Project Thumbnail & Media Validation', () => {
    test('rejects temporary blob URLs as thumbnails', () => {
      const mockReq = {
        method: 'POST',
        body: {
          title: 'Demo Project',
          slug: 'demo-proj',
          category: 'Full Stack',
          description: 'A test project',
          thumbnail: 'blob:http://localhost:5173/78234-abcd',
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      validateProjectInput(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: expect.stringContaining('blob URLs cannot be saved') })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('rejects localhost URLs as thumbnails', () => {
      const mockReq = {
        method: 'POST',
        body: {
          title: 'Demo Project',
          slug: 'demo-proj',
          category: 'Full Stack',
          description: 'A test project',
          thumbnail: 'http://localhost:5000/uploads/temp.webp',
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      validateProjectInput(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: expect.stringContaining('localhost URLs cannot be saved') })
      );
    });

    test('rejects blob URLs in extra gallery images', () => {
      const mockReq = {
        method: 'POST',
        body: {
          title: 'Demo Project',
          slug: 'demo-proj',
          category: 'Full Stack',
          description: 'A test project',
          thumbnail: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
          gallery: ['https://res.cloudinary.com/demo/image/upload/sample.jpg', 'blob:http://localhost:5173/extra'],
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      validateProjectInput(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: expect.stringContaining('temporary blob or localhost') })
      );
    });

    test('accepts valid HTTPS Cloudinary/CDN URLs', () => {
      const mockReq = {
        method: 'POST',
        body: {
          title: 'Valid Project',
          slug: 'valid-project',
          category: 'Full Stack',
          description: 'A test project description',
          thumbnail: 'https://res.cloudinary.com/demo/image/upload/v12345/jaseel_portfolio/projects/demo.webp',
          gallery: ['https://res.cloudinary.com/demo/image/upload/v12345/jaseel_portfolio/gallery/shot1.webp'],
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      validateProjectInput(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
