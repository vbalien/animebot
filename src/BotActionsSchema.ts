// This is a schema for writing a chatbot program.

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

// Laftel = 라프텔
// Anissia = 애니시아
// dAnime = d아니메스토어
export type AnimationTimetableProvider = "Laftel" | "Anissia" | "dAnime";

export type API = {
  // Convert delta values based on today to Weekday
  deltaToWeekday(delta: number): Weekday;

  // Print the anime schedule.
  printAnimationTimetable(
    // Which days of the week to get
    weekday: Weekday,
    // Animation schedule provider
    provider?: AnimationTimetableProvider
  ): void;

  // call this function for requests that weren't understood
  unknownAction(text: string): void;
};
