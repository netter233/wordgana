import type { KanaScript } from './kana';
import type { Word } from './words';

/** `kana`: letras sueltas de las filas activas; `words`: vocabulario; `sentences`: oraciones avanzadas. */
export type PracticeKind = 'kana' | 'words' | 'sentences';

export const HIRAGANA_SENTENCES: Word[] = [
  { kana: 'わたしは がくせいです。', romaji: 'watashi wa gakusei desu', es: 'Soy estudiante.' },
  { kana: 'みずを のみます。', romaji: 'mizu o nomimasu', es: 'Tomo agua.' },
  { kana: 'きょうは いい てんきです。', romaji: 'kyou wa ii tenki desu', es: 'Hoy hace buen tiempo.' },
  { kana: 'あした がっこうへ いきます。', romaji: 'ashita gakkou e ikimasu', es: 'Mañana voy a la escuela.' },
  { kana: 'この ねこは かわいいです。', romaji: 'kono neko wa kawaii desu', es: 'Este gato es lindo.' },
  { kana: 'まいにち ほんを よみます。', romaji: 'mainichi hon o yomimasu', es: 'Leo un libro todos los días.' },
  { kana: 'えきで ともだちに あいます。', romaji: 'eki de tomodachi ni aimasu', es: 'Me encuentro con un amigo en la estación.' },
  { kana: 'おちゃが すきです。', romaji: 'ocha ga suki desu', es: 'Me gusta el té.' },
  { kana: 'あの みせは やすいです。', romaji: 'ano mise wa yasui desu', es: 'Esa tienda es barata.' },
  { kana: 'はやく おきました。', romaji: 'hayaku okimashita', es: 'Me levanté temprano.' },
  { kana: 'いっしょに かえりましょう。', romaji: 'issho ni kaerimashou', es: 'Volvamos juntos.' },
  { kana: 'そこに くるまが あります。', romaji: 'soko ni kuruma ga arimasu', es: 'Hay un auto ahí.' },
  { kana: 'わたしの いえは えきの ちかくです。', romaji: 'watashi no ie wa eki no chikaku desu', es: 'Mi casa está cerca de la estación.' },
  { kana: 'きのう えいがを みました。', romaji: 'kinou eiga o mimashita', es: 'Ayer vi una película.' },
  { kana: 'にちようびに やすみます。', romaji: 'nichiyoubi ni yasumimasu', es: 'Descanso el domingo.' },

  // Compras y konbini: pedir, preguntar precios y responder en la caja.
  { kana: 'これを ひとつ ください。', romaji: 'kore o hitotsu kudasai', es: 'Uno de estos, por favor.' },
  { kana: 'これは いくらですか。', romaji: 'kore wa ikura desu ka', es: '¿Cuánto cuesta esto?' },
  { kana: 'ふくろは いりません。', romaji: 'fukuro wa irimasen', es: 'No necesito bolsa.' },
  { kana: 'あたためて ください。', romaji: 'atatamete kudasai', es: 'Calentá esto, por favor.' },

  // Restaurantes: pedir y pagar.
  { kana: 'ふたりです。', romaji: 'futari desu', es: 'Somos dos personas.' },
  { kana: 'おみずを ください。', romaji: 'omizu o kudasai', es: 'Agua, por favor.' },
  { kana: 'おすすめは なんですか。', romaji: 'osusume wa nan desu ka', es: '¿Qué me recomienda?' },
  { kana: 'おかいけいを おねがいします。', romaji: 'okaikei o onegai shimasu', es: 'La cuenta, por favor.' },

  // Estación y alojamiento.
  { kana: 'えきは どこですか。', romaji: 'eki wa doko desu ka', es: '¿Dónde está la estación?' },
  { kana: 'きっぷを かいたいです。', romaji: 'kippu o kaitai desu', es: 'Quiero comprar un boleto.' },
  { kana: 'よやくして います。', romaji: 'yoyaku shite imasu', es: 'Tengo una reserva.' },
  { kana: 'にもつを あずけても いいですか。', romaji: 'nimotsu o azuketemo ii desu ka', es: '¿Puedo dejar el equipaje?' },

  // Paseos, recuerdos y comunicación.
  { kana: 'しゃしんを とっても いいですか。', romaji: 'shashin o tottemo ii desu ka', es: '¿Puedo sacar una foto?' },
  { kana: 'おみやげは どこですか。', romaji: 'omiyage wa doko desu ka', es: '¿Dónde están los recuerdos?' },
  { kana: 'もう いちど おねがいします。', romaji: 'mou ichido onegai shimasu', es: 'Una vez más, por favor.' },
  { kana: 'ゆっくり はなして ください。', romaji: 'yukkuri hanashite kudasai', es: 'Hable despacio, por favor.' },
];

/** En estas oraciones el katakana convive con el hiragana gramatical, como en japonés real. */
export const KATAKANA_SENTENCES: Word[] = [
  { kana: 'コーヒーを のみます。', romaji: 'koohii o nomimasu', es: 'Tomo café.' },
  { kana: 'スーパーで パンを かいます。', romaji: 'suupaa de pan o kaimasu', es: 'Compro pan en el supermercado.' },
  { kana: 'ホテルは えきの ちかくです。', romaji: 'hoteru wa eki no chikaku desu', es: 'El hotel está cerca de la estación.' },
  { kana: 'タクシーで ホテルへ いきます。', romaji: 'takushii de hoteru e ikimasu', es: 'Voy al hotel en taxi.' },
  { kana: 'サッカーが すきです。', romaji: 'sakkaa ga suki desu', es: 'Me gusta el fútbol.' },
  { kana: 'テレビで ニュースを みます。', romaji: 'terebi de nyuusu o mimasu', es: 'Veo las noticias en televisión.' },
  { kana: 'レストランで カレーを たべます。', romaji: 'resutoran de karee o tabemasu', es: 'Como curry en un restaurante.' },
  { kana: 'コンビニは まいにち あいています。', romaji: 'konbini wa mainichi aiteimasu', es: 'La tienda está abierta todos los días.' },
  { kana: 'アニメを ともだちと みます。', romaji: 'anime o tomodachi to mimasu', es: 'Veo anime con un amigo.' },
  { kana: 'ギターを まいにち れんしゅうします。', romaji: 'gitaa o mainichi renshuu shimasu', es: 'Practico guitarra todos los días.' },
  { kana: 'この ケーキは おいしいです。', romaji: 'kono keeki wa oishii desu', es: 'Esta torta es rica.' },
  { kana: 'バスは くじに きます。', romaji: 'basu wa kuji ni kimasu', es: 'El colectivo llega a las nueve.' },
  { kana: 'パソコンで メールを かきます。', romaji: 'pasokon de meeru o kakimasu', es: 'Escribo un correo en la computadora.' },
  { kana: 'あたらしい スマホを かいました。', romaji: 'atarashii sumaho o kaimashita', es: 'Compré un celular nuevo.' },
  { kana: 'テニスを いっしょに しましょう。', romaji: 'tenisu o issho ni shimashou', es: 'Juguemos al tenis juntos.' },

  // Nombres reales en kana: Karaage-kun es de Lawson; Famichiki, de FamilyMart.
  // ファ (fa) usa una combinación fuera de las filas básicas, con lectura explícita.
  { kana: 'からあげクン レギュラーを ひとつ ください。', romaji: 'karaagekun regyuraa o hitotsu kudasai', es: 'Un Karaage-kun clásico, por favor.' },
  { kana: 'からあげクン レッドを ひとつ ください。', romaji: 'karaagekun reddo o hitotsu kudasai', es: 'Un Karaage-kun picante, por favor.' },
  { kana: 'ファミチキを ひとつ ください。', romaji: 'famichiki o hitotsu kudasai', es: 'Un Famichiki, por favor.' },
  { kana: 'レシートを ください。', romaji: 'reshiito o kudasai', es: 'El recibo, por favor.' },
  { kana: 'カードで はらえますか。', romaji: 'kaado de haraemasu ka', es: '¿Puedo pagar con tarjeta?' },

  // Cafeterías y restaurantes.
  { kana: 'メニューを ください。', romaji: 'menyuu o kudasai', es: 'El menú, por favor.' },
  { kana: 'ホットコーヒーを ください。', romaji: 'hotto koohii o kudasai', es: 'Un café caliente, por favor.' },
  { kana: 'テイクアウトで おねがいします。', romaji: 'teikuauto de onegai shimasu', es: 'Para llevar, por favor.' },

  // Transporte y alojamiento.
  { kana: 'この バスは くうこうへ いきますか。', romaji: 'kono basu wa kuukou e ikimasu ka', es: '¿Este colectivo va al aeropuerto?' },
  { kana: 'タクシーのりばは どこですか。', romaji: 'takushii noriba wa doko desu ka', es: '¿Dónde está la parada de taxis?' },
  { kana: 'この ホテルまで おねがいします。', romaji: 'kono hoteru made onegai shimasu', es: 'Hasta este hotel, por favor.' },
  { kana: 'チェックインを おねがいします。', romaji: 'chekkuin o onegai shimasu', es: 'Quisiera hacer el check-in.' },
  { kana: 'チェックアウトは なんじですか。', romaji: 'chekkuauto wa nanji desu ka', es: '¿A qué hora es el check-out?' },

  // Servicios y lugares para visitar.
  { kana: 'トイレは どこですか。', romaji: 'toire wa doko desu ka', es: '¿Dónde está el baño?' },
  { kana: 'コインロッカーは どこですか。', romaji: 'koin rokkaa wa doko desu ka', es: '¿Dónde están los lockers?' },
  { kana: 'チケットを にまい ください。', romaji: 'chiketto o nimai kudasai', es: 'Dos entradas, por favor.' },
];

export function sentencesForScript(script: KanaScript): Word[] {
  return script === 'hiragana' ? HIRAGANA_SENTENCES : KATAKANA_SENTENCES;
}
