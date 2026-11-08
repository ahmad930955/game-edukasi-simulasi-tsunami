const karakter = document.querySelector(".wanitadiam");

let posisiX = karakter.offsetLeft;
let posisiY = karakter.offsetTop;

let sentuhX = 0;
let sentuhY = 0;
let sedangGeser = false;

let waktuSebelumnya = 0;

// Kecepatan gerakan dalam pixel per detik
let kecepatan = 30;

// Arah hadap awal
let arahHadap = "kanan";

document.addEventListener("pointerdown", function(e) {
    sedangGeser = true;

    sentuhX = e.clientX;
    sentuhY = e.clientY;
    waktuSebelumnya = performance.now();
});

document.addEventListener("pointermove", function(e) {
    if (!sedangGeser) return;

    let sekarang = performance.now();
    let deltaTime = (sekarang - waktuSebelumnya) / 1000;

    let gerakX = e.clientX - sentuhX;
    let gerakY = e.clientY - sentuhY;

    // Batasi kecepatan gerakan
    let batasGerak = kecepatan * deltaTime;

    gerakX = Math.max(-batasGerak, Math.min(batasGerak, gerakX));
    gerakY = Math.max(-batasGerak, Math.min(batasGerak, gerakY));

    // Mengatur arah hadap karakter
    if (gerakX < 0) {
        arahHadap = "kiri";
    } else if (gerakX > 0) {
        arahHadap = "kanan";
    }

    if (arahHadap === "kiri") {
        karakter.classList.add("menghadap-kiri");
    } else {
        karakter.classList.remove("menghadap-kiri");
    }

    // Menggerakkan karakter
    posisiX += gerakX;
    posisiY += gerakY;

    karakter.style.left = posisiX + "px";
    karakter.style.top = posisiY + "px";

    sentuhX = e.clientX;
    sentuhY = e.clientY;

    waktuSebelumnya = sekarang;
});

document.addEventListener("pointerup", function() {
    sedangGeser = false;
});

document.addEventListener("pointercancel", function() {
    sedangGeser = false;
});