import jwt from 'jsonwebtoken';
import User from '../models/user.module.js';

export const protectRoute = async (req, res, next) => {

    try {
        const token = req.cookies.jwt;
        if (!token) {
            // 401 unauthorized
            return res.status(401).json({ error: '鉴权失败，没有提供token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({message: '鉴权失败，token无效'})
        }

        // userId是在进行签名的时候传入的
        // -password表示不选择密码
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({message: 'Not Found'})
        }

        // 向req中添加属性
        req.user = user;
        next();// 执行下一个函数
    } catch (error) {
        console.error("Error in protectRoute middleware:",error);
        return res.status(500).json({message: 'Internal Server Error'})
    }
}