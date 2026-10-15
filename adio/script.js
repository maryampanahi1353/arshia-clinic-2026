
document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    // منوی موبایل
    if (menuButton && mainNav) {
        menuButton.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuButton.textContent = isOpen ? "✕" : "☰";
        });

        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.textContent = "☰";
            });
        });
    }

    // اطلاعات برنامه کاری مطب
    const clinicSchedule = {
        days: [1, 3], // دوشنبه و چهارشنبه
        openingHour: 16,
        closingHour: 19,
        appointmentDuration: 20
    };

    // ساخت ساعت‌های نوبت
    function createTimeSlots() {
        const slots = [];

        const start =
            clinicSchedule.openingHour * 60;

        const end =
            clinicSchedule.closingHour * 60;

        for (
            let minute = start;
            minute + clinicSchedule.appointmentDuration <= end;
            minute += clinicSchedule.appointmentDuration
        ) {
            const hour = Math.floor(minute / 60);
            const mins = minute % 60;

            slots.push(
                `${String(hour).padStart(2, "0")}:${String(mins).padStart(2, "0")}`
            );
        }

        return slots;
    }

    // این تابع را در صفحه نوبت‌دهی استفاده خواهیم کرد.
    window.clinicSchedule = clinicSchedule;
    window.createClinicTimeSlots = createTimeSlots;

    console.log("سایت مطب شنوایی‌شناسی عرشیا آماده است.");
    console.log("ساعت‌های نوبت:", createTimeSlots());
});
```javascript
// سیستم آزمایشی انتخاب نوبت
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("appointment-form");

    // اگر صفحه رزرو نیست، این بخش اجرا نشود.
    if (!form) return;

    const dateInput = document.getElementById("appointment-date");
    const timeSelect = document.getElementById("appointment-time");
    const message = document.getElementById("booking-message");

    // حداقل تاریخ، امروز باشد.
    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    dateInput.min = localToday;

    // ساعت‌های شروع نوبت؛ آخرین نوبت ساعت ۱۸:۴۰ است.
    const timeSlots = [
        "16:00", "16:20", "16:40",
        "17:00", "17:20", "17:40",
        "18:00", "18:20", "18:40"
    ];

    function showMessage(text, isError = false) {
        message.textContent = text;
        message.classList.toggle("error", isError);
    }

    function updateTimeSlots() {
        timeSelect.innerHTML = "";

        const selectedDate = dateInput.value;

        if (!selectedDate) {
            timeSelect.add(new Option("ابتدا تاریخ را انتخاب کنید", ""));
            timeSelect.disabled = true;
            return;
        }

        // تاریخ انتخاب‌شده را بدون مشکل منطقه زمانی بررسی می‌کنیم.
        const [year, month, day] = selectedDate.split("-").map(Number);
        const selectedDay = new Date(year, month - 1, day).getDay();

        // جاوااسکریپت: یکشنبه ۰، دوشنبه ۱، چهارشنبه ۳
        if (selectedDay !== 1 && selectedDay !== 3) {
            timeSelect.add(new Option("این روز کاری مطب نیست", ""));
            timeSelect.disabled = true;
            showMessage("لطفاً دوشنبه یا چهارشنبه را انتخاب کنید.", true);
            return;
        }

        timeSelect.add(new Option("انتخاب ساعت", ""));

        timeSlots.forEach((time) => {
            timeSelect.add(new Option(time, time));
        });

        timeSelect.disabled = false;
        showMessage("");
    }

    dateInput.addEventListener("change", updateTimeSlots);

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const selectedDate = dateInput.value;
        const selectedTime = timeSelect.value;

        if (!selectedTime) {
            showMessage("لطفاً یک ساعت برای نوبت انتخاب کنید.", true);
            return;
        }

        // ثبت آزمایشی در مرورگر؛ هنوز برای مطب ارسال نمی‌شود.
        const request = {
            name: document.getElementById("patient-name").value.trim(),
            phone: document.getElementById("patient-phone").value.trim(),
            date: selectedDate,
            time: selectedTime
        };

        try {
            const savedRequests = JSON.parse(
                localStorage.getItem("arshiaDemoAppointments") || "[]"
            );

            const alreadyExists = savedRequests.some((item) =>
                item.date === request.date && item.time === request.time
            );

            if (alreadyExists) {
                showMessage(
                    "این ساعت در این مرورگر قبلاً انتخاب شده است. ساعت دیگری را انتخاب کنید.",
                    true
                );
                return;
            }

            savedRequests.push(request);

            localStorage.setItem(
                "arshiaDemoAppointments",
                JSON.stringify(savedRequests)
            );

            showMessage(
                "درخواست آزمایشی شما در این مرورگر ذخیره شد. برای قطعی شدن نوبت، لطفاً با مطب تماس بگیرید."
            );

            form.reset();
            timeSelect.innerHTML = "";
            timeSelect.add(new Option("ابتدا تاریخ را انتخاب کنید", ""));
            timeSelect.disabled = true;
        } catch (error) {
            showMessage(
                "ذخیره آزمایشی انجام نشد. لطفاً برای هماهنگی با مطب تماس بگیرید.",
                true
            );
        }
    });
});
```