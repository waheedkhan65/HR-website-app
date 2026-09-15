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

    const activateServiceCard = target => {
        if (!target || !target.classList.contains('service-box')) return;

        document.querySelectorAll('.service-box').forEach(box => box.classList.remove('active'));
        target.classList.remove('active');
        void target.offsetWidth;
        target.classList.add('active');
    };

    const syncServiceHighlight = () => {
        const targetId = window.location.hash;
        const matchingBox = targetId ? document.querySelector(`.service-box${targetId}`) : null;
        if (matchingBox) activateServiceCard(matchingBox);
    };

    document.querySelectorAll('.service-box').forEach(card => {
        card.addEventListener('click', () => {
            activateServiceCard(card);
        });
    });

    document.querySelectorAll('.dropdown-item[href^="#service-"]').forEach(link => {
        link.addEventListener('click', event => {
            const targetSelector = link.getAttribute('href');
            const target = document.querySelector(targetSelector);

            if (!target) return;

            event.preventDefault();

            const headerHeight = document.querySelector('.navbar')?.offsetHeight || 80;
            const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

            window.scrollTo({ top, behavior: 'smooth' });
            history.replaceState(null, '', targetSelector);
            activateServiceCard(target);
        });
    });

    window.addEventListener('hashchange', syncServiceHighlight);
    syncServiceHighlight();

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