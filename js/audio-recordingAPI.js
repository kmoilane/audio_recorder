//API käsittelemään audion tallentamista
let audioRecorder = {

	audioBlobs: [],
	mediaRecorder: null,
	streamBeingCaptured: null,

	//Aloittaa tallennuksen ja palauttaa lupauksen mikäli tallennus alkaa onnistuneesti
	start: () => {
		//Tarkistaa tukeeko selain mediaDevices API:tä
		if (!(navigator.mediaDevices &&
		navigator.mediaDevices.getUserMedia)) {
			return Promise.reject(new Error("mediaDevices API or getUserMedia method is not supported in this browser."))
		}
		else {
			//Selain tukee ominaisuutta joten luodaan audio streami
			return navigator.mediaDevices.getUserMedia({ audio: true })
				.then(stream => {

					//Tallennetaan viittaus streamiin, jotta voidaan pysäyttää se halutessamme
					audioRecorder.streamBeingCaptured = stream;

					//Luodaan media recorder instanssi syöttämällä streami MediaRecorder constructorille
					audioRecorder.mediaRecorder = new MediaRecorder(stream);

					//Poistetaan aikaisemmat tallennetut audio Blobit jos sellaisia on
					audioRecorder.audioBlobs = [];

					//Lisätään "dataavailable" event listener jotta voidaan säilöä audio data Blobsit tallennuksen aikana
					audioRecorder.mediaRecorder.ondataavailable = (e) => {
						//Säilö audio Blob objektit
						audioRecorder.audioBlobs.push(e.data);
					};

					//Aloita tallennus kutsumalla media recorderin start metodia
					audioRecorder.mediaRecorder.start();
				})
		}
	},

	//Pysäyttää tallennuksen ja palauttaa lupauksen tallenteesta blob tiedostona
	stop: () => {


		return new Promise(resolve => {

			let mimeType = audioRecorder.mediaRecorder.mimeType;
			//Kuuntele stop eventtiä jotta voidaan luoda ja palauttaa yksi blob objekti
			audioRecorder.mediaRecorder.addEventListener("stop", () => {
				let audioBlob = new Blob(audioRecorder.audioBlobs, { type : mimeType });

				//Ratkaise lupaus yhdellä audioblobilla joka edustaa tallennetta
				resolve(audioBlob);
			});

			audioRecorder.cancel();
		});
	},

	//Peruuttaa tallennuksen
	cancel: () => {

		audioRecorder.mediaRecorder.stop();

		audioRecorder.stopStream();

		audioRecorder.resetRecordingProperties();
	},

	stopStream: () => {
		audioRecorder.streamBeingCaptured.getTracks()
			.forEach(track => track.stop());
	},

	resetRecordingProperties: () => {
		audioRecorder.mediaRecorder = null;
		audioRecorder.streamBeingCaptured = null;
	},
}

