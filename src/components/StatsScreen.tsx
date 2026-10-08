import { useMemo, useState } from 'react';
import type { KanaScript } from '../data/kana';
import { KATAKANA_WORDS } from '../data/katakanaWords';
import { localizedMeaning } from '../data/translations';
import { WORDS, type Word } from '../data/words';
import { useI18n } from '../i18n';
import {
  accuracy,
  hardestLetters,
  hardestWords,
  tallyByMode,
  totalTally,
  type Tally,
} from '../lib/insights';
import type { Lifetime, StatsMap } from '../lib/storage';
import { readingFor } from '../lib/study';
import { ScriptSwitch } from './ScriptSwitch';

interface StatsScreenProps {
  stats: StatsMap;
  lifetime: Lifetime;
  currentStreak: number;
  initialScript: KanaScript;
}

const WORDS_BY_KANA = new Map<string, Word>([...WORDS, ...KATAKANA_WORDS].map((word) => [word.kana, word]));

export function StatsScreen({ stats, lifetime, currentStreak, initialScript }: StatsScreenProps) {
  const { language, messages } = useI18n();
  const [script, setScript] = useState(initialScript);
  const total = useMemo(() => totalTally(stats), [stats]);
  const byMode = useMemo(() => tallyByMode(stats, script), [stats, script]);
  const letters = useMemo(() => hardestLetters(stats, script), [stats, script]);
  const words = useMemo(() => hardestWords(stats, script), [stats, script]);

  const tiles = [
    { icon: '🎯', label: messages.roundsLabel, value: String(lifetime.roundsCompleted) },
    { icon: '🔥', label: messages.bestStreak, value: messages.days(Math.max(lifetime.bestStreak, currentStreak)) },
    { icon: '✍️', label: messages.answersLabel, value: String(total.answers) },
    { icon: '✅', label: messages.accuracyLabel, value: total.answers > 0 ? `${accuracy(total)}%` : '—' },
  ];

  return (
    <section>
      <div className="card">
        <h2>{messages.totalsTitle}</h2>
        <div className="stat-tiles stat-tiles--spaced">
          {tiles.map((tile) => (
            <div className="stat-tile" key={tile.label}>
              <span className="stat-icon" aria-hidden="true">{tile.icon}</span>
              <div>
                <p className="stat-label">{tile.label}</p>
                <p className="stat-value">{tile.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ScriptSwitch value={script} onChange={setScript} />

      <div className="card">
        <h2>{messages.accuracyByMode}</h2>
        <ModeAccuracy label={messages.read} tally={byMode.read} />
        <ModeAccuracy label={messages.write} tally={byMode.write} />
      </div>

      <div className="card">
        <h2>{messages.hardestLetters}</h2>
        <p className="section-summary">{messages.hardestLettersHint}</p>
        {letters.length === 0 ? (
          <p className="empty-note">{messages.notEnoughData}</p>
        ) : (
          <ul className="letter-grid">
            {letters.map((letter) => (
              <li className="letter-tile" key={letter.kana}>
                <span className="letter-tile-kana ja">{letter.kana}</span>
                <span className="letter-tile-rate">{messages.errorRate(letter.errorRate)}</span>
                <span className="letter-tile-bar" aria-hidden="true">
                  <span style={{ width: `${letter.errorRate}%` }} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h2>{messages.hardestWords}</h2>
        {words.length === 0 ? (
          <p className="empty-note">{messages.notEnoughData}</p>
        ) : (
          <ul className="difficulty-list">
            {words.map((entry) => {
              const word = WORDS_BY_KANA.get(entry.kana);
              return (
                <li key={entry.kana}>
                  <span className="difficulty-word">
                    <span className="ja">{entry.kana}</span>
                    {' · '}{readingFor(word ?? { kana: entry.kana, es: '' })}
                    {word && ` · ${localizedMeaning(word, language)}`}
                  </span>
                  <span className="difficulty-count">{messages.missedOf(entry.missed, entry.seen)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function ModeAccuracy({ label, tally }: { label: string; tally: Tally }) {
  const { messages } = useI18n();
  const percent = accuracy(tally);
  return (
    <div className="mode-accuracy">
      <div className="progress-row">
        <span className="mode-accuracy-label">{label}</span>
        <span>{tally.answers > 0 ? `${percent}%` : messages.noAnswersYet}</span>
      </div>
      <div className="progress-track progress-track--compact">
        <div className="progress-fill progress-fill--ok" style={{ width: `${percent}%` }} />
      </div>
      {tally.answers > 0 && <p className="hint">{messages.answersCount(tally.answers)}</p>}
    </div>
  );
}
