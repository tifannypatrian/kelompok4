const Telebot = require("telebot");
const bot = new Telebot("6243585290:AAEPj1kEPL-rD1oCs8yWCiFiNHXmhYRY6Yo");

const questions = [
  {
    question: "Hewan apa yang jago nyanyi?",
    answer: "Sing....a",
  },
  {
    question: "Ada bebek 10 di kali 2 jadi berapa?",
    answer: "8, yang 2 kan main di kali",
  },
  {
    question: "Hewan apa yang suka kebersihan?",
    answer: "Gajah, gajahlah kebersihan",
  },
  {
    question: "Kenapa anak kodok suka loncat - loncat?",
    answer: "Biasalah, namanya juga anak-anak. Suka iseng",
  },
  {
    question: "Apa nama hewan yang memiliki leher terpanjang di dunia?",
    answer: "Jerapah",
  },
  {
    question:
      "Apa nama hewan yang terkenal dengan kemampuannya berenang balik hingga ke kutub utara dan selatan?",
    answer: "Anjing laut",
  },
  {
    question: "Apa nama hewan yang dapat berubah warna kulitnya?",
    answer: "Kadal",
  },
  {
    question: "Apa nama hewan yang dapat melihat dalam kegelapan total?",
    answer: "Kelelawar",
  },
  {
    question:
      "Apa nama hewan yang terkenal dengan tanduknya yang besar dan bergelombang?",
    answer: "Rusa",
  },
  {
    question: "Apa nama hewan yang memiliki kulit yang bersisik?",
    answer: "Ular",
  },
];

// Function to handle start command
bot.on(["/start", "/help"], (msg) => {
  return msg.reply.text(
    "Selamat datang di bot /kelompok 4.\nBot yang kami buat adalah tebak tebakan soal hewan.\nJika kamu mau memainkan game nya kamu bisa \ntekan /game atau kamu ketik /game. \ncara mainnya kamu hanya harus menjawab pertanyaan saja. silahkan menikmati botnya !!!"
  );
});
bot.on("/kelompok", (msg) => {
  return msg.reply.text(
    "anggota kelompok \n1. Tifanny Patriane Andari \n2. Alivia sabrina \n3. Muhammad Lutfi Arizki \n4. Roiza Nur Ikwan"
  );
});

bot.on("/game", (msg) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;

  bot
    .sendMessage(chatId, "Jawab pertanyaan ini untuk memulai:")
    .then((sent) => {
      // Simpan status game dalam metadata pesan
      const metadata = {
        score: 0,
        currentQuestion: null,
        attempts: 0,
        answeredQuestions: 0, // Tambahkan variabel untuk menghitung jumlah pertanyaan yang sudah dijawab
      };
      getRandomQuestion();

      function getRandomQuestion() {
        metadata.currentQuestion = Math.floor(Math.random() * questions.length);
        bot
          .sendMessage(chatId, questions[metadata.currentQuestion].question)
          .then((sent) => {
            // Simpan ID pesan ke metadata untuk diedit nanti
            metadata.messageId = sent.message_id;
            // Simpan metadata pada message
            sent.meta = { game: metadata };
          })
          .catch((error) => {
            console.error(error);
          });
      }

      // Dengarkan input pengguna
      bot.on("text", onAnswer);

      function onAnswer(msg) {
        // Periksa apakah pesan yang dikirim adalah respon dari pertanyaan ini
        if (msg.chat.id === chatId && metadata.currentQuestion !== null) {
          if (msg.text.toLowerCase() === questions[metadata.currentQuestion].answer.toLowerCase()
          ) {
            metadata.score += 1;
          } else {
            bot.sendMessage(
              chatId,
              `jawaban anda Salah seharusnya "${
                questions[metadata.currentQuestion].answer
              }".`
            );
          }
          metadata.answeredQuestions += 1;
          if (metadata.answeredQuestions >= 5) {
            // Jika sudah menjawab 5 pertanyaan
            let nilai = metadata.score * 20;
            bot.sendMessage(
              chatId,
              `Anda sudah menjawab 5 pertanyaan. Skor Anda: ${nilai}`
            );
            bot.cleanEvent("text", onAnswer);
          } else {
            getRandomQuestion();
          }
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

if (require.main === module) {
  bot.start();
}
