
emailjs.init("za-xJ3i5KCurCudL4");

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const params = {
    from_name: document.getElementById("name").value,
    reply_to: document.getElementById("email").value,
    message: document.getElementById("message").value
  };

  emailjs.send("service_e8ck3ei", "template_8pudm4d", params)
    .then(() => {
      document.getElementById("status").textContent = "Message sent successfully!";
    })
    .catch(() => {
      document.getElementById("status").textContent = "Failed to send message.";
    });
});
