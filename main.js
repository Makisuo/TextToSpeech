
const fs = require('fs');
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const config = require("./config.json")

// Creates a client
const client = new textToSpeech.TextToSpeechClient({
  keyFilename: './apikey.json'
});
const text  = fs.readFileSync('./txt.txt', 'utf8');
console.log(text);
requestData(config.geschlecht,config.sprache);
function listVoices(){
  client
    .listVoices({})
    .then(results => {
      const voices = results[0].voices;

      console.log('Voices:');
      voices.forEach(voice => {
        console.log(`Name: ${voice.name}`);
        console.log(`  SSML Voice Gender: ${voice.ssmlGender}`);
        console.log(
          `  Natural Sample Rate Hertz: ${voice.naturalSampleRateHertz}`
        );
        console.log(`  Supported languages:`);
        voice.languageCodes.forEach(languageCode => {
          console.log(`    ${languageCode}`);
        });
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}



function setText(text) {
    const text = text;
}
// The text to synthesize

function requestData() {
  const request = {
    input: {text: text},
    // Select the language and SSML Voice Gender (optional)
    voice: {languageCode: config.sprache, ssmlGender: config.geschlecht},
    // Select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the Text-to-Speech request
  client.synthesizeSpeech(request, (err, response) => {
    if (err) {
      console.error('ERROR:', err);
      return;
    }

    // Write the binary audio content to a local file
    fs.writeFile('output.mp3', response.audioContent, 'binary', err => {
      if (err) {
        console.error('ERROR:', err);
        return;
      }
      console.log('Audio content written to file: output.mp3');
    });
  });
}
