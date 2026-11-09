const karakter = document.querySelector(".wanitadiam");
const dunia = document.querySelector("#dunia");
const jendela = document.querySelector("#jendelageme");

// POSISI KARAKTER
let posisiX = 1000;
let posisiY = 1000;

// INPUT DRAG
let sentuhX = 0;
let sentuhY = 0;

let sedangGeser = false;

// ARAH GERAK
let arahX = 0;
let arahY = 0;

// KECEPATAN KARAKTER
let kecepatan = 100;

// ARAH HADAP
let arahHadap = "kanan";

// WAKTU ANIMASI
let waktuSebelumnya = 0;


// =================================
// KAMERA FOLLOW
// =================================

function kameraFollow() {

    let tengahX = jendela.clientWidth / 2;
    let tengahY = jendela.clientHeight / 2;

    let kameraX = tengahX - posisiX;
    let kameraY = tengahY - posisiY;

    dunia.style.transform =
        `translate(${kameraX}px, ${kameraY}px)`;
}


// =================================
// POSISI AWAL
// =================================

karakter.style.left = posisiX + "px";
karakter.style.top = posisiY + "px";

kameraFollow();


// =================================
// MULAI SENTUH
// =================================

jendela.addEventListener("pointerdown", function(e) {

    sedangGeser = true;

    sentuhX = e.clientX;
    sentuhY = e.clientY;

    arahX = 0;
    arahY = 0;

    waktuSebelumnya = performance.now();

    jendela.setPointerCapture(e.pointerId);

});


// =================================
// MENENTUKAN ARAH GERAK
// =================================

jendela.addEventListener("pointermove", function(e) {

    if (!sedangGeser) return;

    let gerakX = e.clientX - sentuhX;
    let gerakY = e.clientY - sentuhY;

    // SIMPAN ARAH GERAK TERAKHIR

    arahX = gerakX;
    arahY = gerakY;

    // ARAH HADAP KARAKTER

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

    // UPDATE POSISI SENTUH

    sentuhX = e.clientX;
    sentuhY = e.clientY;

});


// =================================
// MESIN GERAK KARAKTER
// =================================

function gerakkanKarakter(waktu) {

    if (!waktuSebelumnya) {
        waktuSebelumnya = waktu;
    }

    let deltaTime = (waktu - waktuSebelumnya) / 1000;

    waktuSebelumnya = waktu;

    if (sedangGeser) {

        // NORMALISASI ARAH
        let panjang = Math.sqrt(
            arahX * arahX + arahY * arahY
        );

        if (panjang > 0) {

            let normalX = arahX / panjang;
            let normalY = arahY / panjang;

            posisiX += normalX * kecepatan * deltaTime;
            posisiY += normalY * kecepatan * deltaTime;

        }

        // UPDATE POSISI KARAKTER

        karakter.style.left = posisiX + "px";
        karakter.style.top = posisiY + "px";

        // KAMERA MENGIKUTI

        kameraFollow();

    }

    requestAnimationFrame(gerakkanKarakter);

}

requestAnimationFrame(gerakkanKarakter);


// =================================
// BERHENTI SENTUH
// =================================

jendela.addEventListener("pointerup", function() {

    sedangGeser = false;

    arahX = 0;
    arahY = 0;

});

jendela.addEventListener("pointercancel", function() {

    sedangGeser = false;

    arahX = 0;
    arahY = 0;

});


// =================================
// RESIZE LAYAR
// =================================

window.addEventListener("resize", function() {

    kameraFollow();

});