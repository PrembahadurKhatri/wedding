"use client";

import { useEffect, useState } from "react";
import { weddingDetails } from "@/data/wedding";

const countdownUnits = [
  { key: "days", label: "DAYS", seconds: 86_400 },
  { key: "hours", label: "HOURS", seconds: 3_600 },
  { key: "minutes", label: "MINUTES", seconds: 60 },
  { key: "seconds", label: "SECONDS", seconds: 1 },
] as const;

function getTargetTimestamp() {
  const { gregorianDate, time, utcOffset } = weddingDetails.countdown;
  return new Date(`${gregorianDate}T${time}:00${utcOffset}`).getTime();
}

function getCountdownParts(now: number) {
  let secondsRemaining = Math.max(0, Math.floor((getTargetTimestamp() - now) / 1000));

  return countdownUnits.map((unit) => {
    const value = Math.floor(secondsRemaining / unit.seconds);
    secondsRemaining %= unit.seconds;
    return { ...unit, value };
  });
}

export default function WeddingCountdown() {
  const [now, setNow] = useState<number | null>(null);
  const targetTimestamp = getTargetTimestamp();
  const isComplete = now !== null && now >= targetTimestamp;
  const countdown = now === null ? null : getCountdownParts(now);

  useEffect(() => {
    const updateTime = () => setNow(Date.now());
    updateTime();
    const intervalId = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      aria-labelledby="countdown-title"
      className="countdown section-pad"
      id="countdown"
    >
      <div className="countdown__inner">
        <h2 className="countdown__title" id="countdown-title">
          COUNTDOWN TO THE WEDDING
        </h2>
        <span className="countdown__ornament" aria-hidden="true">✦</span>

        {isComplete ? (
          <p className="countdown__complete" role="status">
            A BEAUTIFUL FOREVER HAS BEGUN
          </p>
        ) : (
          <>
            <div
              aria-label="Time remaining until the first confirmed wedding event"
              aria-live="off"
              className="countdown__units"
              role="timer"
            >
              {(countdown ?? countdownUnits.map((unit) => ({ ...unit, value: null }))).map((unit) => {
                const displayValue = unit.value === null ? "--" : String(unit.value).padStart(2, "0");

                return (
                  <div className="countdown__unit" key={unit.key}>
                    <span aria-hidden="true" className="countdown__number" key={`${unit.key}-${displayValue}`}>
                      {displayValue}
                    </span>
                    <span className="countdown__unit-label">{unit.label}</span>
                    {unit.value !== null && (
                      <span className="visually-hidden">
                        {unit.value} {unit.key}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
