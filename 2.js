
const karakter = document.querySelector(".wanitadiam");
const dunia = document.querySelector("#dunia");
const jendela = document.querySelector("#jendelageme");
const areaGame = document.querySelector("#areaGame");


// =================================
// UKURAN GAME
// =================================

const lebarGame = 390;
const tinggiGame = 844;

let skalaGame = 1;


// =================================
// POSISI KARAKTER
// =================================

let posisiX = 1000;
let posisiY = 1000;


// =================================
// INPUT GERAK
// =================================

let sentuhX = 0;
let sentuhY = 0;

let sedangGeser = false;

let arahX = 0;
let arahY = 0;


// =================================
// KECEPATAN
// =================================

let kecepatan = 100;

let arahHadap = "kanan";

let waktuSebelumnya = 0;


// =================================
// MENGATUR UKURAN GAME
// =================================

function aturUkuranGame() {

    const skalaX = jendela.clientWidth / lebarGame;
    const skalaY = jendela.clientHeight / tinggiGame;

    skalaGame = Math.min(skalaX, skalaY, 1);

    areaGame.style.transform =
        `scale(${skalaGame})`;

}


// =================================
// KAMERA FOLLOW
// =================================

function kameraFollow() {

    const tengahX = lebarGame / 2;
    const tengahY = tinggiGame / 2;

    const kameraX = tengahX - posisiX;
    const kameraY = tengahY - posisiY;

    dunia.style.transform =
        `translate3d(${kameraX}px, ${kameraY}px, 0)`;

}


// =================================
// POSISI AWAL
// =================================

karakter.style.left = posisiX + "px";
karakter.style.top = posisiY + "px";

aturUkuranGame();
kameraFollow();


// =================================
// MULAI SENTUH
// =================================

areaGame.addEventListener("pointerdown", function(e) {

    e.preventDefault();

    sedangGeser = true;

    sentuhX = e.clientX;
    sentuhY = e.clientY;

    arahX = 0;
    arahY = 0;

    waktuSebelumnya = performance.now();

    areaGame.setPointerCapture(e.pointerId);

});


// =================================
// MENENTUKAN ARAH GERAK
// =================================

areaGame.addEventListener("pointermove", function(e) {

    if (!sedangGeser) return;

    let gerakX = e.clientX - sentuhX;
    let gerakY = e.clientY - sentuhY;

    // Abaikan gerakan yang terlalu kecil
    if (Math.abs(gerakX) + Math.abs(gerakY) < 1) {
        return;
    }

    arahX = gerakX;
    arahY = gerakY;

    // ARAH HADAP

    if (gerakX < 0) {
        arahHadap = "kiri";
    }
    else if (gerakX > 0) {
        arahHadap = "kanan";
    }

    if (arahHadap === "kiri") {
        karakter.classList.add("menghadap-kiri");
    }
    else {
        karakter.classList.remove("menghadap-kiri");
    }

    sentuhX = e.clientX;
    sentuhY = e.clientY;

});


// =================================
// MESIN GERAK
// =================================

function gerakkanKarakter(waktu) {

    if (!waktuSebelumnya) {
        waktuSebelumnya = waktu;
    }

    let deltaTime = (waktu - waktuSebelumnya) / 1000;

    waktuSebelumnya = waktu;

    // Mencegah lonjakan gerakan
    deltaTime = Math.min(deltaTime, 0.05);

    if (sedangGeser) {

        let panjang = Math.sqrt(
            arahX * arahX + arahY * arahY
        );

        if (panjang > 0) {

            let normalX = arahX / panjang;
            let normalY = arahY / panjang;

            posisiX += normalX * kecepatan * deltaTime;
            posisiY += normalY * kecepatan * deltaTime;

        }

        karakter.style.left = posisiX + "px";
        karakter.style.top = posisiY + "px";

        kameraFollow();

    }

    requestAnimationFrame(gerakkanKarakter);

}

requestAnimationFrame(gerakkanKarakter);


// =================================
// BERHENTI GERAK
// =================================

function berhentiGerak() {

    sedangGeser = false;

    arahX = 0;
    arahY = 0;

}

areaGame.addEventListener("pointerup", berhentiGerak);

areaGame.addEventListener("pointercancel", berhentiGerak);


// =================================
// RESIZE LAYAR
// =================================

window.addEventListener("resize", function() {

    aturUkuranGame();
    kameraFollow();

});
