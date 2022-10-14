const word = document.getElementById("word");
const wordDplay = document.getElementById("wordDisplay");

let words = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur pariatur veniam architecto dolorum quod impedit nam rem harum deleniti. Molestias assumenda repellat minus maxime nemo eos modi ducimus ipsam deleniti?";

//Tehdään sanarimpsusta array, poistetaan erikoismerkit ja muutetaan isot kirjaimet pieniksi
words = words.toLowerCase().replace(/[^a-öA-Ö0-9 ]/g, "");
let wordsArray = words.split(" ");
wordsArray = [...new Set(wordsArray)];

//Luodaan prototyyppi sample funktiolle, joka kutsuttaessa arpoo arraysta satunnaisen sanan
Array.prototype.sample = function(){
	return this[Math.floor(Math.random()*this.length)];
}

//Laitetaan ensimmäinen sana näkyville, tämän voisi myös toki laittaa vasta tallennuksen aloitettua...
word.innerHTML = wordsArray.sample();


//Vaihtaa näkyvillä olevan sanan mikäli tallennus on aloitettu
wordDplay.addEventListener("click", () => {
	if (recording)
		word.innerHTML = wordsArray.sample();
});

