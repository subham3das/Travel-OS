import { Request, Response } from 'express';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { emailOrPhone, password } = req.body;
  if (!emailOrPhone || !password) {
    res.status(400).json({ success: false, message: 'Email/Phone and password are required' });
    return;
  }
  res.status(200).json({
    success: true,
    message: 'Login successful',
    user: { id: 'usr_123', emailOrPhone, name: 'Traveler' },
    token: 'jwt_mock_token_12345',
  });
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, phone, password } = req.body;
  if (!fullName || !email || !password) {
    res.status(400).json({ success: false, message: 'All required fields must be provided' });
    return;
  }
  res.status(201).json({
    success: true,
    message: 'User account created successfully',
    user: { id: 'usr_' + Date.now(), fullName, email, phone },
    token: 'jwt_mock_token_67890',
  });
};
