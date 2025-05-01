在backend目录下创建.env文件
输入内容：
```
MONGODB_URL=mongodb://localhost:27017/chat-db

PORT=5001

JWT_SECRET=myscretkey
JWT_EXPIRES=7d
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=dizhd4jdp
CLOUDINARY_API_KEY=286861188745581
CLOUDINARY_API_SECRET=xJgDi2oWP6dLPOu-dCtQT8McMec
```

```
cd backend
npm install
npm run dev
```

```
cd frontend
npm install
npm run dev
```
