/* ==============================
   DOM ELEMENTS & INITIALIZATION
============================== */
document.addEventListener("DOMContentLoaded", function () {
  
  /* ==============================
     DROPDOWN MENU FUNCTIONALITY
  ============================== */
  const dropdownToggle = document.querySelector("#menuDropdown");
  const overlay = document.getElementById("dropdownOverlay");

  if (dropdownToggle && overlay) {
    dropdownToggle.addEventListener("shown.bs.dropdown", function () {
      overlay.classList.add("active");
    });

    dropdownToggle.addEventListener("hidden.bs.dropdown", function () {
      overlay.classList.remove("active");
    });

    overlay.addEventListener("click", function () {
      const dropdown = bootstrap.Dropdown.getInstance(dropdownToggle);
      if (dropdown) {
        dropdown.hide();
      }
      overlay.classList.remove("active");
    });
  }

  /* ==============================
     SCROLL TO SECTION FROM HOME LINK
  ============================== */
  if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }

  /* ==============================
     UTILITY FUNCTIONS
  ============================== */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function enhanceLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.classList.add("loading");
      img.addEventListener("load", function () {
        this.classList.remove("loading");
        this.classList.add("loaded");
      });
      img.addEventListener("error", function () {
        this.classList.remove("loading");
      });
    });
  }
  enhanceLazyLoading();

  /* ==============================
     VALIDATION MODULE
  ============================== */
  const Validator = {
    validateName(name) {
      if (!name || name.trim() === "") {
        return { isValid: false, message: "Name is required" };
      }
      if (name.trim().length < 3) {
        return { isValid: false, message: "Name must be at least 3 characters" };
      }
      if (/\d/.test(name)) {
        return { isValid: false, message: "Name cannot contain numbers" };
      }
      return { isValid: true, message: "" };
    },

    validateAge(age) {
      if (!age && age !== 0) {
        return { isValid: false, message: "Age is required" };
      }
      const ageNum = Number(age);
      if (isNaN(ageNum)) {
        return { isValid: false, message: "Age must be a number" };
      }
      if (ageNum < 10 || ageNum > 80) {
        return { isValid: false, message: "Age must be between 10 and 80" };
      }
      return { isValid: true, message: "" };
    },

    validateMobile(mobile) {
      if (!mobile || mobile.trim() === "") {
        return { isValid: false, message: "Mobile number is required" };
      }
      const mobileStr = mobile.trim();
      if (!/^\d+$/.test(mobileStr)) {
        return { isValid: false, message: "Mobile number must contain only digits" };
      }
      if (mobileStr.length !== 11) {
        return { isValid: false, message: "Mobile number must be exactly 11 digits" };
      }
      return { isValid: true, message: "" };
    },
  };

  /* ==============================
     SUBSCRIPTION FORM HANDLER
  ============================== */
  if (window.location.pathname.includes("subscription-form")) {
    
    const nameInput = document.getElementById("fullName");
    const ageInput = document.getElementById("age");
    const mobileInput = document.getElementById("mobile");
    const occupationInput = document.getElementById("occupation");
    const injuriesInput = document.getElementById("injuries");
    const trainedBeforeInput = document.getElementById("trainedBefore");
    const notesInput = document.getElementById("notes");

    const nameError = document.getElementById("nameError");
    const ageError = document.getElementById("ageError");
    const mobileError = document.getElementById("mobileError");

    const submitBtn = document.getElementById("submitBtn");
    const sessionsBox = document.getElementById("sessionsBox");
    const finalPrice = document.getElementById("finalPrice");

    if (!nameInput || !ageInput || !mobileInput || !submitBtn) {
      console.error("Required form elements not found");
      return;
    }

    if (submitBtn) submitBtn.style.display = "none";
    if (finalPrice) finalPrice.style.display = "none";

    let selectedPlan = "";
    let selectedSessions = "";
    let calculatedPrice = 0;

    function calculatePrice(plan, sessions) {
      const priceMap = {
        monthly: { 3: 450, Everyday: 550 },
        "3 month": { 3: 1000, Everyday: 1500 },
        "6 month": { 3: 2000, Everyday: 2500 },
        yearly: { 3: 3000, Everyday: 3500 },
      };
      return priceMap[plan]?.[sessions] || 0;
    }

    function updatePriceAndButton() {
      if (selectedPlan && selectedSessions) {
        calculatedPrice = calculatePrice(selectedPlan, selectedSessions);
        if (finalPrice) {
          finalPrice.innerHTML = "Final Price: " + calculatedPrice + " EGP 🔥";
          finalPrice.style.display = "block";
        }
        if (submitBtn) submitBtn.style.display = "inline-block";
      }
    }

    document.addEventListener("change", function (e) {
      if (e.target.name === "plan") {
        if (sessionsBox) sessionsBox.style.display = "block";
        selectedPlan = e.target.value;
        document.querySelectorAll('input[name="sessions"]').forEach((sess) => {
          sess.checked = false;
        });
        selectedSessions = "";
        if (finalPrice) finalPrice.style.display = "none";
        if (submitBtn) submitBtn.style.display = "none";
      } else if (e.target.name === "sessions") {
        selectedSessions = e.target.value;
        updatePriceAndButton();
      }
    });

    function clearFieldError(input, errorElement) {
      if (input) input.classList.remove("is-invalid");
      if (errorElement) errorElement.textContent = "";
    }

    function showFieldError(input, errorElement, message) {
      if (input) {
        input.classList.add("is-invalid");
        input.setAttribute("aria-invalid", "true");
      }
      if (errorElement) errorElement.textContent = message;
    }

    function validateRequiredFields() {
      const results = {
        name: Validator.validateName(nameInput?.value || ""),
        age: Validator.validateAge(ageInput?.value || ""),
        mobile: Validator.validateMobile(mobileInput?.value || ""),
      };

      clearFieldError(nameInput, nameError);
      clearFieldError(ageInput, ageError);
      clearFieldError(mobileInput, mobileError);

      let isValid = true;
      let firstInvalidField = null;

      if (!results.name.isValid) {
        showFieldError(nameInput, nameError, results.name.message);
        isValid = false;
        firstInvalidField = firstInvalidField || nameInput;
      }

      if (!results.age.isValid) {
        showFieldError(ageInput, ageError, results.age.message);
        isValid = false;
        firstInvalidField = firstInvalidField || ageInput;
      }

      if (!results.mobile.isValid) {
        showFieldError(mobileInput, mobileError, results.mobile.message);
        isValid = false;
        firstInvalidField = firstInvalidField || mobileInput;
      }

      return { isValid, firstInvalidField };
    }

    function smoothScrollToElement(element) {
      if (!element) return;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 100;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setTimeout(() => {
        element.focus({ preventScroll: true });
      }, 500);
    }

    if (nameInput) {
      const debouncedClear = debounce(() => {
        clearFieldError(nameInput, nameError);
        nameInput.removeAttribute("aria-invalid");
      }, 300);
      nameInput.addEventListener("input", debouncedClear);
    }

    if (ageInput) {
      const debouncedClear = debounce(() => {
        clearFieldError(ageInput, ageError);
        ageInput.removeAttribute("aria-invalid");
      }, 300);
      ageInput.addEventListener("input", debouncedClear);
    }

    if (mobileInput) {
      const debouncedClear = debounce(() => {
        clearFieldError(mobileInput, mobileError);
        mobileInput.removeAttribute("aria-invalid");
      }, 300);
      mobileInput.addEventListener("input", debouncedClear);
    }

    function clearForm() {
      if (nameInput) {
        nameInput.value = "";
        nameInput.classList.remove("is-valid", "is-invalid");
      }
      if (ageInput) {
        ageInput.value = "";
        ageInput.classList.remove("is-valid", "is-invalid");
      }
      if (mobileInput) {
        mobileInput.value = "";
        mobileInput.classList.remove("is-valid", "is-invalid");
      }
      if (occupationInput) {
        occupationInput.value = "";
        occupationInput.classList.remove("is-valid", "is-invalid");
      }
      if (injuriesInput) {
        injuriesInput.value = "";
        injuriesInput.classList.remove("is-valid", "is-invalid");
      }
      if (trainedBeforeInput) {
        trainedBeforeInput.value = "";
        trainedBeforeInput.classList.remove("is-valid", "is-invalid");
      }
      if (notesInput) {
        notesInput.value = "";
        notesInput.classList.remove("is-valid", "is-invalid");
      }

      if (nameError) nameError.textContent = "";
      if (ageError) ageError.textContent = "";
      if (mobileError) mobileError.textContent = "";

      document.querySelectorAll('input[name="plan"]').forEach((radio) => {
        radio.checked = false;
      });
      document.querySelectorAll('input[name="sessions"]').forEach((radio) => {
        radio.checked = false;
      });

      if (sessionsBox) sessionsBox.style.display = "none";
      if (finalPrice) {
        finalPrice.style.display = "none";
        finalPrice.innerHTML = "";
      }

      selectedPlan = "";
      selectedSessions = "";
      calculatedPrice = 0;

      if (submitBtn) submitBtn.style.display = "none";
    }

    if (submitBtn) {
      submitBtn.addEventListener("click", function (e) {
        e.preventDefault();

        if (!selectedPlan || !selectedSessions) {
          alert("Please select both a plan and number of sessions");
          const planSection = document.querySelector(".section:first-child");
          if (planSection) smoothScrollToElement(planSection);
          return;
        }

        const { isValid, firstInvalidField } = validateRequiredFields();

        if (!isValid && firstInvalidField) {
          smoothScrollToElement(firstInvalidField);
          this.classList.add("btn-shake");
          setTimeout(() => {
            this.classList.remove("btn-shake");
          }, 300);
          return;
        }

        const formData = {
          fullName: nameInput?.value?.trim() || "",
          age: ageInput?.value?.trim() || "",
          mobile: mobileInput?.value?.trim() || "",
          occupation: occupationInput?.value?.trim() || "",
          injuries: injuriesInput?.value?.trim() || "",
          trainedBefore: trainedBeforeInput?.value?.trim() || "",
          notes: notesInput?.value?.trim() || "",
          plan: selectedPlan,
          sessions: selectedSessions,
          price: calculatedPrice,
          timestamp: new Date().toISOString(),
        };

        try {
          localStorage.setItem("subscriptionData", JSON.stringify(formData));
          const storedData = localStorage.getItem("subscriptionData");
          if (!storedData) {
            throw new Error("Failed to store data");
          }
          clearForm();
          alert("✅ Your subscription has been submitted successfully! Redirecting to transfer page...");
          window.location.href = "transfer.html";
        } catch (error) {
          console.error("Error saving data:", error);
          alert("There was an error processing your request. Please try again.");
        }
      });
    }
  }

  /* ==============================
     TRANSFER PAGE HANDLER
  ============================== */
  if (window.location.pathname.includes("transfer")) {
    
    function clearSubscriptionData() {
      const subscriptionData = localStorage.getItem("subscriptionData");
      if (subscriptionData) {
        localStorage.removeItem("subscriptionData");
        console.log("✅ Subscription data cleared from localStorage");
      }
    }

    window.addEventListener("beforeunload", function () {
      clearSubscriptionData();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        clearSubscriptionData();
      }
    });

    document.addEventListener("click", function (e) {
      const link = e.target.closest("a");
      if (link) {
        const href = link.getAttribute("href");
        if (href && href !== "#" && !href.startsWith("#")) {
          clearSubscriptionData();
        }
      }
    });

    window.addEventListener("popstate", function () {
      clearSubscriptionData();
    });

    function formatPlanName(plan) {
      const plans = {
        monthly: "Monthly",
        "3 month": "3 Months",
        "6 month": "6 Months",
        yearly: "Yearly",
      };
      return plans[plan] || plan || "Not specified";
    }

    function displayTransferData() {
      const storedData = localStorage.getItem("subscriptionData");

      if (!storedData) {
        const container = document.querySelector(".transfer-container");
        if (container) {
          container.innerHTML = `
            <div class="transfer-card" style="text-align: center; padding: 40px;">
              <h2 style="color: #fecf2a; margin-bottom: 20px;">❌ No Data Found</h2>
              <p style="color: white; margin-bottom: 30px;">Please complete the subscription form first.</p>
              <a href="subscription-form.html" style="display: inline-block; padding: 12px 30px; background: #fecf2a; color: black; text-decoration: none; border-radius: 30px; font-weight: bold;">← Go to Form</a>
            </div>
          `;
        }
        return null;
      }

      try {
        const data = JSON.parse(storedData);

        const elements = {
          name: document.getElementById("displayName"),
          mobile: document.getElementById("displayMobile"),
          plan: document.getElementById("displayPlan"),
          sessions: document.getElementById("displaySessions"),
          price: document.getElementById("displayPrice"),
          date: document.getElementById("displayDate"),
          expiry: document.getElementById("displayExpiry"),
          vodafone: document.getElementById("vodafoneNumber"),
        };

        if (elements.name) elements.name.textContent = data.fullName || "Not provided";
        if (elements.mobile) elements.mobile.textContent = data.mobile || "Not provided";
        if (elements.plan) elements.plan.textContent = formatPlanName(data.plan);
        if (elements.sessions) elements.sessions.textContent = data.sessions || "Not selected";
        if (elements.price) elements.price.textContent = (data.price || 0) + " EGP";
        if (elements.vodafone) elements.vodafone.textContent = "01018148829";

        const today = new Date();
        if (elements.date) {
          elements.date.textContent = today.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }

        const expiryDate = new Date(today);
        expiryDate.setHours(expiryDate.getHours() + 24);
        if (elements.expiry) {
          elements.expiry.textContent = expiryDate.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        return data;
      } catch (error) {
        console.error("Error parsing transfer data:", error);
        return null;
      }
    }

    const data = displayTransferData();
    if (!data) return;

    const whatsappBtn = document.getElementById("whatsappBtn");
    if (whatsappBtn) {
      whatsappBtn.addEventListener("click", async function () {
        const data = JSON.parse(localStorage.getItem("subscriptionData"));
        if (!data) {
          alert("No data found");
          return;
        }

        const planText = formatPlanName(data.plan);
        const today = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const message = `*🏋️ UNLIMITED GYM - NEW MEMBERSHIP*

━━━━━━━━━━━━━━━━━━━
📋 *MEMBER DETAILS*
━━━━━━━━━━━━━━━━━━━
*Full Name:* ${data.fullName || "Not provided"}
*Age:* ${data.age || "Not provided"}
*Phone:* ${data.mobile || "Not provided"}
*Occupation:* ${data.occupation || "Not provided"}

━━━━━━━━━━━━━━━━━━━
💪 *MEMBERSHIP INFO*
━━━━━━━━━━━━━━━━━━━
*Plan:* ${planText}
*Sessions/Week:* ${data.sessions || "Not selected"}
*Total Amount:* ${data.price || 0} EGP
*Request Date:* ${today}

━━━━━━━━━━━━━━━━━━━
❤️ *HEALTH INFO*
━━━━━━━━━━━━━━━━━━━
*Injuries/Conditions:* ${data.injuries || "None"}
*Previous Training:* ${data.trainedBefore || "Not specified"}

━━━━━━━━━━━━━━━━━━━
📝 *ADDITIONAL NOTES*
━━━━━━━━━━━━━━━━━━━
${data.notes || "No additional notes"}

━━━━━━━━━━━━━━━━━━━
💳 *PAYMENT METHOD*
━━━━━━━━━━━━━━━━━━━
*Vodafone Cash:* 01018148829

━━━━━━━━━━━━━━━━━━━
✅ *INSTRUCTIONS*
━━━━━━━━━━━━━━━━━━━
1️⃣ Send screenshot of the transfer
2️⃣ Send screenshot of this page with your data
━━━━━━━━━━━━━━━━━━━

_Unlimited Gym - Alexandria_
📍 11 Cafr sakr set campsezar
📞 03 5913737`;

        const whatsappUrl = `https://wa.me/201128200366?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
      });
    }

    const downloadBtn = document.getElementById("downloadBtn");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", async function () {
        try {
          if (typeof html2canvas === "undefined") {
            await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
          }

          const element = document.querySelector(".transfer-card");
          if (!element) return;

          const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: "#000000",
            allowTaint: false,
            useCORS: true,
            logging: false,
          });

          const link = document.createElement("a");
          link.download = `UnlimitedGym_${new Date().toISOString().slice(0, 10)}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        } catch (error) {
          console.error("Error taking screenshot:", error);
          alert("Error taking screenshot. Please try again.");
        }
      });
    }
  }

  /* ==============================
     HEADER SCROLL BEHAVIOR
  ============================== */
  let lastscroll = 0;
  const header = document.querySelector(".site-header");

  if (header) {
    const throttledScroll = throttle(function () {
      let currentscroll = window.scrollY;
      if (currentscroll > lastscroll && currentscroll > 100) {
        header.style.top = `-${header.offsetHeight}px`;
      } else {
        header.style.top = "0";
      }
      lastscroll = currentscroll;
    }, 100);
    window.addEventListener("scroll", throttledScroll);
  }

  /* ==============================
     PAGE LOAD PERFORMANCE
  ============================== */
  window.addEventListener("load", function () {
    document.body.classList.add("page-loaded");
  });
/* ==============================
   FIX FOR GITHUB PAGES NAVIGATION
============================== */
// منع السلوك الافتراضي للروابط التي تبدأ بـ index.html#
document.querySelectorAll('a[href^="index.html#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const hash = this.getAttribute('href').replace('index.html', '');
    window.location.href = hash;
  });
});

// معالجة التمرير عند تحميل الصفحة بهاش
function handleHashOnLoad() {
  if (window.location.hash) {
    setTimeout(() => {
      const element = document.querySelector(window.location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  }
}

// شغلها عند تحميل الصفحة
window.addEventListener('load', handleHashOnLoad);

// لو المستخدم دخل رابط بهاش بعد تحميل الصفحة
window.addEventListener('hashchange', function() {
  if (window.location.hash) {
    setTimeout(() => {
      const element = document.querySelector(window.location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
});

// معالجة الروابط في القائمة المنسدلة
document.querySelectorAll('.dropdown-item').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href.includes('index.html#')) {
      e.preventDefault();
      const hash = href.replace('index.html', '');
      window.location.href = hash;
    }
  });
});

// معالجة اللوجو
const logoLink = document.querySelector('.logo-container a');
if (logoLink) {
  logoLink.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'index.html';
  });
}
});
/* ==============================
   FIX FOR LIVE SERVER - SCROLL TO SECTION
============================== */
// لو في hash في الرابط، روح للقسم ده
if (window.location.hash) {
  setTimeout(() => {
    const element = document.querySelector(window.location.hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, 300);
}
/* ==============================
   FIX FOR GITHUB PAGES - NAVIGATION FUNCTIONS
============================== */
window.navigateToSection = function(sectionId) {
  // لو احنا مش في الصفحة الرئيسية
  if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
    window.location.href = 'index.html#' + sectionId;
    return;
  }
  
  // لو احنا في الصفحة الرئيسية، نعمل scroll للقسم
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    // نحدث الـ URL بدون إعادة تحميل
    history.pushState(null, null, '#' + sectionId);
  }
};

// التعامل مع الـ hash عند تحميل الصفحة
function handleInitialHash() {
  if (window.location.hash) {
    const sectionId = window.location.hash.substring(1); // شيل الـ #
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  }
}

// شغلها عند تحميل الصفحة
window.addEventListener('load', handleInitialHash);
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-HPHG3W3XD9"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-HPHG3W3XD9');
</script>
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "w2fnvxst5d");
</script>