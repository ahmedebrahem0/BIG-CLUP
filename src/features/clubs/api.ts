import type { Club, ClubFormValues } from "./types";

export const defaultClubFormValues: ClubFormValues = {
  name: "",
};

export function mapClubToFormValues(club: Club | null): ClubFormValues {
  if (!club) {
    return defaultClubFormValues;
  }

  return {
    name: club.name,
  };
}
