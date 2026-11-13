
const karakter = document.querySelector(".wanitadiam");
const pria = document.querySelector(".priatinggidiam");
const anak = document.querySelector(".anaksekolahdiam");
const bocil = document.querySelector(".bocildiam");

const dunia = document.querySelector("#dunia");
const jendela = document.querySelector("#jendelageme");
const areaGame = document.querySelector("#areaGame");

const wadahWanita = document.querySelector("#karakterwanita");
const wadahPria = document.querySelector("#karaktersampingan");
const wadahAnak = document.querySelector("#karakteranak");
const wadahBocil = document.querySelector("#karakterbocil");

// =====================================
// POSISI AWAL KARAKTER
// =====================================

let posisiX = 1000;
let posisiY = 1000;

let priaX = 1200;
let priaY = 800;

let anakX = 900;
let anakY = 1000;

let bocilX = 1100;
let bocilY = 1100;

// =====================================
// PENGATURAN GERAK WANITA
// =====================================

let sentuhX = 0;
let sentuhY = 0;

let sedangGeser = false;

let arahX = 0;
let arahY = 0;

let kecepatan = 100;

let arahTerakhirX = 1;
let arahTerakhirY = 0;

// =====================================
// STATUS PENGIKUT
// =====================================

let priaMengikuti = false;
let anakMengikuti = false;
let bocilMengikuti = false;

let arahHadapPria = "kanan";
let arahHadapAnak = "kanan";
let arahHadapBocil = "kanan";

// Jarak sentuhan antar karakter

const jarakSentuhPria = 110;
const jarakSentuhAnak = 60;
const jarakSentuhBocil = 60;

// Jarak formasi pengikut

const jarakFormasi = 75;
const geserSamping = 55;

// Kehalusan gerakan pengikut

const kehalusanIkut = 2;

// =====================================
// KAMERA DAN WAKTU
// =====================================

let waktuSebelumnya = 0;
let skalaGame = 1;

// =====================================
// POSISI KARAKTER KE HTML
// =====================================

function aturPosisiKarakter() {

    karakter.style.left = posisiX + "px";
    karakter.style.top = posisiY + "px";

    pria.style.left = priaX + "px";
    pria.style.top = priaY + "px";

    anak.style.left = anakX + "px";
    anak.style.top = anakY + "px";

    bocil.style.left = bocilX + "px";
    bocil.style.top = bocilY + "px";
}

// =====================================
// SISTEM Y-SORTING OTOMATIS
// =====================================

function aturUrutanLapisan() {

    const objek = [
        {
            elemen: wadahWanita,
            posisiY: posisiY
        },
        {
            elemen: wadahPria,
            posisiY: priaY
        },
        {
            elemen: wadahAnak,
            posisiY: anakY
        },
        {
            elemen: wadahBocil,
            posisiY: bocilY
        }
    ];

    objek.sort((a, b) => a.posisiY - b.posisiY);

    objek.forEach((objek, index) => {
        objek.elemen.style.zIndex = index + 2;
    });
}

// =====================================
// UKURAN GAME
// =====================================

function aturUkuranGame() {

    const lebar = jendela.clientWidth;
    const tinggi = jendela.clientHeight;

    skalaGame = Math.min(
        lebar / 420,
        tinggi / 844,
        1
    );

    areaGame.style.transform = `scale(${skalaGame})`;

    kameraFollow();
}

window.addEventListener("resize", aturUkuranGame);

// =====================================
// KAMERA MENGIKUTI WANITA
// =====================================

function kameraFollow() {

    const tengahX = 420 / 2;
    const tengahY = 844 / 2;

    const kameraX = tengahX - posisiX;
    const kameraY = tengahY - posisiY;

    dunia.style.transform =
        `translate(${kameraX}px, ${kameraY}px)`;
}

// =====================================
// MENGATUR ARAH HADAP WANITA
// =====================================

function aturArahWanita(gerakX) {

    if (gerakX < 0) {
        karakter.classList.add("menghadap-kiri");
    } else if (gerakX > 0) {
        karakter.classList.remove("menghadap-kiri");
    }
}

// =====================================
// KONTROL GERAK WANITA
// =====================================

areaGame.addEventListener("pointerdown", function(e) {

    e.preventDefault();

    sedangGeser = true;

    sentuhX = e.clientX;
    sentuhY = e.clientY;

    arahX = 0;
    arahY = 0;

    areaGame.setPointerCapture(e.pointerId);
});

areaGame.addEventListener("pointermove", function(e) {

    if (!sedangGeser) return;

    e.preventDefault();

    const gerakX = (e.clientX - sentuhX) / skalaGame;
    const gerakY = (e.clientY - sentuhY) / skalaGame;

    if (gerakX !== 0 || gerakY !== 0) {

        arahX = gerakX;
        arahY = gerakY;

        karakter.classList.add("berjalan");

        const panjangArah = Math.sqrt(
            gerakX * gerakX + gerakY * gerakY
        );

        if (panjangArah > 0) {

            arahTerakhirX = gerakX / panjangArah;
            arahTerakhirY = gerakY / panjangArah;
        }

        aturArahWanita(gerakX);
    }

    sentuhX = e.clientX;
    sentuhY = e.clientY;
});

function berhentiMenggeser() {

    sedangGeser = false;

    arahX = 0;
    arahY = 0;

    karakter.classList.remove("berjalan");
}

areaGame.addEventListener("pointerup", berhentiMenggeser);
areaGame.addEventListener("pointercancel", berhentiMenggeser);
areaGame.addEventListener("lostpointercapture", berhentiMenggeser);

// =====================================
// MENGHITUNG JARAK ANTAR KARAKTER
// =====================================

function hitungJarak(x1, y1, x2, y2) {

    const dx = x2 - x1;
    const dy = y2 - y1;

    return Math.sqrt(dx * dx + dy * dy);
}

// =====================================
// DETEKSI SENTUHAN WANITA DAN PRIA
// =====================================

function cekSentuhanPria() {

    if (priaMengikuti) return;

    const jarak = hitungJarak(
        posisiX,
        posisiY,
        priaX,
        priaY
    );

    if (jarak <= jarakSentuhPria) {
        priaMengikuti = true;
    }
}

// =====================================
// DETEKSI SENTUHAN WANITA DAN ANAK
// =====================================

function cekSentuhanAnak() {

    if (anakMengikuti) return;

    const jarak = hitungJarak(
        posisiX,
        posisiY,
        anakX,
        anakY
    );

    if (jarak <= jarakSentuhAnak) {
        anakMengikuti = true;
    }
}

// =====================================
// DETEKSI SENTUHAN WANITA DAN BOCIL
// =====================================

function cekSentuhanBocil() {

    if (bocilMengikuti) return;

    const jarak = hitungJarak(
        posisiX,
        posisiY,
        bocilX,
        bocilY
    );

    if (jarak <= jarakSentuhBocil) {
        bocilMengikuti = true;
    }
}

// =====================================
// MENGHITUNG POSISI DI BELAKANG WANITA
// =====================================

function hitungPosisiBelakang(depanX, depanY, jarak, sisi) {

    const belakangX = -arahTerakhirX;
    const belakangY = -arahTerakhirY;

    const sampingX = -belakangY;
    const sampingY = belakangX;

    return {
        x: depanX + belakangX * jarak + sampingX * sisi,
        y: depanY + belakangY * jarak + sampingY * sisi
    };
}

// =====================================
// MENGATUR ARAH HADAP PENGIKUT
// =====================================

function aturArahPengikut(karakterPengikut, dx) {

    if (dx < -0.5) {
        karakterPengikut.classList.add("menghadap-kiri");
    } else if (dx > 0.5) {
        karakterPengikut.classList.remove("menghadap-kiri");
    }
}

// =====================================
// GERAK PRIA MENGIKUTI WANITA
// =====================================

function gerakkanPria(deltaTime) {

    if (!priaMengikuti) return;

    const target = hitungPosisiBelakang(
        posisiX,
        posisiY,
        jarakFormasi,
        geserSamping
    );

    const dx = target.x - priaX;
    const dy = target.y - priaY;

    const jarak = Math.sqrt(dx * dx + dy * dy);

    const faktorHalus =
        1 - Math.exp(-kehalusanIkut * deltaTime);

    priaX += dx * faktorHalus;
    priaY += dy * faktorHalus;

    if (jarak > 1) {

        pria.classList.add("berjalan");
        aturArahPengikut(pria, dx);

    } else {

        pria.classList.remove("berjalan");
    }
}

// =====================================
// GERAK ANAK MENGIKUTI WANITA
// =====================================

function gerakkanAnak(deltaTime) {

    if (!anakMengikuti) return;

    const target = hitungPosisiBelakang(
        posisiX,
        posisiY,
        jarakFormasi,
        -geserSamping
    );

    const dx = target.x - anakX;
    const dy = target.y - anakY;

    const jarak = Math.sqrt(dx * dx + dy * dy);

    const faktorHalus =
        1 - Math.exp(-kehalusanIkut * deltaTime);

    anakX += dx * faktorHalus;
    anakY += dy * faktorHalus;

    if (jarak > 1) {

        anak.classList.add("berjalan");
        aturArahPengikut(anak, dx);

    } else {

        anak.classList.remove("berjalan");
    }
}

// =====================================
// GERAK BOCIL MENGIKUTI WANITA
// =====================================

function gerakkanBocil(deltaTime) {

    if (!bocilMengikuti) return;

    const target = hitungPosisiBelakang(
        posisiX,
        posisiY,
        jarakFormasi,
        0
    );

    const dx = target.x - bocilX;
    const dy = target.y - bocilY;

    const jarak = Math.sqrt(dx * dx + dy * dy);

    const faktorHalus =
        1 - Math.exp(-kehalusanIkut * deltaTime);

    bocilX += dx * faktorHalus;
    bocilY += dy * faktorHalus;

    if (jarak > 1) {

        bocil.classList.add("berjalan");
        aturArahPengikut(bocil, dx);

    } else {

        bocil.classList.remove("berjalan");
    }
}

// =====================================
// LOOP UTAMA GAME
// =====================================

function gameLoop(waktuSekarang) {

    if (!waktuSebelumnya) {
        waktuSebelumnya = waktuSekarang;
    }

    let deltaTime =
        Math.min((waktuSekarang - waktuSebelumnya) / 1000, 0.05);

    waktuSebelumnya = waktuSekarang;

    // Gerakan wanita tetap 100 px per detik

    if (sedangGeser && (arahX !== 0 || arahY !== 0)) {

        const panjangArah = Math.sqrt(
            arahX * arahX + arahY * arahY
        );

        if (panjangArah > 0) {

            const normalX = arahX / panjangArah;
            const normalY = arahY / panjangArah;

            posisiX += normalX * kecepatan * deltaTime;
            posisiY += normalY * kecepatan * deltaTime;
        }
    }

    // Periksa sentuhan wanita dengan masing-masing karakter

    cekSentuhanPria();
    cekSentuhanAnak();
    cekSentuhanBocil();

    // Pengikut bergerak otomatis setelah tersentuh

    gerakkanPria(deltaTime);
    gerakkanAnak(deltaTime);
    gerakkanBocil(deltaTime);

    // Perbarui posisi seluruh karakter

    aturPosisiKarakter();

    // Atur urutan lapisan berdasarkan posisi Y

    aturUrutanLapisan();

    // Kamera hanya mengikuti wanita

    kameraFollow();

    requestAnimationFrame(gameLoop);
}

// =====================================
// MULAI GAME
// =====================================

aturPosisiKarakter();
aturUrutanLapisan();
aturUkuranGame();

requestAnimationFrame(gameLoop);
