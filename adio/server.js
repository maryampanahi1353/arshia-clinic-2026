
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// فایل‌های سایت در همین پوشه قرار دارند
app.use(express.static(__dirname));

app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        message: "سرور مطب شنوایی‌شناسی عرشیا فعال است."
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
