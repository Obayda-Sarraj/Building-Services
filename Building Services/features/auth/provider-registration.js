// كل منطق الويزارد بدون فايربيس
document.addEventListener("DOMContentLoaded", () => {
    const stepsCount = 6;
    let currentStep = 1;

    const stepElements = document.querySelectorAll(".wizard-step");
    const progressInner = document.getElementById("wizard-progress-bar-inner");
    const progressPercentLabel = document.getElementById("wizard-progress-percent");
    const stepLabel = document.getElementById("wizard-step-label");
    const currentStepText = document.getElementById("wizard-current-step-text");
    const nextStepText = document.getElementById("wizard-next-step-text");
    const btnPrev = document.getElementById("btn-prev-step");
    const btnNext = document.getElementById("btn-next-step");
    const wizardWrapper = document.querySelector(".wizard-wrapper");

    const stepTitles = [
        "Provider type",
        "Basic information",
        "Your services",
        "Weekly availability",
        "Additional information",
        "Review & submit"
    ];

    function scrollToWizardTop() {
        if (!wizardWrapper) return;
        const offset = wizardWrapper.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: offset, behavior: "smooth" });
    }

    function updateWizardUI() {
        stepElements.forEach(step => {
            step.classList.toggle("active", Number(step.dataset.step) === currentStep);
        });

        const percent = Math.round(((currentStep - 1) / (stepsCount - 1)) * 100);
        progressInner.style.width = percent + "%";
        progressPercentLabel.textContent = percent + "%";
        stepLabel.textContent = `Step ${currentStep} of ${stepsCount}`;
        currentStepText.textContent = stepTitles[currentStep - 1] || "";

        if (currentStep < stepsCount) {
            nextStepText.textContent = "Next: " + stepTitles[currentStep];
            btnNext.innerHTML = 'Next <i class="fas fa-arrow-right ms-1"></i>';
        } else {
            nextStepText.textContent = "";
            btnNext.innerHTML = 'Finish <i class="fas fa-check ms-1"></i>';
        }

        btnPrev.disabled = currentStep === 1;

        scrollToWizardTop();
    }

    btnPrev.addEventListener("click", () => {
        if (currentStep > 1) {
            currentStep--;
            updateWizardUI();
        }
    });

    btnNext.addEventListener("click", () => {
        if (currentStep < stepsCount) {
            if (currentStep === stepsCount - 1) {
                buildSummary();
            }
            currentStep++;
            updateWizardUI();
        }
    });

    // ===== STEP 1 – provider type =====
    const providerTypeCards = document.querySelectorAll(".provider-type-card");
    const providerTypeInput = document.getElementById("provider-type");

    providerTypeCards.forEach(card => {
        card.addEventListener("click", () => {
            providerTypeCards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            providerTypeInput.value = card.dataset.type;
        });
    });

    // ===== STEP 2 – service areas chips =====
    const chipWrapper = document.getElementById("service-areas-wrapper");
    const chipInput = document.getElementById("service-areas-input");
    const serviceAreasHidden = document.getElementById("service-areas");
    let serviceAreas = [];

    function renderChips() {
        Array.from(chipWrapper.querySelectorAll(".chip")).forEach(el => el.remove());
        serviceAreas.forEach((area, index) => {
            const chip = document.createElement("span");
            chip.className = "chip";
            chip.innerHTML = `<span>${area}</span><button type="button" data-index="${index}">&times;</button>`;
            chipWrapper.insertBefore(chip, chipInput);
        });
        serviceAreasHidden.value = JSON.stringify(serviceAreas);
    }

    chipWrapper.addEventListener("click", () => chipInput.focus());

    chipInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && chipInput.value.trim()) {
            e.preventDefault();
            serviceAreas.push(chipInput.value.trim());
            chipInput.value = "";
            renderChips();
        } else if (e.key === "Backspace" && !chipInput.value && serviceAreas.length) {
            serviceAreas.pop();
            renderChips();
        }
    });

    chipWrapper.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            const idx = Number(e.target.dataset.index);
            serviceAreas.splice(idx, 1);
            renderChips();
        }
    });

    // ===== STEP 3 – services handling =====
    const services = [];
    const servicesListEl = document.getElementById("services-list");
    const servicesJsonInput = document.getElementById("services-json");
    const primaryServiceSelect = document.getElementById("primary-service-select");
    const serviceTypeHidden = document.getElementById("service-type");

    const addServicePanel = document.getElementById("add-service-panel");
    const btnOpenAddService = document.getElementById("btn-open-add-service");
    const btnCloseAddService = document.getElementById("btn-close-add-service");
    const btnCancelService = document.getElementById("btn-cancel-service");
    const btnSaveService = document.getElementById("btn-save-service");

    function openAddServicePanel() {
        addServicePanel.classList.remove("d-none");
        scrollToWizardTop();
    }
    function closeAddServicePanel() {
        addServicePanel.classList.add("d-none");
        document.getElementById("service-title-input").value = "";
        document.getElementById("service-category-input").value = "";
        document.getElementById("service-description-input").value = "";
        document.getElementById("service-pricing-type-input").value = "fixed";
        document.getElementById("service-price-input").value = "";
        document.getElementById("service-duration-input").value = "";
    }

    btnOpenAddService.addEventListener("click", openAddServicePanel);
    btnCloseAddService.addEventListener("click", closeAddServicePanel);
    btnCancelService.addEventListener("click", closeAddServicePanel);

    btnSaveService.addEventListener("click", () => {
        const title = document.getElementById("service-title-input").value.trim();
        const category = document.getElementById("service-category-input").value.trim();
        const description = document.getElementById("service-description-input").value.trim();
        const pricingType = document.getElementById("service-pricing-type-input").value;
        const price = document.getElementById("service-price-input").value;
        const duration = document.getElementById("service-duration-input").value;

        if (!title) {
            alert("Please enter a service title");
            return;
        }

        services.push({ title, category, description, pricingType, price, duration });
        servicesJsonInput.value = JSON.stringify(services);
        renderServices();
        closeAddServicePanel();
    });

    function renderServices() {
        servicesListEl.innerHTML = "";
        services.forEach((service, index) => {
            const card = document.createElement("div");
            card.className = "service-card";
            card.innerHTML = `
                <div>
                    <div class="service-card-title">${service.title}</div>
                    <div class="service-card-meta">
                        ${service.category || "General"} · ${service.pricingType}${service.price ? " · $" + service.price : ""}${service.duration ? " · " + service.duration + "h" : ""}
                    </div>
                    <div class="small text-muted mt-1">${service.description || ""}</div>
                </div>
                <div class="service-card-actions">
                    <button type="button" class="btn btn-light btn-sm" data-edit="${index}">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm" data-delete="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            servicesListEl.appendChild(card);
        });
    }

    servicesListEl.addEventListener("click", (e) => {
        if (e.target.closest("button[data-delete]")) {
            const idx = Number(e.target.closest("button").dataset.delete);
            services.splice(idx, 1);
            servicesJsonInput.value = JSON.stringify(services);
            renderServices();
        }
        // editing ممكن نضيفه لاحقاً لو حبيت
    });

    primaryServiceSelect.addEventListener("change", () => {
        serviceTypeHidden.value = primaryServiceSelect.value;
    });

    // ===== STEP 4 – availability grid =====
    const availabilityTableBody = document.querySelector("#availability-table tbody");
    const availabilityJsonInput = document.getElementById("availability-json");
    const dayOffToggle = document.getElementById("day-off-toggle");
    const availabilityData = {};

    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    const hours = [
        "08:00","09:00","10:00","11:00","12:00",
        "13:00","14:00","15:00","16:00","17:00","18:00"
    ];

    function buildAvailabilityTable() {
        hours.forEach(hour => {
            const tr = document.createElement("tr");
            const timeTd = document.createElement("td");
            timeTd.textContent = hour;
            tr.appendChild(timeTd);

            days.forEach(day => {
                const td = document.createElement("td");
                td.className = "availability-cell";
                td.dataset.day = day;
                td.dataset.time = hour;
                td.addEventListener("click", () => toggleAvailabilityCell(td));
                tr.appendChild(td);
            });

            availabilityTableBody.appendChild(tr);
        });
    }

    function toggleAvailabilityCell(td) {
        const day = td.dataset.day;
        const time = td.dataset.time;
        td.classList.toggle("selected");

        if (!availabilityData[day]) availabilityData[day] = [];
        const idx = availabilityData[day].indexOf(time);
        if (td.classList.contains("selected")) {
            if (idx === -1) availabilityData[day].push(time);
        } else {
            if (idx !== -1) availabilityData[day].splice(idx, 1);
        }
        availabilityJsonInput.value = JSON.stringify(availabilityData);
    }

    dayOffToggle.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-day]");
        if (!btn) return;
        const day = btn.dataset.day;
        btn.classList.toggle("active");

        if (btn.classList.contains("active")) {
            availabilityData[day] = "off";
        } else {
            if (availabilityData[day] === "off") {
                delete availabilityData[day];
            }
        }
        availabilityJsonInput.value = JSON.stringify(availabilityData);
    });

    buildAvailabilityTable();

    // ===== STEP 6 – summary =====
    function buildSummary() {
        const providerType = providerTypeInput.value === "company" ? "Company / Organization" : "Individual provider";
        const firstName = document.getElementById("first-name").value.trim();
        const lastName = document.getElementById("last-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("user-address").value.trim();
        const experienceYears = document.getElementById("experience-years").value || "0";
        const insurance = document.getElementById("insurance-info").value.trim();
        const cancellation = document.getElementById("cancellation-policy").value.trim();
        const guarantee = document.getElementById("service-guarantee").value.trim();

        document.getElementById("summary-provider-type").textContent = providerType;
        document.getElementById("summary-name").textContent = `${firstName} ${lastName}`.trim();
        document.getElementById("summary-email").textContent = email;
        document.getElementById("summary-phone").textContent = phone;
        document.getElementById("summary-address").textContent = address;
        document.getElementById("summary-areas").textContent = serviceAreas.length ? serviceAreas.join(", ") : "—";
        document.getElementById("summary-experience").textContent = experienceYears + " years";

        document.getElementById("summary-insurance").textContent = insurance || "—";
        document.getElementById("summary-cancellation").textContent = cancellation || "—";
        document.getElementById("summary-guarantee").textContent = guarantee || "—";

        const summaryServicesEl = document.getElementById("summary-services");
        if (!services.length) {
            summaryServicesEl.textContent = "No services added yet.";
        } else {
            summaryServicesEl.innerHTML = services.map(s => {
                const meta = [
                    s.category || "General",
                    s.pricingType || "",
                    s.price ? "$" + s.price : "",
                    s.duration ? s.duration + "h" : ""
                ].filter(Boolean).join(" · ");
                return `<div>• <strong>${s.title}</strong> – <span class="text-muted">${meta}</span></div>`;
            }).join("");
        }
    }

    // init
    updateWizardUI();
});
