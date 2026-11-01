// Dijalankan di <head> sebelum halaman digambar agar tidak ada kilatan tema yang salah.
// File eksternal (bukan inline) supaya tetap kompatibel dengan CSP script-src 'self'.
// Kunci dan aturannya harus sama dengan src/hooks/use-theme.ts.
(function () {
  var theme = null
  try {
    theme = localStorage.getItem("optik-raihan-theme")
  } catch (error) {
    // Penyimpanan diblokir: ikuti preferensi sistem.
  }
  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }
  document.documentElement.classList.toggle("dark", theme === "dark")
})()
