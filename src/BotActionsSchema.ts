// This is a schema for writing a chatbot program.

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

// Anissia = 애니시아
// Laftel = 라프텔
// dAnime = d아니메스토어
export type AnimationTimetableProvider = "Anissia" | "Laftel" | "dAnime";

export type API = {
  // Convert delta values based on today to Weekday
  deltaToDayKind(delta: number): Weekday;

  // Print the anime schedule.
  printAnimationTimetable(
    // Which days of the week to get
    weekday: Weekday,
    // Animation schedule provider (default: Laftel)
    provider?: AnimationTimetableProvider
  ): void;

  // call this function for requests that weren't understood
  unknownAction(text: string): void;
};
