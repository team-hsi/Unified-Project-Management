"use server";
import { Label, LabelPayload } from "@/feature/shared/@types/label";
import { get } from "../../../core/api-client";
import { extractErrors } from "@/lib/utils";
import { ProjectPayload } from "@/feature/shared/@types/projects";
import { CACHE_LIFE, CACHE_TAGS } from "../../../core/cache-config";
import { Milestone } from "@/feature/shared/@types/milestone";

export const getAll = async () => {
  try {
    return await get<Label[]>(`/labels/milestones/getAll`);
  } catch (error) {
    console.error("Error fetching all labels", error);
    throw new Error(extractErrors(error));
  }
};

export const getMilestoneById = async (payload: Pick<LabelPayload, "id">) => {
  try {
    return await get<Label>(`/labels/milestones/${payload.id}`);
  } catch (error) {
    console.error("Error fetching label by id", error);
    throw new Error(extractErrors(error));
  }
};

export const getProjectMilestone = async (
  payload: Pick<ProjectPayload, "id">
) => {
  const { id } = payload;
  try {
    return await get<Milestone[]>(`/projects/${id}/milestones`, {
      next: {
        revalidate: CACHE_LIFE.MINUTE,
        tags: [CACHE_TAGS.PROJECT.MILESTONES(id)],
      },
      cache: "no-store",
    });
  } catch (error) {
    console.error(`Error fetching project ${id} labels:`, error);
    throw new Error(extractErrors(error));
  }
};
