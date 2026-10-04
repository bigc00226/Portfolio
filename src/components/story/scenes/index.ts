import type { ComponentType } from "react";

import type { StoryChapterId } from "@/data/story";

import { Abroad } from "./Abroad";
import { Birth } from "./Birth";
import { Career } from "./Career";
import { Coding } from "./Coding";
import { Design } from "./Design";
import { Freelance } from "./Freelance";
import { Lessons } from "./Lessons";
import { Loved } from "./Loved";
import { Office } from "./Office";
import { Project } from "./Project";
import { Todo } from "./Todo";
import { Wedding } from "./Wedding";

/** 章の id と、その章の絵との対応。 */
export const scenes: Record<StoryChapterId, ComponentType> = {
  office: Office,
  project: Project,
  wedding: Wedding,
  birth: Birth,
  lessons: Lessons,
  design: Design,
  coding: Coding,
  todo: Todo,
  abroad: Abroad,
  career: Career,
  freelance: Freelance,
  loved: Loved,
};
