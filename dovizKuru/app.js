//ELEMENTLER
const baslikwraper = document.querySelector(".baslik-wrapper");
const baslik = document.querySelector(".baslik-wrapper h1");
const kurlarWrapper = document.querySelector(".kurlar-wrapper");


const myUrl = "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_CUwI8bqFLPgYHxj72GvyenxsaR71PsZ6DQwX1txw";

events();
(async () => {
     let veriler = await dovizKurlariVeriCek(myUrl); // Promise'i çöz
     verileriYazdir(veriler);
})();

function events() {
     document.addEventListener("DOMContentLoaded", baslikSiraliYazi);
}

//Başlığın harflerini tek tek ekrana basmak için
function baslikSiraliYazi() {
     let dizi = Array.from(baslik.textContent);
     baslik.textContent = "";

     for (let element = 0; element < dizi.length; element++) {
          setTimeout(() => {
               let renk = rastgeleRenkSec();
               baslik.style.color = renk;
               baslik.textContent += dizi[element];
          }, element * 250);
     }
}

//her harf basıldığında başlığa rastgele renk seç
function rastgeleRenkSec() {
     let r = Math.random() * 255;
     let g = Math.random() * 255;
     let b = Math.random() * 255;

     let renk = `rgb(${r},${g},${b})`;
     return renk;
}

async function dovizKurlariVeriCek(url) {
     let veriler = await (await fetch(url)).json();
     return veriler;
}


function verileriYazdir(veriler) {
     let kurVerileri = Object.entries(veriler.data).map(([kurAdi, kurDegeri]) => ({
          kurAdi,
          kurDegeri
      }));
     let onceBunlariYazdir = ["TRY", "USD", "EUR", "RUB"];

     let oncelikliIndexler = onceBunlariYazdir
          .map(kurAdi => kurVerileri.findIndex(kur => kur.kurAdi === kurAdi))
          .filter(index => index !== -1);


     for (let index = 0; index < oncelikliIndexler.length; index++) {
          let kurAdi = kurVerileri[oncelikliIndexler[index]].kurAdi;
          let kurDegeri = kurVerileri[oncelikliIndexler[index]].kurDegeri;
          icerik(kurAdi, kurDegeri, veriler);
     }

     for (let index = 0; index < kurVerileri.length; index++) {
          if (!oncelikliIndexler.includes(index)) {
               let kurAdi = kurVerileri[index].kurAdi;
               let kurDegeri = kurVerileri[index].kurDegeri;
               icerik(kurAdi, kurDegeri, veriler);
          }
     }
}



function icerik(kurAdi, kurDegeri, veriler) {

     const icerekWrapper = document.createElement("div");
     icerekWrapper.className = "icerik";

     const kurAdiP = document.createElement("p");
     kurAdiP.id = "kurAdi";
     kurAdiP.textContent = kurAdi;

     const kurDegeriInput = document.createElement("input");
     kurDegeriInput.id = "kurDegeri";
     kurDegeriInput.type = "text";
     kurDegeriInput.value = kurDegeri;
     kurDegeriInput.addEventListener("focus", ()=>{
          kurDegeriInput.value = "";
     })
     kurDegeriInput.addEventListener("keyup", (e) =>{
          dovizKurlariCevir(e, kurDegeri, veriler);
     });

     icerekWrapper.appendChild(kurAdiP);
     icerekWrapper.appendChild(kurDegeriInput);
     kurlarWrapper.appendChild(icerekWrapper);

     return kurlarWrapper;
}

function dovizKurlariCevir(e, kurDegeri, veriler) {
     let deger = e.target.value;
 
     if (deger === "" || isNaN(deger)) return;
 
     let oran = parseFloat(deger) / kurDegeri; 

     // Sayfadaki mevcut inputları bul ve sadece değerlerini güncelle
     document.querySelectorAll(".icerik input").forEach(input => {
         let kurAdi = input.previousElementSibling.textContent;
         if (veriler.data[kurAdi]) {
             input.value = (oran * veriler.data[kurAdi]);
         }
     });
 }

 function degerleriYerlestir(veriler, deger) {
     let yeniVeriler = JSON.parse(JSON.stringify(veriler)); // Orijinal veriyi değiştirmemek için kopyala
     yeniVeriler.data.USD = parseFloat(deger) || 0;
     kurlarWrapper.innerHTML = ""; 
     verileriYazdir(yeniVeriler);
}