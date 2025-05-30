"use server";
import { Label, LabelPayload } from "@/feature/shared/@types/label";
import { get } from "../../../core/api-client";
import { extractErrors } from "@/lib/utils";
import { ProjectPayload } from "@/feature/shared/@types/projects";
import { CACHE_LIFE, CACHE_TAGS } from "../../../core/cache-config";

export const getAllLabels = async () => {
  try {
    return await get<Label[]>(`/labels/getAll`);
  } catch (error) {
    console.error("Error fetching all labels", error);
    throw new Error(extractErrors(error));
  }
};

export const getLabelById = async (payload: Pick<LabelPayload, "id">) => {
  try {
    return await get<Label>(`/labels/${payload.id}`);
  } catch (error) {
    console.error("Error fetching label by id", error);
    throw new Error(extractErrors(error));
  }
};

export const getProjectLabels = async (payload: Pick<ProjectPayload, "id">) => {
  const { id } = payload;
  try {
    return await get<Label[]>(`/projects/${id}/labels`, {
      next: {
        revalidate: CACHE_LIFE.MINUTE,
        tags: [CACHE_TAGS.PROJECT.LABELS(id)],
      },
      cache: "no-cache",
    });
  } catch (error) {
    console.error(`Error fetching project ${id} labels:`, error);
    throw new Error(extractErrors(error));
  }
};
