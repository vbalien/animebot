import { Bot, Context } from "grammy";
import {
  createLanguageModel,
  createProgramTranslator,
  evaluateJsonProgram,
  getData,
} from "typechat";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { AnimationTimetableProvider, Weekday } from "./BotActionsSchema";
import {
  TimetableItem,
  fetchAnissia,
  fetchDAnimeStore,
  fetchLaftel,
} from "./api";

dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN!);
const model = createLanguageModel(process.env);
const schema = fs.readFileSync(
  path.join(import.meta.dir, "BotActionsSchema.ts"),
  "utf8"
);
const translator = createProgramTranslator(model, schema);

bot.on("message", async (ctx) => {
  if (ctx.message.text) {
    await ctx.replyWithChatAction("typing");
    const response = await translator.translate(ctx.message.text);
    if (!response.success) {
      await ctx.reply("translate error!");
      console.log(response.message);
      return;
    }
    const program = response.data;
    console.log(
      getData(translator.validator.createModuleTextFromJson(program))
    );

    await evaluateJsonProgram(program, async (func, args) => {
      return await handleCall(func, args, ctx);
    });
  }
});

async function handleCall(
  func: string,
  args: any[],
  ctx: Context
): Promise<unknown> {
  console.log(func, args);
  if (func === "deltaToDayKind") {
    return deltaToWeekday(args[0]);
  } else if (func === "printAnimationTimetable") {
    return printAnimationTimetable(args[0], args[1], ctx);
  } else if (func === "unknownAction") {
    return ctx.reply(`Text not understood in this context: ${args[0]}`);
  }
  return;
}

function deltaToWeekday(delta: number): Weekday {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + delta);
  const dayIndex = currentDate.getDay();
  const weekdays: Weekday[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekday = weekdays[dayIndex];
  return weekday;
}

async function printAnimationTimetable(
  day: Weekday,
  provider: AnimationTimetableProvider = "Laftel",
  ctx: Context
) {
  let timetable: TimetableItem[] | null = null;
  if (provider === "Laftel") timetable = await fetchLaftel(day);
  if (provider === "Anissia") timetable = await fetchAnissia(day);
  if (provider === "dAnime") timetable = await fetchDAnimeStore(day);

  ctx.reply(
    `${day} | ${provider}\n` + timetable?.map((x) => x.title).join("\n") ?? ""
  );
  return;
}

bot.start();
