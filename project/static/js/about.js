// Animate features on scroll
document.addEventListener("DOMContentLoaded", () => {
  const features = document.querySelectorAll(".col-3");

  // Simple animation when features come into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  // Update cart count from localStorage if available
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    const count = localStorage.getItem("cartCount") || "0";
    cartCount.textContent = count;
  }
});
