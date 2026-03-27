
//  GLOBAL SCRIPTS (COMMON TO ALL PAGES)

document.addEventListener("DOMContentLoaded", () => {
  // ---------- NAV TOGGLE ----------
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const sendBtn = document.querySelector(".btn-icon-text");

  if (navToggle && mobileMenu && sendBtn) {
    navToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
      navToggle.classList.toggle("shifted");
      sendBtn.classList.toggle("hide");
    });
  }

  // ---------- AUDIO PLAYER ----------
  const audio = new Audio("imgs/audio/Tum Se Hi.mp3");
  let isPlaying = false;
  let isPaused = false;

  window.playSong = function (button) {
    const playIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.271 5.055A.5.5 0 0 0 5.5 5.5v5a.5.5 0 0 0 .771.424l4.5-2.5a.5.5 0 0 0 0-.848l-4.5-2.5z"/>
      </svg>`;
    const pauseIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11ZM7.55664 6C7.24982 6 7.00098 6.24884 7.00098 6.55566V15.4443C7.00098 15.7512 7.24982 16 7.55664 16H9.22266C9.52948 16 9.77832 15.7512 9.77832 15.4443V6.55566C9.77832 6.24884 9.52948 6 9.22266 6H7.55664ZM12.5566 6C12.25 6.00017 12.001 6.24894 12.001 6.55566V15.4443C12.001 15.7511 12.25 15.9998 12.5566 16H14.2236C14.5305 16 14.7793 15.7512 14.7793 15.4443V6.55566C14.7793 6.24884 14.5305 6 14.2236 6H12.5566Z" fill="black"/>
      </svg>`;

    if (!isPlaying) {
      audio.play();
      isPlaying = true;
      isPaused = false;
      button.innerHTML = pauseIcon;
    } else if (isPlaying && !isPaused) {
      audio.pause();
      isPaused = true;
      button.innerHTML = playIcon;
    } else if (isPlaying && isPaused) {
      audio.play();
      isPaused = false;
      button.innerHTML = pauseIcon;
    }

    audio.onended = () => {
      isPlaying = false;
      isPaused = false;
      button.innerHTML = playIcon;
    };
  };

  // ---------- GALLERY FILTER ----------
  const tabs = document.querySelectorAll(".nav-link");
  const items = document.querySelectorAll(".img-vid-container");

  if (tabs.length && items.length) {
    tabs.forEach(tab => {
      tab.addEventListener("click", e => {
        e.preventDefault();
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const filter = tab.getAttribute("data-filter");
        items.forEach(item => {
          if (filter === "all" || item.getAttribute("data-category") === filter) {
            item.style.display = "block";
            item.classList.add("fade-in");
          } else {
            item.style.display = "none";
            item.classList.remove("fade-in");
          }
        });
      });
    });
  }

  // ---------- ACCORDION (PROJECTS PAGE) ----------
  const tagItems = document.querySelectorAll(".tag-item");
  if (tagItems.length > 0) {
    tagItems[0].classList.add("active");
    tagItems.forEach(item => {
      const header = item.querySelector(".accordion-header");
      header.addEventListener("click", () => {
        const openItem = document.querySelector(".tag-item.active");
        if (openItem && openItem !== item) {
          openItem.classList.remove("active");
        }
        item.classList.toggle("active");
      });
    });
  }
});

//  FIREBASE FEATURES (LIKES + FEEDBACK)

// Using Firebase as module (import dynamically)
(async function () {
  if (typeof firebaseConfig === "undefined") {
    // Common Firebase config
    const firebaseConfig = {
      apiKey: "AIzaSyAOXleTa98Q9kGU45NERJTURJOnfwH1uFA",
      authDomain: "portfoliofeedback-f61e9.firebaseapp.com",
      databaseURL: "https://portfoliofeedback-f61e9-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "portfoliofeedback-f61e9",
      storageBucket: "portfoliofeedback-f61e9.firebasestorage.app",
      messagingSenderId: "1020985103627",
      appId: "1:1020985103627:web:8598feaa4dcbd84b567e0e",
      measurementId: "G-BS0M448148"
    };

    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js");
    const { getDatabase, ref, onValue, runTransaction, push, get } = await import("https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js");

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // detect if likes section exists
    const likeBtn = document.getElementById("likeBtn");
    const likeCount = document.getElementById("likeCount");

    if (likeBtn && likeCount) {
      const caseStudyName = document.body.getAttribute("data-case") || "portfolio";
      const likeRef = ref(db, `likes/${caseStudyName}`);

      const hasLiked = localStorage.getItem(`liked_${caseStudyName}`);
      if (hasLiked) {
        likeBtn.classList.add("liked");
        likeBtn.textContent = "💖 Liked";
      }

      onValue(likeRef, (snapshot) => {
        const count = snapshot.val() || 0;
        likeCount.textContent = `${count} Likes`;
      });

      likeBtn.addEventListener("click", () => {
        if (localStorage.getItem(`liked_${caseStudyName}`)) {
          alert("You already liked this!");
          return;
        }
        runTransaction(likeRef, (current) => (current || 0) + 1);
        localStorage.setItem(`liked_${caseStudyName}`, "true");
        likeBtn.classList.add("liked");
        likeBtn.textContent = "💖 Liked";
      });
    }

    // Feedback handling
    const feedbackForm = document.getElementById("feedbackForm");
    const reviewText = document.getElementById("reviewText");
    const emailInput = feedbackForm?.querySelector('input[type="email"]');
    const popup = document.getElementById("portfolioPopup") || document.getElementById("reviewPopup");
    const reviewsList = document.getElementById("reviewsList");
    const caseStudyName = document.body.getAttribute("data-case") || "portfolio";
    const feedbackRef = ref(db, `feedback/${caseStudyName}`);

    if (feedbackForm && reviewText && emailInput) {
      feedbackForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const message = reviewText.value.trim();
        if (!email || !message) return;

        try {
          const snapshot = await get(feedbackRef);
          let alreadySubmitted = false;
          snapshot.forEach((child) => {
            if (child.val().email === email) alreadySubmitted = true;
          });

          if (alreadySubmitted) {
            alert("You’ve already submitted feedback. Thank you!");
            return;
          }

          await push(feedbackRef, { email, message, date: new Date().toLocaleString() });
          feedbackForm.reset();
          if (popup) showPopup(popup);
        } catch (err) {
          console.error("Error saving feedback:", err);
        }
      });
    }

    if (reviewsList) {
      onValue(feedbackRef, (snapshot) => {
        reviewsList.innerHTML = "";
        snapshot.forEach((childSnap) => {
          const data = childSnap.val();
          const div = document.createElement("div");
          div.className = "review-item p-2 rounded-3 mb-2 bg-light";
          div.innerHTML = `
            <strong>${escapeHtml(data.email || "Anonymous")}</strong>
            <p class="mb-1">${escapeHtml(data.message)}</p>
            <small class="text-muted">${escapeHtml(data.date)}</small>`;
          reviewsList.prepend(div);
        });
      });
    }

    function showPopup(popup) {
      popup.style.display = "block";
      popup.style.opacity = "1";
      setTimeout(() => {
        popup.style.opacity = "0";
        setTimeout(() => (popup.style.display = "none"), 500);
      }, 2000);
    }

    function escapeHtml(str) {
      return String(str || "").replace(/[&<>"']/g, (s) => {
        const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
        return map[s];
      });
    }
  }
})();