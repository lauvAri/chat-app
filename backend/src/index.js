import express from "express";

const app = express();
const port = 3000;

app.get('/time', (req, resp) => {
    const today = new Date();
    console.log("today", today, "getDate", today.getDate(), "getMonth + 1", today.getMonth() + 1);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();
    resp.send({
        msg: 'If you see this, express works!',
        year: yyyy,
        month: mm,
        date: dd,
        hours,
        minutes,
        seconds
    })
})

app.listen(port, () => {
    console.log('Server is running on port', port);
})