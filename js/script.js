function initThemeToggle() {
    const root = document.documentElement;
    const toggle = document.querySelector("#themeToggle");
    const icon = document.querySelector("#themeIcon");

    if (!toggle || !icon || toggle.dataset.bound === "true") return;

    const applyTheme = theme => {
        root.dataset.theme = theme;
        localStorage.setItem("hr-theme", theme);
        icon.className = theme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-fill";
    };

    const saved = localStorage.getItem("hr-theme") || "light";
    applyTheme(saved);

    toggle.dataset.bound = "true";
    toggle.addEventListener("click", () => {
        applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver(
        entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add("visible")),
        { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

    const emp = document.querySelector("#employees");
    const size = document.querySelector("#companySize");
    const rec = document.querySelector("#recruitmentSupport");
    const comp = document.querySelector("#complianceSupport");
    const out = document.querySelector("#estimate");

    function calc() {
        if (!emp || !out) return;

        const employeeCount = Math.max(1, Number(emp.value) || 1);
        const companySize = size?.value || "medium";
        const base = companySize === "small" ? 650 : companySize === "large" ? 1900 : 1100;
        const total = base + employeeCount * 7 + (rec?.checked ? 450 : 0) + (comp?.checked ? 350 : 0);

        out.textContent = "$" + Math.round(total).toLocaleString() + " / month";
    }

    [emp, size, rec, comp].forEach(element => element?.addEventListener("input", calc));
    [size, rec, comp].forEach(element => element?.addEventListener("change", calc));

    calc();

    document.querySelectorAll(".needs-validation").forEach(form => {
        form.addEventListener("submit", event => {
            event.preventDefault();

            if (!form.checkValidity()) {
                event.stopPropagation();
            } else {
                form.querySelector(".form-success")?.classList.remove("d-none");
                form.reset();
            }

            form.classList.add("was-validated");
        });
    });
});



document.addEventListener("DOMContentLoaded", () => {
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            const header = document.querySelector("#header");

            if (header) {
                header.innerHTML = data;
            }

            initThemeToggle();
        })
        .catch(error => {
            console.error("Error loading header:", error);
        });
});

document.addEventListener("DOMContentLoaded", () => {
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            const footer = document.querySelector("#footer");

            if (footer) {
                footer.innerHTML = data;
            }
        })
        .catch(error => {
            console.error("Error loading footer:", error);
        });
});