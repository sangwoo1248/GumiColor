document.getElementById("nextBtn").addEventListener("click", function () {
    const phone = document.getElementById("phone").value.trim();
    const phonePattern = /^010-\d{4}-\d{4}$/;
    const errorMsg = document.getElementById("error-msg");
  
    if (!phonePattern.test(phone)) {
      errorMsg.textContent = "연락처 형식이 올바르지 않습니다. 예: 010-1234-5678";
      return;
    }
  
    errorMsg.textContent = "";
    window.location.href = "gumi.html";
  });