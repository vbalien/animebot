import { Weekday } from "./BotActionsSchema";

export type TimetableItem = {
  title: string;
};

export async function fetchLaftel(day: Weekday): Promise<TimetableItem[]> {
  const DAY_MAP: Record<Weekday, string> = {
    Mon: "월요일",
    Tue: "화요일",
    Wed: "수요일",
    Thu: "목요일",
    Fri: "금요일",
    Sat: "토요일",
    Sun: "일요일",
  };
  const url = "https://laftel.net/api/search/v2/daily/";
  const res = await fetch(url);
  const data: any[] = await res.json();
  return data
    .filter((item) => item.distributed_air_time === DAY_MAP[day])
    .map((x) => ({ title: x.name }));
}

export async function fetchDAnimeStore(day: Weekday): Promise<TimetableItem[]> {
  const url =
    "https://animestore.docomo.ne.jp/animestore/rest/WS000118?cours=202304&includeOthersFlag=1&tvProgramFlag=1&vodTypeList=svod_tvod&_=202310241043";
  const res = await fetch(url);
  const {
    data: { workList: data },
  }: { data: { workList: any[] } } = await res.json();
  return data
    .filter((item) => item.workInfo.workWeek === day.toLocaleLowerCase())
    .map((x) => ({ title: x.workInfo.workTitle }));
}

export async function fetchAnissia(day: Weekday): Promise<TimetableItem[]> {
  const DAY_MAP: Record<Weekday, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 0,
  };
  const url = "https://api.anissia.net/anime/schedule/" + DAY_MAP[day];
  const res = await fetch(url);
  const { data }: { data: any[] } = await res.json();
  const result = data.map((item) => ({
    title: item.subject,
  }));
  return result;
}
