import pool from "../config/db.js";
import { comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

// Login
export const login = async ({ email, password }) => {
  const result = await pool.query(
    `
    SELECT 
      u.id,
      u.username,
      u.email,
      u.password_hash,
      r.name AS role
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.email = $1
    `,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  const user = result.rows[0];

  const isMatch = await comparePassword(password, user.password_hash);

  if (!isMatch) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};